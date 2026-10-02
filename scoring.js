/* Derived scores: never stored, so editing and undo cannot leave stale totals.
   Rules: https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88234_Twice_as_clever_GB.pdf */
RollWrite.optimus2.score = function (get) {
 const indices = n => Array.from({length:n}, (_,i)=>i);
 const number = id => get(id) !== '' && Number.isFinite(Number(get(id))) ? Number(get(id)) : null;
 const marked = id => get(id) === 'x';
 const circled = id => get(id) === 'o' || marked(id);
 const silverScale = [0,2,4,7,11,16,22];
 const yellowScale = [0,3,10,21,36,55,75,96,118,141,165];
 const blueScale = [0,1,3,6,10,15,21,28,36,45,55,66,78];
 const gray = indices(4).reduce((total,row) => total + silverScale[indices(6).filter(col=>marked(`gray-${row}-${col}`)).length],0);
 const yellow = yellowScale[indices(10).filter(i=>marked(`yellow-${i}`)).length];
 // Normally filled from left to right; the last recorded box determines the star.
 const lastBlue = indices(12).filter(i=>number(`blue-${i}`)!==null).pop();
 const blue = blueScale[lastBlue === undefined ? 0 : lastBlue+1];
 const green = indices(6).reduce((sum,i) => sum + (this.greenPairScore(get(`green-${i*2}`),get(`green-${i*2+1}`)) || 0),0);
 const pink = indices(12).reduce((sum,i)=>sum+(number(`pink-${i}`) ?? 0),0);
 // Foxes depend on earned conditions, not on manually crossing their reminder icons.
 const foxes = [
  indices(4).every(row=>marked(`gray-${row}-2`)),
  [1,5,9].every(i=>circled(`yellow-${i}`)),
  number('blue-8') !== null,
  number('green-6') !== null,
  number('pink-7') !== null && number('pink-7') >= 2,
  indices(6).every(i=>circled(`reroll-${i}`))
 ].filter(Boolean).length;
 const lowest = Math.min(gray,yellow,blue,green,pink);
 const fox = foxes*lowest;
 return {gray,yellow,blue,green,pink,fox,foxes,lowest,total:gray+yellow+blue+green+pink+fox};
};
