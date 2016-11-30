

var db = null;
var server = null;
var api = null;

function Room(db_in, server_in, api_in) {
	db = db_in;
	server = server_in;
	api = api_in;
};

Room.prototype.getRooms = function(usersid) {

	console.log(usersid)

}

module.exports.Room = Room