// Bandeau cookies (accepter / refuser / personnaliser) et formulaire de réservation de démonstration.
(function () {
  var KEY = "maison-leonie-cookies";
  function read() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ audience: choice.audience, tiers: choice.tiers, date: Date.now() })); } catch (e) {}
  }

  var banner = document.getElementById("cookie-banner");
  var prefs = document.getElementById("cookie-prefs");
  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  var stored = read();
  var SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
  if (!stored || Date.now() - stored.date > SIX_MONTHS) show();

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cookies]");
    if (!t) return;
    var action = t.getAttribute("data-cookies");
    if (action === "accept") { save({ audience: true, tiers: true }); hide(); }
    if (action === "refuse") { save({ audience: false, tiers: false }); hide(); }
    if (action === "custom") { prefs.hidden = !prefs.hidden; }
    if (action === "save") {
      save({ audience: document.getElementById("pref-audience").checked, tiers: document.getElementById("pref-tiers").checked });
      hide();
    }
    if (action === "open") {
      var s = read();
      if (s) {
        document.getElementById("pref-audience").checked = !!s.audience;
        document.getElementById("pref-tiers").checked = !!s.tiers;
      }
      prefs.hidden = false; show();
    }
  });

  var form = document.getElementById("resa-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var ok = document.getElementById("form-ok");
      ok.hidden = false;
      ok.scrollIntoView({ block: "nearest" });
      form.reset();
    });
  }
})();

// Réservation : pas de date passée.
(function () {
  var d = document.getElementById("r-date");
  if (!d) return;
  var now = new Date();
  var pad = function (n) { return String(n).padStart(2, "0"); };
  d.min = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
})();

// Menu mobile : fermeture par Échap, clic en dehors ou choix d'un lien.
(function () {
  var menu = document.querySelector(".menu-toggle");
  if (!menu) return;
  var summary = menu.querySelector("summary");
  function close(focus) {
    if (!menu.open) return;
    menu.open = false;
    if (focus) summary.focus();
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
  document.addEventListener("click", function (e) { if (!menu.contains(e.target)) close(false); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) close(false); });
})();
