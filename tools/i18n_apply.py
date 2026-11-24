#!/usr/bin/env python3
"""Build /zh-hant/, /zh-cn/, and /ar/ mirrors of every English page.

Copies each desktop and mobile HTML file, rewrites relative asset paths,
replaces visible copy from tools/i18n/glossary.json, sets html lang/dir,
and injects the language switcher. Then leaves SEO to tools/seo_apply.py.

Re-run after changing the glossary or SITE_BASE / LANGS in tools/siteconfig.py.
"""
from __future__ import annotations

import html as htmlmod
import json, os, re, shutil, sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
from siteconfig import SITE_BASE, LANGS, DEFAULT_LANG, PUBLISH_I18N  # noqa: E402

REPO = TOOLS.parent
SITE = REPO / 'site'
GLOSSARY_PATH = TOOLS / 'i18n' / 'glossary.json'
MISSING_PATH = TOOLS / 'i18n' / 'missing.json'

SKIP_LANG_DIRS = {k for k, v in LANGS.items() if v.get('prefix')}
SAFE_ATTRS = {'aria-label', 'placeholder', 'alt'}
# title is used both for tooltips and for logo.png / filenames — only replace if
# the value is in the glossary (filenames won't be).
SAFE_ATTRS_IF_GLOSSED = SAFE_ATTRS | {'title', 'value'}

# Wix data-hook / test ids must never be translated.
SKIP_ATTR_VALUES = {
    'bgLayers', 'hover-info-element', 'info-element', 'item-container',
    'item-link-wrapper', 'item-social', 'image', 'image-item', 'item-action',
    'item-wrapper', 'group-view', 'item-description', 'item-title',
    'RightClickProtect-wrapper', 'rcp-text', 'gallery-column',
    'nav-arrow-next', 'true', 'false',
}


def load_glossary() -> dict:
    if not GLOSSARY_PATH.exists():
        raise SystemExit(f'Missing {GLOSSARY_PATH} — generate it first.')
    data = json.loads(GLOSSARY_PATH.read_text(encoding='utf-8'))
    # expected: { "English string": {"zh-hant": "...", "zh-cn": "...", "ar": "..."} }
    return data


def list_english_pages():
    pages = [('home', SITE / 'index.html', SITE / 'm' / 'index.html')]
    for d in sorted(p for p in SITE.iterdir() if p.is_dir()):
        if d.name in ('assets', 'm') or d.name in SKIP_LANG_DIRS:
            continue
        if (d / 'index.html').exists():
            pages.append((d.name, d / 'index.html', SITE / 'm' / d.name / 'index.html'))
    return pages


def dest_for(lang: str, slug: str, mobile: bool) -> Path:
    prefix = LANGS[lang]['prefix'].lstrip('/')
    root = SITE / prefix if prefix else SITE
    if slug == 'home':
        return (root / 'm' / 'index.html') if mobile else (root / 'index.html')
    return (root / 'm' / slug / 'index.html') if mobile else (root / slug / 'index.html')


def extra_depth(lang: str, slug: str, mobile: bool) -> int:
    """How many extra ../ to add vs the English file at the same slug/mode."""
    # English depths: home desktop 0, home mobile 1, page desktop 1, page mobile 2
    en = (1 if mobile else 0) + (0 if slug == 'home' else 1)
    prefix = 1 if LANGS[lang]['prefix'] else 0
    return (en + prefix) - en  # == prefix (always 0 or 1)? WAIT
    # lang home desktop: site/zh-hant/index.html depth 1  (en was 0) extra=1
    # lang page desktop: site/zh-hant/about/index.html depth 2 (en was 1) extra=1
    # lang home mobile: site/zh-hant/m/index.html depth 2 (en was 1) extra=1
    # lang page mobile: site/zh-hant/m/about/index.html depth 3 (en was 2) extra=1
    # So extra is always 1 for prefixed langs, 0 for en. The prefix is one directory.


# Fix the mistaken comment above — implement clearly:
def extra_depth(lang: str, slug: str, mobile: bool) -> int:  # noqa: F811
    return 1 if LANGS[lang]['prefix'] else 0


def bump_url(url: str, extra: int) -> str:
    if extra <= 0 or not url:
        return url
    u = url.strip()
    if u.startswith(('http://', 'https://', '//', 'mailto:', 'tel:', 'data:', '#', 'javascript:')):
        return url
    if u.startswith('/'):
        return url
    return ('../' * extra) + u


def bump_paths(html: str, extra: int) -> str:
    if extra <= 0:
        return html

    def attr_repl(m):
        attr, quote, url = m.group(1), m.group(2), m.group(3)
        if attr.lower() == 'srcset':
            parts = []
            for chunk in url.split(','):
                bits = chunk.strip().split()
                if not bits:
                    continue
                bits[0] = bump_url(bits[0], extra)
                parts.append(' '.join(bits))
            return f'{attr}={quote}{", ".join(parts)}{quote}'
        return f'{attr}={quote}{bump_url(url, extra)}{quote}'

    html = re.sub(
        r'(?<![A-Za-z0-9_-])(href|src|poster|data-src|srcset)=(["\'])(.*?)\2',
        attr_repl,
        html,
        flags=re.I,
    )

    def css_url(m):
        q, url = m.group(1), m.group(2)
        return f'url({q}{bump_url(url, extra)}{q})'

    html = re.sub(r'url\((["\']?)([^)\'"]+)\1\)', css_url, html)
    return html



def is_ignorable_token(s: str) -> bool:
    """Years, numbers, punctuation, emails, empty zwsp — leave as-is, do not log."""
    u = htmlmod.unescape(s).replace('\xa0', ' ').replace('\u200b', '').strip()
    if not u:
        return True
    if '@' in u and re.search(r'[\w.-]+@[\w.-]+', u):
        return True
    if re.fullmatch(r'[\d+\-–—./ ]+', u):
        return True
    if u in {'>>', '>', '-->', '·', 'X', '\u201c', '\u201d', '"', '&gt;', '&gt;&gt;', '&amp;'}:
        return True
    return False


def resolve_key(s: str, table: dict, keep: set | None):
    """Exact match, then HTML-unescaped / whitespace-normalized variants."""
    cands = [s]
    u = htmlmod.unescape(s)
    if u not in cands:
        cands.append(u)
    u2 = u.replace(' ', ' ')
    if u2 not in cands:
        cands.append(u2)
    u3 = re.sub(r'[\s ]+', ' ', u).strip()
    if u3 not in cands:
        cands.append(u3)
    u4 = s.strip()
    if u4 not in cands:
        cands.append(u4)
    for c in cands:
        if c in table or (keep and c in keep):
            return c
        z = '​' + c
        if z in table or (keep and z in keep):
            return z
    return None


def translate_html(html: str, table: dict, missing: dict, keep: set | None = None) -> str:
    """Replace visible text nodes and a short list of attributes."""
    if not table:
        return html

    def rec_text(m):
        raw = m.group(1)
        s = raw.strip()
        if not s:
            return m.group(0)
        if is_ignorable_token(s):
            return m.group(0)
        key = resolve_key(s, table, keep)
        if key and key in table:
            return '>' + raw.replace(s, table[key], 1) + '<'
        if key and keep and key in keep:
            return m.group(0)
        missing[s] = missing.get(s, 0) + 1
        return m.group(0)

    parts = re.split(
        r'(<script\b[^>]*>.*?</script>|<style\b[^>]*>.*?</style>)',
        html,
        flags=re.I | re.S,
    )
    out = []
    for part in parts:
        low = part[:20].lower()
        if low.startswith('<script') or low.startswith('<style'):
            out.append(part)
            continue
        part = re.sub(r'>([^<]*)<', rec_text, part)

        def rec_attr(m):
            attr, quote, val = m.group(1), m.group(2), m.group(3)
            name = attr.lower()
            if name not in SAFE_ATTRS_IF_GLOSSED:
                return m.group(0)
            if val in SKIP_ATTR_VALUES or val.startswith('item-hover-'):
                return m.group(0)
            if re.search(r'\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|mp4)$', val, re.I):
                return m.group(0)
            if is_ignorable_token(val):
                return m.group(0)
            key = resolve_key(val, table, keep)
            if key and key in table:
                return f'{attr}={quote}{table[key]}{quote}'
            if key and keep and key in keep:
                return m.group(0)
            # do not record hook-like values as missing
            if re.fullmatch(r'[a-z0-9_\-]+', val) and len(val) < 40:
                return m.group(0)
            if name in SAFE_ATTRS:
                missing[f'attr:{val}'] = missing.get(f'attr:{val}', 0) + 1
            return m.group(0)

        part = re.sub(
            r'\b([a-zA-Z_:][\w:.-]*)=(["\'])(.*?)\2',
            rec_attr,
            part,
        )
        out.append(part)
    return ''.join(out)


def set_lang_dir(html: str, lang: str) -> str:
    meta = LANGS[lang]
    html_lang = meta['html_lang']
    direction = meta['dir']
    # replace existing html tag lang and dir
    def repl(m):
        tag = m.group(0)
        if re.search(r'\blang=', tag, re.I):
            tag = re.sub(r'\blang="[^"]*"', f'lang="{html_lang}"', tag, count=1, flags=re.I)
        else:
            tag = re.sub(r'<html\b', f'<html lang="{html_lang}"', tag, count=1, flags=re.I)
        if re.search(r'\bdir=', tag, re.I):
            tag = re.sub(r'\bdir="[^"]*"', f'dir="{direction}"', tag, count=1, flags=re.I)
        else:
            tag = re.sub(r'<html\b', f'<html dir="{direction}"', tag, count=1, flags=re.I)
        return tag
    new, n = re.subn(r'<html\b[^>]*>', repl, html, count=1, flags=re.I)
    if n == 0:
        raise RuntimeError('no <html> tag')
    return new


def switcher_href(from_lang, from_slug, from_mobile, to_lang) -> str:
    src = dest_for(from_lang, from_slug, from_mobile)
    dst = dest_for(to_lang, from_slug, from_mobile)
    rel = os.path.relpath(dst, start=src.parent).replace('\\', '/')
    return rel


SWITCH_ARIA = {
    'en': 'Language',
    'zh-hant': '語言',
    'zh-cn': '语言',
    'ar': 'اللغة',
}


def make_switcher(lang: str, slug: str, mobile: bool) -> str:
    aria = SWITCH_ARIA.get(lang, 'Language')
    links = []
    for key, meta in LANGS.items():
        href = switcher_href(lang, slug, mobile, key)
        current = ' aria-current="page"' if key == lang else ''
        cls = ' class="is-active"' if key == lang else ''
        links.append(
            f'<a href="{href}" hreflang="{meta["hreflang"]}" lang="{meta["html_lang"]}"'
            f'{current}{cls}>{meta["switch_label"]}</a>'
        )
    return (
        f'<nav class="jcd-lang" aria-label="{aria}" data-lang="{lang}">'
        + ''.join(links)
        + '</nav>'
    )


def inject_switcher(html: str, block: str) -> str:
    # drop a previous switcher so the script is idempotent
    html = re.sub(r'<nav class="jcd-lang"[^>]*>.*?</nav>', '', html, flags=re.I | re.S)
    if re.search(r'<header\b[^>]*id="SITE_HEADER"', html, re.I):
        html = re.sub(
            r'(<header\b[^>]*id="SITE_HEADER"[^>]*>)',
            r'\1' + block,
            html,
            count=1,
            flags=re.I,
        )
        return html
    # password / pages without a header: still offer a switcher
    html = re.sub(r'(<body\b[^>]*>)', r'\1' + block, html, count=1, flags=re.I)
    return html


def table_for(glossary: dict, lang: str) -> tuple[dict, set]:
    out = {}
    keep = set()
    for src, trans in glossary.items():
        if isinstance(trans, dict):
            t = trans.get(lang)
        else:
            t = None
        if t and t != src:
            out[src] = t
        else:
            # identity (kept on purpose: brand/product names) — do not log as missing
            keep.add(src)
    return out, keep



# Raw export filenames (camera/tool default names) must never appear as alt/title on translated pages.
RAW_NAME_ALT_RE = re.compile(r'^[\w .()\-]*_[\w]{12,}\.(jpg|jpeg|png|webp)$', re.I)

SLUG_NAME = {
    'home': 'Joel Chang Design',
    'about': 'Joel Chang',
    'contact': 'Contact',
    'scope': 'Scope',
    'defense': 'Defense',
    'networking': 'Networking',
    'electronics': 'Electronics',
    'lifestyle': 'Lifestyle',
    'industrial': 'Industrial',
    'experimental': 'Experimental',
    't-blade': 'T. Blade',
    't-interceptor-cs': 'T. Interceptor CS',
    't-interceptormp': 'T. Interceptor MP',
    'moai-router': 'MoAI Router',
    'ai-tool-kit': 'AI Tool Kit',
    'ocean-series': 'Ocean Series',
    'geometry-series': 'Geometry Series',
    'interstellar-05': 'Interstellar 05',
    'wi-fi7-2022': 'Wi-Fi 7',
    'wi-fi7-hgu-ap': 'Wi-Fi 7 HGU/AP',
    'wi-fi7-extender': 'Wi-Fi 7 Extender',
    'wi-fi-7-gaming-home-gateway': 'Wi-Fi 7 Gaming Home Gateway',
    'teana-earbuds': 'TEANA Earbuds',
    'speeder-pro-earbuds': 'Speeder Pro Earbuds',
    'jcg-tough-welding': 'JCG Tough Welding',
    'nlg-mma200': 'NLG MMA200',
    'sagittarius-laptop': 'SAGITTARIUS',
    'zenfone-9': 'ASUS Zenfone 9',
    'assistive-products': 'Assistive products',
    'lionic-lionfilter-200': 'LionFilter 200',
    'parametric-pattern-design': 'Parametric Pattern Design',
    'airgain-fwa-easy-installation-kit': 'Airgain FWA Easy Installation Kit',
}


def pretty_slug(slug: str) -> str:
    if slug in SLUG_NAME:
        return SLUG_NAME[slug]
    return slug.replace('-', ' ').strip().title() or 'Joel Chang Design'


def descriptive_alt(lang: str, slug: str) -> str:
    name = pretty_slug(slug)
    if lang == 'zh-hant':
        return f'{name}產品圖片'
    if lang == 'zh-cn':
        return f'{name}产品图片'
    if lang == 'ar':
        return f'صورة منتج {name}'
    return f'{name} product image'


def is_filename_alt(val: str) -> bool:
    if not val:
        return False
    if RAW_NAME_ALT_RE.search(val):
        return True
    # leftover export filenames (incl. " - 複製")
    if re.search(r'\.(jpg|jpeg|png|gif|webp)$', val, re.I) and '複製' in val:
        return True
    return False


def clean_filename_alts(html: str, lang: str, slug: str) -> str:
    """Replace raw export-filename alt/title with a short descriptive phrase."""
    desc = descriptive_alt(lang, slug)

    def rec(m):
        attr, quote, val = m.group(1), m.group(2), m.group(3)
        if attr.lower() in ('alt', 'title', 'aria-label') and is_filename_alt(val):
            return f'{attr}={quote}{desc}{quote}'
        return m.group(0)

    return re.sub(r'\b([a-zA-Z_:][\w:.-]*)=(["\'])(.*?)\2', rec, html)


def process_english_source(src_path: Path, lang: str, slug: str, mobile: bool,
                           table: dict, missing: dict, keep: set | None = None) -> Path:
    html = src_path.read_text(encoding='utf-8')
    # Drop a previously injected switcher so its labels are not logged as missing.
    html = re.sub(r'<nav class="jcd-lang"[^>]*>.*?</nav>', '', html, flags=re.I | re.S)
    html = bump_paths(html, extra_depth(lang, slug, mobile))
    html = translate_html(html, table, missing, keep=keep)
    html = clean_filename_alts(html, lang, slug)
    html = set_lang_dir(html, lang)
    html = inject_switcher(html, make_switcher(lang, slug, mobile))
    dest = dest_for(lang, slug, mobile)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding='utf-8')
    return dest


def inject_english_switcher():
    """English pages already exist; just drop in the switcher and set lang=en."""
    for slug, desk, mob in list_english_pages():
        for path, mobile in ((desk, False), (mob, True)):
            if not path.exists():
                continue
            html = path.read_text(encoding='utf-8')
            html = set_lang_dir(html, 'en')
            html = inject_switcher(html, make_switcher('en', slug, mobile))
            path.write_text(html, encoding='utf-8')


def main(publish: bool | None = None):
    import argparse
    if publish is None:
        parser = argparse.ArgumentParser(description='Build language trees into site/ for deploy.')
        parser.add_argument(
            '--publish',
            action='store_true',
            help='Write /zh-hant/, /zh-cn/, and /ar/ into site/ so they deploy. '
                 'Off by default (also controlled by PUBLISH_I18N in tools/siteconfig.py).',
        )
        args, _unknown = parser.parse_known_args()
        publish = args.publish
    if not (publish or PUBLISH_I18N):
        raise SystemExit(
            'i18n publish is off (PUBLISH_I18N=False). Translations stay in '
            'tools/i18n/ and i18n-archive/site/ and are not written into site/. '
            'Re-enable with: python3 tools/i18n_apply.py --publish '
            '(or set PUBLISH_I18N = True in tools/siteconfig.py).'
        )
    glossary = load_glossary()
    pages = list_english_pages()
    report = {'pages': 0, 'langs': {}, 'missing_unique': 0}
    all_missing = {}
    for lang in LANGS:
        if lang == DEFAULT_LANG:
            continue
        table, keep = table_for(glossary, lang)
        missing = {}
        n = 0
        for slug, desk, mob in pages:
            process_english_source(desk, lang, slug, False, table, missing, keep=keep)
            n += 1
            if mob.exists():
                process_english_source(mob, lang, slug, True, table, missing, keep=keep)
                n += 1
        report['langs'][lang] = {'files': n, 'missing_unique': len(missing)}
        report['pages'] += n
        for k, v in missing.items():
            all_missing[f'{lang}::{k}'] = v
        # also keep a per-lang raw set
        report['langs'][lang]['missing_sample'] = sorted(missing, key=len, reverse=True)[:25]
    inject_english_switcher()
    report['pages'] += sum(1 for _, d, m in pages for p in (d, m) if p.exists())
    report['missing_unique'] = len(all_missing)
    MISSING_PATH.write_text(json.dumps(all_missing, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(report, indent=2, ensure_ascii=False))
    print(f'SITE_BASE={SITE_BASE.rstrip("/")}  glossary={len(glossary)} entries  missing logged to {MISSING_PATH}')


if __name__ == '__main__':
    main()
