/* ============================================================
BUSINESSLIFE SIMULATOR (Optimized v3 - Debugged + Refined)
============================================================ */
// ===================== IMPORT FUNCTIONS ===================== //


// ===================== PLAYER DATA ===================== //
let player = {
  name: "",
  age: 7,               // start at 7
  month: 1,
  schoolStage: "elementary", // elementary, middle, high, college
  skills: {
    academic: 0,
    athletic: 0,
    social: 0,
    creativity: 0,
  },
  health: 100,
  happiness: 60,
  reputation: 0,
  stress: 0,
  educationLevel: 0,
  money: 10000,
  ownedBusinesses: [],
  ownedLuxury: [],
  profession: null
};

// ===================== FAMILY DATA ===================== //
let family = {
  surname: "",
  father: {},
  mother: {},
  siblings: []
};

// ===================== GLOBAL VARIABLES ===================== //
let businesses = [];
let luxuryItems = {};


const openCareerTab = document.getElementById("career-toggle");
const openMenuTab = document.getElementById("menu-toggle");
const closeMenuTab = document.getElementById("close-menu");
const businessModal = document.getElementById("businessModal");
const luxuryModal = document.getElementById("luxuryModal");
const lifeModal = document.getElementById("lifeModal");

const businessChoices = document.getElementById("business-choices");
const luxuryChoices = document.getElementById("luxury-choices");
const lifeChoices = document.getElementById("life-choices");

const ownedBusinessGrid = document.getElementById("owned-businesses");
const ownedLuxuryGrid = document.getElementById("owned-luxury-grid");
const lifeToggleBtn = document.getElementById("life-toggle");
lifeToggleBtn.addEventListener("click", openLifeTab);

// === CHARACTER CUSTOMIZATION ===
const characterModal = document.getElementById("characterModal");
const openCharacterTab = document.getElementById("open-character-tab");
const closeCharacter = document.getElementById("close-character");
const outfitSelection = document.getElementById("outfit-selection");
const outfitOptions = document.getElementById("outfit-options");
const characterPreview = document.getElementById("character-preview-img");

let playerGender = localStorage.getItem("playerGender") || null;
let playerOutfit = localStorage.getItem("playerOutfit") || null;

// Outfit data
const characterOutfits = {
  female: [
    { id: "polo", src: "assets/female/polo.png" },
    { id: "dress", src: "assets/female/dress.png" },
    { id: "suit", src: "assets/female/suit.png" },
    { id: "suit", src: "assets/female/princess.png" },
    { id: "suit1", src: "assets/female1/suit.svg" }, 
    { id: "athletic", src: "assets/female1/athletic.svg" },
    { id: "cocktail", src: "assets/female1/cocktail.svg" },
    { id: "casual", src: "assets/female1/casual.svg" },
    { id: "polo1", src: "assets/female1/polo.svg" }
  ],
  male: [
    { id: "polo", src: "assets/male/polo.png" },
    { id: "tshirt", src: "assets/male/tshirt.png" },
    { id: "suit", src: "assets/male/suit.png" },
    { id: "prince", src: "assets/male/prince.png" },
    { id: "suit1", src: "assets/male1/suit.svg" }, 
    { id: "athletic", src: "assets/male1/athletic.svg" },
    { id: "cocktail", src: "assets/male1/cocktail.svg" },
    { id: "casual", src: "assets/male1/casual.svg" },
    { id: "polo1", src: "assets/male1/polo.svg" }
  ]
};
