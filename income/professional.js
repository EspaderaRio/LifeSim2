// ===================== PROFESSION INCOME HANDLER ===================== //
function applyYearlyProfessionIncome() {
  if (!player.profession) return;

  // Default base income per profession type
  const baseIncomes = {
    freelancer: 30000,
    licensed: 40000,
    celebrity: 120000,
    athlete: 80000,
    model: 100000,
    entrepreneur: 75000,
    unemployed: 0,
  };

  // Fallback for undefined professions
  const baseIncome = baseIncomes[player.profession.toLowerCase()] || 30000;

  // Scale income with stats
  const skillFactor = (player.skills?.[player.profession] || 50) / 100;
  const reputationFactor = (player.reputation || 50) / 100;
  const experienceFactor = (player.experience || 1);

  const yearlyIncome = Math.round(baseIncome * (0.8 + skillFactor + reputationFactor / 2) * experienceFactor);

  player.money += yearlyIncome;
  player.happiness += 2;
  player.reputation += 1;
  player.experience = (player.experience || 1) + 0.1;

  showToast(`💼 You earned $${yearlyIncome.toLocaleString()} from your job as a ${player.profession}.`);
}
