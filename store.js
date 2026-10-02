/* Browser-local storage and undo are independent from the game renderer. */
RollWrite.createStore = function (gameId, onStatus) {
 const key = `rollwrite:${gameId}:v1`;
 let state = {}, history = [];
 try {
  const data = JSON.parse(localStorage.getItem(key) || 'null');
  if (data && data.version === 1 && data.state && typeof data.state === 'object' && !Array.isArray(data.state)) {
   state = data.state; history = Array.isArray(data.history) ? data.history.slice(-150) : [];
  }
 } catch (_) { onStatus('No s’ha pogut recuperar el guardat.'); }
 function save() {
  try { localStorage.setItem(key, JSON.stringify({version:1,state,history})); onStatus('Desat en aquest navegador'); }
  catch (_) { onStatus('No s’ha pogut desar. Mantén aquesta pestanya oberta.'); }
 }
 return {
  get: id => state[id] ?? '',
  canUndo: () => history.length > 0,
  set(id,value) { this.setMany({[id]:value}); },
  setMany(changes) {
   if (Object.entries(changes).every(([id,value]) => (state[id] ?? '') === value)) return;
   history.push({...state}); history = history.slice(-150);
   state = {...state,...changes}; save();
  },
  reset() { history.push({...state}); history = history.slice(-150); state = {}; save(); },
  undo() { if(history.length) {state = history.pop(); save();} },
  save
 };
};