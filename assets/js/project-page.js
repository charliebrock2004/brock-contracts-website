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

  /* The page area stays invisible (see .project-loading in site.css) until
     the project has been written in, so nothing jumps as it fills. */
  function ready() { document.documentElement.classList.remove('project-loading'); }

  if (!project) {
    if (notFound) notFound.hidden = false;
    if (article) article.hidden = true;
    document.title = 'Project not found | Brock Contracts';
    ready();
    return;
  }

  if (notFound) notFound.hidden = true;
  if (article) article.hidden = false;

  var esc = BC.esc;

  /* ---- head / meta ------------------------------------------------------ */
  document.title = project.title + ' | Brock Contracts';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', project.summary || '');

  /* Each project is its own page as far as search engines and link
     previews are concerned: its own canonical address, title, description
     and image. */
  var siteUrl = (window.BC_SITE && window.BC_SITE.url) || window.location.origin;
  var pageUrl = siteUrl + '/project?p=' + encodeURIComponent(project.slug);
  function setMeta(attr, key, value) {
    var el = document.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }
  var canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = pageUrl;
  setMeta('property', 'og:title', project.title + ' | Brock Contracts');
  setMeta('property', 'og:description', project.summary || '');
  setMeta('property', 'og:url', pageUrl);
  setMeta('property', 'og:image', siteUrl + '/' + BC.imageSrc(project.mainImage).replace(/^\//, ''));

  /* "Discuss a similar project" opens the enquiry form with this project
     named in the message. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-enquire-project]'), function (a) {
    a.href = '/contact?project=' + encodeURIComponent(project.slug);
  });

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /* ---- hero ------------------------------------------------------------- */
  setText('project-title', project.title);
  setText('project-crumb', project.title);
  setText('project-location', project.location);
  setText('project-category', project.category);
  setText('project-summary', project.summary || '');

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
    /* An upright main photograph gets an upright frame (and the wider
       column) instead of being cropped to landscape. Decided once the
       photo's real proportions are known. */
    var dims = (window.BC_IMAGE_DIMS || {})[BC.imageSrc(project.mainImage)];
    if (article && dims && dims[1] > dims[0]) article.classList.add('case--portrait');
    leadImg.addEventListener('load', function () {
      if (article && leadImg.naturalHeight > leadImg.naturalWidth) {
        article.classList.add('case--portrait');
      }
    });
    var leadSet = BC.srcset(project.mainImage);
    if (leadSet) {
      leadImg.srcset = leadSet;
      leadImg.sizes = '(min-width: 1380px) 1340px, 100vw';
    }
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
  var PORTRAIT_RATIOS = ['2x3', '3x4', '4x5', '9x16'];
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

    /* A gallery made up entirely of upright photographs runs three or four
       across on wide screens, so it never becomes a tall column of phone
       shots. The count decides which, so the last row is never ragged. */
    var allUpright = gallery.every(isPortrait);
    if (allUpright && gallery.length > 2) {
      var cols = gallery.length % 4 === 0 ? 4 : (gallery.length % 3 === 0 ? 3 : 2);
      galleryGrid.classList.add('gallery-grid--upright');
      galleryGrid.style.setProperty('--cols', cols);
    }

    galleryGrid.innerHTML = gallery.map(function (photo, i) {
      var src = BC.imageSrc(photo);
      var small = BC.smallSrc(photo);
      var set = BC.srcset(photo);
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
          '<img src="' + esc(small) + '"' +
            (set ? ' srcset="' + esc(set) + '" sizes="' + (wideFlags[i] ? '100vw' : '(min-width: 600px) 50vw, 100vw') + '"' : '') +
            ' alt="' + esc(alt) + '" loading="lazy" decoding="async">' +
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

  /* ---- video ------------------------------------------------------------
     Optional. A project may carry one short clip:

       video: { src, poster, ratio, label, caption }

     It is played with the browser's own controls — no custom player, no
     library, nothing to load. The section is built here rather than sitting
     empty in the HTML, so a project without a video costs nothing.

     src     the .mp4. H.264 + AAC in an .mp4 is the one combination every
             desktop and mobile browser plays without a plugin.
     poster  a still shown before playback starts. Optional but worth it —
             without one the player is a black rectangle.
     ratio   as in the gallery, e.g. '9x16' for a phone clip held upright.
             Only used to decide how wide the player may run.
     label   heading for the section.
     caption a line underneath. Optional.
     ------------------------------------------------------------------------ */
  var video = project.video;
  if (video && video.src && article) {
    var videoSection = document.createElement('section');
    videoSection.id = 'project-video-section';

    var label = video.label || (project.title + ' \u2014 video');
    var poster = video.poster
      ? ' poster="' + esc(video.poster) + '"'
      : '';
    var captionEl = video.caption
      ? '<p class="project-video__caption">' + esc(video.caption) + '</p>'
      : '';

    videoSection.innerHTML = '' +
      '<div class="container">' +
        '<div class="section-head">' +
          '<p class="eyebrow">Video</p>' +
          '<h2>' + esc(label) + '</h2>' +
        '</div>' +
        '<div class="project-video' + (isPortrait(video) ? ' project-video--upright' : '') + '">' +
          '<video class="project-video__player" controls playsinline preload="metadata"' +
            poster + ' aria-label="' + esc(label) + '">' +
            '<source src="' + esc(video.src) + '" type="video/mp4">' +
            '<p>Your browser cannot play this video. ' +
              '<a href="' + esc(video.src) + '">Download it instead</a>.</p>' +
          '</video>' +
          captionEl +
        '</div>' +
      '</div>';

    /* Sits under the gallery where there is one, otherwise where the
       gallery would have been. */
    var after = gallerySection && !gallerySection.hidden ? gallerySection : null;
    if (after && after.parentNode) {
      after.parentNode.insertBefore(videoSection, after.nextSibling);
    } else if (gallerySection && gallerySection.parentNode) {
      gallerySection.parentNode.insertBefore(videoSection, gallerySection);
    } else {
      article.appendChild(videoSection);
    }
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
    /* The next-project panel carries that project's photograph. */
    var img = link.querySelector('[data-image]');
    if (img) {
      img.src = BC.smallSrc(target.mainImage);
      img.alt = '';
    }
  }

  /* Next project wraps round to the first, so every page ends with
     somewhere to go. Previous stays linear. */

  wire(prevLink, idx > 0 ? all[idx - 1] : null);
  wire(nextLink, all.length > 1 ? all[(idx + 1) % all.length] : null);

  ready();
})();
