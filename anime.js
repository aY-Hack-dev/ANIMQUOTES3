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

    await document.fonts.load("700 28px Montserrat");
    await document.fonts.load("500 38px Poppins");

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const isDark = document.body.classList.contains('dark');

    const width = 1080;
    const paddingTop = 60;
    const paddingBottom = 60;

    ctx.font = "500 38px Poppins";
    const maxWidth = 820;
    const lineHeight = 50;

    const quoteText = quotes[currentIndex].text;
    const lines = getWrappedLines(ctx, quoteText, maxWidth);
    const quoteHeight = lines.length * lineHeight;

    const height =
        paddingTop +
        30 +
        18 +
        quoteHeight +
        18 +
        70 +
        paddingBottom;

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (isDark) {
        gradient.addColorStop(0, "#121212");
        gradient.addColorStop(1, "#0b0b0b");
    } else {
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#f3f4f6");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    let y = paddingTop;

    ctx.fillStyle = isDark ? "#f4f4f4" : "#111";
    ctx.font = "700 28px Montserrat";
    ctx.fillText("ANIMQUOTES", width / 2, y);

    y += 14;
    ctx.fillStyle = "#4b6cb7";
    ctx.fillRect(width / 2 - 55, y, 110, 3);

    y += 32;
    ctx.font = "500 38px Poppins";
    ctx.fillStyle = isDark ? "#f4f4f4" : "#111";

    lines.forEach(line => {
        ctx.fillText(line, width / 2, y);
        y += lineHeight;
    });

    y += 12;
    ctx.fillStyle = isDark ? "#3f3f46" : "#d1d5db";
    ctx.fillRect(width / 2 - 40, y, 80, 2);

    y += 34;
    ctx.font = "600 20px Poppins";
    ctx.fillStyle = isDark ? "#d4d4d8" : "#333";
    ctx.fillText(quotes[currentIndex].author || "", width / 2, y);

    y += 24;
    ctx.font = "500 15px Poppins";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#666";
    ctx.fillText(animeName.toUpperCase(), width / 2, y);

    const link = document.createElement('a');
    link.download = `${animeName}_animquotes_${Date.now()}.png`;
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