/* ELEMENTOS */
const appointmentsList = document.querySelector("#appointments-list");
const appointmentsCountEl = document.querySelector("#appointments-count");
const hoursCountEl = document.querySelector("#hours-count");
const completedCountEl = document.querySelector("#completed-count");
const pendingCountEl = document.querySelector("#pending-count");
const todayBtn = document.querySelector("#today-btn");
const selectedDateEl = document.querySelector("#selected-date");
const clearFilterBtn = document.querySelector("#clear-filter-btn");
const progressFill = document.querySelector("#progress-fill");
const progressText = document.querySelector("#progress-text");
const searchInput = document.querySelector(".search-box input");
const favoritesCountEl = document.querySelector("#favorites-count");

/* ELEMENTOS DO CALENDÁRIO */
const calendarGrid = document.querySelector("#calendar-grid");
const monthYear = document.querySelector("#month-year");
const prevMonthBtn = document.querySelector("#prev-month");
const nextMonthBtn = document.querySelector("#next-month");

/* ELEMENTOS DO MODAL */
const taskModal = document.querySelector("#task-modal");
const taskDetails = document.querySelector("#task-details");
const closeTaskModal = document.querySelector("#close-task-modal");
const completeTaskBtn = document.querySelector("#complete-task-btn");
const deleteTaskBtn = document.querySelector("#delete-task-btn");

/* ELEMENTOS DO TOAST */
const toast = document.querySelector("#toast");
const toastIcon = document.querySelector("#toast-icon");
const toastMessage = document.querySelector("#toast-message");

/* DADOS */
let searchTerm = "";
let selectedDate = null;
let selectedTaskId = null;
let currentFilter = "all";
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

/* BUTTONS */
todayBtn?.addEventListener("click", () => {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();

  renderCalendar();

  selectedDate =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, "0")}-` +
    `${String(today.getDate()).padStart(2, "0")}`;

  document.querySelectorAll(".calendar-day").forEach((el) => {
    el.classList.remove("selected");

    if (el.dataset.date === selectedDate) {
      el.classList.add("selected");
    }
  });

  selectedDateEl.textContent = "Hoje";

  showToast("Exibindo tarefas de hoje.", "info");

  renderTasks();
});

clearFilterBtn?.addEventListener("click", () => {
  selectedDate = null;

  document.querySelectorAll(".calendar-day").forEach((day) => {
    day.classList.remove("selected");
  });

  selectedDateEl.textContent = "Todas as tarefas";
  showToast("Filtro removido.", "info");

  renderTasks();
});

prevMonthBtn?.addEventListener("click", () => {
  currentMonth--;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  renderCalendar();
});

nextMonthBtn?.addEventListener("click", () => {
  currentMonth++;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  renderCalendar();
});

/* BUSCA */
searchInput?.addEventListener("input", (event) => {
  searchTerm = event.target.value.toLowerCase();
  renderTasks();
});

/* HELPERS */
function getCategoryLabel(category) {
  switch (category) {
    case "study":
      return "Estudos";

    case "work":
      return "Trabalho";

    case "home":
      return "Casa";

    case "finance":
      return "Finanças";

    default:
      return "Outros";
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function filterTasks(tasks) {
  const today = new Date().toISOString().split("T")[0];

  switch (currentFilter) {
    case "pending":
      return tasks.filter((task) => !task.completed);

    case "completed":
      return tasks.filter((task) => task.completed);

    case "overdue":
      return tasks.filter(
        (task) => task.dueDate && task.dueDate < today && !task.completed,
      );

    case "today":
      return tasks.filter((task) => task.dueDate === today);

    case "high":
      return tasks.filter((task) => task.priority === "high");

    default:
      return tasks;
  }
}

function formatDate(date) {
  if (!date) return "Sem prazo";
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

function showToast(message, type = "success") {
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

/* LISTA DE TAREFAS */
function renderTasks() {
  appointmentsList.innerHTML = "";

  let tasks = getTasks();

  if (selectedDate) {
    tasks = tasks.filter((task) => task.dueDate === selectedDate);
  }

  if (searchTerm) {
    tasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm),
    );
  }

  tasks = filterTasks(tasks);

  const priorities = { high: 3, medium: 2, low: 1 };

  const today = new Date().toISOString().split("T")[0];

  tasks.sort((a, b) => {
    if (a.favorite !== b.favorite) {
      return b.favorite - a.favorite;
    }

    if (a.completed !== b.completed) {
      return a.completed - b.completed;
    }

    const aOverdue = !a.completed && a.dueDate && a.dueDate < today;
    const bOverdue = !b.completed && b.dueDate && b.dueDate < today;

    if (aOverdue !== bOverdue) {
      return bOverdue - aOverdue;
    }

    const dateA = new Date(a.dueDate || "9999-12-31");
    const dateB = new Date(b.dueDate || "9999-12-31");

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    }

    const hourA = a.startTime || "23:59";
    const hourB = b.startTime || "23:59";

    if (hourA !== hourB) {
      return hourA.localeCompare(hourB);
    }

    return priorities[b.priority] - priorities[a.priority];
  });

  if (tasks.length === 0) {
    appointmentsList.innerHTML = `
      <p>Nenhuma tarefa encontrada.</p>
    `;
    return;
  }

  tasks.forEach((task, index) => {
    const isOverdue =
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < new Date(today);

    const card = document.createElement("div");
    card.style.animationDelay = `${index * 0.05}s`;

    card.className = "appointment-card";

    if (task.completed) {
      card.classList.add("completed");
    }

    if (isOverdue) {
      card.classList.add("overdue");
    }

    card.innerHTML = `
      <div class="appointment-info">
        <div class="appointment-header">
          <div class="task-left">
            <input
              type="checkbox"
              class="task-complete"
              data-id="${task.id}"
              ${task.completed ? "checked" : ""}
            >
            <h4>
              ${task.title}
              ${isOverdue ? '<span class="overdue-badge">Atrasada</span>' : ""}
              ${task.favorite ? '<span class="favorite-badge">⭐ Favorita</span>' : ""}
            </h4>
          </div>
          <button class="favorite-btn" data-id="${task.id}">
            ${task.favorite ? "⭐" : "☆"}
          </button>
        </div>

        <p>
          ${getCategoryLabel(task.category)}
          •
          ${
            task.priority === "high"
              ? "🔴 Alta"
              : task.priority === "medium"
                ? "🟡 Média"
                : "🟢 Baixa"
          } 
        </p>
      </div>

      <div class="appointment-meta">
        <span class="appointment-time">
          ${formatDate(task.dueDate)}
        </span>

        <small class="appointment-hours">
          <i class="bi bi-clock"></i>
          ${task.startTime || "--:--"} - ${task.endTime || "--:--"}
        </small>
      </div>
    `;

    appointmentsList.appendChild(card);

    card.addEventListener("click", (e) => {
      if (
        e.target.closest(".task-complete") ||
        e.target.closest(".favorite-btn")
      )
        return;

      selectedTaskId = task.id;

      completeTaskBtn.textContent = task.completed
        ? "✔ Já concluída"
        : "Marcar como concluída";

      completeTaskBtn.disabled = task.completed;

      taskDetails.innerHTML = `
        <div class="task-detail">
          <strong>Título</strong>
          <p>${task.title}</p>
        </div>
        <div class="task-detail">
          <strong>Categoria</strong>
          <p>${getCategoryLabel(task.category)}</p>
        </div>
        <div class="task-detail">
          <strong>Prioridade</strong>
          <p>
            ${
              task.priority === "high"
                ? "🔴 Alta"
                : task.priority === "medium"
                  ? "🟡 Média"
                  : "🟢 Baixa"
            }
          </p>
        </div>
        <div class="task-detail">
          <strong>Data</strong>
          <p>${formatDate(task.dueDate)}</p>
        </div>
        <div class="task-detail">
          <strong>Horário</strong>
          <p>${task.startTime || "--:--"} - ${task.endTime || "--:--"}</p>
        </div>
        <div class="task-detail">
          <strong>Status</strong>
          <p>${task.completed ? "✅ Concluída" : "⏳ Pendente"}</p>
        </div>
        <div class="task-detail">
          <strong>ID</strong>
          <p>${task.id}</p>
        </div>
      `;
      taskModal.classList.remove("hidden");
    });
  });
}

/* ESTATÍSTICAS */
function updateSummary() {
  const tasks = getTasks();

  const total = tasks.length;

  const completed = tasks.filter((task) => task.completed).length;

  const pending = tasks.filter((task) => !task.completed).length;

  const favorites = tasks.filter((task) => task.favorite).length;

  let totalMinutes = 0;

  tasks.forEach((task) => {
    if (!task.startTime || !task.endTime) return;

    const [sh, sm] = task.startTime.split(":").map(Number);
    const [eh, em] = task.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    totalMinutes += end - start;
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  appointmentsCountEl.textContent = total;
  completedCountEl.textContent = completed;
  pendingCountEl.textContent = pending;
  favoritesCountEl.textContent = favorites;

  hoursCountEl.textContent = `${hours}h ${minutes}min`;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `${progress}%`;
  }
}

/* PRÓXIMAS TAREFAS */
function renderUpcoming() {
  const container = document.querySelector("#upcoming-list");

  if (!container) return;

  container.innerHTML = "";

  const tasks = getTasks();

  const today = new Date().toISOString().split("T")[0];

  const upcoming = tasks
    .filter((task) => !task.completed && task.dueDate && task.dueDate >= today)
    .sort((a, b) => {
      if (a.dueDate !== b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return (a.startTime || "").localeCompare(b.startTime || "");
    })
    .slice(0, 5);

  upcoming.forEach((task) => {
    const item = document.createElement("div");

    item.className = "upcoming-item";

    item.innerHTML = `
      <h4>${task.favorite ? "⭐ " : ""} 📌 ${task.title}</h4>
      <div class="upcoming-meta">
        <span>${formatDate(task.dueDate)}</span>
        <span>•</span>
        <span class="upcoming-hours">
          <i class="bi bi-clock"></i>
          ${task.startTime || "--:--"} - ${task.endTime || "--:--"}
        </span>
      </div>
    `;

    container.appendChild(item);
  });
}

/* CALENDÁRIO */
function renderCalendar() {
  if (!calendarGrid) return;

  calendarGrid.innerHTML = "";

  const now = new Date();
  const month = currentMonth;
  const year = currentYear;

  monthYear.textContent = new Date(year, month)
    .toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    })
    .replace(" de ", " / ")
    .replace(/^./, (str) => str.toUpperCase());

  const totalDays = new Date(year, month + 1, 0).getDate();

  const tasks = getTasks();

  let firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayEl = document.createElement("div");

    dayEl.style.animationDelay = `${day * 0.02}s`;
    dayEl.className = "calendar-day";
    dayEl.textContent = day;

    const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    dayEl.dataset.date = currentDate;

    if (
      day === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear()
    ) {
      dayEl.classList.add("active");
    }

    if (selectedDate === currentDate) {
      dayEl.classList.add("selected");
    }

    dayEl.addEventListener("click", () => {
      selectedDate = currentDate;

      document.querySelectorAll(".calendar-day").forEach((el) => {
        el.classList.remove("selected");
      });

      dayEl.classList.add("selected");
      selectedDateEl.textContent = formatDate(currentDate);

      renderTasks();
    });

    const dayTasks = tasks.filter((task) => task.dueDate === currentDate);
    if (dayTasks.length > 0) {
      dayEl.classList.add("has-event");
      const hasHigh = dayTasks.some((task) => task.priority === "high");
      const hasMedium = dayTasks.some((task) => task.priority === "medium");

      if (hasHigh) {
        dayEl.classList.add("priority-high");
      } else if (hasMedium) {
        dayEl.classList.add("priority-medium");
      } else {
        dayEl.classList.add("priority-low");
      }
    }

    calendarGrid.appendChild(dayEl);
  }
}

document.addEventListener("change", (e) => {
  if (!e.target.classList.contains("task-complete")) return;

  const taskId = Number(e.target.dataset.id);
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  task.completed = e.target.checked;

  showToast(
    task.completed ? "Tarefa concluída." : "Tarefa reaberta.",
    task.completed ? "success" : "info",
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));

  updateSummary();
  renderTasks();
  renderUpcoming();
  renderCalendar();
});

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("favorite-btn")) return;
  e.stopPropagation();

  const id = Number(e.target.dataset.id);
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) return;

  task.favorite = !task.favorite;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  showToast(
    task.favorite ? "Tarefa adicionada aos favoritos." : "Favorito removido.",
    "info",
  );

  renderTasks();
  renderUpcoming();
  updateSummary();
  renderCalendar();
});

document.querySelectorAll("[data-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks();
  });
});

/* EVENTOS DO MODAL */
closeTaskModal?.addEventListener("click", () => {
  taskModal.classList.add("hidden");
});

taskModal?.addEventListener("click", (e) => {
  if (e.target === taskModal) {
    taskModal.classList.add("hidden");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    taskModal.classList.add("hidden");
  }
});

completeTaskBtn?.addEventListener("click", () => {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === selectedTaskId);

  if (!task) return;

  if (task.completed) {
    showToast("Esta tarefa já está concluída.", "info");
    return;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskModal.classList.add("hidden");
  showToast("Tarefa concluída com sucesso!");

  renderTasks();
  renderUpcoming();
  renderCalendar();
  updateSummary();
});

deleteTaskBtn?.addEventListener("click", () => {
  if (!confirm("Deseja realmente excluir esta tarefa?")) {
    return;
  }

  const tasks = getTasks().filter((task) => task.id !== selectedTaskId);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskModal.classList.add("hidden");
  showToast("Tarefa removida.", "warning");

  renderTasks();
  renderUpcoming();
  renderCalendar();
  updateSummary();
});

/* INIT */
selectedDateEl.textContent = "Todas as tarefas";
renderTasks();
renderUpcoming();
updateSummary();
renderCalendar();
