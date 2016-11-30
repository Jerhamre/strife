var db = null;
var server = null;

function Api(db_in, server_in) {
	db = db_in;
	server = server_in;
};


Api.prototype.sendResponse = function(result, res) {

	res.send(JSON.stringify(result));

};

module.exports.Api = Api