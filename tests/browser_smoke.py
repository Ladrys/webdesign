"""Development-only browser checks. Runtime has no Python or package dependencies."""
from pathlib import Path
from playwright.sync_api import sync_playwright, Error
BASE='http://127.0.0.1:8000/web/'
ROOT=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(accept_downloads=True)
 page=context.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 def go(name):
  page.goto(BASE+name);page.wait_for_load_state('load')
 def check(condition,message):
  assert condition,message
  print('PASS',message)
 go('index.html')
 check(page.locator('h1').inner_text().startswith('Tři dny.'),'Home initialized')
 for width in [320,375,430,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for route in ['index.html','program.html','performers.html','venues.html','info.html','search.html?q=Neon','tickets.html','cart.html','account.html']:
   go(route)
   check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'),f'No horizontal overflow {width}px {route}')
 page.set_viewport_size({'width':1440,'height':1000})
 go('search.html?q=neon');check(page.locator('#search-count').inner_text().startswith('25 '),'Contains search covers 12 artists plus 13 events')
 page.locator('#query').fill('<script>alert(1)</script>');check(page.locator('#search-results').inner_text().startswith('Nic jsme'),'Search handles markup as text')
 page.locator('#query').fill('vstupenky');check('0 výsledků' not in page.locator('#search-count').inner_text(),'Search includes practical information')
 go('performers.html');check(page.locator('#artists article').count()==60,'All 60 performers loaded')
 page.locator('#artist-q').fill('Lunar Whisper');check(page.locator('#artists article').count()==1,'Last performer searchable')
 page.locator('[data-artist]').click();check(page.locator('dialog').is_visible(),'Artist detail opens');page.keyboard.press('Escape')
 go('program.html');check(page.locator('#events article').count()==60,'All 60 events loaded');page.locator('[data-fav]').first.click();page.locator('#only-favorites').check();check(page.locator('#events article').count()==1,'Favorites filter')
 page.reload();page.locator('#only-favorites').check();check(page.locator('#events article').count()==1,'Favorites persist')
 go('tickets.html');check(page.locator('[data-seat="A3"]').is_disabled(),'Occupied seat disabled');page.locator('[data-seat="A1"]').click();page.locator('[data-seat="C1"]').click();page.locator('#standing').click();check('1\u00a0170' in page.locator('#selection').inner_text(),'VIP Regular standing prices total 1170');page.locator('#add-cart').click();check('Košík (3)' in page.locator('nav').inner_text(),'Cart counter updates')
 go('cart.html');page.set_viewport_size({'width':320,'height':800});check(page.evaluate('document.documentElement.scrollWidth <= innerWidth'),'Filled checkout fits 320px');page.set_viewport_size({'width':1440,'height':1000});check(page.locator('[data-remove]').count()==3,'Cart persists navigation');page.locator('[data-remove]').nth(1).click();check(page.locator('[data-remove]').count()==2,'Cart removal rerenders');page.locator('#buyer-name').fill('Demo Host');page.locator('#buyer-email').fill('host@example.test');page.locator('#consent').check();page.locator('#payment').select_option('declined');page.locator('#checkout button').click();check('zamítnuta' in page.locator('#checkout-error').inner_text(),'Declined payment preserves cart');page.locator('#payment').select_option('success');page.locator('#checkout button').click();check(page.locator('.ticket-paper').count()==2,'Guest checkout creates two tickets');check('host@example.test' in page.locator('.order').inner_text(),'Guest email retained')
 with page.expect_download() as dl:page.locator('[data-download]').click()
 check(dl.value.suggested_filename.endswith('.txt'),'Ticket download available')
 go('tickets.html');check(page.locator('[data-seat="A1"]').is_disabled(),'Purchased seat becomes occupied')
 page.locator('[data-seat="A2"]').click();page.locator('#add-cart').click()
 go('account.html?next=cart');page.locator('#register-tab').click();page.locator('#auth-name').fill('Demo Tester');page.locator('#auth-email').fill('tester@example.test');page.locator('#auth-password').fill('UniqueDemo123!');page.locator('#auth-submit').click();page.wait_for_url('**/cart.html');check(page.locator('[data-remove]').count()==1,'Guest cart transfers after registration');check(page.locator('#buyer-email').input_value()=='tester@example.test','Account email prefilled');page.locator('#consent').check();page.locator('#checkout button').click();check(page.locator('.ticket-paper').count()==1,'Registered checkout succeeds')
 go('account.html');check(page.locator('.order').count()==1,'Account sees only its own order');page.locator('#logout').click();page.wait_for_selector('#auth-email');page.locator('#auth-email').fill('tester@example.test');page.locator('#auth-password').fill('WrongPassword!');page.locator('#auth-submit').click();page.wait_for_function("document.querySelector('#auth-error').textContent.length > 0");check('Nesprávný' in page.locator('#auth-error').inner_text(),'Wrong password rejected');page.locator('#auth-password').fill('UniqueDemo123!');page.locator('#auth-submit').click();page.wait_for_selector('#logout');check(page.locator('.order').count()==1,'Login restores order history')
 stored=page.evaluate("JSON.parse(localStorage.getItem('pulse:users'))[0]");check('password' not in stored and len(stored['hash'])==64,'Password stored as salted PBKDF2 hash')
 page.screenshot(path='/tmp/prague-pulse-desktop.png',full_page=True)
 go('index.html');page.screenshot(path='/tmp/prague-pulse-home.png',full_page=True);page.set_viewport_size({'width':375,'height':812});page.locator('.menu-toggle').click();check(page.locator('#navigation').is_visible(),'Mobile menu opens');page.locator('.menu-toggle').click();page.screenshot(path='/tmp/prague-pulse-mobile.png',full_page=True);page.set_viewport_size({'width':1440,'height':1000})
 # Cross-tab conflict after selection, before checkout.
 go('tickets.html');page.locator('[data-seat="B1"]').click();page.locator('#add-cart').click();go('cart.html');page.locator('#consent').check()
 page.evaluate("""() => { const orders=JSON.parse(localStorage.getItem('pulse:orders')); orders.push({id:'external',tickets:[{day:'d1',seat:'B1',price:590,category:'vip'}]}); localStorage.setItem('pulse:orders',JSON.stringify(orders)); }""")
 page.locator('#checkout button').click();check('není dostupné' in page.locator('#checkout-error').inner_text(),'Checkout rechecks availability')
 check(not errors,'No JavaScript runtime errors: '+str(errors))
 # file:// workflow in a fresh context: no fetch, backend or installation.
 file_context=browser.new_context();fp=file_context.new_page()
 try:
  fp.goto((ROOT/'web/index.html').as_uri());check(fp.locator('h1').inner_text().startswith('Tři dny.'),'Direct file opening works')
  fp.goto((ROOT/'web/program.html').as_uri());check(fp.locator('#events article').count()==60,'Program works from file URL')
 except Error as error:
  if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(error):raise
  print('SKIP file:// browser policy ERR_BLOCKED_BY_ADMINISTRATOR; static HTTP checks passed')
 finally:
  file_context.close();browser.close()
