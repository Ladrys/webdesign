# Cvičení 02 — poznámky k prezentaci

Projektová specifikace a data

Šest snímků, přibližně 35–45 sekund na snímek; celkem 3–5 minut.
Text upravte podle skutečné práce a jmen členů týmu. Nevydávejte podklady za historický záznam.

## 1. Festival začíná u programu.

Představujeme Prague Rocks Festival, fiktivní třídenní hudební festival v Praze. Cílem webu je umožnit návštěvníkovi rychle zjistit, kdy a kde hrají oblíbené kapely, a připravit si vlastní program. Jde o aktuálně připravený podklad k milníku, ne doklad historického odevzdání. Základem je specifikace a XML datová základna. Zachováváme tři dny, tři scény a šedesát účinkujících; nové jméno a výraznější grafický směr vznikly z požadavku zadavatele.

## 2. Jedna akce. Propojená data.

Festival propojuje několik současných žánrů. První ročník se odehrává od prvního do třetího srpna 2026 ve fiktivně uspořádaném areálu Vltava Park u reálného Výstaviště Praha. XML obsahuje identitu festivalu, tři dny, tři scény, šedesát interpretů a šedesát vystoupení. Každé vystoupení má odkaz na existující den, scénu a interpreta. Nejde tedy o čtyři nezávislé seznamy; vztahy lze zkontrolovat a použít pro program i detail kapely.

## 3. Pro koho web připravujeme?

Hlavní skupiny definujeme podle konkrétní potřeby, nikoli jen věku. Návštěvník na telefonu potřebuje najít nejbližší koncert; fanoušek konkrétní kapely hledá známé jméno a čas. Lidé přijíždějící do Prahy potřebují praktické informace a zahraniční návštěvníci angličtinu. Pro každou potřebu máme jasnou funkci. Vedlejší tok umožní porovnat vstupenky a projít lokální objednávku. Na úvodu má být hned vidět název, datum a hlavní cesta do programu.

## 4. Obsah má konkrétní vazby.

Z úvodní stránky vedeme do programu, účinkujících a praktických informací. Detail interpreta neukončuje cestu: odkazuje na příslušný koncert, kde je datum a scéna. Scéna naopak propojuje lokalitu s jejím programem. Vyhledávání má samostatné výsledky, které míří na správný obsah. Objednávka je oddělená souvislá cesta od porovnání tarifů přes košík k PDF. Účet není podmínkou objednávky. Takto vzniká struktura podle úkolů uživatele, nikoli podle technických souborů.

## 5. Dva průchody, jasný výsledek.

První scénář řeší návštěvníka na telefonu, který zná den a scénu. Filtrovaný seznam mu umožní uložit koncert a později se vrátit k vlastnímu programu. Ve druhém scénáři návštěvník zadá jen část názvu Neon, otevře Neon Wave a zjistí čas i scénu koncertu. Očekávané výsledky jsou měřitelné: filtry nesmějí vracet jiné dny a oblíbené musí vydržet obnovení. Třetím scénářem ve specifikaci je objednávka hosta s výstupem PDF.

## 6. AI návrh potřebuje důkaz.

AI pomohla analyzovat zadání a připravit strukturu, texty i návrh datového propojení. Přijali jsme propojení podle ID a mobile-first přístup. Odmítli jsme vlastní backend, protože finální zadání vyžaduje čistě klientské řešení, a kopírování cizí značky. Builder kontroluje počty, unikátní identifikátory a existenci vazeb. Samotná AI kontrola ale nic nedokazuje, proto máme konkrétní validátory a navazující scénáře. Chybějící skutečné konzultace, schválení změn a týmovou historii nesmíme nahrazovat vymyšlenými tvrzeními.
