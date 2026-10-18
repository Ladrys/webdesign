'use strict';
/* Festival editorial content. These articles describe the proposed fictional event. */
(() => {
  const items = [
    {
      id:'vystaviste-tri-sceny',date:'2026-10-18',image:'images/news-reconstruction.webp',photoId:'reconstruction',
      title:{cs:'Průmyslový palác: prostor pro novou kapitolu',en:'The Industrial Palace: room for a new chapter'},
      perex:{cs:'Průmyslový palác prošel obnovou. Podívej se na skutečnou fotografii z průběhu prací v červnu 2026 a na náš návrh festivalu v jeho okolí.',en:'The Industrial Palace has been restored. See an actual photograph taken during the works in June 2026 and our proposed festival layout around the palace.'},
      body:{
        cs:['Průmyslový palác prošel podle provozovatele Výstaviště rekonstrukcí a dostavbou od ledna 2022 do září 2026. Přiložená fotografie z 2. června 2026 zachycuje průběh prací, nikoli dokončený festivalový areál. Palác je eventový prostor; běžný vstup veřejnosti se řídí jeho aktuálním provozem.','Do této lokality zasazujeme návrh Prague Pulse Fest. Main Hall má patřit světovým popovým a rockovým jménům, River Stage českým interpretům u Vltavy a Club Stage bassline, drum & bass a technu. Scény propojuje pěší trasa v orientačním plánku.','Náš festival je fiktivní. Rozmístění scén a využití paláce jsou součástí návrhu, nikoli oznámením spolupráce s Výstavištěm. Pro skutečnou návštěvu místa vždy ověř aktuální provoz a přístupnost u provozovatele.'],
        en:['According to the venue operator, the Industrial Palace underwent reconstruction and completion from January 2022 to September 2026. The photograph, taken on 2 June 2026, records work in progress rather than a completed festival site. The palace is an event venue; general public access depends on its current programme.','This location is the setting for the Prague Pulse Fest proposal. Main Hall is for international pop and rock acts, River Stage for Czech artists by the Vltava, and Club Stage for bassline, drum & bass and techno. A walking route connects the stages on our schematic site plan.','Our festival is fictional. Stage locations and use of the palace are design proposals, not an announced partnership with Výstaviště. Check current opening and access arrangements with the venue operator before visiting.']
      },source:'https://pronajem.navystavisti.cz/otevirame-prumyslovy-palac/',link:'info.html#site-map',linkLabel:{cs:'Prohlédnout plánek areálu',en:'Explore the site plan'}
    },
    {
      id:'tri-dny-jedna-vstupenka',date:'2026-10-17',image:'images/news-tickets.webp',photoId:'tickets',
      title:{cs:'Jeden den, dva večery, nebo celý festival?',en:'One day, two evenings or the whole festival?'},
      perex:{cs:'Vyber si dny a jednu scénu, nebo společný vstup. Main Hall nabízí sedadla i stání; River a Club Stage jsou na stání.',en:'Choose your dates and a single stage or an all-stage pass. Main Hall has seats and standing; River and Club Stage are standing only.'},
      body:{
        cs:['V objednávce vybereš jeden, libovolné dva nebo všechny tři dny od 1. do 3. srpna 2027. Společný vstup pokrývá všechny scény; levnější vstup na jednu scénu platí pouze pro Main Hall, River nebo Club Stage podle výběru. VIP a Regular jsou sedadla v Main Hall, která zůstávají stejná po zvolené dny. Na River a Club Stage se stojí.','Ceny jsou konečné, včetně DPH a poplatků objednávky. Třídenní VIP se společným vstupem na všechny scény obsahuje rychlejší odbavení, odpočinkovou zónu a jedno parkovací místo. Jídlo, nápoje a přenocování si řešíš zvlášť. V košíku lze přidat kempovací parcelu pro vlastní stan nebo karavan a počet osob na tři noci.','Nakoupit můžeš i bez registrace. Promo kód se odečítá z ceny koncertních vstupenek, nikoli z kempování. Po dokončení simulované platby stáhneš PDF vstupenky a případný samostatný kempovací poukaz. Přihlášený návštěvník je najde také v historii účtu.'],
        en:['Choose one, any two or all three dates from 1 to 3 August 2027. An all-stage pass includes every stage; a lower-priced single-stage ticket covers only your chosen Main Hall, River or Club Stage. VIP and Regular are seats in Main Hall and remain the same on your chosen dates. River and Club Stage are standing only.','Prices are final, including VAT and booking fees. A three-day all-stage VIP pass includes fast-track entry, a lounge and one parking space. Food, drinks and accommodation are separate. At checkout, you can add a pitch for your own tent or caravan and choose the number of campers for three nights.','You can order without registering. Promo codes discount concert tickets, not camping. After the simulated payment, download your PDF tickets and a separate camping voucher if selected. Signed-in visitors can also find them in their account history.']
      },link:'tickets.html',linkLabel:{cs:'Vybrat vstupenky',en:'Choose tickets'}
    },
    {
      id:'do-holesovic-bez-auta',date:'2026-10-16',image:'images/news-transit.webp',photoId:'transit',
      title:{cs:'Do Holešovic bez auta',en:'Getting to Holešovice without a car'},
      perex:{cs:'Tramvaj na Výstaviště, metro C a poslední úsek pěšky. Naplánuj si příjezd ještě před prvním koncertem.',en:'Take a tram to Výstaviště or metro line C, then walk the final stretch. Plan your journey before the first show.'},
      body:{
        cs:['Zastávka Výstaviště je blízko hlavního vstupu do areálu. Alternativou je metro C na Nádraží Holešovice a navazující tramvaj. Konkrétní spojení si před cestou ověř v aktuálním jízdním řádu PID.','Při cestě pěšky můžeš využít trasu přes Stromovku. Dbej na místní značení a okolní provoz. Parkování v Holešovicích podléhá pravidlům jednotlivých parkovišť a městských zón.','VIP parkování je součástí třídenního VIP balíčku se vstupem na všechny scény; ostatní vstupenky ho nezahrnují. Podrobnosti k adrese, ubytování i bezbariérovému přístupu jsou na jednom místě v praktických informacích.'],
        en:['The Výstaviště tram stop is close to the main entrance. Another option is metro line C to Nádraží Holešovice and a connecting tram. Check the current PID timetable before you travel.','If you are walking, you can approach through Stromovka park. Follow local signs and be mindful of traffic. Parking in Holešovice is subject to individual car park and city parking zone rules.','The three-day all-stage VIP pass includes parking; other tickets do not. Find the address, accommodation suggestions and accessibility information together in the visitor information section.']
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
    const photo=window.PulsePhotoCredits?.news?.find(item=>item.id===article.photoId);
    const caption=photo?(lang==='en'?photo.captionEn:photo.captionCs):article.title[lang];
    document.title=article.title[lang]+' | Prague Pulse Fest';
    for(const selector of ['meta[name="description"]','meta[property="og:description"]'])document.querySelector(selector)?.setAttribute('content',article.perex[lang]);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
    main.innerHTML=`<article class="news-detail"><nav class="crumb" aria-label="${t('Drobečková navigace','Breadcrumbs')}"><a href="index.html">Festival</a> / <a href="news.html">${t('Novinky','News')}</a></nav><time datetime="${article.date}">${formattedDate(article.date,lang)}</time><h1>${esc(article.title[lang])}</h1><p class="lead">${esc(article.perex[lang])}</p><figure class="news-hero"><img src="${article.image}" alt="${esc(caption)}" width="1200" height="720"><figcaption>${esc(caption)}${photo?` · ${esc(photo.author)} · <a href="${esc(photo.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(photo.license)}</a> · <a href="credits.html">${t('Foto a zdroje','Photo credits')}</a>`:''}</figcaption></figure><div class="news-body">${article.body[lang].map(p=>`<p>${esc(p)}</p>`).join('')}${article.source?`<p class="count"><a href="${esc(article.source)}" target="_blank" rel="noopener noreferrer">${t('Zdroj: provozovatel Výstaviště Praha','Source: Výstaviště Prague venue operator')}</a> · ${t('ověřeno 18. 10. 2026','checked 18 October 2026')}</p>`:''}</div><div class="actions"><a class="button" href="${article.link}">${esc(article.linkLabel[lang])} ${arrow}</a><a class="button secondary" href="news.html">${t('Všechny novinky','All news')}</a></div></article>`;
  }
  window.PulseNews=Object.freeze({items,render,searchItems(lang=language()){return items.map(item=>({id:item.id,name:item.title[lang],title:item.title[lang],description:item.perex[lang]+' '+item.body[lang].join(' ')}));}});
})();
