const projects = [
  {
    title: "Mairie de Verneuil-sur-Seine",
    description: "Le site web de la ville de Verneuil-sur-Seine",
    image:
      "https://www.verneuil78.fr/wp-content/uploads/2024/05/Verneuil-sur-Seine_196-scaled.jpg",
    technologies: ["Wordpress", "PHP", "CSS", "JavaScript"],
    liveUrl: "https://www.verneuil78.fr/",
  },
  {
    title: "UNPG -Passeport de sécurité",
    description:
      "Application de gestion des passeports de sécurité pour l'UNPG",
    image: "https://passeport-securite.com/assets/images/fondconnexion.png",
    technologies: ["Angular", "PHP Doctrine ORM", "CSS", "JavaScript"],
    liveUrl: "https://passeport-securite.com/",
  },
  {
    title: "La Fondation du Nord",
    description: "Le site web de la Fondation du Nord",
    image:
      "https://lafondationdunord.org/wp-content/uploads/2021/10/AUTONOMIE-1-scaled-e1635341850133.jpg",
    technologies: ["Wordpress", "PHP", "CSS", "JavaScript"],
    liveUrl: "https://lafondationdunord.org/",
  },
  {
    title: "Omegah Pôle Gérontologie - E-learning",
    description: "Application e-learning du Pôle Gérontologie PGI",
    image: "images/pgi.png",
    technologies: ["Angular", "PHP Doctrine ORM", "CSS", "JavaScript"],
    liveUrl: "https://omegah.pole-gerontologie.fr/#/salarie/login",
  },
  {
    title: "SNBPE - Passeport de sécurité",
    description:
      "Application de gestion des passeports de sécurité pour le SNBPE",
    image:
      "https://passeportsecurite.snbpe.org/toupie/bg-home.aadf4e7676d16e6c.png",
    technologies: ["Angular", "PHP Doctrine ORM", "CSS", "JavaScript"],
    liveUrl: "https://passeportsecurite.snbpe.org/toupie/",
  },
  {
    title:"PRITH Hauts de France",
    description: "Le site web du PRITH Hauts de France, avec système de connexion.",
    image: "images/prith.png",
    technologies: ["Wordpress", "PHP", "CSS", "JavaScript"],
    liveUrl: "https://prith-hauts-de-france.org/",
  }
];

function createProjectCard(project) {
  return `
    <article class="project-card">
      <div class="project-image-container">
        <img 
          src="${project.image}" 
          alt="${project.description}. ${project.title}" 
          class="project-image"
          loading="lazy"
        />
        <div class="project-links">
          ${
            project.liveUrl
              ? `
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Voir le projet ${project.title} (nouvelle fenêtre)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          `
              : ""
          }
          ${
            project.githubUrl
              ? `
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Voir le code source de ${project.title} sur GitHub (nouvelle fenêtre)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                <path d="M9 18c-4.51 2-5-2-7-2"/>
              </svg>
            </a>
          `
              : ""
          }
        </div>
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="tech-stack" role="list" aria-label="Technologies utilisées">
          ${project.technologies
            .map(
              (tech) => `
            <span class="tech-tag" role="listitem">${tech}</span>
          `
            )
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function initCarousel() {
  const carousel = document.getElementById("projectCarousel");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const indicatorsContainer = document.getElementById("carouselIndicators");

  // Render projects
  carousel.innerHTML = projects
    .map((project) => createProjectCard(project))
    .join("");

  let currentIndex = 0;
  let isAnimating = false;

  // Fonction pour obtenir le nombre de cartes par page
  function getCardsPerPage() {
    const width = window.innerWidth;
    if (width >= 1024) return 3; // Desktop: 3 cartes par page
    if (width >= 768) return 2;  // Tablette: 2 cartes par page
    return 1; // Mobile: 1 carte par page
  }

  // Calculer le nombre total de pages
  function getTotalPages() {
    const cardsPerPage = getCardsPerPage();
    return Math.ceil(projects.length / cardsPerPage);
  }
  
  // Calculer le nombre de cartes à afficher pour une page donnée
  function getCardsToShowForPage(pageIndex) {
    const cardsPerPage = getCardsPerPage();
    const startIndex = pageIndex * cardsPerPage;
    const remainingCards = projects.length - startIndex;
    return Math.min(cardsPerPage, remainingCards);
  }

  // Créer les indicateurs accessibles
  function createIndicators() {
    const totalPages = getTotalPages();
    indicatorsContainer.innerHTML = Array.from({ length: totalPages }, (_, index) => 
      `<button 
        class="carousel-indicator" 
        data-index="${index}"
        aria-label="Aller à la page ${index + 1} sur ${totalPages}"
        ${index === currentIndex ? 'aria-current="true"' : ''}
        tabindex="${index === currentIndex ? 0 : -1}"
      ></button>`
    ).join("");
  }

  // Mettre à jour l'affichage
  function updateCarousel() {
    const cards = carousel.querySelectorAll(".project-card");
    const cardsPerPage = getCardsPerPage();
    
    // Calculer la largeur d'une carte avec sa marge
    let cardWidth = 0;
    if (cards.length > 0) {
      const card = cards[0];
      const marginRight = parseFloat(getComputedStyle(card).marginRight) || 0;
      cardWidth = card.offsetWidth + marginRight;
    }
    
    // Calculer le décalage basé sur le nombre de cartes par page
    const offset = currentIndex * cardsPerPage * cardWidth;
    
    carousel.style.transform = `translateX(-${offset}px)`;
  }

  // Mettre à jour les boutons et indicateurs
  function updateControls() {
    const totalPages = getTotalPages();
    
    // Boutons
    prevButton.disabled = currentIndex === 0;
    prevButton.setAttribute("aria-disabled", currentIndex === 0 ? "true" : "false");
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    prevButton.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    
    nextButton.disabled = currentIndex >= totalPages - 1;
    nextButton.setAttribute("aria-disabled", currentIndex >= totalPages - 1 ? "true" : "false");
    nextButton.style.opacity = currentIndex >= totalPages - 1 ? "0.5" : "1";
    nextButton.style.pointerEvents = currentIndex >= totalPages - 1 ? "none" : "auto";
    
    // Indicateurs
    const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      const isActive = index === currentIndex;
      indicator.classList.toggle("active", isActive);
      if (isActive) {
        indicator.setAttribute("aria-current", "true");
      } else {
        indicator.removeAttribute("aria-current");
      }
      indicator.setAttribute("tabindex", isActive ? 0 : -1);
      indicator.setAttribute(
        "aria-label",
        `Aller à la page ${index + 1} sur ${totalPages}${isActive ? " (page actuelle)" : ""}`
      );
    });
    
    // Mettre à jour aria-live pour annoncer la page actuelle
    carousel.setAttribute("aria-live", "polite");
    carousel.setAttribute("aria-label", `Page ${currentIndex + 1} sur ${totalPages} - Liste des projets`);
  }

  // Navigation
  function navigate(direction, focusCard = false) {
    if (isAnimating) return;
    
    const totalPages = getTotalPages();
    
    if (direction === "prev" && currentIndex > 0) {
      currentIndex--;
    } else if (direction === "next" && currentIndex < totalPages - 1) {
      currentIndex++;
    } else {
      return;
    }
    
    isAnimating = true;
    updateCarousel();
    updateControls();
    updateTabIndexes(); // Mettre à jour les tabindex
    
    // Si on vient d'un clavier, mettre le focus sur la première carte
    if (focusCard) {
      focusFirstVisibleCard();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }

  // Aller à une page spécifique
  function goToPage(index, focusCard = false) {
    if (isAnimating || index === currentIndex) return;
    
    const totalPages = getTotalPages();
    if (index < 0 || index >= totalPages) return;
    
    currentIndex = index;
    isAnimating = true;
    updateCarousel();
    updateControls();
    updateTabIndexes(); // Mettre à jour les tabindex
    
    // Si on vient d'un clavier, mettre le focus sur la première carte
    if (focusCard) {
      focusFirstVisibleCard();
    }
    
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }

  // Mettre à jour les tabindex pour éviter la navigation sur les projets non visibles
  function updateTabIndexes() {
    const cards = carousel.querySelectorAll(".project-card");
    const cardsPerPage = getCardsPerPage();
    const startIndex = currentIndex * cardsPerPage;
    const endIndex = Math.min(startIndex + cardsPerPage, cards.length);
    
    cards.forEach((card, index) => {
      const isVisible = index >= startIndex && index < endIndex;
      const links = card.querySelectorAll("a");
      
      links.forEach(link => {
        if (isVisible) {
          link.removeAttribute("tabindex");
        } else {
          link.setAttribute("tabindex", "-1");
        }
      });
    });
  }

  // Mettre le focus sur la première carte visible
  function focusFirstVisibleCard() {
    const cards = carousel.querySelectorAll(".project-card");
    const cardsPerPage = getCardsPerPage();
    const startIndex = currentIndex * cardsPerPage;
    
    if (cards[startIndex]) {
      // Essayer de mettre le focus sur le premier lien de la carte
      const firstLink = cards[startIndex].querySelector("a");
      if (firstLink) {
        // Petit délai pour s'assurer que l'animation est terminée
        setTimeout(() => {
          firstLink.focus();
          // Scroller pour s'assurer que la carte est visible
          cards[startIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 450);
      } else {
        // Si pas de lien, mettre le focus sur la carte elle-même
        setTimeout(() => {
          cards[startIndex].setAttribute("tabindex", "0");
          cards[startIndex].focus();
          cards[startIndex].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 450);
      }
    }
  }

  // Navigation au clavier pour les indicateurs
  function handleIndicatorKeydown(e, index) {
    const totalPages = getTotalPages();
    let targetIndex = index;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        targetIndex = index > 0 ? index - 1 : totalPages - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        targetIndex = index < totalPages - 1 ? index + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        targetIndex = 0;
        break;
      case "End":
        e.preventDefault();
        targetIndex = totalPages - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        goToPage(index, true); // Focus sur la carte après changement
        return;
      default:
        return;
    }

    goToPage(targetIndex, true); // Focus sur la carte après changement
    // Mettre le focus sur le nouvel indicateur après un court délai
    setTimeout(() => {
      const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
      if (indicators[targetIndex]) {
        indicators[targetIndex].focus();
      }
    }, 500);
  }

  // Gestion du swipe tactile
  let touchStartX = 0;
  let touchStartY = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Vérifier que c'est un swipe horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        navigate("next");
      } else {
        navigate("prev");
      }
    }
  }, { passive: true });

  // Gestion de la navigation clavier sur les boutons
  function handleButtonKeydown(e, direction) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(direction, true); // Focus sur la carte après changement
    }
  }

  // Gestion de la navigation clavier sur le conteneur du carousel
  function handleCarouselKeydown(e) {
    // Ne gérer que si le focus est sur un bouton de navigation ou un indicateur
    const activeElement = document.activeElement;
    const isOnControl = prevButton === activeElement || 
                       nextButton === activeElement ||
                       indicatorsContainer.contains(activeElement);
    
    // Ne pas capturer les flèches si on est sur un lien dans une carte
    if (!isOnControl && carousel.contains(activeElement)) {
      return;
    }
    
    const totalPages = getTotalPages();
    
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex > 0) {
          navigate("prev", true);
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex < totalPages - 1) {
          navigate("next", true);
        }
        break;
      case "Home":
        e.preventDefault();
        if (currentIndex !== 0) {
          goToPage(0, true);
        }
        break;
      case "End":
        e.preventDefault();
        if (currentIndex !== totalPages - 1) {
          goToPage(totalPages - 1, true);
        }
        break;
    }
  }

  // Event listeners
  prevButton.addEventListener("click", () => navigate("prev", false));
  nextButton.addEventListener("click", () => navigate("next", false));
  
  // Navigation clavier sur les boutons (Entrée/Espace)
  prevButton.addEventListener("keydown", (e) => handleButtonKeydown(e, "prev"));
  nextButton.addEventListener("keydown", (e) => handleButtonKeydown(e, "next"));
  
  // Navigation clavier avec les flèches sur les boutons
  prevButton.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentIndex > 0) {
      e.preventDefault();
      navigate("prev", true);
    }
  });
  
  nextButton.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && currentIndex < getTotalPages() - 1) {
      e.preventDefault();
      navigate("next", true);
    }
  });
  
  // Navigation clavier sur le conteneur du carousel (pour les indicateurs et boutons)
  const carouselContainer = carousel.closest(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("keydown", handleCarouselKeydown);
  }

  // Redimensionnement
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const totalPages = getTotalPages();
      if (currentIndex >= totalPages) {
        currentIndex = totalPages - 1;
      }
      createIndicators();
      updateCarousel();
      updateControls();
      updateTabIndexes(); // Mettre à jour les tabindex
      
      // Réattacher les event listeners aux indicateurs
      const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => goToPage(index, false));
        indicator.addEventListener("keydown", (e) => handleIndicatorKeydown(e, index));
      });
    }, 250);
  });

  // Initialisation
  createIndicators();
  updateCarousel();
  updateControls();
  updateTabIndexes(); // Initialiser les tabindex
  
  // Attacher les event listeners aux indicateurs
  const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToPage(index, false));
    indicator.addEventListener("keydown", (e) => handleIndicatorKeydown(e, index));
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
