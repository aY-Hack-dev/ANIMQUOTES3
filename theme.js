// Vérifie si l'utilisateur avait déjà choisi le dark mode
const isDark = localStorage.getItem('dark-mode') === 'true';
if(isDark) document.body.classList.add('dark-mode');

// Toggle bouton global
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle){
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Sauvegarde le choix
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
    });
}