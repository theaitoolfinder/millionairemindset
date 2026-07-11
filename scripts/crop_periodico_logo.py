#!/usr/bin/env python3
"""Crop the Periodico icon mark tightly to its existing alpha content."""
import numpy as np
from PIL import Image
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, 'images', 'periodico', 'LOGO.PNG')
OUT = os.path.join(BASE, 'images', 'periodico', 'logo-icon.png')

img = Image.open(SRC).convert('RGBA')
arr = np.array(img)
alpha = arr[..., 3]

ys, xs = np.where(alpha > 10)
pad = 6
x0, x1 = max(0, xs.min() - pad), min(img.width, xs.max() + pad)
y0, y1 = max(0, ys.min() - pad), min(img.height, ys.max() + pad)

cropped = img.crop((x0, y0, x1, y1))
cropped.save(OUT)
print('Saved', OUT, cropped.size)
