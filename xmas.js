'use strict';
/* Christmas: the tree (a gift on 1 December), 24 advent ornaments (one per day, random order),
   and the screen for hanging them. Ornaments are drawn in a box of about 16 x 16 units around 0,0;
   the tree is 120 wide and about 180 tall with its base at 0,0. Loaded before app.js. */
const bauble = (c, hi) => `<rect x="-2" y="-9" width="4" height="3" rx="1" fill="#E0A800"/><circle cx="0" cy="1" r="7" fill="${c}"/><path d="M-4 -2 Q-2 -5 1 -5" stroke="${hi}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
const ORNAMENTS = [
  { id: 'burger', name: 'Hamburger', svg: `<path d="M-8 -1 Q-8 -8 0 -8 Q8 -8 8 -1Z" fill="#E0A458"/><g fill="#FFF3D6"><circle cx="-3" cy="-5" r=".7"/><circle cx="1" cy="-6" r=".7"/><circle cx="4" cy="-4" r=".7"/></g><path d="M-9 1 Q-6 -3 -3 0 Q0 -3 3 0 Q6 -3 9 1Z" fill="#6DBE5A"/><rect x="-8" y="1" width="16" height="3.6" rx="1.6" fill="#7A4A21"/><path d="M-8 1 H8 L4.5 3.4 L0 1.6 L-4.5 3.4Z" fill="#FFC83D"/><path d="M-8 5.2 H8 Q8 9 4 9 H-4 Q-8 9 -8 5.2Z" fill="#E0A458"/>` },
  { id: 'pizza', name: 'Pizza slice', svg: `<path d="M-7.5 -6 L7.5 -6 L0 9Z" fill="#FFC83D"/><path d="M-8.5 -8 Q0 -11 8.5 -8 L7.5 -5 Q0 -7.5 -7.5 -5Z" fill="#D9A05B"/><circle cx="-2.5" cy="-2.5" r="2" fill="#D7402F"/><circle cx="3" cy="-1" r="1.8" fill="#D7402F"/><circle cx="0" cy="3.5" r="1.6" fill="#D7402F"/><circle cx="-1" cy="0.5" r=".7" fill="#5FA644"/><circle cx="2.5" cy="-4" r=".7" fill="#5FA644"/>` },
  { id: 'garlic', name: 'Garlic head', svg: `<path d="M0 -9 Q1.5 -4 6 -1 Q9.5 4 4.5 7.5 Q0 9.5 -4.5 7.5 Q-9.5 4 -6 -1 Q-1.5 -4 0 -9Z" fill="#F7F2E8" stroke="#D8CDBE" stroke-width="1"/><path d="M0 -7 Q-3.5 0 -2.5 8 M0 -7 Q3.5 0 2.5 8" stroke="#D8CDBE" stroke-width=".9" fill="none"/><path d="M-2.5 8.5 H2.5" stroke="#C9B28F" stroke-width="1.4" stroke-linecap="round"/>` },
  { id: 'gingerbread', name: 'Gingerbread', svg: `<circle cx="0" cy="-5.2" r="3.5" fill="#B5651D"/><path d="M-2.2 -2.4 H2.2 L7 -1.6 V1.4 L2.6 1.6 L5.2 8.5 H2 L0 4.4 L-2 8.5 H-5.2 L-2.6 1.6 L-7 1.4 V-1.6Z" fill="#B5651D" stroke="#B5651D" stroke-width="1" stroke-linejoin="round"/><g fill="#fff"><circle cx="-1.2" cy="-5.8" r=".6"/><circle cx="1.2" cy="-5.8" r=".6"/><circle cx="0" cy="-.2" r=".8"/><circle cx="0" cy="2.4" r=".8"/></g><path d="M-1.4 -4 Q0 -3 1.4 -4" stroke="#fff" stroke-width=".7" fill="none"/>` },
  { id: 'smore', name: "S'more", svg: `<rect x="-7.5" y="-7.5" width="15" height="3.6" rx="1" fill="#D9A05B"/><rect x="-6.5" y="-4" width="13" height="5.4" rx="2.4" fill="#FFFDF8" stroke="#E6DCCB" stroke-width=".8"/><rect x="-7" y="1.4" width="14" height="2.8" rx="1" fill="#5A3A22"/><rect x="-7.5" y="4.2" width="15" height="3.6" rx="1" fill="#D9A05B"/><g fill="#B5803F"><circle cx="-4" cy="-5.7" r=".5"/><circle cx="0" cy="-5.7" r=".5"/><circle cx="4" cy="-5.7" r=".5"/></g>` },
  { id: 'red', name: 'Red bauble', svg: bauble('#D7263D', '#FF9AA8') },
  { id: 'gold', name: 'Gold bauble', svg: bauble('#F2B620', '#FFF1B8') },
  { id: 'blue', name: 'Blue bauble', svg: bauble('#3E7BD9', '#B5D2FF') },
  { id: 'cane', name: 'Candy cane', svg: `<path d="M3.5 8.5 V-3 Q3.5 -8 -1 -8 Q-5.5 -8 -5.5 -3.5" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M3.5 8.5 V-3 Q3.5 -8 -1 -8 Q-5.5 -8 -5.5 -3.5" stroke="#D7263D" stroke-width="4" fill="none" stroke-dasharray="2.6 2.6"/>` },
  { id: 'star', name: 'Gold star', svg: `<path transform="scale(.85)" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.5 L6.2 9 L0 4.6 L-6.2 9 L-4.2 1.5 L-10 -3.1 L-2.9 -3.1Z" fill="#FFD23F" stroke="#E0A800" stroke-width="1" stroke-linejoin="round"/>` },
  { id: 'snowflake', name: 'Snowflake', svg: `<g stroke="#8FD3F4" stroke-width="1.8" stroke-linecap="round"><path d="M0 -8 V8 M-7 -4 L7 4 M-7 4 L7 -4"/><path d="M-2 -6 L0 -4 L2 -6 M-2 6 L0 4 L2 6" fill="none" stroke-width="1.2"/></g><circle cx="0" cy="0" r="1.6" fill="#fff"/>` },
  { id: 'bell', name: 'Bell', svg: `<path d="M-6 4.5 Q-6 -6 0 -7.5 Q6 -6 6 4.5Z" fill="#F2B620"/><rect x="-7.5" y="4" width="15" height="2.4" rx="1.2" fill="#E0A800"/><circle cx="0" cy="7.6" r="1.8" fill="#C4861A"/><path d="M-3 -1 Q-2.5 -4.5 0 -5" stroke="#FFF1B8" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
  { id: 'gift', name: 'Little gift', svg: `<rect x="-7" y="-4" width="14" height="12" rx="1.5" fill="#3FA35B"/><rect x="-1.5" y="-4" width="3" height="12" fill="#D7263D"/><rect x="-7" y="0.5" width="14" height="3" fill="#D7263D"/><circle cx="-2.6" cy="-5.6" r="2.4" fill="none" stroke="#D7263D" stroke-width="1.6"/><circle cx="2.6" cy="-5.6" r="2.4" fill="none" stroke="#D7263D" stroke-width="1.6"/>` },
  { id: 'stocking', name: 'Stocking', svg: `<path d="M-3 -6 H4 V2 Q8.5 4 7.5 7 Q6 9.5 0 8.5 Q-4 7.5 -3 2Z" fill="#D7263D"/><rect x="-4" y="-8.5" width="9" height="3.6" rx="1.4" fill="#fff" stroke="#E6E0D6" stroke-width=".6"/>` },
  { id: 'snowman', name: 'Snowman', svg: `<circle cx="0" cy="3.5" r="5.5" fill="#fff" stroke="#D8DEE6" stroke-width=".8"/><circle cx="0" cy="-4" r="4" fill="#fff" stroke="#D8DEE6" stroke-width=".8"/><circle cx="-1.4" cy="-4.8" r=".6" fill="#3B2A1A"/><circle cx="1.4" cy="-4.8" r=".6" fill="#3B2A1A"/><path d="M0 -3.8 L3.4 -3 L0 -2.6Z" fill="#F28A2B"/><path d="M-3.6 -0.6 H3.6" stroke="#D7263D" stroke-width="1.6" stroke-linecap="round"/><circle cx="0" cy="3" r=".7" fill="#3B2A1A"/><circle cx="0" cy="5.6" r=".7" fill="#3B2A1A"/>` },
  { id: 'heart', name: 'Heart', svg: `<path transform="scale(.62) translate(0 1)" d="M0 10 C-18 -3 -10 -15 0 -6 C10 -15 18 -3 0 10Z" fill="#E0463C"/><path d="M-4 -3 Q-3 -5 -1 -4.6" stroke="#FFB3AD" stroke-width="1.1" fill="none" stroke-linecap="round"/>` },
  { id: 'mitten', name: 'Mitten', svg: `<circle cx="6" cy="0" r="2.6" fill="#3E7BD9"/><path d="M-5 5 V-2 Q-5 -8 0 -8 Q5 -8 5 -2 V5Z" fill="#3E7BD9"/><rect x="-5.8" y="4.2" width="11.6" height="4" rx="1.6" fill="#fff" stroke="#E6E0D6" stroke-width=".6"/><path d="M-2 -3 L0 -5 L2 -3 L0 -1Z" fill="#fff"/>` },
  { id: 'donut', name: 'Donut', svg: `<circle cx="0" cy="0" r="5" fill="none" stroke="#E0A458" stroke-width="6.4"/><circle cx="0" cy="-.4" r="5" fill="none" stroke="#FF8FB6" stroke-width="4.4"/><g stroke-width="1.2" stroke-linecap="round"><path d="M-5 -2 L-4 -3.4" stroke="#fff"/><path d="M3 -5 L4.4 -4.4" stroke="#FFD23F"/><path d="M5 2 L4.2 3.4" stroke="#6FA8F5"/><path d="M-3.6 4.4 L-2.2 5" stroke="#fff"/></g>` },
  { id: 'cupcake', name: 'Cupcake', svg: `<path d="M-5.5 1 H5.5 L4 8.5 H-4Z" fill="#8FD3F4"/><path d="M-3 1.5 L-2.4 8 M0 1.5 V8 M3 1.5 L2.4 8" stroke="#6FB8DD" stroke-width=".8"/><circle cx="-3.6" cy="-.4" r="3.4" fill="#FFB3D1"/><circle cx="3.6" cy="-.4" r="3.4" fill="#FFB3D1"/><circle cx="0" cy="-3" r="4.6" fill="#FFB3D1"/><circle cx="0" cy="-7.4" r="1.8" fill="#D7263D"/>` },
  { id: 'spud', name: 'Mini potato', svg: `<path d="M0 -6.4 Q-.2 -8.4 0 -9" stroke="#5FA644" stroke-width="1.2" fill="none"/><path d="M0 -8.4 Q-3.4 -11 -5 -8.4 Q-2.6 -6.6 0 -8.4Z M0 -8.4 Q3.4 -11 5 -8.4 Q2.6 -6.6 0 -8.4Z" fill="#7CC55A"/><ellipse cx="0" cy="1" rx="6" ry="7.6" fill="#DDAB62" stroke="#B07D3C" stroke-width="1"/><circle cx="-2.2" cy="-.6" r="1" fill="#3B2A1A"/><circle cx="2.2" cy="-.6" r="1" fill="#3B2A1A"/><path d="M-1.8 2.4 Q0 4.4 1.8 2.4Z" fill="#7A3B2E"/>` },
  { id: 'strawberry', name: 'Strawberry', svg: `<path d="M0 8.5 Q-8.5 2 -6.4 -4 Q0 -7 6.4 -4 Q8.5 2 0 8.5Z" fill="#E0463C"/><g fill="#FFE9A8"><circle cx="-2.6" cy="-1" r=".6"/><circle cx="2.4" cy="-.4" r=".6"/><circle cx="-.4" cy="2.6" r=".6"/><circle cx="2" cy="4" r=".6"/><circle cx="-3" cy="2.4" r=".6"/></g><path d="M-5 -4.6 L-1.6 -3 L0 -6.4 L1.6 -3 L5 -4.6 L2.4 -6.6 H-2.4Z" fill="#5FA644"/>` },
  { id: 'pretzel', name: 'Pretzel', svg: `<path d="M-3.4 7 L4 -2 Q7.4 -7 2.6 -7.4 Q0 -7.4 0 -4.4 Q0 -7.4 -2.6 -7.4 Q-7.4 -7 -4 -2 L3.4 7" stroke="#B5651D" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="#fff"><circle cx="-4.6" cy="-4.6" r=".6"/><circle cx="4.6" cy="-4.6" r=".6"/><circle cx="0" cy="1.6" r=".6"/></g>` },
  { id: 'cocoa', name: 'Hot cocoa', svg: `<path d="M4.6 -1 Q8.6 -1 8.6 2 Q8.6 5 4.6 5" stroke="#D7263D" stroke-width="1.8" fill="none"/><rect x="-6" y="-3.4" width="11" height="11" rx="2.4" fill="#D7263D"/><ellipse cx="-.5" cy="-3" rx="5.2" ry="1.8" fill="#5A3A22"/><rect x="-3.4" y="-4.2" width="2.6" height="2" rx=".7" fill="#fff"/><rect x="0" y="-3.8" width="2.6" height="2" rx=".7" fill="#fff"/><path d="M-2.4 -7 Q-3.6 -8.6 -2.4 -10 M1.4 -7 Q.2 -8.6 1.4 -10" stroke="#fff" stroke-width="1" fill="none" stroke-linecap="round" opacity=".85"/>` },
  { id: 'cheese', name: 'Cheese', svg: `<path d="M-8 5.5 L8 -4.5 V5.5Z" fill="#FFC83D" stroke="#E0A800" stroke-width="1" stroke-linejoin="round"/><circle cx="3.6" cy="2.4" r="1.5" fill="#E8A91C"/><circle cx="-1.4" cy="3.4" r="1" fill="#E8A91C"/><circle cx="5.6" cy="-1" r=".9" fill="#E8A91C"/>` },
];
const ORN_MAP = Object.fromEntries(ORNAMENTS.map(o => [o.id, o]));
const ornLoop = `<circle cx="0" cy="-10" r="1.5" fill="none" stroke="#E0A800" stroke-width=".9"/>`;
const ornPic = (id, px) => ORN_MAP[id] ? `<svg viewBox="-12 -13 24 24" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg">${ornLoop}${ORN_MAP[id].svg}</svg>` : '';

// Where a tapped ornament lands first (she can drag it anywhere afterwards).
const TREE_SPOTS = [[0, -146], [-11, -124], [11, -124], [-20, -102], [0, -104], [20, -102], [-27, -80], [-9, -82], [9, -80], [27, -82], [-36, -58], [-18, -60], [0, -56], [18, -60], [36, -58], [-40, -36], [-24, -38], [-8, -34], [8, -38], [24, -34], [40, -36], [-48, -20], [0, -17], [48, -20]];

// The tree itself; orn = { ornamentId: {x, y} } in tree units.
function treeSVG(orn, tagged) {
  const hung = Object.keys(orn || {}).filter(id => ORN_MAP[id]).map(id => {
    const p = orn[id], x = Math.max(-70, Math.min(70, Number(p && p.x) || 0)), y = Math.max(-190, Math.min(6, Number(p && p.y) || 0));
    return `<g ${tagged ? `class="orn" data-o="${id}"` : ''} transform="translate(${x} ${y})">${tagged ? '<circle r="11" fill="transparent"/>' : ''}${ornLoop}${ORN_MAP[id].svg}</g>`;
  }).join('');
  return `<rect x="-9" y="-16" width="18" height="18" rx="2" fill="#8C5A32"/>
<path d="M-60 -14 L0 -86 L60 -14Z" fill="#2E8B4E"/><path d="M-50 -50 L0 -120 L50 -50Z" fill="#379A58"/><path d="M-38 -88 L0 -150 L38 -88Z" fill="#43AB66"/><path d="M-26 -122 L0 -172 L26 -122Z" fill="#52BC76"/>
<path transform="translate(0 -176) scale(1.15)" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.5 L6.2 9 L0 4.6 L-6.2 9 L-4.2 1.5 L-10 -3.1 L-2.9 -3.1Z" fill="#FFD23F" stroke="#E0A800" stroke-width="1" stroke-linejoin="round"/>${hung}`;
}

/* ---------- advent ---------- */
// Called when the app opens. In December it hands out the tree (from the 1st) and one ornament per day up to the 24th.
// A missed day is not lost: the next time the app opens she gets everything up to that day.
function adventCheck(dateStr) {
  if (!S.onboarded) return;
  const [y, m, d] = (dateStr || today()).split('-').map(Number);
  if (m !== 12) return;
  const adv = S.advent;
  if (adv.year !== y || adv.order.length !== ORNAMENTS.length) {
    const ids = ORNAMENTS.map(o => o.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    adv.year = y; adv.order = ids; adv.got = 0;
  }
  let treeNew = false; const news = [];
  if (!S.owned.includes('xmastree')) { S.owned.push('xmastree'); S.garden.push('xmastree'); treeNew = true; }
  const upto = Math.min(d, 24);
  while (adv.got < upto) { const id = adv.order[adv.got++]; if (!S.orn.includes(id)) { S.orn.push(id); news.push(id); } }
  if (!treeNew && !news.length) return;
  save(); render();
  openSheet(`${shHead('🎄 Advent · ' + upto + ' December')}
  <div class="sh-body center">${treeNew ? `<svg viewBox="-70 -192 140 198" width="150" height="212" xmlns="http://www.w3.org/2000/svg">${treeSVG({})}</svg><p style="font-weight:800;font-size:18px;margin:6px 0 4px">A Christmas tree for your garden!</p><p class="muted" style="margin-bottom:14px">A gift from your potato. Every day until the 24th you get a new ornament for it.</p>` : ''}
  ${news.length ? `<p class="muted" style="margin-bottom:6px">${news.length > 1 ? 'Your new ornaments' : "Today's ornament"}</p><div class="newornaments">${news.map(id => `<div>${ornPic(id, news.length > 4 ? 56 : 96)}<b>${ORN_MAP[id].name}</b></div>`).join('')}</div>` : ''}
  <button class="btn" style="margin-top:16px" data-a="openTree">Hang ${news.length === 1 ? 'it' : 'them'} on the tree</button>
  <button class="btn ghost sm" style="margin-top:10px" data-a="closeSheet">Later</button></div>`, true);
}

/* ---------- decorating ---------- */
function sheetTree(noAnim) {
  const placed = S.advent.placed, tray = S.orn.filter(id => ORN_MAP[id] && !placed[id]);
  openSheet(`${shHead('Christmas tree')}
  <div class="sh-body"><svg id="treesvg" viewBox="-72 -192 144 200" xmlns="http://www.w3.org/2000/svg">${treeSVG(placed, true)}</svg>
  <p class="muted small center" style="margin:6px 0 10px">${S.orn.length ? 'Tap an ornament below to hang it, then drag it where you want. Tap one on the tree to take it off.' : 'No ornaments yet — the first one arrives on 1 December.'}</p>
  <div class="tray">${tray.map(id => `<button data-a="hangOrn" data-o="${id}" aria-label="${ORN_MAP[id].name}">${ornPic(id, 46)}</button>`).join('')}</div>
  <p class="muted small center" style="margin-top:10px">${S.orn.length} of ${ORNAMENTS.length} ornaments collected</p></div>`);
  if (noAnim) $('#sheet').style.animation = 'none';
}
let dragOrn = null;
function treePoint(ev) {
  const svg = $('#treesvg'), pt = svg.createSVGPoint();
  pt.x = ev.clientX; pt.y = ev.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: Math.round(Math.max(-66, Math.min(66, p.x)) * 10) / 10, y: Math.round(Math.max(-184, Math.min(4, p.y)) * 10) / 10 };
}
document.addEventListener('pointerdown', ev => {
  const g = ev.target.closest && ev.target.closest('#treesvg .orn');
  if (!g) return;
  dragOrn = { id: g.dataset.o, g, moved: false, x0: ev.clientX, y0: ev.clientY };
  ev.preventDefault();
});
document.addEventListener('pointermove', ev => {
  if (!dragOrn) return;
  if (!dragOrn.moved && Math.hypot(ev.clientX - dragOrn.x0, ev.clientY - dragOrn.y0) < 6) return;
  dragOrn.moved = true;
  const p = treePoint(ev);
  dragOrn.g.setAttribute('transform', `translate(${p.x} ${p.y})`);
  S.advent.placed[dragOrn.id] = p;
});
function dragEnd() {
  const d = dragOrn; dragOrn = null;
  if (!d) return;
  if (!d.moved) delete S.advent.placed[d.id];      // a plain tap takes it off the tree
  save(); render(); sheetTree(true);
}
document.addEventListener('pointerup', dragEnd);
document.addEventListener('pointercancel', dragEnd);

const XMAS_ACTIONS = {
  openTree() { sheetTree(); },
  hangOrn(el) {
    const placed = S.advent.placed, taken = Object.values(placed);
    const spot = TREE_SPOTS.find(s => !taken.some(p => Math.hypot(p.x - s[0], p.y - s[1]) < 9)) || TREE_SPOTS[Math.floor(Math.random() * TREE_SPOTS.length)];
    placed[el.dataset.o] = { x: spot[0], y: spot[1] };
    save(); render(); sheetTree(true);
  },
};
