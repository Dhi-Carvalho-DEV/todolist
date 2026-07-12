/* Elementos */
const tasksList = document.querySelector("#tasks-list");
const newTaskBtn = document.querySelector("#new-task-btn");
const filterButtons = document.querySelectorAll(".filter");
const searchInput = document.querySelector(".search-box input");
const sortTasksSelect = document.querySelector("#sort-tasks");

const totalTasksEl = document.querySelector("#total-tasks");
const completedTasksEl = document.querySelector("#completed-tasks");
const pendingTasksEl = document.querySelector("#pending-tasks");
const categoriesCountEl = document.querySelector("#categories-count");

/* Modal */
const taskModal = document.querySelector("#task-modal");
const closeModalBtn = document.querySelector("#close-modal");
const cancelTaskBtn = document.querySelector("#cancel-task");
const taskForm = document.querySelector("#task-form");

const taskTitleInput = document.querySelector("#task-title");
const taskCategoryInput = document.querySelector("#task-category");
const taskPriorityInput = document.querySelector("#task-priority");
const taskDateInput = document.querySelector("#task-date");
const taskStartTimeInput = document.querySelector("#task-start-time");
const taskEndTimeInput = document.querySelector("#task-end-time");

/* Estado */
let tasks = StorageService.get("tasks", []);
let editingTaskId = null;
let currentFilter = "all";
let searchTerm = "";
let currentSort = "newest";

/* Filtros */

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    const text = button.textContent.trim();

    if (text === "Todas") {
      currentFilter = "all";
    }

    if (text === "Pendentes") {
      currentFilter = "pending";
    }

    if (text === "Concluídas") {
      currentFilter = "completed";
    }

    renderTasks();
  });
});

/* Ordenação */
sortTasksSelect?.addEventListener("change", (event) => {
  currentSort = event.target.value;
  renderTasks();
});

/* Busca */

searchInput?.addEventListener("input", (event) => {
  searchTerm = event.target.value.toLowerCase();

  renderTasks();
});

/* Modal */

function openModal() {
  taskModal.classList.remove("hidden");
}

function closeModal() {
  taskModal.classList.add("hidden");

  taskForm.reset();

  editingTaskId = null;

  document.querySelector("#modal-title").textContent = "Nova Tarefa";
}

newTaskBtn?.addEventListener("click", openModal);

closeModalBtn?.addEventListener("click", closeModal);
cancelTaskBtn?.addEventListener("click", closeModal);

taskModal?.addEventListener("click", (event) => {
  if (event.target === taskModal) {
    closeModal();
  }
});

/* Local Storage */

function saveTasks() {
  StorageService.set("tasks", tasks);
}

/* Resumo */

function updateSummary() {
  const total = tasks.length;

  const completed = tasks.filter((task) => task.completed).length;

  const pending = tasks.filter((task) => !task.completed).length;

  const categories = [...new Set(tasks.map((task) => task.category))].length;

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (pendingTasksEl) pendingTasksEl.textContent = pending;
  if (categoriesCountEl) categoriesCountEl.textContent = categories;
}

/* Helpers */

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

function getPriorityLabel(priority) {
  switch (priority) {
    case "high":
      return "🔴 Alta";

    case "medium":
      return "🟡 Média";

    case "low":
      return "🟢 Baixa";

    default:
      return "🟢 Baixa";
  }
}

function formatDate(date) {
  if (!date) return "Sem prazo";
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

/* Crud */

function createTask(data) {
  const task = {
    id: Date.now(),
    title: data.title,
    category: data.category,
    priority: data.priority,
    dueDate: data.dueDate,
    startTime: data.startTime,
    endTime: data.endTime,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) return;

  editingTaskId = id;

  taskTitleInput.value = task.title;
  taskCategoryInput.value = task.category;
  taskPriorityInput.value = task.priority;
  taskDateInput.value = task.dueDate || "";
  taskStartTimeInput.value = task.startTime || "";
  taskEndTimeInput.value = task.endTime || "";

  document.querySelector("#modal-title").textContent = "Editar Tarefa";

  openModal();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const confirmDelete = confirm("Deseja excluir esta tarefa?");

  if (!confirmDelete) return;

  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

/* Renderização */

function renderTasks() {
  tasksList.innerHTML = "";

  let filteredTasks = [...tasks];

  if (currentFilter === "pending") {
    filteredTasks = filteredTasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((task) => task.completed);
  }

  if (searchTerm) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm),
    );
  }

  if (currentSort === "newest") {
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  if (currentSort === "oldest") {
    filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (currentSort === "priority") {
    const priorityOrder = {
      high: 1,
      medium: 2,
      low: 3,
    };

    filteredTasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
    );
  }

  if (currentSort === "deadline") {
    filteredTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  if (filteredTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="empty-state">
        <h3>Nenhuma tarefa encontrada</h3>
        <p>Tente outro filtro ou crie uma nova tarefa.</p>
      </div>
    `;

    updateSummary();
    return;
  }

  filteredTasks.forEach((task) => {
    const card = document.createElement("article");

    card.className = task.completed ? "task-card completed" : "task-card";

    card.innerHTML = `
      <div class="task-check">
        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
        >
      </div>

      <div class="task-content">
        <h3>${task.title}</h3>

        <div class="task-meta">
          <span class="task-category ${task.category}">
            ${getCategoryLabel(task.category)}
          </span>

          <span class="task-priority ${task.priority}">
            ${getPriorityLabel(task.priority)}
          </span>
        </div>

        <p class="task-date">
          ${formatDate(task.dueDate)}
        </p>
        <p class="task-time">
          ${task.startTime || "--:--"} - ${task.endTime || "--:--"}
        </p>
      </div>

      <div class="task-actions">
        <button class="edit-btn">
          <i class="bi bi-pencil"></i>
        </button>

        <button class="delete-btn">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    const checkbox = card.querySelector("input");

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const editBtn = card.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      editTask(task.id);
    });

    const deleteBtn = card.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    tasksList.appendChild(card);
  });

  updateSummary();
}

/* Formulário */

taskForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  if (!title) return;

  const formData = {
    title,
    category: taskCategoryInput.value,
    priority: taskPriorityInput.value,
    dueDate: taskDateInput.value,
    startTime: taskStartTimeInput.value,
    endTime: taskEndTimeInput.value,
  };

  if (editingTaskId !== null) {
    tasks = tasks.map((task) => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          ...formData,
        };
      }

      return task;
    });

    saveTasks();
    renderTasks();
  } else {
    createTask(formData);
  }

  closeModal();
});

/* Inicialização */
renderTasks();
