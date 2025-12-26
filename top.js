document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('top-animes-list');
    if (!listEl) return;

    const stats = JSON.parse(localStorage.getItem('animeStats')) || {};
    const sortedAnimes = Object.entries(stats).sort((a, b) => b[1] - a[1]);

    if (sortedAnimes.length === 0) {
        listEl.innerHTML = '<li>Aucun animé consulté pour le moment.</li>';
        return;
    }

    listEl.innerHTML = '';

    sortedAnimes.forEach(([name, views], index) => {
        const li = document.createElement('li');
        const rank = document.createElement('span');
        rank.classList.add('top-rank');
        rank.textContent = index + 1;

        const animeNameEl = document.createElement('span');
        animeNameEl.classList.add('anime-name');
        animeNameEl.textContent = name;

        const popularity = document.createElement('span');
        popularity.classList.add('popularity');
        popularity.textContent = `${views} vue(s)`;

        li.appendChild(rank);
        li.appendChild(animeNameEl);
        li.appendChild(popularity);

        li.style.opacity = 0;
        li.style.transform = 'translateY(15px)';
        li.addEventListener('click', () => {
            window.location.href = `anime.html?anime=${encodeURIComponent(name)}`;
        });

        listEl.appendChild(li);

        setTimeout(() => {
            li.style.transition = 'all 0.5s ease';
            li.style.opacity = 1;
            li.style.transform = 'translateY(0)';
        }, index * 100);
    });
});