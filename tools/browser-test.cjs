const fs=require('node:fs');
const path=require('node:path');
class BrowserTest {
 constructor(ws){this.ws=ws;this.sequence=0;this.pending=new Map();this.errors=[];ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=this.pending.get(m.id);this.pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')this.errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);});}
 static async connect(){const tabs=await(await fetch('http://127.0.0.1:'+(process.env.PULSE_CDP_PORT||9333)+'/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});const client=new BrowserTest(ws);await client.send('Runtime.enable');await client.send('Page.enable');return client;}
 send(method,params={}){const id=++this.sequence;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
 async evaluate(expression){const r=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
 async goto(page){const before=await this.evaluate('performance.timeOrigin');await this.send('Page.navigate',{url:page.startsWith('file:')?page:'http://127.0.0.1:'+(process.env.PULSE_TEST_PORT||4173)+'/web/'+page});for(let i=0;i<150;i++){await new Promise(r=>setTimeout(r,50));try{if(await this.evaluate(`performance.timeOrigin!==${before}&&document.readyState==='complete'&&Boolean(window.PulseI18n)&&Boolean(document.querySelector('main h1'))`))return;}catch{}}throw Error('Page did not load '+page);}
 async screenshot(name){const r=await this.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,Buffer.from(r.data,'base64'));}
 close(){this.ws.close();}
}
module.exports=BrowserTest;
if(require.main===module)(async()=>{const b=await BrowserTest.connect();await b.goto(process.argv[2]||'index.html');console.log(JSON.stringify(await b.evaluate('({title:document.title,h1:document.querySelector("h1")?.textContent,missing:PulseI18n.missing(),text:document.body.innerText.slice(0,1500)})'),null,2));console.log('Errors',b.errors);b.close();})();
