# Design system 設計系統 — joel-chang-design.com

The visual rules Joel has set for this site. **Anyone (person or AI) changing the look follows this file and updates it
when Joel changes a rule.** Layout numbers live in `site/assets/js/jcd-config.js`; colours and other values in
`src/css/` (tokens in `src/css/global/tokens.css`); behaviour in `src/js/` — one file per effect, built into
`custom.css` / `custom.js` by `tools/build_assets.py`. Why each rule exists: `CHANGELOG.md`.

Joel 為這個網站定下的視覺規則。**任何人（或 AI）改外觀都要照這份文件做，Joel 改規則時也要同步更新這裡。**
版面數字在 `site/assets/js/jcd-config.js`；顏色等數值在 `src/css/`（顏色變數在 `src/css/global/tokens.css`）；互動行為在
`src/js/`，一個效果一個檔，由 `tools/build_assets.py` 組合成 custom.css / custom.js。每條規則的來由寫在 `CHANGELOG.md`。

Last updated 最後更新: 2026-11-28.

---

## 0. One place for each number 一個數字只放一個地方

| What 什麼 | Where 在哪 | Changes 會影響 |
|---|---|---|
| Overall size of the desktop page (computer + iPad) 電腦版與 iPad 整體大小 | `jcd-config.js` → `uiScale` (0.85) | every desktop page on computers and iPads 所有電腦、iPad 頁面 |
| Monitor base width 電腦螢幕基準寬度 | `jcd-config.js` → `desktopRef` (1536) | how wide screens zoom 大螢幕的放大倍率 |
| **iPad side margins** **iPad 左右留白** | `jcd-config.js` → `ipad.margin.landscape / portrait` (5.35%) | iPad layout width of every page, and `preview/devices.html` iPad 各頁排版寬度＋三平台預覽 |
| iPad content widths per page type 各類頁面的內容寬度 | `jcd-config.js` → `ipad.content` | same 同上 |
| About "What I Believe" photo framing (phone, iPad portrait/landscape) 照片取景 | `jcd-config.js` → `believe` (set with `preview/mockups/believe-align.html`) | where the speaker sits in the photo window; re-computed from the real window size, so it holds when the page changes 講者在視窗中的位置，依實際視窗重算 |
| Photo framing in cards (T. Xcalar …) 卡片照片取景 | `jcd-config.js` → `photoFrames` (set with `preview/mockups/photo-align.html`) | which part of the photo shows + zoom, same on every device 照片顯示位置與放大，三平台共用 |
| Brand colours 品牌色 | `src/css/global/tokens.css` `--jcd-blue`, `--jcd-navy` | every blue on the site 全站所有藍色 |

Never write one of these numbers a second time in another file; read it from the config / token instead.
這些數字不要在別的檔案再寫一次，要用的時候讀設定檔或 CSS 變數。

## 1. Colour 顏色

| Token | Value 值 | Use 用途 |
|---|---|---|
| `--jcd-blue` / `--jcd-blue-rgb` | **#0062D9** · rgb(0, 98, 217) | The one interactive blue: menu hover/press, every pressed state that turns blue, icon hover, glows, round >> fill, Contact underline. 唯一的互動藍：選單滑過／按下、所有按下變藍、圖示滑過、光暈、圓形 >> 填色、Contact 底線 |
| `--jcd-navy` / `--jcd-navy-rgb` | **#00176C** · rgb(0, 23, 108) | Second colour of gradients (recommendation glow, avatar). 漸層的第二色（推薦卡光暈、頭像） |
| Black 黑 | #000 | Page canvas, dark pages (`.jcd-dark-canvas`). 頁面底色、深色頁 |
| White page 白底頁 — **never change 不可更改** | #fff | **WHITE PAGES STAY WHITE** (checked by `tools/check_site.py`, AGENTS rule 9): light pages keep Wix's white background (Wi-Fi 7 HGU/AP, MoAI, Extender, 2022, Airgain, Lionic, AI Tool Kit, NLG MMA200, Sagittarius, Assistive) — never paint black. 淺色頁保留白底，不可改黑 |
| Text on dark 深底文字 | #fff headings · rgba(255,255,255,.82–.9) body · .5 secondary · .38 tertiary | 標題白、內文 82–90%、次要 50%、第三層 38% |
| `--jcd-blue-text-dark` | **#4F86CC** | Small blue TEXT on black pages (section labels such as "Key Ingredient"), 5.6:1. 黑底頁上的小藍字（段落標籤），對比 5.6:1 |

Rules 規則
- Use the tokens, never a hex blue: `color: var(--jcd-blue)`, `rgba(var(--jcd-blue-rgb), .45)`. 一律用變數，不可直接寫藍色色碼。
- A glow keeps its own alpha; only the colour comes from the token. 光暈的透明度自己訂，顏色用變數。
- On black, navy is very dark: use it at .85+ or as a gradient end next to blue. 黑底上深藍要用高透明度或當漸層尾端。
- **Readable text (Joel 2026-11-27, UI/UX review)**: small text needs **4.5:1** against its background, large (18px+) or bold text 3:1. On black: white .5 = 5.3:1 is the lowest grey for small text (the old .38 = 3.4:1 is only for large text); `--jcd-blue` #0062D9 is 2.75:1 on black, so it is never used for small text there (use `--jcd-blue-text-dark`). Wix's #37659D labels are swapped on dark pages by `text-contrast.css`. 文字對比：小字至少 4.5:1；黑底上灰字最低白 50%；#0062D9 在黑底只有 2.75:1，黑底小藍字改用 --jcd-blue-text-dark。

## 2. Surfaces: frosted glass 表面：毛玻璃

| Component 元件 | Fill 填色 | Blur 模糊 | Edge 邊框 | Radius 圓角 | Shadow 陰影 |
|---|---|---|---|---|---|
| Recommendation card (About) 推薦卡 | rgba(255,255,255,.035); hover .055 | `blur(22px) saturate(150%)` | 1px rgba(255,255,255,.09); hover .2 | **6px** | 0 12px 40px rgba(0,0,0,.35) |
| Works dropdown 下拉選單 | rgba(18,20,26,.42) | `blur(20px) saturate(150%)` | 1px rgba(255,255,255,.16) | **8px** | 0 10px 30px rgba(0,0,0,.3) |
| Phone full-screen menu 手機全螢幕選單 | rgba(8,9,12,.55) | `blur(22px) saturate(140%)` | — | — | — |

Radius scale 圓角級距: 2px hairline 細節 · 4px small tiles/icons 小圖示 · **6px cards 卡片** · 8px floating panels 浮動面板. Joel: "not too round 不要太圓".
Radii are layout px, so they scale with the page. 圓角是版面 px，會跟著頁面縮放。

## 3. Typography 字體（Poppins, Wix font files in `site/assets/fonts/`）

| Weight 字重 | CSS font-family |
|---|---|
| Light | `wfont_459113_ebfb1394532347b3b7691d160bb35bd1, wf_ebfb1394532347b3b7691d160, orig_poppins_light` |
| Regular | `wfont_3f090f_d2b74fa2704044fa98373433c883f8ed, wf_d2b74fa2704044fa98373433c, orig_poppins_regular` |
| Medium | `wfont_3f090f_fbe2048d9f994d8c8d5073ed8164a33e, wf_fbe2048d9f994d8c8d5073ed8, orig_poppins_medium` |
| SemiBold | `wfont_459113_5846594cb6ea4f43b8e132f9d1a29629, wf_5846594cb6ea4f43b8e132f9d, orig_poppins_semibold` |

Sizes (layout px; desktop page / phone 320px page) 字級（版面 px；電腦頁／手機 320px 頁）:
- Recommendation card 推薦卡: featured 17 / 8.5, text 14 / 8, name SemiBold 15 / 9.5, role Light 11.5 / 6.5. A card is never louder than its section heading. 卡片不可比段落標題搶眼。
- Phone menu 手機選單: Works / About / Contact SemiBold; product pages Light **13px**.
- **Phone text minimum (Joel 2026-11-27, UI/UX review; Apple: 11pt minimum)**: paragraphs **10px**, short labels **9px** in the 320px layout (≈12pt / 11pt on a 390px iPhone; Joel: one step smaller than the first 11 / 9.5), `jcd-config.js` `phone.minText` / `minLabel`, on the work and category pages paragraphs are **8px** (`phone.subText`, Joel: "子頁的內文小字都要縮小成 9px", then "內文改 8px 好了"; home, About, Contact keep 10px); applied by `phone-text-size.js`: smaller Wix text is raised, a word never breaks, text never grows into another item, sections keep their space below. About's two-column lists (Work Experience, Education, Languages, Awards, Patents) are real rows on the phone so dates and titles stay level; About's grey light lines use the label size (9px), a step below the white text. Product info table (Client / Year / Designer / Contribution) on the phone: 2 × 2 grid at the page's 20px margins, label and content 9px, content grey rgba(255,255,255,.6), at least 28px of the black box below it. 手機最小字級：段落 10px、短標籤 9px；作品頁與類別頁內文 8px；不會斷字、不會壓到其他物件；About 的雙欄清單在手機改成真正的列，日期與標題對齊；About 灰色細字 9px（比白字小一級）。手機產品資訊表 2×2、9px、內容灰色、下方至少留 28px 黑底。
- **Cards and category title bars: one set of sizes (Joel 2026-11-27: "這些都要成為統一數據")** — only in `src/css/global/tokens.css`, never per page: `--jcd-card-name` / `--jcd-card-brand` (name and the small line above it on every photo card: home Works grid, category cards), `--jcd-card-go-font` (the ">>"), `--jcd-card-edge` (distance of name and ">>" from the card's corner), `--jcd-bar-title` / `--jcd-bar-sub` (category title bar). Set by Joel with `preview/mockups/go-size.html`, then smaller on the phone and iPad: phone 12.5 / 9 / 14 / 9px, iPad 16 / 11 / 21 / 12px, computer 21 / 11.5 / 23 / 14px; bars phone 10 / 7 (description 8 → 7px, Joel 2026-11-28: "我把小字改成 7px 了，手機板規範要改"; the phone label minimum does not apply to the bars), iPad + computer 30 / 17. The ">>" is plain Poppins Medium text (no circle, no frame: "方正瑞士國際風格"); hovered / pressed card: --jcd-blue and 3px to the right. 卡片字級、>>、離角落距離只在 tokens.css 設定；手機類別標題列：左標題 10px、右側說明 7px（不受手機最小字級限制）；>> 為無框 Poppins Medium 文字；Wix 原本的 >> 全站隱藏。
- **Phone heading scale (Joel 2026-11-27: "全面檢視手機版的排版，一團亂")**: work pages — page title 20px, section headings 12px (`jcd-config.js` `phone.scale`: Wix sizes 17–24px → 20, 12.5–17px → 12; larger display type is left alone); category pages — page title 21px (`phone.catScale`). With body 8px, labels 9px and the tagline under the title 10px this is the whole phone type scale of the work pages. 手機字級階層：作品頁大標題 20、章節標題 12、副標 10、標籤 9、內文 8；類別頁標題 21。
- **Phone layout by Joel**: per-page moves / widths / section spaces live only in `jcd-config.js` `phone.layout`, set with `preview/mockups/phone-layout.html` (README §3.5); applied values are snapped to the 20px edges, the centre line or a neighbour's edge, and every section keeps at least 20px under its last item. 手機排版微調只存在 jcd-config.js phone.layout，並對齊 20px 邊界、中線或相鄰項目，段落下方至少 20px。
- **Phone text beside photos (Joel 2026-11-27)**: a short title is as wide as the paragraph under it (no needless line break); left-aligned text keeps at least 12px from a photo beside it (text more than a third over a photo is a deliberate overlay and stays) — `phone-layout-tidy.js`. 手機：標題與下方內文同寬；文字與旁邊照片至少留 12px。
- **Equal side margins (Joel 2026-11-27)**: on the desktop layout (computer + iPad) content never reaches closer to the right edge than the page's left text edge is to the left one; About's cards and Expertise columns are pulled in to match (`even-margins-desktop.js`). 左右留白相等：內容右側不可比左側留白窄。
- End-to-End squares 方塊文字: computer/iPad title 40px, text 19px; phone 14 / 10px (phone text cut after 7 lines).
- Quote mark 引號: Georgia, white 85% → `--jcd-blue` on hover/press.

Copy 文案:
- Product names exactly as on the product page: `T. Interceptor MP`, `T. Blade` (dot + space). 產品名稱寫法統一（點後空一格）。
- A space before an opening bracket: `Marcus Kung (Design Director)`. 左括號前空一格。
- Image alt text is clean English describing the image, never a file name; decorative images get `alt=""`. `tools/clean_text.py` fixes leftovers. 圖片替代文字用英文描述，不可是檔名；純裝飾圖留空。
- Headings (`h1`–`h3`) are real headings only, never decorative text. 標題標籤只給真正的標題，裝飾字不可用 H1。

## 4. Spacing & side margins 間距與左右留白

**Side margins by platform 各平台左右留白（rule 規則）**

| Platform 平台 | Rule 規則 | Set in 設定位置 |
|---|---|---|
| iPad landscape iPad 橫 | content keeps **5.35%** of the screen width free at each side 內容兩側各留螢幕寬度 5.35% | `jcd-config.js` `ipad.margin.landscape` |
| iPad portrait iPad 直 | **5.35%** each side 兩側各 5.35% | `jcd-config.js` `ipad.margin.portrait` |
| Phone 手機 | **20px** each side in the 320px layout (6.25%) 320px 版面兩側各 20px | Wix mobile layout (per element) Wix 手機排版 |
| Computer 電腦 | page always fills the window (zoom); Wix layout centres content 永遠滿版，內容置中 | `jcd-config.js` `desktopRef`, `uiScale` |

How the iPad rule works 運作方式: iPad layout width = `content ÷ (1 − 2 × margin)`; content = product 1284 (category frames),
about 1211 (text + portrait), home 1179 (home, Contact, 1-4 — Joel wanted these larger). Today: product pages 1438,
About 1356, home/Contact 1320. To give every iPad page more air, raise `margin`; to make one page type larger, lower its
`content`. Never let the layout drop below ~1310 (the category frames would touch the edges).
iPad 排版寬度 = 內容寬 ÷ (1 − 2 × 留白)。要每頁都更空就加大 margin；只想放大某類頁面就調小它的 content。排版寬度不要低於約 1310。

About page headings 關於頁標題（`custom.js` "About page: one spacing rule"）:

| | Main heading above 主標上方 | Side heading above 側標上方 | Heading → content 標題到內容 | Left edge 左緣 |
|---|---|---|---|---|
| Desktop / iPad 電腦／iPad | 98px | 60px | 41px | = WORK EXPERIENCE content |
| Phone 手機 | 48px | 28px | 12px | 20px |

Other rules 其他:
- Category pages: frames and unframed rows share one left edge, centred. 類別頁白框與無框列同一左緣、置中。
- About intro: text + portrait centred between header and screen bottom, 56–260px below the header. About 開頭在 header 與螢幕底之間置中。
- Catalog title bars: text centred vertically; **one bar for every category page** (Joel 2026-11-28: "文字框高度，各文字的對齊／同類別尺寸都要一致"): bar height phone 25px / computer + iPad 68.5px, title 10px (phone) / 15px from the frame's left edge, description 10px / 20px from its right edge, sizes from tokens.css (phone 10 / 7px, computer + iPad 30 / 17px). Numbers in `jcd-config.js` `catalogBars`, applied by `catalog-title-bars.js`. 標題列文字垂直置中；所有類別頁同一規格：標題列高度手機 25px、電腦與 iPad 68.5px；左標題距框手機 10px／電腦 15px，右說明距框 10px／20px；數字在 jcd-config.js catalogBars。
- Phone category pages: frames 8px apart, 48px before the next category. 手機類別頁框距 8px、類別間 48px。
- Contact fields: 1px white underline (hover/typing `--jcd-blue`), 12px indent; names Medium (phone 11 / desktop 15px); hint Light 45%. Contact 欄位規格。

## 5. Devices & scaling 裝置與縮放（Joel's rule: phone, iPad and computer are always fixed together 三平台一起修）

| Device 裝置 | Page 頁面 | How it fits 如何適配 |
|---|---|---|
| Phone 手機 | `site/m/…` (320px layout) | viewport width=320, scaled to the phone 縮放到手機寬 |
| iPad (Air 11, Pro 11, Pro 13) | desktop page 電腦版頁 | laid out at the width `jcd-config.js` gives (side-margin rule above), scaled; upright the header logo/menu are 1.3x (`.jcd-tab-portrait`) 依留白規則排版再縮放；直放時 logo 與選單 1.3 倍 |
| Computer ≤ 1536px 電腦 | desktop page | zoom = `uiScale` 0.85 |
| Computer > 1536px (1920, 2560, 3440, 3840) | desktop page | CSS zoom = width / `desktopRef` × `uiScale` (`window.__jcdZoom`) → always full width 永遠滿版 |

- Scripts measuring with `getBoundingClientRect` divide by `window.__jcdZoom` before writing CSS px. 量位置的程式要除以 `__jcdZoom`。
- Top image 首圖: phone 50% of screen height; portrait screens 50%; landscape exactly one screen (`100svh`). 手機與直向半個螢幕高、橫向剛好一個螢幕。
- About "What I Believe" photo: framed by `jcd-config.js` `believe` (Joel aligned it by hand). Phone: the photo window is the section itself; iPad upright: 37% of the screen; computer: whole photo, centred. To re-align: open `preview/mockups/believe-align.html`, drag / zoom, save, copy the values into `jcd-config.js`. 照片取景由設定檔決定；要重新對齊就打開對齊工具。
- Background photos are pinned to their section, never `overflow: clip/hidden` on a Wix `bgMedia_*` outside its section. 背景圖固定在所屬段落。
- Closing photo of product pages: CSS-sticky scroll reveal (`.jcd-reveal`), full original photo. 產品頁最後一張圖：捲動揭幕（CSS sticky）。
- Home slideshow always starts at slide 1, and shows no "1/10" counter. 首頁輪播每次從第一張開始，不顯示「1/10」張數。
- Images 圖片: `site/assets/media/<page>/<page>-<nn>-<w>x<h>.jpg` from `media-originals/`, WebP q86 (top images q90, max 3200px), transparency kept; no PNG; JPEG only as the social-preview copy; phone copies max 2400 (top) / 1440; `loading="lazy"` below the first section. 命名、品質、手機版尺寸、延遲載入規則。

## 6. Interaction states 互動狀態

| State 狀態 | Rule 規則 |
|---|---|
| Hover (mouse) 滑過 | Menu text → blue; icons cross-fade to blue; cards lift 4px; .35s `cubic-bezier(.2,.7,.2,1)`. 選單變藍、卡片上浮 4px |
| Press (all) 按下 | Text → blue + `scale(.92)` in .12s; cards `scale(.99)`. 文字變藍並微縮 |
| Tap area (phone) 觸控範圍 | Every link / button can be pressed from at least **44 × 44** (Apple 44pt); small controls get an invisible area around them (`phone-tap-targets.js`), never reaching into a neighbour. 每個連結與按鈕至少 44×44 可按（隱形範圍，不影響外觀）。 |
| Touch 觸控 | Every hover effect also on press (`:active`); **one tap opens a link** (custom.js opens it at touchend; the top menu keeps its own behaviour). 滑過效果在按住時出現；**點一下就換頁** |
| Linked category cards 有連結的類別卡 | Whole card is clickable (photo included) on every platform; photo zooms 1.06 inside its frame on hover/press; round frosted >> (40px) on hover (computer) / always (touch). 整張卡可點；照片在框內放大 1.06；圓形 >> |
| Cards that are not links 無連結卡片 | Subtle hover only, default cursor, no >>. 只有低調滑過 |
| Round >> 圓形 >> | Fills blue left → right (.9s) while hovered / pressed; click opens at once. 滑過／按住時由左到右填藍 |
| Home category words 首頁類別字 | Computer/iPad: scale 1.05 on hover, pressed = blue, no fill. Phone: grey press fill. |
| Home Selected grid 精選 12 格 | Spotlight: hovered tile bright + photo 1.06 + white line + name + >>; others brightness .38. Touch: name + >> always. Round >> 26px computer / 34px iPad / 22px phone 圓圈尺寸. |
| Home client logos 首頁合作品牌 logo | Marquee: 3 rows on every device in the wall's box, alternate directions, ends faded, ~20 px/s (phone 14) + faster while scrolling; mouse over a row = pause (hovered logo brighter); drag / fling sideways (touch-action pan-y); every tile gap equal; reduced motion = still image (`home/logo-marquee`). 跑馬燈：三平台 3 排、交錯流動、兩端淡出；捲動加快；滑鼠停留暫停；可左右拖動；減少動態時靜止 |
| About portrait 大頭照 | Black-and-white; hover (computer) / press-and-hold (touch) shows the colour photo. 黑白，滑過或按住變彩色 |
| Selection / context menu 選字與右鍵 | Disabled site-wide (form fields excepted). 全站禁止（表單除外） |
| Tooltips 提示框 | None: no `title` attributes (no file names on hover). 不顯示任何 title |
| Reduced motion 減少動態 | Every looping/moving effect off under `prefers-reduced-motion`. |

## 7. Motion 動態

- **Scroll reveal (every page)**: in every section except the first and a bottom image section, each piece of content fades with the scroll position (opacity only, no movement): invisible while its top is at the bottom edge of the screen, fully visible when it reaches the middle, and it fades out again when scrolling back up. Timing in `jcd-config.js` `scrollReveal`, tuned with `preview/mockups/scroll-fade.html`. Near the page end, where content can't reach the middle, it is fully visible at the last scroll position. 捲動顯現：每段內容隨捲動位置淡入（不移動），頂端在畫面底部時看不見、到畫面中央時完全顯現，往上捲會再淡出（首段與最下方大圖除外）。
- Recommendation card hover: two corner glows drifting, 5s. 推薦卡角落光暈飄移。
- No cursor light: the mouse glow was removed (Joel 2026-11-27, "取消滑鼠光標"). 沒有滑鼠光暈（已取消）。
- GET IN TOUCH: breathing scale 1 → 1.045, 2.8s. 呼吸縮放。
- Ocean Series creatures: dimmed 35% at rest; hover/tap = bright + zoom 1.1 inside the frame. 海洋系列小圖。
- 3D tilt (`tilt.js`, max 3°): About portrait only. 3D 傾斜只給大頭照。
- Video glow (home + Interstellar 05 closing video): breathing 4.5s, frame image dims in step. 影片光暈呼吸（首頁、Interstellar）。
- About signature: left-to-right reveal on scroll-in, 1.6s. 簽名由左到右顯現。
- Achievements numbers: odometer roll, 1.8s. 數字滾動。
- Achievement map: dots breathe, light runs each line into its flag; computer hover enlarges that country's products. 地圖光點與光流。
- End-to-End squares: on hover (touch: while the overlay shows) one dark layer fades to 36% (touch 60%) in .7s and the photo eases in 8% (1.2s). End-to-End 方塊：壓黑淡入、照片放大 8%。
- End-to-End slider: no arrows on any platform. The next square is cut at the edge (phone: by the screen, squares 218px; computer: at the content margin; iPad: by the screen) with a soft fade to black there, and at the left edge while a square is cut there; the row nudges left once when it comes into view (not with reduced motion) and always comes to rest with a square at its start. Computer: drag with the mouse. End-to-End 輪播：全平台不用箭頭，靠下一張被切到＋邊緣漸暗＋進入畫面時晃一下提示可左滑；左邊有方塊被切到時也漸暗；停下時對齊方塊；電腦可用滑鼠拖曳。

## 8. Components: where they live 元件位置

| Component 元件 | Code 程式 |
|---|---|
| Layout numbers 版面數字 | `site/assets/js/jcd-config.js` |
| Device detection, iPad viewport, monitor zoom, slideshow 裝置判斷、iPad 視窗、螢幕縮放、輪播 | `site/assets/js/site.js` |
| All effects, one file each 所有效果（一個效果一個檔） | `src/css/<area>/`, `src/js/<area>/` (list: `src/README.md`), built into `custom.css` / `custom.js` |
| Wix-replacement CSS fixes 取代 Wix 的修正 | `site/assets/css/static-overrides.css` |
| About portrait tilt 大頭照傾斜 | `site/assets/js/tilt.js` |
| Recommendation cards 推薦卡 | `src/js/about/recommendation-cards.js`, `src/css/about/recommendation-cards.css` |
| Guest Area dialog (T. Scope, Defense) 訪客區視窗 | `src/js/product/guest-area-dialog.js`, `src/css/product/guest-area-dialog.css`: dark glass panel 8px, round blue lock icon, Poppins 22/14px (phone 14/9.5), outline button → blue; replaces the separate Wix password page |
| Black product page template (T. Scope) 黑底產品子頁範本 | `site/assets/css/product-page.css` (blocks .pp-hero, .pp-title, .pp-info, .pp-text, .pp-frame, .pp-pair, .pp-features, .pp-closing), one responsive page; content 5.35% from the edges; password gate in the Guest Area style |
| Footer 頁尾 | removed on every page (`#SITE_FOOTER { display: none }`) |
| Three-device preview 三平台預覽 | `preview/devices.html`; design studies 設計提案 `preview/mockups/` |
