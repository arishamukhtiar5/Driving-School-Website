/* ============================================
   DRIVE MASTER - MAIN JAVASCRIPT
   ============================================ */

/* --- Navbar Scroll Effect --- */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

/* --- Mobile Navigation Toggle Function --- */
function toggleNav() {
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  
  if (navMenu) navMenu.classList.toggle('open');
  if (navToggle) navToggle.classList.toggle('open');
  if (navOverlay) navOverlay.classList.toggle('show');
  
  if (navMenu && navMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Make toggleNav available globally
window.toggleNav = toggleNav;

// Close nav on link click
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navMenu');
      const navToggle = document.getElementById('navToggle');
      const navOverlay = document.getElementById('navOverlay');
      if (navMenu) navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('open');
      if (navOverlay) navOverlay.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
  
  // Add click handlers for toggle buttons
  const navToggleBtn = document.getElementById('navToggle');
  const navOverlayEl = document.getElementById('navOverlay');
  if (navToggleBtn) navToggleBtn.addEventListener('click', toggleNav);
  if (navOverlayEl) navOverlayEl.addEventListener('click', toggleNav);
});

/* --- Scroll Animations (Intersection Observer) --- */
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });
});

/* --- Animated Counter (for stats) --- */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

/* --- Trigger counters when visible --- */
document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-number, .s-num');
  if (statNumbers.length === 0) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawText = el.textContent.trim();
        const num = parseInt(rawText.replace(/[^0-9]/g, ''));
        const suffix = rawText.replace(/[0-9,]/g, '');
        if (!isNaN(num) && num > 0) {
          animateCounter(el, num, 1800);
          setTimeout(() => {
            const finalNum = parseInt(el.textContent.replace(/[^0-9,]/g, '').replace(',', ''));
            el.textContent = finalNum.toLocaleString() + suffix;
          }, 1850);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
});

/* --- Smooth Scroll for anchor links --- */
document.addEventListener('DOMContentLoaded', () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

/* --- Contact Form Submit Handler --- */
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const successAlert = document.getElementById('formSuccess');

  const firstName = form.firstName.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;

  if (!firstName || !phone || !service) {
    [form.firstName, form.phone, form.service].forEach(field => {
      if (field && !field.value.trim()) {
        field.style.borderColor = '#dc3545';
        field.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          field.style.animation = '';
          field.style.borderColor = '';
        }, 600);
      }
    });
    return;
  }

  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Booking Request';
      submitBtn.disabled = false;
    }
    if (successAlert) {
      successAlert.classList.add('show');
    }
    form.reset();
    if (successAlert) {
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        successAlert.classList.remove('show');
      }, 6000);
    }
  }, 1200);
}

window.handleFormSubmit = handleFormSubmit;

/* --- Add shake animation to CSS dynamically --- */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* --- Active nav link on scroll (for homepage) --- */
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage) && !link.classList.contains('nav-cta')) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

/* --- Lazy loading images fallback --- */
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
  } else {
    images.forEach(img => {
      img.src = img.src;
    });
  }
});
