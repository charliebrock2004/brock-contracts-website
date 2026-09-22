/* ==========================================================================
   Brock Contracts — shared site behaviour
     • project item markup (homepage and Projects page share one template)
     • header: solid on scroll, tucked away while reading down
     • full-screen menu for phones and tablets
     • services: the photograph follows the service you are on
     • mobile call / enquire bar
     • image lightbox
     • reveal-on-scroll motion

   You should not need to edit this file to add projects — use
   assets/js/projects-data.js for that.
   ========================================================================== */
(function () {
  'use strict';

  var BC = window.BC = window.BC || {};
  var root = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);


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

  /* A project's own "Status" row, if it has one — used to mark work that is
     still on site, so an unfinished job is never presented as complete. */
  function statusOf(project) {
    var rows = Array.isArray(project.details) ? project.details : [];
    for (var i = 0; i < rows.length; i++) {
      if (rows[i] && /^status$/i.test(rows[i].label || '')) return rows[i].value || '';
    }
    return '';
  }

  var ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>';
  BC.ICON_ARROW = ICON_ARROW;


  /* ---- project item ---------------------------------------------------- */

  /* One template for the homepage and the Projects page, so the two can never
     drift apart. The whole item is a single link: one tab stop, one target. */
  BC.projectCard = function (project, index) {
    var href = 'project.html?p=' + encodeURIComponent(project.slug);
    var src = imageSrc(project.mainImage);
    var alt = imageAlt(project.mainImage, project.title + ' — Brock Contracts');
    var num = (typeof index === 'number') ? index + 1 : 1;
    var status = statusOf(project);
    var inProgress = status && !/complete/i.test(status);

    var meta = [project.category, project.location]
      .concat(project.completed ? ['Completed ' + project.completed] : [])
      .filter(Boolean)
      .map(function (m) { return '<span>' + esc(m) + '</span>'; })
      .join('');

    return '' +
      '<article class="work-item" data-category="' + esc(project.category) + '">' +
        '<a class="work-item__link" href="' + esc(href) + '">' +
          '<div class="work-item__media" data-reveal="image">' +
            '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
            (inProgress ? '<span class="work-item__status">' + esc(status) + '</span>' : '') +
            (project.isExample ? '<span class="work-item__status">Example</span>' : '') +
          '</div>' +
          '<div class="work-item__body">' +
            '<span class="work-item__index">' + (num < 10 ? '0' + num : num) + '</span>' +
            '<h3 class="work-item__title">' + esc(project.title) + '</h3>' +
            '<span class="work-item__arrow">' + ICON_ARROW + '<span class="visually-hidden">View project</span></span>' +
            '<p class="work-item__meta">' + meta + '</p>' +
            (project.summary ? '<p class="work-item__summary">' + esc(project.summary) + '</p>' : '') +
          '</div>' +
        '</a>' +
      '</article>';
  };


  /* ---- header ---------------------------------------------------------- */

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-solid', y > 24);
      /* Tuck away while reading down the page, back on any scroll up. Never
         while the menu is open, and never near the top. */
      if (!root.classList.contains('menu-open')) {
        var goingDown = y > lastY + 4;
        var goingUp = y < lastY - 4;
        if (goingDown && y > 480) header.classList.add('is-hidden');
        else if (goingUp || y <= 480) header.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    /* Keyboard users tabbing into a hidden header should see it. */
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    update();
  }


  /* ---- menu -------------------------------------------------------------- */

  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;
    var outside = Array.prototype.slice.call(document.querySelectorAll('main, footer, .action-bar, .skip-link'));
    var desktop = window.matchMedia('(min-width: 1024px)');

    function setOpen(open) {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      /* Everything behind the menu is taken out of reach while it is open. */
      outside.forEach(function (el) {
        if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert');
      });
      if (open) {
        var first = menu.querySelector('a');
        /* Wait for the curtain to start, so focus doesn't jump the page. */
        window.setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, reduceMotion ? 0 : 320);
      }
    }
    function close(returnFocus) {
      if (!root.classList.contains('menu-open')) return;
      setOpen(false);
      if (returnFocus) toggle.focus();
    }

    toggle.setAttribute('aria-label', 'Open menu');
    toggle.addEventListener('click', function () {
      setOpen(!root.classList.contains('menu-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close(true);
      /* Keep Tab between the menu and its close button. */
      if (e.key === 'Tab' && root.classList.contains('menu-open')) {
        var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    var onChange = function () { if (desktop.matches) close(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }


  /* ---- services ---------------------------------------------------------- */

  /* On a wide screen the photograph beside the list follows the service you
     point at — or, if you are just scrolling, the one in the middle of the
     screen. The photograph is decoration; every word is in the list. */
  function initServices() {
    var list = document.querySelector('[data-services-list]');
    var visual = document.querySelector('[data-services-visual]');
    if (!list || !visual) return;
    var rows = Array.prototype.slice.call(list.querySelectorAll('.service'));
    var imgs = Array.prototype.slice.call(visual.querySelectorAll('img[data-service]'));
    var caption = visual.querySelector('[data-services-caption]');
    var count = visual.querySelector('[data-services-count]');
    var wide = window.matchMedia('(min-width: 1024px)');
    var hovering = false;
    var current = -1;

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function activate(i) {
      if (i === current || !rows[i]) return;
      current = i;
      var key = rows[i].getAttribute('data-service');
      rows.forEach(function (r, j) { r.classList.toggle('is-active', j === i); });
      imgs.forEach(function (img) { img.classList.toggle('is-active', img.getAttribute('data-service') === key); });
      if (caption) caption.textContent = rows[i].getAttribute('data-caption') || '';
      if (count) count.textContent = pad(i + 1) + ' / ' + pad(rows.length);
    }

    rows.forEach(function (row, i) {
      row.addEventListener('mouseenter', function () { if (wide.matches) { hovering = true; activate(i); } });
      row.addEventListener('focusin', function () { activate(i); });
    });
    list.addEventListener('mouseleave', function () { hovering = false; });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (hovering || !wide.matches) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(rows.indexOf(entry.target));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      rows.forEach(function (r) { io.observe(r); });
    }
    activate(0);
  }


  /* ---- mobile action bar -------------------------------------------------- */

  function initActionBar() {
    var bar = document.querySelector('[data-action-bar]');
    if (!bar) return;
    var footer = document.querySelector('.site-footer');
    var footerVisible = false;
    var ticking = false;

    function update() {
      var past = window.scrollY > window.innerHeight * 0.6;
      bar.classList.toggle('is-visible', past && !footerVisible);
      ticking = false;
    }
    if (footer && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        update();
      }).observe(footer);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }


  /* ---- footer year ------------------------------------------------------ */

  function initYear() {
    var els = document.querySelectorAll('[data-year]');
    Array.prototype.forEach.call(els, function (el) { el.textContent = new Date().getFullYear(); });
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



  /* ---- reveal on scroll -------------------------------------------------- */

  /* Blocks rise into place, photographs are uncovered. Opt-in and fail-safe:
       • nothing is hidden unless this script runs and motion is allowed;
       • anything already on screen is shown at once;
       • if the observer never fires, a timer shows everything anyway.
     Markup can opt in with data-reveal; project items opt in from their
     template, so new projects get it with no extra work. */
  var REVEAL_SELECTOR = '[data-reveal]';

  BC.initReveal = function (scope, animateVisible) {
    var els = Array.prototype.slice.call((scope || document).querySelectorAll(REVEAL_SELECTOR))
      .filter(function (el) { return !el.classList.contains('is-in'); });
    if (!els.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });

    var vh = window.innerHeight;
    var shown = 0;
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top < vh) {
        if (animateVisible) {
          /* Newly rendered content (a filter change) settles in, staggered. */
          el.style.setProperty('--reveal-delay', Math.min(shown++, 5) * 90 + 'ms');
          window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { el.classList.add('is-in'); });
          });
        } else {
          /* On load, whatever is already on screen is simply there. */
          el.classList.add('is-in');
        }
      } else {
        io.observe(el);
      }
    });
    root.classList.add('js-reveal');

    /* Belt and braces: whatever happens, nothing on screen stays hidden. */
    window.setTimeout(function () {
      els.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 2500);
  };


  /* ---- boot -------------------------------------------------------------- */

  function init() {
    initHeader();
    initMenu();
    initServices();
    initActionBar();
    initYear();
    BC.initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
