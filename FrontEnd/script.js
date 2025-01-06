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
// donc la div gallery
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

// Ici la fonction genererFiltres, comme son nom l'indique, va générer les boutons des filtres, c'est une fonction asynchrone comme les autres
// au dessus, on a également une nodelist qui sélectionne la div ayant la classe .filters et fetchCategories récupère la liste des catégories
// pour pouvoir créer les boutons
async function genererFiltres() {
  const filtersContainer = document.querySelector('.filters');
  const categories = await fetchCategories();

  // Vider le conteneur avant d'ajouter les nouveaux boutons
  filtersContainer.innerHTML = '';

  // Le tableau buttonsWidth permets de relier les tailles de chaque boutons disponible depuis le css dans le code javascript
  /*const buttonsWidth = {
    'Tous': 'border__one',
    'Objets': 'border__two',
    'Appartements': 'border__three',
    'Hotels & restaurants': 'border__four',
  };*/

  // Cette partie permets de créer un bouton pour chaque catégories ayant été récupérés, on crée alors un élément "button" pour chaque bouton
  // donc, les deux lignes suivantes, button.textContent permets de nommer le bouton selon sa catégories et button.dataset.categoryId permet
  // de donner une id à button comme si on mettait directement une id à un élément dans le html, attention cependant dataset est une propriété
  // javascript alors que categoryId est un élément personnalisé que je pourrais très bien modifier
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.dataset.categoryId = category.id;

    // Ici button.classList.add permets d'ajouter les propriétés de base présent dans le css à chaque bouton avec filter__border ainsi que
    // leur taille spécifique à chacun avec buttonsWidth, || 'border__one' est utilisé comme valeur de taille par défaut dans le cas où
    // un bouton n'aurait pas de taille spécifique, je l'ai mis car ça m'a été conseillé mais je ne sais pas vraiment si c'est si utile
    button.classList.add('filter__border', /*buttonsWidth[category.name] || 'border__one'*/);

    // Ici c'est le style des boutons de bases, qui ne sont pas cochés, ces propriétés ont le même effet que leur équivalent du même nom
    // en css
    button.style.backgroundColor = '#fffef8';
    button.style.color = '#1D6154';
    button.style.fontFamily = 'Syne'
    button.style.fontWeight = '700'

    button.addEventListener('click', () => gererClicFiltre(button, category.id));

    // Ici button et categoryID se trouve () dans la fonction car ils sont passé à la fonction pour qu'elle puisse modifier le bouton
    // spécifiquement dans la fonction, donc le modifier spécifiquement lorsque l'on interragit avec permet à la fonction de le modifier
    // quant à categoryID, il est passé à la fonction lorsqu'un bouton est cliqué pour que la fonction puisse filtrer les éléments en
    // fonction de la catégorie pour pouvoir les changer spécifiquement (le vrai filtrage étant effectué par appliquerFiltre)
    async function gererClicFiltre(button, categoryId) {
      if (button.classList.contains('active')) {
        return;
      }
    
      document.querySelectorAll('.filters button').forEach((btn) => {
        btn.style.backgroundColor = '#fffef8';
        btn.style.color = '#1D6154';
        btn.classList.remove('active');
      });
    
      button.style.backgroundColor = '#1D6154';
      button.style.color = 'white';
      button.classList.add('active');
    
      appliquerFiltre(categoryId);

      /*button.addEventListener('click', () => {
        gererClicFiltre(button, category.id);
      });*/
    }
    // Ici un event listener est créé pour qu'au clique l'on puissé vérifié si le bouton a déjà la class active (présent plus en bas) et est
    // donc actif, si oui alors rien ne change grâce au return, si non, les lignes plus en bas se charge des changements
    /*button.addEventListener('click', () => {
      if (button.classList.contains('active')) {
        return;
      }

      // Ici tout les buttons dans la div filters sont sélectionnés pour que grâce à la nodelist et à forEach pour qu'ils aient tous par
      // défaut le style css du dessous (sauf le bouton Tous, à voir plus bas) dans le cas où active est removed, et dans le cas où il
      // est add, alors les lignes encore en dessous change le style de celui-ci, y compris le bouton Tous si celui ci n'est plus cliqué
      document.querySelectorAll('.filters button').forEach((button) => {
        button.style.backgroundColor = '#fffef8';
        button.style.color = '#1D6154';
        button.classList.remove('active');
      });

      button.style.backgroundColor = '#1D6154';
      button.style.color = 'white';
      button.classList.add('active');

      // Ici la fontion se chargera d'appliquer les filtres comme son nom l'indique, elle établie plus en bas
      appliquerFiltre(category.id);
    });*/

    // Comme plus haut, l'appendChild permet de relier les boutons à la div filters
    filtersContainer.appendChild(button);
  });

  // Ici le bouton Tous est défini comme par défaut (comme selon la maquette) grâce à plusieurs éléments, d'abord avec une nodelist on sélectionne
  // un élément directement dans filtersContainer pour plus de précision, on sélectionne précisèment le bouton avec une id "null" (qui est
  // donc "Tous" puisqu'il n'a pas de catégories spécifique), on lui applique un style spécifique et on lui add active puis on lui applique
  // le filtre comme vu au dessus
  const defaultButton = filtersContainer.querySelector('button[data-category-id="null"]');
  if (defaultButton) {
    defaultButton.style.backgroundColor = '#1D6154';
    defaultButton.style.color = 'white';
    defaultButton.classList.add('active');
    appliquerFiltre(defaultButton.dataset.categoryId);
  }
}

// Ici cette fonction permets de récupérer les infos des catégories depuis l'API, comme expliquer précédemment try, catch permettent d'intercepter
// les potentielles erreurs et la const response envoi la requête à l'API pour récupérer les données, la condition if en dessous signifie
// concrètement que si la response n'est pas "ok" alors une erreur incluant le statut http est donnée grâce à throw qui permets de définir
// une exception en utilisant new Error pour créer une Erreur concrètement et la const works ici récupère les données de l'API qu'elle
// converti en json pour les stocker pour pouvoir les utiliser dans le code javascript
async function fetchCategories() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const works = await response.json();

    // Ici on utilise Array.from pour convertir des données du Set en un tableau, Set servant lui même à faire en sorte que les catégories
    // créé soit unique et qu'il n'y en ait pas 1 pour chaque élément, works.map sert à créer un tableau qui contiendra les noms de chaque 
    // catégorie avec work.category.name, .map permets ensuite de créer un objet (ici l'objet en question est une structure de donnée qui
    // regroupera le nom de la catégorie et son id) pour chaque noms de catégories, le return permettra de renvoyer l'objet pour créer
    // un nouveau tableau grâce à .map, il est donc indiqué en dessous que ce qui sera retourné donc est le nom avec name: name (il ne
    // faut pas oublier de faire la différence entre les deux, celui de gauche est la propriétés de l'objets et celui de droite est une
    // variable que j'ai appelée name, qui est donc le nom de la catégorie)
    // en dessous, pour l'id, works.find permet de parcourir le tableau qu'est works qui a été récupéré par l'API, ensuite work.category.name
    // et name seront comparé grâce à l'opérateur === dans le but de trouver l'élément dont la catégorie a le même nom de name pour ensuite
    // récupérer l'id associé qu'est categoryId
    const categories = Array.from(
      new Set(works.map((work) => work.category.name))
    ).map((name) => {
      return {
        name: name,
        id: works.find((work) => work.category.name === name).categoryId,
      };
    });

    // Le return juste en dessous permet de créer un nouveau tableau que le return renverra donc, qui contient ici un objet supplémentaire
    // pour le bouton Tous dans le but de faire en sorte que l'objet avec nom Tous ai un id null, et l'opérateur de décomposition "..."
    // permet en gros de fusionner le Tous avec les autres catégories récupérés depuis l'API
    // le catch (error) permets donc de capturer la potentielle erreur, si c'est le cas un message d'erreur est affiché et dans ce cas
    // le return renvoie le tableau avec uniquement Tous pour éviter que ça plante
    return [{ name: "Tous", id: null }, ...categories];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return [{ name: "Tous", id: null }];
  }
}

// Cette fonction sert à appliquer le filtre des catégories en fonction de quel catégorie a été choisi, pour ça, categoryId est utilisé 
// pour représenter l'ID de la catégorie sélectionnée pour appliquer le filtre, la ligne du dessous, comme vu précédemment récupère les
// données de l'API
async function appliquerFiltre(categoryId) {
  const works = await fetchWorks();

  // Ici pour filtrer en fonction de la catégorie sélectionnée, on va utiliser un opérateur ternaire, ? correspondant à "si" et : à "sinon"
  // dans ce cas précis, cette partie du code signifie concrètement que si la condition (categoryId étant la condition) est vraie et donc
  // que categoryId existe, alors le code sera executé et les éléments seront filtrés, mais sinon (si la condition est fausse donc null) 
  // alors le code sera également executé mais les éléments ne seront pas filtré
  const filteredWorks = categoryId
    ? works.filter((work) => work.categoryId === categoryId)
    : works;

  // Ici afficherWorks permets ainsi d'afficher les éléments filtrés (ou non en fonction de ce qui a été vu juste au dessus)
  afficherWorks(filteredWorks);
}

// Ici l'eventListener permet d'écouter le chargement de la page pour executer les fonctions chargerGalerie et genererFiltres, 
// DOMContentLoaded permet d'attendre que la page soit prête pour executer le code
document.addEventListener('DOMContentLoaded', async () => {
  await genererFiltres();
  await chargerGalerie();
});

document.addEventListener("DOMContentLoaded", () => {
  // Ici  les éléments à afficher ou masquer sont sélectionnés
  const editMode = document.querySelector(".edit--mode");
  const edit = document.querySelector(".edit");
  const logout = document.querySelector(".logout");
  const filters = document.querySelector(".filters");
  const headerNav = document.querySelector("header nav");
  const headerH1 = document.querySelector("header h1");
  const logIn = document.querySelector(".log-in");

  // Cette const permet de vérifier que le token est bien stocké pour pouvoir le réutiliser pour que les changements soit effectuer en 
  // fonction de si l'on est connecté ou non
  const authToken = localStorage.getItem("authToken");

  // Ici la fonction permet de modifier l'affichage de la page en fonction de si l'on est connecté ou pas (donc en fonction de si le token
  // est détecté ou non) si oui, l'on peut voir que certains élément sont afficher et d'autre non et inversement sinon
  function updateUI() {
      if (authToken) {
          if (editMode) editMode.style.display = "block"; 
          if (edit) edit.style.display = "block";
          if (logout) logout.style.display = "block";
          if (filters) filters.style.display = "none";
          if (logIn) logIn.style.display = "none";

          if (headerNav) headerNav.classList.add("edit__on");
          if (headerH1) headerH1.classList.add("edit__on");

      } else {
          if (editMode) editMode.style.display = "none";
          if (edit) edit.style.display = "none";
          if (logout) logout.style.display = "none";
          if (filters) filters.style.display = "flex";
          if (logIn) logIn.style.display = "block";

          if (headerNav) headerNav.classList.remove("edit__on");
          if (headerH1) headerH1.classList.remove("edit__on");

      }
  }

  // La fonction est appelé pour que les changement soit effectué au chargement de la page
  updateUI();

  // Ici l'on ajoute la déconnexion de la page, l'event listener se charge d'écouter si il y a un clique sur le logout, si oui, alors le
  // token est retiré avec removeItem, l'UI est ainsi actualisé pour que les changements s'opère et la page se recharge pour effectuer
  // les changements suite à la déconnexion
  if (logout) {
      logout.addEventListener("click", () => {
          // Supprimer le token et mettre à jour l'UI
          localStorage.removeItem("authToken");
          updateUI();

          window.location.reload();
      });
  }
});

/**************MODALE***************/
const modifierButton = document.querySelector('.edit');
const ajouterPhotoButton = document.querySelector('.button__pictures');
const arrowRightButton = document.querySelector('.fa-arrow-left');
const closeModaleButton = document.querySelector('#cross--m');
const closeModaleAddingButton = document.querySelector('#cross--madding');
const modale = document.querySelector('.modale');
const modaleAdding = document.querySelector('.modale__adding');
const overlay = document.querySelector('.overlay');
const galleryModale = document.querySelector('.galery__modale');

function showModale(modaleToShow) {
    modaleToShow.style.display = 'flex';
    overlay.style.display = 'block';
}

function hideModale(modaleToHide) {
    modaleToHide.style.display = 'none';
    overlay.style.display = 'none';
}

async function fetchImages() {
    try {
        const response = await fetch(apiUrl); // Remplacez par l'URL réelle de l'API
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }
        const images = await response.json();
        generateGallery(images);
    } catch (error) {
        console.error('Erreur :', error);
    }
}

// Afficher la modale principale lors du clic sur "Modifier"
modifierButton.addEventListener('click', () => {
    showModale(modale);
    fetchImages(); // Charger les images lorsque la modale principale s'affiche
});

// Afficher la modale d'ajout de photo et cacher la modale principale
ajouterPhotoButton.addEventListener('click', () => {
    hideModale(modale);
    showModale(modaleAdding);
});

// Revenir à la modale principale depuis la modale d'ajout de photo
arrowRightButton.addEventListener('click', () => {
    hideModale(modaleAdding);
    showModale(modale);
});

// Fermer la modale principale
closeModaleButton.addEventListener('click', () => {
    hideModale(modale);
});

// Fermer la modale d'ajout de photo
closeModaleAddingButton.addEventListener('click', () => {
    hideModale(modaleAdding);
});

// Fermer la modale en cliquant sur l'overlay
overlay.addEventListener('click', () => {
    if (modale.style.display === 'flex') {
        hideModale(modale);
    } else if (modaleAdding.style.display === 'flex') {
        hideModale(modaleAdding);
    }
});

// Générer dynamiquement les images et l'icône de suppression dans la galerie de la modale
function generateGallery(images) {
  const galleryModale = document.querySelector('.galery__modale');

    galleryModale.innerHTML = ''; // Réinitialiser la galerie

    images.forEach(image => {
        const imageContainer = document.createElement('figure');

        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        imageContainer.appendChild(imgElement);

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';
        imageContainer.appendChild(trashIcon);

        galleryModale.appendChild(imageContainer);
    });
}
