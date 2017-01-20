window.onresize = onWindowResize;


function onWindowResize(event) {	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var sidebarW = document.getElementById('sidebar').offsetWidth;
	var navBarH = document.getElementById('navBar').offsetHeight;
	document.getElementById('content').style.width = (w - sidebarW) + 'px';
	document.getElementById('content').style.height = (h - navBarH) + 'px';

	chatResize()
};

window.onload = function getDataOnLoad(){
	friendList()
	roomsList()
	displayNav() 		//nav.js
	displayContent() 	//nav.js

	initSocket()

}

function initSocket() {

    var socket = io.connect('cloud-59.skelabb.ltu.se', {secure: true})
    //var socket = io.connect('localhost')
    
    socket.on('message', function (data) {

    	// reads the url of the page to determine which chat 
		var queryString = (window.location.href).split("/").pop(-1);
		var chatid = decodeURIComponent(queryString);

		var response = JSON.parse(data)
		console.log('chatid: '+ chatid)
		console.log('response: '+ response[0['chatid']])
    	if(response[0]['chatid']==chatid){
    		console.log('chatid==chatid')
    		printMessagesToChat(data)
    	}
	});										
	socket.on('joinRoom', function (data)  {
		roomsList()			
    });
    socket.on('sendFriendRequest', function (data) {
        friendList()
    });
    socket.on('respondToFriendRequest', function (data) {
        friendList()
    });
    socket.on('avatarUpdated', function (data) {
    	console.log('avatarUpdated')
    	roomsList()
        friendList()
    });
}

function friendList(){
	// request friendlist from server and prints the response in <div> friends </div>
	var json = {
			"method": "getFriends",
			"data": [],
		}
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
    		
    		var result = JSON.parse(this.responseText)

			var text = ''

			//requests
			for(var i = 0; i < result.length; i++) {
				if(result[i]['invite'] != 1)
					continue;
				text += '<div class="friend">'
				text += '<a class="apic" href="/friend/' + result[i]['chatid'] + '">'
				if(result[i]['avatar'] != '')
					text += '<img class="pic" src="' + 'data:image/jpeg;base64,' + result[i]['avatar'] + '">'
				text += '</a>'
				text += '<a href="/friend/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
				text += '<div class="invite">';
				text += 	'<div class="button accept" onclick="respondToFriendRequest(' + result[i]['users'][0] + ', ' +  result[i]['users'][1] + ', ' + 1 + ')">A</div>';
				text += 	'<div class="button decline" onclick="respondToFriendRequest(' + result[i]['users'][0] + ', ' + result[i]['users'][1] + ', ' + 0 + ')">D</div>';
				text += '</div>';
				text += '</div>'
			}
			//friends
			for(var i = 0; i < result.length; i++) {
				if(result[i]['invite'] != 0)
					continue;
				text += '<div class="friend">'
				text += '<a class="apic" href="/friend/' + result[i]['chatid'] + '">'
				if(result[i]['avatar'] != '')
					text += '<img class="pic" src="' + 'data:image/jpeg;base64,' + result[i]['avatar'] + '">'
				text += '</a>'
				text += '<a href="/friend/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
				text += '</div>'
			}

			//pending
			for(var i = 0; i < result.length; i++) {
				if(result[i]['invite'] != -1)
					continue;
				text += '<div class="friend">'
				text += '<a class="apic" href="/friend/' + result[i]['chatid'] + '">'
				if(result[i]['avatar'] != '')
					text += '<img class="pic" src="' + 'data:image/jpeg;base64,' + result[i]['avatar'] + '">'
				text += '</a>'
				text += '<a href="/friend/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
				text += '<div class="invite">';
				text += 	'<div class="button pending">P</div>';
				text += '</div>';
				text += '</div>'
			}

    		document.getElementById("friends").innerHTML = text;
    	}
  	};
  	xhttp.open("POST", "/api");
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  	xhttp.send(JSON.stringify(json));

}

function roomsList() {
	var json = {
			"method": "getRooms",
			"data": [],
		}
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {

			/*<a href="#" class="room">
				<div class="pic"></div>
				<div class="title">M7011E</div>
			</a>*/

			var result = JSON.parse(this.responseText)

			var text = ''

			for(var i = 0; i < result.length; i++) {
				text += '<a href="/room/' + result[i]['idchat'] + '" class="room">'
				text += '<div class="apic">'
				if(result[i]['avatar'] != '')
					text += '<img class="pic" src="' + 'data:image/jpeg;base64,' + result[i]['avatar'] + '">'
				text += '</div>'
				text += '<div class="title">'+ result[i]['room_name']+'</div>'
				text += '</a>'
			}

			document.getElementById('rooms').innerHTML = text
		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))
}

function sendFriendRequest() {

	var email = $('#sendFriendRequest').val()

	if (email == "") {
		sendFriendRequestError('Please enter a valid email')
		return
	}

	var json = {
			"method": "sendFriendRequest",
			"data": [{"email": email}],
		}

	console.log(json)

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var json = JSON.parse(this.responseText)
			console.log(json)
			if (json['error'] != '') {
				sendFriendRequestError(json['error'])
			} else {
				sendFriendRequestError(json['response'])
			}
		} else {
			sendFriendRequestError('There was a problem connecting to server')
		}
		friendList()
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))

}

function sendFriendRequestError(error) {
	console.log("sendFriendRequestError")
	document.getElementById('sendFriendRequestError').innerHTML = error
}

function sendFriendRequestSuccess(message) {
	console.log("sendFriendRequestSuccess")
	document.getElementById('sendFriendRequestSuccess').innerHTML = message
}

$(document).keyup(function (e) {
    if ($("#message").is(":focus") && (e.keyCode == 13)) {
        postMessageInChat();
    }
});

function postMessageInChat() {
	console.log("postMessageInChat client side");

	var queryString = (window.location.href).split("/").pop(-1);
	var room = decodeURIComponent(queryString);
	console.log(room);
	var json = {
			"method": "postToChat",
			"data": [{"idchat": room, "message":document.getElementById('message').value }]
		}

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById('message').value = ''
		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))
}

function printChat() {
	console.log("printChat client side");

	var queryString = (window.location.href).split("/")[4];
	var room = decodeURIComponent(queryString);

	if(room==""){
		return;
	}
	var json = {
			"method": "loadChat",
			"data": [{"idchat": room}],//document.getElementById('message').value
		}

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {

		if (this.readyState == 4 && this.status == 200) {
			printMessagesToChat(this.responseText)
		}
	}
	
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))
}

function twodigits(number) {
	return ("0" + number).slice(-2);
}

function printMessagesToChat(result){

	/*
				<div class="messageContainer">
					<div class="name">Henrik Nilsson Harnert</div>
					<div class="pic"></div>
					<div class="message">
						<div class="text">Herp derp</div>
						<div class="timestamp">16:57</div>
					</div>
				</div>
				*/


	var text = ""
	result = JSON.parse(result)

	result = sortByKey(result, 'timestamp');

	for(var i = 0; i < result.length; i++) {
		var date = new Date(result[i]['timestamp'])
		var currentdate = new Date();
		var time = ''

		if( !(date.getFullYear() == currentdate.getFullYear() && date.getMonth() == currentdate.getMonth() && date.getDate() == currentdate.getDate())) {
			time = date.getFullYear() + '-' + twodigits(date.getMonth()+1) + '-' + twodigits(date.getDate()) + ' '
		}
		time += twodigits(date.getHours()) + ':' + twodigits(date.getMinutes()) + ':' + twodigits(date.getSeconds())

		text += '<div class="messageContainer">'
		text += 	'<div class="name">'+result[i]['fname']+' '+result[i]['lname']+'</div>'
		text += 	'<div class="apic">'
		if(result[i]['avatar'] != '')
			text += 	'<img class="pic" src="' + 'data:image/jpeg;base64,' + result[i]['avatar'] + '">'
		text += 	'</div>'
		text += 	'<div class="message">'
		text += 		'<div class="text">'+result[i]['message']+'</div>'
		text += 		'<div class="timestamp">'+time+'</div>'
		text += 	'</div>'
		text += '</div>'
	}

	document.getElementById('messages').innerHTML += text

	var div = document.getElementById('messages');
	div.scrollTop = div.scrollHeight - div.clientHeight;;
}


function respondToFriendRequest(iduser1, iduser2, answer) {

	var json = {
		"method": "respondToFriendRequest",
		"data": [{'idusers': iduser1, 'idusers1': iduser2, 'answer': answer}],
	}

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var json = JSON.parse(this.responseText)
			friendList()

		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))

}


function joinRoom() {

	var idroom = $('#joinRoom').val()

	if (idroom == "") {
		//sendFriendRequestError('Please enter a valid email')
		return
	}

	var json = {
			"method": "joinRoom",
			"data": [{"idroom": idroom}],
		}

	console.log(json)

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// response here


		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))

}

function createRoom() {
	console.log('running createRoom')
	var room_name = $('#createRoom').val()

	if (room_name == "") {
		//sendFriendRequestError('Please enter a valid email')
		return
	}

	var json = {
			"method": "createRoom",
			"data": [{"room_name": room_name}],
		}

	console.log(json)

	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// response here


		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))

}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
