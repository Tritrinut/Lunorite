let lunorite = 100;
let pollution = 0;
let innovation = 0;
let ethique = 100;
let nbSouterraines = 0;
let nbSolaires = 0;
let nbVertes = 0;

const mines = {
    souterraine: { nom: "Mine Souterraine", nb: 0, prod: 1, pollution: 0.5, innovation: 0.2, ethique: -0.2, prix: 50, color: "mine-souterraine" },
    solaire: { nom: "Mine Solaire", nb: 0, prod: 0.7, pollution: 0, innovation: 0.4, ethique: 0.4, prix: 75, color: "mine-solaire" },
    verte: { nom: "Mine Verte", nb: 0, prod: 0.5, pollution: -0.3, innovation: 0.1, ethique: 0.3, prix: 100, color: "mine-verte" }
};

function updateUI() {
    document.getElementById("lunorite-count").textContent = `Lunorite produite : ${Math.floor(lunorite)}`;
    document.getElementById("pollution-count").textContent = pollution.toFixed(1);
    document.getElementById("innovation-count").textContent = innovation.toFixed(1);
    document.getElementById("ethique-count").textContent = ethique.toFixed(1);

    document.getElementById("nbSouterraines").textContent = nbSouterraines;
    document.getElementById("nbSolaires").textContent = nbSolaires;
    document.getElementById("nbVertes").textContent = nbVertes;

    document.getElementById("prix-souterraine").textContent = mines.souterraine.prix;
    document.getElementById("prix-solaire").textContent = mines.solaire.prix;
    document.getElementById("prix-verte").textContent = mines.verte.prix;

    updateMinesAffichage();
    checkAlerts();
}

function acheterMine(type) {
    const m = mines[type];
    if (lunorite >= m.prix) {
        lunorite -= m.prix;
        m.nb++;
        m.prix = Math.floor(m.prix * 1.2);

        if (type === "souterraine") nbSouterraines++;
        if (type === "solaire") nbSolaires++;
        if (type === "verte") nbVertes++;

        addToGrid(m.color, type);
        updateUI();
    } else {
        alert("Pas assez de Lunorite !");
    }
}

function updateMinesAffichage() {
    const container = document.getElementById("factory-list");
    container.innerHTML = "";

    Object.entries(mines).forEach(([key, mine]) => {
        if (mine.nb > 0) {
            const card = document.createElement("div");
            card.className = "factory-card";
            card.innerHTML = `
                <h4>${mine.nom}</h4>
                <div class="stats">
                    Nombre : ${mine.nb}<br>
                    Production : ${(mine.prod * mine.nb).toFixed(1)}/s<br>
                    Pollution : ${(mine.pollution * mine.nb).toFixed(1)}/s<br>
                    Éthique : ${(mine.ethique * mine.nb).toFixed(1)}/s<br>
                    Innovation : ${(mine.innovation * mine.nb).toFixed(1)}/s<br>
                    Coût prochain : ${mine.prix * mine.nb}
                </div>
            `;
            container.appendChild(card);
        }
    });
}

function addToGrid(colorClass, type) {
    const grid = document.getElementById("grid");
    const block = document.createElement("div");
    block.className = `grid-block ${colorClass} usine ${type}`;
    grid.appendChild(block);
    updateMinimapColors(type); 
}

function checkAlerts() {
    const alerts = [];
    if (pollution >= 90) alerts.push("⚠️ Pollution critique !");
    if (ethique <= 20) alerts.push("⚠️ Éthique industrielle en chute libre.");
    document.getElementById("alerts").innerHTML = alerts.map(m => `<p>${m}</p>`).join("");
}

setInterval(() => {
    lunorite += nbSouterraines * mines.souterraine.prod;
    lunorite += nbSolaires * mines.solaire.prod;
    lunorite += nbVertes * mines.verte.prod;

    pollution += nbSouterraines * mines.souterraine.pollution;
    pollution += nbSolaires * mines.solaire.pollution;
    pollution += nbVertes * mines.verte.pollution;

    innovation += nbSouterraines * mines.souterraine.innovation;
    innovation += nbSolaires * mines.solaire.innovation;
    innovation += nbVertes * mines.verte.innovation;

    ethique += nbSouterraines * mines.souterraine.ethique;
    ethique += nbSolaires * mines.solaire.ethique;
    ethique += nbVertes * mines.verte.ethique;

    updateUI();
}, 1000);

const upgrades = {
    souterraine: 0,
    solaire: 0,
    verte: 0
};

const upgradeColors = ["blue", "green", "red", "purple", "black"];
const maxUpgrade = upgradeColors.length;

function ameliorerUsine(type) {
    if (upgrades[type] >= maxUpgrade) return;

    const palier = upgrades[type];
    const cout = 500 * (palier + 1);  
    if (innovation < cout) return;

    innovation -= cout;
    upgrades[type]++;

    mines[type].prod *= 1.2;
    updateFactoryDisplay();
    updateUI();
    updateMinimapColors(type);
}

function updateMinimapColors(type) {
    const level = upgrades[type];
    if (level === 0) return;

    const borderColor = upgradeColors[level - 1];
    const backgroundColor = upgradeColors[level - 1]; 

    const blocs = document.querySelectorAll(`.usine.${type}`);
    blocs.forEach(bloc => {
        bloc.style.border = `2px solid ${borderColor}`;
        bloc.style.backgroundColor = backgroundColor; 
    });
}
