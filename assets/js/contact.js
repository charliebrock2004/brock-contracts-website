/* ==========================================================================
   Brock Contracts — enquiry form

   There is no server behind this site, so the form does not pretend to send
   anything. It checks the details, then opens the visitor's own email app
   with a tidy message addressed to Brock Contracts. Nothing leaves their
   device until they press send there, and the page says exactly that.

   If their email app doesn't open (common on shared or work computers), the
   same message is shown on the page with a button to copy it, alongside the
   email address and phone number.

   Arriving from a service or project page pre-fills the form:
     /contact?service=kitchens        selects "Kitchen"
     /contact?project=sierras         names that project in the message

   Without JavaScript the form still works as a plain mailto: form.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var TO = 'c.brock016@btinternet.com';
  var PHONE = '07980 136188';
  var status = document.getElementById('enquiry-status');
  var done = document.getElementById('enquiry-done');

  function field(name) { return form.elements[name]; }
  function value(name) { var f = field(name); return f ? f.value.trim() : ''; }

  /* ---- pre-fill from the page the visitor came from ------------------- */
  var SERVICE_OPTIONS = {
    'joinery': 'Joinery & carpentry',
    'new-builds': 'New build or extension',
    'renovations': 'Renovation or refurbishment',
    'kitchens': 'Kitchen',
    'doors-windows': 'Doors & windows',
    'flooring': 'Flooring',
    'roofing': 'Roofing',
    'project-management': 'Something else'
  };
  var params = new URLSearchParams(window.location.search);
  var service = params.get('service');
  if (service && SERVICE_OPTIONS[service] && field('type')) {
    field('type').value = SERVICE_OPTIONS[service];
  }
  var projectSlug = params.get('project');
  var project = projectSlug && window.BC && BC.findProject ? BC.findProject(projectSlug) : null;
  if (project && field('message') && !field('message').value) {
    field('message').value = 'I’m interested in work similar to your ' + project.title + ' project.\n\n';
    var note = document.getElementById('enquiry-context');
    if (note) {
      note.textContent = 'You came from the ' + project.title + ' project, so it’s mentioned in your message. Change anything you like.';
      note.hidden = false;
    }
  }

  /* ---- validation ------------------------------------------------------ */
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

  function compose() {
    var type = value('type');
    var location = value('location');
    var subject = 'Project enquiry' + (type ? ' — ' + type : '') + (location ? ' in ' + location : '');
    var lines = [value('message'), '', '—', 'Name: ' + value('name')];
    if (value('phone')) lines.push('Phone: ' + value('phone'));
    if (location) lines.push('Where: ' + location);
    if (type) lines.push('Type of work: ' + type);
    return { subject: subject, body: lines.join('\n') };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var missing = ['name', 'message'].filter(function (name) { return !value(name); });
    ['name', 'message'].forEach(function (name) { setError(name, missing.indexOf(name) !== -1); });
    if (missing.length) {
      if (status) {
        status.hidden = false;
        status.textContent = missing.length === 2
          ? 'Please add your name and a line or two about the job.'
          : (missing[0] === 'name' ? 'Please add your name.' : 'Please add a line or two about the job.');
      }
      field(missing[0]).focus();
      return;
    }
    if (status) status.hidden = true;

    var msg = compose();
    var href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(msg.subject) +
      '&body=' + encodeURIComponent(msg.body);

    /* Show what happens next, and the message itself as a fallback. */
    if (done) {
      var pre = done.querySelector('[data-message]');
      if (pre) pre.textContent = 'To: ' + TO + '\nSubject: ' + msg.subject + '\n\n' + msg.body;
      var again = done.querySelector('[data-mailto]');
      if (again) again.href = href;
      done.hidden = false;
      done.focus();
    }
    window.location.href = href;
  });

  /* Copy the composed message for pasting into any email or message app. */
  var copyBtn = done && done.querySelector('[data-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = done.querySelector('[data-message]').textContent;
      var label = copyBtn.querySelector('span') || copyBtn;
      function copied() { label.textContent = 'Copied'; setTimeout(function () { label.textContent = 'Copy message'; }, 2500); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(copied, function () { label.textContent = 'Select the text above to copy it'; });
      } else {
        label.textContent = 'Select the text above to copy it';
      }
    });
  }
})();
