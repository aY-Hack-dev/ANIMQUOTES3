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
            .then(() => {
                showCopyAlert();
            })
            .catch(err => {
                console.error("Erreur lors de la copie :", err);
            });
    });
 document.querySelector('.download-btn').addEventListener('click', async () => {

        await document.fonts.load("70px Poppins");

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const dark = document.body.classList.contains('dark');

        let fontSize = 60;
        ctx.font = `${fontSize}px Poppins`;

        const maxWidth = 820;
        const lineHeight = fontSize + 10;

        const lines = getWrappedLines(ctx, quotes[currentIndex].text, maxWidth);
        const textHeight = lines.length * lineHeight;

        canvas.width = 900;
        canvas.height = textHeight + 250;

        ctx.font = `${fontSize}px Poppins`;
        ctx.textAlign = "left";

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
        wrapText(ctx, quotes[currentIndex].text, 40, 120, maxWidth, lineHeight);

        ctx.font = "38px Poppins";
        ctx.fillText(
            quotes[currentIndex].author
                ? `— ANIMQUOTES, ${quotes[currentIndex].author}`
                : "",
            40,
            textHeight + 180
        );

        const link = document.createElement('a');
        link.download = `${animeName}_citation_${currentIndex + 1}_${Date.now()}.png`;
        link.href = canvas.toDataURL();
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
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = test;
        }
    }
    lines.push(line);
    return lines;
}

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