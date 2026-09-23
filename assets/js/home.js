/* ==========================================================================
   Brock Contracts — homepage "Selected work" and project index

   Two things are built here from assets/js/projects-data.js:

   1. Selected work — a small number of projects shown large, each as a
      composition of several of its own photographs. Which projects, which
      photographs and which layout are chosen in HOME_FEATURES below, because
      the homepage is curated: the photographs have to work together and must
      not repeat images used elsewhere on the page. Titles, locations,
      categories and summaries always come from the project data.

   2. The project index — every project in the data file, in order, as a
      simple list. New projects appear here automatically.
   ========================================================================== */
(function () {
  'use strict';

  var HOME_FEATURES = [
    {
      slug: 'sierras',
      layout: 'trio',
      images: [
        { src: 'images/site/home-sierras-kitchen.jpg', full: 'images/projects/sierras/kitchen-01.jpg', caption: 'Kitchen' },
        { src: 'images/site/home-sierras-utility.jpg', full: 'images/projects/sierras/utility-01.jpg', caption: 'Fitted utility' },
        { src: 'images/site/home-sierras-bathroom.jpg', full: 'images/projects/sierras/bathroom-01.jpg', caption: 'Bathroom' }
      ]
    },
    {
      slug: 'flooring-bridge-of-allan',
      layout: 'portraits',
      images: [
        { src: 'images/site/home-flooring-04.jpg', full: 'images/projects/flooring-bridge-of-allan/flooring-04.jpg', caption: 'Bay room, finished' },
        { src: 'images/site/home-flooring-05.jpg', full: 'images/projects/flooring-bridge-of-allan/flooring-05.jpg', caption: 'Through to the kitchen' },
        { src: 'images/site/home-flooring-01.jpg', full: 'images/projects/flooring-bridge-of-allan/flooring-01.jpg', caption: 'The same room, before' }
      ]
    }
  ];

  var esc = BC.esc;
  var ARROW = BC.ICON_ARROW;

  /* Alt text comes from the project data, matched on the full-size file. */
  function altFor(project, full) {
    var photos = [project.mainImage].concat(project.gallery || []);
    for (var i = 0; i < photos.length; i++) {
      if (photos[i] && photos[i].src === full && photos[i].alt) return photos[i].alt;
    }
    return project.title;
  }

  function feature(cfg) {
    var project = BC.findProject(cfg.slug);
    if (!project) return '';
    var href = 'project.html?p=' + encodeURIComponent(project.slug);
    var meta = '<span>' + esc(project.category) + '</span>' +
      (project.location ? '<span>' + esc(project.location) + '</span>' : '');

    var figures = cfg.images.map(function (img) {
      return '<figure>' +
          '<a href="' + esc(href) + '" tabindex="-1" aria-hidden="true">' +
            '<img src="' + esc(img.src) + '" alt="' + esc(altFor(project, img.full)) + '" loading="lazy" decoding="async">' +
          '</a>' +
          (img.caption ? '<figcaption>' + esc(img.caption) + '</figcaption>' : '') +
        '</figure>';
    }).join('');

    return '' +
      '<article class="feature feature--' + esc(cfg.layout) + '">' +
        '<div class="feature__images">' + figures + '</div>' +
        '<div class="feature__text">' +
          '<p class="feature__meta">' + meta + '</p>' +
          '<h3 class="feature__title"><a href="' + esc(href) + '">' + esc(project.title) + '</a></h3>' +
          '<p class="feature__summary">' + esc(project.summary) + '</p>' +
          '<a class="link-arrow" href="' + esc(href) + '">View project<span class="visually-hidden">: ' + esc(project.title) + '</span>' + ARROW + '</a>' +
        '</div>' +
      '</article>';
  }

  var work = document.getElementById('selected-work');
  if (work) {
    var html = HOME_FEATURES.map(feature).join('');
    if (html) work.innerHTML = html;
  }

  var index = document.getElementById('project-index');
  if (index) {
    index.innerHTML = BC.projects().map(function (p) {
      var status = BC.projectStatus(p);
      return '<li class="index__row">' +
        '<a class="index__link" href="project.html?p=' + encodeURIComponent(p.slug) + '">' +
          '<span class="index__title">' + esc(p.title) +
            (status ? '<span class="index__status">' + esc(status) + '</span>' : '') +
          '</span>' +
          '<span class="index__detail">' + esc(p.location || '') + '</span>' +
          '<span class="index__detail">' + esc(p.category) + '</span>' +
          '<svg class="index__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>' +
        '</a>' +
      '</li>';
    }).join('');
    var count = document.getElementById('project-count');
    if (count) count.textContent = BC.projects().length;
  }
})();
