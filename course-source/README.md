# Podklady prezentací a odevzdání

**Autoři:** Michal Ladra, Matěj Mlejnek, Jan Martínek.

Tato složka obsahuje zdroje školních podkladů. Hotové soubory pro Moodle jsou
v [`odevzdani/`](../odevzdani/README.md); tuto zdrojovou složku neodevzdávejte
místo nich.

| Zdroj | Výstup |
| --- | --- |
| `presentations.json` | Prezentace 02–06 v PPTX a PDF, poznámky pro přednášející |
| `c02-specification.md` | Projektová specifikace pro cvičení 02 |
| `c03-progress-02.md` až `c05-progress-04.md` | Stručné zprávy o milnících |
| `prototype/` | Samostatný funkční wireframe pro cvičení 03 |
| `c06-review-template.md` | Formulář pro skutečné hodnocení cizího projektu |

Každá prezentace má šest snímků a poznámky pro 3–5 minut včetně krátké ukázky.
Texty vysvětlují rozhodnutí, použití AI a konkrétní ověření. Podrobnosti patří
do poznámek, ne do přeplněných snímků.

Podklady jsou sestavené ze současného projektu podle jednotlivých milníků.
Nejsou archivem historických odevzdání. Cvičení 04 a 05 proto obsahují stejný
současný web. Prezentace a review pro cvičení 06 jsou **šablony k doplnění**:
přidělený cizí projekt ani skutečné nálezy nebyly dodány.

## Úprava a export

Upravte zdroje zde a potom z kořene repozitáře spusťte:

```sh
python tools/build_course_submissions.py --include-web
```

Builder zkopíruje podklady a web, zkontroluje datové vazby a vytvoří prezentace.
Vyžaduje Python a vývojové knihovny uvedené v návodu repozitáře. **Pro otevření
webu ani prezentací nejsou tyto nástroje potřeba.**
