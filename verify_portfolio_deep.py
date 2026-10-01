import sys
import os
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def verify():
    html_path = os.path.abspath("index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"
    print(f"Testing URL: {file_url}")

    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 900})
        page = context.new_page()

        page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(f"PageError: {err}"))

        # 1. Test #home
        print("\n--- 1. Testing #home ---")
        page.goto(file_url + "#home")
        page.wait_for_selector("#pages .hero", timeout=5000)
        hero_name = page.inner_text(".hero h1")
        print(f"Hero Name: {hero_name}")
        assert "Albert" in hero_name or "منصوری" in hero_name, "Hero title mismatch"

        # 2. Test #sys
        print("\n--- 2. Testing #sys ---")
        page.goto(file_url + "#sys")
        page.wait_for_selector(".sys-cluster", timeout=5000)
        clusters = page.query_selector_all(".sys-cluster")
        print(f"Number of Sys Clusters: {len(clusters)}")
        assert len(clusters) == 4, f"Expected 4 clusters, got {len(clusters)}"
        
        sys_cards = page.query_selector_all(".sys-card")
        print(f"Number of Microservice Cards: {len(sys_cards)}")
        assert len(sys_cards) >= 15, f"Expected >= 15 service cards, got {len(sys_cards)}"
        
        kpis = page.query_selector_all(".kpi")
        print(f"Number of KPI Cards in Sys: {len(kpis)}")
        assert len(kpis) == 6, f"Expected 6 KPIs, got {len(kpis)}"
        
        time.sleep(0.8)
        page.screenshot(path="sys_preview_local.png", full_page=False)
        print("Captured sys_preview_local.png")

        # 3. Test #proj
        print("\n--- 3. Testing #proj ---")
        page.goto(file_url + "#proj")
        page.wait_for_selector(".pcard", timeout=5000)
        pcards = page.query_selector_all(".pcard")
        print(f"Total Projects rendered: {len(pcards)}")
        assert len(pcards) == 18, f"Expected 18 projects, got {len(pcards)}"

        # Verify Parsa card exists and is at the end or in games
        parsa_found = False
        for card in pcards:
            text = card.inner_text()
            if "پارسا" in text or "Parsa" in text:
                parsa_found = True
                print("Verified Parsa card exists on #proj")
                assert "کافه‌بازار" in text or "Cafe Bazaar" in text, "Parsa store link missing"
        assert parsa_found, "Parsa card not found in projects list"

        # Test filtering
        filter_btns = page.query_selector_all(".pfilter-btn")
        print(f"Number of Filter Buttons: {len(filter_btns)}")
        assert len(filter_btns) == 6, f"Expected 6 filter buttons, got {len(filter_btns)}"

        # Click AI filter
        filter_btns[1].click() # AI
        time.sleep(0.3)
        ai_cards = page.query_selector_all(".pcard")
        print(f"AI Filtered Projects: {len(ai_cards)}")
        assert len(ai_cards) == 3, f"Expected 3 AI projects, got {len(ai_cards)}"

        # Click Games filter
        filter_btns[5].click() # Games
        time.sleep(0.8)
        game_cards = page.query_selector_all(".pcard")
        print(f"Games Filtered Projects: {len(game_cards)}")
        assert len(game_cards) == 6, f"Expected 6 Games projects, got {len(game_cards)}"

        # Reset to All filter
        filter_btns[0].click()
        time.sleep(0.8)
        page.screenshot(path="proj_preview_local.png", full_page=False)
        print("Captured proj_preview_local.png")

        # 4. Test #multimodal
        print("\n--- 4. Testing #multimodal ---")
        page.goto(file_url + "#multimodal")
        page.wait_for_selector(".pipe-card", timeout=5000)
        pipes = page.query_selector_all(".pipe-card")
        print(f"Number of Multimodal Pipelines: {len(pipes)}")
        assert len(pipes) == 4, f"Expected 4 multimodal pipelines, got {len(pipes)}"

        pipe_steps = page.query_selector_all(".pipe-step")
        print(f"Total Pipeline Steps: {len(pipe_steps)}")
        assert len(pipe_steps) >= 15, f"Expected >= 15 steps across pipelines, got {len(pipe_steps)}"

        table = page.query_selector(".tech-table")
        assert table is not None, "Multimodal tech table not found"
        rows = page.query_selector_all(".tech-table tbody tr")
        print(f"Benchmark Table Rows: {len(rows)}")
        assert len(rows) == 4, f"Expected 4 rows in benchmark table, got {len(rows)}"

        time.sleep(0.8)
        page.screenshot(path="multimodal_preview_local.png", full_page=False)
        print("Captured multimodal_preview_local.png")

        # 5. Language Switching Check
        print("\n--- 5. Testing Language Switch to EN & DE ---")
        en_btn = page.query_selector("button[data-l='en']")
        en_btn.click()
        time.sleep(0.5)
        en_title = page.inner_text("h2.sec")
        print(f"EN Multimodal Title: {en_title}")
        assert "Real-Time Multimodal" in en_title, f"Expected EN title, got {en_title}"

        de_btn = page.query_selector("button[data-l='de']")
        de_btn.click()
        time.sleep(0.5)
        de_nav = page.inner_text("#tabrow button.on")
        print(f"DE Active Tab: {de_nav}")
        assert "Multimodale" in de_nav, f"Expected DE nav, got {de_nav}"

        browser.close()

    if errors:
        print("\n[!] Console Errors detected:")
        for err in errors:
            print("  - " + err)
        sys.exit(1)
    else:
        print("\n[+] Verification PASSED with 0 console errors!")
        sys.exit(0)

if __name__ == "__main__":
    verify()
