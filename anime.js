let quotesData = {}; 
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark'); 
    themeToggle.querySelector('.toggle-ball').classList.toggle('active');
});

function showCopyAlert() {
    const alert = document.getElementById("copy-success");
    if (!alert) return;

    alert.style.display = "flex";

    clearTimeout(window.copyAlertTimeout);
    window.copyAlertTimeout = setTimeout(() => {
        hideCopyAlert();
    }, 2500);
}

function hideCopyAlert() {
    const alert = document.getElementById("copy-success");
    if (!alert) return;
    alert.style.display = "none";
}

fetch('quotes.json')
  .then(res => res.json())
  .then(data => {
      quotesData = data;
      initQuotesPage();
  })
  .catch(err => console.error("Erreur chargement JSON:", err));

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

    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        showQuote(currentIndex);
    });

    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + quotes.length) % quotes.length;
        showQuote(currentIndex);
    });

    document.querySelector('.copy-btn').addEventListener('click', () => {
        const content = `${quotes[currentIndex].text} ${quotes[currentIndex].author ? '— ' + quotes[currentIndex].author : ''}`;
        navigator.clipboard.writeText(content)
            .then(showCopyAlert)
            .catch(err => console.error("Erreur lors de la copie :", err));
    });

document.querySelector('.download-btn').addEventListener('click', async () => {

    await document.fonts.load("700 34px Montserrat");
    await document.fonts.load("500 52px Poppins");

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const isDark = document.body.classList.contains('dark');

    const width = 1200;
    const maxTextWidth = 900;
    const lineHeight = 64;

    ctx.font = "500 52px Poppins";
    const quote = quotes[currentIndex].text;
    const lines = getWrappedLines(ctx, quote, maxTextWidth);
    const quoteBlockHeight = lines.length * lineHeight;

    const topBlockHeight = 120;
    const bottomBlockHeight = 130;

    const height = topBlockHeight + quoteBlockHeight + bottomBlockHeight;

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isDark) {
        gradient.addColorStop(0, "#111827");
        gradient.addColorStop(1, "#020617");
    } else {
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#eef2ff");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    let y = 50;

// Titre
ctx.font = "700 34px Montserrat";
ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
ctx.fillText("ANIMQUOTES", width / 2, 50);

// Mesure du texte pour placer le trait juste en dessous
const titleMetrics = ctx.measureText("ANIMQUOTES");
const titleHeight = titleMetrics.actualBoundingBoxAscent + titleMetrics.actualBoundingBoxDescent;

// Trait sous le titre
y = 50 + titleHeight + 10; // 10px d'espace entre le texte et le trait
ctx.fillStyle = "#6366f1";
ctx.fillRect(width / 2 - 70, y, 140, 4);

// La suite du dessin de la citation
y += 28; // un petit écart avant de dessiner la citation

    y = (height - quoteBlockHeight) / 2;

    ctx.font = "500 52px Poppins";
    ctx.fillStyle = isDark ? "#f1f5f9" : "#020617";

    lines.forEach(line => {
        ctx.fillText(line, width / 2, y);
        y += lineHeight;
    });

    y += 18;
    ctx.fillStyle = isDark ? "#334155" : "#c7d2fe";
    ctx.fillRect(width / 2 - 55, y, 110, 3);

    y += 28;
    ctx.font = "600 26px Poppins";
    ctx.fillStyle = isDark ? "#e5e7eb" : "#1e293b";
    ctx.fillText(quotes[currentIndex].author || "", width / 2, y);

    y += 32;
    ctx.font = "500 20px Poppins";
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.fillText(animeName.toUpperCase(), width / 2, y);

    const link = document.createElement('a');
    link.download = `ANIMQUOTES_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
});
    const homeBtn = document.querySelector('.home-btn');
    if(homeBtn){
        homeBtn.addEventListener('click', () => {
            window.location.href = 'home.html';
        });
    }
}

function getWrappedLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const test = line + words[n] + ' ';
        if (ctx.measureText(test).width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = test;
        }
    }
    lines.push(line.trim());
    return lines;
}