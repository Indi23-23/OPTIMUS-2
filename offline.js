/* Offline support is enabled only on a secure hosted address or localhost. */
(() => {
 const status=document.querySelector('#offline-status');
 if(!('serviceWorker' in navigator)||!['https:','http:'].includes(location.protocol)||!window.isSecureContext) {
  status.textContent='El mode sense connexió estarà disponible a la versió publicada.'; return;
 }
 navigator.serviceWorker.register('./sw.js').then(async registration=>{
  await navigator.serviceWorker.ready;
  const updateStatus=()=>{status.textContent=registration.waiting
   ? 'Actualització preparada. Tanca totes les finestres de l’aplicació i torna-la a obrir.'
   : navigator.onLine ? 'Preparat per jugar sense connexió' : 'Sense connexió · pots continuar jugant';};
  updateStatus();
  window.addEventListener('online',updateStatus);window.addEventListener('offline',updateStatus);
  registration.addEventListener('updatefound',()=>{
   const worker=registration.installing;
   if(worker) worker.addEventListener('statechange',updateStatus);
  });
 }).catch(()=>{status.textContent='No s’ha pogut preparar el mode sense connexió. Torna a obrir l’aplicació amb Internet.';});
})();
