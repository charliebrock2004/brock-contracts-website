/* ==========================================================================
   Brock Contracts — enquiry form
   There is no server behind this site, so the form does not pretend to send
   anything. It gathers the details, checks the two that matter, and opens
   the visitor's own email app with a tidy message addressed to us. Nothing
   leaves their device until they press send there.

   Without JavaScript the form still works as a plain mailto: form.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var TO = 'c.brock016@btinternet.com';
  var status = document.getElementById('enquiry-status');

  function field(name) { return form.elements[name]; }
  function value(name) { var f = field(name); return f ? f.value.trim() : ''; }

  function setError(name, on) {
    var input = field(name);
    var msg = document.getElementById('f-' + name + '-error');
    if (!input) return;
    if (on) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    if (msg) msg.hidden = !on;
  }

  ['name', 'message'].forEach(function (name) {
    var input = field(name);
    if (input) input.addEventListener('input', function () { if (input.value.trim()) setError(name, false); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var missing = ['name', 'message'].filter(function (name) { return !value(name); });
    ['name', 'message'].forEach(function (name) { setError(name, missing.indexOf(name) !== -1); });
    if (missing.length) {
      field(missing[0]).focus();
      return;
    }

    var type = value('type');
    var location = value('location');
    var subject = 'Project enquiry' + (type ? ' — ' + type : '') + (location ? ' in ' + location : '');

    var lines = [
      value('message'),
      '',
      '—',
      'Name: ' + value('name')
    ];
    if (value('phone')) lines.push('Phone: ' + value('phone'));
    if (location) lines.push('Where: ' + location);
    if (type) lines.push('Type of work: ' + type);

    var href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));

    if (status) {
      status.hidden = false;
      status.textContent = 'Your email app should now open with the message ready to send. If it doesn’t, email ' +
        TO + ' or call 07980 136188.';
    }
    window.location.href = href;
  });
})();
