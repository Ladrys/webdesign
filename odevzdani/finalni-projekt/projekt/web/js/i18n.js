'use strict';
/* Client-side Czech / English presentation. Source IDs, form values and personal data stay intact. */
(() => {
  const key = 'prf:language';
  let lang = 'cs';
  try { lang = localStorage.getItem(key) === 'en' ? 'en' : 'cs'; } catch {}
  const dictionary = {
    "Tři scény otevírají festival rockovými koncerty, popem a večerní elektronikou.": "Three stages open the festival with rock concerts, pop and evening electronic music.",
    "Největší festivalový den: od ranních objevů až po hlavní večerní koncerty.": "The biggest festival day: from morning discoveries to the main evening shows.",
    "Závěrečné koncerty a klubová afterparty zakončí tři dny pražské hudby.": "Closing shows and a club afterparty round off three days of music in Prague.",
    "Sedadlo Regular na vybraný den a všechny tři scény.": "A Regular seat for your chosen day and access to all three stages.",
    "VIP sedadlo na vybraný den, rychlejší odbavení a vstup do odpočinkové zóny.": "A VIP seat for your chosen day, fast-track entry and access to the lounge.",
    "Prague Pulse Fest je fiktivní třídenní městský hudební festival v Praze. Tři scény propojují rock, pop, jazz, elektroniku a další žánry.": "Prague Pulse Fest is a fictional three-day city music festival in Prague. Three stages bring together rock, pop, jazz, electronic music and other genres.",
    "Web nepoužívá analytické cookies a neposílá osobní údaje na náš server. Smazání dat prohlížeče odstraní i místní účty a objednávky.": "This website uses no analytics cookies and sends no personal data to our server. Clearing browser data also removes local accounts and orders.",
    "Google Maps je externí služba. Po povolení externích map v nastavení soukromí se mapa načítá automaticky; bez souhlasu zůstává vypnutá. Sociální odkazy vedou na veřejné stránky jednotlivých platforem; nejde o ověřené profily tohoto fiktivního festivalu.": "Google Maps is an external service. After you allow external maps in privacy settings, the map loads automatically; without consent it stays off. Social links lead to public platform pages, not verified accounts for this fictional festival.",
    "Obsazenost odpovídá objednávkám uloženým v daném prohlížeči. Není sdílená mezi zařízeními. Třídenní balíček blokuje stejné místo pro všechny tři dny; jednodenní pouze pro vybraný den.": "Availability reflects orders saved in this browser. It is not shared between devices. A three-day pass reserves the same place on all three days; a one-day ticket reserves only the selected day.",
    "Vstupenky si stáhni a uschovej číslo objednávky.": "Download your tickets and keep your order number.",
    "PDF se nepodařilo vytvořit. Zkus to znovu.": "The PDF could not be created. Please try again.",

    'Přejít na obsah': 'Skip to content',
    "Přístupnost areálu": "Venue accessibility",
    "Bezbariérové trasy a přístupné toalety jsou součástí návrhu. Potřebuješ-li asistenci, obrať se na informační bod u vstupu.": "The design includes step-free routes and accessible toilets. If you need assistance, contact the information point at the entrance.",
    "Knihovna pro PDF se nenačetla. Obnovte stránku a zkuste to znovu.": "The PDF library did not load. Refresh the page and try again.",
    "Nelze načíst místní knihovnu pro PDF. Zkontrolujte, zda jste rozbalili celý projekt.": "The local PDF library could not be loaded. Make sure you extracted the complete project.",
    "Objednávka musí obsahovat 1 až 264 vstupenek.": "An order must contain between 1 and 264 tickets.",
    "FIKTIVNÍ FESTIVAL / VSTUPENKA": "FICTIONAL FESTIVAL / TICKET",
    "JMÉNO V OBJEDNÁVCE": "NAME ON THE ORDER",
    "Návštěvník festivalu": "Festival visitor",
    "DATUM": "DATE",
    "SEKTOR / MÍSTO": "SECTION / PLACE",
    "Volná plocha": "Standing area",
    "Volný vstup": "General admission",
    "AREÁL": "VENUE",
    "CENA VSTUPENKY": "TICKET PRICE",
    "Doklad byl vytvořen lokálně jako součást školního projektu.": "Created locally as part of a student project.",
    "Nepotvrzuje platbu ani nárok na skutečný vstup do areálu.": "Not proof of payment or admission to a real venue.",
    "ADMIT ONE / UKÁZKA": "ADMIT ONE / SAMPLE",
    "VSTUPENKA": "TICKET",
    "3 DNY / VŠECHNY SCÉNY": "3 DAYS / ALL STAGES",
    "1 DEN / VŠECHNY SCÉNY": "1 DAY / ALL STAGES",
    "Školní ukázka vstupenek": "Student project tickets",
    "Čeština": "Czech",
    "Angličtina": "English",
    "Informace pro návštěvníky": "Visitor information",
    "Doprava, parkování, ubytování a vše důležité před návštěvou.": "Getting here, parking, accommodation and the essentials before you arrive.",
    "Informace na stránce": "Information on this page",
    "Soukromí": "Privacy",
    "Program každý den od 09:00": "Programme starts at 09:00 every day",
    "3 scény": "3 stages",
    "Festivalové info": "Festival information",
    "Kontaktní údaje patří fiktivnímu festivalu a nejsou určené pro skutečné objednávky.": "These contact details belong to a fictional festival and must not be used for actual orders.",
    "Tramvají na Výstaviště nebo metrem C na Nádraží Holešovice. Z centra doporučujeme MHD, pěší cestu přes Stromovku nebo kolo.": "Take a tram to Výstaviště or metro line C to Nádraží Holešovice. From the city centre, we recommend public transport, walking through Stromovka or cycling.",
    "Vyhledat spojení PID": "Find a connection with PID",
    "V okolí Výstaviště jsou placená parkoviště a městské parkovací zóny. Respektuj místní značení. VIP parkování je součástí modelového třídenního balíčku, ostatní vstupenky ho nezahrnují.": "Paid car parks and city parking zones surround Výstaviště. Follow local signs. The fictional three-day VIP pass includes parking; other tickets do not.",
    "Pro krátkou cestu do areálu vybírej Holešovice, Letnou nebo okolí metra C. Ubytování rezervuj přímo u poskytovatele. Festivalový balíček nezahrnuje hotel ani kemp.": "For a short journey, choose Holešovice, Letná or somewhere near metro line C. Book directly with your accommodation provider. Festival passes do not include hotels or camping.",
    "Mapa areálu": "Venue map",
    "Otevřít Google Maps": "Open Google Maps",
    "Mapa Výstaviště Praha": "Map of Výstaviště Prague",
    "První ročník v Praze": "The first edition in Prague",
    "Prague Pulse Fest 2027 spojuje tři odlišné scény do jednoho městského festivalu. První ročník staví na současné hudbě, objevování nových jmen a pohodlné dostupnosti městskou dopravou.": "Prague Pulse Fest 2027 brings three distinctive stages together in one city festival. Its first edition focuses on contemporary music, new discoveries and easy public transport access.",
    "Časté dotazy": "Frequently asked questions",
    "Kde se festival koná?": "Where does the festival take place?",
    "Vltava Park, modelový festivalový areál na Výstavišti Praha. Adresa pro navigaci: Výstaviště 67, 170 00 Praha 7.": "Vltava Park is a fictional festival site at Výstaviště Prague. Navigation address: Výstaviště 67, 170 00 Prague 7.",
    "Jak se dostanu do areálu?": "How do I get to the venue?",
    "Doporučujeme tramvaj na zastávku Výstaviště nebo metro C na Nádraží Holešovice a navazující tramvaj. Aktuální spojení si před cestou ověř u dopravce.": "Take a tram to Výstaviště or metro line C to Nádraží Holešovice, then a connecting tram. Check current services with the transport operator before travelling.",
    "Co obsahuje VIP?": "What does VIP include?",
    "VIP zahrnuje místo v předních řadách, rychlejší odbavení a odpočinkovou zónu. Třídenní VIP balíček v modelové nabídce zahrnuje také jedno parkovací místo.": "VIP includes a seat in the front rows, fast-track entry and a lounge area. The fictional three-day VIP package also includes one parking space.",
    "Mohu koupit vstupenku bez registrace?": "Can I buy a ticket without registering?",
    "Ano. V košíku stačí zadat jméno a e-mail. Po dokončení objednávky si stáhneš všechny vstupenky v jednom PDF.": "Yes. Enter your name and email at checkout. After completing the order, download all your tickets in one PDF.",
    "Jak dlouho platí třídenní balíček?": "How long is a three-day pass valid?",
    "Třídenní balíček platí od 1. do 3. srpna 2027 na všechny scény. Stejné sedadlo nebo místo ke stání je vyhrazené po všechny tři dny.": "A three-day pass is valid from 1 to 3 August 2027 on all stages. The same seat or standing place is reserved for all three days.",
    "Je areál bezbariérový?": "Is the venue accessible?",
    "Návrh areálu počítá s bezbariérovými trasami a přístupnými toaletami. Doprovod a individuální potřeby řeší informační bod u hlavního vstupu.": "The venue design includes step-free routes and accessible toilets. For assistance and individual requirements, visit the information point at the main entrance.",
    "Jak pracujeme s údaji": "How we handle your data",
    "Účet, košík, oblíbené a objednávky se ukládají do místního úložiště prohlížeče na tvém zařízení. Heslo se ukládá jako solený hash, nikoli jako čitelný text. Přihlášení je platné sedm dnů, pokud se neodhlásíš dříve.": "Your account, basket, favourites and orders are stored locally in the browser on your device. Passwords are stored as salted hashes rather than readable text. You remain signed in for seven days unless you log out earlier.",
    "Tato stránka popisuje fungování školního klientského projektu, nikoli právní dokument skutečného pořadatele.": "This page describes how a client-side student project works. It is not a legal document from an actual event organiser.",
    "Podmínky": "Terms",
    "Objednávka a vstupenky": "Orders and tickets",
    "Festival i nabídka jsou fiktivní. Platba v košíku je zkušební a nestrhává peníze. Vytvořené PDF není dokladem o skutečném zaplacení nebo právu na vstup na existující akci. E-mail se automaticky neodesílá.": "The festival and its offer are fictional. Checkout uses a test payment and does not charge money. The PDF is not proof of actual payment or admission to a real event. No email is sent automatically.",
    "Obsazenost odpovídá objednávkám uloženým v daném prohlížeči nebo načtené JSON záloze. Není sdílená mezi zařízeními. Třídenní balíček blokuje stejné místo pro všechny tři dny; jednodenní pouze pro vybraný den.": "Availability reflects orders stored in this browser or restored from a JSON backup. It is not shared between devices. A three-day pass reserves the same place for all three days; a one-day ticket reserves it only for the selected day.",
    "VIP sedadlo na všechny tři dny, rychlejší odbavení, odpočinková zóna a jedno parkovací místo v nabídce balíčku.": "A VIP seat for all three days, fast-track entry, a lounge area and one parking space in the package.",
    "Sedadlo Regular na stejném místě po všechny tři dny a vstup na všechny scény.": "The same Regular seat for all three days and access to every stage.",
    "Místo ke stání na všechny tři dny a vstup na všechny scény.": "A standing place for all three days and access to every stage.",
    "Festivalové balíčky": "Festival passes",
    'Tři dny na všech scénách, nebo jen jeden festivalový den. Vyber balíček a konkrétní místo.': 'All three days on every stage, or a single festival day. Choose your pass and a place.',
    'Třídenní festivalové balíčky': 'Three-day festival passes',
    'Jeden den': 'One day',
    'Kategorie': 'Category',
    'Všechny kategorie': 'All categories',
    'Výběr místa': 'Choose your place',
    'Stejné místo platí na všechny tři dny. Místo musí být volné po celý festival.': 'Your place is reserved for all three days. It must be available throughout the festival.',
    'Jednodenní vstup platí na všechny scény vybraného dne.': 'A one-day ticket gives you access to every stage on your chosen day.',
    'Vyber sedadlo v mapě nebo přidej místo ke stání.': 'Choose a seat on the map or add a standing place.',
    'Platba je simulovaná. Po dokončení stáhneš PDF vstupenky. E-mail se automaticky neodesílá.': 'This is a simulated payment. Download your PDF tickets after checkout. No email is sent automatically.',
    'Souhlasím s': 'I agree to',
    'podmínkami objednávky': 'the order terms',
    'a beru na vědomí': 'and acknowledge',
    'informace o zpracování údajů': 'the data processing information',
    'PDF obsahuje všechny vstupenky z této objednávky. Pro skutečný vstup na akci není platné.': 'The PDF contains all tickets in this order. It is not valid for entry to an actual event.',
    'Objednávku najdeš i v historii svého účtu.': 'Your order is also available in your account history.',
    'Vstupenky si stáhni nebo vytiskni a uschovej číslo objednávky.': 'Download or print your tickets and keep your order number.',
    'Přihlášení zůstává aktivní po dobu sedmi dnů nebo do odhlášení.': 'You stay signed in for seven days or until you log out.',
    'Tři dny hudby u Vltavy. Objevte Prague Pulse Fest, program a vstupenky.': 'Three days of music by the Vltava. Explore Prague Pulse Fest, the programme and tickets.',
    'Tři dny hudby u Vltavy. Objevte Prague Pulse Fest, program a vstupenky.': 'Three days of music by the Vltava. Explore Prague Pulse Fest, the programme and tickets.',
    'Kompletní program festivalu. Filtrujte podle dne, scény a ukládejte si oblíbená vystoupení.': 'The complete festival programme. Filter by day or stage and save your favourite performances.',
    'Všech 60 účinkujících Prague Pulse Fest. Žánry, detaily a jejich vystoupení.': 'All 60 Prague Pulse Fest artists. Genres, profiles and performances.',
    'Všech 60 účinkujících Prague Pulse Fest. Žánry, detaily a jejich vystoupení.': 'All 60 Prague Pulse Fest artists. Genres, profiles and performances.',
    'Main Hall, River Stage a Club Stage. Místa festivalu Prague Pulse Fest.': 'Main Hall, River Stage and Club Stage. Explore the Prague Pulse Fest venues.',
    'Main Hall, River Stage a Club Stage. Místa festivalu Prague Pulse Fest.': 'Main Hall, River Stage and Club Stage. Explore the Prague Pulse Fest venues.',
    'Vyhledávání v programu, interpretech, scénách a všech datech festivalu.': 'Search the programme, artists, stages and all festival information.',
    'Vyberte si místa v interaktivní mapě. VIP, Regular a stání za symbolické ceny.': 'Choose places on the interactive map. VIP, Regular and standing tickets at accessible prices.',
    'Váš výběr vstupenek a ukázková objednávka s účtem i bez registrace.': 'Your ticket selection and checkout, with an account or as a guest.',
    'Lokální demo účtu a historie objednávek Prague Pulse Fest.': 'Your Prague Pulse Fest account and order history.',
    'Lokální demo účtu a historie objednávek Prague Pulse Fest.': 'Your Prague Pulse Fest account and order history.',
    'Program 60 vystoupení. Filtrujte podle dne, scény a ukládejte oblíbené koncerty.': 'Explore 60 performances. Filter by day or stage and save your favourite shows.',
    'Prague Pulse Fest: 1.–3. srpna 2027 ve Vltava Parku v Praze. Program, účinkující a vstupenky.': 'Prague Pulse Fest: 1–3 August 2027 at Vltava Park in Prague. Programme, artists and tickets.',
    'Prague Pulse Fest: 1.–3. srpna 2027 ve Vltava Parku v Praze. Program, účinkující a vstupenky.': 'Prague Pulse Fest: 1–3 August 2027 at Vltava Park in Prague. Programme, artists and tickets.',
    'Všech 60 účinkujících Prague Pulse Fest, jejich profily a koncerty.': 'Explore all 60 Prague Pulse Fest artists, their profiles and performances.',
    'Všech 60 účinkujících Prague Pulse Fest, jejich profily a koncerty.': 'Explore all 60 Prague Pulse Fest artists, their profiles and performances.',
    'Main Hall, River Stage a Club Stage ve Vltava Parku v Praze.': 'Main Hall, River Stage and Club Stage at Vltava Park in Prague.',
    'Praktické informace: doprava, přístupnost, vstupenky a časté dotazy.': 'Visitor information: transport, accessibility, tickets and frequently asked questions.',
    'Doprava, přístupnost, vstupenky a odpovědi pro návštěvníky Prague Pulse Fest.': 'Transport, accessibility, tickets and answers for Prague Pulse Fest visitors.',
    'Doprava, přístupnost, vstupenky a odpovědi pro návštěvníky Prague Pulse Fest.': 'Transport, accessibility, tickets and answers for Prague Pulse Fest visitors.',
    'Hledání v programu, interpretech, scénách a informacích Prague Pulse Fest.': 'Search the Prague Pulse Fest programme, artists, stages and visitor information.',
    'Hledání v programu, interpretech, scénách a informacích Prague Pulse Fest.': 'Search the Prague Pulse Fest programme, artists, stages and visitor information.',
    'Interaktivní výběr VIP, Regular a stání. Školní ukázka vstupenek v PDF.': 'Choose VIP, Regular or standing tickets on an interactive map and download a PDF ticket.',
    'Souhrn vstupenek a objednávka s lokálním účtem i bez registrace.': 'Review your tickets and check out with an account or as a guest.',
    'Lokální přihlášení, registrace a historie školních objednávek.': 'Log in, create an account and view your order history.',
    'Pro program, vyhledávání a demo nákupu prosím zapněte JavaScript.': 'Please enable JavaScript to use the programme, search and checkout.',
    'Hlavní navigace': 'Main navigation',
    'Navigace v zápatí': 'Footer navigation',
    'Jazyk webu': 'Website language',
    'Přepnout do češtiny': 'Switch to Czech',
    'Přepnout do angličtiny': 'Switch to English',
    'Prague Pulse Fest – úvod': 'Prague Pulse Fest – home',
    'Prague Pulse Fest – úvod': 'Prague Pulse Fest – home',
    'Zavřít detail': 'Close details',
    'Zavřít menu': 'Close menu',
    'Otevřít menu': 'Open menu',
    'Hledat na celém webu': 'Search the whole website',
    'Hledat…': 'Search…',
    'Hledat': 'Search',
    'Vyhledat': 'Search',
    'Vyhledávání': 'Search',
    'Název nebo popis…': 'Name or description…',
    'Např. Ada nebo jazz': 'E.g. Ada or jazz',
    'Např. Ada, VIP nebo doprava': 'E.g. Ada, VIP or transport',
    'Program': 'Programme',
    'Program 2027': 'Programme 2027',
    'Účinkující': 'Artists',
    'Interpreti': 'Artists',
    'Seznam účinkujících': 'Artist list',
    'Festivalové scény': 'Festival stages',
    'Scény': 'Stages',
    'Scéna': 'Stage',
    'Vystoupení': 'Performances',
    'Můj účet': 'My account',
    'Účet': 'Account',
    'Přihlášení': 'Log in',
    'Registrace': 'Register',
    'Košík': 'Basket',
    'Vstupenky': 'Tickets',
    'Praktické informace': 'Visitor information',
    'Praktické info': 'Visitor info',
    'Kontakt': 'Contact',
    'Kontakty': 'Contacts',
    'Historie': 'History',
    'Historie festivalu': 'Festival history',
    'Sledujte nás': 'Follow us',
    'Sociální sítě': 'Social media',
    'Ochrana soukromí': 'Privacy',
    'Ochrana osobních údajů': 'Privacy policy',
    'Podmínky nákupu': 'Purchase terms',
    'Obchodní podmínky': 'Terms and conditions',
    'Ubytování': 'Accommodation',
    'Parkování': 'Parking',
    'Doprava': 'Getting here',
    'Jak se k nám dostat': 'Getting here',
    'Na festival': 'At the festival',
    'Před návštěvou': 'Before you arrive',
    'Kdy': 'When',
    'Kde': 'Where',
    'Často se ptáte': 'Frequently asked questions',
    'O festivalu': 'About the festival',
    'Všechny dny': 'All days',
    'Všechny scény': 'All stages',
    'Všechny žánry': 'All genres',
    'Den': 'Day',
    'Žánr': 'Genre',
    'Interpret nebo téma': 'Artist or theme',
    'Hledat interpreta': 'Search artists',
    'Jen můj program': 'My saved programme',
    'Zrušit filtry': 'Clear filters',
    'Žádná vystoupení. Zkuste změnit filtry.': 'No performances. Try changing the filters.',
    'Žádní účinkující neodpovídají hledání.': 'No artists match your search.',
    'Poznat interpreta': 'Meet the artist',
    'Profil a vystoupení': 'Profile and performances',
    'Kdy hraje?': 'When are they playing?',
    'V programu zatím není vystoupení.': 'No performance has been scheduled yet.',
    'Odebrat z': 'Remove from',
    'Přidat do': 'Add to',
    '♥ Uloženo': '♥ Saved',
    '♡ Uložit': '♡ Save',
    'Uloženo': 'Saved',
    'Uložit': 'Save',
    'Objevit program scény': 'Explore this stage’s programme',
    'Tři festivalové scény': 'Three festival stages',
    'Tři scény': 'Three stages',
    'Od velkých koncertů po komorní sety. Všechny scény najdeš v areálu Vltava Park.': 'From headline shows to intimate sets. All stages are inside Vltava Park.',
    'Od kytarových riffů po elektronické beaty. Najdi zvuk, který tě vezme s sebou.': 'From guitar riffs to electronic beats. Discover your next favourite sound.',
    'Tři dny, tři scény a spousta důvodů zůstat ještě na jeden koncert.': 'Three days, three stages and plenty of reasons to stay for one more show.',
    'Méně hledání, více hudby. Nejdůležitější informace na jednom místě.': 'Less searching, more music. The essentials in one place.',
    'Program, účinkující a informace': 'Programme, artists and visitor information',
    'Prohledáváme všechny položky dat festivalu, program, účinkující, scény i praktické informace. Bez ohledu na velikost písmen a diakritiku.': 'Search across the festival, programme, artists, stages and visitor information. Search ignores case and accents.',
    'Napiš alespoň jeden znak. Zkus třeba „Ada“ nebo „VIP“.': 'Enter at least one character. Try “Ada” or “VIP”.',
    'Nic jsme nenašli. Zkus kratší výraz nebo jiné slovo.': 'No results found. Try a shorter search or another word.',
    'Zobrazit detail': 'View details',
    'Dny festivalu': 'Festival days',
    'Původní datové tarify': 'Original ticket categories',
    'Odkazy festivalu': 'Festival links',
    'Jednodenní vstupenka': 'One-day ticket',
    'Jednodenní vstup': 'One-day admission',
    'Třídenní vstupenka': 'Three-day pass',
    'Třídenní vstup': 'Three-day admission',
    'Třídenní permanentka': 'Three-day pass',
    'Celý festival': 'Full festival',
    'Všechny tři dny': 'All three days',
    'Všechny tři scény': 'All three stages',
    'Tři dny': 'Three days',
    '3 dny': '3 days',
    '1 den': '1 day',
    'Stání': 'Standing',
    'STÁNÍ': 'STANDING',
    'Vstup na všechny scény': 'Access to all stages',
    'Vstup na 3 dny': 'Three-day admission',
    'Vstup na tři dny': 'Three-day admission',
    'Vybrat vstupenky': 'Choose tickets',
    'Vybrat místa': 'Choose places',
    'Vybrat další vstupenky': 'Choose more tickets',
    'Vstupenky na tento den': 'Tickets for this day',
    'Festivalový den': 'Festival day',
    'Typ vstupenky': 'Ticket type',
    'Délka vstupu': 'Admission length',
    'Vyber si místo': 'Choose your place',
    'Vyber místa': 'Choose places',
    'Výběr sedadel': 'Seat selection',
    'Zjednodušený plán festivalové zóny': 'Simplified festival zone plan',
    'PÓDIUM': 'STAGE',
    'Vybráno / v košíku': 'Selected / in basket',
    'Vybráno': 'Selected',
    'Obsazeno': 'Occupied',
    'Volné': 'Available',
    'volné': 'available',
    'obsazeno': 'occupied',
    'vybráno': 'selected',
    'v košíku': 'in basket',
    'Souhrn výběru': 'Selection summary',
    'Vybraná místa': 'Selected places',
    'Přidat do košíku': 'Add to basket',
    'Přejít do košíku': 'Go to basket',
    'Vybrané místo zrušíš opětovným kliknutím. Místa v košíku odebereš v košíku.': 'Click a selected place again to deselect it. Remove places already in your basket on the basket page.',
    'Zatím nic. Vyber si sedadlo nebo místo ke stání.': 'Nothing selected yet. Choose a seat or a standing place.',
    'Objednávka': 'Order',
    'Košík je prázdný': 'Your basket is empty',
    'Vyber festivalový den a místa v mapě.': 'Choose a festival day and places on the map.',
    'Zkontroluj den a místa. Pokračovat můžeš s účtem i jako host.': 'Check the dates and places. Continue with your account or as a guest.',
    'Vybrané vstupenky': 'Selected tickets',
    'Přidat další místa': 'Add more places',
    'Celkem': 'Total',
    'Dokončení objednávky': 'Checkout',
    'Jméno na objednávce': 'Name on the order',
    'E-mail pro objednávku': 'Order email address',
    'E-mail': 'Email',
    'Jméno': 'Name',
    'Heslo': 'Password',
    'Přihlásit se nebo registrovat': 'Log in or register',
    'Nakupuješ jako host.': 'You are checking out as a guest.',
    'Výsledek ukázkové platby': 'Test payment result',
    'Zkušební platba': 'Test payment',
    'Simulovat úspěšnou platbu': 'Simulate successful payment',
    'Simulovat zamítnutí': 'Simulate declined payment',
    'Simulovat platbu': 'Simulate payment',
    'Dokončit objednávku': 'Complete order',
    'Souhlasím s podmínkami nákupu.': 'I agree to the purchase terms.',
    'Souhlasím s obchodními podmínkami.': 'I agree to the terms and conditions.',
    'Souhlasím s podmínkami nákupu a zpracováním údajů.': 'I agree to the purchase terms and data processing.',
    'Zkontroluj jméno a platný e-mail.': 'Check your name and enter a valid email address.',
    'Ukázková platba byla zamítnuta. Košík zůstává beze změny. Zkus úspěšnou simulaci.': 'The test payment was declined. Your basket is unchanged. Try a successful test payment.',
    'Košík se mezitím změnil v jiné kartě. Zkontroluj nový výběr a součet a objednávku potvrď znovu.': 'Your basket changed in another tab. Check the updated selection and total, then confirm your order again.',
    'Některé místo už není dostupné. Obnov košík a vyber jiné.': 'A selected place is no longer available. Refresh your basket and choose another.',
    'PDF vstupenky byly připraveny ke stažení.': 'Your PDF tickets are ready to download.',
    'Dokončená objednávka': 'Completed order',
    'Objednávka dokončena': 'Order completed',
    'Vstupenky ke stažení': 'Download your tickets',
    'Stáhnout PDF vstupenky': 'Download PDF tickets',
    'Zpět na festival': 'Back to the festival',
    'Přihlášený účet': 'Signed-in account',
    'Informace o účtu': 'Account details',
    'Odhlásit se': 'Log out',
    'Historie objednávek': 'Order history',
    'Zatím tu nejsou žádné objednávky.': 'You have no orders yet.',
    'Způsob přístupu': 'Account access',
    'Přihlásit se': 'Log in',
    'Vytvořit účet': 'Create account',
    '10–128 znaků.': '10–128 characters.',
    '10–128 znaků. Nepoužívej své skutečné heslo.': '10–128 characters. Use a password you do not use elsewhere.',
    'Zadej platný e-mail.': 'Enter a valid email address.',
    'Heslo musí mít 10 až 128 znaků.': 'Your password must contain 10 to 128 characters.',
    'Jméno musí obsahovat alespoň dva znaky.': 'Your name must contain at least two characters.',
    'Tento e-mail už má v prohlížeči demo účet. Přihlas se.': 'An account with this email already exists here. Log in instead.',
    'Tento e-mail už má účet. Přihlas se.': 'An account with this email already exists. Log in instead.',
    'Nesprávný e-mail nebo heslo.': 'Incorrect email or password.',
    'Přihlášení se nepodařilo.': 'Unable to log in.',
    'Tento prohlížeč nepodporuje bezpečné zpracování hesla. Použij moderní prohlížeč.': 'This browser does not support secure password processing. Use a current browser.',
    'Prohlížeč nepovolil uložení. Povolte místní úložiště a zkuste to znovu.': 'Your browser blocked storage. Allow local storage and try again.',
    'Něco se nepodařilo': 'Something went wrong',
    'Zkus to prosím znovu.': 'Please try again.',
    'Pokud problém přetrvává, otevři web v aktuálním prohlížeči s povoleným místním úložištěm.': 'If the problem persists, use a current browser with local storage enabled.',
    'Přehrát video': 'Play video',
    'Pozastavit video': 'Pause video',
    'Vypnout zvuk': 'Mute',
    'Zapnout zvuk': 'Unmute',
    'Všech 60 jmen': 'All 60 artists',
    'Kompletní program': 'Full programme',
    'Program dne': 'Day programme',
    'Prohlédnout scény': 'Explore the stages',
    'Praha, Česká republika': 'Prague, Czech Republic',
    'Česká republika': 'Czech Republic',
    'Vltava Park, Praha': 'Vltava Park, Prague',
    'Školní projekt': 'Student project',
    'Fiktivní festival': 'Fictional festival',
    'Skupina': 'Band',
    'Elektronika': 'Electronic',
    'Elektronická Noc': 'Electronic Night',
    'Areál – Hala A': 'Festival grounds – Hall A',
    'Areál – Open Air': 'Festival grounds – Open Air',
    'Areál – Hala B': 'Festival grounds – Hall B',
    'Hlavní krytá hala pro večerní headline sety a velké koncerty.': 'The main indoor hall for evening headline sets and major concerts.',
    'Open-air stage u řeky pro odpolední koncerty a sunset program.': 'An open-air stage by the river for afternoon shows and sunset sessions.',
    'Menší klubová scéna pro intimnější sety, DJs a afterparty.': 'A smaller club stage for intimate sets, DJs and afterparties.',
    'Třídenní vstupenka pro běžný vstup do areálu.': 'A three-day pass with standard admission to the festival grounds.',
    'Rozšířený vstup se samostatnou zónou a rychlejším odbavením.': 'Premium admission with a dedicated area and fast-track entry.',
    'Jednodenní vstupenka na vybraný festivalový den.': 'A one-day ticket for your selected festival day.',
    'Lorem ipsum – stručný popis programu / vystoupení.': 'Live music, festival energy and a shared stage by the Vltava.',
    'Neděle': 'Sunday',
    'Pondělí': 'Monday',
    'Sobota': 'Saturday',
    'SRPEN': 'AUGUST',
    'SRPNA': 'AUGUST',
    'srpna': 'August',
    'srpen': 'August'
  };

  const patterns = [
    [/^(\d[\d\s,.\u00a0]*) Kč$/, (_, amount) => `CZK ${amount}`],
    [/^OBJEDNÁVKA (.*)$/, (_, id) => `ORDER ${id}`],
    [/^Vybrat (VIP|Regular|Stání)$/, (_, type) => `Choose ${translate(type)}`],
    [/^(\d+) z (\d+) vystoupení$/, (_, n, total) => `${n} of ${total} performances`],
    [/^(\d+) účinkujících$/, (_, n) => `${n} artists`],
    [/^(\d+) výsledků pro „(.*)“$/, (_, n, q) => `${n} results for “${q}”`],
    [/^(\d+) vstupenek přidáno do košíku\.$/, (_, n) => `${n} ticket${n === '1' ? '' : 's'} added to your basket.`],
    [/^Stání: (\d+) volných míst · vybráno (\d+)$/, (_, free, chosen) => `Standing: ${free} available places · ${chosen} selected`],
    [/^Kapacita ([\d\s,.\u00a0]+) návštěvníků$/, (_, n) => `Capacity: ${n} visitors`],
    [/^Košík \((\d+)\)$/, (_, n) => `Basket (${n})`],
    [/^ŘADA ([A-F]) · (VIP|REGULAR)$/, (_, row, type) => `ROW ${row} · ${type}`],
    [/^Akce (\d+)$/, (_, n) => `Performance ${n}`],
    [/^Den (\d+)$/, (_, n) => `Day ${n}`],
    [/^(.*) je fiktivní (solo|skupina) zaměřený na žánr (.*) a živá festivalová vystoupení\.$/, (_, name, type, genre) => `${name} is a fictional ${type === 'solo' ? 'solo artist' : 'band'} performing ${genre === 'elektronika' ? 'electronic music' : genre} live on the festival circuit.`],
    [/^Prague (?:Pulse Fest|Rocks Festival) je fiktivní třídenní multižánrový festival kombinující koncerty, DJ sety a doprovodný program v městském areálu v Praze\.$/, () => 'Prague Pulse Fest is a fictional three-day multi-genre festival bringing concerts, DJ sets and a full programme to an urban venue in Prague.'],
    [/^Přihlášen jako\s*$/, () => 'Signed in as '],
    [/^Odebrat z oblíbených: (.*)$/, (_, name) => `Remove from favourites: ${translate(name)}`],
    [/^Přidat do oblíbených: (.*)$/, (_, name) => `Add to favourites: ${translate(name)}`],
    [/^Odebrat (.+)$/, (_, name) => `Remove ${translate(name)}`],
    [/^Objednávka (.*)$/, (_, id) => `Order ${id}`],
    [/^(.*) · (\d[\d\s,.\u00a0]*) Kč$/, (_, text, n) => `${translate(text)} · CZK ${n}`],
    [/^(.*) · Kód: (.*)$/, (_, text, id) => `${translate(text)} · Code: ${id}`],
    [/^([A-F][1-8]), (VIP|Regular), (\d+) Kč, (obsazeno|v košíku|vybráno|volné)$/, (_, seat, type, amount, state) => `${seat}, ${type}, CZK ${amount}, ${translate(state)}`]
  ];
  const phrases = {
    'Přidat místo ke stání': 'Add a standing place',
    'ŘADA': 'ROW',
    '3 dny': '3 days',
    'místo ke stání': 'standing place',
    'místa ke stání': 'standing places',
    'všechny scény': 'all stages',
    'všechny tři scény': 'all three stages',
    'sedadlo': 'seat',
    'nově obsazeno, odeber místo': 'no longer available; remove this place',
    'Přihlášen jako': 'Signed in as',
    'Odebrat z oblíbených': 'Remove from favourites',
    'Přidat do oblíbených': 'Add to favourites',
    'Kapacita': 'Capacity',
    'návštěvníků': 'visitors',
    'Jednodenní vstup': 'One-day admission',
    'Třídenní vstup': 'Three-day admission',
    'Jednodenní': 'One-day',
    'Třídenní': 'Three-day',
    'volných míst': 'available places',
    'Vybrat vstupenky': 'Choose tickets',
    'Vstupenky na tento den': 'Tickets for this day',
    'Stáhnout PDF vstupenky': 'Download PDF tickets',
    'Vybrat další vstupenky': 'Choose more tickets',
    'Přihlásit se nebo registrovat': 'Log in or register',
    'Přihlásit se': 'Log in',
    'Vytvořit účet': 'Create account',
    'Vyhledat': 'Search',
    'Přidat do košíku': 'Add to basket',
    'Přejít do košíku': 'Go to basket',
    'Přidat další místa': 'Add more places',
    'Vybrat místa': 'Choose places',
    'Zobrazit detail': 'View details',
    'Zpět na festival': 'Back to the festival',
    'Historie objednávek': 'Order history',
    'Praktické informace': 'Visitor information',
    'Praktické info': 'Visitor info',
    'Program 2027': 'Programme 2027',
    'Můj účet': 'My account',
    'Účinkující': 'Artists',
    'Vstupenky': 'Tickets',
    'Košík': 'Basket',
    'Stání': 'Standing',
    'stání': 'standing',
    'Scéna': 'Stage',
    'Scény': 'Stages',
    'Program': 'Programme',
    'Skupina': 'Band',
    'Elektronika': 'Electronic',
    'Kód:': 'Code:',
    'Celkem': 'Total',
    'vybráno': 'selected',
    'obsazeno': 'occupied',
    'v košíku': 'in basket',
    'volné': 'available',
    '1.–3. srpna': '1–3 August',
    '1.–3. SRPNA': '1–3 AUGUST',
    'srpna': 'August',
    'SRPNA': 'AUGUST',
    'SRPEN': 'AUGUST',
    'tři scény': 'three stages',
    'Praha': 'Prague',
    'PRAHA': 'PRAGUE'
  };
  const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const replacements = Object.entries(phrases).sort((a, b) => b[0].length - a[0].length).map(([from, to]) => [new RegExp(`(?<![\\p{L}])${escapeRegExp(from)}(?![\\p{L}])`, 'gu'), to]);
  const missing = new Set();
  // Artist names and monograms retain their identity in both languages.
  const properNames = [...new Set((window.FESTIVAL_DATA?.performers || []).flatMap(p => [p.name, p.name.split(' ').map(word => word[0]).join('')]))].sort((a,b) => b.length-a.length);

  function translate(text) {
    const source = String(text ?? '');
    if (lang !== 'en' || !source.trim()) return source;
    const leading = source.match(/^\s*/)[0], trailing = source.match(/\s*$/)[0];
    const trimmed = source.trim().replace(/\s+/g, ' ');
    if (properNames.includes(trimmed)) return source;
    if (Object.prototype.hasOwnProperty.call(dictionary, trimmed)) return leading + dictionary[trimmed] + trailing;
    for (const [pattern, render] of patterns) {
      if (pattern.test(trimmed)) return leading + trimmed.replace(pattern, render) + trailing;
    }
    // Compound labels contain independently translated text around presentation separators.
    for (const separator of [' | ', ' · ', ' / ']) {
      if (trimmed.includes(separator)) return leading + trimmed.split(separator).map(translate).join(separator) + trailing;
    }
    const arrow = trimmed.match(/^(.*?)(\s+[→↓↗])$/);
    if (arrow) return leading + translate(arrow[1]) + arrow[2] + trailing;
    let result = trimmed;
    for (const [pattern, replacement] of replacements) result = result.replace(pattern, replacement);
    const diagnosticText = properNames.reduce((text,name) => text.split(name).join(''),result);
    if (/[ěščřžýáíéůúďťň]/i.test(diagnosticText) && !/@|https?:|Výstavišt|VÝSTAVIŠT|Štvanice|Bubensk|Holešovic|Na Štvanici/.test(result)) missing.add(trimmed);
    return leading + result + trailing;
  }

  const excluded = 'script,style,code,pre,textarea,noscript,[data-no-translate],[translate="no"],.account-name';
  function protectedNode(node) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    return !element || Boolean(element.closest(excluded));
  }
  function translateElement(element) {
    if (protectedNode(element)) return;
    // An option without an explicit value uses its visible label as its value.
    if (element.tagName === 'OPTION' && !element.hasAttribute('value')) element.setAttribute('value', element.textContent);
    for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
      if (element.hasAttribute(attribute)) {
        const original = element.getAttribute(attribute), translated = translate(original);
        if (translated !== original) element.setAttribute(attribute, translated);
      }
    }
    if (element.matches('meta[name="description"],meta[property="og:description"],meta[property="og:title"]')) {
      const original = element.getAttribute('content'), translated = translate(original);
      if (translated !== original) element.setAttribute('content', translated);
    }
  }
  function apply(root = document) {
    if (lang !== 'en' || !root) return;
    if (root.nodeType === 3) {
      if (!protectedNode(root)) { const translated = translate(root.nodeValue); if (translated !== root.nodeValue) root.nodeValue = translated; }
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1) translateElement(node);
      else if (!protectedNode(node)) { const translated = translate(node.nodeValue); if (translated !== node.nodeValue) node.nodeValue = translated; }
    }
  }
  function languageButtons() {
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
      button.setAttribute('lang', button.dataset.lang);
    });
  }
  function setLanguage(code) {
    if (!['cs', 'en'].includes(code) || code === lang) return;
    try { localStorage.setItem(key, code); } catch { return; }
    location.reload();
  }
  window.PulseI18n = Object.freeze({ lang, t: translate, apply, setLanguage, missing: () => [...missing] });
  document.documentElement.lang = lang;
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-lang]');
    if (button) { event.preventDefault(); setLanguage(button.dataset.lang); }
  });
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') { record.addedNodes.forEach(apply); }
      else if (record.type === 'characterData') apply(record.target);
      else if (record.type === 'attributes') translateElement(record.target);
    }
    languageButtons();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'placeholder', 'alt', 'content'] });
  function ready() { apply(document); languageButtons(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
})();
