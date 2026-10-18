# Zdrojové podklady školního odevzdání

Tato složka obsahuje udržovatelné podklady pro `tools/build_course_submissions.py`.
Hotové složky pro Moodle vytváří builder do `odevzdani/`. Běžný návštěvník webu
Python ani prezentační knihovny nepotřebuje.

Materiály jednotlivých cvičení jsou **dodatečně připravené ukázky milníků podle
zadání**, nikoli záznam skutečných dřívějších odevzdání nebo konzultací. Cvičení
04 a 05 obsahují stejný současný web záměrně: historické verze z těchto cvičení
nebyly doloženy. Cvičení 03 má vlastní nově sestavený interaktivní wireframe.

Prezentace jsou současně v editovatelném PPTX a ve stabilním PDF. Jejich scénář
je v `presenter-notes.md`, také v poznámkách snímků PPTX. Pro cvičení 02–05 jde
o šest snímků přibližně na čtyři minuty. Prezentaci 06 je třeba po obdržení
cizího projektu doplnit skutečnými výsledky; připravená metodika je jasně označená.

Skutečný přidělený projekt pro cross-review, přijaté review, jména týmu,
časová osa a odsouhlasení výraznějšího redesignu a přechodu na skutečné interprety nebyly poskytnuty. Nejsou
nahrazeny smyšlenými údaji. `c06-review-template.md` obsahuje přesný postup,
tabulku nálezů i odlišené příklady vlastního ověření.

```sh
python tools/build_course_submissions.py --output /tmp/prague-pulse-submissions
```

Bez `--include-web` se vytvoří texty, prototyp a prezentace, ale nekopíruje se
rozpracovaný web. Úplné odevzdání z hotové a ověřené verze:

```sh
python tools/build_course_submissions.py --include-web
```

Tvorba podkladů vyžaduje vývojové knihovny `python-pptx`, `reportlab` a Pillow.
Ty nejsou součástí požadavků na spuštění odevzdaného webu.
