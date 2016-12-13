

var db = null;
var api = null;
var server = null;

function Room(db_in, server_in, api_in) {
	db = db_in;
	server = server_in;
	api = api_in;
};

Room.prototype.getRooms = function(session, res) {

	var sql = "SELECT * FROM users_has_room WHERE users_idusers=?"

	var retval = []

	var callback = function(err, result) {

		result = JSON.parse(result)

		rooms = []

		for (var i = 0; i < result.length; i++) {
			rooms.push(result[i]['room_idroom'])
		}

		if (rooms.length == 0) {
			return;
		}

		var sql = "SELECT * FROM room WHERE idroom IN (?);"

		var callback = function(err, result) {

			result = JSON.parse(result)

			for (var i = 0; i < result.length; i++) {

				// get users avatar
				var avatar = ''
				fs = require('fs')
				var filepath = __dirname + '/avatars/room/' + result[i]['chat_idchat']
				if (fs.existsSync(filepath)) {
				    avatar = fs.readFileSync(filepath, 'utf-8')
				}

				var retjson = {'idchat': result[i]['chat_idchat'], 'room_name': result[i]['room_name'], 'avatar': avatar}
				retval.push(retjson)
			}

        	res.send(JSON.stringify(retval))
        	//server.sendSocketMessage(session.idusers, 'rooms', JSON.stringify(retval))
		}

		db.query(callback, sql, [rooms])

	}

	db.query(callback, sql, [session.idusers])

}

Room.prototype.joinRoom = function(data, session, res){

	var sql = 'SELECT idroom FROM room WHERE chat_idchat IN (?);'
	console.log('in joinroom')
	console.log(data)
	var idroom = data[0]['idroom'];
	console.log(idroom)
		var callback = function (err, result){

			result = JSON.parse(result)
			console.log(result[0]['idroom'])
			var room_idroom = result[0]['idroom']

			var sql = 'INSERT INTO users_has_room (users_idusers, room_idroom) VALUES (?, ?);'

			var callback = function (err, result){
				server.sendSocketMessage([session.idusers], 'joinRoom', null)
	
			}

			db.query(callback, sql, [session.idusers,room_idroom])
			
		}

	db.query(callback, sql, [idroom])
}

Room.prototype.createRoom = function(data, session, res){

	var sql = 'INSERT INTO chat VALUES ();'
	var room_name = data[0]['room_name']
		var callback = function (err, result){

			result = JSON.parse(result)
			console.log(result)
			var chat_idchat = result['insertId']
			var sql = 'INSERT INTO room (chat_idchat, room_name) VALUES (?,?);'

			var callback = function (err, result){

				console.log(result)
				result = JSON.parse(result)
				console.log(result['inserId'])
				var room_idroom = result['insertId']

				var sql = 'INSERT INTO users_has_room (users_idusers, room_idroom) VALUES (?, ?);'

				var callback = function (err, result){
					server.sendSocketMessage([session.idusers], 'joinRoom', null)
		
				}

				db.query(callback, sql, [session.idusers,room_idroom])
				
			}

			db.query(callback, sql, [chat_idchat,room_name])
		}
	db.query(callback, sql, [])
}

module.exports.Room = Room