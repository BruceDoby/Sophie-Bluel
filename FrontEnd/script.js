// Récupération de l'API, la const apiUrl est créé pour facilité la potentielle réutilisabilité de l'url de l'API
const apiUrl = 'http://localhost:5678/api/works';

// Récupération des works du backend depuis l'API, la fonction asynchrone permet d'attendre que les récupérations nécessaire soit faites
// avant d'executer le reste, fetchWorks permet d'englober le fetch et de facilité également sa potentielle réutilisabilité
// fetch permet ensuite d'envoyer la requête à l'API pour récupérer des données, await complète la fonction asynchrone car c'est ce qui
// permets d'attendre que les données soient récupérés, response permet de stocker les données reçu une fois la réponse de l'API arrivé
// pour pouvoir utiliser ces données, la condition if, elle, vérifie si la response est valide, sinon, throw new Error stocke l'execution
// et affiche un message d'erreur puis attend le temps que la response soit valide, catch permet d'intercepter les possibles erreurs,
// de générer un message d'erreur dans la console et empêcher le programme planter avec return[] en remplaçant le résultat attendu par
// un tableau sans éléments indiquant qu'aucune données n'est disponible à cause de l'erreur en question
async function fetchWorks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
    return [];
  }
}

// Ici la fonction afficherWorks permet d'afficher les éléments pour la div gallery, la ligne juste en dessous est une node list qui sélectionne
//donc la div gallery
function afficherWorks(works) {
  const galerie = document.querySelector('.gallery'); 

  // Permet de vider ce qui est présent dans la div gallery avant d'y afficher les nouveaux éléments
  galerie.innerHTML = '';

  // works.forEach permet de parcourir les éléments présent dans l'API, forEach sert précisèment à parcourir CHAQUE élément présent, et
  // work est la fonction qui permets de prendre la valeurs de chaque élément actuel présent dans l'API pour qu'il soit affiché
  // la ligne juste en dessous permet de créer l'élément figure qui contient donc l'img et le figcaption
  works.forEach((work) => {
    const figure = document.createElement('figure');

    // Ici les images sont créés, l'appendChild permet de relier l'élément à l'élément figure juste au dessus, image.src et image.alt 
    // permettent de récupérer la source et l'alt de chaque image et work.imageUrl est l'URL depuis l'API de l'image tandis que work.title
    // est le titre de l'élément pour l'alt
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    // Ici les textes sont créés, même chose pour l'appendChild ici, et le texte qui sert de légende à l'élément est récupérer par work.title
    // de la même façon qu'au dessus, sauf qu'on utilise textContent pour mettre le texte en question dans l'HTML pour que ça lui serve de
    // légende donc
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);

    // Ici l'appendChild relie la figure du dessus à la galerie pour qu'elle puisse être affiché
    galerie.appendChild(figure);
  });
}

// Ici l'on a encore une fonction asynchrone qui va permettre de charger la galerie, la condition if vérifie que works contient au moins
// 1 éléments avec works.length > 0, dans ce cas afficherWorks affiche les données vu dans la fonction juste au dessus, sinon, else affiche
// un avertissement avec console.warn comportant le message entre parenthèses pour expliquer le problème
async function chargerGalerie() {
  const works = await fetchWorks();
  if (works.length > 0) {
    afficherWorks(works);
  } else {
    console.warn("Aucun travail n'a été récupéré depuis l'API.");
  }
}
// Ici l'eventListener permet d'écouter le chargement de la page pour executer la fonction chargerGalerie, DOMContentLoaded permet d'attendre
// que la page soit prête pour executer le code
document.addEventListener('DOMContentLoaded', chargerGalerie);
