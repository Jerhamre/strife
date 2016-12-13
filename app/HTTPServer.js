var secret          = 'testtopkek321123'
var express         = require('express')
var fs              = require('fs')
var http            = require('http')
var https           = require('https')
var path            = require('path')
var Session         = require('express-session')
var bodyParser      = require('body-parser')
var ios             = require('socket.io-express-session')
var SessionStore    = require('session-file-store')(Session);
//store: new SessionStore({path: __dirname+'/tmp/sessions'}), 
var session         = Session({secret: secret, resave: true, saveUninitialized: true});
var multer          = require('multer')
var upload          = multer({ dest: __dirname + '\\avatars' })
var fs              = require('fs');
var sharp           = require('sharp')

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/chain.pem')
};

var app = express()

// app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/../www')));
app.set('views', path.join(__dirname, '/../www'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(session)

// start server
const port=80; 
const portSSL=443;
var io
var clients = {}

var db = null;
var user = null;
var api = null;

function startServer(db_in, user_in, api_in) {

    db     = db_in
    user   = user_in
    api    = api_in

    /* legacy backup
    http.createServer(app).listen(port, function(){
        console.log("Express HTTP server listening on port " + port);
    });*/
    
    var server = http.createServer(app);
    server.listen(port); // start listening on server

    var serverHTTPS = https.createServer(options, app)
    serverHTTPS.listen(portSSL) // start listening on secure server

    io = require('socket.io')(serverHTTPS);
    io.use(ios(session));
    io.sockets.on('connection', function (socket) {
        if(socket.handshake.session.idusers != null) {
            console.info('New client connected (idusers=' + socket.handshake.session.idusers +', id=' + socket.id + ')')
            clients[socket.handshake.session.idusers] = socket

            // When socket disconnects, remove it from the list
            socket.on('disconnect', function() {
                console.info('Client disconnected (id=' + socket.id + ')')
                delete clients[socket.handshake.session.idusers]
            });
        }
    });
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

//[array of idusers], type of message (socketIO on function), json
function sendSocketMessage(ids, type, message) {
    console.log('sendSocketMessage: type: '+ type)
    console.log('sendSocketMessage: type: '+ ids)
    
    if(ids == null) {
        var keys = Object.keys(clients)
        for(var i = 0; i < keys.length; i++) {
            if(clients[keys[i]]) {
                clients[keys[i]].emit(type, message);
            }
        }
    } else {
        for(var i = 0; i < ids.length; i++) {
            if(clients[ids[i]]) {
                clients[ids[i]].emit(type, message);
            }
        }
    }
}

function checkAuth(req, res, next) {
    if (!req.session.idusers) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.use(function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
})

app.get('/', checkAuth, function (req, res) {
    req.session.test = 'test'
    res.render('index', { temp : 'ITS OVER 9000!!!!' })
})

app.get('/room/:idroom', checkAuth, function (req, res) {
    //req.params.idroom
    res.render('index', { idroom : req.params.idroom })
})

app.get('/room/:idroom/:nav', checkAuth, function (req, res) {
    //req.params.idroom
    res.render('index', { idroom : req.params.idroom, nav : req.params.nav })
})

app.get('/friend/:idchat', checkAuth, function (req, res) {
    //req.params.idchat
    res.render('index', { idchat : req.params.idchat })
})

app.get('/friend/:idchat/:nav', checkAuth, function (req, res) {
    //req.params.idchat
    res.render('index', { idchat : req.params.idchat, nav : req.params.nav })
})

app.get('/settings', checkAuth, function (req, res) {
    res.render('index')
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {

    var email = req.body.email
    var password = req.body.password

    req.session.test2 = "derp"
    user.login(email, password, req.session, res)
})

app.get('/register', function (req, res) {
    res.render('register')
})

app.post('/register', function (req, res) {

    var email = req.body.email
    var fname = req.body.fname
    var lname = req.body.lname
    var password = req.body.password
    var confirmpassword = req.body.confirmpassword

    // control so that email is email

    if (password != confirmpassword)
        res.redirect('/register');

    user.register(email, fname, lname, password, res)
})

app.get('/logout', function (req, res) {
    req.session.destroy()
    session.idusers = null
    res.redirect('/');
})

app.get('/about', function (req, res) {
    res.render('about')
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*  {
    "method": "getFriends",
    "data": []
    }                                   
*/

app.post('/api', function (req, res) {
    api.handleRequest(req.body, res, req.session)
})


app.post('/avatar', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    if(!(req.body.type == 'room' || req.body.type == 'user')) {
        res.send()
        return console.log('avatar category is not room||user')
    }

    if(req.body.type == 'room') {
        if(req.body.roomid == null) {
            res.send()
            return console.log('avatar roomid is null')
        }
    }

    var filepath = __dirname + '/avatars/' + req.body.type + '/'
    if(req.body.type == 'room') {
        filepath += req.body.roomid
    }
    if(req.body.type == 'user') {
        filepath += req.session.idusers
    }

    /*fs.readFile(req.file.path, 'base64', function (err,data) {
        if (err) {
            res.send()
            return console.log(err)
        } else {

            

            fs.writeFile(filepath, data, function(err) {
                if(err) {
                    return console.log(err)
                }
            })
            fs.unlink(req.file.path)

            sendSocketMessage(null, 'avatarUpdated', null)
        }
    });*/
    console.log("AVATAR CROP")

    sharp(req.file.path)
        .raw()
        .resize(40, 40)
        .min()
        .toFile(filepath, function(err) {
            // output.jpg is a 200 pixels wide and 200 pixels high image
            // containing a scaled and cropped version of input.jpg
            fs.unlink(req.file.path)
            sendSocketMessage(null, 'avatarUpdated', null)
            console.log("AVATAR CROPED")
        });

    res.send()
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not Found')
});

// Handle 500
app.use(function(error, req, res, next) {
    console.log('500: Internal Server Error\n ' + error)
    res.status(500).send('500: Internal Server Error\n ' + error)
});


module.exports.startServer = startServer
module.exports.sendSocketMessage = sendSocketMessage