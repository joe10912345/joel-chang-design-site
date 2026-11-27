  /* Jump to a section by name (Joel 2026-11-27: home "Buildable Execution Mindset" -> Wi-Fi 7 HGU/AP "cutting costs in
     half"). page.html#<name> scrolls to the heading jcd-config.js links.anchors[<name>] names, just under the header, once
     the page's layout scripts have finished. Every page, phone + iPad + computer. */
  (function () {
    var name = decodeURIComponent((location.hash || '').slice(1)); if (!name) return;
    function go() {
      var words = ((window.JCD_CONFIG && JCD_CONFIG.links && JCD_CONFIG.links.anchors) || {})[name]; if (!words) return;
      var t = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'), function (x) {
        return x.textContent.replace(/\s+/g, ' ').indexOf(words) >= 0 && x.getBoundingClientRect().height > 0; })[0];
      if (!t) return;
      var hdr = document.getElementById('SITE_HEADER'), hb = hdr ? hdr.getBoundingClientRect().height : 0;
      window.scrollTo(0, Math.max(0, t.getBoundingClientRect().top + window.scrollY - hb - 24));
      document.documentElement.classList.remove('jcd-anchoring');   /* site.js hid the page until now: fade it in here */
    }
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    /* the page stays hidden (site.js) until the layout scripts have settled, then lands and fades in; a second pass
       catches any later shift */
    var run = function () { setTimeout(go, 700); setTimeout(go, 1600); };
    document.readyState === 'complete' ? run() : window.addEventListener('load', run);
  })();
