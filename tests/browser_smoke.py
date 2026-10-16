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
            check('prague' in normalized and 'rocks' in normalized, f'PDF page {index + 1} uses the festival identity')
            if ticket.get('scope') == 'festival':
                check('1.–3. 8. 2026' in text and ('3 dny' in normalized or '3 days' in normalized),
                      f'PDF page {index + 1} includes the three-day validity')
            check(pdf_page.rect.width > pdf_page.rect.height, f'PDF page {index + 1} uses a landscape layout')
            check(bool(pdf_page.get_fonts()), f'PDF page {index + 1} contains typography')
            qr_modules = [drawing for drawing in pdf_page.get_drawings()
                          if 0 < drawing['rect'].width < 6 and 0 < drawing['rect'].height < 6]
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

        def scope(value, day='d1'):
            page.locator('#ticket-scope').select_option(value)
            if value == 'day':
                page.locator('#ticket-day').select_option(day)

        def login(target, password='UniqueSchool123!'):
            target.locator('#auth-email').fill('tester@example.test')
            target.locator('#auth-password').fill(password)
            target.locator('#auth-submit').click()

        go('index.html')
        check(bool(page.locator('main h1').inner_text().strip()), 'Homepage initializes')
        check('Zkus to prosím znovu' not in page.locator('main').inner_text(), 'Homepage avoids the error fallback')
        check('Prague Rocks Festival' in page.title(), 'Page metadata uses the new festival name')
        check(page.locator('.global-search svg').count() == 1, 'Header search uses a vector icon')
        check(page.locator('#hero-film source').first.get_attribute('src').endswith('.webm'), 'Hero references the local WebM film')
        check(page.locator('#hero-film source[type=\"video/mp4\"]').count() == 1, 'Hero includes an MP4 fallback source')
        page.wait_for_function("document.querySelector('#hero-film').readyState >= 2")
        check(page.locator('#hero-film').evaluate('(v)=>v.videoWidth>0 && v.videoHeight>0'), 'Hero video decodes in Chromium')
        page.wait_for_function("!document.querySelector('#hero-film').paused")
        page.locator('#film-toggle').click()
        check(page.locator('#hero-film').evaluate('(v)=>v.paused'), 'Hero video can be paused')
        page.locator('#film-toggle').click()
        page.wait_for_function("!document.querySelector('#hero-film').paused")
        check(True, 'Hero video can resume')

        routes = ['index.html', 'program.html', 'performers.html', 'venues.html', 'info.html',
                  'search.html?q=Neon', 'tickets.html', 'cart.html', 'account.html']
        for width in [320, 375, 430, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            for route in routes:
                go(route)
                no_overflow(f'No horizontal overflow at {width}px: {route}')

        page.set_viewport_size({'width': 1440, 'height': 1000})
        go('performers.html')
        genres_cs = page.locator('#genre option').evaluate_all('(options)=>options.map(o=>o.value)')
        page.locator('[data-lang="en"]').click()
        page.wait_for_function("document.documentElement.lang === 'en'")
        check(page.locator('#genre option').evaluate_all('(options)=>options.map(o=>o.value)') == genres_cs,
              'English translation preserves genre filter values')
        genre = next(value for value in genres_cs if value)
        page.locator('#genre').select_option(genre)
        check(0 < page.locator('#artists article').count() < 60, 'Genre filtering works after language switching')
        for route in routes:
            go(route)
            check(page.locator('html').get_attribute('lang') == 'en', f'English preference persists: {route}')
            check('Můj účet' not in page.locator('#navigation').inner_text()
                  and 'Vstupenky' not in page.locator('#navigation').inner_text(), f'English navigation is translated: {route}')
            check('Prague Rocks Festival' in page.title(), f'English metadata retains the identity: {route}')
        go('info.html')
        check('How' in page.locator('main').inner_text() or 'Getting' in page.locator('main').inner_text(),
              'Practical information has English content')
        go('performers.html')
        page.locator('[data-artist]').first.click()
        check('Kdy hraje' not in page.locator('dialog').inner_text(), 'Artist detail is translated into English')
        page.keyboard.press('Escape')
        page.locator('[data-lang="cs"]').click()
        page.wait_for_function("document.documentElement.lang === 'cs'")
        check(page.locator('#genre option').evaluate_all('(options)=>options.map(o=>o.value)') == genres_cs,
              'Switching back to Czech retains original genre values')

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
        art = page.locator('#artists .artist-art').evaluate_all('''(nodes)=>nodes.map(n=>{
            const image=n.querySelector('img'); const s=getComputedStyle(image||n);
            return [image?.getAttribute('src')||s.backgroundImage,s.backgroundPosition,s.objectPosition].join('|');
        })''')
        check(len(art) == 60 and len(set(art)) == 60, 'All 60 performer cards have distinct portrait selections')
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
        scope('day')
        check(page.locator('#seat-map [data-seat]:disabled').count() == 0, 'All 48 seats start available')
        check(page.locator('#seat-map [data-seat]').count() == 48, 'Seat map exposes all 48 seats')
        check('40' in page.locator('#standing-count').inner_text(), 'All 40 standing places start available')
        page.locator('[data-seat="A1"]').focus()
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'true', 'Space selects a focused seat')
        check(page.evaluate("document.activeElement.dataset.seat === 'A1'"), 'Seat selection retains keyboard focus')
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'false', 'Space deselects a focused seat')
        scope('festival')
        page.locator('[data-seat="A1"]').click()
        page.locator('[data-seat="C1"]').click()
        page.locator('#standing').click()
        check('3\u00a0070' in page.locator('#selection').inner_text(), 'Three-day VIP, Regular and standing total 3070 Kč')
        page.locator('#add-cart').click()
        check('Košík (3)' in page.locator('#navigation').inner_text(), 'Cart counter updates')

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
              'Removing a ticket preserves consent and payment choice')
        page.locator('#checkout button').click()
        check('zamítnuta' in page.locator('#checkout-error').inner_text(), 'Declined simulated payment preserves the cart')
        page.locator('#payment').select_option('success')
        page.locator('#checkout button').click()
        check(page.locator('.ticket-paper').count() == 2, 'Guest checkout creates two tickets')
        check('host@example.test' in page.locator('.order').inner_text(), 'Guest email is retained')
        guest_order = page.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        check(all(t['scope'] == 'festival' and t['days'] == ['d1', 'd2', 'd3'] for t in guest_order['tickets']),
              'A three-day purchase stores validity for all three dates')
        with page.expect_download() as download:
            page.locator('[data-download]').click()
        check(download.value.suggested_filename.endswith('.pdf'), 'Ticket download uses the PDF extension')
        pdf_path = ARTIFACTS / 'guest-tickets.pdf'
        download.value.save_as(str(pdf_path))
        validate_pdf(pdf_path, guest_order)

        go('tickets.html')
        for day in ['d1', 'd2', 'd3']:
            scope('day', day)
            check(page.locator('[data-seat="A1"]').is_disabled(), f'Three-day purchase reserves the same seat on {day}')
            check(page.locator('[data-seat="A3"]').is_enabled(), f'Unpurchased seats stay available on {day}')
        scope('day', 'd2')
        page.locator('[data-seat="B1"]').click()
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

        go('tickets.html')
        scope('festival')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking blocks an overlapping full pass')
        scope('day', 'd1')
        check(page.locator('[data-seat="B1"]').is_enabled(), 'A single-day booking leaves other days available')
        scope('day', 'd2')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking reserves its selected day')
        go('account.html')
        check(page.locator('.order').count() == 1, "Account history shows only that account's orders")
        for width in [320, 768, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            no_overflow(f'Populated account history fits {width}px')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        auth = page.evaluate("JSON.parse(localStorage.getItem('pulse:auth'))")
        expires_in_days = page.evaluate('(auth)=>(auth.expires-Date.now())/86400000', auth)
        check(6.99 < expires_in_days <= 7, 'Login persists for seven days')
        new_tab = context.new_page()
        new_tab.goto(BASE + 'account.html')
        check(new_tab.locator('#logout').is_visible(), 'Login survives opening a new browser tab')
        new_tab.close()
        resumed = browser.new_context(storage_state=context.storage_state())
        resumed_page = resumed.new_page()
        resumed_page.goto(BASE + 'account.html')
        check(resumed_page.locator('#logout').is_visible(), 'Login survives closing and reopening the browser context')
        resumed_page.evaluate("localStorage.setItem('pulse:auth', JSON.stringify({id: JSON.parse(localStorage.getItem('pulse:users'))[0].id, expires:Date.now()-1000}))")
        resumed_page.reload()
        check(resumed_page.locator('#auth-email').is_visible(), 'An expired seven-day login requires authentication')
        resumed.close()

        page.locator('#logout').click()
        page.wait_for_selector('#auth-email')
        check(page.evaluate("localStorage.getItem('pulse:auth') === null"), 'Logout removes the persistent login')
        login(page, 'WrongPassword!')
        page.wait_for_function("document.querySelector('#auth-error').textContent.length > 0")
        check('Nesprávný' in page.locator('#auth-error').inner_text(), 'Wrong password is rejected')
        login(page)
        page.wait_for_selector('#logout')
        check(page.locator('.order').count() == 1, 'Login restores order history')
        stored_user = page.evaluate("JSON.parse(localStorage.getItem('pulse:users'))[0]")
        check('password' not in stored_user and len(stored_user['hash']) == 64 and len(stored_user['salt']) == 32,
              'Account stores a salted PBKDF2 hash rather than the password')

        # Backups are explicit downloads; a website cannot silently overwrite local JSON files.
        with page.expect_download() as backup_download:
            page.locator('#export-data').click()
        backup_path = ARTIFACTS / 'prague-rocks-backup.json'
        backup_download.value.save_as(str(backup_path))
        backup_text = backup_path.read_text()
        backup_data = json.loads(backup_text)
        check('UniqueSchool123!' not in backup_text and stored_user['hash'] in backup_text,
              'JSON export contains hashed account data and no plaintext password')
        fresh_context = browser.new_context(accept_downloads=True)
        fresh = fresh_context.new_page()
        fresh.goto(BASE + 'account.html')
        fresh.locator('#import-data').set_input_files(str(backup_path))
        fresh.wait_for_function("JSON.parse(localStorage.getItem('pulse:users')||'[]').length === 1")
        check(fresh.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).length") == 2,
              'JSON import restores account and guest orders in a fresh browser')
        login(fresh)
        fresh.wait_for_selector('#logout')
        check(fresh.locator('.order').count() == 1, 'The imported account can log in with its original password')
        fresh.goto(BASE + 'tickets.html')
        fresh.locator('#ticket-scope').select_option('day')
        fresh.locator('#ticket-day').select_option('d3')
        check(fresh.locator('[data-seat="A1"]').is_disabled(), 'JSON import restores three-day seat occupancy')
        fresh.goto(BASE + 'account.html')
        fresh.locator('#import-data').set_input_files(str(backup_path))
        fresh.wait_for_function("document.querySelector('#backup-status').textContent.length > 0")
        check(fresh.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).length") == 2,
              'Importing the same backup does not duplicate orders')
        invalid_path = ARTIFACTS / 'invalid-backup.json'
        invalid_path.write_text('{"users": [{"password":"plaintext"}], "orders": []}')
        fresh.evaluate("document.querySelector('#backup-status').textContent = ''")
        fresh.locator('#import-data').set_input_files(str(invalid_path))
        fresh.wait_for_function("document.querySelector('#backup-status').textContent.length > 0")
        check(fresh.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).length") == 2,
              'Invalid backup cannot replace existing orders')
        fresh_context.close()

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

        # A cart or seat change after selection must still be checked before checkout.
        go('tickets.html')
        scope('day')
        page.locator('[data-seat="B3"]').click()
        page.locator('#add-cart').click()
        go('cart.html')
        page.locator('#consent').check()
        page.evaluate("""() => {
          const id = JSON.parse(localStorage.getItem('pulse:auth')).id;
          const key = 'pulse:cart:' + id;
          const cart = JSON.parse(localStorage.getItem(key));
          cart.push({day:'d1', seat:'B4', price:590, category:'vip', scope:'day'});
          localStorage.setItem(key, JSON.stringify(cart));
        }""")
        page.locator('#checkout button').click()
        check('Košík se mezitím změnil' in page.locator('#checkout-error').inner_text(),
              'A changed local cart requires review before checkout')
        check(page.locator('[data-remove]').count() == 2 and page.locator('#consent').is_checked(),
              'Cart review rerenders the new selection and preserves form state')
        page.evaluate("""() => {
          const orders = JSON.parse(localStorage.getItem('pulse:orders'));
          orders.push({id:'external', tickets:[{day:'d1',seat:'B3',price:590,category:'vip',scope:'day'}]});
          localStorage.setItem('pulse:orders', JSON.stringify(orders));
        }""")
        page.locator('#checkout button').click()
        check('není dostupné' in page.locator('#checkout-error').inner_text(), 'Checkout rechecks local seat availability')
        check(not errors, 'No JavaScript runtime errors: ' + str(errors))
        check(not external_requests, 'All assets, purchases and PDF generation work without external network requests')

        go('info.html')
        check(page.locator('iframe').count() == 0, 'Google Maps is not embedded before explicit loading')
        page.route('https://maps.google.com/**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Map test fixture</p>'))
        page.locator('#load-map').click()
        page.wait_for_selector('iframe')
        check('google.com/maps' in page.locator('iframe').get_attribute('src'), 'Google Maps loads after the map button is activated')

        reduced = browser.new_context(reduced_motion='reduce')
        reduced_page = reduced.new_page()
        reduced_page.goto(BASE + 'index.html')
        reduced_page.wait_for_timeout(200)
        check(reduced_page.locator('#hero-film').evaluate('(v)=>v.paused'), 'Reduced motion disables automatic video playback')
        reduced.close()

        corrupt_context = browser.new_context()
        corrupt_context.add_init_script("localStorage.setItem('pulse:users', '{}')")
        corrupt_page = corrupt_context.new_page()
        corrupt_errors = []
        corrupt_page.on('pageerror', lambda error: corrupt_errors.append(str(error)))
        corrupt_page.goto(BASE + 'index.html')
        check(bool(corrupt_page.locator('main h1').inner_text().strip()) and not corrupt_errors,
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
