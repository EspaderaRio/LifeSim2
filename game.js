// ===================== SAVE / LOAD SYSTEM ===================== //
function saveGame() {
  localStorage.setItem("businessLifeSave", JSON.stringify({ player, family }));
  showToast("Game saved!");
}

function loadGame() {
  const save = localStorage.getItem("businessLifeSave");
  if (!save) return showToast("No saved data found.");

  const data = JSON.parse(save);
  Object.assign(player, data.player);
  Object.assign(family, data.family);

  clampStats();
  updateStats();
  
  if (player.profession === "athlete") openSportsTab();
  else if (player.profession === "licensed") openLicensedTab();
  else if (player.profession === "entrepreneur") openBusinessTab();

  showToast("Game loaded successfully!");
}

// ===================== RESTART / SURRENDER ===================== //
function restartLife() {
  const confirmRestart = confirm("Restart your current life but keep your character?");
  if (!confirmRestart) return;

  player.money = 10000;
  player.health = 100;
  player.happiness = 50;
  player.reputation = 0;
  player.ownedBusinesses = [];
  player.ownedLuxury = [];

  clampStats();
  updateStats();
  showToast("Life restarted — new beginning!");
}

function surrenderLife() {
  const confirmSurrender = confirm("Surrender your life? This will erase all progress.");
  if (!confirmSurrender) return;

  localStorage.clear();
  player = {
    money: 10000,
    reputation: 0,
    health: 100,
    happiness: 50,
    age: 18,
    month: 1,
    profession: null,
    ownedBusinesses: [],
    ownedLuxury: []
  };

  family = { surname: "", father: {}, mother: {}, siblings: [] };

  clampStats();
  updateStats();
  showToast("You surrendered your life. Everything has been reset.");
}
