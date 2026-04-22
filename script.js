(function () {
  'use strict';

  var envelope      = document.getElementById('envelope');
  var flap          = document.querySelector('.env-flap');
  var letter        = document.getElementById('letter');
  var hint          = document.getElementById('hint');
  var invite        = document.getElementById('invitation');
  var scene         = document.getElementById('scene');
  var bottomFlowers = document.getElementById('bottom-flowers');
  var topFlowers    = document.getElementById('top-flowers');
    var opened = false;
    

  // ── Night mode ──
  var nightToggle = document.getElementById('night-toggle');
  if (localStorage.getItem('night') === 'true') {
    document.body.classList.add('night');
  }
  if (document.body.classList.contains('night')) {
    nightToggle.setAttribute('aria-checked', 'true');
  }
  nightToggle.addEventListener('click', function () {
    var isNight = document.body.classList.toggle('night');
    nightToggle.setAttribute('aria-checked', isNight ? 'true' : 'false');
    localStorage.setItem('night', isNight);
  });

  // Disable scroll on envelope screen
  document.body.style.overflow = 'hidden';

  function openEnvelope() {
    if (opened) return;
    opened = true;

    // Hide the hint
    // (fades with envelope at step 3)

    // Step 1 — open flap (0ms)
    flap.classList.add('open');

    // Step 1b — drop flap behind letter once past 90° (~half of 1.8s)
    setTimeout(function () {
      flap.classList.add('behind');
    }, 950);

    // Step 2 — overflow visible + letter + flowers rise (1300ms)
    setTimeout(function () {
      envelope.classList.add('open-overflow');
      envelope.classList.add('flowers-out');
      letter.classList.add('rising');
    }, 1300);

    // Step 3 — fade out envelope + scene + flowers + hint (3200ms)
    setTimeout(function () {
      envelope.classList.add('fading');
      scene.classList.add('closing');
      bottomFlowers.classList.add('closing');
      topFlowers.classList.add('closing');
      hint.classList.add('hidden');
    }, 3200);

    // Step 4 — show full invitation + remove scene (4200ms)
    setTimeout(function () {
      invite.removeAttribute('aria-hidden');
      invite.classList.add('visible');
      scene.style.display = 'none';
      bottomFlowers.style.display = 'none';
      topFlowers.style.display = 'none';
      document.body.style.overflow = '';
      nightToggle.classList.remove('night-toggle--hidden');

      // Step 5 — transition invitation from fixed overlay to in-flow hero (after opacity fade-in)
      setTimeout(function () {
        invite.classList.add('inv-settled');
        document.body.classList.add('scrollable');
      }, 1000);
    }, 4200);
  }

  envelope.addEventListener('click', openEnvelope);

  // Keyboard accessibility
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  // Scroll reveal
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.msg-inner, .cd-inner, .rsvp-inner').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Countdown — set your wedding date here
  var weddingDate = new Date('2026-09-01T18:00:00');

  function updateCountdown() {
    var now = new Date();
    var diff = weddingDate - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent    = '00';
      document.getElementById('cd-hours').textContent   = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }
    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000)  / 60000);
    var seconds = Math.floor((diff % 60000)    / 1000);
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    document.getElementById('cd-days').textContent    = pad(days);
    document.getElementById('cd-hours').textContent   = pad(hours);
    document.getElementById('cd-minutes').textContent = pad(minutes);
    document.getElementById('cd-seconds').textContent = pad(seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // RSVP — attendance radio toggles guest count field
  var attendanceInputs = document.querySelectorAll('input[name="attendance"]');
  var guestCountField = document.getElementById('guest-count-field');

  attendanceInputs.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.value === 'yes') {
        guestCountField.classList.add('visible');
      } else {
        guestCountField.classList.remove('visible');
      }
    });
  });

  // RSVP — form submit (showcase only)
  var rsvpForm = document.getElementById('rsvp-form');
  var rsvpSuccess = document.getElementById('rsvp-success');

  rsvpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('visible');
  });

  // Smooth scroll for inv-cta
  document.querySelector('.inv-cta').addEventListener('click', function (e) {
    e.preventDefault();
    var target = document.getElementById('rsvp');
    if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
  });

}());
