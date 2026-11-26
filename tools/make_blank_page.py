"""Make a blank copy of a product page as the start of a new (private) page (Joel 2026-11-27, first use: T. Scope from
T. Interceptor MP). 以現有產品頁複製出空白版型（第一次：用 T. Interceptor MP 做 T. Scope）。

  python tools/make_blank_page.py <source-slug> <new-slug> "<New Name>" "<Category>" <hero-image-path-under-assets/media>

Writes private/<new-slug>/page.html (computer + iPad) and private/<new-slug>/page-m.html (phone): same layout, every
text turned into a placeholder (labels Client / Year / Designer / Contribution / Application Fields kept), every image
of the source page replaced by assets/media/shared/shared-05-1600x1000.jpg (the first one by the hero image), name and
addresses changed. Then edit those files and encrypt them with tools/protect_page.js <new-slug>.
寫到 private/（不上傳）；編輯後用 protect_page.js 加密。"""
import os, re, sys
from bs4 import BeautifulSoup, NavigableString, Comment

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src, new, name, category, hero = sys.argv[1:6]
LABELS = ['Client', 'Year', 'Designer', 'Contribution', 'Application Fields']
VALUES = {'Client': 'Tron Future', 'Year': '[Year]', 'Designer': 'Joel Chang', 'Contribution': '[Contribution]'}
PLACEHOLDER = 'shared/shared-05-1600x1000.jpg'


def blank_text(soup, old_name):
    for el in soup.select('.wixui-rich-text'):
        nodes = [n for n in el.find_all(string=True) if not isinstance(n, Comment) and n.strip()]
        if not nodes: continue
        full = ' '.join(n.strip() for n in nodes)
        lab = next((l for l in LABELS if full.startswith(l)), None)
        if lab:                                   # "Client Tron Future": keep the label, placeholder value
            if lab == 'Application Fields' and full == lab: continue
            nodes[0].replace_with(lab)
            if len(nodes) > 1:
                nodes[1].replace_with(VALUES.get(lab, '[Text]'))
                for n in nodes[2:]: n.replace_with('')
            continue
        if full.replace('​', '').strip() in (old_name, old_name.replace('. ', '.')): rep = name
        elif len(nodes) == 1 and len(full) <= 14 and full[0].isupper() and ' ' not in full: rep = category if el is soup.select('.wixui-rich-text')[0] else '[Label]'
        elif len(full) <= 70: rep = '[Heading]'
        else: rep = '[Placeholder text: describe this part of the project.]'
        nodes[0].replace_with(rep)
        for n in nodes[1:]: n.replace_with('')


def convert(path, depth):
    s = open(path, encoding='utf-8').read()
    # the hero = the photo loaded first (fetchpriority="high"); every reference to that file becomes the new hero
    hm = re.search(r'<img[^>]*fetchpriority="high"[^>]*src="[^"]*media/%s/([^"]+)"' % re.escape(src), s) or          re.search(r'<img[^>]*src="[^"]*media/%s/([^"]+)"[^>]*fetchpriority="high"' % re.escape(src), s)
    hero_file = re.sub(r'-\d+x\d+(-v\d+)?\.\w+$', '', hm.group(1)) if hm else None   # same photo in any size
    def img(m):
        f = m.group(0).split('/')[-1]
        return 'media/' + (hero if hero_file and f.startswith(hero_file + '-') else PLACEHOLDER)
    s = re.sub(r'media/%s/[^"\'\s,)]+' % re.escape(src), img, s)       # every image of the source page
    old_name = re.search(r'<title>([^<|]+)', s).group(1).strip()
    for a in (old_name, old_name.upper(), old_name.replace('. ', '.')): s = s.replace(a, name)
    s = s.replace('/%s/' % src, '/%s/' % new).replace('/' + src + '"', '/' + new + '"').replace('/' + src + '\'', '/' + new + '\'')
    s = s.replace('content="index,follow"', 'content="noindex,nofollow"').replace('content="index, follow"', 'content="noindex, nofollow"')
    soup = BeautifulSoup(s, 'html.parser')
    blank_text(soup, name)
    for im in soup.find_all('img'):
        if im.get('alt') and 'Joel Chang Design' not in im['alt'] and im['alt'] not in ('LinkedIn', 'Behance'): im['alt'] = name + ' image'
    for m in soup.find_all('meta', attrs={'name': 'description'}) + soup.find_all('meta', attrs={'property': 'og:description'}):
        m['content'] = name + ' (confidential, shared on request).'
    for sc in soup.find_all('script', attrs={'type': 'application/ld+json'}): sc.decompose()
    return str(soup)


out = os.path.join(ROOT, 'private', new); os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'page.html'), 'w', encoding='utf-8').write(convert(os.path.join(ROOT, 'site', src, 'index.html'), '../'))
open(os.path.join(out, 'page-m.html'), 'w', encoding='utf-8').write(convert(os.path.join(ROOT, 'site', 'm', src, 'index.html'), '../../'))
print('written', out)
