#!/usr/bin/env python3
"""Copy public/ into a GitHub Pages folder, adjusting site-root links for a project page.

GitHub Pages serves this repo under /<repo>/ (https://<user>.github.io/<repo>/), so links like
href="/job-search/" must become href="/<repo>/job-search/". The canonical domain is swapped too.

Usage: python3 tools/build_pages.py public _site /Gradeline https://jcbubba11.github.io/Gradeline
"""
import hashlib
import os
import re
import shutil
import sys

OLD_SITE = "https://enchanting-cobbler-9bc669.netlify.app"


# Scripts and styles the app loads by relative path. Each reference gets ?v=<content hash> so a new
# deploy never mixes a fresh index.html with an old cached script. Files that reference others come later.
VERSIONED = re.compile(r'(["\'])((?:assets/[\w.-]+\.(?:js|css))|interview-(?:bank|prep)\.js)\1')


def add_versions(dst):
    def digest(rel):
        path = os.path.join(dst, rel)
        return hashlib.sha256(open(path, "rb").read()).hexdigest()[:10] if os.path.isfile(path) else None

    def stamp(path):
        text = open(path, encoding="utf-8").read()
        out = VERSIONED.sub(lambda m: f"{m[1]}{m[2]}?v={digest(m[2])}{m[1]}" if digest(m[2]) else m[0], text)
        if out != text:
            open(path, "w", encoding="utf-8").write(out)

    stamp(os.path.join(dst, "assets", "app.js"))  # names the on-demand files
    for root, _, files in os.walk(dst):
        for name in files:
            if name.endswith(".html"):
                stamp(os.path.join(root, name))


def main():
    src, dst, base, site = sys.argv[1], sys.argv[2], sys.argv[3].rstrip("/"), sys.argv[4].rstrip("/")
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)
    attr = re.compile(r'((?:href|src|action)=["\'])/(?!/)')
    for root, _, files in os.walk(dst):
        for name in files:
            path = os.path.join(root, name)
            if not name.endswith((".html", ".xml", ".txt")):
                continue
            text = open(path, encoding="utf-8").read()
            out = text.replace(OLD_SITE, site)
            if name.endswith(".html"):
                out = attr.sub(r"\1" + base + "/", out)
                out = out.replace('"/internships/data.json"', f'"{base}/internships/data.json"')
            if out != text:
                open(path, "w", encoding="utf-8").write(out)
    add_versions(dst)
    open(os.path.join(dst, ".nojekyll"), "w").close()
    print("built", dst, "for", site)


if __name__ == "__main__":
    main()
