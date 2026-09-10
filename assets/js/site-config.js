/* ==========================================================================
   Brock Contracts — site configuration
   --------------------------------------------------------------------------
   Change SITE_URL here when the production domain is connected.
   Canonical tags, Open Graph URLs, JSON-LD and the sitemap all read this
   value. Do not scatter the domain across individual pages.
   ========================================================================== */
(function (root) {
  'use strict';

  var SITE_URL = 'https://brockcontracts.co.uk';

  root.BC_SITE = {
    url: SITE_URL.replace(/\/$/, ''),
    name: 'Brock Contracts',
    legalName: 'Brock Contracts',
    tagline: 'Quality craftsmanship, built to last.',
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
