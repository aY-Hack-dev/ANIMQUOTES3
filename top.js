document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('top-animes-list');
    if (!listEl) return;

    const stats = JSON.parse(localStorage.getItem('animeStats')) || {};

    // Transforme en tableau et trie par popularité décroissante
    const sortedAnimes = Object.entries(stats).sort((a, b) => b[1] - a[1]);

    if (sortedAnimes.length === 0) {
        listEl.innerHTML = '<li>Aucun animé consulté pour le moment.</li>';
        return;
    }

    listEl.innerHTML = ''; // Vide la liste avant ajout

    sortedAnimes.forEach(([name, views], index) => {
        const li = document.createElement('li');

        // Rang
        const rank = document.createElement('span');
        rank.classList.add('top-rank');
        rank.textContent = index + 1;

        // Nom animé
        const animeNameEl = document.createElement('span');
        animeNameEl.classList.add('anime-name');
        animeNameEl.textContent = name;

        // Popularité
        const popularity = document.createElement('span');
        popularity.classList.add('popularity');
        popularity.textContent = `${views} vue(s)`;

        // Assemblage
        li.appendChild(rank);
        li.appendChild(animeNameEl);
        li.appendChild(popularity);

        // Redirection au clic
        li.addEventListener('click', () => {
            window.location.href = `anime.html?anime=${encodeURIComponent(name)}`;
        });

        listEl.appendChild(li);
    });
});