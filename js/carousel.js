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
];

function createProjectCard(project) {
  return `
    <div class="project-card">
      <div class="project-image-container">
        <img 
          src="${project.image}" 
          alt="${project.title}" 
          class="project-image"
        />
        <div class="project-links">
          ${
            project.liveUrl
              ? `
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="tech-stack">
          ${project.technologies
            .map(
              (tech) => `
            <span class="tech-tag">${tech}</span>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
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

  // Créer les indicateurs
  function createIndicators() {
    const totalPages = getTotalPages();
    indicatorsContainer.innerHTML = Array.from({ length: totalPages }, (_, index) => 
      `<div class="carousel-indicator" data-index="${index}"></div>`
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
    prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
    prevButton.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    
    nextButton.style.opacity = currentIndex >= totalPages - 1 ? "0.5" : "1";
    nextButton.style.pointerEvents = currentIndex >= totalPages - 1 ? "none" : "auto";
    
    // Indicateurs
    const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  // Navigation
  function navigate(direction) {
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
    
    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }

  // Aller à une page spécifique
  function goToPage(index) {
    if (isAnimating || index === currentIndex) return;
    
    const totalPages = getTotalPages();
    if (index < 0 || index >= totalPages) return;
    
    currentIndex = index;
    isAnimating = true;
    updateCarousel();
    updateControls();
    
    setTimeout(() => {
      isAnimating = false;
    }, 400);
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

  // Event listeners
  prevButton.addEventListener("click", () => navigate("prev"));
  nextButton.addEventListener("click", () => navigate("next"));

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
      
      // Réattacher les event listeners aux indicateurs
      const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => goToPage(index));
      });
    }, 250);
  });

  // Initialisation
  createIndicators();
  updateCarousel();
  updateControls();
  
  // Attacher les event listeners aux indicateurs
  const indicators = indicatorsContainer.querySelectorAll(".carousel-indicator");
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToPage(index));
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
