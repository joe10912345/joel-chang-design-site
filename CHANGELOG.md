# Changelog

Every change to the site, newest first. **Any person or AI that edits this repo adds an entry here in the same change.**
Format: date (UTC+8) — what changed (in Joel's words where possible) — files touched. Open items go in `TODO.md`.

Entries before 2026-11-24 evening were reconstructed from code comments and README, so they are grouped, not exact.

---

## 2026-11-24

### End-to-End: text appears while pressing (touch); Design Approach cards: no glow, only card 1 pressable
- **Home "End-to-End Expertise" tiles, phone + iPad**: the dark overlay + text now appears as soon as a finger rests on a tile (~0.1s), not after the tap; a swipe through the slider does not trigger it. First tap still never follows a link. `site.js` 5b.
- **Home "Design Approach" cards** (all platforms): the hover/tap glow is removed from all four. Cards 2-4 do nothing (no hover, no press, default cursor). Card 1 (01 DISCOVERY, with the ">>" arrow) is pressable: the whole card follows the arrow's link, and while pressed it pushes in (`scale(.985)`) with a brand-blue 1px outline. `custom.js` (start) + `custom.css` section 2.

### "What I Believe" centred on its photo; header can't be selected / dragged
- **About "What I Believe"** (all platforms): title + text block now sits on the vertical centre of its photo section (`custom.js` "What I Believe", moves #comp-mujq4udg1 / #comp-mujq4ude6 with `top`, redone on resize). Was 27px low on the phone, 35px high on desktop/iPad; now equal space above/below (desktop/iPad 271/271, phone 52/52). The phone's extra 40px bottom margin was removed.
- **Pressing the logo left a light band across the header** (Joel, not reproduced at 1348px): most likely a text selection / drag ghost of the header. The header and everything in it are now not selectable and not draggable (`user-select: none`, `draggable=false`, no selection colour, no mouse-focus outline), all platforms. To confirm by Joel on his monitor.

### Phone recommendation cards: text sized like the rest of the phone About page
- Joel: phone card text too big. The phone About page uses 6-8px body text and 11px headings (320px layout); the cards had 10-11px text (bigger than the headings). Now text 8px (featured 8.5px), name 9.5px, role 6.5px, quote 22px, avatar 22px, LinkedIn tile 17px, padding 13px, corners 5px. iPad (desktop layout scaled) checked: 2 columns, proportions match the page, no change needed.
- First push from this folder: 18 commits `8174d54..3462c1d`, GitHub Pages deploy succeeded.

### Category frames + unframed tiles aligned; About intro centred on screen; card glows fainter
- **Category pages (desktop/iPad)**: the first centring moved only items inside a white frame, so the unframed photo tiles below a big frame stayed ~15px left (e.g. Networking "Home-Based"). `custom.js` "Category pages" now moves every top-level item of each section that holds frames (framed cards, unframed tile rows, captions) by the same amount; centred titles and full-width items stay. Checked all 6 pages at 1440 / 1920: frames and tile rows share one left edge (77-79 / 156-159), equal left/right.
- **About intro (desktop/iPad)**: text + portrait sat ~140px below the screen middle (tall empty band above). `custom.js` "About, desktop layout" moves the first section's content up so the block is centred on the screen, at least 56px under the header; the section shrinks by the same amount (rest of the page follows, WORK EXPERIENCE gap unchanged); recomputed on resize. 1536x864: 56px under the header; iPad landscape: exactly centred; ultra-wide: as high as allowed.
- **Recommendation card hover glows**: fainter again (blue .45 -> .28, navy .85 -> .6).

### New colours #0062D9 / #00176C as design tokens; DESIGN-SYSTEM.md
- Joel: blue -> **#0062D9**, blue-violet -> **#00176C**; also the cursor light, menu items and every pressed state that turns blue.
- `custom.css` now starts with tokens `--jcd-blue` (#0062d9, `--jcd-blue-rgb`) and `--jcd-navy` (#00176c, `--jcd-navy-rgb`); every blue/violet in custom.css uses them (30 + 6 places): menu hover/press, dropdown press, phone menu press, logo/icon hover, phone menu LinkedIn/Behance, cursor light, Design Approach card glow, Cross-Category tile halo, Contact "sent" tick, recommendation quote/LinkedIn tile/top-left glow; navy for the recommendation bottom-right glow (alpha raised to .85 so the dark navy shows on black) and the avatar gradient end.
- New `DESIGN-SYSTEM.md` (colour, glass, radii, type, spacing, devices/scaling, states, motion, components); linked from AGENTS.md and README.

### Recommendation cards: lighter glass, white quote mark, softer hover glow
- Card glass 6% -> 3.5% white, edge 12% -> 9% (hover 5.5% / 20%). Quote mark white (85%) at rest, turns brand blue #1a2df3 on hover / press. Corner glows about half as strong (blue .8 -> .45, violet .7 -> .4). Read "透明度降低" as "make it lighter / more see-through"; flip if Joel meant the opposite.

### One brand blue: the Contact form hover blue #1a2df3
- Joel: menu (incl. dropdown), logo and the LinkedIn card glows should use the blue of the Contact form lines on hover. That colour is Wix's `--brdh` / `--brdf` on the Contact fields: **rgb(26, 45, 243) = #1a2df3**.
- Changed from #4a90ff to #1a2df3: desktop/iPad top menu hover + press, Works dropdown press, phone menu press, header logo + LinkedIn/Behance icon hover (mask colour), phone menu LinkedIn/Behance press, recommendation cards (top-left corner glow, quote mark, initials gradient, LinkedIn tile hover). Left as is: Contact form "sent" tick/button and the cursor light.

### About: equal heading spacing + one left edge (all platforms); card hover glow corners only
- Joel: "SELECTED AWARDS, EXPERTISE, TRUSTED COLLABORATION are not spaced the same; check About on every platform". Measured before: desktop gaps above headings 76-116px, below 29-64px, left edges 145/152/156; phone gaps above 6-76px, left edges 17/20.
- Now (`custom.js` "About page: one spacing rule", CSS `.jcd-about-flow` makes the rows of sections #comp-mujj9yx18 / #comp-mujj9yxj / #comp-mujk8qkl size to their content):
  - desktop + iPad: main headings (WORK EXPERIENCE, SELECTED AWARDS, EXPERTISE, TRUSTED COLLABORATION) 98px below the content above, side heading LANGUAGES 60px; every heading 41px above its content; side-by-side headings (WORK EXPERIENCE | EDUCATION, SELECTED AWARDS | PATENTS) move together.
  - phone: main headings 48px, side headings (EDUCATION, LANGUAGES, PATENTS) 28px, 12px to their content.
  - one left edge = the WORK EXPERIENCE content edge: desktop EXPERTISE section moved +11px, TRUSTED COLLABORATION heading +4px and the cards lined up; phone headings at 17px moved to 20px.
- **Recommendation card hover** (third pass): only the corners glow, vivid — blue top-left, blue-violet bottom-right, 300x200px each, drifting slightly along the edge; the middle stays black (animated with registered custom properties `--jcd-gx/--jcd-gy`).

### Recommendation cards: flowing gradient on hover; GET IN TOUCH balloon
- **About cards**: the blue/violet glow layer behind all cards is removed (Joel). Instead the hovered card (tap/press on touch) fades in its own gradient, blue top-left -> blue-violet bottom-right, slowly flowing (6s alternate); off with reduced motion. `.jcd-rec-card::before` in `custom.css`.
- **Home "GET IN TOUCH"** (`a.style-mp6zxgon__root`, desktop + iPad + phone): endless gentle "balloon" breathing, scale 1 -> 1.045 -> 1 every 2.8s; pauses on hover/press; off with reduced motion.

### About "Trusted Collaboration": frosted-glass recommendation cards (style A1) with LinkedIn links
- Joel picked layout A + style A1 from `preview/testimonials-ui.html`. `custom.js` ("About Trusted Collaboration") builds the cards inside section `#comp-mujk8qkl`; the Wix quote/name/role/line pieces stay in the HTML for search engines but are hidden, the heading "TRUSTED COLLABORATION" stays. The section's grid had a fixed `min-height: 1126px`; now auto, so the section fits the cards.
- Desktop + iPad: featured card (Marcus Kung) full width + 2 columns; phone: 1 column with sizes for the 320px layout. Glass 6% white + `blur(22px)`, 1px edge, 6px corners, initials avatar, LinkedIn tile turns blue on hover/press, card lifts on hover; (the glow layer behind the cards was removed later the same day, see above).
- Each card links to the person's LinkedIn (new tab): Marcus Kung, Stanley Chai (cychai1995), Rick Chen, Kuo Kai Liao (kailiao929), Ike Tsao. `?locale=zh` removed so LinkedIn opens in the visitor's language. To change text or links: the `REC` list at the top of that block in `custom.js`.
- Checked: 1536 / 2560 desktop (cards centred, left edge in line with the heading), phone 20/20 margins.

### Home "Selected" label; testimonial card design study
- **Home Works row "Selected"**: was a Wix button with a dark 1px frame that could be clicked. Now a plain label: no frame, no hover/press/click (`pointer-events: none`), out of the keyboard tab order (`tabindex="-1"` in `site/index.html` + `site/m/index.html`). `button.style-mp6qabp3__root` in `custom.css`. All platforms.
- **Design study (not on the site yet)**: `preview/testimonials-ui.html` — round 1: four frosted-glass layouts for the About recommendations (A featured + grid, B swipe row, C staggered with gradient edge, D spotlight with name list), each at desktop and phone width, every card linking to the person's LinkedIn (placeholder `#` until Joel sends the URLs). Open: `http://localhost:8766/preview/testimonials-ui.html`. Round 2 (Joel picked layout A, corners not too round): the page now shows four UI styles of layout A, corners 4-6px — A1 standard glass + initials avatar + LinkedIn tile, A2 minimal hairline (blue top rule, text link), A3 big faint quote mark + divider + LinkedIn top-right, A4 blue-violet gradient edge with the featured card split name | quote.

### Frosted-glass menus; About portrait frame
- **Desktop / iPad "Works" dropdown**: was a flat 33% white box with black text -> frosted glass. Second pass (Joel: text hard to read over light photos, bigger corners that scale): dark-tinted glass `rgba(18,20,26,.42)` + `blur(20px) saturate(150%)`, 1px 16%-white edge, **8px corners** (CSS px, so they scale with the wide-screen zoom / iPad scaling like the rest of the page), soft shadow; labels 90% white with a soft text shadow (70% while another item is hovered), white on hover / current page, blue pressed. `.submenu815198092__root` in `custom.css`.
- **Phone full-screen menu**: was 85% black -> darker frosted glass (55% near-black + `blur(22px)`), the page behind shows blurred. `#bgLayers_MENU_AS_CONTAINER`.
- **Phone About "What I Believe"**: text was 6px in the 320px layout (~7px on screen) -> 9.5px / line-height 1.55, title 11px -> 14px, 40px space below; the section grows with it (311 -> ~394px). Testimonial quotes above are still small (TODO).
- **About portrait** (`#comp-mujmtw8h`): white 1px frame (looked thick on zoomed monitors) -> 0.5px grey (32% white), no white behind the photo. All platforms.

### External monitors: full width (wiwi) + top image exactly one screen high
- **How full width works on any monitor (wiwi, commits b36efba 18:55 + ba30d76 19:02, `site/assets/js/site.js` "Wide screens")** — Joel's problem: "full width on the laptop, not on the external monitor". The laptop is 1920px at 125% Windows scaling = 1536 CSS px, which the Wix desktop layout (~1300-1540px stage) fills; an external monitor at 100% is 1920+ CSS px, so the layout sat in the middle with black bars. Fix: on desktop (non-touch) windows wider than 1536 CSS px, `document.documentElement.style.zoom = innerWidth / 1536` (1920 -> 1.25, 2560 -> 1.667, 3440 -> 2.24, 3840 -> 2.5), re-run on resize. `window.__jcdZoom` holds the factor; tilt / glow / cursor light / video / custom.js convert screen px <-> CSS px with it. ba30d76: a Windows touch-screen laptop used with a mouse (maxTouchPoints > 1 but primary pointer fine) is NOT a touch device, otherwise it skipped the zoom.
- **Checked (2026-11-24)** with the preview at laptop 1536x864, 1920x1080, 2K 2560x1440, ultra-wide 3440x1440, 4K 3840x2160: home, ocean-series, defense, about — every section full width, header edge to edge, no horizontal scroll.
- **New: top image exactly one screen high on computers** (home slideshow + product pages): on 16:9 it was ~102%, on the 21:9 ultra-wide 137% (bottom of the image below the fold). `custom.js` "Top image height" now sets `calc(100svh / __jcdZoom - top)` on desktop (under CSS zoom `100svh` is multiplied by the zoom, so it is divided back). Result: 100% of the screen on all five sizes; next section starts at the bottom edge. About / category / contact untouched.
- **Preview**: `preview/devices.html` has a desktop screen menu (`&s=laptop|w1440|fhd|qhd|uw|uhd`).

### iPad landscape full-screen top image; phone menu sizes; preview tool same-origin
- **iPad landscape**: home slideshow and product-page top images fill the whole screen (`100svh`); portrait keeps the Wix height; re-checked when the iPad turns. `custom.js` "Top image height" (phone part unchanged: 50svh). `site.js` exposes `window.__jcdTablet`; `?tablet=1` makes a page act as an iPad (used by the preview).
- **Phone menu**: six product items 15px -> 13px; LinkedIn/Behance icons 26px -> 18px and 48px lower.
- **Menu icon "moved" when opened**: only in the preview (opening the menu locks scrolling, the preview frame's scrollbar disappeared and the page re-centred 7.5px to the right). Preview now same-origin (devices server serves the repo root: `http://localhost:8766/preview/devices.html`) and hides the frames' scrollbars, like real phones/iPads. On the real site the icon never moved (checked: 282,17 closed and open).

### Light pages white again; card frames centred; End-to-End tap overlay; menus
- **Light pages were dark (regression)**: Wi-Fi 7 HGU/AP, MoAI, Extender, 2022, Airgain, Lionic, AI Tool Kit, NLG MMA200, Sagittarius, Assistive have transparent sections that show Wix's white page background. Two rules had painted that layer black: the phone "black canvas" rule from commit 8174d54 (`[id^="bgLayers_pageBackground_"] .LNYVZi`) and my earlier desktop hairline fix (`[data-testid="page-bg"]`). Both removed. Now `custom.js` ("Page background") checks each page: if every section covers itself, the page gets `.jcd-dark-canvas` and its background layer turns black (no white hairlines); pages with a transparent section keep Wix's white. Checked against joe10912345.wixsite.com/works.
- **Category card frames centred** (desktop layout = computer + iPad): Wix drew them ~15px left of centre while the titles are centred. `custom.js` ("Category pages, desktop layout") moves the card-row items so frames have equal space left/right (1440: 78/78, 1920: 151/151). Phone frames were already 20/20.
- **iPad layout width 1366 -> 1440** (`TABLET_W` in `site.js`) so the frames get ~50-78px breathing room instead of touching the edges.
- **Home "End-to-End Expertise" slider**: tap on phone/iPad shows the dark overlay + text (already in site.js); on the phone the overlay text is now sized for the 149px tiles (title 12px, text 8px clamped to 7 lines, 10px padding) and the overlay is darker on touch (60%).
- **Menus**: pressed = blue #4a90ff + small press-in on the phone menu items, desktop/iPad top level and the Works dropdown; phone menu LinkedIn/Behance turn blue when pressed. Phone menu: the six product pages in Poppins Light 15px, About/Contact moved down as their own group. Phone menu icon: smaller (0.78), half-transparent at rest, full white when pressed/open (was blue).
- **Preview tool**: frames are one scrollbar wider and clipped, so the preview scrollbar no longer narrows the page (it made the phone pages look shifted right).

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
