# Design system — joel-chang-design.com

The visual rules Joel has set for this site. **Any person or AI changing the look must follow this file and update it
when Joel changes a rule.** Values are implemented in `site/assets/css/custom.css` (tokens at the very top) and
`site/assets/js/custom.js`. History of each decision: `CHANGELOG.md`.

Last updated: 2026-11-26.

---

## 1. Colour

| Token | Value | Use |
|---|---|---|
| `--jcd-blue` / `--jcd-blue-rgb` | **#0062D9** · rgb(0, 98, 217) | The one interactive blue: top-menu hover and press, dropdown press, phone-menu press, logo + LinkedIn/Behance icon hover, **every pressed state that turns blue**, cursor light, hover glows (Cross-Category tiles), pressed outline (Design Approach card 1), recommendation quote mark + LinkedIn tile + top-left glow, Contact "sent" tick, Contact field underline on hover/focus |
| `--jcd-navy` / `--jcd-navy-rgb` | **#00176C** · rgb(0, 23, 108) | Deep blue-violet, second colour of gradients: recommendation card bottom-right glow, initials avatar gradient end |
| Black | #000 | Page canvas (`html, body`), dark pages' background layer (`.jcd-dark-canvas`) |
| White (page bg) | #fff | Light pages keep Wix's white page background (Wi-Fi 7 HGU/AP, MoAI, Extender, 2022, Airgain, Lionic, AI Tool Kit, NLG MMA200, Sagittarius, Assistive) — never paint it black |
| Text on dark | #fff headings · rgba(255,255,255,.82–.9) body · .5 secondary · .38 tertiary/italic | |

Rules
- Use the tokens, never a hex/rgb blue directly: `color: var(--jcd-blue)`, `rgba(var(--jcd-blue-rgb), .45)`.
- A glow keeps its own alpha; only the colour comes from the token.
- On black, `#00176C` is very dark: use it at high alpha (.85+) or as a gradient end next to `#0062D9`.

## 2. Surfaces: frosted glass

| Component | Fill | Blur | Edge | Radius | Shadow |
|---|---|---|---|---|---|
| Recommendation card (About) | rgba(255,255,255,.035); hover .055 | `blur(22px) saturate(150%)` | 1px rgba(255,255,255,.09); hover .2 | **6px** | 0 12px 40px rgba(0,0,0,.35) |
| Works dropdown (desktop / iPad) | rgba(18,20,26,.42) (dark tint so white text reads on light photos) | `blur(20px) saturate(150%)` | 1px rgba(255,255,255,.16) | **8px** | 0 10px 30px rgba(0,0,0,.3) |
| Phone full-screen menu | rgba(8,9,12,.55) | `blur(22px) saturate(140%)` | — | — | — |

Corner radius scale: 2px hairline details · 4px small tiles/icons (LinkedIn tile) · **6px cards** · 8px floating panels. Joel: "not too round".
Radii are CSS px of the layout, so they scale with the page (wide-screen zoom, iPad scaling) automatically.

## 3. Typography (Poppins, the Wix font files in `site/assets/fonts/`)

| Weight | CSS font-family stack |
|---|---|
| Light | `wfont_459113_ebfb1394532347b3b7691d160bb35bd1, wf_ebfb1394532347b3b7691d160, orig_poppins_light` |
| Regular | `wfont_3f090f_d2b74fa2704044fa98373433c883f8ed, wf_d2b74fa2704044fa98373433c, orig_poppins_regular` |
| Medium | `wfont_3f090f_fbe2048d9f994d8c8d5073ed8164a33e, wf_fbe2048d9f994d8c8d5073ed8, orig_poppins_medium` |
| SemiBold | `wfont_459113_5846594cb6ea4f43b8e132f9d1a29629, wf_5846594cb6ea4f43b8e132f9d, orig_poppins_semibold` |

Sizes set so far (layout px; desktop page / phone 320px page):
- Recommendation card: featured text 17 / 8.5, text 14 / 8 (line-height 1.6–1.65), name SemiBold 15 / 9.5, role Light 11.5 / 6.5 (desktop / phone). Phone sizes follow the phone About page: body 6–8px, headings 11px — a card must never be louder than the section heading.
- Phone menu: Works / About / Contact SemiBold (Wix size); the six product pages Light **13px**.
- Phone About "What I Believe": text 9.5px / 1.55, title 14px. Phone body text must not go below ~8px in the 320px layout (≈10px on screen).
- Quote mark: Georgia serif, white 85% at rest → `--jcd-blue` on hover/press.

## 4. Spacing & alignment

About page (all section headings, `custom.js` "About page: one spacing rule"):

| | Main heading above | Side heading above | Heading → content | Left edge |
|---|---|---|---|---|
| Desktop / iPad | 98px | 60px | 41px | one edge = WORK EXPERIENCE content |
| Phone | 48px | 28px | 12px | 20px |

Main headings: WORK EXPERIENCE, SELECTED AWARDS, EXPERTISE, TRUSTED COLLABORATION. Side: EDUCATION, LANGUAGES, PATENTS. Side-by-side headings share one line.

Other rules
- Phone page side margins: **20px** each side (equal) in the 320px layout.
- Category pages (desktop/iPad): white frames and the unframed tile rows share one left edge and are centred, equal space left/right (`custom.js` "Category pages").
- About intro (desktop/iPad): text + portrait centred in the space between the header and the screen bottom, at least 56px and at most 260px below the header (`custom.js` "About, desktop layout").
- Catalog title bars: every text centred vertically on the bar (`custom.js` "Catalog title bars").
- Phone category pages: frames of one category 8px apart, 48px before the next category (`custom.js`).
- Contact form fields: 1px white underline (hover/typing: same width, `--jcd-blue`), 12px indent; field names white Medium (phone 11px, desktop 15px); message hint Poppins Light white 45% (phone 9.5px, desktop 13px). iPhone tap-zoom is stopped by `custom.js` (viewport maximum-scale).
- Content never touches the screen edge on iPad (that is why the iPad layout is 1440px wide).

## 5. Devices & scaling (Joel's rule: phone, iPad and computer are always fixed together)

| Device | Page | How it fits |
|---|---|---|
| Phone | `site/m/…` (320px layout) | scaled to the phone width by the viewport |
| iPad (Air 11, Pro 11, Pro 13) | desktop page | landscape laid out **1694px** wide (`TABLET_W` = 1440 / UI_SCALE), portrait **1440px** (`TABLET_W_PORTRAIT`, ~18% larger) and scaled; upright, the header logo and menu are drawn 1.3x (`.jcd-tab-portrait`) |
| Computer ≤ 1536px | desktop page | zoom = UI_SCALE 0.85 (Joel's laptop: 1920 @125% = 1536) |
| Computer > 1536px (1920, 2560, 3440 ultra-wide, 3840 4K) | desktop page | CSS zoom = width / 1536 x UI_SCALE (`window.__jcdZoom`) → always full width |

**UI_SCALE = 0.85** (`site.js`): one knob for the size of everything on the desktop page (computer + iPad); 1 = the Wix size. Top images are not affected (always full screen / half on portrait).

Top image ("hero", home slideshow + product pages): phone **50% of the screen height**; any portrait screen on the desktop page (iPad upright) **50%**; landscape (computers, iPad sideways) **exactly one screen** (`100svh`, divided by `__jcdZoom` on computers).
Scripts measuring with `getBoundingClientRect` must divide by `window.__jcdZoom` before writing CSS px.
Background photos: Wix sticky/"fixed" section photos are pinned to their section by `custom.js` (no parallax). Never leave `overflow: clip/hidden` on a Wix `bgMedia_*` box that sits outside its section (iPad Safari hides the photo); sticky screen-sized Wix backgrounds crop products on tall screens — pin them to their section instead (About "What I Believe", Gaming gateway "Aerodynamic Concept").
Closing photo of product pages (last section, photo only): Wix-style scroll reveal — section as tall as the whole photo (max one screen), photo stays still at the screen bottom while the section edge slides over it (`custom.js`, `.jcd-reveal`; CSS sticky, never a scroll script — scripts lag and show gaps on fast scrolls). Use the full original photo, never a Wix crop. About "What I Believe" uses the window form of the reveal (photo one screen tall, fixed while the section passes; phone/iPad anchored left to keep the speaker).
Images: `site/assets/media/<page>/<page>-<nn>-<w>x<h>.jpg`, made from the uploaded original (`media-originals/`), JPEG q86 4:4:4 (top images q90, max 3200px), never Wix's re-encoded copies. Phone pages: top image max 2400px wide, others 1440px. Below the first section: `loading="lazy"`.
Home slideshow: always starts at slide 1 when the page is shown (also after the back button).

## 6. Interaction states

| State | Rule |
|---|---|
| Hover (mouse) | Menu text → `--jcd-blue`; icons/logo cross-fade to a blue copy; cards lift `translateY(-4px)`; ease .35s `cubic-bezier(.2,.7,.2,1)` |
| Press (all platforms) | Text → `--jcd-blue` + small press-in `scale(.92)` in .12s (menus, dropdown items, phone menu, menu icons); cards `scale(.99)` |
| Touch | Every hover effect also on tap/press (`:hover` sticks after a tap, `:active` while pressed); iOS needs the touchstart listener in `custom.js` |
| Labels that are not buttons | No frame, no hover, no click (home "Selected") |
| Cards that are not links | Design Approach cards 2-4: subtle hover only (frame brightens, faint fill), no press, default cursor. Card 1 (link): no movement; light blue gradient slides in from the left (.6s); small round >> (30px, bottom-right corner) that fills blue on press |
| Category cards | Computer: only linked cards tilt + light sheen; unlinked keep the darken + name on hover, arrow cursor; a round frosted >> (40px, bottom-right) only on hover. Touch (phone + iPad): name bottom-left (brand small + model, soft shadow), linked cards a round frosted >> on the same centre line, blue while pressed |
| Touch reveal | Overlays that show on hover with a mouse show while a finger rests on the item (~0.06s), not after the tap; scrolling/swiping never triggers them. Tiles without a link (End-to-End) keep the overlay after the tap (60% on touch, 27% desktop hover) |
| Home category words | Computer/iPad: word scales 1.05 on hover (.35s), pressed = --jcd-blue text, no fill. Phone: grey press fill |
| Round >> press | Clicking a card with a round >> fills it --jcd-blue, the page opens 0.42s later (every platform) |
| Home Selected grid | Spotlight: hovered tile bright + photo 1.06 inside the frame + white 1px line + category/name + round >>; the others brightness .38. Touch: name + round >> always shown |
| Selection / context menu | Disabled site-wide on phone, iPad and computer (`custom.css` + `custom.js`): no right-click / long-press menu, no text selection with the mouse or a long press, no image drag. Form fields (Contact) excepted |
| Tooltips | None. No `title` attribute anywhere (resting the mouse on a photo must not show its file name); `custom.js` strips any that appear later. Form fields excepted |
| Reduced motion | Every looping or moving effect is switched off under `prefers-reduced-motion: reduce` |

## 7. Motion

- Recommendation card hover: two faint corner glows (blue top-left 300×200px at .28, navy bottom-right at .6), drifting 70px/22px along the edge, 5s alternate; centre stays black.
- GET IN TOUCH (home): endless "balloon" breathing, scale 1 → 1.045 → 1, 2.8s; pauses on hover/press.
- Ocean Series creature photos: dimmed 35% at rest; hover/tap = full brightness + the photo zooms 1.1 **inside its frame** (never covers text).
- Category cards (desktop): 3D tilt following the mouse (`tilt.js`), max 3°.
- Home video glow: soft blue blur around the video window, breathing .65-1 in 4.5s (no rotation).
- About signature: left-to-right soft-edge reveal on scroll-in, 1.6s, once.
- Home Achievements numbers: odometer roll on scroll-in, 1.8s cubic-bezier(.2,.75,.15,1), numbers 0.15s apart, once.
- Home Achievement map: dots breathe (3.2s) with a spreading ring; a soft light (fading head and tail) runs each line into its flag (4.8s, countries staggered 0.55s); flag outline glows on arrival. Computer hover: the country's products scale 1.07, its dot/flag stay lit without motion, other countries' effects fade out.

## 8. Components (where they live)

| Component | Code |
|---|---|
| Recommendation cards (About, style A1) | `custom.js` "About Trusted Collaboration" (texts + LinkedIn URLs in `REC`), CSS `.jcd-rec*` |
| Works dropdown glass, phone menu glass | CSS "Frosted-glass menus" |
| Phone menu LinkedIn/Behance | `custom.js` (cloned from the hidden footer), CSS `.jcd-menu-social*` |
| Hero heights | `custom.js` "Top image height" |
| Page background light/dark | `custom.js` "Page background", CSS `.jcd-dark-canvas` |
| Footer | removed on every page (`#SITE_FOOTER { display: none }`) |
| Design studies (not deployed) | `preview/testimonials-ui.html`; device preview `preview/devices.html` |
