function chatResize() {
	var content = document.getElementById('content')
	var messageInput = document.getElementById('message')
	var sendButton = document.getElementById('send')

	if (content && messageInput && sendButton) {
		messageInput.style.width = (content.offsetWidth - sendButton.offsetWidth) + 'px'
	}
}