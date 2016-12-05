

var db = null;
var api = null;

function Room(db_in, server_in, api_in) {
	db = db_in;
	api = api_in;
};

Room.prototype.getRooms = function(session, res) {

	var sql = "SELECT * FROM users_has_room WHERE users_idusers=?"

	var retval = []

	console.log(sql)


	var callback = function(err, result) {

		result = JSON.parse(result)

		rooms = []

		for (var i = 0; i < result.length; i++) {
			rooms.push(result[i]['room_idroom'])
		}

		if (rooms.length == 0) {
			return;
		}

		console.log("rooms")
		console.log(rooms)

		var sql = "SELECT * FROM room WHERE idroom IN (?);"

		var callback = function(err, result) {

			result = JSON.parse(result)
			console.log("result.length")
			console.log(result.length)

			for (var i = 0; i < result.length; i++) {
				var retjson = {'idchat': result[i]['chat_idchat'], 'room_name': result[i]['room_name']}
				retval.push(retjson)
			}

			console.log("retval")
			console.log(retval)

        	res.send(JSON.stringify(retval))
		}

		db.query(callback, sql, [rooms])

	}

	db.query(callback, sql, [session.idusers])


}

module.exports.Room = Room