var crypto = require('crypto')

function User(db) {
	this.db = db;
};

User.prototype.login = function() {
	
};

User.prototype.register = function(email, fname, lname, password) {
	
	var salt = crypto.randomBytes(64).toString('base64');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ' + salt + ');'

	console.log(sql)
	//this.db.query(sql, [email, fname, lname, password])
};

module.exports.User 	= User