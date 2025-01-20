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
      "https://fdn.urbiloglabs.fr/wp-content/uploads/2021/10/AUTONOMIE-1-scaled-e1635341850133.jpg",
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

  // Render projects
  carousel.innerHTML = projects
    .map((project) => createProjectCard(project))
    .join("");

  let isScrolling = false;

  // Navigation simple
  function scroll(direction) {
    if (isScrolling) return;

    const cards = Array.from(carousel.querySelectorAll(".project-card"));
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;

    const currentScroll = carousel.scrollLeft;
    const scrollAmount =
      direction === "left" ? -(cardWidth + gap) : cardWidth + gap;

    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });

    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
      updateButtonsVisibility();
    }, 500);
  }

  // Mise à jour des boutons
  function updateButtonsVisibility() {
    const margin = 5;
    const isAtStart = carousel.scrollLeft <= margin;
    const isAtEnd =
      carousel.scrollLeft + carousel.offsetWidth >=
      carousel.scrollWidth - margin;

    prevButton.style.opacity = isAtStart ? "0.5" : "1";
    prevButton.style.cursor = isAtStart ? "default" : "pointer";
    prevButton.style.pointerEvents = isAtStart ? "none" : "auto";

    nextButton.style.opacity = isAtEnd ? "0.5" : "1";
    nextButton.style.cursor = isAtEnd ? "default" : "pointer";
    nextButton.style.pointerEvents = isAtEnd ? "none" : "auto";
  }

  // Touch events basiques
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          scroll("right");
        } else {
          scroll("left");
        }
      }
    },
    { passive: true }
  );

  // Event listeners
  carousel.addEventListener("scroll", updateButtonsVisibility);
  window.addEventListener("resize", updateButtonsVisibility);
  prevButton.addEventListener("click", () => scroll("left"));
  nextButton.addEventListener("click", () => scroll("right"));

  // Init
  updateButtonsVisibility();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
