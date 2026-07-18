#!/usr/bin/env python3
"""
Combines the agent-generated batch JSON files per edition, dedupes titles,
trims to the exact number of slots needed, converts each object to a JS
object-literal string matching the site's existing formatting, and splices
them into the devotions-*.js files at the flagged duplicate-title indices.
"""
import glob
import json
import re
import sys

from split_devotions import analyze


def js_string(s):
    """Single-quoted JS string literal, escaping backslash, quote, and
    control characters that are illegal unescaped inside a JS string
    literal (raw newlines in particular — multi-paragraph fields split
    on \\n\\n contain real newline characters after JSON decoding)."""
    s = s.replace('\\', '\\\\').replace("'", "\\'")
    s = s.replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t')
    return "'" + s + "'"


def js_array_of_strings(arr):
    return '[' + ','.join(js_string(x) for x in arr) + ']'


FIELD_ORDER = {
    'kids': ['title', 'verse', 'ref', 'imgQuery', 'story', 'lessons', 'challenge', 'prayer'],
    'yuppies': ['tag', 'title', 'verse', 'ref', 'imgQuery', 'reflection', 'takeaways', 'question', 'prayer', 'mission'],
    'primes': ['title', 'verse', 'ref', 'imgQuery', 'reflection', 'wisdom', 'questions', 'prayer', 'act'],
}


def obj_to_js(edition, obj):
    parts = []
    for field in FIELD_ORDER[edition]:
        val = obj[field]
        if isinstance(val, list):
            parts.append(f"{field}:{js_array_of_strings(val)}")
        else:
            parts.append(f"{field}:{js_string(val)}")
    return '{\n    ' + ',\n    '.join(parts) + '\n  }'


def load_batches(edition, need_count):
    files = sorted(glob.glob(f'scripts/devotions_batches/{edition}_*.json'))
    all_entries = []
    seen_titles = set()
    for f in files:
        for e in json.load(open(f, encoding='utf-8')):
            if e['title'] in seen_titles:
                continue
            seen_titles.add(e['title'])
            all_entries.append(e)
    if len(all_entries) < need_count:
        raise ValueError(f'{edition}: only {len(all_entries)} unique entries, need {need_count}')
    return all_entries[:need_count]


def splice(path, edition):
    with open(path, encoding='utf-8') as f:
        text = f.read()
    r = analyze(path)
    dup_indices = r['dup_indices']
    replacements = load_batches(edition, len(dup_indices))

    # Build new text by replacing spans back-to-front so earlier offsets stay valid.
    spans = r['spans']
    ordered = sorted(zip(dup_indices, replacements), key=lambda p: p[0], reverse=True)
    for idx, new_obj in ordered:
        s, e = spans[idx]
        text = text[:s] + obj_to_js(edition, new_obj) + text[e:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'{path}: replaced {len(dup_indices)} duplicate slots')


if __name__ == '__main__':
    import os
    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    splice('devotions-kids.js', 'kids')
    splice('devotions-yuppies.js', 'yuppies')
    splice('devotions-primes.js', 'primes')
