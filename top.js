document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('top-animes-list');
    const stats = JSON.parse(localStorage.getItem('animeStats')) || {};

    // Trie les animés par nombre de visites
    const sortedAnimes = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    if (sortedAnimes.length === 0) {
        listEl.innerHTML = '<li>Aucun animé consulté pour le moment.</li>';
        return;
    }

    sortedAnimes.forEach(anime => {
        const li = document.createElement('li');
        li.textContent = anime;
        li.addEventListener('click', () => {
            window.location.href = `anime.html?anime=${encodeURIComponent(anime)}`;
        });
        listEl.appendChild(li);
    });
});

// top.js
function populateTopAnimes() {
    const list = document.getElementById('top-animes-list');
    if (!list) return;

    // Récupère les stats depuis localStorage
    const stats = JSON.parse(localStorage.getItem('animeStats')) || {};

    // Transforme en tableau et trie par popularité décroissante
    const sortedAnimes = Object.entries(stats).sort((a,b) => b[1] - a[1]);

    // Nettoie la liste avant ajout
    list.innerHTML = '';

    // Crée les éléments de la liste
    sortedAnimes.forEach(([name, views], index) => {
        const li = document.createElement('li');

        // Badge de rang
        const rank = document.createElement('span');
        rank.classList.add('top-rank');
        rank.textContent = index + 1;

        // Nom de l'animé
        const animeNameEl = document.createElement('span');
        animeNameEl.classList.add('anime-name');
        animeNameEl.textContent = name;

        // Nombre de vues
        const popularity = document.createElement('span');
        popularity.classList.add('popularity');
        popularity.textContent = `${views} vue(s)`;

        // Assemblage
        li.appendChild(rank);
        li.appendChild(animeNameEl);
        li.appendChild(popularity);

        list.appendChild(li);
    });
}

// Exécution au chargement
document.addEventListener('DOMContentLoaded', populateTopAnimes);