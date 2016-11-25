var crypto = require('crypto')

var db = null;

function User(db_in) {
	db = db_in;
};

User.prototype.login = function(email, password, user_session) {

	var sql = 'SELECT * FROM users WHERE email=?;'	

	var callback = function(err, result) {

		console.log("this is in User-Login")
        console.log('err:', err);
        console.log('json:', result);

        result = JSON.parse(result)[0];

        console.log(result);
        console.log(result['salt']);

        var salt = result['salt'];

        console.log('salt: ' + salt);
        console.log('password input: ' + password);

		var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

		console.log('hash: ' + hash);
		console.log('pass: ' + result['password']);

		if(hash == result['password'])
			user_session.user_id = 1;
    };

	db.query(callback, sql, [email])

};



User.prototype.register = function(email, fname, lname, password) {
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	db.query(sql, [email, fname, lname, hash, salt])
};

module.exports.User = User