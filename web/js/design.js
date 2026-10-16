'use strict';
/* Original Prague Pulse Fest art direction. The static application owns interactions. */
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const arrow = '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.8"/></svg>';
  const logo = '<img src="images/prague-pulse-logo.svg" width="180" height="44" alt="Prague Pulse Fest">';
  const logoLight = '<img src="images/prague-pulse-logo-light.svg" width="340" height="83" alt="Prague Pulse Fest">';

  function home(D) {
    const performers = D.performers || [];
    const featured = [performers[7], performers[24], performers[48]].filter(Boolean);
    const support = [performers[3], performers[12], performers[25], performers[39], performers[46], performers[58]].filter(Boolean);
    const art = ['artist-orbits.svg', 'artist-star.svg', 'pulse-signal.svg'];
    const days = D.festival?.dates || [];
    return `
      <section class="festival-hero" aria-labelledby="festival-title">
        <div class="hero-kicker"><span><i class="live-dot" aria-hidden="true"></i>Music & city festival</span><span class="kicker-coordinates">50°06′ N / 14°25′ E</span><span>Praha, CZ / 2026</span></div>
        <div class="hero-masthead">
          <h1 class="hero-title" id="festival-title" data-home-title><span>PRAGUE<i aria-hidden="true">*</i></span><span class="title-second">PULSE FEST</span></h1>
          <div class="hero-date"><strong>01—03<span>/ 08.2026</span></strong><p>Vltava Park<br>Praha, Česká republika</p><img class="pulse-mini" src="images/pulse-signal.svg" width="80" height="48" alt=""></div>
        </div>
        <div class="hero-visual">
          <figure class="hero-photo"><img src="images/festival-crowd.png" alt="Vizuál koncertního davu a nasvíceného pódia u Vltavy za soumraku" width="1536" height="1024" fetchpriority="high"><div class="photo-top" aria-hidden="true"><span>OPEN AIR / LIVE MUSIC</span><span>PPF—026</span></div><figcaption class="photo-caption"><strong>PRAHA.<br>NAHLAS.</strong><span>01—03 / SRPEN 2026<br>VLTAVA PARK</span></figcaption></figure>
          <aside class="hero-ticket" aria-label="Vstupenky na festival"><div><p class="eyebrow">Vyber den. Zbytek je hudba.</p><h2>JDEŠ<br>DO TOHO?</h2><p class="ticket-from">VSTUPENKY OD <strong>190 Kč</strong></p><p class="ticket-sub">Stání, Regular i VIP.<br>Jednodenní vstup na všechny scény.</p></div><a class="ticket-entry" href="tickets.html">Vybrat vstupenky ${arrow}</a></aside>
        </div>
      </section>
      <div class="pulse-ticker" aria-label="Tři dny, tři scény, šedesát interpretů"><span>03 DNY</span><b aria-hidden="true">*</b><span>03 SCÉNY</span><b aria-hidden="true">*</b><span>60 INTERPRETŮ</span><b class="optional" aria-hidden="true">*</b><span class="optional">MUSIC / CITY / PEOPLE</span></div>
      <section class="home-lineup" aria-labelledby="lineup-title">
        <div class="section-head"><div><p class="section-index">01 / Kdo rozezní Prahu</p><h2 class="lineup-heading" id="lineup-title">LINE-UP 2026</h2></div><a href="performers.html" class="text-button">Všech 60 jmen ${arrow}</a></div>
        <div class="lineup-poster"><p class="poster-label">PRAGUE PULSE FEST / FIRST NAMES</p><div class="headliner-list">${featured.map((p, i) => `${i ? '<span class="poster-cross" aria-hidden="true">+</span>' : ''}<button type="button" data-artist="${esc(p.id)}">${esc(p.name)}</button>`).join('')}</div><div class="poster-support">${support.map((p, i) => `${i ? '<span aria-hidden="true">/</span>' : ''}<button type="button" data-artist="${esc(p.id)}">${esc(p.name)}</button>`).join('')}<span aria-hidden="true">/</span><a href="performers.html">A DALŠÍ ${arrow}</a></div></div>
        <div class="home-artist-grid">${featured.map((p, i) => `<article class="artist-feature"><div class="feature-art"><span class="art-code" aria-hidden="true">PPF / ${String(i+1).padStart(2,'0')}</span><img src="images/${art[i]}" alt="" width="600" height="500" loading="lazy"></div><div class="feature-info"><p class="eyebrow">${esc(p.genre)} / ${esc(p.performerType)}</p><h3>${esc(p.name)}</h3><button class="text-button" type="button" data-artist="${esc(p.id)}">Profil a vystoupení ${arrow}</button></div></article>`).join('')}</div>
      </section>
      <section class="festival-days" aria-labelledby="days-title"><div class="section-head"><div><p class="section-index">02 / Rozpis festivalu</p><h2 id="days-title">TŘI DNY. ŽÁDNÁ VATA.</h2></div><a href="program.html" class="text-button">Kompletní program ${arrow}</a></div><div class="day-grid">${days.map((day, index) => `<article class="day-panel"><div><span class="day-number">${String(index+1).padStart(2,'0')}</span><span class="day-month">SRPEN / 2026</span></div><div><h3>${esc(day.theme)}</h3><p>${['Kytary, první refrény a večer, který nepotřebuje plán B.','Od otevření bran po noční set. Mezi scénami je to pár kroků.','Poslední den, plný program. Ještě jeden koncert se vejde.'][index] || 'Živá hudba napříč všemi scénami.'}</p><a href="program.html?day=${encodeURIComponent(day.id)}" class="text-button">Program dne ${arrow}</a></div></article>`).join('')}</div></section>
      <section class="home-location" aria-labelledby="location-title"><div class="location-art" aria-hidden="true"><img class="location-pulse" src="images/pulse-signal.svg" width="600" height="600" alt="" loading="lazy"><p class="coordinates">50°06′ N / 14°25′ E — PRAGUE</p></div><div class="location-copy"><p class="section-index">03 / Potkáme se u řeky</p><h2 id="location-title">VLTAVA<br>PARK.</h2><p>Tři scény v jednom areálu. Hlavní hala, open air u vody a klub, kde den nekončí posledním západem slunce.</p><a class="text-button" href="venues.html">Prohlédnout scény ${arrow}</a></div></section>`;
  }
  window.PulseDesign = Object.freeze({ logo, logoLight, home });
})();
