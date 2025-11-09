// Theme toggle functionality
const themeToggle = document.querySelector(".theme-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Set initial theme based on system preference
function setInitialTheme() {
  if (!themeToggle) return;
  
  if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.setAttribute("aria-label", "Désactiver le mode sombre");
    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.setAttribute("aria-label", "Activer le mode sombre");
    themeToggle.setAttribute("aria-pressed", "false");
  }
}

setInitialTheme();

// Toggle theme
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    themeToggle.setAttribute(
      "aria-label",
      newTheme === "dark" ? "Désactiver le mode sombre" : "Activer le mode sombre"
    );
    themeToggle.setAttribute("aria-pressed", newTheme === "dark" ? "true" : "false");
  });
}

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
  
  // Mettre à jour aria-expanded
  mobileMenuBtn.setAttribute("aria-expanded", newState ? "true" : "false");
  mobileMenuBtn.setAttribute(
    "aria-label",
    newState ? "Fermer le menu" : "Activer le menu"
  );

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
    item.removeAttribute("aria-current");
    if (item.getAttribute("href").slice(1) === current) {
      item.classList.add("active");
      item.setAttribute("aria-current", "page");
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

// Form handling avec validation accessible
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const formSuccess = document.getElementById("form-success");

// Fonction pour effacer les erreurs
function clearErrors() {
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  formSuccess.textContent = "";
  nameInput.setAttribute("aria-invalid", "false");
  emailInput.setAttribute("aria-invalid", "false");
  messageInput.setAttribute("aria-invalid", "false");
}

// Fonction de validation
function validateForm() {
  let isValid = true;
  clearErrors();

  // Validation du nom
  if (!nameInput.value.trim()) {
    nameError.textContent = "Le nom est obligatoire";
    nameInput.setAttribute("aria-invalid", "true");
    nameInput.focus();
    isValid = false;
  }

  // Validation de l'email
  if (!emailInput.value.trim()) {
    emailError.textContent = "L'email est obligatoire";
    emailInput.setAttribute("aria-invalid", "true");
    if (isValid) {
      emailInput.focus();
      isValid = false;
    }
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailError.textContent = "Veuillez entrer une adresse email valide";
    emailInput.setAttribute("aria-invalid", "true");
    if (isValid) {
      emailInput.focus();
      isValid = false;
    }
  }

  // Validation du message
  if (!messageInput.value.trim()) {
    messageError.textContent = "Le message est obligatoire";
    messageInput.setAttribute("aria-invalid", "true");
    if (isValid) {
      messageInput.focus();
      isValid = false;
    }
  }

  return isValid;
}

// Validation en temps réel
nameInput.addEventListener("blur", () => {
  if (!nameInput.value.trim()) {
    nameError.textContent = "Le nom est obligatoire";
    nameInput.setAttribute("aria-invalid", "true");
  } else {
    nameError.textContent = "";
    nameInput.setAttribute("aria-invalid", "false");
  }
});

emailInput.addEventListener("blur", () => {
  if (!emailInput.value.trim()) {
    emailError.textContent = "L'email est obligatoire";
    emailInput.setAttribute("aria-invalid", "true");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailError.textContent = "Veuillez entrer une adresse email valide";
    emailInput.setAttribute("aria-invalid", "true");
  } else {
    emailError.textContent = "";
    emailInput.setAttribute("aria-invalid", "false");
  }
});

messageInput.addEventListener("blur", () => {
  if (!messageInput.value.trim()) {
    messageError.textContent = "Le message est obligatoire";
    messageInput.setAttribute("aria-invalid", "true");
  } else {
    messageError.textContent = "";
    messageInput.setAttribute("aria-invalid", "false");
  }
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Valider le formulaire
  if (!validateForm()) {
    // Annoncer les erreurs aux lecteurs d'écran
    const firstError = contactForm.querySelector('[aria-invalid="true"]');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  try {
    // Désactiver le bouton et montrer l'état de chargement
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";
    submitButton.setAttribute("aria-busy", "true");
    
    // Effacer les messages précédents
    clearErrors();

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
      formSuccess.textContent = "Merci pour votre message ! Je vous répondrai dès que possible.";
      contactForm.reset();
      clearErrors();
      submitButton.focus(); // Retourner le focus au bouton pour annoncer le succès
    } else {
      // Erreur serveur
      const errorData = await response.json();
      formSuccess.textContent = "";
      formSuccess.textContent = errorData.error || "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.";
      formSuccess.style.color = "#e74c3c";
      formSuccess.style.borderColor = "#e74c3c";
      formSuccess.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
      formSuccess.focus();
    }
  } catch (error) {
    formSuccess.textContent = "";
    formSuccess.textContent = "Oops! Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.";
    formSuccess.style.color = "#e74c3c";
    formSuccess.style.borderColor = "#e74c3c";
    formSuccess.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
    formSuccess.focus();
  } finally {
    // Réactiver le bouton et restaurer son texte
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
    submitButton.setAttribute("aria-busy", "false");
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    const isSkipLink = this.classList.contains("skip-link");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Défilement vers la cible
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    // Si lien d'évitement: déplacer le focus sur le contenu principal
    if (isSkipLink) {
      // S'assurer que la cible est focalisable puis focus
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      // Petit délai pour laisser le scroll se produire
      setTimeout(() => target.focus(), prefersReducedMotion ? 0 : 100);
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
  // Vérifier si l'utilisateur préfère un mouvement réduit
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

// Accessibility settings modal and font preferences
const settingsToggle = document.querySelector(".settings-toggle");
const a11yModalOverlay = document.getElementById("a11yModal");
const a11yCloseButtons = document.querySelectorAll(".a11y-modal-close, .a11y-modal-close-btn");
const checkboxDyslexic = document.getElementById("toggle-dyslexic");
const checkboxFontLarge = document.getElementById("toggle-font-large");

let lastFocusedBeforeModal = null;

function applyFontPreferences() {
  const dyslexicOn = localStorage.getItem("pref-dyslexic") === "true";
  const largeOn = localStorage.getItem("pref-font-large") === "true";

  document.documentElement.classList.toggle("font-dyslexic", dyslexicOn);
  document.documentElement.classList.toggle("font-large", largeOn);

  if (checkboxDyslexic) checkboxDyslexic.checked = dyslexicOn;
  if (checkboxFontLarge) checkboxFontLarge.checked = largeOn;
}

function getModalFocusable() {
  if (!a11yModalOverlay || a11yModalOverlay.hasAttribute("hidden")) return [];
  const modal = a11yModalOverlay.querySelector('.a11y-modal');
  if (!modal) return [];
  return Array.from(modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

function openA11yModal() {
  if (!a11yModalOverlay) return;
  lastFocusedBeforeModal = document.activeElement;
  a11yModalOverlay.removeAttribute("hidden");
  document.body.classList.add("no-scroll");
  if (settingsToggle) settingsToggle.setAttribute("aria-expanded", "true");

  // Focus le premier élément focusable
  const focusables = getModalFocusable();
  if (focusables.length) {
    focusables[0].focus();
  }
}

function closeA11yModal() {
  if (!a11yModalOverlay) return;
  a11yModalOverlay.setAttribute("hidden", "true");
  document.body.classList.remove("no-scroll");
  if (settingsToggle) {
    settingsToggle.setAttribute("aria-expanded", "false");
    if (lastFocusedBeforeModal) {
      lastFocusedBeforeModal.focus();
    } else {
      settingsToggle.focus();
    }
  }
}

// Init preferences on load
applyFontPreferences();

// Events
if (settingsToggle) {
  settingsToggle.addEventListener("click", () => {
    const isHidden = a11yModalOverlay?.hasAttribute("hidden");
    if (isHidden) openA11yModal();
    else closeA11yModal();
  });
}

// Close buttons
a11yCloseButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeA11yModal();
  });
});

// Click outside to close
if (a11yModalOverlay) {
  a11yModalOverlay.addEventListener("click", (e) => {
    if (e.target === a11yModalOverlay) {
      e.preventDefault();
      e.stopPropagation();
      closeA11yModal();
    }
  });
}

// Key handling: ESC to close and focus trap
document.addEventListener("keydown", (e) => {
  if (!a11yModalOverlay || a11yModalOverlay.hasAttribute("hidden")) return;

  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    closeA11yModal();
    return;
  }

  if (e.key === "Tab") {
    const focusables = getModalFocusable();
    if (!focusables.length) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab
      if (activeElement === first || !focusables.includes(activeElement)) {
        e.preventDefault();
        e.stopPropagation();
        last.focus();
      }
    } else {
      // Tab
      if (activeElement === last || !focusables.includes(activeElement)) {
        e.preventDefault();
        e.stopPropagation();
        first.focus();
      }
    }
  }
});

// Preference toggles
if (checkboxDyslexic) {
  checkboxDyslexic.addEventListener("change", (e) => {
    const enabled = e.target.checked;
    localStorage.setItem("pref-dyslexic", enabled ? "true" : "false");
    document.documentElement.classList.toggle("font-dyslexic", enabled);
  });
}

if (checkboxFontLarge) {
  checkboxFontLarge.addEventListener("change", (e) => {
    const enabled = e.target.checked;
    localStorage.setItem("pref-font-large", enabled ? "true" : "false");
    document.documentElement.classList.toggle("font-large", enabled);
  });
}