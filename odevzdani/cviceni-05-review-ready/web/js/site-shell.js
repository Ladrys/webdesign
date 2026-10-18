'use strict';
/* Shared original festival shell and accessible, reduced-motion-aware film. */
(() => {
  const tr = (cs,en,lang) => (lang || window.PulseI18n?.lang) === 'en' ? en : cs;
  const arrow = '<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.8"/></svg>';
  const searchIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const menuIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M5 12h9M5 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const cartIcon = '<svg class="cart-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2 11h11l3-8H6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.5" fill="currentColor"/><circle cx="18" cy="20" r="1.5" fill="currentColor"/></svg>';
  const socialIcons = {
    Facebook:'<path fill="currentColor" d="M14.2 21v-8h2.7l.4-3.2h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V3.3c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.1 1.5-4.1 4.3v2.4H8.2V13h2.7v8z"/>',
    Instagram:'<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.4" cy="6.7" r="1.1" fill="currentColor"/>',
    Spotify:'<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6.3 8.6c4-1.1 8.2-.7 11.6 1.2M7 12c3.4-.9 7-.5 10 1M7.8 15.3c2.7-.7 5.4-.3 7.8.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    YouTube:'<rect x="2.4" y="5" width="19.2" height="14" rx="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m10 8.5 6 3.5-6 3.5z" fill="currentColor"/>',
    X:'<path d="m4 3.5 11.5 17h4.6l-11.6-17zM4 20.5 19.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'
  };
  function dateInfo() {return window.PulseDesign?.festivalDates(window.FESTIVAL_DATA);}
  function header({page='index.html',user=null,cartCount=0,lang='cs'}={}) {
    const t=(cs,en)=>tr(cs,en,lang),dates=dateInfo();
    const date=dates?`${dates.range} / ${dates.month}`:'';
    const year=dates?.year || '';
    const nav=[['program.html',t('Program','Programme')],['performers.html',t('Účinkující','Artists')],['venues.html',t('Scény','Stages')],['info.html',t('Info','Info')],['account.html',t('Účet','Account')],['cart.html',`${cartIcon}<span>${t('Košík','Cart')} <span class="cart-count">${cartCount}</span></span>`]];
    return `<div class="header-inner rocks-header"><div class="brand-cluster"><a class="brand" href="index.html" aria-label="${t('Prague Pulse Fest – úvod','Prague Pulse Fest – home')}">${window.PulseDesign?.logoLight||'PRAGUE PULSE FEST'}</a><div class="header-date"><strong>${date}</strong><span>${year} · ${t('PRAHA','PRAGUE')}</span></div></div><button class="menu-toggle secondary small" aria-expanded="false" aria-controls="navigation"><span class="visually-hidden">${t('Otevřít navigaci','Open navigation')}</span>${menuIcon}<span>MENU</span></button><nav id="navigation" class="nav" aria-label="${t('Hlavní navigace','Main navigation')}">${nav.map(([href,label])=>`<a href="${href}" ${page===href?'aria-current="page"':''}${href==='account.html'&&user?` aria-label="${t('Můj účet','My account')}"`:''}>${label}</a>`).join('')}<a href="tickets.html" class="ticket-link" ${page==='tickets.html'?'aria-current="page"':''}>${t('Vstupenky','Tickets')} ${arrow}</a></nav><div class="header-tools"><form class="global-search" action="search.html" role="search"><label class="visually-hidden" for="global-q">${t('Hledat na celém webu','Search the whole website')}</label><input type="search" id="global-q" name="q" maxlength="120" placeholder="${t('Hledat…','Search…')}"><button type="submit" aria-label="${t('Vyhledat','Search')}">${searchIcon}</button></form><div class="language-switch" role="group" aria-label="${t('Jazyk webu','Website language')}"><button type="button" data-lang="cs" lang="cs" aria-pressed="${lang!=='en'}" aria-label="Čeština">CZ</button><span aria-hidden="true">/</span><button type="button" data-lang="en" lang="en" aria-pressed="${lang==='en'}" aria-label="English">EN</button></div></div></div>`;
  }
  function footer({lang='cs'}={}) {
    const t=(cs,en)=>tr(cs,en,lang),dates=dateInfo(),year=dates?.year || '';
    const social=[['Facebook','https://www.facebook.com/'],['Instagram','https://www.instagram.com/'],['Spotify','https://open.spotify.com/'],['YouTube','https://www.youtube.com/'],['X','https://x.com/']];
    return `<div class="rocks-footer"><div class="footer-brand"><a href="index.html" class="brand" aria-label="Prague Pulse Fest">${window.PulseDesign?.logoLight||'PRAGUE PULSE FEST'}</a><p>${dates?`${dates.range} / ${dates.month}.${year}`:''}<br>VLTAVA PARK · ${t('PRAHA','PRAGUE')}</p><a class="footer-ticket" href="tickets.html">${t('VSTUPENKY','TICKETS')} ${arrow}</a></div><div class="footer-column"><h2>${t('FESTIVAL','FESTIVAL')}</h2><a href="program.html">${t('Program','Programme')}</a><a href="performers.html">${t('Účinkující','Artists')}</a><a href="venues.html">${t('Scény a areál','Stages & venue')}</a><a href="info.html#history">${t('Příběh festivalu','Festival story')}</a><a href="account.html">${t('Můj účet','My account')}</a></div><div class="footer-column"><h2>${t('PRAKTICKÉ INFO','GOOD TO KNOW')}</h2><a href="info.html#travel">${t('Jak se k nám dostat','Getting here')}</a><a href="info.html#parking">${t('Parkování','Parking')}</a><a href="info.html#stay">${t('Ubytování','Accommodation')}</a><a href="info.html#accessibility">${t('Bezbariérový přístup','Accessibility')}</a><a href="info.html#faq">${t('Časté dotazy','Frequently asked questions')}</a></div><div class="footer-column footer-contact"><h2>${t('KONTAKT','CONTACT')}</h2><address>Výstaviště 67<br>170 00 Praha 7<br>info@praguepulsefest.cz</address><a href="info.html#contacts">${t('Kontaktní informace','Contact information')} ${arrow}</a><p class="footer-social-title">${t('SLEDUJTE NÁS','FOLLOW US')}</p><div class="footer-social">${social.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${t('Otevřít platformu','Open platform')} ${label}"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">${socialIcons[label]}</svg></a>`).join('')}</div></div><div class="rocks-footer-bottom"><p>© ${year} Prague Pulse Fest. ${t('Fiktivní festival.','Fictional festival.')}</p><div><a href="info.html#privacy">${t('Ochrana osobních údajů','Privacy')}</a><a href="info.html#terms">${t('Obchodní podmínky','Terms & conditions')}</a><button class="footer-cookie-settings" type="button" data-cookie-settings>${t('Nastavení cookies','Cookie settings')}</button></div><a href="#header" class="back-top">${t('NAHORU','BACK TO TOP')} ↑</a></div></div>`;
  }
  window.PulseShell=Object.freeze({header,footer});
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  function initFilm(){
    const video=document.getElementById('hero-film'),button=document.getElementById('film-toggle');
    if(!video||!button||video.dataset.initialized)return;
    video.dataset.initialized='true';video.muted=true;
    const sync=()=>{const playing=!video.paused;button.setAttribute('aria-pressed',String(playing));button.innerHTML=`<span aria-hidden="true">${playing?'Ⅱ':'▶'}</span> ${playing?tr('Pozastavit video','Pause video'):tr('Přehrát video','Play video')}`;};
    video.addEventListener('play',sync);video.addEventListener('pause',sync);
    button.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>sync());else video.pause();});
    sync();if(!reduceMotion.matches)video.play().catch(()=>sync());
  }
  function updateCountdown(){
    const node=document.querySelector('[data-countdown]');
    if(!node||!window.PulseCountdown)return;
    const state=window.PulseCountdown.getState(node.dataset.start,node.dataset.end);
    const t=(cs,en)=>tr(cs,en,node.dataset.countdownLang);
    const caption=state.phase==='upcoming'?t('DO PRVNÍHO KONCERTU','UNTIL THE FIRST SHOW'):state.phase==='during'?t('FESTIVAL PRÁVĚ PROBÍHÁ','THE FESTIVAL IS LIVE'):state.phase==='ended'?t(`ROČNÍK ${node.dataset.year} SKONČIL`,`THE ${node.dataset.year} EDITION HAS ENDED`):t('TERMÍN PŘIPRAVUJEME','DATES TO BE ANNOUNCED');
    const text=node.querySelector('[data-countdown-caption]');
    if(text&&text.textContent!==caption)text.textContent=caption;
    const values=node.querySelector('.countdown-values'),link=node.querySelector('.countdown-program');
    if(values)values.hidden=state.phase!=='upcoming';
    if(link)link.hidden=state.phase==='upcoming'||state.phase==='invalid';
    for(const value of node.querySelectorAll('[data-countdown-value]')){
      const text=String(state[value.dataset.countdownValue]).padStart(2,'0');
      if(value.textContent!==text)value.textContent=text;
    }
  }
  reduceMotion.addEventListener?.('change',e=>{if(e.matches)document.getElementById('hero-film')?.pause();});
  document.addEventListener('visibilitychange',()=>{const v=document.getElementById('hero-film');if(v&&document.hidden)v.pause();else updateCountdown();});
  const init=()=>{initFilm();updateCountdown();};
  new MutationObserver(init).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(()=>{if(!document.hidden)updateCountdown();},1000);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
