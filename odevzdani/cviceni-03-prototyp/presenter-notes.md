# Cvičení 03 — poznámky k prezentaci

UX návrh a interaktivní prototyp

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Poznámky jsou příprava k mluvenému projevu; na Moodle se neodevzdávají.

## 1. UX návrh a prototyp

[30 s] Oproti specifikaci máme spustitelný HTML wireframe. Otevře se bez instalace a používá stejnou datovou základnu jako web. Záměrně má jednoduchou grafiku: ověřujeme pořadí obsahu, navigaci a dva klíčové scénáře. Prototyp není šablona, kterou by hotový web při spuštění načítal; je to samostatná návrhová ukázka.

## 2. Od specifikace k wireframu

[35 s] Mobile-first zde znamená navrhnout použitelný úzký základ, ne pouze zmenšit desktop. Návštěvník nejprve vidí hledání a důležitý obsah, podrobnosti následují. Filtry zůstávají dostupné bez vodorovného posouvání celé stránky. Na desktopu se seznam rozšíří do více sloupců, význam tlačítek ale zůstává stejný. Flexbox obsluhuje navigaci a Grid obsahové karty. Už ve wireframu kontrolujeme popisky a klávesnici, abychom problémy neodkládali až na finální grafiku.

## 3. Tři funkce řeší konkrétní potřeby

[35 s] První funkce kombinuje den a scénu; seznam musí splnit obě podmínky současně. Druhá ukládá vybraná vystoupení a umožní zobrazit pouze osobní program. Třetí hledá podle části názvu a propojuje detail s koncertem. Hledání nerozlišuje velikost písmen ani diakritiku. Menu nebo slideshow nepovažujeme za samostatnou požadovanou interakci. Každá zde uvedená funkce mění obsah nebo uchovává uživatelovo rozhodnutí a navazuje na potřebu ze specifikace.

## 4. S1: sestavení osobního programu

[45 s včetně ukázky] Otevřeme prototyp, přejdeme na Program a zvolíme první srpen s River Stage. Ověříme datum a scénu výsledků, ne jen počet karet. Vybraný koncert uložíme a zapneme Jen uložené. Po obnovení stránky se k výběru vrátíme. Pokud není žádný výsledek, rozhraní má nabídnout pochopitelnou cestu ke změně filtrů. Při kontrole musí uložené ID odpovídat stejnému vystoupení ve zdrojových datech.

## 5. S2: od hledání ke koncertu

[45 s včetně ukázky] Do hledání zadáme DARKZY a otevřeme detail stejnojmenného interpreta. Z detailu přejdeme do jeho programu. Ukážeme správný čas a scénu a zavření dialogu klávesou Escape. Vyzkoušíme také dotaz bez výsledku. Přesné vazby porovnáváme s daty, nikoli s tím, zda výsledek vypadá věrohodně. Zadaný text musí být vykreslený jako text, proto kontrolujeme i vstup připomínající HTML. Výsledky jsou zaznamenané v prototype-validation.md.

## 6. AI a ověření prototypu

[40 s] AI vytvořila návrh rozložení a část kódu. Přijali jsme propojení filtrů a detailů, upravili pořadí obsahu pro malé displeje a odmítli pouhou slideshow jako důkaz interaktivity. Samostatný test prochází dva scénáře, obnovu uloženého programu, vyhledávání a dialog. V určených šířkách kontroluje přetékání. Konkrétní výstup je přiložen, samotný návrh AI není validace. Prototyp zatím nezahrnuje objednávku, PDF ani jazykové mutace; ty ukazuje následující implementační milník. Přiložený test prošel bez chyb běhu a potvrdil zachování uloženého programu.
