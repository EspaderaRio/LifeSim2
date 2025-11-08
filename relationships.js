// ===================== INITIALIZE RELATIONSHIPS ===================== //
function ensureRelationships() {
  if (!player.relationships) {
    player.relationships = {
      family: [],       // parents & siblings
      friends: [],      // friends list
      romantic: null,   // romantic partner
      others: []        // coworkers, acquaintances, etc.
    };
  }
}

// ===================== FAMILY GENERATION ===================== //
function generateFamily() {
  const surnames = ["Santos", "Reyes", "Garcia", "Cruz", "Dela Cruz", "Mendoza", "Lopez", "Torres", "Ramos", "Gonzales", "Castro", "Rivera", "Morales", "Flores", "Gutierrez", "Silva", "Romero", "Vargas", "Del Rosario", "Navarro", "Fernandez", "Aguilar", "Dominguez", "Salazar", "Ortiz", "Valdez", "Jimenez", "Alvarez", "Delos Santos", "Santiago", "Rosales", "Padilla", "Velasquez", "Escobar", "Pineda", "Barrios", "Carrillo", "Calderon", "Peña", "Solano", "Marquez", "Valencia", "Camacho", "Fuentes", "Espinoza", "Luna", "Bautista", "Salvador", "Del Mundo", "Aquino", "Alcantara", "Villanueva", "De Leon", "San Juan", "Abad", "Almario", "Buenaventura", "Carpio", "Coronel", "De Vera", "Enriquez", "Ferrer", "Galvez", "Herrera", "Ibanez", "Jacinto", "Lazaro", "Magno", "Natividad", "Olivares", "Palma", "Quintana", "Roxas", "Samson", "Tamayo", "Urbano", "Vergara", "Yambao", "Zamora", "Amador", "Bernal", "Cabrera", "Dizon", "Estrella", "Fajardo", "Gatchalian", "Hilario", "Imperial", "Javier", "Katigbak", "Lim", "Manalo", "Nolasco", "Ocampo", "Pascual", "Quirino", "Revilla", "Soriano", "Tiongson", "Villamor","Arellano", "Balagtas", "Cayetano", "De Guzman", "Echevarria", "Fabian", "Garibay", "Hidalgo", "Ilagan", "Jalandoni", "Kasilag", "Llamas", "Macaraeg", "Neri", "Obispo", "Panganiban", "Quinto", "Rillera", "Sarmiento", "Tabora", "Uson", "Villafuerte", "Ysip", "Zubiri", "Abella", "Bacani", "Cordero", "Del Fierro", "Espiritu", "Feliciano", "Gatus", "Herrero", "Isidro", "Jumalon", "Kalaw", "Labrador", "Malabanan", "Nacino", "Ong", "Paredes", "Quiazon", "Ramoso", "Solis", "Tadena", "Unson", "Valle", "Yap", "Zarate", "Alvarado", "Banzon", "Capistrano", "Dela Peña", "Escudero", "Fuentebella", "Gaviola", "Halili", "Inocencio", "Javellana", "Kintanar", "Ledesma", "Manlapig", "Nolasco", "Ordoñez", "Pangilinan", "Quiambao", "Rañola", "Santos-Viola", "Tañada", "Ulep", "Velez", "Yuzon", "Zabala", "Abueg", "Bautista", "Cunanan", "Dizon", "Eusebio", "Ferrer", "Gonzaga", "Hernandez", "Ignacio", "Jimenez", "Kamagong", "Llamzon", "Magsaysay", "Natividad", "Ocampo", "Padua", "Quintos", "Rigor", "Sicat", "Tolentino", "Urbiztondo", "Villaseñor", "Yatco", "Zialcita", "Almendras", "Bermudez", "Caguioa", "Dela Rama", "Evangelista"];
  const maleNames = ["Juan", "Jose", "Antonio", "Carlos", "Miguel", "Luis", "Manuel", "Andres", "Rafael", "Jorge", "Pedro", "Fernando", "Ricardo", "Eduardo", "Roberto", "Alberto", "Francisco", "Diego", "Mario", "Julio", "Emilio", "Vicente", "Raul", "Enrique", "Tomas", "Hector", "Salvador", "Armando", "Esteban", "Marco", "Gabriel", "Pablo", "Cesar", "Oscar", "Ivan", "Jaime", "Ernesto", "Arturo", "Adrian", "Benjamin", "Joel", "Mauricio", "Guillermo", "Cristian", "Daniel", "Alejandro", "Noel", "Ismael", "Elias", "Martin", "Samuel", "Felipe", "Angel", "Elijah", "Nathan", "Sebastian", "Matias", "Lucas", "Axel", "Leonardo", "Bruno", "Santiago", "Gael", "Emmanuel", "Josue", "Dylan", "Thiago", "Maximo", "Lorenzo", "Bastian", "Alonso", "Nicolas", "Joaquin", "Mateo", "Iker", "Aaron", "Jesus", "Reynaldo", "Ramon", "Melvin", "Arnold", "Dennis", "Gerald", "Vincent", "Edgar", "Raymond", "Clifford", "Wilfred", "Nelson", "Eugene", "Dominic", "Troy", "Stanley", "Harold", "Glenn", "Frederick", "Gilbert", "Allan", "Roderick", "Lloyd", "Alvin", "Bernard", "Calvin", "Dante", "Edison", "Francis", "Gideon", "Harvey", "Irvin", "Jasper", "Kenneth", "Lance", "Marlon", "Noah", "Orlando", "Patrick", "Quentin", "Ricky", "Stephen", "Tristan", "Ulysses", "Victor", "Warren", "Xander", "Yves", "Zachary", "Abel", "Bryan", "Chester", "Daryl", "Edmund", "Felix", "Gino", "Hubert", "Isaias", "Jerome", "Kirk", "Leandro", "Marvin", "Nestor", "Omar", "Paolo", "Quincy", "Rey", "Sergio", "Teddy", "Ulrich", "Vince", "Wendell", "Xavi", "Yohan", "Zoren", "Arnel", "Benjo", "Crisanto", "Dindo", "Elmer", "Froilan", "Gregorio", "Herminio", "Ignatius", "Julius", "Kristoffer", "Lemuel", "Manuelito", "Norberto", "Onofre", "Prospero", "Rogelio", "Santino", "Tomasito", "Urbano", "Vicente", "Wilmer", "Xerxes", "Yancy", "Zaldy", "Amado", "Benedict", "Conrado", "Dennis", "Eman", "Federico", "Gil", "Hilario", "Isagani", "Jerson", "Karlo", "Lazaro", "Melchor", "Nilo", "Othello", "Pio", "Renato", "Simeon", "Teodoro", "Uno", "Valerio", "Wally", "Zandro", "Adriel", "Benedicto", "Carmelo", "Dionisio", "Eliseo", "Florencio", "Gaspar", "Hermes", "Isidro", "Jacinto", "Kalvin", "Levi", "Marcelo", "Nicanor", "Octavio", "Pascual", "Quintin", "Reinaldo", "Santino", "Tiburcio", "Urbano", "Valentin", "Wenceslao", "Xiomar", "Yasser", "Zacarias", "Alonzo", "Braulio", "Celestino", "Delfin", "Ernesto", "Fausto", "Gerardo", "Hilario", "Ignacio", "Jovito", "Kleber", "Luciano", "Modesto", "Noriel", "Ovidio", "Placido", "Querubin", "Rufino", "Severino", "Tadeo", "Ulises", "Vicencio", "Waldo", "Xander", "Ysidro", "Zandro", "Anselmo", "Bartolome", "Ciriaco", "Demetrio", "Evaristo", "Fortunato", "Gregorio", "Honorio", "Inigo", "Justino", "Kiko", "Lauro", "Melanio", "Nemesio", "Omar", "Primitivo", "Quirino", "Ramon", "Silvestre", "Tomas", "Ubaldo", "Venancio", "Wilfredo", "Xerxes", "Yago", "Zosimo", "Artemio", "Basilio", "Conrado", "Damaso", "Esteban", "Filomeno", "Gabino", "Herminio", "Ismael", "Jeremias", "Karlo", "Leandro", "Manuel", "Nilo", "Orencio", "Pio", "Rogelio", "Simeon", "Teofilo", "Victorino", "Willy", "Zaldy"];
  const femaleNames = ["Maria", "Ana", "Isabella", "Sofia", "Camila", "Gabriela", "Angelica", "Clarissa", "Daniela", "Juliana", "Patricia", "Rosa", "Teresa", "Veronica", "Bianca", "Carla", "Diana", "Elena", "Fatima", "Graciela", "Hazel", "Irene", "Jasmine", "Karen", "Lara", "Monica", "Natalie", "Olivia", "Paula", "Queenie", "Rebecca", "Sandra", "Tiffany", "Ursula", "Vanessa", "Wendy", "Xenia", "Yasmin", "Zara", "Abigail", "Beatrice", "Cecilia", "Delia", "Esther", "Florence", "Gloria", "Helena", "Imelda", "Joanna", "Kristine", "Louise", "Margarita", "Nina", "Ophelia", "Phoebe", "Quiana", "Renee", "Selena", "Trisha", "Una", "Valeria", "Wilma", "Ximena", "Yvonne", "Zuleika", "Alicia", "Bernadette", "Charmaine", "Denise", "Elaine", "Frances", "Genevieve", "Hannah", "Isabel", "Jacqueline", "Katrina", "Lilian", "Maricel", "Nicole", "Odette", "Priscilla", "Quintessa", "Rosalinda", "Stephanie", "Tamara", "Unity", "Violeta", "Winona", "Xyla", "Yvette", "Zenaida", "Amelia", "Brenda", "Cristina", "Dorothy", "Eleanor", "Felicia", "Gemma", "Hope", "Ivana", "Janine", "Kimberly", "Lorena", "Melissa", "Nadine", "Ornella", "Penelope", "Quirina", "Raquel", "Sharon", "Talia", "Urbana", "Vivian", "Whitney", "Xochitl", "Ysabel", "Zinnia", "Andrea", "Bethany", "Cheska", "Dahlia", "Emilia", "Faith", "Georgia", "Harriet", "Ines", "Joy", "Kaye", "Leah", "Mikaela", "Noreen", "Odessa", "Pamela", "Queen", "Rochelle", "Sheila", "Trixie", "Ulani", "Venus", "Willa", "Xandra", "Ylona", "Zaira", "Aimee", "Belinda", "Cassandra", "Daisy", "Erica", "Freya", "Giselle", "Holly", "Isla", "Janelle", "Kyla", "Lourdes", "Mae", "Nica", "Orla", "Patrice", "Quella", "Rhea", "Samantha", "Tessa", "Ursina", "Vera", "Wynona", "Xaria", "Yani", "Zita", "Arlene", "Bettina", "Chloe", "Demi", "Evelyn", "Fiona", "Greta", "Hailey", "Indira", "Judy", "Kelsey", "Lana", "Marissa", "Nelly", "Oriana", "Pia", "Quinta", "Rina", "Sylvia", "Tanya", "Ula", "Valentina", "Wanda", "Xyla", "Yumi", "Zahara", "Aubrey", "Brianna", "Caitlin", "Dulce", "Esmeralda", "Farrah", "Gianna", "Helga", "Ivy", "Jemma", "Kiana", "Lacey", "Megan", "Nikita", "Opal", "Presley", "Quenby", "Riley", "Siena", "Tina", "Uma", "Vanna", "Willow", "Xyla", "Yara", "Zelda", "Anika", "Blanca", "Cindy", "Dina", "Elisa", "Flor", "Gwen", "Hilda", "Isha", "Jocelyn", "Keren", "Luz", "Macy", "Nayla", "Oona", "Perla", "Quella", "Rowena", "Soleil", "Tamara", "Ursula", "Vina", "Wren", "Xyla", "Yani", "Zaria", "Arianne", "Bambi", "Carmela", "Doreen", "Eula", "Felicity", "Gilda", "Honor", "Isis", "Jana", "Karla", "Lani", "Mira", "Nerissa", "Odile", "Petra", "Quintina", "Raisa", "Sabel", "Tanya", "Ula", "Vania", "Willa", "Alethea", "Brigida", "Cleo", "Daria", "Eliora", "Florinda", "Gwyneth", "Helga", "Iana", "Jovie", "Kamilah", "Liora", "Milena", "Nayeli", "Odelia", "Paloma", "Querida", "Rosalie", "Soraya", "Tahlia", "Ulani", "Vesper", "Wynne", "Xariah", "Yelena", "Zinnia", "Arianne", "Blythe", "Carmindy", "Dianara", "Elowen", "Faye", "Giovanna", "Hera", "Iliana", "Jaslene", "Keziah", "Lilibeth", "Mireya", "Nerina", "Oriana", "Petal", "Quintessa", "Rumi", "Saphira", "Tirzah", "Umika", "Vianne", "Wrenley", "Xaviera", "Ynez", "Zaylee", "Aubrielle", "Briseis", "Calista", "Delaney", "Eira", "Freesia", "Galilea", "Hollis", "Ivory", "Jazara", "Kaira", "Lunette", "Marigold", "Nahla", "Odessa", "Phaedra", "Quilla", "Ravina", "Selah", "Tamsin", "Urielle", "Vanya", "Winslet", "Xenovia", "Yvaine", "Zosia", "Aisling", "Briar", "Cyra", "Delyth", "Evelina", "Fiorella", "Ginevra", "Havilah", "Isolde", "Jovana", "Kaori", "Liora", "Melisande", "Nixie", "Orlaith", "Primrose", "Raisa", "Sunniva", "Tindra", "Usha", "Vittoria", "Zulema"];

  const surname = surnames[Math.floor(Math.random() * surnames.length)];

  const father = { name: `${maleNames[Math.floor(Math.random() * maleNames.length)]} ${surname}`, type: "father", relationshipScore: 80 };
  const mother = { name: `${femaleNames[Math.floor(Math.random() * femaleNames.length)]} ${surname}`, type: "mother", relationshipScore: 90 };

  const siblings = Array.from({ length: Math.floor(Math.random() * 3) }, () => {
    const gender = Math.random() < 0.5 ? "male" : "female";
    const name = `${gender === "male"
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)]
    } ${surname}`;
    return { name, type: "sibling", relationshipScore: 70 };
  });

  // Sync to player
  ensureRelationships();
  player.relationships.family = [father, mother, ...siblings];
}

// ===================== ADD RELATIONSHIPS ===================== //
function addFriend(name) {
  ensureRelationships();
  player.relationships.friends.push({ name, relationshipScore: 50, type: "friend" });
  showToast(`You became friends with ${name}!`);
  updateStats();
}

function startRomanticRelationship(partnerObj, type = "girlfriend") {
  ensureRelationships();

  // Automatically determine type based on gender
  if (!type) {
    type = partnerObj.gender === "male" ? "boyfriend" : "girlfriend";
  }

  player.relationships.romantic = {
    ...partnerObj,
    type,
    relationshipScore: partnerObj.relationshipScore || 50
  };

  showToast(`You are now in a relationship with ${partnerObj.name} (${type})!`);
  updateStats();

  // Refresh relationships tab if it's open
  refreshRelationshipsTab();
}


function addOtherRelationship(name, type = "coworker") {
  ensureRelationships();
  player.relationships.others.push({ name, type, relationshipScore: 40 });
  showToast(`You added a new ${type}: ${name}`);
  updateStats();
}

// ===================== RELATIONSHIPS TAB ===================== //
const openRelationshipsBtn = document.getElementById("open-relationships-tab");
openRelationshipsBtn.addEventListener("click", openRelationshipsTab);

function openRelationshipsTab() {
  ensureRelationships();

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content" id="relationships-tab-content">
      <span class="close">&times;</span>
      <h2>👥 Your Relationships</h2>
      <div id="family-section"><h3>Family</h3></div>
      <div id="romantic-section"><h3>Romantic</h3></div>
      <div id="friendship-section"><h3>Friends</h3></div>
      <div id="other-section"><h3>Other Relationships</h3></div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  refreshRelationshipsTab(); // ✅ Auto-render when opening
}

// ===================== REFRESH RELATIONSHIP TAB ===================== //
function refreshRelationshipsTab() {
  const tab = document.getElementById("relationships-tab-content");
  if (!tab) return; // ✅ Skip if modal not open

  // Safely get sections
  const familySection = tab.querySelector("#family-section");
  const romanticSection = tab.querySelector("#romantic-section");
  const friendshipSection = tab.querySelector("#friendship-section");
  const otherSection = tab.querySelector("#other-section");

  renderRelationshipList(familySection, player.relationships.family);
  if (player.relationships.romantic) {
    renderRelationshipList(romanticSection, [player.relationships.romantic]);
  } else if (romanticSection) {
    romanticSection.innerHTML = "<p>You are single</p>";
  }

  renderRelationshipList(friendshipSection, player.relationships.friends);
  renderRelationshipList(otherSection, player.relationships.others);
}

// ===================== RENDER RELATIONSHIP LIST ===================== //
function renderRelationshipList(container, list) {
  if (!container) return; // ✅ Prevent null crash

  container.innerHTML = "";
  if (!list || list.length === 0) {
    container.innerHTML = "<p>No relationships here</p>";
    return;
  }

  list.forEach((person) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.marginBottom = "5px";

    const nameLabel = document.createElement("span");
    nameLabel.textContent = person.name;

    const progressContainer = document.createElement("div");
    progressContainer.style.width = "150px";
    progressContainer.style.height = "12px";
    progressContainer.style.backgroundColor = "#ddd";
    progressContainer.style.borderRadius = "6px";
    progressContainer.style.marginLeft = "10px";

    const progressBar = document.createElement("div");
    progressBar.style.width = `${person.relationshipScore || 50}%`;
    progressBar.style.height = "100%";
    progressBar.style.borderRadius = "6px";
    progressBar.style.transition = "width 0.5s ease";
    progressBar.style.backgroundColor =
      person.relationshipScore > 70
        ? "#4CAF50"
        : person.relationshipScore > 40
        ? "#FFC107"
        : "#E53935";

    progressContainer.appendChild(progressBar);
    wrapper.appendChild(nameLabel);
    wrapper.appendChild(progressContainer);

    wrapper.onclick = () => openRelationshipActions(person);
    container.appendChild(wrapper);
  });
}

// ===================== RELATIONSHIP ACTIONS ===================== //
function openRelationshipActions(person) {
  if (person.type === "romantic") {
    interactWithRomanticInterest(person); // Open romantic interaction modal
    return;
  }

  // Otherwise, show normal relationship modal
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>Interact with ${person.name} (${person.type || "other"})</h3>
      <div class="relationship-actions">
        <button id="hangout-btn">💬 Talk / Hang Out</button>
        <button id="gift-btn">🎁 Give Gift</button>
        <button id="compliment-btn">😊 Compliment</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close").onclick = () => modal.remove();

  modal.querySelector("#hangout-btn").onclick = () => { handleRelationshipInteraction(person, "hangout"); modal.remove(); };
  modal.querySelector("#gift-btn").onclick = () => { handleRelationshipInteraction(person, "gift"); modal.remove(); };
  modal.querySelector("#compliment-btn").onclick = () => { handleRelationshipInteraction(person, "compliment"); modal.remove(); };
}


// ===================== HANDLE RELATIONSHIP INTERACTION ===================== //
function handleRelationshipInteraction(person, action) {
  const effects = {
    hangout: { happiness: 5, relationship: 5 },
    gift: { happiness: 10, relationship: 10, money: -500 },
    compliment: { happiness: 3, relationship: 7 },
  };
  const effect = effects[action];

  if (effect.money && player.money < Math.abs(effect.money))
    return showToast("Not enough money to give a gift!");
  if (effect.money) player.money += effect.money;

  player.happiness = Math.min(player.happiness + (effect.happiness || 0), 100);
  person.relationshipScore = Math.min(
    (person.relationshipScore || 50) + (effect.relationship || 0),
    100
  );

  updateStats();
  showToast(`You ${action}ed with ${person.name}. Happiness +${effect.happiness}, Relationship +${effect.relationship}`);

  // ✅ Refresh if tab is open
  refreshRelationshipsTab();
}

