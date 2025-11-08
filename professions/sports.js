// ===================== ATHLETE TAB (Expanded) ===================== //
function openSportsTab(currentSport = null) {
  
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  // If player already picked a sub-profession (specific sport)
  if (currentSport || player.subProfession) {
    return openSpecificSportTab(currentSport || player.subProfession);
  }

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Sports Career</h2>
      <p>Select your sport specialization:</p>
      <div class="sports-grid">
        <button data-sport="basketball">🏀 Basketball</button>
        <button data-sport="boxing">🥊 Boxing</button>
        <button data-sport="swimming">🏊 Swimming</button>
        <button data-sport="soccer">⚽ Soccer</button>
        <button data-sport="tennis">🎾 Tennis</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelectorAll("[data-sport]").forEach(btn => {
    btn.onclick = () => {
      player.profession = "athlete";
      player.subProfession = btn.dataset.sport;
      // Initialize sport skill data if not yet
      if (!player.sportsSkills) player.sportsSkills = {};
      if (!player.sportsSkills[btn.dataset.sport]) {
        player.sportsSkills[btn.dataset.sport] = {
          strength: 10,
          endurance: 10,
          skill: 10,
          fame: 0,
          level: 1,
          matchesPlayed: 0,
          wins: 0,
          losses: 0
        };
      }
      modal.remove();
      openSpecificSportTab(btn.dataset.sport);
    };
  });
}

function openSpecificSportTab(sport) {
  currentSportActive = sport; 
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const sData = {
    basketball: { cost: 500, basePay: 1500 },
    boxing: { cost: 800, basePay: 2500 },
    swimming: { cost: 600, basePay: 1800 },
    soccer: { cost: 700, basePay: 2000 },
    tennis: { cost: 750, basePay: 2200 }
  };

  const s = sData[sport];
  const stats = player.sportsSkills[sport];
  const totalSkill = Math.floor((stats.strength + stats.endurance + stats.skill) / 3);
  const winRate = (stats.wins / Math.max(1, stats.matchesPlayed) * 100).toFixed(1);

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${capitalize(sport)} Career</h2>
      <p><strong>Level:</strong> ${stats.level} | <strong>Skill:</strong> ${totalSkill}</p>
      <p><strong>Wins:</strong> ${stats.wins} | <strong>Losses:</strong> ${stats.losses} | <strong>Win Rate:</strong> ${winRate}%</p>
      <p><strong>Fame:</strong> ${stats.fame}</p>
      <hr>
      <p>Train to improve skills or Play to earn money and fame.</p>
      <div class="button-group">
        <button id="train-btn">🏋️ Train ($${s.cost})</button>
        <button id="training-tab-btn">🏋️ Open Training Tab</button>
        <button id="play-btn">🎮 Play Match</button>
        <button id="retire-btn">🚪 Retire</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

modal.querySelector("#train-btn").onclick = () => {
  // No money check, training is free
  player.health -= 5;
  player.happiness += 3;

  // Improve random skill
  const rand = Math.random();
  if (rand < 0.33) stats.strength += 2;
  else if (rand < 0.66) stats.endurance += 2;
  else stats.skill += 2;

  // Level-up logic
  const totalSkill = Math.floor((stats.strength + stats.endurance + stats.skill) / 3);
  if (totalSkill >= stats.level * 30) {
    stats.level++;
    showToast(`🏅 You leveled up to Level ${stats.level}!`);
  } else {
    showToast("💪 Training improved your stats!");
  }

  updateStats();
  modal.remove();
  openSpecificSportTab(sport);
};

modal.querySelector("#training-tab-btn").onclick = () => {
  modal.remove();
  openAthleteTrainingTab();
};

  // PLAY MATCH ACTION
  modal.querySelector("#play-btn").onclick = () => {
    modal.remove();
    openMatchTab(sport);
  };

  // RETIRE
  modal.querySelector("#retire-btn").onclick = () => {
    modal.remove();
    openRetirementOption();
  };
}

// ===================== MATCH SIMULATION ===================== //
function openMatchTab(sport) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  const stats = player.sportsSkills[sport];
  const sData = {
    basketball: { basePay: 1500 },
    boxing: { basePay: 2500 },
    swimming: { basePay: 1800 },
    soccer: { basePay: 2000 },
    tennis: { basePay: 2200 }
  };
  const s = sData[sport];

  const opponentSkill = Math.floor(Math.random() * (stats.level * 40 - stats.level * 10)) + stats.level * 10;
  const playerSkill = Math.floor((stats.strength + stats.skill + stats.endurance) / 3);

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${capitalize(sport)} Match</h2>
      <p>Your Skill: ${playerSkill}</p>
      <p>Opponent Skill: ${opponentSkill}</p>
      <button id="start-match-btn">🏁 Start Match</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelector("#start-match-btn").onclick = () => {
    const outcome = playerSkill + Math.random() * 20 > opponentSkill + Math.random() * 20 ? "win" : "lose";
    const fameGain = outcome === "win" ? 5 + stats.level : 2;
    const moneyGain = outcome === "win" ? s.basePay + stats.level * 300 : s.basePay / 2;
    const happinessGain = outcome === "win" ? +5 : -2;

    stats.matchesPlayed++;
    if (outcome === "win") stats.wins++;
    else stats.losses++;
    stats.fame += fameGain;

    player.money += moneyGain;
    player.happiness += happinessGain;
    player.reputation += fameGain / 2;

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Match Result</h2>
        <p>You ${outcome === "win" ? "🏆 WON!" : "❌ LOST"} the ${sport} match!</p>
        <p>💰 Earned: $${moneyGain}</p>
        <p>🌟 Fame +${fameGain} | 😊 Happiness ${happinessGain >= 0 ? "+" : ""}${happinessGain}</p>
        <button id="back-btn">Back</button>
      </div>
    `;
    modal.querySelector(".close").onclick = () => modal.remove();
    modal.querySelector("#back-btn").onclick = () => {
      modal.remove();
      openSpecificSportTab(sport);
    };
    updateStats();
  };
}
// ===================== ATHLETE / SPORTS SYSTEM ===================== //

// Initialize sport-related player data
if (!player.sportType) player.sportType = null;
if (!player.sportSkill) player.sportSkill = 0;
if (!player.stamina) player.stamina = 100;
if (!player.stats) player.stats = { points: 0, assists: 0, rebounds: 0 };

let currentSportActive = player.subProfession || null;

// ===================== OPEN SPORTS TAB ===================== //
function openAthleteTrainingTab() {
  if (!currentSportActive) return alert("Please select a sport first!");

  const stats = player.sportsSkills[currentSportActive];
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal-content sport-modal">
      <span class="close">&times;</span>
      <h2>🏀 Athlete Training (${capitalize(currentSportActive)})</h2>

      <div class="hud-sports">
        <div class="hud-bar-sports">
          <span>Skill (${Math.floor((stats.strength + stats.endurance + stats.skill)/3)})</span>
          <div class="bar-sports"><div class="fill" id="skill-fill"></div></div>
        </div>
        <div class="hud-bar-sports">
          <span>Stamina (${player.stamina})</span>
          <div class="bar-sports"><div class="fill" id="stamina-fill"></div></div>
        </div>
      </div>

      <div class="actions-sports">
        <button id="train-btn">🏋️ Train</button>
        <button id="simulate-btn">🏆 Play Game</button>
      </div>

      <div id="sport-log" class="scroll-box"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".close").onclick = () => modal.remove();
  modal.querySelector("#train-btn").onclick = () => trainSport(stats);
  modal.querySelector("#simulate-btn").onclick = () => simulateSportGame(stats);

  updateSportBars(stats);
}


// ===================== TRAINING ===================== //
function trainSport(stats) {
  const gain = Math.floor(Math.random() * 3) + 1;

  // Randomly improve one stat
  const rand = Math.random();
  if (rand < 0.33) stats.strength += gain;
  else if (rand < 0.66) stats.endurance += gain;
  else stats.skill += gain;

  player.stamina = Math.max(0, player.stamina - 5);

  logSport(`You trained hard and improved your skill by ${gain} points!`);
  updateSportBars(stats);
}

// ===================== SIMULATE GAME ===================== //
function simulateSportGame() {
  const log = document.getElementById("sport-log");
  log.innerHTML = "🏀 Simulating game...<br>";

  const playerScore = Math.floor(Math.random() * (player.sportSkill / 2 + 10));
  const opponentScore = Math.floor(Math.random() * 40 + 20);

  const result = playerScore > opponentScore ? "won" : "lost";

  player.stats.points = playerScore;
  player.happiness += result === "won" ? 10 : 3;
  player.reputation += result === "won" ? 5 : 1;
  player.stamina = Math.max(0, player.stamina - 10);

  log.innerHTML += `<br>You scored ${playerScore} points and ${result} the game!`;

  // ✅ Pass the correct stats object
  updateSportBars({
    strength: player.strength || 0,
    endurance: player.endurance || 0,
    skill: player.sportSkill || 0
  });
}

// ===================== UTILITIES ===================== //
function logSport(text) {
  const log = document.getElementById("sport-log");
  if (log) log.innerHTML += `<br>${text}`;
}

function updateSportBars(stats) {
  const skillFill = document.getElementById("skill-fill");
  const staminaFill = document.getElementById("stamina-fill");

  const totalSkill = Math.floor((stats.strength + stats.endurance + stats.skill) / 3);

  if (skillFill) skillFill.style.width = `${totalSkill}%`;
  if (staminaFill) staminaFill.style.width = `${player.stamina}%`;
}

// ===================== OPTIONAL AUTOLOAD ===================== //
window.addEventListener("load", () => {
  const sportBar = document.getElementById("sport-fill");
  if (sportBar) sportBar.style.width = `${player.sportSkill}%`;
});



