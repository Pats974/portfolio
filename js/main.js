/* ============================================
   PORTFOLIO — Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Active nav on scroll ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observerOptions = { rootMargin: '-40% 0px -55% 0px' };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  // ── Scroll reveal ─────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ── Mobile menu ───────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Gallery filter ────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'fadeIn 0.4s ease forwards';
        }
      });
    });
  });

  // ── Lightbox ──────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  let currentIndex = 0;
  const lightboxItems = [];

  document.querySelectorAll('[data-lightbox]').forEach((item, idx) => {
    lightboxItems.push({
      src: item.dataset.lightbox,
      caption: item.dataset.caption || ''
    });
    item.addEventListener('click', () => openLightbox(idx));
  });

  function openLightbox(idx) {
    currentIndex = idx;
    const item = lightboxItems[idx];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
    lightbox.style.display = 'flex';
    requestAnimationFrame(() => lightbox.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 400);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[currentIndex];
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = item.src;
      lightboxCaption.textContent = item.caption;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => navigate(-1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => navigate(1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  lightboxImg.style.transition = 'opacity 0.2s ease';

  // ── Séries : glisser-déposer + molette = défilement horizontal ─
  document.querySelectorAll('.series-photos-track').forEach(track => {
    let isDown = false, startX = 0, startScroll = 0, moved = false;

    track.addEventListener('pointerdown', (e) => {
      isDown = true; moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.style.cursor = 'grabbing';
    });
    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    const end = () => { isDown = false; track.style.cursor = ''; };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointerleave', end);
    track.addEventListener('pointercancel', end);

    // Empêche l'ouverture de la lightbox si on a glissé
    track.addEventListener('click', (e) => {
      if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; }
    }, true);

    // Molette verticale → défilement horizontal
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });

  // ── "Voir la série" → active le filtre correspondant ─
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.dataset.filterLink;
      const btn = document.querySelector('.filter-btn[data-filter="' + cat + '"]');
      if (btn) btn.click();
    });
  });

  // ── Smooth scroll for all hash links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
