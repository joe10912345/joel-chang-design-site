"""Public URL of this site — the single switch for canonical, Open Graph, sitemap, and JSON-LD.

The site is a static export of the Wix site. After cutover, the custom domain
points at this static host (GitHub Pages or Cloudflare) at the same paths.

To preview SEO against the GitHub Pages project URL instead, set SITE_BASE to
'https://joe10912345.github.io/joel-chang-design-site' and re-run
tools/seo_apply.py and tools/i18n_apply.py.
"""

SITE_BASE = 'https://www.joel-chang-design.com'

# URL prefixes and metadata for each published language.
# English is the default (x-default) and lives at the site root (no prefix).
# Change prefixes here, then re-run tools/i18n_apply.py and tools/seo_apply.py.
LANGS = {
    'en': {
        'prefix': '',
        'html_lang': 'en',
        'hreflang': 'en',
        'og_locale': 'en_US',
        'in_language': 'en',
        'dir': 'ltr',
        'switch_label': 'EN',
        'name': 'English',
    },
    'zh-hant': {
        'prefix': '/zh-hant',
        'html_lang': 'zh-Hant',
        'hreflang': 'zh-Hant',
        'og_locale': 'zh_TW',
        'in_language': 'zh-Hant',
        'dir': 'ltr',
        'switch_label': '繁',
        'name': '繁體中文',
    },
    'zh-cn': {
        'prefix': '/zh-cn',
        'html_lang': 'zh-CN',
        'hreflang': 'zh-Hans',
        'og_locale': 'zh_CN',
        'in_language': 'zh-CN',
        'dir': 'ltr',
        'switch_label': '简',
        'name': '简体中文',
    },
    'ar': {
        'prefix': '/ar',
        'html_lang': 'ar',
        'hreflang': 'ar',
        'og_locale': 'ar',
        'in_language': 'ar',
        'dir': 'rtl',
        'switch_label': 'ع',
        'name': 'العربية',
    },
}

DEFAULT_LANG = 'en'
