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

        await document.fonts.load("700 32px Montserrat");
        await document.fonts.load("500 44px Poppins");

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const isDark = document.body.classList.contains('dark');

        canvas.width = 1080;
        canvas.height = 1080;

        ctx.fillStyle = isDark ? "#0f0f0f" : "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";

        ctx.fillStyle = isDark ? "#f4f4f4" : "#111";
        ctx.font = "700 32px Montserrat";
        ctx.fillText("ANIMQUOTES", canvas.width / 2, 140);

        ctx.fillStyle = "#4b6cb7";
        ctx.fillRect(canvas.width / 2 - 70, 170, 140, 4);

        const quoteText = quotes[currentIndex].text;
        ctx.font = "500 44px Poppins";
        ctx.fillStyle = isDark ? "#f4f4f4" : "#111";

        const maxWidth = 820;
        const lineHeight = 62;
        let y = 320;

        const lines = getWrappedLines(ctx, quoteText, maxWidth);
        lines.forEach(line => {
            ctx.fillText(line, canvas.width / 2, y);
            y += lineHeight;
        });

        ctx.fillStyle = isDark ? "#444" : "#d1d5db";
        ctx.fillRect(canvas.width / 2 - 50, y + 40, 100, 3);

        ctx.font = "600 22px Poppins";
        ctx.fillStyle = isDark ? "#cccccc" : "#333";
        ctx.fillText(
            quotes[currentIndex].author || "",
            canvas.width / 2,
            y + 100
        );

        ctx.font = "500 18px Poppins";
        ctx.fillStyle = isDark ? "#9ca3af" : "#666";
        ctx.fillText(
            animeName.toUpperCase(),
            canvas.width / 2,
            y + 135
        );

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