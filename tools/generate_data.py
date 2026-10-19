"""Export the canonical XML catalogue for inspection and offline browser use.

Run ``python tools/generate_data.py`` after editing data/festival.xml. This
optional authoring tool uses only Python's standard library; the published web
already contains its data and does not run Python or request JSON over HTTP.
"""
from __future__ import annotations

import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
XML = ROOT / 'data/festival.xml'
JSON_DIR = ROOT / 'data/json'
COLLECTIONS = ('festival', 'venues', 'performers', 'events')


def text(node: ET.Element, path: str, default: str | None = None) -> str:
    value = node.findtext(path)
    if value is None:
        if default is not None:
            return default
        raise ValueError(f'Missing XML value: {node.tag}/{path}')
    return value


def build_model(source: ET.Element) -> dict:
    """Resolve XML IDs once; keep those IDs in all browser-facing objects."""
    venues = []
    for node in source.findall('haly/hala'):
        ticketing = node.find('vstupenky_sceny')
        if ticketing is None:
            raise ValueError(f'Missing ticket configuration: {node.attrib["id"]}')
        venues.append({
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'location': text(node, 'lokace'),
            'capacity': int(text(node, 'velikost')),
            'description': text(node, 'popis'),
            'ticketing': {
                'standingCapacity': int(text(ticketing, 'kapacita_stani')),
                'seats': {
                    sector.attrib['kategorie']: {
                        'rows': [row.text for row in sector.findall('rada')],
                        'perRow': int(sector.attrib['mist_v_rade']),
                    }
                    for sector in ticketing.findall('sedadla/sektor')
                },
                'prices': {
                    price.attrib['kategorie']: {
                        'day': int(price.attrib['den']),
                        'festival': int(price.attrib['festival']),
                    }
                    for price in ticketing.findall('cenik/cena')
                },
            },
        })

    performers = []
    for node in source.findall('interpreti/interpret'):
        performers.append({
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'performerType': text(node, 'typ_interpreta'),
            'genre': text(node, 'zanr'),
            'description': text(node, 'popis'),
            'links': [{
                'platform': link.attrib['platforma'],
                'label': text(link, 'nazev'),
                'url': text(link, 'url'),
                'kind': link.attrib['druh'],
                'source': text(link, 'zdroj'),
            } for link in node.findall('odkazy/odkaz')],
        })

    venue_by_id = {venue['id']: venue for venue in venues}
    performer_by_id = {performer['id']: performer for performer in performers}
    events = []
    for node in source.findall('sumakce/akce'):
        venue_id = text(node, 'hala_ref')
        performer_ids = [ref.text for ref in node.findall('interpreti/interpret_ref')]
        # A broken reference must fail export instead of producing a link to an
        # unrelated artist, scene or ticket selection in the website.
        events.append({
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'theme': text(node, 'tema_akce'),
            'description': text(node, 'popis_akce', 'Bez popisu akce.'),
            'date': text(node, 'datumstart'),
            'startTime': text(node, 'casstart'),
            'endTime': text(node, 'caskonec'),
            'highlight': text(node, 'hlavni_vystoupeni', 'false') in ('true', '1'),
            'dayId': text(node, 'den_ref'),
            'venueId': venue_id,
            'venueName': venue_by_id[venue_id]['name'],
            'performerIds': performer_ids,
            'performers': [performer_by_id[pid]['name'] for pid in performer_ids],
        })

    camping = source.find('kempovani')
    if camping is None:
        raise ValueError('Missing camping configuration')
    festival = {
        'id': source.attrib['id'],
        'name': text(source, 'nazev'),
        'description': text(source, 'popis_festivalu', 'Popis festivalu není uveden.'),
        'taxRate': int(text(source, 'sazba_dph')),
        'location': {
            'street': text(source, 'mistokonani/ulice'),
            'city': text(source, 'mistokonani/mesto'),
            'postalCode': text(source, 'mistokonani/psc'),
        },
        'dates': [{
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'theme': text(node, 'tema_dne'),
            'description': text(node, 'popis', 'Bez doplňujícího popisu.'),
            'date': text(node, 'datumstart'),
            'startTime': text(node, 'casstart'),
            'endTime': text(node, 'caskonec'),
        } for node in source.findall('dny/den')],
        'tickets': [{
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'price': int(text(node, 'cena')),
            'currency': text(node, 'mena'),
            'description': text(node, 'popis'),
        } for node in source.findall('vstupenky/vstupenka')],
        'camping': {
            'personPrice': int(text(camping, 'cena_osoby')),
            'vatRate': int(text(camping, 'sazba_dph')),
            'dates': {'from': text(camping, 'datum_od'), 'to': text(camping, 'datum_do')},
            'types': [{
                'id': node.attrib['id'],
                'name': text(node, 'nazev'),
                'price': int(text(node, 'cena')),
                'maxPeople': int(text(node, 'max_osob')),
                'capacity': int(text(node, 'kapacita')),
            } for node in camping.findall('typy/typ')],
        },
        'links': [{
            'id': node.attrib['id'],
            'name': text(node, 'nazev'),
            'url': text(node, 'url'),
        } for node in source.findall('odkazy/odkaz')],
        'contact': {'email': text(source, 'kontakt/email'), 'phone': text(source, 'kontakt/telefon')},
    }
    # Preserve the established runtime shape and ordering for existing pages.
    return {'festival': festival, 'events': events, 'venues': venues, 'performers': performers}


def load_model() -> dict:
    return build_model(ET.parse(XML).getroot())


def json_exports(data: dict | None = None) -> dict[str, str]:
    """The four complete, readable JSON files are exports, never a second source."""
    data = load_model() if data is None else data
    return {f'{name}.json': json.dumps(data[name], ensure_ascii=False, indent=2) + '\n'
            for name in COLLECTIONS}


def generate(data: dict | None = None) -> str:
    data = load_model() if data is None else data
    return ('/* Odvozeno z data/festival.xml; shodné exporty v data/json/. */\n'
            'window.FESTIVAL_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n')


def main() -> None:
    data = load_model()
    JSON_DIR.mkdir(parents=True, exist_ok=True)
    for filename, content in json_exports(data).items():
        (JSON_DIR / filename).write_text(content, encoding='utf-8')
    (ROOT / 'web/js/data.js').write_text(generate(data), encoding='utf-8')
    # The Moodle package has its own adjacent XSD; both root copies must match.
    (ROOT / 'data.xml').write_bytes(XML.read_bytes())
    (ROOT / 'festival.xsd').write_bytes((ROOT / 'data/festival.xsd').read_bytes())


if __name__ == '__main__':
    main()
