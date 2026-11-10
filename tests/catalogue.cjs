const fs = require('node:fs'),
  vm = require('node:vm'),
  assert = require('node:assert/strict');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('web/js/data.js', 'utf8'), sandbox);
const data = JSON.parse(JSON.stringify(sandbox.window.FESTIVAL_DATA));
for (const key of ['festival', 'venues', 'performers', 'events'])
  assert.deepEqual(data[key], JSON.parse(fs.readFileSync('data/json/' + key + '.json', 'utf8')));
for (const day of data.festival.dates)
  for (const venue of data.venues) {
    const shows = data.events
      .filter((e) => e.dayId === day.id && e.venueId === venue.id)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 1; i < shows.length; i++) {
      const minutes = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
      assert(minutes(shows[i].startTime) - minutes(shows[i - 1].endTime) >= 30);
    }
  }
for (const name of fs.readdirSync('web').filter((f) => f.endsWith('.html'))) {
  const source = fs.readFileSync('web/' + name, 'utf8');
  for (const m of source.matchAll(/(?:src|href)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const ref = m[1];
    if (/^(?:https?:|mailto:|tel:|data:|\/)/.test(ref)) continue;
    assert(fs.existsSync(require('node:path').join('web', ref)), name + ' missing ' + ref);
  }
}
console.log('PASS complete JSON/data.js equality, stage changeovers and local HTML dependencies');
