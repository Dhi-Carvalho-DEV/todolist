import { getData, saveData } from "../services/storage.js";
import { showToast } from "../components/toast.js";
import { defaultProfile } from "../data/defaults.js";

/* ELEMENTOS */
const menuItems = document.querySelectorAll(".settings-item");
const panels = document.querySelectorAll(".settings-panel");
const saveProfileButton = document.querySelector("#save-profile");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userRole = document.querySelector("#user-role");
const profileImage = document.querySelector("#profile-image");

/* MENU DE CONFIGURAÇÕES */
function setupSettingsMenu() {
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach((button) => {
        button.classList.remove("active");
      });

      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      item.classList.add("active");

      const section = item.dataset.section;

      const panel = document.querySelector(`#${section}-panel`);

      panel?.classList.add("active");
    });
  });
}

/* CARREGAR PERFIL */
function loadProfile() {
  const profile = getData("profile", defaultProfile);

  userName.value = profile.name;
  userEmail.value = profile.email;
  userRole.value = profile.role;
  profileImage.src = profile.avatar;
}

/* SALVAR PERFIL */
function saveProfile() {
  const profile = {
    name: userName.value,
    email: userEmail.value,
    role: userRole.value,
    avatar: profileImage.src,
  };

  saveData("profile", profile);
  showToast("Perfil atualizado com sucesso!", "success");
}

/* EVENTOS */
saveProfileButton?.addEventListener("click", saveProfile);

/* INIT */
setupSettingsMenu();
loadProfile();
