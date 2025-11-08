// ===================== LIFE EVENTS (LOOKUP TABLE VERSION) ===================== //
function handleLifeProgression() {
  const lifeEvents = [
    { age: 0, message: `You were born into the ${family.surname} family!` },
    { age: 3, message: `You learned to talk and play with ${family.siblings[0]?.name || "your toys"}.` },
    { age: 6, message: "You started school!" },
    { age: 12, message: "You discovered a hobby — maybe sports or studying!" },
    {
      age: 18,
      action: () => {
        showToast("🎓 You’ve finished high school! Time to plan your next step.");
        if (typeof onHighSchoolGraduation === "function") onHighSchoolGraduation();
      }
    }
  ];

  const event = lifeEvents.find(ev => ev.age === player.age);
  if (!event) return;
  if (event.message) showToast(event.message);
  if (event.action) event.action();
}

// ===================== ADVANCE TIME ===================== //
function advanceTime(type) {
  const monthsPassed = type === "year" ? 12 : 1;
  player.month += monthsPassed;

  // ===================== MONTH ROLLOVER ===================== //
  if (player.month > 12) {
    player.month = 1;
    const previousStage = player.educationStage;
    player.age++;

    // ===================== EDUCATION STAGE DYNAMIC SYNC ===================== //
    if (player.age <= 6) player.educationStage = "none";
    else if (player.age <= 12) player.educationStage = "elementary";
    else if (player.age <= 15) player.educationStage = "middle";
    else if (player.age <= 18) player.educationStage = "high";
    else if (player.age <= 22) player.educationStage = player.choseCollege ? "college" : "finished";
    else if (player.age === 23 && player.educationStage === "college") player.educationStage = "graduate";
    else player.educationStage = "finished";

    // ===================== GRADUATION EVENTS ===================== //
    if (previousStage === "high" && player.educationStage !== "high") {
      if (typeof onHighSchoolGraduation === "function") onHighSchoolGraduation();
    }

    if (previousStage === "college" && player.educationStage === "graduate") {
      if (typeof onCollegeGraduation === "function") onCollegeGraduation();
    }

    // ===================== AGE-BASED LIFE EVENTS ===================== //
    handleLifeProgression();

    // ===================== COLLEGE PROGRESSION ===================== //
    if (player.inCollege) handleCollegeYearlyProgress();
  }

  // ===================== BUSINESS INCOME ===================== //
  let totalIncome = 0;
  (player.ownedBusinesses || []).forEach(b => {
    b.level ||= 1;
    b.efficiency ||= 1;
    b.marketTrend ||= 1;
    b.ownership ||= 100;

    const incomeForBiz =
      (b.profitPerYear / 12) *
      monthsPassed *
      b.level *
      b.efficiency *
      b.marketTrend *
      (b.ownership / 100);

    totalIncome += incomeForBiz;
    player.reputation += (b.reputationImpact / 12) * monthsPassed;
  });

  // ===================== PROFESSION INCOME ===================== //
  if (player.profession) {
    applyYearlyProfessionIncome();
  }

  // ===================== COLLEGE PART-TIME INCOME (SPECIAL CASE) ===================== //
  if (player.collegeFunding === "parttime" && player.inCollege) {
    // small monthly income instead of yearly
    const partTimeIncome = Math.round(3000 / 12 * monthsPassed);
    player.money += partTimeIncome;
    player.stamina = Math.max(0, player.stamina - 1);
    player.happiness = Math.max(0, player.happiness - 0.5);
    showToast(`💼 Earned $${partTimeIncome.toLocaleString()} from part-time work.`);
  }

  // ===================== APPLY BUSINESS INCOME ===================== //
  player.money += Math.round(totalIncome);

  // ===================== YEARLY TRIGGER ===================== //
  if (type === "year" && typeof checkYearlyScenarioTrigger === "function") {
    checkYearlyScenarioTrigger();
  }

  // ===================== YEARLY EXPENSES ===================== //
  if (type === "year") {
    const yearlyExpenses = calculateTotalExpenses();
    player.money -= yearlyExpenses;
    showToast(`💸 Paid yearly expenses: $${yearlyExpenses.toLocaleString()}`);
    updateExpensesTab?.();
  }

  // ===================== FINAL UI UPDATE ===================== //
  clampStats();
  updateStats();
}


// ===================== STATS UPDATE ===================== //
function updateStats() {
  clampStats();
  document.getElementById("money").textContent = `$${player.money.toLocaleString()}`;
  document.getElementById("reputation-text").textContent = `⭐ ${player.reputation}`;
  document.getElementById("age").textContent = `Age: ${player.age}`;
  document.getElementById("month").textContent = `Month: ${player.month}`;
  document.getElementById("profession").textContent = `Profession: ${player.profession || "None"}`;

  const healthFill = document.getElementById("health-fill");
  const happinessFill = document.getElementById("happiness-fill");
  const repFill = document.getElementById("reputation-fill");

  healthFill.style.width = `${player.health}%`;
  happinessFill.style.width = `${player.happiness}%`;
  repFill.style.width = `${player.reputation}%`;

  // Color logic
  healthFill.style.backgroundColor =
    player.health > 70 ? "#4CAF50" : player.health > 40 ? "#FFC107" : "#E53935";
  happinessFill.style.backgroundColor =
    player.happiness > 70 ? "#4CAF50" : player.happiness > 40 ? "#FFC107" : "#E53935";

  displayOwnedBusinesses();
  displayOwnedLuxury();
  updateSportHUD();
}

// ===================== UPDATE SPORT BAR ===================== //
function updateSportHUD() {
  const sportFill = document.getElementById("sport-fill");
  const sportLabel = document.getElementById("sport-label");

  if (!sportFill || !sportLabel) return;

  const percent = Math.min(Math.max(player.sportSkill || 0, 0), 100);
  sportFill.style.width = `${percent}%`;
  sportLabel.textContent = `SKILLS (${player.chosenSport || "None"})`;
}
