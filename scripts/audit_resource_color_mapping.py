from __future__ import annotations

import json

from build_clean_resources import CLEAN_ROOT, QA_DIR, analyze_clean_pngs, build_clean_audit


OUT = QA_DIR / "resource-clean-audit.json"


def main() -> None:
    pngs = sorted(path for path in CLEAN_ROOT.rglob("*.png") if path.is_file())
    if not pngs:
        raise SystemExit("No cleaned resources found. Run `python scripts/build_clean_resources.py` first.")
    manifest = analyze_clean_pngs(pngs)
    audit = build_clean_audit(manifest)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(audit, indent=2), encoding="utf-8")
    print(json.dumps(audit["summary"], indent=2))


if __name__ == "__main__":
    main()
