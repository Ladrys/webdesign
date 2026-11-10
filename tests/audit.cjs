const BrowserTest = require('../tools/browser-test.cjs');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
(async () => {
  const b = await BrowserTest.connect();
  const pages = [
    'index.html',
    'program.html',
    'performers.html',
    'performer.html?id=i1',
    'venues.html',
    'info.html',
    'search.html?q=David',
    'tickets.html',
    'cart.html',
    'account.html',
    'news.html',
    'privacy.html',
    'terms.html',
    'credits.html',
  ];
  const report = [];
  try {
    await b.goto('index.html');
    await b.evaluate('localStorage.clear()');
    for (const lang of ['cs', 'en']) {
      await b.evaluate(`localStorage.setItem('prf:language','${lang}')`);
      for (const page of pages) {
        await b.goto(page);
        const snapshot = await b.evaluate(
          `({title:document.title,h1:document.querySelectorAll('main h1').length,lang:document.documentElement.lang,missing:PulseI18n.missing(),brokenProgramme:/[Pp]rogrammme/.test(document.body.innerText),duplicateIds:[...document.querySelectorAll('[id]')].map(n=>n.id).filter((id,i,a)=>a.indexOf(id)!==i),links:[...document.querySelectorAll('a[data-artist]')].length})`,
        );
        report.push({ lang, page, ...snapshot });
        for (const width of [320, 375, 768, 1024, 1440]) {
          await b.send('Emulation.setDeviceMetricsOverride', {
            width,
            height: 900,
            deviceScaleFactor: 1,
            mobile: width < 768,
          });
          const overflow = await b.evaluate('document.documentElement.scrollWidth>innerWidth+1');
          if (overflow)
            report.push({
              lang,
              page,
              width,
              overflow,
              elements: await b.evaluate(
                "[...document.querySelectorAll('main *,header *,footer *')].filter(n=>n.getBoundingClientRect().right>innerWidth+2&&getComputedStyle(n).position!=='absolute').slice(0,8).map(n=>({tag:n.tagName,cls:n.className,right:n.getBoundingClientRect().right}))",
              ),
            });
        }
      }
    }
    fs.mkdirSync(path.join(root, 'test-artifacts'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'test-artifacts/audit.json'),
      JSON.stringify({ date: new Date().toISOString(), errors: b.errors, report }, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          pages: report.filter((r) => !r.overflow).length,
          issues: report.filter(
            (r) =>
              r.overflow ||
              r.h1 !== 1 ||
              r.missing?.length ||
              r.brokenProgramme ||
              r.duplicateIds?.length,
          ),
          errors: b.errors,
        },
        null,
        2,
      ),
    );
  } finally {
    b.close();
  }
})();
