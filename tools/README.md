# tools/ 工具

| File 檔案 | What 內容 | Run 執行 |
|---|---|---|
| `build_assets.py` | Joins `src/css/` and `src/js/` (order: `src/*/ORDER.txt`) into `site/assets/css/custom.css` and `site/assets/js/custom.js`, and bumps their `?v=` in every page. 把 src/ 組合成 custom.css / custom.js 並更新 ?v=。 | `python tools/build_assets.py` (`--check` only checks) |
| `clean_text.py` | Fixes alt text that is a file name, Wix labels left in Chinese, product-name spacing, the ESG heading, the DFM sentence. Safe to re-run. 清理檔名式替代文字、Wix 中文介面字、產品名空格等，可重複執行。 | `python tools/clean_text.py` |
| `siteconfig.py` | `SITE_BASE` (public URL) and language switches, used by the SEO and i18n scripts. 公開網址與語言開關。 | — |
| `seo_apply.py`, `seo_verify.py` | Canonical / Open Graph / JSON-LD tags, `sitemap.xml`, `robots.txt`, `llms.txt` from `SITE_BASE`. SEO 標籤與 sitemap。 | `python tools/seo_apply.py` then `seo_verify.py` |
| `i18n_apply.py`, `i18n/` | Builds the (unpublished) zh-hant / zh-cn / ar versions into `i18n-archive/`. 產生未上線的多語版。 | see `i18n-archive/README.md` |
| `check_site.py` | **Run before every commit** (AGENTS.md 9b): light pages still light, every referenced file exists, no PNG, built CSS/JS up to date. 每次 commit 前執行：白底頁維持白底、引用檔案都存在、沒有 PNG、組合檔是最新的。 | `python tools/check_site.py` |
| `jpg_to_webp.py`, `png_to_web.py` | Make the site's WebP images (q86, top images q90, transparency kept) from `media-originals/`, named `<page>-<nn>-<w>x<h>.webp` (AGENTS.md rule 8). 從原始檔產生網站用 WebP。 | `python tools/jpg_to_webp.py …` |
| `make_blank_page.py`, `protect_page.js` | Password-protected pages (T. Scope): copy a page layout with placeholder text into `private/`, then encrypt it into `site/<page>/protected.json` (password only via `JCD_PAGE_PASSWORD`, never in a file; AGENTS.md). 受密碼保護頁面：產生空白版型、加密成 protected.json。 | see `AGENTS.md` |
| `scrub_ai.py` | Removes AI-assistant traces from page source. **Local only** (git-ignored, `tools/scrub_*.py`). 移除頁面中的 AI 痕跡（只在本機，不上傳）。 | `python tools/scrub_ai.py --check` |
| `export-wix/` | The scripts that exported the site from Wix (Playwright render, build, screenshots, comparisons). **History only — do not run**: they use paths from another machine and would overwrite hand edits. 當初從 Wix 匯出的腳本，**僅存檔，不要執行**。 | — |
