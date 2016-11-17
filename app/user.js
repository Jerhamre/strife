var crypto = require('crypto')

var db = null;

function User(db_in) {
	db = db_in;
};

User.prototype.login = function(email, password, user_session) {

	var sql = 'SELECT * FROM users WHERE email=?;'
	
	var rs = db.query(sql, [email])
	
	console.log(rs)

	// hash password and compare

	
};

User.prototype.register = function(email, fname, lname, password) {
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	db.query(sql, [email, fname, lname, hash, salt])
};

module.exports.User = User