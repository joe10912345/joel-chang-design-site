# Changelog 更新紀錄

Every change to the site, newest first. **Any person or AI that edits this repo adds an entry here in the same change,
in English and Chinese.** Format: date (UTC+8) — what changed (in Joel's words where possible) — files touched. Open items
go in `TODO.md`. Entries before 2026-11-27 (structure clean-up) are English only.

網站的每一次修改，新的在最上面。**任何人或 AI 修改時都要在同一次變更中加一則紀錄，中英對照。** 格式：日期（UTC+8）
— 改了什麼（盡量用 Joel 的話）— 動到哪些檔案。待辦放 `TODO.md`。2026-11-27 結構整理之前的紀錄只有英文。

---

## 2026-11-28

### Phone About Expertise: room around the rules 手機 About Expertise 分隔線上下留白
- Joel: "距離太近了，能不能有呼吸的空間". The Engineering and Branding groups moved down 26px each (`jcd-config.js`
  `phone.layout.about`, `gap`), so each rule now has 20px above and below (was about 7px); the rules are placed again after
  the phone layout runs. No overlaps.
- 手機 About Expertise 的 Engineering、Branding 各往下移，分隔線上下各留 20px。

### About Expertise dividers 關於頁 Expertise 分隔線
- Joel: "電腦版的 about 技能的襯線出問題了！" / "ipad 版". The divider between Engineering and Branding lay flat across "Product
  Design Strategy": `even-margins-desktop.js` nudged it with `transform: translateX(…)`, which replaced the rotation that
  turns the Wix line upright (it only kicked in once the Branding text grew, "Design Guidelines · System"). It now uses the
  separate `translate` property, so the line stays upright and sits between the two columns (computer 1536 / 1920, iPad).
- Joel: "手機板的 engineering 上、Branding 上也要加入襯線". New thin rules above "Engineering" and "Branding" on the phone, the same
  1px grey (#7b7b7b) as the computer dividers, across the content width, halfway between the groups
  (`src/js/about/expertise-rules-phone.js`, `src/css/about/expertise-rules-phone.css`).
- 電腦與 iPad 版 Expertise 第二條直線被轉成橫線壓在文字上，已修正；手機版 Engineering、Branding 上方新增細線。

### Phone Wi-Fi 7 HGU/AP by Joel; final hand-over check 手機 Wi-Fi 7 HGU/AP（Joel 排版）；交接前總檢查
- Joel: "wifi 7 ap 手機板我有修改排版，請更新". His saved values in `jcd-config.js` `phone.layout['wi-fi7-hgu-ap']` (one photo
  moved, three photos a little larger); snapped: `comp-m5t5qc84` to the 20px right edge (was 13px). Two product photos run
  past the screen edge on purpose (clipped by the page, no sideways scroll). No text overlaps, nothing off screen.
- Joel: "完工！最終確認設計是否部屬正確，資料夾都有清乾淨、檔名都沒亂碼正確，資料結構清楚，架構 md 等都有正確。未來讓其他人能直接接手。"
  - Deployment: the live site serves the same `custom.js` / `jcd-config.js` / `site.js` versions as `main` (computer and
    phone pages); the GitHub Pages workflow succeeded for every recent commit.
  - Files: every tracked file name is plain ASCII, no stray copies or temp files; `media-new/` holds only its README;
    `private/` and the unused Wix media stay git-ignored.
  - Docs brought up to date: `tools/README.md` (check_site, image tools, protected-page tools; scrub_ai is local only),
    `preview/README.md` (Joel's tuning tools in `mockups/`), `src/README.md` (`frame-line.css`), `README.md` (CLAUDE.md),
    `TODO.md` (domain already on GitHub Pages → only the Search Console step is left; share image exists; T. Scope content
    still placeholder; one broken Wix image left). Every `src/` file is in its ORDER.txt and its README.
- 套用 Joel 的 Wi-Fi 7 HGU/AP 手機排版（一張圖對齊右側 20px）。交接總檢查：線上版本與 main 一致、部署成功、檔名皆正常、資料夾乾淨；
  更新 tools／preview／src README、README、TODO。

### Home Works grid: mouse hover on phone and iPad too 首頁 12 張圖：手機與平板也有滑鼠 hover
- Joel: "手機板、平板的首頁 12 張圖，若我滑鼠 hover 後沒效果，但他們的類別頁 hover 有效果". The grid's spotlight (tile under the
  mouse bright and zoomed with its white line, the others dimmed) only listened to the mouse on the computer layout. It now
  follows a mouse or trackpad on every platform (pointer events, `pointerType === 'mouse'`); a finger never sets it, so
  nothing stays lit after a tap. The touch layout keeps its always-visible names. File: `src/js/home/selected-grid.js`.
- 首頁 12 張圖的滑鼠聚光效果，手機與平板版面也會跟著滑鼠或觸控板；手指觸控不會觸發。

### Phone Lifestyle: Drone photo fades in again 手機 Lifestyle：Drone 圖片恢復顯示
- Joel: "drone 圖片不見了". The scroll fade-in (`scroll-reveal.js`) used the top of each piece's own box. Lifestyle's Drone card
  was moved up into its frame by the phone layout, but its outer box stayed where Wix put it — below the end of the
  (now shorter) page — so it never reached the fade point and stayed invisible. Each piece now fades by the top of its
  highest visible part, measured again after the phone layout and after load (2.6s).
- 捲動淡入原本依照外框的位置判斷；Drone 卡片被移進白框後，外框還留在頁面底部以下，所以永遠不會淡入。改為依實際內容位置判斷。

### Phone Lifestyle: Drone card shown again 手機 Lifestyle：Drone 卡片恢復顯示
- Joel: "drone toy 有像沒有正確顯示". Lifestyle's section was set 185.6px shorter (the 54px group gaps) by cutting its bottom
  off, but as the page's last section `bottom-space.js` keeps it long, so the cut fell on the Drone card. `phone-layout.js`
  now never cuts a shortened section into its own visible content (it stops 1px under the lowest visible item; Wix's
  see-through overlays don't count). Checked every page with a shortened section: nothing cut off; MoAI's and the other
  pages' cuts unchanged where they only hid empty space.
- 手機 Lifestyle 最後一組 Drone 被段落裁切切掉；改為裁切不會切到段落內看得到的內容，所有頁面已檢查。

### Category pages: the same space under the last card 類別頁最後一張卡片下方空間一致
- Joel: "Yes, make it equal". Measured to the real end of the page (the earlier 20–135px came from the section boxes,
  not the page end): every page already had Joel's `categoryBottom` (phone 80px, computer + iPad 280px) except Electronics
  (phone 102 / computer 297.5px). Cause: `bottom-space.js` counted Wix's old see-through card overlay that hangs below the
  last card, and ran before the title bars' last layout. It now skips invisible items and measures again after 2.6s.
  Checked: phone 79.4–80.5px, computer 279.5–280.7px on all six pages.
- 類別頁最下方空白：除 Electronics 外原本就一致（手機 80px、電腦 280px）；修正 Electronics 多算了隱形的舊圖層，現在六頁都一樣。

### Phone category pages: 10px between the cards of a group 手機類別頁同組卡片間距 10px
- Joel: "Yes, make them 10px". Inside a group the cards were 8–15px apart (Networking, Defense, Electronics). Each card's box
  gets the difference as `gap` in `jcd-config.js` `phone.layout`; the group gaps were re-set to 54px with exact (decimal)
  values. Now every page: 10px between cards, 54px between groups (±0.6px, screen pixels), bars 25px with the cards flush,
  no overlaps.
- 手機類別頁同一組卡片之間統一 10px，各組之間 54px。

### Phone category pages: 54px between groups everywhere 手機類別頁各組間距統一 54px
- Joel: "這張圖上方與其他圖的空間好像沒有照規範" (Experimental, Assistive Devices). Measured the space above every group (title
  frame) on the phone: Experimental 14 / 10px, Defense 31 / 10px, Networking 52 / 50px, Lifestyle / Industrial 55px
  (the rule from Industrial / Lifestyle and Electronics: 54px). Each group's box now gets the difference as `gap` in
  `jcd-config.js` `phone.layout` (experimental, defense, networking, lifestyle, industrial); every group now starts 54px
  under the card above, title bars still 25px with the cards flush, no overlaps.
- 手機類別頁每一組上方的間距統一為 54px（Experimental、Defense、Networking、Lifestyle、Industrial）。

### Category frames white at rest on the computer 電腦版類別頁白框平常就顯示
- Joel: "桌機版的類別頁產品圖框始終都要顯示白色，你現在是 hover 才有白框". The new frame line sat on the card's ::after, which on
  the computer is the hover shade (static-overrides.css, opacity 0 until hover); ::before is the tilt sheen, and the
  photo's hover-zoom transform drew it over a border or outline. The line is now an element of its own on top of every
  frame (`.jcd-frame-line`, added by `frame-edges.js`, styled in `frame-line.css`), the same for cards, photos and title
  frames, phone + iPad + computer and in the phone layout tool. Checked: every frame drawn at rest.
- 電腦版類別頁的白框原本只在滑過時出現（被滑過陰影層蓋住）；改為獨立的白線元素疊在最上層，平常就顯示，各平台一致。

### Phone layout tool shows the title bars as the site does 排版工具裡的標題列與網站一致
- Joel (screenshots of the phone layout tool): "這些還有重疊的" — "這是截圖排版器的". In the tool the bar layout was switched off,
  so each frame showed Wix's raw edges next to its card (two lines a few px apart). `catalog-title-bars.js` now runs in
  the tool too and again after every change made there (`phone-layout.js` sends `jcd:phone-layout`), so the frames wrap
  their cards there as on the site (checked: 0px, also right after a change).
- 排版工具裡也套用標題列規則，白框貼齊卡片；每次在工具裡調整後也會即時重新貼齊。

### One white frame line; frames wrap their cards; Defense caption back; Design Approach shorter 白框粗細統一、框貼齊卡片、Defense 標題回來、Approach 方塊再縮
- Joel: "確認類別圖的白框都是一致的尺寸粗細". The title frames (an SVG outline) and the cards / photos (a Wix border) were
  1 / 0.67 / 1.33px on the phone and 2 / 1.57px on a computer. Now one token, `tokens.css` `--jcd-frame-line` (phone 1px,
  computer + iPad 1.5px), drawn the same way for all (an inside line above the photo; a border was snapped to whole
  screen pixels): new `src/css/category/frame-line.css`; `frame-edges.js` marks category pages (`jcd-catpage`) and hides
  the SVG's own outline.
- Joel: "圖 1-3 的內圖要跟外白框下緣對齊". The frame now wraps its card: top the bar height above it, bottom and sides on the
  card's edges (a frame around several photos keeps its own bottom). Checked on every bar, phone + computer: 0px.
- Joel: "圖 4 上面的 website 文字跟襯線消失了": Defense's "Company Website | Brand Visual Identity…" line lives just
  outside its photo, in the box the iPhone clip (cards-photo-zoom.css) was set on; only the frame itself is clipped now.
- Joel: "approach 的白色框高度可以再縮": phone Design Approach cards 176 → 159px (12px under the text, as above it).
- No overlaps, nothing off screen on the six category pages (phone + computer).
- 類別頁白框粗細統一（手機 1px、電腦與 iPad 1.5px）；白框上緣、下緣與左右都貼齊卡片；Defense「Company Website」文字與線恢復；
  手機 Design Approach 方塊縮成 159px。

### Category title bars one spec; phone home photo under the header; thumb wheel back 類別標題列統一；手機首頁首圖延伸到最上方；拇指輪方向改回
- Joel: "experimental 改好了，幫微調。還有確認我的產品列別頁的文字框高度，各文字的對齊／同類別尺寸都要一致". Measured every bar
  on the six category pages: sizes were already one (phone 10 / 7px, computer + iPad 30 / 17px), but bar heights were
  21.8–27.5px (phone) / 65–70.5px, and the texts 6–16px from the frame edges. Now one spec, `jcd-config.js` `catalogBars`
  (the values most bars had): phone bar 25px, title and description 10px from the frame edges; computer + iPad bar
  68.5px, title 15px from the left, description 20px from the right. `catalog-title-bars.js` moves the frame's top edge
  (bottom stays) and nudges the two texts; it lays the bars out again after the other phone scripts have finished (Defense's
  photos moved after load), handles each frame once with its topmost photo, finds the bar's texts before resizing it, and
  skips empty text blocks. Not inside the phone layout tool. Checked: every bar on all six pages at the spec on phone,
  iPad and computer, no overlaps, nothing off screen. Experimental: Joel's "Assistive Devices" title adjustment kept.
  DESIGN-SYSTEM updated.
- Joel: "手機版首頁上方不能有黑方塊，圖片上方要增加高度". The slideshow already reached up under the header, but the section's
  clip (phone layout, shortened section) also cut its top. The clip now cuts only the bottom
  (`src/js/global/phone-layout.js`); checked the other pages that shorten a section (one MoAI photo shows 2px more).
- Joel: "首頁的 end to end 的拇指輪滾動方向要改回去": the side thumb wheel scrolls the row in the browser's own direction
  again (`src/js/home/end-to-end-hint.js`).
- 類別頁標題列統一規格（手機高 25px、文字距框 10px；電腦與 iPad 高 68.5px、左 15px／右 20px），各平台檢查無重疊。手機首頁首圖延伸到頁首下方，
  不再有黑色區塊。End-to-End 拇指輪恢復原本方向。

### Phone Lifestyle by Joel, aligned 手機 Lifestyle（Joel 排版＋對齊）
- Joel: "lifestyle 改好了，幫微調". His placement (each first card moved up under its group's title bar) kept, aligned in
  `jcd-config.js` `phone.layout.lifestyle`: frames and cards on the 20px edges (Phantom Lamp and MG-522 were 1px off);
  every card flush with its frame's bottom under a 25px bar (Smoky Trace was 2px low); Alian and Water Bucket 10px under
  the card above (13 / 16px); 54px between the three groups (Lamp → Humidifier was 237px); bar labels 10px inside the
  frame and centred in the bar; the cards' click areas moved with them (Alian's had been dragged off screen to the right).
  The section ends 42px under the last card. No overlaps, nothing off screen.
- 套用 Joel 的 Lifestyle 手機排版並照規範對齊：白框與卡片對齊 20px 邊界、標題列 25px、卡片間距 10px、各組間距 54px、標籤距框內 10px。

### Phone layout tool: box selection with the left button 排版工具：框選改左鍵
- Joel: "手機板調整器，圈選改成左鍵". Box selection now starts with a left-button drag from empty space (like Illustrator);
  a plain click there still picks the section; Shift adds to the selection. The right-button version is gone.
  `preview/mockups/phone-layout.html`, `README.md`.
- 框選改為在空白處按住左鍵拖曳；只點一下仍是選取段落；Shift 加選。

### Phone category bars: description 7px as the rule 手機類別標題列說明文字 7px（規範）
- Joel: "我把小字改成 7px 了，手機板規範要改" (he set Industrial's "Power Tools" / "Business Hardware Solutions" to 7px in the
  tool). Made it the rule instead of per item: `tokens.css` phone `--jcd-bar-sub` 8 → 7px; the bar sizes are no longer
  raised by the phone's 9px label minimum (`--jcd-keep-size` in `catalog-title-bars.css`). DESIGN-SYSTEM updated.
- Industrial (cards moved into their frames by the phone layout) is now recognised as title bars: `catalog-title-bars.js`
  measures the photo where it is seen, adds its widening and centring to the offsets that are already there (it replaced
  them, which threw "Business Hardware Solutions" 178px out of its bar). Joel's Industrial save applied without the
  per-item 7px. Checked: every bar's title and description centred together (±1px) on all six category pages, no overlaps,
  nothing off screen; computer + iPad unchanged (30 / 17px).
- 手機類別標題列右側說明改為 7px（tokens.css 統一規範，不受手機最小字級限制）。Industrial 也套用標題列規則，修正說明文字被推出標題列的問題。

### Phone Industrial by Joel, aligned 手機 Industrial（Joel 排版＋對齊）
- Joel: "industrial 頁面我排好了，位置相對正確，但我排的很 rough，再幫我照規範調整看看". His placement (each card moved up under
  its group's title bar, 2×2 photos under the Advantech card) kept; aligned to the rules in `jcd-config.js`
  `phone.layout.industrial`: both title frames, the three cards and the 2×2 photos on the 20px page edges (they were 1–6px
  off; the Welding frame had Wix's 1px offset); "Welding Machine" / "Accessories Design" 10px inside the frame's left edge,
  "Power Tools" / "Business Hardware Solutions" 10px inside its right edge, labels centred in the bar; both bars 25px
  (Welding frame 199 → 200px); cards flush with the frame bottom; JCG card 10px under its group; photos on a 10px grid; the
  Advantech group pulled up to 54px under the JCG card (as between groups on the other category pages; it was 236px);
  the section ends 33px under the last photo. The cards' click areas moved with them. No overlaps, nothing off screen.
- `src/js/category/frame-edges.js`: on the phone it leaves alone everything Joel set in the tool and what is inside /
  around it.
- 套用 Joel 的 Industrial 手機排版並照規範對齊：白框、卡片、2×2 圖片對齊左右 20px 邊界，標籤距框內 10px，兩組間距 54px，最後一張圖下方 33px。

### Phone layout tool: right-drag box selection; Joel's placements win over frame alignment 排版工具：右鍵框選
- Joel: "你能不能在排版調整器加入右鍵拖曳多選，我親自調整" (the Lamp group still looked 1px off on his phone; in layout px
  every frame there is at 20–300, so the difference is sub-pixel drawing). `preview/mockups/phone-layout.html`: hold the
  right mouse button and drag a box; every text / photo / box it touches is selected (Shift: added); items inside a
  selected box move with the box; no context menu.
- `src/js/category/frame-edges.js` now stays out of the way: it does not run inside the tool (Joel sees and moves the
  real positions), and on the phone a component he moved or sized (`phone.layout` x / w) is left as he set it.
- 排版工具新增右鍵拖曳框選（Shift 加選）。自動對齊白框的程式在工具裡不執行，手機上 Joel 調過的項目以他的設定為準。

### Category frames on one line 類別頁白框對齊
- Joel (screenshots: Industrial, Advantech, Lamp, Drone, Laptop, Dehumidifier): "這都沒修阿，筆電那張有凸出" / "這張也有凸出".
  The real cause: the Wix export put a group's title frame, its product cards and the small 2-up photos 1–4px apart, so
  a card or photo stuck out past the frame above / around it. New `src/js/category/frame-edges.js`: white frames that
  touch or sit within 40px of each other form a group; left edges within 8px of each other go onto one line (the one
  most of them use, a tie goes to the widest frame), the same for right edges; the frame's component is shifted /
  resized by the difference. Runs on load and after a resize. Checked on all six category pages, phone + iPad +
  computer: no edge differences left, nothing off screen.
- 類別頁的標題白框、產品卡片、兩欄小圖原本左右差 1–4px，看起來凸出白框；新增程式讓同一組白框的左右邊對齊同一條線，各平台已檢查。

### Category photos stay inside their white frame 類別頁圖片不再超出白框
- Joel: "手機板 industrial 跟 lifestyle 的圖片有掉出白框…有些類別頁面的圖片左右有超出白框". At rest every photo sits inside its
  frame (checked on all six category pages); the photo zooms 6% while a card is pressed, and iPhone Safari does not always
  clip a scaled photo with overflow: hidden, so it spilled past the frame. Both Wix framed-photo kinds (.ih2JY1 > .BprtEa,
  .hhxEkR > .v9ZE1l) now also clip with clip-path and get their own layer; nothing that sits inside a card is cut
  (checked phone + computer). File: `src/css/category/cards-photo-zoom.css`. Not seen on a real iPhone yet.
- 類別頁卡片按下時照片會放大，iPhone Safari 有時不裁切而超出白框；改用 clip-path 強制裁切，所有類別頁、各平台。

### Phone home by Joel + box height in the phone layout tool 手機首頁（Joel 調整）＋排版工具可調方塊高度
- Joel: "已儲存，但是 design approach 的方塊我沒辦法縮矮，幫我縮。另外也把此功能加出來".
  - Joel's saved home values in `jcd-config.js` `phone.layout['']`: opening title 18.5px, Design Approach card titles
    16.5px, card text 8.5px, the section headings / intros re-centred. Snapped: the opening title's block 299 → 280px so
    its lines keep the 20px page edges (they were 10px from the edge); everything else was already centred (±0.5px).
  - Design Approach cards 196 → 176px, all four the same (`h`): as short as the text allows (card 01's last line runs
    under its ">>", which keeps 4px clear). Gaps between cards (15–16px) unchanged, no overlaps.
  - New `h` (box height) in `src/js/global/phone-layout.js`; `preview/mockups/phone-layout.html`: a box / card gets a
    bottom-edge handle (height) besides its left / right edges, and a 高度 slider that sets every selected box to one
    height. `README.md` updated.
- 套用 Joel 存的首頁調整（開頭標題 18.5px、方塊標題 16.5px、內文 8.5px、置中）；開頭標題寬度縮到 280px，維持左右 20px 邊界。
  Design Approach 四個方塊統一縮成 176px。排版工具新增方塊高度：方塊下緣控制點可拖、「高度」滑桿可把多選的方塊設成一樣高。

### iPad About photo after turning; phone home layout on "/m/index.html" iPad 旋轉後 About 照片；手機首頁排版
- Joel: "我在 iPad 上的 What I Believe 那張圖，當我從橫變成直，圖片尺寸與高度會跑掉，都要我空滑個三下才會閃跳回設定的比例".
  site.js sets the iPad's new page width 50ms after the turn and iOS reports the new window height later still, so the
  single re-layout at resize + 120ms used the old numbers; only a later resize (scrolling) fixed it. The photo is now laid
  out again until the size, zoom and upright/sideways class have settled (after the turn at 150–2000ms, on visual-viewport
  resize, and when that class changes). Checked with a simulated late turn both ways. File: `src/js/about/believe-reveal.js`.
- Joel: "design approach 的圖片內標題字還是太大欸，在縮小". The 14px from the last change never showed when the phone home was
  opened as `/m/index.html` (the three-device preview, and a redirect there): the page was read as a page called
  "index.html", so none of `phone.layout['']` (Joel's positions and text sizes) applied and the sub-page text scale made
  the card titles 20px. Fixed in `src/js/global/phone-layout.js` and `phone-text-size.js`; the card titles are now 14px,
  the opening title 19px, the four cards 196px, no overlaps on the phone home.
- iPad 由橫轉直後 What I Believe 照片尺寸會跑掉（要滑幾下才恢復）：改為旋轉後持續重算直到數值穩定。手機首頁網址為 `/m/index.html` 時
  原本認不出是首頁，Joel 調的排版與字級都沒套用（方塊標題變 20px）；已修正，方塊標題 14px。

### Phone home: larger opening title; Design Approach cards one size, smaller titles 手機首頁：開頭標題加大；Design Approach 方塊統一、標題縮小
- Joel: "手機板首頁 designing memorable…這個標題字要加大。下方 design approach 4 個方塊尺寸要統一，且內文標題字縮小一點，
  目前 Rapid validation 太大了". Phone: the opening title 16.5 → 19px; the four card titles (INSIGHT FIRST…, RAPID
  VALIDATION, DISCIPLINED AESTHETIC, BUILT FOR PRODUCTION) 17 → 14px — both in `jcd-config.js` `phone.layout['']` (`fs`).
  The four cards now share the tallest card's height (phone 196px; they were 196 / 183 / 176 / 196), the cards below move
  down with it; computer + iPad were already equal and stay so (`src/js/home/design-approach-cards.js`). Checked: title
  centred, 16px above the intro; all card text inside its card.
- 手機首頁開頭標題 16.5 → 19px；Design Approach 四個方塊統一高度（取最高的），方塊標題 17 → 14px。

### End-to-End: frame kept, 1.5 squares at the end, no nudge, smooth wheel; menu "Works" opens its list End-to-End 白框、到底剩 1 個半、取消示意動態、滾動順暢；菜單 Works
- Joel: "end to end 圖片 hover 時，白框都還要保留。滑到底時要剩 1 個半。然後取消左滑來回的示意動態效果。滑動不太順，感覺一格格的很明顯".
  - The white frame is part of each photo, so the hover zoom pushed it out: a 1px white line is now drawn above photo,
    dark layer and text (`src/css/home/end-to-end-hover.css`).
  - The row can go on until the last square stands half a square in from the left: 1.5 squares left in view at the end
    (phone: the last square whole plus part of the one before; the screen is too narrow for 1.5).
  - The one-time "swipe" nudge is removed.
  - Wheel / thumb wheel: each step adds to a target the row eases towards frame by frame, and it no longer snaps to a
    square afterwards (only a finger swipe settles on a square). Files: `src/js/home/end-to-end-hint.js`.
- Joel: "菜單上我選 works 時不要跳到主畫面，要跳出菜單就好". Computer + iPad: clicking Works opens its category list instead of
  going to the home page (touch: a second tap closes it, a click elsewhere closes it). Phone menu: Works is the heading of
  the categories under it; tapping it does nothing. File: `site/assets/js/site.js` (+ `?v=`).
- End-to-End 白框 hover 時保留；到底剩 1 個半（手機螢幕太窄，為最後一張加前一張的一部分）；取消示意動態；滾輪改為連續滑動、不再一格格對齊。
  菜單點 Works 只打開分類列表，不回首頁（手機版點 Works 不動作）。

### Home End-to-End strip: smaller text, wheel, click to centre, no loop 首頁 End-to-End：字縮小、滾輪、點擊置中、不無限輪播
- Joel: "end to end 的方塊內的文字太大了，整體縮小。方塊要支援滑鼠往下滾=往右滑。如果我點擊任何方塊圖，圖片要自動拉到中間與壓黑顯示字"
  + "方塊不要無限來回" + "滾到底應該至少留兩個圖，然後到底後頁面可下滑" + "羅技的拇指輪目前滾動時方向是相反，改過來".
  - Text in the squares: computer + iPad 40 / 19 → 30 / 15px, phone 14 / 10 → 12 / 8.5px, set once as `--jcd-e2e-title` /
    `--jcd-e2e-text` (`src/css/home/end-to-end-text.css`).
  - No loop: the export held the 9 squares 4 times (phone: 21 copies); the repeats are removed and the row ends after the
    last square, which comes to rest whole at the right edge (`end-to-end-slider.js`, `end-to-end-hint.js`).
  - Mouse wheel down = row moves right, up = left; at either end the page scrolls again. A side thumb wheel (Logitech)
    is turned round; trackpads and Shift + wheel keep the browser's direction (`end-to-end-hint.js`).
  - Click / tap a square: it slides to the middle of the visible row and stays dark with its text until another square
    is clicked or the visitor clicks elsewhere / moves the row. Every platform.
- Card ">>" turns blue on hover (Joel: "design approach 這邊 hover 時，>> 箭頭要填滿藍色"): the rule keeping it white on
  computer + iPad was more specific than the hover rule; fixed for Design Approach and the category cards
  (`src/css/global/round-go-fill.css`).
- Files: those, built `custom.css` / `custom.js`.
- End-to-End 方塊文字縮小（電腦／iPad 30／15px、手機 12／8.5px）；拿掉無限輪播（原本 9 張重複 4 次），到底停在最後一張、可繼續往下捲頁面；
  滑鼠滾輪往下＝往右；羅技拇指輪方向反轉；點方塊會移到中間並壓黑顯示文字。Design Approach 與產品列表卡片滑過時 >> 變藍。

### Copy review round 2: professional tone 文案第二輪：專業語氣
- Joel: "不是要改成太口語。是要專業、客觀、可信賴，讓設計師／設計總監面試官、客戶看了覺得你有點東西，值得信任跟見面看看。"
  The 314 published edits were re-read for register. 29 lines that had become casual ("hard to ignore", "less of a hassle",
  "So I…", "a real step up", "I’m") or had lost a professional detail (end-to-end, mass-production cost, product language,
  high-mobility, manufacturing feasibility, proactively) were rewritten. Lines without a subject stay without one. Joel
  approved them in `preview/mockups/copy-review.html`.
- LionFilter 200: Joel: "機身都是鍍鋅鋼板，板金彎折" / "拋光鋁腳／鋁底座 這是正確的". The intro now says "the rounded corners of the
  bent galvanized-steel enclosure and the aluminum base" (it said stainless steel).
- Files: 32 page HTML files (computer + phone), `preview/mockups/copy-review.html`, `TODO.md`.
- 已上線的 314 條重新檢查語氣，29 條太口語或少了專業細節的句子改成專業、客觀的寫法（無主詞的句子保持無主詞），Joel 確認後套用。
  LionFilter 200 開頭改為「鍍鋅鋼板板金彎折的圓角機身＋鋁底座」（原誤寫不鏽鋼）。

## 2026-11-27

### Copy review: whole site 全站文案修訂
- Joel: "幫我重新尋下我所有的文案。避免 AI 感，或是不自然、不順、錯誤文法的說法。" All English copy on 29 pages was read
  for AI-sounding phrases (seamless, elevate, not only…but also, dashes), awkward wording, grammar, typos and consistency
  (title case, product names). 316 suggestions were shown in the new review tool `preview/mockups/copy-review.html`. Joel
  kept every suggestion except one (the home intro sentence stays as written). He also asked to keep the lines that
  deliberately have no subject ("不想讀者一直看到 I, He"), so those lines were fixed without adding I / He / We. About:
  "High-Fidelity Mockup" (he meant a high-fidelity appearance model). 314 edits, each written into both the computer and
  phone HTML. The home Design Approach card is now "BUILT FOR PRODUCTION", so its link key in `jcd-config.js`
  `links.designApproach` was renamed to match; the card still opens HGU/AP at "Cutting Cost". Open items: the Gaming Home
  Gateway intro sentence that appears twice, and the LionFilter 200 base material (stainless steel or aluminium), are in
  `TODO.md`. Files: 58 page HTML files, `jcd-config.js` (+ `?v=`), `preview/mockups/copy-review.html`.
- 全站 29 頁英文文案檢查（AI 感用語、不通順、文法、錯字、一致性），共 316 條建議，用新的 `copy-review.html` 讓 Joel 逐條確認。
  採用 314 條（首頁開頭那句保留原文），電腦版與手機版一起改。Joel 刻意省略主詞的句子保持不寫 I／He／We，只修文法。
  About 改為「High-Fidelity Mockup」。首頁卡片改名「BUILT FOR PRODUCTION」，連結設定同步更新，仍連到 HGU/AP。
  Gaming Home Gateway 重複的句子、LionFilter 200 底座材質待 Joel 決定（已記在 TODO）。

### Phone home layout and title sizes by Joel 手機首頁排版與標題字級
- Joel: "首頁下的標題字體讓我調整(手機板)" → "搞定，推". His `phone-layout.html` values for the phone home: the opening title
  16.5px and wider (299px), the intro 9px, their positions, the space between sections and the last photo's framing, in
  `jcd-config.js` `phone.layout['']`. Checked: both texts centred on the page, no overlaps, nothing off the screen.
- 套用 Joel 調整的手機首頁：開頭標題 16.5px、介紹文字 9px、位置與段落間距；已檢查置中、無重疊。

### Phone layout tool: text size slider works 手機排版工具：字級滑桿修正
- Joel: "字體無法調整欸". The new 字級 slider had the same id ("f") as the tool's phone frame, so dragging it did nothing
  (only the number box worked). Renamed (`fz`); Joel's unsaved home changes were saved first. File:
  `preview/mockups/phone-layout.html`.
- 字級滑桿和手機畫面框用了同一個名稱，拖動沒反應；已改名修正，Joel 未存的首頁調整已先儲存。

### Phone layout tool: text size 手機排版工具：字級
- Joel: "首頁下的標題字體讓我調整(手機板)". New 字級 slider in `phone-layout.html`: select a text block (Shift-click to select
  several titles) and set its size in phone layout px; line height follows. Saved as `fs` in `jcd-config.js`
  `phone.layout`; `src/js/global/phone-layout.js` applies it (and restores it when the value changes or is undone).
  Files: those two, `README.md`, built `custom.js`.
- 排版工具新增「字級」：選取文字（可 Shift 多選）調整大小，行高等比例；存為 phone.layout 的 fs。

### Phone home + Defense layout by Joel; Airshow caption light and smaller 首頁與 Defense 手機排版、航展說明改細體縮小
- Joel: "給我首頁跟 defense 的調整器，我來自己調" → "改好了". His `phone-layout.html` values for home (space between
  sections, the video, the intro text width, the last section's photo framing) and Defense (the Airshow block) are in
  `jcd-config.js` `phone.layout`; the Defense photos he moved 2px right were set back on the 20px page edge, level with the
  cards (20-300). Checked: nothing covered, no text overlaps, the caption 35px clear of the next section.
- Joel: "這段字體不要粗體，可縮小" (the Airshow caption). Poppins Light (was Medium), computer + iPad 11px (was 12),
  phone 7.5px (was 8). New general switch: a CSS rule can set `--jcd-keep-size` on text so `phone-text-size.js` leaves
  its size alone. Files: `src/css/category/defense-airshow-caption.css` (new), `src/js/global/phone-text-size.js`,
  `src/css/ORDER.txt`, `src/README.md`, `site/assets/js/jcd-config.js` (`?v=` bumped), built `custom.css` / `custom.js`.
- 套用 Joel 調整的手機首頁與 Defense 排版（Defense 照片回到 20px 頁邊）；航展說明改 Poppins Light、電腦 11px、手機 7.5px。

### Phone Defense: Airshow caption no longer over "Company Website" 手機 Defense 航展說明不再壓到 Company Website
- Joel: "手機版這邊被壓到兩個 company website 欸". The caption "Admiral Li Shih-chiang … 2026 Singapore Airshow" sits 43px
  lower in Wix's phone layout than its photo, inside the space the next section overlaps (category spacing), so it was always
  hidden under that section; the new "text above photos" rule brought it up over the "Company Website" heading. It now sits
  right under its photo, 16px clear of the next section (`jcd-config.js` `phone.layout.defense`, tunable in
  `phone-layout.html`). A site-wide text-over-text scan (phone + computer) finds nothing else (MoAI's title lines touch by
  3px of line spacing only). File: `site/assets/js/jcd-config.js` (`?v=` bumped).
- 航展說明文字移到照片正下方，不再疊在下一段標題上；全站文字重疊掃描無其他問題。

### Phone home: even space around the video 手機首頁影片上下間距一致
- Joel: "手機版首頁影片下方跟最下方的圖的間距要大點，不然就是把影片的位置上移". The video had 59px above it and 41px below
  (to "Let's Shape the Next Product Together"); now 55px on both sides: the video moves up 4px and its section gets 10px
  more at the bottom. In `jcd-config.js` `phone.layout['']` (home), so it can be tuned in `phone-layout.html`. Phone only.
- 手機首頁影片上方 59px、下方 41px，改成上下都 55px（影片上移 4px、段落底部加 10px），寫在 phone.layout。

### Text above photos; achievements 3+, slower roll; About "10+ products" 文字不被照片蓋住、成就 3+ 與轉動放慢、About 10+
- Joel: "手機板 defense 頁面的新加坡 airshow 跟白襯線被圖片蓋到了，處理下，同時也巡一下其他平台". The "2026 Singapore AIRSHOW"
  text and its white line came before the photo in the page, so the photo was drawn over them. Text and divider lines now
  always lie above photos (`src/css/global/base.css`; the sticky header stays above them). A scan of every page on phone and
  computer (iPad uses the computer page) found only that place covered; now none.
- Joel: "數字轉動速度可以慢點，然後產品家族可以改成 3+". Home Achievements: the roll takes 3.2 s (was 1.8 s), numbers start
  0.25 s apart (was 0.15); "Product Family Languages" 2+ -> 3+. Files: `src/css/home/achievement-odometer.css`,
  `src/js/home/achievement-odometer.js`, `site/index.html`, `site/m/index.html`.
- Joel: "自介這段的 8+ 改成 10". About intro: "launched 10+ products" (was 8+), computer and phone.
  Files: `site/about/index.html`, `site/m/about/index.html`.
- 文字與分隔線一律在照片上層（修正手機 Defense 新加坡航展）；首頁成就數字轉動放慢、產品家族 3+；About 自介改 10+ products。

### ">>" in Poppins Medium, smaller phone / iPad card text, no old ">>" anywhere >> 改 Medium、手機與 iPad 卡片字縮小、舊 >> 全移除
- Joel: ">> 改 medium" / "手機板的首頁 12 張圖＋產品類別頁的字體還是太大" / "ipad 版的圖卡產品名字尺寸也要縮小一點" / "t interceptor CS 下方有一個舊的
  >> 掉落在外面" / "舊 >> 應該都要移除了。我們有新的 >> 設計了".
  - The ">>" is Poppins Medium (was Regular). Tokens: phone name 12.5 / small line 9 / >> 14 / corner 9px (was 15 / 10 / 17 / 10);
    iPad name 16px (was 18.5). Home Works grid and every category card follow.
  - Phone Defense: T. Interceptor CS's Wix ">>" had wrapped onto two lines, one ">" below the card; Wix's ">>" is now hidden
    whenever it touches a card's photo (`cards-touch.js`), and a new site-wide rule hides every Wix ">>" / ">" text on every
    page and platform (`src/js/global/old-arrows-off.js`); the Wix links stay in the page so the card links keep working.
  Files: `src/css/global/tokens.css`, `src/css/global/round-go-fill.css`, `src/js/category/cards-touch.js`,
  `src/js/global/old-arrows-off.js` (new), `src/js/ORDER.txt`, `src/README.md`, `DESIGN-SYSTEM.md`, built `custom.css` / `custom.js`.
- >> 改 Poppins Medium；手機卡片字縮小（名稱 12.5、小字 9、>> 14、離角落 9），iPad 名稱 16；Wix 舊 >> 全站隱藏（含 T. Interceptor CS 掉出卡片的那個）。

### Card size tuner shows the real size 卡片尺寸工具改成實際大小
- Joel: "手機板的首頁 12 張圖的字體太大了，你難道沒有套用剛剛的尺寸嗎?". The values were applied (phone name 15px), but the
  tuner drew every card 1:1 and at the wrong size: on a 390px iPhone the 320px layout is shown 1.22x, the computer and iPad
  tiles are 398 x 224 drawn at 0.85 / 0.89 (the tuner had 520 / 420px cards), so sizes chosen there came out larger on the
  site. `preview/mockups/go-size.html` now draws the home tile at its real size on each device; the sliders are still the
  tokens.css numbers.
- 工具原本用 1:1 且尺寸不同的卡片顯示，導致調出的字在網站上偏大；現在三平台都用實際卡片尺寸與顯示比例。

### Opening a page at a section: no flash of the top 開到指定段落時不再先閃頁首
- Joel: "當我按下 buildable 的卡片時，是先跳到產品頁最上面，閃一下後才到我要的頁面". The page waits for its layout scripts
  before it can scroll to the right place (~0.7 s). Now `site.js` (runs before the first paint) hides the page when the
  address names a section from `jcd-config.js` `links.anchors`, and `text-anchors.js` fades it in once it is there (never
  hidden longer than 3 s). Files: `site/assets/js/site.js` (`?v=` bumped), `src/js/global/text-anchors.js`,
  `src/css/global/base.css`, built `custom.css` / `custom.js`.
- 從首頁卡片開到指定段落時，頁面先隱藏、捲到位置後才淡入，不再先看到頁首。

### Home "Buildable Execution Mindset" card opens Wi-Fi 7 HGU/AP "cutting costs" 首頁 04 卡片連到 HGU/AP 降低成本段落
- Joel: "首頁的這張 buildable mindset 請連到 wifi7 ap 的這張 cutting cost". The 04 REALIZATION card is now a link like
  01 DISCOVERY (whole card, blue outline on hover, the plain >> in its corner) to `wi-fi7-hgu-ap/index.html#dfm-cost`; the
  phone home opens the phone page. That page scrolls to "Balancing Design Intent and DFM Optimization / Preserving the design
  intent while cutting costs in half", just under the header (computer, iPad, phone). The link and the anchor live in
  `jcd-config.js` `links` (designApproach: words on a card -> page#anchor; anchors: #name -> heading). Files:
  `src/js/home/design-approach-cards.js` (one function for every linked card), `src/js/global/text-anchors.js` (new),
  `src/js/ORDER.txt`, `site/assets/js/jcd-config.js` (`?v=` bumped), built `custom.js`.
- 首頁 Design Approach「04 BUILDABLE EXECUTION MINDSET」卡片可點，連到 Wi-Fi 7 HGU/AP 的「cutting costs in half」段落並自動捲到該處（三平台）。

### Card ">>" without the circle (G2), card text sizes by Joel; second new hover portrait 卡片 >> 去掉圓圈、卡片字級；第二張新大頭照
- Joel: "圓圈版 >> 跟我的方正瑞士國際風格不搭" → `preview/mockups/go-button-styles.html` (A-G) → "G2" (>> alone, Poppins Regular)
  → sizes set with `preview/mockups/go-size.html` ("搞定"). Every card (home Works grid, category cards on touch and the
  computer hover, Design Approach card 1): the ">>" is plain text, no circle / frame / blur; hovered or pressed card: blue and
  3px to the right (also while the page changes). Tokens: phone name 15 / small line 10 / >> 17 / corner 10px; iPad 18.5 /
  11 / 21 / 12px; computer 21 / 11.5 / 23 / 14px (`--jcd-card-edge` new, `--jcd-card-go` removed). The per-file corner
  distances were removed. Files: `src/css/global/tokens.css`, `src/css/global/round-go-fill.css` (now the plain >>),
  `src/css/category/cards-linked.css`, `cards-ipad-sizes.css`, `go-hover-computer.css`, `src/css/home/selected-grid.css`,
  `design-approach-card1.css`, `DESIGN-SYSTEM.md`, built `custom.css`.
- Joel: "我又放了新的大頭照在 media new 裡，幫我換上原本 hover 會出現的照片". Same size as the last one (2238 x 1595), so the
  site files are `about-06-2238x1595-v2.webp` / `about-06-1200x855-v3.webp` (original replaced in `media-originals/about/`);
  `reference/media-map.json` updated, old files removed, `media-new/` emptied.
- 卡片 >> 改成無框的 Poppins Regular 文字，字級與離角落距離依 Joel 調整寫入 tokens.css；About 滑過的大頭照換成第二張新照片。

### About: new hover portrait 關於頁滑過時的新大頭照
- Joel: "我放了新的大頭照在 media new 裡，幫我換上原本 hover 會出現的照片". The photo that appears on hover (computer) / while
  pressed (phone, iPad) is Joel's new portrait (2238 x 1595, same ratio as the frame): original
  `media-originals/about/about-06-2238x1595.jpg`, site `about-06-2238x1595.webp` (computer + iPad) and `about-06-1200x855-v2.webp`
  (phone), WebP q86. The old Golden Pin photo's two site files are removed (its original stays). `reference/media-map.json`
  updated; `media-new/` emptied again. Files: `site/about/index.html`, `site/m/about/index.html`, `src/js/about/portrait-swap.js`
  (comment), built `custom.js`.
- About 大頭照滑過（手機、iPad 按住）時出現的照片換成新照片；依圖片規則存原檔、產生 WebP 與手機版，記錄於 media-map。

### Phone layout applied (19 pages) 手機排版套用（19 頁）
- Joel: "Saved, apply it" (twice). His layout from `phone-layout.html` is in `jcd-config.js` `phone.layout` for 19 pages: top
  image framing on 13 work pages (Airgain, AI Tool Kit, Geometry Series, HGU/AP, Interstellar 05, Lionic, MoAI, NLG,
  Parametric, Sagittarius, Speeder Pro, T. Interceptor CS, Teana, Extender), moves / widths / scale / space above and below
  on Wi-Fi 7 HGU/AP, MoAI, T. Blade, Assistive Products, Zenfone 9, Speeder Pro, Geometry Series, Ocean Series, Lionic,
  Wi-Fi 7 2022 and Extender. Then aligned: within ~7px snapped to the 20px page edges (HGU/AP, Assistive, MoAI), a photo
  that ran 6px off the left edge set flush with it (MoAI), a centred text kept centred (HGU/AP "Designed to harmonize");
  where a shortened section cut its last item (MoAI Display Stand Kit, T. Blade) or left it 2px from the bottom (MoAI grey
  section), 12px kept under it. Deliberate bleeds and overlays stay. The tool's saved copy now holds these final values
  (so a later save does not bring back the unaligned ones). File: `site/assets/js/jcd-config.js` (`?v=` bumped).
- 套用 Joel 19 頁的手機排版（13 頁首圖取景＋多頁位置、寬度、縮放、間距），並微調貼邊、置中與段落底部至少 12px；工具暫存已換成最終數值。

### Phone layout tool: Ctrl + click selects what is behind 手機排版工具：Ctrl＋點選後方物件
- Joel: "背景的灰方塊還是不能選欸，我想像是 illustrator 的選法". The photo covers the grey box completely, so a click always hit
  the photo. Ctrl (or Alt / Cmd) + click now picks the next item behind the current one under the pointer, and keeps cycling
  (photo → grey box → section → photo), like Illustrator. File: `preview/mockups/phone-layout.html`, `README.md`.
- 照片完全蓋住灰方塊，所以點不到；現在按住 Ctrl（或 Alt）點，會依序選到後面的物件（照片 → 灰方塊 → 段落）。

### Phone layout tool: top image framing, Ctrl+Z, section height, boxes 手機排版工具：首圖取景、復原、段落高度、方塊
- Joel: "也要支援子頁最上方首圖的左右移動功能" / "需要支援 ctrl+z 返回" / "我沒辦法調整背後的灰方塊高度，能讓我直接拖嗎" /
  "後方的方塊我選不到，我想要方塊之上增加空間".
  - Top image: click the photo background (not text) and drag; the photo moves inside its frame (`'bg:<comp id>': { px, py }`
    in `phone.layout`, object-position %).
  - Ctrl+Z undoes, Ctrl+Shift+Z / Ctrl+Y redoes (a drag or one slider pull is one step).
  - Section height: a handle on the bottom edge of the section's dashed outline; clicking empty space selects the section.
    A shorter section now really loses its bottom (clipped) and the next section moves up.
  - Coloured boxes (e.g. T. Blade's grey panel behind a photo, a separate Wix box shape) can be selected by clicking them or
    with 選後方方塊; "space above" on a box moves the box, what is inside it and everything below.
  Files: `preview/mockups/phone-layout.html`, `src/js/global/phone-layout.js` (background framing, clipped shorter sections,
  "space above" moves a container's direct items so boxes move with their contents), `README.md`, built `custom.js`.
- 工具新增：首圖拖曳取景、Ctrl+Z 復原／重做、拖段落底邊調高度、可選取有底色的方塊並在其上方加空間。

### Phone layout tool: resize handles, scrollbar out of the way 手機排版工具：縮放控制點、捲軸不壓畫面
- Joel: "能不能也支援選取後的方塊縮放拖曳功能?，跟 illustrator 作法一樣" / "右邊的視窗滾輪不要壓到畫面". The selected item gets
  handles: a text block's left / right edges change its width (the text re-wraps; the left handle keeps the right edge
  still), a photo's four corners scale it with the opposite corner fixed (new `s` in `phone.layout`, also a 縮放 % field).
  The phone frame is 320px + this computer's scrollbar width, so the page inside is exactly a phone's width and the
  scrollbar sits outside the frame. Files: `preview/mockups/phone-layout.html`, `src/js/global/phone-layout.js` (`s` =
  CSS scale from the top-left), `README.md`, built `custom.js`.
- 選取後出現控制點：文字拖左右邊改寬度，圖片拖四角等比例縮放（對角固定）。手機畫面正好 320px，捲軸移到畫框外不壓畫面。

### Phone layout tool: "space above" 手機排版工具：上方空間
- Joel: "是不是要有個功能可以讓我調整空間?" (the gap between "Integrated Ventilation Detail" and "UX-Driven Architecture").
  New slider 上方空間 (`gap` in `jcd-config.js` `phone.layout`): select the item under a gap and drag it; that item and
  everything below it in its section move, and the section grows or shrinks by the same amount so every later section
  follows (no overlap). Files: `src/js/global/phone-layout.js` (rewritten: moves are collected first, then applied once),
  `preview/mockups/phone-layout.html`, `README.md`, built `custom.js`.
- 新增「上方空間」：選空白下方的項目拉滑桿，它和下面所有東西一起移動，後面的段落也跟著走。

### Phone layout tool: buttons not reacting 手機排版工具按鈕沒反應
- Joel: "我按置中與頁彼此對齊都沒及時反應". A test the AI ran in the tool's tab overwrote one of the tool's variables, so
  changes went to a page called "undefined". Fixed in Joel's open tab (his two changes moved back to Wi-Fi 7 HGU/AP) and the
  tool's code now sits inside one function so nothing outside can overwrite it. File: `preview/mockups/phone-layout.html`.
- AI 測試時誤蓋了工具的變數，導致按鈕沒反應；已在開著的分頁修好並保留調整，工具程式改包在函式內，避免再發生。

### Phone layout applied and aligned; phone heading scale; layout tool multi-select 手機排版套用與對齊、標題字級階層、工具多選
- Joel: "我大概都排好了，請再幫我微調。尤其是對齊(貼邊、置中、下方空間等)". Joel's layout for Wi-Fi 7 HGU/AP, MoAI, Wi-Fi 7
  Extender, Wi-Fi 7 2022, Lionic LionFilter 200 and Ocean Series is in `jcd-config.js` `phone.layout`, then aligned: items
  within ~7px snapped to the 20px page edges (e.g. Extender's four text blocks, HGU/AP and MoAI texts and photos), centred
  texts on the centre line, HGU/AP's two side-by-side photos centred as a pair, and every section keeps at least 20px under
  its last item (content moved down had run 9-27px past its section: HGU/AP, Extender, 2022, Lionic, Ocean). The space under a
  section is now added inside it, so its own colour or photo grows with it (`src/js/global/phone-layout.js`).
- Full phone review ("Yes, review all"): no text off the screen or wider than its box on any of the 31 phone pages. Work
  pages had page titles at 18-21px and section headings at 12-16px depending on the page; now one scale (`phone.scale`:
  title 20px, headings 12px; decorative display type left alone), category page titles 21px (`phone.catScale`; Defense
  was 22). Files: `site/assets/js/jcd-config.js` (`?v=` bumped), `src/js/global/phone-text-size.js`.
- Joel: "手機版工具要支援 shift 多點選，這個工具要存起來方便我未來使用". `preview/mockups/phone-layout.html`: Shift-click
  selects more items (they move together, sliders move / size them together), align buttons (page left / centre / right,
  each other's left / centre / right / top / middle / bottom), starts from the site's saved layout. Documented in
  `README.md` §3 item 5 and `AGENTS.md` ("Saved, apply it"). `DESIGN-SYSTEM.md` updated.
- 套用 Joel 6 頁的手機排版並微調對齊（貼 20px 邊、置中、與相鄰對齊、每段下方至少 20px）。全面檢視：31 頁無文字超出；作品頁標題統一 20px、
  章節標題 12px，類別頁標題 21px。排版工具支援 Shift 多選與對齊按鈕，並寫進 README 與 AGENTS 方便以後使用。

### Phone layout tool 手機版排版調整工具
- Joel: "你能不能把 wifi7 ap 跟摩艾的手機版頁面做出 mockup，我來調整 layout". New `preview/mockups/phone-layout.html?p=<page>`:
  the real phone page; click a text or photo to select it, drag (or arrow keys) to move it, set its width, or the space
  under its section; "儲存" keeps the values. They go into `jcd-config.js` `phone.layout[<page>]` (empty for now), which
  the site applies with the same code: `src/js/global/phone-layout.js` (new, last on load). Every phone page can be adjusted.
  Files: those, `src/js/ORDER.txt`, `src/README.md`, `site/assets/js/jcd-config.js` (`?v=` bumped).
- 新增手機版排版工具：在真實手機頁面上點選文字或圖片後拖曳移動、調寬度、調段落下方間距；儲存後由 AI 寫入 jcd-config.js，網站用同一支程式套用。

### One set of sizes for cards, ">>" and category title bars 卡片、>>、類別標題列統一數據
- Joel: "手機版產品類別頁的字體太大了 / 要跟首頁 12 張圖的做法統一，還有 >> 也是 / 這些都要成為統一數據" and "premium… 跟 material & CMF…
  的字體不統一，且因為 material… 的字太大，導致白框尺寸變高 … 要成為統一規則". New tokens in `src/css/global/tokens.css`
  (`--jcd-card-name`, `--jcd-card-brand`, `--jcd-card-go`, `--jcd-card-go-font`, `--jcd-bar-title`, `--jcd-bar-sub`), one value
  per platform = the home Works grid's (phone 11 / 9.5px names, 18px ">>"; iPad 20 / 15, 34; computer 15 / 11.5, 26). Every
  category card, the home grid, the Design Approach ">>" and the computer hover ">>" (was 40px) read them; the per-page
  numbers were removed. Category title bars: the left text is the title, the right the description, sized by the bar tokens
  (phone 10 / 8px, computer + iPad 30 / 17px); the description stays on one line, growing leftwards (Electronics "Material &
  CMF Exploration" no longer makes its bar taller). Checked all six category pages on phone and computer, iPad and home.
  Files: `src/css/global/tokens.css`, `src/css/home/selected-grid.css`, `src/css/home/design-approach-card1.css`,
  `src/css/category/cards-linked.css`, `cards-ipad-sizes.css`, `go-hover-computer.css`, `catalog-title-bars.css` (new),
  `src/js/category/catalog-title-bars.js`, `src/css/ORDER.txt`, `src/README.md`, `DESIGN-SYSTEM.md`.
- 卡片名稱、品牌小字、>> 圓圈、類別標題列字級改成 tokens.css 的一組統一數據（以首頁 12 張圖為準），三平台各一組，不再各頁分別設定；
  標題列右側說明維持一行，白框不再被撐高。

### Logo no longer disappears on hover Logo 滑過不再消失
- Joel: "現在 logo hover 後是消失欸". The new press layer locked the logo's blue hover copy at 0 while the white logo faded
  out. The press now reuses the hover layer (`header-icons-hover.css` shows it on hover, keyboard focus and while pressed,
  with the page's own logo file as its mask) and `menu-press.css` only adds the small press. Files: those two,
  `src/js/global/logo-press.js`.
- 按壓效果改用原本滑過變藍的圖層，滑過變藍、按下變藍並縮一下。

### About dates on two lines, lists aligned; logo press 關於頁時間分行與對齊、Logo 點擊感
- Joel: "時間段都要分行，不要有月份跟年被拆成不同段，還有 education 的年份跟右邊 master of design 沒有對齊". Phone About lists:
  a month and its year never part, each period breaks after its dash ("Jul 2025 -" / "Aug 2026"); dates sit on the baseline
  of their title; every list's text column starts at the same place (96px) and ends at the 20px page margin.
  Files: `src/js/about/two-column-lists-phone.js`, `src/css/about/two-column-lists-phone.css`.
- Joel: "joel chang logo 點下去要有點擊感，跟隔壁菜單作法一樣". The header logo, every page and platform, turns blue and presses
  in (scale .92) like the menu items. Files: `src/css/global/menu-press.css`, `src/js/global/logo-press.js` (new),
  `src/js/ORDER.txt`, `src/README.md`.
- 手機 About：月份與年份不拆開、每段時間在「-」後換行；日期與標題基線對齊；各清單右欄起點一致。Logo 按下變藍並縮一下，與菜單相同（全平台）。

### MoAI Detail Design photo without the black frame MoAI 細節照片拿掉黑框
- Joel: "這張圖不能有黑框". The frame was a separate Wix outline shape over the photo (`comp-mosh8egr`, 1px black on the
  phone); hidden on every platform. File: `src/css/product/moai-detail-frame.css` (new), `src/css/ORDER.txt`, `src/README.md`.
- MoAI「Detail Design」照片的黑框是另一個 Wix 外框元件，三平台都隱藏。

### Phone work pages: body text 8px, text beside photos tidied 手機作品頁內文 8px、圖文排版整理
- Joel: "內文改 8px 好了，且排版要調整，圖與字與間距怪怪的" (MoAI materials, HGU/AP). Body text on the phone work and category pages
  is now 8px (`jcd-config.js` `phone.subText: 8`). New `phone-layout-tidy.js`, before the text sizing: (1) a short title right
  above its paragraph gets the paragraph's width (MoAI "Pebble Gray" no longer breaks onto two lines); (2) left-aligned text
  beside a photo keeps at least 12px from it (HGU/AP "Minimal UI" / "Integrated Ventilation" ran 30px into the router photo,
  the "Form follows flow" quote touched the sea anemone); text more than a third over a photo (a deliberate overlay, e.g.
  MoAI "Speckled Effect Texture") and centred text are left alone. 31 phone pages: no text off the screen or wider than its
  box. Files: `src/js/global/phone-layout-tidy.js` (new), `src/js/ORDER.txt`, `site/assets/js/jcd-config.js` (`?v=` bumped),
  `DESIGN-SYSTEM.md`, `src/README.md`, built `custom.js`.
- 手機作品頁與類別頁內文改 8px。新增圖文整理：短標題與下方內文同寬（不再無故換行）；靠左文字與旁邊照片至少留 12px（HGU/AP 文字不再壓進路由器照片、
  引言不再貼著海葵圖）；刻意疊在照片上的文字與置中文字不動。

### Phone work pages: body text 9px 手機作品頁內文 9px
- Joel: "這些內文小字都太大了，我覺得子頁的內文小字都要縮小成 9px". Phone paragraphs that the text minimum raised were 10px; on
  the work and category pages they are now 9px (`jcd-config.js` `phone.subText: 9`, `phone.subTextExcept` = home, About,
  Contact, 1-4, which keep 10px). Text Wix already set larger (bold taglines such as "Technology that feels human") is left
  as is. Checked 28 phone pages: body text 9px, nothing off the screen. Files: `site/assets/js/jcd-config.js` (`?v=` bumped),
  `src/js/global/phone-text-size.js`, `DESIGN-SYSTEM.md`, built `custom.js`.
- 手機作品頁與類別頁的內文由 10px 改 9px（設定在 jcd-config.js `phone.subText`）；首頁、About、Contact 維持 10px；Wix 原本較大的粗體副標不變。

### White pages white on the phone again 手機白底頁恢復白底
- Joel: "摩艾有些頁面是白底欸，目前都是黑的" / "Sense of Roundness and Joy 到 Pursue the smooth transition effect of curved surfaces
  and achieve G2 continuity 的背景都要是白色". On the phone, `mobile-fixes.css` painted the site frames (`#SITE_CONTAINER`,
  `#site-root`, `#masterPage`) black; they sit above the page's white background layer, so every transparent section of the
  white pages showed black. On white pages (no `.jcd-dark-canvas`) these frames are now see-through. Checked all 10 white
  pages on the phone: every transparent section white (Lionic's one black band is Wix's own colour); dark pages unchanged.
  Computer and iPad were not affected. File: `src/css/phone/mobile-fixes.css`, built `custom.css`.
- 手機版有一條規則把網站外框塗黑，蓋住白色頁面底層，白底頁的透明段落因此變黑。白底頁的外框改成透明；10 個白底頁手機版都已檢查，深色頁不變。

### Phone info table 2 × 2, About grey text smaller, About equal side margins 手機資訊表 2×2、About 灰字縮小、About 左右留白相等
- Joel: "手機版產品資訊表改成 2×2" → mockup `preview/mockups/info-table-phone.html` (A-D on real pages) → "B 2×2，但要注意下方
  文字與黑底要留有空間" → "產品資訊表文字可以字體縮小變灰色". On every phone product page (22) the Client / Year / Designer /
  Contribution table is a 2 × 2 grid at the 20px page margins (was four 20-63px columns with 6-9px text): label and content
  9px, content grey, at least 28px of black box below the table (measured 28-68px). Files: `src/js/product/info-table-phone.js`,
  `src/css/product/info-table-phone.css` (new), `src/js/global/phone-text-size.js` (skips the table).
- Joel: "about 的灰細文字的尺寸跟其他是一樣的，應該要縮小". Phone About: grey light lines (patent numbers, roles, notes) now use
  the label size 9px, a step below the white 10px text. File: `src/js/global/phone-text-size.js`.
- Joel: "ipad 版的 about 左邊跟右邊空間沒有一樣，右邊比較窄…內容應該要窄點讓右邊有一樣的空間". The Trusted Collaboration cards
  ended 12px past the mirrored edge and Expertise's Branding column 25px (iPad layout; the computer had the same). Now the card
  block ends at the mirror of the page's left text edge and the Branding column moves left until its longest line ends
  there, the divider before it halfway between the columns. Left = right on iPad and on 1536 / 1920 / 3440 screens. File:
  `src/js/about/even-margins-desktop.js` (new). `DESIGN-SYSTEM.md`, `src/README.md`, `src/js/ORDER.txt`, `src/css/ORDER.txt`.
- 手機 22 個產品頁的資訊表改成 2×2（頁面 20px 邊界），標題與內容 9px、內容灰色，表格下方至少留 28px 黑底。手機 About 灰色細字改 9px，
  比白字小一級。About（iPad 與電腦）推薦卡片與 Expertise 的 Branding 欄往內收，右側留白與左側相等。

### Menu no longer flashes a serif font 菜單不再先閃襯線體
- Joel: "為甚麼我剛進到網站時，菜單的文字會是襯線體，然後才變回我的字體". Poppins loads with `font-display: swap` and Wix's font
  lists end in names that don't exist (`orig_poppins_*`) with no generic family, so until Poppins arrived the browser drew
  the text in its default serif. Now every page (computer + phone, 70 files) preloads Poppins Light / Medium / SemiBold
  right after `<meta charset>`, and the `orig_poppins_*` names point to a plain sans-serif, so the brief stand-in is never
  serif. Files: `src/css/global/font-fallback.css` (new), `src/css/ORDER.txt`, `src/README.md`, every page `index.html`,
  built `custom.css`.
- Poppins 載入前，瀏覽器用預設襯線體暫代。現在每頁一開始就預先下載 Poppins（Light／Medium／SemiBold），暫代字體也改成無襯線體。

### Zenfone 9 top image framing 首圖取景
- Joel: "zenfone 9 讓我調整首圖位置" → set per platform with `preview/mockups/photo-align.html?key=zenfoneHero`: computer
  46% 10% ×1.02, iPad landscape 20% 20%, iPad upright 18% 53%, phone 15% 48% (was 50% 50%). File: `site/assets/js/jcd-config.js`
  (`photoFrames.zenfoneHero`, `?v=` bumped in every page).
- Zenfone 9 首圖依 Joel 在各平台調整的位置顯示（電腦、iPad 橫／直、手機分別設定）。

### End-to-End slider without arrows 首頁 End-to-End 不用箭頭
- Joel: "end to end 是不是不用箭頭? 只要畫面被切到或是左右動一下人家就知道是要左滑?" → mockup `preview/mockups/end-to-end-hint.html`
  (variants A-D, phone / iPad / computer) → Joel chose C on every platform; then "輪播往右滑後，最左邊被切到的也要有漸層消失".
  Arrows hidden everywhere. The next square is cut at the edge with a soft fade to black (phone: the strip now runs to the
  screen edge and the squares are 218px instead of 150, so about a third of the next one shows; computer: cut at the
  content margin; iPad: by the screen). A matching fade on the left while a square is cut there. The row slides left a
  little once when it comes into view (not with reduced motion). It always comes to rest with a square at its start: Wix's
  own CSS snapping used the squares' places from before they were enlarged and stopped between them, so it is turned off.
  Computer: drag with the mouse; arrow keys when focused. Phone overlay text keeps 10 lines. Files:
  `src/js/home/end-to-end-hint.js` (new), `src/js/home/end-to-end-slider.js`, `src/css/home/end-to-end-hint.css` (was
  `end-to-end-arrows.css`), `src/*/ORDER.txt`, `src/README.md`, `DESIGN-SYSTEM.md`, built `custom.css` / `custom.js`.
- 首頁 End-to-End：全平台拿掉箭頭；下一張在邊緣被切到並漸暗（手機輪播延伸到螢幕邊、方塊 150→218px，露出約 1/3；電腦切在內容邊界；iPad 由螢幕切）；
  左邊有方塊被切到時也漸暗；進入畫面時往左晃一下（減少動態效果時不晃）；停下時一定對齊方塊（Wix 原本的對齊用放大前的位置，會停在中間，已關閉）；
  電腦可用滑鼠拖曳、鍵盤左右鍵。

### About: no huge empty space after reloading 關於頁重新整理後上方不再出現大空白
- Joel: "電腦版有時候重新整理到 about 時，第一個 section 上方會有超大的空間". When the page was reloaded while scrolled down,
  the browser restored that position and the intro-centring script added the scroll distance to the (sticky) header's
  place, pushing the intro thousands of px down. It now uses the header's height. Computer + iPad. File:
  `src/js/about/intro-layout-desktop.js`.
- 在頁面中段重新整理時，置中開場的程式把捲動距離算進置頂選單的位置，開場被推下幾千 px；改用選單高度計算。電腦與 iPad。

### media-new cleaned 清理 media-new
- Joel: "media new 資料夾的檔案若不再用到可以刪掉". Its 5 images were exact copies of originals already in `media-originals/`
  (defense-09, t-interceptormp-06, moai-router-13, home-16, home-01); deleted, README kept (folder not in git).
- 5 張圖都已有相同的原始檔在 media-originals，已刪除，保留 README（此資料夾不進 git）。

### Phone text no longer runs off the screen 手機文字不再超出畫面
- Joel: "手機板字有卡到欸，全面檢視，該換行要換行" (About, Patents: the long titles ran past the right edge). The Patents list was
  wider than the screen in Wix; the About two-column lists now stop at the page's right margin and the titles wrap. Every
  phone page: a text box that reaches past the screen edge is narrowed to the 20px page margin before its text grows, so
  it wraps instead (Geometry Series "Designed by"). Checked all 36 phone pages: no text past the screen, cut by its box or
  wider than its column. Phone only. Files: `src/js/about/two-column-lists-phone.js`, `src/js/global/phone-text-size.js`,
  `site/assets/js/custom.js`.
- About 專利列表在 Wix 裡比螢幕還寬，長標題被切掉；現在列表停在頁面右側留白處，標題會換行。所有手機頁：超出螢幕的文字框先縮到 20px
  頁邊，文字放大時改為換行（Geometry Series「Designed by」）。36 個手機頁全部檢查：沒有文字超出畫面、被框切掉或超出欄寬。只影響手機。

### Phone text one step smaller 手機字級小一級
- Joel: "手機板字體可以小一級". Phone text minimum now 10px for paragraphs and 9px for short labels (was 11 / 9.5), about
  12pt / 11pt on a 390px iPhone, still at Apple's 11pt minimum. Files: `site/assets/js/jcd-config.js` (`phone.minText` /
  `minLabel`, + `?v=` in every page), `DESIGN-SYSTEM.md`. 手機最小字級改為段落 10px、標籤 9px（原 11 / 9.5）。

### UI/UX review fixes 1-3: readable phone text, 44px tap areas, text contrast UI/UX 審查第 1-3 項：手機字級、觸控範圍、文字對比
Joel: "整個網站最好用我的 uiux skill 尋下" -> review (apple-design skill) -> "Fix 1-3 first".
1. **Phone text**: Wix set descriptions at 6-7px (about 7-8.5pt on a 390px iPhone; Apple minimum 11pt). Now paragraphs at
   least 11px and short labels 9.5px in the 320px layout (`jcd-config.js` `phone.minText` / `minLabel`,
   `src/js/global/phone-text-size.js`). Words never break; text never grows into another item (Joel: "海洋系列文字好像
   有跟其他物件壓到了，都要循一下": checked on all 31 phone pages against text, photos, frames and buttons); each section keeps
   the free space under its last item. About's five two-column lists (Work Experience, Education, Languages, Awards,
   Patents) are real rows on the phone (`src/js/about/two-column-lists-phone.js` + `.css`) so dates and titles stay level.
   Product info tables (Client / Year / Designer / Contribution) stay one size per table; their four narrow columns only
   allow about 6-8.5px (open: a 2 x 2 table on the phone would allow the full size). 產品資訊表每表字級一致（四欄太窄，待議改 2×2）。
   手機字級：段落至少 11px、短標籤 9.5px；不斷字、不壓到其他物件、段落下方留白不變；About 雙欄清單改成真正的列。
2. **Phone tap areas**: every link and button can be pressed from at least 44 x 44 (menu button was 20 x 20, Contact SUBMIT
   26px high, e-mail link 10px). Invisible area, no visual change, never into a neighbour (`src/js/global/phone-tap-targets.js`,
   `src/css/phone/tap-targets.css`). 手機每個連結／按鈕至少 44×44 可按（隱形範圍，外觀不變）。
3. **Contrast**: About recommendation roles white .5 -> .6 (7.4:1), "Former ..." .38 -> .5 (5.3:1); blue section labels on
   Interstellar 05, Wi-Fi 7 Gaming and Ocean Series #37659D (3.5:1) -> `--jcd-blue-text-dark` #4F86CC (5.6:1) on dark pages
   (`src/css/global/tokens.css`, `text-contrast.css`, `src/css/about/recommendation-cards.css`). 對比：About 灰字提亮、黑底頁藍色標籤改亮藍。
- Also: `DESIGN-SYSTEM.md` (contrast rule, phone text minimum, tap areas), `src/*/ORDER.txt`, `src/README.md`, built `custom.*`,
  `?v=` of jcd-config.js in every page.

### Category pages: the same bottom space on every page; T. Blade text -> photo gaps all even 類別頁底部空間一致；T. Blade 文字到圖片間距全部一致
- Joel: "defense 下方黑色空間再多點，太窄了，其他類別頁也是" + "手機下方的黑空間太多了，再縮點。其實每個平台的類別頁底下都要多一些空間".
  The black space under the last item was 92-277px (computer) and 9-258px (phone). Now the same on all six category
  pages: `jcd-config.js` `categoryBottom` (computer + iPad 280, phone 80 CSS px), set by `src/js/category/bottom-space.js`.
  六個類別頁最下方的黑色空間統一（電腦／iPad 280、手機 80），數值在 jcd-config.js。
- Joel: "這兩頁靠太遠" (T. Blade). After "Long-range surveillance" (202px) and after "Dual-Unit Launcher" (206px) the gap
  is now the same as the other text -> photo gaps (computer about 95px, phone 16px). File: `src/css/product/t-blade-stowage.css`.
  T. Blade「Long-range」與「Dual-Unit」後面的大間距縮成跟其他段落一樣。
- Also: built `custom.*`, `src/js/ORDER.txt`, `src/README.md`, `?v=` of jcd-config.js in every page.

### T. Blade: even spacing between text and photos T. Blade 文字與圖片間距平均
- Joel: "這段文字下的圖片靠太近了，拉遠點" + "我覺得都可以在平均點位置，整頁尋一下". Measured the whole page: photo -> title,
  title -> text, the photo grid and the gaps between sections were already even; text -> next photo was not (computer 91px
  and 42px with the tall photo overlapping the text; phone 10px / 3px). Now the same under "Compact Stowage" and
  "In-Flight Deployment" (computer/iPad about 95px box gap, phone 16px clear); the gaps below stay as they were.
  File: `src/css/product/t-blade-stowage.css` (renamed from `t-blade-stowage-phone.css`; `src/css/ORDER.txt`, `src/README.md`), built `custom.css`.
  整頁量過：文字到下一張圖的距離原本不一致（電腦 91 / 42px、手機 10 / 3px），現在兩處一致，其他間距維持。

### T. Blade: top image framing set by Joel; last photo matches the ones above; phone stowage box taller T. Blade 首圖位置、最下方圖尺寸與間距、手機灰方塊加高
- Top image framing per platform as Joel set it in the photo-align mockup (`jcd-config.js` `photoFrames.tBladeHero`).
  首圖位置套用 Joel 在 mockup 調好的各平台數值。
- Joel: "t.blade 最下方的圖尺寸跟上方要一致，且間距要一樣". The last photo (drone on its stand) is now the same size as
  the wide photo above it, with the same gap as between the photos above, measured on every layout (computer, iPad, phone).
  File: `src/js/product/t-blade-last-photo.js`. 最下方的圖改成跟上方大圖同尺寸、同間距（三平台）。
- Joel: "這張圖的手機版灰方塊能加高嗎? 看起來好擠". Phone: the grey box behind the folded drone (Compact Stowage
  Configuration) is 100px tall instead of 60px, drone centred. File: `src/css/product/t-blade-stowage-phone.css`.
  手機版摺疊無人機的灰方塊從 60px 加高到 100px，圖置中。
- Also: built `custom.*`, `src/*/ORDER.txt`, `src/README.md`, `?v=` of jcd-config.js in every page.

### T. Blade top image framing adjustable T. Blade 首圖位置可調
- Joel: "T. Blade 首圖可以讓我調整位置嗎? mockup". The top image is now a per-platform `photoFrames.tBladeHero` entry in
  `jcd-config.js` (starts at the old 50% 45%), adjustable in `preview/mockups/photo-align.html?key=tBladeHero&p=/t-blade/`.
  Files: `site/assets/js/jcd-config.js` (+ `?v=` in every page).
  T. Blade 首圖改由 jcd-config.js 控制（各平台分開，起始值同原本），可在 photo-align mockup 拖曳調整。

### Scroll fade timing set by Joel 捲動淡入採用 Joel 調的數值
- Set in `preview/mockups/scroll-fade.html`: starts appearing at 89% of the screen height, fully visible at the middle,
  soft curve, 0.24s smoothing. Phone, iPad, computer. Files: `site/assets/js/jcd-config.js` (+ `?v=` in every page).
  Joel 在 mockup 調好的數值：畫面 89% 處開始出現、到中央完全顯現、柔和曲線、0.24 秒順暢度，三平台套用。

### Mouse glow removed; scroll fade timing adjustable 取消滑鼠光暈；捲動淡入可調
- Joel: "取消滑鼠光標". The blue mouse glow is gone (files deleted, out of `src/*/ORDER.txt` and `src/README.md`).
  滑鼠藍色光暈已取消。
- Joel: "fade in 給我 mockup，滾動顯現的不同時間順暢度讓我調整". The scroll fade's numbers now live in
  `jcd-config.js` `scrollReveal` (start / end position, curve, smooth seconds), and `preview/mockups/scroll-fade.html`
  shows real pages (computer + phone) with sliders, presets and an auto-scroll demo. The site keeps today's values
  until Joel picks new ones. Files: `site/assets/js/jcd-config.js` (+ `?v=` in every page), `src/js/global/scroll-reveal.js`,
  `src/css/global/scroll-reveal.css`, built `custom.*`, `DESIGN-SYSTEM.md`.
  捲動淡入的數值移到 jcd-config.js（開始／完全顯現位置、曲線、順暢度秒數），並做了 mockup 讓 Joel 調整；網站先維持目前數值。

### Cursor light in front of everything 滑鼠光暈放最前
- Joel: "把滑鼠光暈放最前". The blue mouse glow is now one see-through layer in front of all page content (images,
  video and text too), instead of on the background layers underneath. Clicks pass through; it still starts below the header
  and stays under dialogs and the lightbox. Mouse only (computer; phone and iPad have no cursor). Files:
  `src/css/global/cursor-light.css`, `src/js/global/cursor-light.js`, built `custom.*`, `DESIGN-SYSTEM.md`.
  滑鼠藍色光暈改成一層透明圖層放在所有內容最前面（圖片、影片、文字上也看得到），不擋點擊，標題列與彈出視窗不受影響。

### Wi-Fi 7 Gaming Home Gateway: video without control bar 影片拿掉控制列
- Joel: "最右邊的影片不要有底下的控制攔". The "Sculpted Light Flow" video plays by itself (muted, looping) with no control
  bar, computer + iPad + phone. Files: `site/wi-fi7-gaming-home-gateway/index.html`, `site/m/wi-fi7-gaming-home-gateway/index.html`.
  「Sculpted Light Flow」段落右邊的影片拿掉下方控制列，照樣自動靜音循環播放（電腦、iPad、手機）。

### Scroll fade follows the scroll; new net photo on T. Interceptor MP; Gemtek photo at the bottom of home 捲動淡入跟著捲動；MP 換網子圖；首頁底圖換 Gemtek
- Joel: "滾動動畫其實是 fade in，滾到畫面中央逐漸顯現，往上滾消失". The scroll reveal is now tied to the scroll position:
  content fades in as it moves from the bottom edge to the middle of the screen and fades out again when scrolling back;
  no float. Phone, iPad, computer. Files: `src/js/global/scroll-reveal.js`, `src/css/global/scroll-reveal.css`, built `custom.*`, `DESIGN-SYSTEM.md`.
  捲動動畫改為跟著捲動位置：從畫面底部到中央逐漸顯現，往上捲再淡出，不再上浮。
- T. Interceptor MP image 06 is now the drone net in the forest (`t-interceptormp-06-2560x1476.webp`, phone `-1120x646`).
  Home bottom (GET IN TOUCH) image is now the Gemtek device in hand (`home-01-2560x1276.webp`, phone `home-32-960x478.webp`);
  the social preview JPG is unchanged. Originals in `media-originals/`, recorded in `reference/media-map.json`.
  MP 第 06 張換成森林中的捕捉網；首頁最下方 GET IN TOUCH 底圖換成手持 Gemtek（WebP 輕量檔）。

### Scroll reveal on every page, like the original Wix site 捲動顯現（仿原 Wix 網站）
- Joel: "最後一步，原本 wix 網站我設計每個 section (除了最上方、最下方的圖片外)，其他都是滑鼠滾動時顯現。你能做到嗎? 你可以去爬原本是怎麼做的". The export had removed Wix's per-element entrances; the archived language copies still hold Wix's animation definitions: mostly "Float In" (60), "Fade In" (16), a few Fold / Slide In. Now, on phone, iPad and computer: in every top-level section except the first (top image / page title) and a bottom image section (photo background or photo only), each piece of content (big wrappers are split into their parts) fades in and floats up 40px (phone 24px) over 1.1s when it scrolls into view, pieces 0.09s apart. Content on screen at load is never hidden; the movement exists only while the animation runs (position-measuring effects unaffected); off under reduced motion; printing shows all.
  每頁除了最上方與最下方的大圖外，各段內容捲到時淡入上浮，同段依序出現；手機、iPad、電腦。
- Checked: home (video frame / glow positions unchanged after the reveal), T. Interceptor MP phone page (all 43 waiting pieces appear), category pages, About, MoAI, Defense.
- Files: `src/js/global/scroll-reveal.js`, `src/css/global/scroll-reveal.css` (new), `src/*/ORDER.txt` → built files, `?v=` in all page HTML, `src/README.md`, `DESIGN-SYSTEM.md`.

### Present: grey with a continuous blue sweep; MoAI hand framing per platform; T. Interceptor MP award badge 三項調整
- Joel: "Present 我想改成原本的灰字，但可以從左到右循環填滿藍色，或是字體有跳動循環的感覺。可以先做 mockup" → picked C "藍光掃過…應該一直循環掃". "Present" is the original grey again with a blue light sweeping left to right without a break (repeating band moved one tile per 2.6s loop); plain grey under reduced motion. Mockup: `preview/mockups/present-options.html`.
- MoAI hand photo: "摩艾頭手部那張也可以做出 mockup 讓我調整個平台的位置" → `preview/mockups/photo-align.html?key=moaiHand&p=/moai-router/` (one setting per platform); Joel's values in `jcd-config.js` `photoFrames.moaiHand`: computer x0 / 1.15x, iPad landscape x15 / 1.12x, iPad portrait x22 / 1.19x, phone x36 / 1.23x. `photo-frames.js` now reads per-platform values.
- T. Interceptor MP: "獎項標籤跟文字有歪掉，標章要裁切成正方(把圖片文字裁掉)，然後把下方的字移上去". The Golden Pin badge is now only the square gold mark (`t-interceptormp-04-120x120.webp`, cut from the original logo, now `media-originals/t-interceptormp/t-interceptormp-04-775x342.png`); computer/iPad 33px square beside the text, phone 26px with the award text moved up beside it, top-aligned.
- Files: `src/css/about/present-glow.css`, `src/css/product/t-interceptormp-award.css` (new), `src/js/global/photo-frames.js`, `site/assets/js/jcd-config.js` → built files, T. Interceptor MP pages, images, `reference/media-map.json`, mockups, `?v=` in all page HTML.

### MoAI: hand photo from Joel's wider original, more of the hand MoAI 手部照片換更寬原圖
- Joel: "moai 的這張圖，可以往右移嗎? 手想露多一點" (the Wix copy cut the hand at its own edge) → wider original `media-originals/moai-router/moai-router-13-4000x2053.jpg`. Computer/iPad `moai-router-13-2560x1314.webp` anchored left (whole hand, product right of centre); phone `moai-router-30-1120x575.webp` anchored 22% from the left (hand + whole product in the narrow box).
  換成手比較完整的原圖；電腦／iPad 靠左顯示整隻手，手機調整位置讓產品完整。
- Files: `site/moai-router/index.html`, `site/m/moai-router/index.html`, images, `reference/media-map.json`.

### About Work Experience: "Present" glows; "Remote MO, USA" 關於頁目前職位
- Joel: "present 字體提亮，幫我上藍色呼吸發光。後面 USA 改成 MO, USA。Remote 後要空一格". "Present" (current job) is white Medium with a soft blue glow breathing in 3s (steady glow under reduced motion); the location reads "Remote MO, USA" with a fixed space after "Remote" (computer + phone pages).
  Present 提亮並加藍色呼吸光；地點改為 Remote MO, USA。
- Files: `site/about/index.html`, `site/m/about/index.html`, `src/css/about/present-glow.css` (new) → built `custom.css`, `?v=` in all page HTML.

### T. Guardian photo moved to the Selected tile; GET IN TOUCH image restored; white-page rule enforced 圖片換位置、白底規則
- Joel: "錯了，首頁最底下的圖要改回來，剛剛 t. guardian 的要更新替換在首頁 12 張小圖的其中一張" / "我注意到你又把我的某些產品子頁的白背景改掉了。應該寫進 md 裡，不然都被忽略".
- Home "Let's Shape the Next Product Together / GET IN TOUCH" background: back to the original (`home-01-2560x1828`, as WebP; social preview JPEG and og size restored; phone `home-32-640x430.webp`).
- Home Selected grid "Defense / T. Guardian" tile (`home-16`, all four sizes): the new T. Guardian photo, as `home-16-<size>-v2.webp`; original `media-originals/home/home-16-2898x1628.jpg`.
- White pages: AGENTS rule 9 rewritten as a hard rule naming the 10 white pages; DESIGN-SYSTEM marks the white page background "never change"; new `tools/check_site.py` (fails on a dark-canvas class or a dark rule on those pages, a missing file, a PNG, or stale built files) — AGENTS 9b: run it before every commit. Today's check: all 10 white pages are white (computer + phone, locally and on the live site).
  白底規則寫成硬性規定並加自動檢查；首頁 GET IN TOUCH 換回原圖，T. Guardian 新圖放到精選 12 格的 Defense。
- Files: `site/index.html`, `site/m/index.html`, home images, `media-originals/home/home-16-2898x1628.jpg`, `reference/media-map.json`, `tools/check_site.py` (new), AGENTS, DESIGN-SYSTEM.

### All site photos WebP (~46% lighter); new T. Guardian image behind "GET IN TOUCH" 照片全部轉 WebP；首頁 T. Guardian 換圖
- Joel: "Yes, convert them" (JPG photos → WebP) / "我放了一張圖在 media new 裡，可換掉首頁圖的 t.guardian。你可以轉檔跟重新命名，符合你剛剛 webp 的作法".
- 988 JPEG photos → WebP q86 (`tools/jpg_to_webp.py`): 123.5 MB → 67.1 MB; with the PNG change before, the site's images went from ~180 MB to 82 MB. JPEG copies kept only for social / search previews (og:image, twitter:image, JSON-LD), which don't reliably show WebP. Old → new: `reference/jpg-to-webp-2026-11-27.json`. All references checked.
  988 張照片轉成 WebP，從 123.5 MB 降到 67.1 MB；社群分享預覽仍用 JPG。
- Home "Let's Shape the Next Product Together / GET IN TOUCH" background (the T. Guardian image): new photo `media-originals/home/home-01-2898x1628.jpg` → computer `home-01-2898x1628.webp` (q90), phone `home-32-960x539.webp`, social preview `home-01-2898x1628.jpg` (og:image size updated). Checked on phone, iPad, computer.
- Image rule updated (AGENTS, DESIGN-SYSTEM): WebP for every site image (q86, top images q90), JPEG only as social-preview copy.
- Files: `site/assets/media/**`, all page HTML, `src/**` → built files, `reference/media-map.json`, `tools/jpg_to_webp.py` (new), AGENTS, DESIGN-SYSTEM.

### Images load faster: PNG → WebP / JPEG; End-to-End arrow gradient removed 圖片變輕；取消箭頭漸層
- Joel: "好像很多圖片讀取很慢" / "取消剛剛箭頭下的方塊漸層". 191 site images were PNG (lossless, 56 MB). The 183 with transparency (cut-out products, logos, icons) are now WebP with transparency (q86; small ones lossless): 55.8 MB → 7.6 MB; the 8 opaque ones JPEG q86 4:4:4. All references updated (pages, CSS masks, built files, `reference/media-map.json`); list of old → new in `reference/png-to-web-2026-11-27.json`; tool `tools/png_to_web.py`. Checked: 4,690 references resolve; WebP images load on phone, iPad, computer; home logo / Cross-Category grid unchanged.
  191 張 PNG 改成 WebP（透明）或 JPG，圖片總量從 56 MB 降到約 8 MB。
- End-to-End: the black gradient strips under the arrows (added earlier today) removed.
- Files: `site/assets/media/**` (PNG → WebP/JPG), all page HTML, `src/css/global/header-icons-hover.css`, `src/css/phone/mobile-fixes.css`, `src/js/home/end-to-end-slider.js`, `src/css/home/end-to-end-arrows.css` → built files, `reference/media-map.json`, `tools/png_to_web.py` (new), AGENTS, DESIGN-SYSTEM.

### T. Scope now uses T. Interceptor MP's layout (blank), whole page encrypted T. Scope 改用 T. Interceptor MP 版型
- Joel: "t scope 的空白公版頁請按照 t.interceptor mp 的做法與排版，你可以拿他多複製出來清除內容即可". `tools/make_blank_page.py` copied T. Interceptor MP (computer + phone) into `private/t-scope/page.html` / `page-m.html`: name "T. Scope", category "Defense", Client / Year / Designer / Contribution labels kept (Tron Future, [Year], Joel Chang, [Contribution]), every other text "[Heading]" / "[Placeholder text …]", top image the T. Scope photo, all other images `shared-05-1600x1000.jpg` (new neutral placeholder), JSON-LD removed, noindex. Encrypted as whole pages into `site/t-scope/protected.json` and `site/m/t-scope/protected.json`; the locked shells route phone / computer like every page, and after the right password the whole page replaces the shell (all site effects run). Checked: wrong password rejected, right password opens the full page on the computer; the phone shell and the phone copy decrypt.
  T. Scope 改用 T. Interceptor MP 的版型並清空內容；電腦與手機版整頁加密，輸入正確密碼後顯示完整頁面。
- Files: `site/t-scope/index.html`, `site/t-scope/protected.json`, `site/m/t-scope/index.html` + `protected.json` (new), `site/assets/js/protected-page.js`, `site/assets/media/shared/shared-05-1600x1000.jpg` (new), `tools/make_blank_page.py` (new), `tools/protect_page.js`, AGENTS, README.

### Home End-to-End: black gradient strip under each arrow End-to-End 箭頭下方黑漸層
- Joel: "這個左右邊箭頭下可以壓整長方形塊黑漸層嗎? 高度跟圖方塊一樣高". Under each arrow a strip as tall as the squares, black at the screen edge (78%) fading to clear toward the middle; shown only while its arrow is shown. Computer + iPad (the phone slider has no arrows).
  每個箭頭下方加一塊和方塊同高的黑色漸層，箭頭出現時才顯示。
- Files: `src/js/home/end-to-end-slider.js`, `src/css/home/end-to-end-arrows.css` → built files, `?v=` in all page HTML.

### Fix: phone category pages — cards pushed out of their frames, bottom cut off 修正：手機類別頁卡片跑出白框、底部被裁
- Joel: "電子產品類別頁 1. 筆電跑出上方白框了 2. 滾到下方被裁掉了" / "其他頁也有這問題". The phone spacing script (`category/spacing-phone.js`) treated the photo card inside a frame with a title bar (e.g. "Computer" → SAGITTARIUS) as a separate frame and pushed it below; the extra push made the content longer than its section, so the last cards were cut. Now a card inside an earlier frame moves with that frame, and the section follows the moved frames both ways. Checked all six category pages on the phone: no card outside its frame, nothing past the page end.
  卡片在有標題的白框內時會跟著白框移動；段落高度跟著調整，六個類別頁都檢查過。
- Files: `src/js/category/spacing-phone.js` → built `custom.js`, `?v=` in all page HTML.

### Defense: "Admiral Li …" caption flush with the photo above 說明文字貼齊照片左緣
- Joel: "這段文字要靠正上方圖的最左邊貼齊". On computer + iPad the caption under the Singapore Airshow photo sat 13px left of it (the photos had been moved to line up with the frames, the caption had not); now it starts at the photo's left edge (phone already did).
- Files: `src/css/product/defense-website.css` → built `custom.css`, `?v=` in all page HTML.

### Touch card labels: smaller >> on the phone, larger product names; website caption wording 觸控卡片標籤與網站圖標題
- Joel: "手機板的 >> 圓圈都太大了" / "手機版跟平板觸碰版的產品類別頁的名稱…字體都一樣大，把產品名稱字體加大" / "Design Refinement & Build 看起來沒有合力貢獻的感覺…這是團隊合作，我也協助打磨".
- Phone circles: category cards 30 → 22px, home Selected grid 22 → 18px, Design Approach card 20 → 18px. Product names: phone 11 → 14px (brand line 9px), iPad 22 → 30px (brand 16px).
- Defense website caption: "Company Website | Brand Visual Identity | Team Collaboration & Refinement".
- Files: `src/css/category/cards-linked.css`, `src/css/category/cards-ipad-sizes.css`, `src/css/home/selected-grid.css`, `src/css/home/design-approach-card1.css`, `src/js/product/defense-website.js` → built files, `?v=` in all page HTML, `DESIGN-SYSTEM.md`.

### T. Scope page (black product template) protected by a password; password field in the Guest Area dialog T. Scope 子頁與密碼
- Joel: "先幫我準備一個黑底產品子頁 frame 頁充當 t.scope 子頁。然後一樣 get request access 要有輸入密碼的欄位".
- New `site/t-scope/`: black product page template (hero, kicker + title + lede, Client / Year / Designer / Contribution row, overview text, 16:9 and 4:3 white-framed images with placeholders, design details, three features, closing image), one responsive page for phone / iPad / computer (`site/assets/css/product-page.css`). Hero/closing: the T. Scope photo (`defense-03`); the rest are placeholders for Joel's content.
- Real protection: the content is encrypted (`site/t-scope/protected.json`, AES-256-GCM, key from the password via PBKDF2-SHA256 600k) by `tools/protect_page.js` from `private/t-scope/content.html` (git-ignored). The password is not on the site; `site/assets/js/protected-page.js` decrypts in the browser. Gate on the page itself; Guest Area dialog: password + ENTER (wrong → "Incorrect password."; right → opens T. Scope, unlocked for the browser session), then "No password? Request access" with the request form. `noindex`, not in the sitemap.
  T. Scope 子頁內容加密後才上線，網站上沒有密碼；Guest Area 視窗可輸入密碼進入，或寄出申請。
- Checked locally: wrong password rejected, right password opens the page (dialog and page gate).
- Files: `site/t-scope/index.html`, `site/t-scope/protected.json`, `site/assets/css/product-page.css`, `site/assets/js/protected-page.js`, `tools/protect_page.js` (new), `src/js/product/guest-area-dialog.js`, `src/css/product/guest-area-dialog.css` → built files, `.gitignore` (`private/`), README, AGENTS, DESIGN-SYSTEM.

### AI Tool Kit: ParaVents image zooms on hover; separate "Try Now" button removed ParaVents 放大、移除 Try Now 按鈕
- Joel: "paravents 的 hover 要 zoom in。然後下方的文字右邊的 try now 按鈕拿掉". The ParaVents image (link to the trial) zooms in 6% inside its frame on hover (touch: while pressed), with the existing "TRY NOW" overlay; the "Try Now" button beside the description is hidden on phone, iPad and computer.
  ParaVents 大圖滑過放大 6%；說明文字右邊的 Try Now 按鈕移除。
- Files: `src/css/product/ai-tool-kit-paravents.css` (new), `src/css/ORDER.txt` → built `custom.css`, `?v=` in all page HTML, `src/README.md`.

### T. Xcalar photo: Joel's framing applied T. Xcalar 照片套用 Joel 的對齊
- Joel aligned it in `preview/mockups/photo-align.html` ("搞定"): `photoFrames.xcalar` x 46, y 26, zoom 1.19 (computer, iPad, phone). 依 Joel 對齊的數值寫入設定。
- Files: `site/assets/js/jcd-config.js`, `?v=` in all page HTML.

### Fix: photo framing zoom was ignored 修正：照片放大沒有作用
- Joel: "沒辦法放大欸". A site rule that forbids transforms inside category tiles (`static-overrides.css`) overrode the zoom; `photo-frames.js` now sets it with priority. Checked on computer, iPad and phone in the tool. 照片放大被既有規則蓋掉，已修正。
- Files: `src/js/global/photo-frames.js` → built `custom.js`, `?v=` in all page HTML.

### T. Xcalar photo larger + alignment tool T. Xcalar 照片放大與對齊工具
- Joel: "Xcalar 圖片要放大點。做mockup 讓我調". The card now uses the whole photo (`defense-09-2560x1626-v2.jpg`, phone `defense-09-1120x711-v2.jpg`; the earlier pre-cropped files removed) framed by `jcd-config.js` `photoFrames.xcalar` (point x / y kept in view, zoom; start 50 / 40 / 1.2x), applied by `src/js/global/photo-frames.js` on every device. New tool `preview/mockups/photo-align.html`: the real Defense page on computer, iPad and phone; drag the photo, zoom slider or Shift + wheel; one setting for all devices.
  T. Xcalar 改用完整照片並以設定檔控制取景，先放大 1.2 倍；新增對齊工具讓 Joel 自己調。
- Files: `site/assets/js/jcd-config.js`, `src/js/global/photo-frames.js` (new), `src/js/ORDER.txt` → built `custom.js`, `site/defense/index.html`, `site/m/defense/index.html`, images, `reference/media-map.json`, `preview/mockups/photo-align.html` (new), `?v=` in all page HTML.

### Defense bottom: exhibitions + website image aligned to the frames; website caption + zoom 底部對齊、網站圖加標題與放大
- Joel: "2025 taipei aerospace 的整個 section 跟下方的大圖按紐左右寬度要跟上面的產品白框對其" / "這張圖要 hover zoom in，且上方有一條線跟字，字寫 Website - Brand Visual Identity - 參與打磨建構". On computer + iPad the exhibition titles/photos and the Tron Future website image sat 13-14px left of the product frames; now the same left and right edges (phone already matched). The website image gets a caption bar like the exhibition titles: "Website | Brand Visual Identity | Design Refinement & Build" + line (phone sizes of the phone page; image moved down on the phone to fit), and its photo zooms in 6% inside the frame on hover (touch: while pressed).
  展覽段落與網站大圖左右對齊產品白框；網站圖上方加標題列，滑過照片放大。
- Files: `src/js/product/defense-website.js`, `src/css/product/defense-website.css` (new), `src/*/ORDER.txt` → built files, `?v=` in all page HTML.

### Guest Area: "Request access" emails Joel directly; larger on iPad 訪客區直接寄信、iPad 放大
- Joel: "request the access 就直接寄信給我了，不要連到contact了" / "ipad 版的 request for access 的視窗太小了". The dialog now has Name, Email (required), Company / organization and a "REQUEST ACCESS" button: the request is emailed to Joel through Web3Forms (subject "T. Scope access request"), with the visitor's time zone and browser language as a rough region (no location service). "Request sent / Thank you" view after sending; error line with the fallback email if sending fails. Fields use the Contact underline style. iPad: dialog drawn 1.35x (landscape) / 1.8x (upright) → about half / two thirds of the screen width (`html.jcd-tablet`, new class from `site.js`).
  Request access 改成在視窗內填寫並直接寄給 Joel，附上對方時區與瀏覽器語言；iPad 視窗放大。
- The Web3Forms settings moved to `jcd-config.js` `forms` (Contact form and Guest Area share them).
- Files: `site/assets/js/jcd-config.js`, `site/assets/js/site.js`, `src/js/product/guest-area-dialog.js`, `src/css/product/guest-area-dialog.css`, `src/js/contact/contact-form.js` → built files, `?v=` in all page HTML.

### Defense: new "T. Xcalar" card in the T. Guardian group 新增 T. Xcalar 白框
- Joel: "T. Guardian 下方新增一個白框可跟 guardian 視為一組。叫做 T. Xcalar" (photo: `Xcalar+Guardian(Final).jpg`). A photo card under the "Field Protection" frame, spaced like the Airspace Protection group (computer 34px, phone 8px), caption "Tron Future / T. Xcalar", no ">>" (no product page yet). Made by cloning the T. Guardian photo card (new ids `comp-jcdxcal0-4`) with its Wix layout rules in a `<style id="jcd-xcalar">` block on each page; phone, iPad and computer checked (same size as the Guardian card).
  T. Guardian 下方新增 T. Xcalar 照片卡，和 Guardian 同組；手機、iPad、電腦都確認過。
- Images: original `media-originals/defense/defense-09-5636x3580.jpg`; site `defense-09-2560x1404.jpg` (computer/iPad), `defense-09-560x307.jpg` (phone), JPEG q86 4:4:4, cropped to the card ratio keeping the top; recorded in `reference/media-map.json`.
- Files: `site/defense/index.html`, `site/m/defense/index.html`, images above.

### Old /scope address opens the Guest Area dialog 舊的 /scope 網址改為跳出視窗
- Joel: "等等 我還是要改成彈出視窗". `/scope` (and `/m/scope`) no longer show the Wix password page: they forward to Defense with `?guest=1`, which opens the Guest Area dialog at once (also after the phone/computer switch: `site.js` now keeps the query when it redirects). `/scope` removed from `sitemap.xml` and marked `noindex`. 舊網址、書籤、搜尋結果打開 /scope 都會回到 Defense 並直接跳出視窗。
- Files: `site/scope/index.html`, `site/m/scope/index.html`, `site/sitemap.xml`, `site/assets/js/site.js`, `src/js/product/guest-area-dialog.js` → built `custom.js`, `?v=` in all page HTML.

### T. Scope: Guest Area dialog instead of the separate password page 訪客區改為彈出視窗
- Joel: "取消單獨的 Guest Area tab，跳像contact 寄出後的那種視窗，文字都要用我的design system". The Defense "T. SCOPE" card (photo, title, >>) no longer opens the separate Wix "Guest area" password page; it opens a dialog in the Contact "sent" style: dark glass panel (8px), round blue lock, "Guest Area", "T. Scope is a confidential defense project, shared on request.", "REQUEST ACCESS" → Contact (turns blue on hover/press), × / Esc / outside to close. The protected content was never on this site, so there is no password field. Phone, iPad and computer (one tap opens it). 點 T. SCOPE 改跳出設計系統樣式的視窗，按鈕連到 Contact；沒有密碼欄（受保護內容不在本站）。
- Files: `src/js/product/guest-area-dialog.js`, `src/css/product/guest-area-dialog.css` (new), `src/js/global/one-tap-links.js`, `src/*/ORDER.txt` → built files, `?v=` in all page HTML, `src/README.md`, `DESIGN-SYSTEM.md`.

### Home End-to-End: text in the squares larger again End-to-End 方塊文字再放大
- Joel: "end to end 的圖片內文字再放大". Computer + iPad: title 34 → 40px, text 16 → 19px (all 9 squares fit, ≥30px to the edges). Phone: title 13 → 14px, text 9.5 → 10px; on the ~149px phone squares the descriptions are cut after 7 lines ("…"). 電腦／iPad 標題 40、內文 19px；手機 14／10px，手機的說明文字超過 7 行會截斷。
- Files: `src/css/home/end-to-end-text.css` → built `custom.css`, `?v=` in all page HTML, `DESIGN-SYSTEM.md`.

### Every file renamed and sorted: originals, videos, fonts, Wix CSS 所有檔案重新命名分類
- Joel: "media-originals 裡的圖片是亂碼跟散的欸，我想要所有圖片都整理好重新命名。其他資料夾的都要整理分類與命名".
- `media-originals/`: 429 originals → `media-originals/<page>/<page>-<nn>-<w>x<h>.<ext>`, same page + number as the site image made from it; 41 that no page uses → `_unused/unused-<nn>-<w>x<h>`. 原始圖依頁面分資料夾，和網站圖片同編號。
- Videos → `site/assets/video/<page>/<page>-video-<nn>-<quality>.mp4`; fonts → `site/assets/fonts/<family>/<family>-<weight>[-italic][-<subset>].<ext>` (poppins, poppins-google, caudex, avenir, helvetica …); all Wix CSS (30 in `css/`, 40 in `files/`) → `site/assets/wix/` as `component-<name>.css` / `page-<page>-<n>.css` / `main.css` …; `site/assets/css/` now holds only `custom.css` + `static-overrides.css`; favicon → `files/favicon.ico`. 影片、字體、Wix 樣式都改成可讀的名稱並分資料夾。
- 617 files moved with git (history kept); 147 references updated in every page and CSS; `reference/media-map.json` points to the new originals (old name kept as `original_name`); full old → new list `reference/rename-map-2026-11-27.json`. Checked: all 4,592 file references resolve; phone / iPad / computer load fonts and videos with no missing files.
- Docs: README folder map, AGENTS (naming rules), `media-originals/README.md` (new), `reference/README.md`.

### Interstellar 05 closing video: same breathing glow as the home video Interstellar 影片光暈
- Joel: "interstellar 最下方的影片背景光暈也要參考首頁下方影片光暈的動態效果". The home video code now serves a list of videos: Interstellar 05's Vimeo player is lined up with the black window of its glow frame (2560×1526, window 157-2409 × 127-1395), overscanned and clipped (no dark edges), with the breathing blue light and the frame image dimming in step (4.5s). Rules now use shared classes `.jcd-vbox` / `.jcd-vframe` / `.jcd-vglow` instead of the home IDs.
  首頁影片的光暈程式改成可套用多支影片；Interstellar 影片對齊光框、去黑邊，並加上同樣的呼吸光暈。
- Files: `src/js/home/video-frame.js`, `src/css/home/video-frame.css`, `src/css/home/video-glow.css` → built `custom.js` / `custom.css`, `?v=` in all page HTML, `DESIGN-SYSTEM.md`.

### Home End-to-End squares: smooth darkening + zoom-in End-to-End 方塊壓黑變順＋放大
- Joel: "end to end 的方塊hover 後壓黑動畫有點不順。然後我要加點zoom in". The darkening was on the overlay site.js inserts/removes on every hover, inside a layer that also faded (eased twice, restarted from zero). Now one dark layer stays on each square and only fades (.7s; 36% computer, 60% touch); the photo eases in 8% inside its frame (1.2s). Computer on hover, phone/iPad while the overlay shows; off under reduced motion.
  壓黑改成每個方塊固定一層、只改透明度，不再每次重建；照片在框內放大 8%。
- Files: `src/css/home/end-to-end-hover.css` (new), `src/css/ORDER.txt`, built `custom.css`, `?v=` in all page HTML, `src/README.md`, `DESIGN-SYSTEM.md`.

### About "What I Believe" photo: aligned by hand, framing kept in the config 照片手動對齊並寫入設定
- Joel: "what i believe 的手機板、ipad版(直) 圖片跑掉了。能夠做給我一個mockup我手動對其嗎? 且不管我未來有沒有調整頁面，都已設定為主". Then: "手機板的至少讓我放大縮小上拖曳吧" / "手機板好像沒辦法往上托，上方會被遮到卡住".
- New tool `preview/mockups/believe-align.html`: the real About page on phone, iPad portrait and landscape; drag the photo, zoom 0.4–3x (slider or Shift + wheel), iPad upright window height; Save. 對齊工具：拖曳、縮放、iPad 直向視窗高度。
- The framing is now a rule in `jcd-config.js` `believe` (the speaker's face, point 0.26 / 0.62 of the photo, lands at a chosen place of the window, at a chosen zoom) and `believe-reveal.js` re-computes it from the real window size on every layout, so it holds whatever changes around it. Joel's values: phone sx .182 sy .475 zoom 1.55; iPad portrait sx .128 sy .552 zoom 1.34, window 37% of the screen; iPad landscape sx .113 sy .579 zoom 1.23. Phone photo window = the section itself (before: a full screen, the top half hidden under the page above). Computer unchanged (whole photo, centred).
  取景改成設定檔裡的規則，每次排版依實際視窗重算，頁面以後怎麼改都維持；手機照片視窗改為段落本身。電腦版不變。
- Files: `site/assets/js/jcd-config.js`, `src/js/about/believe-reveal.js` → built `custom.js`, `preview/mockups/believe-align.html` (new), `?v=` in all page HTML, `DESIGN-SYSTEM.md`.

### Home top slideshow: "1/10" counter hidden 首頁首圖不顯示張數
- Joel: "首頁首圖右下角不要有 1/10 這種數量示意，直接隱藏". Hidden on phone, iPad and computer. 手機、iPad、電腦都隱藏。
- Files: `src/css/home/hero-no-counter.css` (new), `src/css/ORDER.txt`, built `custom.css`, `?v=` in all page HTML, `src/README.md`, `DESIGN-SYSTEM.md`.

### Home Selected grid: smaller round >> 首頁精選 12 格的 >> 圓圈縮小
- Joel: "首頁12個小圖的">>"圓圈太大，幫我縮小". Computer 34 → 26px, iPad 46 → 34px, phone 30 → 22px (arrow text in step). 電腦 34→26、iPad 46→34、手機 30→22px。
- Files: `src/css/home/selected-grid.css` → built `custom.css`, `?v=` in all page HTML; `DESIGN-SYSTEM.md`.

### custom.css / custom.js split into one file per effect (src/) 拆成一個效果一個檔
- Joel: "Yes, split them". The 690-line `custom.css` and 1300-line `custom.js` now live as 54 CSS and 33 JS files in `src/css/<area>/` and `src/js/<area>/` (areas: global, home, about, category, product, contact, phone). `tools/build_assets.py` joins them in the order of `src/*/ORDER.txt` back into `site/assets/css/custom.css` / `site/assets/js/custom.js` (pages still load one file each) and bumps `?v=`. The rebuilt CSS is byte-identical to before; the JS differs only where one `ready()` held seven unrelated blocks, now one per file (the contact-form block had been nested inside the header block's `if`; now separate). Checked: every piece parses alone; home, About, Contact and Networking effects present on phone, iPad portrait/landscape and computer, no console errors.
  690 行的 custom.css 與 1300 行的 custom.js 拆成 `src/` 裡 54 個 CSS、33 個 JS 檔（依頁面分區）；`build_assets.py` 依 ORDER.txt 組合回原本的兩個檔並更新 ?v=。CSS 組合結果與原本逐位元相同；JS 只有原本擠在同一個 ready() 的七段改成各自獨立。四種裝置都檢查過，沒有錯誤。
- Docs: `src/README.md` (new, file list), README folder map, AGENTS (edit `src/`, never the built files), DESIGN-SYSTEM, `tools/README.md`, TODO.
- Files: `src/**` (new), `tools/build_assets.py` (new), `site/assets/css/custom.css`, `site/assets/js/custom.js` (now generated), `?v=` in all page HTML, docs.

### Structure clean-up: one config for layout numbers, folders tidied, bilingual docs, text clean-up 架構整理
- Joel: "把各平台(橫直)左右要留多間距寫成規則…整理我的design system、本地資料夾與線上的架構…很多東西可以共用同個參數修改…所有 md 都要中英對照…三平台預覽預設打開規則", plus an outside review of the copy (alt text, language, typos, ESG heading, DFM wording).
- **Layout config 版面設定**: new `site/assets/js/jcd-config.js`, loaded before `site.js` on every page and read by `preview/devices.html`: `uiScale`, `desktopRef`, and the **iPad side-margin rule** (5.35% each side, landscape and portrait) with content widths per page type (product 1284, About 1211, home/Contact 1179). Resulting iPad widths: product pages 1438, About 1356, home/Contact 1320 (≈ the widths Joel approved). `site.js` and `devices.html` no longer hold their own copies.
  新增 `jcd-config.js`：整體縮放、螢幕基準寬、**iPad 左右留白規則**（直橫各 5.35%）與各類頁面內容寬，全站與三平台預覽共用同一份。
- **Folders 資料夾**: Wix export scripts → `tools/export-wix/` (history, not to run); design studies → `preview/mockups/` (paths fixed); export screenshots/comparisons/update rounds → `reference/archive/`; 85 old Wix-named images that no page used removed from git and moved with the other 56 loose ones to `reference/archive/unused-wix-media/` (local only, git-ignored). Short README in `preview/`, `tools/`, `reference/`, `content/`.
  匯出腳本、mockup、舊截圖與沒用到的 Wix 圖各自歸檔；各資料夾加上說明。
- **Docs 文件**: README (folder map, how a page is built, local work, publishing), AGENTS (rules incl. "three-device preview opens by default and stays open"), DESIGN-SYSTEM (new §0 "one place for each number", §4 side-margin table per platform, copy rules), TODO, PAGES (page types), ASSETS (recounted), i18n-archive and media-new notes — all English + Chinese.
  所有 md 改為中英對照；README 有完整資料夾地圖與串接方式；AGENTS 寫入三平台預覽預設開啟規則。
- **Text 文字** (`tools/clean_text.py`, re-runnable): 276 image alt texts that were file names (`未命名-1`, `螢幕擷取畫面 …`, `thermal vision(PLA).jpg`, `LINE_ALBUM_…`, `ok.jpg`, `fffs1.png` …) → clean English (descriptions for the key ones, "<Product> design detail <n>" for the rest; background glows empty); Wix labels left in Chinese (skip link "跳到主要內容", social bar, menu, video, password dialog) → English; `T.Interceptor` → `T. Interceptor`; `Marcus Kung (Design Director)`; Wi-Fi 7 HGU/AP decorative "ESG" text mask no longer an `<h1>`; the DFM paragraph rewritten action-first ("Rather than trade the design intent for cost, I …"). The two "Screenshot 2025-01-12 104631" images on HGU/AP are different pictures (pain point / solution) that shared a name — not a duplicate. `<html lang="en">` was already set on every page; the Chinese came from Wix's labels.
  替代文字、Wix 中文介面字、產品名空格、括號空格、ESG 標題、DFM 語氣一併修正；HGU/AP 那兩張不是重複貼圖，只是同名。
- Files: `site/assets/js/jcd-config.js` (new), `site/assets/js/site.js`, `site/assets/css/custom.css` (comments), all 72 page HTML, `preview/devices.html`, `preview/mockups/*`, `tools/clean_text.py` (new), `tools/export-wix/*`, `reference/archive/*`, `.gitignore`, all `.md`.

### One tap opens the page; whole category card clickable; iPad About width; End-to-End arrows
- Joel: "平板我按產品類別頁的白框，按第一次是按鈕填滿藍色動畫，第二次才會進到下一頁。全面幫我檢查". Cause: Wix put each card's link on its white frame / title bar / >>, not on the photo, so tapping the photo only triggered the hover state (blue fill); iOS also spends a first tap on :hover. Now any click/tap anywhere on a linked card opens it (every platform), and on touch devices (phone + iPad) a short tap on any link opens it at once (not in the top menu). Checked by simulated taps on iPad, phone and a click on computer.
- "平板的about左右寬度要跟產品列別頁白框左右寬度一樣": iPad About laid out 1352 wide → text/photo block 5.3% from the edges, like the category frames (77/1440).
- End-to-End (iPad): the arrows sat off the screen / cut at the edge; now pulled 14px inside the screen over the photos with a soft shadow. Arrows thicker on every platform ("箭頭可以粗點").
- Files: `site/assets/js/custom.js`, `site/assets/js/site.js`, `site/assets/css/custom.css`, `preview/devices.html`, `DESIGN-SYSTEM.md`, `AGENTS.md`, `?v=` in all `site/**/index.html`.

### iPad: category + product pages smaller again (1440)
- Joel: "Ipad 直跟橫的產品列別頁、產品介紹頁太貼左右邊了，整體縮小。其他頁面都不動". On iPad (both orientations) category and product pages are laid out 1440px wide (~65px margin each side); home, About, Contact and 1-4 stay 1320. The devices preview picks the same width per page.
- Files: `site/assets/js/site.js`, `preview/devices.html`, `DESIGN-SYSTEM.md`, `AGENTS.md`, `?v=` in all `site/**/index.html`.

### Home End-to-End: larger text in the squares
- Joel: "end to end 圖片裡面的字體可以大些". Computer + iPad: title 28 → 34px, text 12 → 16px (line height 1.55); checked all 9 squares fit. Phone: title 12 → 13px, text 8 → 9.5px.
- Files: `site/assets/css/custom.css`, `?v=` in all `site/**/index.html`.

### iPad: everything larger, landscape and upright
- Joel: "ipad 直式的所有畫面要更大" / "ipad 橫式也是左右太多，整體可放大". Measured every desktop page: content that must stay whole spans at most ~1305px around the centre (wider items are bleeding photos). The iPad now lays the page out 1320px wide in both orientations (landscape was 1694 → 28% larger; upright was 1440 → 9% larger).
- Files: `site/assets/js/site.js` (`TABLET_W`, `TABLET_W_PORTRAIT`), `preview/devices.html` (`TW`, `TWP`), `site/assets/css/custom.css` (comment), `DESIGN-SYSTEM.md`, `AGENTS.md`, `?v=` in all `site/**/index.html`.

### About portrait: touch = press and hold for colour
- Joel: "手機板/ipad版，手指壓著大頭照可以變成彩色，放掉後彈回黑色". Replaces the tap toggle; long-press menu suppressed. Computer hover unchanged.
- Files: `site/assets/js/custom.js`, `site/assets/css/custom.css`, `DESIGN-SYSTEM.md`.

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
