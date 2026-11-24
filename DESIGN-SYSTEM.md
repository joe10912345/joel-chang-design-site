# Design system — joel-chang-design.com

The visual rules Joel has set for this site. **Any person or AI changing the look must follow this file and update it
when Joel changes a rule.** Values are implemented in `site/assets/css/custom.css` (tokens at the very top) and
`site/assets/js/custom.js`. History of each decision: `CHANGELOG.md`.

Last updated: 2026-11-24.

---

## 1. Colour

| Token | Value | Use |
|---|---|---|
| `--jcd-blue` / `--jcd-blue-rgb` | **#0062D9** · rgb(0, 98, 217) | The one interactive blue: top-menu hover and press, dropdown press, phone-menu press, logo + LinkedIn/Behance icon hover, **every pressed state that turns blue**, cursor light, hover glows (Design Approach cards, Cross-Category tiles), recommendation quote mark + LinkedIn tile + top-left glow, Contact "sent" tick |
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
- Recommendation card: featured text 17 / 11, text 14 / 10 (line-height 1.6–1.65), name SemiBold 15 / 11.5, role Light 11.5 / 8.5.
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
- Category card frames (desktop/iPad): centred, equal space left/right (`custom.js` "Category pages").
- Catalog title bars: every text centred vertically on the bar (`custom.js` "Catalog title bars").
- Content never touches the screen edge on iPad (that is why the iPad layout is 1440px wide).

## 5. Devices & scaling (Joel's rule: phone, iPad and computer are always fixed together)

| Device | Page | How it fits |
|---|---|---|
| Phone | `site/m/…` (320px layout) | scaled to the phone width by the viewport |
| iPad (Air 11, Pro 11, Pro 13; portrait + landscape) | desktop page | laid out **1440px** wide (`TABLET_W` in `site.js`) and scaled |
| Computer ≤ 1536px | desktop page | 1:1 (Joel's laptop: 1920 @125% = 1536) |
| Computer > 1536px (1920, 2560, 3440 ultra-wide, 3840 4K) | desktop page | CSS zoom = width / 1536 (`window.__jcdZoom`) → always full width |

Top image ("hero", home slideshow + product pages): phone **50% of the screen height**; iPad landscape and computers **exactly one screen** (`100svh`, divided by `__jcdZoom` on computers); iPad portrait keeps the Wix height.
Scripts measuring with `getBoundingClientRect` must divide by `window.__jcdZoom` before writing CSS px.

## 6. Interaction states

| State | Rule |
|---|---|
| Hover (mouse) | Menu text → `--jcd-blue`; icons/logo cross-fade to a blue copy; cards lift `translateY(-4px)`; ease .35s `cubic-bezier(.2,.7,.2,1)` |
| Press (all platforms) | Text → `--jcd-blue` + small press-in `scale(.92)` in .12s (menus, dropdown items, phone menu, menu icons); cards `scale(.99)` |
| Touch | Every hover effect also on tap/press (`:hover` sticks after a tap, `:active` while pressed); iOS needs the touchstart listener in `custom.js` |
| Labels that are not buttons | No frame, no hover, no click (home "Selected") |
| Reduced motion | Every looping or moving effect is switched off under `prefers-reduced-motion: reduce` |

## 7. Motion

- Recommendation card hover: two corner glows (blue top-left 300×200px, navy bottom-right), drifting 70px/22px along the edge, 5s alternate; centre stays black.
- GET IN TOUCH (home): endless "balloon" breathing, scale 1 → 1.045 → 1, 2.8s; pauses on hover/press.
- Ocean Series creature photos: dimmed 35% at rest; hover/tap = full brightness + the photo zooms 1.1 **inside its frame** (never covers text).
- Category cards (desktop): 3D tilt following the mouse (`tilt.js`), max 3°.

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
