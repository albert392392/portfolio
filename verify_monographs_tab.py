import sys
import os
import time
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def run_audit():
    print("Starting Playwright verification for Monographs Tab & Spanish Language with channel='msedge'...")
    html_path = os.path.abspath(r"c:\Users\iman3\Projects\portfolio-site\pub\index.html")
    file_url = f"file:///{html_path.replace(os.sep, '/')}"

    errors = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # Listen for console errors
        page.on("console", lambda msg: errors.append(f"Console {msg.type}: {msg.text}") if msg.type in ["error"] else None)
        page.on("pageerror", lambda exc: errors.append(f"Page Error: {exc}"))

        print(f"Navigating to {file_url}...")
        page.goto(file_url, wait_until="networkidle")

        # 1. Verify language buttons
        lang_buttons = page.query_selector_all(".langs button")
        lang_codes = [btn.get_attribute("data-l") for btn in lang_buttons]
        print(f"Detected language buttons: {lang_codes}")
        assert "es" in lang_codes, "Spanish button 'es' is missing!"
        assert len(lang_codes) == 4, f"Expected 4 languages, got {len(lang_codes)}"

        # 2. Test Spanish switch
        print("Testing language switch to Spanish ('es')...")
        page.click('.langs button[data-l="es"]')
        time.sleep(0.3)
        
        doc_lang = page.evaluate("document.documentElement.lang")
        doc_dir = page.evaluate("document.documentElement.dir")
        doc_title = page.evaluate("document.title")
        print(f"Spanish state: lang={doc_lang}, dir={doc_dir}, title={doc_title}")
        assert doc_lang == "es", f"Expected lang=es, got {doc_lang}"
        assert doc_dir == "ltr", f"Expected dir=ltr, got {doc_dir}"
        assert "Iman Mansouri" in doc_title

        # Check tab labels in Spanish
        tab_buttons = page.query_selector_all("#tabrow button")
        tab_keys = [b.get_attribute("data-k") for b in tab_buttons]
        print(f"Tabs present: {tab_keys}")
        assert "monographs" in tab_keys, "monographs tab is missing from tabrow!"

        # 3. Switch back to Persian or test monographs tab directly
        print("Switching back to Persian ('fa') to test monographs content...")
        page.click('.langs button[data-l="fa"]')
        time.sleep(0.3)

        # 4. Navigate to monographs tab
        print("Clicking monographs tab...")
        page.click('#tabrow button[data-k="monographs"]')
        time.sleep(0.5)

        # 5. Check cards count
        cards = page.query_selector_all(".mono-card")
        print(f"Total cards rendered in monographs tab: {len(cards)}")
        assert len(cards) == 56, f"Expected 56 cards, found {len(cards)}"

        # 6. Check category filtering
        print("Testing category filter pills...")
        pills = page.query_selector_all(".mono-pill")
        assert len(pills) == 7, f"Expected 7 pills (all, ai, sys, sci, career, code, hw), got {len(pills)}"

        # Click AI filter pill
        pills[1].click()
        time.sleep(0.2)
        ai_cards = page.query_selector_all(".mono-card")
        print(f"AI category cards count: {len(ai_cards)}")
        assert len(ai_cards) == 34, f"Expected 34 AI cards, got {len(ai_cards)}"

        # Click Sys filter pill
        pills[2].click()
        time.sleep(0.2)
        sys_cards = page.query_selector_all(".mono-card")
        print(f"Sys category cards count: {len(sys_cards)}")
        assert len(sys_cards) == 8, f"Expected 8 Sys cards, got {len(sys_cards)}"

        # Click All filter pill
        pills[0].click()
        time.sleep(0.2)
        all_cards = page.query_selector_all(".mono-card")
        print(f"Restored all cards count: {len(all_cards)}")
        assert len(all_cards) == 56, f"Expected 56 cards, got {len(all_cards)}"

        # 7. Test live search
        print("Testing live search input...")
        search_input = page.query_selector(".mono-search-input")
        search_input.fill("ادیسون")
        time.sleep(0.2)
        search_cards = page.query_selector_all(".mono-card")
        print(f"Cards matching 'ادیسون': {len(search_cards)}")
        assert len(search_cards) >= 1, "Expected at least 1 match for Edison monograph"

        # Clear search
        page.click(".mono-search-clear")
        time.sleep(0.2)
        cleared_cards = page.query_selector_all(".mono-card")
        assert len(cleared_cards) == 56, f"Expected 56 cards after clearing, got {len(cleared_cards)}"

        # 8. Test Diagram thumbnail rendering
        print("Checking diagram thumbnails...")
        thumbs = page.query_selector_all(".mono-card-thumb img")
        print(f"Cards with diagram thumbnails: {len(thumbs)}")
        assert len(thumbs) == 5, f"Expected exactly 5 diagram thumbnails, found {len(thumbs)}"

        # 9. Test Reading Modal
        print("Testing Monograph Reader Modal...")
        read_buttons = page.query_selector_all(".mono-read-btn")
        read_buttons[0].click()
        time.sleep(0.3)

        modal = page.query_selector("#monoModal")
        is_visible = page.evaluate("document.getElementById('monoModal').style.display !== 'none'")
        print(f"Is reader modal visible: {is_visible}")
        assert is_visible, "Reader modal did not open!"

        modal_title = page.inner_text(".mono-modal-title")
        print(f"Opened monograph title: {modal_title[:60]}...")
        assert len(modal_title) > 5, "Modal title is empty"

        # Test Next Monograph in modal
        page.click(".mono-next-btn")
        time.sleep(0.2)
        next_title = page.inner_text(".mono-modal-title")
        print(f"Next monograph title: {next_title[:60]}...")
        assert next_title != modal_title, "Next button did not switch monograph!"

        # Screenshot modal
        modal_screenshot_path = os.path.abspath(r"C:\Users\iman3\.gemini\antigravity\brain\ddbdefda-4871-415a-b670-543caf38fa4c\monograph_reader_modal.png")
        page.screenshot(path=modal_screenshot_path, full_page=False)
        print(f"Saved modal screenshot to: {modal_screenshot_path}")

        # Test Close Modal with Escape key
        print("Testing modal close via Escape key...")
        page.keyboard.press("Escape")
        time.sleep(0.3)
        is_closed = page.evaluate("document.getElementById('monoModal').style.display === 'none'")
        print(f"Is reader modal closed: {is_closed}")
        assert is_closed, "Reader modal did not close on Escape key!"

        # Screenshot monographs tab
        screenshot_path = os.path.abspath(r"C:\Users\iman3\.gemini\antigravity\brain\ddbdefda-4871-415a-b670-543caf38fa4c\monographs_tab_live.png")
        page.screenshot(path=screenshot_path, full_page=False)
        print(f"Saved monographs grid screenshot to: {screenshot_path}")

        # Check for errors
        print(f"Total console/page errors detected: {len(errors)}")
        if errors:
            print("Errors detected:")
            for err in errors:
                print(f"  - {err}")
            assert False, "Console errors occurred during execution!"

        browser.close()

    print("\n==============================================")
    print("ALL TESTS PASSED WITH EXIT CODE 0!")
    print("==============================================")

if __name__ == "__main__":
    run_audit()
