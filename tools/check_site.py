"""Checks to run before every commit (Joel 2026-11-27: "我注意到你又把我的某些產品子頁的白背景改掉了。應該寫進 md 裡，
不然都被忽略"). 每次 commit 前必跑的檢查。  python tools/check_site.py   (exit 1 = something is wrong)

1. LIGHT PAGES stay light: these pages show Wix's WHITE page background through transparent sections. Their <html> must
   not carry class "jcd-dark-canvas", and no rule may paint their page background or transparent sections dark.
   白底頁面不可加 jcd-dark-canvas，也不可把背景改深色。
2. Every file a page or style sheet points to exists. 所有引用的檔案都存在。
3. No PNG in site/assets/media (images are WebP / JPEG). 網站圖片不可有 PNG。
4. custom.css / custom.js are built from src/ (tools/build_assets.py --check). 組合檔已更新。"""
import glob, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); os.chdir(ROOT)
LIGHT = ['moai-router', 'wi-fi7-extender', 'wi-fi7-hgu-ap', 'wi-fi7-2022', 'airgain-fwa-easy-installation-kit',
         'lionic-lionfilter-200', 'ai-tool-kit', 'nlg-mma200', 'sagittarius-laptop', 'assistive-products']
bad = []

for slug in LIGHT:
    for f in ('site/%s/index.html' % slug, 'site/m/%s/index.html' % slug):
        s = open(f, encoding='utf-8').read()
        tag = re.search(r'<html\b[^>]*>', s).group(0)
        if 'jcd-dark-canvas' in tag: bad.append('LIGHT PAGE MADE DARK: %s has class jcd-dark-canvas' % f)
src = ''.join(open(p, encoding='utf-8').read() for p in glob.glob('src/**/*.css', recursive=True))
for slug in LIGHT:
    if re.search(r'%s[^{]*\{[^}]*background[^}]*#000' % re.escape(slug), src): bad.append('LIGHT PAGE MADE DARK: a src/css rule paints %s black' % slug)

for f in glob.glob('site/**/index.html', recursive=True) + glob.glob('site/assets/**/*.css', recursive=True):
    d = os.path.dirname(f); s = open(f, encoding='utf-8', errors='ignore').read()
    for m in re.findall(r'(?:src|href|srcset)="((?:\.\./)*assets/[^"?#\s,]+)|url\(["\']?((?:\.\./|assets/)[^)"\'?#]+)', s):
        u = m[0] or m[1]
        if not os.path.exists(os.path.normpath(os.path.join(d, u))): bad.append('MISSING FILE: %s -> %s' % (f, u))

png = glob.glob('site/assets/media/**/*.png', recursive=True)
if png: bad.append('PNG in the site (use WebP): %d, e.g. %s' % (len(png), png[0]))

if subprocess.run([sys.executable, 'tools/build_assets.py', '--check'], capture_output=True).returncode:
    bad.append('custom.css / custom.js are not built from src/: run python tools/build_assets.py')

print('\n'.join(bad[:40]) if bad else 'OK: light pages light, all files present, no PNG, built files up to date')
sys.exit(1 if bad else 0)
