/* Daily admissions come from the same validated orders as checkout. */
(function () {
  'use strict';
  const D = window.FESTIVAL_DATA, A = window.PulseAdmission;
  const edition = Number(D.festival.dates[0].date.slice(0, 4));
  const dayIds = D.festival.dates.map(day => day.id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const language = () => window.PulseI18n?.lang === 'en' ? 'en' : 'cs';
  const read = key => { try { const value = JSON.parse(localStorage.getItem('pulse:' + key)); return Array.isArray(value) ? value : []; } catch { return []; } };
  function cartItems() {
    let auth;
    try { auth = JSON.parse(localStorage.getItem('pulse:auth')); } catch { /* Guest cart. */ }
    const validUser = user => user && ['id','name','email','salt','hash'].every(field => typeof user[field] === 'string')
      && /^[a-f0-9]{32}$/.test(user.salt) && /^[a-f0-9]{64}$/.test(user.hash);
    const user = Number.isFinite(auth?.expires) && auth.expires > Date.now()
      && read('users').filter(validUser).some(user => user.id === auth.id) ? auth.id : 'guest';
    return read('cart:' + user).filter(A.validTicket);
  }
  function snapshot({venueId = 'all', days = dayIds} = {}) {
    const venues = D.venues.filter(venue => venueId === 'all' || venue.id === venueId);
    const chosen = dayIds.filter(id => days.includes(id));
    // Match checkout's whole-order eligibility, including malformed mixed records.
    const orders = read('orders').filter(order => order && typeof order.id === 'string'
      && Array.isArray(order.tickets) && order.tickets.every(A.validTicket));
    const sold = A.committed(orders, edition), cart = cartItems();
    const admits = (ticket, venue, day) => A.days(ticket).includes(day) && (A.venueId(ticket) === 'all' || A.venueId(ticket) === venue);
    return venues.flatMap(venue => chosen.map(dayId => {
      const count = sold.filter(ticket => admits(ticket, venue.id, dayId)).length;
      return {venueId: venue.id, venueName: venue.name, dayId, capacity: venue.capacity,
        sold: count, remaining: Math.max(0, venue.capacity - count), inCart: cart.filter(ticket => admits(ticket, venue.id, dayId)).length};
    }));
  }
  function content(options = {}) {
    const en = language() === 'en', locale = en ? 'en-GB' : 'cs-CZ', rows = snapshot(options);
    const integer = value => value.toLocaleString(locale);
    if (!rows.length) return `<p class="capacity-empty">${en ? 'Choose your festival days to see availability.' : 'Vyber festivalové dny pro zobrazení kapacity.'}</p>`;
    return `${options.title === false ? '' : `<p class="capacity-heading">${en ? 'Stage availability by day' : 'Kapacita scén podle dne'}</p>`}<div class="capacity-grid">${rows.map(row => {
      const day = D.festival.dates.find(day => day.id === row.dayId);
      const date = new Intl.DateTimeFormat(locale, {day:'numeric',month:'short'}).format(new Date(day.date + 'T12:00:00'));
      return `<div class="capacity-row" data-capacity-stage="${row.venueId}" data-capacity-day="${row.dayId}" data-capacity-sold="${row.sold}" data-capacity-remaining="${row.remaining}"><div class="capacity-label"><strong>${esc(row.venueName)}</strong><time datetime="${day.date}">${esc(date)}</time></div><div class="capacity-figures"><span><b>${integer(row.remaining)}</b> ${en ? 'remaining' : 'zbývá'}</span><span>${integer(row.sold)} / ${integer(row.capacity)} ${en ? 'sold' : 'obsazeno'}</span></div><meter min="0" max="${row.capacity}" value="${Math.min(row.capacity,row.sold)}" aria-label="${esc(row.venueName + ' · ' + date + (en ? ' sold capacity' : ' obsazenost'))}">${row.sold} / ${row.capacity}</meter>${row.inCart ? `<small>${row.inCart} ${en ? 'in your cart' : 'v tvém košíku'}</small>` : ''}</div>`;
    }).join('')}</div>`;
  }
  function html({venueId = 'all', days = dayIds, compact = false, title = true} = {}) {
    const options = {venueId, days, compact, title};
    return `<div class="capacity-panel${compact ? ' capacity-compact' : ''}" data-capacity-venue="${esc(venueId)}" data-capacity-days="${esc(days.join(','))}"${title ? '' : ' data-capacity-title="false"'}>${content(options)}</div>`;
  }
  function mount(root = document) {
    const nodes = [...root.querySelectorAll('[data-capacity-venue]')];
    if (root.matches?.('[data-capacity-venue]')) nodes.unshift(root);
    nodes.forEach(node => { node.classList.add('capacity-panel'); node.innerHTML = content({venueId: node.dataset.capacityVenue,
      days: node.dataset.capacityDays === undefined ? dayIds : node.dataset.capacityDays.split(',').filter(Boolean), title: node.dataset.capacityTitle !== 'false'}); });
  }
  window.addEventListener('storage', event => { if (event.key === null || event.key?.startsWith('pulse:')) mount(); });
  window.PulseCapacity = Object.freeze({snapshot, html, mount});
}());
