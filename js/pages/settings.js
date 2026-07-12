import { getData, saveData } from "../services/storage.js";

const defaultProfile = {
  name: "Diogo Santana de Carvalho",
  email: "diogo@example.com",
  role: "Desenvolvedor Front-End",
  avatar: "https://i.pravatar.cc/200?img=12",
};

const menuItems = document.querySelectorAll(".settings-item");
const panels = document.querySelectorAll(".settings-panel");
const saveProfile = document.querySelector("#save-profile");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");
const userRole = document.querySelector("#user-role");
const profileImage = document.querySelector("#profile-image");
const changeAvatarBtn = document.querySelector("#change-avatar");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    item.classList.add("active");

    const panel = document.querySelector(`#${item.dataset.section}-panel`);

    if (panel) {
      panel.classList.add("active");
    }
  });
});

function loadProfile() {
  const profile = {
    ...defaultProfile,
    ...getData("profile", {}),
  };

  userName.value = profile.name;
  userEmail.value = profile.email;
  userRole.value = profile.role;
  profileImage.src = profile.avatar;
}

saveProfile?.addEventListener("click", () => {
  const profile = {
    name: userName.value,
    email: userEmail.value,
    role: userRole.value,
    avatar: profileImage.src,
  };
  saveData("profile", profile);
  showToast("Perfil atualizado!", "success");
});

loadProfile();
