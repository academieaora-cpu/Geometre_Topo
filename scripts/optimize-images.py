#!/usr/bin/env python3
"""Génère les images WebP optimisées du site à partir de photos/originals/.

Usage : npm run images   (ou python3 scripts/optimize-images.py)

- Chaque photo est déclinée en plusieurs largeurs (srcset) au format WebP.
- Un manifeste src/data/images.json est produit (dimensions, variantes).
- Le logo est recadré et exporté pour l'en-tête ; l'image Open Graph est composée.
Les métadonnées EXIF (dont la géolocalisation éventuelle) sont supprimées.
"""
import json
import os
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "photos", "originals")
OUT = os.path.join(ROOT, "public", "images", "photos")
MANIFEST = os.path.join(ROOT, "src", "data", "images.json")
WIDTHS = [400, 720, 1080]
# Fichiers traités séparément (pas de déclinaison en galerie)
SPECIAL = {"logo-geometre-topo.jpg"}

os.makedirs(OUT, exist_ok=True)
manifest = {}

for name in sorted(os.listdir(SRC)):
    if not name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) or name in SPECIAL:
        continue
    slug = os.path.splitext(name)[0]
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, name))).convert("RGB")
    variants = []
    for w in WIDTHS:
        if w > im.width and variants:
            continue
        target_w = min(w, im.width)
        h = round(im.height * target_w / im.width)
        out = im.resize((target_w, h), Image.LANCZOS)
        fname = f"{slug}-{target_w}.webp"
        out.save(os.path.join(OUT, fname), "WEBP", quality=68, method=6)
        variants.append({"src": f"/images/photos/{fname}", "width": target_w, "height": h})
    manifest[slug] = {"width": im.width, "height": im.height, "variants": variants}
    print(f"{slug}: {[v['width'] for v in variants]}")

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

# Logo : recadrage sur la zone utile (fond bleu nuit #01005D)
logo = Image.open(os.path.join(SRC, "logo-geometre-topo.jpg")).convert("RGB")
logo_crop = logo.crop((270, 410, 1050, 900))
os.makedirs(os.path.join(ROOT, "public", "images"), exist_ok=True)
for h in (96, 192):
    w = round(logo_crop.width * h / logo_crop.height)
    logo_crop.resize((w, h), Image.LANCZOS).save(
        os.path.join(ROOT, "public", "images", f"logo-{h}.webp"), "WEBP", quality=90)
    print(f"logo-{h}.webp: {w}x{h}")

# Image Open Graph 1200x630 : logo + photo de terrain
og = Image.new("RGB", (1200, 630), (1, 0, 93))
photo = ImageOps.exif_transpose(Image.open(os.path.join(SRC, "releve-gnss-borne.jpg"))).convert("RGB")
photo = ImageOps.fit(photo, (520, 630), Image.LANCZOS, centering=(0.5, 0.6))
og.paste(photo, (680, 0))
lw = 560
lh = round(logo_crop.height * lw / logo_crop.width)
og.paste(logo_crop.resize((lw, lh), Image.LANCZOS), (60, (630 - lh) // 2))
og.save(os.path.join(ROOT, "public", "images", "og-geometre-topo.jpg"), quality=85, optimize=True)
print("og-geometre-topo.jpg")
