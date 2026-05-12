/* ── Baez Auto Repair — GA4 Click Tracking ─────────────────────────────
   Uses event delegation via data-track attributes on links and buttons.
   One shared file loaded on every page via <script src="/tracking.js" defer>.

   Event names:
     phone_click    — phone numbers and call buttons
     booking_click  — Book Online / Calendly links
     service_click  — service nav cards, grid cards, dropdown links
     location_click — Google Maps / address links
     nav_click      — nav links, footer links, language toggle, hamburger
     contact_click  — email link clicks

   Parameters sent on every event:
     category        — phone | booking | service | location | navigation | contact
     label           — button text or identifier
     click_location  — nav | nav_dropdown | mobile_menu | hero |
                        homepage_services_grid | services_page_grid |
                        contact_section | cta_section | visit_strip | footer
     page_language   — from <html lang="...">

   Optional parameters:
     service_type    — brakes | ac | oil_change | engine | tires | battery |
                        suspension | all_services
     destination_url — href of the clicked element
   ─────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Page language — read directly from <html lang="..."> */
  var lang = document.documentElement.lang || 'en';

  /* ── Hamburger open/close ─────────────────────────────────────────────
     The inline <script> at the bottom of each page registers its click
     handler first (DOM order), toggles the class, then this handler fires.
     Post-toggle: classList.contains('open') === true  → just opened
                  classList.contains('open') === false → just closed       */
  var hamburgerBtn = document.getElementById('hamburger');
  var mobileMenuEl = document.getElementById('mobileMenu');
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      var opened = mobileMenuEl && mobileMenuEl.classList.contains('open');
      gtag('event', 'nav_click', {
        category:       'navigation',
        label:          opened ? 'hamburger_open' : 'hamburger_close',
        click_location: 'nav',
        page_language:  lang
      });
    });
  }

  /* ── Delegated listener for all [data-track] elements ────────────────
     Reads data attributes off the nearest ancestor with data-track.
     Does not interfere with default navigation or existing onclick handlers
     (e.g. the AW conversion handler on auto-repair phone links).           */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;

    var params = {
      category:       el.getAttribute('data-category')      || '',
      label:          el.getAttribute('data-label')          || '',
      click_location: el.getAttribute('data-click-location') || '',
      page_language:  lang
    };

    var dest = el.getAttribute('data-destination-url');
    if (dest) params.destination_url = dest;

    var svc = el.getAttribute('data-service-type');
    if (svc) params.service_type = svc;

    gtag('event', el.getAttribute('data-track'), params);
  });

})();
