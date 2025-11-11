// Gestion des tabs de compétences avec accessibilité complète
(function () {
  const tabButtons = document.querySelectorAll('.category-nav-btn');
  const tabPanels = document.querySelectorAll('.skills-panel');

  if (!tabButtons.length || !tabPanels.length) return;

  // Fonction pour activer un tab
  function activateTab(button) {
    if (!button) return;

    const targetPanelId = button.getAttribute('aria-controls');
    const targetPanel = document.getElementById(targetPanelId);

    if (!targetPanel) return;

    // Désactiver tous les tabs
    tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });

    // Cacher tous les panels
    tabPanels.forEach((panel) => {
      panel.setAttribute('hidden', '');
    });

    // Activer le tab sélectionné
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');
    button.removeAttribute('tabindex');

    // Afficher le panel correspondant
    targetPanel.removeAttribute('hidden');

    // Annoncer le changement aux lecteurs d'écran
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = `Section ${button.textContent.trim()} affichée`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Gestion du clic sur les tabs
  tabButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      activateTab(button);
    });
  });

  // Navigation au clavier (flèches gauche/droite ou haut/bas)
  tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      let newIndex = index;

      // Flèche droite ou bas
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (index + 1) % tabButtons.length;
      }
      // Flèche gauche ou haut
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      }
      // Home - premier tab
      else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      }
      // End - dernier tab
      else if (e.key === 'End') {
        e.preventDefault();
        newIndex = tabButtons.length - 1;
      }
      // Si pas de changement, on ne fait rien
      else {
        return;
      }

      // Activer et focus le nouveau tab
      const newButton = tabButtons[newIndex];
      activateTab(newButton);
      newButton.focus();
    });
  });

  // Support pour le swipe sur mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const skillsContent = document.querySelector('.skills-content');
  if (skillsContent) {
    skillsContent.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    skillsContent.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;

      // Swipe vers la gauche (next)
      if (swipeDistance < -swipeThreshold) {
        const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
        const nextIndex = (currentIndex + 1) % tabButtons.length;
        activateTab(tabButtons[nextIndex]);
      }
      // Swipe vers la droite (previous)
      else if (swipeDistance > swipeThreshold) {
        const currentIndex = Array.from(tabButtons).findIndex(btn => btn.classList.contains('active'));
        const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        activateTab(tabButtons[prevIndex]);
      }
    }
  }

  // Initialisation : s'assurer que le premier tab est activé
  const activeTab = document.querySelector('.category-nav-btn.active');
  if (activeTab) {
    activateTab(activeTab);
  } else if (tabButtons.length > 0) {
    activateTab(tabButtons[0]);
  }

  // Support pour les URLs avec hash (exemple: #skills-backend)
  function handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith('#skills-')) {
      const category = hash.replace('#skills-', '');
      const targetButton = document.querySelector(`.category-nav-btn[data-category="${category}"]`);
      if (targetButton) {
        activateTab(targetButton);
        // Scroll vers la section skills
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
          skillsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  // Écouter les changements de hash
  window.addEventListener('hashchange', handleHashChange);
  
  // Vérifier le hash au chargement
  if (window.location.hash.startsWith('#skills-')) {
    setTimeout(handleHashChange, 100);
  }
})();

