// === VIERRA AG — SCRIPT.JS ===

// --- Nav scroll behavior ---
const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// --- Mobile menu toggle ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks = document.querySelectorAll('.mob-link');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Scroll reveal ---
const revealEls = document.querySelectorAll(
  '.about-pull, .about-image-col, .about-text-col, .timeline-item, ' +
  '.expertise-card, ' +
  '.region-card, .vineyard-services, ' +
  '.agave-text, .agave-feature-aside, ' +
  '.process-step, .ethos-quote, .ethos-credentials, ' +
  '.contact-text, .contact-form-col, ' +
  '.section-header, .heritage-banner'
);

revealEls.forEach((el, i) => {
  // Assign reveal class based on position
  if (el.classList.contains('about-image-col') || el.classList.contains('agave-text') || el.classList.contains('contact-text') || el.classList.contains('ethos-quote')) {
    el.classList.add('reveal-left');
  } else if (el.classList.contains('about-text-col') || el.classList.contains('agave-feature-aside') || el.classList.contains('contact-form-col') || el.classList.contains('ethos-credentials')) {
    el.classList.add('reveal-right');
  } else if (el.classList.contains('timeline-item') || el.classList.contains('region-card')) {
    el.classList.add('reveal');
    el.style.transitionDelay = '0ms'; // stagger handled by JS below
  } else {
    el.classList.add('reveal');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger cards
      const cards = entry.target.querySelectorAll ? null : null;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 0);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

// Stagger expertise cards
const expertiseCards = document.querySelectorAll('.expertise-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.parentElement.querySelectorAll('.expertise-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        }, i * 90);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

if (expertiseCards.length) {
  expertiseCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s ease, border-color 0.3s ease';
  });
  cardObserver.observe(expertiseCards[0]);
}

// --- Contact form (Formspree) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('https://formspree.io/f/maqvvylq', {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if (response.ok) {
        btn.textContent = 'Message Sent';
        btn.style.background = '#4A5C40';
        btn.style.borderColor = '#4A5C40';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
        }, 3500);
      } else {
        btn.textContent = 'Something went wrong — please try again';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 3500);
      }
    })
    .catch(() => {
      btn.textContent = 'Something went wrong — please try again';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 3500);
    });
  });
}
