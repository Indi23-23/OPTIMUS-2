/* Local SVG symbols: no fonts, emoji rendering or external assets. */
window.RollWrite = window.RollWrite || {};
RollWrite.symbol = function (name) {
 const svg = body => `<svg class="game-symbol" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${body}</svg>`;
 const frame = '<rect x="4" y="4" width="40" height="40" rx="7" fill="#232425" stroke="#fff" stroke-width="2.8"/>';
 const arrow = '<path d="M22 10A14 14 0 0 1 36 24" fill="none" stroke="white" stroke-width="4"/><path d="m29 20 8 10 6-12z" fill="white"/>';
 if(name==='⟳') return svg(frame+`<g transform="translate(24 24) scale(.79) translate(-24 -24)">${[0,120,240].map(n=>`<g transform="rotate(${n} 24 24)">${arrow}</g>`).join('')}</g>`);
 if(name==='↶') return svg(frame+'<rect x="21" y="22" width="17" height="17" rx="3" fill="white"/><path d="M29 24v-9a8 8 0 0 0-16 0v7" fill="none" stroke="white" stroke-width="3.5"/><path d="m7 17 6 10 6-10z" fill="white"/>');
 if(name==='🦊') return svg('<path d="M4 5 19 14Q24 11 29 14L44 5 39 28 33 35Q30 44 24 44T15 35L9 28Z" fill="#bd3d32" stroke="white" stroke-width="2.8" stroke-linejoin="round"/><circle cx="17" cy="25" r="3" fill="white"/><circle cx="31" cy="25" r="3" fill="white"/><ellipse cx="24" cy="37" rx="3.5" ry="2.8" fill="white"/>');
 if(name==='•••'||name==='•│••') {
  const person=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="white"/><path d="M${x-6} ${y+14}v-4q6-8 12 0v4" fill="white"/>`;
  return svg((name==='•••'?[10,24,38].map(x=>person(x,12)).join(''):[8,28,41].map(x=>person(x,12)).join('')+'<path d="M18 6v32" stroke="white" stroke-width="2"/>'));
 }
 const colors={'groc':'#e8b52f','blau':'#303773','verd':'#78a63c','rosa':'#d66d9d','gris':'#777973'};
 const color=colors[name.split(' ')[1]];
 return svg(`<rect x="5" y="5" width="38" height="38" rx="5" fill="${color||'#232425'}" stroke="white" stroke-width="2.8"/><text x="24" y="34" text-anchor="middle" font-family="Arial,sans-serif" font-style="italic" font-weight="900" font-size="${name==='+1'?27:34}" fill="${color==='#e8b52f'?'#242424':'white'}">${name==='+1'?'+1':'?'}</text>`);
};
