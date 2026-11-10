const B=require('./browser-test.cjs');
(async()=>{const b=await B.connect();try{await b.goto('index.html');await b.evaluate("localStorage.clear();localStorage.setItem('pulse:privacy',JSON.stringify({version:1,externalMaps:false,savedAt:Date.now()}))");await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 for(const [name,route,width,height] of [['home','index.html',1440,1000],['mobile','index.html',375,900]]){
 await b.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});await b.goto(route);await b.screenshot('preview/'+name+'.jpg');
 } }finally{b.close();}})();
