/* =========================================================================
   The only JavaScript on the site: fade sections in as they scroll into view.
   Everything is readable without it — if this file fails to load, the page
   simply shows all its content immediately.
   ========================================================================= */

/* ---------------------------------------------------------------------------
   RSVP: fold whatever the guest types into the WhatsApp message.
   The link already works without this — it just carries a generic message.
   --------------------------------------------------------------------------- */

(function () {
  'use strict';

  var input = document.getElementById('rsvp-names');
  var link = document.getElementById('rsvp-send');
  if (!input || !link) return;

  var number = link.getAttribute('data-whatsapp');

  function update() {
    var who = input.value.trim();
    var message = who
      ? "Hi! I'd like to RSVP for Varsha & Sanjay's wedding — " + who + ' will be coming.'
      : "Hi! I'd like to RSVP for Varsha & Sanjay's wedding.";
    link.href = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
  }

  input.addEventListener('input', update);

  // Enter in the box should send, the way a real form would
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); update(); link.click(); }
  });

  update();
})();

(function () {
  'use strict';

  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No IntersectionObserver, or the guest prefers less motion: just show it all.
  if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      // Stagger siblings within the same timeline so events arrive in order.
      var siblings = entry.target.parentElement
        ? Array.prototype.indexOf.call(entry.target.parentElement.children, entry.target)
        : 0;
      entry.target.style.transitionDelay = Math.min(siblings, 3) * 90 + 'ms';

      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12
  });

  for (var j = 0; j < items.length; j++) observer.observe(items[j]);
})();
