// tracking.js
(function() {
    // Vérifie si on est sur une page animé via l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const animeName = urlParams.get('anime');

    if (animeName) {
        // Récupération des stats existantes
        let stats = JSON.parse(localStorage.getItem('animeStats')) || {};
        stats[animeName] = (stats[animeName] || 0) + 1;

        localStorage.setItem('animeStats', JSON.stringify(stats));
    }
})();
