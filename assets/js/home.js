/* ==========================================================================
   Brock Contracts — homepage "Our Work" preview
   Shows featured projects (or the most recent ones if none are flagged).
   ========================================================================== */
(function () {
  'use strict';

  var grid = document.getElementById('featured-projects');
  if (!grid) return;

  var MAX = 3;
  var all = BC.projects();

  /* Prefer projects marked featured: true. If none are flagged yet, fall back
     to the first few so the homepage is never empty. */
  var featured = all.filter(function (p) { return p.featured; });
  if (!featured.length) featured = all;

  var list = featured.slice(0, MAX);

  if (!list.length) {
    grid.innerHTML =
      '<div class="empty-state">' +
        '<h3>Projects coming soon</h3>' +
        '<p>Photography from completed projects will be added here.</p>' +
      '</div>';
    return;
  }

  grid.innerHTML = list.map(BC.projectCard).join('');
})();
