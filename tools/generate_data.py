"""Optional maintenance tool. The checked-in web/js/data.js runs without a build."""
import json
from pathlib import Path
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
def generate():
    source=ET.parse(ROOT/'data/festival.xml').getroot()
    data={'festival':json.loads((ROOT/'API/json/festival.json').read_text()),
          'events':json.loads((ROOT/'API/json/events.json').read_text())['items'],
          'venues':json.loads((ROOT/'API/json/venues.json').read_text())['items'],
          'performers':[]}
    for node in source.findall('.//interpret'):
        data['performers'].append(dict(id=node.attrib['id'],name=node.findtext('nazev'),performerType=node.findtext('typ_interpreta'),genre=node.findtext('zanr'),description=node.findtext('popis'),links=[dict(platform=link.attrib['platforma'],label=link.findtext('nazev'),url=link.findtext('url'),kind=link.attrib['druh'],source=link.findtext('zdroj')) for link in node.findall('odkazy/odkaz')]))
    return '/* Odvozeno z data/festival.xml a API/json; bez síťových požadavků. */\nwindow.FESTIVAL_DATA = '+json.dumps(data,ensure_ascii=False)+';\n'
if __name__=='__main__':
    (ROOT/'web/js/data.js').write_text(generate(),encoding='utf-8')
