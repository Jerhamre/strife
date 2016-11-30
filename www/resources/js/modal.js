// Get the modal
var currentActiveModal;

function showModal() {
    currentActiveModal.style.display = "block";
    centerModal()
}

function closeModal() {
    currentActiveModal.style.display = "none";
}

function centerModal() {
	var modalContent = $(currentActiveModal).find('.modal-content');
	modalContent.css('margin-top', -modalContent.outerHeight()/4*3);
}

window.onclick = function(event) {
    if (event.target == currentActiveModal) {
        currentActiveModal.style.display = "none";
    }
}

function click_newfriend() {
	currentActiveModal = document.getElementById('modal_newfriend');
	showModal();
}

function click_handlerooms() {
	currentActiveModal = document.getElementById('modal_handlerooms');
	showModal();
}
