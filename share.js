'use strict';
/* Sharing progress with a partner.
   Uses Firebase with plain web requests: an anonymous sign-in per phone, one "profile" document per phone
   holding a small daily summary, and a short code that points to it. Only summaries leave the phone,
   never the list of foods. This file is loaded before app.js and uses its helpers when called. */
const FB = { key: 'AIzaSyD6yh9yVqPmJwmvjNqoFScYtJFB5hZY84c', project: 'spuddy-9f790' };
const FS_ROOT = `projects/${FB.project}/databases/(default)/documents`;
const FS_URL = 'https://firestore.googleapis.com/v1/' + FS_ROOT;
let idTok = null, idExp = 0, syncT = null, shareBusy = false, shareErr = '';

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
  return { v: 1, name: S.share.name, streak: streakInfo().n, eq: S.equipped, garden: S.garden, goal: S.goal, days, at: Date.now() };
}
async function syncUp() {
  if (!S.share.on || !S.share.uid) return;
  try {
    await fsCall('PATCH', `/profiles/${S.share.uid}`, { fields: { j: { stringValue: JSON.stringify(mySummary()) }, t: { integerValue: String(Date.now()) } } });
    S.share.lastUp = Date.now(); persist();
  } catch (e) { /* offline or similar: the next change tries again */ }
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

/* ---------- screen ---------- */
function agoText(ms) {
  const m = Math.round((Date.now() - ms) / 60000);
  if (!(m >= 0)) return '';
  if (m < 2) return 'just now';
  if (m < 60) return m + ' min ago';
  if (m < 60 * 36) return Math.round(m / 60) + ' h ago';
  return Math.round(m / 1440) + ' days ago';
}
function friendCard(f) {
  const c = S.share.cache[f.uid];
  const del = `<button class="x" data-a="delFriend" data-uid="${esc(f.uid)}" aria-label="Remove">✕</button>`;
  if (!c) return `<div class="card"><div class="row"><b class="grow">Code ${esc(fmtCode(f.code))}</b>${del}</div><p class="muted small" style="margin-top:6px">Nothing shared yet. Ask them to open Spuddy and turn sharing on.</p></div>`;
  const n = v => Math.round(Number(v) || 0), g = x => /^[A-E]$/.test(x || '') ? x : null;
  const goal = c.goal || {}, t = today(), days = Array.isArray(c.days) ? c.days : [], td = days.find(d => d.d === t);
  const eq = {}; ['hat', 'glasses', 'neck', 'outfit', 'hand', 'bg', 'costume', 'pet', 'fence', 'ground'].forEach(k => { const i = ITEM_MAP[c.eq && c.eq[k]]; if (i && i.cat === k) eq[k] = i.id; });
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
  <div class="fgarden">${gardenSVG(eq, garden, td ? 'happy' : 'sleepy')}</div>
  ${td ? `<div class="row" style="margin-top:12px"><b class="grow">Today: ${n(td.k)} / ${n(goal.kcal)} kcal</b>${badge(g(td.g))}</div>
    <div class="bar" style="margin:8px 0"><i style="width:${pct}%;background:var(--${{ g: 'green', o: 'orange', r: 'red' }[col(td.k)]})"></i></div>
    <div class="muted small">Protein ${n(td.p)}/${n(goal.p)} · Carbs ${n(td.c)}/${n(goal.c)} · Fat ${n(td.f)}/${n(goal.f)} · Fiber ${n(td.fi)}/${n(goal.fi)} g</div>`
      : `<p class="muted" style="margin-top:12px">Nothing logged yet today.</p>`}
  <div class="wk7">${week}</div></div>`;
}
function viewFriends() {
  const sh = S.share;
  const err = shareErr ? `<div class="note" style="background:#FDE5E2;color:#B83D31">${esc(shareErr)}</div>` : '';
  if (!sh.on) return `<div class="head"><h1 class="grow">Together</h1></div>${err}
  <div class="card stage">${potatoSVG(S.equipped, 'happy', 130)}<div class="bubble">See each other's progress! Turn sharing on, swap codes, and you each get the other's day on this page.</div></div>
  <div class="card"><b>What your partner will see</b><p class="muted small" style="margin:6px 0 10px">Your daily calories and macros against your goal, the food-quality dot, your streak, and your potato with its garden — for the last 7 days.</p>
    <b>What stays on your phone</b><p class="muted small" style="margin:6px 0 14px">The foods you eat, your weight, height and age.</p>
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
