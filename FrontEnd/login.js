// Attente du DOM pour executer le code, récupération via nodelist des balises form email et password
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // URL de l'API pour la récupération
    const apiURL = "http://localhost:5678/api/users/login";

    // Eventlistener pour que la fonction asynchrone à l'intérieure de celle-ci soit executé lorsque la connexion se produit, en dessous
    // preventDefault() permet d'éviter un rechargement de base, c'est à dire que l'on revienne à la page de connexion une fois la fonction
    // executé (utile étant donné qu'on veut être envoyé à la page d'accueil) c'est une propriété unique et pas une variable cependant
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Ces deux variable permettent de récupérer ce qui est saisie dans les champs email et mot de passe de la page html, trim() permet
        // de supprimer les espaces inutiles dans ces champs de saisie pour éviter qu'il y ait un problème et que taper les mot de passe et
        // email ne marchent pas malgré qu'on ait mis les bonnes valeurs
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Comme précédemment, try catch permet d'intercepter les potentielles erreurs et d'afficher un message d'erreur pour éviter que
        // le code plante, un message d'erreur est également affiché sur la page
        try {
            // Envoi de la requête à POST, la method:POST spécifie que l'on envoi une requête pour envoyer des données dans l'API, 
            // contrairement à GET auaparavant, qui les récupère, headers permet ensuite de spécifiquer des informations supplémentaire sur
            // la requête et la réponse attendu qui sont structuré en format json pour envoyer les données, body lui spécifique le contenu
            // envoyer dans la requête, ici l'email et le mot de passe et stringify permet de convertir ces infos en une chaine de caractère
            // json pour que le serveur puisse comprendre les infos
            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Cette partie vérifie sir la réponse de l'API est valide, et que le code peut continuer son execution, et que sinon, else 
            // envoi un message d'erreur si la response n'est pas ok (pas valide) sur la page, la const du dessous converti la réponse 
            // en json pour qu'elle puisse être utilisé dans le code
            if (response.ok) {
                const data = await response.json();

                // Cette partie vérifie si la response contient le token, si oui l'authentification a réussi et le code continue, sinon, 
                // else envoi un message d'erreur(sur la page), les deux lignes du dessous vont permettre de renvoyer l'utilisateur authentifié vers la
                // page d'accueil, le localStorage.setItem permet de stocker le token (authToken est le nom de cette donnée) et la ligne
                // du dessous envoi donc l'utilisateur à la page d'accueil, le chemin écris est ainsi un chemin classique vers la localisation
                // de la page dans le dossier
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

    // Ici la fonction permet d'afficher un message d'erreur (les messages vu au dessus), la let errorMessage stocke l'élément sélectionné
    // par la nodelist (ici .error-message, créé juste en dessous), le if du dessous va permettre de vérifier si aucun élément avec la class
    // error-message existe pour en créer un, le if est nécessaire car il permet d'éviter les doublons car étant donné qu'on a plusieurs
    // messages d'erreurs différent, vérifiant si un élément error-message existe permet d'éviter d'en créer un autre et donc évite que tout
    // les messages soit affiché en même temps, en dessous l'élément est créé en tant que balise p et un nom de class lui est ajouté (error-message)
    // appendChild relie ensuite la let errorMessage (étant donc l'élément error-message) au formulaire, et à la fin errorMessage.textContent
    // définie le texte à afficher dans l'élément p créé, message étant ainsi le texte entré dans les balises au dessus
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
