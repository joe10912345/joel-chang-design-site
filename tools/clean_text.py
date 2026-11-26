"""Clean-up of text left over from the Wix export (Joel 2026-11-27). Safe to re-run.
   清理 Wix 匯出留下的文字（可重複執行）。

   - image alt text that was a raw file name (Chinese, screenshots, LINE_ALBUM, ok.jpg ...) -> clean English
     圖片替代文字是原始檔名的 -> 改成乾淨的英文描述
   - Wix UI labels still in Chinese (skip link, aria-labels, password dialog) -> English
     Wix 介面殘留的中文（跳到主要內容、aria-label、密碼視窗）-> 英文
   - "T.Interceptor" -> "T. Interceptor", "Kung(Design Director)" -> "Kung (Design Director)"
   - wi-fi7-hgu-ap: decorative "ESG" text mask was an <h1> -> <p>   裝飾字 ESG 不再是 H1
   - wi-fi7-hgu-ap: DFM sentence rewritten in an action-led voice      DFM 段落改成行動導向語氣

   Usage 用法:  python tools/clean_text.py   (edits site/**/index.html and content/*.md in place)
"""
import re, glob, os, html

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
CJK = re.compile(r'[一-鿿�]')
FILEY = re.compile(r'\.(jpe?g|png|gif|webp|bip|svg)\b', re.I)

DECORATIVE = {'gradient.png', '未命名-1 - wide_edited.png'}   # background glows -> empty alt 背景光暈：空的替代文字
SPECIAL = {   # file-name alt -> description ({T} = page name)  特定圖片的描述
    'thermal vision(PLA).jpg': 'Thermal camera view of a drone target',
    'capture net at forest.jpg': 'Net capture of a drone above a forest',
    'wind power.jpg': 'Wind farm protected by the counter-drone system',
    'water dam_1.jpg': 'Dam protected by the counter-drone system',
    'stadium.jpg': 'Stadium protected by the counter-drone system',
    'power_2.jpg': 'Power plant protected by the counter-drone system',
    'MediaTek_聯發科技新品牌Logo.jpg': 'MediaTek logo',
    'Qualcomm-Logo.svg.png': 'Qualcomm logo',
    'goldenpin_design_logo.png': 'Golden Pin Design Award logo',
    'gemtek.jpg': 'Gemtek logo',
    '64d0a82e177979e002f1272a_img-media-pr-golden-award-may-2023-thumb.jpg': 'Golden award press photo',
    'sketch.jpg': '{T} design sketch',
    '筆電彩現.jpg': '{T} rendering',
    '場景渲染_Final - 線整理1.jpg': '{T} scene rendering',
    '黃昏改.jpg': '{T} at dusk',
    '講解_1_edited.jpg': 'Joel Chang reviewing material samples',
    'star-wars-the-last-jedi.jpg': '{T} design inspiration',
    'earbud.jpg': '{T} earbuds', 'earbud_3.jpg': '{T} earbuds',
    'Bamboo_1.jpg': '{T} bamboo texture study',
    'RGB.png': '{T} RGB lighting',
    'Front_12.png': '{T} front view', 'front_11.png': '{T} front view', 'side_12.png': '{T} side view',
    'back_1.png': '{T} back view', 'Right_1.png': '{T} right side view',
    'WhatsApp-Image-2020-08-14-at-07.39.36.jpeg': '{T} in use',
    'fffs1.png': 'Nine products across consumer tech, smart home, lifestyle and wearables',
    'worldwide - 複製.png': 'World map of projects delivered for clients in different countries',
    '螢幕擷取畫面 2026-04-01 135308.jpg': 'Hand arranging 3D-printed prototype parts on a table',
    '螢幕擷取畫面 2026-04-01 123406.png': 'T. Guardian counter-drone tower',
    'AIRMP.jpg': 'AIRMP air purifier', 'mma200.jpg': 'NLG MMA200', 'mma120.jpg': 'NLG MMA120',
    'Geometry series.jpg': 'Geometry Series', 'CS.jpg': 'T. Interceptor CS', 'SB.jpg': 'T. Blade',
}
UI = {   # Wix interface strings left in Chinese  Wix 介面中文字串
    '社交工具列': 'Social bar', '社交工��具列': 'Social bar', '社交工�具列': 'Social bar',
    '內容在浮動時改變': 'Content changes on hover', '網址': 'Link', '開啟導覽選單': 'Open navigation menu',
    ' 播放影片': 'Play video', 'Untitled video - Made with Clipchamp.mp4 播放影片': 'Play video',
    '播放文字遮罩': 'Play text animation', '關閉': 'Close', '密碼': 'Password',
}
TEXT = {'>跳到主要內容<': '>Skip to main content<', '>賓客區<': '>Guest area<',
        '>請在下面輸入密碼。<': '>Please enter the password below.<', '>開始<': '>Go<'}
DFM_OLD = ('As an experienced designer, I believe it’s essential to protect the design intent while understanding the needs '
           'of every team. I took apart a wide range of plastic products and studied mold design. From that research, I proposed a '
           'vertical sleeve assembly that keeps the original form while lowering costs and making assembly more efficient. The '
           'solution was approved by everyone on the team and was well received by our client in Taiwan.')
DFM_NEW = ('Rather than trade the design intent for cost, I worked through the needs of every team, tore down a wide range '
           'of plastic products and dug into mold design. That research led to a vertical sleeve assembly that keeps the original '
           'form while cutting cost and speeding up assembly. The whole team approved it, and our client in Taiwan received it well.')
TYPO = [('T.Interceptor', 'T. Interceptor'), ('Kung(Design Director)', 'Kung (Design Director)'), (DFM_OLD, DFM_NEW)]


def page_name(s):
    m = re.search(r'<title>([^<|]*)', s)
    t = (m.group(1) if m else '').strip()
    return 'Joel Chang Design' if t.lower().startswith('joel chang') or t in ('1', '2', '3', '') else t


def new_alt(old, tag, T):
    if old in DECORATIVE:
        return ''
    if old in SPECIAL:
        return SPECIAL[old].replace('{T}', T)
    src = re.search(r'\ssrc="[^"]*/[a-z0-9-]+-(\d\d)-\d+x\d+', tag)
    return '%s design detail %d' % (T, int(src.group(1))) if src else '%s design detail' % T


def fix_html(s):
    T = page_name(s)

    def img(m):
        tag = m.group(0)
        mm = re.search(r'\salt="([^"]*)"', tag)
        if not mm:
            return tag
        old = html.unescape(mm.group(1))
        if not (CJK.search(old) or FILEY.search(old)):
            return tag
        return tag[:mm.start(1)] + html.escape(new_alt(old, tag, T), quote=True) + tag[mm.end(1):]

    s = re.sub(r'<img\b[^>]*>', img, s)
    for k, v in UI.items():
        s = s.replace('aria-label="%s"' % k, 'aria-label="%s"' % v).replace('placeholder="%s"' % k, 'placeholder="%s"' % v)
    for k, v in TEXT.items():
        s = s.replace(k, v)
    for k, v in TYPO:
        s = s.replace(k, v)
    s = s.replace('<h1 class="qV6G7K" data-testid="heading-tag">ESG</h1>', '<p class="qV6G7K" data-testid="heading-tag">ESG</p>')
    return s


if __name__ == '__main__':
    n = 0
    for f in glob.glob(os.path.join(ROOT, 'site', '**', 'index.html'), recursive=True):
        s = open(f, encoding='utf-8').read()
        t = fix_html(s)
        if t != s:
            open(f, 'w', encoding='utf-8', newline='').write(t)
            n += 1
    for f in glob.glob(os.path.join(ROOT, 'content', '*.md')):
        s = open(f, encoding='utf-8').read()
        t = s
        for k, v in TYPO:
            t = t.replace(k, v)
        if t != s:
            open(f, 'w', encoding='utf-8', newline='').write(t)
    print(n, 'pages changed')
