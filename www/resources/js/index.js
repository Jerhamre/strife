window.onresize = onWindowResize;
window.onload = friendList;

function onWindowResize(event) {	
	var w = window.innerWidth;
	var sidebarW = document.getElementById('sidebar').offsetWidth;
	var sidebarSendW = document.getElementById('send').offsetWidth;
	document.getElementById('chat').style.width = (w - sidebarW) + 'px';
	document.getElementById('input').style.width = (w - sidebarW) + 'px';
	document.getElementById('message').style.width = (w - sidebarW - sidebarSendW) + 'px';
};

function friendList(event){
	// request friendlist from server and prints the response in <div> friends </div>
	var jsontest = {"getFriends":[{"method":"getFriends", "userid":"2"}]}

	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
    		document.getElementById("friends").innerHTML = this.responseText;
    	}
  	};
  	xhttp.open("POST", "cloud-59.skelabb.ltu.se/api", jsontest);
  	xhttp.send();

}