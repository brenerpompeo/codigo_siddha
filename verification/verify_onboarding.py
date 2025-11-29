from playwright.sync_api import sync_playwright

def verify_onboarding(page):
    # 1. Go to Home (Onboarding)
    page.goto("http://localhost:5173/")

    # 2. Fill Form
    page.fill('input[placeholder="Enter your name"]', "Jules")
    page.fill('input[type="date"]', "1990-05-15")

    # 3. Click Reveal
    page.click('button:has-text("Reveal My Design")')

    # 4. Wait for Calculation (Simulated Delay)
    page.wait_for_timeout(3000)

    # 5. Screenshot the Reveal
    page.screenshot(path="verification/onboarding_reveal.png")

    # 6. Go to Dashboard
    page.click('button:has-text("Enter Your Dashboard")')

    # 7. Screenshot Dashboard
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/dashboard_initial.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_onboarding(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
