(() => {
 'use strict';
 const $ = selector => document.querySelector(selector);
 const fields = new Map();
 const diceColors = {white:'Blanc',green:'Verd',pink:'Rosa',silver:'Platejat',yellow:'Groc',blue:'Blau'};
 const game = RollWrite.optimus2;
 const isDie = id => /^die-[123]$/.test(id);
 const isPink = id => /^pink-\d+$/.test(id);
 const store = RollWrite.createStore(RollWrite.optimus2.id, text => $('#save-status').textContent = text);
 const cell = (id,type,label='',css='',description=id) => {
  fields.set(id,{type,label,description});
  return `<button type="button" class="cell ${css}" data-cell="${id}" aria-label="${description}"><span class="cell-label">${label}</span><span class="entry"></span></button>`;
 };
 $('#board').innerHTML = RollWrite.optimus2.render(cell);
 const colors=['gray','yellow','blue','green','pink','fox'];
 const names=['Gris','Groc','Blau','Verd','Rosa','Guineus'];
 $('#score-table').innerHTML = `<div class="score-row score-heading"><span class="score-icon-heading" role="img" aria-label="Jugador" title="Jugador"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="13" r="8" fill="currentColor"/><path d="M9 43v-8a15 15 0 0 1 30 0v8Z" fill="currentColor"/></svg></span>${names.map((n,i)=>`<span class="${colors[i]} score-icon-heading" role="img" aria-label="${n}" title="${n}">${i===5?RollWrite.symbol('🦊'):'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 3 4 6 7-3 1 8 8 1-3 7 6 4-6 4 3 7-8 1-1 8-7-3-4 6-4-6-7 3-1-8-8-1 3-7-6-4 6-4-3-7 8-1 1-8 7 3Z" transform="translate(2 0) scale(.92)" fill="none" stroke="white" stroke-width="2.6"/></svg>'}</span>`).join('')}<span class="score-icon-heading score-sum" role="img" aria-label="Total" title="Total">Σ</span></div>` + [0,1,2,3].map(r=>`<div class="score-row"><label><span class="sr-only">Nom del jugador ${r+1}</span><input data-player="${r}" placeholder="${r===0?'Tu · auto':'Jugador '+(r+1)}" maxlength="24"></label>${colors.map((c,i)=>r===0 ? `<output class="cell ${c} auto-score" data-auto-score="${c}" aria-label="Punts ${names[i]}, automàtics">0</output>` : cell(`score-${r}-${i}`,'number','',c,`Punts ${names[i]}, jugador ${r+1}`)).join('')}<output id="total-${r}" aria-label="Total jugador ${r+1}">0</output></div>`).join('');
 function refresh() {
  document.querySelectorAll('[data-cell]').forEach(el=>{
   const id=el.dataset.cell, def=fields.get(id), value=store.get(id);
   const marked=value==='x', circled=value==='o', numbered=def.type==='number' && value!=='';
   el.classList.toggle('marked',marked); el.classList.toggle('circled',circled); el.classList.toggle('filled',numbered);
   el.querySelector('.entry').textContent = marked?'×':numbered?value:'';
   el.setAttribute('aria-label',`${def.description}${value!==''?': '+(marked?'marcat':circled?'encerclat':value):', buit'}`);
   if(isDie(id)) {
    const color = store.get(`${id}-color`);
    el.dataset.dieColor = Object.hasOwn(diceColors,color) ? color : '';
    if (el.dataset.dieColor) el.setAttribute('aria-label', `${el.getAttribute('aria-label')}, ${diceColors[color]}`);
   }
   if(def.type!=='number') el.setAttribute('aria-pressed',String(marked||circled));
  });
  document.querySelectorAll('[data-player]').forEach(el=> {if(document.activeElement!==el) el.value=store.get(`player-${el.dataset.player}`);});
  const score = game.score(id=>store.get(id));
  document.querySelectorAll('[data-auto-score]').forEach(el=>{el.textContent=score[el.dataset.autoScore];});
  $('#total-0').textContent=score.total;
  $('#fox-detail').textContent=`Guineus: ${score.foxes} × ${score.lowest} punts (el color amb menys punts) = ${score.fox}. Es compten quan les aconsegueixes, sense haver de marcar-ne el símbol.`;
  for(let r=1;r<4;r++) $(`#total-${r}`).textContent=colors.reduce((sum,_,i)=>sum+(Number(store.get(`score-${r}-${i}`))||0),0);
  document.querySelectorAll('[data-green-pair]').forEach(output => {
   const first = Number(output.dataset.greenPair) * 2;
   const score = game.greenPairScore(store.get(`green-${first}`), store.get(`green-${first+1}`));
   output.textContent = score;
   output.setAttribute('aria-label', `Punts verds, parella ${first/2+1}: ${score === '' ? 'pendent' : score}`);
  });
  $('#undo').disabled=!store.canUndo();
 }
 let selected=null, selectedColor='';
 function refreshColorOptions() {
  document.querySelectorAll('[data-dice-color]').forEach(button => {
   button.setAttribute('aria-pressed', String(button.dataset.diceColor === selectedColor));
  });
 }
 $('.color-options').innerHTML = Object.entries(diceColors).map(([color,label]) =>
  `<button type="button" data-dice-color="${color}" aria-pressed="false"><span class="color-swatch" data-die-color="${color}"></span>${label}</button>`
 ).join('');
 $('.color-options').addEventListener('click', event => {
  const button = event.target.closest('[data-dice-color]');
  if (button) { selectedColor = button.dataset.diceColor; refreshColorOptions(); }
 });
 function openNumber(id) {
  selected=id; selectedColor=store.get(`${id}-color`);
  const multiplier = game.greenMultiplier(id);
  $('#number-title').textContent = multiplier ? `Valor del dau · ×${multiplier}` : fields.get(id).description;
  $('#number-input').setCustomValidity('');
  $('#dice-colors').hidden=!isDie(id); refreshColorOptions();
  $('.quick-numbers').innerHTML=((isDie(id)||isPink(id)||multiplier)?[1,2,3,4,5,6]:Array.from({length:13},(_,n)=>n))
   .map(n=>`<button type="button" data-number="${n}">${n}</button>`).join('');
  $('#number-input').value=multiplier && store.get(id) !== '' ? Number(store.get(id))/multiplier : store.get(id); $('#number-dialog').showModal();
  if(isDie(id)) $('.color-options button').focus();
  else if(window.matchMedia('(pointer: coarse)').matches) $('.quick-numbers button').focus();
  else { $('#number-input').focus(); $('#number-input').select(); }
 }
 function commit(value) {
  const multiplier = game.greenMultiplier(selected);
  if ((multiplier || isPink(selected)) && value !== '' && !/^[1-6]$/.test(value)) {
   $('#number-input').setCustomValidity('Escriu un valor de dau entre 1 i 6.');
   $('#number-input').reportValidity(); return;
  }
  const changes = {[selected]:multiplier && value !== '' ? String(Number(value)*multiplier) : value};
  if (isDie(selected)) changes[`${selected}-color`]=selectedColor;
  store.setMany(changes); $('#number-dialog').close(); refresh();
 }
 document.addEventListener('click',event=>{
  const el=event.target.closest('[data-cell]'); if(!el) return;
  const id=el.dataset.cell, def=fields.get(id), value=store.get(id);
  if(def.type==='number') openNumber(id);
  else {store.set(id,def.type==='cycle'?({'':'o',o:'x',x:''}[value]??'o'):value==='x'?'':'x'); refresh();}
 });
 $('.quick-numbers').addEventListener('click',e=>{const b=e.target.closest('[data-number]'); if(b) commit(b.dataset.number);});
 $('#number-input').addEventListener('input',()=>$('#number-input').setCustomValidity(''));
 $('#number-form').addEventListener('submit',e=>{e.preventDefault(); const value=$('#number-input').value.trim(); if(value===''||/^-?\d{1,4}$/.test(value))commit(value);});
 $('#clear-number').onclick=()=>{selectedColor='';commit('');}; $('#cancel-number').onclick=()=>$('#number-dialog').close();
 $('#undo').onclick=()=>{store.undo();refresh();};
 $('#new-game').onclick=()=>$('#new-dialog').showModal(); $('#cancel-new').onclick=()=>$('#new-dialog').close();
 $('#confirm-new').onclick=()=>{store.reset();refresh();$('#new-dialog').close();};
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(t=>{t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));}); $('#board').hidden=b.dataset.view!=='board';$('#scores').hidden=b.dataset.view!=='scores';});
 $('#help-toggle').onclick=()=>{$('#help').hidden=!$('#help').hidden;$('#help-toggle').setAttribute('aria-expanded',String(!$('#help').hidden));};
 document.querySelectorAll('[data-player]').forEach(el=>el.addEventListener('input',()=>{store.set(`player-${el.dataset.player}`,el.value);$('#undo').disabled=!store.canUndo();}));
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!e.target.matches('input')&&!document.querySelector('dialog[open]')){e.preventDefault();store.undo();refresh();}});
 refresh();store.save();
})();