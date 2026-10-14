from pathlib import Path
from lxml import etree
import json
import yaml
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent
XML = ROOT / 'data' / 'festival.xml'
XSD = ROOT / 'data' / 'festival.xsd'
API = ROOT / 'API'

json_pairs = {
    'festival.json': 'festival.schema.json',
    'venues.json': 'venues.schema.json',
    'venue-h1.json': 'venue.schema.json',
    'performers.json': 'performers.schema.json',
    'performer-i1.json': 'performer.schema.json',
    'events.json': 'events.schema.json',
    'event-a1.json': 'event.schema.json',
}
xslt_pairs = {
    'festival-to-json.xslt': 'festival.json',
    'venues-to-json.xslt': 'venues.json',
    'venue-detail-to-json.xslt': 'venue-h1.json',
    'performers-to-json.xslt': 'performers.json',
    'performer-detail-to-json.xslt': 'performer-i1.json',
    'events-to-json.xslt': 'events.json',
    'event-detail-to-json.xslt': 'event-a1.json',
}

def ok(label):
    print(f'[OK] {label}')

def main():
    xml = etree.parse(str(XML))
    schema = etree.XMLSchema(etree.parse(str(XSD)))
    assert schema.validate(xml), schema.error_log
    ok('XML je validní proti data/festival.xsd')

    counts = {
        'dny': len(xml.findall('.//den')),
        'scény': len(xml.findall('.//hala')),
        'účinkující': len(xml.findall('.//interpret')),
        'akce': len(xml.findall('.//akce')),
    }
    assert counts['dny'] >= 3 and counts['scény'] >= 2 and counts['účinkující'] >= 60 and counts['akce'] >= 60
    ok(f"Počty dat splňují minimum: {counts}")

    for xslt_name, json_name in xslt_pairs.items():
        xslt_path = API / 'transformation' / xslt_name
        text = xslt_path.read_text(encoding='utf-8')
        assert '<xsl:if' in text and '<xsl:choose' in text
        result = str(etree.XSLT(etree.parse(str(xslt_path)))(xml))
        json.loads(result)
        assert json.loads(result) == json.loads((API / 'json' / json_name).read_text(encoding='utf-8'))
        ok(f'{xslt_name} generuje validní JSON shodný s API/json/{json_name}')

    for json_name, schema_name in json_pairs.items():
        data = json.loads((API / 'json' / json_name).read_text(encoding='utf-8'))
        schema_data = json.loads((API / 'json-schema' / schema_name).read_text(encoding='utf-8'))
        Draft202012Validator.check_schema(schema_data)
        Draft202012Validator(schema_data).validate(data)
        ok(f'API/json/{json_name} odpovídá API/json-schema/{schema_name}')

    openapi = yaml.safe_load((API / 'openapi.yaml').read_text(encoding='utf-8'))
    assert openapi.get('openapi', '').startswith('3.1')
    required_paths = ['/api/festival','/api/venues','/api/venues/{id}','/api/performers','/api/performers/{id}','/api/events','/api/events/{id}']
    for path in required_paths:
        assert path in openapi['paths']
        responses = openapi['paths'][path]['get']['responses']
        assert all(code in responses for code in ['200','400','404'])
    event_params = {p['name'] for p in openapi['paths']['/api/events']['get']['parameters']}
    assert {'day','venueId','performerId'} <= event_params
    performer_params = {p['name'] for p in openapi['paths']['/api/performers']['get']['parameters']}
    assert {'page','pageSize'} <= performer_params
    ok('OpenAPI 3.1 obsahuje požadované endpointy, filtry, stránkování a odpovědi 200/400/404')


    required_web = ['index.html','program.html','performers.html','venues.html','info.html','search.html','tickets.html','cart.html','account.html']
    from html.parser import HTMLParser
    class PageParser(HTMLParser):
        def __init__(self):
            super().__init__(); self.tags=[]; self.ids=[]
        def handle_starttag(self, tag, attrs):
            a=dict(attrs);self.tags.append((tag,a))
            if 'id' in a:self.ids.append(a['id'])
    for name in required_web:
        html=ROOT/'web'/name
        assert html.is_file(), f'Chybí {name}'
        text=html.read_text(encoding='utf-8');parser=PageParser();parser.feed(text)
        assert len(parser.ids)==len(set(parser.ids)),f'Duplicitní id v {name}'
        for tag in ['title','header','main','footer','noscript']:
            assert any(t==tag for t,a in parser.tags),f'{name}: chybí {tag}'
        for meta in ['description','viewport']:
            assert any(t=='meta' and a.get('name')==meta and a.get('content') for t,a in parser.tags)
        for tag,attrs in parser.tags:
            if tag=='script' and attrs.get('src') or tag=='link' and attrs.get('href'):
                rel=attrs.get('src') or attrs.get('href')
                assert (html.parent/rel).is_file(),f'Chybí {rel}'
        assert 'API ověření' not in text
    assert not (ROOT/'web/api.html').exists()
    ok('9 stránek: metadata, struktura dokumentu, unikátní id a lokální závislosti')
    from tools.generate_data import generate
    assert generate()==(ROOT/'web/js/data.js').read_text(encoding='utf-8')
    assert (ROOT/'data.xml').read_bytes()==XML.read_bytes()
    ok('Offline data.js je reprodukovatelný z datové základny; kořenové data.xml je shodné')
    ok('Funkční scénáře a responzivitu ověřuje tests/browser_smoke.py')

if __name__ == '__main__':
    main()
