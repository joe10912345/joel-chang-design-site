  /* No hover tooltips (Joel 2026-11-26: resting the mouse on a photo showed its file name, e.g. "logo.png").
     Wix's title attributes were removed from the HTML; this also strips any that appear later (gallery hover
     overlays inserted by site.js, SVG <title>s) on every page. Form fields keep theirs. */
  (function () {
    function strip(root) {
      if (!root || !root.querySelectorAll) return;
      if (root.hasAttribute && root.hasAttribute('title') && !/^(INPUT|TEXTAREA|SELECT)$/.test(root.tagName)) root.removeAttribute('title');
      [].forEach.call(root.querySelectorAll('[title]'), function (e) { if (!/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)) e.removeAttribute('title'); });
      [].forEach.call(root.querySelectorAll('svg title'), function (t) { t.parentNode.removeChild(t); });
    }
    ready(function () {
      strip(document.body);
      if ('MutationObserver' in window) new MutationObserver(function (ms) {
        ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) strip(n); }); });
      }).observe(document.body, { childList: true, subtree: true });
    });
  })();

