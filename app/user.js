var crypto = require('crypto')

var db = null;
var server = null;
var api = null;

function User(db_in, server_in, api_in) {
	db = db_in;
	server = server_in;
	api = api_in;
};

User.prototype.login = function(email, password, session, res) {

	var sql = 'SELECT * FROM users WHERE email=?;'	

	var callback = function(err, result) {

        var user = JSON.parse(result)[0];

        if(typeof user === 'undefined' || !user) {
			res.redirect('/login')
			return
        }

        var salt = user['salt'];

		var hash = crypto.createHmac('sha256', password).update(salt).digest('hex');

		//console.log('hash: ' + hash);
		//console.log('pass: ' + user['password']);

		if(hash == user['password']) {
			session.idusers = user['idusers']
			res.redirect('/')
		} else {
			res.redirect('/login')
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

	var sql = 'SELECT * FROM users_has_users WHERE users_idusers=? ORDER BY invite DESC;'

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


		var idusers = [];
		var chat_id = {};
		var invite = {};
		var bothusers = [];
		for (var i = 0; i < listoffriends.length; i++) {
			idusers.push(listoffriends[i]['users_idusers1'])
			chat_id[listoffriends[i]['users_idusers1']] = listoffriends[i]['chat_idchat']
			invite[listoffriends[i]['users_idusers1']] = listoffriends[i]['invite']
			bothusers.push(listoffriends[i]['users_idusers'], listoffriends[i]['users_idusers1'])
		}

		if(listoffriends.length == 0){
			console.log("you do not have any friends :(")
			res.send(JSON.stringify("you do not have any friends :("))
			return;
		}

		getFriendsName(idusers, bothusers, chat_id, invite, res)


    };

	db.query(callback, sql, [idusers])
};

function getFriendsName(idusers, bothusers, chatid, invite, res) {

	var sql = 'SELECT * FROM users WHERE idusers IN (?);'

	var callback = function(err, result) {
		var response = []
		result = JSON.parse(result)
		for (var i = 0; i < result.length; i++) {
			var jsonrow = {'fname':result[i]['fname'] ,'lname':result[i]['lname'], 'chatid':chatid[result[i]['idusers']], 'invite': invite[result[i]['idusers']], 'users': bothusers}
			response.push(jsonrow) 
				

		}

        res.send(JSON.stringify(response));    
    };

	db.query(callback, sql, [idusers])
};

User.prototype.sendFriendRequest = function(data, idusers, res) {

	var response = {'error': '', 'response': ''}

	var email = data[0]['email']

	// TODO validate email

	var sql = "SELECT * FROM users WHERE email=?"

	var callback = function(err, result) {

		var json = JSON.parse(result)

		// User not found
		if(json.length == 0) {
			response['error'] = 'User not found'
			res.send(JSON.stringify(response)); 
			return
		}

		// Cant add yourself
		if (json[0]["idusers"] == idusers) {
			response['error'] = 'You can\'t be a friend with yourself... lul'
			res.send(JSON.stringify(response)); 
			return
		}

		var sql = 'INSERT INTO chat VALUES (null);'

		var callback = function(err, result) {
			result = JSON.parse(result)

			var chatid = result['insertId']

			var sql = "INSERT INTO users_has_users (users_idusers, users_idusers1, chat_idchat, invite) VALUES (?,?,?,?);"


			var callback = function(err, result) {

				if(err) {

					var sql = 'DELETE FROM chat WHERE idchat=?;'
					db.query(null, sql, [chatid])

					response['error'] = 'There was a problem sending request...'
					res.send(JSON.stringify(response)); 
					return

				} else {

					var sql = "INSERT INTO users_has_users (users_idusers, users_idusers1, chat_idchat, invite) VALUES (?,?,?,?);"

					var callback = function(err, result) {

						if(err) {

							var sql = 'DELETE FROM users_has_users WHERE users_idusers=? AND users_idusers1=?;'
							db.query(null, sql, [idusers, json[0]["idusers"]])

							response['error'] = 'There was a problem sending request...'
						} else {
							response['response'] = 'Friend request sent!'
						}

						server.sendSocketMessage([json[0]["idusers"], idusers], 'sendFriendRequest', null)

						res.send(JSON.stringify(response)); 
						return

					}

					db.query(callback, sql, [json[0]["idusers"], idusers, chatid, 1])
				}

		    };

			db.query(callback, sql, [idusers, json[0]["idusers"], chatid, -1])
			
	    };

	    db.query(callback, sql, [])

    };
	
	db.query(callback, sql, [email])

};

User.prototype.respondToFriendRequest = function(data, res) {

	data = data[0]

	// accept
	if (data['answer'] == 1) {

		var sql = 'UPDATE users_has_users SET invite=0 WHERE users_idusers=? AND users_idusers1=?'

		var callback = function(err, result) {
			var sql = 'UPDATE users_has_users SET invite=0 WHERE users_idusers=? AND users_idusers1=?'

			var callback = function(err, result) {

				server.sendSocketMessage([data['idusers'], data['idusers1']], 'respondToFriendRequest', null)

				res.send('ok'); 
			}

			db.query(callback, sql, [data['idusers'], data['idusers1']])
		}

		db.query(callback, sql, [data['idusers1'], data['idusers']])
	}

	// decline 
	if (data['answer'] == 0) {

		var sql = 'DELETE FROM users_has_users WHERE users_idusers=? AND users_idusers1=?'

		var callback = function(err, result) {

			var sql = 'DELETE FROM users_has_users WHERE users_idusers=? AND users_idusers1=?'

			var callback = function(err, result) {

				server.sendSocketMessage([data['idusers'], data['idusers1']], 'respondToFriendRequest', null)

				res.send('ok'); 
			}

			db.query(callback, sql, [data['idusers1'], data['idusers']])
		}

		db.query(callback, sql, [data['idusers'], data['idusers1']])
	}
}

User.prototype.uploadAvatar = function(idusers, data) {
	
}

module.exports.User = User






