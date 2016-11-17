var crypto = require('crypto')

var db = null;

function User(db_in) {
	db = db_in;
};

User.prototype.login = function(email, password) {

	var sql = 'SELECT * FROM users WHERE email=?;'
	/*
	var rs = db.query(sql, [email])
	console.log(rs)

	// hash password and compare

	*/
};

User.prototype.register = function(email, fname, lname, password) {

	console.log(email)
	console.log(fname)
	console.log(lname)
	console.log(password)
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	console.log(sql)
	console.log(hash)

	db.query(sql, [email, fname, lname, hash, salt])
};

module.exports.User = User