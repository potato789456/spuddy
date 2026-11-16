/* AI helper: describe a food in words, get calories and macros, log it.
   Talks to Google's free Gemini API straight from the phone, with a key that is stored on this phone only. */
'use strict';

const AI_NUMS = ['grams', 'kcal_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g', 'fiber_per_100g', 'sugars_per_100g', 'saturated_fat_per_100g', 'salt_per_100g'];
const AI_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['items', 'note'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['name'].concat(AI_NUMS),
        properties: Object.assign({ name: { type: 'string' } }, Object.fromEntries(AI_NUMS.map(k => [k, { type: 'number' }]))),
      },
    },
    note: { type: 'string' },
  },
};
const AI_SYSTEM = `You are the nutrition helper inside a calorie-tracking app. The user describes something they ate, in any language.

Split the description into separate foods. For each food give:
- name: a short English name that includes how it was prepared, for example "Beef shoulder, cooked". Keep brand names and names of local dishes in their original language.
- grams: the weight that was eaten. If the user gave no amount, assume one typical portion.
- the nutrition values per 100 g of the food as eaten (cooked weight if they said cooked), taken from standard food composition tables. Calories should agree with the macros (4 kcal per gram of protein and carbs, 9 per gram of fat).

In "note", write one short sentence in English naming any assumption you made, such as the portion size or the cooking method. Leave it empty if you assumed nothing.
If the message is not about food or drink, return an empty items list and say so in "note".

The user may send a photo, with or without text.
- A nutrition label or the back of a pack: copy the per-100 g values exactly as printed and use the product name from the pack in its original language. For grams, use the amount the user says they ate; if they say nothing, use one portion if the label states one, otherwise 100.
- A plate or a meal: name each food you can see and estimate its weight from the picture, using the plate and cutlery for scale. Say in "note" that the amounts are estimated from the photo.
- If the user also describes the photo in words, trust the description for what the foods are and how they were prepared, including things the photo cannot show such as butter, oil or sauce. Use the photo mainly to judge the amounts.`;

let aiImg = null;   // photo to send along, as base64 JPEG
// Shrinks a photo so it uploads quickly; 1280 px is plenty to read a label.
function aiShrink(file) {
  return new Promise((ok, fail) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, 1280 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url); ok(cv.toDataURL('image/jpeg', 0.82).split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); fail(new Error('photo')); };
    img.src = url;
  });
}
function aiPhotoBox() {
  const box = $('#ai-photobox'); if (!box) return;
  box.innerHTML = aiImg ? `<div class="aiphoto"><img src="data:image/jpeg;base64,${aiImg}" alt="Your photo"><button class="x" data-a="aiNoPhoto" aria-label="Remove photo">✕</button></div>` : '<button class="btn ghost sm" data-a="aiPhoto">📷 Add a photo of the food or the label</button>';
  const q = $('#ai-q');
  if (q) q.placeholder = aiImg ? 'Describe the photo for a better estimate (optional), e.g. chicken breast with potatoes in herb butter' : 'e.g. 75 g cooked beef shoulder';
  const lab = $('#ai-qlabel'); if (lab) lab.textContent = aiImg ? 'What is in the photo? (optional, but it helps)' : 'What did you eat?';
}
/* ---------- in-app camera ----------
   Taking the photo inside the app (like the barcode scanner does) instead of opening the phone's camera app:
   on Android the camera app can push Spuddy out of memory, and the app then restarts and loses the open form. */
let cam = null;   // { stream, done }
function camEnd(result) {
  if (!cam) return;
  const c = cam; cam = null;
  try { c.stream && c.stream.getTracks().forEach(t => t.stop()); } catch (e) { }
  const el = $('#cam'); if (el) el.remove();
  c.done(result || null);
}
// Opens the camera over whatever is on screen and gives back one photo (base64 JPEG), or null if closed.
function takePhoto() {
  return new Promise(async done => {
    if (cam) camEnd(null);
    const el = document.createElement('div'); el.id = 'cam';
    el.innerHTML = `<video playsinline autoplay muted></video><div class="camtop"><button class="x" data-a="camClose" aria-label="Close camera">✕</button></div>
    <div class="cambar"><button class="camside" data-a="camGallery">🖼️ Gallery</button><button class="camshot" data-a="camShot" aria-label="Take photo"></button><span class="camside"></span></div>
    <input type="file" id="cam-file" accept="image/*" hidden>`;
    document.body.appendChild(el);
    cam = { stream: null, done };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } });
      if (!cam) return stream.getTracks().forEach(t => t.stop());   // closed while the phone was asking for permission
      cam.stream = stream; el.querySelector('video').srcObject = stream;
    } catch (e) {
      // No camera access: fall back to choosing a picture.
      const v = el.querySelector('video'); if (v) v.remove();
      el.querySelector('.camshot').style.visibility = 'hidden';
      el.insertAdjacentHTML('afterbegin', '<p class="cammsg">The camera is not available here. Allow camera access for Spuddy, or choose a picture from the gallery.</p>');
    }
  });
}
function camShot() {
  const v = $('#cam video'); if (!cam || !v || !v.videoWidth) return;
  const k = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight)), cv = document.createElement('canvas');
  cv.width = Math.round(v.videoWidth * k); cv.height = Math.round(v.videoHeight * k);
  cv.getContext('2d').drawImage(v, 0, 0, cv.width, cv.height);
  camEnd(cv.toDataURL('image/jpeg', 0.8).split(',')[1]);
}
document.addEventListener('change', async ev => {
  if (ev.target.id !== 'cam-file' || !ev.target.files[0]) return;
  try { camEnd(await aiShrink(ev.target.files[0])); } catch (e) { toast('That picture could not be opened'); }
});

let aiRes = null, aiBusy = false;

// Free Gemini models, tried in order: if one is missing or has used up its free quota for now, the next one is asked.
const AI_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];

const AI_JSON_RULE = `

Answer with JSON only, no other text, in exactly this shape:
{"items":[{"name":"","grams":0,"kcal_per_100g":0,"protein_per_100g":0,"carbs_per_100g":0,"fat_per_100g":0,"fiber_per_100g":0,"sugars_per_100g":0,"saturated_fat_per_100g":0,"salt_per_100g":0}],"note":""}`;

// Sends one question to Gemini and returns its JSON answer.
// The request is tried in up to three forms, because Google has changed how a fixed answer format is asked for:
// the current form, the earlier form, and last a plain request that relies on the instructions alone.
async function aiCall(system, input, schema, fast) {
  const fixed = { response_format: { type: 'text', mime_type: 'application/json', schema } };
  // "fast" (reading a label) is plain copying: it asks the model not to think it over first, and starts with the quickest model.
  const formats = (fast ? [Object.assign({ generation_config: { thinking_level: 'minimal' } }, fixed)] : []).concat([fixed, { response_mime_type: 'application/json', response_format: schema }, {}]);
  const memo = fast ? 'fast' : 'full';
  if (!S.aiModel || typeof S.aiModel !== 'object') S.aiModel = {};
  // Start with the model and request form that answered last time (for a few hours), so a busy model is not asked again on every question.
  const m = S.aiModel[memo], pref = m && Date.now() - m.t < 3 * 3600 * 1000 && AI_MODELS.includes(m.m) ? m.m : null;
  const base = fast ? AI_MODELS.slice().reverse() : AI_MODELS;
  const order = pref ? [pref].concat(base.filter(x => x !== pref)) : base;
  let last = null;
  for (const model of order) {
    const start = model === pref && m.f < formats.length ? m.f : 0;
    for (let fi = start; fi < formats.length; fi++) {
      let res;
      const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 25000);
      try {
        res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
          method: 'POST', signal: ctl.signal,
          headers: { 'content-type': 'application/json', 'x-goog-api-key': S.aiKey },
          body: JSON.stringify(Object.assign({ model, input, system_instruction: system, store: false }, formats[fi])),
        });
      } catch (e) {
        clearTimeout(timer);
        if (e && e.name === 'AbortError') { last = { status: 504, msg: '' }; break; }   // too slow: try the next model
        throw new Error('No connection. The AI helper needs internet.');
      }
      clearTimeout(timer);
      let data = null;
      try { data = await res.json(); } catch (e) { }
      if (Array.isArray(data)) data = data[0];
      if (res.ok) { if (model !== pref || fi !== m.f) { S.aiModel[memo] = { m: model, f: fi, t: Date.now() }; persist(); } return aiJson(data); }
      const msg = (data && data.error && data.error.message) || '';
      if (res.status === 401 || res.status === 403 || /api key/i.test(msg)) throw new Error('The AI key was not accepted. Check it in the Me tab.');
      last = { status: res.status, msg };
      if (res.status !== 400) break;        // 400 = this request form was not understood: try the next form
    }
    if (last.status !== 400 && last.status !== 404 && last.status !== 429 && last.status < 500) break;   // only a missing, busy or used-up model is worth another try
  }
  if (last.status === 429) throw new Error('The free AI limit is used up for now. Try again later or tomorrow.');
  if (last.status >= 500) throw new Error('The AI is busy right now. Try again in a moment.');
  throw new Error('The AI could not answer' + (last.msg ? ': ' + last.msg : '.'));
}
function aiJson(data) {
  const texts = [];
  ((data && data.steps) || []).forEach(s => { if (s.type === 'model_output') (s.content || []).forEach(c => { if (c.type === 'text' && c.text) texts.push(c.text); }); });
  if (!texts.length) ((data && data.outputs) || []).forEach(c => { if (c.type === 'text' && c.text) texts.push(c.text); });   // earlier answer layout
  try { const t = texts.join(''); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch (e) { throw new Error('The AI answer could not be read. Try again.'); }
}
const aiImage = (text, image) => [{ type: 'text', text }, { type: 'image', data: image, mime_type: 'image/jpeg' }];

async function aiEstimate(text, image) {
  const out = await aiCall(AI_SYSTEM + AI_JSON_RULE, image ? aiImage(text || 'This is a photo of what I ate, or of its nutrition label.', image) : text, AI_SCHEMA);
  const n = v => { v = +v; return isFinite(v) && v >= 0 ? v : 0; };
  return {
    note: String(out.note || ''),
    items: (out.items || []).filter(i => i && i.name && n(i.grams) > 0).map(i => ({
      name: String(i.name).slice(0, 80), grams: n(i.grams), kcal: n(i.kcal_per_100g), p: n(i.protein_per_100g), c: n(i.carbs_per_100g), f: n(i.fat_per_100g),
      fi: n(i.fiber_per_100g), su: n(i.sugars_per_100g), sf: n(i.saturated_fat_per_100g), sa: n(i.salt_per_100g),
    })),
  };
}

/* ---------- reading a nutrition label into the food form ---------- */
const LABEL_NUMS = ['kcal', 'protein', 'carbs', 'fat', 'fiber', 'sugars', 'saturated_fat', 'salt', 'portion_g'];
const LABEL_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['is_label', 'name', 'brand'].concat(LABEL_NUMS),
  properties: Object.assign({ is_label: { type: 'boolean' }, name: { type: 'string' }, brand: { type: 'string' } }, Object.fromEntries(LABEL_NUMS.map(k => [k, { type: 'number' }]))),
};
const LABEL_SYSTEM = `You read nutrition labels for a calorie-tracking app. The photo shows the nutrition table on a food pack, in any language.

Copy the values PER 100 g (or per 100 ml) exactly as printed. If the label only gives values per portion, convert them to per 100 g using the portion weight on the label. If energy is given only in kJ, divide by 4.184 for kcal.
- kcal, protein, carbs, fat, fiber, sugars, saturated_fat, salt: per 100 g. If only sodium is printed, salt = sodium x 2.5.
- portion_g: the weight of one portion in grams if the label states one.
- name and brand: only if they are readable in the photo, in their original language; otherwise an empty string.
Use -1 for every number that is not printed on the label. Never guess a value.
Set is_label to false if the photo does not show a nutrition table, and then use -1 for all numbers.

Answer with JSON only, no other text, in exactly this shape:
{"is_label":true,"name":"","brand":"","kcal":0,"protein":0,"carbs":0,"fat":0,"fiber":0,"sugars":0,"saturated_fat":0,"salt":0,"portion_g":0}`;
const LABEL_FIELDS = { kcal: '#f-kcal', protein: '#f-p', carbs: '#f-c', fat: '#f-f', fiber: '#f-fi', sugars: '#f-su', saturated_fat: '#f-sf', salt: '#f-sa', portion_g: '#f-serv' };
async function labelFill(image) {
  const msg = t => { const m = $('#lb-msg'); if (m) m.innerHTML = t; };
  msg('<p class="center muted" style="margin:10px 0">Reading the label… 🥔</p>');
  try {
    const out = await aiCall(LABEL_SYSTEM, aiImage('Read this nutrition label.', image), LABEL_SCHEMA, true);
    if (!$('#f-kcal')) return;   // the form was closed meanwhile
    const got = LABEL_NUMS.filter(k => isFinite(+out[k]) && +out[k] >= 0);
    if (out.is_label === false || !got.includes('kcal')) return msg('<div class="note" style="margin-top:10px">I could not read a nutrition table in that photo. Try again closer and straight on, with good light.</div>');
    got.forEach(k => { $(LABEL_FIELDS[k]).value = Math.round(+out[k] * 100) / 100; });
    if (!$('#f-name').value.trim() && out.name) $('#f-name').value = String(out.name).slice(0, 80);
    if (!$('#f-brand').value.trim() && out.brand) $('#f-brand').value = String(out.brand).slice(0, 40);
    $('#f-grade').value = '';   // the grade is worked out again from the new numbers
    msg('<div class="note" style="margin-top:10px">Filled in from the photo ✓ Check the numbers against the label before you save.</div>');
  } catch (e) { msg(`<div class="note" style="margin-top:10px">${esc(e.message === 'photo' ? 'That photo could not be opened.' : e.message)}</div>`); }
}
// What is typed in the food form, so it can be put back if the phone restarts the app.
const DRAFT_KEY = 'spuddy.draft';
function draftSave() {
  if (!$('#f-kcal')) return;
  const v = id => $(id).value, n = id => { const x = num(v(id)); return isFinite(x) ? x : undefined; };
  const f = { id: v('#f-id') || undefined, name: v('#f-name'), brand: v('#f-brand'), kcal: n('#f-kcal'), p: n('#f-p'), c: n('#f-c'), f: n('#f-f'), fi: n('#f-fi'), su: n('#f-su'), sf: n('#f-sf'), sa: n('#f-sa'), grade: v('#f-grade'), barcode: v('#f-barcode'), serving: n('#f-serv') > 0 ? { label: '1 portion', g: n('#f-serv') } : null };
  try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ t: Date.now(), addMeal, day, f })); } catch (e) { }
}
function draftClear() { try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { } }
// Called when the app starts: reopen the food form that was open when the app was restarted.
function draftRestore() {
  let d = null;
  try { d = JSON.parse(sessionStorage.getItem(DRAFT_KEY)); } catch (e) { }
  draftClear();
  if (!d || !d.f || Date.now() - d.t > 10 * 60 * 1000 || !S.onboarded) return;
  if (MEALS.some(m => m[0] === d.addMeal)) addMeal = d.addMeal;
  if (/^\d{4}-\d\d-\d\d$/.test(d.day || '') && d.day <= today()) day = d.day;
  tab = 'today'; render();
  sheetFood(d.f, 'The phone restarted Spuddy while the camera was open. Your food is back as you left it. Try the photo again.');
}

function sheetAI() {
  aiRes = null; aiImg = null;
  if (!S.aiKey) {
    return openSheet(`${shHead('✨ Ask the AI')}<div class="sh-body">
    <div class="note">Tell the AI what you ate in your own words, for example “75 g cooked beef shoulder”, and it works out the calories and macros and logs them.<br><br>It needs a free key from Google first. That takes a few minutes, once.</div>
    <button class="btn" data-a="aiSetup">Set it up in the Me tab</button></div>`, true);
  }
  openSheet(`${shHead('✨ Ask the AI')}<div class="sh-body">
  <label class="f"><span id="ai-qlabel">What did you eat?</span><textarea class="inp" id="ai-q" rows="3" placeholder="e.g. 75 g cooked beef shoulder"></textarea></label>
  <div id="ai-photobox" style="margin-bottom:10px"></div>
  <button class="btn" data-a="aiAsk">Work it out</button>
  <div id="ai-out" style="margin-top:14px"></div></div>`);
  aiPhotoBox();
}

function renderAI() {
  const out = $('#ai-out'); if (!out || !aiRes) return;
  const meal = MEALS.find(m => m[0] === addMeal)[1];
  if (!aiRes.items.length) { out.innerHTML = `<div class="note">${esc(aiRes.note || 'I could not find a food in that. Try again with a food and an amount.')}</div>`; return; }
  let tot = 0;
  const rows = aiRes.items.map(i => {
    const k = i.grams / 100; tot += i.kcal * k;
    return `<div class="mfood"><div class="n">${esc(i.name)}</div><div class="d">${Math.round(i.kcal * k)} kcal, ${r1(i.grams)} g <span>· P ${r1(i.p * k)} · C ${r1(i.c * k)} · F ${r1(i.f * k)} · Fiber ${r1(i.fi * k)}</span></div></div>`;
  }).join('');
  out.innerHTML = `${rows}${aiRes.note ? `<p class="muted small" style="margin:10px 0">${esc(aiRes.note)}</p>` : ''}
  <p class="muted small" style="margin:10px 0">An estimate, not a label. You can change the amount after adding, and edit the food later in My foods.</p>
  <button class="btn" data-a="aiAdd">Add to ${meal} · ${Math.round(tot)} kcal</button>`;
}

const AI_ACTIONS = {
  openAI() { sheetAI(); },
  async aiPhoto() { const img = await takePhoto(); if (img) { aiImg = img; aiPhotoBox(); } },
  camShot() { camShot(); },
  camClose() { camEnd(null); },
  camGallery() { $('#cam-file').click(); },
  aiNoPhoto() { aiImg = null; aiPhotoBox(); },
  async labelPhoto() {
    if (!S.aiKey) return toast('Set up the AI helper in the Me tab first');
    draftSave();
    const img = await takePhoto();
    draftClear();
    if (img && $('#f-kcal')) labelFill(img);
  },
  aiSetup() { backToMeal = null; closeSheet(); tab = 'me'; render(); const c = $('#ai-card'); if (c) c.scrollIntoView(); },
  async aiAsk() {
    const q = $('#ai-q').value.trim();
    if (!q && !aiImg) return toast('Write what you ate or add a photo first');
    if (aiBusy) return;
    aiBusy = true; aiRes = null;
    $('#ai-out').innerHTML = '<p class="center muted">Thinking… 🥔</p>';
    try { aiRes = await aiEstimate(q, aiImg); renderAI(); }
    catch (e) { const out = $('#ai-out'); if (out) out.innerHTML = `<div class="note">${esc(e.message)}</div>`; }
    finally { aiBusy = false; }
  },
  aiAdd() {
    if (!aiRes || !aiRes.items.length) return;
    aiRes.items.forEach(i => {
      // Remember it as one of her own foods, so next time it is in the list without asking again.
      let f = Object.values(S.foods).find(x => x.ai && norm(x.name) === norm(i.name));
      if (!f) {
        f = { id: 'c:' + uid(), custom: true, ai: true, name: i.name, brand: '', kcal: i.kcal, p: i.p, c: i.c, f: i.f, fi: i.fi, su: i.su, sf: i.sf, sa: i.sa, grade: '', serving: null, barcode: '' };
        S.foods[f.id] = f;
      }
      const k = i.grams / 100;
      (S.log[day] || (S.log[day] = [])).push({ id: uid(), foodId: f.id, name: f.name, meal: addMeal, grams: i.grams, kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k, fi: (f.fi || 0) * k, gr: gradeOf(f) });
      const u = S.uses[f.id] || (S.uses[f.id] = { n: 0 }); u.n++;
    });
    const n = aiRes.items.length; aiRes = null;
    save(); closeSheet(); render(); settleRewards(); render();
    if (backToMeal) sheetMeal(backToMeal);
    toast(n === 1 ? 'Added ✓' : `Added ${n} foods ✓`);
  },
  saveKey() {
    S.aiKey = $('#ai-key').value.trim(); save(); render();
    toast(S.aiKey ? 'AI helper is ready ✨' : 'AI key removed');
  },
};
