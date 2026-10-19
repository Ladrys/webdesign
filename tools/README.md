# Nástroje pro údržbu

Hotový web se otevře přes `web/index.html`. Tyto nástroje používá autor
při změně zdrojů; návštěvník je nepotřebuje.

| Nástroj | Vstup → výstup |
| --- | --- |
| `generate_data.py` | XML → čtyři JSON exporty, `web/js/data.js` a kořenové kopie XML/XSD |
| `build_course_submissions.py` | `course-source/`, data a web → školní balíčky, prezentace a poznámky |
| `build_documentation.py` | `documentation.md` → Word a PDF v `docs/` |
| `fonts/` | Fonty a licence pro přenosné PDF prezentací a dokumentace |

Upravujte zdroje, potom obnovte výstupy. Generátor dat používá standardní
knihovnu Pythonu. Export školních balíčků přepisuje hotové kopie;
`--include-web` přibalí aktuální web.

[Vývojový postup](../docs/DEVELOPMENT.md) · [Datový tok](../docs/PROJECT-GUIDE.md)
