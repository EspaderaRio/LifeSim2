// ===================== EXPENSES MODAL ===================== //
const openExpensesBtn = document.getElementById("view-expenses");
if (openExpensesBtn) openExpensesBtn.addEventListener("click", openExpensesModal);

function openExpensesModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";

  const gymCost = player.gymMembership ? 2000 : 0;
  const dietCost = player.dietPlan ? 1500 : 0;
  const otherCost = player.otherExpenses || 0;

  const total = gymCost + dietCost + otherCost;

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>📊 Yearly Expenses</h2>
      <p>Here’s a breakdown of your personal yearly costs:</p>
      <ul id="expenses-list" class="expense-list">
        ${gymCost ? `<li>🏋️ Gym Membership: <strong>$${gymCost.toLocaleString()}</strong></li>` : ""}
        ${dietCost ? `<li>🥗 Diet Plan: <strong>$${dietCost.toLocaleString()}</strong></li>` : ""}
        ${otherCost ? `<li>💸 Other Expenses: <strong>$${otherCost.toLocaleString()}</strong></li>` : ""}
        ${!gymCost && !dietCost && !otherCost ? `<li>No active expenses at the moment.</li>` : ""}
      </ul>
      <hr>
      <p id="total-expenses"><strong>Total Yearly Expenses:</strong> $${total.toLocaleString()}</p>
      <div class="button-group">
        <button id="close-expenses-btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal on click
  modal.querySelector(".close").onclick = () => modal.remove();
  modal.querySelector("#close-expenses-btn").onclick = () => modal.remove();
}

function calculateTotalExpenses() {
  let total = 0;
  if (player.gymMembership) total += 2000;
  if (player.dietPlan) total += 1500;
  if (player.otherExpenses) total += player.otherExpenses;

  // Add all business expenses
  total += calculateBusinessExpenses();

  return total;
}


function calculateBusinessExpenses() {
  if (!player.ownedBusinesses?.length) return 0;

  return player.ownedBusinesses.reduce((sum, biz) => {
    // baseline company overhead (maintenance)
    const maintenance = Math.round(biz.cost * 0.05); // 5% yearly maintenance

    // payroll if employees exist
    const payroll = biz.employeeList?.reduce((s, e) => s + (e.salary || 0) * 12, 0) || 0;

    // manager salary if applicable
    const managerSalary = biz.hasManager ? Math.round(biz.cost * 0.02) * 12 : 0;

    // product R&D/operations
    const productOps = (biz.products?.length || 0) * Math.round(biz.cost * 0.01);

    const yearlyCompanyExpense = maintenance + payroll + managerSalary + productOps;

    // store internally for reporting
    biz.maintenanceCost = yearlyCompanyExpense;

    return sum + yearlyCompanyExpense;
  }, 0);
}


function updateExpensesTab() {
  // Recalculate all player-related expenses
  const gymCost = player.gymMembership ? 2000 : 0;
  const dietCost = player.dietPlan ? 1500 : 0;
  const otherCost = player.otherExpenses || 0;
  const businessCost = (player.ownedBusinesses || []).reduce(
    (sum, b) => sum + (b.maintenanceCost || 0),
    0
  );

  // Calculate total expenses
  const total = gymCost + dietCost + otherCost + businessCost;

  // Store the latest total in player for reference
  player.totalExpenses = total;

  // ✅ If the expenses modal is open, refresh it live
  const modal = document.querySelector(".modal-content");
  if (modal && modal.querySelector("#expenses-list")) {
    const list = modal.querySelector("#expenses-list");
    list.innerHTML = `
      ${gymCost ? `<li>🏋️ Gym Membership: <strong>$${gymCost.toLocaleString()}</strong></li>` : ""}
      ${dietCost ? `<li>🥗 Diet Plan: <strong>$${dietCost.toLocaleString()}</strong></li>` : ""}
      ${businessCost ? `<li>🏢 Business Maintenance: <strong>$${businessCost.toLocaleString()}</strong></li>` : ""}
      ${otherCost ? `<li>💸 Other Expenses: <strong>$${otherCost.toLocaleString()}</strong></li>` : ""}
      ${!gymCost && !dietCost && !businessCost && !otherCost
        ? `<li>No active expenses at the moment.</li>`
        : ""}
    `;

    const totalDisplay = modal.querySelector("#total-expenses");
    if (totalDisplay)
      totalDisplay.innerHTML = `<strong>Total Yearly Expenses:</strong> $${total.toLocaleString()}`;
  }

  console.log("Expenses updated:", total);
}

