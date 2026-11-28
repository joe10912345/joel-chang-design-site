/* jcd-config.js — the ONE place for the site's layout numbers (Joel 2026-11-27).
   全站版面參數只寫在這裡。改這個檔，site.js 和 preview/devices.html 會一起跟著變。

   Loaded on every page BEFORE site.js, and by preview/devices.html.
   每一頁都會先載入這個檔，再載入 site.js；三平台預覽也讀同一份。

   After editing: bump ?v= on jcd-config.js in every page HTML (site/ and site/m/, see AGENTS.md).
   改完要更新所有頁面 HTML 裡 jcd-config.js 的 ?v=。 */
window.JCD_CONFIG = {
  /* Whole desktop-layout page (computer + iPad) drawn at this fraction of its Wix size. Phone not affected.
     電腦版與 iPad 的整體縮放比例（手機不受影響）。 */
  uiScale: 0.85,

  /* Computer monitors: this many CSS px of layout always fill the window (then x uiScale). Laptop 1920 @125% = 1536.
     電腦螢幕：視窗寬度對應的版面寬度基準。 */
  desktopRef: 1536,

  /* iPad SIDE-MARGIN RULE / iPad 左右留白規則
     margin = share of the screen width left empty at EACH side of the page's content.
     margin = 內容左右「各」留下螢幕寬度的幾 %。
     content = width (layout px) of what must stay whole on that page type (frames, text + photo block).
     content = 該類頁面必須完整顯示的內容寬度（白框、文字＋照片區塊）。
     The iPad lays the page out  content / (1 - 2 x margin)  px wide and scales it to the screen.
     iPad 的排版寬度 = content ÷ (1 − 2 × margin)，再縮放到螢幕。
     Bigger margin = everything smaller with more air at the sides. 留白越大，畫面越小、兩側越空。 */
  ipad: {
    margin: { landscape: 0.0535, portrait: 0.0535 },   /* 5.35% each side = category white frames 77px of 1440 */
    content: {
      product: 1284,   /* category + product pages: white frames / product grids span 1284px  產品類別頁、產品頁 */
      about: 1211,     /* About: text + portrait block (56-1267px)                         About */
      home: 1179,      /* home, contact, 1-4: Joel asked for these larger (layout 1320)      首頁、Contact */
    },
    homeLike: ['', 'contact', '1', '2', '3', '4'],   /* page slugs that use content.home  使用 home 寬度的頁面 */
  },

  /* About "What I Believe" photo framing (Joel 2026-11-27, set with preview/mockups/believe-align.html).
     關於頁 What I Believe 照片的取景（用 believe-align.html 對齊）。
     The photo is drawn so that ITS point (fx, fy) — the speaker's face, as a share of the photo's width / height —
     lands at (sx, sy) of the photo window (share of the window's width / height), `zoom` x larger than the smallest
     size that fills the window. Worked out again from the real window size on every layout, so it holds whatever the
     page around it does. Never leaves an empty edge (the photo is nudged back inside when needed).
     照片上的點 (fx, fy)（講者臉部，佔照片寬高的比例）會對到視窗的 (sx, sy)；zoom = 比「剛好填滿」再放大幾倍。
     每次排版都依實際視窗大小重算，所以頁面怎麼改都會維持；不會露出空白邊。
     `height` (iPad upright only) = photo window height as a share of the screen height.  iPad 直向：視窗高度佔螢幕比例。
     Phone: the photo window is the What I Believe section itself.  手機：照片視窗就是 What I Believe 這一段。
     Computer: the whole photo, centred (no entry needed).  電腦版：完整照片置中，不需設定。 */
  believe: {   /* aligned by Joel 2026-11-27 */
    phone:         { fx: 0.26, fy: 0.62, sx: 0.182, sy: 0.475, zoom: 1.55 },
    ipadPortrait:  { fx: 0.26, fy: 0.62, sx: 0.128, sy: 0.552, zoom: 1.34, height: 0.37 },
    ipadLandscape: { fx: 0.26, fy: 0.62, sx: 0.113, sy: 0.579, zoom: 1.23 },
  },

  /* Scroll fade of every page's content (Joel 2026-11-27: "滾到畫面中央逐漸顯現，往上滾消失"; tune with
     preview/mockups/scroll-fade.html). Positions are the top of a piece of content as a share of the screen height
     from the top (1 = bottom edge, 0.5 = middle). `start`: where it begins to appear; `end`: where it is fully visible;
     `curve`: 'linear' | 'ease' (soft at both ends) | 'easeOut' (quick, then soft); `smooth`: seconds the opacity takes to
     catch up with the scroll (0 = exactly with the scroll, larger = softer, lags more). Same on phone, iPad, computer.
     捲動淡入：start＝開始出現的位置、end＝完全顯現的位置（內容頂端在畫面高度的比例，1＝底部、0.5＝中央）；
     curve＝曲線；smooth＝跟上捲動的秒數（越大越柔、越慢）。三平台共用。 */
  scrollReveal: { start: 0.89, end: 0.5, curve: 'ease', smooth: 0.24 },   /* set by Joel 2026-11-27 */

  /* Black space under the last item of every category page (Defense, Networking, Electronics, Industrial, Lifestyle,
     Experimental), the same on each page (Joel 2026-11-27: "defense 下方黑色空間再多點，其他類別頁也是" / "手機下方的黑空間太多了，
     再縮點，每個平台的類別頁底下都要多一些空間"). CSS px; `desktop` = computer + iPad. Was 92-277 (computer), 9-258 (phone).
     類別頁最下方黑色空間（每頁一致）。 */
  categoryBottom: { desktop: 280, phone: 80 },

  /* Photo framing inside a card (Joel 2026-11-27, set with preview/mockups/photo-align.html): `x` / `y` = which point of
     the photo stays in view (0-100%, like object-position), `zoom` = how much larger than just filling the card.
     Same on every device, unless the entry has per-platform values: desktop / ipadLandscape / ipadPortrait / phone. 卡片內照片取景：x / y 決定看哪個位置（0-100%），zoom 放大倍率；三平台共用。 */
  photoFrames: {
    xcalar: { img: '#img_comp-jcdxcal1', x: 46, y: 26, zoom: 1.19 },   /* Defense, T. Xcalar card — aligned by Joel 2026-11-27 */
    /* MoAI hand photo: one setting per platform (Joel 2026-11-27: "做出 mockup 讓我調整個平台的位置") */
    moaiHand: { img: 'img[src*="moai-router-13-2560x1314"], img[src*="moai-router-30-1120x575"]',
      desktop: { x: 0, y: 100, zoom: 1.15 }, ipadLandscape: { x: 15, y: 100, zoom: 1.12 }, ipadPortrait: { x: 22, y: 100, zoom: 1.19 },
      phone: { x: 36, y: 100, zoom: 1.23 } },   /* aligned by Joel 2026-11-27 */
    /* T. Blade top image, per platform (Joel 2026-11-27: "T. Blade 首圖可以讓我調整位置嗎"); starts at the old 50% 45% */
    tBladeHero: { img: 'img[src*="t-blade-02-2000x1500"]',
      desktop: { x: 50, y: 45, zoom: 1 }, ipadLandscape: { x: 48, y: 45, zoom: 1 }, ipadPortrait: { x: 37, y: 51, zoom: 1.06 },
      phone: { x: 12, y: 57, zoom: 1 } },   /* aligned by Joel 2026-11-27 */
    /* Zenfone 9 top image, per platform (Joel 2026-11-27: "zenfone 9 讓我調整首圖位置"); was Wix's centre 50% 50% */
    zenfoneHero: { img: 'img[src*="zenfone-9-02-"]',
      desktop: { x: 46, y: 10, zoom: 1.02 }, ipadLandscape: { x: 20, y: 20, zoom: 1 }, ipadPortrait: { x: 18, y: 53, zoom: 1 },
      phone: { x: 15, y: 48, zoom: 1 } },   /* aligned by Joel 2026-11-27 */
  },

  /* Links between pages (Joel 2026-11-27: "首頁的這張 buildable mindset 請連到 wifi7 ap 的這張 cutting cost"; card renamed BUILT FOR PRODUCTION in the copy review).
     designApproach: a home Design Approach card (found by words on it) -> page#anchor (relative to the home page, so the
     phone home opens the phone page). anchors: #anchor -> words of the heading to land on (the page scrolls there).
     頁面之間的連結：首頁 Design Approach 卡片 → 指定頁面的指定段落。 */
  /* Category title bars, one size for every bar (Joel 2026-11-28: "確認我的產品列別頁的文字框高度，各文字的對齊／同類別尺寸都要
     一致"): bar = frame top .. photo top, title this far from the frame's left edge, description this far from its right
     edge, in layout px (the values most bars already had). Applied by src/js/category/catalog-title-bars.js.
     類別頁標題列：高度、左標題與右說明距白框的距離（版面 px）。 */
  catalogBars: { phone: { bar: 25, left: 10, right: 10 }, desktop: { bar: 68.5, left: 15, right: 20 } },   /* desktop = computer + iPad */

  links: {
    designApproach: { 'BUILT FOR PRODUCTION': 'wi-fi7-hgu-ap/index.html#dfm-cost' },
    anchors: { 'dfm-cost': 'Balancing Design Intent and DFM Optimization' },
  },

  /* Forms (Contact page + Guest Area "Request access"): sent to Joel's mailbox through Web3Forms (no server on GitHub
     Pages; this key is public by design, it only allows sending to Joel). 表單寄信設定（Contact 與 Guest Area 共用）。 */
  forms: { endpoint: 'https://api.web3forms.com/submit', accessKey: '391de8ae-38e4-43c0-9d77-393d65c69402',
           fallbackEmail: 'joe10912345@gmail.com', timeoutMs: 5000 },

  /* Phone (m/ pages): Wix's own mobile layout, 320px wide (viewport width=320), side margins set per element in
     the Wix design (mostly 20px = 6.25%). Not driven from here. 手機版由 Wix 手機排版決定（多為 20px），不從這裡控制。 */
  phone: { layoutWidth: 320,
    /* Smallest text on the phone pages, in layout px (Joel 2026-11-27, UI/UX review: body text was 6-7px = about 7-8.5pt
       on a 390px iPhone; Apple's minimum is 11pt). The page is shown ×1.17-1.34, so 10px ≈ 12-13pt and 9px ≈ 10.5-12pt.
       Joel then: "手機板字體可以小一級" -> one step smaller (was 11 / 9.5).
       `text`: paragraphs (more than 60 characters); `label`: short labels and captions. Larger Wix sizes stay as they are;
       a word never breaks: in a narrow column the text grows only as far as its longest word fits.
       手機最小字級：段落 10px、短標籤 9px（約 12pt / 11pt）。
       `subText`: paragraphs on the work pages and category pages (every page except home, About, Contact), Joel
       2026-11-27: "這些內文小字都太大了，子頁的內文小字都要縮小成 9px", then "內文改 8px 好了". 作品頁、類別頁內文 8px。 */
    /* `layout`: phone layout set by Joel with preview/mockups/phone-layout.html, per page: { '<comp id>': { x, y, w },
       '<section id>': { below } } (layout px). 手機版排版微調（用 phone-layout.html 調整）。 */
    layout: {   /* set by Joel 2026-11-27 with phone-layout.html, then aligned to the 20px page edges / centre / each other */
      'wi-fi7-hgu-ap': { 'comp-m5t74yz1': {x: -16, w: 224, y: 49}, 'comp-m5t5qc84': {y: 8, x: -80}, 'comp-m5t5srru': {w: 156, y: -35}, 'comp-m5t5uose': {w: 144, y: -41}, 'comp-m5t5ujd5': {w: 153, gap: 29}, 'comp-m5t5rqg5': {w: 155}, 'comp-m5t0533s': {y: 51, s: 1.059, x: 8}, 'comp-m5t0fi44': {w: 259, x: 4}, 'comp-m5t0f0an': {y: 27, gap: 16}, 'comp-m5t0f0ap': {y: 29}, 'comp-mowgzb02': {w: 198, y: 6, x: -11}, 'comp-m6a2wkwg': {y: -64, x: -9}, 'comp-m5t6aknw': {x: 18, y: 3}, 'comp-m5t6aknz': {y: 19, x: -6}, 'comp-m5t0e2fh': {below: 35}, 'comp-mw69mwip1': {x: 1}, 'comp-m5seh4kz2': {below: -72}, 'comp-m5t0lnfs': {below: 12}, 'comp-m5seh4lq2': {below: 22}, 'comp-m5seh4mr7': {below: 22}, 'comp-mw69m0um': {below: -14}, 'comp-m5t108v9': {x: -8}, 'comp-m5v2v7ov': {y: 10}, 'comp-m5t6eugf': {below: 18}, 'comp-m5t6akny': {s: 1.057, x: -11, y: 11}, 'comp-m695wpvy': {y: -1, s: 0.932}, 'bg:comp-mow6ssaz': {px: 59, py: 50}, 'comp-mowj7wt2': {gap: 4}, 'comp-mowiphs0': {below: -25}, 'comp-mow8uyzy': {y: -13}, 'comp-m5t0occv': {gap: -11} },
      'assistive-products': { 'comp-moqvl0906': {x: -9, y: 23}, 'comp-moqvl08x': {below: 16} },
      'moai-router': { 'comp-mosh8egj': {below: 11}, 'comp-m5pqpw7z': {y: -35, x: 8}, 'comp-m5pqszuf': {y: -4}, 'comp-m5nzjic6': {w: 152}, 'comp-m5nzpbmo': {w: 189}, 'comp-m5nzqgsa2': {w: 195}, 'comp-m5nzn49b': {y: 15}, 'comp-m5nzn498': {y: 16}, 'comp-m5qhdij1': {y: 32}, 'comp-morca4ft': {y: -4, x: 1}, 'comp-mosh2osr': {below: -18}, 'comp-m5nxguy36': {below: -9}, 'comp-mosh7ug94': {gap: -14}, 'comp-m5pqm8el': {below: -49}, 'comp-m5nxguyw11': {below: -8}, 'comp-m5qgngps': {gap: -23}, 'comp-m5nzqgs92': {gap: -23}, 'comp-m5qhf694': {y: 47, x: 8}, 'comp-morhh850': {y: 81}, 'comp-mosiv8qv': {y: 99, gap: -43}, 'comp-m64id9cg': {y: 99}, 'bg:comp-morc9hvy': {px: 62, py: 50}, 'comp-m5qhb3oz': {below: 24}, 'comp-m5ojd4l7': {below: 16} },
      'zenfone-9': { 'bg:comp-mol27k1m2': {px: 15, py: 48}, 'comp-mol2kofs': {below: -15}, 'comp-mol30o5p': {w: 127}, 'comp-mol342sl': {w: 113}, 'comp-mol340dt': {w: 110}, 'comp-mol344og1': {w: 123} },
      'speeder-pro-earbuds': { 'bg:comp-moldl7hh6': {px: 55, py: 50}, 'comp-moldl7ht5': {below: 11}, 'comp-molhe3s5': {w: 185} },
      't-blade': { 'comp-mojvlu9y8': {below: 15}, 'comp-mojvlu9s': {below: 3}, 'comp-mojvq8rn': {gap: 7}, 'comp-mojvlua53': {y: 3} },
      'geometry-series': { 'comp-mosu3q8y': {gap: 17}, 'bg:comp-mosrmcpo2': {px: 63, py: 50} },
      'parametric-pattern-design': { 'bg:comp-moqnue4c6': {px: 84, py: 50} },
      'ocean-series': { 'comp-mosf3kmy': {x: -3, y: -21, w: 122}, 'comp-mosf3kn5': {x: -3, y: -22, w: 116}, 'comp-mosba1jm7': {x: -29, y: 17}, 'comp-mosba1jl17': {below: 17} },
      't-interceptor-cs': { 'bg:comp-mojre5st': {px: 66, py: 50} },
      'teana-earbuds': { 'bg:comp-mol97xfj': {px: 68, py: 50} },
      'interstellar05': { 'bg:comp-mp42j84s': {px: 53, py: 50} },
      'sagittarius-laptop': { 'bg:comp-mol5620j': {px: 61, py: 50} },
      'nlg-mma200': { 'bg:comp-mota5do62': {px: 46, py: 50} },
      'ai-tool-kit': { 'bg:comp-mov28xwp': {px: 15, py: 50} },
      'lionic-lionfilter-200': { 'comp-m662zy44': {y: 11}, 'comp-m65xz0ft': {below: 31}, 'bg:comp-movgqfn5': {px: 56, py: 50} },
      'airgain-fwa-easy-installation-kit': { 'bg:comp-movk68a01': {px: 58, py: 50} },
      'wi-fi7-2022': { 'comp-m6aebfzi': {y: 53}, 'comp-m67x4dyl1': {below: 47} },
      'wi-fi7-extender': { 'comp-m5zjcnux': {y: -47}, 'comp-m5zjcnus': {y: -43}, 'comp-m5zjcnuv2': {y: -48}, 'comp-m5zjz3hr': {y: 195, w: 94}, 'comp-m5zk2kbe': {x: -15, y: -6}, 'comp-m5zl3gwq': {x: -30, y: -4}, 'comp-m5zl3gy0': {x: -30, y: -2, w: 179}, 'comp-m5zl4an11': {x: -30, y: -12}, 'comp-m5zl4an3': {x: -30, y: -9, w: 230}, 'comp-m5xxnjl9': {below: 41}, 'comp-mown5o4p': {y: 21, x: 7}, 'comp-m5xxnj4z': {below: 15}, 'comp-m5xxnjf9': {below: 14}, 'comp-m5zmq4x2': {below: 7}, 'bg:comp-mowh2qkn2': {px: 62, py: 50} },
      'industrial': { 'comp-mnpltyn7': {h: 200, x: 0.01}, 'comp-mnpltynl': {fs: 10, x: 1}, 'comp-mnpltynl8': {x: -4}, 'comp-mnpml86h1': {y: -181, x: 1}, 'comp-mnpml86j2': {y: -181, x: 1}, 'comp-mnpmlem713': {y: -183}, 'comp-mnpmlem9': {y: -183}, 'comp-mnpltynz18': {y: -165}, 'comp-mnpltyo313': {fs: 10}, 'comp-mnpltyo47': {w: 134, x: -60, y: 1}, 'comp-mnpltyo6': {y: 169}, 'comp-mnpltyo54': {y: 169}, 'comp-mnpn32jv': {y: 169}, 'comp-mnpn32jp': {y: 169}, 'comp-mnpltymy': {below: 168}, 'comp-mnpltynx1': {gap: -182.3} },   /* phone layout (Joel 2026-11-28): 54px between groups, 10px between the cards of a group */
      'lifestyle': { 'comp-mnpthwvh6': {fs: 10, x: 1}, 'comp-mnpthwvi': {w: 122, x: -44}, 'comp-mnpthwvn': {y: -183}, 'comp-mnpthwvo4': {y: -184}, 'comp-mnpthww115': {y: -185}, 'comp-mnpthww58': {y: -185}, 'comp-mnpthww8': {gap: -182.3}, 'comp-mnpthwwg4': {x: -4}, 'comp-mnpthww96': {y: -2}, 'comp-mnptt6ns': {y: -6}, 'comp-mnpthwwi': {gap: -3.3}, 'comp-mnpthwwk10': {y: -181}, 'comp-mnpthwwl7': {y: -181}, 'comp-mnpthwwo9': {fs: 10, x: 1, y: -2}, 'comp-mnpthwwp6': {x: -3, y: -4} },   /* phone layout (Joel 2026-11-28): 54px between groups, 10px between the cards of a group */
      'experimental': { 'comp-moqrbmqf': {x: -4}, 'comp-moqmsoes': {gap: 40}, 'comp-moqrbmoo': {gap: 44} },   /* phone layout (Joel 2026-11-28) + 54px between groups (gap on each group's box) */
      'networking': { 'comp-mng13dv0': {gap: 1.5}, 'comp-mng1uy9a': {gap: 4.2}, 'comp-mnfzljha': {gap: 0.5}, 'comp-mnfzljgz': {gap: -1}, 'comp-mnfzyxjx': {gap: -1}, 'comp-mng13dy2': {gap: -4}, 'comp-mng13dv5': {gap: -1}, 'comp-mng1bb8q': {gap: 1}, 'comp-mng1qgzk': {gap: 1}, 'comp-mng1qei6': {gap: 2}, 'comp-mng22vrf': {gap: -5}, 'comp-mng23sg9': {gap: -5}, 'comp-mng24gl0': {gap: -4}, 'comp-mng23tyr': {gap: -4}, 'comp-mng24gl8': {gap: 2}, 'comp-mng24glf': {gap: 2}, 'comp-mozy666i': {gap: 2} },   /* phone layout (Joel 2026-11-28): 54px between groups, 10px between the cards of a group */
      'electronics': { 'comp-mnpng9cr11': {gap: 2}, 'comp-mnpp53ev': {gap: -2}, 'comp-mnpoa76g': {gap: -4} },   /* phone layout (Joel 2026-11-28): 54px between groups, 10px between the cards of a group */
      '': { 'comp-moybizuw': {y: -4}, 'bg:comp-m5k5qs39': {px: 54, py: 50}, 'comp-m5p2b7oz': {below: -14}, 'comp-m6busgt3': {below: -12}, 'comp-m276lfoi': {below: -37}, 'comp-m276lw99': {w: 266, x: 7, y: -7, fs: 9}, 'comp-m276lmt2': {y: -18, x: 0, fs: 18.5, w: 280},   /* snapped: 20px from both edges (was 10px) */ 'comp-mnfqhcw6': {y: 42}, 'comp-moybfmu0': {below: 9}, 'comp-m296hf3s': {fs: 16.5}, 'comp-m296vuqz': {fs: 16.5}, 'comp-m296izhj': {fs: 16.5}, 'comp-m296ikwr': {fs: 16.5}, 'comp-m296j8vz': {fs: 8.5, y: 4}, 'comp-m296kiu6': {fs: 8.5, y: 4}, 'comp-m296vurb': {fs: 8.5, y: 4}, 'comp-m296kbs5': {fs: 8.5, y: 4}, 'comp-mnfjtg8m': {w: 274, x: -21}, 'comp-mnfjsdwv': {x: -6}, 'comp-m296gq63': {x: 1}, 'comp-mt3o61t2': {w: 244, x: -6}, 'comp-mv6mwuv0': {x: 1},
            /* the four Design Approach cards one height, as short as the text allows (Joel 2026-11-28: "design approach 的方塊我沒辦法縮矮，幫我縮"):
               196 -> 176 -> 159px (Joel 2026-11-28: "approach 的白色框高度可以再縮"): 12px under the text, as above it; the last lines are short, so the ">>" stays clear */
            'comp-mnfjmw0p': {h: 159}, 'comp-mnfjoibv': {h: 159}, 'comp-mnfjomey': {h: 159}, 'comp-mnfjomf4': {h: 159} },   /* home, set by Joel 2026-11-28 with phone-layout.html (positions, text sizes) */
      'defense': { 'comp-mor9xmzy': {y: -66}, 'comp-mojwmx3v': {gap: 74, y: -21}, 'comp-mojworka': {y: -67}, 'comp-mojworkg2': {y: -67}, 'comp-mojwq9as': {y: -23}, 'comp-mnfzhopv': {below: -4}, 'comp-mnfzfwps': {gap: 22.8}, 'comp-mukou2cd': {gap: 44.4}, 'comp-mnfzbibx6': {gap: -2}, 'comp-mnfze46q': {gap: -4}, 'comp-jcdxcal0': {gap: -3} },   /* phone layout (Joel 2026-11-28): 54px between groups, 10px between the cards of a group */
    },
    /* `scale`: one heading scale on the work pages (Joel 2026-11-27: "全面檢視手機版的排版，一團亂"): Wix had page titles
       at 18-21px and section headings at 12-16px depending on the page. Text Wix set in a band is drawn at that band's
       size: [from, to) px -> size. Above the last band (decorative display type) and below the first is left alone.
       作品頁標題字級統一：大標題 20px、章節標題 12px。 */
    scale: [{ from: 12.5, to: 17, size: 12 }, { from: 17, to: 24, size: 20 }],
    catScale: [{ from: 17, to: 24, size: 21 }],   /* category pages: the page title (Defense was 22, the others 21)  類別頁標題 21px */
    minText: 10, minLabel: 9, subText: 8, subTextExcept: ['', 'about', 'contact', '1', '2', '3', '4'] },
};

/* iPad layout width for a page slug ('' = home) and orientation.  某頁在 iPad 直／橫向的排版寬度。 */
window.JCD_CONFIG.tabletWidth = function (slug, portrait) {
  var c = window.JCD_CONFIG.ipad, s = (slug || '').toLowerCase();
  var content = s === 'about' ? c.content.about : c.homeLike.indexOf(s) >= 0 ? c.content.home : c.content.product;
  var m = portrait ? c.margin.portrait : c.margin.landscape;
  return Math.round(content / (1 - 2 * m));
};
