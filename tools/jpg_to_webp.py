"""Site photos JPEG -> WebP (Joel 2026-11-27: "Yes, convert them" — same look, ~30% lighter). 網站照片 JPG 轉 WebP。

For every .jpg in site/assets/media/: write <name>.webp (quality 86, from the JPEG). Kept as JPEG when the WebP is not
smaller. References are switched to .webp everywhere EXCEPT social / search previews (meta og:image, twitter:image,
JSON-LD), which keep their JPEG (LinkedIn & co. don't reliably show WebP) — those JPEG files stay on the site.
Other replaced JPEGs are removed. Old -> new: reference/jpg-to-webp-2026-11-27.json. Safe to re-run.
照片轉 WebP；社群分享預覽仍用 JPG（保留該檔）。"""
import glob, json, os, re, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
PROTECT = re.compile(r'<meta\b[^>]*>|<script type="application/ld\+json">.*?</script>', re.S)
pages = glob.glob('site/**/*.html', recursive=True)

# 1. JPEGs used by social / search previews keep a JPEG
keep = set()
for f in pages:
    for blk in PROTECT.findall(open(f, encoding='utf-8', errors='ignore').read()):
        keep.update(re.findall(r'assets/media/([^"\'\s<>]+?\.jpe?g)', blk))
print('JPEGs kept for previews:', len(keep))

# 2. convert
jpgs = sorted(p.replace(os.sep, '/') for p in glob.glob('site/assets/media/**/*.jpg', recursive=True))
rel, saved, before = {}, 0, 0
for i, p in enumerate(jpgs):
    new = p[:-4] + '.webp'
    im = Image.open(p); im.load(); im = im.convert('RGB')
    im.save(new, 'WEBP', quality=86, method=4)
    a, b = os.path.getsize(p), os.path.getsize(new)
    if b >= a: os.remove(new); continue
    before += a; saved += a - b
    rel[p.split('assets/media/', 1)[1]] = new.split('assets/media/', 1)[1]
    if i % 100 == 0: print(i, '/', len(jpgs), flush=True)
print('converted', len(rel), 'of', len(jpgs), '| %.1f MB -> %.1f MB' % (before / 1e6, (before - saved) / 1e6), flush=True)

# 3. references (outside the protected preview blocks)
pat = re.compile('|'.join(re.escape(k) for k in sorted(rel, key=len, reverse=True)))
files = pages + glob.glob('site/assets/**/*.css', recursive=True) + glob.glob('site/assets/js/*.js') + \
        glob.glob('src/**/*.*', recursive=True) + glob.glob('private/**/*.html', recursive=True)
n = 0
for f in files:
    s = open(f, encoding='utf-8', errors='ignore').read()
    held = []
    def hold(m): held.append(m.group(0)); return '\x00%d\x00' % (len(held) - 1)
    t = PROTECT.sub(hold, s) if f.endswith('.html') else s
    t = pat.sub(lambda m: rel[m.group(0)], t)
    t = re.sub('\x00(\\d+)\x00', lambda m: held[int(m.group(1))], t)
    if t != s: open(f, 'w', encoding='utf-8', newline='').write(t); n += 1
print(n, 'files updated')

# 4. media map + remove replaced JPEGs (except preview ones)
mm = json.load(open('reference/media-map.json', encoding='utf-8'))
for k in list(mm):
    if k in rel:
        v = mm.pop(k); mm[rel[k]] = v
        if k in keep: mm[k] = dict(v, note=(v.get('note', '') + ' JPEG kept for social previews').strip())
json.dump(mm, open('reference/media-map.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k in rel:
    if k not in keep: os.remove('site/assets/media/' + k)
json.dump({'note': 'JPEG -> WebP 2026-11-27; JPEGs kept for previews listed in "kept"', 'files': rel, 'kept': sorted(keep)},
          open('reference/jpg-to-webp-2026-11-27.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('done')
