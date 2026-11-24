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

vm.runInNewContext(fs.readFileSync('web/js/admission.js', 'utf8'), sandbox);
const admission = sandbox.window.PulseAdmission;
const show = (dayId, venueId) => ({ dayId, venueId });
assert.equal(admission.recommend([]), null);
assert.equal(admission.recommend([show('d1', 'h2'), show('d1', 'h2')]).total, 110);
const combined = admission.recommend([show('d1', 'h1'), show('d1', 'h3'), show('d3', 'h3')]);
assert.equal(combined.total, 280);
assert.deepEqual(Array.from(combined.tickets, (t) => t.venueId).sort(), ['all', 'h3']);
const festival = admission.recommend(data.events);
assert.equal(festival.total, 490);
assert.equal(festival.tickets.length, 1);
const nonconsecutive = admission.recommend([show('d1', 'h3'), show('d3', 'h3')]);
assert.equal(nonconsecutive.total, 180);
assert.deepEqual(Array.from(nonconsecutive.tickets[0].days), ['d1', 'd3']);
const fullyBooked = Array.from({ length: 1500 }, (_, i) =>
  admission.ticketFor('d1', 'S' + (i + 1), 'day', ['d1'], 'h3'),
);
assert.equal(admission.recommend([show('d1', 'h3')], { cart: fullyBooked }), null);
console.log(
  'PASS recommended tariffs, repeated shows, mixed passes, nonconsecutive dates and unavailable admission',
);
