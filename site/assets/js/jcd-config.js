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
  scrollReveal: { start: 1.0, end: 0.5, curve: 'linear', smooth: 0.12 },

  /* Photo framing inside a card (Joel 2026-11-27, set with preview/mockups/photo-align.html): `x` / `y` = which point of
     the photo stays in view (0-100%, like object-position), `zoom` = how much larger than just filling the card.
     Same on every device, unless the entry has per-platform values: desktop / ipadLandscape / ipadPortrait / phone. 卡片內照片取景：x / y 決定看哪個位置（0-100%），zoom 放大倍率；三平台共用。 */
  photoFrames: {
    xcalar: { img: '#img_comp-jcdxcal1', x: 46, y: 26, zoom: 1.19 },   /* Defense, T. Xcalar card — aligned by Joel 2026-11-27 */
    /* MoAI hand photo: one setting per platform (Joel 2026-11-27: "做出 mockup 讓我調整個平台的位置") */
    moaiHand: { img: 'img[src*="moai-router-13-2560x1314"], img[src*="moai-router-30-1120x575"]',
      desktop: { x: 0, y: 100, zoom: 1.15 }, ipadLandscape: { x: 15, y: 100, zoom: 1.12 }, ipadPortrait: { x: 22, y: 100, zoom: 1.19 },
      phone: { x: 36, y: 100, zoom: 1.23 } },   /* aligned by Joel 2026-11-27 */
  },

  /* Forms (Contact page + Guest Area "Request access"): sent to Joel's mailbox through Web3Forms (no server on GitHub
     Pages; this key is public by design, it only allows sending to Joel). 表單寄信設定（Contact 與 Guest Area 共用）。 */
  forms: { endpoint: 'https://api.web3forms.com/submit', accessKey: '391de8ae-38e4-43c0-9d77-393d65c69402',
           fallbackEmail: 'joe10912345@gmail.com', timeoutMs: 5000 },

  /* Phone (m/ pages): Wix's own mobile layout, 320px wide (viewport width=320), side margins set per element in
     the Wix design (mostly 20px = 6.25%). Not driven from here. 手機版由 Wix 手機排版決定（多為 20px），不從這裡控制。 */
  phone: { layoutWidth: 320 },
};

/* iPad layout width for a page slug ('' = home) and orientation.  某頁在 iPad 直／橫向的排版寬度。 */
window.JCD_CONFIG.tabletWidth = function (slug, portrait) {
  var c = window.JCD_CONFIG.ipad, s = (slug || '').toLowerCase();
  var content = s === 'about' ? c.content.about : c.homeLike.indexOf(s) >= 0 ? c.content.home : c.content.product;
  var m = portrait ? c.margin.portrait : c.margin.landscape;
  return Math.round(content / (1 - 2 * m));
};
