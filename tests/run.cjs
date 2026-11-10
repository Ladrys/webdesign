const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
process.chdir(path.resolve(__dirname, '..'));
const env = {
  ...process.env,
  PULSE_TEST_PORT: process.env.PULSE_TEST_PORT || '4183',
  PULSE_CDP_PORT: process.env.PULSE_CDP_PORT || '9343',
};
const server = spawn(process.execPath, ['tools/test-server.cjs'], {
  env,
  stdio: 'inherit',
  windowsHide: true,
});
async function run(file) {
  await new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [file], { env, stdio: 'inherit', windowsHide: true });
    p.on('error', reject);
    p.on('exit', (code) => (code ? reject(Error(file + ' failed with ' + code)) : resolve()));
  });
}
(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 300; i++) {
      try {
        await fetch('http://127.0.0.1:' + env.PULSE_CDP_PORT + '/json');
        ready = true;
        break;
      } catch {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    if (!ready) {
      const log = 'test-artifacts/chromium.log';
      if (fs.existsSync(log)) console.error(fs.readFileSync(log, 'utf8').slice(-4000));
      throw Error('Test Chromium could not start; set CHROMIUM_PATH.');
    }
    await run('tests/audit.cjs');
    await run('tests/scenarios.cjs');
    const report = JSON.parse(fs.readFileSync('test-artifacts/audit.json', 'utf8'));
    if (
      report.errors.length ||
      report.report.some(
        (r) =>
          r.overflow ||
          r.h1 !== 1 ||
          r.missing?.length ||
          r.brokenProgramme ||
          r.duplicateIds?.length,
      )
    )
      throw Error('Page audit found an issue; inspect test-artifacts/audit.json');
    console.log('All current browser checks passed.');
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    try {
      const B = require('../tools/browser-test.cjs');
      process.env.PULSE_CDP_PORT = env.PULSE_CDP_PORT;
      const b = await B.connect();
      await b.send('Browser.close');
      b.close();
    } catch {}
    server.kill();
  }
})();
