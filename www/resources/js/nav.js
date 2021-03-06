function navClick(location) {

	var url = window.location.href.split('/')

	if(url.length > 5) {
		url.pop()
	}

	if(url.length == 5) {
		url[5] = location
	}

	if(url.length == 4) {
		url[3] = location
	}

	if(location == 'chat') {
		url.pop()
	}
	var string = ''

	for(var i = 0; i < url.length; i++) {
		string += url[i] + '/'
	}

	if (location == 'logout') {
		window.location.href = "/logout";
	} else {
		window.location.href = string
	}
}

function displayNav() {
		var html = ''

		if(window.location.href.includes("room") || window.location.href.includes("friend")) {

			html += '<div id="navTopChat" onclick="navClick(\'chat\')" class="navOption">Chat</div>'

			if(window.location.href.includes("room")) {
				//html += '<div id="navTopScrum" onclick="navClick(\'scrum\')" class="navOption">Scrum</div>'
			}

			//html += '<div id="navTopFiles" onclick="navClick(\'files\')" class="navOption">Files</div>'
		}

		html += '<div id="navTopSettings" onclick="navClick(\'settings\')" class="navOption">Settings</div>'
		
		html += '<div onclick="navClick(\'logout\')" class="navOption">Logout</div>'

		document.getElementById('topNav').innerHTML = html

		// set selected
		var location = window.location.href.split('/')[5]
		
		if ((location == null || location == '') && document.getElementById('navTopChat')) {
			document.getElementById('navTopChat').className += ' selected';
		}
		if (location == 'chat' && document.getElementById('navTopChat')) {
			document.getElementById('navTopChat').className += ' selected';
		}
		if (location == 'scrum' && document.getElementById('navTopScrum')) {
			document.getElementById('navTopScrum').className += ' selected';
		}
		if (location == 'files' && document.getElementById('navTopFiles')) {
			document.getElementById('navTopFiles').className += ' selected';
		}
		if (location == 'settings' && document.getElementById('navTopSettings')) {
			document.getElementById('navTopSettings').className += ' selected';
		}

		var location = window.location.href.split('/')[3]
		
		if (location == 'settings' && document.getElementById('navTopSettings')) {
			document.getElementById('navTopSettings').className += ' selected';
		}
}

function displayContent() {

	if(window.location.href.includes("room") || window.location.href.includes("friend")) {
		var location = window.location.href.split('/')[5]

		if (location == null || location == '' || location == 'chat') {
			$("#content").load("/resources/utilhtml/chat.ejs"); 
		}
		if (location == 'scrum') {
			$("#content").load("/resources/utilhtml/scrum.ejs"); 
		}
		if (location == 'files') {
			$("#content").load("/resources/utilhtml/files.ejs"); 
		}
		if (location == 'settings') {
			$("#content").load("/resources/utilhtml/settings.ejs"); 
		}
		
	} else {
		
		var location = window.location.href.split('/')[3]
		
		if (location == 'settings') {
			$("#content").load("/resources/utilhtml/settings.ejs"); 
		} else {
			$("#content").load("/resources/utilhtml/noselection.ejs"); 
		}
	}
}