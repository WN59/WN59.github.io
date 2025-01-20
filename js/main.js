// Theme toggle functionality
const themeToggle = document.querySelector(".theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Set initial theme based on system preference
function setInitialTheme() {
  if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.setAttribute("aria-label", "Désactiver le mode sombre");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.setAttribute("aria-label", "Activer le mode sombre");
  }
}

setInitialTheme();

// Toggle theme
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  themeToggle.setAttribute(
    "aria-label",
    newTheme === "dark" ? "Désactiver le mode sombre" : "Activer le mode sombre"
  );
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

// Gestion du focus trap pour le menu mobile
function handleFocusTrap(e) {
  if (!navLinks.classList.contains("active")) return;

  const focusableElements = [
    mobileMenuBtn,
    ...navLinks.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    ),
  ];
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
}

// Ajouter la gestion du focus trap
document.addEventListener("keydown", handleFocusTrap);

function toggleMobileMenu(force = null) {
  const newState =
    force !== null ? force : !navLinks.classList.contains("active");

  // Ajouter/Supprimer la classe no-scroll sur le body
  document.body.classList.toggle("no-scroll", newState);

  // Toggle du menu
  navLinks.classList.toggle("active", newState);
  mobileMenuBtn.classList.toggle("active", newState);

  // Animation du bouton hamburger
  const spans = mobileMenuBtn.querySelectorAll("span");
  spans.forEach((span) => {
    span.style.transition =
      "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
  });

  if (newState) {
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translate(7px, -7px)";
    // Focus sur le premier élément focusable du menu
    setTimeout(() => {
      const firstFocusable = navLinks.querySelector(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }, 100);
  } else {
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
    // Retourner le focus au bouton du menu
    mobileMenuBtn.focus();
  }
}

// Toggle du menu au clic sur le bouton
mobileMenuBtn.addEventListener("click", () => toggleMobileMenu());

// Fermer le menu au clic sur un lien
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      toggleMobileMenu(false);
    }
  });
});

// Fermer le menu au redimensionnement
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    toggleMobileMenu(false);
  }
});

// Empêcher le scroll quand le menu est ouvert
document.addEventListener(
  "touchmove",
  (e) => {
    if (document.body.classList.contains("no-scroll")) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Active navigation link highlighting
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-link");

function setActiveNavLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href").slice(1) === current) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNavLink);

// Animate skill bars on scroll
const skillBars = document.querySelectorAll(".skill-bar");

const animateSkillBars = () => {
  skillBars.forEach((bar) => {
    const progress = bar.querySelector(".skill-progress");
    const level = bar.dataset.level;
    progress.style.width = `${level}%`;
  });
};

// Intersection Observer for skill bars animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars();
      }
    });
  },
  { threshold: 0.5 }
);

skillBars.forEach((bar) => observer.observe(bar));

// Form handling
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  try {
    // Désactiver le bouton et montrer l'état de chargement
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    // Envoyer le formulaire via Formspree
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      // Succès
      alert("Merci pour votre message ! Je vous répondrai dès que possible.");
      contactForm.reset();
    } else {
      // Erreur
      throw new Error(
        "Oops! Une erreur s'est produite lors de l'envoi du message."
      );
    }
  } catch (error) {
    alert(error.message);
  } finally {
    // Réactiver le bouton et restaurer son texte
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Script pour le bouton retour en haut
const scrollToTopButton = document.querySelector(".scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopButton.classList.add("visible");
  } else {
    scrollToTopButton.classList.remove("visible");
  }
});

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
