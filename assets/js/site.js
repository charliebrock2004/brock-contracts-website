/* ==========================================================================
   Brock Contracts — shared site behaviour
     • mobile navigation
     • sticky header state
     • project card rendering (used by the homepage and Projects page)
     • image lightbox

   You should not need to edit this file to add projects — use
   assets/js/projects-data.js for that.
   ========================================================================== */
(function () {
  'use strict';

  var BC = window.BC = window.BC || {};


  /* ---- helpers --------------------------------------------------------- */

  /* Text from the data file is inserted as HTML, so escape it. Keeps
     ampersands and quotes in project titles from breaking the markup. */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  BC.esc = esc;

  /* Falls back to the placeholder graphic when a photo has not been added. */
  function imageSrc(image) {
    var fallback = (typeof PLACEHOLDER_IMAGE !== 'undefined')
      ? PLACEHOLDER_IMAGE
      : 'images/placeholder.svg';
    if (!image || !image.src) return fallback;
    return image.src;
  }
  BC.imageSrc = imageSrc;

  function imageAlt(image, fallbackText) {
    if (image && image.alt) return image.alt;
    return fallbackText || 'Brock Contracts project photograph';
  }
  BC.imageAlt = imageAlt;

  BC.projects = function () {
    return (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
  };

  BC.categories = function () {
    return (typeof CATEGORIES !== 'undefined' && Array.isArray(CATEGORIES)) ? CATEGORIES : [];
  };

  BC.findProject = function (slug) {
    var list = BC.projects();
    for (var i = 0; i < list.length; i++) {
      if (list[i].slug === slug) return list[i];
    }
    return null;
  };

  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
  BC.ICON_PIN = ICON_PIN;
  BC.ICON_ARROW = ICON_ARROW;


  /* ---- project card ---------------------------------------------------- */

  /* One card, used on both the homepage preview and the Projects page, so the
     two can never drift apart. */
  BC.projectCard = function (project) {
    var href = 'project.html?p=' + encodeURIComponent(project.slug);
    var src = imageSrc(project.mainImage);
    var alt = imageAlt(project.mainImage, project.title + ' — Brock Contracts');

    var exampleBadge = project.isExample
      ? '<span class="project-card__example">Example</span>'
      : '';

    var date = project.completed
      ? '<span class="project-card__date">Completed ' + esc(project.completed) + '</span>'
      : '<span class="project-card__date"></span>';

    return '' +
      '<article class="project-card" data-category="' + esc(project.category) + '">' +
        '<div class="project-card__media ratio ratio--3x2">' +
          '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
          exampleBadge +
        '</div>' +
        '<div class="project-card__body">' +
          '<span class="project-card__tag">' + esc(project.category) + '</span>' +
          '<h3 class="project-card__title">' + esc(project.title) + '</h3>' +
          '<p class="project-card__location">' + ICON_PIN + esc(project.location) + '</p>' +
          '<p class="project-card__summary">' + esc(project.summary) + '</p>' +
          '<div class="project-card__foot">' +
            '<a class="link-arrow project-card__link" href="' + esc(href) + '">' +
              'View Project<span class="visually-hidden">: ' + esc(project.title) + '</span>' +
              ICON_ARROW +
            '</a>' +
            date +
          '</div>' +
        '</div>' +
      '</article>';
  };


  /* ---- mobile navigation ----------------------------------------------- */

  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;

    function close() {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      /* The panel is full height, so stop the page scrolling behind it. */
      document.body.classList.toggle('no-scroll', open);
    });

    /* Close after tapping a link, otherwise the panel covers the target. */
    header.addEventListener('click', function (e) {
      if (e.target.closest('.nav-list a, .call-pill')) close();
    });

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    /* Reset when resizing back up to the desktop layout. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }


  /* ---- sticky header shadow -------------------------------------------- */

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }


  /* ---- footer year ------------------------------------------------------ */

  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ---- lightbox --------------------------------------------------------- */

  /* Call BC.initLightbox() after gallery items are in the DOM. Each item must
     carry data-full (image URL) and may carry data-caption. */
  BC.initLightbox = function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!items.length) return;

    var index = 0;
    var lastFocused = null;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Project photograph viewer');
    box.innerHTML = '' +
      '<button class="lightbox__btn lightbox__close" type="button" aria-label="Close viewer">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
      '<button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photograph">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>' +
      '</button>' +
      '<button class="lightbox__btn lightbox__next" type="button" aria-label="Next photograph">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>' +
      '</button>' +
      '<figure class="lightbox__figure">' +
        '<img class="lightbox__img" src="" alt="">' +
        '<figcaption class="lightbox__caption"></figcaption>' +
        '<p class="lightbox__counter" aria-live="polite"></p>' +
      '</figure>';
    document.body.appendChild(box);

    var imgEl     = box.querySelector('.lightbox__img');
    var capEl     = box.querySelector('.lightbox__caption');
    var countEl   = box.querySelector('.lightbox__counter');
    var closeBtn  = box.querySelector('.lightbox__close');
    var prevBtn   = box.querySelector('.lightbox__prev');
    var nextBtn   = box.querySelector('.lightbox__next');

    /* Arrows are pointless with a single photo. */
    var multiple = items.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;

    function show(i) {
      index = (i + items.length) % items.length;
      var item = items[index];
      imgEl.src = item.getAttribute('data-full');
      imgEl.alt = item.getAttribute('data-alt') || '';
      var caption = item.getAttribute('data-caption') || '';
      capEl.textContent = caption;
      capEl.hidden = !caption;
      countEl.textContent = multiple ? (index + 1) + ' / ' + items.length : '';
    }

    function open(i) {
      lastFocused = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.classList.add('no-scroll');
      closeBtn.focus();
    }

    function close() {
      box.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { open(i); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });

    /* Click the backdrop (not the photo or a button) to dismiss. */
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__figure')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (multiple && e.key === 'ArrowLeft') show(index - 1);
      else if (multiple && e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'Tab') {
        /* Keep focus inside the dialog while it is open. */
        var focusables = Array.prototype.slice
          .call(box.querySelectorAll('button'))
          .filter(function (b) { return !b.hidden; });
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Swipe between photos on touch devices. */
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null || !multiple) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1);
      startX = null;
    }, { passive: true });
  };


  /* ---- section reveal ---------------------------------------------------- */

  /* A short fade-and-rise as each block first comes into view. Applied from
     script so that with JS off, or reduced motion on, nothing is ever hidden.
     Blocks are selected rather than tagged in the markup, so project pages
     added later pick this up with no extra work. */
  var REVEAL_SELECTOR = [
    '.section-head',
    '.about-grid',
    '.services-grid',
    '.project-grid',
    '.gallery-grid',
    '.project-body',
    '.footer-lead'
  ].join(', ');

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var els = document.querySelectorAll(REVEAL_SELECTOR);
    if (!els.length) return;

    document.documentElement.classList.add('js-reveal');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

    Array.prototype.forEach.call(els, function (el) {
      el.setAttribute('data-reveal', '');
      io.observe(el);
    });
  }
  BC.initReveal = initReveal;


  /* ---- boot -------------------------------------------------------------- */

  function init() {
    initNav();
    initHeaderScroll();
    initYear();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
