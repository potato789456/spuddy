/* AI helper: describe a food in words, get calories and macros, log it.
   Talks to the Claude API straight from the phone, with a key that is stored on this phone only. */
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
If the message is not about food or drink, return an empty items list and say so in "note".`;

let aiRes = null, aiBusy = false;

async function aiEstimate(text) {
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': S.aiKey,
        'anthropic-version': '2026-10-21',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-opus-5-5',
        max_tokens: 8000,
        system: AI_SYSTEM,
        output_config: { effort: 'low', format: { type: 'json_schema', schema: AI_SCHEMA } },
        messages: [{ role: 'user', content: text }],
      }),
    });
  } catch (e) { throw new Error('No connection. The AI helper needs internet.'); }
  let data = null;
  try { data = await res.json(); } catch (e) { }
  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || '';
    if (res.status === 401 || res.status === 403) throw new Error('The AI key was not accepted. Check it in the Me tab.');
    if (/credit|billing/i.test(msg)) throw new Error('The AI account has no credit left. Top it up on console.anthropic.com.');
    if (res.status === 429 || res.status >= 500) throw new Error('The AI is busy right now. Try again in a moment.');
    throw new Error('The AI could not answer' + (msg ? ': ' + msg : '.'));
  }
  if (data.stop_reason === 'refusal') throw new Error('The AI would not answer that one. Try describing the food differently.');
  if (data.stop_reason === 'max_tokens') throw new Error('That was too much at once. Try fewer foods in one go.');
  let out;
  try { out = JSON.parse((data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')); } catch (e) { throw new Error('The AI answer could not be read. Try again.'); }
  const n = v => { v = +v; return isFinite(v) && v >= 0 ? v : 0; };
  return {
    note: String(out.note || ''),
    items: (out.items || []).filter(i => i && i.name && n(i.grams) > 0).map(i => ({
      name: String(i.name).slice(0, 80), grams: n(i.grams), kcal: n(i.kcal_per_100g), p: n(i.protein_per_100g), c: n(i.carbs_per_100g), f: n(i.fat_per_100g),
      fi: n(i.fiber_per_100g), su: n(i.sugars_per_100g), sf: n(i.saturated_fat_per_100g), sa: n(i.salt_per_100g),
    })),
  };
}

function sheetAI() {
  aiRes = null;
  if (!S.aiKey) {
    return openSheet(`${shHead('✨ Ask the AI')}<div class="sh-body">
    <div class="note">Tell the AI what you ate in your own words, for example “75 g cooked beef shoulder”, and it works out the calories and macros and logs them.<br><br>It needs a key first. That takes a few minutes, once.</div>
    <button class="btn" data-a="aiSetup">Set it up in the Me tab</button></div>`, true);
  }
  openSheet(`${shHead('✨ Ask the AI')}<div class="sh-body">
  <label class="f"><span>What did you eat?</span><textarea class="inp" id="ai-q" rows="3" placeholder="e.g. 75 g cooked beef shoulder"></textarea></label>
  <button class="btn" data-a="aiAsk">Work it out</button>
  <div id="ai-out" style="margin-top:14px"></div></div>`);
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
  aiSetup() { backToMeal = null; closeSheet(); tab = 'me'; render(); const c = $('#ai-card'); if (c) c.scrollIntoView(); },
  async aiAsk() {
    const q = $('#ai-q').value.trim();
    if (!q) return toast('Write what you ate first');
    if (aiBusy) return;
    aiBusy = true; aiRes = null;
    $('#ai-out').innerHTML = '<p class="center muted">Thinking… 🥔</p>';
    try { aiRes = await aiEstimate(q); renderAI(); }
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
