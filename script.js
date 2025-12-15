let quotesData = {};

// =====================
//   DÉTECTION MODE SYSTÈME
// =====================
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) {
    document.body.classList.add('dark-mode');
}

// =====================
//   PARTICULES DE FOND
// =====================
const particlesContainer = document.createElement('div');
particlesContainer.classList.add('background-particles');
document.body.appendChild(particlesContainer);

for (let i = 0; i < 100; i++) {
    const p = document.createElement('span');
    p.textContent = Math.random() > 0.5 ? '*' : '`';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.fontSize = 10 + Math.random() * 20 + 'px';
    particlesContainer.appendChild(p);
}

function updateParticlesAnimation() {
    const dark = document.body.classList.contains('dark-mode');
    document.querySelectorAll('.background-particles span').forEach(p => {
        p.style.animationPlayState = 'running';
        p.style.animationDuration = dark
            ? (25 + Math.random() * 20) + 's'
            : (15 + Math.random() * 15) + 's';
    });
}

updateParticlesAnimation();

// =====================
//     MODE SOMBRE / CLAIR
// =====================
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.classList.toggle('active', document.body.classList.contains('dark-mode'));

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('active');
        updateParticlesAnimation();
    });
}

// =====================
//     PETIT MENU MODAL
// =====================
const menuBtn = document.getElementById('menu-btn');
const menuModal = document.getElementById('menu-modal');
const closeMenu = document.getElementById('close-menu');
const overlay = document.getElementById('overlay');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        menuModal.classList.add('visible');
        overlay.classList.add('visible');
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        menuModal.classList.remove('visible');
        overlay.classList.remove('visible');
    });
}

if (overlay) {
    overlay.addEventListener('click', () => {
        menuModal.classList.remove('visible');
        overlay.classList.remove('visible');
    });
}

// =====================
//     CHARGEMENT JSON
// =====================
fetch('quotes.json')
    .then(res => res.json())
    .then(data => {
        quotesData = data;
        initSite();
    })
    .catch(err => console.error("Erreur chargement JSON:", err));

// =====================
//     INITIALISATION
// =====================
function initSite() {

    // ----------- CARTES ANIMES -----------
    const cardsContainer = document.getElementById('anime-cards');
    if (cardsContainer) {
        let list = Object.keys(quotesData);
        list.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
        displayCards(list);

        const searchInput = document.getElementById('search');
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            const filtered = list.filter(name => name.toLowerCase().includes(term));
            displayCards(filtered);
        });
    }

    // ----------- PAGE CITATIONS -----------
    const quoteSection = document.getElementById('quote-section');
    if (!quoteSection) return;

    const urlParams = new URLSearchParams(window.location.search);
    const animeName = urlParams.get('anime');
    document.getElementById('anime-title').textContent = animeName;

    let currentIndex = 0;
    const quotes = quotesData[animeName] || [{ text: "Aucune citation trouvée", author: "" }];

    const textEl = document.querySelector('.text');
    const authorEl = document.querySelector('.author');

    function showQuote(i) {
        const q = quotes[i];
        textEl.textContent = q.text;
        authorEl.textContent = q.author ? `— ${q.author}` : "";
    }

    showQuote(currentIndex);

    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        showQuote(currentIndex);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        showQuote(currentIndex);
    });

    document.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(
            `${quotes[currentIndex].text} ${quotes[currentIndex].author ? '— ' + quotes[currentIndex].author : ''}`
        );
        alert("Citation copiée ✅");
    });

    document.querySelector('.download-btn').addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const dark = document.body.classList.contains('dark-mode');
        canvas.width = 900;
        canvas.height = 450;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (dark) {
            gradient.addColorStop(0, "#0e0e0e");
            gradient.addColorStop(1, "#1c1c1c");
        } else {
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#e9e9e9");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = dark ? "#fff" : "#000";
        ctx.font = "32px Poppins";
        wrapText(ctx, quotes[currentIndex].text, 40, 150, 820, 40);

        ctx.font = "26px Poppins";
        ctx.fillText(`— ANIMQUOTES, ${quotes[currentIndex].author || ""}`, 40, 380);

        const link = document.createElement('a');
        link.download = `${animeName}_quote.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// =====================
//     AFFICHAGE DES CARTES
// =====================
function displayCards(list) {
    const cardsContainer = document.getElementById('anime-cards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = "";
    list.forEach(anime => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<h3>${anime}</h3>`;
        card.addEventListener('click', () => {
            window.location.href = `anime.html?anime=${encodeURIComponent(anime)}`;
        });
        cardsContainer.appendChild(card);
    });
}

// =====================
//   TEXTE MULTI-LIGNES
// =====================
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}