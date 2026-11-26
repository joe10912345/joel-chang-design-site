  /* About "Trusted Collaboration": frosted-glass recommendation cards, style A1 (Joel 2026-11-24; design study in
     preview/testimonials-ui.html). The Wix quote / name / role pieces of section #comp-mujk8qkl stay in the HTML (for
     search engines) but are hidden; the heading stays. Desktop + iPad: featured card + 2 columns; phone: 1 column.
     LINKEDIN: each person's profile URL is `li` below; a card with a URL is a link (opens in a new tab). */
  (function () {
    var REC = [
      { n: 'Marcus Kung', r: 'Design Director, Tron Future', x: 'Former ID/PM, OPPO \u00b7 Royal College of Art',
        li: 'https://www.linkedin.com/in/marcus-kung-b15baa6a/',
        t: "Joel isn\u2019t just an executor. He\u2019s a designer with a clear point of view. He translates design intent into language engineering teams can act on immediately, and drives it through to mass production without losing the original vision. The kind of designer who brings a whole team together." },
      { n: 'Stanley Chai', r: 'Engineering Director, STR8 Industries', x: 'Former R&D Asst. Manager, Tron Future \u00b7 PhD, NYCU',
        li: 'https://www.linkedin.com/in/cychai1995/',
        t: "Joel moves seamlessly from requirements gathering to design execution: iterating quickly, adapting to feedback, and partnering closely with engineering to land on solutions that are both elegant and manufacturable. I\u2019d recommend him without hesitation." },
      { n: 'Rick Chen', r: 'CPO, Gemtek', x: 'Former Sr. R&D Director, Foxconn \u00b7 Former Sr. R&D Director, ASKEY',
        li: 'https://www.linkedin.com/in/rick-chen-1ba742/',
        t: "Having worked with Joel at Gemtek, I\u2019ve been consistently impressed by his fresh talent and innovative approach. He brings a mature skill set and collaborative spirit that makes him a fantastic team member." },
      { n: 'Kuo Kai Liao', r: 'Principal Designer, Tron Future', x: 'Former ID, Ubiquiti \u00b7 Sr. ID, ASUS',
        li: 'https://www.linkedin.com/in/kailiao929/',
        t: "Joel is a designer of great potential, whose technical competence is highly regarded by everyone on the team. He demonstrates a strong sense of ownership over his tasks, consistently ensuring top-tier deliverables." },
      { n: 'Ike Tsao', r: 'AVP, 5G Product Line, Gemtek', x: 'Former AVP 5G, Pegatron \u00b7 Former Sr. Director, Askey',
        li: 'https://www.linkedin.com/in/ike-tsao-78143814/',
        t: "Joel\u2019s ability to balance aesthetic appeal with practical functionality is truly exceptional. He always ensured the proposed solutions aligned not only with the visual identity of the product but also with technical requirements and production constraints." }
    ];
    var LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11.2 22 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21h-4z"/></svg>';
    function esc(x) { return x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function build() {
      var sec = document.getElementById('comp-mujk8qkl');
      if (!sec || sec.querySelector('.jcd-rec')) return;
      var grid = sec.querySelector('[data-mesh-id="comp-mujk8qklinlineContent-gridContainer"]');
      if (!grid) return;
      sec.classList.add('jcd-rec-on');
      var html = REC.map(function (p, i) {
        var tag = p.li ? 'a' : 'div';
        var attrs = p.li ? ' href="' + esc(p.li) + '" target="_blank" rel="noopener" aria-label="' + esc(p.n) + ' on LinkedIn"' : '';
        var ini = p.n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
        return '<' + tag + ' class="jcd-rec-card' + (i ? '' : ' feat') + (p.li ? ' has-link' : '') + '"' + attrs + '>' +
          '<span class="jcd-rec-q">\u201C</span><p class="jcd-rec-txt">' + esc(p.t) + '</p>' +
          '<div class="jcd-rec-who"><div class="jcd-rec-ava">' + ini + '</div><div><div class="jcd-rec-nm">' + esc(p.n) + '</div>' +
          '<div class="jcd-rec-rl">' + esc(p.r) + ' \u00b7 <i>' + esc(p.x) + '</i></div></div>' +
          (p.li ? '<span class="jcd-rec-li" title="LinkedIn">' + LI + '</span>' : '') + '</div></' + tag + '>';
      }).join('');
      var box = document.createElement('div'); box.className = 'jcd-rec'; box.innerHTML = '<div class="jcd-rec-grid">' + html + '</div>';
      grid.parentNode.insertBefore(box, grid.nextSibling);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', build) : build();
  })();
