#!/usr/bin/env python3
"""Turn rendered Wix DOM snapshots (raw/<mode>/<slug>.html) into a self-contained static site."""
import os, re, json, hashlib, html, sys, threading
from urllib.parse import urlparse, urljoin, unquote
from concurrent.futures import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup, Comment

# Public origin for canonical, Open Graph, sitemap, and JSON-LD URLs.
# Change SITE_BASE in tools/siteconfig.py (one line), then re-run tools/seo_apply.py
# (also invoked at the end of this build). After the custom domain points here,
# keep SITE_BASE = 'https://www.joel-chang-design.com'.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from siteconfig import SITE_BASE  # noqa: E402

RAW = '/workspace/wixcopy-tools/raw'
REPO = '/workspace/joel-chang-design-site'
SITE = os.path.join(REPO, 'site')
ORIG = os.path.join(REPO, 'media-originals')
LIVE = 'https://www.joel-chang-design.com'
PAGES = [l.strip() for l in open('/workspace/wixcopy-tools/pages.txt') if l.strip()]
# Wix media deleted on the live site (403). Electronics 'Gaming PC Interstellar 05' tile -> the project's hero image.
# Wix links that point at Behance's project EDITOR (owner-only, visitors get a login page) -> public gallery pages.
BEHANCE_FIX = {
    'https://www.behance.net/portfolio/editor?project_id=91290285': 'https://www.behance.net/gallery/91290285/AIRMP',
    'https://www.behance.net/portfolio/editor?project_id=129479083': 'https://www.behance.net/gallery/129479083/Phantom-Lamp',
}
TILT_PAGES = {'defense', 'industrial', 'electronics', 'lifestyle', 'networking', 'experimental', 'about'}
MISSING_SUBST = {'1e9c09_41de3ddba202445a81cf8c93c3e35bbb': 'assets/media/1e9c09_264a4186e7a2452da6a7e7137e00cd95_mv2_2560x1511_2df6d3ce.jpg'}

def slug_of(u):
    p = urlparse(u).path.strip('/'); return p or 'home'
SLUGS = [slug_of(u) for u in PAGES]
_hp = '/workspace/wixcopy-tools/out/hover-harvest.json'
HOVER = json.load(open(_hp)) if os.path.exists(_hp) else {}

S = requests.Session()
S.headers.update({'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
                  'Referer': LIVE + '/'})
lock = threading.Lock()
events = {}
cache = {}      # absolute url -> site-relative path ('assets/...') or None
failures = {}
inventory = {}  # site-rel path -> dict(url, bytes, kind)

ASSET_HOSTS = r'(?:static\.wixstatic\.com|static\.parastorage\.com|siteassets\.parastorage\.com|video\.wixstatic\.com|[a-z0-9-]+\.filesusr\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|[a-z0-9-]+\.usrfiles\.com)'
URL_RE = re.compile(r'(?:https?:)?//' + ASSET_HOSTS + r'[^\s"\'()<>\\]*')

def safe(name):
    name = unquote(name)
    name = re.sub(r'[^A-Za-z0-9._-]+', '_', name).strip('_')
    return name[:120] or 'file'

CT_EXT = {'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/avif':'.avif','image/gif':'.gif','image/svg+xml':'.svg',
          'text/css':'.css','font/woff2':'.woff2','font/woff':'.woff','font/ttf':'.ttf','video/mp4':'.mp4','application/pdf':'.pdf'}

def local_name(u):
    pu = urlparse(u); h = hashlib.sha1(u.encode()).hexdigest()[:8]
    path = pu.path
    if pu.netloc == 'static.wixstatic.com' and path.startswith('/media/'):
        parts = path.split('/')
        mid = parts[2]; base, ext = os.path.splitext(mid)
        last = parts[-1]; ext2 = os.path.splitext(last)[1] or ext
        sub = 'media'
        if '/v1/' in path:
            m = re.search(r'w_(\d+),h_(\d+)', path)
            dims = f'_{m.group(1)}x{m.group(2)}' if m else ''
            return f'assets/{sub}/{safe(base)}{dims}_{h}{ext2.lower()}'
        return f'assets/{sub}/{safe(base)}{ext.lower()}'
    if pu.netloc == 'static.wixstatic.com' and path.startswith('/ufonts/'):
        parts = path.strip('/').split('/')
        return f'assets/fonts/{safe(parts[1])}_{safe(parts[-2])}{os.path.splitext(parts[-1])[1]}'
    if 'fonts' in path or pu.netloc in ('fonts.gstatic.com',) or re.search(r'\.(woff2?|ttf|otf|eot)$', path):
        b, e = os.path.splitext(path.rsplit('/',1)[-1])
        return f'assets/fonts/{safe(b)}_{h}{e}'
    if path.endswith('.css') or pu.netloc == 'fonts.googleapis.com':
        b = os.path.splitext(path.rsplit('/',1)[-1])[0]
        return f'assets/css/{safe(b)}_{h}.css'
    if pu.netloc == 'video.wixstatic.com':
        return f'assets/video/{safe("_".join(path.strip("/").split("/")[1:]))}'
    b, e = os.path.splitext(path.rsplit('/',1)[-1])
    return f'assets/files/{safe(b)}_{h}{e}'

def norm(u, unescape=True):
    if unescape: u = html.unescape(u)
    u = u.rstrip(',')
    if u.startswith('//'): u = 'https:' + u
    return u

def fetch(u, kind=None):
    """download absolute url, return site-relative path"""
    with lock:
        if u in cache:
            ev = events.get(u)
            wait = True
        else:
            cache[u] = None; events[u] = threading.Event(); wait = False
    if wait:
        if ev: ev.wait(180)
        return cache[u]
    try:
        return _fetch(u)
    finally:
        events[u].set()

def _fetch(u):
    rel = local_name(u)
    dest = os.path.join(SITE, rel)
    try:
        if not os.path.exists(dest):
            hdr = {'Accept': 'image/png,image/jpeg,image/gif,image/svg+xml,*/*;q=0.5'} if '/media/' in u else {'Accept': '*/*'}
            r = S.get(u, timeout=60, headers=hdr)
            if r.status_code != 200:
                raise Exception(f'HTTP {r.status_code}')
            ct = r.headers.get('content-type','').split(';')[0].strip()
            # fix extension if server returned a different format
            e = CT_EXT.get(ct)
            if e and ct.startswith('image/') and not rel.lower().endswith(e) and not (e=='.jpg' and rel.lower().endswith('.jpeg')):
                rel = os.path.splitext(rel)[0] + e; dest = os.path.join(SITE, rel)
            elif e and not os.path.splitext(rel)[1]:
                rel = rel + e; dest = os.path.join(SITE, rel)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            data = r.content
            if rel.endswith('.css'):
                data = process_css(data.decode('utf-8','replace'), u, rel).encode()
            with open(dest,'wb') as f: f.write(data)
        with lock:
            cache[u] = rel
            inventory[rel] = {'url': u, 'bytes': os.path.getsize(dest)}
        return rel
    except Exception as ex:
        with lock: failures[u] = str(ex)
        return None

def relpath(target_rel, from_rel_file):
    return os.path.relpath(target_rel, os.path.dirname(from_rel_file) or '.').replace(os.sep,'/')

CSS_URL_RE = re.compile(r'url\(\s*([\'"]?)([^\'")]+)\1\s*\)')
IMPORT_RE = re.compile(r'@import\s+([\'"])([^\'"]+)\1')
def process_css(css, base_url, css_rel):
    def rep(m):
        raw = m.group(2).strip()
        if raw.startswith('data:') or raw.startswith('#') or raw.endswith('.map'): return m.group(0)
        u = norm(urljoin(base_url, raw))
        if not u.startswith('http'): return m.group(0)
        r = fetch(u)
        return f'url("{relpath(r, css_rel)}")' if r else m.group(0)
    css = CSS_URL_RE.sub(rep, css)
    def rep_imp(m):
        u = norm(urljoin(base_url, m.group(2))); r = fetch(u)
        return f'@import "{relpath(r, css_rel)}"' if r else m.group(0)
    css = IMPORT_RE.sub(rep_imp, css)
    return re.sub(r'/\*# sourceMappingURL=[^*]*\*/', '', css)

def page_rel(mode, slug):
    pre = 'm/' if mode == 'mobile' else ''
    return f'{pre}index.html' if slug == 'home' else f'{pre}{slug}/index.html'

def original_media(u):
    """for a wixstatic transform URL, also archive the original upload (no transforms)"""
    m = re.match(r'https://static\.wixstatic\.com/media/([^/]+)', u)
    if not m: return
    mid = m.group(1)
    dest = os.path.join(ORIG, safe(mid))
    with lock:
        if mid in orig_seen: return
        orig_seen.add(mid)
    if os.path.exists(dest): return
    try:
        r = S.get(f'https://static.wixstatic.com/media/{mid}', timeout=120)
        if r.status_code == 200:
            os.makedirs(ORIG, exist_ok=True); open(dest,'wb').write(r.content)
        else: failures['ORIG '+mid] = f'HTTP {r.status_code}'
    except Exception as ex: failures['ORIG '+mid] = str(ex)
orig_seen = set()

DROP_LINK_RELS = {'preload','prefetch','modulepreload','dns-prefetch','preconnect','canonical','alternate','manifest'}
KEEP_IFRAME = re.compile(r'(player\.vimeo\.com|youtube\.com|youtube-nocookie\.com|google\.com/maps)')

def build_page(mode, slug, pool):
    src = os.path.join(RAW, mode, slug + '.html')
    if not os.path.exists(src): print('missing', mode, slug); return None
    soup = BeautifulSoup(open(src, encoding='utf-8').read(), 'lxml')
    me = page_rel(mode, slug)
    removed = {'scripts':0,'iframes':0,'links':0}
    missing_imgs = []; full_bleed = []; hover_injected = []; video_players = []; motion_removed = []; hero_added = []; works_links = []; lightbox_items = []
    for t in soup.find_all('script'):
        if t.get('type') == 'application/ld+json': continue
        t.decompose(); removed['scripts'] += 1
    for t in soup.find_all('noscript'): t.decompose()
    for t in soup.find_all(string=lambda x: isinstance(x, Comment)):
        if x_strip := t.strip():
            if x_strip in ('$','/$') or x_strip.startswith('$') : t.extract()
    for t in soup.find_all('link'):
        rel = set(t.get('rel') or [])
        if rel & DROP_LINK_RELS: t.decompose(); removed['links'] += 1
    for t in soup.find_all('iframe'):
        s = t.get('src') or t.get('data-src') or ''
        if not KEEP_IFRAME.search(s):
            t.decompose(); removed['iframes'] += 1
    for t in soup.find_all('meta'):
        if (t.get('http-equiv') or '').lower() in ('x-wix-meta-site-id','x-wix-application-instance-id','x-wix-published-version','etag'): t.decompose()
        elif (t.get('name') or '').lower() == 'generator': t['content'] = 'static export of joel-chang-design.com'
    # Wix entrance-animation markers: let our shim replay them
    for t in soup.find_all(attrs={'data-motion-enter': True}): del t['data-motion-enter']
    def localize_attr_url(v):
        u = norm(v, unescape=False)  # bs4 already decoded entities
        if not re.match(r'https?://' + ASSET_HOSTS, u): return None
        r = fetch(u)
        if r and u.startswith('https://static.wixstatic.com/media/'): pool.submit(original_media, u)
        return r
    # Home "Works" Pro Gallery: on live each tile navigates to its project page via Wix JS (no <a> in the DOM).
    # out/works-links.json maps gallery item id -> page slug (recorded by clicking each tile on live).
    WL = '/workspace/wixcopy-tools/out/works-links.json'
    if os.path.exists(WL):
        wl = json.load(open(WL))
        for w in soup.select('div.item-link-wrapper[data-id]'):
            tgt = wl.get(w.get('data-id'))
            if not tgt: continue
            w.name = 'a'; w['href'] = relpath(page_rel(mode, tgt), me); w['tabindex'] = '0'
            w['data-jcd-link'] = tgt; works_links.append(tgt)
    # Click-to-enlarge: only the galleries that open Wix's fullscreen view on the live site
    # (checked on all 35 live pages, see out/lightbox-live.json). Each item gets data-jcd-full = a large copy of
    # the original upload (long side <= 2560) made from media-originals/.
    LIGHTBOX = {'ai-tool-kit': ['comp-mv69lnww', 'comp-mvfawpus']}
    for cid in LIGHTBOX.get(slug, []):
        g = soup.find(id=cid)
        if not g: continue
        g['data-jcd-lightbox'] = ''
        for it in g.select('.gallery-item-container'):
            im = it.select_one('img'); srcs = ' '.join(filter(None, [im.get('src', '') if im else '', str(it)]))
            m = re.search(r'(1e9c09_[0-9a-f]{32})', srcs)
            if not m: continue
            orig = [f for f in os.listdir(f'{REPO}/media-originals') if f.startswith(m.group(1))]
            if not orig: continue
            out_rel = f'assets/media/full/{m.group(1)}_2560.jpg'; out_abs = f'{REPO}/site/{out_rel}'
            if not os.path.exists(out_abs):
                os.makedirs(os.path.dirname(out_abs), exist_ok=True)
                from PIL import Image
                pic = Image.open(f'{REPO}/media-originals/{orig[0]}').convert('RGB'); pic.thumbnail((2560, 2560))
                pic.save(out_abs, quality=88, optimize=True, progressive=True)
            it['data-jcd-full'] = relpath(out_rel, me)
            lightbox_items.append(m.group(1))
    # Hero slideshow: Wix only preloads 8 of the 10 slides as "ghosts"; rebuild the full ordered list from the live
    # site (out/hero-slides.json, recorded by watching the live slideshow) so all 10 slides are in the export.
    HS = '/workspace/wixcopy-tools/out/hero-slides.json'
    for g in soup.select('[data-testid="slide-show-gallery"]'):
        if not os.path.exists(HS) or slug != 'home': break
        order = json.load(open(HS)); order = [order[k] for k in sorted(order, key=lambda k: int(k.split('/')[0]))]
        ghosts = g.select('[data-testid="gallery-item-ghost"]')
        if not ghosts: continue
        have = {}
        for gh in ghosts:
            m = re.search(r'"uri":"([^"]+)"', gh.select_one('wow-image').get('data-image-info', ''))
            if m: have[m.group(1)] = gh
        tmpl = ghosts[0]; parent = tmpl.parent
        old_uri = re.search(r'"uri":"([^"]+)"', tmpl.select_one('wow-image')['data-image-info']).group(1)
        for gh in ghosts: gh.extract()
        for d in order:
            if d['uri'] in have: node = have[d['uri']]
            else:
                node = BeautifulSoup(str(tmpl).replace(old_uri, d['uri']), 'html.parser').find(True)
                w = node.select_one('wow-image')
                w['data-image-info'] = re.sub(r'"width":\d+,"height":\d+', f'"width":{d["width"]},"height":{d["height"]}', w['data-image-info'], count=1)
                hero_added.append(d['uri'])
            parent.append(node)
    # Wix video player (custom JS controls) -> native HTML5 video with controls, same source/autoplay/loop
    for vp in soup.select('.wixui-video-player'):
        v = vp.find('video')
        cont = vp.select_one('[data-testid="playable"]') or vp
        if not v or not v.get('src'): continue
        nv = soup.new_tag('video', src=v['src'], controls='', playsinline='', preload='metadata')
        for a in ('autoplay', 'loop', 'muted'):
            if v.has_attr(a) or vp.get('data-autoplay') == 'true' and a in ('autoplay', 'muted'): nv[a] = ''
        nv['style'] = 'width:100%;height:100%;object-fit:contain;background:#000;display:block'
        cont.clear(); cont.append(nv)
        video_players.append(1)
    # Pro Gallery hover overlays harvested from the live site (rendered by Wix only while hovered)
    hv = HOVER.get(slug, {}).get('gallery', {})
    if hv:
        for item in soup.select('.gallery-item-container'):
            h = hv.get(item.get('id'))
            if not h:  # same item id, different index suffix (mobile vs desktop)
                base = re.sub(r'_\d+$', '', item.get('id') or '')
                h = next((v for k, v in hv.items() if re.sub(r'_\d+$', '', k) == base and v.get('hoverHTML')), None)
            if not h or not h.get('hoverHTML'): continue
            tpl = soup.new_tag('template'); tpl['data-pg-hover'] = ''
            tpl['data-container-class'] = h.get('containerCls', '').replace('simulate-hover', '').strip()
            tpl['data-content-class'] = h.get('contentCls', '')
            frag = BeautifulSoup(h['hoverHTML'], 'html.parser')
            if mode == 'mobile':  # overlay was sized for the desktop card; let it follow the mobile card size
                for el in frag.find_all(style=True):
                    el['style'] = re.sub(r'(width|height):\s*\d+(\.\d+)?px', r'\1: 100%', el['style'])
            tpl.append(frag)
            item.append(tpl)
            hover_injected.append(1)
    # Full-bleed fix: Wix JS sizes <wow-image> pictures (section/strip backgrounds, slideshows, fill-mode images)
    # with px width/height measured at capture time. Make them fill their container like the live site does
    # (width/height 100% + object-fit), and fetch wide ones at up to 2560px so they stay sharp on big screens.
    for img in soup.select('wow-image > img, wix-bg-image img'):
        st = img.get('style') or ''
        mw = re.search(r'width:\s*(\d+)px', st); mh = re.search(r'height:\s*(\d+)px', st)
        if not (mw and mh): continue
        w, h = int(mw.group(1)), int(mh.group(1))
        st = re.sub(r'width:\s*\d+px', 'width:100%', st); st = re.sub(r'height:\s*\d+px', 'height:100%', st)
        if 'object-fit' not in st: st += ';object-fit:cover'
        img['style'] = st
        info = img.parent.get('data-image-info') or ''
        ow = re.search(r'"imageData":\{"width":(\d+),"height":(\d+)', info)
        src = img.get('src') or ''
        if w >= 900 and src and not img.get('srcset') and ow:
            tw = min(2560, int(ow.group(1)))
            if tw > w:
                th = round(h * tw / w)
                big = re.sub(r'/fill/w_\d+,h_\d+', f'/fill/w_{tw},h_{th}', src, count=1)
                if big != src and localize_attr_url(big): img['src'] = big
        full_bleed.append(w)
    # images: keep the sharpest rendered variant that actually downloads (largest srcset candidate first), drop srcset
    for t in soup.find_all(['img','source']):
        ss = t.get('srcset')
        if ss:
            cands = [c.strip().split(' ')[0] for c in re.split(r',\s+', ss) if c.strip()]
            chosen = None
            for c in reversed(cands):
                r = localize_attr_url(c)
                if r: chosen = relpath(r, me); break
            if chosen:
                if t.name == 'img': t['src'] = chosen
                else: t['srcset'] = chosen
            if t.name == 'img': del t['srcset']
            if t.has_attr('sizes'): del t['sizes']
        if t.name == 'img' and t.get('data-src') and not t.get('src'): t['src'] = t['data-src']
    # other URL-bearing attributes (handles URLs containing parentheses, which the CSS-safe regex below cannot)
    for t in soup.find_all(True):
        for attr in ('src','poster','href','data-src','content'):
            v = t.get(attr)
            if isinstance(v, str) and re.match(r'(?:https?:)?//' + ASSET_HOSTS, v):
                r = localize_attr_url(v)
                if r: t[attr] = relpath(r, me)
                elif t.name == 'img' and attr == 'src' and any(k in v for k in MISSING_SUBST):
                    # deleted from Wix media (403) but a same-project image exists locally -> use it
                    t['data-live-src-substituted'] = v
                    t['src'] = relpath(next(MISSING_SUBST[k] for k in MISSING_SUBST if k in v), me)
                elif t.name == 'img' and attr == 'src':
                    # image is broken on the live site too (Wix returns 403) -> transparent placeholder
                    t['data-live-src-missing'] = v
                    t['src'] = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
                    missing_imgs.append(v)
                elif t.name == 'meta':
                    t.decompose(); break
    # internal links -> relative static paths
    for a in soup.find_all('a', href=True):
        h = a['href']
        if h.startswith('/') and not h.startswith('//'): h = LIVE + h
        pu = urlparse(h)
        if pu.netloc in ('www.joel-chang-design.com','joel-chang-design.com'):
            s2 = slug_of(h)
            if s2 in SLUGS:
                tgt = relpath(page_rel(mode, s2), me)
                a['href'] = tgt + (('#' + pu.fragment) if pu.fragment else '')
            else:
                a['data-unmapped-live-link'] = '1'
    # assemble + localize all remaining asset URLs (attrs, inline styles, <style> blocks)
    out = str(soup)
    urls = sorted(set(m.group(0) for m in URL_RE.finditer(out) if '.map' not in m.group(0) and 'siteassets.parastorage.com/pages' not in m.group(0)), key=len, reverse=True)
    absu = {raw: norm(raw) for raw in urls}
    results = dict(zip(urls, pool.map(lambda r: fetch(absu[r]), urls)))
    for raw in urls:
        if absu[raw].startswith('https://static.wixstatic.com/media/'): pool.submit(original_media, absu[raw])
    def rep(m):
        raw = m.group(0); r = results.get(raw)
        if r: return relpath(r, me) + (',' if raw.endswith(',') else '')
        return raw
    out = URL_RE.sub(rep, out)
    out = re.sub(r'/\*# sourceMappingURL=[^*]*\*/', '', out)
    # Static text: drop ALL Wix motion (entrance float/fade/slide-in, looping "breathe"/"flash") so every element
    # renders in its final position with no movement (Joel's request: the original design should not drift).
    out, n1 = re.subn(r'@media \(prefers-reduced-motion: no-preference\) \{(?:#[\w-]+:not\(\[data-motion-enter="done"\]\)\{[^}]*\})+\}', '', out)
    out, n2 = re.subn(r'#[\w-]+:not\(\[data-motion-enter="done"\]\)\{[^}]*animation:motion-[^}]*\}', '', out)
    motion_removed.append(n1 + n2)
    # inject static shims
    js = relpath('assets/js/site.js', me); cssx = relpath('assets/css/static-overrides.css', me)
    other = relpath(page_rel('desktop' if mode=='mobile' else 'mobile', slug), me)
    head_inject = f'<script>window.__STATIC_MODE="{mode}";window.__ALT_URL="{other}";</script>' \
        f'<script src="{js}"></script><link rel="stylesheet" href="{cssx}">' \
        f'<link rel="stylesheet" href="{relpath("assets/css/custom.css", me)}"><script src="{relpath("assets/js/custom.js", me)}" defer></script>'
    if mode == 'desktop' and slug in TILT_PAGES:   # catalog cards: 3D tilt following the mouse (desktop only)
        head_inject += f'<script src="{relpath("assets/js/tilt.js", me)}" defer></script>'
    out = out.replace('</head>', head_inject + '</head>', 1)
    # Google Analytics 4 (gtag.js, measurement ID G-36L411LGT0) - right after <head>, once per page.
    GTAG = ('<script async src="https://www.googletagmanager.com/gtag/js?id=G-36L411LGT0"></script>\n'
            '<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n'
            "  gtag('js', new Date());\n  gtag('config', 'G-36L411LGT0');\n</script>\n")
    if 'G-36L411LGT0' not in out:
        out = re.sub(r'(<head\b[^>]*>)', lambda m: m.group(1) + '\n' + GTAG, out, count=1)
    dest = os.path.join(SITE, me); os.makedirs(os.path.dirname(dest), exist_ok=True)
    for bad, good in BEHANCE_FIX.items(): out = out.replace(bad, good)
    out = stamp_assets(out)
    open(dest, 'w', encoding='utf-8').write(out)
    return {'mode': mode, 'slug': slug, 'file': 'site/' + me, 'removed': removed, 'assets': len(urls), 'missing_imgs': missing_imgs, 'fill_imgs_fixed': len(full_bleed), 'hover_overlays': len(hover_injected), 'video_players': len(video_players), 'motion_rules_removed': sum(motion_removed), 'hero_slides_added': len(hero_added), 'works_links': len(works_links), 'lightbox_items': len(lightbox_items)}

# Cache-busting: GitHub Pages serves files with max-age=600, so every local js/css under site/assets/ gets
# ?v=<8-char content hash>; a changed file => new URL => browsers fetch it at once. Also usable on its own:
#   python3 tools/build.py --stamp    (re-stamps every published HTML in site/ after editing a css/js by hand)
ASSET_REF_RE = re.compile(r'(<(?:script|link)\b[^>]*?\b(?:src|href)=")((?:\.\./)*assets/[^"?#]+\.(?:js|css))(?:\?v=[0-9a-f]+)?(")')
_ver_cache = {}
def asset_ver(rel):
    f = os.path.join(SITE, rel)
    if f not in _ver_cache:
        _ver_cache[f] = hashlib.md5(open(f, 'rb').read()).hexdigest()[:8] if os.path.exists(f) else None
    return _ver_cache[f]
def stamp_assets(out):
    def rep(m):
        v = asset_ver(re.sub(r'^(?:\.\./)+', '', m.group(2)))
        return m.group(1) + m.group(2) + ('?v=' + v if v else '') + m.group(3)
    return ASSET_REF_RE.sub(rep, out)
def stamp_site():
    n = 0
    for root, dirs, files in os.walk(SITE):
        for fn in files:
            if not fn.endswith('.html'): continue
            f = os.path.join(root, fn); t = open(f, encoding='utf-8').read(); t2 = stamp_assets(t)
            if t2 != t: open(f, 'w', encoding='utf-8').write(t2); n += 1
    return n

if __name__ == '__main__':
    if sys.argv[1:2] == ['--stamp']:
        print('stamped', stamp_site()); sys.exit(0)
    modes = sys.argv[1].split(',') if len(sys.argv) > 1 else ['desktop','mobile']
    only = sys.argv[2].split(',') if len(sys.argv) > 2 else SLUGS
    report = []
    with ThreadPoolExecutor(16) as pool:
        for mode in modes:
            for s in only:
                r = build_page(mode, s, pool)
                if r: report.append(r); print(r, flush=True)
    os.makedirs('/workspace/wixcopy-tools/out', exist_ok=True)
    old = {}
    p = '/workspace/wixcopy-tools/out/inventory.json'
    if os.path.exists(p): old = json.load(open(p))
    old.update(inventory)
    json.dump(old, open(p,'w'), indent=1)
    json.dump(failures, open('/workspace/wixcopy-tools/out/failures.json','w'), indent=1)
    print('assets', len(inventory), 'failures', len(failures))
    # Language trees live in i18n-archive/site/ and are not written into site/
    # unless PUBLISH_I18N is True (or: python3 tools/i18n_apply.py --publish).
    try:
        from siteconfig import PUBLISH_I18N
    except ImportError:
        PUBLISH_I18N = False
    if PUBLISH_I18N:
        import i18n_apply
        i18n_apply.main(publish=True)
    import seo_apply
    seo_apply.main()
    try:
        import scrub_ai   # optional local alt-text post-processing (not in the repo)
        scrub_ai.run()
    except ImportError:
        pass
