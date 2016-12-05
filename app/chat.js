var db = null;
var api = null;

function Chat(db_in, api_in) {
	db = db_in;
	api = api_in;
};

Chat.prototype.loadChat = function(chatid, res){
	
	var sql = 'SELECT * FROM chat_has_message WHERE chat_idchat =? ORDER BY message_idmessage DESC LIMIT 20'
	console.log(sql)

	function callback(err, result){
		var message_id = JSON.parse(result);

		var message_idmessage = [];
		for(var i = 0; i < message_id.length; i++){
			message_idmessage.push(message_id[i]['message_idmessage'])
			
		}

		loadMessage(message_idmessage, res);
	}


	db.query(callback, sql, [chatid])
}


function loadMessage(message_idmessage, res){
	var sql = 'SELECT * FROM message WHERE idmessage IN (?);'

	function callback(err, result){

		var response = []
		result = JSON.parse(result)
		for (var i = 0; i < result.length; i++) {
			var jsonrow = {'message':result[i]['message']}
			response.push(jsonrow)
			console.log(jsonrow) 
				

		}

        res.send(JSON.stringify(response));  
	}


	db.query(callback, sql, [message_idmessage])
}


Chat.prototype.postToChat = function(data, idusers, res){
	var sql = 'INSERT INTO message (message, iduser) VALUES (?,?);'	
	console.log(sql)
	console.log("performing query in post chat")
	console.log(data[0]['message'])
	console.log(idusers)
	var message = data[0]['message'];

	function callback(err, result){
		console.log("---callback---")
		result = JSON.parse(result)
		console.log('INSERT ID: '+result['insertId'])
		console.log('IDUSER: '+idusers)
		addmessageToChat(idusers,result['insertId'],res)
	}


	db.query(callback, sql, [message, idusers])
}

function addmessageToChat(chat_idchat, message_idmessage, res){
	console.log("---------------addmessageToChat---------------------")
	var sql = 'INSERT INTO chat_has_message (chat_idchat, message_idmessage) VALUES (?,?);'
	console.log(sql)
	console.log("chat_idchat:" + chat_idchat + " message_idmessage: "+ message_idmessage)
	
	function callback(err, result){
		console.log(result)
		
	}


	db.query(callback, sql, [chat_idchat, message_idmessage])
}


module.exports.Chat = Chat