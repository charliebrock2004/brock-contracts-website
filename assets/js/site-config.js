/* ==========================================================================
   Brock Contracts — site configuration
   --------------------------------------------------------------------------
   SITE_URL is the address the site is served from. It is also written into
   every page's canonical link, the sitemap and robots.txt, so to change it
   run  python3 tools/set-domain.py https://new-domain  which updates all of
   them together. project-page.js reads it for each project's canonical link.
   ========================================================================== */
(function (root) {
  'use strict';

  var SITE_URL = 'https://brock-contracts-website.vercel.app';

  root.BC_SITE = {
    url: SITE_URL.replace(/\/$/, ''),
    name: 'Brock Contracts',
    legalName: 'Brock Contracts',
    tagline: 'Joinery & building work, done right.',
    phoneDisplay: '07980 136188',
    phoneTel: '+447980136188',
    email: 'c.brock016@btinternet.com',
    streetAddress: '3 Holly Place',
    addressLocality: 'Crieff',
    addressRegion: 'Perth and Kinross',
    postalCode: 'PH7 3EP',
    addressCountry: 'GB',
    sameAs: [
      'https://www.facebook.com/p/brock-contracts-100039208331893/',
      'https://www.yell.com/biz/brock-contracts-crieff-10071389/'
    ]
  };
})(window);
