import sys, os, json
from PIL import Image, ImageChops, ImageStat
import numpy as np
R='/workspace/wixcopy-tools'
def cmp(mode, s, sbs_dir=None, scale=0.35):
    a=Image.open(f'{R}/liveshots/{mode}/{s}.png').convert('RGB'); b=Image.open(f'{R}/local/{mode}/{s}.png').convert('RGB')
    hdiff = b.height - a.height
    h=min(a.height,b.height); w=min(a.width,b.width)
    A=np.asarray(a.crop((0,0,w,h)).resize((w//4,h//4))).astype(float); B=np.asarray(b.crop((0,0,w,h)).resize((w//4,h//4))).astype(float)
    mad = np.abs(A-B).mean()
    same = (np.abs(A-B).max(axis=2) < 24).mean()
    if sbs_dir:
        os.makedirs(sbs_dir, exist_ok=True)
        H=max(a.height,b.height); W=a.width+b.width+20
        c=Image.new('RGB',(W,H),(255,0,255)); c.paste(a,(0,0)); c.paste(b,(a.width+20,0))
        c=c.resize((int(W*scale),int(H*scale)))
        c.save(f'{sbs_dir}/{mode}-{s}.jpg', quality=80)
    return {'live_h':a.height,'local_h':b.height,'height_diff':hdiff,'mean_abs_diff':round(mad,2),'pixels_match_pct':round(same*100,1)}
if __name__=='__main__':
    mode=sys.argv[1]; slugs=sys.argv[2].split(',')
    for s in slugs: print(mode,s,cmp(mode,s,'/tmp/sbs'))
