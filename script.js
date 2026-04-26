/* ============================================================
   ANQOR STUDIOS - script.js
   ============================================================ */

// ----------------------------------------------------------
// MOBILE NAV TOGGLE
// ----------------------------------------------------------
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const icon = navToggle.querySelector('i');
  icon.className = isOpen ? 'ph ph-x' : 'ph ph-list';
});

// Close when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const icon = navToggle?.querySelector('i');
    if (icon) icon.className = 'ph ph-list';
  });
});

// ----------------------------------------------------------
// ACCORDION
// ----------------------------------------------------------
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item   = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // close all
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

    // open this one if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// ----------------------------------------------------------
// FADE-IN ON SCROLL
// ----------------------------------------------------------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.system-card, .process-item, .comparison-card, .tag, .accordion-item, .about-grid, .proof-strip'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});
