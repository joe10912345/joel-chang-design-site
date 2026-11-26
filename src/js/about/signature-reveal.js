  /* About signature (Joel 2026-11-26): hidden until it scrolls into view, then appears from left to right with a
     soft edge (1.6s), once. Every platform; reduced motion = shown at once. CSS: .jcd-sig / .jcd-sig-in. */
  ready(function () {
    var img = document.getElementById('img_comp-mujp6oap'); if (!img) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    img.loading = 'eager'; img.removeAttribute('loading');
    img.classList.add('jcd-sig');
    var go = function () { void img.offsetWidth; img.classList.add('jcd-sig-in'); };
    if (!('IntersectionObserver' in window)) { go(); return; }
    var done = false, fire = function () { if (done) return; done = true; setTimeout(go, 200); };
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); fire(); } }, { threshold: 0.6 });
    io.observe(img);
    /* backup: a plain scroll check (some embedded/throttled views never report the intersection) */
    var chk = function () { var r = img.getBoundingClientRect(); if (r.height && r.top < window.innerHeight * 0.92 && r.bottom > 0) { fire(); window.removeEventListener('scroll', chk); } };
    window.addEventListener('scroll', chk, { passive: true }); setTimeout(chk, 600);
  });

