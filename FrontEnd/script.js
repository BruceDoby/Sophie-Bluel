// Récupération de l'API, la const apiUrl est créé pour facilité la potentielle réutilisabilité de l'url de l'API
const apiUrl = 'http://localhost:5678/api/works';

/*****************GENERATION DES TRAVAUX******************/

// Récupération des works du backend depuis l'API, la fonction asynchrone permet d'attendre que les récupérations nécessaire soit faites
// avant d'executer le reste, fetchWorks permet d'englober le fetch et de facilité également sa potentielle réutilisabilité
// fetch permet ensuite d'envoyer la requête à l'API pour récupérer des données, await complète la fonction asynchrone car c'est ce qui
// permets d'attendre que les données soient récupérés, response permet de stocker les données reçu une fois la réponse de l'API arrivé
// pour pouvoir utiliser ces données, la condition if, elle, vérifie si la response est valide, sinon, throw new Error stocke l'execution
// et affiche un message d'erreur puis attend le temps que la response soit valide, catch permet d'intercepter les possibles erreurs,
// de générer un message d'erreur dans la console et empêcher le programme planter avec return[] en remplaçant le résultat attendu par
// un tableau sans éléments indiquant qu'aucune données n'est disponible à cause de l'erreur en question
// QUAND JEXPLIQUERAI COMMENT MARCHE CE GENRE DE FONCTION BIEN EXPLIQUER EN DETAIL Y COMPRIS LE FONCTIONNEMENT DES ERREURS
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

    // Ajouter l'attribut data-id avec l'ID du travail
    figure.setAttribute('data-id', `page-${work.id}`);

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
// 1 éléments avec works.length > 0, dans ce cas afficherWorks affiche les données vu dans la fonction juste au dessus et generateGallery
// charge les travaux (donc même chose) mais dans la modale, sinon, else affiche
// un avertissement avec console.warn comportant le message entre parenthèses pour expliquer le problème
async function chargerGalerie() {
  const works = await fetchWorks();
  if (works.length > 0) {
    afficherWorks(works);
    generateGallery(works);
  } else {
    console.warn("Aucun travail n'a été récupéré depuis l'API.");
  }
}

/***********CREATION DES FILTRES*************/

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

    // Ici button.classList.add permets d'ajouter les propriétés de base présent dans le css à chaque bouton avec filter__border
    button.classList.add('filter__border', /*buttonsWidth[category.name] || 'border__one'*/);

    // Ici c'est le style des boutons de bases, qui ne sont pas cochés, ces propriétés ont le même effet que leur équivalent du même nom
    // en css
    button.style.backgroundColor = '#fffef8';
    button.style.color = '#1D6154';
    button.style.fontFamily = 'Syne'
    button.style.fontWeight = '700'

    button.addEventListener('click', () => gererClicFiltre(button, category.id));

    /************APPLICATION DES CHANGEMENTS ET MISE EN MARCHE DES FILTRES*************/

    // Ici button et categoryID se trouve () dans la fonction car ils sont passé à la fonction pour qu'elle puisse modifier le bouton
    // spécifiquement dans la fonction, donc le modifier spécifiquement lorsque l'on interragit avec permet à la fonction de le modifier
    // quant à categoryID, il est passé à la fonction lorsqu'un bouton est cliqué pour que la fonction puisse filtrer les éléments en
    // fonction de la catégorie pour pouvoir les changer spécifiquement (le vrai filtrage étant effectué par appliquerFiltre)
    // l'event listener du dessus permet d'écouter l'action du clic pour effectuer la fonction, le if est présent pour que l'on puissé 
    // vérifié si le bouton a déjà la class active (présent plus en bas) et est donc actif, si oui alors rien ne change grâce au return, 
    // si non, les lignes plus en bas se charge des changements
    async function gererClicFiltre(button, categoryId) {
      if (button.classList.contains('active')) {
        return;
      }
    
      // Ici tout les buttons dans la div filters sont sélectionnés pour que grâce à la nodelist et à forEach pour qu'ils aient tous par
      // défaut le style css du dessous (sauf le bouton Tous, à voir plus bas) dans le cas où active est removed, et dans le cas où il
      // est add, alors les lignes encore en dessous change le style de celui-ci, y compris le bouton Tous si celui ci n'est plus cliqué
      document.querySelectorAll('.filters button').forEach((btn) => {
        btn.style.backgroundColor = '#fffef8';
        btn.style.color = '#1D6154';
        btn.classList.remove('active');
      });
    
      button.style.backgroundColor = '#1D6154';
      button.style.color = 'white';
      button.classList.add('active');
    
      // Ici la fontion se chargera d'appliquer les filtres comme son nom l'indique, elle établie plus en bas
      appliquerFiltre(categoryId);
    }
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

/***************RECUPERATION DES INFOS DES FILTRES DEPUIS L'API******************/

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

/****************APPLIQUER LES FILTRES***************** */

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

/*************OPERATION DES CHANGEMENTS UNE FOIS CONNECTE**************/

document.addEventListener("DOMContentLoaded", () => {
  // Ici  les éléments à afficher ou masquer sont sélectionnés
  const editMode = document.querySelector(".edit--mode");
  const edit = document.querySelector(".edit");
  const logout = document.querySelector(".logout");
  const filters = document.querySelector(".filters");
  const headerNav = document.querySelector("header nav");
  const headerH1 = document.querySelector("header h1");
  const logIn = document.querySelector(".log-in");

  // 1ER STOCKAGE DU TOKEN DANS CE FICHIER SCRIPT
  // Cette const permet de vérifier que le token est bien stocké pour pouvoir le réutiliser pour que les changements soit effectuer en 
  // fonction de si l'on est connecté ou non
  const authToken = localStorage.getItem("authToken");

  // Ici la fonction permet de modifier l'affichage de la page en fonction de si l'on est connecté ou pas (donc en fonction de si le token
  // est détecté ou non) si oui, l'on peut voir que certains élément sont afficher et d'autre non et inversement sinon
  // ici les if (editMode) par exemple devant chaque ligne sont utiles pour vérifier si l'objet en question existe bien dans le DOM avant
  // d'effectuer l'action
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

/**************GESTION DE SON AFFICHAGE**************/

// Ici les nodelist permet de sélectionner les éléments qui vont nous intéresser pour l'apparition de la modale
const modifierButton = document.querySelector('.edit');
const ajouterPhotoButton = document.querySelector('.button__pictures');
const arrowRightButton = document.querySelector('.fa-arrow-left');
const closeModaleButton = document.querySelector('#cross--m');
const closeModaleAddingButton = document.querySelector('#cross--madding');
const modale = document.querySelector('.modale');
const modaleAdding = document.querySelector('.modale__adding');
const overlay = document.querySelector('.overlay');
const galleryModale = document.querySelector('.galery__modale');

// Ici ces deux fonctions vont avoir un rôle important, la première va afficher la modale et son overlay et la deuxième les fera disparaître
// pour ça la première passe le display de la modale et de son overlay de none à flex ou block en fonction de l'élément concernés, et la
// 2e fais l'inverse
function showModale(modaleToShow) {
    modaleToShow.style.display = 'flex';
    overlay.style.display = 'block';
}

function hideModale(modaleToHide) {
    modaleToHide.style.display = 'none';
    overlay.style.display = 'none';
}

// Ici même principe que pour la fonction fetchWorks au tout début à quelques différences près : ce code ne contient pas de return car ça n'est
// pas utile pour la fonction, étant donné qu'ici on cherche à récupérer les images et les traiter immédiatement, contrairement aux précédent
// qui ne les traite pas immédiatement, la const images et la fonction generateGallery (qui est élaboré unpeu plus bas) sert également
// à faire en sorte que les données soit traités directement, en effet la const converti les données JSON en object javascript pour
// les transmettre à la fonction
/*async function fetchImages() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des images');
        }
        const images = await response.json();
        generateGallery(images);
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux :', error);
    }
}*/

// Ici les 6 event listener servent à écouter le clic sur différents élément pour effectuer une action en fonction de l'élément qui est
// cliqué, la première affiche la modale et les images, la 2e fais disparaitre la modale de base pour faire apparaitre la modale d'ajout
// des photos, la 3e fais l'inverse, la 4e et la 5e font disparaitre chaque modale et la dernière fait disparaitre la modale au clic sur
// l'overlay
modifierButton.addEventListener('click', () => {
    showModale(modale);
    // fetchImages(); 
});

ajouterPhotoButton.addEventListener('click', () => {
    hideModale(modale);
    showModale(modaleAdding);
});

arrowRightButton.addEventListener('click', () => {
    hideModale(modaleAdding);
    showModale(modale);
});

closeModaleButton.addEventListener('click', () => {
    hideModale(modale);
});

closeModaleAddingButton.addEventListener('click', () => {
    hideModale(modaleAdding);
});

overlay.addEventListener('click', () => {
    if (modale.style.display === 'flex') {
        hideModale(modale);
    } else if (modaleAdding.style.display === 'flex') {
        hideModale(modaleAdding);
    }
});

// Ici c'est la partie qui permet de générer dynamiquement les images, elle est très similaire à celle du tout début, la seule différence étant
// la création de l'icone de suppression (la poubelle) créer de la même manière que l'élément de l'image
function generateGallery(images) {
  const galleryModale = document.querySelector('.galery__modale');

    galleryModale.innerHTML = '';

    images.forEach(image => {
        const imageContainer = document.createElement('figure');

        // Ajouter l'attribut data-id avec l'ID de l'image
        imageContainer.setAttribute('data-id', image.id);

        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        imageContainer.appendChild(imgElement);

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';
        trashIcon.setAttribute('data-id', image.id);
        imageContainer.appendChild(trashIcon);
        // trashIcon.addEventListener('click', (event) => handleTrashIconClick(event));
        console.log(trashIcon); // Vérifie si trashIcon est bien sélectionné
        trashIcon.addEventListener('click', (event) => {
          console.log('Click détecté sur l\'icône de suppression');
          handleTrashIconClick(event);
        });

        galleryModale.appendChild(imageContainer);
    });
}

/**************GENERATION DYNAMIQUE DE LA LISTE DES CATEGORIES****************/

//Ici la fonction fetchListCategories va permettre de récupérer les catégories depuis l'API pour les afficher dans l'élément select comportant
// l'id "categorie", l'async est utilisé pour attendre la réponse de l'API qui est fait juste en dessous avec le fetch, await complète cela
// car ça permet d'attendre la réponse de l'API avant de passer à la suite, le try/catch (error) permets lui d'intercepter les potentielles
// erreurs, comme vu précédemment et d'afficher un message d'erreur dans la console
async function fetchListCategories() {
  try {
      const response = await fetch(apiUrl);

      // Ici on vérifie si la response est ok, sinon, un message d'erreur est renvoyé avec le status HTTP (404 par exemple, le code de l'erreur quoi)
      if (!response.ok) {
          throw new Error(`Erreur : ${response.status}`);
      }

      // La const ici va permettre de convertir les données en JSON qui, comme vu précédemment, va les stocker et les utiliser dans le code
      const works = await response.json();

      // Ici, tout comme pour fetchCategories, cette partie du code va convertir les données du set en un tableau qui contiendra les noms
      // des catégories, .map permettra ensuite de créer un objet pour chaque nom de catégorie qui sera renvoyés grâce au return avec le
      // noms spcéifique de la catégorie et son id
      const categories = Array.from(
          new Set(works.map((work) => work.category.name))
      ).map((name) => {
          return {
              name: name,
              id: works.find((work) => work.category.name === name).category.id,
          };
      });

      // Ici on récupère l'élément select ayant l'id categorie
      const selectElement = document.getElementById('categorie');

      // l'innerHTML ici permet de vider le code présent dans le select existant directement dans le HTML pour que le contenu dynamique
      // généré depuis l'API puisse apparaître
      selectElement.innerHTML = '';

      // Cette partie permets de créer l'apparition de chaque catégorie, on crée alors un élément "option" avec la const option, on lui
      // donne une id avec option.value et un texte (qui sera et est déjà son nom) avec option.textContent et on rattache ça à l'élément
      // créé option avec l'appendChild
      categories.forEach((category) => {
          const option = document.createElement('option');
          option.value = category.id; 
          option.textContent = category.name;
          selectElement.appendChild(option);
      });
  } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
  }
}

// Cette partie permet d'écouter le chargement du DOM avec l'event listener qui écoute le DOMContentLoaded pour appeler la fonction vu
// au dessus
document.addEventListener('DOMContentLoaded', fetchListCategories);

/************GESTION DE LA SUPPRESSION DE TRAVAUX***************/

// Ici la fonction trashIconClick (encore fonction async) va permettre d'effectuer la requête DELETE lorsqu'un click sur un trash icon
// sera détecté, l'event listener qui va permettre d'effectuer la fonction au click se trouve unpeu plus haut (ligne 392)
async function handleTrashIconClick(event) {
  // Les console.log ont été utilisé pour vérifier certains éléments, notamment l'élément sur lequel l'utilisateur a cliqué et le fait que la
  // fonction ai bien été appelée
  console.log(event.target);
  console.log('click')
  // if (event.target.classList.contains('trashIcon')) {

      // la const va permettre de stocker l'élément cliqué dans trashIcon et le console.log nous affiche cet élément dans la console
      const trashIcon = event.target;

      /*const workId = trashIcon.getAttribute('data-id');*/
      console.log('trashIcon', trashIcon)

      // ici workId va permettre de récupérer l'id de l'élément, la différence majeure avec workElement étant qu'on ne récupère que l'id ici
      // et pas l'élément au complet
      const workId = trashIcon.dataset.id;
      // la const workElement ici va permettre, grâce à trashIcon.closest('[data-di]'), de trouver l'id de l'élément le plus proche du trashIcon
      // sur lequel l'on vient de cliquer et d'attribuer cet élément à workElement, le console.log permet de vérifier que workElement a bien été trouvé
      const workElement = /*trashIcon.closest('[data-id]');*/ document.querySelector(`[data-id="${workId}"]`);
      console.log('workElement', workElement)


      // ici cette ligne permet de renvoyer une erreur dans la console dans le cas ou workElement n'est pas trouvé
      if (!workElement) {
          console.error("Impossible de trouver l'élément contenant le travail à supprimer.");
          return;
      }


      // ici on récupère le token stocker dans le localStorage qui a permis notamment pour le login et qui est nécessaire pour l'authentification
      const authToken = localStorage.getItem('authToken');
  
      // ici on vérifie que le token est bien trouvé, si ce n'est pas le cas, alors une erreur se produit et rien ne se passe
      if (!authToken) {
        console.error("Token non trouvé.");
        return;
      }

      try {
          // Ici la requête DELETE est effectué, le console.log affiche le token, l'envoi de la requête se fait avec fetch, l'URL pour celle-ci
          // est ensuite construit avec `${apiUrl}/${workId}`, apiUrl étant l'URL de notre API et workId étant l'id de l'élément à supprimer
          // le method permet d'indiquer que l'on envoie une requête DELETE et le headers, qui permet d'envoyer des infos supplémentaires
          // va permettre ici de désigner une authorisation nécessitant le token, le token est ainsi envoyer, permettant à l'API de vérifier
          // si l'utilisateur a bel et bien le droit de supprimer l'élément
          console.log(authToken);
          const response = await fetch(`${apiUrl}/${workId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${authToken}`
              }
          });

          // ici le console.log va permettre d'afficher la response du serveur, le if permet de vérifier cela et ainsi dans le cas où la response
          // n'est pas trouvé, on renvoie une erreur avec le status HTTP sous un format lisible, "Erreur lors de la suppression du travail : Not Found" par exemple
          console.log(response);
          if (!response.ok) {
              console.error("Erreur lors de la suppression du travail :", response.statusText);
              return;
          }

          // ici l'élément désigné par workElement est ainsi complètement supprimé au sein du DOM grâce à .remove pour ce qui est de la modale
          workElement.remove();

          // ici c'est le même principe que pour workElement sauf qu'au lieu d'utiliser closest l'on cherche à savoir quel est l'élément
          // correspondant à l'id de l'élément qui a été supprimé, celui ci est ainsi sélectionné et le if du dessous permet de vérifier
          // donc l'existence de homepageWorkElement, et si c'est bien le cas, alors de la même manière qu'au dessus, il est retiré du DOM
          // grâce à .remove, la différence majeure entre workElement et homepageWorkElement étant que l'un s'occupe de l'élément présent
          // dans la modale alors que l'autre s'occupe de celui présent à la page d'accueil respectivement
          // le console.log en dessous permet d'afficher un message confirmant la suppression de l'élément avec son id affiché
          const homepageWorkElement = document.querySelector(`[data-id="page-${workId}"]`);
          if (homepageWorkElement) {
              homepageWorkElement.remove();
          }

          console.log(`Travail avec l'ID ${workId} supprimé avec succès.`);
      } catch (error) {
          console.error("Erreur lors de la suppression :", error);
      }
  // }
}

// document.addEventListener('click', handleTrashIconClick);

fetchWorks();
// et ici fetchWorks est encore appelé pour pouvoir actualiser les travaux présent dans le DOM une fois la suppression effectué sans avoir à 
// recharge la page

/************GESTION DE L'ENVOI DE TRAVAUX*************/

// Icic les nodelist permettent de sélectionner les différents éléments, seuls 2 lignes sont différentes des autres : errorMessage permet
// d'attribuer la class error-message à l'élément errorMessage et buttonValidate.insertAdjacentElement permet d'insérer le message d'erreur
// représenté par errorMessage avant l'élément buttonValidate, ce qui permet d'afficher dynamiquement un message d'erreur juste au dessus
// du bouton valider
// seul pictureInput est une variable en let parce que l'on aura besoin par la suite, une fois un élément envoyé et le formulaire réinitialiser, 
// de réassigner pictureInput à un nouvel élément étant donné que let est utilisé pour les variable dont la valeure pourrait changer alors 
// que const est utilisé pour les variables dont la valeure ne changera pas
const buttonValidate = document.querySelector('.button__validate');
const titreInput = document.querySelector('.title');
const categorieSelect = document.querySelector('#categorie');
let pictureInput = document.querySelector('#add-photo');
const pictureAdding = document.querySelector('.picture__adding');
const gallery = document.querySelector('.gallery');
const modaleGallery = document.querySelector('.galery__modale');
const crossMadding = document.querySelector('#cross--madding');
const errorMessage = document.createElement('p');
errorMessage.classList.add('error-message');
buttonValidate.insertAdjacentElement('beforebegin', errorMessage);

// Cette fonction va servir à changer la couleure du bouton lorsque les 3 critère sont rempli, pour ça l'on vérifie avec le if si les 3
// critère en question (texte présent dans le titreInput, catégorie sélectionné dans categorieSelect et fichier sélectionné dans pictureInput)
// sont rempli, en vérifiant leur valeurs avec value pour les deux premiers et avec files.lenght > 0 pour le dernier pour vérifier qu'un fichier
// a bien été sélectionné, dans le cas où ça arrive, la couleure est alors changer juste en dessous, si ça n'est pas le cas alors rien ne se
// passe avec else
function updateButtonState() {
    if (titreInput.value && categorieSelect.value && pictureInput.files.length > 0) {
        buttonValidate.style.backgroundColor = '#1D6154';
    } else {
        buttonValidate.style.backgroundColor = '';
    }
}

// Ici l'on va afficher l'image que l'on sélectionne depuis nos fichiers dans pictureInput, pour ça on établi un écouteur d'évènements
// "change" qui va permettre de détecter un changement de valeur dans notre pictureInput pour déclencher la fonction, ensuite la const file
// va permettre de récupérer les fichiers sélectionnés grâce à pictureInput.files[0] qui permets de stocker le fichier en question et permet
// de le récupérer sous forme d'objet, ensuite le if vérifie que l'utilisateur a bien sélectionné un fichier, dans ce cas on crée un FileReader
// qui va permettre de lire le contenu du fichier, une fois la lecture de ce fichier terminé, reader.onload va executer la fonction qui suit
// qui s'occupera d'implanter l'objet img directement dans le HTML avec innerHTML, e.target.result sert de source à l'objet img créé
// car il contient l'URL de l'image, le readasDataUrl permet lui de lire le fichier pour qu'il puisse être affiché en tant qu'image
// la fonction updateButtonState est ensuite appelé pour vérifier si tout les champs sont rempli pour savoir si oui ou non la couleure du 
// bouton doit-elle être changée
pictureInput.addEventListener('change', function () {
    const file = pictureInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            pictureAdding.innerHTML = `<img src="${e.target.result}" alt="Image sélectionnée">`;
        };
        reader.readAsDataURL(file);
    }
    updateButtonState();
});

/*function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Supprime le préfixe "data:image/png;base64,"
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}*/

/**********GESTION DE LA REQUETE POST*************/

// Ici l'on va s'occuper d'envoyer les données avec le token, dans la fonction data est l'objet contenant les données à envoyer, on récupère
// ensuite le token d'authentification, si aucun token n'est trouvé cependant un message d'erreur s'affiche et la fonction s'arrête, le console.log
// affiche les données qui sont envoyées, avec la const response on envoie une requête POST à l'API avec fetch, on précise donc que la méthode
// est POST, et le headers, comme pour DELETE va permettre à l'API de vérifier que l'utilisateur a bien le droit d'envoyer un élément grâce
// au token, le body contient lui les données à envoyer, celle-ci étant data, si la requête réussie alors un message s'affiche dans la console
// sinon un message s'affiche également mais contenant une erreur avec le statut HTTP de l'erreur, la const result converti ensuite la
// response en JSON, le console.log nous informe donc que tout s'est bien passé et nous montre les données envoyées et return result permet
// ensuite de retourner les données pour pouvoir les réutiliser
async function envoyerDonneesAvecToken(data) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("Token non trouvé. Veuillez vous connecter.");
    return;
  }

  console.log('Ici', data)
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: data
    });

    if (response.ok) {
    console.log('Requête POST réussie, bouton réactivé');
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const result = await response.json();
    console.log('Données envoyées avec succès :', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error);
  }
}

// La fonction ici va permettre ben rien enfait
/*function readFileAsBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const binaryString = reader.result.split(',')[1];
      resolve(binaryString);
    };

    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}*/


/**************ENVOI DES INFOS DU FORMULAIRE ET REINITIALISATION DE CELUI CI APRES COUP***************/

// Alors que la fonction du dessus s'occupe d'envoyer les données avec le token, ici l'on va s'occuper d'envoyer les infos présent dans
// le formulaire, un event listener au click est alors établi sur buttonValidate pour l'execution de la fonction qui suit, les console.log
// s'occupe d'afficher dans la console l'élément HTML et le fichier sélectionné, avec les const on stocke le texte entré dans l'input, la catégorie
// sélectionné et le fichier image sélectionné
buttonValidate.addEventListener('click', async function () {
  console.log('Référence actuelle de pictureInput :', pictureInput);
  console.log('Fichier sélectionné :', pictureInput.files[0]);

    const titre = titreInput.value;
    const categorie = categorieSelect.value;
    const image = pictureInput.files[0];

    // Dans le cas où un des 3 manque à l'appel, alors un message d'erreur de couleure rouge est affiché directement dans le HTML et la fonction
    // s'arrête
    if (!titre || !categorie || !image) {
        errorMessage.textContent = 'Veuillez remplir tous les champs et ajouter une image.';
        errorMessage.style.color = 'red';
        return;
    }

    // On crée ensuite l'objet FormData qui permettra d'envoyer des données au format "multipart/form data" nécessaire pour envoyer les
    // fichiers, et on rattache chaque élémént (titre, catégorie et image) au formData avec append
    const formData = new FormData();
    formData.append('title', titre);
    formData.append('category', categorie);
    formData.append('image', image);
        

    try {  
      // On envoie ensuite ainsi ces données (de formData) à l'API en faisant appel à la fonction définie précédemment, si l'on a bien un
      // result alors un message de confirmation est affiché dans la console et la fonction chargerGalerie est appelée pour mettre à jour
      // les galeries d'images
      const result = await envoyerDonneesAvecToken(formData);
      if (result) {
        console.log('Envoi réussi, mise à jour de l\'UI...');
        // await fetchWorks();
        await chargerGalerie();
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image ou de l\'envoi des données :', error);
    }

    /*if (!result) {
        return;
    }*/

    // Ici on réinitialise le formulaire après envoi, pour ça l'on ne mets rien entre les '', ce qui permets de vider ce qui s'y trouvais
    // pictureAdding.innerHTML permet de faire revenir le pictureAdding à la normal (qui avais été remplacé par une image comme vu précédemment)
    // le potentiel message d'erreur affiché disparait et la couleure du bouton valider revient à la normale
    titreInput.value = '';
    pictureInput.value = '';
    pictureAdding.innerHTML = '<i class="fa-regular fa-image"></i><label for="add-photo">+ Ajouter une photo</label><input type="file" name="add-photo" id="add-photo"><p>jpg, png : 4mo max</p>';
    // const newPictureInput = document.querySelector('#add-photo');
    buttonValidate.style.backgroundColor = '';
    errorMessage.textContent = '';

    // Ici on remets à jour pictureInput étant donné que sa valeure a changé puisqu'on l'a remis à 0 comme vu au dessus, ça ne pose cependant
    // pas de problème car, comme vu plus haut, la variable pictureInput était défini dès le départ en let
    pictureInput = document.querySelector('#add-photo');

    // ici si pictureInput n'a pas été correctement recréé, alors un message d'erreur est affiché et la fonction s'arrête
    if (!pictureInput) {
      console.error("L'élément #add-photo n'a pas été trouvé !");
      return;
    }

    // Ici l'on refait ce que l'on avait fait plus haut pour que lorsque l'utilisateur sélectionne une nouvelle image, alors le même comportement
    // se produit que plus haut
    pictureInput.addEventListener('change', function () {
      const file = pictureInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            pictureAdding.innerHTML = `<img src="${e.target.result}" alt="Image sélectionnée">`;
        };
        reader.readAsDataURL(file);
      }
      updateButtonState();
    });

  // on refait appel à updateButtonState pour vérifier que tout les champs ont été rempli et pour savoir si la couleure du bouton doit être
  // changée ou non
  updateButtonState();
});

// Ces deux dernières lignes permettent d'écouter des changements, titreInput écoute si quelque chose est tapé dans son input et pictureInput
// écoute si un fichier est sélectionné dans le pictureInput, les deux appellent ensuite updateButtonState pour vérifier l'état du bouton
// et ainsi le changer ou non
titreInput.addEventListener('input', updateButtonState);
// categorieSelect.addEventListener('change', updateButtonState);
pictureInput.addEventListener('change', updateButtonState);
