"""Make the site's PNG images light (Joel 2026-11-27: "好像很多圖片讀取很慢"). 把網站的 PNG 圖片變輕。

PNG is lossless: a photo stored as PNG is several times heavier than needed. For every PNG in site/assets/media/:
  - transparent (cut-out products, logos, icons): -> WebP with transparency (quality 86; files under 40 KB lossless)
  - opaque: -> JPEG q86 4:4:4 (the site's JPEG standard)
Same name, new extension. Every reference is updated (pages, src/css, src/js, built CSS/JS, reference/media-map.json),
the PNG is removed from the site, and reference/png-to-web-2026-11-27.json lists old -> new.
Safe to re-run (does nothing when no PNG is left).
透明圖轉 WebP（保留透明），不透明的轉 JPG；所有引用一起更新。"""
import glob, io, json, os, re, subprocess
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
moves = {}
for p in sorted(glob.glob('site/assets/media/**/*.png', recursive=True)):
    p = p.replace(os.sep, '/'); im = Image.open(p); im.load()
    alpha = (im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)) and im.convert('RGBA').getchannel('A').getextrema()[0] < 250
    if alpha:
        new = p[:-4] + '.webp'; rgba = im.convert('RGBA')
        if os.path.getsize(p) < 40000: rgba.save(new, 'WEBP', lossless=True, method=6)
        else: rgba.save(new, 'WEBP', quality=86, method=6, alpha_quality=95)
    else:
        new = p[:-4] + '.jpg'
        if os.path.exists(new): new = p[:-4] + '-v2.jpg'
        im.convert('RGB').save(new, 'JPEG', quality=86, subsampling=0, optimize=True)
    moves[p] = new
print(len(moves), 'converted')

# references: by path below assets/media/ (works for ../, ../../, assets/ and url() forms)
rel = {a.split('assets/media/', 1)[1]: b.split('assets/media/', 1)[1] for a, b in moves.items()}
if rel:
    pat = re.compile('|'.join(re.escape(k) for k in sorted(rel, key=len, reverse=True)))
    files = (glob.glob('site/**/*.html', recursive=True) + glob.glob('site/assets/**/*.css', recursive=True) +
             glob.glob('site/assets/js/*.js') + glob.glob('src/**/*.*', recursive=True) + glob.glob('private/**/*.html', recursive=True))
    n = 0
    for f in files:
        s = open(f, encoding='utf-8', errors='ignore').read(); t = pat.sub(lambda m: rel[m.group(0)], s)
        if t != s: open(f, 'w', encoding='utf-8', newline='').write(t); n += 1
    print(n, 'files updated')
    mm = json.load(open('reference/media-map.json', encoding='utf-8'))
    mm = {rel.get(k, k): v for k, v in mm.items()}
    json.dump(mm, open('reference/media-map.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    json.dump({'note': 'PNG -> WebP (transparent) / JPEG (opaque), 2026-11-27', 'files': moves},
              open('reference/png-to-web-2026-11-27.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for a in moves:
        if subprocess.run(['git', 'rm', '-q', '--cached', a], capture_output=True).returncode not in (0, 128): pass
        os.remove(a)
