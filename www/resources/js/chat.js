function chatResize() {
	var content = document.getElementById('content')
	var messages = document.getElementById('messages')
	var messageInput = document.getElementById('message')
	var sendButton = document.getElementById('send')

	if (content && messageInput && sendButton) {
		messageInput.style.width = (content.offsetWidth - sendButton.offsetWidth) + 'px'
	}
	if (messages) {
		messages.style.height = (content.offsetHeight - messageInput.offsetHeight) + 'px'
	}
}