window.onresize = onWindowResize;


function onWindowResize(event) {	
	var w = window.innerWidth;
	var sidebarW = document.getElementById('sidebar').offsetWidth;
	var sidebarSendW = document.getElementById('send').offsetWidth;
	document.getElementById('chat').style.width = (w - sidebarW) + 'px';
	document.getElementById('input').style.width = (w - sidebarW) + 'px';
	document.getElementById('message').style.width = (w - sidebarW - sidebarSendW) + 'px';
};

window.onload = function friendList(){
	// request friendlist from server and prints the response in <div> friends </div>
	var jsontest = {"getFriends":[{"method":"getFriends", "userid":"2"}]}
	console.log("onload friendList");
	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
    		document.getElementById("friends").innerHTML = this.responseText;
    	}
  	};
  	xhttp.open("GET", "/api", jsontest);
  	xhttp.send();

}