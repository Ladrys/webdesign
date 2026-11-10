// Optional authoring step: ships meaningful HTML to crawlers without requiring JS.
const fs = require('node:fs');
const B = require('./browser-test.cjs');
(async () => {
  const b = await B.connect();
  try {
    await b.goto('index.html');
    await b.evaluate(
      "localStorage.clear();localStorage.setItem('pulse:privacy',JSON.stringify({version:1,externalMaps:false,savedAt:Date.now()}))",
    );
    const pages = fs
      .readdirSync('web')
      .filter((f) => f.endsWith('.html') && f !== 'performer.html');
    for (const page of pages) {
      await b.goto(page);
      const dom = await b.evaluate(
        `({header:document.querySelector('header').innerHTML,main:document.querySelector('main').innerHTML,footer:document.querySelector('footer').innerHTML})`,
      );
      let source = fs.readFileSync('web/' + page, 'utf8');
      source = source.replace(
        /<header id="header">[\s\S]*?<\/header>/,
        () => '<header id="header">' + dom.header + '</header>',
      );
      source = source.replace(
        /<main id="obsah" tabindex="-1">[\s\S]*?<\/main>/,
        () =>
          '<main id="obsah" tabindex="-1">' +
          dom.main +
          '<noscript><p>Pro interaktivní filtry, osobní program a nákupní ukázku zapněte JavaScript.</p></noscript></main>',
      );
      source = source.replace(
        /<footer id="footer">[\s\S]*?<\/footer>/,
        () => '<footer id="footer">' + dom.footer + '</footer>',
      );
      fs.writeFileSync('web/' + page, source);
    }
    console.log(
      'Static HTML content prepared for',
      pages.length,
      'pages; runtime remains pure client-side.',
    );
  } finally {
    b.close();
  }
})();
