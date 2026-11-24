# Language archive (not deployed)

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
