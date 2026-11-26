# preview/ 預覽

| File 檔案 | What 內容 |
|---|---|
| `devices.html` | **Three-device preview**: phone, iPad portrait, iPad landscape and a computer monitor side by side, all showing the real site. Keep it open while working (see `AGENTS.md`). **三平台預覽**：手機、iPad 直、iPad 橫與電腦螢幕並排，顯示真實網站；工作時一直開著。 |
| `mockups/` | Design studies shown to Joel before building (not part of the site). 開發前給 Joel 選的設計提案（不屬於網站）。 |

Open 開啟: start the "devices" server (`.claude/launch.json`, port 8766), then
`http://localhost:8766/preview/devices.html?d=all&p=/`

URL parameters 網址參數: `p=/<page>/` page 頁面 · `d=phone|ipad|ipadl|desktop|all` device 裝置 ·
`s=laptop|fhd|qhd|uw|uhd` monitor 螢幕 · `m=` iPad model 型號 · `tw=` / `twp=` override the iPad layout width 覆寫 iPad 排版寬.

The iPad widths come from `site/assets/js/jcd-config.js`, the same file the site uses. iPad 寬度讀網站同一份設定檔。
New mockups go in `mockups/` and link the site with `../../site/...`. 新 mockup 放 mockups/，用 `../../site/` 連結網站素材。
