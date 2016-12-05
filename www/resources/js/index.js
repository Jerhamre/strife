window.onresize = onWindowResize;


function onWindowResize(event) {	
	var w = window.innerWidth;
	var sidebarW = document.getElementById('sidebar').offsetWidth;
	var sidebarSendW = document.getElementById('send').offsetWidth;
	document.getElementById('chat').style.width = (w - sidebarW) + 'px';
	document.getElementById('input').style.width = (w - sidebarW) + 'px';
	document.getElementById('message').style.width = (w - sidebarW - sidebarSendW) + 'px';
};

window.onload = function getDataOnLoad(){
	friendList()
	roomsList()

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
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="pic"></a>'
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
				text += '<div class="invite">';
				text += 	'<div class="button accept" onclick="respondToFriendRequest(' + result[i]['users'][0] + ', ' +  result[i]['users'][1] + ', ' + 1 + ')">A</div>';
				text += 	'<div class="button decline" onclick="respondToFriendRequest(' + result[i]['users'][0] + ', ' + result[i]['users'][1] + ', ' + 0 + ')">D</div>';
				text += '</div>';
				text += '</div>'
				console.log()
			}
			//friends
			for(var i = 0; i < result.length; i++) {
				if(result[i]['invite'] != 0)
					continue;
				text += '<div class="friend">'
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="pic"></a>'
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
				text += '</div>'
			}

			//pending
			for(var i = 0; i < result.length; i++) {
				if(result[i]['invite'] != -1)
					continue;
				text += '<div class="friend">'
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="pic"></a>'
				text += '<a href="/chat/' + result[i]['chatid'] + '" class="title">'+ result[i]['fname']+' '+result[i]['lname'] + '</a>';
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
				text += '<div class="pic"></div>'
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
	console.log(window.location.href);

	var queryString = (window.location.href).substr((window.location.href).indexOf('/room/') + 1);
	var room = decodeURIComponent(queryString);
	console.log(room);
	var json = {
			"method": "postToChat",
			"data": [{"iduser": room, "message": document.getElementById('message').value}],
		}
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