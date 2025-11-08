// ===================== PERSONAL LIFE ===================== //
const openLifeBtn = document.getElementById("life-toggle");
const closeLifeBtn = document.getElementById("close-life");

openLifeBtn.addEventListener("click", openLifeTab);
closeLifeBtn.addEventListener("click", closeLifeTab);

function openLifeTab() {
  lifeChoices.innerHTML = "";

  const actions = [
    { name: "Vacation Trip", cost: 2000, stressChange: -20, happinessChange: +25, reputationChange: +3, image: "vacation.svg" },
    { name: "Family Time", cost: 500, stressChange: -15, happinessChange: +20, reputationChange: 0, image: "family.svg" },
    { name: "Charity Donation", cost: 1500, stressChange: -5, happinessChange: +10, reputationChange: +10, image: "charity.svg" },
    { name: "Spa Day", cost: 800, stressChange: -25, happinessChange: +15, reputationChange: 0, image: "spa.svg" }
  ];

  actions.forEach(a => {
    const card = document.createElement("div");
    card.className = "life-card";
    card.innerHTML = `
      <img src="assets/svgs/${a.image || "default.svg"}" alt="${a.name}">
      <p>${a.name}</p>
      <p>Cost: $${a.cost}</p>
      <p>Stress: ${a.stressChange}</p>
      <p>Happiness: +${a.happinessChange}</p>
      <p>Reputation: +${a.reputationChange}</p>
      <button>Do Activity</button>
    `;
    card.querySelector("button").onclick = () => doLifeAction(a, card);
    lifeChoices.appendChild(card);
  });

  openModal(lifeModal);
}

function closeLifeTab() {
  closeModal(lifeModal);
}


function doLifeAction(a, card) {
  const gymCost = player.gymMembership ? 2000 : 0;
  const dietCost = player.dietPlan ? 1500 : 0;
  let totalCost = (a.cost || 0); 

  if (player.money < totalCost) return showToast("Not enough money!");

  // Deduct cost
  player.money -= totalCost;

  // Track recurring expenses
  player.otherExpenses = (player.otherExpenses || 0) + gymCost + dietCost;

  // Apply stress/happiness/reputation effects
  player.stress = Math.max(0, player.stress + (a.stressChange || 0));
  player.happiness = Math.min(100, player.happiness + (a.happinessChange || 0));
  player.reputation += (a.reputationChange || 0);

  // Apply gym/diet health benefit
  if (player.gymMembership) player.health = Math.min(player.health + 5, 100);
  if (player.dietPlan) player.health = Math.min(player.health + 3, 100);

  card.animate([{ transform: "scale(0.9)" }, { transform: "scale(1)" }], { duration: 300 });
  updateStats();
  showToast(`You enjoyed ${a.name}! Gym/Diet costs applied.`);
}
