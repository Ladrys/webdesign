/* Stage admission, canonical prices and capacity checks shared by booking and PDFs. */
(function () {
  'use strict';

  const data = window.FESTIVAL_DATA;
  const dayIds = data.festival.dates.map(day => day.id);
  const edition = Number(data.festival.dates[0].date.slice(0, 4));
  const venueIds = ['h1', 'h2', 'h3'];
  const scopes = ['day', 'multi', 'festival'];
  const allTariffs = {
    vip: { day: 't5', festival: 't2' },
    regular: { day: 't4', festival: 't1' },
    standing: { day: 't6', festival: 't3' }
  };

  const venue = id => data.venues.find(item => item.id === id);
  const venueId = ticket => ticket?.venueId || 'all';
  const knownVenue = id => id === 'all' || venueIds.includes(id);
  const physicalVenue = id => id === 'all' ? 'h1' : id;
  const admittedVenues = id => id === 'all' ? venueIds : [id];
  const canonicalDays = selected => dayIds.filter(id => Array.isArray(selected) && selected.includes(id));
  const sameArray = (first, second) => first.length === second.length && first.every((item, index) => item === second[index]);

  function categories(id = 'all') {
    if (!knownVenue(id)) return [];
    const prices = venue(physicalVenue(id))?.ticketing?.prices || {};
    return ['vip', 'regular', 'standing'].filter(category => Object.hasOwn(prices, category));
  }

  function price(id, category, count) {
    if (!categories(id).includes(category) || ![1, 2, 3].includes(count)) return null;
    const duration = count === 3 ? 'festival' : 'day';
    const unit = id === 'all'
      ? data.festival.tickets.find(item => item.id === allTariffs[category]?.[duration])?.price
      : venue(id)?.ticketing?.prices?.[category]?.[duration];
    return Number.isFinite(unit) && unit >= 0 ? unit * (count === 2 ? 2 : 1) : null;
  }

  function pool(id, category) {
    if (!categories(id).includes(category)) return [];
    const ticketing = venue(physicalVenue(id)).ticketing;
    if (category === 'standing') {
      return Array.from({ length: ticketing.standingCapacity }, (_, index) => `S${index + 1}`);
    }
    const seats = ticketing.seats[category];
    return seats.rows.flatMap(row => Array.from({ length: seats.perRow }, (_, index) => `${row}${index + 1}`));
  }

  function seatCategory(id, seat) {
    if (typeof seat !== 'string' || !knownVenue(id)) return null;
    const ticketing = venue(physicalVenue(id))?.ticketing;
    if (!ticketing) return null;
    if (/^S[1-9]\d*$/.test(seat)) {
      return Number(seat.slice(1)) <= ticketing.standingCapacity ? 'standing' : null;
    }
    for (const category of categories(id).filter(item => item !== 'standing')) {
      const seating = ticketing.seats[category];
      const match = /^([A-Z]+)([1-9]\d*)$/.exec(seat);
      if (match && seating.rows.includes(match[1]) && Number(match[2]) <= seating.perRow) return category;
    }
    return null;
  }

  function days(ticket) {
    if (!ticket) return [];
    if (ticket.scope === 'festival') return [...dayIds];
    if (ticket.scope === 'multi') return canonicalDays(ticket.days);
    return dayIds.includes(ticket.day) ? [ticket.day] : [];
  }

  // A two-day selection is canonicalised; its order cannot create a second tariff.
  function ticketFor(day, seat, scope = 'day', chosenDays, id = 'all') {
    if (!dayIds.includes(day) || !scopes.includes(scope) || !knownVenue(id)) return null;
    const category = seatCategory(id, seat);
    if (!category) return null;
    const selected = scope === 'festival' ? [...dayIds] : scope === 'multi' ? canonicalDays(chosenDays) : [day];
    if (scope === 'multi' && (!Array.isArray(chosenDays) || chosenDays.length !== 2 || selected.length !== 2)) return null;
    const total = price(id, category, selected.length);
    if (total === null) return null;
    return { day: selected[0], seat, category, scope, days: selected, price: total, venueId: id };
  }

  function validTicket(ticket) {
    if (!ticket || typeof ticket !== 'object' || !scopes.includes(ticket.scope === undefined ? 'day' : ticket.scope)) return false;
    if (ticket.venueId !== undefined && !knownVenue(ticket.venueId)) return false;
    if (ticket.scope === 'multi' && (!Array.isArray(ticket.days) || ticket.days.length !== 2 || !sameArray(ticket.days, canonicalDays(ticket.days)))) return false;
    const expected = ticketFor(ticket.day, ticket.seat, ticket.scope ?? 'day', ticket.days, venueId(ticket));
    return Boolean(expected && ticket.day === expected.day && ticket.category === expected.category && ticket.price === expected.price
      && (ticket.days === undefined || Array.isArray(ticket.days) && sameArray(ticket.days, expected.days)));
  }

  // Removal keys retain the chosen product. Numbered Main Hall chairs share
  // one physical namespace between single-stage and all-stage passes.
  function key(ticket) {
    return `${venueId(ticket)}:${days(ticket).join('+')}:${ticket.seat}`;
  }

  function overlaps(first, second) {
    // Standing references identify cart lines, never a reserved patch of ground.
    if (first.category === 'standing' || second.category === 'standing') {
      return first.category === second.category && key(first) === key(second);
    }
    return physicalVenue(venueId(first)) === physicalVenue(venueId(second)) && first.seat === second.seat
      && days(first).some(day => days(second).includes(day));
  }

  function committed(orders = [], selectedEdition = edition) {
    return orders.filter(order => order && (order.edition ?? 2026) === selectedEdition)
      .flatMap(order => Array.isArray(order.tickets) ? order.tickets.filter(validTicket) : []);
  }

  function stateFor(tickets) {
    const state = { entries: new Map(), standing: new Map(), seats: new Set() };
    for (const ticket of tickets) addToState(state, ticket);
    return state;
  }

  const entryKey = (id, day) => `${id}:${day}`;
  const seatKey = (id, day, seat) => `${id}:${day}:${seat}`;
  const countAt = (map, id, day) => map.get(entryKey(id, day)) || 0;

  function addToState(state, ticket) {
    const id = venueId(ticket), physical = physicalVenue(id);
    for (const day of days(ticket)) {
      for (const admitted of admittedVenues(id)) {
        const item = entryKey(admitted, day);
        state.entries.set(item, (state.entries.get(item) || 0) + 1);
      }
      if (ticket.category === 'standing') {
        const item = entryKey(physical, day);
        state.standing.set(item, (state.standing.get(item) || 0) + 1);
      }
      if (ticket.category !== 'standing') state.seats.add(seatKey(physical, day, ticket.seat));
    }
  }

  function canAdd(state, ticket) {
    const id = venueId(ticket), physical = physicalVenue(id);
    return days(ticket).every(day => (ticket.category === 'standing' || !state.seats.has(seatKey(physical, day, ticket.seat)))
      && admittedVenues(id).every(admitted => countAt(state.entries, admitted, day) < venue(admitted).capacity)
      && (ticket.category !== 'standing' || countAt(state.standing, physical, day) < venue(physical).ticketing.standingCapacity));
  }

  // Previously paid orders take precedence. Later conflicting cart items are
  // returned by reference, so the checkout can identify exactly what to remove.
  function conflicts(tickets = [], orders = [], selectedEdition = edition) {
    const state = stateFor(committed(orders, selectedEdition)), invalid = new Set(), standingReferences = new Set();
    for (const ticket of tickets) {
      if (!validTicket(ticket) || !canAdd(state, ticket) || ticket.category === 'standing' && standingReferences.has(key(ticket))) invalid.add(ticket);
      else {
        addToState(state, ticket);
        if (ticket.category === 'standing') standingReferences.add(key(ticket));
      }
    }
    return invalid;
  }

  function selection(options) {
    const id = options.venueId ?? 'all', selected = canonicalDays(options.days);
    if (!knownVenue(id) || !categories(id).includes(options.category) || !Array.isArray(options.days)
      || !selected.length || options.days.length !== selected.length) return null;
    const paid = committed(options.orders || [], options.edition ?? edition);
    return { id, selected, state: stateFor([...paid, ...(options.cart || []).filter(validTicket)]) };
  }

  function freePool(options) {
    const selected = selection(options);
    if (!selected) return { seats: [], count: 0 };
    const { id, selected: chosen, state } = selected, physical = physicalVenue(id);
    // An all-stage pass reserves one admission on every stage for each chosen
    // day. It therefore also respects the smallest remaining stage capacity.
    let capacity = Math.min(...chosen.flatMap(day => admittedVenues(id).map(admitted => venue(admitted).capacity - countAt(state.entries, admitted, day))));
    if (options.category === 'standing') {
      capacity = Math.min(capacity, ...chosen.map(day => venue(physical).ticketing.standingCapacity - countAt(state.standing, physical, day)));
    }
    if (options.category === 'standing') {
      // Standing has a daily quota rather than numbered positions. Paid S1 on
      // one day must not fragment the inventory of a different multi-day pass.
      const references = new Set((options.cart || []).filter(validTicket).map(key));
      const scope = chosen.length === 3 ? 'festival' : chosen.length === 2 ? 'multi' : 'day';
      const seats = pool(id, 'standing').filter(seat => !references.has(key(ticketFor(chosen[0], seat, scope, chosen, id))));
      return { seats, count: Math.max(0, capacity) };
    }
    const seats = pool(id, options.category).filter(seat => chosen.every(day => !state.seats.has(seatKey(physical, day, seat))));
    return { seats, count: Math.max(0, Math.min(capacity, seats.length)) };
  }

  function available(options) {
    const free = freePool(options);
    // Every unoccupied chair remains selectable when an admission is available.
    // The form uses remaining() to limit how many chairs can be added.
    return options.category === 'standing' ? free.seats.slice(0, free.count) : free.count > 0 ? free.seats : [];
  }

  function remaining(options) {
    return freePool(options).count;
  }

  function occupied({ venueId: id = 'all', days: selected = dayIds, orders = [], cart = [], edition: selectedEdition = edition } = {}) {
    const physical = physicalVenue(id), chosen = canonicalDays(selected);
    return new Set([...committed(orders, selectedEdition), ...cart.filter(validTicket)]
      .filter(ticket => ticket.category !== 'standing' && physicalVenue(venueId(ticket)) === physical && days(ticket).some(day => chosen.includes(day)))
      .map(ticket => ticket.seat));
  }

  function venueLabel(id = 'all', lang = 'cs') {
    return id === 'all' ? lang === 'en' ? 'All stages' : 'Všechny scény' : venue(id)?.name || '';
  }

  window.PulseAdmission = Object.freeze({
    venueId, days, ticketFor, validTicket, key, overlaps, committed, conflicts,
    available, remaining, occupied, categories, price, venueLabel
  });
}());
