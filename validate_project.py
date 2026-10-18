from pathlib import Path
from collections import Counter
from datetime import datetime, timedelta
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

def validate_festival_model():
    """Check real visitor promises beyond the structural XML/JSON schemas."""
    festival = json.loads((API / 'json/festival.json').read_text(encoding='utf-8'))
    venues = json.loads((API / 'json/venues.json').read_text(encoding='utf-8'))['items']
    # The API example deliberately paginates performers (20 of 60); count the
    # complete source catalogue rather than treating its first page as all data.
    performers = etree.parse(str(XML)).findall('.//interpret')
    events = json.loads((API / 'json/events.json').read_text(encoding='utf-8'))['items']
    days = {day['id']: day for day in festival['dates']}
    venue_ids = {venue['id'] for venue in venues}
    performer_ids = {performer.get('id') for performer in performers}
    assert len(days) == 3 and venue_ids == {'h1', 'h2', 'h3'}
    assert len(performer_ids) == len(performers) == len(events) == 60
    assert len({event['id'] for event in events}) == len(events)
    assert Counter(event['dayId'] for event in events) == {day: 20 for day in days}
    assert Counter(event['venueId'] for event in events) == {venue: 20 for venue in venue_ids}
    assert Counter(performer for event in events for performer in event['performerIds']) == {
        performer: 1 for performer in performer_ids}
    for event in events:
        assert event['dayId'] in days and event['venueId'] in venue_ids
        assert event['date'] == days[event['dayId']]['date']
        assert set(event['performerIds']) <= performer_ids
    ok('60 jednoznačně provázaných vystoupení: 20 za den, 20 na scénu, každý interpret právě jednou')

    def at(event, key):
        return datetime.fromisoformat(event['date'] + 'T' + event[key])

    highlights = [event for event in events if event.get('highlight') is True]
    assert len(highlights) == 9
    closing_times = {'h2': ('18:30:00', '19:30:00'), 'h3': ('20:00:00', '21:00:00'),
                     'h1': ('21:30:00', '23:00:00')}
    for day_id, day in days.items():
        closing = sorted((event for event in highlights if event['dayId'] == day_id), key=lambda event: event['startTime'])
        assert [event['venueId'] for event in closing] == ['h2', 'h3', 'h1']
        for event in closing:
            assert (event['startTime'], event['endTime']) == closing_times[event['venueId']]
        assert all(at(later, 'startTime') - at(earlier, 'endTime') >= timedelta(minutes=30)
                   for earlier, later in zip(closing, closing[1:]))
        for venue_id in venue_ids:
            group = sorted((event for event in events if event['dayId'] == day_id and event['venueId'] == venue_id),
                           key=lambda event: event['startTime'])
            assert group[-1] in closing
            assert all(at(later, 'startTime') - at(earlier, 'endTime') >= timedelta(minutes=30)
                       for earlier, later in zip(group, group[1:]))
            for event in group:
                expected_minutes = 90 if event.get('highlight') and venue_id == 'h1' else 60
                assert at(event, 'endTime') - at(event, 'startTime') == timedelta(minutes=expected_minutes)
                assert day['startTime'] <= event['startTime'] < event['endTime'] <= day['endTime']
    ok('Plné 60/90minutové sety, 30 minut technické přestavby a devět postupných večerních highlightů s přesuny')

    expected = {
        'h1': (5000, 4952, {'vip': {'day': 490, 'festival': 1290},
                          'regular': {'day': 290, 'festival': 790}, 'standing': {'day': 150, 'festival': 390}}),
        'h2': (3000, 3000, {'standing': {'day': 110, 'festival': 290}}),
        'h3': (1500, 1500, {'standing': {'day': 90, 'festival': 240}}),
    }
    for venue in venues:
        capacity, standing_capacity, prices = expected[venue['id']]
        ticketing = venue['ticketing']
        assert venue['capacity'] == capacity and ticketing['standingCapacity'] == standing_capacity
        assert ticketing['prices'] == prices
        seats = ticketing['seats']
        assert standing_capacity + sum(len(group['rows']) * group['perRow'] for group in seats.values()) == capacity
        if venue['id'] == 'h1':
            assert seats == {'vip': {'rows': ['A', 'B'], 'perRow': 8},
                             'regular': {'rows': ['C', 'D', 'E', 'F'], 'perRow': 8}}
        else:
            assert seats == {}, 'River a Club nemají nabízet sedadla'
    ok('Každá scéna má vlastní kapacitu, ceny a zóny; 48 sedadel je součástí kapacity Main Hall')

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

    validate_festival_model()

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


    required_web = ['index.html','program.html','performers.html','venues.html','info.html','search.html','tickets.html','cart.html','account.html','news.html','privacy.html','terms.html','credits.html']
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
                assert (html.parent/rel.split('?',1)[0]).is_file(),f'Chybí {rel}'
        assert 'API ověření' not in text
    assert not (ROOT/'web/api.html').exists()
    ok(f'{len(required_web)} stránek: metadata, struktura dokumentu, unikátní id a lokální závislosti')
    from tools.generate_data import generate
    assert generate()==(ROOT/'web/js/data.js').read_text(encoding='utf-8')
    assert (ROOT/'data.xml').read_bytes()==XML.read_bytes()
    assert (ROOT/'festival.xsd').read_bytes()==XSD.read_bytes()
    ok('Offline data.js je reprodukovatelný z datové základny; kořenové data.xml je shodné')
    ok('Funkční scénáře a responzivitu ověřuje tests/browser_smoke.py')

if __name__ == '__main__':
    main()
