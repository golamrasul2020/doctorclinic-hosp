/* ==========================================================================
   main.js — global site behaviour
   Sections: AOS init, sticky navbar, active nav link, counters,
   gallery filter, back-to-top, language toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- AOS (scroll animations) ---- */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 80 });
  }

  /* ---- Sticky / shrinking navbar ---- */
  const navbar = document.querySelector('.main-navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---- Highlight current page in nav ---- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-navbar .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  /* ---- Animated stat counters (IntersectionObserver-driven) ---- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const runCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString() + suffix;
      }
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          runCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => observer.observe(c));
  }

  /* ---- Gallery category filter ---- */
  const filterButtons = document.querySelectorAll('.gallery-filters [data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        filterButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        galleryItems.forEach((item) => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.closest('.gallery-col').style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---- Back-to-top button ---- */
  const backToTop = document.querySelector('.fab-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Language toggle (English | বাংলা) ----
     This is a lightweight demo toggle: it swaps text nodes marked with
     data-en / data-bn attributes. For production, replace with a proper
     i18n solution (e.g. JSON dictionaries loaded per page). */
  const langButtons = document.querySelectorAll('.lang-toggle button');
  if (langButtons.length) {
    langButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const lang = this.getAttribute('data-lang');
        langButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');
        document.body.classList.toggle('lang-bn', lang === 'bn');
        document.querySelectorAll('[data-en]').forEach((el) => {
          const text = lang === 'bn' ? el.getAttribute('data-bn') : el.getAttribute('data-en');
          if (text) el.textContent = text;
        });
        localStorage.setItem('siteLang', lang);
      });
    });
    const savedLang = localStorage.getItem('siteLang');
    if (savedLang === 'bn') {
      const bnBtn = document.querySelector('.lang-toggle button[data-lang="bn"]');
      if (bnBtn) bnBtn.click();
    }
  }

  /* ---- Simple lightbox for gallery images ---- */
  const lightboxLinks = document.querySelectorAll('[data-lightbox]');
  if (lightboxLinks.length) {
    const overlay = document.createElement('div');
    overlay.className = 'simple-lightbox-overlay';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(10,20,30,.9);z-index:2000;align-items:center;justify-content:center;padding:2rem;';
    overlay.innerHTML = '<img style="max-width:90%;max-height:85vh;border-radius:8px;" alt=""><button type="button" aria-label="Close" style="position:absolute;top:1.5rem;right:1.5rem;background:transparent;border:0;color:#fff;font-size:2rem;">&times;</button>';
    document.body.appendChild(overlay);
    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('button');
    lightboxLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        overlayImg.src = this.getAttribute('href') || this.querySelector('img').src;
        overlay.style.display = 'flex';
      });
    });
    [overlay, closeBtn].forEach((el) => el.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === closeBtn) overlay.style.display = 'none';
    }));
  }

});
