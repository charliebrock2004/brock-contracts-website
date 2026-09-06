/* ==========================================================================
   Brock Contracts — individual project page
   Reads ?p=<slug> from the address, finds that project in projects-data.js
   and builds the page. Unknown slugs get a clear "not found" message rather
   than an empty page.
   ========================================================================== */
(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('p');
  var project = slug ? BC.findProject(slug) : null;

  var notFound = document.getElementById('project-not-found');
  var article  = document.getElementById('project-article');

  if (!project) {
    if (notFound) notFound.hidden = false;
    if (article) article.hidden = true;
    document.title = 'Project not found | Brock Contracts';
    return;
  }

  if (notFound) notFound.hidden = true;
  if (article) article.hidden = false;

  var esc = BC.esc;

  /* ---- head / meta ------------------------------------------------------ */
  document.title = project.title + ' | Brock Contracts';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', project.summary || '');

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ---- hero ------------------------------------------------------------- */
  setText('project-title', project.title);
  setText('project-crumb', project.title);
  setText('project-location', project.location);
  setText('project-category', project.category);

  var completedWrap = document.getElementById('project-completed-wrap');
  if (project.completed) {
    setText('project-completed', project.completed);
  } else if (completedWrap) {
    completedWrap.hidden = true;
  }

  var exampleNotice = document.getElementById('project-example-notice');
  if (exampleNotice && project.isExample) exampleNotice.hidden = false;

  /* ---- main image ------------------------------------------------------- */
  var leadImg = document.getElementById('project-lead-img');
  if (leadImg) {
    leadImg.src = BC.imageSrc(project.mainImage);
    leadImg.alt = BC.imageAlt(project.mainImage, project.title + ' — Brock Contracts');
  }

  /* ---- description ------------------------------------------------------ */
  var descEl = document.getElementById('project-description');
  if (descEl) {
    var paras = project.description && project.description.length
      ? project.description
      : [project.summary || ''];
    descEl.innerHTML = paras
      .filter(function (p) { return p; })
      .map(function (p) { return '<p>' + esc(p) + '</p>'; })
      .join('');
  }

  /* ---- details panel ---------------------------------------------------- */
  var detailsEl = document.getElementById('project-details');
  var detailsList = document.getElementById('project-details-list');
  if (detailsEl && detailsList) {
    /* Location, category and completion date are shown automatically. Any
       custom rows are appended after them.

       If a custom row repeats one of those labels (e.g. its own "Location"),
       the custom value wins and is shown once, in the automatic row's
       position — otherwise the panel would list the same label twice. */
    var custom = (Array.isArray(project.details) ? project.details : [])
      .filter(function (d) { return d && d.label && d.value; });

    function takeCustom(label) {
      for (var i = 0; i < custom.length; i++) {
        if (custom[i].label.toLowerCase() === label.toLowerCase()) {
          return custom.splice(i, 1)[0].value;
        }
      }
      return null;
    }

    var rows = [];
    function addAuto(label, value) {
      var override = takeCustom(label);
      var final = override !== null ? override : value;
      if (final) rows.push({ label: label, value: final });
    }

    addAuto('Location', project.location);
    addAuto('Category', project.category);
    addAuto('Completed', project.completed);

    /* Whatever custom rows are left are genuinely new labels. */
    custom.forEach(function (d) { rows.push(d); });
    detailsList.innerHTML = rows.map(function (r) {
      return '<div><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>';
    }).join('');
  }

  /* ---- gallery ---------------------------------------------------------- */
  var gallerySection = document.getElementById('project-gallery-section');
  var galleryGrid = document.getElementById('project-gallery');
  var gallery = Array.isArray(project.gallery) ? project.gallery : [];

  /* Decides which photos run full width across the two-column mosaic.
     Every 5th photo goes wide, which gives rows of: full, pair, pair,
     full, pair... If that would leave the last photo sitting alone in a
     half-width slot, it is widened too, so the grid never ends ragged.
     Works for any number of photos. */
  /* A photo may declare an upright ratio, e.g. ratio: '3x4' (a standard
     phone portrait) or '2x3'. Anything else uses the landscape 3:2 frame the
     rest of the site is built on. Matching the frame to the photograph is
     what keeps it uncropped. */
  var PORTRAIT_RATIOS = ['2x3', '3x4', '4x5'];
  function isPortrait(photo) {
    return !!(photo && PORTRAIT_RATIOS.indexOf(photo.ratio) !== -1);
  }
  function frameClass(photo) {
    return 'ratio--' + ((photo && photo.ratio) || '3x2');
  }

  function galleryLayout(photos) {
    var count = photos.length;
    var wide = new Array(count);
    var col = 0;                       // 0 = start of a row, 1 = half filled
    for (var i = 0; i < count; i++) {
      // A portrait photograph is never run full width — at that scale it
      // would tower over everything around it.
      var isWide = (i % 5 === 0) && !isPortrait(photos[i]);
      wide[i] = isWide;
      col = isWide ? 0 : (col === 0 ? 1 : 0);
    }
    if (col === 1 && !isPortrait(photos[count - 1])) wide[count - 1] = true;
    return wide;
  }

  if (galleryGrid && gallery.length) {
    if (gallerySection) gallerySection.hidden = false;
    var wideFlags = galleryLayout(gallery);

    galleryGrid.innerHTML = gallery.map(function (photo, i) {
      var src = BC.imageSrc(photo);
      var alt = BC.imageAlt(photo, project.title + ' — photograph ' + (i + 1));
      var caption = photo && photo.caption ? photo.caption : '';
      var wideClass = wideFlags[i] ? ' gallery-item--wide' : '';
      var captionEl = caption
        ? '<span class="gallery-item__caption">' + esc(caption) + '</span>'
        : '';
      return '' +
        '<button class="gallery-item ratio ' + frameClass(photo) + wideClass + '" type="button"' +
          ' data-lightbox data-full="' + esc(src) + '"' +
          ' data-alt="' + esc(alt) + '"' +
          ' data-caption="' + esc(caption) + '"' +
          ' aria-label="View larger: ' + esc(alt) + '">' +
          '<img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
          captionEl +
          '<span class="gallery-item__zoom" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/>' +
            '</svg>' +
          '</span>' +
        '</button>';
    }).join('');
    BC.initLightbox();
  } else if (gallerySection) {
    /* No extra photos yet — hide the whole section rather than show an
       empty heading. */
    gallerySection.hidden = true;
  }

  /* ---- next / previous -------------------------------------------------- */
  var all = BC.projects();
  var idx = all.indexOf(project);
  var prevLink = document.getElementById('project-prev');
  var nextLink = document.getElementById('project-next');

  function wire(link, target) {
    if (!link) return;
    if (!target) { link.hidden = true; return; }
    link.hidden = false;
    link.href = 'project.html?p=' + encodeURIComponent(target.slug);
    link.querySelector('[data-label]').textContent = target.title;
  }

  wire(prevLink, idx > 0 ? all[idx - 1] : null);
  wire(nextLink, idx > -1 && idx < all.length - 1 ? all[idx + 1] : null);
})();
