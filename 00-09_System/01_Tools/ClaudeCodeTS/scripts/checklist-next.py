#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


@dataclass(frozen=True)
class ChecklistItem:
    line: int
    phase: int | None
    phase_title: str | None
    section: str | None
    text: str


PHASE_RE = re.compile(r"^\*\*\*Phase\s+(\d+):\s*(.+?)\*\*\*$")
SECTION_RE = re.compile(r"^(#{2,4})\s+(.+?)\s*$")
ITEM_RE = re.compile(r"^(\s*)-\s+\[(?P<mark>[ xX])\]\s+(?P<text>.+?)\s*$")


def parse_items(lines: list[str]) -> tuple[list[ChecklistItem], list[ChecklistItem]]:
    checked: list[ChecklistItem] = []
    unchecked: list[ChecklistItem] = []

    current_phase: int | None = None
    current_phase_title: str | None = None
    current_section: str | None = None

    for idx, line in enumerate(lines, start=1):
        m = PHASE_RE.match(line)
        if m:
            current_phase = int(m.group(1))
            current_phase_title = m.group(2).strip()
            current_section = None
            continue

        sm = SECTION_RE.match(line)
        if sm:
            level = len(sm.group(1))
            title = sm.group(2).strip()
            if level == 2:
                current_section = title
            elif level == 3:
                current_section = f"{current_section} > {title}" if current_section else title
            elif level == 4:
                current_section = f"{current_section} > {title}" if current_section else title
            continue

        im = ITEM_RE.match(line)
        if not im:
            continue
        item = ChecklistItem(
            line=idx,
            phase=current_phase,
            phase_title=current_phase_title,
            section=current_section,
            text=im.group("text").strip(),
        )
        if im.group("mark").lower() == "x":
            checked.append(item)
        else:
            unchecked.append(item)

    return checked, unchecked


def pick_next(items: list[ChecklistItem], phase: int | None, limit: int) -> list[ChecklistItem]:
    if phase is not None:
        items = [i for i in items if i.phase == phase]
    if not items:
        return []

    # Default: earliest phase with remaining work.
    if phase is None:
        phases = sorted({i.phase for i in items if i.phase is not None})
        if phases:
            earliest = phases[0]
            items = [i for i in items if i.phase == earliest]

    return items[: max(0, limit)]


def to_json(items: Iterable[ChecklistItem]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for i in items:
        out.append(
            {
                "line": i.line,
                "phase": i.phase,
                "phaseTitle": i.phase_title,
                "section": i.section,
                "text": i.text,
            }
        )
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description="Select next unchecked items from the implementation checklist.")
    ap.add_argument("--plan", default="implementation/1-initial-rewrite-implementation-checklist.md")
    ap.add_argument("--phase", type=int, default=None, help="Restrict selection to a specific phase number.")
    ap.add_argument("--limit", type=int, default=25, help="Max items to select.")
    ap.add_argument("--format", choices=["json", "text"], default="json")
    args = ap.parse_args()

    plan_path = Path(args.plan)
    lines = plan_path.read_text(encoding="utf-8").splitlines()
    _checked, unchecked = parse_items(lines)
    selected = pick_next(unchecked, args.phase, args.limit)

    if args.format == "json":
        payload = {"plan": str(plan_path), "selected": to_json(selected), "remaining": len(unchecked)}
        print(json.dumps(payload, ensure_ascii=False))
        return 0

    print(f"plan: {plan_path}")
    print(f"remaining_unchecked: {len(unchecked)}")
    for i in selected:
        phase = f"Phase {i.phase}" if i.phase is not None else "Phase ?"
        sec = f" · {i.section}" if i.section else ""
        print(f"- L{i.line} · {phase}{sec}: {i.text}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

