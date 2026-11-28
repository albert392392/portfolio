from pathlib import Path
import json
import re
import shutil
import subprocess
import unittest
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]


class PortfolioIntegrityTests(unittest.TestCase):
    def test_executive_resumes_exist_and_have_two_pages(self):
        for lang in ("fa", "en"):
            pdf_path = ROOT / "assets" / f"resume-{lang}.pdf"
            self.assertTrue(pdf_path.exists(), f"Missing {pdf_path}")
            reader = PdfReader(str(pdf_path))
            self.assertEqual(len(reader.pages), 2, f"{pdf_path.name} must be 2 pages")
            for p in (1, 2):
                jpg = ROOT / "assets" / "resume" / f"exec-{lang}-{p}.jpg"
                self.assertTrue(jpg.exists(), f"Missing resume preview {jpg}")
                self.assertGreater(jpg.stat().st_size, 50_000, f"{jpg} too small")

    def test_i18n_js_parses_and_excludes_overstated_titles_or_private_urls(self):
        i18n_path = ROOT / "assets" / "i18n.js"
        text = i18n_path.read_text(encoding="utf-8")
        if shutil.which("node"):
            res = subprocess.run(["node", "-c", str(i18n_path)], capture_output=True, text=True)
            self.assertEqual(res.returncode, 0, res.stderr)
        for forbidden in ("National Winner", "1. Preis", "Primer puesto", "کسب مقام برتر"):
            self.assertNotIn(forbidden, text)
        self.assertNotIn("github.com/albert392392/GeminiLiveCoPilot", text)
        self.assertNotIn("Lead Systems Architect", text)
        self.assertNotIn("Principal", text.replace("Menú Principal", ""))

    def test_index_html_has_referrer_policy_and_assets_exist(self):
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("assets/i18n.js", html)
        self.assertIn("assets/app.js", html)
        self.assertTrue((ROOT / "assets" / "app.js").exists())
        self.assertTrue((ROOT / "mana-demo" / "index.html").exists())


if __name__ == "__main__":
    unittest.main()
