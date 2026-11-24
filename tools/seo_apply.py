#!/usr/bin/env python3
"""Apply per-page SEO, JSON-LD, sitemap, robots.txt, and llms.txt.

Public URLs come from SITE_BASE in tools/siteconfig.py (one-line switch).
Re-run this script after changing SITE_BASE or LANGS, after tools/build.py, or after tools/i18n_apply.py.
"""
from __future__ import annotations

import json, os, re, sys
from datetime import datetime
from html import escape, unescape
from pathlib import Path
from urllib.parse import urljoin, urlparse

TOOLS = Path(__file__).resolve().parent
sys.path.insert(0, str(TOOLS))
from siteconfig import SITE_BASE, LANGS, DEFAULT_LANG, PUBLISH_I18N  # noqa: E402

REPO = TOOLS.parent
SITE = REPO / 'site'
CONTENT = REPO / 'content'

# Keep these Wix verification tags as-is; this script never removes them.
KEEP_META_NAMES = {
    'google-site-verification',
    'msvalidate.01',
    'viewport',
    'generator',
    'format-detection',
    'skype_toolbar',
    'charset',
}

WIX_DESCRIPTIONS = {
    'home': (
        'Specializing in blending creativity with functionality to craft exceptional '
        'product designs. With experience from concept to production, bringing brand '
        'stories to life in meaningful ways. Passionate about exploring new materials '
        'and technologies to create visually striking, market-ready designs. Focused '
        'on innovation, collaboration, and understanding user needs to deliver designs '
        'that exceed expectations under Joel Chang Design.'
    ),
    '4': (
        'My goal is dedicated to creating meaningful, user-centered solutions that '
        'balance aesthetics with functionality. By leveraging innovative thinking and '
        'deep user insights, I craft designs that not only enhance product value but '
        'also create engaging, memorable experiences. My mission is to shape products '
        'that resonate with users and stand the test of time.'
    ),
}

# Fills for pages that have no meta description on live Wix. Every sentence
# is taken from the site's own copy (content/*.md or a public page).
COPY_DESCRIPTIONS = {
    'about': (
        'Tzu-I Chang (Joel Chang) is a Taiwanese industrial designer based in St. Louis, '
        'Missouri. Specializing in bridging design vision with engineering feasibility '
        'to drive complex hardware from concept to mass production.'
    ),
    'contact': 'Contact Joel Chang Design at joe10912345@gmail.com.',
    'defense': (
        'These projects are presented as site-security hardware solutions, designed to '
        'help operators detect, assess, and respond to unauthorized drone activity in '
        'protected environments. The focus is on situational awareness, autonomous '
        'response, and reliable field deployment rather than weapon-system storytelling.'
    ),
    'electronics': (
        'Electronics work by Joel Chang Design, including premium computing devices, '
        'the SAGITTARIUS laptop, Interstellar 05 gaming PC, Zenfone 9 concept, and '
        'TEANA and Speeder Pro earbuds.'
    ),
    'experimental': (
        'Experimental work by Joel Chang Design, including an AI Design Tool Kit, '
        'parametric pattern design, and assistive products for children with dysarthria.'
    ),
    'industrial': (
        'Industrial work by Joel Chang Design, including the NLG MMA 200/120 and '
        'JCG Tough Welding machines, and Advantech AIM 20 accessories.'
    ),
    'lifestyle': (
        'Lifestyle work by Joel Chang Design, including the Phantom floor lamp, '
        'Alian wall lamp, Smoky Tree and Water Burn humidifiers, and the MG-522 drone.'
    ),
    'networking': (
        'Networking product design by Joel Chang Design, including the Geometry and '
        'Ocean ID families, MoAI Router, LionFilter 200, and Gemtek Wi-Fi 7 gateways, '
        'extenders, and access points.'
    ),
    'ai-tool-kit': (
        'Integrating AI into Design. Since 2022, I have deeply integrated AI into my '
        'design workflow. From early-stage conceptual ideation and complex parametric '
        'design to high-fidelity contextual synthesis and stylistic layout, AI has '
        'become a core part of my workflow.'
    ),
    'airgain-fwa-easy-installation-kit': (
        'Simpler Installation, Seamless Connectivity. Designed with user experience at '
        'its core, this innovative outdoor antenna installation solution combines '
        'aesthetics, usability, and functionality.'
    ),
    'assistive-products': (
        'Lightweight, modular, and safe – products designed for children. Children’s '
        'dysarthria training aids are designed to support oral muscle training through '
        'exercises tailored to different speech sounds and their related muscle movements.'
    ),
    'geometry-series': (
        'Designed with Order. Built for Modern Living. As Gemtek’s second complete '
        'product family after the Ocean Series, the Geometry Series extends the design '
        'exploration into the 5G and Coax product lines.'
    ),
    'interstellar05': (
        'Shaping Performance with Futuristic Minimalism. Interstellar 05 is an esports '
        'PC chassis design proposal inspired by the visual tension and mechanical '
        'presence of sci-fi starfighters.'
    ),
    'jcg-tough-welding': (
        'A cyberpunk-inspired welding machine concept, created for NLG’s industrial '
        'design challenge.'
    ),
    'lionic-lionfilter-200': (
        'A next-gen firewall designed from concept to delivery. A collaboration with '
        'Lionic to design their next-generation firewall product, carrying forward the '
        "brand's established design language."
    ),
    'moai-router': (
        'Technology that feels human. The Dr.AI MoAI Router is an innovative Wi-Fi 7 AI '
        'solution designed to assist users in managing their health more effectively.'
    ),
    'nlg-mma200': (
        'Balancing Aesthetics and Feasibility: Elevating Design Value to Exceed Client '
        'Expectations. Exterior redesign of DAIDEN-brand welding machines for the '
        'Japanese market, for Niagamas Lestari Gemilang.'
    ),
    'ocean-series': (
        'Defining a Consistent and Story-Driven ID Family for the Wi-Fi 7 Portfolio. '
        'Gemtek is launching a new series of Generic Wi-Fi 7 product lines, aligned '
        'with international environmental trends (ESG) and PCR plastic materials.'
    ),
    'parametric-pattern-design': (
        'Explore variations and enjoy the subtle differences. An experimental project '
        'using Rhino Grasshopper to study parametric hole design and surface transformations.'
    ),
    'sagittarius-laptop': (
        'Stay Professional. Stay Sharp. Stay Yourself. SAGITTARIUS treats understatement '
        'as a refined form of professional presence, rather than a fear of standing out.'
    ),
    'speeder-pro-earbuds': (
        'The Speeder Pro is a high-performance gaming earphone equipped with advanced '
        'high-speed connection technology, ensuring a seamless gaming experience with '
        'zero sound delay.'
    ),
    't-blade': (
        'Autonomous AI-powered drone, built for long-range reconnaissance and mission '
        'awareness. Designed for extended-range missions, T. Blade is an autonomous '
        'reconnaissance drone concept focused on aerial observation, area monitoring, '
        'and real-time intelligence gathering.'
    ),
    't-interceptor-cs': (
        'Autonomous swarm interception for safer, more secure airspace. T. Interceptor CS '
        'is an autonomous interception drone system developed to protect sensitive sites, '
        'key facilities, and controlled airspace from illegal drone intrusion.'
    ),
    't-interceptormp': (
        'Autonomous AI-powered drone, guarding airspace with speed and agility. '
        'T.Interceptor MP is a multi-functional defense system built for urban security '
        'and critical infrastructure protection.'
    ),
    'teana-earbuds': (
        'The Teana earbuds feature a simple yet luxurious design, targeting women aged '
        '25–35. For its CMF, Morandi colors were selected, making it easy to pair with '
        'various outfits.'
    ),
    'wi-fi7-2022': (
        'Three identities. Designed for the way you live. Gemtek’s first generation of '
        'Wi-Fi 7 routers, spanning three distinct lifestyle scenarios and market positions.'
    ),
    'wi-fi7-extender': (
        'Merging Organic Aesthetics with Ultra-Compact Engineering. The Wi-Fi 7 extender '
        'introduces a distinctive biomimetic design language that creates a highly '
        'memorable visual identity.'
    ),
    'wi-fi7-gaming-home-gateway': (
        'Shaping Performance into Product Identity. As Gemtek’s first flagship model for '
        'the Wi-Fi 7 generation and a key product for overseas launch, this project needed '
        'to make next-generation performance visible through a distinctive product presence.'
    ),
    'wi-fi7-hgu-ap': (
        'A fresh perspective on router design — drawn from the organic elegance of sea '
        'anemones. This design introduces an eye-catching curvilinear silhouette and a '
        'signature “slim waist.”'
    ),
    'zenfone-9': (
        'A smartphone CMF concept inspired by stage lighting, performance, and emotional '
        'contrast. Zenfone 9 CMF Concept explores how color, light, and surface finish '
        'can create a stronger emotional identity for a compact smartphone.'
    ),
    # Public copy from the Defense page (the /scope page itself is password-protected).
    'scope': (
        'T. SCOPE is an AI-assisted scope system for target prediction, from Joel Chang '
        'Design’s defense work for Tron Future.'
    ),
    '1': 'Joel Chang Design, industrial design portfolio.',
    '2': 'Joel Chang Design, industrial design portfolio.',
    '3': 'Joel Chang Design, industrial design portfolio.',
}

PROJECT_SLUGS = {
    'ai-tool-kit', 'airgain-fwa-easy-installation-kit', 'assistive-products',
    'geometry-series', 'interstellar05', 'jcg-tough-welding', 'lionic-lionfilter-200',
    'moai-router', 'nlg-mma200', 'ocean-series', 'parametric-pattern-design',
    'sagittarius-laptop', 'scope', 'speeder-pro-earbuds', 't-blade',
    't-interceptor-cs', 't-interceptormp', 'teana-earbuds', 'wi-fi7-2022',
    'wi-fi7-extender', 'wi-fi7-gaming-home-gateway', 'wi-fi7-hgu-ap', 'zenfone-9',
}

# One-line project blurbs for llms.txt, taken from site taglines / first sentences.
PROJECT_LINES = [
    ('ai-tool-kit', 'AI Tool Kit', 'Integrating AI into the industrial design workflow since 2022.'),
    ('airgain-fwa-easy-installation-kit', 'Airgain FWA Easy Installation Kit', 'An outdoor antenna installation solution: simpler installation, seamless connectivity.'),
    ('assistive-products', 'Assistive products for children with dysarthria', 'Lightweight, modular training aids for children’s oral-muscle and speech exercises.'),
    ('geometry-series', 'Geometry Series', 'Gemtek ID family: designed with order, built for modern living.'),
    ('interstellar05', 'Interstellar 05', 'An esports PC chassis concept shaped with futuristic minimalism.'),
    ('jcg-tough-welding', 'JCG Tough Welding', 'A cyberpunk-inspired welding machine concept for NLG’s design challenge.'),
    ('lionic-lionfilter-200', 'Lionic LionFilter 200', 'A next-generation firewall designed from concept to delivery.'),
    ('moai-router', 'MoAI Router', 'A Wi-Fi 7 AI healthcare router — technology that feels human.'),
    ('nlg-mma200', 'NLG MMA200 / MMA120', 'Welding-machine exterior redesign balancing aesthetics and feasibility.'),
    ('ocean-series', 'Ocean Series', 'A story-driven ID family for Gemtek’s Wi-Fi 7 portfolio.'),
    ('parametric-pattern-design', 'Parametric Pattern Design', 'Experimental Rhino Grasshopper studies of parametric holes and surfaces.'),
    ('sagittarius-laptop', 'SAGITTARIUS Laptop', 'Stay Professional. Stay Sharp. Stay Yourself — a business laptop concept.'),
    ('scope', 'T. SCOPE', 'An AI-assisted scope system for target prediction (password-protected page on the original Wix site).'),
    ('speeder-pro-earbuds', 'Speeder Pro Earbuds', 'High-performance gaming earphones with high-speed, zero-delay connection.'),
    ('t-blade', 'T. Blade', 'An autonomous AI-powered reconnaissance drone for long-range mission awareness.'),
    ('t-interceptor-cs', 'T. Interceptor CS', 'Autonomous swarm interception for safer, more secure airspace.'),
    ('t-interceptormp', 'T. Interceptor MP', 'An autonomous AI-powered drone guarding airspace with speed and agility.'),
    ('teana-earbuds', 'TEANA Earbuds', 'A CMF exploration of luxury earbuds in Morandi colors for women aged 25–35.'),
    ('wi-fi7-2022', 'Wi-Fi 7 Gateway 2022', 'Gemtek’s first-generation Wi-Fi 7 routers: three identities, designed for the way you live.'),
    ('wi-fi7-extender', 'Wi-Fi 7 Extender', 'Organic, biomimetic aesthetics in an ultra-compact Wi-Fi 7 extender.'),
    ('wi-fi7-gaming-home-gateway', 'Wi-Fi 7 Gaming Home Gateway', 'Gemtek’s Wi-Fi 7 flagship: shaping performance into product identity.'),
    ('wi-fi7-hgu-ap', 'Wi-Fi 7 HGU/AP', 'A router design drawn from the organic elegance of sea anemones.'),
    ('zenfone-9', 'ASUS Zenfone 9', 'A smartphone CMF concept inspired by stage lighting, performance, and emotional contrast.'),
]

CATEGORY_LINES = [
    ('defense', 'Defense', 'Site-security hardware for detecting and responding to unauthorized drone activity.'),
    ('networking', 'Networking', 'Routers, gateways, extenders, firewalls, and ID families for telecom and enterprise.'),
    ('electronics', 'Electronics', 'Laptops, esports PCs, smartphones, and earbuds.'),
    ('industrial', 'Industrial', 'Welding machines, power tools, and business hardware accessories.'),
    ('lifestyle', 'Lifestyle', 'Lamps, humidifiers, and experimental lifestyle objects.'),
    ('experimental', 'Experimental', 'AI design tools, parametric pattern studies, and assistive devices.'),
]

SAME_AS = [
    'https://www.behance.net/joe10912345',
    'https://www.linkedin.com/in/joel-chang',
]
EMAIL = 'joe10912345@gmail.com'
ORG_NAME = 'Joel Chang Design'
PERSON_NAME = 'Joel Chang'
PERSON_ALT = 'Tzu-I Chang'
HOME_DESC = WIX_DESCRIPTIONS['home']

SEO_BEGIN = '<!-- jcd-seo:begin -->'
SEO_END = '<!-- jcd-seo:end -->'
DEFAULT_OG = 'assets/media/1e9c09_b81e2b0d221a4381b68d3d09fd4bd20e_mv2_3000x1475_b7ccc679.png'
DEFAULT_OG_WH = (3000, 1475)

SKIP_SRC = re.compile(r'(Joel_wh|behance|linkedin|11062b_b5690303|03ad3edaacf84112ad4eba9cf5ad4caf|pfavico)', re.I)
DIM_RE = re.compile(r'_(\d{2,5})x(\d{2,5})_')


def base() -> str:
    return SITE_BASE.rstrip('/')


LANG_PREFIXES = {k for k, v in LANGS.items() if v.get('prefix')}



def published_langs():
    """Languages written into the deployed site/ tree."""
    return list(LANGS) if PUBLISH_I18N else [DEFAULT_LANG]


def lang_prefix(lang: str) -> str:
    return (LANGS.get(lang) or LANGS[DEFAULT_LANG]).get('prefix') or ''


def page_url(slug: str, mobile: bool = False, lang: str = DEFAULT_LANG) -> str:
    b = base()
    pref = lang_prefix(lang)
    if slug == 'home':
        if mobile:
            return f'{b}{pref}/m'
        return f'{b}{pref}' if pref else b
    if mobile:
        return f'{b}{pref}/m/{slug}'
    return f'{b}{pref}/{slug}'


def canonical_url(slug: str, lang: str = DEFAULT_LANG) -> str:
    return page_url(slug, mobile=False, lang=lang)


def mobile_url(slug: str, lang: str = DEFAULT_LANG) -> str:
    return page_url(slug, mobile=True, lang=lang)


def list_pages(lang: str = DEFAULT_LANG):
    """Return (slug, desktop_path, mobile_path) for one language tree."""
    pref = lang_prefix(lang).lstrip('/')
    root = SITE / pref if pref else SITE
    skip = {'assets', 'm'} | LANG_PREFIXES
    pages = [('home', root / 'index.html', root / 'm' / 'index.html')]
    if not root.exists():
        return []
    for d in sorted(p for p in root.iterdir() if p.is_dir() and p.name not in skip and (p / 'index.html').exists()):
        pages.append((d.name, d / 'index.html', root / 'm' / d.name / 'index.html'))
    return pages


def list_all_pages():
    """(lang, slug, desktop, mobile) for every published language that has been built."""
    out = []
    for lang in published_langs():
        for slug, desk, mob in list_pages(lang):
            if desk.exists():
                out.append((lang, slug, desk, mob))
    return out


def existing_title(html: str) -> str:
    m = re.search(r'<title\b[^>]*>(.*?)</title>', html, flags=re.I | re.S)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else ''


def description_for(slug: str) -> str:
    if slug in WIX_DESCRIPTIONS:
        return WIX_DESCRIPTIONS[slug]
    if slug in COPY_DESCRIPTIONS:
        return COPY_DESCRIPTIONS[slug]
    md = CONTENT / f'{slug}.md'
    if md.exists():
        text = md.read_text(encoding='utf-8')
        body = text.split('---', 1)[-1] if '---' in text else text
        paras = []
        buf = []
        for line in body.splitlines():
            line = line.strip()
            if not line:
                if buf:
                    paras.append(re.sub(r'^#+\s*', '', ' '.join(buf)).strip())
                    buf = []
            else:
                buf.append(line)
        if buf:
            paras.append(re.sub(r'^#+\s*', '', ' '.join(buf)).strip())
        for p in paras:
            if len(p) >= 80:
                return p
        joined = ' '.join(p for p in paras if p)
        if joined:
            return joined
    return 'Joel Chang Design, industrial design portfolio.'


def short_name(title: str) -> str:
    t = title.replace(' | Joel Chang Design', '').strip()
    return t or title


def abs_media_url(src: str, page_file: Path) -> str | None:
    if not src or src.startswith('data:'):
        return None
    # resolve relative to the html file, then to /site
    page_dir = page_file.parent
    resolved = (page_dir / src).resolve()
    try:
        rel = resolved.relative_to(SITE.resolve()).as_posix()
    except ValueError:
        if src.startswith('/'):
            rel = src.lstrip('/')
        else:
            return None
    return f'{base()}/{rel}'


def pick_og_image(html: str, page_file: Path):
    best = None
    best_score = -1
    for m in re.finditer(r'<img\b[^>]*>', html, flags=re.I):
        tag = m.group(0)
        src_m = re.search(r'\ssrc="([^"]+)"', tag)
        if not src_m:
            continue
        src = unescape(src_m.group(1))
        if SKIP_SRC.search(src):
            continue
        dim = DIM_RE.search(src)
        w = h = 0
        if dim:
            w, h = int(dim.group(1)), int(dim.group(2))
        else:
            wm = re.search(r'\swidth="(\d+)"', tag)
            hm = re.search(r'\sheight="(\d+)"', tag)
            if wm and hm:
                w, h = int(wm.group(1)), int(hm.group(1))
        if w and w < 400:
            continue
        area = (w or 800) * (h or 600)
        score = area
        if w >= 600 and h >= 315:
            score += 1_000_000
        if score > best_score:
            url = abs_media_url(src, page_file)
            if url:
                best = (url, w or None, h or None)
                best_score = score
    if best:
        return best
    return (f'{base()}/{DEFAULT_OG}',) + DEFAULT_OG_WH


def org_person_graph(page_id: str, title: str, desc: str, image: str, slug: str, lang: str = DEFAULT_LANG):
    org_id = f'{base()}/#organization'
    person_id = f'{base()}/#person'
    site_id = f'{base()}/#website'
    graph = [
        {
            '@type': 'ProfessionalService',
            '@id': org_id,
            'name': ORG_NAME,
            'url': base(),
            'email': EMAIL,
            'sameAs': SAME_AS,
            'description': HOME_DESC,
            'founder': {'@id': person_id},
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'St. Louis',
                'addressRegion': 'Missouri',
            },
        },
        {
            '@type': 'Person',
            '@id': person_id,
            'name': PERSON_NAME,
            'alternateName': PERSON_ALT,
            'jobTitle': 'Industrial Designer',
            'url': f'{base()}/about',
            'email': EMAIL,
            'sameAs': SAME_AS,
            'worksFor': {'@id': org_id},
            'homeLocation': {
                '@type': 'Place',
                'name': 'St. Louis, Missouri',
            },
        },
        {
            '@type': 'WebSite',
            '@id': site_id,
            'name': ORG_NAME,
            'url': base(),
            'publisher': {'@id': org_id},
            'description': HOME_DESC,
            'inLanguage': [LANGS[k]['in_language'] for k in published_langs()],
        },
        {
            '@type': 'WebPage',
            '@id': page_id,
            'url': page_id,
            'name': title,
            'description': desc,
            'isPartOf': {'@id': site_id},
            'about': {'@id': person_id},
            'primaryImageOfPage': image,
            'inLanguage': LANGS[lang]['in_language'],
        },
    ]
    if slug in PROJECT_SLUGS:
        graph.append({
            '@type': 'CreativeWork',
            '@id': f'{page_id}#work',
            'name': short_name(title),
            'description': desc,
            'image': image,
            'url': page_id,
            'creator': {'@id': person_id},
            'sourceOrganization': {'@id': org_id},
            'inLanguage': LANGS[lang]['in_language'],
        })
    return graph


def json_ld_script(graph) -> str:
    payload = {'@context': 'https://schema.org', '@graph': graph}
    raw = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
    raw = raw.replace('<', '\\u003c').replace('>', '\\u003e')
    return f'<script type="application/ld+json">{raw}</script>'


def seo_block(slug: str, title: str, desc: str, image, is_mobile: bool, lang: str = DEFAULT_LANG) -> str:
    can = canonical_url(slug, lang)
    alt_m = mobile_url(slug, lang)
    img, iw, ih = image if len(image) == 3 else (image[0], None, None)
    og_url = can
    meta = LANGS[lang]
    parts = [
        SEO_BEGIN,
        f'<title>{escape(title)}</title>',
        f'<meta name="description" content="{escape(desc, quote=True)}"/>',
        '<meta name="robots" content="index,follow"/>',
        f'<link rel="canonical" href="{escape(can, quote=True)}"/>',
        f'<link rel="alternate" media="only screen and (max-width: 599px)" href="{escape(alt_m, quote=True)}"/>',
    ]
    if PUBLISH_I18N:
        for key in published_langs():
            lm = LANGS[key]
            href = canonical_url(slug, key)
            parts.append(
                f'<link rel="alternate" hreflang="{escape(lm["hreflang"], quote=True)}" href="{escape(href, quote=True)}"/>'
            )
        parts.append(
            f'<link rel="alternate" hreflang="x-default" href="{escape(canonical_url(slug, DEFAULT_LANG), quote=True)}"/>'
        )
    parts += [
        f'<meta property="og:title" content="{escape(title, quote=True)}"/>',
        f'<meta property="og:description" content="{escape(desc, quote=True)}"/>',
        f'<meta property="og:image" content="{escape(img, quote=True)}"/>',
    ]
    if iw and ih:
        parts.append(f'<meta property="og:image:width" content="{int(iw)}"/>')
        parts.append(f'<meta property="og:image:height" content="{int(ih)}"/>')
    parts += [
        f'<meta property="og:url" content="{escape(og_url, quote=True)}"/>',
        f'<meta property="og:site_name" content="{escape(ORG_NAME, quote=True)}"/>',
        '<meta property="og:type" content="website"/>',
        f'<meta property="og:locale" content="{escape(meta["og_locale"], quote=True)}"/>',
    ]
    if PUBLISH_I18N:
        for key in published_langs():
            if key == lang:
                continue
            lm = LANGS[key]
            parts.append(
                f'<meta property="og:locale:alternate" content="{escape(lm["og_locale"], quote=True)}"/>'
            )
    parts += [
        '<meta name="twitter:card" content="summary_large_image"/>',
        f'<meta name="twitter:title" content="{escape(title, quote=True)}"/>',
        f'<meta name="twitter:description" content="{escape(desc, quote=True)}"/>',
        f'<meta name="twitter:image" content="{escape(img, quote=True)}"/>',
        json_ld_script(org_person_graph(can, title, desc, img, slug, lang=lang)),
        SEO_END,
    ]
    return '\n'.join(parts)


META_DROP_NAME = {'description', 'robots', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'keywords'}
META_DROP_PROP_PREFIX = ('og:',)


def _attr(tag: str, name: str) -> str | None:
    m = re.search(rf'\s{name}="([^"]*)"', tag, flags=re.I)
    if m:
        return m.group(1)
    m = re.search(rf"\s{name}='([^']*)'", tag, flags=re.I)
    return m.group(1) if m else None


def strip_old_seo(head: str) -> str:
    # Remove a previous jcd-seo block.
    head = re.sub(re.escape(SEO_BEGIN) + r'.*?' + re.escape(SEO_END) + r'\n?', '', head, flags=re.S)
    head = re.sub(r'<title\b[^>]*>.*?</title>\s*', '', head, flags=re.I | re.S)

    def drop_meta(m):
        tag = m.group(0)
        name = (_attr(tag, 'name') or '').lower()
        prop = (_attr(tag, 'property') or '').lower()
        if name in META_DROP_NAME:
            return ''
        if any(prop.startswith(p) for p in META_DROP_PROP_PREFIX):
            return ''
        return tag

    head = re.sub(r'<meta\b[^>]*>\s*', drop_meta, head, flags=re.I)

    def drop_link(m):
        tag = m.group(0)
        rel = (_attr(tag, 'rel') or '').lower()
        if rel in ('canonical', 'alternate'):
            return ''
        return tag

    head = re.sub(r'<link\b[^>]*>\s*', drop_link, head, flags=re.I)
    head = re.sub(
        r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>.*?</script>\s*',
        '',
        head,
        flags=re.I | re.S,
    )
    return head


def inject_head(html: str, block: str) -> str:
    m = re.search(r'(<head\b[^>]*>)(.*?)(</head>)', html, flags=re.I | re.S)
    if not m:
        raise RuntimeError('no <head> found')
    new_head = strip_old_seo(m.group(2))
    # tidy extra blank lines
    new_head = re.sub(r'\n{3,}', '\n\n', new_head)
    if not new_head.endswith('\n'):
        new_head += '\n'
    new_head += block + '\n'
    return html[:m.start()] + m.group(1) + new_head + m.group(3) + html[m.end():]


def score_h1(text: str, title: str) -> int:
    t = re.sub(r'\s+', ' ', text).strip()
    if not t:
        return -1
    short = short_name(title)
    if t.lower() == short.lower() or t.lower() == title.lower():
        return 100
    if '@' in t or 'gmail.com' in t.lower():
        return 0
    if len(t) > 180:
        return 8
    if 2 <= len(t) <= 80:
        return 50
    return 20


def normalize_h1s(html: str, title: str) -> tuple[str, str]:
    m = re.search(r'(<body\b[^>]*>)(.*)$', html, flags=re.I | re.S)
    if not m:
        return html, 'no-body'
    body = m.group(2)
    # Don't touch an already-injected sr-only h1 in a later pass: strip then re-decide.
    body = re.sub(r'\s*<h1 class="seo-sr-only">.*?</h1>', '', body, flags=re.I | re.S)
    matches = list(re.finditer(r'<h1\b([^>]*)>(.*?)</h1>', body, flags=re.I | re.S))
    if not matches:
        inject = f'<h1 class="seo-sr-only">{escape(short_name(title))}</h1>'
        body = inject + body
        html = html[:m.start()] + m.group(1) + body
        return html, 'injected-none'
    scored = []
    for i, mm in enumerate(matches):
        text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', mm.group(2))).strip()
        scored.append((score_h1(text, title), i, text, mm))
    scored.sort(key=lambda x: (-x[0], x[1]))
    best_score, best_i, best_text, _ = scored[0]
    # If the only reasonable heading is a long dump or an email, hide a real title instead.
    inject_hidden = best_score < 40
    keep_i = None if inject_hidden else best_i
    # Replace from the end so offsets stay valid.
    for sc, i, text, mm in sorted(scored, key=lambda x: -x[3].start()):
        if keep_i is not None and i == keep_i:
            continue
        open_tag = mm.group(0)
        # Demote extras to <p>, keeping attributes/classes so Wix typography is unchanged.
        demoted = re.sub(r'^<h1\b', '<p', open_tag, count=1, flags=re.I)
        demoted = re.sub(r'</h1>$', '</p>', demoted, count=1, flags=re.I)
        body = body[:mm.start()] + demoted + body[mm.end():]
    if inject_hidden:
        body = f'<h1 class="seo-sr-only">{escape(short_name(title))}</h1>' + body
        action = f'injected-demoted-{len(matches)}'
    else:
        action = f'kept-1-demoted-{len(matches)-1}' if len(matches) > 1 else 'kept-1'
    html = html[:m.start()] + m.group(1) + body
    return html, action


def fill_alts(html: str) -> tuple[str, int]:
    n = 0

    def fix(m):
        nonlocal n
        tag = m.group(0)
        alt_m = re.search(r'\salt="([^"]*)"', tag)
        href_before = html[max(0, m.start()-400):m.start()]
        href = None
        hm = re.findall(r'<a\b[^>]*href="([^"]+)"[^>]*>', href_before, flags=re.I)
        if hm:
            href = hm[-1]
        new_alt = None
        current = alt_m.group(1) if alt_m else None
        if current in (None, ''):
            if href and 'linkedin.com' in href.lower():
                new_alt = 'LinkedIn'
            elif href and 'behance.net' in href.lower():
                new_alt = 'Behance'
        if current and re.fullmatch(r'Joel_wh(?:\.png)?', current, flags=re.I):
            new_alt = 'Joel Chang Design'
        if not new_alt:
            return tag
        n += 1
        if alt_m:
            return tag[:alt_m.start()] + f' alt="{new_alt}"' + tag[alt_m.end():]  # alt_m includes the leading space
        return re.sub(r'<img\b', f'<img alt="{new_alt}"', tag, count=1, flags=re.I)

    return re.sub(r'<img\b[^>]*>', fix, html, flags=re.I), n


def fix_defense_scope_links(html: str, page_file: Path) -> str:
    # Defense (and any other leftover) absolute /scope links become in-site relative links.
    target = Path(SITE / 'scope' / 'index.html') if 'site/m/' not in page_file.as_posix() and '/m/' not in str(page_file).replace('\\', '/') else Path(SITE / 'm' / 'scope' / 'index.html')
    # more reliable: if page is under site/m/, point at site/m/scope/index.html
    if page_file.is_relative_to(SITE / 'm'):
        target = SITE / 'm' / 'scope' / 'index.html'
    else:
        target = SITE / 'scope' / 'index.html'
    rel = os.path.relpath(target, start=page_file.parent).replace('\\', '/')
    html = html.replace(
        'data-unmapped-live-link="1" href="https://www.joel-chang-design.com/scope"',
        f'href="{rel}"',
    )
    html = html.replace(
        'href="https://www.joel-chang-design.com/scope" data-unmapped-live-link="1"',
        f'href="{rel}"',
    )
    html = html.replace('href="https://www.joel-chang-design.com/scope"', f'href="{rel}"')
    html = html.replace('href="http://www.joel-chang-design.com/scope"', f'href="{rel}"')
    return html


def ensure_lang(html: str, lang: str = DEFAULT_LANG) -> str:
    html_lang = LANGS[lang]['html_lang']
    direction = LANGS[lang]['dir']
    def repl(m):
        tag = m.group(0)
        if re.search(r'\blang=', tag, flags=re.I):
            tag = re.sub(r'\blang="[^"]*"', f'lang="{html_lang}"', tag, count=1, flags=re.I)
        else:
            tag = re.sub(r'<html\b', f'<html lang="{html_lang}"', tag, count=1, flags=re.I)
        if re.search(r'\bdir=', tag, flags=re.I):
            tag = re.sub(r'\bdir="[^"]*"', f'dir="{direction}"', tag, count=1, flags=re.I)
        else:
            tag = re.sub(r'<html\b', f'<html dir="{direction}"', tag, count=1, flags=re.I)
        return tag
    new_html, n = re.subn(r'<html\b[^>]*>', repl, html, count=1, flags=re.I)
    return new_html if n else html


def apply_page(slug: str, path: Path, is_mobile: bool, lang: str = DEFAULT_LANG) -> dict:
    html = path.read_text(encoding='utf-8')
    title = existing_title(html) or (
        'Joel Chang Design | industrial design' if slug == 'home' else f'{slug} | Joel Chang Design'
    )
    # After i18n_apply, title/description on translated pages are already in the
    # target language. Prefer the in-page title and any existing description.
    desc = None
    mdesc = re.search(r'<meta name="description" content="([^"]*)"', html)
    if mdesc and mdesc.group(1).strip():
        desc = mdesc.group(1).strip()
    if not desc:
        desc = description_for(slug)
    html = ensure_lang(html, lang)
    html = fix_defense_scope_links(html, path)
    html, alt_n = fill_alts(html)
    html, h1_action = normalize_h1s(html, title)
    image = pick_og_image(html, path)
    block = seo_block(slug, title, desc, image, is_mobile, lang=lang)
    html = inject_head(html, block)
    path.write_text(html, encoding='utf-8')
    return {
        'lang': lang,
        'slug': slug,
        'mode': 'mobile' if is_mobile else 'desktop',
        'file': str(path.relative_to(REPO)),
        'title': title,
        'h1': h1_action,
        'alts_filled': alt_n,
        'og_image': image[0],
        'canonical': canonical_url(slug, lang),
    }


def write_robots():
    bots = [
        'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User',
        'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot',
    ]
    lines = [
        '# robots.txt for Joel Chang Design',
        '# While this site is served from a GitHub Pages project path',
        '# (joe10912345.github.io/joel-chang-design-site/), crawlers only honor',
        '# robots.txt at the host root (https://joe10912345.github.io/robots.txt),',
        '# not this file. After the custom domain points here as the site root,',
        '# this file is the one that counts.',
        '',
        'User-agent: *',
        'Allow: /',
        '',
    ]
    for b in bots:
        lines += [f'User-agent: {b}', 'Allow: /', '']
    lines += [f'Sitemap: {base()}/sitemap.xml', '']
    (SITE / 'robots.txt').write_text('\n'.join(lines), encoding='utf-8')


def write_sitemap(all_pages):
    """Desktop URLs for published languages. Hreflang xhtml:link only when PUBLISH_I18N."""
    by_slug = {}
    for lang, slug, desk, _mob in all_pages:
        by_slug.setdefault(slug, {})[lang] = desk
    slugs = []
    if 'home' in by_slug:
        slugs.append('home')
    slugs += sorted(s for s in by_slug if s != 'home')
    urls = []
    for slug in slugs:
        files = by_slug[slug]
        for lang, desk in files.items():
            mtime = datetime.fromtimestamp(desk.stat().st_mtime).date().isoformat()
            loc = escape(canonical_url(slug, lang), quote=True)
            block = '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + mtime + '</lastmod>'
            if PUBLISH_I18N:
                links = []
                for key in published_langs():
                    lm = LANGS[key]
                    href = escape(canonical_url(slug, key), quote=True)
                    links.append(
                        f'    <xhtml:link rel="alternate" hreflang="{escape(lm["hreflang"], quote=True)}" href="{href}"/>'
                    )
                links.append(
                    f'    <xhtml:link rel="alternate" hreflang="x-default" href="{escape(canonical_url(slug, DEFAULT_LANG), quote=True)}"/>'
                )
                block += '\n' + '\n'.join(links)
            block += '\n  </url>'
            urls.append(block)
    if PUBLISH_I18N:
        header = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
            '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        )
    else:
        header = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        )
    xml = header + '\n'.join(urls) + '\n</urlset>\n'
    (SITE / 'sitemap.xml').write_text(xml, encoding='utf-8')
    return len(urls)



def write_llms():
    b = base()
    def u(slug):
        return b if slug == 'home' else f'{b}/{slug}'

    about = COPY_DESCRIPTIONS['about']
    short = [
        '# Joel Chang Design',
        '',
        f'> Industrial design studio and portfolio of {PERSON_NAME} ({PERSON_ALT}).',
        '',
        f'{about}',
        '',
        f'Currently Principal Industrial Designer at Tron Future Tech (remote). He has launched 8+ products across networking, defense products, and drone systems, with earlier work at Gemtek rebuilding in-house product design language for global telecom partners. Practice areas named on the site include DFM, UX, CMF, and brand identity, from concept through mass production.',
        '',
        f'Site: {b}',
        f'Contact: {EMAIL}',
        'Profiles: ' + ', '.join(SAME_AS),
        '',
        '## Projects',
        '',
    ]
    for slug, name, line in PROJECT_LINES:
        short.append(f'- [{name}]({u(slug)}): {line}')
    short += ['', '## Categories', '']
    for slug, name, line in CATEGORY_LINES:
        short.append(f'- [{name}]({u(slug)}): {line}')
    short += [
        '',
        '## Pages',
        '',
        f'- [Home]({u("home")})',
        f'- [About]({u("about")})',
        f'- [Contact]({u("contact")})',
        '',
        '## Notes for crawlers and agents',
        '',
        f'- The canonical host is {b}. Paths match the former Wix site.',
        '- The /scope page was password-protected on Wix; the public description above is taken from the Defense index, which links to it.',
        '',
    ]
    if PUBLISH_I18N:
        notes = short.index('## Notes for crawlers and agents')
        short[notes:notes] = [
            '## Languages',
            '',
            'The site is published in four languages at these URL prefixes (same page slugs):',
            '',
            f'- English (default, x-default): {b}/',
            f'- Traditional Chinese (zh-Hant): {b}/zh-hant/',
            f'- Simplified Chinese (zh-Hans): {b}/zh-cn/',
            f'- Arabic (ar, right-to-left): {b}/ar/',
            '',
        ]
        for i, line in enumerate(short):
            if line.startswith('- The canonical host is '):
                short[i] = f'- The canonical host is {b}. Paths match the former Wix site, with language prefixes as above.'
                break
    (SITE / 'llms.txt').write_text('\n'.join(short), encoding='utf-8')

    # Fuller companion: first substantial paragraph of each project from content/*.md
    full = short[:]
    full.insert(0, '')  # will rewrite header
    chunks = [
        '# Joel Chang Design — full summary',
        '',
        f'> Longer source-text companion to {b}/llms.txt. All wording is taken from the site.',
        '',
        '## About',
        '',
        about,
        '',
    ]
    about_md = CONTENT / 'about.md'
    if about_md.exists():
        text = about_md.read_text(encoding='utf-8')
        body = text.split('---', 1)[-1] if '---' in text else text
        # include the long career paragraph if present
        for para in re.split(r'\n\s*\n', body):
            para = re.sub(r'^#+\s*', '', para.strip())
            para = re.sub(r'\s+', ' ', para).strip()
            if len(para) > 200 and 'Tron Future' in para:
                chunks += [para, '']
                break
    chunks += ['## Projects', '']
    for slug, name, line in PROJECT_LINES:
        chunks.append(f'### {name}')
        chunks.append(f'URL: {u(slug)}')
        chunks.append(line)
        md = CONTENT / f'{slug}.md'
        if md.exists():
            text = md.read_text(encoding='utf-8')
            body = text.split('---', 1)[-1] if '---' in text else text
            paras = []
            buf = []
            for ln in body.splitlines():
                ln = ln.strip()
                if not ln:
                    if buf:
                        paras.append(re.sub(r'^#+\s*', '', ' '.join(buf)).strip())
                        buf = []
                else:
                    buf.append(ln)
            if buf:
                paras.append(re.sub(r'^#+\s*', '', ' '.join(buf)).strip())
            longp = next((p for p in paras if len(p) >= 120), None)
            if longp and longp != line:
                chunks.append(longp)
        chunks.append('')
    chunks += ['## Categories', '']
    for slug, name, line in CATEGORY_LINES:
        chunks.append(f'### {name}')
        chunks.append(f'URL: {u(slug)}')
        chunks.append(line)
        chunks.append('')
    chunks += [
        '## Contact',
        '',
        f'Email: {EMAIL}',
        f'Behance: {SAME_AS[0]}',
        f'LinkedIn: {SAME_AS[1]}',
        '',
    ]
    (SITE / 'llms-full.txt').write_text('\n'.join(chunks), encoding='utf-8')


def ensure_sr_only_css():
    css_path = SITE / 'assets' / 'css' / 'custom.css'
    if not css_path.exists():
        return
    css = css_path.read_text(encoding='utf-8')
    if '.seo-sr-only' in css:
        return
    css += (
        '\n/* Visually hidden H1 used only when a page has no suitable heading */\n'
        '.seo-sr-only { position: absolute !important; width: 1px !important; height: 1px !important;\n'
        '  padding: 0 !important; margin: -1px !important; overflow: hidden !important;\n'
        '  clip: rect(0, 0, 0, 0) !important; clip-path: inset(50%) !important;\n'
        '  white-space: nowrap !important; border: 0 !important; }\n'
    )
    css_path.write_text(css, encoding='utf-8')


def main():
    ensure_sr_only_css()
    all_pages = list_all_pages()
    report = []
    for lang, slug, desk, mob in all_pages:
        report.append(apply_page(slug, desk, False, lang=lang))
        if mob.exists():
            report.append(apply_page(slug, mob, True, lang=lang))
        else:
            print('WARN missing mobile', lang, slug, file=sys.stderr)
    write_robots()
    n_urls = write_sitemap(all_pages)
    write_llms()
    out = REPO / 'tools' / 'seo-report.json'
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    langs = ', '.join(published_langs())
    print(f'Applied SEO to {len(report)} HTML files; sitemap {n_urls} desktop URLs; langs={langs}; PUBLISH_I18N={PUBLISH_I18N}; SITE_BASE={base()}')
    return report


if __name__ == '__main__':
    main()
