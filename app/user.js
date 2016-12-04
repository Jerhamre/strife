var crypto = require('crypto')

var db = null;
var server = null;
var api = null;

function User(db_in, server_in, api_in) {
	db = db_in;
	server = server_in;
	api = api_in;
};

User.prototype.login = function(email, password, res) {

	var sql = 'SELECT * FROM users WHERE email=?;'	

	var callback = function(err, result) {

		console.log("Login")

        var user = JSON.parse(result)[0];

        if(typeof user === 'undefined' || !user) {
			server.setSessionUserID(null, '/login', res)
			return
        }

        var salt = user['salt'];

		var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

		console.log('hash: ' + hash);
		console.log('pass: ' + user['password']);

		if(hash == user['password']) {
			server.setSessionUserID(user['idusers'], '/', res)
		} else {
			server.setSessionUserID(null, '/login', res)
		}

		return
    };

	db.query(callback, sql, [email])

};



User.prototype.register = function(email, fname, lname, password, res) {
	
	var salt = crypto.randomBytes(64).toString('base64');
	var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

	var sql = 'INSERT INTO users (email, fname, lname, password, salt) VALUES (?, ?, ?, ?, ?);'

	var callback = function (err, result) {

		var sql = 'SELECT * FROM users WHERE email=? AND password=?'

		var callback = function(err, result) {

			result = JSON.parse(result)

			idusers = result[0]['idusers']
			if (idusers == null || idusers == '') {
				server.setSessionUserID(null, '/', res)
			} else {
				server.setSessionUserID(idusers, '/', res)
			}
		}

		db.query(callback, sql, [email, hash])

	}
	
	db.query(callback, sql, [email, fname, lname, hash, salt])

};

User.prototype.getFriends = function(idusers, res) {

	var sql = 'SELECT * FROM users_has_users WHERE users_idusers=?;'
	console.log("-------------INSIDE-GET-FRIENDS--------------")
	console.log("getFriends")
	console.log(sql)

	var callback = function(err, result) {
		console.log(result)
		var listoffriends = JSON.parse(result);


		// legacy code
		//for(i = 0; i < listoffriends.length; i++){
		//	var friend = listoffriends[i];
		//	console.log(friend);
		//	console.log(friend['users_idusers1']);
   		//	getFriendsName(friend['users_idusers1'], friend['chat_idchat'], res)
		//}
		//


		var idusers = "";
		var chat_id = "";
		for (var i = 0; i < listoffriends.length; i++) {
			
			if(i == listoffriends.length-1) {
				idusers += listoffriends[i]['users_idusers1']
				chat_id += listoffriends[i]['chat_idchat']
			} else {
				idusers += listoffriends[i]['users_idusers1'] + ', '
				chat_id += listoffriends[i]['chat_idchat'] + ', '
			}

		}

		if(listoffriends.length == 0){
			console.log("you do not have any friends :(")
			res.send(JSON.stringify("you do not have any friends :("))
			return;
		}

		getFriendsName(idusers, chat_id, res)


    };

	db.query(callback, sql, [idusers])
};

function getFriendsName(idusers, chatid,res) {

	var sql = 'SELECT * FROM users WHERE idusers IN (?);'
	console.log("-------------INSIDE-GET-FRIENDS-NAME-------------")
	console.log("getFriends")
	console.log(sql)

	var callback = function(err, result) {
		var response = []
		result = JSON.parse(result)
		for (var i = 0; i < result.length; i++) {
			var jsonrow = {'fname':result[i]['fname'] ,'lname':result[i]['lname'], 'chatid':chatid[i]}
			response.push(jsonrow) 
				

		}

        res.send(JSON.stringify(response));    
    };

	db.query(callback, sql, [idusers])
};

module.exports.User = User






