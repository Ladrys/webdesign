"""Development checks; the delivered website needs no server or packages.

Run: python tests/browser_smoke.py
Development dependencies: Playwright, Chromium and PyMuPDF.
Optional QR decoding checks: zxing-cpp and NumPy.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import os
import unicodedata

import fitz
from playwright.sync_api import Error, sync_playwright
try:
    import numpy as np
    import zxingcpp
except ImportError:
    zxingcpp = None

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = Path(os.environ.get('PULSE_TEST_ARTIFACTS', '/tmp/prague-pulse-checks'))
ARTIFACTS.mkdir(parents=True, exist_ok=True)
CHECKS = []


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def check(condition, message):
    assert condition, message
    CHECKS.append(message)
    print('PASS', message)


def validate_pdf(path, order):
    check(path.read_bytes().startswith(b'%PDF-'), 'Download is a genuine PDF document')
    with fitz.open(path) as document:
        check(len(document) == len(order['tickets']), 'PDF has one page per ticket')
        for index, pdf_page in enumerate(document):
            text = unicodedata.normalize('NFC', pdf_page.get_text())
            normalized = text.casefold()
            ticket = order['tickets'][index]
            check(order['id'] in text, f'PDF page {index + 1} includes the order ID')
            check(order['name'] in text, f'PDF page {index + 1} preserves the Czech buyer name')
            place = 'Volná plocha' if ticket['category'] == 'standing' else ticket['seat']
            check(place in text, f'PDF page {index + 1} includes the correct place')
            category = {'vip': 'vip', 'regular': 'regular', 'standing': 'stání'}[ticket['category']]
            check(category in normalized, f'PDF page {index + 1} includes the category')
            check('školní' in normalized and 'neplatná' in normalized,
                  f'PDF page {index + 1} clearly identifies the school ticket')
            check(pdf_page.rect.width > pdf_page.rect.height, f'PDF page {index + 1} uses a landscape layout')
            check(bool(pdf_page.get_fonts()), f'PDF page {index + 1} contains typography')
            qr_modules = [drawing for drawing in pdf_page.get_drawings()
                          if drawing['rect'].x0 > pdf_page.rect.width - 175
                          and 120 < drawing['rect'].y0 < 265 and drawing['rect'].height < 6]
            check(len(qr_modules) > 50, f'PDF page {index + 1} contains vector QR modules')
            if zxingcpp is not None:
                pixmap = pdf_page.get_pixmap(matrix=fitz.Matrix(3, 3), alpha=False)
                raster = np.frombuffer(pixmap.samples, dtype=np.uint8).reshape(pixmap.height, pixmap.width, pixmap.n)
                codes = zxingcpp.read_barcodes(raster)
                check(len(codes) == 1, f'PDF page {index + 1} contains one readable QR code')
                expected = ticket.get('code') or f"{order['id']}-{index + 1}"
                check(codes[0].text == expected, f'PDF page {index + 1} QR contains the correct ticket identifier')
        document[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(ARTIFACTS / 'ticket-preview.png')


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
BASE = os.environ.get('PULSE_TEST_BASE', f'http://127.0.0.1:{server.server_port}/web/')
try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), args=['--no-sandbox'])
        context = browser.new_context(accept_downloads=True)
        page = context.new_page()
        errors = []
        external_requests = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('request', lambda request: external_requests.append(request.url)
                if request.url.startswith(('https://', 'http://'))
                and not request.url.startswith(BASE.split('/web/')[0]) else None)

        def go(route):
            page.goto(BASE + route)
            page.wait_for_load_state('load')
            page.evaluate('document.fonts.ready')

        def no_overflow(message):
            check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'), message)

        go('index.html')
        check(bool(page.locator('main h1').inner_text().strip()), 'Homepage initializes')
        check('Zkus to prosím znovu' not in page.locator('main').inner_text(), 'Homepage avoids the error fallback')
        routes = ['index.html', 'program.html', 'performers.html', 'venues.html', 'info.html',
                  'search.html?q=Neon', 'tickets.html', 'cart.html', 'account.html']
        for width in [320, 375, 430, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            for route in routes:
                go(route)
                no_overflow(f'No horizontal overflow at {width}px: {route}')

        page.set_viewport_size({'width': 1440, 'height': 1000})
        go('search.html?q=neon')
        check(page.locator('#search-count').inner_text().startswith('25 '),
              'Contains search covers 12 artists plus 13 events')
        page.locator('#query').fill('<script>alert(1)</script>')
        check(page.locator('#search-results').inner_text().startswith('Nic jsme'), 'Search treats markup as text')
        page.locator('#query').fill('vstupenky')
        check('0 výsledků' not in page.locator('#search-count').inner_text(), 'Search includes practical information')
        page.locator('#query').fill('stani')
        check('0 výsledků' not in page.locator('#search-count').inner_text(), 'Search ignores Czech diacritics')

        go('performers.html')
        check(page.locator('#artists article').count() == 60, 'All 60 performers load')
        page.locator('#artist-q').fill('Lunar Whisper')
        check(page.locator('#artists article').count() == 1, 'The last performer is searchable')
        page.locator('[data-artist]').click()
        check(page.locator('dialog').is_visible(), 'Artist detail opens')
        page.keyboard.press('Escape')
        check(not page.locator('dialog').is_visible(), 'Artist detail closes with Escape')

        go('program.html')
        check(page.locator('#events article').count() == 60, 'All 60 events load')
        page.locator('[data-fav]').first.click()
        check(page.evaluate("document.activeElement.matches('[data-fav]')"), 'Favorite toggle retains keyboard focus')
        page.locator('#only-favorites').check()
        check(page.locator('#events article').count() == 1, 'Favorites filter works')
        page.reload()
        page.locator('#only-favorites').check()
        check(page.locator('#events article').count() == 1, 'Favorites survive reload')

        go('tickets.html')
        check(page.locator('[data-seat="A3"]').is_disabled(), 'Occupied seats are disabled')
        page.locator('[data-seat="A1"]').focus()
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'true', 'Space selects a focused seat')
        check(page.evaluate("document.activeElement.dataset.seat === 'A1'"), 'Seat selection retains keyboard focus')
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'false', 'Space deselects a focused seat')
        page.locator('[data-seat="A1"]').click()
        page.locator('[data-seat="C1"]').click()
        page.locator('#standing').click()
        check('1\u00a0170' in page.locator('#selection').inner_text(), 'VIP, Regular and standing total 1170 Kč')
        page.locator('#add-cart').click()
        check('Košík (3)' in page.locator('nav').inner_text(), 'Cart counter updates')

        go('cart.html')
        for width in [320, 768, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            no_overflow(f'Filled checkout fits {width}px')
        page.set_viewport_size({'width': 375, 'height': 812})
        page.screenshot(path=str(ARTIFACTS / 'checkout-mobile.png'), full_page=True, animations='disabled')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        check(page.locator('[data-remove]').count() == 3, 'Cart survives navigation')
        page.locator('#buyer-name').fill('Žofie Černá')
        page.locator('#buyer-email').fill('host@example.test')
        page.locator('#consent').check()
        page.locator('#payment').select_option('declined')
        page.locator('[data-remove]').nth(1).click()
        check(page.locator('[data-remove]').count() == 2, 'Removing a ticket rerenders the cart')
        check(page.locator('#buyer-name').input_value() == 'Žofie Černá'
              and page.locator('#buyer-email').input_value() == 'host@example.test',
              'Removing a ticket preserves the entered buyer details')
        check(page.locator('#consent').is_checked() and page.locator('#payment').input_value() == 'declined',
              'Removing a ticket preserves consent and simulated payment choice')
        page.locator('#checkout button').click()
        check('zamítnuta' in page.locator('#checkout-error').inner_text(), 'Declined simulated payment preserves the cart')
        page.locator('#payment').select_option('success')
        page.locator('#checkout button').click()
        check(page.locator('.ticket-paper').count() == 2, 'Guest checkout creates two tickets')
        check('host@example.test' in page.locator('.order').inner_text(), 'Guest email is retained')
        guest_order = page.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        with page.expect_download() as download:
            page.locator('[data-download]').click()
        check(download.value.suggested_filename.endswith('.pdf'), 'Ticket download uses the PDF extension')
        pdf_path = ARTIFACTS / 'guest-tickets.pdf'
        download.value.save_as(str(pdf_path))
        validate_pdf(pdf_path, guest_order)

        go('tickets.html')
        check(page.locator('[data-seat="A1"]').is_disabled(), 'Purchased seats become occupied locally')
        page.locator('[data-seat="A2"]').click()
        page.locator('#add-cart').click()
        go('account.html?next=cart')
        page.locator('#register-tab').click()
        page.locator('#auth-name').fill('Tester Nový')
        page.locator('#auth-email').fill('tester@example.test')
        page.locator('#auth-password').fill('UniqueSchool123!')
        page.locator('#auth-submit').click()
        page.wait_for_url('**/cart.html')
        check(page.locator('[data-remove]').count() == 1, 'Guest cart transfers after registration')
        check(page.locator('#buyer-email').input_value() == 'tester@example.test', 'Account email is prefilled')
        page.locator('#consent').check()
        page.locator('#checkout button').click()
        check(page.locator('.ticket-paper').count() == 1, 'Registered checkout succeeds')

        go('account.html')
        check(page.locator('.order').count() == 1, "Account history shows only that account's orders")
        for width in [320, 768, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            no_overflow(f'Populated account history fits {width}px')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.locator('#logout').click()
        page.wait_for_selector('#auth-email')
        page.locator('#auth-email').fill('tester@example.test')
        page.locator('#auth-password').fill('WrongPassword!')
        page.locator('#auth-submit').click()
        page.wait_for_function("document.querySelector('#auth-error').textContent.length > 0")
        check('Nesprávný' in page.locator('#auth-error').inner_text(), 'Wrong password is rejected')
        page.locator('#auth-password').fill('UniqueSchool123!')
        page.locator('#auth-submit').click()
        page.wait_for_selector('#logout')
        check(page.locator('.order').count() == 1, 'Local login restores order history')
        stored_user = page.evaluate("JSON.parse(localStorage.getItem('pulse:users'))[0]")
        check('password' not in stored_user and len(stored_user['hash']) == 64 and len(stored_user['salt']) == 32,
              'School account stores a salted PBKDF2 hash rather than the password')

        go('index.html')
        page.screenshot(path=str(ARTIFACTS / 'home-desktop.png'), full_page=True, animations='disabled')
        page.set_viewport_size({'width': 375, 'height': 812})
        page.locator('.menu-toggle').click()
        check(page.locator('#navigation').is_visible(), 'Mobile menu opens')
        check(page.locator('.menu-toggle').get_attribute('aria-expanded') == 'true', 'Mobile menu exposes its expanded state')
        page.locator("#navigation a[href='program.html']").click()
        page.wait_for_url('**/program.html')
        check(page.locator('#events article').count() == 60, 'Mobile navigation reaches the program')
        go('index.html')
        page.screenshot(path=str(ARTIFACTS / 'home-mobile.png'), full_page=True, animations='disabled')
        page.set_viewport_size({'width': 1440, 'height': 1000})

        # A local change after selection must still be checked before checkout.
        go('tickets.html')
        page.locator('[data-seat="B1"]').click()
        page.locator('#add-cart').click()
        go('cart.html')
        page.locator('#consent').check()
        page.evaluate("""() => {
          const id = JSON.parse(sessionStorage.getItem('pulse:session')).id;
          const key = 'pulse:cart:' + id;
          const cart = JSON.parse(localStorage.getItem(key));
          cart.push({ day: 'd1', seat: 'B2', price: 590, category: 'vip' });
          localStorage.setItem(key, JSON.stringify(cart));
        }""")
        page.locator('#checkout button').click()
        check('Košík se mezitím změnil' in page.locator('#checkout-error').inner_text(),
              'A changed local cart requires review before checkout')
        check(page.locator('[data-remove]').count() == 2 and page.locator('#consent').is_checked(),
              'Cart review rerenders the new selection and preserves form state')
        page.evaluate("""() => {
          const orders = JSON.parse(localStorage.getItem('pulse:orders'));
          orders.push({ id: 'external', tickets: [{ day: 'd1', seat: 'B1', price: 590, category: 'vip' }] });
          localStorage.setItem('pulse:orders', JSON.stringify(orders));
        }""")
        page.locator('#checkout button').click()
        check('není dostupné' in page.locator('#checkout-error').inner_text(), 'Checkout rechecks local seat availability')
        check(not errors, 'No JavaScript runtime errors: ' + str(errors))
        check(not external_requests, 'Website assets and PDF generation need no external network requests')

        corrupt_context = browser.new_context()
        corrupt_context.add_init_script("localStorage.setItem('pulse:users', '{}')")
        corrupt_page = corrupt_context.new_page()
        corrupt_errors = []
        corrupt_page.on('pageerror', lambda error: corrupt_errors.append(str(error)))
        corrupt_page.goto(BASE + 'index.html')
        check(bool(corrupt_page.locator('[data-home-title]').inner_text().strip()) and not corrupt_errors,
              'Malformed local account storage does not break the homepage')
        corrupt_context.close()

        file_context = browser.new_context()
        file_page = file_context.new_page()
        try:
            file_page.goto((ROOT / 'web/index.html').as_uri())
            check(bool(file_page.locator('main h1').inner_text().strip()), 'Direct file opening initializes the homepage')
            file_page.goto((ROOT / 'web/program.html').as_uri())
            file_page.wait_for_selector('#events article')
            check(file_page.locator('#events article').count() == 60, 'Program works from a file URL')
        except Error as error:
            if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):
                raise
            print('SKIP file:// blocked by browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed')
        finally:
            file_context.close()
            context.close()
            browser.close()

    (ARTIFACTS / 'summary.json').write_text(json.dumps({'checks': len(CHECKS), 'passed': CHECKS}, ensure_ascii=False, indent=2))
    print(f'\n{len(CHECKS)} checks passed. Artifacts: {ARTIFACTS}')
finally:
    server.shutdown()
    server.server_close()
