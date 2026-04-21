(function () {
  'use strict';

  var envelope = document.getElementById('envelope');
  var flap     = document.querySelector('.env-flap');
  var letter   = document.getElementById('letter');
  var hint     = document.getElementById('hint');
  var invite   = document.getElementById('invitation');
  var opened   = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    // Hide the hint
    hint.classList.add('hidden');

    // Step 1 — open flap (0ms)
    flap.classList.add('open');

    // Step 1b — drop flap behind letter once past 90° (~half of 1.3s)
    setTimeout(function () {
      flap.classList.add('behind');
    }, 700);

    // Step 2 — overflow visible + letter rises (900ms)
    setTimeout(function () {
      envelope.classList.add('open-overflow');
      letter.classList.add('rising');
    }, 900);

    // Step 3 — fade out envelope (2500ms)
    setTimeout(function () {
      envelope.classList.add('fading');
    }, 2500);

    // Step 4 — show full invitation (3400ms)
    setTimeout(function () {
      invite.removeAttribute('aria-hidden');
      invite.classList.add('visible');
    }, 3400);
  }

  envelope.addEventListener('click', openEnvelope);

  // Keyboard accessibility
  envelope.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

}());
