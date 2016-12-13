

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
				var filepath = __dirname + '\\avatars\\room\\' + result[i]['chat_idchat']
				if (fs.existsSync(filepath)) {
				    avatar = fs.readFileSync(filepath, 'utf-8')
				}

				var retjson = {'idchat': result[i]['chat_idchat'], 'room_name': result[i]['room_name'], 'avatar': avatar}
				retval.push(retjson)
			}

        	//res.send(JSON.stringify(retval))
        	server.sendSocketMessage(session.idusers, 'rooms', JSON.stringify(retval))
		}

		db.query(callback, sql, [rooms])

	}

	db.query(callback, sql, [session.idusers])

}

Room.prototype.joinRoom = function(session, data, res){
	var sql = 'SELECT idroom FROM room WHERE chat_idchat IN (?);'
	
		var callback = function (err, result){

			result = JSON.parse(result)
			var room_idroom = result[0]['idroom']

			var sql = 'INTO users_has_room (users_idusers, room_idroom) VALUES (?, ?);'

			var callback = function (err, result){

				getRooms(session, res)
				

			}

			db.query(callback, sql, [session.idusers,room_idroom])
			
		}

	db.query(callback, sql, [data['idroom']])
}

module.exports.Room = Room