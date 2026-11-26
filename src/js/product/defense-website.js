  /* Defense: Tron Future website image (Joel 2026-11-27: "這張圖要 hover zoom in，且上方有一條線跟字，字寫 Website - Brand
     Visual Identity - 參與打磨建構"). Adds a caption + line above the image in the style of the exhibition title bars
     ("2025 Taipei Aerospace ..."). Zoom and layout: src/css/product/defense-website.css. Phone, iPad, computer. */
  ready(function () {
    var box = document.getElementById('comp-mw0ptxhx'); if (!box || box.querySelector('.jcd-webcap')) return;
    var cap = document.createElement('div'); cap.className = 'jcd-webcap';
    cap.innerHTML = '<p>Website<i>|</i>Brand Visual Identity<i>|</i>Design Refinement &amp; Build</p><span class="jcd-webcap-line" aria-hidden="true"></span>';
    box.insertBefore(cap, box.firstChild);
  });

