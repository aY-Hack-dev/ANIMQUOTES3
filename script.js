// Liste des citations aléatoires
const quotes = [
  "Même quand les mots nous trahissent, nos actions peuvent exprimer ce que le cœur ressent vraiment.",
  "Chaque geste de pardon et de compréhension guérit les blessures invisibles.",
  "Ne crains pas d’avancer seul, le courage se construit pas à pas.",
  "Ce n’est pas la force qui définit l’âme, mais la persévérance.",
  "Le chemin peut être long, mais chaque pas compte.",
  "La vraie victoire commence à l’intérieur."
];

// Affichage d'une citation aléatoire
const quoteElement = document.getElementById('quote');
quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Création des particules
const container = document.querySelector('.container');
for (let i = 0; i < 30; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.animationDuration = 5 + Math.random() * 5 + 's';
  particle.style.width = 2 + Math.random() * 6 + 'px';
  particle.style.height = particle.style.width;
  container.appendChild(particle);
}

// Progress bar animation + redirection
const progress = document.querySelector('.progress');
let width = 0;
const interval = setInterval(() => {
  width += 1;
  progress.style.width = width + '%';
  if (width >= 100) {
    clearInterval(interval);
    document.body.classList.add('fade-out');
    setTimeout(() => {
      window.location.replace("home.html");
    }, 500);
  }
}, 30); // ~3 secondes total