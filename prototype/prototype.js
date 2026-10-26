'use strict';
(() => {
  const data = window.FESTIVAL_DATA;
  const main = document.querySelector('main');
  const dialog = document.querySelector('dialog');
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const savedKey = 'pulse:prototype:favorites';
  // Keep earlier selections when the prototype's storage key changes.
  const readSaved = () => {
    for (const key of [savedKey, 'prague-rocks:prototype:favorites']) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) continue;
        const value = JSON.parse(raw);
        if (!Array.isArray(value)) continue;
        const valid = value.filter(id => data.events.some(event => event.id === id));
        if (key !== savedKey) { try { localStorage.setItem(savedKey, JSON.stringify(valid)); } catch {} }
        return valid;
      } catch { /* The prototype remains usable when storage is unavailable. */ }
    }
    return [];
  };
  const saved = new Set(readSaved());
  const el = (tag, text, cls) => {const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
  const link = (text, hash) => {const node=el('a',text);node.href=hash;return node;};
  const title = (label, heading) => {main.append(el('p',label,'eyebrow'),el('h1',heading));};
  const dateLabel = value => {const day=data.festival.dates.find(item=>item.id===value||item.date===value);return day?new Intl.DateTimeFormat('cs-CZ',{day:'numeric',month:'long',year:'numeric'}).format(new Date(day.date+'T12:00:00')):String(value);};
  const venueName = id => data.venues.find(item=>item.id===id)?.name || id;
  function eventCard(event) {
    const article=el('article',undefined,'event-card');article.dataset.eventId=event.id;article.dataset.start=event.date+'T'+event.startTime;
    article.append(el('p',`${dateLabel(event.date)} · ${event.startTime.slice(0,5)}—${event.endTime.slice(0,5)} · ${venueName(event.venueId)}`,'meta'));
    article.append(el('h2',event.performers.join(' / ')||event.name),el('p',event.theme||event.name));
    const button=el('button',saved.has(event.id)?'Uloženo ✓':'Uložit do programu +','card-action');
    button.type='button';button.dataset.event=event.id;button.setAttribute('aria-pressed',String(saved.has(event.id)));
    button.addEventListener('click',()=>{saved.has(event.id)?saved.delete(event.id):saved.add(event.id);try{localStorage.setItem(savedKey,JSON.stringify([...saved]));}catch{}button.textContent=saved.has(event.id)?'Uloženo ✓':'Uložit do programu +';button.setAttribute('aria-pressed',String(saved.has(event.id)));if(document.querySelector('#only-saved')?.checked){renderProgramList();(document.querySelector(`[data-event="${event.id}"]`)||document.querySelector('#only-saved')).focus();}});
    article.append(button);return article;
  }
  function artistCard(artist) {
    const article=el('article',undefined,'artist-card');article.dataset.artistId=artist.id;article.append(el('span',artist.name.split(' ').map(word=>word[0]).slice(0,2).join(''),'initials'),el('p',artist.genre,'meta'),el('h2',artist.name));
    const button=el('button','Detail interpreta →','card-action');button.type='button';button.dataset.artist=artist.id;button.addEventListener('click',()=>openArtist(artist));article.append(button);return article;
  }
  function openArtist(artist) {
    const content=document.querySelector('#dialog-content');content.replaceChildren();const heading=el('h2',artist.name);heading.id='dialog-title';content.append(heading,el('p',`${artist.performerType} · ${artist.genre}`),el('p',artist.description));
    const related=data.events.filter(event=>event.performerIds.includes(artist.id));content.append(el('h3','Vystoupení'));
    const list=el('ul');related.forEach(event=>{const li=el('li',`${dateLabel(event.date)} · ${event.startTime.slice(0,5)} · ${venueName(event.venueId)}`);list.append(li);});content.append(list);
    const action=link('Program interpreta →',`#program?artist=${encodeURIComponent(artist.id)}`);action.addEventListener('click',()=>dialog.close());content.append(action);related.forEach(event=>{const buy=link(`Vybrat vstupenku · ${dateLabel(event.dayId)} →`,`#tickets?event=${encodeURIComponent(event.id)}`);buy.className='ticket-link';buy.addEventListener('click',()=>dialog.close());content.append(buy);});dialog.showModal();
  }
  document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  function renderProgramList() {
    const day=document.querySelector('#day').value;const venue=document.querySelector('#venue').value;const only=document.querySelector('#only-saved').checked;const artist=new URLSearchParams(location.hash.split('?')[1]||'').get('artist');
    const events=data.events.filter(event=>(!day||event.dayId===day)&&(!venue||event.venueId===venue)&&(!only||saved.has(event.id))&&(!artist||event.performerIds.includes(artist))).sort((a,b)=>(a.date+a.startTime).localeCompare(b.date+b.startTime)||venueName(a.venueId).localeCompare(venueName(b.venueId),'cs')||a.id.localeCompare(b.id));
    document.querySelector('#program-count').textContent=`${events.length} položek programu`;const grid=document.querySelector('#program-list');grid.replaceChildren();events.forEach(event=>grid.append(eventCard(event)));if(!events.length)grid.append(el('p','Pro tento výběr nejsou žádná vystoupení. Změňte filtry nebo vypněte osobní program.','empty'));
  }
  function renderProgram() {
    title('Sestavte si plán','Program');const params=new URLSearchParams(location.hash.split('?')[1]||'');const artist=data.performers.find(item=>item.id===params.get('artist'));
    if(artist){const context=el('p',undefined,'program-context');context.append(document.createTextNode('Vystoupení interpreta '+artist.name+' · '),link('Zobrazit celý program','#program'));main.append(context);}
    const filters=el('div',undefined,'filters');
    for(const [id,label,items] of [['day','Den',data.festival.dates],['venue','Scéna',data.venues]]) {const wrap=el('label',label);const select=el('select');select.id=id;select.append(new Option(id==='day'?'Všechny dny':'Všechny scény',''));items.forEach(item=>select.append(new Option(id==='day'?dateLabel(item.id):item.name,item.id)));select.addEventListener('change',renderProgramList);wrap.append(select);filters.append(wrap);}
    const check=el('label',undefined,'check');const input=el('input');input.type='checkbox';input.id='only-saved';input.addEventListener('change',renderProgramList);check.append(input,document.createTextNode('Jen uložené'));filters.append(check);main.append(filters);
    if(data.festival.dates.some(item=>item.id===params.get('day')))document.querySelector('#day').value=params.get('day');
    if(data.venues.some(item=>item.id===params.get('venue')))document.querySelector('#venue').value=params.get('venue');
    const count=el('p',undefined,'result-count');count.id='program-count';count.setAttribute('role','status');const list=el('div',undefined,'grid');list.id='program-list';main.append(count,list);renderProgramList();
  }
  // Jednodenní stání používá stejné ceny a ID scén jako hotový web.
  const cartKey = 'pulse:prototype:cart';
  const money = value => new Intl.NumberFormat('cs-CZ',{style:'currency',currency:'CZK',maximumFractionDigits:0}).format(value);
  const knownVenue = id => id === 'all' || data.venues.some(venue=>venue.id===id);
  const unitPrice = venueId => venueId === 'all'
    ? data.festival.tickets.find(ticket=>ticket.id==='t6').price
    : data.venues.find(venue=>venue.id===venueId).ticketing.prices.standing.day;
  function cartItems() {
    try {
      const value=JSON.parse(localStorage.getItem(cartKey)||'[]');
      return Array.isArray(value)?value.filter(item=>item && data.festival.dates.some(day=>day.id===item.dayId)
        && knownVenue(item.venueId) && Number.isInteger(item.quantity) && item.quantity>=1 && item.quantity<=8):[];
    } catch { return []; }
  }
  function updateCartCount() {
    const badge=document.querySelector('#cart-count');
    if(badge)badge.textContent=String(cartItems().reduce((sum,item)=>sum+item.quantity,0));
  }
  function storeCart(items) {
    try { localStorage.setItem(cartKey,JSON.stringify(items));updateCartCount();return true; }
    catch { return false; }
  }
  function remaining(venueId,dayId) {
    const cart=cartItems(),venues=data.venues.filter(venue=>venueId==='all'||venue.id===venueId);
    return Math.max(0,Math.min(...venues.map(venue=>venue.ticketing.standingCapacity-cart
      .filter(item=>item.dayId===dayId&&(item.venueId==='all'||item.venueId===venue.id))
      .reduce((sum,item)=>sum+item.quantity,0))));
  }
  function ticketPicker() {
    title('Jednodenní vstup · stání','Vstupenky');
    const params=new URLSearchParams(location.hash.split('?')[1]||'');
    const event=data.events.find(item=>item.id===params.get('event'));
    if(event)main.append(el('p',`${event.performers.join(' / ')} · ${dateLabel(event.dayId)} · ${event.startTime.slice(0,5)} · ${venueName(event.venueId)}`,'lead'));
    else main.append(el('p','Vyberte scénu a den návštěvy. Společný vstup zahrnuje všechny tři scény.','lead'));
    const form=el('form',undefined,'panel ticket-picker');form.id='prototype-ticket-form';
    const fields=el('div',undefined,'filters');
    const stageLabel=el('label','Scéna'),stage=el('select');stage.id='ticket-venue';
    stage.append(new Option('Všechny scény','all'));data.venues.forEach(venue=>stage.append(new Option(venue.name,venue.id)));
    stage.value=event?.venueId||(knownVenue(params.get('venue'))?params.get('venue'):'all');stageLabel.append(stage);
    const dayLabel=el('label','Den'),day=el('select');day.id='ticket-day';
    data.festival.dates.forEach(item=>day.append(new Option(dateLabel(item.id),item.id)));
    day.value=event?.dayId||data.festival.dates[0].id;dayLabel.append(day);
    const quantityLabel=el('label','Počet osob'),quantity=el('input');quantity.id='ticket-quantity';quantity.type='number';quantity.min='1';quantity.max='8';quantity.step='1';quantity.value='1';quantity.required=true;quantityLabel.append(quantity);
    fields.append(stageLabel,dayLabel,quantityLabel);
    const context=el('p',undefined,'status');context.id='ticket-context';context.setAttribute('role','status');
    const availability=el('p',undefined,'meta');availability.id='ticket-remaining';
    const unit=el('p');unit.id='ticket-unit-price';
    const total=el('p',undefined,'ticket-price');total.id='ticket-total';total.setAttribute('aria-live','polite');
    const error=el('p',undefined,'error');error.id='ticket-error';error.setAttribute('role','alert');
    const add=el('button','Přidat do košíku →');add.id='prototype-add-cart';add.type='submit';
    form.append(fields,context,availability,unit,total,error,add);main.append(form);
    function update() {
      const count=Number(quantity.value),valid=Number.isInteger(count)&&count>=1&&count<=8,free=remaining(stage.value,day.value),price=unitPrice(stage.value);
      availability.textContent=`Pro další výběr zbývá ${free.toLocaleString('cs-CZ')} míst ke stání.`;
      availability.dataset.remaining=String(free);unit.textContent=`Cena za osobu: ${money(price)}`;
      total.textContent=valid?`Celkem ${money(count*price)}`:'Zadejte počet osob od 1 do 8.';
      context.textContent=event&&(day.value!==event.dayId||(stage.value!=='all'&&stage.value!==event.venueId))?'Změněný výběr již nezahrnuje uvedený koncert.':'';
      add.disabled=!valid||count>free;
    }
    [stage,day].forEach(input=>input.addEventListener('change',update));quantity.addEventListener('input',update);
    form.addEventListener('submit',event=>{
      event.preventDefault();const count=Number(quantity.value);error.textContent='';
      if(!Number.isInteger(count)||count<1||count>8||count>remaining(stage.value,day.value)){update();return;}
      const item={venueId:stage.value,dayId:day.value,quantity:count};
      if(!storeCart([...cartItems(),item])){error.textContent='Prohlížeč nepovolil uložení výběru. Povolte místní úložiště.';return;}
      location.hash='cart';
    });update();
  }
  function renderCart() {
    title('Rekapitulace výběru','Košík');
    const items=cartItems();
    if(!items.length){const empty=el('section',undefined,'empty');empty.append(el('h2','Košík je prázdný'),link('Vybrat vstupenku →','#tickets'));main.append(empty);return;}
    const list=el('div',undefined,'grid');let total=0;
    items.forEach((item,index)=>{
      const price=unitPrice(item.venueId)*item.quantity;total+=price;
      const card=el('article');card.dataset.cartItem=String(index);
      card.append(el('h2',item.venueId==='all'?'Všechny scény':venueName(item.venueId)),
        el('p',`${dateLabel(item.dayId)} · jednodenní stání`,'meta'),
        el('p',`${item.quantity} × ${money(unitPrice(item.venueId))} = ${money(price)}`));
      const remove=el('button','Odebrat','secondary');remove.type='button';remove.dataset.removeCart=String(index);
      remove.addEventListener('click',()=>{
        if(storeCart(cartItems().filter((_,position)=>position!==index))){main.replaceChildren();renderCart();(main.querySelector('[data-remove-cart]')||main.querySelector('a')||main).focus();}
      });card.append(remove);list.append(card);
    });
    const sum=el('p',`Celkem ${money(total)}`,'ticket-price');sum.id='cart-total';sum.setAttribute('aria-live','polite');
    main.append(list,sum,link('Přidat další vstupenku →','#tickets'));
  }
  function render() {
    const hash=location.hash.slice(1)||'home';const [page,queryString]=hash.split('?');document.title=`${page==='home'?'Úvod':({program:'Program',performers:'Účinkující',venues:'Scény',search:'Vyhledávání',info:'Informace',tickets:'Vstupenky',cart:'Košík'}[page]||'Informace')} — Prague Pulse Fest / prototyp`;main.replaceChildren();document.querySelectorAll('nav a').forEach(anchor=>{if(anchor.hash===`#${page}`)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');});
    if(page==='home') {const hero=el('section',undefined,'hero');hero.append(el('p','1—3 / 08 / 2027 · Praha','eyebrow'),el('h1','Prague Pulse Fest'),el('p','Tři festivalové dny. Koncerty na třech scénách a program, který si sestavíte sami.','lead'));const actions=el('div',undefined,'actions');actions.append(link('Otevřít program →','#program'),link('Najít účinkující →','#performers'));hero.append(actions);hero.append(el('p',`${data.festival.dates.length} dny · ${data.venues.length} scény · ${data.performers.length} účinkujících`,'meta'));main.append(hero,el('h2','Co potřebujete najít?'));const grid=el('div',undefined,'grid');[['Program','Filtrujte den a scénu, uložte si vybrané koncerty.','#program'],['Účinkující','Projděte 60 jmen a jejich festivalová vystoupení.','#performers'],['Praktické informace','Získejte přehled o lokalitě a fungování návrhu.','#info']].forEach(([heading,text,href])=>{const card=el('article');card.append(el('h3',heading),el('p',text),link('Otevřít →',href));grid.append(card);});main.append(grid);}
    else if(page==='program')renderProgram();
    else if(page==='performers'){title('60 jmen / 3 dny','Účinkující');const grid=el('div',undefined,'grid');data.performers.forEach(artist=>grid.append(artistCard(artist)));main.append(grid);}
    else if(page==='venues'){title('Orientace v areálu','Scény');const grid=el('div',undefined,'grid');data.venues.forEach(venue=>{const card=el('article');card.append(el('h2',venue.name),el('p',venue.description||venue.location||'Festivalová scéna v Praze.'),link('Zobrazit program →','#program?venue='+encodeURIComponent(venue.id)));grid.append(card);});main.append(grid);}
    else if(page==='tickets')ticketPicker();
    else if(page==='cart')renderCart();
    else if(page==='search'){const query=new URLSearchParams(queryString||'').get('q')||'';document.querySelector('#query').value=query;title('Výsledky hledání',query?`„${query}“`:'Vyhledávání');if(!query.trim()){main.append(el('p','Zadejte název kapely, scény nebo část tématu programu.','lead'));return;}const normalized=normalize(query);const artists=data.performers.filter(item=>normalize([item.name,item.genre,item.description].join(' ')).includes(normalized));const events=data.events.filter(item=>normalize([item.name,item.theme,...item.performers,venueName(item.venueId)].join(' ')).includes(normalized));main.append(el('p',`${artists.length} účinkujících · ${events.length} vystoupení`,'status'));const grid=el('div',undefined,'grid');artists.forEach(item=>grid.append(artistCard(item)));events.forEach(item=>grid.append(eventCard(item)));main.append(grid);if(!artists.length&&!events.length)main.append(el('p','Nic jsme nenašli. Zkuste kratší část názvu.','empty'));}
    else {title('Praktické informace','O festivalu a návrhu');main.append(el('p',`${data.festival.name} probíhá v Praze 1.–3. srpna 2027. Tento wireframe umožňuje projít hledání interpreta a sestavení osobního programu.`,'lead'));const box=el('section',undefined,'panel');box.append(el('h2','Rozsah prototypu'),el('p','Program se filtruje podle dne a scény. Vybrané koncerty se uchovávají v místním úložišti stejného prohlížeče. Detail interpreta propojuje jméno s konkrétním vystoupením.'),el('p','Jde o interaktivní návrh fiktivního festivalu. Výběr jednodenní vstupenky a košík propojuje den, scénu a cenu. Dokončení objednávky, účet a PDF obsahuje hotový web.'));main.append(box);}
  }
  document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({block:'start'});});
  document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();location.hash=`search?q=${encodeURIComponent(document.querySelector('#query').value.trim())}`;});window.addEventListener('hashchange',render);window.addEventListener('storage',event=>{if(event.key===cartKey){const route=location.hash.slice(1).split('?')[0];if(['tickets','cart'].includes(route))render();updateCartCount();}});render();updateCartCount();
})();
