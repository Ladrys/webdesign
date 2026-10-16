# Fotografie fiktivních účinkujících

Čtyři originální fotografické koláže byly vygenerovány nástrojem OpenAI Image Generation dne 16. 10. 2026 pro Prague Rocks Festival. Žádná fotografie nebyla převzata z Rock for People ani z jiného festivalového webu. Zadání výslovně požadovalo fiktivní dospělé hudebníky, nikoli portréty skutečných interpretů.

## Použití

Každý soubor `sheet-1.webp` až `sheet-4.webp` obsahuje 16 samostatných fotografií v pravidelné mřížce 4 × 4, bez mezer a textu. Celkem vzniklo 64 fotografií; web používá prvních 60. Rozměry originálů jsou 1448 × 1086 px. Obrázky nejsou programově ořezávané ani retušované. CSS vybírá příslušnou buňku pomocí `background-size: 400% 400%` a `background-position`.

Pro web byly originální PNG překódovány pomocí FFmpeg/libwebp, kvalita 82, komprese 6, beze změny rozměrů nebo obsahu. Čtyři soubory mají dohromady přibližně 1,1 MB místo 11 MB PNG. Výsledná fotografie byla po převodu znovu vizuálně ověřena. Tato optimalizace snižuje přenos dat zejména na mobilu a velikost školních balíčků.

`web/js/performer-art.js` přiřazuje fotografie stabilně k ID `i1`–`i60` z datové základny. Prvních 16 ID používá první soubor, následujících 16 druhý, dalších 16 třetí a posledních 12 čtvrtý. Pořadí je v každé koláži zleva doprava a shora dolů. Při filtrování se přiřazení nemění. Doporučený poměr stran zobrazované fotografie je 4 : 3.

## Reprezentativní zadání pro AI

„Create a professional music festival photography contact sheet. Exactly 4 columns by 4 rows of equally sized edge-to-edge photographs, no gutters, no text, no logos. Every photograph contains different fictional adult musicians, no known celebrities. Center the musicians within each cell. Cinematic analog editorial portraits and live concert photos, cobalt blue, amber and magenta lighting. Alternate solo musicians and ensembles; include rock, pop, jazz, electronic, hip-hop, folk, punk, world music, alternative and soul performers.“

Ke každé koláži byl připojen konkrétní seznam 16 odlišných scén, podob účinkujících a nástrojů. Sólo/skupina se střídá stejně jako v XML.

## Ověření a limity

- Všechny čtyři výsledky byly vizuálně zkontrolovány: pravidelná mřížka, odlišné scény, žádný text či vložené logo a čitelné portréty.
- Programové ověření kontroluje 60 unikátních kombinací souboru a pozice a návaznost na ID v XML.
- Jde o ilustrační fotografie vytvořené AI, nikoli doklad skutečného vzhledu nebo existence uvedených fiktivních kapel. AI může vykreslit drobné nepřesnosti nástrojů či rukou. Tuto skutečnost uvádí dokumentace projektu; fotografie nemění jména, program ani jiné údaje z datové základny.
