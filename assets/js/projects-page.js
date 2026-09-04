/* ==========================================================================
   Brock Contracts — Projects listing page
   Renders every project from projects-data.js and wires up the category
   filter buttons.
   ========================================================================== */
(function () {
  'use strict';

  var grid      = document.getElementById('projects-grid');
  var filterBar = document.getElementById('project-filters');
  var countEl   = document.getElementById('projects-count');
  if (!grid) return;

  var projects = BC.projects();
  var ALL = 'All Projects';
  var active = ALL;

  /* Deep link support: projects.html?category=Extensions */
  var params = new URLSearchParams(window.location.search);
  var requested = params.get('category');

  function countIn(category) {
    if (category === ALL) return projects.length;
    return projects.filter(function (p) { return p.category === category; }).length;
  }

  /* Only offer a category button if at least one project uses it, so the bar
     stays tidy while the portfolio is still small. */
  function usedCategories() {
    return BC.categories().filter(function (c) { return countIn(c) > 0; });
  }

  function render() {
    var list = (active === ALL)
      ? projects
      : projects.filter(function (p) { return p.category === active; });

    if (!list.length) {
      grid.innerHTML =
        '<div class="empty-state">' +
          '<h3>No projects to show yet</h3>' +
          '<p>Projects in this category will appear here soon.</p>' +
        '</div>';
    } else {
      grid.innerHTML = list.map(BC.projectCard).join('');
    }

    if (countEl) {
      countEl.textContent = list.length === 1
        ? '1 project'
        : list.length + ' projects';
    }
  }

  function buildFilters() {
    if (!filterBar) return;
    var used = usedCategories();

    /* A filter offering one category is not a filter. It reappears on its own
       as soon as a project in a second category is added. */
    if (used.length < 2) {
      filterBar.hidden = true;
      return;
    }

    var cats = [ALL].concat(used);

    filterBar.innerHTML = cats.map(function (cat) {
      var isActive = cat === active;
      return '<button class="filter-btn" type="button" data-category="' + BC.esc(cat) + '"' +
             ' aria-pressed="' + (isActive ? 'true' : 'false') + '">' +
               BC.esc(cat) +
               '<span class="filter-count">' + countIn(cat) + '</span>' +
             '</button>';
    }).join('');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      active = btn.getAttribute('data-category');

      Array.prototype.forEach.call(filterBar.querySelectorAll('.filter-btn'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      render();
    });
  }

  if (requested && countIn(requested) > 0) active = requested;

  buildFilters();
  render();
})();
