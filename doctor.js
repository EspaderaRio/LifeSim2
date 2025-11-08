// ===================== DOCTOR TAB ===================== //
const openDoctorBtn = document.getElementById("open-doctor-tab");
const closeDoctorBtn = document.getElementById("close-doctor");

openDoctorBtn.addEventListener("click", openDoctorTab);
closeDoctorBtn.addEventListener("click", closeDoctorTab);

function openDoctorTab() {
  const modal = document.getElementById("doctorModal");
  const grid = document.getElementById("doctor-choices");
  grid.innerHTML = "";

  const treatments = [
    { name: "Basic Checkup", cost: 500, healthGain: 10, happinessGain: 2 },
    { name: "Full Treatment", cost: 2000, healthGain: 30, happinessGain: 5 },
    { name: "Luxury Spa Therapy", cost: 5000, healthGain: 50, happinessGain: 10 },
  ];

  treatments.forEach(t => {
    const card = document.createElement("div");
    card.className = "doctor-card";
    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>Cost: $${t.cost}</p>
      <p>Health: +${t.healthGain}</p>
      <p>Happiness: +${t.happinessGain}</p>
      <button>Heal</button>
    `;
    card.querySelector("button").onclick = () => healAtDoctor(t);
    grid.appendChild(card);
  });

  openModal(modal);
}

function closeDoctorTab() {
closeModal(doctorModal);
}

function healAtDoctor(treatment) {
  if (player.money < treatment.cost) return showToast("Not enough money!");
  player.money -= treatment.cost;
  player.health = Math.min(100, player.health + treatment.healthGain);
  player.happiness = Math.min(100, player.happiness + treatment.happinessGain);
  updateStats();
  showToast(`You received ${treatment.name}!`);
  closeModal(document.getElementById("doctorModal"));
}
