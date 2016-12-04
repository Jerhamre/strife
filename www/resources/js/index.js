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

			for(var i = 0; i < result.length; i++) {
				text += '<a href="#" class="friend">'
				text += '<div class="pic"></div>'
				text += '<div class="title">'+ result[i]['fname']+' '+result[i]['lname']+'</div>'
				text += '</a>'
			}
    		document.getElementById("friends").innerHTML = text;
    		//
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