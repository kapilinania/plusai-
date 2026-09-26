/**
 * PLUS AI - Main Interactive JavaScript
 * Handles mobile drawer, smooth navigation, task filtering, FAQ accordion,
 * sticky mobile bar, and accessible modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.querySelector('.navbar');
  const btnHamburger = document.getElementById('btnHamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const btnCloseDrawer = document.getElementById('btnCloseDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-nav-list a');

  // Modals
  const loginModal = document.getElementById('loginModal');
  const uploadModal = document.getElementById('uploadModal');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloseButtons = document.querySelectorAll('.btn-modal-close');
  const openLoginButtons = document.querySelectorAll('.btn-open-login');
  const openUploadButtons = document.querySelectorAll('.btn-open-upload');

  // Task Filters
  const taskFilterBtns = document.querySelectorAll('.task-filter-btn');
  const taskCards = document.querySelectorAll('.task-card');

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');

  // Sticky Mobile Action Bar
  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const heroSection = document.getElementById('home');

  // -------------------------------------------------------------------------
  // Mobile Drawer Toggle
  // -------------------------------------------------------------------------
  function openDrawer() {
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    btnHamburger.classList.add('active');
    btnHamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    btnHamburger.classList.remove('active');
    btnHamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
  }

  if (btnHamburger) {
    btnHamburger.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // -------------------------------------------------------------------------
  // Modals (Login & Upload)
  // -------------------------------------------------------------------------
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 150);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  openLoginButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      openModal(loginModal);
    });
  });

  openUploadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      openModal(uploadModal);
    });
  });

  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlays.forEach(overlay => closeModal(overlay));
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      modalOverlays.forEach(overlay => closeModal(overlay));
    }
  });

  // -------------------------------------------------------------------------
  // FAQ Accordion
  // -------------------------------------------------------------------------
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other open items
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
          const otherBtn = openItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // -------------------------------------------------------------------------
  // Task Category Filtering
  // -------------------------------------------------------------------------
  taskFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      taskFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      taskCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // Scroll Actions: Navbar Shadow & Sticky Mobile Bar
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');

  function handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar scroll effect
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Sticky mobile action bar visibility
    if (mobileStickyBar && heroSection) {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (scrollY > heroBottom - 200) {
        mobileStickyBar.classList.add('visible');
      } else {
        mobileStickyBar.classList.remove('visible');
      }
    }

    // Active navigation highlighting
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // -------------------------------------------------------------------------
  // Form Handlers
  // -------------------------------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Welcome back to Plus AI! Redirecting to dashboard...');
      closeModal(loginModal);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting Plus AI! Our support team will get in touch shortly.');
      contactForm.reset();
    });
  }

  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Video task registration submitted successfully! Our team will send your head mount confirmation.');
      closeModal(uploadModal);
    });
  }
});

/**
 * Global helper to update compensation rate across all tags dynamically.
 * Example in console: window.setPlusAiRate('₹400');
 */
window.setPlusAiRate = function(newRate) {
  document.querySelectorAll('.price-val').forEach(el => {
    el.textContent = newRate;
  });
  console.log(`Plus AI rate updated to: ${newRate}`);
};
