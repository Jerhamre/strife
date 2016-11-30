var user = null;
var room = null;

function Api(user_in, room_in) {
	user = user_in;
	room = room_in;
};


Api.prototype.handleRequest = function(req, res, session) {

	console.log(req)

	var method = req['method']

	if (method == null || method == '')
		res.send('bad json request')

	if (method == 'getRooms') {
		console.log('getRooms')
		room.getRooms(session, res)
	}


	if (method == 'getFriends') {
		console.log('in api: getFriends')
		user.getFriends(session.user_id, res)
	}


}


module.exports.Api = Api