// Ajouter particules flottantes
const container = document.querySelector('.container');

for (let i = 0; i < 30; i++) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.left = Math.random() * window.innerWidth + 'px';
  particle.style.animationDuration = 5 + Math.random() * 5 + 's';
  particle.style.width = 2 + Math.random() * 6 + 'px';
  particle.style.height = particle.style.width;
  container.appendChild(particle);
}

// Splash timeout + fade out
setTimeout(() => {
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.replace("home.html");
  }, 1000);
}, 3000);