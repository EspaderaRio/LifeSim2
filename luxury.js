// ===================== LUXURY HANDLERS ===================== //
const openLuxuryBtn = document.getElementById("luxury-toggle");
const closeLuxuryBtn = document.getElementById("close-luxury");

openLuxuryBtn.addEventListener("click", async () => {
  if (!luxuryItems || Object.keys(luxuryItems).length === 0) {
    await loadLuxuryItems();
  }

  // 🖼️ Preload all SVGs before showing modal
  preloadLuxuryImages(luxuryItems).then(() => {
    openLuxuryTab();
  });
});


closeLuxuryBtn.addEventListener("click", closeLuxuryTab);

async function loadLuxuryItems() {
try {
const res = await fetch("luxury.json");
if (!res.ok) throw new Error("Failed to load luxury.json");
luxuryItems = await res.json();
} catch (err) {
console.error(err);
}
}

async function preloadLuxuryImages(itemsData) {
  if (!itemsData) return;
  const allImages = [];

  Object.keys(itemsData).forEach(category => {
    const cat = itemsData[category];
    if (cat.icon) allImages.push(`assets/svgs/${cat.icon}`);
    if (cat.items && Array.isArray(cat.items)) {
      cat.items.forEach(item => {
        if (item.image) allImages.push(`assets/svgs/${item.image}`);
      });
    }
  });

  const uniqueImages = [...new Set(allImages)];

  // Preload quietly in the background
  uniqueImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  console.log(`🖼️ Preloaded ${uniqueImages.length} luxury SVGs on startup`);
}


function openLuxuryTab() {
luxuryChoices.innerHTML = "";
const categoriesDiv = document.getElementById("luxury-categories");
categoriesDiv.innerHTML = "";

Object.keys(luxuryItems).forEach((category, index) => {
const catData = luxuryItems[category];
const btn = document.createElement("button");
btn.className = "luxury-category-btn";


const icon = document.createElement("img");
icon.src = `assets/svgs/${catData.icon || "default.svg"}`;
icon.alt = category;
icon.style.width = "24px";
icon.style.height = "24px";
icon.style.marginRight = "6px";

btn.appendChild(icon);
btn.appendChild(document.createTextNode(category));
if (index === 0) btn.classList.add("active");

btn.onclick = () => {
  setActiveCategory(btn);
  displayLuxuryCategory(category);
};
categoriesDiv.appendChild(btn);

});

const firstCategory = Object.keys(luxuryItems)[0];
if (firstCategory) displayLuxuryCategory(firstCategory);

openModal(luxuryModal);
}

function closeLuxuryTab() {
closeModal(luxuryModal);
}

function setActiveCategory(activeBtn) {
document.querySelectorAll("#luxury-categories button").forEach(btn =>
btn.classList.remove("active")
);
activeBtn.classList.add("active");
}

function displayLuxuryCategory(category) {
  luxuryChoices.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "luxury-grid";

  const items = luxuryItems[category]?.items || [];
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "luxury-card";
    card.innerHTML = `
      <img src="assets/svgs/${item.image || "default.svg"}" alt="${item.name}">
      <p>${item.name}</p>
      <p>Cost: $${item.cost.toLocaleString()}</p>
      ${item.happinessImpact ? `<p>Happiness: +${item.happinessImpact}</p>` : ""}
    `;

    const owned = player.ownedLuxury.some(l => l.name === item.name);

    // If owned, show "Set as Home" for Houses, otherwise "Owned"
    const button = document.createElement("button");

    if (owned && category === "Houses") {
      button.textContent = "Set as Home";
      button.onclick = () => {
        player.selectedHouse = item;
        localStorage.setItem("selectedHouse", JSON.stringify(item)); // save permanently
        setGameBackground(item.image);
        showToast(`${item.name} is now your home!`);
      };
    } 
    else if (!owned) {
      button.textContent = "Buy";
      button.onclick = () => buyLuxury(item, card);
    } 
    else {
      button.textContent = "Owned";
      button.disabled = true;
      button.style.opacity = "0.6";
    }

    card.appendChild(button);
    grid.appendChild(card);
  });

  luxuryChoices.appendChild(grid);
  grid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
}
function buyLuxury(item, card) {
if (player.ownedLuxury.some(l => l.name === item.name))
return showToast(`You already own ${item.name}!`);
if (player.money < item.cost)
return showToast("Not enough money!");

player.money -= item.cost;
player.ownedLuxury.push(item);

  // If bought item is a House, set as background
if (item.category === "Houses") {
  player.selectedHouse = item;
  setGameBackground(item.image);
}

const gain = item.happinessImpact || 0;
player.happiness = Math.min(100, player.happiness + gain);
player.reputation += Math.floor(gain / 5);

animateCardPurchase(item.image);
updateStats();
showToast(`Purchased ${item.name}! Happiness +${gain}`);
}

function displayOwnedLuxury() {
ownedLuxuryGrid.innerHTML = "";
player.ownedLuxury.forEach(l => {
const card = document.createElement("div");
card.className = "luxury-card";
card.innerHTML = `       <img src="assets/svgs/${l.image || "default.svg"}" alt="${l.name}">       <p>${l.name}</p>       <p>Happiness: +${l.happinessImpact || 0}</p>
    `;
ownedLuxuryGrid.appendChild(card);
});
}


function openHouseSelection() {
  const houses = player.ownedLuxury.filter(l => l.category === "Houses");

  if (houses.length === 0) {
    return showToast("You don’t own any houses yet!");
  }

  // Create modal container dynamically
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Select Your Home</h2>
      <div class="house-grid"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const grid = modal.querySelector(".house-grid");
  houses.forEach(house => {
    const card = document.createElement("div");
    card.className = "house-card";
    card.innerHTML = `
      <img src="assets/svgs/${house.image}" alt="${house.name}">
      <p>${house.name}</p>
      <button>Select</button>
    `;
    card.querySelector("button").onclick = () => {
      player.selectedHouse = house;
      setGameBackground(house.image);
      showToast(`${house.name} is now your home!`);
      modal.remove();
    };
    grid.appendChild(card);
  });

  modal.querySelector(".close").onclick = () => modal.remove();
}
