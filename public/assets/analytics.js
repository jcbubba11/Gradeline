/* One Stop usage stats, counted with GoatCounter (https://www.goatcounter.com): no cookies, no personal data.

   OFF until GOATCOUNTER_CODE is set. To turn it on, sign up free at goatcounter.com, pick a code
   (for example "onestop" gives onestop.goatcounter.com), and put that code between the quotes below.

   What gets counted: one page view per page, and one per tool opened in the app (the part of the
   address after #, such as "/#interview"). Review links are counted as "#review" without their ID,
   and query strings are never sent. Nothing typed into the site is sent.
   Skipped when: the browser sends Do Not Track or Global Privacy Control, the visitor switched
   counting off on /privacy/ (localStorage "gl-no-stats" = "1"), or the site runs locally. */
(() => {
  const GOATCOUNTER_CODE = "";

  if (!GOATCOUNTER_CODE) return;
  try { if (localStorage.getItem("gl-no-stats") === "1") return; } catch {}
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;
  if (location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname)) return;

  const view = () => {
    let h = location.hash.slice(1);
    if (h.startsWith("review-")) h = "review"; // review IDs are private links
    h = h.replace(/[^a-z0-9-]/gi, "").slice(0, 40);
    return location.pathname + (h ? "#" + h : "");
  };
  let last = "", first = true;
  const count = () => {
    const path = view();
    if (path === last || !window.goatcounter?.count) return;
    last = path;
    // Only the first count of a visit carries the referring site; tool switches inside the app don't.
    window.goatcounter.count(first ? { path, title: document.title } : { path, title: document.title, referrer: "" });
    first = false;
  };

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  s.onload = count;
  document.head.appendChild(s);
  window.addEventListener("hashchange", count);
})();
