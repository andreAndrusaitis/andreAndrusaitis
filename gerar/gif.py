"""Transforma os quadros crus em GIF transparente: python gif.py <quadros> <saida>"""
import json
import os
import sys

import numpy as np
from PIL import Image

src, out, escala = sys.argv[1], sys.argv[2], 4
os.makedirs(out, exist_ok=True)
for modo in ("noite", "dia"):
    with open(f"{src}/{modo}.json") as f:
        m = json.load(f)
    quadros = np.fromfile(f"{src}/{modo}.raw", np.uint8).reshape(m["n"], m["h"], m["w"])
    pal = sum(m["pal"], [])
    pal += [0] * (768 - len(pal))
    fr = []
    for q in quadros:
        im = Image.fromarray(np.kron(q, np.ones((escala, escala), np.uint8)))
        im = im.convert("L")
        p = Image.new("P", im.size)
        p.putdata(list(im.getdata()))
        p.putpalette(pal)
        fr.append(p)
    destino = os.path.join(out, f"capa-{modo}.gif")
    fr[0].save(destino, save_all=True, append_images=fr[1:], duration=190, loop=0, disposal=2, transparency=0, optimize=False)
    print(destino, os.path.getsize(destino) // 1024, "KB")
