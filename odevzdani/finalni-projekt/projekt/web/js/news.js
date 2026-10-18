'use strict';
/* Festival editorial content. These articles describe the proposed fictional event. */
(() => {
  const items = [
    {
      id:'vystaviste-tri-sceny',date:'2026-10-18',image:'images/vystaviste-illustration.svg',
      title:{cs:'Výstaviště ve třech rytmech',en:'Three stages at Výstaviště'},
      perex:{cs:'Hlavní hala, venkovní koncerty a klub po setmění. Prohlédni si návrh festivalového areálu v Holešovicích.',en:'A main hall, outdoor shows and a club after dark. Explore the proposed festival site in Holešovice.'},
      body:{
        cs:['Prague Pulse Fest má v návrhu tři scény v areálu Výstaviště Praha. Main Hall je určená velkým koncertům, River Stage venkovnímu programu a Club Stage elektronice a večerním setům. Jedna vstupenka umožňuje přecházet mezi všemi třemi scénami.','Výstaviště vybíráme kvůli dostupnosti městskou dopravou a blízkosti Stromovky. Pro navigaci používej adresu Výstaviště 67, Praha 7. Podrobnosti o dopravě a přístupnosti najdeš v praktických informacích.','Zobrazení areálu je návrh fiktivního festivalu. Ilustrace není skutečnou fotografií místa ani potvrzením spolupráce s provozovatelem Výstaviště.'],
        en:['The proposed Prague Pulse Fest site has three stages at Výstaviště Prague. Main Hall is for large concerts, River Stage for outdoor shows and Club Stage for electronic music and evening sets. One ticket gives access to all three stages.','We chose Výstaviště for its public transport connections and proximity to Stromovka park. Use Výstaviště 67, Prague 7 for navigation. Travel and accessibility details are in the visitor information section.','This is a proposal for a fictional festival. The illustration is not an actual venue photograph or confirmation of a partnership with the venue operator.']
      },link:'venues.html',linkLabel:{cs:'Prohlédnout scény',en:'Explore the stages'}
    },
    {
      id:'tri-dny-jedna-vstupenka',date:'2026-10-17',image:'images/news-tickets.svg',
      title:{cs:'Tři dny v jednom balíčku',en:'Three days, one festival pass'},
      perex:{cs:'VIP, Regular nebo stání. Všechny třídenní balíčky platí od 1. do 3. srpna 2027 a zahrnují vstup na všechny scény.',en:'VIP, Regular or standing. Every three-day pass is valid from 1 to 3 August 2027 and includes all stages.'},
      body:{
        cs:['Při výběru třídenního balíčku máš stejné místo po celý festival. VIP přidává rychlejší odbavení, odpočinkovou zónu a jedno parkovací místo. Regular nabízí sedadlo, varianta Stání vstup do volné plochy.','Uvedené ceny jsou konečné a zahrnují všechny poplatky objednávky. Jídlo, nápoje a ubytování nejsou součástí vstupenky. Pokud plánuješ přijet pouze na jeden den, v objednávce přepni délku vstupu na jednodenní.','Nakoupit můžeš i bez registrace. Po dokončení zkušební platby si stáhneš PDF s jednotlivými vstupenkami. Přihlášený návštěvník najde stejnou objednávku také v historii účtu.'],
        en:['A three-day pass reserves the same place throughout the festival. VIP adds fast-track entry, a lounge and one parking space. Regular includes a seat; Standing gives access to the standing area.','Displayed prices are final and include all order fees. Food, drinks and accommodation are not included. If you are coming for one day, switch the ticket duration to a one-day pass.','You can order without registering. Download a PDF containing your tickets after the simulated payment. Signed-in visitors can also find the order in their account history.']
      },link:'tickets.html',linkLabel:{cs:'Vybrat vstupenky',en:'Choose tickets'}
    },
    {
      id:'do-holesovic-bez-auta',date:'2026-10-16',image:'images/news-travel.svg',
      title:{cs:'Do Holešovic bez auta',en:'Getting to Holešovice without a car'},
      perex:{cs:'Tramvaj na Výstaviště, metro C a poslední úsek pěšky. Naplánuj si příjezd ještě před prvním koncertem.',en:'Take a tram to Výstaviště or metro line C, then walk the final stretch. Plan your journey before the first show.'},
      body:{
        cs:['Zastávka Výstaviště je blízko hlavního vstupu do areálu. Alternativou je metro C na Nádraží Holešovice a navazující tramvaj. Konkrétní spojení si před cestou ověř v aktuálním jízdním řádu PID.','Při cestě pěšky můžeš využít trasu přes Stromovku. Dbej na místní značení a okolní provoz. Parkování v Holešovicích podléhá pravidlům jednotlivých parkovišť a městských zón.','VIP parkování je součástí modelového třídenního VIP balíčku; ostatní vstupenky ho nezahrnují. Podrobnosti k adrese, ubytování i bezbariérovému přístupu jsou na jednom místě v praktických informacích.'],
        en:['The Výstaviště tram stop is close to the main entrance. Another option is metro line C to Nádraží Holešovice and a connecting tram. Check the current PID timetable before you travel.','If you are walking, you can approach through Stromovka park. Follow local signs and be mindful of traffic. Parking in Holešovice is subject to individual car park and city parking zone rules.','The fictional three-day VIP pass includes parking; other tickets do not. Find the address, accommodation suggestions and accessibility information together in the visitor information section.']
      },link:'info.html#travel',linkLabel:{cs:'Naplánovat cestu',en:'Plan your journey'}
    }
  ];
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrow='<svg class="arrow-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.8"/></svg>';
  const language=()=>window.PulseI18n?.lang==='en'?'en':'cs';
  const formattedDate=(value,lang)=>new Intl.DateTimeFormat(lang==='en'?'en-GB':'cs-CZ',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value+'T12:00:00+02:00'));
  function render(main,id){
    const lang=language(),t=(cs,en)=>lang==='en'?en:cs;
    const article=items.find(item=>item.id===id);
    if(!article){
      document.title=t('Novinky','News')+' | Prague Pulse Fest';
      main.innerHTML=`<div class="crumb"><a href="index.html">Festival</a> / ${t('Novinky','News')}</div><h1>${id?t('Článek nebyl nalezen','Article not found'):t('Novinky','News')}</h1>${id?`<p>${t('Vyber si jiný článek z festivalových novinek.','Choose another article from the festival news.')}</p>`:''}<section class="news-grid">${items.map(item=>`<article class="news-card"><a href="news.html?id=${encodeURIComponent(item.id)}"><img src="${item.image}" alt="" width="1200" height="720" loading="lazy"><time datetime="${item.date}">${formattedDate(item.date,lang)}</time><h2>${esc(item.title[lang])}</h2><p>${esc(item.perex[lang])}</p></a></article>`).join('')}</section>`;
      return;
    }
    document.title=article.title[lang]+' | Prague Pulse Fest';
    for(const selector of ['meta[name="description"]','meta[property="og:description"]'])document.querySelector(selector)?.setAttribute('content',article.perex[lang]);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
    main.innerHTML=`<article class="news-detail"><nav class="crumb" aria-label="${t('Drobečková navigace','Breadcrumbs')}"><a href="index.html">Festival</a> / <a href="news.html">${t('Novinky','News')}</a></nav><time datetime="${article.date}">${formattedDate(article.date,lang)}</time><h1>${esc(article.title[lang])}</h1><p class="lead">${esc(article.perex[lang])}</p><figure class="news-hero"><img src="${article.image}" alt="${t('Festivalová ilustrace k článku','Festival illustration for the article')}" width="1200" height="720"><figcaption>${t('Ilustrace pro návrh Prague Pulse Fest.','Illustration for the Prague Pulse Fest proposal.')}</figcaption></figure><div class="news-body">${article.body[lang].map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="actions"><a class="button" href="${article.link}">${esc(article.linkLabel[lang])} ${arrow}</a><a class="button secondary" href="news.html">${t('Všechny novinky','All news')}</a></div></article>`;
  }
  window.PulseNews=Object.freeze({items,render,searchItems(lang=language()){return items.map(item=>({id:item.id,name:item.title[lang],title:item.title[lang],description:item.perex[lang]+' '+item.body[lang].join(' ')}));}});
})();
