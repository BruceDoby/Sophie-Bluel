/****************MISE EN PLACE DE LA CONNEXION UTILISATEUR*****************/

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const apiURL = "http://localhost:5678/api/users/login";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    window.location.href = "./index.html";
                } else {
                    displayErrorMessage("Erreur lors de la connexion.");
                }
            } else {
                displayErrorMessage("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur de requête :", error);
            displayErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        }
    });

    /***************CREATION DE L'ELEMENT QU'EST LE MESSAGE D'ERREUR*****************/

    function displayErrorMessage(message) {
        let errorMessage = document.querySelector(".error-message");
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.className = "error-message";
            form.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }
});
