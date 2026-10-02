/* Definition of this game. Other sheets can supply their own renderer and fields. */
window.RollWrite = window.RollWrite || {};
RollWrite.optimus2 = {
 id: 'optimus2', title: 'Optimus 2',
 greenMultipliers: [2,2,2,1,3,3,3,2,3,1,4,1],
 greenMultiplier(id) {
  const match = /^green-(\d+)$/.exec(id);
  return match ? this.greenMultipliers[Number(match[1])] ?? null : null;
 },
 greenPairScore(first, second) {
  if (first === '' || second === '') return '';
  const a = Number(first), b = Number(second);
  return Number.isFinite(a) && Number.isFinite(b) ? a - b : '';
 },
 render(cell) {
  const icon = RollWrite.symbol;
  const star = (value, color='') => `<span class="score-star ${color}">${value}</span>`;
  const bonus = (id, text) => cell(id, 'mark', icon(text), 'bonus', `Bonificació ${text}`);
  const row = (id, icon) => `<div class="resource"><b>${RollWrite.symbol(icon)}</b>${Array.from({length:6},(_,i)=>`<span class="resource-slot">${cell(`${id}-${i}`, 'cycle', '', 'round', `${icon}, casella ${i+1}`)}${i===5?`<small class="resource-reward">${RollWrite.symbol(id==='reroll'?'🦊':id==='return'?'? rosa':'? gris')}</small>`:''}</span>`).join('')}</div>`;
  const rewards = ['+1','? groc','🦊','? blau','? verd','? rosa'];
  let html = `<section class="top-area" aria-label="Rondes i accions"><div class="dice">${[1,2,3].map(i=>cell(`die-${i}`,'number','','die',`Dau ${i}`)).join('')}</div><div><div class="rounds">${['⟳','+1','↶','?','•••','•│••'].map((v,i)=>cell(`round-${i}`,'mark',`<strong>${i+1}</strong><small>${icon(v)}</small>`,'round-card',`Ronda ${i+1}`)).join('')}</div>${row('reroll','⟳')}${row('return','↶')}${row('extra','+1')}</div></section>`;
  html += `<div class="upper-zones"><section class="zone gray" aria-label="Zona grisa"><h2>Gris</h2><div class="gray-grid">${rewards.map((x,i)=>bonus(`gray-bonus-${i}`,x)).join('')}${['yellow','blue','green','pink'].map((color,r)=>Array.from({length:6},(_,i)=>cell(`gray-${r}-${i}`,'mark',i+1,`printed ${color}`,`Gris, fila ${r+1}, valor ${i+1}`)).join('')).join('')}<div class="gray-values">${[2,4,7,11,16,22].map((n,i)=>`<span>${i+1} ${star(n)}</span>`).join('')}</div></div></section>`;
  const positions=[[0,1,3],[0,3,6],[1,0,1],[1,2,2],[2,1,4],[2,3,3],[3,0,2],[3,2,5],[4,1,5],[4,3,4]];
  html += `<section class="zone yellow" aria-label="Zona groga"><h2>Groc <small>○ → ×</small></h2><div class="yellow-values">${[3,10,21,36,55,75,96,118,141,165].map((n,i)=>`<span>${i+1} ${star(n)}</span>`).join('')}</div><div class="yellow-grid"><span class="yellow-guide" aria-hidden="true">○ → ⊗</span>${positions.map(([r,c,n],i)=>`<div style="grid-row:${r+1};grid-column:${c+1}">${cell(`yellow-${i}`,'cycle',n,'printed',`Groc, fila ${r+1}, valor ${n}`)}</div>`).join('')}${['? blau','↶','? groc','? verd','? rosa'].map((x,i)=>`<div style="grid-row:${i+1};grid-column:5">${bonus(`yellow-row-${i}`,x)}</div>`).join('')}${['⟳','+1','? gris','🦊'].map((x,i)=>`<div style="grid-row:6;grid-column:${i+1}">${bonus(`yellow-col-${i}`,x)}</div>`).join('')}</div></section></div>`;
  const blueRewards=['','↶','? groc','','+1','⟳','? rosa','','🦊','↶','','? verd'];
  html+=`<section class="zone blue lane" aria-label="Zona blava"><h2>Blau <small>Dau blau + blanc · valors descendents o iguals</small></h2><div class="lane-grid">${[1,3,6,10,15,21,28,36,45,55,66,78].map((n,i)=>`<div><span class="points">${star(n)}</span>${cell(`blue-${i}`,'number','','',`Blau, casella ${i+1}`)}${blueRewards[i]?bonus(`blue-bonus-${i}`,blueRewards[i]):'<span class="bonus-space"></span>'}</div>`).join('')}</div></section>`;
  const multipliers=this.greenMultipliers, gr=['','⟳','','? blau','↶','','🦊','? gris','+1','','? rosa','? groc'];
  html+=`<section class="zone green lane" aria-label="Zona verda"><h2>Verd <small>Multiplica cada valor · resta les parelles</small></h2><div class="lane-grid">${multipliers.map((n,i)=>`<div class="${i%2?'pair-end':'pair-start'}"><span class="points green-points">${i%2?'':`<output class="score-star" data-green-pair="${i/2}" aria-label="Punts verds, parella ${i/2+1}" aria-live="polite"></output>`}</span>${cell(`green-${i}`,'number',`×${n}`,'',`Verd, casella ${i+1}, multiplicador ${n}`)}${gr[i]?bonus(`green-bonus-${i}`,gr[i]):'<span class="bonus-space"></span>'}</div>`).join('')}</div></section>`;
  const pr=['','','⟳','↶','+1','? verd','? groc','🦊','? gris','⟳','? blau','? groc'];
  html+=`<section class="zone pink lane" aria-label="Zona rosa"><h2>Rosa <small>Llindars per obtenir bonificacions</small></h2><div class="lane-grid">${['','','≥2','≥3','≥4','≥5','≥6','≥2','≥3','≥4','≥5','≥6'].map((v,i)=>`<div>${cell(`pink-${i}`,'number',v,'',`Rosa, casella ${i+1}`)}${pr[i]?bonus(`pink-bonus-${i}`,pr[i]):'<span class="bonus-space"></span>'}</div>`).join('')}</div></section>`;
  return html;
 }
};