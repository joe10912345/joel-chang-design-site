# Instructions for AI assistants AI 助手工作規則 (Claude, Codex, Gemini, Copilot, …)

Several AIs work on this site. To stay in sync, follow these rules. Architecture: `README.md`.
多個 AI 一起維護這個網站，請遵守以下規則。架構說明見 `README.md`。

## Before you start 開始前

1. `git pull`. Read `README.md` (folder map, how pages are built), `DESIGN-SYSTEM.md` (visual rules), `TODO.md` (open
   items) and the top of `CHANGELOG.md` (recent changes). 先 pull，再讀 README、DESIGN-SYSTEM、TODO 和 CHANGELOG 最上面幾則。
2. **Open the three-device preview and keep it open the whole session** (Joel follows the work there):
   start the "site" and "devices" servers from `.claude/launch.json`, open
   `http://localhost:8766/preview/devices.html?d=all&p=/` in its own tab and never navigate or close that tab. Do your
   own checks and mockups in other tabs; bring another tab to the front only to show Joel a mockup.
   **三平台預覽在整個工作期間都要開著**（Joel 從那裡看進度）：啟動 site 與 devices 伺服器，在獨立分頁開
   `devices.html?d=all&p=/`，不可切走或關閉；自己的檢查與 mockup 用其他分頁，只有給 Joel 看 mockup 時才切到前面。
   **Also open the phone layout tool and keep it open the whole session** (Joel 2026-11-28: "phone layout 預設都要打開與常駐"):
   `http://localhost:8766/preview/mockups/phone-layout.html?p=` in its own tab — Joel tunes phone positions and text sizes
   there himself. Never navigate, reload or close it (it may hold his unsaved edits).
   **手機排版工具也要預設打開並常駐**：在獨立分頁開 `phone-layout.html?p=`，Joel 自己在裡面調位置與字級；不可切走、重新整理或關閉（可能有他未存的調整）。
3. Joel writes in Traditional Chinese; reply in Traditional Chinese. Joel 用繁體中文，請用繁體中文回覆。

## While working 工作中

4. Edit files directly in `site/`. Put a short comment on every block you add, tagged `(Joel YYYY-MM-DD)`, saying what and why.
   直接改 `site/`；新增的程式區塊要加註解，寫明做什麼、為什麼，並標 `(Joel 日期)`。
   - Layout numbers (scale, iPad side margins, content widths): **only** `site/assets/js/jcd-config.js`. 版面數字只改 jcd-config.js。
   - Look and effects: the effect's own file in `src/css/<area>/` / `src/js/<area>/` (list: `src/README.md`), new files
     added to `src/*/ORDER.txt`; then run `python tools/build_assets.py`. **Never edit `custom.css` / `custom.js` directly**
     (they are generated). Wix-replacement behaviour: `site.js`, `static-overrides.css`, `tilt.js`.
     外觀與效果改 `src/` 裡該效果的檔案（新檔要加進 ORDER.txt），再執行 build_assets.py；**不可直接改 custom.css / custom.js**。
   - Text or images: both HTML files of the page (`site/<page>/` and `site/m/<page>/`). 文字或圖片要改電腦版與手機版兩份。
   - Never write a number twice (two files that must "stay in step" by hand): read it from `jcd-config.js` or a CSS token.
     同一個數字不要寫在兩個地方。
5. **Every fix covers phone, iPad (portrait AND landscape) and computer at the same time** (Joel's rule). iPads get the
   desktop page at the width from `jcd-config.js` (iPad side-margin rule, `DESIGN-SYSTEM.md` §4). Hover effects need a touch
   equivalent; one tap must open a link. **每個修正都要同時涵蓋手機、iPad（直與橫）、電腦。** 滑過效果要有觸控對應，點一下就要能換頁。
6. **Computer monitors stay full width**: laptop 1536×864, 1920×1080, 2560×1440, 3440×1440, 3840×2160 — check with `&s=`.
   Never remove the monitor zoom in `site.js`; scripts measuring with `getBoundingClientRect` / `clientX` divide by
   `window.__jcdZoom`, and `100vh/100svh` too. **電腦螢幕永遠滿版**，五種尺寸都要檢查；量位置的程式要除以 `__jcdZoom`。
7. Follow `DESIGN-SYSTEM.md` (colours `--jcd-blue` #0062D9 / `--jcd-navy` #00176C — never hard-code a blue; glass, radii,
   type, copy rules, spacing, devices, states, motion). Update it when Joel changes a rule. 遵守設計系統，Joel 改規則時同步更新。
8. Images (Joel's rule) 圖片規則: one folder per page `site/assets/media/<page>/`, named `<page>-<nn>-<w>x<h>.webp`
   (same-size replacement → `-v2`, `-v3`). Made from the original in `media-originals/<page>/<page>-<nn>-<w>x<h>.<ext>` (same page + number as the site image; a new original goes there under that name) (WebP q86 — top images q90; transparency kept; never PNG. A JPEG copy only for images used as social previews: og:image / twitter:image / JSON-LD. Tools: `tools/jpg_to_webp.py`, `tools/png_to_web.py`); lighter phone
   copy when wider than needed (top image 2400px, others 1440px); `loading="lazy"` below the first section (never on an
   image that sizes its own box). Alt text = clean English description (never a file name). Record new files in
   `reference/media-map.json`. Every other file is named too: videos `site/assets/video/<page>/<page>-video-<nn>-<quality>.mp4`, fonts
   `site/assets/fonts/<family>/`, Wix CSS `site/assets/wix/`. No raw camera / Wix / screenshot names anywhere. 一頁一個資料夾、統一命名、從原始檔產生、替代文字用英文描述、記錄到 media-map.json。
9. **WHITE PAGES STAY WHITE (Joel's rule, broken before — never again).** These product pages have a WHITE background
   that shows through their transparent sections: **MoAI Router, Wi-Fi 7 Extender, Wi-Fi 7 HGU/AP, Wi-Fi 7 2022, Airgain FWA,
   Lionic LionFilter 200, AI Tool Kit, NLG MMA200, Sagittarius Laptop, Assistive Products** (computer + phone). Never give
   them `class="jcd-dark-canvas"`, never paint their page background, sections or images dark, never "unify" them with the
   black pages. Dark pages have `jcd-dark-canvas` on `<html>`. A new page: add it only if every section covers itself.
   **白底頁面一律維持白底（Joel 的規則，曾被改錯，不可再犯）**：上列 10 頁（電腦＋手機）不可加 jcd-dark-canvas、不可把背景、段落或
   圖片改深色、不可為了統一改成黑底。深色頁才加 jcd-dark-canvas。
9b. **Before every commit run `python tools/check_site.py`** (light pages still light, every referenced file exists, no PNG,
   built CSS/JS up to date). Do not commit while it reports a problem. **每次 commit 前必跑 `python tools/check_site.py`**，有錯不可 commit。

## After a change 修改後

10. `tools/build_assets.py` bumps `?v=` of custom.css / custom.js. For any other css/js you edited, bump its `?v=` in every
    page HTML, e.g. build_assets.py 會自動更新；其他 css/js 要手動更新所有頁面的 `?v=`：
    ```bash
    f=site.js; h=$(md5sum site/assets/js/$f | cut -c1-8); grep -rl "$f?v=" site --include=index.html | xargs sed -i -E "s/$f\?v=[0-9a-f]+/$f?v=$h/g"
    ```
11. Add an entry at the top of `CHANGELOG.md` (date UTC+8, what changed in Joel's words, files) — in English **and** Chinese.
    Update `TODO.md`. 在 CHANGELOG 最上面新增中英對照紀錄，並更新 TODO。
12. Commit with a clear message and push to `main` (this deploys GitHub Pages). Tell Joel it shows on his phone only after
    Pages redeploys (~1 min). Never commit `推送到Github.bat`, `reference/asset-sources.json` changes, or files in
    `reference/archive/unused-wix-media/`. commit 並 push；告訴 Joel 要等部署後手機才看得到。上述檔案不可 commit。
13. All `.md` files are bilingual (English + Traditional Chinese). 所有 md 檔都要中英對照。

## "Saved, apply it" 套用 Joel 存好的調整

- Joel tunes with the tools listed in `README.md` §3.5 and says "Saved, apply it". Read the saved values from the tool's
  tab (localStorage, e.g. `jcd-phone-layout`), write them into `jcd-config.js` (never per-page CSS), bump `?v=`, check all
  devices, then clear that saved copy so the tool starts from the site's values next time.
  Phone layout: also align what Joel moved (snap within ~7px to the 20px edges, the centre line, a neighbour's edge; keep
  at least 20px under each section) and report what was snapped. Joel 說「Saved, apply it」時：讀取工具存的數值寫進
  jcd-config.js、檢查三平台、清掉工具的暫存；手機排版另做貼邊／置中／對齊與下方間距的微調。

## Password-protected pages 受密碼保護的頁面

- T. Scope (`site/t-scope/`, phone `site/m/t-scope/`) uses T. Interceptor MP's layout: `tools/make_blank_page.py` copied that
  page with every text a placeholder and every image `shared-05` (top image: the T. Scope photo) into `private/t-scope/page.html`
  and `page-m.html` (git-ignored, never committed). Only the encrypted versions are published (`protected.json` in both folders,
  AES-256-GCM, PBKDF2-SHA256 600k). `site/assets/js/protected-page.js` decrypts with the visitor's password (gate on the page, or
  the password field in the Guest Area dialog on Defense) and replaces the locked shell with the whole page.
  T. Scope 內容原稿在 `private/`（不上傳），網站上只有加密版本，用訪客輸入的密碼在瀏覽器解密。
- After editing `private/t-scope/page.html` / `page-m.html` (fill in text, swap `shared-05` for real images under `assets/media/t-scope/`):
  `$env:JCD_PAGE_PASSWORD = '<password>'; node tools/protect_page.js t-scope page.html t-scope; node tools/protect_page.js t-scope page-m.html m/t-scope; Remove-Item Env:JCD_PAGE_PASSWORD`.
  Never write the password into any file, commit message or doc. Ask Joel for it. 改完內容重新加密；密碼不可寫進任何檔案，向 Joel 詢問。
- `private/` exists only on Joel's computer (Google Drive): keep it backed up. `private/` 只在 Joel 的電腦上，請保留備份。

## Don't 不要做

- Don't run `tools/export-wix/*` (they rebuild from the raw Wix capture and would overwrite hand edits; paths are from
  another machine). 不要執行 `tools/export-wix/` 裡的腳本，會覆蓋手改內容。
- Don't edit the Wix CSS in `site/assets/wix/`. 不要改 `site/assets/wix/` 裡的 Wix 原生 CSS。
- Don't paste tokens or passwords in chat; pushes use Git Credential Manager. 不要在對話中貼 token 或密碼。
