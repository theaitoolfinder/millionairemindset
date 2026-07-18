#!/usr/bin/env python3
"""
Splits a `var xDevotions = [ {...}, {...}, ... ];` JS file into individual
top-level object-literal text spans (quote/escape-aware brace matching),
extracts each object's title, and reports which indices are duplicates
(every occurrence after the first) that need fresh unique content.
"""
import json
import re
import sys


def split_objects(text, array_start, array_end):
    """Return list of (start, end) byte spans for each top-level {...} object
    inside text[array_start:array_end], respecting string literals."""
    spans = []
    i = array_start
    n = array_end
    depth = 0
    obj_start = None
    in_string = None  # None, "'", or '"'
    escaped = False
    while i < n:
        c = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif c == '\\':
                escaped = True
            elif c == in_string:
                in_string = None
        else:
            if c in ("'", '"'):
                in_string = c
            elif c == '{':
                if depth == 0:
                    obj_start = i
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0 and obj_start is not None:
                    spans.append((obj_start, i + 1))
                    obj_start = None
        i += 1
    return spans


def find_array_bounds(text):
    m = re.search(r'=\s*\[', text)
    if not m:
        raise ValueError("array start not found")
    array_start = m.end()
    # find matching closing bracket for this [
    depth = 1
    i = array_start
    in_string = None
    escaped = False
    while i < len(text):
        c = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif c == '\\':
                escaped = True
            elif c == in_string:
                in_string = None
        else:
            if c in ("'", '"'):
                in_string = c
            elif c == '[':
                depth += 1
            elif c == ']':
                depth -= 1
                if depth == 0:
                    return array_start, i
        i += 1
    raise ValueError("array end not found")


def extract_title(obj_text):
    m = re.search(r"title\s*:\s*'((?:[^'\\]|\\.)*)'", obj_text)
    if m:
        raw = m.group(1)
        return raw.replace("\\'", "'").replace('\\"', '"')
    m = re.search(r'title\s*:\s*"((?:[^"\\]|\\.)*)"', obj_text)
    if m:
        return m.group(1)
    return None


def analyze(path):
    with open(path, encoding='utf-8') as f:
        text = f.read()
    array_start, array_end = find_array_bounds(text)
    spans = split_objects(text, array_start, array_end)
    seen = {}
    dup_indices = []
    titles = []
    for idx, (s, e) in enumerate(spans):
        obj_text = text[s:e]
        title = extract_title(obj_text)
        titles.append(title)
        if title in seen:
            dup_indices.append(idx)
        else:
            seen[title] = idx
    return {
        'path': path,
        'total': len(spans),
        'unique_titles': len(seen),
        'dup_count': len(dup_indices),
        'dup_indices': dup_indices,
        'titles': titles,
        'array_start': array_start,
        'array_end': array_end,
        'spans': spans,
    }


if __name__ == '__main__':
    for path in sys.argv[1:]:
        r = analyze(path)
        print(f"{path}: total={r['total']} unique={r['unique_titles']} dup_slots={r['dup_count']}")
