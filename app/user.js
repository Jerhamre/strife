var crypto = require('crypto')

function User(db) {
	this.db = db;
};

User.prototype.login = function(email, password) {

	var sql = 'SELECT * FROM users WHERE email=?;'
	/*
	var rs = this.db.query(sql, [email])
	console.log(rs)

	// hash password and compare

	*/
};

User.prototype.register = function(email, fname, lname, password) {
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	console.log(sql)
	console.log(hash)

	this.db.query(sql, [email, fname, lname, hash, salt])
};

module.exports.User = User