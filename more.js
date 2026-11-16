/* Extras: automatic cloud backup, repeating an earlier meal, saved meals, the weekly summary.
   Loaded before app.js and uses its helpers when called. */
'use strict';

/* ---------- one logged food as a copyable line (values per 100 g) ---------- */
function entryItem(e) {
  const q = 100 / (e.grams || 100), r = v => Math.round((v || 0) * q * 10) / 10;
  return { fid: e.foodId, n: e.name, g: r1(e.grams), k: r(e.kcal), p: r(e.p), c: r(e.c), f: r(e.f), fi: r(e.fi), gr: entryGrade(e) || null };
}
const itemsKcal = items => items.reduce((a, e) => a + e.k * e.g / 100, 0);

/* ---------- repeat my own earlier meal ---------- */
// The most recent earlier day (up to a month back) on which this meal was logged.
function prevMeal(meal, from) {
  for (let n = 1; n <= 30; n++) {
    const d = addDays(from, -n), es = dayLog(d).filter(e => e.meal === meal);
    if (es.length) return { d, es };
  }
  return null;
}

/* ---------- saved meals ---------- */
const myRecipes = () => Object.values(S.recipes || {}).sort((a, b) => a.name.localeCompare(b.name));
// Saved meals my partners share, checked and cleaned up (data from another phone).
function partnerRecipes() {
  if (!S.share || !S.share.on) return [];
  const out = [], have = new Set(myRecipes().map(r => norm(r.name)));
  S.share.friends.forEach(fr => {
    const c = S.share.cache[fr.uid];
    (S.share.frecipes[fr.uid] || []).slice(0, 30).forEach((r, i) => {
      if (!r || typeof r.n !== 'string' || !r.n.trim() || !Array.isArray(r.es) || have.has(norm(r.n))) return;
      const items = r.es.slice(0, 40).filter(e => e && typeof e.n === 'string' && e.n.trim() && numOr(e.g, 0) > 0)
        .map(e => ({ n: e.n.slice(0, 90), g: numOr(e.g, 0), k: numOr(e.k, 0), p: numOr(e.p, 0), c: numOr(e.c, 0), f: numOr(e.f, 0), fi: numOr(e.fi, 0), gr: /^[A-E]$/.test(e.gr || '') ? e.gr : null }));
      if (items.length) out.push({ id: 'p:' + fr.uid + ':' + i, name: r.n.slice(0, 40), items, owner: String((c && c.name) || 'partner').slice(0, 20) });
    });
  });
  return out;
}
const findRecipe = id => (S.recipes || {})[id] || partnerRecipes().find(r => r.id === id);
function recipeRow(r) {
  return `<button class="food" style="width:100%" data-a="pickRecipe" data-id="${esc(r.id)}"><div class="grow"><div class="n">⭐ ${esc(r.name)}</div><div class="muted small cpnames">${r.owner ? 'from ' + esc(r.owner) + ' · ' : ''}${esc(r.items.map(e => e.n).join(', '))}</div></div><div class="k">${Math.round(itemsKcal(r.items))} kcal</div></button>`;
}
function sheetSaveRecipe(meal) {
  const label = MEALS.find(m => m[0] === meal)[1];
  openSheet(`${shHead('Save as a meal')}<div class="sh-body">
  <p class="muted small" style="margin-bottom:12px">Saves everything in this ${label.toLowerCase()} under one name. Next time you find it at the top of the food list and add it in one go.</p>
  <label class="f"><span>Name</span><input class="inp" id="rc-name" maxlength="40" placeholder="e.g. My oatmeal"></label>
  <button class="btn" data-a="saveRecipeGo" data-meal="${meal}">Save</button></div>`, true);
}

/* ---------- weekly summary ---------- */
function weekStats(mon) {
  const t = today(), days = [];
  let n = 0, kcal = 0, prot = 0, ok = 0, all = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(mon, i), has = d <= t && hasLog(d), x = has ? totals(d) : null;
    days.push({ d, k: x ? x.kcal : 0, has, future: d > t });
    if (has) { n++; kcal += x.kcal; prot += x.p; if (x.kcal <= S.goal.kcal) ok++; all = all.concat(dayLog(d)); }
  }
  return { days, n, kcal: n ? kcal / n : 0, prot: n ? prot / n : 0, ok, grade: mixGrade(all) };
}
function weekCard() {
  const t = today(), mon = addDays(t, -((parseD(t).getDay() + 6) % 7));
  let w = weekStats(mon), title = 'This week';
  const last = weekStats(addDays(mon, -7));
  if (!w.n) { if (!last.n) return ''; w = last; title = 'Last week'; }
  const g = S.goal.kcal || 1, top = Math.max(g * 1.15, ...w.days.map(d => d.k));
  const bars = w.days.map(d => {
    const over = d.k - g, col = over <= 0 ? 'green' : over <= 100 ? 'orange' : 'red';
    return `<div class="wkcol ${d.d === t ? 'now' : ''}"><div class="wkbar">${d.has ? `<i style="height:${Math.max(4, d.k / top * 100)}%;background:var(--${col})"></i>` : ''}</div><span>${'MTWTFSS'[w.days.indexOf(d)]}</span></div>`;
  }).join('');
  const diff = title === 'This week' && last.n ? Math.round(w.kcal - last.kcal) : null;
  return `<div class="card week"><div class="row"><b class="grow">${title}</b>${badge(w.grade)}</div>
  <div class="wkchart"><div class="wkgoal" style="bottom:${g / top * 100}%"></div>${bars}</div>
  <div class="wkfacts"><div><b>${Math.round(w.kcal)}</b><span>kcal a day on average</span></div><div><b>${w.ok} of ${w.n}</b><span>${w.n === 1 ? 'day' : 'days'} at or under goal</span></div><div><b>${Math.round(w.prot)} g</b><span>protein a day</span></div></div>
  ${diff === null ? '' : `<p class="muted small" style="margin-top:10px">${diff === 0 ? 'The same as' : Math.abs(diff) + ' kcal a day ' + (diff < 0 ? 'less than' : 'more than')} last week.</p>`}</div>`;
}

/* ---------- automatic cloud backup ---------- */
// One document per phone in Firebase, named by a long recovery code. Whoever has the code can restore it.
let cloudT = null, cloudBusy = false, lastCloud = null;
const fmtKey = k => String(k || '').replace(/(.{4})(?=.)/g, '$1-');
const b64 = bytes => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
async function pack(str) {
  if (typeof CompressionStream === 'undefined') return { z: 0, d: str };
  const buf = await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
  return { z: 1, d: b64(new Uint8Array(buf)) };
}
async function unpack(z, d) {
  if (!z) return d;
  if (typeof DecompressionStream === 'undefined') throw new Error('old-browser');
  const bytes = Uint8Array.from(atob(d), c => c.charCodeAt(0));
  return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}
function cloudError(e) {
  if (!navigator.onLine) return 'No internet connection right now.';
  if (e && e.status === 403) return 'Firebase refused the backup. The database rule for backups is not published yet.';
  if (e && e.message === 'too-big') return 'The backup has grown too big to save automatically. Use the backup file below.';
  return 'Could not reach the backup right now. It will try again.';
}
async function cloudUp() {
  if (!S.cloud.on || !S.cloud.key || cloudBusy) return;
  const text = JSON.stringify(Object.assign({}, S, { aiKey: '', cloud: Object.assign({}, S.cloud, { last: 0, err: '' }) }));
  if (text === lastCloud) return;
  cloudBusy = true;
  try {
    const p = await pack(text);
    if (p.d.length > 950000) throw new Error('too-big');
    await fbToken();
    await fsCall('PATCH', `/backups/${S.cloud.key}`, { fields: { uid: { stringValue: S.share.uid }, z: { integerValue: String(p.z) }, d: { stringValue: p.d }, t: { integerValue: String(Date.now()) } } });
    lastCloud = text; S.cloud.last = Date.now(); S.cloud.err = '';
  } catch (e) { S.cloud.err = cloudError(e); }
  cloudBusy = false; persist();
  if (tab === 'me' && $('#sheet').hidden && document.activeElement && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { const y = window.scrollY; render(); window.scrollTo(0, y); }
}
function queueCloud() {
  if (!S.cloud || !S.cloud.on) return;
  clearTimeout(cloudT); cloudT = setTimeout(cloudUp, 6000);
}
function cloudCard() {
  const c = S.cloud;
  const restore = `<label class="f" style="margin-top:14px"><span>${S.onboarded ? 'Restore from a recovery code' : 'Recovery code'}</span><input class="inp" id="cl-code" autocapitalize="characters" autocomplete="off" autocorrect="off" placeholder="XXXX-XXXX-XXXX-XXXX"></label><button class="btn ghost sm" data-a="cloudRestore">Restore</button>`;
  if (!S.onboarded) return `<div class="card"><b>Used Spuddy before?</b><p class="muted small" style="margin:6px 0 0">Type the recovery code from your old phone to get everything back.</p>${restore}</div>`;
  if (!c.on) return `<div class="card"><b>☁️ Automatic backup</b><p class="muted small" style="margin:6px 0 12px">Saves a copy of everything (foods, every logged day, your potato and garden) online after each change, so nothing is lost if the phone breaks or the app is removed. You get a recovery code to bring it all back.</p>
    <button class="btn sm" data-a="cloudOn">Turn on automatic backup</button>${restore}</div>`;
  return `<div class="card"><b>☁️ Automatic backup is on</b>
    <p class="small" style="margin:6px 0 4px">${c.err ? `<span style="color:var(--red)">${esc(c.err)}</span>` : c.last ? 'Last saved ' + agoText(c.last) + '.' : 'Saving the first copy…'}</p>
    <div class="mycode" style="font-size:19px">${esc(fmtKey(c.key))}</div>
    <p class="muted small center" style="margin-bottom:12px">Your recovery code. Keep it somewhere outside this phone, for example send it to yourself or your partner. Anyone with this code can restore your data.</p>
    <div class="btns"><button class="btn ghost sm" data-a="cloudCopy">Copy</button><button class="btn ghost sm" data-a="cloudSend">Send</button></div>
    <button class="btn danger sm" style="margin-top:10px" data-a="cloudOff">Turn off</button></div>`;
}

const MORE_ACTIONS = {
  repeatMeal(el) {
    const meal = el.dataset.meal, pm = prevMeal(meal, day); if (!pm) return;
    openCopy({ title: MEALS.find(m => m[0] === meal)[1] + ' from ' + niceDate(pm.d).toLowerCase(), items: pm.es.map(entryItem), dest: meal, day });
  },
  saveRecipe(el) { sheetSaveRecipe(el.dataset.meal); },
  saveRecipeGo(el) {
    const name = $('#rc-name').value.trim(), items = dayLog(day).filter(e => e.meal === el.dataset.meal).map(entryItem);
    if (!name) return toast('Give it a name');
    if (!items.length) return;
    const old = myRecipes().find(r => norm(r.name) === norm(name));
    if (old && !confirm(`Replace the saved meal “${old.name}”?`)) return;
    const id = old ? old.id : 'r:' + uid();
    S.recipes[id] = { id, name, items }; save();
    A.closeSheet(); toast('Saved to your meals ⭐');
  },
  pickRecipe(el) {
    const r = findRecipe(el.dataset.id); if (!r) return;
    openCopy({ title: r.name, items: r.items.map(e => Object.assign({}, e)), dest: addMeal, day, recipe: S.recipes[r.id] ? r.id : null });
  },
  async cloudOn() {
    if (cloudBusy) return;
    toast('Connecting…');
    try {
      await fbToken();
      if (!S.cloud.key) { const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; S.cloud.key = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => abc[b % abc.length]).join(''); }
      S.cloud.on = true; persist(); render();
      await cloudUp();
      if (!S.cloud.err) toast('Automatic backup is on ✓'); render();
    } catch (e) { toast(cloudError(e)); }
  },
  cloudOff() {
    if (!confirm('Turn off automatic backup? The copy saved so far stays online, but new changes will no longer be saved.')) return;
    S.cloud.on = false; persist(); render();
  },
  async cloudCopy() { try { await navigator.clipboard.writeText(fmtKey(S.cloud.key)); toast('Recovery code copied ✓'); } catch (e) { toast('Could not copy. Write it down by hand.'); } },
  async cloudSend() {
    const text = 'My Spuddy recovery code: ' + fmtKey(S.cloud.key);
    try { if (navigator.share) return await navigator.share({ text }); } catch (e) { return; }
    MORE_ACTIONS.cloudCopy();
  },
  async cloudRestore() {
    const key = ($('#cl-code').value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (key.length !== 16) return toast('A recovery code has 16 letters and numbers');
    toast('Looking for your backup…');
    try {
      const res = await fsCall('POST', ':batchGet', { documents: [`${FS_ROOT}/backups/${key}`] });
      const doc = Array.isArray(res) && res[0] && res[0].found;
      if (!doc) return toast('No backup found for that code. Check it again.');
      const d = JSON.parse(await unpack(Number(doc.fields.z.integerValue), doc.fields.d.stringValue));
      if (!d || typeof d.log !== 'object' || typeof d.goal !== 'object') throw new Error('bad');
      if (!confirm(`Restore the backup saved ${agoText(Number(doc.fields.t.integerValue))}? It replaces everything on this phone.`)) return;
      d.aiKey = S.aiKey || '';
      localStorage.setItem(KEY, JSON.stringify(d)); S = load(); normalize(); applyTheme();
      idTok = null; lastCloud = null; tab = 'today'; day = today(); render(); toast('Everything is back ✓');
      settleRewards(); render(); queueSync(); fetchFriends();
    } catch (e) { toast(e && e.message === 'old-browser' ? 'This phone is too old to read the backup.' : e && e.status === 403 ? cloudError(e) : 'Could not restore. Check the code and your connection.'); }
  },
};
