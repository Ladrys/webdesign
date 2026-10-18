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
  const categories = { vip: 'VIP', regular: 'REGULAR', standing: window.PulseI18n?.lang==='en'?'STANDING':'STÁNÍ' };
  const money = value => new Intl.NumberFormat(window.PulseI18n?.lang==='en'?'en-GB':'cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(Number(value) || 0);
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

  async function generate(order) {
    if (!order || !Array.isArray(order.tickets) || !order.tickets.length || order.tickets.length > 264) {
      throw new Error('Objednávka musí obsahovat 1 až 264 vstupenek.');
    }
    await loadDependencies();
    const edition=Number.isInteger(order.edition)?order.edition:2026;
    const days={d1:`1. 8. ${edition}`,d2:`2. 8. ${edition}`,d3:`3. 8. ${edition}`};
    const wholeFestival=`1.–3. 8. ${edition}`;
    const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a5', compress: true, putOnlyUsedFonts: true });
    doc.addFileToVFS('DejaVuSans.ttf', window.PULSE_PDF_FONTS.regular);
    doc.addFont('DejaVuSans.ttf', 'PulseSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', window.PULSE_PDF_FONTS.bold);
    doc.addFont('DejaVuSans-Bold.ttf', 'PulseSans', 'bold');
    doc.setProperties({ title: `Prague Pulse Fest · ${order.id}`, author: 'Prague Pulse Fest', subject: 'Školní ukázka vstupenek' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const split = width - 175;

    order.tickets.forEach((ticket, index) => {
      if (index) doc.addPage('a5', 'landscape');
      box(doc, 0, 0, width, height, paper);
      box(doc, split, 0, 175, height, orange);
      box(doc, 0, 0, split, 136, ink);

      text(doc, 'PRAGUE', 25, 40, 230, 25, true, paper);
      text(doc, 'PULSE', 23, 86, 260, 43, true, paper);
      text(doc, `FEST / ${edition}`, 26, 117, 230, 11, true, orange);
      text(doc, '01—03 / 08', split - 133, 72, 108, 17, true, orange);

      text(doc, 'FIKTIVNÍ FESTIVAL / VSTUPENKA', 26, 159, split - 52, 8, true);
      label(doc, 'JMÉNO V OBJEDNÁVCE', 26, 187, split - 52);
      text(doc, order.name || order.customer?.name || 'Návštěvník festivalu', 26, 214, split - 52, 21, true, ink, false);
      doc.setDrawColor('#CECCC2');
      doc.setLineWidth(0.6);
      doc.line(26, 230, split - 26, 230);

      label(doc, 'DATUM', 26, 253, 165);
      text(doc, ticket.scope==='festival'?wholeFestival:(days[ticket.day] || String(ticket.day || wholeFestival)), 26, 276, 180, 17, true);
      label(doc, 'SEKTOR / MÍSTO', 228, 253, split - 254);
      text(doc, ticket.category === 'standing' ? 'Volná plocha' : (ticket.seat || 'Volný vstup'), 228, 276, split - 254, 16, true);
      label(doc, 'AREÁL', 26, 305, 170);
      text(doc, 'Vltava Park, Praha', 26, 325, 188, 12, true);
      text(doc, 'Výstaviště 67, Praha 7', 26, 341, 188, 8, false, gray);
      label(doc, tr('CENÍKOVÁ CENA VSTUPENKY','TICKET LIST PRICE'), 228, 305, split - 254);
      text(doc, money(ticket.price), 228, 327, split - 254, 15, true);
      const subtotal=Number.isInteger(order.subtotal)?order.subtotal:order.tickets.reduce((sum,item)=>sum+item.price,0);
      const discount=Number.isInteger(order.discount)?Math.min(subtotal,Math.max(0,order.discount)):0;
      const total=Number.isInteger(order.total)?order.total:subtotal-discount;
      label(doc, tr('CELKEM ZA OBJEDNÁVKU','ORDER TOTAL'), 26, 358, 190);
      text(doc, money(total), 228, 358, split - 254, 11, true);
      const breakdown=tr('Vstupenky','Tickets')+': '+money(subtotal)+' / '+tr('Sleva','Discount')+': '+money(discount)+(discount&&order.promoCode?' ('+order.promoCode+')':'');
      text(doc, breakdown, 26, 370, split - 52, 8, false, gray, false);

      text(doc, 'Doklad byl vytvořen lokálně jako součást školního projektu.', 26, height - 37, split - 52, 7, false, gray);
      text(doc, 'Nepotvrzuje platbu ani nárok na skutečný vstup do areálu.', 26, height - 25, split - 52, 7, false, gray);
      text(doc, `OBJEDNÁVKA ${order.id}`, 26, height - 13, split - 52, 7, true);

      const sideX = split + 21;
      text(doc, 'ADMIT ONE / UKÁZKA', sideX, 32, 138, 8, true);
      text(doc, categories[ticket.category] || String(ticket.category || 'REGULAR').toUpperCase(), sideX - 1, 72, 139, 23, true);
      text(doc, ticket.scope==='festival'?wholeFestival:(days[ticket.day] || wholeFestival), sideX, 98, 138, 10);
      const suppliedCode = String(ticket.code || `${order.id}-${index + 1}`);
      // No name, email or URL is encoded. This local identifier is not a validated admission token.
      const payload = /^[A-Za-z0-9_-]{1,256}$/.test(suppliedCode) ? suppliedCode : `${String(order.id).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 80)}-${index + 1}`;
      qr(doc, payload, sideX - 2, 123, 137);
      label(doc, 'VSTUPENKA', sideX, 290, 138);
      text(doc, `${String(index + 1).padStart(2, '0')} / ${String(order.tickets.length).padStart(2, '0')}`, sideX - 1, 325, 138, 23, true);
      text(doc, ticket.scope==='festival'?'3 DNY / VŠECHNY SCÉNY':'1 DEN / VŠECHNY SCÉNY', sideX, 347, 138, 7);
      text(doc, 'PRAGUE PULSE FEST', sideX, height - 24, 138, 8, true);
      doc.setDrawColor(ink);
      doc.setLineWidth(0.5);
      doc.setLineDashPattern([3, 4], 0);
      doc.line(split, 0, split, height);
      doc.setLineDashPattern([], 0);
    });
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
