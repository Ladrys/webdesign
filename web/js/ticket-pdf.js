/* Offline PDF tickets. Libraries and licensed fonts are loaded locally, on demand. */
(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src || new URL('js/ticket-pdf.js', document.baseURI).href;
  const vendorUrl = new URL('../vendor/', scriptUrl);
  const ink = '#11110F';
  const paper = '#F2EFE5';
  const orange = '#FF5A1F';
  const gray = '#696960';

  const tr = (cs,en) => window.PulseI18n?.lang==='en'?en:cs;
  const money = (value, precise = false) => new Intl.NumberFormat(window.PulseI18n?.lang==='en'?'en-GB':'cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: precise ? 2 : 0, maximumFractionDigits: 2 }).format(Number(value) || 0);
  let dependencies;

  function script(name, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const element = document.createElement('script');
      element.src = new URL(name, vendorUrl).href;
      element.onload = () => ready() ? resolve() : reject(new Error('Knihovna pro PDF se nenačetla. Obnovte stránku a zkuste to znovu.'));
      element.onerror = () => { element.remove(); reject(new Error('Nelze načíst místní knihovnu pro PDF. Zkontrolujte, zda jste rozbalili celý projekt.')); };
      document.head.append(element);
    });
  }

  function loadDependencies() {
    if (!dependencies) {
      dependencies = Promise.all([
        script('jspdf.umd.min.js', () => Boolean(window.jspdf?.jsPDF)),
        script('qrcode.js', () => typeof window.qrcode === 'function'),
        script('ticket-fonts.js', () => Boolean(window.PULSE_PDF_FONTS?.bold)),
      ]).catch(error => { dependencies = null; throw error; });
    }
    return dependencies;
  }

  function font(doc, size, bold = false, color = ink) {
    doc.setFont('PulseSans', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(color);
  }

  function text(doc, content, x, y, maxWidth, size = 12, bold = false, color = ink, translate = true) {
    font(doc, size, bold, color);
    let visible = String((translate ? window.PulseI18n?.t(content) : content) ?? content ?? '').replace(/[\r\n\t]/g, ' ');
    if (maxWidth && doc.getTextWidth(visible) > maxWidth) {
      while (visible.length && doc.getTextWidth(`${visible}…`) > maxWidth) visible = visible.slice(0, -1);
      visible += '…';
    }
    doc.text(visible, x, y);
  }

  function label(doc, content, x, y, width) { text(doc, content, x, y, width, 7, true, gray); }
  function box(doc, x, y, width, height, color) { doc.setFillColor(color); doc.rect(x, y, width, height, 'F'); }

  function qr(doc, payload, x, y, size) {
    const code = window.qrcode(0, 'M');
    code.addData(payload);
    code.make();
    const count = code.getModuleCount();
    const quietZone = 4;
    const module = size / (count + quietZone * 2);
    box(doc, x, y, size, size, '#FFFFFF');
    doc.setFillColor(ink);
    for (let row = 0; row < count; row += 1) {
      // Draw contiguous runs as one vector rectangle for compact, crisp print output.
      for (let column = 0; column < count;) {
        if (!code.isDark(row, column)) { column += 1; continue; }
        let end = column + 1;
        while (end < count && code.isDark(row, end)) end += 1;
        doc.rect(x + (column + quietZone) * module, y + (row + quietZone) * module, (end - column) * module, module, 'F');
        column = end;
      }
    }
  }

  const amount = (value, fallback = 0) => Number.isFinite(value) && value >= 0 ? value : fallback;
  const roundMoney = value => Math.round((value + Number.EPSILON) * 100) / 100;

  function orderSummary(order) {
    const subtotal = amount(order.subtotal, order.tickets.reduce((sum, ticket) => sum + amount(ticket.price), 0));
    const discount = Math.min(subtotal, amount(order.discount));
    const camping = order.camping ? amount(order.campingTotal, amount(order.camping.price)) : 0;
    const total = amount(order.total, roundMoney(subtotal - discount + camping));
    const hasTax = Number.isFinite(order.tax?.rate) && Number.isFinite(order.tax?.net) && Number.isFinite(order.tax?.vat);
    return { subtotal, discount, camping, total, hasTax, rate: order.tax?.rate, net: order.tax?.net, vat: order.tax?.vat };
  }

  function festivalCalendar(edition) {
    const source = window.FESTIVAL_DATA?.festival?.dates;
    const dates = Array.isArray(source) && source.length ? source : [
      { id: 'd1', date: '2027-08-01' }, { id: 'd2', date: '2027-08-02' }, { id: 'd3', date: '2027-08-03' },
    ];
    return dates.map(day => ({ id: day.id, iso: day.date.replace(/^\d{4}/, String(edition)) }));
  }

  function dateParts(iso) { return String(iso).split('-').map(Number); }

  function dateRange(from, to) {
    const [year, month, day] = dateParts(from);
    const [endYear, endMonth, endDay] = dateParts(to);
    if (from === to) return `${day}. ${month}. ${year}`;
    return year === endYear && month === endMonth
      ? `${day}.–${endDay}. ${month}. ${year}`
      : `${day}. ${month}. ${year} – ${endDay}. ${endMonth}. ${endYear}`;
  }

  function ticketValidity(ticket, calendar) {
    const ids = ticket.scope === 'festival' ? calendar.map(day => day.id)
      : ticket.scope === 'multi' ? ticket.days : [ticket.day];
    const selected = calendar.filter(day => Array.isArray(ids) && ids.includes(day.id));
    if (!selected.length || (ticket.scope === 'multi' && selected.length < 2)) {
      throw new Error('Vstupenka nemá platné datum návštěvy.');
    }
    const first = selected[0];
    const last = selected[selected.length - 1];
    const isWholeFestival = selected.length === calendar.length;
    const admission = window.PulseAdmission?.venueLabel(ticket.venueId || 'all', window.PulseI18n?.lang || 'cs') || tr('Všechny scény', 'All stages');
    const display = isWholeFestival ? dateRange(first.iso, last.iso)
      : selected.length === 1 ? dateRange(first.iso, first.iso)
        : selected.map(day => `${dateParts(day.iso)[2]}.`).join(' + ') + ` ${dateParts(last.iso)[1]}. ${dateParts(last.iso)[0]}`;
    const header = selected.map(day => String(dateParts(day.iso)[2]).padStart(2, '0')).join(isWholeFestival ? '—' : ' + ')
      + ` / ${String(dateParts(first.iso)[1]).padStart(2, '0')}`;
    return {
      display,
      header: isWholeFestival ? `${String(dateParts(first.iso)[2]).padStart(2, '0')}—${String(dateParts(last.iso)[2]).padStart(2, '0')} / ${String(dateParts(first.iso)[1]).padStart(2, '0')}` : header,
      caption: tr(`${selected.length} ${selected.length === 1 ? 'DEN' : 'DNY'}`, `${selected.length} ${selected.length === 1 ? 'DAY' : 'DAYS'}`) + ' / ' + admission.toUpperCase(),
      admission,
    };
  }

  function campingValidity(camping, edition) {
    const from = String(camping.dates?.from || `${edition}-08-01`).replace(/^\d{4}/, String(edition));
    const to = String(camping.dates?.to || `${edition}-08-04`).replace(/^\d{4}/, String(edition));
    const nights = Math.max(1, Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000)) || 3;
    return { display: dateRange(from, to), nights };
  }

  function safeCode(suppliedCode, fallback) {
    const value = String(suppliedCode || fallback);
    return /^[A-Za-z0-9_-]{1,256}$/.test(value)
      ? value : String(fallback).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 256);
  }

  async function generate(order) {
    if (!order || !Array.isArray(order.tickets) || !order.tickets.length || order.tickets.length > 264) {
      throw new Error('Objednávka musí obsahovat 1 až 264 vstupenek.');
    }
    if (window.PulseOrders?.normalize) order = window.PulseOrders.normalize(order);
    await loadDependencies();
    const edition=Number.isInteger(order.edition)?order.edition:2026;
    const calendar = festivalCalendar(edition);
    const summary = orderSummary(order);
    const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a5', compress: true, putOnlyUsedFonts: true });
    doc.addFileToVFS('DejaVuSans.ttf', window.PULSE_PDF_FONTS.regular);
    doc.addFont('DejaVuSans.ttf', 'PulseSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', window.PULSE_PDF_FONTS.bold);
    doc.addFont('DejaVuSans-Bold.ttf', 'PulseSans', 'bold');
    doc.setProperties({ title: `Prague Pulse Fest · ${order.id}`, author: 'Prague Pulse Fest', subject: 'Školní ukázka vstupenek' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const split = width - 175;

    function pageBase(title, headerDate) {
      box(doc, 0, 0, width, height, paper);
      box(doc, split, 0, 175, height, orange);
      box(doc, 0, 0, split, 126, ink);

      text(doc, 'PRAGUE', 25, 40, 230, 25, true, paper);
      text(doc, 'PULSE', 23, 86, 260, 43, true, paper);
      text(doc, `FEST / ${edition}`, 26, 117, 230, 11, true, orange);
      font(doc, 13, true, orange);
      const headerSize = Math.min(13, 13 * 107 / Math.max(1, doc.getTextWidth(headerDate)));
      text(doc, headerDate, split - 133, 72, 108, headerSize, true, orange, false);

      text(doc, title, 26, 146, split - 52, 8, true);
      label(doc, 'JMÉNO V OBJEDNÁVCE', 26, 165, split - 52);
      text(doc, order.name || order.customer?.name || 'Návštěvník festivalu', 26, 190, split - 52, 21, true, ink, false);
      doc.setDrawColor('#CECCC2');
      doc.setLineWidth(0.6);
      doc.line(26, 205, split - 26, 205);
    }

    function financialSummary() {
      if (order.campingIssue) {
        text(doc, tr('Údaje o kempu nejsou úplné.', 'Camping details are incomplete.'), 26, 307, split - 52, 10, true);
        text(doc, tr('PDF obsahuje pouze festivalové vstupenky.', 'The PDF contains festival tickets only.'), 26, 325, split - 52, 9);
        text(doc, tr('Uložená cena objednávky', 'Saved order total'), 26, 347, split - 170, 9, true);
        text(doc, money(summary.total), split - 143, 347, 117, 12, true, ink, false);
        return;
      }
      doc.setDrawColor('#CECCC2');
      doc.line(26, 286, split - 26, 286);
      const amountX = split - 143;
      const labelWidth = amountX - 38;
      const amountWidth = split - amountX - 26;
      text(doc, tr('Vstupenky celkem', 'Ticket subtotal'), 26, 300, labelWidth, 8.5, false);
      text(doc, money(summary.subtotal), amountX, 300, amountWidth, 8.5, true, ink, false);
      const promo = summary.discount && order.promoCode ? ` · ${order.promoCode}` : '';
      text(doc, tr('Sleva', 'Discount') + promo, 26, 313, labelWidth, 8.5, false, ink, false);
      text(doc, money(summary.discount), amountX, 313, amountWidth, 8.5, true, ink, false);
      text(doc, tr('Kemp celkem', 'Camping subtotal'), 26, 326, labelWidth, 8.5, false);
      text(doc, money(summary.camping), amountX, 326, amountWidth, 8.5, true, ink, false);
      text(doc, summary.hasTax ? tr('OBJEDNÁVKA CELKEM VČ. DPH', 'ORDER TOTAL INCL. VAT') : tr('OBJEDNÁVKA CELKEM', 'ORDER TOTAL'), 26, 343, labelWidth, 9, true);
      text(doc, money(summary.total), amountX, 343, amountWidth, 12, true, ink, false);
      if (summary.hasTax) {
        text(doc, tr('Základ bez DPH: ', 'Net amount: ') + money(summary.net, true), 26, 359, 199, 8, false, gray, false);
        text(doc, tr('DPH ', 'VAT ') + `${summary.rate}%: ` + money(summary.vat, true), 228, 359, split - 254, 8, false, gray, false);
      }
    }

    function pageFooter() {
      text(doc, 'Doklad byl vytvořen lokálně jako součást školního projektu.', 26, height - 37, split - 52, 7, false, gray);
      text(doc, 'Nepotvrzuje platbu ani nárok na skutečný vstup do areálu.', 26, height - 25, split - 52, 7, false, gray);
      text(doc, `OBJEDNÁVKA ${order.id}`, 26, height - 13, split - 52, 7, true);
      const sideX = split + 21;
      text(doc, 'PRAGUE PULSE FEST', sideX, height - 24, 138, 8, true);
      doc.setDrawColor(ink);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([3, 4], 0);
      doc.line(split, 0, split, height);
      doc.setLineDashPattern([], 0);
    }

    const sideX = split + 21;
    order.tickets.forEach((ticket, index) => {
      if (index) doc.addPage('a5', 'landscape');
      const validity = ticketValidity(ticket, calendar);
      pageBase(tr('FIKTIVNÍ FESTIVAL / VSTUPENKA', 'FICTIONAL FESTIVAL / TICKET') + ' · ' + validity.admission, validity.header);
      label(doc, 'DATUM', 26, 224, 180);
      text(doc, validity.display, 26, 245, 185, 15, true, ink, false);
      label(doc, 'SEKTOR / MÍSTO', 228, 224, split - 254);
      text(doc, ticket.category === 'standing' ? tr('Volná plocha', 'Standing area') : 'Main Hall · ' + (ticket.seat || ''), 228, 245, split - 254, ticket.category === 'standing' ? 16 : 12, true);
      label(doc, 'AREÁL', 26, 263, 170);
      text(doc, 'Výstaviště 67, Praha 7', 26, 279, 188, 10, true);
      label(doc, tr('CENÍKOVÁ CENA VSTUPENKY', 'TICKET LIST PRICE'), 228, 263, split - 254);
      text(doc, money(ticket.price), 228, 280, split - 254, 13, true, ink, false);
      financialSummary();
      text(doc, 'ADMIT ONE / UKÁZKA', sideX, 32, 138, 8, true);
      const categories = { vip: 'VIP', regular: 'REGULAR', standing: tr('STÁNÍ', 'STANDING') };
      text(doc, categories[ticket.category] || String(ticket.category || 'REGULAR').toUpperCase(), sideX - 1, 72, 139, 23, true);
      text(doc, validity.display, sideX, 98, 138, 10, false, ink, false);
      // No name, email or URL is encoded. This local identifier is not a validated admission token.
      qr(doc, safeCode(ticket.code, `${order.id}-${index + 1}`), sideX - 2, 123, 137);
      label(doc, 'VSTUPENKA', sideX, 290, 138);
      text(doc, `${String(index + 1).padStart(2, '0')} / ${String(order.tickets.length).padStart(2, '0')}`, sideX - 1, 325, 138, 23, true);
      text(doc, validity.caption, sideX, 347, 138, 7, false, ink, false);
      pageFooter();
    });

    if (order.camping) {
      doc.addPage('a5', 'landscape');
      const camping = order.camping;
      const validity = campingValidity(camping, edition);
      const people = Math.max(1, Math.floor(amount(camping.people, 1)));
      const caravan = camping.type === 'caravan';
      const pitch = caravan ? tr('Karavanové místo', 'Caravan pitch') : tr('Místo pro stan', 'Tent pitch');
      const peopleLabel = tr(`${people} ${people === 1 ? 'osoba' : people < 5 ? 'osoby' : 'osob'}`, `${people} ${people === 1 ? 'person' : 'people'}`);
      const basePrice = amount(camping.basePrice);
      const personPrice = amount(camping.personPrice);
      pageBase(tr('FIKTIVNÍ FESTIVAL / KEMP', 'FICTIONAL FESTIVAL / CAMPING'), tr(`KEMP / ${validity.nights} NOCI`, `CAMP / ${validity.nights} NIGHTS`));
      label(doc, 'DATUM', 26, 224, 185);
      text(doc, validity.display, 26, 245, 185, 15, true, ink, false);
      label(doc, tr('TYP MÍSTA', 'PITCH TYPE'), 228, 224, split - 254);
      text(doc, pitch, 228, 245, split - 254, 13, true, ink, false);
      text(doc, tr('1 místo', '1 pitch') + ` · ${peopleLabel} · ` + tr(`${validity.nights} noci`, `${validity.nights} nights`), 26, 264, split - 52, 10, true, ink, false);
      text(doc, tr('Místo ', 'Pitch ') + money(basePrice) + ` + ${people} × ` + money(personPrice) + tr(' za osobu', ' per person'), 26, 279, split - 52, 9, false, ink, false);
      financialSummary();
      text(doc, tr('KEMP / UKÁZKA', 'CAMPING / SAMPLE'), sideX, 32, 138, 8, true);
      text(doc, caravan ? tr('KARAVAN','CARAVAN') : tr('STAN','TENT'), sideX - 1, 72, 139, 23, true);
      text(doc, validity.display, sideX, 98, 138, 10, false, ink, false);
      qr(doc, safeCode(`${order.id}-camp`, `${order.id}-camp`), sideX - 2, 123, 137);
      label(doc, tr('KEMPINGOVÝ VOUCHER', 'CAMPING VOUCHER'), sideX, 290, 138);
      text(doc, peopleLabel.toUpperCase(), sideX - 1, 325, 138, 23, true, ink, false);
      text(doc, tr(`1 MÍSTO / ${validity.nights} NOCI`, `1 PITCH / ${validity.nights} NIGHTS`), sideX, 347, 138, 7, false, ink, false);
      pageFooter();
    }
    return doc.output('blob');
  }

  async function download(order) {
    const blob = await generate(order);
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `Prague-Pulse-Fest-${String(order.id).replace(/[^A-Za-z0-9_-]/g, '-')}.pdf`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 30000);
    return blob;
  }

  window.PulseTickets = Object.freeze({ generate, download });
})();
