// כניסה לאתר תמיד מתחילה מראש הדף - גם אם בקישור יש # (למשל #testimonials)
// וגם כשהדפדפן מנסה לחזור למקום שבו היינו לפני רענון
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.addEventListener('load', () => window.scrollTo({ top: 0, behavior: 'instant' }));

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

// הקלטת פתיחה - מתנגנת פעם אחת בכל ביקור.
// דפדפנים חוסמים קול לפני שהגולש נגע בדף, ולכן אם הניסיון הראשון נחסם
// ההקלטה תתחיל בלחיצה / נגיעה / הקשה הראשונה בדף.
const welcomeAudio = document.getElementById('welcome-audio');
const firstInteractionEvents = ['pointerdown', 'keydown', 'touchstart'];
let audioStarted = false;

function alreadyPlayedThisVisit() {
  try { return sessionStorage.getItem('welcomeAudioPlayed') === '1'; } catch { return false; }
}

function markPlayed() {
  try { sessionStorage.setItem('welcomeAudioPlayed', '1'); } catch {}
}

function stopWaitingForInteraction() {
  firstInteractionEvents.forEach((type) => document.removeEventListener(type, playWelcomeAudio));
}

function playWelcomeAudio() {
  if (audioStarted) return;
  welcomeAudio.play().then(() => {
    audioStarted = true;
    markPlayed();
    stopWaitingForInteraction();
  }).catch(() => {
    // נחסם - מחכים לאינטראקציה הראשונה
  });
}

if (!alreadyPlayedThisVisit()) {
  firstInteractionEvents.forEach((type) => document.addEventListener(type, playWelcomeAudio));
  playWelcomeAudio();
}

// אם קובץ האודיו לא קיים - לא עושים כלום
welcomeAudio.addEventListener('error', stopWaitingForInteraction);
