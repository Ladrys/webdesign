'use strict';
/* Original festival schematic. ViewBox coordinates are a design grid, not a surveyed map. */
(() => {
  const WIDTH = 1200, HEIGHT = 820, MAX_ZOOM = 8;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const lang = () => window.PulseI18n?.lang === 'en' ? 'en' : 'cs';
  const tr = (cs, en) => lang() === 'en' ? en : cs;
  const stages = [
    {id:'h1', name:'Main Hall', number:'01', x:390, y:567, color:'#ff8256', cs:'Průmyslový palác', en:'Industrial Palace'},
    {id:'h2', name:'River Stage', number:'02', x:697, y:214, color:'#82cee9', cs:'Česká scéna u Vltavy', en:'Czech music by the Vltava'},
    {id:'h3', name:'Club Stage', number:'03', x:352, y:399, color:'#bed78e', cs:'Bass · drum & bass · techno', en:'Bass · drum & bass · techno'}
  ];
  const labels = {
    wc:['Toalety', 'Toilets'], access:['Bezbariérové WC', 'Accessible toilet'], medical:['První pomoc', 'First aid'],
    food:['Občerstvení', 'Food & drinks'], water:['Pitná voda', 'Drinking water'], info:['Informace', 'Information'],
    gate:['Vstup / kontrola', 'Entry / ticket check'], tent:['Kemp', 'Campsite'], parking:['Parkování', 'Parking']
  };
  const facilities = [
    ['info',523,675], ['medical',578,675], ['access',625,620], ['wc',620,574], ['water',598,485],
    ['food',552,447], ['wc',447,348], ['water',486,289], ['food',755,299], ['wc',813,282],
    ['medical',764,359], ['access',754,244], ['wc',403,218], ['water',449,218], ['tent',365,240]
  ];
  const icon = (type, x=0, y=0, size=24) => `<use href="#plan-icon-${type}" x="${x}" y="${y}" width="${size}" height="${size}" aria-hidden="true"/>`;
  const definitions = () => `<defs>
    <pattern id="plan-paving" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M0 0H18V18" fill="none" stroke="#46483e" stroke-width=".8"/></pattern>
    <pattern id="plan-lawn" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" fill="#506344" opacity=".5"/></pattern>
    <symbol id="plan-icon-wc" viewBox="0 0 24 24"><text x="12" y="16" text-anchor="middle" fill="currentColor" stroke="none" font-size="10" font-weight="700">WC</text></symbol>
    <symbol id="plan-icon-info" viewBox="0 0 24 24"><path d="M12 10V18M12 6V7"/></symbol>
    <symbol id="plan-icon-medical" viewBox="0 0 24 24"><path d="M10 4H14V10H20V14H14V20H10V14H4V10H10Z" fill="currentColor" stroke="none"/></symbol>
    <symbol id="plan-icon-water" viewBox="0 0 24 24"><path d="M12 3C10 7 5 11 5 15A7 7 0 0 0 19 15C19 11 14 7 12 3Z"/><path d="M8 15A4 4 0 0 0 12 19"/></symbol>
    <symbol id="plan-icon-food" viewBox="0 0 24 24"><path d="M5 3V9M8 3V9M11 3V9M5 8Q8 13 11 8M8 11V21M18 3Q13 9 18 12V21M18 3V12"/></symbol>
    <symbol id="plan-icon-access" viewBox="0 0 24 24"><circle cx="11" cy="4" r="2"/><path d="M11 8V13H16L20 20M11 10H16M8 11A6 6 0 1 0 15 19"/></symbol>
    <symbol id="plan-icon-gate" viewBox="0 0 24 24"><path d="M4 21V4H20V21M9 21V8H15V21M2 21H22M10 14H14"/></symbol>
    <symbol id="plan-icon-tent" viewBox="0 0 24 24"><path d="M2 20L12 4L22 20ZM12 4V20L17 20L12 12"/></symbol>
    <symbol id="plan-icon-parking" viewBox="0 0 24 24"><path d="M8 20V4H14A5 5 0 0 1 14 14H8"/></symbol>
  </defs>`;

  const festivalDays = () => window.FESTIVAL_DATA?.festival?.dates || [];
  const stageVenue = stage => window.FESTIVAL_DATA?.venues?.find(item => item.id === stage.id);
  const stageName = stage => stageVenue(stage)?.name || stage.name;
  const integer = value => Number(value).toLocaleString(lang() === 'en' ? 'en-GB' : 'cs-CZ');
  function capacityRow(stage, dayId) {
    const live = window.PulseCapacity?.snapshot({venueId:stage.id,days:[dayId]})?.[0];
    if (live) return live;
    const capacity = Number(stageVenue(stage)?.capacity || ({h1:5000,h2:3000,h3:1500})[stage.id]);
    return {capacity, remaining:capacity, sold:0};
  }
  function capacityLabel(row) {
    return tr(`Zbývá ${integer(row.remaining)} z ${integer(row.capacity)}`, `${integer(row.remaining)} of ${integer(row.capacity)} left`);
  }
  function stageMarkup(stage) {
    const name = stageName(stage), row = capacityRow(stage,festivalDays()[0]?.id);
    return `<a id="plan-${stage.id}" class="plan-stage-link" href="program.html?venue=${stage.id}" aria-label="${esc(name)} — ${tr('otevřít program scény','open stage programme')}">
      <title>${esc(name)} · ${tr('program a vstupenky','programme and tickets')}</title>
      <g transform="translate(${stage.x} ${stage.y})" style="--stage-color:${stage.color}">
        <rect class="plan-stage-card" x="-108" y="-35" width="216" height="91" rx="12"/>
        <rect x="-108" y="-35" width="8" height="91" rx="4" fill="${stage.color}"/>
        <text class="plan-stage-number" x="-87" y="-11">${stage.number} / ${tr('SCÉNA','STAGE')}</text>
        <text class="plan-stage-name" x="-87" y="16">${esc(name)}</text>
        <text class="plan-stage-description" data-plan-capacity="${stage.id}" data-remaining="${row.remaining}" data-sold="${row.sold}" data-total="${row.capacity}" x="-87" y="38">${esc(capacityLabel(row))}</text>
      </g></a>`;
  }
  function refreshCapacities(container) {
    const dayId = container.querySelector('#plan-day')?.value || festivalDays()[0]?.id;
    const day = festivalDays().find(item => item.id === dayId);
    const dateLabel = day ? new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'cs-CZ',{day:'numeric',month:'long'}).format(new Date(day.date+'T12:00:00')) : '';
    for (const stage of stages) {
      const node = container.querySelector(`[data-plan-capacity="${stage.id}"]`);
      if (!node) continue;
      const row = capacityRow(stage,dayId), label = capacityLabel(row);
      node.textContent = label;
      node.dataset.remaining = row.remaining; node.dataset.sold = row.sold; node.dataset.total = row.capacity;
      node.classList.toggle('plan-capacity-full',row.remaining === 0);
      const link = node.closest('a');
      const programme = `program.html?venue=${stage.id}&day=${dayId}`;
      link.setAttribute('href', programme);
      container.querySelector(`[data-plan-program="${stage.id}"]`)?.setAttribute('href', programme);
      const description = `${stageName(stage)} · ${dateLabel} · ${label} · ${integer(row.sold)} ${tr('obsazeno','sold')}`;
      link.querySelector('title').textContent = description;
      link.setAttribute('aria-label',`${description} — ${tr('otevřít program scény','open stage programme')}`);
    }
  }

  function facilityMarkup([type,x,y]) {
    const name = labels[type][lang() === 'en' ? 1 : 0];
    const leftLabel = type === 'info' || (type === 'wc' && x === 403);
    return `<g class="plan-facility plan-${type}" transform="translate(${x} ${y})"><title>${esc(name)}</title><rect x="-17" y="-17" width="34" height="34" rx="8"/>${icon(type,-12,-12)}<text class="plan-detail-label" x="${leftLabel ? -23 : 23}" y="5" text-anchor="${leftLabel ? 'end' : 'start'}">${esc(name)}</text></g>`;
  }

  function mapArtwork() {
    // District shapes, street names and walking links orient the visitor; venue zones are fictional.
    return `${definitions()}
      <rect width="1200" height="820" fill="#181e20"/>
      <g class="plan-geography">
        <path d="M0 176C178 180 271 83 443 83S720 151 892 139S1080 91 1200 67V0H0Z" fill="#244d5e"/>
        <path d="M0 162C178 166 271 69 443 69S720 137 892 125S1080 77 1200 53" fill="none" stroke="#6394a3" stroke-width="2"/>
        <path d="M30 103Q155 111 236 76M731 70Q828 91 924 67M1014 39L1101 19" fill="none" stroke="#487888" stroke-width="2" opacity=".6"/>
        <text x="56" y="56" class="plan-water-label">VLTAVA</text>
        <path d="M0 190C150 188 227 132 303 119L517 145 545 277 455 339 493 465 282 674 0 674Z" fill="#253c2e"/>
        <path d="M0 190C150 188 227 132 303 119L517 145 545 277 455 339 493 465 282 674 0 674Z" fill="url(#plan-lawn)"/>
        <path d="M16 307C114 231 152 254 198 319S161 451 84 494M61 636C112 552 173 558 215 477S201 295 289 276M14 576C112 501 94 377 155 307M16 211C143 196 196 184 245 158" class="plan-park-path"/>
        <path d="M25 432C31 377 76 366 101 397S100 465 62 474Z" fill="#335651" stroke="#5d7b69"/>
        <text x="56" y="532" class="plan-district-label">STROMOVKA</text>
        <text x="59" y="555" class="plan-district-small">${tr('park · pěší cesty','park · walking paths')}</text>
        <path d="M246 448L289 300 548 301 644 436 638 686 293 688 235 603Z" fill="#303530" stroke="#617159" stroke-width="2"/>
        <path d="M246 448L289 300 548 301 644 436 638 686 293 688 235 603Z" fill="url(#plan-paving)" opacity=".35"/>
        <path d="M545 187L612 157 822 181 853 303 763 352 609 319Z" fill="#253b42" stroke="#5e8d9d" stroke-width="2"/>
        <path d="M284 183L343 161 473 172 500 251 439 292 298 277Z" fill="#373e2b" stroke="#87945e" stroke-width="2"/>
        <text x="901" y="730" data-no-translate class="plan-district-label">HOLEŠOVICE</text>
      </g>
      <g class="plan-streets">
        <path d="M0 731H1200M730 306L748 820M1088 240L1075 820" stroke="#434c4e" stroke-width="35" fill="none"/>
        <path d="M0 731H1200M730 306L748 820M1088 240L1075 820" stroke="#9ca7a4" stroke-width="1.5" fill="none"/>
        <path d="M790 793H1026L1031 617H800ZM822 477H1026V345H815Z" fill="#2c3133" stroke="#4c5657" stroke-width="3"/>
        <path d="M855 490H1026M850 594H1026M1108 630H1200M785 686H1016M782 534H900" stroke="#434c4e" stroke-width="14"/>
        <path d="M834 366H896V404H834ZM918 365H1002V402H918ZM846 428H915V456H846ZM932 428H1004V456H932ZM824 636H891V668H824ZM916 636H1003V667H916ZM821 761H892V788H821ZM915 761H1001V789H915ZM1109 355H1184V414H1109ZM1114 445H1184V483H1114Z" fill="#3b4243"/>
        <path d="M718 717H759M718 706H759M718 695H759M1061 717H1102M1061 706H1102M1061 695H1102" stroke="#d5d8cc" stroke-width="5"/>
        <text x="40" y="776" data-no-translate class="plan-street-label">U Výstaviště / Veletržní</text>
        <text x="780" y="614" transform="rotate(-88 780 614)" data-no-translate class="plan-street-label">Dukelských hrdinů</text>
        <text x="1135" y="600" transform="rotate(-88 1135 600)" data-no-translate class="plan-street-label">Argentinská</text>
      </g>
      <g class="plan-buildings">
        <path d="M270 517H520V628H270ZM246 543H270V601H246ZM520 543H544V601H520Z" fill="#5d5550" stroke="#a68a74" stroke-width="2"/>
        <path d="M283 528H507M283 616H507M321 518V538M364 518V538M407 518V538M450 518V538M493 518V538" stroke="#a68a74" stroke-width="2"/>
        <path d="M373 517V495L396 476L419 495V517Z" fill="#766758" stroke="#a68a74" stroke-width="2"/>
        <rect x="309" y="356" width="87" height="89" rx="9" fill="#4b5344" stroke="#92a376" stroke-width="2"/>
        <path d="M317 364L387 436M387 364L317 436" stroke="#6c7e60"/>
        <path d="M609 179L726 191 730 215 604 203Z" fill="#5c7580" stroke="#9bbfcd" stroke-width="2"/>
        <path d="M663 274L783 280 786 307 664 305Z" fill="#40535a"/>
        <text x="270" y="653" class="plan-building-label">${tr('Průmyslový palác','Industrial Palace')}</text>
        <path d="M309 183L321 197H297ZM344 185L356 199H332ZM380 188L392 202H368ZM416 191L428 205H404ZM316 215L328 229H304ZM354 218L366 232H342Z" fill="#b8aa7b" stroke="#d8c999" stroke-width="1.5"/>
        <rect x="407" y="238" width="40" height="17" rx="4" fill="#9b9d80"/><circle cx="416" cy="258" r="3" fill="#d0d2c4"/><circle cx="439" cy="258" r="3" fill="#d0d2c4"/>
        <g class="plan-detail-buildings" fill="#9c8164" stroke="#e0c29d" stroke-width="1">
          <rect x="531" y="410" width="15" height="19" rx="2"/><rect x="553" y="410" width="15" height="19" rx="2"/><rect x="575" y="410" width="15" height="19" rx="2"/>
          <rect x="786" y="301" width="17" height="14" rx="2"/><rect x="809" y="301" width="17" height="14" rx="2"/>
        </g>
      </g>
      <g data-plan-layer-group="routes" class="plan-route-layer">
        <path d="M1055 515L988 535 803 551 748 650 648 650 590 650 590 603 537 603M746 685L648 685 648 650M537 603L564 548 546 485 472 485 472 392 443 392M472 392L501 334 535 286 576 286 597 242M535 286L476 250M537 603L495 666 395 666 395 632" class="plan-route-underlay"/>
        <path d="M1055 515L988 535 803 551 748 650 648 650 590 650 590 603 537 603M746 685L648 685 648 650M537 603L564 548 546 485 472 485 472 392 443 392M472 392L501 334 535 286 576 286 597 242M535 286L476 250M537 603L495 666 395 666 395 632" class="plan-walking-route"/>
        <path d="M647 661L583 661 577 598 529 598M577 598L578 488 485 488 485 398M485 398L517 338 550 302 585 302 612 268" class="plan-accessible-route"/>
        <g class="plan-route-tag" transform="translate(560 335)"><rect x="-6" y="-16" width="113" height="25" rx="5"/><text x="3" y="1">${tr('směr River Stage','to River Stage')}</text></g>
        <g class="plan-route-tag" transform="translate(848 570)"><rect x="-6" y="-16" width="145" height="25" rx="5"/><text x="3" y="1">${tr('od metra k areálu','metro → festival site')}</text></g>
        <g class="plan-detail-labels"><text x="545" y="526">${tr('Hlavní promenáda','Main promenade')}</text><text x="280" y="315">${tr('Parkový vstup','Park entrance')}</text><text x="683" y="335">${tr('Nábřežní zóna','Riverside zone')}</text></g>
      </g>
      <g class="plan-gates">
        <g transform="translate(648 650)"><rect x="-20" y="-20" width="40" height="40" rx="10" fill="#ff8256"/>${icon('gate',-13,-13,26)}<text x="-28" y="47" class="plan-gate-label">${tr('HLAVNÍ VSTUP','MAIN ENTRANCE')}</text></g>
        <g transform="translate(475 267)"><rect x="-12" y="-12" width="24" height="24" rx="5" fill="#c3cf9d"/><path d="M-5 0H5M1-4L5 0 1 4" stroke="#182320" fill="none" stroke-width="2"/></g>
        <path d="M252 350L239 379M248 449L239 477M295 676H332M548 679H581M643 516L646 554" stroke="#9aa78b" stroke-width="3"/>
      </g>
      <g data-plan-layer-group="facilities" class="plan-facility-layer">${facilities.map(facilityMarkup).join('')}</g>
      <g data-plan-layer-group="transport" class="plan-transport-layer">
        <g transform="translate(1055 515)"><rect x="-21" y="-21" width="42" height="42" rx="11" fill="#c64245"/><text x="0" y="8" text-anchor="middle" font-size="24" font-weight="700" fill="#fff">M</text><text x="-10" y="-39" text-anchor="end" class="plan-transport-label">Nádraží Holešovice · C</text></g>
        <g transform="translate(746 685)"><rect x="-18" y="-18" width="36" height="36" rx="8" fill="#dfbc62"/><text x="0" y="7" text-anchor="middle" font-size="22" font-weight="700" fill="#181e20">T</text><text x="0" y="83" text-anchor="middle" class="plan-transport-label">${tr('Tram Výstaviště','Výstaviště tram stop')}</text></g>
        <g class="plan-parking" transform="translate(912 645)"><rect x="-25" y="-25" width="50" height="50" rx="9" fill="#416c8c"/>${icon('parking',-14,-14,28)}<text x="0" y="47" text-anchor="middle" class="plan-detail-label">${tr('městské zóny','city parking zones')}</text></g>
        <g transform="translate(643 750)"><path d="M0 0L0 37M8 0V37M-6 12H14M-6 25H14" stroke="#b0b8b4" stroke-width="1.5"/><text x="-17" y="24" text-anchor="end" class="plan-detail-label">${tr('tramvajová trať','tram tracks')}</text></g>
      </g>
      <g class="plan-stage-layer">${stages.map(stageMarkup).join('')}</g>
      <a href="info.html#camping" aria-label="${tr('Informace a ceny kempování','Camping information and prices')}" class="plan-camping-link"><text x="307" y="152" class="plan-camp-label">${tr('FESTIVALOVÝ KEMP','FESTIVAL CAMPSITE')} →</text></a>
      <g transform="translate(1148 740)" class="plan-compass"><path d="M0 35V-15M-7-7L0-18 7-7"/><text x="0" y="-28" text-anchor="middle">N</text></g>
    `;
  }

  function markup() {
    const legend = ['wc','medical','food','water','info','access'].map(type => `<span class="plan-key-item"><svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true"><use href="#plan-icon-${type}"/></svg>${labels[type][lang() === 'en' ? 1 : 0]}</span>`).join('');
    return `<div class="venue-plan venue-plan-detailed" id="venue-plan">
      <div class="venue-plan-toolbar"><div class="venue-plan-controls" role="group" aria-label="${tr('Ovládání plánku','Map controls')}">
        <button type="button" class="secondary small" data-plan-zoom="in" aria-label="${tr('Přiblížit plánek','Zoom in')}">+</button>
        <button type="button" class="secondary small" data-plan-zoom="out" aria-label="${tr('Oddálit plánek','Zoom out')}">−</button>
        <button type="button" class="secondary small" data-plan-reset>${tr('Celý plánek','Reset map')}</button>
        <output class="plan-zoom-level" aria-label="${tr('Přiblížení','Zoom level')}">1×</output>
      </div><label class="plan-day-label" for="plan-day"><span>${tr('Kapacita pro den','Availability on')}</span><select id="plan-day">${festivalDays().map(day=>`<option value="${esc(day.id)}">${esc(new Intl.DateTimeFormat(lang() === 'en' ? 'en-GB' : 'cs-CZ',{day:'numeric',month:'long'}).format(new Date(day.date+'T12:00:00')))}</option>`).join('')}</select></label><p id="plan-help" class="plan-help">${tr('Táhni mapu · dvěma prsty přibližuj · klávesy + / − a šipky','Drag to move · pinch to zoom · keyboard + / − and arrows')}</p></div>
      <fieldset class="venue-plan-layers"><legend>${tr('Zobrazit v mapě','Map layers')}</legend>${[['routes','Pěší trasy','Walking routes'],['facilities','Zázemí','Facilities'],['transport','Doprava','Transport']].map(([id,cs,en])=>`<label><input type="checkbox" data-plan-layer="${id}" checked><span>${tr(cs,en)}</span></label>`).join('')}</fieldset>
      <div class="venue-plan-frame"><svg id="festival-plan-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820" width="1200" height="820" tabindex="0" role="group" aria-describedby="plan-help plan-caption" aria-label="${tr('Festivalový plánek: tři scény, pěší trasy, vstupy a zázemí','Festival site plan: three stages, walking routes, entrances and facilities')}"><title>${tr('Prague Pulse Fest — orientační plánek areálu','Prague Pulse Fest — schematic site plan')}</title><desc>${tr('Main Hall je v Průmyslovém paláci, Club Stage severně od něj, River Stage u Vltavy. Hlavní vstup je od tramvaje Výstaviště. Pěší promenáda spojuje všechny tři scény. Značky ukazují toalety, vodu, občerstvení, informace a první pomoc.','Main Hall is in the Industrial Palace, Club Stage is to its north and River Stage is by the Vltava. The main entrance is from the Výstaviště tram stop. A pedestrian promenade links all three stages. Markers show toilets, water, food, information and first aid.')}</desc>${mapArtwork()}</svg><div class="plan-detail-hint">${tr('Přibliž pro názvy zázemí','Zoom in for facility labels')}</div></div>
      <div class="venue-plan-key" aria-label="${tr('Legenda značek','Map legend')}">${legend}<span class="plan-key-item"><i class="plan-key-route" aria-hidden="true"></i>${tr('Pěší trasa','Walking route')}</span><span class="plan-key-item"><i class="plan-key-access" aria-hidden="true"></i>${tr('Bezbariérové propojení','Step-free link')}</span></div>
      <nav class="venue-plan-legend" aria-label="${tr('Program jednotlivých scén','Stage programmes')}">${stages.map(stage=>`<a class="button secondary small" data-plan-program="${stage.id}" href="program.html?venue=${stage.id}"><i style="--stage-color:${stage.color}" aria-hidden="true"></i>${esc(stageName(stage))}<span aria-hidden="true">→</span></a>`).join('')}<a href="info.html#camping" class="button secondary small">${tr('Kempování','Camping')}<span aria-hidden="true">→</span></a></nav>
      <p class="count" id="plan-caption">${tr('Orientační návrh festivalového areálu. Vnější trasy a parkování ověř před cestou.','Schematic festival layout. Check external walking routes and parking before travelling.')} <a href="https://parking.praha.eu/cs/mapa/" target="_blank" rel="noopener noreferrer">${tr('Parkovací zóny Praha','Prague parking zones')} →</a></p>
      <span class="plan-sr-only" data-plan-status role="status" aria-live="polite"></span>
    </div>`;
  }

  function mount(root=document) {
    const svg = root.querySelector('#festival-plan-svg');
    if (!svg || svg.dataset.ready) return;
    svg.dataset.ready = 'true';
    const container = svg.closest('.venue-plan');
    const zoomIn = container.querySelector('[data-plan-zoom="in"]');
    const zoomOut = container.querySelector('[data-plan-zoom="out"]');
    const output = container.querySelector('.plan-zoom-level');
    const status = container.querySelector('[data-plan-status]');
    container.querySelector('#plan-day')?.addEventListener('change',() => refreshCapacities(container));
    refreshCapacities(container);
    let zoom = 1, x = 0, y = 0, gesture = null, moved = false;
    const pointers = new Map();
    const clamp = (number, low, high) => Math.max(low, Math.min(high, number));
    function update(announce=false) {
      const width = WIDTH / zoom, height = HEIGHT / zoom;
      x = clamp(x, 0, WIDTH - width); y = clamp(y, 0, HEIGHT - height);
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
      svg.dataset.zoom = zoom.toFixed(2);
      container.classList.toggle('plan-is-detailed', zoom >= 1.7);
      container.classList.toggle('plan-is-close', zoom >= 3.4);
      zoomIn.disabled = zoom >= MAX_ZOOM - 0.001; zoomOut.disabled = zoom <= 1.001;
      output.value = `${Number(zoom.toFixed(1))}×`;
      if (announce) status.textContent = `${tr('Přiblížení','Zoom')} ${Number(zoom.toFixed(1))}×`;
    }
    // Convert through the SVG transform so padding/letterboxing does not shift the zoom anchor.
    function worldPoint(clientX, clientY, matrix=svg.getScreenCTM()?.inverse()) {
      if (!matrix) return {x:WIDTH/2,y:HEIGHT/2};
      const point = svg.createSVGPoint(); point.x = clientX; point.y = clientY;
      return point.matrixTransform(matrix);
    }
    function changeZoom(factor, anchor) {
      const previous = zoom, next = clamp(zoom * factor, 1, MAX_ZOOM);
      const center = anchor || {x:x + WIDTH/previous/2,y:y + HEIGHT/previous/2};
      const fractionX = (center.x-x)/(WIDTH/previous), fractionY = (center.y-y)/(HEIGHT/previous);
      zoom = next; x = center.x - fractionX*WIDTH/zoom; y = center.y - fractionY*HEIGHT/zoom;
      update(true);
    }
    function reset() { zoom = 1; x = 0; y = 0; update(true); }
    zoomIn.addEventListener('click', () => changeZoom(1.5));
    zoomOut.addEventListener('click', () => changeZoom(1/1.5));
    container.querySelector('[data-plan-reset]').addEventListener('click', reset);
    container.querySelectorAll('[data-plan-layer]').forEach(control => control.addEventListener('change', () => {
      const layer = svg.querySelector(`[data-plan-layer-group="${control.dataset.planLayer}"]`);
      if (layer) layer.style.display = control.checked ? '' : 'none';
    }));
    function beginGesture() {
      const values = [...pointers.values()];
      if (!values.length) { gesture = null; return; }
      const midpoint = values.length > 1 ? {x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2} : values[0];
      const matrix = svg.getScreenCTM()?.inverse();
      gesture = {x,y,zoom,matrix,anchor:worldPoint(midpoint.x,midpoint.y,matrix),distance:values.length>1 ? Math.hypot(values[1].x-values[0].x,values[1].y-values[0].y) : 0};
    }
    svg.addEventListener('pointerdown', event => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); moved = false;
      if (!event.target.closest('a')) {
        svg.focus({preventScroll:true});
        svg.setPointerCapture(event.pointerId);
      }
      // Keep a short tap on a stage link clickable; capture only after the user starts dragging.
      beginGesture();
    });
    svg.addEventListener('pointermove', event => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      const values = [...pointers.values()];
      const midpoint = values.length>1 ? {x:(values[0].x+values[1].x)/2,y:(values[0].y+values[1].y)/2} : values[0];
      const position = worldPoint(midpoint.x,midpoint.y,gesture.matrix);
      if (values.length > 1 && gesture.distance > 0) {
        const distance = Math.hypot(values[1].x-values[0].x,values[1].y-values[0].y);
        zoom = clamp(gesture.zoom*distance/gesture.distance,1,MAX_ZOOM);
        const fractionX = (position.x-gesture.x)/(WIDTH/gesture.zoom), fractionY = (position.y-gesture.y)/(HEIGHT/gesture.zoom);
        x = gesture.anchor.x - fractionX*WIDTH/zoom; y = gesture.anchor.y - fractionY*HEIGHT/zoom;
      } else { x = gesture.x + gesture.anchor.x - position.x; y = gesture.y + gesture.anchor.y - position.y; }
      if (Math.abs(position.x-gesture.anchor.x)+Math.abs(position.y-gesture.anchor.y)>3 || values.length>1) {
        moved = true; svg.classList.add('plan-is-dragging');
        if (!svg.hasPointerCapture(event.pointerId)) svg.setPointerCapture(event.pointerId);
      }
      update();
    });
    function release(event) {
      pointers.delete(event.pointerId);
      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
      svg.classList.remove('plan-is-dragging'); beginGesture();
    }
    svg.addEventListener('pointerup',release); svg.addEventListener('pointercancel',release);
    svg.addEventListener('lostpointercapture', event => { if (pointers.has(event.pointerId)) { pointers.delete(event.pointerId); beginGesture(); } });
    svg.addEventListener('click',event => { if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; } },true);
    svg.addEventListener('dblclick',event => { if (event.target.closest('a')) return; event.preventDefault(); changeZoom(1.6,worldPoint(event.clientX,event.clientY)); });
    svg.addEventListener('wheel',event => {
      if (!event.ctrlKey && !event.metaKey && document.activeElement !== svg) return;
      event.preventDefault(); changeZoom(event.deltaY < 0 ? 1.15 : 1/1.15,worldPoint(event.clientX,event.clientY));
    },{passive:false});
    svg.addEventListener('keydown',event => {
      if (event.target !== svg) return;
      const step = 90/zoom;
      if (event.key==='+' || event.key==='=') changeZoom(1.5);
      else if (event.key==='-' || event.key==='_') changeZoom(1/1.5);
      else if (event.key==='0' || event.key==='Home' || event.key==='Escape') reset();
      else if (event.key==='ArrowLeft') x-=step;
      else if (event.key==='ArrowRight') x+=step;
      else if (event.key==='ArrowUp') y-=step;
      else if (event.key==='ArrowDown') y+=step;
      else return;
      event.preventDefault(); update();
    });
    update();
  }
  window.addEventListener('storage',event => {
    if (event.key === null || event.key === 'pulse:orders') {
      document.querySelectorAll('.venue-plan-detailed').forEach(refreshCapacities);
    }
  });
  window.PulseVenueMap = Object.freeze({markup,mount});
})();
