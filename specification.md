# Prague Pulse Fest 2026 – propozice festivalu (specification.md)

## 1) Stručná identita festivalu
**Název festivalu:** Prague Pulse Fest  
**Ročník:** 1. ročník (2026)  
**Lokalita:** Praha – Areál Vltava Park (fiktivní festivalový areál v širším centru Prahy)  
**Datumový rozsah:** 1. 8. 2026 – 3. 8. 2026 (3 dny)

**Stručný popis:**  
Prague Pulse Fest je fiktivní městský hudební festival zaměřený na současné žánry a živé koncerty. Festival probíhá ve třídenním formátu a kombinuje několik scén (hal). Přes den nabízí kratší sety a doprovodný program, večer hlavní vystoupení a zakončení dne (afterparty).

---

## 2) Cílové publikum a charakter akce
**Cílové publikum:**  
- primárně 18–35 (studenti a mladí pracující),  
- sekundárně 35+ fanoušci koncertů a městské kultury,  
- návštěvníci z Prahy i mimo Prahu (víkendový výlet).

**Charakter akce:**  
- multižánrový hudební festival (Rock / Pop / Elektronika / Hip-hop / Jazz / Folk),  
- plynulý program po celý den (dopoledne–večer),  
- večerní bloky s „highlighty“ a závěrečnou afterparty.

**Témata jednotlivých dnů (koncept):**  
- **Den 1 (Opening Night):** zahájení festivalu + průřez žánry  
- **Den 2 (Main Stage Highlights):** hlavní festivalový den s největšími vystoupeními  
- **Den 3 (Finale & Afterparty):** finále festivalu a závěrečné sety  

---

## 3) Struktura webu (minimální obsah)
Web bude statický a bude sloužit jako obsahový základ (v dalším semestru naváže Webdesign). Stránky budou sémanticky strukturované a připravené tak, aby jejich obsah šel později napojit na API výstupy.

### Povinné stránky
1. **Úvodní stránka (index.html / landing / o festivalu)**
   - identita festivalu (název, datum, místo)
   - krátký popis a žánry
   - odkazy do programu, účinkujících a praktických informací
   - hero obrázek (např. placeholder/Lorem Picsum pro Open Graph)

2. **Program (program.html)**
   - program rozdělený na jednotlivé dny (`dny/den`)
   - u každé programové položky (`sumakce/akce`): název, čas, hala, interpreti
   - program bude připraven tak, aby šel filtrovat (např. podle dne / haly / interpreta)

3. **Účinkující (performers.html + detail interpreta)**
   - seznam účinkujících (`interpreti/interpret`, min. 60 položek)
   - detail interpreta: jméno, typ interpreta (Solo/Skupina…), žánr, krátký popis a odkazy na vystoupení v programu

4. **Praktické informace (info.html)**
   - místo konání (adresa/areál, orientační popis)
   - doprava (MHD / auto), parkování
   - vstupenky (typy, orientační ceny)
   - ubytování (tipy v okolí)
   - pravidla areálu a bezpečnostní informace
   - kontakt (email, telefon, web)

### Navigace webu (minimálně)
- O festivalu
- Program
- Účinkující
- Praktické info

---

## 4) Výchozí datová základna (festival.xml) – minimální rozsah a struktura (koncept)
Datová základna bude vedena v `festival.xml` jako well-formed XML a bude obsahovat minimálně tyto entity:

- **festival** (identita, popis, datumy, lokalita, kontakt)  
- **dny / den** – min. 3 dny  
- **haly / hala** – min. 2 místa/scény (venues/stages)  
- **interpreti / interpret** – min. 60 účinkujících  
- **sumakce / akce** – min. 60 programových položek (events)

### Vazby v datech (reference v XML)
Aby byla data konzistentní a snadno použitelná pro program i budoucí API, vazby budou vedeny přímo u položek `akce` pomocí referencí:

- `akce/den_ref` → odkaz na `den/@id`
- `akce/hala_ref` → odkaz na `hala/@id`
- `akce/interpreti/interpret_ref` → jeden nebo více odkazů na `interpret/@id`

Tímto způsobem je možné jednoduše vytvořit přehled programu podle dne, haly i interpreta bez duplicitních seznamů vazeb v jiných částech XML.

---

## 5) Napojení na API (koncept)
Obsah webu bude odpovídat (nemusí být 1:1) budoucím REST endpointům a JSON výstupům. V části „Datový model a API“ budou data validována pomocí XSD, transformována pomocí XSLT do JSON a popsána v OpenAPI 3.1+.

### Povinné endpointy (GET-only)
- `GET /api/festival` – identita festivalu, popis, datumy, odkazy, vstupenky
- `GET /api/venues` (haly)
- `GET /api/venues/{id}`
- `GET /api/performers` (interpreti)
- `GET /api/performers/{id}`
- `GET /api/events` (program / akce)
- `GET /api/events/{id}`

### Povinné query parametry (minimálně pro /api/events)
- `day=YYYY-MM-DD` (filtr podle dne)
- `venueId=...` (filtr podle haly)
- `performerId=...` (filtr podle interpreta)

### Stránkování (alespoň u jednoho list endpointu)
- `page` a `pageSize` (např. u `/api/performers`)

---



## 6) Poznámka k finální verzi
Ve finální verzi byla XML data rozšířena o popis festivalu, kontakt, vstupenky, odkazy, popisy hal a popisy interpretů, aby bylo možné korektně sestavit endpoint `GET /api/festival`, detailní výstupy JSON a odpovídající OpenAPI schémata.
