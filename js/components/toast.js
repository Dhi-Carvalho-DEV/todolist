let toast;
let toastIcon;
let toastMessage;

function initToast() {
  toast = document.querySelector("#toast");
  toastIcon = document.querySelector("#toast-icon");
  toastMessage = document.querySelector("#toast-message");
}

export function showToast(message, type = "success") {
  if (!toast) {
    initToast();
  }

  if (!toast || !toastIcon || !toastMessage) {
    console.warn("Elemento de toast não encontrado.");
    return;
  }

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
