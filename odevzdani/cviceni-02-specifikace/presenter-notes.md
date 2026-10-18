# Cvičení 02 — poznámky k prezentaci

Projektová specifikace a data

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Milníky jsou připravené podklady, nikoli archiv dřívějších odevzdání. Popis spolupráce a dřívější rozhodnutí upravte podle skutečného průběhu.

## 1. Projektová specifikace a data

[30 s] Prague Pulse Fest je návrh fiktivního třídenního festivalu v Praze. První výstup tvoří projektová specifikace a XML datová základna. Od výchozího námětu jsme přešli k identitě, cílovým skupinám, struktuře webu a pěti scénářům. Hlavní úkol návštěvníka je zjistit kdo, kdy a kde vystupuje, uložit si vlastní program a naplánovat návštěvu. Autoři jsou Michal Ladra, Matěj Mlejnek a Jan Martínek. Skuteční interpreti jsou návrhem line-upu, jejich účast nepotvrzujeme. Tyto podklady popisují současný návrh, nikoli nedoloženou historii odevzdání.

## 2. Od otázky k hotovému plánu

[35 s] Cílové skupiny rozlišujeme podle úkolu. Návštěvník v areálu potřebuje rychlý program v telefonu. Fanoušek hledá známé jméno a jeho koncert. Přijíždějící návštěvník potřebuje dopravu, mapu a případně angličtinu. Každé potřebě odpovídá konkrétní obsah nebo funkce, ne pouze propagační text. Samostatně počítáme i s vracejícím se uživatelem a historií objednávek. Účet není podmínkou nákupu. Tato návaznost potřeb a funkcí je hlavní rozhodnutí návrhu.

## 3. Jedna datová základna, tři scény

[40 s] XML obsahuje tři dny, tři scény, šedesát interpretů a šedesát vystoupení. Každé vystoupení jednoznačně odkazuje na existující den, scénu a interpreta. Názvy nejsou spojovací klíč. Main Hall má návrhovou kapacitu pět tisíc osob: šestnáct VIP sedadel, třicet dva Regular a čtyři tisíce devět set padesát dva stojících. River a Club jsou pouze na stání, s kapacitami tři tisíce a patnáct set. Vstup jde zvolit na jednu scénu nebo společně. Společný vstup spotřebuje kapacitu na všech scénách, proto zaručený přístup omezuje i nejmenší Club. Nejde o oficiální kapacity Výstaviště. Program zachovává plné sety, po sobě jdou tři závěrečné koncerty denně; ostatní sety se mohou překrývat.

## 4. Obsah se propojuje podle úkolu

[35 s] Úvod představí festival a hlavní navigace vede k programu, účinkujícím, scénám a praktickým informacím. Hledání má vlastní stránku s výsledky napříč obsahem. Detail interpreta vede ke koncertu a scéna do svého filtrovaného programu. Návštěvník tak nemusí stále začínat od úvodu. Nákup má samostatnou cestu od výběru ke košíku a PDF. Účet a historie jsou volitelné. Novinky, soukromí, podmínky a kredity jsou doplňkové části v patičce; úplný sitemap je ve specifikaci.

## 5. Dva průchody, které ověříme

[45 s] Scénář S1 má konkrétního uživatele, cíl, výchozí situaci a očekávaný výsledek. Na mobilu vybereme první srpen a River Stage, uložíme koncert a otevřeme osobní program. Po obnovení musí výběr zůstat. V S2 fanoušek zná DARKZY, ale ne jeho termín. Přes hledání a detail najde konkrétní vystoupení v Club Stage. Při ověření porovnáme datum, čas a scénu s XML. První dva průchody podporuje také samostatný wireframe. Třetí klíčový scénář specifikace je nákup hosta na první a třetí srpen s ručním sedadlem a PDF. Nevyžaduje účet.

## 6. AI navrhuje. Výsledek ověřujeme.

[40 s] Codex a ChatGPT pomohly s rozborem zadání, návrhem struktury, texty a datovým modelem. Přijali jsme stabilní ID, upravili scénáře, kapacity a program podle účelu návštěvy. Odmítli jsme vlastní backend, protože zadání požaduje čistě klientský web. Konkrétní ověření tvoří XML/XSD validace, počty entit, jedinečná ID a reference a porovnání exportu pro prohlížeč s XML. Výsledek je reprodukovatelný validátorem a uložený ve validačním reportu. Testy nenahrazují použitelnost s návštěvníky, nepotvrzují účast interpretů ani oficiální kapacity. Skutečné fotografie mají zdroje a licence; odchylku od požadavku na AI obrázky uvádíme v dokumentaci. Za odevzdání a vysvětlení odpovídá tým.
