  /* Closing photo of product pages: Wix-style scroll reveal (Joel 2026-11-26: "邊滾動揭露", like the Wix site).
     The last section of a product page is a photo with no text. It is now exactly as tall as the photo (width / photo
     ratio, at most one screen), so the whole photo (products included) is visible at the end of the page. While the
     page scrolls in, the photo stays still at the bottom of the screen and the section's top edge slides up over it,
     the way Wix's "fixed" background did. Photo-only = no text in the section. Phone, iPad and computer alike. */
  ready(function () {
    var secs = [].filter.call(document.querySelectorAll('#PAGES_CONTAINER section'), function (s) {
      return !s.parentElement.closest('section'); });
    var sec = secs[secs.length - 1]; if (!sec) return;
    /* the section's background photo (on the phone Wix did not make it sticky, so it may not be pinned above) */
    var wi = sec.querySelector('[id^="bgMedia_"] > wow-image[id^="img_"]'); if (!wi) return;
    if (sec.querySelector('[data-testid="richTextElement"]')) return;
    var img = wi.querySelector('img'); if (!img) return;
    /* never lazy: the section's height comes from the photo, and a lazy photo in a 0px section never loads (2026-11-26) */
    img.loading = 'eager'; img.removeAttribute('loading');
    var fm = /-(\d+)x(\d+)(?:-[a-z0-9]+)?\.(?:jpe?g|png|webp)/i.exec(img.getAttribute('src') || '');   /* size in the file name */
    var media = wi.parentElement;
    /* Done with CSS sticky, not a scroll script (Joel 2026-11-26: with the script, fast scrolling showed white gaps
       because the photo was moved a frame late). The media box reaches one photo-height above the section; the photo
       sits at its bottom (= the section) and is sticky at the screen bottom, so the browser itself keeps it still
       while the section's top edge (the section's background box clips it) slides up over it. */
    /* the section's background box clips the photo; 'clip', not 'hidden' (phone): 'hidden' would make it the sticky
       photo's scroll box and the photo would not stay still */
    if (media.parentElement) media.parentElement.style.setProperty('overflow', 'clip', 'important');
    media.style.setProperty('overflow', 'visible', 'important'); media.style.setProperty('margin', '0', 'important');   /* Wix: margin-top -1 screen */
    media.style.setProperty('transform', 'none', 'important');
    /* photo at the bottom of the box via flex (a margin above it would leave the sticky photo no room to move) */
    media.style.setProperty('display', 'flex', 'important'); media.style.setProperty('flex-direction', 'column', 'important');
    media.style.setProperty('justify-content', 'flex-end', 'important');
    media.style.setProperty('left', '0', 'important'); media.style.setProperty('width', '100%', 'important');
    ['position:sticky', 'top:auto', 'bottom:0', 'left:auto', 'width:100%', 'display:block', 'transform:none', 'flex:none', 'margin:0'].forEach(function (d) {
      var kv = d.split(':'); wi.style.setProperty(kv[0], kv[1], 'important'); });
    img.style.setProperty('width', '100%', 'important'); img.style.setProperty('height', '100%', 'important');
    img.style.setProperty('object-fit', 'cover', 'important');
    sec.classList.add('jcd-reveal');
    /* Wix gives the section's empty content box its old height (e.g. 1000px): it would leave a blank strip below */
    [].forEach.call(sec.querySelectorAll('[data-testid="inline-content"], [data-testid="mesh-container-content"]'), function (c) {
      c.style.setProperty('height', '100%', 'important'); c.style.setProperty('min-height', '0', 'important'); });
    function Z() { return window.__jcdZoom || 1; }
    var ratio = 0;
    function size() {
      if (img.naturalWidth) ratio = img.naturalWidth / img.naturalHeight;
      else if (fm) ratio = +fm[1] / +fm[2];
      if (!ratio) return;
      var w = sec.offsetWidth, vh = window.innerHeight / Z();
      var h = Math.round(Math.min(w / ratio, vh));
      sec.style.setProperty('height', h + 'px', 'important');
      sec.style.setProperty('min-height', h + 'px', 'important');
      media.style.setProperty('position', 'absolute', 'important');
      media.style.setProperty('top', -h + 'px', 'important');
      media.style.setProperty('height', 2 * h + 'px', 'important');
      wi.style.setProperty('height', h + 'px', 'important');
    }
    window.addEventListener('resize', size);
    window.addEventListener('orientationchange', function () { setTimeout(size, 300); });
    if (img.complete) size(); img.addEventListener('load', size);
    setTimeout(size, 600); setTimeout(size, 2000);
  });

