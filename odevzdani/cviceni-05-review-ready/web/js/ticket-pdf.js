/* Offline PDF tickets. Libraries and licensed fonts are loaded locally, on demand. */
(() => {
  'use strict';

  const scriptUrl = document.currentScript?.src || new URL('js/ticket-pdf.js', document.baseURI).href;
  const vendorUrl = new URL('../vendor/', scriptUrl);
  const ink = '#F4F3EF';
  const paper = '#101214';
  const orange = '#FF784B';
  const gray = '#B6BDC6';

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
    doc.setFillColor('#111315');
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
  const halers = value => {
    const result = Math.round(amount(value) * 100);
    return Number.isSafeInteger(result) ? result : 0;
  };

  function includedTax(grossHalers, rate) {
    const netHalers = Math.round(grossHalers * 100 / (100 + rate));
    return { net: netHalers / 100, vat: (grossHalers - netHalers) / 100 };
  }

  // A promotion belongs to the tickets, not the camping pitch. Allocate whole
  // halers proportionally and give leftover halers to the largest remainders.
  // BigInt keeps the weighting exact; a tie follows the order of the tickets.
  function allocateTicketAmounts(order) {
    const prices = (Array.isArray(order?.tickets) ? order.tickets : []).map(ticket => halers(ticket.price));
    const subtotal = prices.reduce((sum, price) => sum + price, 0);
    const discount = Math.min(subtotal, halers(order?.discount));
    const shares = prices.map((price, index) => {
      const weighted = BigInt(discount) * BigInt(price);
      return { index, value: subtotal ? Number(weighted / BigInt(subtotal)) : 0, remainder: subtotal ? weighted % BigInt(subtotal) : 0n };
    });
    const remainder = discount - shares.reduce((sum, share) => sum + share.value, 0);
    shares.slice().sort((a, b) => a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1)
      .slice(0, remainder).forEach(share => { share.value += 1; });
    const hasTax = Number.isFinite(order?.tax?.rate) && order.tax.rate >= 0 && order.tax.rate <= 100;
    const rate = hasTax ? order.tax.rate : null;
    return prices.map((price, index) => {
      const paid = price - shares[index].value;
      return { price: price / 100, discount: shares[index].value / 100, paid: paid / 100,
        ...(hasTax ? includedTax(paid, rate) : { net: null, vat: null }), rate, hasTax };
    });
  }

  function purchaseDate(order) {
    const value = new Date(order.created || order.createdAt || '');
    if (!Number.isFinite(value.getTime())) return '—';
    return new Intl.DateTimeFormat(window.PulseI18n?.lang === 'en' ? 'en-GB' : 'cs-CZ', {
      timeZone: 'Europe/Prague', day: 'numeric', month: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    }).format(value);
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
    const ticketAmounts = allocateTicketAmounts(order);
    const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a5', compress: true, putOnlyUsedFonts: true });
    doc.addFileToVFS('DejaVuSans.ttf', window.PULSE_PDF_FONTS.regular);
    doc.addFont('DejaVuSans.ttf', 'PulseSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', window.PULSE_PDF_FONTS.bold);
    doc.addFont('DejaVuSans-Bold.ttf', 'PulseSans', 'bold');
    doc.setProperties({ title: `Prague Pulse Fest · ${order.id}`, author: 'Prague Pulse Fest', subject: tr('Vstupenky a rezervace', 'Tickets and reservations') });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const split = width - 181;
    const sideX = split + 18;
    const mainWidth = split - 52;

    function pageBase(kind, title, validity) {
      box(doc, 0, 0, width, height, paper);
      box(doc, 0, 0, 6, height, orange);
      box(doc, split, 0, width - split, height, '#1A1E21');
      text(doc, 'PRAGUE', 26, 34, 240, 14, true, ink, false);
      text(doc, 'PULSE FEST', 24, 66, 295, 29, true, ink, false);
      text(doc, String(edition), split - 75, 34, 49, 14, true, orange, false);
      doc.setDrawColor('#3D4348');
      doc.setLineWidth(0.6);
      doc.line(26, 85, split - 26, 85);

      text(doc, kind, 26, 108, mainWidth, 8, true, orange, false);
      text(doc, title, 26, 133, mainWidth, 21, true, ink, false);
      text(doc, validity, 26, 158, mainWidth, 16, true, ink, false);
      text(doc, 'Výstaviště Praha · Praha 7', 26, 177, mainWidth, 9, false, gray, false);
      doc.line(26, 192, split - 26, 192);

      label(doc, tr('ZAKOUPIL/A', 'PURCHASED BY'), 26, 211, mainWidth);
      text(doc, order.name || order.customer?.name || tr('Návštěvník festivalu', 'Festival visitor'), 26, 233, mainWidth, 18, true, ink, false);
      text(doc, tr('Objednávka ', 'Order ') + String(order.id), 26, 254, mainWidth, 9, true, ink, false);
      text(doc, tr('Zakoupeno ', 'Purchased ') + purchaseDate(order) + tr(' · pražský čas', ' · Prague time'), 26, 270, mainWidth, 8, false, gray, false);
    }

    function financialSummary(values, details) {
      doc.setFillColor('#202529');
      doc.roundedRect(26, 286, mainWidth, 100, 9, 9, 'F');
      const rightX = split - 40;
      function row(caption, value, y) {
        text(doc, caption, 39, y, mainWidth - 145, 8.5, false, gray, false);
        font(doc, 9, true);
        doc.text(value, rightX, y, { align: 'right' });
      }
      row(details.listLabel, details.listValue ?? money(values.price, true), 304);
      row(details.discountLabel, details.discountValue ?? (values.discount ? '−' : '') + money(values.discount, true), 321);
      text(doc, values.hasTax ? tr('CENA VČETNĚ DPH', 'PRICE INCLUDING VAT') : tr('CENA', 'PRICE'), 39, 348, mainWidth - 175, 8, true, ink, false);
      font(doc, 20, true, orange);
      doc.text(money(values.paid, true), rightX, 349, { align: 'right' });
      if (values.hasTax) {
        text(doc, tr('Bez DPH ', 'Excl. VAT ') + money(values.net, true), 39, 371, 176, 8, false, gray, false);
        font(doc, 8, false, gray);
        doc.text(tr('DPH ', 'VAT ') + `${values.rate} % · ` + money(values.vat, true), rightX, 371, { align: 'right' });
      }
    }

    function sidebar(category, place, validity, code, number) {
      doc.setFillColor(orange);
      doc.roundedRect(sideX, 25, 145, 27, 13, 13, 'F');
      text(doc, category, sideX + 12, 43, 121, 11, true, paper, false);
      font(doc, 20, true);
      const placeSize = Math.min(20, 20 * 143 / Math.max(1, doc.getTextWidth(place)));
      text(doc, place, sideX, 89, 145, placeSize, true, ink, false);
      text(doc, validity.display, sideX, 108, 145, 9, false, gray, false);
      qr(doc, code, sideX - 1, 128, 147);
      label(doc, tr('KÓD VSTUPENKY', 'TICKET CODE'), sideX, 299, 145);
      font(doc, 7, false, gray);
      const codeLines = doc.splitTextToSize(code, 145);
      doc.text(codeLines.slice(0, 3), sideX, 313);
      text(doc, number, sideX, 360, 145, number.length > 20 ? 9.5 : 12, true, ink, false);
      text(doc, validity.caption, sideX, 382, 145, 7, false, gray, false);
    }

    function pageFooter() {
      text(doc, 'PRAGUE PULSE FEST / ' + edition, 26, height - 15, mainWidth, 7, true, gray, false);
      text(doc, 'PRAGUEPULSEFEST.CZ', sideX, height - 15, 145, 7, true, gray, false);
      doc.setDrawColor('#465058');
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([2, 4], 0);
      doc.line(split, 20, split, height - 20);
      doc.setLineDashPattern([], 0);
    }
    order.tickets.forEach((ticket, index) => {
      if (index) doc.addPage('a5', 'landscape');
      const validity = ticketValidity(ticket, calendar);
      pageBase(tr('VSTUPENKA', 'FESTIVAL TICKET'), validity.admission, validity.display);
      const values = ticketAmounts[index];
      financialSummary(values, {
        listLabel: tr('Ceníková cena vstupenky', 'Ticket list price'),
        discountLabel: tr('Sleva', 'Discount') + (values.discount && order.promoCode ? ` · ${order.promoCode}` : ''),
      });
      const categories = { vip: 'VIP', regular: 'REGULAR', standing: tr('STÁNÍ', 'STANDING') };
      const place = ticket.category === 'standing' ? tr('Volná plocha', 'Standing area') : tr('Sedadlo ', 'Seat ') + String(ticket.seat || '');
      // No name, email or URL is encoded. This local identifier is not a validated admission token.
      sidebar(categories[ticket.category] || String(ticket.category || 'REGULAR').toUpperCase(), place, validity,
        safeCode(ticket.code, `${order.id}-${index + 1}`), tr('VSTUPENKA ', 'TICKET ') + `${String(index + 1).padStart(2, '0')} / ${String(order.tickets.length).padStart(2, '0')}`);
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
      pageBase(tr('KEMPINGOVÝ VOUCHER', 'CAMPING VOUCHER'), pitch, validity.display);
      // The voucher accounts for camping only; no concert price or promotion is repeated.
      const campingPrice = halers(camping.price);
      const hasTax = Number.isFinite(order.tax?.rate) && order.tax.rate >= 0 && order.tax.rate <= 100;
      const rate = hasTax ? order.tax.rate : null;
      const values = { price: campingPrice / 100, paid: campingPrice / 100, discount: 0, rate, hasTax,
        ...(hasTax ? includedTax(campingPrice, rate) : { net: null, vat: null }) };
      financialSummary(values, {
        listLabel: tr('Cena místa', 'Pitch price'),
        listValue: money(basePrice, true),
        discountLabel: `${people} × ` + money(personPrice, true) + tr(' za osobu', ' per person'),
        discountValue: money(people * personPrice, true),
      });
      sidebar(caravan ? tr('KARAVAN', 'CARAVAN') : tr('STAN', 'TENT'), peopleLabel,
        { display: validity.display, caption: tr(`1 MÍSTO / ${validity.nights} NOCI`, `1 PITCH / ${validity.nights} NIGHTS`) },
        safeCode(`${order.id}-camp`, `${order.id}-camp`), tr('KEMPINGOVÝ VOUCHER', 'CAMPING VOUCHER'));
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

  window.PulseTickets = Object.freeze({ generate, download, allocateTicketAmounts });
})();
