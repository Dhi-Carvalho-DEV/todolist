const toast = document.querySelector("#toast");
const toastIcon = document.querySelector("#toast-icon");
const toastMessage = document.querySelector("#toast-message");

function showToast(message, type = "sucess") {
  if (!toast || !toastIcon || !toastMessage) return;

  toast.className = `toast ${type}`;

  switch (type) {
    case "success":
      toastIcon.className = "bi bi-check-circle-fill";
      break;
    case "warning":
      toastIcon.className = "bi bi-exclamation-triangle-fill";
      break;
    case "error":
      toastIcon.className = "bi bi-x-circle-fill";
      break;
    default:
      toastIcon.className = "bi bi-info-circle-fill";
  }

  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
