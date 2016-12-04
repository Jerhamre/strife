var db = null;
var api = null;

function Chat(db_in, server_in, api_in) {
	db = db_in;
	api = api_in;
};

Chat.prototype.loadChat = function(session, res){
	// TODO: load chat
}

module.exports.Chat = Chat