document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());
        jsonData.access_key = "858454eb-a330-4859-91de-caa119aafc4e";
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });

            const result = await response.json();

            if (result.success) {
                status.textContent = "Votre message a été envoyé.Vous recevrez une réponse dans un bref délai 😊";
                form.reset();
            } else {
                status.textContent = "Erreur lors de l'envoi : " + result.message;
            }
        } catch (err) {
            status.textContent = "Oups!! Quelque chose a mal tourné.Veuillez ressayer.";
        }
    });
});