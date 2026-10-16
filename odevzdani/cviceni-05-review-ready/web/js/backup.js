/* Explicit JSON backup: browser permissions remain under the user's control. */
(() => {
'use strict';
let validateTicket=()=>false;
const parse=(key,fallback)=>{try{return JSON.parse(localStorage.getItem('pulse:'+key))??fallback;}catch{return fallback;}};
const isText=(v,max=200)=>typeof v==='string'&&v.length>0&&v.length<=max;
const fail=()=>{throw new Error('Soubor neobsahuje platnou zálohu Prague Rocks Festival.');};
function cleanTicket(t){if(!validateTicket(t))fail();return {day:t.day,seat:t.seat,category:t.category,price:t.price,...(t.scope?{scope:t.scope}:{}),...(t.days?{days:[...t.days]}:{}),...(isText(t.code,256)?{code:t.code}:{})};}
function clean(data){
if(!data||data.version!==1||data.festival!=='prf2026'||!Array.isArray(data.users)||!Array.isArray(data.orders)||!Array.isArray(data.favorites)||!data.carts||typeof data.carts!=='object'||Array.isArray(data.carts)||data.users.length>1000||data.orders.length>2000||Object.keys(data.carts).length>1001)fail();
const users=data.users.map(u=>{if(!u||!isText(u.id,100)||!isText(u.name,80)||!isText(u.email,160)||!/^[a-f0-9]{32}$/.test(u.salt)||!/^[a-f0-9]{64}$/.test(u.hash))fail();return {id:u.id,name:u.name,email:u.email,salt:u.salt,hash:u.hash};});
if(new Set(users.map(u=>u.id)).size!==users.length||new Set(users.map(u=>u.email)).size!==users.length)fail();
const orders=data.orders.map(o=>{if(!o||!isText(o.id,150)||!isText(o.name,80)||!isText(o.email,160)||!isText(o.created,60)||!Number.isFinite(Date.parse(o.created))||!(o.owner===null||isText(o.owner,100))||!Array.isArray(o.tickets)||!o.tickets.length||o.tickets.length>264)fail();const tickets=o.tickets.map(cleanTicket);if(!Number.isFinite(o.total)||tickets.reduce((sum,t)=>sum+t.price,0)!==o.total)fail();return {id:o.id,created:o.created,owner:o.owner,name:o.name,email:o.email,total:o.total,tickets};});
if(new Set(orders.map(o=>o.id)).size!==orders.length)fail();
const carts={};for(const [key,value]of Object.entries(data.carts)){if(!/^cart:(guest|[a-zA-Z0-9_-]{1,100})$/.test(key)||!Array.isArray(value)||value.length>264)fail();carts[key]=value.map(cleanTicket);}
if(data.favorites.length>60||data.favorites.some(id=>!/^a(?:[1-9]|[1-5][0-9]|60)$/.test(id)))fail();
return {version:1,festival:'prf2026',exportedAt:new Date().toISOString(),users,orders,favorites:[...new Set(data.favorites)],carts};
}
function snapshot(){const carts={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key?.startsWith('pulse:cart:'))carts[key.slice(6)]=parse(key.slice(6),[]);}return clean({version:1,festival:'prf2026',users:parse('users',[]),orders:parse('orders',[]),favorites:parse('favorites',[]),carts});}
function download(){const value=snapshot(),blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='prague-rocks-data.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);return value;}
function merge(current,incoming){
const next=structuredClone(current);
for(const user of incoming.users){const existing=next.users.find(u=>u.id===user.id||u.email===user.email);if(existing){if(JSON.stringify(existing)!==JSON.stringify(user))throw new Error('Záloha obsahuje jinou verzi existujícího účtu. Současná data nebyla změněna.');}else next.users.push(user);}
for(const order of incoming.orders){const existing=next.orders.find(o=>o.id===order.id);if(existing){if(JSON.stringify(existing)!==JSON.stringify(order))throw new Error('Záloha obsahuje konfliktní objednávku. Současná data nebyla změněna.');}else next.orders.push(order);}
if(next.orders.some(o=>o.owner&&!next.users.some(u=>u.id===o.owner)))fail();
next.favorites=[...new Set([...next.favorites,...incoming.favorites])];
for(const[key,value]of Object.entries(incoming.carts)){const own=next.carts[key]||[],ident=t=>(t.scope==='festival'?'festival':t.day)+':'+t.seat;next.carts[key]=[...own,...value.filter(t=>!own.some(x=>ident(x)===ident(t)))];}
return clean(next);
}
async function importFile(file){if(!file||file.size>5*1024*1024)throw new Error('Vyber JSON zálohu menší než 5 MB.');let incoming;try{incoming=clean(JSON.parse(await file.text()));}catch(error){if(error instanceof SyntaxError)fail();throw error;}
const next=merge(snapshot(),incoming),entries=[['users',next.users],['orders',next.orders],['favorites',next.favorites],...Object.entries(next.carts)],before=new Map(entries.map(([key])=>[key,localStorage.getItem('pulse:'+key)]));
try{for(const[key,value]of entries)localStorage.setItem('pulse:'+key,JSON.stringify(value));}
catch(error){for(const[key,value]of before){if(value===null)localStorage.removeItem('pulse:'+key);else localStorage.setItem('pulse:'+key,value);}throw new Error('Zálohu se nepodařilo uložit. V úložišti není dost místa.');}
return next;
}
function bind({isValidTicket,onImported}){validateTicket=isValidTicket;const output=document.getElementById('backup-status'),show=text=>{output.textContent=text;};document.getElementById('export-data').onclick=()=>{try{download();show('JSON záloha je připravená ke stažení.');}catch(error){show(error.message);}};document.getElementById('import-data').onchange=async event=>{try{await importFile(event.target.files[0]);show('Záloha byla načtena. Účty a objednávky jsou obnovené.');onImported();}catch(error){show(error.message);}finally{event.target.value='';}};}
function panel(){return `<section class="card backup-panel"><p class="eyebrow">Záloha / JSON</p><h2>Přenos účtu a objednávek</h2><p>Uložené údaje zůstávají po zavření webu. Pro přesun na jiné zařízení si stáhni JSON zálohu a znovu ji načti. Hesla jsou v záloze pouze jako hashe.</p><div class="actions"><button id="export-data" class="secondary" type="button">Stáhnout JSON zálohu</button><label class="button secondary" for="import-data">Načíst JSON zálohu</label><input id="import-data" type="file" accept=".json,application/json" class="visually-hidden"></div><p id="backup-status" class="count" role="status"></p></section>`;}
window.PulseBackup={bind,panel,export:download,importFile};
})();
