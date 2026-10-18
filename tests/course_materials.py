"""Validate generated Moodle artifacts and actual prototype scenarios (development only)."""
from pathlib import Path
from threading import Thread
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import argparse,json,os,zipfile,re
import fitz
from pptx import Presentation
from playwright.sync_api import sync_playwright
parser=argparse.ArgumentParser();parser.add_argument('--folder',type=Path,default=Path('odevzdani'));args=parser.parse_args();root=args.folder.resolve()
checks=[]
def check(ok,label):
 assert ok,label
 checks.append(label);print('PASS',label)
for folder in sorted(root.glob('cviceni-*')):
 pdf=fitz.open(folder/'prezentace.pdf');ppt=Presentation(folder/'prezentace.pptx')
 check(len(pdf)==6 and len(ppt.slides)==6,folder.name+': six PDF pages and editable PPTX slides')
 for i,(page,slide) in enumerate(zip(pdf,ppt.slides),1):
  check(bool(page.get_text().strip()) and bool(slide.notes_slide.notes_text_frame.text.strip()),folder.name+f': slide{i} text and presenter notes')
  # Inspect the produced files: neither export may silently clip slide text or
  # lose a paragraph while the other format still appears correct.
  spans=[span for block in page.get_text('dict')['blocks'] if 'lines' in block for line in block['lines'] for span in line['spans']]
  check(all(-.5<=s['bbox'][0] and -.5<=s['bbox'][1] and s['bbox'][2]<=page.rect.width+.5 and s['bbox'][3]<=page.rect.height+.5 for s in spans),folder.name+f': slide{i} PDF text stays inside page')
  ppt_text=' '.join(shape.text for shape in slide.shapes if shape.has_text_frame)
  compact=lambda text:re.sub(r'\s+','',text)
  check(compact(page.get_text())==compact(ppt_text),folder.name+f': slide{i} PDF/PPTX visible text agrees')
 check('PULSE' in pdf[0].get_text() and '2027' in pdf[0].get_text(),folder.name+': Prague Pulse 2027 identity')
 check(all(name in pdf[0].get_text() and name in ppt.core_properties.author for name in ['Michal Ladra','Matěj Mlejnek','Jan Martínek']),folder.name+': all three authors in cover and metadata')
 check((folder/'presenter-notes.md').is_file(),folder.name+': separate presenter notes')
 with zipfile.ZipFile(folder/'prezentace.pptx') as archive:check(archive.testzip() is None,folder.name+': PowerPoint archive integrity')
 pdf.close()
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/cviceni-03-prototyp/prototype/index.html'
try:
 with sync_playwright() as p:
  # Prefer an explicit browser or the cloud image; use Playwright's bundled
  # Chromium on computers without /usr/bin/chromium, including Windows/macOS.
  chromium_path=os.environ.get('CHROMIUM_PATH')
  if not chromium_path and Path('/usr/bin/chromium').is_file():chromium_path='/usr/bin/chromium'
  launch_options={'args':['--no-sandbox']}
  if chromium_path:launch_options['executable_path']=chromium_path
  browser=p.chromium.launch(**launch_options);page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  for width in [320,768,1440]:
   page.set_viewport_size({'width':width,'height':900});page.goto(base)
   for view in ['home','program','performers','venues','info']:
    page.goto(base+'#'+view);check(page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Prototype fits{width}px/{view}')
  page.goto(base+'#program');check(page.locator('#program-list article').count()==60,'Prototype loads60program items');page.locator('#day').select_option('d1');page.locator('#venue').select_option('h1');check(page.locator('#program-list article').count()==page.evaluate("FESTIVAL_DATA.events.filter(e=>e.dayId==='d1'&&e.venueId==='h1').length"),'Prototype combines day and stage filters');page.locator('[data-event]').first.click();page.locator('#only-saved').check();check(page.locator('#program-list article').count()==1,'Prototype scenarioS1 saved program');page.reload();page.locator('#only-saved').check();check(page.locator('#program-list article').count()==1,'Prototype favorites persist after reload')
  page.goto(base+'#performers');check(page.locator('main article').count()==60,'Prototype loads60artists');artist_name=page.evaluate('FESTIVAL_DATA.performers.find(p=>p.id==="i8").name');artist=page.locator('main article').filter(has=page.locator('h3',has_text=artist_name));artist.locator('button').click();check(page.locator('dialog').is_visible(),'Prototype scenarioS2 artist detail opens');page.locator('dialog a').click();page.wait_for_selector('#program-list article');check(page.locator('#program-list article').count()>0,'Prototype artist links to related shows')
  page.locator('#query').fill('<script>alert(1)</script>');page.locator('#search-form button').click();page.wait_for_function("document.querySelector('main').textContent.includes('Nic jsme')");check('Nic jsme' in page.locator('main').inner_text(),'Prototype search treats markup as text');check(not errors,'Prototype has no runtime errors');browser.close()
finally:server.shutdown();server.server_close()
(root/'prototype-validation.md').write_text('# Ověření podkladů a prototypu\n\n'+str(len(checks))+' kontrol prošlo.\n\n'+'\n'.join('- '+c for c in checks)+'\n\nKontroly proběhly v Chromium přes vývojový statický server; přímý file:// protokol blokuje politika tohoto prostředí.\n')
print(f'{len(checks)} course/prototype checks passed.')
