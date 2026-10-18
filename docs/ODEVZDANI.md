# Co odevzdat na jednotlivá cvičení

Autoři: **Michal Ladra, Matěj Mlejnek, Jan Martínek**. Připravené soubory jsou ve složce [`odevzdani/`](../odevzdani/README.md). Před prezentací odevzdejte také prezentaci, kterou budete promítat.

| Termín | Požadované soubory | Připravená složka |
| --- | --- | --- |
| **Cvičení 2** | `project-specification.md`, `data.xml`, použitá prezentace (`prezentace.pptx` / `prezentace.pdf`) | [`cviceni-02-specifikace`](../odevzdani/cviceni-02-specifikace/) |
| **Cvičení 3** | Celá složka `prototype/`, `progress-02.md`, použitá prezentace | [`cviceni-03-prototyp`](../odevzdani/cviceni-03-prototyp/) |
| **Cvičení 4** | Celá složka `web/`, `progress-03.md`, použitá prezentace | [`cviceni-04-implementace`](../odevzdani/cviceni-04-implementace/) |
| **Cvičení 5** | Celá review-ready složka `web/`, `progress-04.md`, použitá prezentace. Pro druhý tým také `project-specification.md`. | [`cviceni-05-review-ready`](../odevzdani/cviceni-05-review-ready/) |
| **Cvičení 6** | `review.md` k přidělenému **cizímu projektu**, použitá prezentace | [`cviceni-06-cross-review`](../odevzdani/cviceni-06-cross-review/) — zatím šablona |
| **Finální projekt** | Celá složka `projekt/` ve struktuře níže | [`finalni-projekt`](../odevzdani/finalni-projekt/) |

XML je naše zvolená datová základna; není nutné odevzdávat současně XML, JSON i Excel. Složky `web/` a `prototype/` odevzdávejte celé, včetně skriptů, stylů a obrázků. Pokud zadání v Moodlu umožňuje ZIP, zabalte obsah příslušné složky cvičení. Samotné `index.html` nestačí.

`presenter-notes.md` jsou pomůcka pro řečníka. `festival.xsd`, validační reporty a dokumentace u průběžných složek jsou doplňkové materiály; tabulka výše rozlišuje povinné minimum. U prezentací je přiložen editovatelný PowerPoint a PDF se stejným obsahem. Odevzdejte všechny verze, které budete při prezentaci používat.

## Co stručně ukázat

| Cvičení | Obsah prezentace na 3–5 minut |
| --- | --- |
| **2** | Festival a účel webu, cílové skupiny, informační architektura, dva klíčové scénáře, datový rozsah. |
| **3** | Mobilní a desktopový návrh, navigace a průchod dvěma scénáři; alespoň tři smysluplné interaktivní funkce. |
| **4** | Implementovaný web na mobilu i desktopu, navigace, funkční interaktivita, změny oproti návrhu a jejich důvod. |
| **5** | Stav připravený pro review, dva konkrétní scénáře, funkce a známé nedostatky. |
| **6** | Metodika hodnocení, 3–5 skutečných nálezů u cizího projektu, jejich závažnost a doporučené úpravy. |

V každé prezentaci také stručně řekněte **co přibylo od předchozího milníku, jaká rozhodnutí jste udělali, k čemu pomohla AI a jak jste výsledek ověřili**. U AI rozlište přijatý návrh, vlastní úpravu nebo odmítnutí a nalezený limit. Jako ověření uveďte konkrétní postup a výsledek, například filtr → porovnání výsledných ID s XML nebo stažení PDF → kontrola jeho dat a QR.

## Struktura finálního projektu

```text
projekt/
├── project-specification.md
├── prototype/
├── documentation.md
├── data.xml
├── web/
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── images/
│   └── …
└── review/
    └── received-review.md
```

Povinná dokumentace je v Markdownu. Word a PDF jsou doplňkové verze. Současné průběžné balíčky byly připraveny dodatečně z projektu; nejsou důkazem dřívějšího odevzdání. Skutečné přijaté review ani hodnocení dosud nepřiloženého cizího projektu nelze nahradit šablonou. Před finálním odevzdáním doplňte reálná review a skutečné údaje o práci týmu.
