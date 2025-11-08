/* ============================================================
BUSINESS & LUXURY SYSTEMS (Optimized v3.1)
============================================================ */
function safeNum(n, def = 0) {
  return isNaN(n) || n === null || n === undefined ? def : Number(n);
}

const openBusinessBtn = document.getElementById("business-toggle");
const closeBusinessBtn = document.getElementById("close-business");

openBusinessBtn.addEventListener("click", openBusinessTab);
closeBusinessBtn.addEventListener("click", closeBusinessTab);

// ===================== BUSINESS TAB ===================== //
async function loadBusinesses() {
  try {
    const res = await fetch("businesses.json");
    if (!res.ok) throw new Error("Failed to load businesses.json");
    const data = await res.json();
    businesses = data.map(normalizeBusiness);
  } catch (err) {
    console.warn("⚠️ Using fallback businesses:", err);
    businesses = [
      normalizeBusiness({
        name: "Test Shop",
        cost: 1000,
        stressImpact: 1,
        reputationImpact: 2,
        image: "default.svg",
      }),
    ];
    player.ownedBusinesses = (player.ownedBusinesses || []).map(normalizeBusiness);
  }
}

function normalizeBusiness(b) {
  const safe = (n, def = 0) => (isNaN(n) || n === null || n === undefined ? def : Number(n));

  return {
    name: b.name || "Unnamed Business",
    image: b.image || "default.svg",
    cost: safe(b.cost, 1000),
    level: safe(b.level, 1),
    efficiency: safe(b.efficiency, 1),
    marketTrend: safe(b.marketTrend, 1),
    ownership: safe(b.ownership, 100),
    employees: safe(b.employees, 0),
    stressImpact: safe(b.stressImpact, 0),
    reputationImpact: safe(b.reputationImpact, 0),
    profitPerYear: safe(b.profitPerYear, Math.round((safe(b.cost, 1000) || 1000) * 0.2)),
    morale: safe(b.morale, 100),
    satisfaction: safe(b.satisfaction, 100),
    hasManager: !!b.hasManager,
    employeeList: Array.isArray(b.employeeList) ? b.employeeList : [],
    products: Array.isArray(b.products) ? b.products : [],
    upgrades: Array.isArray(b.upgrades) ? b.upgrades : [],
    origin: b.origin || "businessTab",
    lastIncome: safe(b.lastIncome, 0),
  };
}




async function openBusinessTab() {
  
  if (!businesses.length) {
    console.log("Loading businesses...");
    await loadBusinesses();
    console.log("Loaded:", businesses);
  }

 
  businessChoices.innerHTML = "";

  businesses.forEach(b => {
    const card = document.createElement("div");
    card.className = "business-card";
    card.innerHTML = `
      <img src="assets/svgs/${b.image || "default.svg"}" alt="${b.name}">
      <p>${b.name}</p>
      <p>Cost: $${b.cost.toLocaleString()}</p>
      <p>Stress: +${b.stressImpact}</p>
      <p>Reputation: +${b.reputationImpact}</p>
      <button>Buy</button>
    `;
    card.querySelector("button").onclick = () => buyBusiness(b);
    businessChoices.appendChild(card);
  });

  openModal(businessModal);
}


function closeBusinessTab() {
closeModal(businessModal);
}

function buyBusiness(b) {
  const owned = player.ownedBusinesses.some(x => x.name === b.name);
  if (owned) return showToast(`You already own ${b.name}!`);

  if (player.money < b.cost) return showToast("Not enough money!");

  
  player.money -= b.cost;


  player.stress += b.stressImpact;
  player.reputation += b.reputationImpact;


  const newBusiness = normalizeBusiness({
  ...b,
  level: 1,
  efficiency: 1,
  marketTrend: 1,
  ownership: 100,
  profitPerYear: b.profitPerYear || b.cost * 0.2,
  lastIncome: 0,
  employees: b.employees || 0,
  upgrades: [],
  origin: "businessTab",
});
player.ownedBusinesses.push(normalizeBusiness(newBusiness));



  animateCardPurchase(b.image);
  updateStats();
  displayOwnedBusinesses(); // Optional: refresh display
  showToast(`You purchased ${b.name}!`);
}


// ----------------------------- Helpers -----------------------------

function fmt(n) { return n?.toLocaleString?.() ?? String(n); }

// ----------------------------- Business UI -----------------------------
function displayOwnedBusinesses() {
  const container = document.getElementById("owned-businesses");
  if (!container) return;
  container.innerHTML = "";

  if (!player.ownedBusinesses || player.ownedBusinesses.length === 0) {
    container.innerHTML = "<p>No businesses yet.</p>";
    return;
  }

  player.ownedBusinesses.forEach(biz => {
    const div = document.createElement("div");
    div.className = "business-card owned";
    div.innerHTML = `
      <h4>${biz.name}</h4>
      <p>Profit: $${fmt(biz.profitPerYear)}/yr</p>
      <p>Level: ${biz.level}</p>
    `;

    // ✅ Determine which tab the business came from
    if (biz.origin === "businessTab") {
      div.addEventListener("click", () => openBusinessManagement(biz));
    } else if (biz.origin === "entrepreneurTab") {
      div.addEventListener("click", () => openSpecificBusinessTab(biz.id));
    } else {
      // fallback, just in case
      div.addEventListener("click", () => openBusinessManagement(biz));
    }

    container.appendChild(div);
  });
}

// ----------------------------- Management Modal -----------------------------
function openBusinessManagement(business) {
  // Auto-repair any invalid values before doing math
Object.assign(business, normalizeBusiness(business));
  // normalize
  business.level ??= 1;
  business.efficiency ??= 1;
  business.marketTrend ??= 1;
  business.hasManager ??= false;
  business.products ??= []; // { name, price, demand }
  business.employees ??= 0;
  business.employeeList ??= []; // [{name, role, salary, productivity}]
  if (isNaN(business.profitPerYear) || !business.profitPerYear) business.profitPerYear = business.cost * 0.2;
  business.profitPerYear ??= business.cost * 0.3;
  business.ownership ??= 100; // percent

if (
  isNaN(business.profitPerYear) ||
  isNaN(business.cost) ||
  isNaN(business.level)
) {
  console.warn("⚠️ Auto-fixed invalid values for:", business.name);
  Object.assign(business, normalizeBusiness(business));
}



  // computed costs
  const upgradeCost = Math.round(business.cost * 0.7 * business.level);
  const managerCost = Math.round(business.cost * 0.25);
  const sellValue = Math.round(business.cost * business.level * 0.8 * (business.ownership / 100));
  const investmentCost = Math.round(business.cost * 0.5 * business.level);
 const collectBase = (safeNum(business.profitPerYear, business.cost * 0.2) / 12)
  * safeNum(business.level, 1)
  * safeNum(business.efficiency, 1)
  * safeNum(business.marketTrend, 1);
  const productCost = Math.round(business.cost * 0.15);
  const surveyCost = Math.round(business.cost * 0.08 * (1 + business.level * 0.02));
  const employeeHireCost = Math.round(business.cost * 0.05);

  // build modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${business.name} (Lvl ${business.level})</h2>
      <p><strong>Ownership:</strong> ${business.ownership}% • <strong>Manager:</strong> ${business.hasManager ? '✅' : '❌'}</p>
      <p><strong>Employees:</strong> ${business.employees} (${business.employeeList.length}) • <strong>Products:</strong> ${business.products.length}</p>
      <p><strong>Market Trend:</strong> ${(business.marketTrend * 100).toFixed(0)}% • <strong>Efficiency:</strong> ${(business.efficiency * 100).toFixed(0)}%</p>
      <hr/>
      <div class="biz-products">
        <h4>Products</h4>
        <ul id="biz-product-list">
          ${business.products.map(p => `<li>${p.name} — $${p.price} (d:${p.demand})</li>`).join('') || '<li>No products</li>'}
        </ul>
      </div>
      <div class="biz-employees">
        <h4>Employees</h4>
        <ul id="biz-employee-list">
          ${business.employeeList.map(e => `<li>${e.name} — ${e.role} — $${e.salary}/mo (prod:${e.productivity})</li>`).join('') || '<li>No employees</li>'}
        </ul>
      </div>
      <hr/>
      <div class="business-actions">
        <button id="collect-btn">💰 Collect Profit</button>
        <button id="invest-btn">📈 Invest ($${investmentCost})</button>
        <button id="upgrade-btn">⬆️ Upgrade ($${upgradeCost})</button>
        <button id="manager-btn">👔 Hire Manager ($${managerCost})</button>
        <button id="advertise-btn">📢 Advertise ($${Math.round(business.cost * 0.12)})</button>
        <button id="survey-btn">📊 Launch Survey ($${surveyCost})</button>
        <button id="product-btn">🧃 Add Product ($${productCost})</button>
        <button id="edit-btn">✏️ Edit Product</button>
        <button id="hire-employee-btn">👷 Hire Employee ($${employeeHireCost})</button>
        <button id="payroll-btn">💸 Run Payroll</button>
        <button id="partial-sell-btn">🏦 Sell Shares</button>
        <button id="sell-btn">💵 Sell Company ($${fmt(sellValue)})</button>
      </div>
      <div style="margin-top:12px; text-align:left; font-size:0.9em; color:#ccc;">
        Tip: employee productivity increases profit; happy employees reduce turnover.
    </div>
  `;
  document.body.appendChild(modal);

  // close handler
 modal.querySelector('.close').onclick = () => {
  modal.remove();
  displayOwnedBusinesses();
};


  // ---------- ACTIONS ----------

  // Collect profit: realistic fluctuation based on stats, employees, products
  modal.querySelector('#collect-btn').onclick = () => {
    // factors: base, product demand, employees, player stats
    const productDemandFactor = business.products.length ? (business.products.reduce((s,p)=>s+p.demand,0)/business.products.length)/50 : 1;
    const employeeProd = business.employeeList.reduce((s,e)=>s+(e.productivity||1), 0) || (business.hasManager ? 2 : 1);
    const intelligenceFactor = clamp(1 + (player.intelligence || 50)/200, 0.9, 2.0);
    const stressPenalty = clamp(1 - (player.stress || 0)/300, 0.6, 1.0);
    const randomVar = 0.85 + Math.random()*0.3; // +/-15%
    let profit = Math.round(collectBase * productDemandFactor * (employeeProd/1.5) * intelligenceFactor * stressPenalty * randomVar);

    // adjust if manager
    if (business.hasManager) profit = Math.round(profit * 1.12);

    player.money += profit;
    player.happiness += 1;
    showToast(`Collected $${fmt(profit)} from ${business.name}.`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Invest: risk / reward depends on player stats
  modal.querySelector('#invest-btn').onclick = () => {
    const cost = investmentCost;
    if (player.money < cost) return showToast('Not enough money to invest.');
    player.money -= cost;

    const luck = Math.random();
    const skill = ((player.intelligence||50) + (player.reputation||10) + (player.happiness||50)) / 300;
    const score = luck + skill;

    if (score > 0.85) {
      business.marketTrend = clamp(business.marketTrend + 0.2, 0.5, 3);
      if (isNaN(business.profitPerYear) || !business.profitPerYear) business.profitPerYear = business.cost * 0.2;
      business.profitPerYear *= 1.45;
      player.reputation += 3;
      player.happiness += 3;
      showToast(`Investment succeeded! ${business.name} surged.`);
    } else if (score > 0.55) {
      business.marketTrend = clamp(business.marketTrend + 0.08, 0.5, 2);
      if (isNaN(business.profitPerYear) || !business.profitPerYear) business.profitPerYear = business.cost * 0.2;
      business.profitPerYear *= 1.18;
      player.reputation += 1;
      showToast('Investment yielded moderate gains.');
    } else {
      business.marketTrend = clamp(business.marketTrend - 0.08, 0.2, 2);
      if (isNaN(business.profitPerYear) || !business.profitPerYear) business.profitPerYear = business.cost * 0.2;
      business.profitPerYear *= 0.9;
      player.stress += 3;
      player.happiness -= 2;
      showToast('Investment failed. Market confidence slipped.');
    }

    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Upgrade
  modal.querySelector('#upgrade-btn').onclick = () => {
    if (player.money < upgradeCost) return showToast('Not enough money to upgrade.');
    player.money -= upgradeCost;
    business.level++;
    if (isNaN(business.profitPerYear) || !business.profitPerYear) business.profitPerYear = business.cost * 0.2;
    business.profitPerYear = Math.round(business.profitPerYear * 1.35);
    business.efficiency = clamp(business.efficiency + 0.06, 0.5, 2);
    player.reputation += 2;
    player.stress += 1;
    showToast(`${business.name} upgraded to level ${business.level}.`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Hire Manager
  modal.querySelector('#manager-btn').onclick = () => {
    if (business.hasManager) return showToast('Manager already hired.');
    if (player.money < managerCost) return showToast('Not enough to hire manager.');
    player.money -= managerCost;
    business.hasManager = true;
    player.stress = Math.max(0, (player.stress || 0) - 3);
    showToast('Manager hired. Passive income will improve.');
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Advertise
  modal.querySelector('#advertise-btn').onclick = () => {
    const cost = Math.round(business.cost * 0.12);
    if (player.money < cost) return showToast('Not enough for advertising.');
    player.money -= cost;
    business.marketTrend = clamp(business.marketTrend + (0.07 + Math.random()*0.06), 0.3, 3);
    player.reputation += 2;
    showToast('Advertising boosted visibility.');
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Survey
  modal.querySelector('#survey-btn').onclick = () => {
    if (player.money < surveyCost) return showToast('Not enough to run survey.');
    player.money -= surveyCost;
    const r = Math.random();
    if (r < 0.28) {
      business.marketTrend = clamp(business.marketTrend - 0.05, 0.2, 3);
      player.happiness -= 1;
      showToast('Survey showed poor reception.');
    } else {
      business.marketTrend = clamp(business.marketTrend + 0.08, 0.3, 3);
      player.reputation += 1;
      player.happiness += 1;
      showToast('Survey revealed winning features — market interest rose.');
    }
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Add Product
  modal.querySelector('#product-btn').onclick = () => {
    if (player.money < productCost) return showToast('Not enough to launch a product.');
    const name = prompt('Product name:');
    if (!name) return;
    const price = parseInt(prompt('Selling price (number):') || '0', 10) || Math.round(business.cost * 0.02);
    const demand = clamp(parseInt(prompt('Initial demand (1-100):')||'50',10), 1, 100);
    player.money -= productCost;
    business.products.push({ name, price, demand });
    player.reputation += 1;
    player.stress += 1;
    showToast(`Launched product "${name}".`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Edit Product
  modal.querySelector('#edit-btn').onclick = () => {
    if (!business.products.length) return showToast('No products to edit.');
    const names = business.products.map(p => p.name).join(', ');
    const oldName = prompt(`Products: ${names}\nEnter product name to edit:`);
    const idx = business.products.findIndex(p => p.name === oldName);
    if (idx === -1) return showToast('Product not found.');
    const newName = prompt('New product name:', business.products[idx].name);
    const newPrice = parseInt(prompt('New price:', business.products[idx].price) || business.products[idx].price, 10);
    const newDemand = clamp(parseInt(prompt('Demand (1-100):', business.products[idx].demand) || business.products[idx].demand,10),1,100);
    business.products[idx] = { name: newName || business.products[idx].name, price: newPrice, demand: newDemand };
    player.reputation += 1;
    showToast('Product updated.');
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Hire Employee
  modal.querySelector('#hire-employee-btn').onclick = () => {
    if (player.money < employeeHireCost) return showToast('Not enough to hire.');
    const name = prompt('Employee name:') || `Hire${business.employeeList.length+1}`;
    const role = prompt('Role/title:') || 'Staff';
    const salary = parseInt(prompt('Monthly salary:', Math.round(business.cost * 0.02)) || Math.round(business.cost * 0.02), 10);
    const productivity = clamp(parseFloat(prompt('Productivity (0.5-2.0):', '1.0')||'1.0'), 0.5, 2);
    player.money -= employeeHireCost;
    business.employees++;
    business.employeeList.push({ name, role, salary, productivity });
    player.happiness += 1;
    showToast(`Hired ${name} as ${role}.`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Payroll (pay monthly salaries) — reduces player.money, increases efficiency slightly
  modal.querySelector('#payroll-btn').onclick = () => {
    const totalSalaries = business.employeeList.reduce((s,e)=>s + (e.salary || 0),0);
    if (player.money < totalSalaries) return showToast('Not enough to run payroll!');
    player.money -= totalSalaries;
    // happy employees -> small efficiency boost
    business.efficiency = clamp(business.efficiency + (0.02 * business.employeeList.length), 0.5, 2.5);
    player.happiness += Math.min(3, business.employeeList.length);
    showToast(`Payroll executed: paid $${fmt(totalSalaries)} in salaries.`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Partial Sell Shares
  modal.querySelector('#partial-sell-btn').onclick = () => {
    const percent = parseInt(prompt(`Enter % to sell (1-${business.ownership}):`), 10);
    if (!percent || percent < 1 || percent > business.ownership) return showToast('Invalid percentage.');
    const value = Math.round(business.cost * business.level * (percent/100) * business.marketTrend * 0.85);
    player.money += value;
    business.ownership -= percent;
    player.reputation = Math.max(0, (player.reputation || 0) - Math.round(percent/10));
    showToast(`Sold ${percent}% of ${business.name} for $${fmt(value)}.`);
    updateStats();
    modal.remove(); openBusinessManagement(business);
  };

  // Full Sell
  modal.querySelector('#sell-btn').onclick = () => {
    if (!confirm(`Sell ${business.name} for $${fmt(sellValue)}?`)) return;
    player.money += sellValue;
    player.ownedBusinesses = (player.ownedBusinesses || []).filter(x => x.name !== business.name);
    player.reputation += 2;
    player.happiness += 3;
    showToast(`Sold ${business.name} for $${fmt(sellValue)}.`);
    updateStats();
    modal.remove();
    displayOwnedBusinesses();
  };
  
  
  // cleanup: ensure display refresh on close
  modal.addEventListener('remove', () => displayOwnedBusinesses());
}

// ----------------------------- Passive collection helper -----------------------------
// ===================== REALISTIC COMPANY FINANCES ===================== //
function calculateBusinessIncome(biz) {
  // calculate real monthly profit based on factors
  const baseMonthly = (biz.profitPerYear / 12) || (biz.cost * 0.2 / 12);
  const employeesFactor = 1 + (biz.employeeList.length * 0.03);
  const trendFactor = biz.marketTrend || 1;
  const efficiencyFactor = biz.efficiency || 1;
  const randomFactor = 0.9 + Math.random() * 0.2; // ±10%

  let profit = baseMonthly * employeesFactor * trendFactor * efficiencyFactor * randomFactor;

  // apply manager boost
  if (biz.hasManager) profit *= 1.1;

  // minor stress penalty
  profit *= 1 - Math.min((player.stress || 0) / 300, 0.3);

  // ensure valid
  if (isNaN(profit) || profit < 0) profit = 0;

  return Math.round(profit);
}

// Called every month or every year depending on your system
function syncBusinessFinances() {
  if (!player.ownedBusinesses?.length) return;

  player.ownedBusinesses.forEach(biz => {
    Object.assign(biz, normalizeBusiness(biz));

    // Initialize balance if not present
    biz.balance = safeNum(biz.balance, 0);

    // Calculate profit and add to balance
    const monthlyProfit = calculateBusinessIncome(biz);
    biz.balance += monthlyProfit;

    // Optional: record last income for analytics
    biz.lastIncome = monthlyProfit;
  });
}

// ===================== YEARLY SYNC (INTEGRATION) ===================== //
function yearlyScenarioSync() {
  // collect passive income first
  syncBusinessFinances();

  // simulate growth, morale, and market trends
  player.ownedBusinesses.forEach(biz => {
    // Random market drift
    biz.marketTrend = clamp(biz.marketTrend * (0.95 + Math.random() * 0.1), 0.5, 2.5);

    // morale affects next year profit
    const moraleEffect = (biz.morale || 100) / 100;
    biz.profitPerYear = Math.round(biz.profitPerYear * moraleEffect * (0.9 + Math.random() * 0.2));

    // employees' turnover risk
    if (biz.employeeList.length > 0 && Math.random() < 0.05) {
      biz.employeeList.pop(); // random resignation
      showToast(`${biz.name} lost an employee this year.`);
    }
  });

  const yearlyExpenses = calculateTotalExpenses();
player.money -= yearlyExpenses;
showToast(`💸 Paid yearly expenses: $${yearlyExpenses.toLocaleString()}`);
updateStats();

  // optionally call other yearly scenario functions
  if (typeof checkYearlyScenarioTrigger === "function") checkYearlyScenarioTrigger();
  updateStats();
}

// ===================== PLAYER COLLECT PROFITS ===================== //
function collectCompanyProfit(biz) {
  if (!biz.balance || biz.balance <= 0) {
    return showToast(`No available profits in ${biz.name} yet.`);
  }

  const collected = Math.round(biz.balance);
  player.money += collected;
  biz.balance = 0;

  player.happiness += 1;
  showToast(`Collected $${fmt(collected)} from ${biz.name}'s available profits.`);
  updateStats();
  displayOwnedBusinesses();
}
