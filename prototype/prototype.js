'use strict';
(() => {
  const data = window.FESTIVAL_DATA;
  const main = document.querySelector('main');
  const dialog = document.querySelector('dialog');
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const readSaved = () => {try {const value=JSON.parse(localStorage.getItem('prague-rocks:prototype:favorites')||'[]');return Array.isArray(value)?value.filter(id=>data.events.some(event=>event.id===id)):[];}catch{return [];}};
  const saved = new Set(readSaved());
  const el = (tag, text, cls) => {const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;};
  const link = (text, hash) => {const node=el('a',text);node.href=hash;return node;};
  const title = (label, heading) => {main.append(el('p',label,'eyebrow'),el('h1',heading));};
  const dateLabel = value => {const day=data.festival.dates.find(item=>item.id===value||item.date===value);return day?`${Number(day.date.slice(-2))}. 8. 2026`:String(value);};
  const venueName = id => data.venues.find(item=>item.id===id)?.name || id;
  function eventCard(event) {
    const article=el('article');
    article.append(el('p',`${dateLabel(event.date)} · ${event.startTime.slice(0,5)}—${event.endTime.slice(0,5)} · ${venueName(event.venueId)}`,'meta'));
    article.append(el('h3',event.theme||event.name),el('p',event.performers.join(' / ')));
    const button=el('button',saved.has(event.id)?'Uloženo ✓':'Uložit do programu +','card-action');
    button.type='button';button.dataset.event=event.id;button.setAttribute('aria-pressed',String(saved.has(event.id)));
    button.addEventListener('click',()=>{saved.has(event.id)?saved.delete(event.id):saved.add(event.id);try{localStorage.setItem('prague-rocks:prototype:favorites',JSON.stringify([...saved]));}catch{}button.textContent=saved.has(event.id)?'Uloženo ✓':'Uložit do programu +';button.setAttribute('aria-pressed',String(saved.has(event.id)));if(document.querySelector('#only-saved')?.checked)renderProgramList();});
    article.append(button);return article;
  }
  function artistCard(artist) {
    const article=el('article');article.append(el('span',artist.name.split(' ').map(word=>word[0]).slice(0,2).join(''),'initials'),el('p',artist.genre,'meta'),el('h3',artist.name));
    const button=el('button','Detail interpreta →','card-action');button.type='button';button.addEventListener('click',()=>openArtist(artist));article.append(button);return article;
  }
  function openArtist(artist) {
    const content=document.querySelector('#dialog-content');content.replaceChildren();const heading=el('h2',artist.name);heading.id='dialog-title';content.append(heading,el('p',`${artist.performerType} · ${artist.genre}`),el('p',artist.description));
    const related=data.events.filter(event=>event.performerIds.includes(artist.id));content.append(el('h3','Vystoupení'));
    const list=el('ul');related.forEach(event=>{const li=el('li',`${dateLabel(event.date)} · ${event.startTime.slice(0,5)} · ${venueName(event.venueId)}`);list.append(li);});content.append(list);
    const action=link('Program interpreta →',`#program?artist=${encodeURIComponent(artist.id)}`);action.addEventListener('click',()=>dialog.close());content.append(action);dialog.showModal();
  }
  document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  function renderProgramList() {
    const day=document.querySelector('#day').value;const venue=document.querySelector('#venue').value;const only=document.querySelector('#only-saved').checked;const artist=new URLSearchParams(location.hash.split('?')[1]||'').get('artist');
    const events=data.events.filter(event=>(!day||event.dayId===day)&&(!venue||event.venueId===venue)&&(!only||saved.has(event.id))&&(!artist||event.performerIds.includes(artist)));
    document.querySelector('#program-count').textContent=`${events.length} vystoupení`;const grid=document.querySelector('#program-list');grid.replaceChildren();events.forEach(event=>grid.append(eventCard(event)));if(!events.length)grid.append(el('p','Pro tento výběr nejsou žádná vystoupení. Změňte filtry nebo vypněte osobní program.','empty'));
  }
  function renderProgram() {
    title('Sestavte si plán','Program');const filters=el('div',undefined,'filters');
    for(const [id,label,items] of [['day','Den',data.festival.dates],['venue','Scéna',data.venues]]) {const wrap=el('label',label);const select=el('select');select.id=id;select.append(new Option(id==='day'?'Všechny dny':'Všechny scény',''));items.forEach(item=>select.append(new Option(id==='day'?dateLabel(item.id):item.name,item.id)));select.addEventListener('change',renderProgramList);wrap.append(select);filters.append(wrap);}
    const check=el('label',undefined,'check');const input=el('input');input.type='checkbox';input.id='only-saved';input.addEventListener('change',renderProgramList);check.append(input,document.createTextNode('Jen uložené'));filters.append(check);main.append(filters);
    const count=el('p',undefined,'result-count');count.id='program-count';count.setAttribute('role','status');const list=el('div',undefined,'grid');list.id='program-list';main.append(count,list);renderProgramList();
  }
  function render() {
    const hash=location.hash.slice(1)||'home';const [page,queryString]=hash.split('?');main.replaceChildren();document.querySelectorAll('nav a').forEach(anchor=>{if(anchor.hash===`#${page}`)anchor.setAttribute('aria-current','page');else anchor.removeAttribute('aria-current');});
    if(page==='home') {const hero=el('section',undefined,'hero');hero.append(el('p','1—3 / 08 / 2026 · Praha','eyebrow'),el('h1','Prague Rocks Festival'),el('p','Tři festivalové dny. Koncerty na třech scénách a program, který si sestavíte sami.','lead'));const actions=el('div',undefined,'actions');actions.append(link('Otevřít program →','#program'),link('Najít účinkující →','#performers'));hero.append(actions);main.append(hero,el('h2','Co potřebujete najít?'));const grid=el('div',undefined,'grid');[['Program','Filtrujte den a scénu, uložte si vybrané koncerty.','#program'],['Účinkující','Projděte 60 jmen a jejich festivalová vystoupení.','#performers'],['Praktické informace','Získejte přehled o lokalitě a fungování návrhu.','#info']].forEach(([heading,text,href])=>{const card=el('article');card.append(el('h3',heading),el('p',text),link('Otevřít →',href));grid.append(card);});main.append(grid);}
    else if(page==='program')renderProgram();
    else if(page==='performers'){title('60 jmen / 3 dny','Účinkující');const grid=el('div',undefined,'grid');data.performers.forEach(artist=>grid.append(artistCard(artist)));main.append(grid);}
    else if(page==='venues'){title('Orientace v areálu','Scény');const grid=el('div',undefined,'grid');data.venues.forEach(venue=>{const card=el('article');card.append(el('h2',venue.name),el('p',venue.description||venue.location||'Festivalová scéna v Praze.'),link('Zobrazit program →','#program'));grid.append(card);});main.append(grid);}
    else if(page==='search'){const query=new URLSearchParams(queryString||'').get('q')||'';document.querySelector('#query').value=query;title('Výsledky hledání',query?`„${query}“`:'Vyhledávání');if(!query.trim()){main.append(el('p','Zadejte název kapely, scény nebo část tématu programu.','lead'));return;}const normalized=normalize(query);const artists=data.performers.filter(item=>normalize([item.name,item.genre,item.description].join(' ')).includes(normalized));const events=data.events.filter(item=>normalize([item.name,item.theme,...item.performers,venueName(item.venueId)].join(' ')).includes(normalized));main.append(el('p',`${artists.length} účinkujících · ${events.length} vystoupení`,'status'));const grid=el('div',undefined,'grid');artists.forEach(item=>grid.append(artistCard(item)));events.forEach(item=>grid.append(eventCard(item)));main.append(grid);if(!artists.length&&!events.length)main.append(el('p','Nic jsme nenašli. Zkuste kratší část názvu.','empty'));}
    else {title('Praktické informace','O festivalu a návrhu');main.append(el('p',`${data.festival.name} probíhá v Praze 1.–3. srpna 2026. Tento wireframe umožňuje projít hledání interpreta a sestavení osobního programu.`,'lead'));const box=el('section',undefined,'panel');box.append(el('h2','Rozsah prototypu'),el('p','Program se filtruje podle dne a scény. Vybrané koncerty se uchovávají v místním úložišti stejného prohlížeče. Detail interpreta propojuje jméno s konkrétním vystoupením.'),el('p','Jde o interaktivní návrh fiktivního festivalu. Nákup, účet a PDF ukazuje až finální implementace.'));main.append(box);}
    document.title=`${page==='home'?'Úvod':({program:'Program',performers:'Účinkující',venues:'Scény',search:'Vyhledávání',info:'Informace'}[page]||'Informace')} — Prague Rocks Festival / prototyp`;
  }
  document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();location.hash=`search?q=${encodeURIComponent(document.querySelector('#query').value.trim())}`;});window.addEventListener('hashchange',render);render();
})();
