var express = require('express')
var path = require('path');
var app = express()
var session = require('express-session')

// app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/../www')));
app.set('views', path.join(__dirname, '/../www'));
//app.use(express.cookieParser());
//app.use(express.session({secret: 'strife12345topkekofdoom666'}));

// start server
const PORT=8080; 
app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT + '!')
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function checkAuth(req, res, next) {
    if (!session.user_id) {
        res.redirect('/login');
    } else {
        next();
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Handle 404
app.use(function(req, res) {
    res.status(404).send('404: Page not Found')
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send('500: Internal Server Error')
});

app.get('/', checkAuth, function (req, res) {
    res.render('index', { temp : 'ITS OVER 9000!!!!' })
})

app.get('/login', function (req, res) {
    if(req.method=='POST') {
        session.user_id = 1
        if(session.user_id) {
            res.redirect('/');
        } else {
            res.render('login')
        }
    }
    else if(req.method=='GET') {
        res.render('login')
    }
})

app.get('/register', function (req, res) {
    if(req.method=='POST') {
        // register user

        res.redirect('/');
    }
    else if(req.method=='GET') {
        res.render('register')
    }
})

app.get('/logout', function (req, res) {
    session.user_id = undefined
    res.render('logout')
})

app.get('/about', function (req, res) {
    res.render('about')
})