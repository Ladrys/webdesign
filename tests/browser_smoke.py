"""Development checks; the delivered website needs no server or packages.

Run: python tests/browser_smoke.py
Development dependencies: Playwright, Chromium and PyMuPDF.
Optional QR decoding checks: zxing-cpp and NumPy.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import quote
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


def validate_pdf(path, order, festival_dates):
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
            check('prague' in normalized and 'pulse' in normalized and 'fest' in normalized,
                  f'PDF page {index + 1} uses the Prague Pulse Fest identity')
            if ticket.get('scope') == 'festival':
                first, last = festival_dates[0]['date'].split('-'), festival_dates[-1]['date'].split('-')
                period = f'{int(first[2])}.–{int(last[2])}. {int(last[1])}. {last[0]}'
                check(period in text and ('3 dny' in normalized or '3 days' in normalized),
                      f'PDF page {index + 1} includes the three-day validity')
            compact = ''.join(text.split())
            check(f"{ticket['price']}Kč" in compact, f'PDF page {index + 1} includes the ticket base price')
            if order.get('discount'):
                check(order['promoCode'] in text and all(f'{order[key]}Kč' in compact for key in ['subtotal', 'discount', 'total']),
                      f'PDF page {index + 1} includes the order subtotal, discount and final total')
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
        # Keep the consent checks deterministic and never contact external map servers.
        context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Map test fixture</p>'))
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

        def fill_buyer(target, first='Žofie', surname='Černá', email='host@example.test', phone='+420 777 123 456'):
            target.locator('#buyer-name').fill(first)
            target.locator('#buyer-surname').fill(surname)
            if target.locator('#buyer-email').is_editable():
                target.locator('#buyer-email').fill(email)
            target.locator('#buyer-phone').fill(phone)

        def login(target, password='UniqueSchool123!'):
            target.locator('#auth-email').fill('tester@example.test')
            target.locator('#auth-password').fill(password)
            target.locator('#auth-submit').click()

        def switch_language(target, language):
            target.locator(f'button[data-lang="{language}"]').click()
            # The language module runs before the shell; wait for the new document's UI too.
            target.wait_for_function('''language => document.documentElement.lang === language
                && document.readyState === 'complete'
                && document.querySelector('button[data-lang="'+language+'"][aria-pressed="true"]')
                && document.querySelector('.global-search')''', arg=language)
            target.evaluate('document.fonts.ready')

        go('index.html')
        check(bool(page.locator('main h1').inner_text().strip()), 'Homepage initializes')
        check('Zkus to prosím znovu' not in page.locator('main').inner_text(), 'Homepage avoids the error fallback')
        check(page.locator('#cookie-banner').is_visible(), 'A first visit shows the cookie and storage banner')
        check(page.locator('#cookie-accept-all, #cookie-reject, #cookie-banner [data-cookie-settings]').count() == 3,
              'The privacy banner offers accept, necessary-only and settings actions')
        page.locator('#cookie-banner [data-cookie-settings]').click()
        necessary = page.locator('#cookie-panel input[disabled]')
        check(necessary.is_checked() and necessary.is_disabled(), 'Necessary storage is explicitly always enabled')
        check(not page.locator('#cookie-external-maps').is_checked(), 'External Google Maps starts disabled')
        page.locator('#cookie-only-necessary').click()
        check(page.locator('#cookie-banner').count() == 0
              and page.evaluate("JSON.parse(localStorage.getItem('pulse:privacy')).externalMaps === false"),
              'Necessary-only consent is saved and dismisses the banner')
        check('Prague Pulse Fest' in page.title(), 'Page metadata uses the original Prague Pulse Fest name')
        festival_dates = page.evaluate('window.FESTIVAL_DATA.festival.dates')
        current_edition = int(festival_dates[0]['date'][:4])
        performer_names = page.evaluate('window.FESTIVAL_DATA.performers.map(p=>p.name)')
        check(len(performer_names) == len(set(performer_names)) == 60, 'All 60 performer names are unique')
        check(page.locator('.global-search svg').count() == 1, 'Header search uses a vector icon')
        countdown_states = page.evaluate('''() => {
            const start='2026-08-01T09:00:00+02:00', end='2026-08-03T23:59:00+02:00';
            const state=window.PulseCountdown.getState;
            return {before:state(start,end,new Date(start).getTime()-90061000),
                    start:state(start,end,new Date(start).getTime()),
                    during:state(start,end,new Date(start).getTime()+3600000),
                    end:state(start,end,new Date(end).getTime()),
                    after:state(start,end,new Date(end).getTime()+1),
                    invalid:state('invalid',end,0)};
        }''')
        check(countdown_states['before'] == {'phase': 'upcoming', 'totalSeconds': 90061,
              'days': 1, 'hours': 1, 'minutes': 1, 'seconds': 1},
              'Countdown decomposes time remaining into days, hours, minutes and seconds')
        check(all(countdown_states[key]['phase'] == 'during' for key in ['start', 'during', 'end']),
              'Countdown treats the full festival interval as live')
        check(countdown_states['after']['phase'] == 'ended'
              and countdown_states['after']['totalSeconds'] == 0,
              'Countdown shows an ended state after the festival instead of negative numbers')
        check(countdown_states['invalid']['phase'] == 'invalid'
              and all(state['totalSeconds'] >= 0 for state in countdown_states.values()),
              'Countdown handles invalid dates without NaN or negative values')
        check(page.locator('[data-countdown]').count() == 1
              and len(page.locator('[data-countdown-caption]').inner_text().strip()) > 0,
              'Homepage renders a visible countdown or current festival status')
        hero = page.locator('.pulse-hero-photo img')
        page.wait_for_function("document.querySelector('.pulse-hero-photo img')?.complete && document.querySelector('.pulse-hero-photo img').naturalWidth > 0")
        check(hero.count() == 1 and hero.evaluate('(image)=>image.naturalWidth>=1200 && image.naturalWidth>image.naturalHeight'),
              'The homepage hero uses a loaded landscape venue image with sufficient resolution')
        check(not hero.get_attribute('src').startswith(('http:', 'https:')) and bool(hero.get_attribute('alt')),
              'The venue hero is stored locally and has descriptive alternative text')
        check(page.locator('#hero-film, #film-toggle, .pulse-hero-title svg').count() == 0,
              'The homepage has no video controls or decorative sound bars')
        check(page.locator('[data-countdown-caption]').inner_text() == 'FESTIVAL STARTUJE ZA',
              'The countdown clearly says when the festival starts')
        check(page.locator('.rocks-headliners [data-artist]').evaluate_all('(nodes)=>nodes.map(n=>n.textContent.trim())')
              == ['David Guetta', 'Katy Perry', 'Skrillex'], 'The homepage highlights its three selected headliners')
        homepage_copy = page.locator('main').inner_text().casefold()
        check('hudba na prvním místě' not in homepage_copy and 'srpen patří hudbě' not in homepage_copy,
              'The homepage removes the generic slogans requested by the user')
        check(page.locator('.home-package-grid > .home-package').count() == 3,
              'The homepage presents all three full-festival ticket categories')
        package_prices = page.locator('.home-package-price').all_text_contents()
        check(sorted(int(''.join(c for c in text if c.isdigit())) for text in package_prices) == [490, 990, 1590],
              'Homepage three-day prices are clearly visible and match the data catalogue')
        check(all('scope=festival' in href and 'category=' in href
                  for href in page.locator('.home-package-grid .package-buy').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("href"))')),
              'Each homepage ticket action preserves its category and three-day validity')
        page.locator('.all-artists').hover()
        check(page.locator('.all-artists').evaluate('(button)=>getComputedStyle(button).textDecorationLine === "none"'),
              'The larger all-artists action does not acquire a second underline on hover')
        check(page.locator('.home-news .news-card').count() == 3,
              'The homepage presents three current-news cards')
        news_links = page.locator('.home-news .news-card a[href*="news.html?id="]').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("href"))')
        news_links = list(dict.fromkeys(news_links))
        check(len(news_links) == 3, 'Every news card links to its own article')
        background = page.evaluate('getComputedStyle(document.body).backgroundColor.match(/[0-9.]+/g).slice(0,3).map(Number)')
        check(all(value < 100 for value in background),
              'The page background remains dark below the hero')

        for width in [1024, 1280, 1366]:
            page.set_viewport_size({'width': width, 'height': 900})
            for language in ['en', 'cs']:
                switch_language(page, language)
                in_one_row = page.evaluate('''() => {
                    const selectors=['.brand-cluster','#navigation','.global-search','.language-switch'];
                    const rects=selectors.map(s=>document.querySelector(s).getBoundingClientRect());
                    const links=[...document.querySelectorAll('#navigation a')].map(a=>a.getBoundingClientRect());
                    return rects.every(r=>r.width>0 && r.left>=0 && r.right<=innerWidth)
                      && Math.max(...rects.map(r=>r.top))<Math.min(...rects.map(r=>r.bottom))
                      && Math.max(...links.map(r=>r.top))<Math.min(...links.map(r=>r.bottom));
                }''')
                check(in_one_row, f'Brand, navigation, search and language switch share one row at {width}px in {language}')
                header_box = page.locator('.header-inner').bounding_box()
                check(header_box['x'] <= 1 and header_box['width'] >= width-2,
                      f'The header spans the device width at {width}px in {language}')
                ticket_box = page.locator('#navigation .ticket-link').bounding_box()
                check(ticket_box['width'] <= 150 and ticket_box['height'] <= 56,
                      f'Header ticket button stays compact at {width}px in {language}')
                no_overflow(f'Laptop header fits {width}px in {language}')
        check(page.locator('.footer-social a').count() == 5
              and page.locator('.footer-social a svg').count() == 5,
              'Footer includes five recognizable vector social icons')
        check(all(page.locator('.footer-social a').nth(i).get_attribute('aria-label')
                  for i in range(5)), 'Social icon links expose accessible platform names')

        routes = ['index.html', 'program.html', 'performers.html', 'venues.html', 'info.html',
                  'search.html?q=' + quote(performer_names[0]), 'tickets.html', 'cart.html', 'account.html', news_links[0]]
        for width in [320, 375, 430, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            for route in routes:
                go(route)
                no_overflow(f'No horizontal overflow at {width}px: {route}')

        page.set_viewport_size({'width': 1440, 'height': 1000})
        news_titles = []
        for article in news_links:
            go(article)
            news_titles.append(page.locator('.news-detail h1').inner_text().strip())
            check(bool(news_titles[-1]) and len(page.locator('.news-body').inner_text()) > 100,
                  f'News article loads its own title and full content: {article}')
        check(len(set(news_titles)) == 3, 'The three news links open distinct articles')
        go('news.html?id=' + quote('<img src=x onerror=alert(1)>'))
        check(page.locator('main h1').count() == 1 and page.locator('main img[src="x"], main script:not([type="application/ld+json"])').count() == 0,
              'An unknown or malicious news ID renders a safe fallback without injecting markup')
        go('performers.html')
        genres_cs = page.locator('#genre option').evaluate_all('(options)=>options.map(o=>o.value)')
        switch_language(page, 'en')
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
            check('Prague Pulse Fest' in page.title(), f'English metadata retains the identity: {route}')
        go('info.html')
        check('How' in page.locator('main').inner_text() or 'Getting' in page.locator('main').inner_text(),
              'Practical information has English content')
        go('performers.html')
        page.locator('[data-artist]').first.click()
        check('Kdy hraje' not in page.locator('dialog').inner_text(), 'Artist detail is translated into English')
        page.keyboard.press('Escape')
        switch_language(page, 'cs')
        check(page.locator('#genre option').evaluate_all('(options)=>options.map(o=>o.value)') == genres_cs,
              'Switching back to Czech retains original genre values')

        query = performer_names[0][1:-1].swapcase()
        go('search.html?q=' + quote(query))
        artist_id = page.evaluate('window.FESTIVAL_DATA.performers[0].id')
        matching_events = page.evaluate('(id)=>window.FESTIVAL_DATA.events.filter(e=>e.performerIds.includes(id)).map(e=>e.id)', artist_id)
        check(page.locator(f'#search-results a[href="performers.html?id={artist_id}"]').count() > 0,
              'Contains search matches an artist name substring regardless of case')
        check(all(page.locator(f'#search-results a[href="program.html?event={event_id}"]').count() > 0
                  for event_id in matching_events), 'Contains search includes the selected artist\'s programme entries')
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
        check(len(art) == 60 and len(set(art)) == 60, 'All 60 performer cards have distinct local artwork')
        headliner_assets = page.evaluate("['i1','i2','i3'].map(id=>({id,...window.PerformerArt.get(id)}))")
        for asset in headliner_assets:
            decoded = page.evaluate("""async asset => {
                const image = new Image(); image.src = asset.image;
                await image.decode();
                return {width:image.naturalWidth,height:image.naturalHeight,origin:new URL(image.src).origin};
            }""", asset)
            check(asset['kind'] == 'photo' and decoded['width'] >= 400 and decoded['height'] >= 400
                  and decoded['origin'] == BASE.split('/web/')[0],
                  f"Headliner {asset['id']} uses a decoded, sufficiently sized local artist photograph")
        page.locator('#artist-q').fill(performer_names[-1])
        check(page.locator('#artists article').count() == 1, 'The last performer is searchable')
        page.locator('[data-artist]').click()
        check(page.locator('dialog').is_visible(), 'Artist detail opens')
        page.keyboard.press('Escape')
        check(not page.locator('dialog').is_visible(), 'Artist detail closes with Escape')

        go('program.html')
        check(page.locator('#events article').count() == 60, 'All 60 events load')
        timeline = page.locator('#events article time').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("datetime"))')
        check(timeline == sorted(timeline), 'The full programme is ordered chronologically across all three days')
        page.locator('#day').select_option('d2')
        day_timeline = page.locator('#events article time').evaluate_all('(nodes)=>nodes.map(n=>n.getAttribute("datetime"))')
        check(day_timeline == sorted(day_timeline) and all(value.startswith(festival_dates[1]['date']) for value in day_timeline),
              'Day filtering preserves chronological programme order')
        page.locator('#day').select_option('')
        page.locator('[data-fav]').first.click()
        check(page.evaluate("document.activeElement.matches('[data-fav]')"), 'Favorite toggle retains keyboard focus')
        page.locator('#only-favorites').check()
        check(page.locator('#events article').count() == 1, 'Favorites filter works')
        page.reload()
        page.locator('#only-favorites').check()
        check(page.locator('#events article').count() == 1, 'Favorites survive reload')

        go('tickets.html')
        check(page.locator('a.cart-go[href="cart.html"] svg.cart-icon').count() == 1,
              'The ticket selector links to the cart with a recognizable vector cart icon')
        scope('day')
        check(page.locator('#seat-map [data-seat]:disabled').count() == 0, 'All 48 seats start available')
        check(page.locator('#seat-map [data-seat]').count() == 48, 'Seat map exposes all 48 seats')
        check('40' in page.locator('#standing-count').inner_text(), 'All 40 standing places start available')
        for day in ['d2', 'd3']:
            scope('day', day)
            check(page.locator('#seat-map [data-seat]:disabled').count() == 0
                  and '40' in page.locator('#standing-count').inner_text(),
                  f'A new browser starts with every seat and standing place available on {day}')
        scope('day', 'd1')
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
        check(page.locator('#navigation .cart-count').inner_text() == '3', 'Cart counter updates')
        check(page.locator('#navigation a[href="cart.html"] svg.cart-icon').count() == 1,
              'Updating the cart counter preserves its navigation icon')

        go('cart.html')
        for width in [320, 768, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            no_overflow(f'Filled checkout fits {width}px')
        page.set_viewport_size({'width': 375, 'height': 812})
        page.screenshot(path=str(ARTIFACTS / 'checkout-mobile.png'), full_page=True, animations='disabled')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        check(page.locator('[data-remove]').count() == 3, 'Cart survives navigation')
        fill_buyer(page)
        page.locator('#consent').check()
        page.locator('#payment').select_option('declined')
        page.locator('[data-remove]').nth(1).click()
        check(page.locator('[data-remove]').count() == 2, 'Removing a ticket rerenders the cart')
        check(page.locator('#buyer-name').input_value() == 'Žofie'
              and page.locator('#buyer-surname').input_value() == 'Černá'
              and page.locator('#buyer-phone').input_value() == '+420 777 123 456'
              and page.locator('#buyer-email').input_value() == 'host@example.test',
              'Removing a ticket preserves the entered buyer details')
        check(page.locator('#consent').is_checked() and page.locator('#payment').input_value() == 'declined',
              'Removing a ticket preserves consent and payment choice')
        page.locator('#checkout-submit').click()
        check('zamítnuta' in page.locator('#checkout-error').inner_text(), 'Declined simulated payment preserves the cart')
        page.locator('#payment').select_option('success')
        page.locator('#checkout-submit').click()
        check(page.locator('.ticket-paper').count() == 2, 'Guest checkout creates two tickets')
        check('host@example.test' in page.locator('.order').inner_text(), 'Guest email is retained')
        guest_order = page.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        check(guest_order.get('edition') == current_edition, 'New orders explicitly record the current festival edition')
        check(all(t['scope'] == 'festival' and t['days'] == ['d1', 'd2', 'd3'] for t in guest_order['tickets']),
              'A three-day purchase stores validity for all three dates')
        with page.expect_download() as download:
            page.locator('[data-download]').click()
        check(download.value.suggested_filename.endswith('.pdf'), 'Ticket download uses the PDF extension')
        pdf_path = ARTIFACTS / 'guest-tickets.pdf'
        download.value.save_as(str(pdf_path))
        validate_pdf(pdf_path, guest_order, festival_dates)
        check(page.locator('[data-print], button[onclick*="print("]').count() == 0,
              'Completed order offers PDF download without a print action')

        go('tickets.html')
        for day in ['d1', 'd2', 'd3']:
            scope('day', day)
            check(page.locator('[data-seat="A1"]').is_disabled(), f'Three-day purchase reserves the same seat on {day}')
            check(page.locator('[data-seat="A3"]').is_enabled(), f'Unpurchased seats stay available on {day}')
            check('39' in page.locator('#standing-count').inner_text(), f'Three-day purchase also reserves its standing place on {day}')
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
        page.locator('#buyer-phone').fill('+420 777 123 456')
        page.locator('#consent').check()
        page.locator('#checkout-submit').click()
        check(page.locator('.ticket-paper').count() == 1, 'Registered checkout succeeds')
        registered_order = page.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")

        go('tickets.html')
        scope('festival')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking blocks an overlapping full pass')
        scope('day', 'd1')
        check(page.locator('[data-seat="B1"]').is_enabled(), 'A single-day booking leaves other days available')
        scope('day', 'd2')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking reserves its selected day')
        go('account.html')
        check(page.locator('.order').count() == 1, "Account history shows only that account's orders")
        check(page.locator('#export-data, #import-data, #backup-status, [data-print], .backup-panel').count() == 0,
              'Account history has no JSON backup, import or print controls')
        legacy_context = browser.new_context(storage_state=context.storage_state(), accept_downloads=True)
        legacy_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Map test fixture</p>'))
        legacy_page = legacy_context.new_page()
        legacy_page.goto(BASE + 'account.html')
        legacy_order = {**registered_order, 'id': 'PP-LEGACY-2026', 'created': '2026-07-20T12:00:00Z'}
        legacy_order.pop('edition', None)
        legacy_page.evaluate('(order)=>localStorage.setItem("pulse:orders",JSON.stringify([order]))', legacy_order)
        legacy_page.reload()
        check(legacy_page.locator('.order').count() == 1
              and 'PP-LEGACY-2026' in legacy_page.locator('.order').inner_text(),
              'A legacy order without an edition remains visible in account history')
        with legacy_page.expect_download() as legacy_download:
            legacy_page.locator('[data-download]').click()
        legacy_pdf = ARTIFACTS / 'legacy-2026-ticket.pdf'
        legacy_download.value.save_as(str(legacy_pdf))
        with fitz.open(legacy_pdf) as document:
            legacy_pdf_text = document[0].get_text()
            check('2. 8. 2026' in legacy_pdf_text and f'2. 8. {current_edition}' not in legacy_pdf_text,
                  'A legacy order PDF keeps its original 2026 validity')
        legacy_page.goto(BASE + 'tickets.html')
        legacy_page.locator('#ticket-scope').select_option('day')
        for day in ['d1', 'd2', 'd3']:
            legacy_page.locator('#ticket-day').select_option(day)
            check(legacy_page.locator('[data-seat="B1"]').is_enabled(),
                  f'A legacy 2026 order does not reserve the same seat for the current edition on {day}')
        legacy_context.close()
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

        check(page.locator('#export-data, #import-data, #backup-status, [data-print], .backup-panel').count() == 0,
              'Signing in again does not restore removed backup or print controls')

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
        page.locator('#buyer-phone').fill('+420 777 123 456')
        page.locator('#consent').check()
        page.evaluate("""() => {
          const id = JSON.parse(localStorage.getItem('pulse:auth')).id;
          const key = 'pulse:cart:' + id;
          const cart = JSON.parse(localStorage.getItem(key));
          cart.push({day:'d1', seat:'B4', price:590, category:'vip', scope:'day'});
          localStorage.setItem(key, JSON.stringify(cart));
        }""")
        page.locator('#checkout-submit').click()
        check('Košík se mezitím změnil' in page.locator('#checkout-error').inner_text(),
              'A changed local cart requires review before checkout')
        check(page.locator('[data-remove]').count() == 2 and page.locator('#consent').is_checked(),
              'Cart review rerenders the new selection and preserves form state')
        page.evaluate("""() => {
          const orders = JSON.parse(localStorage.getItem('pulse:orders'));
          orders.push({id:'external', edition:Number(window.FESTIVAL_DATA.festival.dates[0].date.slice(0,4)), tickets:[{day:'d1',seat:'B3',price:590,category:'vip',scope:'day'}]});
          localStorage.setItem('pulse:orders', JSON.stringify(orders));
        }""")
        page.locator('#checkout-submit').click()
        check('není dostupné' in page.locator('#checkout-error').inner_text(), 'Checkout rechecks local seat availability')
        check(not errors, 'No JavaScript runtime errors: ' + str(errors))
        check(not external_requests, 'All assets, purchases and PDF generation work without external network requests')

        # Exercise the purchase form through its public UI in a fresh browser state.
        purchase_context = browser.new_context(accept_downloads=True)
        purchase_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Unexpected external request</p>'))
        purchase = purchase_context.new_page()
        purchase_errors = []
        purchase.on('pageerror', lambda error: purchase_errors.append(str(error)))
        purchase.goto(BASE + 'index.html')
        purchase.locator('#cookie-reject').click()
        purchase.locator('.home-package-vip .package-buy').click()
        purchase.wait_for_url('**/tickets.html?**')
        check(purchase.locator('#quick-category').input_value() == 'vip'
              and purchase.locator('#quick-scope').input_value() == 'festival',
              'A homepage VIP purchase preselects the full-festival category in the order flow')
        purchase.locator('#quick-quantity').fill('9')
        purchase.locator('#quick-buy').click()
        check(purchase.locator('#quick-quantity').evaluate('(input)=>!input.checkValidity()')
              and purchase.evaluate("!localStorage.getItem('pulse:cart:guest')"),
              'The group selector rejects quantities above eight without adding partial tickets')
        purchase.locator('#quick-quantity').fill('2')
        purchase.locator('#quick-buy').click()
        purchase.wait_for_url('**/cart.html')
        quick_cart = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        check(len(quick_cart) == 2 and len({ticket['seat'] for ticket in quick_cart}) == 2
              and all(ticket['scope'] == 'festival' and ticket['category'] == 'vip' for ticket in quick_cart),
              'Quick purchase assigns distinct free VIP places for both people on all three days')

        def purchase_amount(selector):
            return int(''.join(c for c in purchase.locator(selector).inner_text() if c.isdigit()))

        check(purchase_amount('#order-subtotal') == 3180 and purchase_amount('#order-total') == 3180,
              'Checkout initially totals both catalogue prices without additional fees')
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        for invalid in ['NOTVALID', '__proto__', '<img src=x onerror=alert(1)>']:
            purchase.locator('#promo-code').fill(invalid)
            purchase.locator('#apply-promo').click()
            check(purchase_amount('#order-total') == 3180
                  and purchase.locator('#discount-row').is_hidden()
                  and bool(purchase.locator('#promo-message').inner_text()),
                  f'Invalid promo input leaves the total unchanged: {invalid}')
        check(purchase.locator('img[src="x"]').count() == 0, 'Promo input cannot inject executable markup')
        purchase.locator('#checkout-submit').click()
        check('Promo kód neplatí' in purchase.locator('#checkout-error').inner_text()
              and purchase.evaluate("!localStorage.getItem('pulse:orders')"),
              'An invalid promo code cannot be submitted as a discounted order')
        purchase.locator('#promo-code').fill('  pulse10  ')
        purchase.locator('#checkout-submit').click()
        check('potvrď promo kód' in purchase.locator('#checkout-error').inner_text(),
              'A typed known promotion must be applied before the order can be completed')
        purchase.locator('#apply-promo').click()
        check(purchase.locator('#promo-code').input_value() == 'PULSE10'
              and purchase_amount('#order-discount') == 318 and purchase_amount('#order-total') == 2862,
              'The percentage promotion normalizes case and whitespace and applies exactly ten percent')
        purchase.locator('[data-remove]').first.click()
        check(purchase_amount('#order-subtotal') == 1590 and purchase_amount('#order-discount') == 159
              and purchase_amount('#order-total') == 1431
              and purchase.locator('#buyer-surname').input_value() == 'Černá',
              'Removing a ticket recalculates the applied promotion and preserves contact details')
        purchase.reload()
        check(purchase.locator('#promo-code').input_value() == 'PULSE10'
              and purchase_amount('#order-discount') == 159 and purchase_amount('#order-total') == 1431,
              'An applied known promotion survives reload and is recalculated from the cart')
        purchase.evaluate("localStorage.setItem('pulse:promo:cart:guest',JSON.stringify({code:'PULSE10',discount:999999,total:1}))")
        purchase.reload()
        check(purchase_amount('#order-discount') == 159 and purchase_amount('#order-total') == 1431,
              'Tampered stored promotion amounts cannot override the catalogue calculation')
        purchase.evaluate("localStorage.setItem('pulse:promo:cart:guest',JSON.stringify({code:'UNKNOWN',discount:1590,total:0}))")
        purchase.reload()
        check(purchase.locator('#promo-code').input_value() == ''
              and purchase.locator('#discount-row').is_hidden() and purchase_amount('#order-total') == 1590,
              'A stale or unknown stored promotion is ignored instead of restoring a fabricated discount')
        purchase.locator('#promo-code').fill('PRAHA200')
        purchase.locator('#apply-promo').click()
        check(purchase_amount('#order-discount') == 200 and purchase_amount('#order-total') == 1390,
              'The fixed promotion subtracts exactly 200 Kč')
        methods = purchase.locator('#payment-method option').evaluate_all('(options)=>options.map(option=>option.value)')
        check(set(methods) == {'card', 'banktransfer', 'cash', 'applepay', 'googlepay', 'benefitplus', 'invoice'},
              'Checkout offers all seven requested simulated payment methods')
        fill_buyer(purchase, phone='123abcdef')
        purchase.locator('#consent').check()
        purchase.locator('#checkout-submit').click()
        check('telefonní' in purchase.locator('#checkout-error').inner_text()
              and purchase.locator('[data-remove]').count() == 1,
              'A malformed phone number cannot complete or consume the selected ticket')
        purchase.locator('#buyer-phone').fill('+420 777 123 456')
        purchase.locator('#payment-method').select_option('googlepay')
        check('Google Pay' in purchase.locator('#checkout-submit').inner_text()
              and '1\u00a0390' in purchase.locator('#checkout-submit').inner_text(),
              'The payment action displays the selected method and final discounted amount')
        purchase.locator('#checkout-submit').click()
        promo_order = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        check(promo_order['name'] == 'Žofie Černá' and promo_order['firstName'] == 'Žofie'
              and promo_order['lastName'] == 'Černá' and promo_order['phone'] == '+420 777 123 456'
              and promo_order['paymentMethod'] == 'googlepay',
              'The completed order records the full contact details and simulated payment method')
        check({key: promo_order[key] for key in ['subtotal','discount','total','promoCode']}
              == {'subtotal':1590,'discount':200,'total':1390,'promoCode':'PRAHA200'}
              and promo_order['tickets'][0]['price'] == 1590,
              'The order records gross ticket prices separately from the discount and final total')
        with purchase.expect_download() as promo_download:
            purchase.locator('[data-download]').click()
        promo_pdf = ARTIFACTS / 'discounted-ticket.pdf'
        promo_download.value.save_as(str(promo_pdf))
        validate_pdf(promo_pdf, promo_order, festival_dates)

        purchase.goto(BASE + 'tickets.html?category=vip&scope=festival')
        purchase.locator('#quick-quantity').fill('2')
        purchase.locator('#quick-buy').click()
        purchase.wait_for_url('**/cart.html')
        after_purchase = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        sold_seat = promo_order['tickets'][0]['seat']
        check(len(after_purchase) == 2 and all(ticket['seat'] != sold_seat for ticket in after_purchase),
              'Group purchase excludes a seat occupied by an earlier full-festival order')
        purchase.goto(BASE + 'tickets.html?category=vip&scope=festival')
        purchase.locator('#quick-quantity').fill('2')
        purchase.locator('#quick-buy').click()
        purchase.wait_for_url('**/cart.html')
        four = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        check(len(four) == 4 and len({ticket['seat'] for ticket in four}) == 4,
              'A second group purchase avoids seats already present in the same cart')
        purchase.goto(BASE + 'tickets.html?category=standing&scope=day&day=d3')
        check(purchase.locator('#quick-category').input_value() == 'standing'
              and purchase.locator('#quick-scope').input_value() == 'day'
              and purchase.locator('#quick-day').input_value() == 'd3',
              'One-day purchase links preselect the requested category and festival day')
        purchase.locator('#quick-quantity').fill('8')
        purchase.locator('#quick-buy').click()
        purchase.wait_for_url('**/cart.html')
        mixed = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        standing = [ticket for ticket in mixed if ticket['category'] == 'standing']
        check(len(standing) == 8 and all(ticket['day'] == 'd3' and ticket['scope'] == 'day' for ticket in standing)
              and len({ticket['seat'] for ticket in standing}) == 8,
              'The maximum group size allocates eight distinct standing places for the selected day')
        # Leave only one free VIP seat while asking for two: the entire request must fail.
        purchase.evaluate("""edition => {
            const reserved=[...'AB'].flatMap(row=>Array.from({length:8},(_,i)=>({day:'d1',seat:row+(i+1),category:'vip',price:1590,scope:'festival',days:['d1','d2','d3']}))).slice(0,15);
            localStorage.setItem('pulse:orders',JSON.stringify([{id:'capacity',edition,tickets:reserved}]));
            localStorage.setItem('pulse:cart:guest','[]');
        }""", current_edition)
        purchase.goto(BASE + 'tickets.html?category=vip&scope=festival')
        purchase.locator('#quick-quantity').fill('2')
        purchase.locator('#quick-buy').click()
        check('dost volných míst' in purchase.locator('#quick-error').inner_text()
              and purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest')).length === 0"),
              'Insufficient group capacity adds no partial selection or duplicate seats')
        purchase.goto(BASE + 'tickets.html?category=standing&scope=day&day=d2')
        purchase.locator('#quick-quantity').fill('1')
        purchase.locator('#quick-buy').click()
        purchase.wait_for_url('**/cart.html')
        purchase.locator('#promo-code').fill('PRAHA200')
        purchase.locator('#apply-promo').click()
        check(purchase_amount('#order-subtotal') == 190 and purchase_amount('#order-discount') == 190
              and purchase_amount('#order-total') == 0,
              'A fixed promotion is capped at the cart subtotal and never creates a negative charge')
        check(not purchase_errors, 'Promotions, contact validation and group purchases produce no runtime errors')
        purchase_context.close()

        go('info.html')
        credits = page.evaluate('window.PulsePhotoCredits')
        venue_credit = credits['venue']
        credit_links = page.locator('#credits a').evaluate_all('(links)=>links.map(link=>link.href)')
        check(bool(venue_credit['author']) and venue_credit['source'] in credit_links
              and venue_credit['licenseUrl'] in credit_links,
              'The venue photograph exposes its author, source and licence links in practical information')
        page.locator('#credits details summary').click()
        for name in ['David Guetta', 'Katy Perry', 'Skrillex']:
            entry = page.locator('#credits li').filter(has_text=name)
            check(entry.count() == 1 and entry.is_visible() and entry.locator('a[href^="https://"]').count() >= 2,
                  f'Photo attribution for {name} exposes both a source and a licence link')
        check(page.locator('#map-container iframe').count() == 0,
              'Rejecting optional storage keeps Google Maps unembedded')
        check(page.locator('#load-map').count() == 0, 'Map has no extra manual loading step')
        check(not external_requests, 'Rejecting external maps prevents all third-party map requests')
        check(page.locator('#cookie-banner').count() == 0, 'The saved privacy decision survives navigation')

        privacy_context = browser.new_context()
        privacy_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Map test fixture</p>'))
        privacy_page = privacy_context.new_page()
        map_requests = []
        privacy_errors = []
        privacy_page.on('pageerror', lambda error: privacy_errors.append(str(error)))
        privacy_page.on('request', lambda request: map_requests.append(request.url)
                        if request.url.startswith('https://') else None)
        privacy_page.goto(BASE + 'info.html')
        check(privacy_page.locator('#cookie-banner').is_visible()
              and privacy_page.locator('#map-container iframe').count() == 0 and not map_requests,
              'A fresh information-page visit waits for a privacy decision before contacting Google')
        privacy_page.locator('#cookie-accept-all').click()
        privacy_page.wait_for_selector('#map-container iframe')
        check('google.com/maps' in privacy_page.locator('#map-container iframe').get_attribute('src')
              and len(map_requests) == 1, 'Accepting all immediately loads the Google Maps iframe')
        privacy_page.reload()
        privacy_page.wait_for_selector('#map-container iframe')
        check(privacy_page.locator('#cookie-banner').count() == 0 and len(map_requests) == 2,
              'Accepted maps load automatically on later visits without another loading button')
        privacy_page.locator('#footer [data-cookie-settings]').click()
        check(privacy_page.locator('#cookie-external-maps').is_checked(), 'Privacy settings reflect the saved map consent')
        privacy_page.locator('#cookie-external-maps').uncheck()
        privacy_page.locator('#cookie-save').click()
        check(privacy_page.locator('#map-container iframe').count() == 0,
              'Revoking external-map consent unloads the iframe immediately')
        privacy_page.reload()
        check(privacy_page.locator('#map-container iframe').count() == 0 and len(map_requests) == 2,
              'Revoked consent prevents map requests on subsequent visits')
        switch_language(privacy_page, 'en')
        privacy_page.locator('#footer [data-cookie-settings]').click()
        check('Privacy settings' in privacy_page.locator('#cookie-panel').text_content()
              and 'External Google Maps' in privacy_page.locator('#cookie-panel').text_content(),
              'Privacy settings and map permission are translated into English')
        check(not privacy_errors, 'Privacy settings, consent and map updates produce no JavaScript errors')
        privacy_context.close()

        reject_context = browser.new_context()
        reject_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Unexpected external request</p>'))
        reject_page = reject_context.new_page()
        reject_page.goto(BASE + 'info.html')
        reject_page.locator('#cookie-reject').click()
        check(reject_page.locator('#cookie-banner').count() == 0
              and reject_page.locator('#map-container iframe').count() == 0
              and reject_page.evaluate('window.PulsePrivacy.getPreferences().externalMaps === false'),
              'The banner necessary-only action rejects external maps directly')
        reject_context.close()

        reduced = browser.new_context(reduced_motion='reduce')
        reduced_page = reduced.new_page()
        reduced_page.goto(BASE + 'index.html')
        check(reduced_page.locator('#hero-film, #film-toggle').count() == 0,
              'Reduced-motion visitors receive the same static venue hero without autoplay')
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
