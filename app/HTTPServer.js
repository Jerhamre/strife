var express     = require('express')
var fs          = require('fs')
var http        = require('http')
var https       = require('https')
var path        = require('path')
var session     = require('express-session')
var bodyParser  = require('body-parser')

var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/fullchain.pem'),
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
//app.use(express.cookieParser());
//app.use(express.session({secret: 'strife12345topkekofdoom666'}));

// start server
const port=80; 

var db = null;
var user = null;

function startServer(db_in, user_in) {

    db     = db_in
    user   = user_in

    var server = https.createServer(options, app).listen(port, function(){
        console.log("Express server listening on port " + port);
    });
    /*app.listen(PORT, function () {
      console.log('Example app listening on port ' + PORT + '!')
    })*/
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function checkAuth(req, res, next) {
    if (!session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

function setSessionUserID(user_id, next_page, res) {
    session.user_id = user_id;
    res.redirect(next_page);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


app.get('/', checkAuth, function (req, res) {
    res.render('index', { temp : 'ITS OVER 9000!!!!' })
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {

    console.log(req.body)

    var email = req.body.email
    var password = req.body.password

    user.login(email, password, res)
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

    user.register(email, fname, lname, password)

    // register user
    res.redirect('/');
})

app.get('/logout', function (req, res) {
    session.user_id = undefined
    res.redirect('/');
})

app.get('/about', function (req, res) {
    res.render('about')
})

// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not Found')
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error\n ' + error)
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.post('/api', function (req, res) {
    var json = JSON.parse(req.body);

    var method = json['method'];

    if(!method)
        return;

    return 'OK';
})



module.exports.startServer = startServer
module.exports.setSessionUserID = setSessionUserID