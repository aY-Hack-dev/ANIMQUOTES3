document.addEventListener('DOMContentLoaded', () => {

    // Toggle FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        question.addEventListener('click', () => { item.classList.toggle('active'); });
    });

    // Formulaire Web3Forms
    const form = document.getElementById('faq-contact-form');
    const status = document.getElementById('faq-form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const jsonData = Object.fromEntries(formData.entries());
            jsonData.access_key = "858454eb-a330-4859-91de-caa119aafc4e";

            status.textContent = "Envoi en cours...";
            status.style.backgroundColor = "rgba(79,70,229,0.1)";
            status.style.color = "#4f46e5";

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(jsonData)
                });
                const result = await response.json();
                if (result.success) {
                    status.textContent = "Votre message a bien été envoyé.Vous recevrez une réponse dans un bref délai 😊";
                    status.style.backgroundColor = "rgba(79,70,229,0.15)";
                    status.style.color = "#4f46e5";
                    form.reset();
                } else {
                    status.textContent = "Erreur : " + result.message;
                    status.style.backgroundColor = "rgba(255,50,50,0.15)";
                    status.style.color = "#ff3232";
                }
            } catch (err) {
                status.textContent = "Erreur réseau, réessayez plus tard.";
                status.style.backgroundColor = "rgba(255,50,50,0.15)";
                status.style.color = "#ff3232";
            }
        });
    }
});
