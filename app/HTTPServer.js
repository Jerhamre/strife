var express = require('express')
var path = require('path');
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')

// app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/../www')));
app.set('views', path.join(__dirname, '/../www'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//app.use(express.cookieParser());
//app.use(express.session({secret: 'strife12345topkekofdoom666'}));

// start server
const PORT=8080; 

function startServer(db, user) {

    this.db     = db
    this.user   = user

    user.register("email", "fname", "lname", "password")
    this.user.register("email", "fname", "lname", "password")

    this.db.test()


    app.listen(PORT, function () {
      console.log('Example app listening on port ' + PORT + '!')
    })
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function checkAuth(req, res, next) {
    if (!session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


app.get('/', checkAuth, function (req, res) {
    res.render('index', { temp : 'ITS OVER 9000!!!!' })
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.post('/login', function (req, res) {
    var email = req.body.email
    var password = req.body.psw

    session.user_id = 1
    if(session.user_id) {
        res.redirect('/');
    } else {
        res.render('login')
    }
})

app.get('/register', function (req, res) {
    res.render('register')
})

app.post('/register', function (req, res) {
    var email = req.body.email
    var fname = req.body.fname
    var lname = req.body.lname
    var psw = req.body.psw
    var confirmpsw = req.body.confirmpsw

    if (psw != confirmpsw)
        res.redirect('/register');

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
    res.status(500).send('500: Internal Server Error')
});


module.exports.startServer = startServer