# tools/ 工具

| File 檔案 | What 內容 | Run 執行 |
|---|---|---|
| `clean_text.py` | Fixes alt text that is a file name, Wix labels left in Chinese, product-name spacing, the ESG heading, the DFM sentence. Safe to re-run. 清理檔名式替代文字、Wix 中文介面字、產品名空格等，可重複執行。 | `python tools/clean_text.py` |
| `siteconfig.py` | `SITE_BASE` (public URL) and language switches, used by the SEO and i18n scripts. 公開網址與語言開關。 | — |
| `seo_apply.py`, `seo_verify.py` | Canonical / Open Graph / JSON-LD tags, `sitemap.xml`, `robots.txt`, `llms.txt` from `SITE_BASE`. SEO 標籤與 sitemap。 | `python tools/seo_apply.py` then `seo_verify.py` |
| `i18n_apply.py`, `i18n/` | Builds the (unpublished) zh-hant / zh-cn / ar versions into `i18n-archive/`. 產生未上線的多語版。 | see `i18n-archive/README.md` |
| `scrub_ai.py` | Removes AI-assistant traces from page source. 移除頁面中的 AI 痕跡。 | `python tools/scrub_ai.py --check` |
| `export-wix/` | The scripts that exported the site from Wix (Playwright render, build, screenshots, comparisons). **History only — do not run**: they use paths from another machine and would overwrite hand edits. 當初從 Wix 匯出的腳本，**僅存檔，不要執行**。 | — |
