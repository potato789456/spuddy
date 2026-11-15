'use strict';
/* Spuddy — everything is stored on this device in localStorage. */
const KEY = 'spuddy.v1';
const MEALS = [['breakfast', 'Breakfast', '🍳'], ['lunch', 'Lunch', '🥗'], ['dinner', 'Dinner', '🍲'], ['snack', 'Snacks', '🍎']];
const MILESTONES = [3, 7, 14, 21, 30, 45, 60, 90, 120, 180, 270, 365];
const COIN = '🪙';

const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isFinite(n) ? n : NaN; };
const r1 = n => Math.round(n * 10) / 10;
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dstr = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => dstr(new Date());
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return dstr(d); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function load() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { }
  return Object.assign({
    profile: { sex: 'f', age: '', height: '', weight: '', activity: 1.375, pace: 0.5 },
    goal: { kcal: 1800, p: 110, c: 205, f: 60 },
    foods: {}, uses: {}, log: {}, coins: 0,
    owned: ['sprout', 'meadow'], equipped: { hat: 'sprout', bg: 'meadow' },
    rew: {}, ms: [], garden: [], onboarded: false,
  }, s);
}
let S = load();
if (!Array.isArray(S.garden)) S.garden = [];
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save — storage is full'); } };

let tab = S.onboarded ? 'today' : 'me';
let day = today();
let cur = null;        // amount sheet state
let addMeal = 'breakfast';
let shopTab = 'clothes';
const openMeals = new Set();
let scanner = null, scanBusy = false;

/* ---------- data helpers ---------- */
const getFood = id => S.foods[id] || BASE_MAP[id];
const dayLog = d => S.log[d] || [];
const hasLog = d => dayLog(d).length > 0;
function totals(d) {
  const t = { kcal: 0, p: 0, c: 0, f: 0 };
  dayLog(d).forEach(e => { t.kcal += e.kcal; t.p += e.p; t.c += e.c; t.f += e.f; });
  return t;
}
function streakInfo() {
  let d = today();
  if (!hasLog(d)) d = addDays(d, -1);
  let n = 0, start = null;
  while (hasLog(d)) { n++; start = d; d = addDays(d, -1); }
  return { n, start };
}
// Pick carbs (and nudge fat by a gram or two) so that 4P + 4C + 9F is exactly kcal.
function fitMacros(kcal, p, f) {
  for (const d of [0, 1, -1, 2, -2]) {
    const f2 = f + d, rest = kcal - 4 * p - 9 * f2;
    if (f2 >= 0 && rest >= 0 && rest % 4 === 0) return { kcal, p, c: rest / 4, f: f2 };
  }
  return { kcal, p, c: Math.max(0, (kcal - 4 * p - 9 * f) / 4), f };
}
const macroKcal = (p, c, f) => 4 * p + 4 * c + 9 * f;
function suggestGoal(p) {
  const w = num(p.weight), h = num(p.height), a = num(p.age);
  if (!(w > 0 && h > 0 && a > 0)) return null;
  const bmr = 10 * w + 6.25 * h - 5 * a + (p.sex === 'm' ? 5 : -161);
  const kcal = Math.max(1200, Math.round((bmr * num(p.activity) - num(p.pace) * 1100) / 10) * 10);
  return fitMacros(kcal, Math.round(w * 1.8), Math.round(kcal * 0.27 / 9));
}
const backupDue = () => S.lastBackup ? S.lastBackup <= addDays(today(), -7) : Object.keys(S.log).length >= 3;

/* ---------- rewards ---------- */
function settleRewards() {
  const t = today(), msgs = [];
  let gained = 0;
  Object.keys(S.log).forEach(d => {
    if (!hasLog(d)) return;
    const r = S.rew[d] || (S.rew[d] = {});
    if (!r.log) { r.log = 1; gained += 10; msgs.push(`Day logged  +10 ${COIN}`); }
    if (d < t && !r.goal) {
      const k = totals(d).kcal, g = S.goal.kcal;
      if (k >= g * 0.75 && k <= g * 1.05) { r.goal = 1; gained += 10; msgs.push(`On target ${d === addDays(t, -1) ? 'yesterday' : 'on ' + niceDate(d)}  +10 ${COIN}`); }
      else r.goal = -1;
    }
  });
  const st = streakInfo();
  MILESTONES.forEach(m => {
    const k = st.start + ':' + m;
    if (st.n >= m && !S.ms.includes(k)) { S.ms.push(k); gained += m * 5; msgs.push(`${m}-day streak!  +${m * 5} ${COIN}`); }
  });
  if (gained) { S.coins += gained; save(); toast(msgs.slice(0, 4).join('\n')); }
}

/* ---------- toast ---------- */
let toastT;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 2800);
}

/* ---------- views ---------- */
function niceDate(d) {
  const t = today();
  if (d === t) return 'Today';
  if (d === addDays(t, -1)) return 'Yesterday';
  return parseD(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
function render() {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  $('#tabs').hidden = !S.onboarded;
  $('#view').innerHTML = tab === 'today' ? viewToday() : tab === 'potato' ? viewPotato() : viewMe();
  updMacroSum();
}
function macroBar(label, val, goal) {
  const pct = goal ? Math.min(100, val / goal * 100) : 0;
  return `<div class="macro"><div class="lab"><b>${label}</b><span>${Math.round(val)}/${r1(goal)} g</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
}
function viewToday() {
  const t = totals(day), g = S.goal, left = Math.round(g.kcal - t.kcal), over = left < 0;
  const C = 2 * Math.PI * 56, pct = Math.min(1, t.kcal / (g.kcal || 1));
  const st = streakInfo();
  const mood = hasLog(today()) ? 'happy' : 'sleepy';
  const meals = MEALS.map(([id, name]) => {
    const es = dayLog(day).filter(e => e.meal === id);
    const m = { kcal: 0, p: 0, c: 0, f: 0 };
    es.forEach(e => { m.kcal += e.kcal; m.p += e.p; m.c += e.c; m.f += e.f; });
    const open = openMeals.has(id) && es.length;
    const list = !es.length ? '' : open
      ? `<div class="mealsum"><div><b>${Math.round(m.kcal)}</b><span>kcal</span></div><div><b>${r1(m.p)} g</b><span>protein</span></div><div><b>${r1(m.c)} g</b><span>carbs</span></div><div><b>${r1(m.f)} g</b><span>fat</span></div></div>
        ${es.map(e => `<button class="entry full" data-a="editEntry" data-id="${e.id}"><div class="grow"><div class="n">${esc(e.name)}</div><div class="d">${r1(e.grams)} g · P ${r1(e.p)} · C ${r1(e.c)} · F ${r1(e.f)}</div></div><div class="k">${Math.round(e.kcal)} kcal</div></button>`).join('')}`
      : `<div class="entries">${es.map(e => `<button class="entry" data-a="editEntry" data-id="${e.id}">${esc(e.name)} (${Math.round(e.kcal)} kcal)</button>`).join('')}</div>`;
    return `<div class="card meal ${open ? 'open' : ''}"><div class="row" data-a="toggleMeal" data-meal="${id}"><div class="grow"><h3>${name}${es.length ? ' <span class="chev">›</span>' : ''}</h3><div class="muted small">${Math.round(m.kcal)} kcal</div></div><button class="add" data-a="openAdd" data-meal="${id}" aria-label="Add food to ${name}">+</button></div>
    ${list}</div>`;
  }).join('');
  return `<div class="head"><button data-a="tab" data-tab="potato" aria-label="Open potato">${potatoSVG({ hat: S.equipped.hat, glasses: S.equipped.glasses }, mood, 46)}</button>
    <h1 class="grow">Spuddy</h1><span class="pill">🔥 ${st.n}</span><span class="pill">${COIN} ${S.coins}</span></div>
  <div class="card hero ${over ? 'over' : ''}"><div class="summary">
    <div class="ring"><svg width="132" height="132" viewBox="0 0 132 132"><circle class="track" cx="66" cy="66" r="56" fill="none" stroke-width="13"/><circle class="prog" cx="66" cy="66" r="56" fill="none" stroke-width="13" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
      <div class="mid"><b>${Math.abs(left)}</b><span>kcal ${over ? 'over' : 'left'}</span></div></div>
    <div class="sumside"><div class="line"><span>Eaten</span><b>${Math.round(t.kcal)}</b></div><div class="line"><span>Goal</span><b>${g.kcal}</b></div></div>
  </div><div class="macros">${macroBar('Protein', t.p, g.p)}${macroBar('Carbs', t.c, g.c)}${macroBar('Fat', t.f, g.f)}</div></div>
  <div class="daynav"><button data-a="day" data-d="-1" aria-label="Previous day">‹</button><b>${niceDate(day)}</b><button data-a="day" data-d="1" aria-label="Next day" ${day >= today() ? 'disabled' : ''}>›</button></div>
  ${backupDue() ? `<div class="card"><b>🥔 Time for a backup</b><p class="muted small" style="margin:6px 0 12px">${S.lastBackup ? 'Your last backup was on ' + niceDate(S.lastBackup) + '.' : "You haven't saved a backup yet."} It keeps your foods, your days and your potato safe.</p><button class="btn sm" data-a="exportData">Save backup  +5 ${COIN}</button></div>` : ''}
  ${meals}`;
}
function potatoSays() {
  const st = streakInfo().n;
  if (!hasLog(today())) return st ? `Zzz… feed me to keep our ${st}-day streak! 🔥` : 'Zzz… log something to wake me up!';
  if (st >= 30) return `${st} days! You are unstoppable 💪`;
  if (st >= 7) return `${st} days in a row. So proud of you! 🥹`;
  if (st >= 2) return `${st} days in a row — keep going! 🌱`;
  return 'Yay, we started! See you tomorrow? 🌱';
}
function shopItem(i) {
  const owned = S.owned.includes(i.id);
  const on = i.cat === 'garden' ? S.garden.includes(i.id) : S.equipped[i.cat] === i.id;
  const label = on ? (i.cat === 'garden' ? 'In garden ✓' : i.cat === 'bg' ? 'Using ✓' : 'Wearing ✓') : owned ? 'Owned' : COIN + ' ' + i.price;
  return `<button class="item ${on ? 'on' : ''} ${owned ? 'owned' : 'locked'}" data-a="item" data-id="${i.id}">${itemThumb(i, 78)}<div class="nm">${i.name}</div><div class="pr">${label}</div></button>`;
}
function viewPotato() {
  const st = streakInfo();
  const sect = (title, items) => `<div class="listhead">${title}</div><div class="shop">${items.map(shopItem).join('')}</div>`;
  const shop = shopTab === 'clothes'
    ? CATS.map(([cat, title]) => sect(title, ITEMS.filter(i => i.cat === cat))).join('')
    : GARDEN_SUBS.map(sub => sect(sub, ITEMS.filter(i => i.sub === sub))).join('') + sect('Scenery', ITEMS.filter(i => i.cat === 'bg'));
  return `<div class="head"><h1 class="grow">My garden</h1><span class="pill">🔥 ${st.n}</span><span class="pill">${COIN} ${S.coins}</span></div>
  <div class="gardenwrap">${gardenSVG(S.equipped, S.garden, hasLog(today()) ? 'happy' : 'sleepy')}<div class="bubble">${potatoSays()}</div></div>
  <div class="seg shoptabs"><button class="${shopTab === 'clothes' ? 'on' : ''}" data-a="shopTab" data-t="clothes">👕 Clothes</button><button class="${shopTab === 'garden' ? 'on' : ''}" data-a="shopTab" data-t="garden">🌻 Garden</button></div>
  ${shop}
  <div class="card" style="margin-top:18px"><div class="earn"><b>How to earn coins</b>
    <div><span>Log food on a day</span><b>+10 ${COIN}</b></div><div><span>Finish a day on target</span><b>+10 ${COIN}</b></div>
    <div><span>Streaks (3, 7, 14, 21, 30… days)</span><b>+5 ${COIN} per day</b></div><div><span>Weekly backup</span><b>+5 ${COIN}</b></div></div></div>`;
}
function viewMe() {
  const p = S.profile, g = S.goal;
  const opt = (v, cur, label) => `<option value="${v}" ${String(v) === String(cur) ? 'selected' : ''}>${label}</option>`;
  return `<div class="head"><h1 class="grow">${S.onboarded ? 'Me & my goal' : 'Welcome! 🥔'}</h1></div>
  ${S.onboarded ? '' : `<div class="card stage">${potatoSVG(S.equipped, 'happy', 150)}<div class="bubble">Hi! I'm your potato. Set your daily calories and macros below — or let me suggest them.</div></div>`}
  <div class="card"><b>My daily goal</b>
    <label class="f" style="margin-top:10px"><span>Calories (kcal)</span><input class="inp" id="g-kcal" inputmode="numeric" value="${g.kcal}"></label>
    <div class="grid2" style="grid-template-columns:1fr 1fr 1fr">
    <label class="f"><span>Protein (g)</span><input class="inp" id="g-p" inputmode="decimal" value="${g.p}"></label>
    <label class="f"><span>Carbs (g)</span><input class="inp" id="g-c" inputmode="decimal" value="${g.c}"></label>
    <label class="f"><span>Fat (g)</span><input class="inp" id="g-f" inputmode="decimal" value="${g.f}"></label></div>
    <div id="macrosum"></div>
    <button class="btn ghost sm" data-a="fitCarbs" style="margin-bottom:10px">Fill the rest with carbs</button>
    <button class="btn" data-a="saveMe">${S.onboarded ? 'Save' : "Let's go!"}</button></div>
  <div class="card"><b>Not sure? Let the potato suggest</b><p class="muted small" style="margin:6px 0 12px">Optional. It fills in the goal above and you can still change every number.</p><div class="grid2">
    <label class="f"><span>Sex</span><select class="inp" id="p-sex">${opt('f', p.sex, 'Female')}${opt('m', p.sex, 'Male')}</select></label>
    <label class="f"><span>Age</span><input class="inp" id="p-age" inputmode="numeric" value="${esc(p.age)}"></label>
    <label class="f"><span>Height (cm)</span><input class="inp" id="p-height" inputmode="decimal" value="${esc(p.height)}"></label>
    <label class="f"><span>Weight (kg)</span><input class="inp" id="p-weight" inputmode="decimal" value="${esc(p.weight)}"></label></div>
    <label class="f"><span>Activity</span><select class="inp" id="p-activity">${opt(1.2, p.activity, 'Mostly sitting')}${opt(1.375, p.activity, 'Light (1–3 workouts a week)')}${opt(1.55, p.activity, 'Moderate (3–5 workouts a week)')}${opt(1.725, p.activity, 'Very active (6–7 workouts a week)')}</select></label>
    <label class="f"><span>Pace</span><select class="inp" id="p-pace">${opt(0, p.pace, 'Maintain weight')}${opt(0.25, p.pace, 'Gentle: about −0.25 kg a week')}${opt(0.5, p.pace, 'Steady: about −0.5 kg a week')}</select></label>
    <button class="btn ghost sm" data-a="suggest">✨ Suggest my goal</button></div>
  ${S.onboarded ? `<div class="card"><b>Backup</b><p class="muted small" style="margin:6px 0 12px">Everything lives on this phone only. A backup file holds all your foods, every logged day and your potato with its clothes and garden. Save it to Files / iCloud Drive about once a week.</p>
    <p class="small" style="margin-bottom:12px"><b>Last backup:</b> ${S.lastBackup ? niceDate(S.lastBackup) : 'never'}</p>
    <div class="btns"><button class="btn ghost sm" data-a="exportData">Save backup</button><button class="btn ghost sm" data-a="importData">Restore</button></div>
    <input type="file" id="importFile" accept="application/json,.json" hidden></div>` : ''}`;
}
// Live check that protein, carbs and fat add up to the calorie goal.
function goalFields() {
  const v = id => { const n = num($(id).value); return n >= 0 ? n : 0; };
  return { kcal: Math.round(v('#g-kcal')), p: v('#g-p'), c: v('#g-c'), f: v('#g-f') };
}
function macrosOk(g) { return Math.abs(macroKcal(g.p, g.c, g.f) - g.kcal) < 0.5; }
function updMacroSum() {
  const el = $('#macrosum'); if (!el) return;
  const g = goalFields(), sum = macroKcal(g.p, g.c, g.f), d = Math.round((sum - g.kcal) * 10) / 10;
  const ok = macrosOk(g);
  el.className = 'macrosum ' + (ok ? 'ok' : 'bad');
  el.innerHTML = `<div class="small">Protein ${r1(g.p * 4)} + Carbs ${r1(g.c * 4)} + Fat ${r1(g.f * 9)} kcal</div><b>= ${r1(sum)} kcal ${ok ? '✓ matches your goal' : d > 0 ? `· ${d} kcal over your ${g.kcal}` : `· ${-d} kcal under your ${g.kcal}`}</b>`;
}
function setGoalFields(g) { $('#g-kcal').value = g.kcal; $('#g-p').value = g.p; $('#g-c').value = g.c; $('#g-f').value = g.f; updMacroSum(); }
// When the calories change, scale the macros to the new number so they still add up.
function rescaleMacros() {
  const g = goalFields(), old = macroKcal(g.p, g.c, g.f);
  if (!(g.kcal >= 800) || !(old > 0) || macrosOk(g)) return updMacroSum();
  const k = g.kcal / old;
  setGoalFields(fitMacros(g.kcal, Math.round(g.p * k), Math.round(g.f * k)));
  toast('Macros adjusted to ' + g.kcal + ' kcal');
}
function readProfile() {
  return { sex: $('#p-sex').value, age: $('#p-age').value.trim(), height: $('#p-height').value.trim(), weight: $('#p-weight').value.trim(), activity: num($('#p-activity').value), pace: num($('#p-pace').value) };
}

/* ---------- sheets ---------- */
function openSheet(html, auto) {
  const s = $('#sheet'); s.innerHTML = html; s.classList.toggle('auto', !!auto); s.hidden = false; $('#backdrop').hidden = false;
  // restart animation
  s.style.animation = 'none'; void s.offsetWidth; s.style.animation = '';
}
function closeSheet() {
  stopScanner();
  $('#sheet').hidden = true; $('#backdrop').hidden = true; $('#sheet').innerHTML = ''; cur = null;
}
const shHead = title => `<div class="sh-head"><h2>${title}</h2><button class="x" data-a="closeSheet" aria-label="Close">✕</button></div>`;

/* Add food: search list */
function sheetAdd() {
  const meal = MEALS.find(m => m[0] === addMeal);
  openSheet(`${shHead('Add to ' + meal[1])}
  <div style="padding:0 16px"><input class="inp" id="q" type="search" placeholder="Search food…" autocomplete="off" autocorrect="off">
  <div class="btns" style="margin-top:10px"><button class="btn ghost sm" data-a="scan">📷 Scan barcode</button><button class="btn ghost sm" data-a="newFood">＋ New food</button></div></div>
  <div class="sh-body" id="foodlist"></div>`);
  renderFoodList('');
}
function foodRow(f) {
  return `<div class="row" style="gap:6px"><button class="food grow" data-a="pick" data-id="${esc(f.id)}"><div class="grow"><div class="n">${esc(f.name)}</div><div class="muted small">${f.brand ? esc(f.brand) + ' · ' : ''}per 100 g</div></div><div class="k">${Math.round(f.kcal)} kcal</div></button>${f.custom ? `<button class="edit" style="margin-bottom:8px" data-a="editFood" data-id="${esc(f.id)}" aria-label="Edit food">✏️</button>` : ''}</div>`;
}
function myFoods() {
  const ids = new Set([...Object.keys(S.foods), ...Object.keys(S.uses)]);
  return [...ids].map(getFood).filter(Boolean).sort((a, b) => ((S.uses[b.id] || {}).n || 0) - ((S.uses[a.id] || {}).n || 0) || a.name.localeCompare(b.name));
}
function renderFoodList(q) {
  const toks = norm(q).split(/\s+/).filter(Boolean);
  const match = f => { const hay = norm(f.name + ' ' + (f.brand || '') + ' ' + (f.barcode || '')); return toks.every(t => hay.includes(t)); };
  const mine = myFoods().filter(match), mineIds = new Set(mine.map(f => f.id));
  const base = BASE.filter(f => !mineIds.has(f.id) && match(f));
  let html = '';
  if (mine.length) html += `<div class="listhead">My foods</div>` + mine.map(foodRow).join('');
  if (base.length) html += `<div class="listhead">${toks.length ? 'Basic foods' : 'All basic foods'}</div>` + base.map(foodRow).join('');
  if (!mine.length && !base.length) html = `<div class="card center" style="margin-top:16px"><p style="margin-bottom:12px">Nothing found for “${esc(q)}”.</p><button class="btn sm" data-a="newFood">＋ Add it as a new food</button></div>`;
  $('#foodlist').innerHTML = html;
}

/* Amount */
function sheetAmount(food, entry) {
  cur = { food, entry: entry || null, meal: entry ? entry.meal : addMeal, unit: 'g', amount: entry ? r1(entry.grams) : (food.serving ? 1 : 100) };
  if (!entry && food.serving) cur.unit = 's';
  const f = food;
  openSheet(`${shHead(esc(f.name))}
  <div class="sh-body"><p class="muted small">${f.brand ? esc(f.brand) + ' · ' : ''}${Math.round(f.kcal)} kcal · P ${r1(f.p)} · C ${r1(f.c)} · F ${r1(f.f)} per 100 g</p>
  <div class="bigkcal"><span id="a-kcal">0</span> <span style="font-size:18px" class="muted">kcal</span></div>
  <div class="tri"><div><b id="a-p">0</b><span class="muted small">protein</span></div><div><b id="a-c">0</b><span class="muted small">carbs</span></div><div><b id="a-f">0</b><span class="muted small">fat</span></div></div>
  <label class="f"><span>How much?</span><input class="inp" id="amount" inputmode="decimal" value="${cur.amount}"></label>
  ${f.serving ? `<div class="seg" style="margin-bottom:14px"><button data-a="unit" data-u="s">${esc(f.serving.label)} (${f.serving.g} g)</button><button data-a="unit" data-u="g">grams</button></div>` : ''}
  <div class="chips" id="quick" style="margin-bottom:16px"></div>
  <label class="f"><span>Meal</span><div class="chips" id="mealchips"></div></label>
  <button class="btn" data-a="saveEntry">${entry ? 'Save' : 'Add'}</button>
  ${entry ? '<button class="btn danger" style="margin-top:10px" data-a="delEntry">Remove</button>' : ''}</div>`, true);
  updAmount();
}
function curGrams() { const a = num($('#amount').value); if (!(a > 0)) return 0; return cur.unit === 's' ? a * cur.food.serving.g : a; }
function updAmount() {
  if (!cur) return;
  const g = curGrams(), f = cur.food, k = g / 100;
  $('#a-kcal').textContent = Math.round(f.kcal * k); $('#a-p').textContent = r1(f.p * k) + ' g'; $('#a-c').textContent = r1(f.c * k) + ' g'; $('#a-f').textContent = r1(f.f * k) + ' g';
  document.querySelectorAll('#sheet .seg button').forEach(b => b.classList.toggle('on', b.dataset.u === cur.unit));
  const quick = cur.unit === 's' ? [0.5, 1, 2, 3] : [50, 100, 150, 200, 250];
  $('#quick').innerHTML = quick.map(v => `<button class="chip" data-a="quick" data-v="${v}">${v}${cur.unit === 's' ? '×' : ' g'}</button>`).join('');
  $('#mealchips').innerHTML = MEALS.map(m => `<button class="chip ${cur.meal === m[0] ? 'on' : ''}" data-a="setMeal" data-meal="${m[0]}">${m[1]}</button>`).join('');
}

/* Food form (new / edit / from barcode) */
function sheetFood(f, note) {
  f = f || {};
  const v = x => (x === undefined || x === null || (typeof x === 'number' && isNaN(x))) ? '' : esc(x);
  openSheet(`${shHead(f.id ? 'Edit food' : 'New food')}
  <div class="sh-body">${note ? `<div class="note">${note}</div>` : ''}
  <input type="hidden" id="f-id" value="${v(f.id)}">
  <label class="f"><span>Name</span><input class="inp" id="f-name" value="${v(f.name)}" placeholder="e.g. Tvaroh jemný hrudkovitý"></label>
  <label class="f"><span>Brand (optional)</span><input class="inp" id="f-brand" value="${v(f.brand)}" placeholder="e.g. Rajo"></label>
  <p class="listhead" style="margin-top:4px">Per 100 g (from the label)</p>
  <div class="grid2"><label class="f"><span>Calories (kcal)</span><input class="inp" id="f-kcal" inputmode="decimal" value="${v(f.kcal)}"></label>
  <label class="f"><span>Protein (g)</span><input class="inp" id="f-p" inputmode="decimal" value="${v(f.p)}"></label>
  <label class="f"><span>Carbs (g)</span><input class="inp" id="f-c" inputmode="decimal" value="${v(f.c)}"></label>
  <label class="f"><span>Fat (g)</span><input class="inp" id="f-f" inputmode="decimal" value="${v(f.f)}"></label></div>
  <label class="f"><span>One portion / package in grams (optional)</span><input class="inp" id="f-serv" inputmode="decimal" value="${v(f.serving && f.serving.g)}" placeholder="e.g. 250"></label>
  <label class="f"><span>Barcode (optional)</span><input class="inp" id="f-barcode" inputmode="numeric" value="${v(f.barcode)}"></label>
  <button class="btn" data-a="saveFood">Save food</button>
  ${f.id ? '<button class="btn danger" style="margin-top:10px" data-a="delFood">Delete food</button>' : ''}</div>`);
}

/* Scanner */
function sheetScan() {
  scanBusy = false;
  openSheet(`${shHead('Scan barcode')}
  <div class="sh-body"><div id="reader"></div><p class="muted small center" id="scanhint" style="margin-bottom:14px">Point the camera at the barcode.</p>
  <div class="row"><input class="inp grow" id="code" inputmode="numeric" placeholder="…or type the number"><button class="btn sm" style="width:auto;padding:13px 18px" data-a="lookup">Find</button></div></div>`);
  startScanner();
}
async function startScanner() {
  const hint = t => { const h = $('#scanhint'); if (h) h.textContent = t; };
  if (!window.Html5Qrcode) { $('#reader').hidden = true; return hint('Camera scanner is not available right now — type the barcode number below.'); }
  try {
    const F = Html5QrcodeSupportedFormats;
    scanner = new Html5Qrcode('reader', { formatsToSupport: [F.EAN_13, F.EAN_8, F.UPC_A, F.UPC_E], experimentalFeatures: { useBarCodeDetectorIfSupported: true }, verbose: false });
    await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: (w, h) => ({ width: Math.max(60, Math.floor(w * 0.85)), height: Math.max(60, Math.floor(Math.min(h * 0.5, 170))) }) }, code => onCode(code), () => { });
  } catch (e) {
    scanner = null; const r = $('#reader'); if (r) r.hidden = true;
    hint('Could not open the camera. Allow camera access, or type the barcode number below.');
  }
}
async function stopScanner() {
  const s = scanner; scanner = null;
  if (s) { try { await s.stop(); } catch (e) { } try { s.clear(); } catch (e) { } }
}
async function onCode(code) {
  code = String(code).replace(/\D/g, '');
  if (!code || scanBusy) return;
  scanBusy = true;
  await stopScanner();
  const mine = Object.values(S.foods).find(f => f.barcode === code);
  if (mine) return sheetAmount(mine);
  const h = $('#scanhint'); if (h) h.textContent = 'Looking up ' + code + '…';
  let found = null;
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_sk,brands,nutriments,serving_quantity`);
    const j = await res.json();
    if (j && j.status === 1 && j.product) {
      const p = j.product, n = p.nutriments || {};
      const kcal = n['energy-kcal_100g'] != null ? num(n['energy-kcal_100g']) : (n['energy_100g'] != null ? num(n['energy_100g']) / 4.184 : NaN);
      const sq = num(p.serving_quantity);
      found = { name: p.product_name_sk || p.product_name || '', brand: (p.brands || '').split(',')[0].trim(), kcal: isNaN(kcal) ? '' : Math.round(kcal), p: r1(num(n.proteins_100g)), c: r1(num(n.carbohydrates_100g)), f: r1(num(n.fat_100g)), serving: sq > 0 ? { g: sq } : null, barcode: code };
    }
  } catch (e) { }
  if (found) sheetFood(found, '✅ Found it! Please check the numbers against the label, then save — next time it will be in your foods.');
  else sheetFood({ barcode: code }, "🥔 I don't know this one yet. Fill it in once from the label and I'll remember it forever.");
}

/* ---------- actions ---------- */
const A = {
  tab(el) { tab = el.dataset.tab; render(); window.scrollTo(0, 0); },
  day(el) { const d = addDays(day, +el.dataset.d); if (d <= today()) { day = d; render(); } },
  closeSheet,
  toggleMeal(el) { const m = el.dataset.meal; if (openMeals.has(m)) openMeals.delete(m); else openMeals.add(m); const y = window.scrollY; render(); window.scrollTo(0, y); },
  openAdd(el) { addMeal = el.dataset.meal; sheetAdd(); },
  pick(el) { const f = getFood(el.dataset.id); if (f) sheetAmount(f); },
  newFood() { const q = $('#q'); sheetFood(q && q.value.trim() ? { name: q.value.trim() } : null); },
  editFood(el) { sheetFood(S.foods[el.dataset.id]); },
  async scan() { sheetScan(); },
  lookup() { onCode($('#code').value); },
  unit(el) { cur.unit = el.dataset.u; $('#amount').value = cur.unit === 's' ? 1 : 100; updAmount(); },
  quick(el) { $('#amount').value = el.dataset.v; updAmount(); },
  setMeal(el) { cur.meal = el.dataset.meal; updAmount(); },
  editEntry(el) {
    const e = dayLog(day).find(x => x.id === el.dataset.id); if (!e) return;
    const k = 100 / (e.grams || 100);
    const f = getFood(e.foodId) || { id: e.foodId, name: e.name, kcal: e.kcal * k, p: e.p * k, c: e.c * k, f: e.f * k };
    sheetAmount(Object.assign({}, f, { name: e.name }), e);
  },
  saveEntry() {
    const g = curGrams(); if (!(g > 0)) return toast('Enter an amount first');
    const f = cur.food, k = g / 100;
    const data = { foodId: f.id, name: f.name + (f.brand ? ' (' + f.brand + ')' : ''), meal: cur.meal, grams: g, kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k };
    if (cur.entry) Object.assign(cur.entry, data, { name: cur.entry.name });
    else {
      (S.log[day] || (S.log[day] = [])).push(Object.assign({ id: uid() }, data));
      const u = S.uses[f.id] || (S.uses[f.id] = { n: 0 }); u.n++;
    }
    save(); closeSheet(); render(); settleRewards(); render();
  },
  delEntry() {
    S.log[day] = dayLog(day).filter(e => e !== cur.entry);
    if (!S.log[day].length) delete S.log[day];
    save(); closeSheet(); render();
  },
  saveFood() {
    const name = $('#f-name').value.trim(), kcal = num($('#f-kcal').value);
    if (!name) return toast('Give it a name');
    if (!(kcal >= 0)) return toast('Enter the calories per 100 g');
    const z = id => { const n = num($(id).value); return n >= 0 ? n : 0; };
    const sg = num($('#f-serv').value), id = $('#f-id').value || 'c:' + uid();
    const f = { id, custom: true, name, brand: $('#f-brand').value.trim(), kcal, p: z('#f-p'), c: z('#f-c'), f: z('#f-f'), serving: sg > 0 ? { label: '1 portion', g: sg } : null, barcode: $('#f-barcode').value.replace(/\D/g, '') };
    const isNew = !S.foods[id];
    S.foods[id] = f; save();
    if (isNew) { toast('Saved to My foods 🥔'); sheetAmount(f); } else sheetAdd();
  },
  delFood() {
    const id = $('#f-id').value;
    if (!confirm('Delete this food from My foods? Days you already logged stay as they are.')) return;
    delete S.foods[id]; delete S.uses[id]; save(); sheetAdd();
  },
  shopTab(el) { shopTab = el.dataset.t; const y = window.scrollY; render(); window.scrollTo(0, y); },
  item(el) {
    const i = ITEM_MAP[el.dataset.id];
    if (!S.owned.includes(i.id)) {
      if (S.coins < i.price) return toast(`You need ${i.price - S.coins} more ${COIN} for the ${i.name}`);
      if (!confirm(`Buy ${i.name} for ${i.price} coins?`)) return;
      S.coins -= i.price; S.owned.push(i.id); toast(`${i.name} is yours! ✨`);
      if (i.cat === 'garden') S.garden.push(i.id); else S.equipped[i.cat] = i.id;
    } else if (i.cat === 'garden') {
      S.garden = S.garden.includes(i.id) ? S.garden.filter(x => x !== i.id) : S.garden.concat(i.id);
    } else if (S.equipped[i.cat] === i.id) { if (i.cat !== 'bg') delete S.equipped[i.cat]; }
    else S.equipped[i.cat] = i.id;
    save(); const y = window.scrollY; render(); window.scrollTo(0, y);
  },
  suggest() {
    const g = suggestGoal(readProfile());
    if (!g) return toast('Fill in age, height and weight first');
    setGoalFields(g); window.scrollTo(0, 0);
    toast(`Suggested: ${g.kcal} kcal a day`);
  },
  fitCarbs() {
    const g = goalFields(), rest = g.kcal - 4 * g.p - 9 * g.f;
    if (rest < 0) return toast(`Protein and fat alone are already ${r1(-rest)} kcal over ${g.kcal} — lower one of them`);
    g.c = Math.round(rest / 4 * 100) / 100; setGoalFields(g);
  },
  saveMe() {
    const g = goalFields();
    if (!(g.kcal >= 800)) return toast('Enter your daily calories first');
    if (!macrosOk(g)) return toast(`Macros must add up to exactly ${g.kcal} kcal — change them or tap “Fill the rest with carbs”`);
    S.profile = readProfile(); S.goal = g;
    const first = !S.onboarded; S.onboarded = true; save();
    if (first) tab = 'today'; else toast('Saved ✓');
    render();
  },
  async exportData() {
    const due = backupDue() || !S.lastBackup, prev = S.lastBackup;
    S.lastBackup = today();
    const name = `spuddy-backup-${today()}.json`, text = JSON.stringify(S);
    const done = () => { if (due) S.coins += 5; save(); render(); toast(due ? `Backup saved  +5 ${COIN}` : 'Backup saved ✓'); };
    try {
      const file = new File([text], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return done(); }
    } catch (e) { if (e && e.name === 'AbortError') { S.lastBackup = prev; return; } }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' })); a.download = name; a.click();
    done();
  },
  importData() { $('#importFile').click(); },
};

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]'); if (!el) return;
  const fn = A[el.dataset.a]; if (fn) fn(el, ev);
});
document.addEventListener('input', ev => {
  if (ev.target.id === 'q') renderFoodList(ev.target.value);
  else if (ev.target.id === 'amount') updAmount();
  else if (/^g-/.test(ev.target.id)) updMacroSum();
});
document.addEventListener('change', ev => {
  if (ev.target.id === 'g-kcal') return rescaleMacros();
  if (ev.target.id !== 'importFile' || !ev.target.files[0]) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const d = JSON.parse(fr.result);
      if (!d || typeof d.log !== 'object' || typeof d.goal !== 'object') throw 0;
      if (!confirm('Replace everything on this phone with the backup?')) return;
      localStorage.setItem(KEY, JSON.stringify(d)); S = load(); if (!Array.isArray(S.garden)) S.garden = []; render(); toast('Backup restored ✓');
    } catch (e) { toast("That file doesn't look like a Spuddy backup"); }
  };
  fr.readAsText(ev.target.files[0]);
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.onboarded && $('#sheet').hidden) { settleRewards(); render(); }
});

render();
if (S.onboarded) { settleRewards(); render(); }
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => { });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });
