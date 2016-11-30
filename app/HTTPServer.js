var express     = require('express')
var fs          = require('fs')
var http        = require('http')
//var https       = require('https')
var path        = require('path')
var session     = require('express-session')
var bodyParser  = require('body-parser')

/*var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/cloud-59.skelabb.ltu.se/chain.pem')
};*/

var app = express()

// app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/../www')));
app.set('views', path.join(__dirname, '/../www'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies

// start server
const port=80; 
const portSSL=443; 

var db = null;
var user = null;
var api = null;

function startServer(db_in, user_in, api_in) {

    db     = db_in
    user   = user_in
    api    = api_in

    http.createServer(app).listen(port, function(){
        console.log("Express HTTP server listening on port " + port);
    });
    /*https.createServer(options, app).listen(portSSL, function(){
        console.log("Express HTTPS server listening on port " + portSSL);
    });*/
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function checkAuth(req, res, next) {
    if (!session.idusers) {
        res.redirect('/login');
    } else {
        next();
    }
}

function setSessionUserID(idusers, next_page, res) {
    session.idusers = idusers;
    res.redirect(next_page);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*app.use(function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
})*/

app.get('/', checkAuth, function (req, res) {
    res.render('index', { temp : 'ITS OVER 9000!!!!' })
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {

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

    user.register(email, fname, lname, password, res)
})

app.get('/logout', function (req, res) {
    session.idusers = undefined
    res.redirect('/');
})

app.get('/about', function (req, res) {
    res.render('about')
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/*

{
"method": "getFriends",
"data": []
}

*/

app.post('/api', function (req, res) {


/*
    json = req.body
    console.log(req.body)
 

    console.log("api json: " + json)
    
    var method = json['method'];

    if(!method){
        return;
    }
    console.log("method: " + method)
    if(method == 'getFriends') {
        user.getFriends(session.user_id, res)
    }
    return 'OK';*/

    api.handleRequest(req.body, res, session)
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not Found')
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error\n ' + error)
});


module.exports.startServer = startServer
module.exports.setSessionUserID = setSessionUserID