"""Development checks; the delivered website needs no server or packages.

Run: python tests/browser_smoke.py
Development dependencies: Playwright, Chromium and PyMuPDF.
Optional QR decoding checks: zxing-cpp and NumPy.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from tempfile import gettempdir
from threading import Thread
from urllib.parse import quote
import json
import os
import unicodedata
from decimal import Decimal, ROUND_HALF_UP

import fitz
from playwright.sync_api import Error, sync_playwright
try:
    import numpy as np
    import zxingcpp
except ImportError:
    zxingcpp = None

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = Path(os.environ.get('PULSE_TEST_ARTIFACTS', str(Path(gettempdir()) / 'prague-pulse-checks')))
ARTIFACTS.mkdir(parents=True, exist_ok=True)
CHECKS = []


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def check(condition, message):
    assert condition, message
    CHECKS.append(message)
    print('PASS', message)


def money_token(value):
    amount = Decimal(str(value))
    rendered = str(int(amount)) if amount == amount.to_integral() else f'{amount:.2f}'.replace('.', ',')
    return rendered + 'Kč'


def check_pdf_qr(pdf_page, expected, label):
    qr_modules = [drawing for drawing in pdf_page.get_drawings()
                  if 0 < drawing['rect'].width < 6 and 0 < drawing['rect'].height < 6]
    check(len(qr_modules) > 50, label + ' contains vector QR modules')
    if zxingcpp is not None:
        pixmap = pdf_page.get_pixmap(matrix=fitz.Matrix(3, 3), alpha=False)
        raster = np.frombuffer(pixmap.samples, dtype=np.uint8).reshape(pixmap.height, pixmap.width, pixmap.n)
        codes = zxingcpp.read_barcodes(raster)
        check(len(codes) == 1, label + ' contains one readable QR code')
        check(codes[0].text == expected, label + ' QR contains the correct identifier')


def check_tax(order, label):
    gross = Decimal(str(order['total']))
    net = (gross / Decimal('1.12')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    tax = order['tax']
    check(tax['rate'] == 12 and Decimal(str(tax['gross'])) == gross
          and Decimal(str(tax['net'])) == net and Decimal(str(tax['vat'])) == gross-net,
          label + ' records twelve-percent VAT already included in the gross price, rounded to halers')


def validate_pdf(path, order, festival_dates):
    check(path.read_bytes().startswith(b'%PDF-'), 'Download is a genuine PDF document')
    has_camping = bool(order.get('camping'))
    with fitz.open(path) as document:
        check(len(document) == len(order['tickets']) + int(has_camping),
              'PDF has one page per ticket and one additional voucher when camping is included')
        for index, ticket in enumerate(order['tickets']):
            pdf_page = document[index]
            text = unicodedata.normalize('NFC', pdf_page.get_text())
            normalized = text.casefold()
            compact = ''.join(text.split())
            label = f'PDF ticket page {index + 1}'
            check(order['id'] in text, label + ' includes the order ID')
            check(order['name'] in text, label + ' preserves the Czech buyer name')
            place = 'Volná plocha' if ticket['category'] == 'standing' else ticket['seat']
            check(place in text, label + ' includes the correct place')
            category = {'vip': 'vip', 'regular': 'regular', 'standing': 'stání'}[ticket['category']]
            check(category in normalized, label + ' includes the category')
            check('prague' in normalized and 'pulse' in normalized and 'fest' in normalized,
                  label + ' uses the Prague Pulse Fest identity')
            if ticket.get('scope') == 'festival':
                first, last = festival_dates[0]['date'].split('-'), festival_dates[-1]['date'].split('-')
                period = f'{int(first[2])}.–{int(last[2])}. {int(last[1])}. {last[0]}'
                check(period in text and ('3 dny' in normalized or '3 days' in normalized),
                      label + ' includes the three-day validity')
            if ticket.get('scope') == 'multi':
                selected_dates = [next(day['date'] for day in festival_dates if day['id'] == id) for id in ticket['days']]
                dates = [date.split('-') for date in selected_dates]
                period = f'{int(dates[0][2])}.+{int(dates[1][2])}.{int(dates[1][1])}.{dates[1][0]}'
                check(period in compact and ('2 dny' in normalized or '2 days' in normalized),
                      label + ' lists both selected festival dates explicitly')
            check(money_token(ticket['price']) in compact, label + ' includes the ticket base price')
            if order.get('discount'):
                check(order['promoCode'] in text and all(money_token(order[key]) in compact for key in ['subtotal', 'discount', 'total']),
                      label + ' includes the order subtotal, discount and final total')
            if order.get('tax'):
                check(all(money_token(order['tax'][key]) in compact for key in ['net', 'vat']) and '12' in text,
                      label + ' includes the VAT-exclusive amount and included twelve-percent VAT')
            if has_camping:
                check(money_token(order['campingTotal']) in compact,
                      label + ' includes the separate camping amount in the order summary')
            check(pdf_page.rect.width > pdf_page.rect.height, label + ' uses a landscape layout')
            check(bool(pdf_page.get_fonts()), label + ' contains typography')
            check_pdf_qr(pdf_page, ticket.get('code') or f"{order['id']}-{index + 1}", label)
        if has_camping:
            voucher = document[-1]
            text = unicodedata.normalize('NFC', voucher.get_text())
            compact = ''.join(text.split())
            camping = order['camping']
            check(order['id'] in text and order['name'] in text and ('kemp' in text.casefold() or 'camp' in text.casefold()),
                  'The camping voucher includes its order, buyer and camping identity')
            check(str(camping['people']) in text and all(money_token(camping[key]) in compact for key in ['basePrice', 'personPrice', 'price']),
                  'The camping voucher includes the selected people and complete pitch price breakdown')
            check(all(money_token(order['tax'][key]) in compact for key in ['net', 'vat'])
                  and money_token(order['total']) in compact,
                  'The camping voucher includes the order total and the included VAT breakdown')
            check_pdf_qr(voucher, order['id'] + '-camp', 'The camping voucher')
            voucher.get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(ARTIFACTS / 'camping-voucher-preview.png')
        document[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(ARTIFACTS / 'ticket-preview.png')


server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
BASE = os.environ.get('PULSE_TEST_BASE', f'http://127.0.0.1:{server.server_port}/web/')
try:
    with sync_playwright() as playwright:
        # Use an explicitly selected browser, the cloud image's Chromium, or
        # Playwright's installed browser on Windows/macOS and other machines.
        chromium_path = os.environ.get('CHROMIUM_PATH')
        if not chromium_path and Path('/usr/bin/chromium').is_file():
            chromium_path = '/usr/bin/chromium'
        launch_options = {'args': ['--no-sandbox']}
        if chromium_path:
            launch_options['executable_path'] = chromium_path
        browser = playwright.chromium.launch(**launch_options)
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

        def booking(target, duration=3, category='vip', quantity=1, days=('d1',), seats=()):
            target.locator('#ticket-duration').select_option(str(duration))
            target.locator('#ticket-category').select_option(category)
            target.locator('#ticket-quantity').fill(str(quantity))
            if duration == 1:
                target.locator('#ticket-day').select_option(days[0])
            elif duration == 2:
                for value in ['d1', 'd2', 'd3']:
                    target.locator(f'#ticket-days input[value="{value}"]').set_checked(value in days)
            for seat in seats:
                target.locator(f'[data-seat="{seat}"]').click()

        def scope(value, day='d1', category='vip'):
            booking(page, 1 if value == 'day' else 3, category, days=(day,))

        def fill_buyer(target, first='Žofie', surname='Černá', email='host@example.test', phone='+420 777 123 456'):
            target.locator('#buyer-name').fill(first)
            target.locator('#buyer-surname').fill(surname)
            if target.locator('#buyer-email').is_editable():
                target.locator('#buyer-email').fill(email)
            target.locator('#buyer-phone').fill(phone)

        login_email = 'tester@example.test'

        def login(target, password='UniqueSchool123!'):
            target.locator('#auth-email').fill(login_email)
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
        check(' '.join(page.locator('[data-countdown-caption]').inner_text().split()) == 'FESTIVAL STARTUJE ZA',
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
        package_styles = page.locator('.home-package').evaluate_all('(cards)=>cards.map(card=>{const css=getComputedStyle(card);return css.backgroundColor+"|"+css.borderColor})')
        check(len(set(package_styles)) == 1, 'Homepage ticket categories share the same initial treatment before any selection')
        check(page.locator('.home-package .benefit.is-included svg').count() > 0
              and page.locator('.home-package .benefit.is-unavailable svg').count() > 0,
              'Ticket benefits distinguish included and unavailable options with visible symbols')
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
        check(page.locator('#footer a[href="privacy.html"], #footer a[href="terms.html"], #footer a[href="credits.html"]').count() == 3,
              'The footer links directly to dedicated privacy, terms and photo-credit pages')

        routes = ['index.html', 'program.html', 'performers.html', 'venues.html', 'info.html',
                  'search.html?q=' + quote(performer_names[0]), 'tickets.html', 'cart.html', 'account.html', news_links[0],
                  'privacy.html', 'terms.html', 'credits.html']
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
        check('public transport' in page.locator('#travel h2').inner_text().casefold()
              and 'visitor information' in page.locator('main h1').inner_text().casefold(),
              'Practical information has English headings and visitor content')
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
        uncropped = page.locator('#artists .artist-art').first.evaluate('(element)=>getComputedStyle(element).backgroundSize')
        check(uncropped == 'contain', 'Artist artwork keeps the entire photograph visible instead of cropping it')
        page.locator('#artist-q').fill(performer_names[-1])
        check(page.locator('#artists article').count() == 1, 'The last performer is searchable')
        page.locator('[data-artist]').click()
        check(page.locator('dialog').is_visible(), 'Artist detail opens')
        page.keyboard.press('Escape')
        check(not page.locator('dialog').is_visible(), 'Artist detail closes with Escape')

        go('program.html')
        check(page.locator('#events article').count() == 60, 'All 60 events load')
        stage_audit = page.evaluate('''() => {
            const D=window.FESTIVAL_DATA;
            const groups=Object.fromEntries(D.venues.map(v=>[v.id,D.events.filter(e=>e.venueId===v.id)]));
            let overlaps=false;
            for(const events of Object.values(groups))for(const day of D.festival.dates){
                const entries=events.filter(e=>e.dayId===day.id).sort((a,b)=>a.startTime.localeCompare(b.startTime));
                for(let i=1;i<entries.length;i++)if(entries[i-1].endTime>entries[i].startTime)overlaps=true;
            }
            const venueFor=id=>D.events.find(e=>e.performerIds.includes(id))?.venueId;
            return {counts:Object.values(groups).map(items=>items.length),overlaps,holy:D.performers.find(p=>p.id==='i53')?.name,
                skepsis:D.performers.find(p=>p.id==='i22')?.name,holyVenue:venueFor('i53'),skepsisVenue:venueFor('i22'),calinVenue:venueFor('i23')};
        }''')
        check(stage_audit['counts'] == [20,20,20] and not stage_audit['overlaps'],
              'Each stage has twenty performances with no overlapping sets on the same stage')
        check(''.join(stage_audit['holy'].split()).casefold() == 'holypriest' and stage_audit['skepsis'] == 'Skepsis'
              and stage_audit['holyVenue'] == 'h3' and stage_audit['skepsisVenue'] == 'h3' and stage_audit['calinVenue'] == 'h2',
              'Confirmed artist corrections and the international, Czech and club stage assignments match the requested programme')
        event_names_once = page.locator('#events article').evaluate_all('''nodes=>nodes.every(node=>{
            const artist=node.querySelector('[data-artist]')?.textContent.trim().toLocaleLowerCase();
            return !artist || node.innerText.toLocaleLowerCase().split(artist).length===2;
        })''')
        check(event_names_once, 'Each programme row states its artist once instead of repeating the name in multiple headings')

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
        check(page.locator('#quick-purchase, .package-grid, #add-cart').count() == 0,
              'Ticket purchase has one selection funnel without duplicated package or quick-purchase controls')
        check(page.locator('#booking-continue svg.cart-icon').count() == 1,
              'The booking action uses a recognizable cart icon')
        for day in ['d1', 'd2', 'd3']:
            scope('day', day, 'vip')
            vip_count = page.locator('#seat-map [data-seat]').count()
            check(vip_count == 16 and page.locator('#seat-map [data-seat]:disabled').count() == 0,
                  f'All sixteen VIP seats start available on {day}')
            scope('day', day, 'regular')
            check(page.locator('#seat-map [data-seat]').count() == 32
                  and page.locator('#seat-map [data-seat]:disabled').count() == 0,
                  f'All thirty-two Regular seats start available on {day}')
            scope('day', day, 'standing')
            check(not page.locator('.booking-seat-section').is_visible()
                  and '40' in page.locator('#booking-availability').inner_text(),
                  f'Standing shows forty available places without an unnecessary seat map on {day}')
        scope('day', 'd1', 'vip')
        check(page.locator('#booking-continue').is_disabled(), 'Seated tickets require an explicit seat choice')
        page.locator('[data-seat="A1"]').focus()
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'true', 'Space selects a focused seat')
        check(page.evaluate("document.activeElement.dataset.seat === 'A1'"), 'Seat selection retains keyboard focus')
        page.keyboard.press('Space')
        check(page.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'false', 'Space deselects a focused seat')
        scope('festival')
        page.locator('[data-seat="A1"]').click()
        page.locator('#booking-continue').click()
        page.wait_for_url('**/cart.html')
        go('tickets.html')
        booking(page, 3, 'regular', seats=('C1',))
        page.locator('#booking-continue').click()
        page.wait_for_url('**/cart.html')
        go('tickets.html')
        booking(page, 3, 'standing')
        page.locator('#booking-continue').click()
        page.wait_for_url('**/cart.html')
        check(page.locator('#navigation .cart-count').inner_text() == '3', 'Cart counter updates for the three selected categories')
        check(page.locator('#navigation a[href="cart.html"] svg.cart-icon').count() == 1,
              'Updating the cart counter preserves its navigation icon')
        check('3\u00a0070' in page.locator('#order-subtotal').inner_text(),
              'Three-day VIP, Regular and standing total 3070 Kč')

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
        check_tax(guest_order, 'Guest order')
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
            scope('day', day, 'standing')
            check('39' in page.locator('#booking-availability').inner_text(), f'Three-day purchase also reserves its standing place on {day}')
        scope('day', 'd2')
        page.locator('[data-seat="B1"]').click()
        page.locator('#booking-continue').click()
        go('account.html?next=cart')
        page.locator('#register-tab').click()
        page.locator('#auth-name').fill('Tester')
        page.locator('#auth-surname').fill('Nový')
        page.locator('#auth-phone').fill('+420 777 123 456')
        page.locator('#auth-email').fill('tester@example.test')
        page.locator('#auth-password').fill('UniqueSchool123!')
        page.locator('#auth-confirm').fill('DifferentPassword!')
        page.locator('#auth-submit').click()
        check(bool(page.locator('#auth-error').inner_text())
              and page.evaluate("!localStorage.getItem('pulse:users')"),
              'Registration rejects a password-confirmation mismatch without saving an account')
        page.locator('#auth-confirm').fill('UniqueSchool123!')
        page.locator('#auth-submit').click()
        page.wait_for_url('**/cart.html')
        check(page.locator('[data-remove]').count() == 1, 'Guest cart transfers after registration')
        check(page.locator('#buyer-name').input_value() == 'Tester'
              and page.locator('#buyer-surname').input_value() == 'Nový'
              and page.locator('#buyer-email').input_value() == 'tester@example.test'
              and page.locator('#buyer-phone').input_value() == '+420 777 123 456',
              'Registered first name, last name, email and phone prefill the order form')
        page.locator('#buyer-phone').fill('+420 777 123 456')
        page.locator('#consent').check()
        page.locator('#checkout-submit').click()
        check(page.locator('.ticket-paper').count() == 1, 'Registered checkout succeeds')
        registered_order = page.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        check_tax(registered_order, 'Registered order')

        go('tickets.html')
        scope('festival')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking blocks an overlapping full pass')
        scope('day', 'd1')
        check(page.locator('[data-seat="B1"]').is_enabled(), 'A single-day booking leaves other days available')
        scope('day', 'd2')
        check(page.locator('[data-seat="B1"]').is_disabled(), 'A single-day booking reserves its selected day')
        go('account.html')
        check(page.locator('.order').count() == 1, "Account history shows only that account's orders")
        check(page.locator('.profile-details').is_visible() and 'Tester Nový' in page.locator('.profile-details').inner_text()
              and '+420 777 123 456' in page.locator('.profile-details').inner_text(),
              'The account displays the registered full name, phone, email and creation information')
        page.locator('#profile-edit').click()
        page.locator('#profile-first-name').fill('Tester')
        page.locator('#profile-last-name').fill('Upravený')
        page.locator('#profile-email').fill('updated@example.test')
        page.locator('#profile-phone').fill('+420 777 222 333')
        page.locator('#profile-save').click()
        login_email = 'updated@example.test'
        check('Tester Upravený' in page.locator('.profile-details').inner_text()
              and 'updated@example.test' in page.locator('.profile-details').inner_text()
              and '+420 777 222 333' in page.locator('.profile-details').inner_text(),
              'Editing the account saves its full name, email and phone')
        check(registered_order['name'] in page.locator('.order').inner_text(),
              'Updating a profile preserves the original buyer details on existing orders')
        go('tickets.html')
        booking(page, 1, 'vip', days=('d3',), seats=('B2',))
        page.locator('#booking-continue').click()
        page.wait_for_url('**/cart.html')
        check(page.locator('#buyer-name').input_value() == 'Tester'
              and page.locator('#buyer-surname').input_value() == 'Upravený'
              and page.locator('#buyer-email').input_value() == 'updated@example.test'
              and page.locator('#buyer-phone').input_value() == '+420 777 222 333',
              'The updated profile prepopulates subsequent checkout contact fields')
        page.locator('[data-remove]').click()
        go('account.html')

        check(page.locator('#export-data, #import-data, #backup-status, [data-print], .backup-panel').count() == 0,
              'Account history has no JSON backup, import or print controls')
        legacy_context = browser.new_context(storage_state=context.storage_state(), accept_downloads=True)
        legacy_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Map test fixture</p>'))
        legacy_page = legacy_context.new_page()
        legacy_page.goto(BASE + 'account.html')
        legacy_page.evaluate('''() => {
            const users=JSON.parse(localStorage.getItem('pulse:users'));
            for(const user of users)for(const key of ['firstName','lastName','phone','createdAt'])delete user[key];
            localStorage.setItem('pulse:users',JSON.stringify(users));
        }''')
        legacy_page.reload()
        check(legacy_page.locator('#logout').is_visible() and 'Tester Upravený' in legacy_page.locator('.profile-details').inner_text(),
              'Accounts created before the expanded profile fields remain usable')
        legacy_order = {**registered_order, 'id': 'PP-LEGACY-2026', 'created': '2026-07-20T12:00:00Z'}
        legacy_order.pop('edition', None)
        legacy_order.pop('tax', None)
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
            check('DPH' not in legacy_pdf_text, 'A legacy PDF without tax data does not invent a retrospective VAT breakdown')
        legacy_page.goto(BASE + 'tickets.html')
        legacy_page.locator('#ticket-duration').select_option('1')
        legacy_page.locator('#ticket-category').select_option('vip')
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
        page.locator('#booking-continue').click()
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

        # Exercise the single purchase funnel, promotions, two-day validity and camping.
        purchase_context = browser.new_context(accept_downloads=True)
        purchase_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Unexpected external request</p>'))
        purchase = purchase_context.new_page()
        purchase_errors = []
        purchase.on('pageerror', lambda error: purchase_errors.append(str(error)))
        purchase.goto(BASE + 'index.html')
        purchase.locator('#cookie-reject').click()
        purchase.locator('.home-package-vip .package-buy').click()
        purchase.wait_for_url('**/tickets.html?**')
        check(purchase.locator('#ticket-category').input_value() == 'vip'
              and purchase.locator('#ticket-duration').input_value() == '3',
              'A homepage VIP action preselects a three-day VIP ticket in the single booking form')
        purchase.locator('#ticket-quantity').fill('9')
        check(purchase.locator('#ticket-quantity').evaluate('(input)=>!input.checkValidity()')
              and purchase.locator('#booking-continue').is_disabled()
              and purchase.evaluate("!localStorage.getItem('pulse:cart:guest')"),
              'The booking form rejects more than eight people without adding partial tickets')
        purchase.locator('#ticket-quantity').fill('2')
        check(purchase.locator('#booking-continue').is_disabled(), 'Two seated tickets are never allocated automatically')
        purchase.locator('[data-seat="A1"]').click()
        check(purchase.locator('#booking-continue').is_disabled(), 'Two people require two explicitly selected seats')
        purchase.locator('[data-seat="A2"]').click()
        check(purchase.locator('#booking-continue').is_enabled()
              and purchase.locator('#selection [data-unselect] svg.remove-ticket-icon').count() == 2,
              'Selecting the requested two seats enables checkout and exposes recognizable remove controls')
        purchase.locator('#selection [data-unselect="A1"]').click()
        check(purchase.locator('#booking-continue').is_disabled()
              and purchase.locator('[data-seat="A1"]').get_attribute('aria-pressed') == 'false',
              'Removing a selected seat updates the map and required seat count together')
        purchase.locator('[data-seat="A1"]').click()
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        chosen = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        check(len(chosen) == 2 and {ticket['seat'] for ticket in chosen} == {'A1','A2'}
              and all(ticket['scope'] == 'festival' and ticket['category'] == 'vip' for ticket in chosen),
              'The cart receives exactly the explicitly selected VIP seats for all three days')

        def purchase_amount(selector):
            return int(''.join(c for c in purchase.locator(selector).inner_text() if c.isdigit()))

        check(purchase_amount('#order-subtotal') == 3180 and purchase_amount('#order-total') == 3180,
              'Checkout initially totals both catalogue prices without additional fees or VAT added twice')
        check(not purchase.locator('#camping-enabled').is_checked() and purchase.locator('#order-camping-row').is_hidden(),
              'Camping starts as an optional, unselected addition')
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
              'A typed known promotion must be applied before completing the order')
        purchase.locator('#apply-promo').click()
        check(purchase.locator('#promo-code').input_value() == 'PULSE10'
              and purchase_amount('#order-discount') == 318 and purchase_amount('#order-total') == 2862,
              'The percentage promotion normalizes case and whitespace and applies exactly ten percent')
        purchase.locator('[data-remove]').first.click()
        check(purchase_amount('#order-subtotal') == 1590 and purchase_amount('#order-discount') == 159
              and purchase_amount('#order-total') == 1431
              and purchase.locator('#buyer-surname').input_value() == 'Černá',
              'Removing a ticket recalculates the promotion and preserves contact details')
        purchase.reload()
        check(purchase.locator('#promo-code').input_value() == 'PULSE10'
              and purchase_amount('#order-discount') == 159 and purchase_amount('#order-total') == 1431,
              'A known promotion survives reload and is recalculated from the cart')
        purchase.evaluate("localStorage.setItem('pulse:promo:cart:guest',JSON.stringify({code:'PULSE10',discount:999999,total:1}))")
        purchase.reload()
        check(purchase_amount('#order-discount') == 159 and purchase_amount('#order-total') == 1431,
              'Tampered stored amounts cannot override the catalogue promotion calculation')
        purchase.evaluate("localStorage.setItem('pulse:promo:cart:guest',JSON.stringify({code:'UNKNOWN',discount:1590,total:0}))")
        purchase.reload()
        check(purchase.locator('#promo-code').input_value() == ''
              and purchase.locator('#discount-row').is_hidden() and purchase_amount('#order-total') == 1590,
              'An unknown stored promotion cannot restore a fabricated discount')
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
              'A malformed phone number cannot consume the selected ticket')
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
              'The completed order records contact details and the simulated payment method')
        check({key: promo_order[key] for key in ['subtotal','discount','total','promoCode']}
              == {'subtotal':1590,'discount':200,'total':1390,'promoCode':'PRAHA200'}
              and promo_order['tickets'][0]['price'] == 1590,
              'The order keeps gross ticket prices separate from its discount and final total')
        check_tax(promo_order, 'Discounted ticket order')
        with purchase.expect_download() as promo_download:
            purchase.locator('[data-download]').click()
        promo_pdf = ARTIFACTS / 'discounted-ticket.pdf'
        promo_download.value.save_as(str(promo_pdf))
        validate_pdf(promo_pdf, promo_order, festival_dates)

        purchase.goto(BASE + 'tickets.html')
        matrix = {}
        for category, expected in {'vip':[590,1180,1590], 'regular':[390,780,990], 'standing':[190,380,490]}.items():
            prices = []
            for duration in [1,2,3]:
                booking(purchase, duration, category, days=('d1','d3'))
                prices.append(purchase_amount('#booking-unit-price'))
            matrix[category] = prices
        check(matrix == {'vip':[590,1180,1590], 'regular':[390,780,990], 'standing':[190,380,490]},
              'Every category displays the agreed one-, two- and three-day gross prices')
        booking(purchase, 3, 'vip', 2)
        sold_seat = promo_order['tickets'][0]['seat']
        check(purchase.locator(f'[data-seat="{sold_seat}"]').is_disabled(),
              'The seating map excludes a place occupied by an earlier full-festival order')
        purchase.locator('[data-seat="A3"]').click()
        purchase.locator('[data-seat="A4"]').click()
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        purchase.goto(BASE + 'tickets.html')
        booking(purchase, 3, 'vip', 2)
        check(purchase.locator('[data-seat="A3"]').is_disabled() and purchase.locator('[data-seat="A4"]').is_disabled(),
              'A later seat selection also excludes places already present in the same cart')
        purchase.locator('[data-seat="A5"]').click()
        purchase.locator('[data-seat="A6"]').click()
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        four = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        check(len(four) == 4 and len({ticket['seat'] for ticket in four}) == 4,
              'Repeated manual purchases retain four distinct selected seats')
        purchase.goto(BASE + 'tickets.html?category=standing&duration=1&day=d3')
        check(purchase.locator('#ticket-category').input_value() == 'standing'
              and purchase.locator('#ticket-duration').input_value() == '1'
              and purchase.locator('#ticket-day').input_value() == 'd3',
              'A one-day purchase link preselects its category and festival day')
        purchase.locator('#ticket-quantity').fill('8')
        check(not purchase.locator('.booking-seat-section').is_visible(),
              'Standing purchases proceed by quantity without a seat-map step')
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        mixed = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        standing = [ticket for ticket in mixed if ticket['category'] == 'standing']
        check(len(standing) == 8 and all(ticket['day'] == 'd3' and ticket['scope'] == 'day' for ticket in standing)
              and len({ticket['seat'] for ticket in standing}) == 8,
              'Standing quantity creates eight distinct capacity units on the requested day')
        purchase.evaluate("localStorage.setItem('pulse:cart:guest','[]')")
        purchase.goto(BASE + 'tickets.html')
        booking(purchase, 2, 'regular', days=('d1','d3'))
        purchase.locator('#ticket-days input[value="d2"]').check()
        check(purchase.locator('#booking-continue').is_disabled(),
              'A two-day pass cannot proceed with three selected dates')
        purchase.locator('#ticket-days input[value="d2"]').uncheck()
        purchase.locator('[data-seat="C2"]').click()
        purchase.locator('#ticket-category').select_option('vip')
        check(purchase.locator('#selection [data-unselect]').count() == 0 and purchase.locator('#booking-continue').is_disabled(),
              'Changing category clears the stale seat selection')
        booking(purchase, 2, 'regular', days=('d1','d3'))
        for day in ['d1','d3']:
            purchase.locator(f'#ticket-days input[value="{day}"]').uncheck()
        purchase.locator('#ticket-days input[value="d3"]').check()
        purchase.locator('#ticket-days input[value="d1"]').check()
        purchase.locator('[data-seat="C2"]').click()
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        two_day_cart = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:cart:guest'))")
        check(len(two_day_cart) == 1 and two_day_cart[0]['scope'] == 'multi'
              and two_day_cart[0]['day'] == 'd1' and two_day_cart[0]['days'] == ['d1','d3']
              and two_day_cart[0]['price'] == 780,
              'Nonconsecutive two-day choices are stored canonically with the correct two-day price')
        fill_buyer(purchase)
        purchase.locator('#promo-code').fill('PULSE10')
        purchase.locator('#apply-promo').click()
        purchase.locator('#consent').check()
        purchase.locator('#checkout-submit').click()
        multi_order = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        check(multi_order['subtotal'] == 780 and multi_order['discount'] == 78 and multi_order['total'] == 702,
              'The promotion uses the two-day ticket subtotal')
        check_tax(multi_order, 'Two-day order')
        with purchase.expect_download() as multi_download:
            purchase.locator('[data-download]').click()
        multi_pdf = ARTIFACTS / 'two-day-ticket.pdf'
        multi_download.value.save_as(str(multi_pdf))
        validate_pdf(multi_pdf, multi_order, festival_dates)
        purchase.goto(BASE + 'tickets.html')
        for day in ['d1','d2','d3']:
            booking(purchase, 1, 'regular', days=(day,))
            check(purchase.locator('[data-seat="C2"]').is_disabled() == (day in ['d1','d3']),
                  f'A two-day purchase reserves its selected dates and leaves the other day free: {day}')
        booking(purchase, 3, 'regular')
        check(purchase.locator('[data-seat="C2"]').is_disabled(), 'A two-day booking blocks an overlapping full pass')
        booking(purchase, 2, 'regular', days=('d1','d2'))
        check(purchase.locator('[data-seat="C2"]').is_disabled(), 'Any shared date blocks an overlapping two-day pass')
        purchase.evaluate("""() => {
            localStorage.setItem('pulse:cart:guest',JSON.stringify([
              {day:'d1',seat:'B1',category:'vip',price:1180,scope:'multi',days:['d1']},
              {day:'d1',seat:'B2',category:'vip',price:1770,scope:'multi',days:['d1','d2','d3']},
              {day:'d3',seat:'B3',category:'vip',price:1180,scope:'multi',days:['d1','d3']}
            ]));
        }""")
        purchase.goto(BASE + 'cart.html')
        check(purchase.locator('#checkout').count() == 0,
              'Malformed two-day stored tickets cannot become a bookable cart')
        purchase.evaluate("localStorage.setItem('pulse:cart:guest','[]')")
        purchase.goto(BASE + 'tickets.html?category=standing&duration=1&day=d2')
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        purchase.locator('#camping-enabled').check()
        purchase.locator('#camping-type').select_option('caravan')
        purchase.locator('#camping-people').fill('7')
        check(purchase.locator('#camping-people').evaluate('(input)=>!input.checkValidity()')
              and purchase.locator('#checkout-submit').is_disabled(),
              'A caravan cannot be booked above its six-person limit')
        purchase.locator('#camping-people').fill('6')
        check(purchase_amount('#order-camping') == 1750,
              'A caravan for six people costs 850 Kč plus six person charges of 150 Kč')
        purchase.locator('#camping-type').select_option('tent')
        purchase.locator('#camping-people').fill('2')
        purchase.locator('#promo-code').fill('PULSE10')
        purchase.locator('#apply-promo').click()
        check(purchase_amount('#order-subtotal') == 190 and purchase_amount('#order-discount') == 19
              and purchase_amount('#order-camping') == 650 and purchase_amount('#order-total') == 821,
              'The percentage promotion discounts tickets only and leaves the complete camping price unchanged')
        purchase.locator('#promo-code').fill('PRAHA200')
        purchase.locator('#apply-promo').click()
        check(purchase_amount('#order-discount') == 190 and purchase_amount('#order-total') == 650,
              'The fixed promotion is capped at the ticket subtotal and never discounts camping or creates a negative charge')
        check(purchase.locator('#buyer-name').input_value() == 'Žofie'
              and purchase.locator('#buyer-surname').input_value() == 'Černá'
              and purchase.locator('#buyer-phone').input_value() == '+420 777 123 456',
              'Changing camping and promotions preserves the buyer contact form')
        purchase.reload()
        check(purchase.locator('#camping-enabled').is_checked()
              and purchase.locator('#camping-type').input_value() == 'tent'
              and purchase.locator('#camping-people').input_value() == '2'
              and purchase_amount('#order-total') == 650,
              'The chosen camping pitch and person count survive reload with a recalculated total')
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        purchase.locator('#checkout-submit').click()
        camp_order = purchase.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).at(-1)")
        camp = camp_order['camping']
        check(camp['type'] == 'tent' and camp['people'] == 2 and camp['units'] == 1
              and camp['basePrice'] == 350 and camp['personPrice'] == 150 and camp['price'] == 650
              and camp['dates'] == {'from':'2027-08-01','to':'2027-08-04'}
              and camp_order['campingTotal'] == 650 and camp_order['total'] == 650,
              'A camping order records one pitch, its complete three-night validity and the independent camping amount')
        check_tax(camp_order, 'Ticket and camping order')
        with purchase.expect_download() as camp_download:
            purchase.locator('[data-download]').click()
        camp_pdf = ARTIFACTS / 'camping-and-ticket.pdf'
        camp_download.value.save_as(str(camp_pdf))
        validate_pdf(camp_pdf, camp_order, festival_dates)
        purchase.goto(BASE + 'tickets.html?category=standing&duration=1&day=d2')
        purchase.locator('#booking-continue').click()
        purchase.wait_for_url('**/cart.html')
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        purchase.locator('#camping-enabled').check()
        purchase.locator('#camping-people').fill('2')
        # Populate a stock fixture with unique seats; old editions do not consume current pitches.
        capacity_orders = purchase.evaluate("""edition => Array.from({length:40},(_,index)=>{
            const row='ABCDE'[Math.floor(index/8)],seat=row+(index%8+1),category=row<='B'?'vip':'regular',price=category==='vip'?590:390;
            return {id:'capacity-'+index,edition,created:'2027-06-01T12:00:00Z',tickets:[{day:'d1',days:['d1'],seat,category,price,scope:'day'}],camping:{type:'tent',people:2,basePrice:350,personPrice:150,price:650,units:1,dates:{from:'2027-08-01',to:'2027-08-04'}}};
        })""", current_edition)
        older_camping = [{**order, 'edition':2026,
                          'camping':{**order['camping'],'dates':{'from':'2026-08-01','to':'2026-08-04'}}}
                         for order in capacity_orders]
        purchase.evaluate('(orders)=>localStorage.setItem("pulse:orders",JSON.stringify(orders))', older_camping)
        purchase.reload()
        check('40' in purchase.locator('#camping-help').inner_text() and purchase.locator('#checkout-submit').is_enabled(),
              'Camping orders from an older edition do not consume current-year pitch capacity')
        purchase.evaluate('(orders)=>localStorage.setItem("pulse:orders",JSON.stringify(orders))', capacity_orders[:39])
        purchase.reload()
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        check('Volných míst: 1.' in purchase.locator('#camping-help').inner_text(),
              'The checkout reports the last remaining tent pitch')
        purchase.evaluate('(orders)=>localStorage.setItem("pulse:orders",JSON.stringify(orders))', capacity_orders)
        purchase.locator('#checkout-submit').click()
        check('vyprodaná' in purchase.locator('#checkout-error').inner_text()
              and purchase.evaluate("JSON.parse(localStorage.getItem('pulse:orders')).length") == 40,
              'Checkout rechecks tent capacity and cannot oversell a pitch occupied after the form loaded')
        purchase.evaluate("localStorage.setItem('pulse:orders','[]')")
        purchase.reload()
        fill_buyer(purchase)
        purchase.locator('#consent').check()
        purchase.evaluate("localStorage.setItem('pulse:camping:cart:guest',JSON.stringify({enabled:true,type:'caravan',people:3}))")
        purchase.locator('#checkout-submit').click()
        check('Výběr kempu se změnil' in purchase.locator('#checkout-error').inner_text()
              and purchase.locator('#camping-type').input_value() == 'caravan'
              and purchase.locator('#camping-people').input_value() == '3'
              and purchase.locator('#buyer-phone').input_value() == '+420 777 123 456'
              and purchase.locator('#consent').is_checked(),
              'A camping change from another tab requires review while preserving contact details and consent')
        purchase.locator('#camping-enabled').uncheck()
        check(purchase.locator('#order-camping-row').is_hidden() and purchase_amount('#order-total') == 190,
              'The customer can remove optional camping and continue with the ticket alone')
        check(not purchase_errors, 'Manual seats, promotions, two-day passes and camping produce no runtime errors')
        purchase_context.close()

        # Corrupt optional metadata must not erase otherwise valid ticket history or stock.
        damaged_context = browser.new_context(storage_state=context.storage_state(), accept_downloads=True)
        damaged_context.route('https://**', lambda route: route.fulfill(status=200, content_type='text/html', body='<p>Unexpected external request</p>'))
        damaged = damaged_context.new_page()
        damaged_errors = []
        damaged.on('pageerror', lambda error: damaged_errors.append(str(error)))
        damaged.goto(BASE + 'account.html')
        valid_camp = {'type':'tent','label':'Stan','people':2,'basePrice':350,'personPrice':150,
                      'price':650,'units':1,'dates':{'from':'2027-08-01','to':'2027-08-04'}}
        bad_camps = [
            {**valid_camp,'people':0,'price':350},
            {**valid_camp,'people':5,'price':1100},
            {**valid_camp,'personPrice':'Infinity','price':'Infinity'},
            {**valid_camp,'dates':{'from':'2028-08-01','to':'2027-08-04'}},
            {**valid_camp,'units':2},
        ]
        damaged_orders = []
        for index, camping in enumerate(bad_camps, 1):
            ticket = {**registered_order['tickets'][0], 'seat':'B'+str(index), 'code':'DAMAGED-'+str(index)}
            damaged_orders.append({**registered_order,'id':'PP-DAMAGED-'+str(index),'tickets':[ticket],
                                   'subtotal':590,'discount':0,'promoCode':'','camping':camping,
                                   'campingTotal':'NaN','total':1240,
                                   'tax':{'rate':12,'gross':1240,'net':'NaN','vat':-1}})
        damaged.evaluate('''orders => {
            localStorage.setItem('pulse:orders',JSON.stringify(orders));
            const id=JSON.parse(localStorage.getItem('pulse:auth')).id;
            localStorage.setItem('pulse:cart:'+id,'[]');
        }''', damaged_orders)
        damaged.reload()
        check(damaged.locator('.order').count() == 5 and damaged.locator('.order .camping-voucher').count() == 0
              and damaged.locator('.order .notice').count() == 5,
              'Malformed camping metadata preserves all ticket orders but never creates free camping vouchers')
        damaged_text = damaged.locator('main').inner_text()
        check('NaN' not in damaged_text and 'undefined' not in damaged_text and 'Infinity' not in damaged_text
              and 'DPH' not in damaged_text,
              'Nonfinite, negative and inconsistent optional financial metadata cannot produce invalid totals or invented VAT claims')
        with damaged.expect_download() as damaged_download:
            damaged.locator('[data-download]').first.click()
        damaged_pdf = ARTIFACTS / 'damaged-camping-ticket.pdf'
        damaged_download.value.save_as(str(damaged_pdf))
        with fitz.open(damaged_pdf) as document:
            text = unicodedata.normalize('NFC',document[0].get_text())
            check(len(document) == 1 and 'Údaje o kempu nejsou úplné.' in text
                  and money_token(1240) in ''.join(text.split()) and 'DPH' not in text and 'NaN' not in text,
                  'An incomplete-camping PDF keeps the original saved order total and valid ticket without inventing a voucher or tax')
            check_pdf_qr(document[0], 'DAMAGED-5', 'The preserved damaged-order ticket')
        damaged.goto(BASE + 'tickets.html?category=vip&duration=1&day=d2')
        check(all(damaged.locator(f'[data-seat="B{index}"]').is_disabled() for index in range(1,6)),
              'Invalid camping or tax fields do not release the valid ticket seats of existing orders')
        booking(damaged,1,'standing',days=('d3',))
        damaged.locator('#booking-continue').click()
        damaged.wait_for_url('**/cart.html')
        damaged.locator('#camping-enabled').check()
        check('Volných míst: 40.' in damaged.locator('#camping-help').inner_text(),
              'Invalid saved camping metadata does not consume current camping-pitch capacity')
        valid_camp_bad_tax = {**registered_order,'id':'PP-BAD-TAX','camping':valid_camp,
                              'campingTotal':650,'subtotal':590,'discount':0,'promoCode':'','total':1240,
                              'tax':{'rate':12,'gross':1240,'net':1107.14,'vat':-1}}
        damaged.evaluate('(order)=>localStorage.setItem("pulse:orders",JSON.stringify([order]))', valid_camp_bad_tax)
        damaged.goto(BASE + 'account.html')
        check(damaged.locator('.order .camping-voucher').count() == 1
              and 'DPH' not in damaged.locator('.order').inner_text()
              and 'NaN' not in damaged.locator('.order').inner_text(),
              'An invalid stored VAT breakdown does not erase an independently valid camping voucher')
        with damaged.expect_download() as tax_download:
            damaged.locator('[data-download]').click()
        tax_pdf = ARTIFACTS / 'damaged-tax-valid-camping.pdf'
        tax_download.value.save_as(str(tax_pdf))
        with fitz.open(tax_pdf) as document:
            check(len(document) == 2 and all('DPH' not in pdf_page.get_text() and 'NaN' not in pdf_page.get_text() for pdf_page in document),
                  'A valid camping PDF survives damaged VAT metadata without printing a fabricated tax breakdown')
            check_pdf_qr(document[0], registered_order['tickets'][0]['code'], 'The tax-damaged order ticket')
            check_pdf_qr(document[1], 'PP-BAD-TAX-camp', 'The tax-damaged order camping voucher')
        check(not damaged_errors, 'Damaged optional order metadata produces no JavaScript or PDF runtime errors')
        damaged_context.close()

        go('credits.html')
        credits = page.evaluate('window.PulsePhotoCredits')
        venue_credit = credits['venue']
        credit_links = page.locator('#credits a').evaluate_all('(links)=>links.map(link=>link.href)')
        check(bool(venue_credit['author']) and venue_credit['source'] in credit_links
              and venue_credit['licenseUrl'] in credit_links,
              'The venue photograph exposes its author, source and licence links on the credits page')
        for name in ['David Guetta', 'Katy Perry', 'Skrillex']:
            entry = page.locator('#credits .credits-list').last.locator('li').filter(has_text=name)
            check(entry.count() == 1 and entry.is_visible() and entry.locator('a[href^="https://"]').count() >= 2,
                  f'Photo attribution for {name} exposes both a source and a licence link')
        go('info.html')
        check(page.locator('#venue-plan').is_visible() and page.locator('#venue-plan svg').count() > 0,
              'Practical information includes an offline festival-site plan')
        check(all(page.locator(f'#plan-{venue}').get_attribute('href') == f'program.html?venue={venue}' for venue in ['h1','h2','h3']),
              'All three stages on the offline plan link directly to their stage programmes')
        plan = page.locator('#festival-plan-svg')
        original_view = plan.get_attribute('viewBox')
        page.locator('[data-plan-zoom="in"]').click()
        zoomed = [float(value) for value in plan.get_attribute('viewBox').split()]
        check(zoomed[2] < 1200 and zoomed[3] < 820, 'The offline venue plan can zoom in without a network request')
        plan.focus()
        page.keyboard.press('ArrowRight')
        moved = [float(value) for value in plan.get_attribute('viewBox').split()]
        check(moved[0] > zoomed[0], 'The zoomed venue plan can be panned using the keyboard')
        page.locator('[data-plan-reset]').click()
        check(plan.get_attribute('viewBox') == original_view, 'Reset restores the complete venue plan')
        check(page.locator('#privacy, #terms, #credits').count() == 0,
              'Visitor information keeps privacy, terms and full photo credits on their dedicated pages')

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
        # Iframe insertion precedes network dispatch. Observe the actual request
        # before checking its count, without depending on external frame content.
        with privacy_page.expect_request(lambda request: request.url.startswith('https://maps.google.com/maps?')):
            privacy_page.locator('#cookie-accept-all').click()
        privacy_page.wait_for_selector('#map-container iframe')
        check('google.com/maps' in privacy_page.locator('#map-container iframe').get_attribute('src')
              and len(map_requests) == 1, 'Accepting all immediately loads the Google Maps iframe')
        with privacy_page.expect_request(lambda request: request.url.startswith('https://maps.google.com/maps?')):
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
