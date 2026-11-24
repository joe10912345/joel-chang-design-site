#!/usr/bin/env python3
"""Check every static page has title, description, canonical, Open Graph, and valid JSON-LD."""
from __future__ import annotations
import json, re, sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
from siteconfig import SITE_BASE, LANGS  # noqa: E402

REPO = TOOLS.parent
SITE = REPO / 'site'
BASE = SITE_BASE.rstrip('/')


def pages():
    """Every desktop and mobile HTML file, including language-prefixed trees."""
    skip = {'assets', 'm'} | {meta['prefix'].lstrip('/') for meta in LANGS.values() if meta.get('prefix')}
    out = []
    for meta in LANGS.values():
        prefix = meta['prefix'].lstrip('/')
        root = SITE / prefix if prefix else SITE
        if (root / 'index.html').exists():
            out.append(root / 'index.html')
        if (root / 'm' / 'index.html').exists():
            out.append(root / 'm' / 'index.html')
        for d in sorted(p for p in root.iterdir() if p.is_dir() and p.name not in skip):
            if (d / 'index.html').exists():
                out.append(d / 'index.html')
            mp = root / 'm' / d.name / 'index.html'
            if mp.exists():
                out.append(mp)
    return out


def attr(tag, name):
    m = re.search(rf'\s{name}="([^"]*)"', tag, flags=re.I)
    return m.group(1) if m else None


def check(path: Path):
    html = path.read_text(encoding='utf-8')
    rel = path.relative_to(REPO).as_posix()
    issues = []
    if not re.search(r'<html\b[^>]*\blang=', html, flags=re.I):
        issues.append('missing lang')
    title_m = re.search(r'<title\b[^>]*>(.*?)</title>', html, flags=re.I | re.S)
    title = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', title_m.group(1))).strip() if title_m else ''
    if not title:
        issues.append('missing title')
    # first description / canonical / og in document order (seo block)
    desc = None
    for m in re.finditer(r'<meta\b[^>]*>', html, flags=re.I):
        tag = m.group(0)
        if (attr(tag, 'name') or '').lower() == 'description':
            desc = attr(tag, 'content')
            break
    if not desc:
        issues.append('missing description')
    can = None
    for m in re.finditer(r'<link\b[^>]*>', html, flags=re.I):
        tag = m.group(0)
        if (attr(tag, 'rel') or '').lower() == 'canonical':
            can = attr(tag, 'href')
            break
    if not can:
        issues.append('missing canonical')
    elif not can.startswith(BASE):
        issues.append(f'canonical not on SITE_BASE: {can}')
    # mobile pages must canonical to desktop (no /m/ in canonical)
    if '/m/' in rel or rel.endswith('site/m/index.html'):
        rest = can[len(BASE):] if can and can.startswith(BASE) else (can or '')
        if rest == '/m' or rest.startswith('/m/'):
            issues.append(f'mobile canonical points at mobile URL: {can}')
    og = {}
    for m in re.finditer(r'<meta\b[^>]*>', html, flags=re.I):
        tag = m.group(0)
        prop = (attr(tag, 'property') or attr(tag, 'name') or '')
        if prop.startswith('og:') or prop.startswith('twitter:'):
            og[prop] = attr(tag, 'content')
    for key in ('og:title', 'og:description', 'og:image', 'og:url', 'twitter:card', 'twitter:title'):
        if not og.get(key):
            issues.append(f'missing {key}')
    if 'noindex' in html.lower() and 'index,follow' not in html.lower():
        # ignore the word noindex if it appears in CSS/comments; flag robots noindex
        if re.search(r'<meta[^>]+name="robots"[^>]+noindex', html, flags=re.I):
            issues.append('has noindex')
    if 'google-site-verification' not in html:
        issues.append('missing google-site-verification')
    if 'msvalidate.01' not in html:
        issues.append('missing msvalidate.01')
    lds = re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html, flags=re.I | re.S,
    )
    if not lds:
        issues.append('missing JSON-LD')
    for i, raw in enumerate(lds):
        try:
            data = json.loads(raw)
        except Exception as e:
            issues.append(f'JSON-LD[{i}] invalid: {e}')
            continue
        if not isinstance(data, (dict, list)):
            issues.append(f'JSON-LD[{i}] not an object')
    h1s = re.findall(r'<h1\b', html, flags=re.I)
    if len(h1s) != 1:
        issues.append(f'h1 count={len(h1s)}')
    hrefs = set(re.findall(r'rel="alternate"[^>]*hreflang="([^"]+)"', html, flags=re.I))
    hrefs |= set(re.findall(r'hreflang="([^"]+)"[^>]*rel="alternate"', html, flags=re.I))
    needed = {'en', 'zh-Hant', 'zh-Hans', 'ar', 'x-default'}
    missing_h = needed - hrefs
    if missing_h:
        issues.append('missing hreflang ' + ','.join(sorted(missing_h)))
    if 'G-36L411LGT0' not in html:
        issues.append('missing GA4')
    return rel, issues


def main():
    bad = 0
    rows = []
    for p in pages():
        rel, issues = check(p)
        rows.append((rel, issues))
        if issues:
            bad += 1
            print('FAIL', rel, '; '.join(issues))
    print(f'{len(rows)} pages, {len(rows)-bad} ok, {bad} failed')
    # root files
    for name in ('robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt'):
        p = SITE / name
        print(('OK' if p.exists() and p.stat().st_size > 20 else 'MISSING'), 'site/' + name,
              p.stat().st_size if p.exists() else 0)
    sm = (SITE / 'sitemap.xml').read_text(encoding='utf-8')
    if '/joel-chang-design-site/' in sm:
        print('FAIL sitemap contains github project path')
        bad += 1
    if BASE not in sm:
        print('FAIL sitemap missing SITE_BASE')
        bad += 1
    if 'xmlns:xhtml' not in sm:
        print('FAIL sitemap missing xmlns:xhtml')
        bad += 1
    loc_n = sm.count('<loc>')
    if loc_n != 144:
        print(f'FAIL sitemap loc count={loc_n} expected 144')
        bad += 1
    for hl in ('hreflang="en"', 'hreflang="zh-Hant"', 'hreflang="zh-Hans"', 'hreflang="ar"', 'hreflang="x-default"'):
        if hl not in sm:
            print(f'FAIL sitemap missing {hl}')
            bad += 1
    llms = (SITE / 'llms.txt').read_text(encoding='utf-8')
    for s in ('## Languages', '/zh-hant/', '/zh-cn/', '/ar/'):
        if s not in llms:
            print(f'FAIL llms.txt missing {s}')
            bad += 1
    if 'CNAME' in (SITE / 'CNAME').exists().__str__() if False else '':
        pass
    if (SITE / 'CNAME').exists():
        print('FAIL site/CNAME exists (deploy ignores it; do not add)')
        bad += 1
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
