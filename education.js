// ===================== SYNC EDUCATION STAGES ===================== //
function replaceModalContent(modal, html) {
  // 🧩 Make sure modal is in the DOM before we touch its content
  if (!document.body.contains(modal)) {
    document.body.appendChild(modal);
  }

  // 🧹 Clear any existing content to avoid stacking modals
  modal.innerHTML = html;

  // ✨ Optional: smooth fade-in (just for UX polish)
  modal.style.opacity = 0;
  modal.style.transition = "opacity 0.25s ease";
  requestAnimationFrame(() => { modal.style.opacity = 1; });

  // ❌ Add close button listener if it exists
  const closeBtn = modal.querySelector(".close");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      modal.style.opacity = 0;
      setTimeout(() => modal.remove(), 250);
    };
  }
}

player.educationStage = player.schoolStage; // always sync stages

// ===================== STUDY YEARLY ===================== //
function studyYearly() {
  if (player.age < 7 || player.age > 22) return;

  // auto stage detection
  if (player.age < 13) player.schoolStage = "elementary";
  else if (player.age < 16) player.schoolStage = "middle";
  else if (player.age < 19) player.schoolStage = "high";
  else player.schoolStage = "college";

  player.educationStage = player.schoolStage;

  // yearly skill growth
  const focus = Math.random();
  if (focus < 0.4) player.skills.academic += 2;
  else if (focus < 0.7) player.skills.social += 2;
  else player.skills.creativity += 2;

  if (Math.random() < 0.3) player.skills.athletic += 2;

  // 🎯 Sport practice benefit
  if (player.chosenSport) {
    player.sportSkill = Math.min((player.sportSkill || 0) + 2, 100);
  }
if (!player.chosenSport) player.chosenSport = null;
if (player.sportSkill === undefined) player.sportSkill = 0;
  updateSportHUD();

  // 🎨 Club skill benefit
  if (player.joinedClubs && player.joinedClubs.length > 0) {
    player.joinedClubs.forEach(club => {
      player.clubSkills[club] = Math.min((player.clubSkills[club] || 0) + 1, 100);
    });
  }

  // milestone completions
  if ([12, 16, 19, 22].includes(player.age)) {
    player.educationLevel++;
    showToast(`🎓 You completed ${player.schoolStage} school!`);
  }

  // 👁️ Update all HUD stats after yearly gain
  updateStats();
}
// ===================== SCHOOL MODAL ===================== //
const openSchoolBtn = document.getElementById("study-tab-btn");
openSchoolBtn.addEventListener("click", openSchoolModal);

function openSchoolModal() {
  if (player.age < 7 || player.age > 22) return showToast("You are not in school.");

  // Determine stage
  let stage;
  if (player.age < 13) stage = "elementary";
  else if (player.age < 16) stage = "middle";
  else if (player.age < 19) stage = "high";
  else stage = "college";
  player.educationStage = stage;

  // Initialize player school data if missing
  if (!player.chosenSport) player.chosenSport = null;
  if (player.sportSkill === undefined) player.sportSkill = 0;
  updateSportHUD();

  if (!player.joinedClubs) player.joinedClubs = [];
  if (!player.clubSkills) player.clubSkills = {};

  // Create modal
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);
  
// ===================== SPORT SELECTION ===================== //
  function chooseSport() {
    if (player.chosenSport) return showToast(`You already chose ${player.chosenSport}!`);
    replaceModalContent(
      modal,
      `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>🏅 Choose Your Sport</h2>
        <div class="button-group">
          <button id="sport-basketball">🏀 Basketball</button>
          <button id="sport-soccer">⚽ Soccer</button>
          <button id="sport-swimming">🏊 Swimming</button>
          <button id="sport-track">🏃 Track & Field</button>
        </div>
      </div>
      `
    );
    modal.querySelector(".close").onclick = () => refreshSchoolActivities();
    modal.querySelectorAll("button[id^='sport']").forEach((btn) => {
      btn.onclick = () => {
        const sport = btn.textContent.split(" ")[1];
        player.chosenSport = sport;
        player.sportSkill = 0;
        showToast(`You joined ${sport}!`);
        updateSportHUD();
        refreshSchoolActivities();
      };
    });
  }

  // ===================== CLUB SELECTION ===================== //
  function chooseClub() {
    const maxClubs = 2;
    if (player.joinedClubs.length >= maxClubs)
      return showToast("You can’t join more clubs!");

    replaceModalContent(
      modal,
      `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>🎭 Join a Club</h2>
        <div class="button-group">
          <button id="club-music">🎵 Music Club</button>
          <button id="club-art">🎨 Art Club</button>
          <button id="club-science">🔬 Science Club</button>
          <button id="club-drama">🎭 Drama Club</button>
        </div>
      </div>
      `
    );
    modal.querySelector(".close").onclick = () => refreshSchoolActivities();
    modal.querySelectorAll("button[id^='club']").forEach((btn) => {
      btn.onclick = () => {
        const club = btn.textContent.split(" ")[1];
        if (player.joinedClubs.includes(club))
          return showToast(`You’re already in ${club} Club!`);
        player.joinedClubs.push(club);
        player.clubSkills[club] = 0;
        showToast(`You joined the ${club} Club!`);
        refreshSchoolActivities();
      };
    });
  }

// ===================== CHOOSE CLASSMATE ===================== //
function chooseClassmate(stage, classmates) {
  replaceModalContent(
    modal,
    `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Classmates</h2>
      <div class="button-group" id="classmate-list"></div>
    </div>
    `
  );

  modal.querySelector(".close").onclick = () => refreshSchoolActivities();

  const list = modal.querySelector("#classmate-list");

  classmates.forEach((c) => {
    const btn = document.createElement("button");
    btn.textContent = `${c.name} (${c.personality})`;
    btn.onclick = () => interactWithClassmate(c); // Opens interaction modal
    list.appendChild(btn);
  });
}

// ===================== CHOOSE ROMANTIC INTEREST ===================== //
function chooseRomanticInterest(stage, candidates) {
  replaceModalContent(
    modal,
    `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>❤️ Choose Someone to Date</h2>
      <p>Select someone you want to spend more time with:</p>
      <div class="button-group" id="romantic-list"></div>
    </div>
    `
  );

  modal.querySelector(".close").onclick = () => refreshSchoolActivities();
  const list = modal.querySelector("#romantic-list");

  candidates.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = `${c.name} (${c.personality})`;
    btn.onclick = () => {
      startRomanticRelationship(c, "college sweetheart");
      interactWithRomanticInterest(c); // immediately open interaction modal
    };
    list.appendChild(btn);
  });
}


// ===================== INTERACT WITH ROMANTIC INTEREST ===================== //
function interactWithRomanticInterest(partner) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);

  function renderActivityButtons() {
    replaceModalContent(modal, `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Interact with ${partner.name}</h3>
        <p><strong>Personality:</strong> ${partner.personality}</p>
        <p><strong>Relationship Score:</strong> ${partner.relationshipScore}</p>
        <div class="button-group" id="activity-buttons"></div>
      </div>
    `);

    modal.querySelector(".close").onclick = () => modal.remove();

    const container = modal.querySelector("#activity-buttons");

    const activities = [
      {
        label: "💬 Chat",
        action: () => {
          partner.relationshipScore += 10;
          player.happiness += 5;
          startRomanticRelationship(partner, partner.gender === "male" ? "boyfriend" : "girlfriend");
          showToast(`You had a nice chat with ${partner.name}! Relationship +10`);
          renderActivityButtons();
        },
      },
      {
        label: "📖 Study Together",
        action: () => {
          gainSkill("academic", 3, `You studied with ${partner.name}.`);
          partner.relationshipScore += 7;
          startRomanticRelationship(partner, partner.gender === "male" ? "boyfriend" : "girlfriend");
          showToast(`You studied together. Relationship +7`);
          renderActivityButtons();
        },
      },
      {
        label: "🎉 Hang Out",
        action: () => {
          partner.relationshipScore += 15;
          player.happiness += 8;
          startRomanticRelationship(partner, partner.gender === "male" ? "boyfriend" : "girlfriend");
          showToast(`You hung out with ${partner.name}. Relationship +15`);
          renderActivityButtons();
        },
      },
      {
        label: "🎁 Give a Gift",
        action: () => {
          partner.relationshipScore += 12;
          player.happiness += 5;
          startRomanticRelationship(partner, partner.gender === "male" ? "boyfriend" : "girlfriend");
          showToast(`You gave a gift to ${partner.name}. Relationship +12`);
          renderActivityButtons();
        },
      },
      {
        label: "💏 Flirt / Kiss",
        action: () => {
          if (player.age < 16) {
            showToast("You're too young for this action.");
            return;
          }
          partner.relationshipScore += 20;
          player.happiness += 10;
          startRomanticRelationship(partner, partner.gender === "male" ? "boyfriend" : "girlfriend");
          showToast(`You flirted with ${partner.name}. Relationship +20`);
          renderActivityButtons();
        },
      }
    ];

    activities.forEach(act => {
      const btn = document.createElement("button");
      btn.textContent = act.label;
      btn.onclick = act.action;
      container.appendChild(btn);
    });
  }

  renderActivityButtons();
}




// ===================== CLASSMATE GENERATOR ===================== //
function generateClassmates(stage) {
  const firstNamesMale = ["Alex", "Chris", "Jordan", "Logan", "Milo", "Nash"];
  const firstNamesFemale = ["Emma", "Sophia", "Olivia", "Ava", "Mia", "Luna"];
  const personalities = ["Friendly", "Shy", "Outgoing", "Funny", "Serious", "Creative"];
  const lifeStories = [
    "Loves painting and drawing.",
    "Has a part-time job at the local cafe.",
    "Enjoys sports and fitness.",
    "A top student in academics.",
    "Dreams of traveling the world.",
    "Plays in a local band."
  ];
  const familyBackgrounds = [
    "Comes from a wealthy family with a strong academic tradition.",
    "Grew up in a small town with supportive parents.",
    "Has a single parent who works two jobs.",
    "Comes from a family of artists and musicians.",
    "Grew up with siblings and enjoys family gatherings.",
    "Parents are both teachers, very focused on education.",
    "Has a large extended family and is very social.",
    "Family struggled financially but values hard work and perseverance."
  ];
  const interestsList = ["Sports", "Music", "Art", "Science", "Drama"];

  return Array.from({ length: 5 }, () => {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = gender === "male"
      ? firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]
      : firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];
    const bio = lifeStories[Math.floor(Math.random() * lifeStories.length)];
    const family = familyBackgrounds[Math.floor(Math.random() * familyBackgrounds.length)];
    const interests = interestsList[Math.floor(Math.random() * interestsList.length)];
    return {
      name,
      personality,
      gender,
      lifeStory: bio,
      familyBackground: family,
      interests,
      relationshipScore: Math.floor(Math.random() * 40) + 30
    };
  });
}

// ===================== INTERACT WITH CLASSMATE ===================== //
function interactWithClassmate(classmate) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);

  function renderActivityButtons() {
    replaceModalContent(modal, `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Interact with ${classmate.name} (${classmate.gender})</h3>
        <p><strong>Personality:</strong> ${classmate.personality}</p>
        <p><strong>Interests:</strong> ${classmate.interests}</p>
        <p><strong>Relationship Score:</strong> ${classmate.relationshipScore}</p>
        <div class="button-group" id="activity-buttons"></div>
      </div>
    `);

    modal.querySelector(".close").onclick = () => modal.remove();

    const container = modal.querySelector("#activity-buttons");

    const activities = [
      {
        label: "💬 Chat",
        action: () => {
          classmate.relationshipScore += 8;
          player.happiness += 3;
          addOrUpdateFriend(classmate);
          showToast(`You had a nice chat with ${classmate.name}! Relationship +8`);
          renderActivityButtons();
        },
      },
      {
        label: "📖 Study Together",
        action: () => {
          gainSkill("academic", 3, `You studied with ${classmate.name}.`);
          classmate.relationshipScore += 5;
          addOrUpdateFriend(classmate);
          showToast(`You studied with ${classmate.name}. Relationship +5`);
          renderActivityButtons();
        },
      },
      {
        label: "🎉 Hang Out",
        action: () => {
          classmate.relationshipScore += 12;
          player.happiness += 5;
          addOrUpdateFriend(classmate);
          showToast(`You had a fun hangout with ${classmate.name}! Relationship +12`);
          renderActivityButtons();
        },
      },
      {
        label: "🎁 Give a Gift",
        action: () => {
          classmate.relationshipScore += 10;
          player.happiness += 2;
          addOrUpdateFriend(classmate);
          showToast(`You gave a gift to ${classmate.name}. Relationship +10`);
          renderActivityButtons();
        },
      },
      {
        label: "📝 Help with Homework",
        action: () => {
          gainSkill("academic", 2, `You helped ${classmate.name} with homework.`);
          classmate.relationshipScore += 7;
          addOrUpdateFriend(classmate);
          showToast(`You helped ${classmate.name}. Relationship +7`);
          renderActivityButtons();
        },
      },
      {
        label: "🎭 Join Activity/Club",
        action: () => {
          classmate.relationshipScore += 6;
          player.happiness += 2;
          addOrUpdateFriend(classmate);
          showToast(`You joined an activity with ${classmate.name}. Relationship +6`);
          renderActivityButtons();
        },
      }
    ];

    // Flirt option for age >= 16
    if (player.age >= 16) {
      activities.push({
        label: "❤️ Flirt",
        action: () => {
          classmate.relationshipScore += 5;
          player.happiness += 1;
          addOrUpdateFriend(classmate);
          showToast(`You flirted with ${classmate.name}. Relationship +5`);
          renderActivityButtons();
        },
      });
    }

    activities.forEach(act => {
      const btn = document.createElement("button");
      btn.textContent = act.label;
      btn.onclick = act.action;
      container.appendChild(btn);
    });
  }

  renderActivityButtons();
}

 // ===================== REFRESH MAIN SCHOOL SCREEN ===================== //
function refreshSchoolActivities() {
  // Automatically get the current stage from player
  const stage = player.educationStage || "middle"; // default to middle if undefined
  console.log("Current stage:", stage);

  replaceModalContent(
    modal,
    `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${player.educationStage === "college" ? "College Life" : "School Life"}</h2>
      <p>Choose an activity:</p>
      <div id="school-activities" class="button-group"></div>
    </div>
    `
  );

  modal.querySelector(".close").onclick = () => modal.remove();
  const container = modal.querySelector("#school-activities");

  // ===== Training Activities =====
  const trainingActivities = [];
  if (player.chosenSport) {
    trainingActivities.push({
      label: `🏋️ Train ${player.chosenSport} (${player.sportSkill} skill)`,
      action: () => {
        player.sportSkill = Math.min(player.sportSkill + 5, 100);
        gainSkill("athletic", 3, `You trained ${player.chosenSport}. Sport skill +5!`);
        updateSportHUD();
        refreshSchoolActivities(); // recursive call
      },
    });
  }

  player.joinedClubs.forEach((club) => {
    trainingActivities.push({
      label: `📚 Train ${club} Club (${player.clubSkills[club]} skill)`,
      action: () => {
        player.clubSkills[club] = Math.min(player.clubSkills[club] + 3, 100);
        gainSkill("creativity", 2, `You practiced in ${club} Club. Club skill +3!`);
        refreshSchoolActivities();
      },
    });
  });

  // ===== Standard Activities =====
  const standardActivities = [
    {
      label: "📚 Study",
      action: () =>
        gainSkill(
          "academic",
          stage === "college" ? 5 : stage === "high" ? 4 : stage === "middle" ? 2 : 1,
          "You studied and improved your skills!"
        ),
    },
    { label: "⚽ Play Sports", action: chooseSport },
    { label: "🎭 Join Club", action: chooseClub },
    { label: "💬 Interact with Classmate", action: () => {
        const classmates = generateClassmates(stage);
        chooseClassmate(stage, classmates);
      }
    },
    ...trainingActivities,
  ];

  // ===== College-only Romantic Activity =====
  if (stage === "college") {
    standardActivities.push({
      label: "❤️ Date Someone",
      action: () => {
        const candidates = generateClassmates(stage);
        chooseRomanticInterest(stage, candidates);
      },
    });
  }

  // ===== Render Buttons =====
  standardActivities.forEach((act) => {
    const btn = document.createElement("button");
    btn.textContent = act.label;
    btn.onclick = act.action;
    container.appendChild(btn);
  });
}

// ===== Initialize Menu Automatically =====
refreshSchoolActivities();

}

// ===================== ADD FRIEND TO RELATIONSHIP TAB ===================== //
function addOrUpdateFriend(classmate) {
  ensureRelationships();

  // Check if friend already exists
  const existing = player.relationships.friends.find(f => f.name === classmate.name);
  if (existing) {
    existing.relationshipScore = classmate.relationshipScore;
  } else {
    player.relationships.friends.push({
      name: classmate.name,
      type: "friend",
      relationshipScore: classmate.relationshipScore
    });
  }

  // Refresh relationships tab if it's open
  refreshRelationshipsTab();
}



// ===================== REFRESH RELATIONSHIP TAB ===================== //
function refreshRelationshipsTab() {
  const tab = document.getElementById("open-relationships-tab");
  if (!tab) return; // ✅ Skip if the tab isn't open yet

  // Safely render each section if its container exists
  const familySection = document.getElementById("family-section");
  const romanticSection = document.getElementById("romantic-section");
  const friendshipSection = document.getElementById("friendship-section");
  const otherSection = document.getElementById("other-section");

  renderRelationshipList(familySection, player.relationships.family);
  if (player.relationships.romantic) {
    renderRelationshipList(romanticSection, [player.relationships.romantic]);
  } else if (romanticSection) {
    romanticSection.innerHTML = "<p>You are single</p>";
  }

  renderRelationshipList(friendshipSection, player.relationships.friends);
  renderRelationshipList(otherSection, player.relationships.others);
}


// ===================== HELPERS ===================== //
function gainSkill(skill, amount, msg) {
  if (!player.skills) player.skills = {};
  player.skills[skill] = (player.skills[skill] || 0) + amount;
  player.happiness += 1;
  showToast(msg);
  updateStats();
}

function startRelationship(stage) {
  if (player.relationshipStatus === "in a relationship") return showToast("You're already in a relationship!");
  const partnerTypes = ["girlfriend", "boyfriend", "best friend"];
  const choice = partnerTypes[Math.floor(Math.random() * partnerTypes.length)];
  player.relationshipStatus = "in a relationship";
  player.partnerType = choice;
  showToast(`You started dating your ${choice} at ${stage}!`);
  updateStats();

  // Refresh modal if open
  refreshRelationshipsTab();
}


function joinGreekLife() {
  if (player.gender === "male" && !player.fraternity) {
    player.fraternity = true;
    player.social += 5;
    showToast("You joined a fraternity!");
  } else if (player.gender === "female" && !player.sorority) {
    player.sorority = true;
    player.social += 5;
    showToast("You joined a sorority!");
  } else {
    showToast("You're already in a group!");
  }
  updateStats();
}

// ===================== HIGH SCHOOL GRADUATION ===================== //
function onHighSchoolGraduation() {
  // Create the modal first
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);

  // Replace its content with options
  replaceModalContent(modal, `
    <div class="modal-content">
      <h2>College Options</h2>
      <p>Congratulations on finishing high school! What will you do next?</p>
      <div class="button-group">
        <button id="accept-scholarship">🎓 Attend College</button>
        <button id="skip-college">💼 Skip College</button>
      </div>
    </div>
  `);

  // Handle buttons
  modal.querySelector("#accept-scholarship").onclick = () => {
    player.choseCollege = true;
    player.educationStage = "college";
    showToast("You’re starting college!");
    modal.remove();

    // 👉 Go to the funding options next
    showCollegeFundingModal();
  };

  modal.querySelector("#skip-college").onclick = () => {
    player.choseCollege = false;
    modal.remove();
    showToast("You decided to skip college.");
    openProfessionSelection(); // 🧩 Only open profession if skipping college
  };
}

// ===================== COLLEGE FUNDING MODAL ===================== //
function showCollegeFundingModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);

  replaceModalContent(modal, `
    <div class="modal-content">
      <h2>College Funding Options</h2>
      <p>How would you like to fund your college education?</p>
      <div class="funding-grid">
        <button id="option-athletic">🏈 Athletic Scholarship</button>
        <button id="option-academic">📚 Academic Scholarship</button>
        <button id="option-parttime">💼 Part-time Job</button>
        <button id="option-parents">👪 Parents' Support</button>
        <button id="option-loan">💳 Student Loan</button>
      </div>
    </div>
  `);

  modal.querySelector("#option-athletic").onclick = () => {
    if (player.skills.athletic < 60) return showToast("You need 60+ athletic skill!");
    player.tuition = 0;
    player.collegeFunding = "athletic";
    startCollege("Athletic Scholarship");
    modal.remove();
  };

  modal.querySelector("#option-academic").onclick = () => {
    if (player.skills.academic < 70 && player.intelligence < 70)
      return showToast("You need higher academic/intelligence stats!");
    player.tuition = 0;
    player.collegeFunding = "academic";
    startCollege("Academic Scholarship");
    modal.remove();
  };

  modal.querySelector("#option-parttime").onclick = () => {
    player.tuition = 10000;
    player.collegeFunding = "parttime";
    player.collegeDuration = 5;
    player.partTimeEarnings = 0;
    player.collegeStress = 0;
    startCollege("Part-time Job");
    showToast("💼 You chose to work part-time while studying.");
    modal.remove();
  };

  modal.querySelector("#option-parents").onclick = () => {
    if (player.relationshipWithParents < 60)
      return showToast("Your parents aren’t ready to support you.");
    player.tuition = 0;
    player.collegeFunding = "parents";
    startCollege("Parents' Support");
    modal.remove();
  };

  modal.querySelector("#option-loan").onclick = () => {
    player.debt = (player.debt || 0) + 30000;
    player.tuition = 0;
    player.collegeFunding = "loan";
    startCollege("Student Loan");
    modal.remove();
  };
}

// ===================== START COLLEGE ===================== //
function startCollege(fundingType) {
  player.educationLevel = 3;
  player.inCollege = true;
  player.yearsInCollege = 0;
  showToast(`🎓 You started college through ${fundingType}.`);
  updateStats();
}

// ===================== COLLEGE YEARLY PROGRESSION ===================== //
function handleCollegeYearlyProgress() {
  if (!player.inCollege) return;
  player.yearsInCollege++;

  switch (player.collegeFunding) {
    case "athletic":
      showToast("🏈 Your athletic scholarship covered your tuition this year.");
      break;

    case "academic":
      showToast("📚 Your academic scholarship covered your tuition this year.");
      break;

    case "parents":
      showToast("👪 Your parents helped cover your college expenses this year.");
      break;

    case "loan":
      player.debt = (player.debt || 0) + 2000;
      showToast("💳 Interest was added to your student loan.");
      break;

    case "parttime":
      const earnings = 3000 + Math.floor((player.intelligence + (player.diligence || 50)) / 2);
      player.money += earnings;
      player.tuition = Math.max(0, player.tuition - earnings);
      player.stamina = Math.max(0, (player.stamina || 100) - 5);
      player.happiness = Math.max(0, (player.happiness || 50) - 2);
      player.collegeStress = (player.collegeStress || 0) + 10;
      showToast(`💼 You earned $${earnings.toLocaleString()} from your part-time job this year.`);
      break;
  }

  // 🎓 Graduation check
  if (player.yearsInCollege >= (player.collegeDuration || 4)) {
    onCollegeGraduation();
  } else {
    offerCollegeContinueModal(); // Give the player the choice to continue or drop out
  }

  updateStats();
}

// ===================== CONTINUE OR DROP OUT MODAL ===================== //
function offerCollegeContinueModal() {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  document.body.appendChild(modal);

  replaceModalContent(modal, `
    <div class="modal-content">
      <h3>College Year ${player.yearsInCollege}</h3>
      <p>You’ve made it another year! You feel ${player.collegeStress > 50 ? "stressed 😩" : "motivated 💪"}.</p>
      <div class="button-group">
        <button id="continue-college">Continue College</button>
        <button id="dropout-college">Drop Out</button>
      </div>
    </div>
  `);

  modal.querySelector("#continue-college").onclick = () => {
    showToast("📘 You decided to continue your college journey!");
    modal.remove();
  };

  modal.querySelector("#dropout-college").onclick = () => {
    modal.remove();
    triggerDropout("choice");
  };
}

// ===================== DROP OUT SYSTEM (BY CHOICE) ===================== //
function triggerDropout(reason) {
  player.inCollege = false;
  player.educationStage = "none";
  player.collegeFunding = null;

  let message = "";
  switch (reason) {
    case "choice":
      message = "😔 You decided to drop out of college.";
      break;
    default:
      message = "💤 You left college.";
  }

  showToast(message);
  updateStats();
}

// ===================== ON GRADUATION ===================== //
function onCollegeGraduation() {
  showToast("🎉 Congratulations! You graduated from college!");
  player.inCollege = false;
  player.collegeFunding = null;
  player.partTimeEarnings = 0;
  openProfessionSelection();
}
