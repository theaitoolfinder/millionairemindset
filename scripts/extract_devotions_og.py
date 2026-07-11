#!/usr/bin/env python3
"""Extract title + imgQuery per devotion entry into a slim JSON file
the Cloudflare Worker (workers/og-devotional.js) can fetch cheaply,
instead of parsing the full 4000-line devotions-*.js data files."""
import json
import re
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

FIELD_RE = re.compile(
    r"title\s*:\s*'((?:[^'\\]|\\.)*)'.*?imgQuery\s*:\s*'((?:[^'\\]|\\.)*)'",
    re.DOTALL
)

def unescape(s):
    return s.replace("\\'", "'").replace('\\"', '"')

def extract(path):
    with open(path, encoding='utf-8') as f:
        content = f.read()
    # Split into individual object blocks on top-level "},\n  {" boundaries
    # Simpler: iterate over each "title:" occurrence and grab the nearest
    # following "imgQuery:" on the same object (they're always adjacent
    # within a few lines in this data format).
    entries = []
    for m in re.finditer(r"title\s*:\s*'((?:[^'\\]|\\.)*)'", content):
        title = unescape(m.group(1))
        # find the next imgQuery after this title
        q = re.search(r"imgQuery\s*:\s*'((?:[^'\\]|\\.)*)'", content[m.end():m.end()+800])
        img_query = unescape(q.group(1)) if q else ''
        entries.append({'title': title, 'imgQuery': img_query})
    return entries

out = {}
for edition, fname in [('kids', 'devotions-kids.js'), ('yuppies', 'devotions-yuppies.js'), ('primes', 'devotions-primes.js')]:
    entries = extract(os.path.join(BASE, fname))
    assert len(entries) == 365, f'{fname}: expected 365 entries, got {len(entries)}'
    out[edition] = entries

out_path = os.path.join(BASE, 'data', 'devotions-og.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, separators=(',', ':'))

print(f'Wrote {out_path} — {sum(len(v) for v in out.values())} entries total')
