# joel-chang-design.com — site source 網站原始檔

> **Start here 從這裡開始.** People and AIs read, in order: this file → `AGENTS.md` (working rules) → `DESIGN-SYSTEM.md`
> (visual rules) → `TODO.md` (open items) → `CHANGELOG.md` (recent changes).
> 人或 AI 接手時依序讀：本檔 → `AGENTS.md`（工作規則）→ `DESIGN-SYSTEM.md`（視覺規則）→ `TODO.md`（待辦）→ `CHANGELOG.md`（最近改了什麼）。

Joel Chang's portfolio. It started as an export of the Wix site (2026-11-23) and is now edited by hand here; no Wix is
needed. Pushing to GitHub publishes it.
Joel Chang 的作品集網站。最初從 Wix 匯出（2026-11-23），之後都直接在這裡手改，不再需要 Wix；推送到 GitHub 就會上線。

---

## 1. Folder map 資料夾地圖

```
joel-chang-design-site/
├─ site/                      THE WEBSITE — the only folder that goes online 網站本體，唯一會上線的資料夾
│  ├─ index.html              home, computer + iPad 首頁（電腦＋iPad）
│  ├─ <page>/index.html       one folder per page, computer + iPad (35 pages, list: PAGES.md) 每頁一個資料夾
│  ├─ m/<page>/index.html     the same page for phones (Wix kept a separate phone design) 同一頁的手機版
│  └─ assets/
│     ├─ js/jcd-config.js     ★ layout numbers: scale, iPad side margins … 版面參數（只改這裡）
│     ├─ js/site.js           device detection, iPad viewport, monitor zoom, menus, slideshow 裝置判斷、縮放、選單、輪播
│     ├─ js/custom.js         BUILT from src/js/ — do not edit 由 src/js/ 自動產生，不要直接改
│     ├─ js/tilt.js           About portrait 3D tilt 大頭照傾斜
│     ├─ css/custom.css       BUILT from src/css/ — do not edit 由 src/css/ 自動產生，不要直接改
│     ├─ css/static-overrides.css  fixes needed to run without Wix 脫離 Wix 所需的修正
│     ├─ wix/                 Wix's own styles, never edit Wix 原生樣式，不要改:
│     │                         component-<name>.css (one per Wix component), page-<page>-<n>.css (page styles), main.css …
│     ├─ media/<page>/        images, one folder per page (+ shared/) 圖片，一頁一個資料夾
│     ├─ video/<page>/        background videos <page>-video-<nn>-<quality>.mp4 背景影片，一頁一個資料夾
│     ├─ fonts/<family>/      fonts by family: poppins/poppins-light.woff2 … 字體，依字族分資料夾
│     └─ files/favicon.ico    site icon 網站小圖示
├─ src/                       ★ the site's own CSS + JS, ONE FILE PER EFFECT, by area 自訂樣式與程式，一個效果一個檔
│  ├─ css/<area>/<effect>.css  areas: global, home, about, category, product, contact, phone 分區
│  ├─ js/<area>/<effect>.js
│  └─ css/ORDER.txt, js/ORDER.txt   build order 合併順序
├─ media-originals/<page>/    full-size originals, named like the site images: <page>-<nn>-<w>x<h>.jpg (not online)
│                             原始大圖，一頁一個資料夾，和網站圖片同編號（不上線）；_unused/ = 沒有頁面使用
├─ media-new/                 drop new images here for the AI to process 新圖放這裡給 AI 處理
├─ preview/
│  ├─ devices.html            ★ three-device preview (phone / iPad / computer side by side) 三平台預覽
│  └─ mockups/                design studies shown to Joel before building 設計提案
├─ tools/
│  ├─ build_assets.py         joins src/ into custom.css + custom.js and bumps ?v= 組合 src/ 並更新 ?v=
│  ├─ clean_text.py           alt text / Wix labels / typo clean-up (safe to re-run) 文字清理
│  ├─ seo_apply.py, seo_verify.py, siteconfig.py   SEO tags + sitemap from one SITE_BASE SEO 產生器
│  ├─ i18n_apply.py, i18n/    unpublished translations 未上線的翻譯
│  └─ export-wix/             the original Wix export scripts (history; do not run) 當初匯出 Wix 的腳本（僅存檔）
├─ reference/
│  ├─ media-map.json          every image: new name → original, crop, pages 圖片對照表
│  ├─ asset-sources.json      Wix source URL of every file Wix 來源網址
│  └─ archive/                export-era screenshots, comparisons, unused Wix images 匯出時期的截圖與舊圖
├─ content/                   page text snapshot from the export (2026-11-23; not updated) 匯出時的文字快照
├─ i18n-archive/              zh-hant / zh-cn / ar versions, built but not published 中簡阿語版（未上線）
├─ .github/workflows/pages.yml   publishes site/ to GitHub Pages 自動部署
├─ .claude/launch.json        local preview servers ("site" 8765, "devices" 8766) 本機預覽伺服器
└─ *.md                       README, AGENTS, DESIGN-SYSTEM, TODO, CHANGELOG, PAGES, ASSETS
```

Each sub-folder with its own rules has a short `README.md` (`src/`, `preview/`, `tools/`, `reference/`, `content/`, `media-originals/`).
有自己規則的子資料夾各有一份簡短 `README.md`。

## 2. How a page is put together 一個頁面怎麼組成

```
site/<page>/index.html (computer + iPad)        site/m/<page>/index.html (phone)
        │ Wix's HTML (absolute-positioned, hashed class names; text and images live here)
        │ Wix 的 HTML（絕對定位、亂碼 class；文字和圖片都在這裡）
        ├─ css: Wix files → static-overrides.css → custom.css (built from src/css/)   (later wins 後載入的優先)
        └─ js : jcd-config.js → site.js → custom.js (built from src/js/), tilt.js  (config first 先載入設定)
                     │              │
                     │              └─ decides phone / iPad / computer, sets the iPad viewport width,
                     │                 zooms monitors, menus, slideshow 判斷裝置、設 iPad 排版寬、螢幕縮放
                     └─ numbers only 只有數字 ──────► also read by preview/devices.html 三平台預覽也讀它
```

- A change of TEXT or an IMAGE is made in BOTH HTML files of the page (computer and phone). 改文字或圖片要改兩份 HTML（電腦＋手機）。
- A change of LOOK or BEHAVIOUR goes in the effect's file in `src/css/` or `src/js/`, then `python tools/build_assets.py`; it must cover phone + iPad + computer. 改外觀或互動：改 `src/` 裡該效果的檔案，再執行 build_assets.py；三平台一起處理。
- A change of a LAYOUT NUMBER goes in `jcd-config.js` only. 改版面數字只改 jcd-config.js。
- `build_assets.py` bumps `?v=` for custom.css/custom.js itself; after editing `jcd-config.js`, `site.js`, `tilt.js` or `static-overrides.css` bump theirs by hand (`AGENTS.md`). build_assets.py 會自動更新 ?v=；其他檔案手動更新。

Which layout a visitor gets 訪客看到哪一版: phones (touch, short side < 600px) → `m/`; iPads/tablets → the desktop page laid
out at the width from `jcd-config.js` and scaled; computers → the desktop page zoomed to fill the window. Force one with
`?layout=desktop` / `?layout=mobile` (remembered for the tab). 手機看 m/；iPad 看電腦版並依設定縮放；電腦看電腦版並滿版。

## 3. Work on it locally 本機作業

1. `git pull` first. 先 `git pull`。
2. Start the two servers in `.claude/launch.json`: **site** (port 8765, serves `site/`) and **devices** (port 8766, serves the repo).
   啟動兩個本機伺服器：site（8765）與 devices（8766）。
3. **Open the three-device preview and keep it open** 打開三平台預覽並一直開著:
   `http://localhost:8766/preview/devices.html?d=all&p=/` — `p=/<page>/` picks the page, `d=phone|ipad|ipadl|desktop|all`,
   `s=laptop|fhd|qhd|uw|uhd` picks the monitor, `m=` the iPad model. 參數：p 選頁、d 選裝置、s 選螢幕、m 選 iPad 型號。
4. Edit in `site/`, check phone + iPad (both orientations) + computer, then record it (see `AGENTS.md`), commit, push.
   在 `site/` 修改，三平台（iPad 直橫）都檢查，記錄後 commit、push。

Without the servers: `cd site && python -m http.server 8000`, or double-click `site/index.html`. 沒有伺服器也可直接開。

## 4. Publishing 上線

- Push to `main` on github.com/joe10912345/joel-chang-design-site → GitHub Actions publishes `site/` to
  https://joe10912345.github.io/joel-chang-design-site/ in about a minute. Joel's phone sees changes only after that.
  推送到 main 後約一分鐘自動上線；Joel 的手機要等上線後才看得到。
- The custom domain www.joel-chang-design.com still points at Wix until the cut-over (`TODO.md`). Do not add `site/CNAME`.
  自訂網域仍指向 Wix，切換前不要加 CNAME。
- SEO tags, `sitemap.xml`, `robots.txt`, `llms.txt` come from `tools/seo_apply.py` with `SITE_BASE` in `tools/siteconfig.py`
  (`https://www.joel-chang-design.com`). After the domain cut-over leave it as it is; submit the sitemap in Search Console.
  SEO 標籤由 seo_apply.py 依 SITE_BASE 產生；網域切換後保持不變，並到 Search Console 提交 sitemap。

## 5. Known limits 已知限制

- The HTML is Wix-generated markup; it looks right but structural redesigns are easier as a clean rebuild (use `content/`,
  `media-originals/` and screenshots as the spec). HTML 是 Wix 產生的，大改版建議重新建置。
- Contact form sends through Web3Forms (`custom.js`); the home Vimeo video stays a Vimeo embed. 表單走 Web3Forms；Vimeo 影片維持嵌入。
- Two images were already broken on Wix (403) on `wi-fi7-hgu-ap` and `electronics`; `/scope` is password-protected (only the gate was exported).
  兩張圖在 Wix 上就壞了；`/scope` 有密碼，只匯出了密碼頁。
- Wix scroll-parallax effects are not reproduced. Wix 的捲動視差未重現。
