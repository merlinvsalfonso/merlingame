var hasEvent = false;
var buttonCallback;

// Modal controller with text and callback.
function showModal(text, callback) {
  modal.innerHTML = text;
  modalParent.classList.remove('h');
  buttonCallback = callback;

  if (!hasEvent) {
    hasEvent = true;
    button.addEventListener('click', () => {
      modalParent.classList.add('h');
      buttonCallback();
    });
  }
}