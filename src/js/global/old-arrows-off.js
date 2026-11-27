  /* No old ">>" anywhere (Joel 2026-11-27: "舊 >> 應該都要移除了。我們有新的 >> 設計了"). Wix's own ">>" / ">" text blocks are
     hidden on every page and platform; the new plain ">>" (round-go-fill.css, .jcd-go) is the only one left. The Wix link
     elements stay in the page (hidden), so scripts that read their address (the cards, Design Approach) still work.
     Every page, phone + iPad + computer. */
  ready(function () {
    [].forEach.call(document.querySelectorAll('#PAGES_CONTAINER [data-testid="richTextElement"]'), function (t) {
      if (!/^>{1,2}$/.test(t.textContent.replace(/[\s​]/g, ''))) return;
      (t.closest('[id^="comp-"]') || t).classList.add('jcd-gg-hide');
    });
  });
