/* ==========================================================================
   Brock Contracts — site configuration
   --------------------------------------------------------------------------
   SITE_URL is the preferred public origin. HTML canonicals, Open Graph,
   JSON-LD, sitemap.xml and robots.txt use the same origin and must be
   updated together with this value.
   ========================================================================== */
(function (root) {
  'use strict';

  // custom domain brockcontracts.co.uk is not connected yet; switch SITE_URL back when that domain resolves and 301s to it.
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
