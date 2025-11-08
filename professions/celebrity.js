// ===================== CELEBRITY TAB ===================== //
function openCelebrityTab(type = null) {
  if (type || player.subProfession) return openSpecificCelebrityTab(type || player.subProfession);

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Celebrity Career</h2>
      <p>Choose your stardom path:</p>
      <div class="career-grid">
        <button data-celeb="actor">🎬 Actor</button>
        <button data-celeb="musician">🎤 Musician</button>
        <button data-celeb="influencer">📱 Influencer</button>
        <button data-celeb="athlete"> Athlete </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelectorAll("[data-celeb]").forEach(btn => {
    btn.onclick = () => {
      player.profession = "celebrity";
      player.subProfession = btn.dataset.celeb;

      if (!player.celebritySkills) player.celebritySkills = {};
      if (!player.celebritySkills[btn.dataset.celeb]) {
        player.celebritySkills[btn.dataset.celeb] = {
          level: 1,
          exp: 0,
          fame: 0,
          gigsDone: 0,
          moneyEarned: 0
        };
      }

      modal.remove();
      openSpecificCelebrityTab(btn.dataset.celeb);
    };
  });
}

function openSpecificCelebrityTab(type) {
  // Ensure celebritySkills object exists
  player.celebritySkills ||= {};
  player.celebritySkills[type] ||= { level: 1, exp: 0, fame: 0, gigsDone: 0, moneyEarned: 0 };

  const stats = player.celebritySkills[type];

  const data = {
    actor: { money: 500000, fame: 5, happy: 8, health: -1 },
    musician: { money: 400000, fame: 6, happy: 9, health: -1 },
    influencer: { money: 300000, fame: 4, happy: 7, health: -1 },
    athlete: { money: 400000, fame: 6, happy: 9, health: -1 }
  };

  const c = data[type];

  const levelBonus = stats.level * 500;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${capitalize(type)}</h2>
      <p><strong>Level:</strong> ${stats.level} | <strong>EXP:</strong> ${stats.exp}/100</p>
      <p><strong>Gigs Done:</strong> ${stats.gigsDone} | <strong>Total Money:</strong> $${stats.moneyEarned}</p>
      <p>Income: $${c.money + levelBonus} | Fame +${c.fame} | Happiness +${c.happy}</p>
      <div class="button-group">
        <button id="perform-btn">🎤 Perform/Act</button>
        <button id="retire-btn">🚪 Resign/Retire</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelector("#perform-btn").onclick = () => {
    player.money += c.money + levelBonus;
    player.reputation += c.fame;
    player.happiness += c.happy;
    player.health += c.health;

    stats.exp += 25;
    stats.fame += c.fame;
    stats.gigsDone++;
    stats.moneyEarned += c.money + levelBonus;

    if (stats.exp >= 100) {
      stats.level++;
      stats.exp -= 100;
      showToast(`🏆 ${type} leveled up to Level ${stats.level}!`);
    } else {
      showToast(`🎬 You completed a gig as ${type}!`);
    }

    updateStats();
    modal.remove();
    openSpecificCelebrityTab(type);
  };

  modal.querySelector("#retire-btn").onclick = () => {
    modal.remove();
    openRetirementOption();
  };
}

