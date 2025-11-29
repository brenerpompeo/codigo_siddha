from playwright.sync_api import sync_playwright

def screenshot_dashboard(page):
    page.goto("http://localhost:5173/")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/dashboard_styled.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            screenshot_dashboard(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
