import sys
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def verify_live():
    base_url = "https://albert392392.github.io/portfolio/"
    print(f"Testing Live Production URL: {base_url}")

    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))
        page.on("response", lambda resp: print(f"Response {resp.status} for {resp.url}") if resp.status >= 400 else None)

        # 1. Test #sys live
        print("\n--- Testing Live #sys ---")
        page.goto(base_url + "#sys", wait_until="networkidle")
        page.wait_for_selector(".sys-cluster", timeout=10000)
        clusters = page.query_selector_all(".sys-cluster")
        print(f"Live Sys Clusters count: {len(clusters)}")
        assert len(clusters) == 4, f"Expected 4 clusters, got {len(clusters)}"

        sys_cards = page.query_selector_all(".sys-card")
        print(f"Live Microservice Cards count: {len(sys_cards)}")
        assert len(sys_cards) >= 15, f"Expected >= 15 service cards, got {len(sys_cards)}"

        kpis = page.query_selector_all(".kpi")
        print(f"Live Sys KPI Cards count: {len(kpis)}")
        assert len(kpis) == 6, f"Expected 6 KPIs, got {len(kpis)}"

        time.sleep(1.0)
        page.screenshot(path="sys_live_verified.png", full_page=False)
        print("Captured sys_live_verified.png")

        # 2. Test #proj live
        print("\n--- Testing Live #proj ---")
        page.goto(base_url + "#proj", wait_until="networkidle")
        page.wait_for_selector(".pcard", timeout=10000)
        pcards = page.query_selector_all(".pcard")
        print(f"Live Projects rendered count: {len(pcards)}")
        assert len(pcards) == 18, f"Expected 18 projects, got {len(pcards)}"

        parsa_found = False
        for card in pcards:
            text = card.inner_text()
            if "پارسا" in text or "Parsa" in text:
                parsa_found = True
                print("Live verified Parsa card exists on #proj")
        assert parsa_found, "Parsa card not found in live production"

        time.sleep(1.0)
        page.screenshot(path="proj_live_verified.png", full_page=False)
        print("Captured proj_live_verified.png")

        # 3. Test #multimodal live
        print("\n--- Testing Live #multimodal ---")
        page.goto(base_url + "#multimodal", wait_until="networkidle")
        page.wait_for_selector(".pipe-card", timeout=10000)
        pipes = page.query_selector_all(".pipe-card")
        print(f"Live Multimodal Pipelines count: {len(pipes)}")
        assert len(pipes) == 4, f"Expected 4 pipelines, got {len(pipes)}"

        table = page.query_selector(".tech-table")
        assert table is not None, "Benchmark table not found in live production"
        rows = page.query_selector_all(".tech-table tbody tr")
        print(f"Live Benchmark Table Rows count: {len(rows)}")
        assert len(rows) == 4, f"Expected 4 rows, got {len(rows)}"

        time.sleep(1.0)
        page.screenshot(path="multimodal_live_verified.png", full_page=False)
        print("Captured multimodal_live_verified.png")

        # 4. Check Language switching live
        print("\n--- Testing Live Language Switch ---")
        en_btn = page.query_selector("button[data-l='en']")
        en_btn.click()
        time.sleep(0.8)
        en_title = page.inner_text("h2.sec")
        print(f"Live EN Multimodal Title: {en_title}")
        assert "Real-Time Multimodal" in en_title, f"Expected EN title, got {en_title}"

        browser.close()

    if errors:
        print("\n[!] Live Console Errors detected:")
        for err in errors:
            print("  - " + err)
        sys.exit(1)
    else:
        print("\n[+] LIVE PRODUCTION VERIFICATION PASSED with 0 console errors!")
        sys.exit(0)

if __name__ == "__main__":
    verify_live()
