  /* T. Blade: the last photo (drone on its stand) the same size as the wide photo above it, with the same gap as
     between the photos above (Joel 2026-11-27: "t.blade 最下方的圖尺寸跟上方要一致，且間距要一樣"). It sits alone in
     its own Wix section with a fixed row height and a top margin, so it was lower and a different size. Measured from
     the page itself on every layout (computer, iPad both ways, phone), so no number is written here. */
  ready(function () {
    var last = document.getElementById('comp-mojvluae4'), wide = document.getElementById('comp-mojvxsun'),
        above = document.getElementById('comp-mojvlua85');
    if (!last || !wide || !above) return;
    var grid = last.parentElement, below = null;
    function fit() {
      var z = window.__jcdZoom || 1;   /* rects are window px; styles are CSS px */
      var rl = last.getBoundingClientRect(), rs = last.closest('section').getBoundingClientRect();
      if (below === null) below = (rs.bottom - rl.bottom) / z;   /* keep the original space under the photo */
      var rw = wide.getBoundingClientRect(), gap = rw.top - above.getBoundingClientRect().bottom;
      var mt = parseFloat(getComputedStyle(last).marginTop) || 0;
      grid.style.setProperty('min-height', '0', 'important');
      grid.style.setProperty('grid-template-rows', 'auto', 'important');
      last.style.setProperty('height', rw.height / z + 'px', 'important');
      last.style.setProperty('width', rw.width / z + 'px', 'important');
      last.style.setProperty('margin-left', (parseFloat(getComputedStyle(last).marginLeft) || 0) + (rw.left - rl.left) / z + 'px', 'important');
      last.style.setProperty('margin-bottom', below + 'px', 'important');
      last.style.setProperty('margin-top', mt + (rw.bottom + gap - last.getBoundingClientRect().top) / z + 'px', 'important');
      var img = last.querySelector('img'); if (img) img.style.setProperty('object-fit', 'cover', 'important');
    }
    fit();
    window.addEventListener('load', fit);
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(fit, 150); });
  });
