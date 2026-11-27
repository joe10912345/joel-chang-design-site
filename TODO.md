# TODO 待辦

Open items. When you finish one, move it to `CHANGELOG.md` with the date. Add new items here (English + 中文).
未完成事項。完成後移到 `CHANGELOG.md` 並註明日期；新事項加在這裡（中英對照）。

## Waiting on Joel's decision 等 Joel 決定
- [ ] **Gaming Home Gateway: the same sentence twice** — the intro's first paragraph is word for word the first sentence of "Project Background". Which one goes?
      **Gaming Home Gateway 同一句出現兩次**：開頭第一段和 Project Background 第一句相同，要刪哪一處？
- [ ] **LionFilter 200 base material** — the intro says "stainless steel base", a later paragraph says aluminium. Which is right?
      **LionFilter 200 底座材質**：開頭寫不鏽鋼，後文寫鋁，哪個正確？
- [ ] **Phone: Wi-Fi 7 2022 + T-Blade top images** are trimmed at the sides. Options: a square phone crop, or the whole 4:3 image (shorter hero).
      **手機版 Wi-Fi 7 2022 與 T-Blade 首圖**左右被裁。選項：做方形手機裁切，或完整顯示 4:3 圖（首圖變矮）。
- [ ] **Same "dim at rest, bright + zoom on hover" on other pages?** Wix's MouseOverPhoto skin is also used on Airgain (8), MoAI (3), Industrial (2), Defense, Electronics, Networking (1 each).
      **其他頁面要不要也用「平常微暗、滑過變亮放大」？**
- [ ] **Domain cut-over**: point `www.joel-chang-design.com` at GitHub Pages (or Cloudflare in front); keep `SITE_BASE`; submit the sitemap in Search Console.
      **網域切換**：把網域指到 GitHub Pages，SITE_BASE 不變，再到 Search Console 提交 sitemap。
- [ ] **Languages**: zh-hant / zh-cn / ar are built but not published (`i18n-archive/README.md`); built before the 11-24 changes, rebuild first.
      **多語版**：已做好未上線，上線前要重建。
- [ ] **iPad on a real device**: check the new layout widths (product pages 1438, About 1356, home/Contact 1320) and one-tap links on a real iPad, portrait + landscape.
      **實機 iPad 檢查**：新的排版寬度與「點一下換頁」在實機直橫向都確認。
- [ ] **Alt text detail**: most images now read "<Product> design detail <n>" (clean, but generic). Joel can give short descriptions for key images; edit `SPECIAL` in `tools/clean_text.py` or the HTML.
      **替代文字細節**：多數圖片目前是「產品名 design detail 編號」，乾淨但籠統；重要圖片可由 Joel 提供描述。

## Known problems 已知問題
- [ ] Top images whose original is only ~2000px wide (home slides 4 / 8 / 9, Gaming gateway, Lionic, AI Tool Kit, T-Interceptor CS, NLG MMA200, Assistive): Joel can supply 3000px+ versions.
      原圖只有約 2000px 的首圖，Joel 可提供 3000px 以上版本。
- [ ] Desktop windows narrower than ~1340px: the layout is wider than the window. Could zoom below 1440 like the wide-screen zoom.
      電腦視窗窄於約 1340px 時版面比視窗寬。
- [ ] Two images broken on Wix too (403): `wi-fi7-hgu-ap`, `electronics` (`data-live-src-missing`). Need replacements. 兩張圖在 Wix 上就壞了，需要替換。
- [ ] Site-wide social share image (og:image) missing. 缺全站分享圖。
- [ ] `/scope` is password-protected on Wix; only the gate was exported. `/scope` 只有密碼頁。
- [ ] Wix scroll-parallax effects not reproduced. Wix 捲動視差未重現。

## Housekeeping 整理
- [ ] `reference/asset-sources.json` differs from GitHub (same files, different URLs); unclear which is newer, left uncommitted. 與 GitHub 版本不同，未 commit。
- [ ] `content/*.md` is the 2026-11-23 text snapshot and is not kept up to date (text lives in the HTML). Regenerate or retire it. content/ 是舊快照，未同步。
