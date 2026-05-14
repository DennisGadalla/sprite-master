from __future__ import annotations

import sys
import unittest
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "src" / "data" / "generated" / "resourceManifest.json"
sys.path.insert(0, str(ROOT / "scripts"))

from build_clean_resources import CLEAN_ROOT, analyze_clean_pngs, collect_clean_pngs


class CleanResourceAuditTests(unittest.TestCase):
    def test_manifest_is_generated_only_from_clean_resource(self) -> None:
        manifest = analyze_clean_pngs(collect_clean_pngs(CLEAN_ROOT))

        self.assertEqual(manifest["sourceRoot"], "showcase/clean_resource")
        self.assertNotIn("originalSourceRoot", manifest)
        self.assertNotIn("originalPath", manifest["animations"][0])

    def test_collect_clean_pngs_reads_current_clean_resource_without_rewriting(self) -> None:
        before = {path: path.stat().st_mtime_ns for path in CLEAN_ROOT.rglob("*.png")}

        pngs = collect_clean_pngs(CLEAN_ROOT)

        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        self.assertEqual(len(pngs), len(manifest["animations"]))
        self.assertGreater(len(pngs), 0)
        self.assertEqual(before, {path: path.stat().st_mtime_ns for path in CLEAN_ROOT.rglob("*.png")})


if __name__ == "__main__":
    unittest.main()
