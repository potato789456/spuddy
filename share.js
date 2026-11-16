'use strict';
/* Sharing progress with a partner.
   Uses Firebase with plain web requests: an anonymous sign-in per phone, one "profile" document per phone
   holding a small daily summary, and a short code that points to it. Only summaries leave the phone,
   never the list of foods. This file is loaded before app.js and uses its helpers when called. */
const FB = { key: 'AIzaSyD6yh9yVqPmJwmvjNqoFScYtJFB5hZY84c', project: 'spuddy-9f790' };
const FS_ROOT = `projects/${FB.project}/databases/(default)/documents`;
const FS_URL = 'https://firestore.googleapis.com/v1/' + FS_ROOT;
let idTok = null, idExp = 0, syncT = null, shareBusy = false, shareErr = '', lastFoodsSent = null;

const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
const fmtCode = c => String(c || '').replace(/^(.{4})(.+)$/, '$1-$2');

async function callJson(url, opts) {
  const r = await fetch(url, opts);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error((j.error && (j.error.message || j.error.status)) || String(r.status)), { status: r.status });
  return j;
}
// A short-lived sign-in token for this phone. The first call creates the anonymous account.
async function fbToken() {
  if (idTok && Date.now() < idExp) return idTok;
  let j;
  if (S.share.refresh) {
    j = await callJson(`https://securetoken.googleapis.com/v1/token?key=${FB.key}`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(S.share.refresh) });
    idTok = j.id_token; S.share.refresh = j.refresh_token; S.share.uid = j.user_id; idExp = Date.now() + (Number(j.expires_in) - 60) * 1000;
  } else {
    j = await callJson(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FB.key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true }) });
    idTok = j.idToken; S.share.refresh = j.refreshToken; S.share.uid = j.localId; idExp = Date.now() + (Number(j.expiresIn) - 60) * 1000;
  }
  persist();
  return idTok;
}
async function fsCall(method, path, body) {
  const tok = await fbToken();
  return callJson(FS_URL + path, { method, headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
}
function shareError(e) {
  const m = String(e && e.message || '');
  if (!navigator.onLine) return 'No internet connection right now.';
  if (/CONFIGURATION_NOT_FOUND|ADMIN_ONLY_OPERATION|OPERATION_NOT_ALLOWED/.test(m)) return 'Sharing is not switched on in Firebase yet (anonymous sign-in).';
  if (e && e.status === 403) return 'Firebase refused the request (the database rules are not set yet).';
  if (e && e.status === 404) return 'The Firebase database does not exist yet.';
  return 'Could not connect. Please try again.';
}

/* ---------- what is shared ---------- */
function mySummary() {
  const t = today(), days = [];
  for (let n = 0; n < 7; n++) {
    const d = addDays(t, -n);
    if (!hasLog(d)) continue;
    const x = totals(d);
    days.push({ d, k: Math.round(x.kcal), p: Math.round(x.p), c: Math.round(x.c), f: Math.round(x.f), fi: Math.round(x.fi), g: mixGrade(dayLog(d)) });
  }
  // Today's and yesterday's meals food by food (values per 100 g), so a partner can copy a meal.
  const meals = [];
  for (let n = 0; n < 2; n++) {
    const d = addDays(t, -n);
    if (!hasLog(d)) continue;
    meals.push({ d, es: dayLog(d).slice(0, 60).map(e => { const q = 100 / (e.grams || 100), r = v => Math.round((v || 0) * q * 10) / 10; return { m: e.meal, n: e.name, g: r1(e.grams), k: r(e.kcal), p: r(e.p), c: r(e.c), f: r(e.f), fi: r(e.fi), gr: entryGrade(e) || '' }; }) });
  }
  const sum = { v: 1, name: S.share.name, streak: streakInfo().n, eq: S.equipped, garden: S.garden, orn: S.advent.placed, goal: S.goal, days, meals, at: Date.now() };
  // The profile document has a size limit: drop yesterday's meals, then today's, rather than fail to send.
  while (sum.meals.length && JSON.stringify(sum).length > 18000) sum.meals.pop();
  return sum;
}
async function syncUp() {
  if (!S.share.on || !S.share.uid) return;
  try {
    await fsCall('PATCH', `/profiles/${S.share.uid}`, { fields: { j: { stringValue: JSON.stringify(mySummary()) }, t: { integerValue: String(Date.now()) } } });
    S.share.lastUp = Date.now(); persist();
  } catch (e) { /* offline or similar: the next change tries again */ }
  // The foods she saved herself, so a partner can use them too.
  try {
    const fj = JSON.stringify({ foods: Object.values(S.foods).map(f => ({ id: f.id, name: f.name, brand: f.brand || '', kcal: f.kcal, p: f.p, c: f.c, f: f.f, fi: f.fi || 0, su: f.su, sf: f.sf, sa: f.sa, grade: f.grade || '', sg: f.serving ? f.serving.g : 0, barcode: f.barcode || '' })),
      recipes: Object.values(S.recipes || {}).slice(0, 30).map(r => ({ n: r.name, es: r.items.slice(0, 40).map(e => ({ n: e.n, g: e.g, k: e.k, p: e.p, c: e.c, f: e.f, fi: e.fi, gr: e.gr || '' })) })) });
    if (fj !== lastFoodsSent) {
      await fsCall('PATCH', `/foods/${S.share.uid}`, { fields: { j: { stringValue: fj }, t: { integerValue: String(Date.now()) } } });
      lastFoodsSent = fj;
    }
  } catch (e) { }
}
// Called after every save: upload a fresh summary a moment later.
function queueSync() {
  if (!S.share || !S.share.on) return;
  clearTimeout(syncT); syncT = setTimeout(syncUp, 2500);
}
async function fetchFriends() {
  const fr = S.share.friends;
  if (!S.share.on || !fr.length) return;
  try {
    const res = await fsCall('POST', ':batchGet', { documents: fr.map(f => `${FS_ROOT}/profiles/${f.uid}`) });
    (Array.isArray(res) ? res : []).forEach(r => {
      if (!r.found) return;
      try { S.share.cache[r.found.name.split('/').pop()] = JSON.parse(r.found.fields.j.stringValue); } catch (e) { }
    });
    shareErr = ''; persist();
  } catch (e) { shareErr = shareError(e); }
  try {
    const res = await fsCall('POST', ':batchGet', { documents: fr.map(f => `${FS_ROOT}/foods/${f.uid}`) });
    (Array.isArray(res) ? res : []).forEach(r => {
      if (!r.found) return;
      try {
        const got = JSON.parse(r.found.fields.j.stringValue), id = r.found.name.split('/').pop(), list = Array.isArray(got) ? got : got && got.foods;
        if (Array.isArray(list)) S.share.ffoods[id] = list.slice(0, 2000);
        S.share.frecipes[id] = got && Array.isArray(got.recipes) ? got.recipes.slice(0, 30) : [];
      } catch (e) { }
    });
    persist();
  } catch (e) { }
  if (tab === 'friends') { const y = window.scrollY; render(); window.scrollTo(0, y); }
}
async function makeCode() {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let tries = 0; tries < 5; tries++) {
    const code = Array.from(crypto.getRandomValues(new Uint8Array(8)), b => abc[b % abc.length]).join('');
    try {
      await fsCall('PATCH', `/codes/${code}?currentDocument.exists=false`, { fields: { uid: { stringValue: S.share.uid } } });
      return code;
    } catch (e) { if (e.status !== 409 && e.status !== 400) throw e; }
  }
  throw new Error('no free code');
}

/* ---------- partner's saved foods ---------- */
const numOr = (v, d) => { const n = Number(v); return isFinite(n) && n >= 0 ? n : d; };
// Foods my partners saved that I don't have yet, cleaned up and ready to pick.
function partnerFoods() {
  if (!S.share || !S.share.on) return [];
  const mine = Object.values(S.foods), key = f => norm((f.name || '') + '|' + (f.brand || ''));
  const have = new Set(mine.map(key)), haveSrc = new Set(mine.map(f => f.src).filter(Boolean)), haveBar = new Set(mine.map(f => f.barcode).filter(Boolean));
  const out = [];
  S.share.friends.forEach(fr => {
    const owner = (S.share.cache[fr.uid] && S.share.cache[fr.uid].name) || 'partner';
    (S.share.ffoods[fr.uid] || []).forEach(x => {
      if (!x || typeof x.name !== 'string' || !x.name.trim()) return;
      const id = 'p:' + fr.uid + ':' + String(x.id);
      const f = { id, shared: true, owner: String(owner).slice(0, 20), name: x.name.slice(0, 80), brand: String(x.brand || '').slice(0, 40), kcal: numOr(x.kcal, 0), p: numOr(x.p, 0), c: numOr(x.c, 0), f: numOr(x.f, 0), fi: numOr(x.fi, 0),
        su: x.su == null ? null : numOr(x.su, null), sf: x.sf == null ? null : numOr(x.sf, null), sa: x.sa == null ? null : numOr(x.sa, null), grade: /^[a-e]$/i.test(x.grade || '') ? x.grade : '',
        serving: numOr(x.sg, 0) > 0 ? { label: '1 portion', g: numOr(x.sg, 0) } : null, barcode: String(x.barcode || '').replace(/\D/g, '') };
      if (haveSrc.has(id) || have.has(key(f)) || (f.barcode && haveBar.has(f.barcode))) return;
      out.push(f);
    });
  });
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
// Using a partner's food copies it into my own foods.
function adoptFood(pf) {
  const f = Object.assign({}, pf, { id: 'c:' + uid(), custom: true, src: pf.id });
  delete f.shared; delete f.owner;
  S.foods[f.id] = f;
  return f;
}

/* ---------- screen ---------- */
function agoText(ms) {
  const m = Math.round((Date.now() - ms) / 60000);
  if (!(m >= 0)) return '';
  if (m < 2) return 'just now';
  if (m < 60) return m + ' min ago';
  if (m < 60 * 36) return Math.round(m / 60) + ' h ago';
  return Math.round(m / 1440) + ' days ago';
}
/* ---------- copy a partner's meal ---------- */
// Their shared meals, checked and cleaned up (this is data from another phone).
function friendMeals(c) {
  const out = [], t = today();
  (Array.isArray(c && c.meals) ? c.meals : []).slice(0, 2).forEach(day => {
    if (!day || (day.d !== t && day.d !== addDays(t, -1)) || !Array.isArray(day.es)) return;
    MEALS.forEach(([id, label]) => {
      const es = day.es.slice(0, 60).filter(e => e && e.m === id && typeof e.n === 'string' && e.n.trim() && numOr(e.g, 0) > 0)
        .map(e => ({ n: e.n.slice(0, 90), g: numOr(e.g, 0), k: numOr(e.k, 0), p: numOr(e.p, 0), c: numOr(e.c, 0), f: numOr(e.f, 0), fi: numOr(e.fi, 0), gr: /^[A-E]$/.test(e.gr || '') ? e.gr : null }));
      if (es.length) out.push({ d: day.d, meal: id, label, es, kcal: es.reduce((a, e) => a + e.k * e.g / 100, 0) });
    });
  });
  return out;
}
function copyRows(uid, c) {
  const fm = friendMeals(c);
  if (!fm.length) return '';
  return `<div class="listhead" style="margin-top:14px">Copy a meal</div>` + fm.map(m => `<button class="food" style="width:100%" data-a="copyMeal" data-uid="${esc(uid)}" data-d="${m.d}" data-meal="${m.meal}"><div class="grow"><div class="n">${m.label} <span class="muted small">· ${m.d === today() ? 'today' : 'yesterday'}</span></div><div class="muted small cpnames">${esc(m.es.map(e => e.n).join(', '))}</div></div><div class="k">${Math.round(m.kcal)} kcal</div></button>`).join('');
}
let cp = null;
function sheetCopy(uid, d, meal) {
  const c = S.share.cache[uid], m = friendMeals(c).find(x => x.d === d && x.meal === meal);
  if (!m) return;
  openCopy({ title: 'Copy ' + String(c.name || 'their').slice(0, 20) + (c.name ? '’s ' : ' ') + m.label.toLowerCase(), items: m.es, dest: meal, day: today() });
}
// One screen for every "add several foods at once": a partner's meal, my own earlier meal, a saved meal.
function openCopy(o) {
  cp = Object.assign({ dest: addMeal, day: today(), recipe: null }, o);
  cp.base = cp.items.map(e => e.g);
  openSheet(`${shHead(esc(cp.title))}<div class="sh-body">
  <p class="muted small" style="margin-bottom:8px">Change the grams to what you are having. Put 0 to leave a food out.</p>
  <div class="chips" style="margin-bottom:6px">${[[0.5, '½'], [1, '1×'], [1.5, '1½×'], [2, '2×']].map(v => `<button class="chip" data-a="copyMult" data-v="${v[0]}">${v[1]}</button>`).join('')}</div>
  ${cp.items.map((e, i) => `<div class="cprow"><div class="grow"><div class="n">${badge(e.gr)}${esc(e.n)}</div><div class="muted small" id="cp-k${i}"></div></div><input class="inp cp-g" data-i="${i}" inputmode="decimal" value="${e.g}" aria-label="Grams"><span class="muted">g</span></div>`).join('')}
  <div class="listhead" style="margin-top:14px">Add to my</div>
  <div class="seg" id="cp-dest" style="margin-bottom:14px">${MEALS.map(x => `<button data-a="copyDest" data-m="${x[0]}">${x[1]}</button>`).join('')}</div>
  <button class="btn" data-a="copyAdd" id="cp-add"></button>
  ${cp.recipe ? '<button class="btn danger" style="margin-top:10px" data-a="copyDel">Delete this saved meal</button>' : ''}</div>`);
  updCopy();
}
function copyGrams(i) { const el = document.querySelector(`.cp-g[data-i="${i}"]`), g = el ? num(el.value) : 0; return g > 0 ? g : 0; }
function updCopy() {
  if (!cp || !$('#cp-add')) return;
  let tot = 0;
  cp.items.forEach((e, i) => { const k = copyGrams(i) / 100; tot += e.k * k; $('#cp-k' + i).textContent = `${Math.round(e.k * k)} kcal · P ${r1(e.p * k)} · C ${r1(e.c * k)} · F ${r1(e.f * k)}`; });
  document.querySelectorAll('#cp-dest button').forEach(b => b.classList.toggle('on', b.dataset.m === cp.dest));
  $('#cp-add').textContent = `Add to ${cp.day === today() ? 'today' : niceDate(cp.day).toLowerCase()} · ${Math.round(tot)} kcal`;
}
document.addEventListener('input', ev => { if (ev.target.classList && ev.target.classList.contains('cp-g')) updCopy(); });
function copyAdd() {
  if (!cp) return;
  const d = cp.day, mine = Object.values(S.foods);
  let n = 0;
  cp.items.forEach((e, i) => {
    const g = copyGrams(i); if (!g) return;
    // Link it to the food it came from or one I already have with the same name; otherwise keep it as one of my foods.
    const key = norm(e.n), own = e.fid && (S.foods[e.fid] || BASE_MAP[e.fid]);
    let f = own || mine.find(x => norm(x.name + (x.brand ? ' (' + x.brand + ')' : '')) === key) || BASE.find(x => norm(x.name) === key);
    if (!f) { f = { id: 'c:' + uid(), custom: true, name: e.n, brand: '', kcal: e.k, p: e.p, c: e.c, f: e.f, fi: e.fi, su: null, sf: null, sa: null, grade: e.gr || '', serving: null, barcode: '' }; S.foods[f.id] = f; mine.push(f); }
    const k = g / 100;
    (S.log[d] || (S.log[d] = [])).push({ id: uid(), foodId: f.id, name: e.n, meal: cp.dest, grams: g, kcal: e.k * k, p: e.p * k, c: e.c * k, f: e.f * k, fi: e.fi * k, gr: e.gr || gradeOf(f) });
    const u = S.uses[f.id] || (S.uses[f.id] = { n: 0 }); u.n++; n++;
  });
  if (!n) return toast('Every food is set to 0 g');
  const label = MEALS.find(x => x[0] === cp.dest)[1].toLowerCase();
  cp = null; save(); closeSheet(); settleRewards(); render();
  if (backToMeal) sheetMeal(backToMeal);
  toast(`Added ${n} ${n === 1 ? 'food' : 'foods'} to your ${label} ✓`);
}

function friendCard(f) {
  const c = S.share.cache[f.uid];
  const del = `<button class="x" data-a="delFriend" data-uid="${esc(f.uid)}" aria-label="Remove">✕</button>`;
  if (!c) return `<div class="card"><div class="row"><b class="grow">Code ${esc(fmtCode(f.code))}</b>${del}</div><p class="muted small" style="margin-top:6px">Nothing shared yet. Ask them to open Spuddy and turn sharing on.</p></div>`;
  const n = v => Math.round(Number(v) || 0), g = x => /^[A-E]$/.test(x || '') ? x : null;
  const goal = c.goal || {}, t = today(), days = Array.isArray(c.days) ? c.days : [], td = days.find(d => d.d === t);
  const eq = {}; ['hat', 'hair', 'glasses', 'neck', 'outfit', 'shoes', 'hand', 'bg', 'costume', 'pet', 'fence', 'ground'].forEach(k => { const i = ITEM_MAP[c.eq && c.eq[k]]; if (i && i.cat === k) eq[k] = i.id; });
  eq.tint = {}; Object.entries((c.eq && c.eq.tint) || {}).forEach(([id, col]) => { if (TINTS[id] && /^#[0-9a-f]{6}$/i.test(col)) eq.tint[id] = col; });
  const garden = (Array.isArray(c.garden) ? c.garden : []).filter(id => ITEM_MAP[id]);
  const col = k => { const over = n(k) - n(goal.kcal); return over <= 0 ? 'g' : over <= 100 ? 'o' : 'r'; };
  let week = '';
  for (let i = 6; i >= 0; i--) {
    const d = addDays(t, -i), x = days.find(y => y.d === d);
    week += `<div class="${i === 0 ? 'now' : ''}"><span>${parseD(d).toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 2)}</span><em>${x ? `<i class="cbar ${col(x.k)}"></i>${badge(g(x.g))}` : ''}</em></div>`;
  }
  const pct = td && n(goal.kcal) ? Math.min(100, n(td.k) / n(goal.kcal) * 100) : 0;
  return `<div class="card friend"><div class="row"><h3 class="grow">${esc(c.name || 'Friend')}</h3><span class="pill">🔥 ${n(c.streak)}</span>${del}</div>
  <div class="muted small">Updated ${agoText(Number(c.at))}</div>
  <div class="fgarden">${gardenSVG(eq, garden, td ? 'happy' : 'sleepy', c.orn && typeof c.orn === 'object' ? c.orn : {})}</div>
  ${td ? `<div class="row" style="margin-top:12px"><b class="grow">Today: ${n(td.k)} / ${n(goal.kcal)} kcal</b>${badge(g(td.g))}</div>
    <div class="bar" style="margin:8px 0"><i style="width:${pct}%;background:var(--${{ g: 'green', o: 'orange', r: 'red' }[col(td.k)]})"></i></div>
    <div class="muted small">Protein ${n(td.p)}/${n(goal.p)} · Carbs ${n(td.c)}/${n(goal.c)} · Fat ${n(td.f)}/${n(goal.f)} · Fiber ${n(td.fi)}/${n(goal.fi)} g</div>`
      : `<p class="muted" style="margin-top:12px">Nothing logged yet today.</p>`}
  <div class="wk7">${week}</div>${copyRows(f.uid, c)}</div>`;
}
function viewFriends() {
  const sh = S.share;
  const err = shareErr ? `<div class="note" style="background:#FDE5E2;color:#B83D31">${esc(shareErr)}</div>` : '';
  if (!sh.on) return `<div class="head"><h1 class="grow">Together</h1></div>${err}
  <div class="card stage">${potatoSVG(S.equipped, 'happy', 130)}<div class="bubble">See each other's progress! Turn sharing on, swap codes, and you each get the other's day on this page.</div></div>
  <div class="card"><b>What your partner will see</b><p class="muted small" style="margin:6px 0 10px">Your daily calories and macros against your goal, the food-quality dot, your streak, and your potato with its garden — for the last 7 days. Also the foods and meals you saved yourself, and what you ate today and yesterday, so you can copy each other's meals.</p>
    <b>What stays on your phone</b><p class="muted small" style="margin:6px 0 14px">Older days food by food, your weight, height and age.</p>
    <label class="f"><span>Your name (shown to your partner)</span><input class="inp" id="sh-name" maxlength="20" value="${esc(sh.name || '')}"></label>
    <button class="btn" data-a="shareOn">${shareBusy ? 'Connecting…' : 'Turn on sharing'}</button></div>`;
  return `<div class="head"><h1 class="grow">Together</h1><button class="pill" data-a="refreshFriends">↻ Refresh</button></div>${err}
  ${sh.friends.length ? sh.friends.map(friendCard).join('') : `<div class="card center"><p>No partner added yet.</p><p class="muted small" style="margin-top:6px">Give them your code below and type theirs in.</p></div>`}
  <div class="card"><b>My code</b><div class="mycode">${esc(fmtCode(sh.code))}</div>
    <p class="muted small center" style="margin-bottom:12px">Whoever types this code into their Spuddy can see your progress.</p>
    <div class="btns"><button class="btn ghost sm" data-a="copyCode">Copy</button><button class="btn ghost sm" data-a="sendCode">Send</button></div></div>
  <div class="card"><b>Add a partner</b><div class="row" style="margin-top:10px"><input class="inp grow" id="fr-code" placeholder="Their code" autocapitalize="characters" autocomplete="off" autocorrect="off"><button class="btn sm" style="width:auto;padding:13px 18px" data-a="addFriend">Add</button></div></div>
  <div class="card"><div class="muted small" style="margin-bottom:10px">Sharing as <b>${esc(sh.name)}</b>${sh.lastUp ? ' · last sent ' + agoText(sh.lastUp) : ''}</div><button class="btn danger sm" data-a="shareOff">Stop sharing</button></div>`;
}
const rerenderFriends = () => { if (tab === 'friends') render(); };

const SHARE_ACTIONS = {
  copyMeal(el) { sheetCopy(el.dataset.uid, el.dataset.d, el.dataset.meal); },
  copyDest(el) { if (cp) { cp.dest = el.dataset.m; updCopy(); } },
  copyAdd() { copyAdd(); },
  copyMult(el) { if (!cp) return; document.querySelectorAll('.cp-g').forEach(inp => { inp.value = r1(cp.base[+inp.dataset.i] * +el.dataset.v); }); updCopy(); },
  copyDel() { if (!cp || !cp.recipe || !confirm('Delete this saved meal? Days you already logged stay as they are.')) return; delete S.recipes[cp.recipe]; cp = null; save(); sheetAdd(); },
  async shareOn() {
    const name = ($('#sh-name').value || '').trim();
    if (!name) return toast('Type your name first');
    if (shareBusy) return;
    S.share.name = name; shareBusy = true; shareErr = ''; rerenderFriends();
    try {
      await fbToken();
      if (!S.share.code) S.share.code = await makeCode();
      S.share.on = true; persist();
      await syncUp();
      toast('Sharing is on ✓');
    } catch (e) { shareErr = shareError(e); }
    shareBusy = false; rerenderFriends(); fetchFriends();
  },
  async shareOff() {
    if (!confirm('Stop sharing? Your partner will no longer see your progress. Your code stays the same if you turn it on again.')) return;
    try { await fsCall('DELETE', `/profiles/${S.share.uid}`); } catch (e) { }
    try { await fsCall('DELETE', `/foods/${S.share.uid}`); lastFoodsSent = null; } catch (e) { }
    S.share.on = false; persist(); render();
  },
  async copyCode() {
    try { await navigator.clipboard.writeText(fmtCode(S.share.code)); toast('Code copied ✓'); } catch (e) { toast('Could not copy — type it by hand: ' + fmtCode(S.share.code)); }
  },
  async sendCode() {
    const text = 'My Spuddy code: ' + fmtCode(S.share.code);
    try { if (navigator.share) return await navigator.share({ text }); } catch (e) { return; }
    SHARE_ACTIONS.copyCode();
  },
  async addFriend() {
    const code = ($('#fr-code').value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 8) return toast('A code has 8 letters and numbers');
    if (code === S.share.code) return toast("That's your own code 🙂");
    if (S.share.friends.some(f => f.code === code)) return toast('Already added');
    try {
      const res = await fsCall('POST', ':batchGet', { documents: [`${FS_ROOT}/codes/${code}`] });
      const doc = Array.isArray(res) && res[0] && res[0].found;
      if (!doc) return toast('No one has that code — check it again');
      S.share.friends.push({ uid: doc.fields.uid.stringValue, code }); persist();
      toast('Partner added ✓'); render(); fetchFriends();
    } catch (e) { toast(shareError(e)); }
  },
  delFriend(el) {
    if (!confirm('Remove this partner from your list?')) return;
    S.share.friends = S.share.friends.filter(f => f.uid !== el.dataset.uid); delete S.share.cache[el.dataset.uid];
    persist(); render();
  },
  async refreshFriends() { await syncUp(); await fetchFriends(); toast('Updated ✓'); },
};
