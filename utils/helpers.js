// ===================== HELPERS ===================== //
function safeGet(id) {
  return document.getElementById(id);
}
function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}
function clampStats() {
  player.health = Math.min(Math.max(player.health, 0), 100);
  player.happiness = Math.min(Math.max(player.happiness, 0), 100);
  player.reputation = Math.min(Math.max(player.reputation, 0), 100);
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 3000);
}

// ===================== BACKGROUND CONTROL ===================== //
function setGameBackground(imageName) {
  const bgDiv = document.getElementById("player-character-bg");
  if (bgDiv) {
    bgDiv.style.backgroundImage = `url('assets/svgs/${imageName}')`;
    bgDiv.style.backgroundSize = "cover";
    bgDiv.style.backgroundPosition = "center";
    bgDiv.style.backgroundRepeat = "no-repeat";
    bgDiv.style.transition = "background-image 0.8s ease-in-out";
  }
}
// ===================== MODAL HANDLING ===================== //

function openModal(modalElement) {
  document.querySelectorAll(".modal").forEach(m => {
    if (m !== modalElement) m.classList.add("hidden");
  });
  modalElement.classList.remove("hidden");
}
function closeModal(modalElement) {
  modalElement.classList.add("hidden");
}

// ======== CUSTOM MODAL ======== //
const openCustomBtn = document.getElementById("open-custom-btn");
const customModal = document.getElementById("customModal");
const closeCustomBtn = document.getElementById("close-custom");

openCustomBtn.addEventListener("click", () => {
  customModal.classList.remove("hidden");
});

closeCustomBtn.addEventListener("click", () => {
  customModal.classList.add("hidden");
});

// ===================== CARD PURCHASE ANIMATION ===================== //
function animateCardPurchase(imageSrc) {
  const img = document.createElement("img");
  img.src = `assets/svgs/${imageSrc}`;
  img.style.position = "fixed";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%) scale(0.5)";
  img.style.transition = "all 0.5s ease-in-out";
  img.style.zIndex = "1000";
  document.body.appendChild(img);
  setTimeout(() => {
    img.style.transform = "translate(-50%, -50%) scale(1.2)";
    img.style.opacity = "0";
  }, 50);
  setTimeout(() => img.remove(), 600);
}
