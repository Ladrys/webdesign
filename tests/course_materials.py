"""Validate generated Moodle artifacts and actual prototype scenarios (development only)."""
from pathlib import Path
from threading import Thread
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import argparse,json,zipfile
import fitz
from pptx import Presentation
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--folder',type=Path,default=Path('/tmp/prague-rocks-course-preview'));args=parser.parse_args();root=args.folder.resolve()
checks=[]
def check(ok,label):
 assert ok,label
 checks.append(label);print('PASS',label)
for folder in sorted(root.glob('cviceni-*')):
 pdf=fitz.open(folder/'prezentace.pdf');ppt=Presentation(folder/'prezentace.pptx')
 check(len(pdf)==6 and len(ppt.slides)==6,folder.name+': six PDF pages and editable PPTX slides')
 for i,(page,slide) in enumerate(zip(pdf,ppt.slides),1):
  check(bool(page.get_text().strip()) and bool(slide.notes_slide.notes_text_frame.text.strip()),folder.name+f': slide{i} text and presenter notes')
 check('Prague' in pdf[0].get_text() or 'PRAGUE' in pdf[0].get_text(),folder.name+': festival identity')
 check((folder/'presenter-notes.md').is_file(),folder.name+': separate presenter notes')
 with zipfile.ZipFile(folder/'prezentace.pptx') as archive:check(archive.testzip() is None,folder.name+': PowerPoint archive integrity')
 pdf.close()
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/cviceni-03-prototyp/prototype/index.html'
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  for width in [320,768,1440]:
   page.set_viewport_size({'width':width,'height':900});page.goto(base)
   for view in ['home','program','performers','venues','info']:
    page.goto(base+'#'+view);check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Prototype fits{width}px/{view}')
  page.goto(base+'#program');check(page.locator('#program-list article').count()==60,'Prototype loads60program items');page.locator('#day').select_option('d1');page.locator('#venue').select_option('h1');check(page.locator('#program-list article').count()==7,'Prototype combines day and stage filters');page.locator('[data-event]').first.click();page.locator('#only-saved').check();check(page.locator('#program-list article').count()==1,'Prototype scenarioS1 saved program');page.reload();page.locator('#only-saved').check();check(page.locator('#program-list article').count()==1,'Prototype favorites persist after reload')
  page.goto(base+'#performers');check(page.locator('main article').count()==60,'Prototype loads60artists');artist=page.locator('main article').filter(has=page.locator('h3',has_text='Neon Wave'));artist.locator('button').click();check(page.locator('dialog').is_visible(),'Prototype scenarioS2 artist detail opens');page.locator('dialog a').click();check(page.locator('#program-list article').count()>0,'Prototype artist links to related shows')
  page.locator('#query').fill('<script>alert(1)</script>');page.locator('#search-form button').click();page.wait_for_function("document.querySelector('main').textContent.includes('Nic jsme')");check('Nic jsme' in page.locator('main').inner_text(),'Prototype search treats markup as text');check(not errors,'Prototype has no runtime errors');browser.close()
finally:server.shutdown();server.server_close()
(root/'prototype-validation.md').write_text('# Ověření podkladů a prototypu\n\n'+str(len(checks))+' kontrol prošlo.\n\n'+'\n'.join('- '+c for c in checks)+'\n\nKontroly proběhly v Chromium přes vývojový statický server; přímý file:// protokol blokuje politika tohoto prostředí.\n')
print(f'{len(checks)} course/prototype checks passed.')
