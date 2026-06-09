/* =============================================
   KKN DUSUN KEMIRI — JAVASCRIPT
   Navigation, animations, counters, and UX
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------
  // 1. NAVBAR — Scroll effect & active link
  // -----------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  function handleNavbarScroll() {
    // Add solid background when scrolled past 50px
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll);

  // -----------------------------------------
  // 2. MOBILE MENU — Hamburger toggle
  // -----------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // -----------------------------------------
  // 3. SCROLL REVEAL ANIMATION
  //    Adds .reveal class to elements for
  //    staggered fade-in on scroll.
  // -----------------------------------------
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.program-card, .team-card, .gallery-item, .about-grid, .footer-col'
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a slight delay based on element index for stagger effect
            const siblings = Array.from(entry.target.parentElement.children);
            const index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            entry.target.classList.add('reveal', 'active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  setupScrollReveal();

  // -----------------------------------------
  // 4. ANIMATED COUNTER
  //    Counts up numbers in the About section
  //    stats when they come into view.
  // -----------------------------------------
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'), 10);
            const duration = 2000; // ms
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                entry.target.textContent = target.toLocaleString('id-ID') + '+';
                clearInterval(timer);
              } else {
                entry.target.textContent = Math.floor(current).toLocaleString('id-ID');
              }
            }, stepTime);

            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  animateCounters();

  // -----------------------------------------
  // 5. BACK TO TOP BUTTON
  // -----------------------------------------
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // -----------------------------------------
  // 6. SMOOTH SCROLL for anchor links
  //    (Fallback for older browsers)
  // -----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // -----------------------------------------
  // 7. GALLERY — Simple lightbox overlay
  //    Click an image to view it full-screen.
  // -----------------------------------------
  function setupGalleryLightbox() {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <img class="lightbox-img" src="" alt="Gallery enlarged" />
      </div>
    `;
    document.body.appendChild(lightbox);

    // Inject lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      #lightbox {
        position: fixed;
        inset: 0;
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.35s ease;
      }
      #lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      .lightbox-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
      }
      .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 85vh;
      }
      .lightbox-img {
        max-width: 100%;
        max-height: 85vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        transform: scale(0.9);
        transition: transform 0.35s ease;
      }
      #lightbox.active .lightbox-img {
        transform: scale(1);
      }
      .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .lightbox-close:hover {
        transform: rotate(90deg);
      }
    `;
    document.head.appendChild(style);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

    // Open lightbox when a gallery image is clicked
    document.querySelectorAll('.gallery-item img').forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  setupGalleryLightbox();

  // -----------------------------------------
  // 8. PARALLAX EFFECT on hero background
  // -----------------------------------------
  const heroBg = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
  });

});
