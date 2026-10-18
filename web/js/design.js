'use strict';
/* Original Prague Pulse Fest identity; festival data remains the source of dates and prices. */
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const tr = (cs, en) => window.PulseI18n?.lang === 'en' ? en : cs;
  const arrow = '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.8"/></svg>';
  const logo = '<img src="images/prague-pulse-logo.svg" width="170" height="65" alt="Prague Pulse Fest">';
  const logoLight = '<img src="images/prague-pulse-logo-light.svg" width="340" height="130" alt="Prague Pulse Fest">';
  function festivalDates(D) {
    const days = [...(D?.festival?.dates || [])].sort((a,b)=>a.date.localeCompare(b.date));
    const first = days[0], last = days[days.length-1];
    if (!first || !last) return null;
    const a = first.date.split('-'), b = last.date.split('-');
    return {start:`${first.date}T${first.startTime || '09:00:00'}+02:00`,end:`${last.date}T${last.endTime || '23:59:00'}+02:00`,year:a[0],range:`${a[2]}—${b[2]}`,month:a[1],first,last};
  }
  function getCountdownState(start, end, now = Date.now()) {
    const startTime = new Date(start).getTime(), endTime = new Date(end).getTime();
    const current = now instanceof Date ? now.getTime() : typeof now === 'string' ? new Date(now).getTime() : Number(now);
    if (![startTime,endTime,current].every(Number.isFinite) || endTime <= startTime) return {phase:'invalid',totalSeconds:0,days:0,hours:0,minutes:0,seconds:0};
    const phase = current < startTime ? 'upcoming' : current <= endTime ? 'during' : 'ended';
    const totalSeconds = phase === 'upcoming' ? Math.max(0,Math.ceil((startTime-current)/1000)) : 0;
    return {phase,totalSeconds,days:Math.floor(totalSeconds/86400),hours:Math.floor(totalSeconds/3600)%24,minutes:Math.floor(totalSeconds/60)%60,seconds:totalSeconds%60};
  }
  window.PulseCountdown = Object.freeze({getState:getCountdownState});
  function countdown(dates) {
    if (!dates) return '';
    const state = getCountdownState(dates.start,dates.end);
    const label = state.phase === 'upcoming' ? tr('FESTIVAL STARTUJE ZA','FESTIVAL STARTS IN') : state.phase === 'during' ? tr('FESTIVAL PRÁVĚ PROBÍHÁ','THE FESTIVAL IS LIVE') : tr(`ROČNÍK ${dates.year} SKONČIL`,`THE ${dates.year} EDITION HAS ENDED`);
    return `<aside class="pulse-countdown" data-countdown data-start="${esc(dates.start)}" data-end="${esc(dates.end)}" data-year="${esc(dates.year)}" data-countdown-lang="${window.PulseI18n?.lang === 'en' ? 'en' : 'cs'}" aria-label="${tr('Odpočet festivalu','Festival countdown')}"><p class="countdown-caption" data-countdown-caption>${state.phase==='upcoming'?`<span>FESTIVAL</span> <span>${tr('STARTUJE ZA','STARTS IN')}</span>`:label}</p><div class="countdown-values" aria-live="off" ${state.phase!=='upcoming'?'hidden':''}>${[['days',tr('DNÍ','DAYS')],['hours',tr('HODIN','HOURS')],['minutes',tr('MINUT','MINUTES')],['seconds',tr('SEKUND','SECONDS')]].map(([key,text])=>`<div><strong data-countdown-value="${key}">${String(state[key]).padStart(2,'0')}</strong><span>${text}</span></div>`).join('')}</div><a class="countdown-program" href="program.html" ${state.phase==='upcoming'?'hidden':''}>${tr('Prohlédnout program','Explore the programme')} ${arrow}</a></aside>`;
  }
  function home(D) {
    const performers = D.performers || [];
    const featured = ['i1','i2','i3'].map(id=>performers.find(p=>p.id===id)).filter(Boolean);
    const support = ['i4','i5','i7','i11','i16','i20','i28','i35'].map(id=>performers.find(p=>p.id===id)).filter(Boolean);
    const dates = festivalDates(D), year = dates?.year || '';
    const locale = window.PulseI18n?.lang === 'en' ? 'en-GB' : 'cs-CZ';
    const money = value => new Intl.NumberFormat(locale,{style:'currency',currency:'CZK',maximumFractionDigits:0}).format(value);
    const performerStyle = p => window.PerformerArt?.style(p.id) || "background-image:url('images/festival-crowd.png');background-size:contain;background-position:center";
    const benefit = (cs,en,available=true) => ({label:tr(cs,en),available});
    const packageBenefits = category => [
      benefit('Všechny tři dny a všechny scény','All three days and all stages'),
      benefit(category==='vip'?'VIP sedadlo v Main Hall':category==='regular'?'Regular sedadlo v Main Hall':'Sedadlo v Main Hall',category==='vip'?'VIP seat in Main Hall':category==='regular'?'Regular seat in Main Hall':'Seat in Main Hall',category!=='standing'),
      benefit('River a Club Stage: stání','River and Club Stage: standing'),
      benefit('Rychlejší odbavení','Priority entry',category==='vip'),
      benefit('VIP odpočinková zóna','VIP relaxation lounge',category==='vip'),
      benefit('Jedno VIP parkovací místo','One VIP parking space',category==='vip')
    ];
    const packages = [
      {category:'vip',name:'VIP',match:/VIP/},
      {category:'regular',name:'Regular',match:/Regular/},
      {category:'standing',name:tr('Stání','Standing'),match:/Stání/}
    ].map(item=>({...item,benefits:packageBenefits(item.category),ticket:(D.festival?.tickets||[]).find(t=>/^3/.test(t.name)&&item.match.test(t.name))})).filter(item=>item.ticket);
    const stageOffers = (D.venues || []).filter(venue=>venue.ticketing?.prices?.standing);
    const stageCapacity = venue => new Intl.NumberFormat(locale).format(venue.capacity);
    const localText = value => typeof value==='object' ? value?.[window.PulseI18n?.lang==='en'?'en':'cs'] || value?.cs || '' : value || '';
    const news = (window.PulseNews?.items || []).slice(0,3);
    return `
      <section class="rocks-hero pulse-hero" aria-labelledby="festival-title">
        <picture class="pulse-hero-photo"><img src="images/vystaviste-hero.webp" alt="${tr('Průmyslový palác na Výstavišti Praha','The Industrial Palace at Výstaviště Prague')}" width="1600" height="900" fetchpriority="high" decoding="async"></picture>
        <div class="pulse-hero-shade"></div>
        <div class="pulse-hero-content"><p class="pulse-hero-kicker">VÝSTAVIŠTĚ PRAHA</p><h1 id="festival-title" class="pulse-hero-title"><span>PRAGUE</span><span>PULSE</span><span class="pulse-hero-fest">FEST</span></h1><div class="pulse-hero-meta"><p class="pulse-hero-date">${esc(dates?.range || '')}<span> / ${esc(dates?.month || '')} / ${esc(year)}</span></p><p>${tr('Výstaviště Praha · 3 dny · 3 scény','Výstaviště Prague · 3 days · 3 stages')}</p></div><div class="pulse-hero-actions"><a href="#festival-passes" class="button hero-buy">${tr('VSTUPENKY','TICKETS')} ${arrow}</a><a href="#lineup-title" class="button hero-lineup">LINE-UP ${arrow}</a></div></div>
        <p class="pulse-hero-location"><a href="credits.html">${tr('Foto','Photo')}: Bengt Nyman · CC BY 2.0 · 2018</a></p>
      </section>
      <div class="home-content">
      ${countdown(dates)}
      <section class="home-passes" id="festival-passes" aria-labelledby="passes-title"><div class="section-head"><div><p class="section-index">${tr('1.—3. SRPNA','1—3 AUGUST')} ${esc(year)}</p><h2 id="passes-title">${tr('VSTUPENKY','TICKETS')}</h2></div><p class="section-note">${tr('Celý festival, nebo jedna oblíbená scéna. Vyber si vstup podle svého programu.','The full festival or one favourite stage. Choose admission to suit your programme.')}</p></div><div class="home-package-grid">${packages.map(item=>`<article class="home-package home-package-${item.category}"><div class="package-top"><span class="badge">${tr('CELÝ FESTIVAL · 3 DNY','FULL FESTIVAL · 3 DAYS')}</span><span class="package-category">${tr('CELOFESTIVALOVÁ','FESTIVAL PASS')}</span></div><h3>${esc(item.name)}</h3><p class="home-package-price">${esc(money(item.ticket.price))}</p><p class="package-fee">${tr('Konečná cena včetně všech poplatků.','Final price including all fees.')}</p><ul>${item.benefits.map(benefit=>`<li class="benefit ${benefit.available?'is-included':'is-unavailable'}"><svg class="benefit-icon" viewBox="0 0 20 20" aria-hidden="true" fill="none">${benefit.available?'<path d="m4 10 4 4 8-8"/>':'<path d="m5 5 10 10M15 5 5 15"/>'}</svg><span><span class="visually-hidden">${benefit.available?tr('Zahrnuto:','Included:'):tr('Není součástí:','Not included:')} </span>${esc(benefit.label)}</span></li>`).join('')}</ul><a class="button package-buy" href="tickets.html?category=${item.category}&amp;scope=festival" aria-label="${tr('Koupit třídenní vstupenku','Buy a three-day pass')}: ${esc(item.name)}">${tr('KOUPIT','BUY')} ${arrow}</a></article>`).join('')}</div><p class="pass-admission-note">${tr('Společný vstup platí na všech třech scénách. VIP a Regular mají sedadlo v Main Hall; na River a Club Stage se stojí.','A full-festival pass includes all three stages. VIP and Regular seats are in Main Hall; River and Club Stage are standing only.')}</p><a href="tickets.html?scope=day" class="button secondary all-ticket-options">${tr('Jednodenní a dvoudenní vstupenky','One-day and two-day tickets')} ${arrow}</a>${stageOffers.length?`<div class="stage-offers-heading"><h3>${tr('VSTUP NA JEDNU SCÉNU','SINGLE-STAGE TICKETS')}</h3><p>${tr('Levnější vstupenka, když máš vybranou scénu. Platí pouze na zvolené scéně a v označených dnech.','A lower-priced option when you have a stage in mind. Valid only for your chosen stage and dates.')}</p></div><div class="stage-offer-grid">${stageOffers.map(venue=>`<article class="stage-offer stage-offer-${esc(venue.id)}"><p class="section-index">${esc(venue.name)}</p><h4>${tr('Stání','Standing')}</h4><dl><div><dt>${tr('1 den','1 day')}</dt><dd>${esc(money(venue.ticketing.prices.standing.day))}</dd></div><div><dt>${tr('3 dny','3 days')}</dt><dd>${esc(money(venue.ticketing.prices.standing.festival))}</dd></div></dl><p>${tr('Kapacita scény','Stage capacity')}: ${stageCapacity(venue)}. ${venue.id==='h1'?tr('Také VIP a Regular sedadla.','VIP and Regular seats also available.'):tr('Pouze stání.','Standing only.')}</p><a class="button secondary small" href="tickets.html?venue=${esc(venue.id)}&amp;category=standing&amp;scope=day" aria-label="${tr('Vybrat vstup na scénu','Choose admission to')} ${esc(venue.name)}">${tr('VYBRAT VSTUP','CHOOSE TICKETS')} ${arrow}</a></article>`).join('')}</div>`:''}</section>
      <section class="rocks-lineup" aria-labelledby="lineup-title"><div class="section-head"><div><h2 id="lineup-title">LINE-UP<span class="heading-year">${esc(year)}</span></h2><p class="lineup-disclaimer">${tr('Návrh line-upu fiktivního festivalu.','Proposed line-up for a fictional festival.')}</p></div><a href="performers.html" class="button all-artists">${tr('VŠECHNA JMÉNA','ALL ARTISTS')} ${arrow}</a></div><div class="rocks-lineup-poster"><p class="poster-label">PRAGUE PULSE FEST / ${esc(year)}</p><div class="rocks-headliners">${featured.map((p,i)=>`<button type="button" data-artist="${esc(p.id)}" class="headliner-${i}">${esc(p.name)}</button>`).join('')}</div><div class="rocks-support">${support.map(p=>`<button type="button" data-artist="${esc(p.id)}">${esc(p.name)}</button>`).join('<span aria-hidden="true">/</span>')}</div><p class="programme-highlight-note">${tr('Každý večer tři závěrečné koncerty: River 18:30, Club 20:00 a Main Hall 21:30. Mezi nimi máš 30 minut na přesun. Ostatní koncerty mohou probíhat souběžně.','Three closing shows each evening: River at 18:30, Club at 20:00 and Main Hall at 21:30. Allow 30 minutes to move between them. Other performances may overlap.')}</p><a href="program.html" class="lineup-program">${tr('CELÝ PROGRAM','FULL PROGRAM')} ${arrow}</a></div><div class="rocks-artist-grid">${featured.map(p=>`<article class="rocks-artist"><button class="rocks-artist-image" type="button" data-artist="${esc(p.id)}" aria-label="${tr('Profil interpreta','Artist profile')}: ${esc(p.name)}"><span class="rocks-portrait" style="${esc(performerStyle(p))}" aria-hidden="true"></span><span class="artist-monogram" aria-hidden="true">${esc(p.name.split(' ').map(s=>s[0]).join(''))}</span></button><div class="rocks-artist-copy"><p>${esc(p.genre)}</p><h3>${esc(p.name)}</h3><button class="text-button" type="button" data-artist="${esc(p.id)}">${tr('Profil a vystoupení','Profile & shows')} ${arrow}</button></div></article>`).join('')}</div></section>
      ${news.length?`<section class="home-news" aria-labelledby="news-title"><div class="section-head"><div><p class="section-index">PRAGUE PULSE FEST</p><h2 id="news-title">${tr('NOVINKY','NEWS')}</h2></div><p class="section-note">${tr('Z festivalu a z areálu.','From the festival and the venue.')}</p></div><div class="news-grid">${news.map((item,index)=>`<article class="news-card"><a class="news-card-image" href="news.html?id=${encodeURIComponent(item.id)}" aria-label="${esc(localText(item.title))}"><img src="${esc(item.image||'images/vystaviste-hero.webp')}" width="800" height="600" decoding="async" alt=""><span class="news-index" aria-hidden="true">0${index+1}</span></a><div class="news-card-copy"><time datetime="${esc(item.date)}">${esc(new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${item.date}T12:00:00`)))}</time><h3><a href="news.html?id=${encodeURIComponent(item.id)}">${esc(localText(item.title))}</a></h3><p>${esc(localText(item.perex))}</p><a class="text-button" href="news.html?id=${encodeURIComponent(item.id)}">${tr('Číst dál','Read more')} ${arrow}</a></div></article>`).join('')}</div></section>`:''}
      <section class="rocks-location" aria-labelledby="location-title"><div class="rocks-location-art"><img src="images/vystaviste-hero.webp" alt="${tr('Výstaviště Praha','Výstaviště Prague')}" width="1000" height="750" loading="lazy"></div><div class="rocks-location-copy"><p class="section-index">${tr('AREÁL FESTIVALU','FESTIVAL VENUE')}</p><h2 id="location-title">VÝSTAVIŠTĚ<br>PRAHA</h2><p>${tr('Průmyslový palác, otevřený prostor a tři hudební scény. Stromovka za rohem a tramvaj kousek od hlavního vstupu.','The Industrial Palace, open spaces and three music stages. Stromovka park around the corner, with a tram stop just outside the main entrance.')}</p><address>Výstaviště 67, 170 00 Praha 7</address><div class="actions"><a href="venues.html" class="button">${tr('SCÉNY A AREÁL','STAGES & VENUE')} ${arrow}</a><a href="info.html#travel" class="text-button">${tr('Jak se sem dostat','Getting here')} ${arrow}</a></div></div></section>
      </div>`;
  }
  window.PulseDesign = Object.freeze({logo,logoLight,home,festivalDates});
})();
