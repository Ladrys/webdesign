# Automatické kontroly

Tyto skripty ověřují projekt při vývoji. Pro otevření webu nejsou potřeba.

| Soubor | Účel |
| --- | --- |
| `browser_smoke.py` | Skutečné průchody webem v Chromium: hledání, filtry, jazyky, účet, nákup, obsazenost, kemp, PDF a responzivita. |
| `course_materials.py` | Kontrola prezentací a poznámek, průchody scénáři interaktivního wireframu. |

Datová a základní kontrola HTML je samostatně v kořenovém [`validate_project.py`](../validate_project.py). Browserové testy samy spustí a ukončí dočasný místní statický server.

[Instalace vývojových závislostí a přesné příkazy](../docs/DEVELOPMENT.md) · [Vysvětlení struktury projektu](../docs/PROJECT-GUIDE.md) · [Výsledky posledního ověření](../validation_report.md)
