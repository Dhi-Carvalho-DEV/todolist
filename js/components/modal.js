let modal;

function initModal() {
  modal = document.querySelector("task-modal");
}

export function openModal() {
  if (!modal) {
    initModal();
  }

  if (!modal) return;

  modal.classList.remove("hidden");
}

export function closeModal() {
  if (!modal) {
    initModal();
  }

  if (!modal) return;

  modal.classList.add("hidden");
}

export function setupModalEvents() {
  if (!modal) {
    initModal();
  }

  const closeButton = document.querySelector("#close-task-modal");

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
