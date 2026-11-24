# Changelog

Every change to the site, newest first. **Any person or AI that edits this repo adds an entry here in the same change.**
Format: date (UTC+8) — what changed (in Joel's words where possible) — files touched. Open items go in `TODO.md`.

Entries before 2026-11-24 evening were reconstructed from code comments and README, so they are grouped, not exact.

---

## 2026-11-24

### Category title bars, section hairlines, phone Networking button
- **Title bars** (Defense / Networking / Electronics / Lifestyle / Industrial / Experimental cards): the right-hand text sat up to ~5px too low (e.g. Lifestyle "Atmosphere & Daily Experience" touched the photo). `custom.js` ("Catalog title bars") now centres every text in a bar on the bar's middle (outline top .. photo top), desktop + iPad + phone. Checked all 6 pages at 1440 and 320 wide: every text within 0.5px of the centre.
- **Thin white lines between sections**: the page canvas was transparent (browser white) and showed through half-pixel seams whenever the page is scaled. Canvas is now black on every platform (`custom.css`).
- **Phone Works buttons**: Wix enlarged only "Networking" on hover (10px -> 13px); now same size as the others.

### Git: this Drive folder is now a git clone of GitHub
- `.git` added here (remote `origin` = github.com/joe10912345/joel-chang-design-site). 94 reference screenshots / tool files that were on GitHub but missing from the Drive copy were restored from GitHub.
- 56 old image files in `site/assets/media/` that no page uses are left untracked on purpose.

### Home "Works" category buttons: no black frame on hover
- Joel: hovering Defense / Networking / Electronics / Lifestyle / Industrial / Experimental showed a black box. Wix set `border: 1px solid #000` on hover.
- Now: desktop + iPad show no frame (text still turns white); phone keeps its normal grey frame. End of `site/assets/css/custom.css`.

### Phone: taller top image on home + product pages
- Joel: on the phone the home image and the product-page top images were only ~1/3 of the screen (home 215px, products 136-200px of a ~693px screen).
- Now half the screen height (`50svh`, Joel chose half after trying 66%) on home (slideshow) and all 22 product pages. `site/assets/js/custom.js` ("Phone: taller top image"): if an `m/` page starts with a full-width short image, every element of that block with the image's height gets `height: 50svh`; the content below moves down. Catalog pages, About, Contact are untouched (no full-width image at the top).
- The phone HTML of those 23 pages now points the top images at their largest file (e.g. 640x400 -> 2560x1511) so they stay sharp when taller. Only the first section's images were changed.
- Desktop / iPad: unchanged (desktop pages).

### iPad: whole page visible, portrait + landscape, iPad Air 11" / iPad Pro 11" / iPad Pro 13"
- Joel: on iPad the left and right of the page were cut off; iPad must work in both orientations, including iPad Pro 11".
- Cause: touch tablets got the desktop page laid out 980px wide (Wix's value), but this site's content spans ~1330-1430px (measured on every desktop page).
- Now: `site/assets/js/site.js` lays the desktop page out `TABLET_W = 1366` px wide on touch tablets and the browser scales it to the screen; turning the iPad re-scales the same layout, so every model and orientation shows the whole width.
- Preview: `preview/devices.html` has iPad portrait + landscape and an iPad model menu (Air 11", Pro 11", Pro 13"; `&m=air11|pro11|pro13`). Checked home, about, ocean-series.
- `site.js?v=` bumped in all 72 `index.html`.

### Phone menu: LinkedIn + Behance icons
- The two icons now sit under "Contact" in the phone hamburger menu (cloned from the hidden footer by `site/assets/js/custom.js`; style at the end of `custom.css`). Works on every `m/` page.

### Footer removed on every page (phone, iPad, desktop)
- Joel: remove the black bottom section everywhere. `#SITE_FOOTER { display: none }` at the end of `site/assets/css/custom.css`.
- Side effect: on the phone (`m/`) the footer had the only LinkedIn / Behance links; desktop/iPad still have them in the header. See TODO.

### Ocean Series cards: only the photo zooms, inside its frame (third pass)
- Joel: on the phone the zoomed card covered the caption ("Sea anemone"). Now the card and its frame never change size; the photo zooms 1.1× inside the frame (clipped), so it can never cover text. Same on all three platforms. Wix's own card zoom on hover is switched off for these 6 cards.
- Files: `site/assets/css/custom.css` (Ocean Series section), `custom.css?v=` bumped in all 72 `index.html`.

### Three-device preview tool (local only, not deployed)
- `preview/devices.html` shows any page as phone (390×844, m/), iPad (desktop page laid out 980 wide, scaled to 820) and desktop (1440×900), side by side or one per tab (`?d=phone|ipad|desktop|all&p=/ocean-series/`).
- `.claude/launch.json`: server "site" (port 8765, serves `site/`) + "devices" (port 8766, serves `preview/`). Open `http://localhost:8766/devices.html`.

### Ocean Series: same hover/tap on phone, iPad and desktop (second pass)
- Joel: on the phone a tap still turned the photo black (he was looking at the GitHub Pages copy, which did not have the fix yet), and asked that phone, desktop and iPad always be fixed together.
- **Now on all devices:** 35% dim at rest; mouse hover, or tap / press on touch, removes the dim and zooms the photo (1.1× desktop + iPad, 1.05× phone so the caption below stays uncovered). The first pass's "no dimming on touch" exception is gone.
- Checked locally: phone (`m/`, 375px, tap) and desktop (1440px, hover). iPad uses the desktop page with the same CSS (the built-in browser cannot emulate iPad touch).
- Files: `site/assets/css/custom.css` (last section rewritten), `custom.css?v=` bumped in all 72 `index.html`.

### Ocean Series: creature tiles hover fixed (first pass)
- **Before:** hovering one of the 6 product photos (Cuttlefish, Sea anemone, Orca, Sea shell, Manta ray, Moai) turned it fully black (Wix MouseOverPhoto skin fades a 100% black `::after` in on hover).
- **Now:** ~35% black at rest; on hover the dim fades out (0.4s) and the photo zooms 1.1×. Manta ray and Moai had no Wix zoom, so they got the same zoom. (Touch exception replaced in the second pass above.)
- Not changed: the same Wix skin (`.hhxEkR`) is used on airgain, moai-router, industrial, defense, electronics, networking — see TODO.
- Files: `site/assets/css/custom.css` (last section), `custom.css?v=` cache version bumped in all 72 `index.html`.
- Added `.claude/launch.json` (local preview server on port 8765, `python -m http.server`).

### Catalog cards: 3D tilt following the mouse
- `site/assets/js/tilt.js` (new) + "Catalog cards: 3D tilt" section in `site/assets/css/static-overrides.css`.
- Pages: defense, industrial, electronics, lifestyle, networking, experimental, about (portrait). Desktop + fine pointer only; off on `m/`, touch, reduced-motion.

### Catalog tiles: hover darkening / jumping frames fixed
- Wix's mismatched overlay rectangle and double white frame replaced by one 30% darkening inside the photo frame; transforms killed so photos no longer jump 1px on hover. Outline sizes snapped per tile.
- File: `site/assets/css/static-overrides.css` (top sections).

### Wide screens scale up
- On 1920/2560px monitors the desktop layout is scaled with CSS zoom so ~1536 CSS px fill the window (like a 1920 laptop at 125%). Other scripts read `window.__jcdZoom`.
- File: `site/assets/js/site.js`.

### Header / menu colours
- Hovered top menu item turns blue `#4a90ff`, others stay white (replaces the 11-23 dimming).
- Header logo and header + footer LinkedIn / Behance icons turn the same blue on hover.
- File: `site/assets/css/custom.css`.

### Mobile fixes (labelled "pt120u" in custom.css)
- Black page canvas (no white seams), half-thickness white lines, m/about Education + Languages laid out like Work Experience, hamburger pressed state, Works category buttons pressed state.
- File: `site/assets/css/custom.css` ("Mobile fixes" section).

### Contact form works
- Submits to Web3Forms (`api.web3forms.com`) from `site/assets/js/custom.js`, with a status message and a "sent" confirmation + "send again" button (custom.css "Contact form" section).

## 2026-11-23 — update 2 (custom additions, not on the live Wix site)
- Static export of the Wix site created (see README).
- Entrance animations removed on purpose.
- Design Approach cards (home): hover glow with cursor-following inner light.
- Menu: Works dropdown items without background box, other items dim; top items no underline.
- Cross-Category grid (home): tiles lift with a blue glow.
- Softer gallery hover overlays (0.6s, title then description).
- Header auto-hide on scroll down, reappears on scroll up.
- Home "Works" grid tiles link to project pages.
- Home Vimeo video in its glow frame without black ring.
- Lightbox for galleries that enlarge on click on live Wix (`data-jcd-lightbox`, custom.js + custom.css §8).
- Cursor light: blue glow following the mouse on page backgrounds only (custom.css §9).
- Home H1 kept for search engines only; SEO tags, sitemap, robots, llms.txt generated (`tools/seo_apply.py`).
- Translations (zh-hant, zh-cn, ar) built, then archived to `i18n-archive/` and not published.
- Files: `site/assets/css/custom.css`, `site/assets/js/custom.js`, `site/assets/js/site.js`, `tools/`.
