# Nástroje pro údržbu

Pro spuštění hotového webu nejsou potřeba. Podrobný postup: [DEVELOPMENT.md](../docs/DEVELOPMENT.md).

| Soubor | Účel |
| --- | --- |
| `generate_data.py` | Reprodukovatelný XML → JSON/data.js export |
| `test-server.cjs`, `browser-test.cjs` | Izolovaný statický server a připojení testovacího Chrome |
| `prepare-static.cjs` | Obnova výchozího HTML obsahu ze stejných dat |
| `capture-preview.cjs` | Aktuální snímky webu pro dokumentaci |
| `package-submissions.ps1` | Čisté balíčky pro cvičení 4, 5 a finální projekt |

Jednorázové migrace, historické generátory a jejich fonty byly přesunuty do archivu mimo finální projekt. Při změně zdrojů obnovte příslušné odvozené soubory; generované ZIP balíčky se neukládají do repozitáře.
