var crypto = require('crypto')

var db = null;
var server = null;

function User(db_in, server_in) {
	db = db_in;
	server = server_in;
};

User.prototype.login = function(email, password, res) {

	var sql = 'SELECT * FROM users WHERE email=?;'	

	var callback = function(err, result) {

		console.log("Login")

        var user = JSON.parse(result)[0];

        console.log(user)

        if(typeof user === 'undefined' || !user) {
        	console.log("length 0")
			server.setSessionUserID(null, '/login', res)
        }

        console.log("length not 0")

        var salt = user['salt'];

		var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

		console.log('hash: ' + hash);
		console.log('pass: ' + user['password']);

		if(hash == user['password']) {
			server.setSessionUserID(user['idusers'], '/', res)
		} else {
			server.setSessionUserID(null, '/login', res)
		}
    };

	db.query(callback, sql, [email])

};



User.prototype.register = function(email, fname, lname, password) {
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	db.query(sql, [email, fname, lname, hash, salt])
};

User.prototype.getFriends = function(idusers, res) {

	var sql = 'SELECT * FROM users_has_users WHERE users_idusers=?;'
	console.log("-------------INSIDE-GET-FRIENDS--------------")
	console.log("getFriends")
	console.log(sql)
	var callback = function(err, result) {

        

       
    };

	db.query(callback, sql, [idusers])

};

module.exports.User = User






