# Changelog

Every change to the site, newest first. **Any person or AI that edits this repo adds an entry here in the same change.**
Format: date (UTC+8) — what changed (in Joel's words where possible) — files touched. Open items go in `TODO.md`.

Entries before 2026-11-24 evening were reconstructed from code comments and README, so they are grouped, not exact.

---

## 2026-11-27

### Category cards with a link: photo zooms in on hover
- Joel: clickable category cards zoom in. The photo scales 1.06 inside its frame (.8s) on hover with a mouse, while pressed on touch; cards without a product page stay still. `custom.css` (beats the static-overrides "no transform in tiles" rule).

## 2026-11-26

### No 3D tilt on category cards
- Joel: the 3D tilt (and its light sheen) is removed from every category card; only the About portrait still tilts. `tilt.js` (candidate cards dropped, EXTRA kept). Hover darkening, names and the round >> stay.

### About intro: new photo, second photo on hover / tap
- Joel's two photos (2000x1425): Joel at the material wall (`about/about-05-*`) replaces the old portrait; with the mouse on it, it cross-fades (.6s) to the Golden Pin 2025 photo (`about/about-06-*`). Phone + iPad: a tap switches to the second photo, another tap back. The frame now takes the photos' ratio (589x421 desktop, 270x194 phone). Phone uses 1200px copies. Old `about-02-*` removed; originals in `media-originals/jcd_about-portrait-*`. `custom.js` "About intro photo", `custom.css` `.jcd-swap*`.

### Round ">>": slower fill
- Joel: slower - the left-to-right blue fill now takes .9s (was .45s), ease-in-out. `custom.css`.

### Round ">>": fill runs left to right
- Joel: not from the centre - the blue now fills the circle from left to right (.45s). `custom.css` .jcd-go::before (scaleX, origin left; the round chip clips it).

### Round ">>": fills blue on hover, click opens at once
- Joel: the round >> (home Selected tiles, category cards, Design Approach card 1) now fills with `--jcd-blue` from its centre (.45s) while the mouse is on its card (touch: while pressed). The "fill, then open 0.42s later" click handler was removed: a click opens the page at once. `custom.css` (.jcd-go::before), `custom.js`.

### Design Approach card 1 = A + 1; stronger video breathing
- Joel's final pick (A + 1): on hover card 1's frame itself turns `--jcd-blue` with a soft blue outer glow (no movement, no gradient); small round >> in the corner. `custom.css` `.jcd-da-*` (frame drawn by the inner `.wixui-box`).
- Video glow (Joel: breathing too weak, dark phase should be darker): the glow-frame image now breathes too, brightness .35 -> 1.15 (4.5s), the added light .2 -> 1, in step. `custom.css`.

### Design Approach card 1: no lift, blue gradient slides in, small >> in the corner
- Joel chose C + 1 of `preview/design-approach-card.html`: card 1 no longer moves on hover; a light blue gradient slides in from the left. The round >> is 30px (phone 20px) in the bottom-right corner, clear of the text; still fills blue when pressed. `custom.css` `.jcd-da-*`.

### Cross-Category: bigger glow behind the hovered tile
- Joel: glow too small. The halo now reaches ~4 gutters out (was 1, clipped to the gutter) with a wider, stronger blue; the lifted crop grows 1.025 (was 1.012). `custom.css` section 4.

### Video glow: no turning ring
- Joel: remove the ring that turns around the video. The light around the window is now a still blue blur that only breathes (4.5s). `custom.css` `.jcd-vglow`.

### Home: Cross-Category black edges, video black edges, moving glow around the video
- Cross-Category: the tile crop rectangles were 3-6px off the real photo areas, so the lifted crop showed slices of the black gutter. Re-measured both images (photo areas between the gutters) and inset 2px. `custom.js` GRID.
- Video: the Vimeo player's own dark edge pixels showed; it is now 0.6% (+2px a side) larger than the glow frame's window and clipped back to the window with `clip-path` (player buttons stay whole).
- Moving glow (Joel): a blurred blue / navy / violet ring sits exactly under the video window and slowly turns around it (9s) while breathing (4.5s); off under reduced motion. `custom.js` (video fit), `custom.css` `.jcd-vglow` (@property --jcd-va).

### About signature reveal; Design Approach cards interactive; smaller hover grow on category words
- About signature: hidden until it scrolls into view, then appears left to right with a soft edge (1.6s), once; all platforms (Joel chose this over stroke-by-stroke writing). CSS mask with `!important` (Wix's img rule sets mask-position/size and loads later); the transition only runs on the way in (no hide flash at load); a scroll check backs up the IntersectionObserver. `custom.js` "About signature", `custom.css` `.jcd-sig`.
- Home Design Approach cards: all four react to the mouse (frame brightens, faint light fill). Card 1 (the link) also lifts 4px with a soft blue/navy glow; Wix's text ">>" is replaced by the round ">>" (40px, phone 26px) that fills `--jcd-blue` when the card is pressed, page opens 0.42s later. `custom.js` (Design Approach block), `custom.css` `.jcd-da-*`.
- Home category words: hover grow 1.12 -> 1.05 (press 1.03) (Joel: too big).

### Home: End-to-End squares larger; category words grow on hover, no grey press
- End-to-End Expertise slider (computer + iPad): squares drawn 1.35x (356 -> 481px) so the text in the photos is readable; strip, gallery box and section grow with them (same space below), arrows step one (new) card, the hover caption layer is resized too. `custom.js` "End-to-End", `site.js` 5 (card step in CSS px).
- "Works" category words (Defense ... Experimental), computer + iPad: the word grows 1.12x on hover; pressing no longer fills the button grey, the word turns `--jcd-blue` (phone keeps its grey press). `custom.css`.
- `preview/category-order.html`: drag-to-reorder tool for Joel to choose the order of the category words. `preview/signature-write.html` + `signature-paths.json`: About signature hand-writing study (strokes traced from the signature image).

### About "What I Believe" on iPad upright / phone: framing
- Joel: speaker too far left on phone/iPad; on an upright iPad his head was cut, then too much ceiling/floor. Phone: photo anchored at 17% (speaker ~left of centre). iPad: 15% 70%. iPad upright: section and photo 38% of the screen tall (wide crop, less ceiling/floor), photo held at the screen bottom (this is the page's last section, so it lines up at the end like the product pages), text drawn 1.25x and re-centred. `custom.js`.

### About "What I Believe": scroll reveal; speaker kept in view on phone/iPad
- Joel: same reveal as the product pages. The photo is one screen tall and stays still while the section passes over it like a window (CSS sticky; its box reaches one screen above/below the section, the section's background box clips with `overflow: clip`). Loads at once (not lazy). Phone + iPad: the photo is anchored left (`object-position: 12% 60%`) so the speaker on the left shows. Phone now uses the large file (`about-03-2151x1344.jpg`; the 640px crop `about-04` removed) because the photo fills a whole tall screen. `custom.js` "About What I Believe".

### iPad upright: larger page + menu; About intro no longer far down
- Joel: on an upright iPad the About intro had a huge empty band above it, and everything (menu too) was too small; landscape was fine. `site.js`: upright iPads are laid out 1440px wide (was 1694; landscape stays 1694), ~18% larger; the viewport switches when the iPad turns, and `.jcd-tab-portrait` draws the header's logo group and menu group 1.3x, each anchored to its own edge. `custom.js` About intro: centred below the menu but at most 260px below it. `preview/devices.html`: iPad portrait frame 1440 wide (`twp`).

### No file-name tooltips; selection rules written down
- Joel: resting the mouse on a photo (Cross-Category and elsewhere) showed its file name. 118 Wix `title` attributes removed from the HTML of all pages; `custom.js` removes any added later (gallery overlays, SVG titles). DESIGN-SYSTEM: new "Tooltips" rule; the no-selection / no-context-menu rule now spells out all platforms.

### Fix: Achievements numbers cut at the right
- The rolling digit boxes took their width from a measurement that could happen before the web font loaded (narrower fallback font) and clipped all four sides. Now each digit box holds an invisible copy of its final digit (exact width/height in the real font, also after the font arrives), the rolling strip sits on top, the roll distance is a percentage of the strip, and only the top/bottom are clipped. `custom.js`, `custom.css` `.jcd-odo*`.

### Home Selected grid: no flash in the gaps
- Joel: moving the mouse through the gap between two tiles made everything bright for a moment. The spotlight now moves straight from tile to tile and stays on the last tile while the mouse is in a gap; it only clears when the mouse leaves the whole grid. `custom.js` "Home Selected grid".

### Home Achievements numbers: odometer roll
- Joel chose option A of `preview/achievement-counters.html`. 10+ / 15+ / 30+ / 8+ / 2+: each digit rolls up like an odometer (units more turns than tens, 1.8s fast-then-slow), the five numbers 0.15s apart, once, when they scroll into view. Wix's font and size kept (column height = measured digit height; each column as wide as its final digit, the line never wraps). All platforms; off under reduced motion. `custom.js`, `custom.css` `.jcd-odo*`.

### Fix: product-page closing photos were gone (reveal)
- Cause: the image clean-up made images below the first screen lazy-loading. The reveal section takes its height from the photo, so it started at 0px and a lazy photo in a 0px box never loads. `custom.js` reveal block: the closing photo always loads at once, and the photo ratio is read from the file name (`-2000x942`) so the height is right before the photo arrives. Checked 18 product pages x computer + phone: all 36 show their photo.

### Round ">>": blue fill before the page changes
- Joel: tapping a home tile flashed the ">>" blue and the page changed too fast. Clicking/tapping a card with a round ">>" (home Selected grid, category cards; all platforms) now fills it with `--jcd-blue` (slight 1.08 grow) and opens the page 0.42s later (`GO_DELAY`). Ctrl/Cmd/Shift/middle clicks still open new tabs at once; the back button clears the blue. `custom.js`, `custom.css` `.jcd-go-fill`.

### Fix: round ">>" did not appear on hover (computers)
- The size rule for the round ">>" (`body:not(.device-mobile-optimized) .jcd-go.jcd-go-hover`, opacity 0) outranked the hover rule, so it stayed invisible. The hover rule now has the same `body:not(...)` prefix and wins. `custom.css`.

### Category cards on computers: round ">>" like the other platforms
- Joel: the computer ">>" should be circled, as on phone / iPad. Wix's text ">>" is hidden; linked cards get the same round frosted ">>" (40px) in the photo's bottom-right corner, shown only while the mouse is on the card. Big cards whose Wix link box is 0px tall now hang the overlay on the photo itself (also fixes their position on touch). Checked all six category pages, computer + phone: every linked card has its round ">>" in the bottom-right corner. `custom.js`, `custom.css` `.jcd-go-hover`, `.jcd-gg-hide`.

### Home "Selected" grid (12 works): spotlight
- Joel chose option B of `preview/works-grid.html`. Computer with a mouse: the tile under the mouse stays bright, its photo eases in 6% inside the frame, a thin white line frames it and category + name + a round ">>" rise in at the bottom-left; the other 11 dim (brightness .38). Touch (phone + iPad): category + name always at the bottom-left with the round ">>" (same as the category pages), blue while pressed. Wix's 27% / 45% darkening overlay is off for this grid (`site.js` 5b skips it). Names per link in `custom.js` "Home Selected grid" (`NAMES`). `custom.css` `.jcd-spot*`.

### About: intro centred in the space below the menu
- Joel: the first About section sat too high (the menu takes the top band, so whole-screen centring left an empty band below). `custom.js` "About, desktop layout": the text + portrait block is now centred between the header's bottom and the screen bottom (still at least 56px below the header), and may move down as well as up. Checked 1920x1080 (189px above = 189px below), iPad landscape (259 = 259) and portrait.

### Category pages: cards with and without a product page now look different
- Joel: cards without a link had the same 3D tilt + light + darkened name as linked ones; on the phone only ">>" told them apart. Study: `preview/category-links.html`.
- Computer (mouse): a card without a product page no longer tilts and gets no light sheen (`tilt.js` skips hover boxes without a link), cursor stays the normal arrow; hovering still darkens it and shows its name. ">>" on linked cards only appears on hover (unchanged Wix hover state).
- Touch (phone pages + iPads), option 3a: every card shows its product name at the bottom-left (brand small above, model; soft wide text shadow + faint bottom gradient); linked cards get a round frosted ">>" on the right on the same centre line, blue while pressed. Wix's centred captions and ">>" on the photo are hidden. Names are read from each card's own caption. `custom.js` (load), `custom.css` `.jcd-foot`, `.jcd-go`, `.jcd-cards-touch`. Checked all six category pages: every card has its name, every linked card its ">>", no old ">>" left.

### Home "Achievement" world map: glowing dots, light along the lines, hover on computers
- Joel's design (study: `preview/achievement-glow.html`). All platforms: each map dot breathes with a soft spreading ring; a light that fades at head and tail runs along its line into the flag (4.8s cycle, the five countries in turn); on arrival the flag's round outline glows and a ring spreads out. Lines/glow never cover the flags (mask). Computer with a mouse only (not phone, not iPad): hovering a country's line, dot, flag or one of its products enlarges that country's products + captions (7%, cut from the same image into 10 tiles), lights its line, keeps its dot + flag outline lit without motion and fades the other countries' effects. USA: AT&T, Gfiber, Rigado, Ciena; Canada: Cogeco; Italy: Adant; Taiwan: Gemtek, Lionic, NCSIST; Japan: Genix. Paused while off screen; off under reduced motion.
- Map image: Italy's dot moved up from north Africa to Italy (coast dots restored) -> `home/home-19-1908x858-v2.png` (desktop) and `home/home-19-1160x522-v2.png` (phone, 256-colour PNG, 82 KB instead of 234 KB). Old files removed.
- `custom.js` "Home Achievement world map", `custom.css` `.jcd-map*`.

### Home slide 9 (black tower): Joel's cleaner render
- Same size (2000x1077), much less noise -> `home/home-09-2000x1077-v2.jpg` (desktop + phone); original in `media-originals/jcd_home-tower-black_2000x1077.jpg`. `-v2`: a replaced image of the same size gets a version suffix so browsers do not keep showing the cached old file.

### Home slides 4 + 7: Joel's enhanced renders
- Slide 4 (black routers): Joel's resolution-enhanced version (pasted, 2000x1166) -> `home/home-04-2000x1166.jpg` (263 KB).
- Slide 7 (blue tower): the full-size enhanced file was in Downloads (2752x1536) -> `home/home-07-2752x1536.jpg` (459 KB), replacing the 2000px pasted copy from earlier today. Originals in `media-originals/jcd_home-*`. Desktop + phone.

### Home slide 7 (blue tower): Joel's updated render
- Tighter framing and sharper (pasted, 2000x1116); `home/home-07-2000x1116.jpg` (desktop + phone), old 3200/2400 files removed; original kept as `media-originals/jcd_home-tower-blue_2000x1116.jpg`. Only used on the home slideshow.

### Home slide 4 (black Wi-Fi 7 routers): Joel's cleaner version
- Same size as before (2000x1167) but less noise; `home/home-04-2000x1167.jpg` re-made from it (256 KB), original kept as `media-originals/jcd_home-routers-black_2000x1167.jpg`. Only used on the home slideshow (desktop + phone).
- New folder `media-new/` (not published, git-ignored except its README): images pasted into the chat arrive shrunk to 2000px wide, so full-size originals should be dropped there instead.

### T-Blade on its cart: Joel's new render
- Joel's new image (2000x1147, 334 KB JPEG, kept as `media-originals/jcd_t-blade-on-cart_2000x1147.jpg`) replaces the old render everywhere it was used: T-Blade page (image 13), home slideshow slide 6, Defense category tile (desktop + phone). Files: `t-blade/t-blade-13-2000x1147.jpg` (326 KB, q88 4:4:4) and `t-blade/t-blade-13-560x321.jpg` (phone tiles, 31 KB); old `home-06-*`, `defense-02-*`, `t-blade-13-2283x1284/560x314` removed. Note: the pasted file is 2000px wide (the old original was 3325px) — fine on laptops, slightly soft as a full-screen slide on 2560+/4K; a larger export can replace it the same way.

### Contact form, second pass: smaller text, quiet message hint
- Joel: phone text still too big; "Leave a message..." smaller, greyer, thinner. Phone: field text 14 -> 11px, message hint 9.5px; all platforms: message hint Poppins Light, white 45% (desktop/iPad 13px). Field names stay white Medium. iPhones would zoom in on tap below 16px on screen, so `custom.js` caps the phone page's viewport `maximum-scale` at its fit-to-width scale on iPhones with a form (pinch-zoom by hand still works). `custom.css`, `custom.js`.

### Phone category pages: frames of one category closer, clear gap between categories
- Joel: on the phone the frames were too spread out and the gaps inside a category looked like the gaps between categories. `custom.js` (phone, networking / defense / electronics / industrial / lifestyle / experimental): frames of one group 8px apart (was 15px), a new group (frame with a title bar) 48px below (was 40px); captions/overlay layers move with their frame; the section is shortened by the space saved.

### Contact form: one style for every field
- Joel (phone): text too big, lines too thick, not uniform. All platforms: one 1px white underline at rest and when hovered/typing (colour still turns `--jcd-blue`), same 12px indent, same white hint text for every field. Phone text 20px -> 14px (still >= 16px on screen, so iPhones do not zoom in on tap); desktop/iPad message box 12px -> 15px like the other fields. `custom.css`.

### Images: one folder per page, readable names, rebuilt from the originals, faster loading
- Joel: image names must be consistent (no random strings, easy to manage), quality checked, loading speed checked. `site/assets/media/` is now one folder per page (`home/`, `about/`, `wi-fi7-2022/`, ... and `shared/` for images used on several product pages or by the CSS). Names: `<page>-<nn>-<width>x<height>.<jpg|png>` — `nn` = order of first appearance on the desktop page; the same photo in several sizes keeps its number (`-b`, `-c` when two crops share a size). 1,139 Wix files -> 1,172 files, 31 folders (incl. the 11 AI Tool Kit lightbox images that were in `full/`). `reference/media-map.json` lists each file: original upload, Wix crop/fill used, old Wix names, pages.
- Quality: every image re-made from the uploaded original in `media-originals/` with Wix's exact crop/fill/alignment (JPEG q86, 4:4:4; PNG kept only for transparency or small graphics). 54 transparent PNGs whose rebuild did not match pixel-for-pixel keep the exported file (renamed).
- Speed: images total 244 MB -> 180 MB. Phone pages get their own lighter files (top image max 2400px wide, the rest max 1440px); Works-grid tiles no longer load a ~2000px picture for a 400px tile. Every image below the first section loads when scrolled near (`loading="lazy"`). Home slideshow: slides 1-2 at once, the rest after the page has loaded; the hidden Wix ghost copies are lazy. Images loaded with the page: desktop home 30.5 MB -> ~1.5 MB first, 17.6 MB in all; phone home 11.5 -> 8.1 MB in all; Wi-Fi 7 2022 6.5 -> 4.8 MB (phone 1.6 -> 1.4).
- Checked: all 70 pages (desktop + phone) scrolled top to bottom, 0 broken images, 0 missing files. Old Wix-named files removed from git. `preview/testimonials-ui.html` path updated.

### Defense: Field Protection frame = T. Guardian
- "Coming Soon" -> "T. Guardian" (desktop + phone defense pages); the ">>" on that frame is hidden (no product page yet; `custom.css` `#comp-mukou2e11`).

### Sharper top images (home slideshow + product pages)
- Joel: home and product top images looked much worse than on Wix. The exported files were Wix re-encodes (e.g. 2560px at ~300KB, some 2000px originals blown up to 2560, phone slide 10 only 552px). They are now made from the uploaded originals in `media-originals/`: full original (no Wix crop), at most 3200px wide, JPEG quality 90 with full colour resolution (4:4:4) -> `site/assets/media/jcd_hero_<id>_<w>x<h>.jpg`. Home slideshow (10 slides, desktop + phone, order checked against Joel's list: Guardian, T-Blade drone, gaming case, routers, Wi-Fi 7 2022 pair, welding bench, blue tower, ACE, black tower, Zenfone) and the top image of 18 product/series pages (desktop + m/). Parametric Pattern (PNG) and Wi-Fi 7 2022 / T-Blade (Joel's own 4:3 files) unchanged.
- Limits: some originals are only 2000px wide or less (home slides 4, 8, 9; Gaming gateway, Lionic, AI Tool Kit, T-Interceptor CS, NLG MMA200, Assistive top images) — sharp on laptops, slightly soft on 2560+/4K screens unless Joel supplies larger files. Wi-Fi 7 HGU/AP top image is still missing (broken on Wix too).

### Closing-photo reveal: no more white gaps when scrolling fast
- Joel: scrolling fast to the bottom of a product page made white areas pop up in the reveal. The photo was moved by a scroll script, one frame late. Now done with CSS `position: sticky` (the browser keeps the photo still at the screen bottom): the photo's box reaches one photo-height above the section, the photo sits at its bottom (flex, no margin) and sticks to the screen bottom; the section's background box clips it (`overflow: clip`, not `hidden`, which on the phone would stop the sticky). Wix's `margin-top: -1 screen` on that box removed. `custom.js`. Checked phone, iPad portrait + landscape, 1920 and 1536: photo still while the section edge slides; whole photo at the end.

### Contact form: hover / focus underline in the site blue
- Joel: the white line under each Contact field turned Wix's blue (#1A2DF3) on hover; now `--jcd-blue` #0062D9 on hover and while typing (also the field labels). `custom.css`, desktop + iPad + phone contact pages.

### Product pages: closing photo revealed while scrolling (like Wix), whole photo shown
- Joel: the bottom image of product pages should be "revealed while scrolling" like the Wix site (wi-fi7-2022), and it was still cut. Wix kept the photo fixed to the screen while the last section's top edge slid over it. `custom.js` (block after the photo pinning): the last section of a page, when it is a photo with no text, is now as tall as the photo (width / photo ratio, at most one screen); while it scrolls in, the photo stays still at the bottom of the screen and the section edge slides up over it. At the end of the page the whole photo is visible. Desktop, iPad and phone. Its empty Wix content box (1000px) is shrunk so no blank strip is left below.
- The exported closing files were Wix crops (1.44:1 desktop, ~1:1 phone) that cut the products; 18 pages now use the full original from `media-originals/` -> `site/assets/media/jcd_closing_<page>_<w>x<h>.jpg` (desktop max 2560px, phone 1280px). Pages: moai-router, wi-fi7-extender, wi-fi7-hgu-ap, wi-fi7-gaming-home-gateway, wi-fi7-2022, airgain, lionic, interstellar05, jcg-tough-welding, t-blade, t-interceptor-cs, t-interceptormp, nlg-mma200, teana, speeder-pro, zenfone-9, sagittarius, assistive-products (desktop + m/). Interstellar and Assistive use the same photo in an earlier section too; that one is unchanged.

### Home slideshow always starts at the first slide
- Joel: coming back to the home page from any page must start the top slideshow at slide 1. `site.js` section 6: starts at index 0 (not the slide that happened to be in the export), and resets to slide 1 when the browser restores the page from its back/forward cache (`pageshow` persisted). All platforms.

## 2026-11-25

### Whole desktop/iPad page 15% smaller (UI_SCALE 0.85); top images still full screen
- Joel: menu, category headings and white frames too big — "make every page smaller, keep the top images the same size". `site.js`: new `UI_SCALE = 0.85` (`window.__jcdUiScale`). Computers: CSS zoom = (window width / 1536, at least 1) x 0.85 (laptop 1536: 0.85, 1920: 1.063, 3440: 1.904); iPads: `TABLET_W` = 1440 / 0.85 = 1694. Phone (m/) unchanged. Top images keep filling the screen (heights computed from the screen / `__jcdZoom`).
- Checked laptop, 1920, ultra-wide, iPad landscape + portrait: logo/menu/titles 15% smaller, home hero still 100% (iPad portrait 50%), category frames centred with more side space. `preview/devices.html` iPad width 1694.

### Bottom images no longer cut; no right-click / long-press / selection; Ocean wave seams
- **Images cut at the bottom of many pages** (Joel: e.g. Wi-Fi 7 2022 "New Wi-Fi 7 Generation", all platforms): Wix "fixed" section backgrounds are sticky and screen-sized, so a section taller than the screen never showed the photo's bottom (desktop 1000px sections on an 864px screen), and phone sections (300px) showed less than half of a 693px photo. `custom.js` (first block) now pins every sticky/fixed section photo to its own section (`object-fit: cover`, media box unclipped for Safari). 30 photos on 21 pages (desktop + phone) checked: each covers exactly its section, none sticky. The parallax "fixed" feel is gone by design.
- **No context menu, no text selection, no image dragging** (Joel: long presses on the phone kept selecting text; no "save image" menus): `custom.css` + `custom.js`, every platform. Contact form fields stay selectable/editable. Note: this deters casual saving; it cannot stop screenshots or developer tools.
- **Ocean Series wave seams** (phone): the divider SVG's top edge drew a faint line across the width; image is now 3px taller than its box (bottom-anchored) so that edge row is clipped, and the next section's blue reaches 2px up under the waves. All platforms.

### T-Blade: new 4:3 top image (whole drone visible)
- Joel's 4:3 version (2000x1500) -> `site/assets/media/jcd_t-blade-hero_4x3_2000x1500.jpg`, used by `t-blade/index.html` and `m/t-blade/index.html` (was the Wix 2560x1511 crop of a 3488x1216 original). `object-position: 50% 45%`.
- Checked (drone nose to tail fins = image x 190-1800, y 450-930): laptop, 1920, ultra-wide, 4K, iPad landscape + portrait: whole drone. Phone (~0.92:1) trims nose and tail — same open question as Wi-Fi 7 2022.

### Wi-Fi 7 2022: new 4:3 top image (all three products visible)
- Joel made a 4:3 version (2000x1500) of the three-product hero; now `site/assets/media/jcd_wi-fi7-2022-hero_4x3_2000x1500.jpg`, used by `wi-fi7-2022/index.html` and `m/wi-fi7-2022/index.html` (was the Wix 2028x1197 crop of a 2028x941 original). `object-position: 50% 62%`.
- Checked (products + pedestals = image x 110-1845, y 650-1200): laptop, 1920, ultra-wide 3440, 4K, iPad landscape + portrait all show the full width and all three products. Phone (top image half the screen, ~0.92:1) still trims ~300px each side: the white and green units are partly cut — open question to Joel.
- Hero image rule for Joel's new images: 4:3 canvas, products inside the middle ~55% height band, ideally 3840x2880 (2000px is fine but softer on 4K).

## 2026-11-24

### Cross-Category: white + dark towers tile -> Gaming Home Gateway
- Joel: the left grid's row 2 / column 1 tile (white and dark towers in the purple room) links to `wi-fi7-gaming-home-gateway` (was Wi-Fi 7 2022). The green fabric tower (row 2 / column 3) stays on Wi-Fi 7 2022.

### iPad portrait: top image half the screen
- Joel: iPad upright should not be full screen, half is enough. `custom.js` "Top image height": any portrait screen on the desktop page (iPad upright — also when an iPad with a trackpad is detected as a computer — or a portrait monitor) = 50% of the screen height; landscape (computers, iPad sideways) stays one screen; phone stays 50%. Checked home + MoAI: iPad portrait 50% (both detections), iPad landscape / laptop 100%, phone 50%.

### White block behind the header when clicking menu items quickly
- Joel: pressing a menu item (e.g. Contact) several times quickly showed a white block filling the header area. Each click reloads the page; for a moment before `custom.js` runs, the Wix page background layer (white) showed behind the header. Dark pages now carry `class="jcd-dark-canvas"` on `<html>` in the HTML itself (52 files: 26 pages x desktop + phone), so the background is black from the first paint; the 10 light pages (20 files) keep Wix's white. The JS check stays as a backup.

### Gaming Home Gateway "Aerodynamic Concept": product and car always visible
- Joel: on every device/resolution the product (left) and the car (right) must show. The photo was a sticky, screen-sized Wix background (`#img_comp-m5v68a5z2`, box = screen height inside a 2478px media strip), so on tall screens it was scaled up and both ends were cut. Now the photo covers only its section (`static-overrides.css`): full photo width on every screen (checked laptop, 1920, ultra-wide, 4K, iPad portrait/landscape: 100% width, 91% height shown, only black top/bottom trimmed; phone already showed the whole photo). Section height unchanged (750px layout); no clipping on the media box (Safari).

### Cross-Category tiles link to product pages; hidden light section colour (phone hairline); iPad "What I Believe" photo
- **Home Cross-Category (18 tiles)**: each tile with a product page is now a link (`custom.js` `LINKS`, 9 per image, row by row): Interstellar 05, Zenfone 9, Sagittarius, Wi-Fi 7 2022 (x2), Wi-Fi 7 HGU/AP, Smoky Tree + AIRMP (Behance, new tab, as on the Lifestyle/Electronics pages), Speeder Pro, LionFilter 200, NLG MMA 200, T. Interceptor MP, T. Blade, MoAI, Airgain kit. The 3 tiles without a page (Advantech AIM 20 accessories, Gemtek X-Cell, Nichicon remote) have no hotspot: no lift, no glow, no link. Phone links go to the phone pages. Touch: lift/glow while the finger is down, one tap opens; scrolling cancels.
- **Thin white line under "EXPERTISE" on real phones** (not visible in the preview, whose frame lands on whole pixels): the About work/awards section `#comp-mujj9yx016` had a hidden light colour rgb(246,246,246) under its black layer, leaking through the sub-pixel seam. `custom.js` "Page background" now gives any section whose light colour is fully covered by a dark layer that dark colour (also NLG MMA 200 hero).
- **iPad: "What I Believe" photo missing**: `#bgMedia_comp-mujj9yyt` is a static box above the section with `overflow: clip`; Safari clips the absolutely positioned photo (Chrome does not). Clip removed on that box (`static-overrides.css`); bgLayers still keeps the photo inside the section. Confirmed by Joel on a real iPad.

### Home Works grid: darker press overlay on phone / iPad
- Joel: "not dark enough, one step darker". Touch devices (`hover: none`) 27% -> 45% black on the 12 Works tiles (`#pro-gallery-container-comp-mnpgav5j`); desktop hover unchanged (27%).

### Home Works grid (12 tiles) on phone / iPad: dark overlay while pressing, one tap opens the project
- Joel: the 12 Works tiles should darken under a finger like the desktop hover. `site.js` 5b: on touch, a finger resting on any Pro Gallery tile shows the desktop hover overlay (dark + title) after ~60ms; moving the finger (page scroll / slider swipe) cancels it. Tiles that are links (Works grid) now open their project in ONE tap (overlay shows while pressed); tiles without a link (End-to-End) keep the overlay after the tap.

### End-to-End: text appears while pressing (touch); Design Approach cards: no glow, only card 1 pressable
- **Home "End-to-End Expertise" tiles, phone + iPad**: the dark overlay + text now appears as soon as a finger rests on a tile (~0.1s), not after the tap; a swipe through the slider does not trigger it. First tap still never follows a link. `site.js` 5b.
- **Home "Design Approach" cards** (all platforms): the hover/tap glow is removed from all four. Cards 2-4 do nothing (no hover, no press, default cursor). Card 1 (01 DISCOVERY, with the ">>" arrow) is pressable: the whole card follows the arrow's link, and while pressed it pushes in (`scale(.985)`) with a brand-blue 1px outline. `custom.js` (start) + `custom.css` section 2.

### "What I Believe" centred on its photo; header can't be selected / dragged
- **About "What I Believe"** (all platforms): title + text block now sits on the vertical centre of its photo section (`custom.js` "What I Believe", moves #comp-mujq4udg1 / #comp-mujq4ude6 with `top`, redone on resize). Was 27px low on the phone, 35px high on desktop/iPad; now equal space above/below (desktop/iPad 271/271, phone 52/52). The phone's extra 40px bottom margin was removed.
- **Pressing the logo left a light band across the header** (Joel, not reproduced at 1348px): most likely a text selection / drag ghost of the header. The header and everything in it are now not selectable and not draggable (`user-select: none`, `draggable=false`, no selection colour, no mouse-focus outline), all platforms. Confirmed fixed by Joel on his monitor.

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
