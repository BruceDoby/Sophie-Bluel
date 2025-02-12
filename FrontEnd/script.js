const apiUrl = 'http://localhost:5678/api/works';

/*****************GENERATION DES TRAVAUX******************/

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

function afficherWorks(works) {
  const galerie = document.querySelector('.gallery'); 

  galerie.innerHTML = '';

  works.forEach((work) => {
    const figure = document.createElement('figure');

    figure.setAttribute('data-id', `page-${work.id}`);

    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);

    galerie.appendChild(figure);
  });
}

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

async function genererFiltres() {
  const filtersContainer = document.querySelector('.filters');
  const categories = await fetchCategories();

  filtersContainer.innerHTML = '';

  categories.forEach((category) => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.dataset.categoryId = category.id;

    button.classList.add('filter__border');

    button.style.backgroundColor = '#fffef8';
    button.style.color = '#1D6154';
    button.style.fontFamily = 'Syne'
    button.style.fontWeight = '700'

    button.addEventListener('click', () => gererClicFiltre(button, category.id));

    /************APPLICATION DES CHANGEMENTS ET MISE EN MARCHE DES FILTRES*************/

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
    }
    filtersContainer.appendChild(button);
  });

  const defaultButton = filtersContainer.querySelector('button[data-category-id="null"]');
  if (defaultButton) {
    defaultButton.style.backgroundColor = '#1D6154';
    defaultButton.style.color = 'white';
    defaultButton.classList.add('active');
    appliquerFiltre(defaultButton.dataset.categoryId);
  }
}

/***************RECUPERATION DES INFOS DES FILTRES DEPUIS L'API******************/

async function fetchCategories() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const works = await response.json();

    const categories = Array.from(
      new Set(works.map((work) => work.category.name))
    ).map((name) => {
      return {
        name: name,
        id: works.find((work) => work.category.name === name).categoryId,
      };
    });

    return [{ name: "Tous", id: null }, ...categories];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    return [{ name: "Tous", id: null }];
  }
}

/****************APPLIQUER LES FILTRES***************** */

async function appliquerFiltre(categoryId) {
  const works = await fetchWorks();

  const filteredWorks = categoryId
    ? works.filter((work) => work.categoryId === categoryId)
    : works;

  afficherWorks(filteredWorks);
}

document.addEventListener('DOMContentLoaded', async () => {
  await genererFiltres();
  await chargerGalerie();
});

/*************OPERATION DES CHANGEMENTS UNE FOIS CONNECTE**************/

document.addEventListener("DOMContentLoaded", () => {
  const editMode = document.querySelector(".edit--mode");
  const edit = document.querySelector(".edit");
  const logout = document.querySelector(".logout");
  const filters = document.querySelector(".filters");
  const headerNav = document.querySelector("header nav");
  const headerH1 = document.querySelector("header h1");
  const logIn = document.querySelector(".log-in");

  // 1ER STOCKAGE DU TOKEN DANS CE FICHIER SCRIPT
  const authToken = localStorage.getItem("authToken");

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

  updateUI();

  if (logout) {
      logout.addEventListener("click", () => {
          localStorage.removeItem("authToken");
          updateUI();

          window.location.reload();
      });
  }
});

/**************MODALE***************/

/**************GESTION DE SON AFFICHAGE**************/

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

modifierButton.addEventListener('click', () => {
    showModale(modale);
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

function generateGallery(images) {
  const galleryModale = document.querySelector('.galery__modale');

    galleryModale.innerHTML = '';

    images.forEach(image => {
        const imageContainer = document.createElement('figure');

        imageContainer.setAttribute('data-id', image.id);

        const imgElement = document.createElement('img');
        imgElement.src = image.imageUrl;
        imgElement.alt = image.title;
        imageContainer.appendChild(imgElement);

        const trashIcon = document.createElement('i');
        trashIcon.className = 'fa-solid fa-trash-can';
        trashIcon.setAttribute('data-id', image.id);
        imageContainer.appendChild(trashIcon);
        console.log(trashIcon); 
        trashIcon.addEventListener('click', (event) => {
          console.log('Click détecté sur l\'icône de suppression');
          handleTrashIconClick(event);
        });

        galleryModale.appendChild(imageContainer);
    });
}

/**************GENERATION DYNAMIQUE DE LA LISTE DES CATEGORIES****************/

async function fetchListCategories() {
  try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
          throw new Error(`Erreur : ${response.status}`);
      }

      const works = await response.json();

      const categories = Array.from(
          new Set(works.map((work) => work.category.name))
      ).map((name) => {
          return {
              name: name,
              id: works.find((work) => work.category.name === name).category.id,
          };
      });

      const selectElement = document.getElementById('categorie');

      selectElement.innerHTML = '';

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

document.addEventListener('DOMContentLoaded', fetchListCategories);

/************GESTION DE LA SUPPRESSION DE TRAVAUX***************/

async function handleTrashIconClick(event) {
  console.log(event.target);
  console.log('click')

      const trashIcon = event.target;

      console.log('trashIcon', trashIcon)

      const workId = trashIcon.dataset.id;
      const workElement = document.querySelector(`[data-id="${workId}"]`);
      console.log('workElement', workElement)


      if (!workElement) {
          console.error("Impossible de trouver l'élément contenant le travail à supprimer.");
          return;
      }


      const authToken = localStorage.getItem('authToken');
  
      if (!authToken) {
        console.error("Token non trouvé.");
        return;
      }

      try {
          console.log(authToken);
          const response = await fetch(`${apiUrl}/${workId}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${authToken}`
              }
          });

          console.log(response);
          if (!response.ok) {
              console.error("Erreur lors de la suppression du travail :", response.statusText);
              return;
          }

          workElement.remove();

          const homepageWorkElement = document.querySelector(`[data-id="page-${workId}"]`);
          if (homepageWorkElement) {
              homepageWorkElement.remove();
          }

          console.log(`Travail avec l'ID ${workId} supprimé avec succès.`);
      } catch (error) {
          console.error("Erreur lors de la suppression :", error);
      }
}


fetchWorks();

/************GESTION DE L'ENVOI DE TRAVAUX*************/

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

function updateButtonState() {
    if (titreInput.value && categorieSelect.value && pictureInput.files.length > 0) {
        buttonValidate.style.backgroundColor = '#1D6154';
    } else {
        buttonValidate.style.backgroundColor = '';
    }
}

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


/**********GESTION DE LA REQUETE POST*************/

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

/**************ENVOI DES INFOS DU FORMULAIRE ET REINITIALISATION DE CELUI CI APRES COUP***************/

buttonValidate.addEventListener('click', async function () {
  console.log('Référence actuelle de pictureInput :', pictureInput);
  console.log('Fichier sélectionné :', pictureInput.files[0]);

    const titre = titreInput.value;
    const categorie = categorieSelect.value;
    const image = pictureInput.files[0];

    if (!titre || !categorie || !image) {
        errorMessage.textContent = 'Veuillez remplir tous les champs et ajouter une image.';
        errorMessage.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('title', titre);
    formData.append('category', categorie);
    formData.append('image', image);
        

    try {  
      const result = await envoyerDonneesAvecToken(formData);
      if (result) {
        console.log('Envoi réussi, mise à jour de l\'UI...');
        await chargerGalerie();
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image ou de l\'envoi des données :', error);
    }

    titreInput.value = '';
    pictureInput.value = '';
    pictureAdding.innerHTML = '<i class="fa-regular fa-image"></i><label for="add-photo">+ Ajouter une photo</label><input type="file" name="add-photo" id="add-photo"><p>jpg, png : 4mo max</p>';
    buttonValidate.style.backgroundColor = '';
    errorMessage.textContent = '';

    pictureInput = document.querySelector('#add-photo');

    if (!pictureInput) {
      console.error("L'élément #add-photo n'a pas été trouvé !");
      return;
    }

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

  updateButtonState();
});

titreInput.addEventListener('input', updateButtonState);
pictureInput.addEventListener('change', updateButtonState);
