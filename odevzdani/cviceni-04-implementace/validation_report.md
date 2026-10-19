# Ověření Prague Pulse Fest — verze 1.2.0

**Datum:** 19. října 2026. Záznam zachycuje konkrétní kontroly výsledného webu a podkladů.

| Kontrola | Výsledek |
| --- | --- |
| `python validate_project.py` | XML/XSD, 4 úplné JSON exporty, ID a reference, program, ceny, kapacity, HTML vstupy a reprodukovatelnost dat prošly |
| `python tests/browser_smoke.py` s QR dekodérem | **637 kontrol prošlo**; skutečné průchody, stažené PDF a dekódování QR |
| `python tests/course_materials.py --folder odevzdani` | **156 kontrol prošlo**; 5 × 6 snímků, PPTX/PDF, poznámky, prototyp, kopie webu, manifest a obsah C02 |
| Responzivní rozložení | **224 kombinací** stránek, šířek a jazyků bez vodorovného přetékání či chyby JavaScriptu |
| Anglické rozhraní | **17 pohledů** bez chybějících překladů; vlastní názvy ulic jsou zachované |
| Podrobný plánek | **20 cílených kontrol** včetně skutečného dotykového pinch zoomu, vrstev, ukotvení kolečka a kapacit mezi kartami |
| Dokumentace PDF | 13 stran, žádný text mimo hranice strany |
| Syntax JS/Python a `git diff --check` | Prošlo |
| Přímé otevření `file://` místně | Přeskočeno kvůli politice řízeného Chromium; není započítané jako úspěch |

## Ověřené uživatelské průchody

- **Interpret → nákup:** filtr žánru vede ke správnému profilu; odkaz přenese ID vystoupení, scénu a den do jednodenní vstupenky. Změna nepokrývající daný koncert vyvolá konkrétní upozornění.
- **Výběr sedadel:** 0/1/2 sedadel znamená 0/1/2 osoby a odpovídající cenu. Odebrání posledního vynuluje cenu. Deváté sedadlo nepřekročí limit osmi osob na jeden výběr; stání používá vlastní množství.
- **Dva dny:** výběr nezačíná skrytě předvolenou dvojicí. Nula, jeden nebo tři dny neumožní pokračovat; první a třetí den se zachovají v košíku, objednávce i PDF.
- **Košík:** po odebrání se přepočítá základ, promo, DPH, celková cena a počet položek. Kontakty zůstanou zachované. Změna v jiné kartě včetně vyprázdnění se zobrazí průběžně.
- **Kapacity:** program, profily, scény, výběr, košík a plánek používají stejné validní objednávky ročníku 2027. Prodané vstupy a vlastní košík se rozlišují. Společný pas ovlivní všechny tři scény, samostatný jen vybranou. Platné staré objednávky 2026 novou kapacitu neblokují.
- **Hranice dostupnosti:** poslední místo Club Stage omezuje společný vstup, ale ne samostatný River. Libovolné volné sedadlo Main Hall lze vybrat do zbývající kapacity. Stání se posuzuje podle denních počtů, nikoli interních čísel fyzických pozic. Objednávka znovu ověřuje aktuální stav; místní Web Locks řadí souběžná potvrzení.
- **Účet:** datum registrace, profil, změna přes současné heslo, odmítnutí starého hesla a odhlášení ostatních karet. Obnova vyžaduje e-mail i náhodný 128bitový kód; po použití se heslo i kód vymění. Špatný nebo již použitý kód nic nezmění. Starší účet dostane kód až po ověření hesla a nemá vymyšlené datum vytvoření.
- **PDF:** tmavý vzhled, skutečný čas nákupu v pražském čase, ID, kupující, scéna, přesné dny a sedadlo. Každá vstupenka má vlastní cenu a podíl slevy se skutečným kódem. Nezávislý Python výpočet ověřuje haléřové rozdělení slevy včetně shodných zbytků a nulové výsledné ceny. Kemp má vlastní finanční rozpis na samostatném voucheru. QR se opravdu dekódují.
- **Plánek:** zoom 1–8×, posun, vrstvy a dotykové ovládání. Zvolený den určuje zbývající kapacitu a odkazy do programu. Objednávka v druhé kartě aktualizuje čísla bez ztráty přiblížení.
- **Soukromí:** Google mapa vznikne až po souhlasu; odvolání ji odstraní. Offline plánek a ostatní funkce souhlas s externí mapou nepotřebují.

## Data a podklady

Zdrojové XML má 3 dny, 3 scény, 60 jedinečných interpretů a 60 provázaných vystoupení. Běžné sety trvají 60 minut, hlavní koncerty Main Hall 90 minut. Stejná scéna má nejméně 30 minut na přestavbu; devět večerních závěrečných koncertů navazuje s půlhodinou na přesun.

Čtyři JSON exporty odpovídají XML a přibalenému `data.js`. Historické API ukázky již nejsou součástí současného datového toku. Obsah složky i ZIP pro cvičení 2 je přesně `project-specification.md`, `data.xml`, `festival.xsd`, `prezentace.pptx`. Náhled PDF a řečnické poznámky jsou oddělené. Prezentace mají shodný viditelný text PPTX/PDF a žádný text mimo stránku.

Podrobný výsledek je v `review/browser-validation-2026-10-19.json`; rozložení a jazyk mají vlastní datované JSON. `odevzdani/manifest.json` obsahuje kontrolní otisky exportů. Ukázky PDF a snímky spuštěného webu jsou v kořenové složce `preview/` vývojového repozitáře. GitHub Actions má vlastní výsledek pro konkrétní commit.

## Rozsah

Testy běžely ve skutečném Chromium nad dočasným vývojovým statickým serverem; ten není běhovou závislostí webu. Neproběhl úplný externí audit WCAG, kontrola všech HTML stavů ani uživatelská studie na fyzických telefonech. Vlastní kontroly nenahrazují požadované skutečné cross-review druhého týmu.

Účty a obsazenost jsou místní pro daný prohlížeč, platby zkušební a e-mailová služba není připojená. Obnovovací kód ověřuje místní účet; nejde o serverové ověření identity. Kapacity jsou návrhem fiktivního festivalu. Omezení zadání a zdrojů vizuálů jsou zaznamenaná v `documentation.md`.
