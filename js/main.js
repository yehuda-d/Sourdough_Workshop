// תפריט נפתח במובייל
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// סגירת התפריט אחרי לחיצה על קישור
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// סימון הקישור של המקטע שנמצא כרגע על המסך
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));

// כפתור "חזרה למעלה"
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

// לוגו שעדיין לא הועלה - מציגים רק את השם
document.querySelectorAll('.logo-item img').forEach((img) => {
  const showNameOnly = () => {
    img.remove();
    img.closest('.logo-item')?.classList.add('no-logo');
  };
  if (img.complete && img.naturalWidth === 0) showNameOnly();
  else img.addEventListener('error', showNameOnly);
});

// גלריה - הגדלת תמונה בלחיצה
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const galleryImages = [...document.querySelectorAll('.gallery-item img')];
let current = 0;

function showImage(index) {
  current = (index + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[current].src;
  lightboxImg.alt = galleryImages[current].alt;
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

galleryImages.forEach((img, i) => {
  img.parentElement.addEventListener('click', () => {
    showImage(i);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(current + 1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  // בעברית "הבאה" היא שמאלה
  if (e.key === 'ArrowLeft') showImage(current + 1);
  if (e.key === 'ArrowRight') showImage(current - 1);
});

document.getElementById('year').textContent = new Date().getFullYear();
