"""Build reviewable Moodle folders and native PPTX/PDF presentations.

Optional maintainer utility only; the delivered site/prototype needs no Python,
package manager, build or server. Source narratives live in course-source/.
Run without --include-web while the current website is still being edited.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import shutil
import textwrap
import xml.etree.ElementTree as ET

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.util import Inches, Pt
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'course-source'
WIDTH, HEIGHT = 960, 540
INK, PAPER, ORANGE, MUTED = '#181817', '#f4f0e7', '#f45e2b', '#68635b'
FONT = 'Arial'  # common editable PowerPoint font; PDF embeds DejaVu for Czech glyphs
FONT_DIR = Path('/usr/share/fonts/truetype/dejavu')


def rgb(color: str) -> RGBColor:
    return RGBColor.from_string(color.removeprefix('#'))


def data_checks() -> tuple[dict, list[str]]:
    text = (ROOT / 'web/js/data.js').read_text(encoding='utf-8')
    data = json.loads(text[text.index('{'):].rstrip().removesuffix(';'))
    xml = ET.parse(ROOT / 'data.xml').getroot()
    checks = []
    for name, xpath, minimum in [('dny', './dny/den', 3), ('scény', './haly/hala', 3),
                                ('interpreti', './interpreti/interpret', 60),
                                ('vystoupení', './sumakce/akce', 60)]:
        nodes = xml.findall(xpath)
        assert len(nodes) >= minimum, f'Missing minimum {name}'
        assert len({node.attrib['id'] for node in nodes}) == len(nodes), f'Duplicate IDs {name}'
        checks.append(f'{len(nodes)} {name}; jedinečná ID')
    ids = {kind: {node.attrib['id'] for node in xml.findall(path)} for kind, path in
           [('day', './dny/den'), ('venue', './haly/hala'), ('artist', './interpreti/interpret')]}
    for event in xml.findall('./sumakce/akce'):
        assert event.findtext('den_ref') in ids['day']
        assert event.findtext('hala_ref') in ids['venue']
        assert all(node.text in ids['artist'] for node in event.findall('./interpreti/interpret_ref'))
    checks.append('Všechny XML reference dne, scény a interpreta existují.')
    assert data['festival']['name'] == xml.findtext('nazev')
    assert len(data['performers']) == len(ids['artist'])
    assert len(data['events']) == len(xml.findall('./sumakce/akce'))
    assert {item['id'] for item in data['venues']} == ids['venue']
    for event in data['events']:
        assert event['dayId'] in ids['day'] and event['venueId'] in ids['venue']
        assert all(item in ids['artist'] for item in event['performerIds'])
    checks.append('Přibalená data mají shodný název festivalu, počty a platné reference.')
    return data, checks


class Deck:
    """Render the same editable layout to a native PowerPoint and a PDF."""
    def __init__(self, target: Path, number: str, info: dict):
        self.target, self.number, self.info = target, number, info
        self.ppt = Presentation()
        self.ppt.slide_width, self.ppt.slide_height = Pt(WIDTH), Pt(HEIGHT)
        self.ppt.core_properties.title = f"Prague Rocks — cvičení {number}: {info['name']}"
        self.ppt.core_properties.subject = 'Dodatečně připravený milník podle zadání; nikoli doložená historie semestru.'
        self.ppt.core_properties.author = 'Prague Rocks Festival — projektové podklady'
        pdfmetrics.registerFont(TTFont('PRF-Regular', str(FONT_DIR / 'DejaVuSans.ttf')))
        pdfmetrics.registerFont(TTFont('PRF-Bold', str(FONT_DIR / 'DejaVuSans-Bold.ttf')))
        self.pdf = canvas.Canvas(str(target / 'prezentace.pdf'), pagesize=(WIDTH, HEIGHT))
        self.pdf.setTitle(self.ppt.core_properties.title)
        self.pdf.setAuthor('Prague Rocks Festival — projektové podklady')
        self.slide = None
        self.notes = []
        self.overflow = []

    def rect(self, x, y, w, h, color, border=None):
        shape = self.slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Pt(x), Pt(y), Pt(w), Pt(h))
        shape.fill.solid(); shape.fill.fore_color.rgb = rgb(color)
        if border:
            shape.line.color.rgb = rgb(border); shape.line.width = Pt(1.1)
        else:
            shape.line.fill.background()
        self.pdf.setFillColor(color)
        if border:
            self.pdf.setStrokeColor(border); self.pdf.setLineWidth(1.1)
        self.pdf.rect(x, HEIGHT-y-h, w, h, fill=1, stroke=bool(border))

    def text(self, x, y, w, text, size=20, color=INK, bold=False, h=None, spacing=1.24):
        font = 'PRF-Bold' if bold else 'PRF-Regular'
        lines = []
        for paragraph in text.split('\n'):
            lines.extend(simpleSplit(paragraph, font, size, w) if paragraph else [''])
        needed = max(1, len(lines)) * size * spacing + 5
        height = h or needed
        if needed > height + .1 or x+w > WIDTH+.1 or y+height > HEIGHT+.1:
            self.overflow.append((self.number, text[:45], needed, height))
        shape = self.slide.shapes.add_textbox(Pt(x), Pt(y), Pt(w), Pt(height))
        frame = shape.text_frame
        frame.margin_left = frame.margin_right = frame.margin_top = frame.margin_bottom = 0
        frame.word_wrap = False
        for index, line in enumerate(lines):
            paragraph = frame.paragraphs[0] if index == 0 else frame.add_paragraph()
            paragraph.text = line
            paragraph.font.name = FONT
            paragraph.font.size = Pt(size)
            paragraph.font.bold = bold
            paragraph.font.color.rgb = rgb(color)
            paragraph.space_after = Pt(0)
            paragraph.line_spacing = Pt(size * spacing)
        self.pdf.setFont(font, size); self.pdf.setFillColor(color)
        for index, line in enumerate(lines):
            self.pdf.drawString(x, HEIGHT-y-size-index*size*spacing, line)
        return needed

    def brand(self, x=42, y=24, scale=1.0, color=INK):
        self.text(x,y,150*scale,'PRAGUE',14*scale,color,True)
        self.text(x,y+15*scale,150*scale,'ROCKS',22*scale,color,True)
        self.text(x,y+40*scale,160*scale,'FESTIVAL / 2026',6.5*scale,color,True)
        self.rect(x+105*scale,y+5*scale,7*scale,34*scale,ORANGE if color==INK else PAPER)

    def footer(self, index, dark=False):
        color = PAPER if dark else MUTED
        label = 'METODICKÁ ŠABLONA — DOPLNIT CIZÍ PROJEKT' if self.number=='06' else 'DODATEČNĚ PŘIPRAVENÝ PODKLAD K MILNÍKU'
        self.text(42,505,790,label,7.5,color)
        self.text(862,500,65,f'{self.number} / {index:02}',10,color,True)

    def page(self, item, index):
        self.slide = self.ppt.slides.add_slide(self.ppt.slide_layouts[6])
        cover = item['layout']=='cover'
        bg = INK if cover else PAPER
        self.rect(0,0,WIDTH,HEIGHT,bg)
        self.notes.append(item['notes'])
        self.slide.notes_slide.notes_text_frame.text = item['notes']
        if cover:
            self.rect(697,0,263,HEIGHT,ORANGE)
            self.brand(42,30,1.3,PAPER)
            self.text(42,121,620,item['kicker'],11,PAPER,True)
            self.text(38,168,630,item['title'],55,PAPER,True,h=165,spacing=1.06)
            self.text(42,372,610,item['lead'],19,PAPER,h=87)
            self.text(726,70,210,'1—3',57,INK,True)
            self.text(726,139,210,'SRPEN',31,INK,True)
            self.text(726,177,210,'2026',42,INK,True)
            self.text(726,285,200,'PRAHA\nVLTAVA PARK',17,INK,True)
            self.text(726,398,200,f'CVIČENÍ\n{self.number}',26,INK,True)
        else:
            self.brand()
            self.text(440,42,478,item['kicker'],10,MUTED,True)
            self.rect(42,91,876,2,INK)
            self.text(40,112,880,item['title'],34,INK,True,h=85,spacing=1.1)
            layout = item['layout']
            if layout in ('cards','split'):
                cards = item['cards']; gap=18; width=(876-gap*(len(cards)-1))/len(cards)
                for index_card,(heading,body) in enumerate(cards):
                    x=42+index_card*(width+gap)
                    self.rect(x,218,width,205,INK if index_card==0 else '#e7e0d5')
                    fg=PAPER if index_card==0 else INK
                    self.rect(x,218,width,6,ORANGE)
                    self.text(x+17,239,width-34,heading,20,fg,True,h=54,spacing=1.1)
                    self.text(x+17,294,width-34,body,14.2,fg,h=119,spacing=1.19)
                if item.get('lead'):
                    self.text(42,447,876,item['lead'],13.2,MUTED,h=43,spacing=1.2)
            elif layout=='metrics':
                for i,(value,label) in enumerate(item['metrics']):
                    x=42+i*225
                    self.rect(x,220,201,165,ORANGE if i==0 else '#e7e0d5')
                    self.text(x+18,230,168,value,66,INK,True)
                    self.text(x+18,328,168,label,12,INK,True)
                self.text(42,417,876,item['lead'],18,INK,h=74)
            elif layout=='route':
                for i,(heading,body) in enumerate(item['steps']):
                    x=42+i*225
                    self.rect(x,232,201,139,INK if i==0 else '#e7e0d5')
                    fg=PAPER if i==0 else INK
                    self.text(x+15,249,168,f'0{i+1}',11,ORANGE,True)
                    self.text(x+15,281,168,heading,22,fg,True,h=35)
                    self.text(x+15,326,168,body,12,fg,h=32)
                    if i<3:
                        self.text(x+202,288,23,'›',21,INK,True)
                self.text(42,410,876,item['lead'],17,INK,h=80)
        self.footer(index,cover)
        self.pdf.showPage()

    def finish(self):
        assert not self.overflow, f'Presentation overflow: {self.overflow}'
        self.ppt.save(self.target / 'prezentace.pptx')
        self.pdf.save()
        notes = [f"# Cvičení {self.number} — poznámky k prezentaci",'',
                 self.info['name'],'',
                 'Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.',
                 'Text upravte podle skutečné práce a jmen členů týmu. Nevydávejte podklady za historický záznam.','']
        if self.number=='06':
            notes += ['**Nejde o dokončené peer review. Nejdříve doplňte cizí projekt a skutečné nálezy.**','']
        for i,(slide,note) in enumerate(zip(self.info['slides'],self.notes),1):
            notes += [f"## {i}. {slide['title'].replace(chr(10),' ')}",'',note,'']
        (self.target / 'presenter-notes.md').write_text('\n'.join(notes),encoding='utf-8')


def copy_file(source: Path, target: Path):
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,target)


def build(output: Path, include_web: bool):
    data, checks = data_checks()
    output = output.resolve()
    assert output != ROOT and ROOT not in output.parents[:0], 'Choose a separate output folder'
    marker = output / '.course-generated'
    if output.exists() and any(output.iterdir()) and not marker.exists():
        raise SystemExit(f'Output {output} is not an owned generated folder; choose an empty directory.')
    output.mkdir(parents=True,exist_ok=True)
    marker.write_text('Generated from course-source by tools/build_course_submissions.py\n')
    folder_names = {'02':'cviceni-02-specifikace','03':'cviceni-03-prototyp',
                    '04':'cviceni-04-implementace','05':'cviceni-05-review-ready',
                    '06':'cviceni-06-cross-review'}
    deck_source = json.loads((SOURCE / 'presentations.json').read_text(encoding='utf-8'))
    for number,name in folder_names.items():
        folder=output/name
        if folder.exists():shutil.rmtree(folder)
        folder.mkdir()
        info=deck_source[number]
        deck=Deck(folder,number,info)
        for i,item in enumerate(info['slides'],1):deck.page(item,i)
        deck.finish()
    c02=output/folder_names['02']; c03=output/folder_names['03']
    c04=output/folder_names['04']; c05=output/folder_names['05']; c06=output/folder_names['06']
    for folder in [c02,c05]:
        copy_file(ROOT/'project-specification.md',folder/'project-specification.md')
        copy_file(ROOT/'data.xml',folder/'data.xml')
        if (ROOT/'data/festival.xsd').exists():copy_file(ROOT/'data/festival.xsd',folder/'festival.xsd')
    for source,target in [('c03-progress-02.md',c03/'progress-02.md'),
                          ('c04-progress-03.md',c04/'progress-03.md'),
                          ('c05-progress-04.md',c05/'progress-04.md'),
                          ('c06-review-template.md',c06/'review.md')]:
        copy_file(SOURCE/source,target)
    prototype=c03/'prototype'
    shutil.copytree(SOURCE/'prototype',prototype,dirs_exist_ok=True)
    copy_file(ROOT/'web/js/data.js',prototype/'data.js')
    if (SOURCE/'prototype-validation.md').exists():
        copy_file(SOURCE/'prototype-validation.md',c03/'prototype-validation.md')
    if include_web:
        for folder in [c04,c05]:
            shutil.copytree(ROOT/'web',folder/'web')
            for name in ['documentation.md','validation_report.md']:
                if (ROOT/name).exists():copy_file(ROOT/name,folder/name)
        final=output/'finalni-projekt'
        if final.exists():shutil.rmtree(final)
        project=final/'projekt';project.mkdir(parents=True)
        for name in ['project-specification.md','documentation.md','data.xml','validation_report.md']:
            if (ROOT/name).exists():copy_file(ROOT/name,project/name)
        if (ROOT/'data/festival.xsd').exists():copy_file(ROOT/'data/festival.xsd',project/'festival.xsd')
        shutil.copytree(ROOT/'web',project/'web')
        shutil.copytree(prototype,project/'prototype')
        if (ROOT/'review/received-review.md').exists():copy_file(ROOT/'review/received-review.md',project/'review/received-review.md')
        else:
            (project/'review').mkdir()
            (project/'review/received-review.md').write_text('# Přijaté cross-review\n\nSkutečné hodnocení jiným týmem nebylo poskytnuto. Doplnit po provedení.\n',encoding='utf-8')
        if (ROOT/'review/internal-review.md').exists():copy_file(ROOT/'review/internal-review.md',project/'review/internal-review.md')
        (final/'README.md').write_text('# Finální projekt\n\nSložka `projekt/` odpovídá povinné struktuře zadání. Otevřete `projekt/web/index.html`.\n\nPřed odevzdáním doplňte skutečné přijaté review, týmovou historii a potvrzení rozsahu změn.\n',encoding='utf-8')
    (output/'data-validation.md').write_text('# Kontrola dat při sestavení podkladů\n\n'+
        '\n'.join('- '+item for item in checks)+'\n\nKontrola se spouští při každém sestavení. Nejde o HTML validaci ani UX audit.\n',encoding='utf-8')
    readme = '''# Prague Rocks Festival — podklady pro Moodle

Každá složka cvičení má vlastní PPTX, PDF a `presenter-notes.md` pro 3–5 minut.
PPTX obsahuje editovatelný text a poznámky přednášejícího. PDF má stejnou grafiku.
Web a prototyp spustíte otevřením příslušného `index.html` bez instalace.

| Složka | Obsah odpovídající zadání |
| --- | --- |
| cviceni-02-specifikace | Specifikace, XML data, prezentace |
| cviceni-03-prototyp | Spustitelný interaktivní wireframe, progress-02, prezentace |
| cviceni-04-implementace | Současný web, progress-03, prezentace |
| cviceni-05-review-ready | Současný web, specifikace, data, progress-04, prezentace |
| cviceni-06-cross-review | Metodická šablona review a prezentace — nutno doplnit skutečný cizí projekt |
| finalni-projekt/projekt | Předepsaná finální struktura, pokud byl builder spuštěn s --include-web |

## Co je připraveno dodatečně

Balíčky jsou **rekonstruované ukázky milníků vytvořené nyní podle zadání**,
nikoli důkaz dřívějšího odevzdání, termínů, konzultací nebo práce konkrétních členů.
Cvičení 04 a 05 úmyslně používají stejnou současnou verzi. Cvičení 03 má nově
sestavený redukovaný interaktivní prototyp. Nepředkládejte je jako falešnou historii.

## Co musí ještě dodat tým

1. Skutečný přidělený projekt a jeho specifikaci pro cvičení 06. Metodika je připravená,
   ale skutečné nálezy nelze vytvořit bez hodnoceného webu. Šablona není hotové peer review.
2. Přijaté cross-review do `review/received-review.md` a skutečná rozhodnutí v dokumentaci.
3. Jména a reálnou spolupráci členů, časovou osu a případné historické prezentace.
4. Odsouhlasení přejmenování a výraznějšího redesignu vůči původní specifikaci
   Prague Pulse Fest; limit změn cca 15 % nelze potvrdit bez schválených prvních výstupů.

## Pravdivé ověření a AI

Aktuální testy hotového webu jsou ve `validation_report.md` u příslušného balíčku,
prototypové testy u cvičení 03 a datové kontroly v `data-validation.md`. Počty
a výsledky nepřenášejte na jinou verzi bez opakování testu. AI pomohla s texty,
implementací, grafikou i těmito podklady; metody a omezení jsou výslovně popsané.

Před prezentací odevzdejte všechny soubory, které budete ukazovat. PPTX/PDF
se podle zadání také nahrává před cvičením. Prezentace 06 je zatím pouze příprava.
'''
    if not include_web:
        readme += '\n**Pracovní export:** současný web nebyl kopírován. Úplný export vyžaduje `--include-web`.\n'
    (output/'README.md').write_text(readme,encoding='utf-8')
    files=[]
    for path in sorted(output.rglob('*')):
        if path.is_file() and path.name not in {'.course-generated','manifest.json'}:
            files.append({'path':str(path.relative_to(output)), 'bytes':path.stat().st_size,
                          'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    (output/'manifest.json').write_text(json.dumps({'complete_web_copies':include_web,'files':files},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Built {len(files)} files in {output}; website copies: {include_web}')
    return output


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=ROOT/'odevzdani')
    parser.add_argument('--include-web',action='store_true')
    args=parser.parse_args()
    build(args.output,args.include_web)
