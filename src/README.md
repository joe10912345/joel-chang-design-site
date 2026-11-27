# src/ — the site's own CSS and JS, one file per effect 網站自訂樣式與程式（一個效果一個檔）

**Edit here, never in `site/assets/css/custom.css` or `site/assets/js/custom.js`** — those two are built from this folder.
**請改這裡，不要直接改 `custom.css` / `custom.js`**，那兩個檔是由這裡自動組合出來的。

```
python tools/build_assets.py           # build both files + bump ?v= in every page 組合並更新所有頁面的 ?v=
python tools/build_assets.py --check   # are they up to date? 是否需要重建
```

- `css/<area>/<effect>.css`, `js/<area>/<effect>.js`: one effect each, starting with a comment that says what Joel asked
  for and when. 每個檔一個效果，開頭註解寫明 Joel 的需求與日期。
- `css/ORDER.txt`, `js/ORDER.txt`: the order the files are joined in. **CSS order matters** (a later rule wins over an
  earlier one of the same strength), so a new file goes at the end unless it must sit elsewhere. A file not listed stops
  the build. 合併順序。CSS 順序有影響（後面的優先），新檔放最後；沒列進來的檔案會讓建置停止。
- JS pieces run inside one wrapper that provides `ready(fn)` (runs `fn` once the page HTML is ready); each piece is
  `ready(function () { ... });` or listens to `load`. JS 每段都包在提供 `ready()` 的外框裡。
- Some effects have a CSS part and a JS part with the same name (e.g. `home/selected-grid`). 部分效果的 CSS 與 JS 同名成對。
- Layout numbers (scale, iPad margins) are NOT here: `site/assets/js/jcd-config.js`. 版面數字不在這裡，在 jcd-config.js。

Areas 分區: `global` = every page 全站 · `home` = home 首頁 · `about` = About · `category` = category pages 類別頁 · `product` = product pages 產品頁 · `contact` = Contact · `phone` = phone pages only 只限手機頁

## CSS

| area 分區 | files (in build order) 檔案（依合併順序） |
|---|---|
| `global` | `font-fallback.css`, `tokens.css`, `text-contrast.css`, `base.css`, `menu-hover.css`, `header-autohide.css`, `gallery-overlays.css`, `lightbox.css`, `hidden-h1.css`, `header-icons-hover.css`, `no-footer.css`, `no-section-lines.css`, `menu-press.css`, `page-background.css`, `glass-menus.css`, `header-no-select.css`, `no-selection.css`, `ipad-portrait-header.css`, `round-go-fill.css`, `scroll-reveal.css` |
| `home` | `design-approach-cards.css`, `cross-category-grid.css`, `works-grid-links.css`, `video-frame.css`, `works-category-buttons.css`, `end-to-end-text.css`, `selected-label.css`, `get-in-touch-breathing.css`, `works-grid-press.css`, `achievement-map.css`, `selected-grid.css`, `achievement-odometer.css`, `works-category-hover.css`, `design-approach-card1.css`, `video-glow.css`, `end-to-end-hint.css`, `hero-no-counter.css`, `end-to-end-hover.css` |
| `contact` | `form-status.css`, `field-colours.css`, `fields.css` |
| `phone` | `mobile-fixes.css`, `menu-social.css`, `menu-layout.css`, `tap-targets.css` |
| `product` | `info-table-phone.css`, `ocean-series-creatures.css`, `ocean-series-seams.css`, `defense-guardian-no-go.css`, `guest-area-dialog.css`, `defense-website.css`, `ai-tool-kit-paravents.css`, `t-interceptormp-award.css`, `t-blade-stowage.css` |
| `about` | `portrait-frame.css`, `believe-phone-text.css`, `recommendation-cards.css`, `grid-rows.css`, `signature-reveal.css`, `portrait-swap.css`, `present-glow.css`, `two-column-lists-phone.css` |
| `category` | `cards-linked.css`, `cards-ipad-sizes.css`, `go-hover-computer.css`, `cards-photo-zoom.css`, `cards-clickable.css` |

## JS

| area 分區 | files (in build order) 檔案（依合併順序） |
|---|---|
| `global` | `wix-fixed-backgrounds.js`, `phone-layout-tidy.js`, `phone-text-size.js`, `phone-tap-targets.js`, `lightbox.js`, `header-autohide.js`, `phone-menu-social.js`, `hero-height.js`, `page-background.js`, `header-no-drag.js`, `no-context-menu.js`, `no-tooltips.js`, `one-tap-links.js`, `photo-frames.js`, `scroll-reveal.js`, `ios-active.js` |
| `product` | `info-table-phone.js`, `closing-photo-reveal.js`, `guest-area-dialog.js`, `defense-website.js`, `t-blade-last-photo.js` |
| `home` | `design-approach-cards.js`, `cross-category-grid.js`, `video-frame.js`, `achievement-map.js`, `selected-grid.js`, `achievement-odometer.js`, `end-to-end-slider.js`, `end-to-end-hint.js` |
| `contact` | `contact-form.js`, `iphone-no-zoom.js` |
| `category` | `catalog-title-bars.js`, `frames-desktop.js`, `spacing-phone.js`, `bottom-space.js`, `cards-touch.js` |
| `about` | `intro-layout-desktop.js`, `even-margins-desktop.js`, `recommendation-cards.js`, `heading-spacing.js`, `believe-centre.js`, `believe-reveal.js`, `signature-reveal.js`, `portrait-swap.js`, `two-column-lists-phone.js` |

