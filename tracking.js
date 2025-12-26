(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const animeName = urlParams.get('anime');

    if (animeName) {
        let stats = JSON.parse(localStorage.getItem('animeStats')) || {};
        stats[animeName] = (stats[animeName] || 0) + 1;
        localStorage.setItem('animeStats', JSON.stringify(stats));
    }
})();