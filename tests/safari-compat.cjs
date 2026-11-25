// Feature regression on the offline entry point. This runs in Chromium, not Safari.
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const Browser = require('../tools/browser-test.cjs');

(async () => {
  const b = await Browser.connect();
  const entry = pathToFileURL(path.resolve(process.env.PULSE_FILE_ENTRY || 'web/index.html')).href;
  const { identifier } = await b.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
    window.RegExp = new Proxy(RegExp, {construct(target,args) {
      if (typeof args[0] === 'string' && (args[0].includes('(?<!') || args[0].includes('(?<=')))
        throw new SyntaxError('Lookbehind unsupported in this test');
      return Reflect.construct(target,args);
    }});
    Object.hasOwn = undefined;
    HTMLDialogElement.prototype.showModal = undefined;
    HTMLDialogElement.prototype.close = undefined;
    Object.defineProperty(window, 'localStorage', {get(){throw new DOMException('Storage disabled','SecurityError')}});
  `,
  });
  async function waitFor(check) {
    for (let i = 0; i < 100; i++) {
      try {
        if (await b.evaluate(check)) return;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw Error('Offline compatibility check failed: ' + check);
  }
  try {
    await b.goto(entry + '?page=program.html&lang=cs');
    await b.evaluate("document.querySelector('[data-lang=en]').click()");
    await waitFor(
      "document.documentElement.lang==='en' && document.querySelector('.timeline-event')",
    );
    assert.equal(
      await b.evaluate("document.querySelector('main h1').textContent"),
      'Programme 2027',
    );
    assert.equal(
      await b.evaluate("PulseI18n.t('x Kapacita, návštěvníků y')"),
      'x Capacity, visitors y',
    );
    await b.evaluate("document.querySelector('[data-event]').click()");
    assert.ok(
      await b.evaluate("document.querySelector('#detail[open] #dialog-title').textContent"),
    );
    await b.evaluate("document.querySelector('#detail .close').click()");
    assert.equal(await b.evaluate("document.querySelector('#detail').hasAttribute('open')"), false);
    await b.evaluate('document.querySelector(\'.nav a[href="tickets.html"]\').click()');
    await waitFor(
      "document.documentElement.lang==='en' && document.querySelector('#ticket-category')?.value==='standing'",
    );
    await b.evaluate("document.querySelector('[data-lang=cs]').click()");
    await waitFor(
      "document.documentElement.lang==='cs' && !!document.querySelector('#ticket-category')",
    );
    assert.deepEqual(b.errors, []);
    console.log(
      'PASS offline language switch, navigation, ticket selection and concert detail with older browser features and blocked local storage',
    );
  } finally {
    await b.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
    b.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
