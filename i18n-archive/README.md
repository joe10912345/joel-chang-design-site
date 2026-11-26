# Language archive (not deployed) 多語版存檔（未上線）

繁中（zh-hant）、簡中（zh-cn）、阿拉伯文（ar）的靜態版本放在這裡，GitHub Pages 只發佈最上層 `site/`，所以這些不會上線。
要上線時：設 `PUBLISH_I18N = True`（tools/siteconfig.py）或執行 `python tools/i18n_apply.py --publish`，再跑 `python tools/seo_apply.py`，然後 commit、push。
（這些版本是 11-24 之前做的，上線前要先重建。）

This folder holds the last built Traditional Chinese (`site/zh-hant/`),
Simplified Chinese (`site/zh-cn/`), and Arabic (`site/ar/`) static trees.
GitHub Pages deploys only the top-level `site/` directory, so these paths
are kept in the repo but are not published.

Translations, the glossary, and the apply script remain in `tools/i18n/`
and `tools/i18n_apply.py`.

To put the languages back on the live site later:

1. Set `PUBLISH_I18N = True` in `tools/siteconfig.py`, **or** run the
   apply script with `--publish`.
2. `python3 tools/i18n_apply.py --publish`
3. `python3 tools/seo_apply.py`
4. Commit and push `site/zh-hant/`, `site/zh-cn/`, and `site/ar/`.
