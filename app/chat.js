var db = null;
var api = null;

function Chat(db_in, api_in) {
	db = db_in;
	api = api_in;
};

Chat.prototype.loadChat = function(chatid, res){

	var sql = 'SELECT * FROM chat_has_message WHERE chat_idchat =? ORDER BY message_idmessage DESC LIMIT 20;'

	function callback(err, result){
		var message_id = JSON.parse(result);

		var message_idmessage = [];
		for(var i = 0; i < message_id.length; i++){
			message_idmessage.push(message_id[i]['message_idmessage'])
			
		}

		if(typeof message_idmessage !== 'undefined' && message_idmessage.length > 0){
			loadMessage(message_idmessage, res);
		}
	}


	db.query(callback, sql, [chatid[0]['idchat']])
}


function loadMessage(result, res){

	var sql = 'SELECT message.message, message.timestamp, users.fname, users.lname FROM message INNER JOIN users ON message.iduser=users.idusers  WHERE message.idmessage IN (?);'
	
	function callback(err, result){

		result = JSON.parse(result)
		var response = []

		for (var i = 0; i < result.length; i++) {
			var jsonrow = {'message':result[i]['message'],'fname':result[i]['fname'],'lname':result[i]['lname'],'timestamp':result[i]['timestamp']}
			response.push(jsonrow)
				

		}

        res.send(JSON.stringify(response));  
	}


	db.query(callback, sql, [result])
}


Chat.prototype.postToChat = function(data, idusers, res){
	var sql = 'INSERT INTO message (message, iduser) VALUES (?,?);'	
	var message = data[0]['message'];

	function callback(err, result){
		result = JSON.parse(result)
		addmessageToChat(data[0]['idchat'],result['insertId'],res)
	}


	db.query(callback, sql, [message, idusers])
}

function addmessageToChat(chat_idchat, message_idmessage, res){
	
	var sql = 'INSERT INTO chat_has_message (chat_idchat, message_idmessage) VALUES (?,?);'
	
	
	function callback(err, result){
		res.send()
	}


	db.query(callback, sql, [chat_idchat, message_idmessage])
}


module.exports.Chat = Chat