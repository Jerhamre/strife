function populateSettings() {

	var html = ''

	html += '<img id="blah" alt="your image" width="100" height="100" />'

	html += '<input type="file" onchange="document.getElementById("blah").src = window.URL.createObjectURL(this.files[0])">'

	if(window.location.href.includes("room")) {
		
		html += '<h3>Room settings</h3>'

		html += 'Choose a image to upload and use as avatar from this room'
		html += '<input id="avatarUploadRoom" type="file" name="avatar" accept="image/*">'
		html += '<button onclick="sendAvatar(\'room\')">Upload</button>'

	}
		
	html += '<h3>User settings</h3>'

	html += 'Choose a image to upload and use as avatar from your profile'
	html += '<input id="avatarUpload" type="file" name="avatar" accept="image/*">'
	html += '<button onclick="sendAvatar(\'user\')">Upload</button>'
	html += '<img id="blah" src="#" alt="your image" />'

	document.getElementById("settingscontent").innerHTML = html
}

function sendAvatar(type) {

	var fileRoom = document.getElementById("avatarUploadRoom");
	var file = document.getElementById("avatarUpload");

	var fd = new FormData();


	var image

	if(type == 'room') {
		image = fileRoom.files[0]
		var roomid = window.location.href.split('/')[4]
		fd.append("roomid", roomid)
	}
	if(type == 'user') {
		image = file.files[0]
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

function readURL(input) {
	console.log('readURL')

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#avatarUpload").change(function(){
	console.log('change')
    readURL(this);
});