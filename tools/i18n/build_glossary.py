#!/usr/bin/env python3
"""Merge part_*.json translations, derive zh-cn via OpenCC, write glossary.json."""
from __future__ import annotations

import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
# venv with opencc-python-reimplemented
VENV_SITE = Path('/tmp/i18nvenv/lib')

def load_opencc():
    import glob
    for p in glob.glob(str(Path('/tmp/i18nvenv/lib') / 'python*' / 'site-packages')):
        if p not in sys.path:
            sys.path.insert(0, p)
    from opencc import OpenCC
    return OpenCC('tw2sp')

# Post-conversion term fixes (OpenCC sometimes yields awkward mainland wording).
CN_FIXES = [
    ('用户经验', '用户体验'),
    ('使用者体验', '用户体验'),
    ('伺服器', '服务器'),
    ('软体', '软件'),
    ('记忆体', '内存'),
    ('萤幕', '屏幕'),
    ('滑鼠', '鼠标'),
    ('网路', '网络'),
    ('品质管制', '质量控制'),
    ('品质管理', '质量管理'),
    # leave 质感 alone; only standalone 品质 in QC-ish compounds already handled
]

def to_cn(cc, zh_hant: str) -> str:
    s = cc.convert(zh_hant)
    for a, b in CN_FIXES:
        s = s.replace(a, b)
    return s

def main():
    parts = sorted(HERE.glob('part_*.json'))
    merged: dict[str, list] = {}
    for p in parts:
        data = json.loads(p.read_text(encoding='utf-8'))
        for k, v in data.items():
            if k in merged and merged[k] != v:
                print(f'WARN override {p.name}: {k[:60]!r}')
            merged[k] = v
    cc = load_opencc()
    glossary = {}
    for en, (zh_hant, ar) in merged.items():
        if not isinstance(zh_hant, str) or not isinstance(ar, str):
            raise SystemExit(f'bad entry for {en[:80]!r}')
        glossary[en] = {
            'zh-hant': zh_hant,
            'zh-cn': to_cn(cc, zh_hant) if zh_hant else zh_hant,
            'ar': ar,
        }
        # If source itself is already zh-Hant chrome, zh-cn is converted; ar provided.
    out = HERE / 'glossary.json'
    out.write_text(json.dumps(glossary, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'wrote {out}  entries={len(glossary)}  parts={len(parts)}')

if __name__ == '__main__':
    main()
