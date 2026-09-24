#!/usr/bin/env python3
"""Change the website's domain everywhere it appears.

Canonical links, Open Graph URLs, structured data, the sitemap, robots.txt
and assets/js/site-config.js all carry the full site address. When a custom
domain is connected in Vercel, run this once from the repository root:

    python3 tools/set-domain.py https://www.example.co.uk

then commit and push. Nothing else needs editing.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'assets/js/site-config.js'


def current():
    m = re.search(r"var SITE_URL = '([^']+)'", CONFIG.read_text())
    return m.group(1).rstrip('/')


def main():
    if len(sys.argv) != 2 or not re.match(r'^https://[a-z0-9.-]+$', sys.argv[1].rstrip('/')):
        sys.exit('usage: python3 tools/set-domain.py https://your-domain')
    new, old = sys.argv[1].rstrip('/'), current()
    if new == old:
        print('Already set to', new)
        return
    files = list(ROOT.glob('*.html')) + [ROOT / 'sitemap.xml', ROOT / 'robots.txt', CONFIG]
    for f in files:
        text = f.read_text()
        if old in text:
            f.write_text(text.replace(old, new))
            print('updated', f.relative_to(ROOT))
    print(old, '->', new)


if __name__ == '__main__':
    main()
