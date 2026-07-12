/* Elementos */
const searchInput = document.querySelector(".search-box input");

const boardsCountEl = document.querySelector("#boards-count");
const tasksCountEl = document.querySelector("#tasks-count");
const pendingCountEl = document.querySelector("#pending-count");
const completedCountEl = document.querySelector("#completed-count");

const boardsGrid = document.querySelector("#boards-grid");

/* Categorias (Quadros dinâmicos) */
const categories = [
  {
    id: "study",
    name: "Estudos",
    icon: "bi-book",
    color: "study",
  },
  {
    id: "work",
    name: "Trabalho",
    icon: "bi-briefcase",
    color: "work",
  },
  {
    id: "home",
    name: "Casa",
    icon: "bi-house",
    color: "home",
  },
  {
    id: "finance",
    name: "Finanças",
    icon: "bi-cash-stack",
    color: "finance",
  },
];

/* Estatísticas */
function updateDashboardStats() {
  const tasks = StorageService.get("tasks", []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  tasksCountEl.textContent = totalTasks;
  completedCountEl.textContent = completedTasks;
  pendingCountEl.textContent = pendingTasks;
  boardsCountEl.textContent = categories.length;
}

/* Renderizar Quadros */
function renderBoards() {
  const tasks = StorageService.get("tasks", []);

  boardsGrid.innerHTML = "";

  categories.forEach((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category.id);
    const totalTasks = categoryTasks.length;
    const completedTasks = categoryTasks.filter(
      (task) => task.completed,
    ).length;

    const progress =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const card = document.createElement("article");
    card.className = "board-card";
    card.innerHTML = `
      <div class="board-icon ${category.color}">
        <i class="bi ${category.icon}"></i>
      </div>
      <h3>${category.name}</h3>
      <p>${totalTasks} tarefa${totalTasks !== 1 ? "s" : ""}</p>

      <div class="progress-bar">
        <div class="progress" style="width: ${progress}%"></div>
      </div>

      <span>${progress}% concluído</span>
    `;

    boardsGrid.appendChild(card);
  });
}

/* Busca */
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    document.querySelectorAll(".board-card").forEach((card) => {
      const title = card.querySelector("h3");

      if (!title) return;

      const boardName = title.textContent.toLowerCase();

      card.style.display = boardName.includes(value) ? "block" : "none";
    });
  });
}

/* Inicialização */
renderBoards();
updateDashboardStats();
