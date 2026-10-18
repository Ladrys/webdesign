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
    const label = state.phase === 'upcoming' ? tr('DO PRVNÍHO KONCERTU','UNTIL THE FIRST SHOW') : state.phase === 'during' ? tr('FESTIVAL PRÁVĚ PROBÍHÁ','THE FESTIVAL IS LIVE') : tr(`ROČNÍK ${dates.year} SKONČIL`,`THE ${dates.year} EDITION HAS ENDED`);
    return `<aside class="pulse-countdown" data-countdown data-start="${esc(dates.start)}" data-end="${esc(dates.end)}" data-year="${esc(dates.year)}" data-countdown-lang="${window.PulseI18n?.lang === 'en' ? 'en' : 'cs'}" aria-label="${tr('Odpočet festivalu','Festival countdown')}"><p class="countdown-caption" data-countdown-caption>${label}</p><div class="countdown-values" aria-live="off" ${state.phase!=='upcoming'?'hidden':''}>${[['days',tr('DNÍ','DAYS')],['hours',tr('HODIN','HOURS')],['minutes',tr('MINUT','MINUTES')],['seconds',tr('SEKUND','SECONDS')]].map(([key,text])=>`<div><strong data-countdown-value="${key}">${String(state[key]).padStart(2,'0')}</strong><span>${text}</span></div>`).join('')}</div><a class="countdown-program" href="program.html" ${state.phase==='upcoming'?'hidden':''}>${tr('Prohlédnout program','Explore the programme')} ${arrow}</a></aside>`;
  }
  function home(D) {
    const performers = D.performers || [];
    const featured = [performers[7], performers[24], performers[48]].filter(Boolean);
    const support = [performers[3], performers[12], performers[25], performers[39], performers[46], performers[58]].filter(Boolean);
    const days = D.festival?.dates || [];
    const dates = festivalDates(D);
    const year = dates?.year || '';
    const locale = window.PulseI18n?.lang === 'en' ? 'en-GB' : 'cs-CZ';
    const passPrice = Math.min(...(D.festival?.tickets || []).filter(t=>/3/.test(t.name)).map(t=>Number(t.price)));
    const price = Number.isFinite(passPrice) ? new Intl.NumberFormat(locale,{style:'currency',currency:'CZK',maximumFractionDigits:0}).format(passPrice) : '';
    const performerStyle = p => window.PerformerArt?.style(p.id) || "background-image:url('images/festival-crowd.png');background-size:cover;background-position:center";
    return `
      <section class="rocks-hero pulse-hero" aria-labelledby="festival-title">
        <div class="pulse-hero-film"><video id="hero-film" muted loop playsinline preload="metadata" poster="images/festival-crowd.png" aria-label="${tr('Animovaná koncertní atmosféra festivalu','Animated festival concert atmosphere')}"><source src="images/festival-atmosphere.webm" type="video/webm"><source src="images/festival-atmosphere.mp4" type="video/mp4"><img src="images/festival-crowd.png" alt="${tr('Ilustrace koncertu pod širým nebem v Praze','Illustration of an open-air concert in Prague')}" width="1536" height="1024"></video><div class="pulse-hero-shade"></div></div>
        <div class="pulse-hero-content"><p class="pulse-hero-kicker">${tr('PRAHA / VÝSTAVIŠTĚ / VLTAVA PARK','PRAGUE / VÝSTAVIŠTĚ / VLTAVA PARK')}</p><h1 id="festival-title" class="pulse-hero-title"><span>PRAGUE</span><span>PULSE<svg aria-hidden="true" viewBox="0 0 80 80"><path d="M10 24v32m15-40v48m15-59v70m15-59v48m15-40v32" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/></svg></span><span class="pulse-hero-fest">FEST</span></h1><div class="pulse-hero-meta"><p class="pulse-hero-date">${esc(dates?.range || '')}<span> / ${esc(dates?.month || '')} / ${esc(year)}</span></p><p>${tr('Tři dny hudby u Vltavy.','Three days of music by the Vltava.')}</p></div><div class="pulse-hero-actions"><a href="tickets.html" class="button hero-buy">${tr('KOUPIT VSTUPENKY','GET TICKETS')} ${arrow}</a><a href="program.html" class="button hero-lineup">LINE-UP ${esc(year)} ${arrow}</a></div></div>
        <a class="pulse-hero-sticker" href="tickets.html"><span>${tr('3 DNY / 3 SCÉNY','3 DAYS / 3 STAGES')}</span><strong>${tr('VSTUPENKY','TICKETS')}</strong><span>${tr('od','from')} <b>${esc(price)}</b> ${arrow}</span></a>
        <button type="button" id="film-toggle" class="film-toggle" aria-pressed="false"><span aria-hidden="true">▶</span> ${tr('Přehrát video','Play video')}</button>
      </section>
      ${countdown(dates)}
      <div class="rocks-statline" aria-label="${tr('Tři dny, tři scény, šedesát interpretů','Three days, three stages, sixty artists')}"><span><b>03</b> ${tr('DNY','DAYS')}</span><i aria-hidden="true">*</i><span><b>03</b> ${tr('SCÉNY','STAGES')}</span><i aria-hidden="true">*</i><span><b>60</b> ${tr('INTERPRETŮ','ARTISTS')}</span></div>
      <section class="rocks-lineup" aria-labelledby="lineup-title"><div class="section-head"><div><p class="section-index">01 / ${tr('HUDBA NA PRVNÍM MÍSTĚ','MUSIC COMES FIRST')}</p><h2 id="lineup-title">LINE-UP<span class="heading-year">${esc(year)}</span></h2></div><a href="performers.html" class="text-button">${tr('Všechna jména','All artists')} ${arrow}</a></div><div class="rocks-lineup-poster"><p class="poster-label">PRAGUE PULSE FEST</p><div class="rocks-headliners">${featured.map((p,i)=>`<button type="button" data-artist="${esc(p.id)}" class="headliner-${i}">${esc(p.name)}</button>`).join('')}</div><div class="rocks-support">${support.map(p=>`<button type="button" data-artist="${esc(p.id)}">${esc(p.name)}</button>`).join('<span aria-hidden="true">/</span>')}</div><a href="program.html" class="lineup-program">${tr('CELÝ PROGRAM','FULL PROGRAM')} ${arrow}</a><img class="lineup-star" src="images/rocks-mark.svg" alt="" width="220" height="220" loading="lazy"></div><div class="rocks-artist-grid">${featured.map((p,i)=>`<article class="rocks-artist"><button class="rocks-artist-image" type="button" data-artist="${esc(p.id)}" aria-label="${tr('Profil interpreta','Artist profile')}: ${esc(p.name)}"><span class="rocks-portrait" style="${esc(performerStyle(p))}" aria-hidden="true"></span><span class="artist-monogram" aria-hidden="true">${esc(p.name.split(' ').map(s=>s[0]).join(''))}</span></button><div class="rocks-artist-copy"><p>${esc(p.genre)}</p><h3>${esc(p.name)}</h3><button class="text-button" type="button" data-artist="${esc(p.id)}">${tr('Profil a vystoupení','Profile & shows')} ${arrow}</button></div></article>`).join('')}</div></section>
      <section class="rocks-days" aria-labelledby="days-title"><div class="section-head"><div><p class="section-index">02 / ${tr('FESTIVALOVÝ KALENDÁŘ','FESTIVAL CALENDAR')}</p><h2 id="days-title">${tr('SRPEN PATŘÍ HUDBĚ','AUGUST IS FOR MUSIC')}</h2></div></div><div class="rocks-day-grid">${days.map((day,index)=>`<article class="rocks-day"><p class="rocks-day-date"><strong>0${index+1}</strong><span>${esc(day.date.slice(5,7))} / ${esc(day.date.slice(0,4))}</span></p><div><p class="eyebrow">${esc(new Intl.DateTimeFormat(locale,{weekday:'long',timeZone:'Europe/Prague'}).format(new Date(`${day.date}T12:00:00+02:00`)).toLocaleUpperCase(locale))}</p><h3>${esc(day.theme)}</h3><p>${tr(['První koncerty, setkání a večerní headliner na hlavní scéně.','Odpolední objevy, živé kytary a noční klubové sety.','Závěrečný den ve všech třech festivalových scénách.'][index],['First concerts, reunions and an evening headliner on the main stage.','Afternoon discoveries, live guitars and late-night club sets.','The final day across all three festival stages.'][index])}</p><a href="program.html?day=${encodeURIComponent(day.id)}" class="text-button">${tr('Program dne','Day programme')} ${arrow}</a></div></article>`).join('')}</div></section>
      <section class="rocks-location" aria-labelledby="location-title"><div class="rocks-location-art"><span aria-hidden="true">PRA<br>HA.</span><img src="images/rocks-mark.svg" alt="" width="220" height="220" loading="lazy"></div><div class="rocks-location-copy"><p class="section-index">03 / ${tr('MĚSTO JE SOUČÁST FESTIVALU','THE CITY IS PART OF THE FESTIVAL')}</p><h2 id="location-title">VLTAVA<br>PARK</h2><p>${tr('Tři scény v areálu Výstaviště Praha. Stromovka za rohem, Vltava na dosah a tramvaj kousek od hlavního vstupu.','Three stages at Výstaviště Prague. Stromovka around the corner, the Vltava nearby and a tram stop just outside the main entrance.')}</p><address>Výstaviště 67, 170 00 Praha 7</address><div class="actions"><a href="venues.html" class="button">${tr('SCÉNY A AREÁL','STAGES & VENUE')} ${arrow}</a><a href="info.html#travel" class="text-button">${tr('Jak se sem dostat','Getting here')} ${arrow}</a></div></div></section>`;
  }
  window.PulseDesign = Object.freeze({logo,logoLight,home,festivalDates});
})();
