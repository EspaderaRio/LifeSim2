
// ===================== INITIAL LOAD ===================== //
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadBusinesses();      // Load business data
    await loadLuxuryItems();     // Load luxury data
  } catch (err) {
    console.error("Failed to load startup data:", err);
  }
});

document.getElementById('toggle-gym').addEventListener('change', e => {
  player.gymMembership = e.target.checked;
});
document.getElementById('toggle-diet').addEventListener('change', e => {
  player.dietPlan = e.target.checked;
});



document.addEventListener("DOMContentLoaded", () => {
 document.getElementById("menu-toggle").addEventListener("click", () => openModal(document.getElementById("MenuTab")));
 document.getElementById("close-life").addEventListener("click", closeLifeTab);
 document.getElementById("close-business").addEventListener("click", closeBusinessTab);
 document.getElementById("close-luxury").addEventListener("click", closeLuxuryTab);
 document.getElementById("advance-month").addEventListener("click", () => advanceTime("month"));
 document.getElementById("advance-year").addEventListener("click", () => advanceTime("year"));
 document.getElementById("open-character-tab").addEventListener("click", openCharacterTab);
 document.getElementById("menu-toggle").addEventListener("click", openMenuTab);
 document.getElementById("open-doctor-tab").addEventListener("click", openDoctorTab);
 document.getElementById("open-profession-btn").addEventListener("click", openProfessionSelection);
 document.getElementById("surrender-life").addEventListener("click", surrenderLife);
 document.getElementById("restart-life").addEventListener("click", restartLife);
 document.querySelectorAll(".toast").forEach(t => t.remove());
});





window.openProfessionSelection = openProfessionSelection;

// ===================== EARLY LUXURY PRELOAD ON PAGE LOAD ===================== //
window.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load the luxury data quietly
    const res = await fetch("luxury.json");
    if (!res.ok) throw new Error("Failed to preload luxury.json");
    luxuryItems = await res.json();

    // Preload all SVGs right after the game starts
    preloadLuxuryImages(luxuryItems);
  } catch (err) {
    console.warn("Luxury preload skipped:", err);
  }
});



// ===================== INITIALIZE ===================== //
(async function init() {
  generateFamily();    // This now automatically syncs family to player.relationships
  clampStats();
  updateSportHUD(); 
  updateStats();
})();
