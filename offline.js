/* Install updates without clearing the user's locally saved game. */
(() => {
 const status=document.querySelector('#offline-status');
 if(!('serviceWorker' in navigator)||!['https:','http:'].includes(location.protocol)||!window.isSecureContext) {
  status.textContent='El mode sense connexió estarà disponible a la versió publicada.'; return;
 }
 const button=document.createElement('button');
 button.type='button'; button.textContent='Actualitzar l’aplicació';
 status.after(button);
 let changed=false, requested=false;
 const controlledAtStart=Boolean(navigator.serviceWorker.controller);
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(!controlledAtStart) return;
  changed=true;
  if(requested) location.reload();
  else status.textContent='Versió nova preparada. Prem Actualitzar l’aplicació.';
 });
 navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(async registration=>{
  await navigator.serviceWorker.ready;
  const updateStatus=()=>{
   status.textContent=changed ? 'Versió nova preparada. Prem Actualitzar l’aplicació.'
    : navigator.onLine ? 'Preparat per jugar sense connexió · versió 3' : 'Sense connexió · pots continuar jugant';
  };
  const check=()=>{if(navigator.onLine) registration.update().catch(()=>{});};
  updateStatus(); check();
  window.addEventListener('online',()=>{updateStatus();check();});
  window.addEventListener('offline',updateStatus);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible') check();});
  button.onclick=async()=>{
   if(changed){location.reload();return;}
   if(!navigator.onLine){status.textContent='Connecta’t a Internet per buscar actualitzacions.';return;}
   requested=true;button.disabled=true;status.textContent='Comprovant l’actualització…';
   try {
    await registration.update();
    const worker=registration.installing || registration.waiting;
    if(worker && worker.state!=='activated') {
     await new Promise((resolve,reject)=>{
      const finish=()=>{
       if(worker.state==='activated') resolve();
       else if(worker.state==='redundant') reject(new Error('Update failed'));
      };
      worker.addEventListener('statechange',finish);finish();
     });
    }
    location.reload();
   } catch (_) {requested=false;button.disabled=false;status.textContent='No s’ha pogut actualitzar. Torna-ho a provar amb connexió.';}
  };
 }).catch(()=>{button.hidden=true;status.textContent='No s’ha pogut preparar el mode sense connexió. Torna a obrir l’aplicació amb Internet.';});
})();
