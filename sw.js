const V='msgr-v55';const CORE=['apple-touch-icon-galaxy.png','icon-galaxy-192.png','icon-galaxy-512.png','./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))))});
/* notifications: calls and messages arrive even when the app is closed */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(_){d={title:'Мессенджер',body:e.data?e.data.text():''}}
  e.waitUntil((async()=>{const tag=d.tag||'m';
    if(d.t==='end'){const old=await self.registration.getNotifications({tag});old.forEach(n=>n.close());}
    const call=d.t==='call';
    await self.registration.showNotification(d.title||'Мессенджер',{body:d.body||'',icon:'icon-192.png',badge:'icon-192.png',tag,renotify:true,
      requireInteraction:call,silent:false,vibrate:call?[600,250,600,250,600,250,600]:[200,100,200],data:{chat:d.chat||'',call:d.call||'',t:d.t||'msg'},timestamp:Date.now()});
    const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});cs.forEach(c=>c.postMessage({type:'push',d}));
  })())});
self.addEventListener('notificationclick',e=>{e.notification.close();const d=e.notification.data||{};
  const url=new URL('./'+(d.chat?'?open='+encodeURIComponent(d.chat):''),self.registration.scope).href;
  e.waitUntil((async()=>{const cs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const c of cs){if('focus' in c){await c.focus();c.postMessage({type:'open',chat:d.chat});return}}
    if(self.clients.openWindow)await self.clients.openWindow(url)})())});
self.addEventListener('pushsubscriptionchange',e=>{});
