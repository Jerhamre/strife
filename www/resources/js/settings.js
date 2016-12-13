function populateSettings() {

	var html = ''

	if(window.location.href.includes("room")) {
		
		html += '<h3>Room settings</h3>'

		html += '<div class="avatar">'
		html += '<div class="text">Choose a image to upload and use as avatar from this room (15kb max)</div>'
		html += '<input class="avatarinput" data-max-size="16384" id="avatarUploadRoom" type="file" name="avatar" accept="image/*" onchange="previewAvatarJS(\'room\')">'
		html += '<button class="uploadAvatar" onclick="sendAvatar(\'room\')">Upload</button>'
		html += '<img class="preview" id="previewAvatarRoom" src=""/>'
		html += '</div>'

	}
		
	html += '<h3>User settings</h3>'

	html += '<div class="avatar">'
	html += '<div class="text">Choose a image to upload and use as avatar from your profile (15kb max)</div>'
	html += '<input class="avatarinput" data-max-size="16384" id="avatarUpload" type="file" name="avatar" accept="image/*" onchange="previewAvatarJS(\'user\')">'
	html += '<button class="uploadAvatar" onclick="sendAvatar(\'user\')">Upload</button>'
	html += '<img class="preview" id="previewAvatar" src=""/>'
	html += '</div>'

	document.getElementById("settingscontent").innerHTML = html
}

function sendAvatar(type) {

	var fileRoom = document.getElementById("avatarUploadRoom");
	var file = document.getElementById("avatarUpload");

	var fd = new FormData();

	var input

	var image

	if(type == 'room') {
		image = fileRoom.files[0]
		var roomid = window.location.href.split('/')[4]
		fd.append("roomid", roomid)
		input = fileRoom
	}
	if(type == 'user') {
		image = file.files[0]
		input = file
	}

	var maxSize = 16384;

	var fileSize = input.files[0].size;

	if(fileSize>maxSize){
		alert("Too big avatar, 15kb max")
		return
	}


	fd.append("avatar", image);
	fd.append("type", type);

	var xhttp = new XMLHttpRequest()

	xhttp.upload.onprogress = function(e) {
		if (e.lengthComputable) {
			var percentComplete = (e.loaded / e.total) * 100;
			console.log(percentComplete + '% uploaded');
		}
	};
	
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log('avatar uploaded')
			$("#avatarUploadRoom").val('')
			$("#avatarUpload").val('')
		}
	}

	xhttp.open("POST", "/avatar")
	xhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
	xhttp.send(fd);
}

function readURL(type) {

	var fileRoom = document.getElementById("avatarUploadRoom");
	var file = document.getElementById("avatarUpload");

	var input

	if(type == 'room'){
		input = fileRoom
	}
	if(type == 'user'){
		input = file
	}

    if (input.files && input.files[0]) {
        var reader = new FileReader();
            
        reader.onload = function (e) {
        	if(type == 'room'){
				$('#previewAvatarRoom').attr('src', e.target.result);
        	}
			if(type == 'user') {
            	$('#previewAvatar').attr('src', e.target.result);
			}
        }
            
        reader.readAsDataURL(input.files[0]);
    }
}

function previewAvatarJS(type) {
    readURL(type);
}