# -*- coding: utf-8 -*-
"""Turn the chapter notes into study/content.js."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "Ch1-Ch3_學習筆記.md"
OUT = Path(__file__).resolve().parent / "content.js"

COMMANDS = [
    (r"\lceil", "⌈"),
    (r"\rceil", "⌉"),
    (r"\alpha", "α"),
    (r"\beta", "β"),
    (r"\epsilon", "ε"),
    (r"\ldots", "…"),
    (r"\approx", "≈"),
    (r"\times", "×"),
    (r"\cdot", "·"),
    (r"\geq", "≥"),
    (r"\ge", "≥"),
    (r"\leq", "≤"),
    (r"\le", "≤"),
    (r"\ell", "ℓ"),
    (r"\ln", "ln"),
    (r"\*", "*"),
    (r"\,", " "),
    (r"\ ", " "),
]


def take_brace(text, i):
    depth = 0
    j = i
    while j < len(text):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                return text[i + 1 : j], j + 1
        j += 1
    return text[i + 1 :], len(text)


def render_tex(expr: str) -> str:
    text = expr.strip()
    for src, dst in COMMANDS:
        text = text.replace(src, dst)

    def parse(s):
        out = []
        i = 0
        while i < len(s):
            if s.startswith("^{", i) or s.startswith("_{", i):
                tag = "sup" if s[i] == "^" else "sub"
                inner, i = take_brace(s, i + 1)
                out.append(f"<{tag}>{parse(inner)}</{tag}>")
                continue
            if s[i] in "^_" and i + 1 < len(s) and s[i + 1] != "{":
                tag = "sup" if s[i] == "^" else "sub"
                j = i + 1
                while j < len(s) and s[j].isalnum():
                    j += 1
                out.append(f"<{tag}>{html.escape(s[i + 1 : j])}</{tag}>")
                i = j
                continue
            j = i
            while j < len(s) and not s.startswith("^{", j) and not s.startswith("_{", j) and s[j] not in "^_":
                j += 1
            out.append(html.escape(s[i:j]))
            i = j
        return "".join(out)

    return parse(text)


def format_text(raw: str) -> str:
    holders = []

    def repl(match):
        holders.append(f'<span class="math">{render_tex(match.group(1))}</span>')
        return f"@@M{len(holders) - 1}@@"

    text = re.sub(r"\\\((.+?)\\\)", repl, raw)
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"@@M(\d+)@@", lambda match: holders[int(match.group(1))], text)
    return text


def is_list_item(line: str) -> bool:
    return bool(re.match(r"^\s*(?:[-*]|\d+\.)\s+", line))


def indent_of(line: str) -> int:
    return len(line) - len(line.lstrip(" "))


def parse_list(lines, i):
    base = indent_of(lines[i])
    items = []
    ordered = None
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines) and is_list_item(lines[j]) and indent_of(lines[j]) >= base:
                i = j
                continue
            break
        if not is_list_item(line) or indent_of(line) < base:
            break
        if indent_of(line) > base:
            break
        m = re.match(r"^\s*((?:[-*])|(?:\d+\.))\s+(.*)$", line)
        marker, text = m.group(1), m.group(2)
        if ordered is None:
            ordered = marker[0].isdigit()
        i += 1
        children = []
        if i < len(lines) and is_list_item(lines[i]) and indent_of(lines[i]) > base:
            children, i = parse_list(lines, i)
        items.append((text, children))
    return (ordered, items), i


def render_list(parsed) -> str:
    ordered, items = parsed
    tag = "ol" if ordered else "ul"
    chunks = [f"<{tag}>"]
    for text, children in items:
        chunks.append("<li>" + format_text(text))
        if children:
            chunks.append(render_list(children))
        chunks.append("</li>")
    chunks.append(f"</{tag}>")
    return "".join(chunks)


def parse_table(lines, i):
    rows = []
    while i < len(lines) and lines[i].strip().startswith("|"):
        raw = lines[i].strip().strip("|")
        cells = [c.strip() for c in raw.split("|")]
        if not re.fullmatch(r"[:\-\s|]+", "|".join(cells)):
            rows.append(cells)
        i += 1
    return rows, i


def render_table(rows) -> str:
    if not rows:
        return ""
    head, body = rows[0], rows[1:]
    out = ["<div class='table-wrap'><table><thead><tr>"]
    for cell in head:
        out.append(f"<th>{format_text(cell)}</th>")
    out.append("</tr></thead><tbody>")
    for row in body:
        out.append("<tr>")
        for idx in range(len(head)):
            cell = row[idx] if idx < len(row) else ""
            out.append(f"<td>{format_text(cell)}</td>")
        out.append("</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)


def blocks_to_html(lines) -> str:
    html_parts = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            html_parts.append("<pre><code>" + html.escape("\n".join(buf)) + "</code></pre>")
            continue
        if line.strip() == "---":
            html_parts.append("<hr>")
            i += 1
            continue
        if line.startswith("|"):
            rows, i = parse_table(lines, i)
            html_parts.append(render_table(rows))
            continue
        if is_list_item(line):
            parsed, i = parse_list(lines, i)
            html_parts.append(render_list(parsed))
            continue
        if line.startswith("### "):
            html_parts.append(f"<h3>{format_text(line[4:])}</h3>")
            i += 1
            continue
        buf = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("```", "|", "#", "---")) and not is_list_item(lines[i]):
            buf.append(lines[i])
            i += 1
        html_parts.append("<p>" + format_text(" ".join(s.strip() for s in buf)) + "</p>")
    return "\n".join(html_parts)


def split_notes(text: str, preamble_title="Overview", exam_keys=()):
    lines = text.splitlines()
    chapters = []
    current = None
    section = None
    buf = []

    def flush_section():
        nonlocal section, buf
        if current is None or section is None:
            return
        current["sections"].append(
            {
                "title": section,
                "html": blocks_to_html(buf),
            }
        )
        section = None
        buf = []

    def flush_preamble():
        nonlocal buf
        if current is None or not any(x.strip() for x in buf):
            buf = []
            return
        current["sections"].append({"title": preamble_title, "html": blocks_to_html(buf)})
        buf = []

    for line in lines:
        if line.startswith("# "):
            flush_section()
            if current and buf:
                flush_preamble()
            current = {"title": line[2:].strip(), "sections": []}
            chapters.append(current)
            buf = []
            section = None
            continue
        if line.startswith("## "):
            if section is None and any(x.strip() for x in buf):
                flush_preamble()
            else:
                flush_section()
            section = line[3:].strip()
            buf = []
            continue
        buf.append(line)
    if section is not None:
        flush_section()
    elif current is not None and any(x.strip() for x in buf):
        flush_preamble()

    for ci, chapter in enumerate(chapters, 1):
        chapter["id"] = f"c{ci}"
        for si, section in enumerate(chapter["sections"], 1):
            section["id"] = f"c{ci}-s{si}"
            title = section["title"]
            section["exam"] = any(k in title for k in exam_keys)
    return chapters


def build(src, out, var, preamble, exam_keys):
    chapters = split_notes(Path(src).read_text(encoding="utf-8"), preamble, exam_keys)
    payload = json.dumps(chapters, ensure_ascii=False, indent=2)
    Path(out).write_text(f"window.{var} = " + payload + ";\n", encoding="utf-8")
    n = sum(len(c["sections"]) for c in chapters)
    print(f"chapters={len(chapters)} sections={n} -> {out}")


def main():
    import sys
    if len(sys.argv) == 1:
        build(SRC, OUT.with_name("content.js"), "NOTES_ZH", "本節提要", ("考試", "要背", "一定要"))
        return
    src, out, var, preamble, exam = sys.argv[1:]
    build(src, out, var, preamble, tuple(exam.split(",")))


if __name__ == "__main__":
    main()
