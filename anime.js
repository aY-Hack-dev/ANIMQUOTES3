let quotesData = {}; 

// =====================
//     MODE SOMBRE / CLAIR
// =====================
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark'); 
    themeToggle.querySelector('.toggle-ball').classList.toggle('active');
});

// =====================
//     CHARGEMENT JSON
// =====================
fetch('quotes.json')
  .then(res => res.json())
  .then(data => {
      quotesData = data;
      initQuotesPage();
  })
  .catch(err => console.error("Erreur chargement JSON:", err));

// =====================
//     INITIALISATION DE LA PAGE
// =====================
function initQuotesPage(){
    const quoteSection = document.getElementById('quote-section');
    if(!quoteSection) return;

    const urlParams = new URLSearchParams(window.location.search);
    const animeName = urlParams.get('anime');
    if(!animeName) return;

    document.getElementById('anime-title').textContent = animeName;

    let currentIndex = 0;
    const quotes = quotesData[animeName] || [{text: "Aucune citation trouvée", author: ""}];

    const textEl = document.querySelector('.text');
    const authorEl = document.querySelector('.author');

    function showQuote(i){
        const q = quotes[i];
        textEl.textContent = q.text;
        authorEl.textContent = q.author ? `— ${q.author}` : "";
    }

    showQuote(currentIndex);

    // Navigation
    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        showQuote(currentIndex);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        showQuote(currentIndex);
    });

    // Copier citation
    document.querySelector('.copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(`${quotes[currentIndex].text} ${quotes[currentIndex].author ? '— '+quotes[currentIndex].author : ''}`);
        alert("Citation copiée ✅");
    });

    // Télécharger citation en image
    document.querySelector('.download-btn').addEventListener('click', async () => {

        // Charger la police avant de dessiner dans le canvas
        await document.fonts.load("70px Poppins");

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 1000;
        canvas.height = 450;

        const dark = document.body.classList.contains('dark');

        // ======= FOND EN DÉGRADÉ ========
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

        // ======= TEXTE CITATION ========
        ctx.fillStyle = dark ? "#fff" : "#000";
        ctx.font = "70px Poppins, sans-serif";
        ctx.textAlign = "left";

        wrapText(ctx, quotes[currentIndex].text, 40, 150, 820, 60);

        // ======= TEXTE AUTEUR ========
        ctx.font = "40px Poppins, sans-serif";
        ctx.fillText(
            quotes[currentIndex].author
                ? `— ANIMQUOTES, ${quotes[currentIndex].author}`
                : "",
            40,
            360
        );

        // ======= TÉLÉCHARGEMENT ========
        const link = document.createElement('a');
        link.download = `${animeName}_citation_${currentIndex+1}_aY-Hack_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    // Fonction WRAP TEXT améliorée
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if(testWidth > maxWidth && n > 0){
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Bouton Accueil
    const homeBtn = document.querySelector('.home-btn');
    if(homeBtn){
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}