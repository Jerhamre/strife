

var db = null;
var api = null;

function Room(db_in, server_in, api_in) {
	db = db_in;
	api = api_in;
};

Room.prototype.getRooms = function(session) {

	var sql = "SELECT * FROM users_has_room WHERE users_idusers=?"


	var callback = function(err, result) {

		result = JSON.parse(result)

		console.log(result)

		for (var i = 0; i < result.length; i++) {
			

			console.log(result[0]['room_idroom'])


		}

	}

	db.query(callback, sql, [session.idusers])


}

module.exports.Room = Room