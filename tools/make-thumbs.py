#!/usr/bin/env python3
"""Make the smaller copies of project photographs used by cards and galleries.

For every photograph in images/projects/<project>/ this writes a copy no more
than 960px on its long edge to images/projects/<project>/w960/ (skipping ones
that already exist) and rewrites assets/js/image-sizes.js to list them,
with each original's width and height.

Optional: a photograph without a small copy still works, it is just a larger
download. Needs Pillow (pip install Pillow). Run from the repository root:

    python3 tools/make-thumbs.py
"""
import json, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX = 960
sizes = {}
dims = {}
for p in sorted((ROOT / 'images/projects').glob('*/*.jpg')):
    if 'video-poster' in p.name:
        continue
    out = p.parent / 'w960' / p.name
    if not out.exists():
        out.parent.mkdir(exist_ok=True)
        im = Image.open(p).convert('RGB')
        s = min(1, MAX / max(im.size))
        im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).save(out, quality=78, optimize=True, progressive=True)
        print('made', out.relative_to(ROOT))
    sizes[str(p.relative_to(ROOT))] = str(out.relative_to(ROOT))
    dims[str(p.relative_to(ROOT))] = list(Image.open(p).size)

js = ROOT / 'assets/js/image-sizes.js'
text = js.read_text()
head = text[:text.index('window.BC_IMAGE_SIZES')]
js.write_text(head + 'window.BC_IMAGE_SIZES = ' + json.dumps(sizes, indent=2) + ';\n\n'
             '/* Width and height of each original, so a page can lay out an upright\n'
             '   photograph correctly before it has loaded. */\n'
             'window.BC_IMAGE_DIMS = ' + json.dumps(dims) + ';\n')
print(len(sizes), 'photographs listed')
