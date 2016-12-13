var db = null;
var api = null;
var server = null;

function Chat(db_in, api_in, server_in) {
	db = db_in;
	api = api_in;
	server = server_in;
};

Chat.prototype.loadChat = function(chatid, idusers, res){

	var sql = 'SELECT * FROM chat_has_message WHERE chat_idchat =? ORDER BY message_idmessage DESC LIMIT 20;'

	function callback(err, result){
		var message_id = JSON.parse(result);

		var message_idmessage = [];
		for(var i = 0; i < message_id.length; i++){
			message_idmessage.push(message_id[i]['message_idmessage'])
			
		}

		if(typeof message_idmessage !== 'undefined' && message_idmessage.length > 0){
			loadMessage(message_idmessage,chatid[0]['idchat'], idusers, res);
		}
	}


	db.query(callback, sql, [chatid[0]['idchat']])
}


function loadMessage(result, chatid, idusers, res){

	var sql = 'SELECT message.message, message.timestamp, users.fname, users.idusers, users.lname FROM message INNER JOIN users ON message.iduser=users.idusers  WHERE message.idmessage IN (?);'
	
	function callback(err, result){

		result = JSON.parse(result)
		var response = []

		for (var i = 0; i < result.length; i++) {

			// get users avatar
			var avatar = ''
			fs = require('fs')
			var filepath = __dirname + '\\avatars\\user\\' + result[i]['idusers']
			if (fs.existsSync(filepath)) {
			    avatar = fs.readFileSync(filepath, 'utf-8')
			}

			var jsonrow = {'chatid':chatid,'message':result[i]['message'],'fname':result[i]['fname'],'lname':result[i]['lname'],'timestamp':result[i]['timestamp'], 'avatar': avatar}
			response.push(jsonrow)

		}
		//server.sendSocketMessage(idusers, 'message', response)
        res.send(JSON.stringify(response)); 
        //res.send()

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
	console.log('message_idmessage: '+message_idmessage)
	
	function callback(err, result){
		console.log('chatid in addmessageToChat: '+chat_idchat)
		console.log(result)
		getInsertedMessage(chat_idchat, message_idmessage, res)
	}

	
	db.query(callback, sql, [chat_idchat, message_idmessage])
}

function getInsertedMessage(chat_idchat, message_idmessage, res){
	//var sql = 'SELECT * FROM message WHERE idmessage IN (?);'	
	var sql = 'SELECT message.message, message.timestamp, users.fname, users.idusers, users.lname FROM message INNER JOIN users ON message.iduser=users.idusers  WHERE message.idmessage IN (?);'
	console.log(message_idmessage)
	function callback(err, result){
		result = JSON.parse(result)
		var message = []


		// get users avatar
		var avatar = ''
		fs = require('fs')
		var filepath = __dirname + '\\avatars\\user\\' + result[0]['idusers']
		if (fs.existsSync(filepath)) {
		    avatar = fs.readFileSync(filepath, 'utf-8')
		}

		message.push({'chatid':chat_idchat,'message':result[0]['message'],'fname':result[0]['fname'],'lname':result[0]['lname'],'timestamp':result[0]['timestamp'], 'avatar': avatar})
			
		console.log(result)
		getUsersInChat(chat_idchat, message, res)
	}

	db.query(callback, sql, [message_idmessage])
}


function getUsersInChat(chat_idchat, message,res){
	console.log('----------------------')
	// SELECT users_idusers FROM users_has_room INNER JOIN room ON room.idroom=users_has_room.room_idroom WHERE room.chat_idchat IN (2);
	console.log(message)
	// SELECT users_idusers FROM users_has_users WHERE chat_idchat IN (1)

	var sql = 'SELECT users_idusers FROM users_has_room INNER JOIN room ON room.idroom=users_has_room.room_idroom WHERE room.chat_idchat IN (?) UNION ALL SELECT users_idusers FROM users_has_users WHERE chat_idchat IN (?);'


	function callback(err, result){
		console.log('users in chat: '+result)
		result = JSON.parse(result)
		var users = []
		for (var i = 0; i < result.length; i++) {
			users.push(result[i]['users_idusers'])
		}

		console.log('sending response: ' + message + ' to users: '+ users)
		server.sendSocketMessage(users, 'message', JSON.stringify(message))
		res.send()
	}


	db.query(callback, sql, [chat_idchat, chat_idchat])

}


module.exports.Chat = Chat