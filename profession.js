// ===================== PROFESSION SELECTION ===================== //
function openProfessionSelection() {
  const professionRequirements = {
    athlete: { skills: { athletic: 50 }, age: 16 },
    licensed: { educationLevel: 4 }, // college graduate
    entrepreneur: { skills: { creativity: 20, social: 20 } },
    model: { skills: { social: 25, creativity: 15 }, age: 18 },
    freelancer: { skills: { academic: 15 }, age: 16 },
    celebrity: { skills: { social: 40, creativity: 25 }, age: 18 },
  };

  // ✅ Helper function to check if player meets requirements
  function canChooseProfession(type) {
    const req = professionRequirements[type];
    if (!req) return true;

    if (req.age && player.age < req.age) {
      showToast(`You're too young to become a ${type}.`);
      return false;
    }

    if (req.educationLevel && (player.educationLevel || 0) < req.educationLevel) {
      showToast(`You need higher education to become a ${type}.`);
      return false;
    }

    if (req.skills) {
      for (const [skill, value] of Object.entries(req.skills)) {
        if ((player.skills?.[skill] || 0) < value) {
          showToast(`You need more ${skill} skill (${value} required) to be a ${type}.`);
          return false;
        }
      }
    }
    return true;
  }

  // ✅ If player already has a profession, open its tab
  if (player.profession) {
    switch (player.profession) {
      case "entrepreneur": return openEntrepreneurTab();
      case "athlete": return openSportsTab(player.subProfession);
      case "licensed": return openLicensedTab(player.subProfession);
      case "celebrity": return openCelebrityTab(player.subProfession);
      case "model": return openModelTab(player.subProfession);
      case "freelancer": return openFreelancerTab(player.subProfession);
      default: return showToast("No profession tab found.");
    }
  }

  // ✅ Otherwise, show profession selection modal
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Choose Your Profession</h2>
      <p class="desc">Pick one profession path. You can resign or retire later.</p>
      <div class="profession-grid">
        <button id="choose-entrepreneur"><img src="assets/buttons/business.svg"><span>Entrepreneur</span></button>
        <button id="choose-athlete"><img src="assets/buttons/athlete.svg"><span>Athlete</span></button>
        <button id="choose-licensed"><img src="assets/buttons/licensed.svg"><span>Licensed</span></button>
        <button id="choose-celebrity"><img src="assets/buttons/celebrity.svg"><span>Celebrity</span></button>
        <button id="choose-model"><img src="assets/buttons/model.svg"><span>Model</span></button>
        <button id="choose-freelancer"><img src="assets/buttons/freelancer.svg"><span>Freelancer</span></button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  // ✅ Helper to finalize selection
  const selectProfession = (prof, displayName, openTabFn) => {
    if (!canChooseProfession(prof)) return; // <--- Check before proceeding
    player.profession = prof.toLowerCase();
    player.professionDisplay = displayName;
    player.subProfession = null;
    player.retired = false;
    showToast(`You became a ${displayName}!`);
    updateStats();
    modal.remove();
    openTabFn();
  };

  // ✅ Bind buttons with requirement checks
  modal.querySelector("#choose-entrepreneur").onclick = () =>
    selectProfession("entrepreneur", "Entrepreneur", openEntrepreneurTab);
  modal.querySelector("#choose-athlete").onclick = () =>
    selectProfession("athlete", "Athlete", openSportsTab);
  modal.querySelector("#choose-licensed").onclick = () =>
    selectProfession("licensed", "Licensed Professional", openLicensedTab);
  modal.querySelector("#choose-celebrity").onclick = () =>
    selectProfession("celebrity", "Celebrity", openCelebrityTab);
  modal.querySelector("#choose-model").onclick = () =>
    selectProfession("model", "Model", openModelTab);
  modal.querySelector("#choose-freelancer").onclick = () =>
    selectProfession("freelancer", "Freelancer", openFreelancerTab);
}

// ===================== RETIREMENT ===================== //
function openRetirementOption() {
  if (!player.profession) return showToast("You don't have a profession yet.");

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${player.profession} Options</h2>
      <p>Would you like to resign or retire?</p>
      <div class="option-buttons">
        <button id="resign">Resign</button>
        <button id="retire">Retire</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelector("#resign").onclick = () => {
    player.profession = null;
    player.subProfession = null;
    showToast("You resigned. You can now choose a new profession.");
    updateStats();
    modal.remove();
  };

  modal.querySelector("#retire").onclick = () => {
    player.retired = true;
    player.happiness += 10;
    player.health += 5;
    player.reputation += 5;
    player.profession = null;
    player.subProfession = null;
    showToast("You retired honorably. You can now choose a new path later.");
    updateStats();
    modal.remove();
  };
}

// ===================== HELPER FUNCTION ===================== //
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
