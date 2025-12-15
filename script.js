// Redirection vers home après animation
setTimeout(() => {
  document.body.classList.add('fade-out'); // ajoute le fade out
  setTimeout(() => {
    window.location.replace("home.html"); // redirection
  }, 1000); // temps du fade
}, 3000); // durée de la splash

// Si tu veux la splash à chaque visite, on ne stocke rien
// Sinon, remplacer setTimeout par sessionStorage comme avant