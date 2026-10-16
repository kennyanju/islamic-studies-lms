#!/usr/bin/env python3
"""Automated verification suite for the Islamic Studies for Family curriculum."""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
COURSE_DATA = ROOT / "public" / "course_data"

BANNED_WORDS = {
    "delve", "tapestry", "vibrant", "testament", "underscore", "pivotal",
    "foster", "garner", "bolster", "showcase", "interplay", "intricate",
    "seamless", "seamlessly", "unlock", "unleash", "elevate", "empower",
    "robust", "beacon", "holistic", "paradigm", "synergy", "game-changer",
}
BOX_CHARS = set("┌┬┐│├┼┤└┴┘▼")
EMOJI_RE = re.compile(r"^#{1,6}\s+[^\w\s\"'(`*]", re.MULTILINE)


def verify_markdown_file(path: pathlib.Path, errors: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    rel = path.relative_to(ROOT)

    # 1. Zero em dashes in content
    if "—" in text:
        count = text.count("—")
        errors.append(f"[EM-DASH] {rel}: contains {count} em dash(es) '—'")

    # 2. Zero ASCII box-art characters
    found_box = BOX_CHARS.intersection(text)
    if found_box:
        errors.append(f"[ASCII-BOX] {rel}: contains box-drawing chars {sorted(found_box)}")

    # 3. Zero emoji in headings
    for match in EMOJI_RE.finditer(text):
        errors.append(f"[EMOJI-HEADING] {rel}: heading starts with symbol/emoji: {match.group(0)!r}")

    # 4. Zero AI slop buzzwords
    words = re.findall(r"\b[a-zA-Z-]+\b", text.lower())
    slop_found = sorted(set(words).intersection(BANNED_WORDS))
    if slop_found:
        errors.append(f"[SLOP-WORDS] {rel}: contains banned words {slop_found}")


def verify_compiled_json(errors: list[str]) -> None:
    total_letter_counts = {"A": 0, "B": 0, "C": 0, "D": 0}
    for mod_id in range(1, 10):
        mod_file = COURSE_DATA / f"module_{mod_id}.json"
        if not mod_file.exists():
            errors.append(f"[MISSING-JSON] {mod_file} does not exist. Run `node compile.js`.")
            continue
        data = json.loads(mod_file.read_text(encoding="utf-8"))

        # Check slide vs voice script count
        slides = data.get("parsedSlides") or data.get("teacher", {}).get("parsedSlides") or []
        scripts = data.get("parsedVoiceScript") or data.get("teacher", {}).get("parsedVoiceScript") or []
        if len(slides) != len(scripts) or len(slides) == 0:
            errors.append(
                f"[SLIDE-SYNC] Module {mod_id}: parsedSlides={len(slides)} != parsedVoiceScript={len(scripts)}"
            )

        # Check all 5 levels exist and have valid quizzes
        tracks = data.get("tracks") or {}
        for level_num in range(1, 6):
            key = f"level{level_num}"
            track = tracks.get(key)
            if not track or not (track.get("handout") or track.get("handoutMd")):
                errors.append(f"[MISSING-HANDOUT] Module {mod_id} {key}: missing handout")
                continue

            pq = track.get("parsedQuestions") or {}
            mcqs = pq.get("mcq") or pq.get("multipleChoice") or []
            fibs = pq.get("fillBlanks") or []
            matches = pq.get("matching") or []
            reflections = pq.get("reflection") or []
            ans_key = pq.get("answerKey") or {}

            expected_mcq = 5 if level_num <= 2 else 10
            if len(mcqs) < expected_mcq:
                errors.append(f"[MCQ-COUNT] M{mod_id} L{level_num}: got {len(mcqs)} MCQs, expected >={expected_mcq}")
            if len(fibs) < 3:
                errors.append(f"[FIB-COUNT] M{mod_id} L{level_num}: got {len(fibs)} FIBs, expected >=3")
            if len(matches) < 3:
                errors.append(f"[MATCH-COUNT] M{mod_id} L{level_num}: got {len(matches)} matching pairs, expected >=3")
            if len(reflections) < 1:
                errors.append(f"[REFL-COUNT] M{mod_id} L{level_num}: got {len(reflections)} reflections, expected >=1")

            # Check answer key distribution & consecutive runs
            letters = []
            for q in mcqs:
                ans = q.get("correctAnswer", "")
                if not ans:
                    qnum = str(q.get("id", q.get("number", "")))
                    ans = (ans_key.get(qnum) or {}).get("answer", "")
                if ans not in ("A", "B", "C", "D"):
                    errors.append(f"[MISSING-KEY] M{mod_id} L{level_num} Q{q.get('id')}: invalid/missing answer {ans!r}")
                else:
                    letters.append(ans)
                    total_letter_counts[ans] += 1

            # Check no more than 2 identical answers in a row
            for i in range(len(letters) - 2):
                if letters[i] == letters[i + 1] == letters[i + 2]:
                    errors.append(
                        f"[KEY-RUN] M{mod_id} L{level_num}: 3 identical answers in a row ({letters[i]}) at Q{i+1}-Q{i+3}"
                    )

            # Check all 4 letters appear in 10-question quizzes
            if len(mcqs) >= 10:
                for ltr in ("A", "B", "C", "D"):
                    if letters.count(ltr) == 0:
                        errors.append(f"[KEY-BIAS] M{mod_id} L{level_num}: letter {ltr} appears 0 times in {letters}")

    total_mcqs = sum(total_letter_counts.values())
    if total_mcqs > 0:
        for ltr, cnt in total_letter_counts.items():
            pct = (cnt / total_mcqs) * 100
            if pct < 18.0 or pct > 32.0:
                errors.append(
                    f"[GLOBAL-KEY-BIAS] Option {ltr} is {cnt}/{total_mcqs} ({pct:.1f}%), outside 18%-32% target band"
                )


def main() -> int:
    errors: list[str] = []
    for folder in sorted(ROOT.iterdir()):
        if folder.is_dir() and re.match(r"^[1-9]\s*—", folder.name):
            for md_file in sorted(folder.rglob("*.md")):
                if not md_file.name.startswith("handout_10") and not md_file.name.startswith("handout_13") and not md_file.name.startswith("student_handout") and not md_file.name.startswith("questions_10") and not md_file.name.startswith("questions_13"):
                    verify_markdown_file(md_file, errors)

    voice_dir = ROOT / "Voice Script for teacher" / "Voice scripts"
    if voice_dir.exists():
        for md_file in sorted(voice_dir.glob("* - Voice Script.md")):
            verify_markdown_file(md_file, errors)

    syllabus_dir = ROOT / "Syllabus"
    if syllabus_dir.exists():
        for md_file in sorted(syllabus_dir.glob("*.md")):
            verify_markdown_file(md_file, errors)

    verify_compiled_json(errors)

    if errors:
        print(f"VERIFICATION REPORT: {len(errors)} issue(s) detected:")
        for err in errors[:50]:
            print("  -", err)
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more issues.")
        return 1

    print("ALL CURRICULUM VERIFICATION CHECKS PASSED (0 errors)!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
