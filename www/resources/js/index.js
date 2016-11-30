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
			var response = JSON.parse(this.responseText)
			console.log(response['fname'])
    		document.getElementById("friends").innerHTML = "";
    		document.getElementById("friends").innerHTML += '<a href="#" class="friend"><div class="pic"></div><div class="title">'+
    		response['fname']+' '+response['lname']+'</div></a>';
    		
    		
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
				text += '<a href="#" class="room">'
				text += '<div class="pic"></div>'
				text += '<div class="title">'+ result[i]['room_name']+'</div>'
				text += '</a>'
			}
			console.log(text)

			document.getElementById('rooms').innerHTML = text
		}
	}
	xhttp.open("POST", "/api")
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify(json))
}