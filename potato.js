// The potato, its wardrobe and its garden.
// The potato is drawn in a 200 x 220 box; the garden scene is 360 x 400.
const P_BODY = 'M100 58 C140 54 160 92 156 132 C153 172 128 194 98 193 C66 192 44 168 45 130 C46 92 62 60 100 58Z';
const heart = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C-14 -2 -8 -12 0 -5 C8 -12 14 -2 0 8Z" fill="${fill}"/>`;
const flower = (x, y, r, petal, mid, n) => { n = n || 5; let o = ''; for (let k = 0; k < n; k++) { const a = k * 2 * Math.PI / n; o += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * (n > 6 ? 0.5 : 0.75)).toFixed(1)}" fill="${petal}"/>`; } return o + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${mid}"/>`; };
const star = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.5 L6.2 9 L0 4.6 L-6.2 9 L-4.2 1.5 L-10 -3.1 L-2.9 -3.1Z" fill="${fill}"/>`;
const stem = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#5FA644" stroke-width="${w || 3}" stroke-linecap="round"/>`;
const tree = (c1, c2, dots) => `<rect x="-6" y="-52" width="12" height="54" rx="3" fill="#A9794B"/><circle cx="-22" cy="-60" r="23" fill="${c2}"/><circle cx="22" cy="-60" r="23" fill="${c2}"/><circle cx="0" cy="-78" r="31" fill="${c1}"/>${dots || ''}`;
const tulip = (x, y, c) => stem(x, 0, x, y) + `<path transform="translate(${x} ${y})" d="M-6 0 Q-7 -11 -6 -14 L-2 -8 L0 -15 L2 -8 L6 -14 Q7 -11 6 0 Q0 5 -6 0Z" fill="${c}"/>`;

const hairCap = c => `<path d="M58 94 Q52 52 100 50 Q148 52 142 94 Q136 68 100 66 Q64 68 58 94Z" fill="${c}"/>`;
const shoePair = (fill, sole, extra) => `<g stroke="rgba(59,42,26,.28)" stroke-width="1.3"><path d="M64 211 Q62 199 76 198 L89 198 L89 211Z" fill="${fill}"/><path d="M136 211 Q138 199 124 198 L111 198 L111 211Z" fill="${fill}"/></g><path d="M63 211 H90 M110 211 H137" stroke="${sole}" stroke-width="3" stroke-linecap="round"/>${extra || ''}`;
const bootPair = (fill, sole, extra) => `<path d="M72 187 H89 V211 H63 Q62 201 72 200Z" fill="${fill}"/><path d="M128 187 H111 V211 H137 Q138 201 128 200Z" fill="${fill}"/><path d="M62 211 H90 M110 211 H138" stroke="${sole}" stroke-width="3" stroke-linecap="round"/>${extra || ''}`;
const catPet = (body, head, stripe, eye) => `<path d="M13 -8 Q28 -12 23 -30" stroke="${body}" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="14" ry="12" fill="${body}"/><path d="M-10 -36 L-9 -47 L-1 -40Z M10 -36 L9 -47 L1 -40Z" fill="${body}"/><circle cx="0" cy="-30" r="11.5" fill="${head}"/><path d="M-4 -40 V-36 M0 -41 V-36 M4 -40 V-36" stroke="${stripe}" stroke-width="1.6" stroke-linecap="round"/><circle cx="-4.5" cy="-31" r="1.9" fill="${eye}"/><circle cx="4.5" cy="-31" r="1.9" fill="${eye}"/><path d="M-1.6 -27 L1.6 -27 L0 -25Z" fill="#FF8FA8"/><path d="M-6 -26 L-15 -28 M-6 -24.5 L-15 -23.5 M6 -26 L15 -28 M6 -24.5 L15 -23.5" stroke="${eye === '#3B2A1A' ? '#3B2A1A' : '#9AA3AD'}" stroke-width=".8"/>`;
const mittenL = (c, r) => `<circle cx="29" cy="151" r="${r}" fill="${c}"/><circle cx="${29 - r * 0.2}" cy="${151 - r}" r="${r * 0.42}" fill="${c}"/><path d="M36 143 L41 149" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
const mittenR = (c, r) => `<circle cx="173" cy="151" r="${r}" fill="${c}"/><circle cx="${173 + r * 0.2}" cy="${151 - r}" r="${r * 0.42}" fill="${c}"/><path d="M166 143 L161 149" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
const CATS = [['costume', 'Costumes <span class="hint">· worn instead of hair, hat, neck and outfit</span>'], ['hair', 'Hair'], ['hat', 'Hats'], ['glasses', 'Glasses'], ['neck', 'Neck'], ['outfit', 'Outfits'], ['shoes', 'Shoes'], ['hand', 'In hand']];
const wear = inner => `<g clip-path="url(#pb)">${inner}</g>`;   // clipped to the potato's body
const GARDEN_SUBS = ['Christmas', 'Fun & relax', 'Trees', 'Flowers', 'Decorations'];

const ITEMS = [
  // Hats
  { id: 'sprout', cat: 'hat', name: 'Sprout', price: 0, svg: `<path d="M100 60 Q99 50 100 43" stroke="#5FA644" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M100 45 Q84 28 73 40 Q86 53 100 45Z" fill="#7CC55A"/><path d="M100 45 Q116 26 128 37 Q116 52 100 45Z" fill="#8FD46B"/>` },
  { id: 'bow', cat: 'hat', name: 'Pink bow', price: 25, svg: `<path d="M126 64 L108 52 L110 76Z M126 64 L144 52 L142 76Z" fill="#FF7FAE" stroke="#E0558A" stroke-width="2" stroke-linejoin="round"/><circle cx="126" cy="64" r="6" fill="#FF9CC2" stroke="#E0558A" stroke-width="2"/>` },
  { id: 'beanie', cat: 'hat', name: 'Beanie', price: 30, svg: `<path d="M56 76 Q56 34 100 34 Q144 34 144 76Z" fill="#E86A6A"/><rect x="52" y="66" width="96" height="15" rx="7.5" fill="#FFF3E6" stroke="#EAD9C5" stroke-width="1.5"/><circle cx="100" cy="30" r="10" fill="#FFF3E6" stroke="#EAD9C5" stroke-width="1.5"/>` },
  { id: 'party', cat: 'hat', name: 'Party hat', price: 40, svg: `<path d="M76 64 L100 16 L124 64Z" fill="#7FB8FF"/><path d="M88 40 L112 40 L116 48 L84 48Z" fill="#FFD95A"/><path d="M80 56 L120 56 L124 64 L76 64Z" fill="#FF8FB6"/><circle cx="100" cy="15" r="7" fill="#FFD95A"/>` },
  { id: 'chef', cat: 'hat', name: 'Chef hat', price: 60, svg: `<circle cx="80" cy="40" r="15" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><circle cx="120" cy="40" r="15" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><circle cx="100" cy="32" r="18" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><rect x="74" y="44" width="52" height="22" rx="4" fill="#fff" stroke="#DDD3C6" stroke-width="2"/>` },
  { id: 'tophat', cat: 'hat', name: 'Top hat', price: 60, svg: `<ellipse cx="100" cy="63" rx="38" ry="7" fill="#2B2B33"/><rect x="76" y="22" width="48" height="42" rx="4" fill="#2B2B33"/><rect x="76" y="50" width="48" height="8" fill="#D7263D"/>` },
  { id: 'flowers', cat: 'hat', name: 'Flower crown', price: 70, svg: `<path d="M62 76 Q100 50 138 76" stroke="#6DB15A" stroke-width="4" fill="none"/>${flower(66, 73, 6, '#FF9CC2', '#FFE066')}${flower(83, 64, 6, '#FFF', '#FFE066')}${flower(100, 60, 7, '#FF9CC2', '#FFE066')}${flower(117, 64, 6, '#FFF', '#FFE066')}${flower(134, 73, 6, '#FF9CC2', '#FFE066')}` },
  { id: 'cowboy', cat: 'hat', name: 'Cowboy hat', price: 80, svg: `<ellipse cx="100" cy="64" rx="60" ry="11" fill="#9C6B3E"/><path d="M72 62 Q68 26 88 30 Q100 38 112 30 Q132 26 128 62Z" fill="#B07D4A"/><path d="M72 54 Q100 62 128 54 L128 62 Q100 68 72 62Z" fill="#6B4423"/>` },
  { id: 'wizard', cat: 'hat', name: 'Wizard hat', price: 110, svg: `<path d="M68 66 Q94 36 114 4 Q120 36 132 66Z" fill="#6B4FC8"/><ellipse cx="100" cy="66" rx="46" ry="9" fill="#5A3FB3"/>${star(100, 46, 0.7, '#FFD23F')}${star(112, 24, 0.4, '#FFE98A')}` },
  { id: 'crown', cat: 'hat', name: 'Crown', price: 200, svg: `<path d="M70 66 L64 34 L85 50 L100 26 L115 50 L136 34 L130 66Z" fill="#FFD23F" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="54" r="5" fill="#FF5C8A"/><circle cx="82" cy="58" r="3.5" fill="#6EC6FF"/><circle cx="118" cy="58" r="3.5" fill="#6EC6FF"/>` },
  // Glasses
  { id: 'round', cat: 'glasses', name: 'Round glasses', price: 30, svg: `<g fill="rgba(255,255,255,.3)" stroke="#3B2A1A" stroke-width="3"><circle cx="82" cy="110" r="14"/><circle cx="118" cy="110" r="14"/><path d="M96 110 L104 110" fill="none"/></g>` },
  { id: 'shades', cat: 'glasses', name: 'Sunglasses', price: 50, svg: `<rect x="64" y="100" width="33" height="21" rx="9" fill="#22222A"/><rect x="103" y="100" width="33" height="21" rx="9" fill="#22222A"/><path d="M96 106 L104 106" stroke="#22222A" stroke-width="4"/><path d="M70 105 L78 105 M109 105 L117 105" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>` },
  { id: 'hearts', cat: 'glasses', name: 'Heart glasses', price: 90, svg: `${heart(82, 111, 1.5, '#FF5C8A')}${heart(118, 111, 1.5, '#FF5C8A')}<path d="M94 108 L106 108" stroke="#D93A6B" stroke-width="3"/>` },
  // Neck
  { id: 'bowtie', cat: 'neck', name: 'Bow tie', price: 30, svg: `<path d="M100 152 L82 142 L82 162Z M100 152 L118 142 L118 162Z" fill="#5B8DEF" stroke="#3E6BC4" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="152" r="5" fill="#7FA8FF" stroke="#3E6BC4" stroke-width="2"/>` },
  { id: 'scarf', cat: 'neck', name: 'Scarf', price: 40, svg: `<g clip-path="url(#pb)"><rect x="40" y="141" width="120" height="16" fill="#E8554E"/><path d="M60 141 V157 M80 141 V157 M100 141 V157 M120 141 V157 M140 141 V157" stroke="#FFD9A0" stroke-width="3"/></g><rect x="112" y="150" width="16" height="32" rx="4" fill="#E8554E"/><path d="M112 170 H128 M112 176 H128" stroke="#FFD9A0" stroke-width="3"/>` },
  { id: 'pearls', cat: 'neck', name: 'Pearls', price: 60, svg: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const t = i / 8, x = 62 + t * 76, y = 144 + Math.sin(t * Math.PI) * 14; return `<circle cx="${x}" cy="${y.toFixed(1)}" r="5" fill="#FFFDF8" stroke="#D8CDBE" stroke-width="1.5"/>`; }).join('') },
  // Outfits
  { id: 'startee', cat: 'outfit', name: 'Star T-shirt', price: 60, svg: `<g clip-path="url(#pb)"><rect x="40" y="140" width="120" height="62" fill="#2F5DA8"/><rect x="40" y="138" width="120" height="6" fill="#244A87"/></g>${star(100, 168, 1.3, '#FFD23F')}` },
  { id: 'sweater', cat: 'outfit', name: 'Cozy sweater', price: 70, svg: `<g clip-path="url(#pb)"><rect x="40" y="142" width="120" height="60" fill="#7CC6A4"/><path d="M40 156 H160 M40 172 H160" stroke="#FFF7E8" stroke-width="5" stroke-dasharray="8 6"/><rect x="40" y="140" width="120" height="7" fill="#5DAA88"/></g>` },
  { id: 'tutu', cat: 'outfit', name: 'Tutu', price: 80, svg: `<path d="M46 164 Q100 150 154 164 L166 190 L150 182 L138 195 L123 184 L108 197 L93 184 L78 196 L64 183 L50 192 L35 188Z" fill="#FFB3D1" stroke="#F58BB7" stroke-width="2" stroke-linejoin="round" opacity=".95"/><g clip-path="url(#pb)"><rect x="40" y="158" width="120" height="9" fill="#FF7FAE"/></g>` },
  { id: 'cape', cat: 'outfit', name: 'Hero cape', price: 120, back: `<path d="M62 92 Q16 150 30 206 L100 190 L170 206 Q184 150 138 92Z" fill="#D7263D" stroke="#A81B2E" stroke-width="2.5" stroke-linejoin="round"/>`, svg: `<g clip-path="url(#pb)"><rect x="40" y="141" width="120" height="8" fill="#D7263D"/></g>${star(100, 146, 0.9, '#FFD23F')}` },
  // Hand
  { id: 'flower', cat: 'hand', name: 'Flower', price: 20, svgR: `<path d="M172 150 Q170 132 176 116" stroke="#5FA644" stroke-width="3.5" fill="none" stroke-linecap="round"/>${flower(176, 110, 7, '#FFC84A', '#E8554E')}` },
  { id: 'mug', cat: 'hand', name: 'Coffee mug', price: 30, svgL: `<path d="M24 144 Q35 144 35 151 Q35 158 24 158" stroke="#3E6BC4" stroke-width="4" fill="none"/><rect x="3" y="139" width="22" height="23" rx="4" fill="#5B8DEF"/><path d="M9 133 Q12 129 9 125 M18 133 Q21 129 18 125" stroke="#B9B2A8" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  { id: 'balloon', cat: 'hand', name: 'Balloon', price: 35, svgR: `<path d="M172 150 Q184 120 182 82" stroke="#8A7A6A" stroke-width="1.8" fill="none"/><ellipse cx="182" cy="62" rx="15" ry="19" fill="#FF6B6B"/><path d="M179 80 L185 80 L182 86Z" fill="#FF6B6B"/><ellipse cx="176" cy="54" rx="3.5" ry="6" fill="#fff" opacity=".5"/>` },
  { id: 'icecream', cat: 'hand', name: 'Ice cream', price: 45, svgR: `<path d="M163 130 L181 130 L172 156Z" fill="#E0A458" stroke="#C4863A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="172" cy="123" r="11" fill="#FFB3D1"/><circle cx="172" cy="111" r="3.5" fill="#D7263D"/>` },
  { id: 'dumbbell', cat: 'hand', name: 'Dumbbell', price: 60, svgL: `<path d="M14 150 H46" stroke="#777" stroke-width="5" stroke-linecap="round"/><rect x="8" y="138" width="10" height="24" rx="3" fill="#444"/><rect x="42" y="138" width="10" height="24" rx="3" fill="#444"/>` },
  { id: 'wand', cat: 'hand', name: 'Magic wand', price: 100, svgR: `<path d="M172 150 L187 118" stroke="#8C6BD9" stroke-width="4" stroke-linecap="round"/>${star(189, 110, 1.2, '#FFD23F')}${star(170, 100, 0.4, '#FFE98A')}${star(196, 132, 0.35, '#FFE98A')}` },
  // Scenery (the garden's sky and ground)
  { id: 'meadow', cat: 'bg', name: 'Meadow', price: 0 },
  { id: 'sunset', cat: 'bg', name: 'Sunset', price: 50 },
  { id: 'night', cat: 'bg', name: 'Starry night', price: 80 },
  { id: 'beach', cat: 'bg', name: 'Beach', price: 100 },

  // Garden things. x/y = where the base of the item stands in the 360 x 400 garden. box = thumbnail crop.
  { id: 'oak', cat: 'garden', sub: 'Trees', name: 'Oak tree', price: 40, x: 40, y: 208, layer: 1, box: '-50 -112 100 116', svg: tree('#8BCB6B', '#74B957') },
  { id: 'pine', cat: 'garden', sub: 'Trees', name: 'Pine tree', price: 40, x: 104, y: 207, layer: 1, box: '-50 -106 100 110', svg: `<rect x="-4" y="-18" width="8" height="20" fill="#A9794B"/><path d="M-27 -16 L0 -62 L27 -16Z" fill="#4F9A63"/><path d="M-22 -42 L0 -84 L22 -42Z" fill="#5BAA70"/><path d="M-16 -66 L0 -100 L16 -66Z" fill="#69B97D"/>` },
  { id: 'autumn', cat: 'garden', sub: 'Trees', name: 'Autumn tree', price: 60, x: 262, y: 207, layer: 1, box: '-50 -112 100 116', svg: tree('#F5A742', '#E88E2D') },
  { id: 'blossom', cat: 'garden', sub: 'Trees', name: 'Blossom tree', price: 80, x: 322, y: 208, layer: 1, box: '-50 -112 100 116', svg: tree('#F9BDD7', '#F29AC1', `<g fill="#fff"><circle cx="-10" cy="-86" r="3"/><circle cx="12" cy="-74" r="3"/><circle cx="-24" cy="-60" r="2.5"/><circle cx="24" cy="-56" r="2.5"/><circle cx="2" cy="-98" r="2.5"/></g>`) },
  { id: 'daisies', cat: 'garden', sub: 'Flowers', name: 'Daisies', price: 20, x: 38, y: 388, box: '-30 -42 60 46', svg: stem(-12, 0, -12, -16) + stem(0, 0, 0, -26) + stem(12, 0, 12, -14) + flower(-12, -18, 5, '#fff', '#FFD23F') + flower(0, -28, 5.5, '#fff', '#FFD23F') + flower(12, -16, 5, '#fff', '#FFD23F') },
  { id: 'tulips', cat: 'garden', sub: 'Flowers', name: 'Tulips', price: 30, x: 338, y: 356, box: '-30 -52 60 56', svg: tulip(-13, -22, '#FF6B8B') + tulip(0, -32, '#FFC93C') + tulip(13, -24, '#E8554E') },
  { id: 'sunflower', cat: 'garden', sub: 'Flowers', name: 'Sunflower', price: 30, x: 20, y: 352, box: '-36 -84 72 88', svg: stem(0, 0, 0, -56, 4) + `<ellipse cx="-9" cy="-24" rx="9" ry="4.5" fill="#6DBE5A" transform="rotate(25 -9 -24)"/><ellipse cx="9" cy="-34" rx="9" ry="4.5" fill="#6DBE5A" transform="rotate(-25 9 -34)"/>` + flower(0, -62, 12, '#FFC93C', '#7A4A21', 10) },
  { id: 'lavender', cat: 'garden', sub: 'Flowers', name: 'Lavender', price: 40, x: 312, y: 398, box: '-30 -48 60 52', svg: [-16, -8, 0, 8, 16].map(d => stem(d * 0.3, 0, d, -30, 2) + [0, 1, 2, 3].map(k => `<circle cx="${(d * (1 + k * 0.04)).toFixed(1)}" cy="${-30 - k * 4}" r="${3.4 - k * 0.5}" fill="#9B7BE0"/>`).join('')).join('') },
  { id: 'roses', cat: 'garden', sub: 'Flowers', name: 'Rose bush', price: 50, x: 40, y: 392, box: '-36 -42 72 46', svg: `<circle cx="-14" cy="-10" r="13" fill="#5FAE55"/><circle cx="14" cy="-10" r="13" fill="#5FAE55"/><circle cx="0" cy="-18" r="18" fill="#6DBE5A"/>` + [[-14, -12], [0, -26], [13, -14], [-2, -10], [8, -26]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#E8456B"/><circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#FF8FA8"/>`).join('') },
  { id: 'mushrooms', cat: 'garden', sub: 'Decorations', name: 'Mushrooms', price: 25, x: 288, y: 374, box: '-26 -34 52 38', svg: `<rect x="-10" y="-14" width="8" height="15" rx="3" fill="#FFF3E0"/><path d="M-20 -12 Q-6 -36 8 -12Z" fill="#E8554E"/><circle cx="-8" cy="-20" r="2.5" fill="#fff"/><circle cx="-1" cy="-15" r="1.8" fill="#fff"/><rect x="9" y="-8" width="6" height="9" rx="2.5" fill="#FFF3E0"/><path d="M3 -7 Q12 -22 21 -7Z" fill="#E8554E"/><circle cx="12" cy="-11" r="1.8" fill="#fff"/>` },
  { id: 'pumpkin', cat: 'garden', sub: 'Decorations', name: 'Pumpkin', price: 35, x: 206, y: 393, box: '-26 -30 52 34', svg: `<ellipse cx="-9" cy="-10" rx="9" ry="10.5" fill="#EE8A2B"/><ellipse cx="9" cy="-10" rx="9" ry="10.5" fill="#EE8A2B"/><ellipse cx="0" cy="-10" rx="9" ry="11.5" fill="#F7A043"/><rect x="-2" y="-26" width="4" height="7" rx="1.5" fill="#5FA644"/>` },
  { id: 'butterfly', cat: 'garden', sub: 'Decorations', name: 'Butterfly', price: 45, x: 62, y: 262, box: '-20 -18 40 32', svg: `<ellipse cx="-7" cy="-5" rx="7" ry="9" fill="#C58BF2" transform="rotate(-20 -7 -5)"/><ellipse cx="7" cy="-5" rx="7" ry="9" fill="#C58BF2" transform="rotate(20 7 -5)"/><ellipse cx="-5" cy="6" rx="4.5" ry="5.5" fill="#F29AC1"/><ellipse cx="5" cy="6" rx="4.5" ry="5.5" fill="#F29AC1"/><path d="M0 -8 L0 9" stroke="#3B2A1A" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'gnome', cat: 'garden', sub: 'Decorations', name: 'Garden gnome', price: 60, x: 92, y: 302, box: '-26 -68 52 72', svg: `<ellipse cx="-6" cy="0" rx="6" ry="3" fill="#5A4636"/><ellipse cx="6" cy="0" rx="6" ry="3" fill="#5A4636"/><path d="M-13 0 Q-15 -22 0 -24 Q15 -22 13 0Z" fill="#4A78C2"/><circle cx="0" cy="-28" r="8.5" fill="#F6C9A0"/><path d="M-10 -27 Q0 0 10 -27 Q0 -20 -10 -27Z" fill="#fff"/><circle cx="0" cy="-26" r="2.4" fill="#EFA98A"/><circle cx="-3.5" cy="-30" r="1.2" fill="#3B2A1A"/><circle cx="3.5" cy="-30" r="1.2" fill="#3B2A1A"/><path d="M-11 -33 Q-2 -52 2 -64 Q6 -48 11 -33Z" fill="#E8554E"/>` },
  { id: 'birdbath', cat: 'garden', sub: 'Decorations', name: 'Bird bath', price: 70, x: 46, y: 306, box: '-30 -54 60 58', svg: `<ellipse cx="0" cy="0" rx="14" ry="4" fill="#B7BDC7"/><rect x="-4" y="-28" width="8" height="28" fill="#C9CED6"/><path d="M-22 -33 Q0 -14 22 -33Z" fill="#C9CED6"/><ellipse cx="0" cy="-33" rx="21" ry="4.5" fill="#8FD3F4"/><circle cx="11" cy="-41" r="5.5" fill="#FFB347"/><circle cx="15" cy="-45" r="3.5" fill="#FFB347"/><path d="M18 -45 L22 -44 L18 -43Z" fill="#E8554E"/><circle cx="16" cy="-46" r="0.8" fill="#3B2A1A"/>` },
  { id: 'bunny', cat: 'garden', sub: 'Decorations', name: 'Bunny', price: 90, x: 128, y: 391, box: '-26 -50 52 54', svg: `<g fill="#fff" stroke="#DDD3C6" stroke-width="1.5"><ellipse cx="5" cy="-36" rx="3.2" ry="9.5"/><ellipse cx="12" cy="-35" rx="3.2" ry="9.5" transform="rotate(14 12 -35)"/><circle cx="-12" cy="-9" r="4.5"/><ellipse cx="0" cy="-10" rx="12.5" ry="10"/><circle cx="9" cy="-22" r="8.5"/></g><circle cx="12" cy="-23" r="1.4" fill="#3B2A1A"/><circle cx="17" cy="-20" r="1.3" fill="#FF9CC2"/>` },
  { id: 'house', cat: 'garden', sub: 'Decorations', name: 'Little house', price: 120, x: 172, y: 176, layer: 1, box: '-30 -50 60 54', svg: `<rect x="-18" y="-24" width="36" height="26" fill="#FFF1D6"/><path d="M-24 -23 L0 -45 L24 -23Z" fill="#D7694A"/><rect x="-5" y="-13" width="9" height="15" rx="2" fill="#8C5A32"/><rect x="7" y="-18" width="8" height="8" fill="#9ED8F5" stroke="#fff" stroke-width="1.2"/>` },
  { id: 'rainbow', cat: 'garden', sub: 'Decorations', name: 'Rainbow', price: 150, x: 250, y: 212, layer: 0, box: '-80 -80 160 86', svg: ['#F06A5E', '#FFB347', '#FFE066', '#7CC55A', '#6FA8F5', '#B58BF2'].map((c, k) => { const r = 74 - k * 7; return `<path d="M${-r} 0 A${r} ${r} 0 0 1 ${r} 0" fill="none" stroke="${c}" stroke-width="7.4"/>`; }).join('') },

  // Complete costumes (worn instead of hat, neck and outfit)
  { id: 'santa', cat: 'costume', name: 'Santa', price: 220, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#D7263D"/><rect x="40" y="170" width="120" height="9" fill="#2B2B33"/>`) + `<rect x="93" y="168" width="14" height="13" rx="2" fill="none" stroke="#FFD23F" stroke-width="3"/><path d="M64 126 Q66 166 100 170 Q134 166 136 126 Q120 149 100 149 Q80 149 64 126Z" fill="#fff" stroke="#E6E0D6" stroke-width="1.5"/><path d="M56 76 Q56 30 100 30 Q146 30 164 90 L150 88 Q144 66 144 76Z" fill="#D7263D"/><rect x="52" y="66" width="96" height="15" rx="7.5" fill="#fff" stroke="#E6E0D6" stroke-width="1.5"/><circle cx="159" cy="92" r="9" fill="#fff" stroke="#E6E0D6" stroke-width="1.5"/>` },
  { id: 'reindeer', cat: 'costume', name: 'Reindeer', price: 180, svg: `<g stroke="#8C5A32" stroke-width="6" stroke-linecap="round" fill="none"><path d="M80 62 Q72 44 62 32 M73 48 Q64 46 56 48 M68 40 Q70 30 76 24"/><path d="M120 62 Q128 44 138 32 M127 48 Q136 46 144 48 M132 40 Q130 30 124 24"/></g><ellipse cx="54" cy="80" rx="11" ry="6" fill="#C9944C" stroke="#B07D3C" stroke-width="2" transform="rotate(-25 54 80)"/><ellipse cx="146" cy="80" rx="11" ry="6" fill="#C9944C" stroke="#B07D3C" stroke-width="2" transform="rotate(25 146 80)"/><circle cx="100" cy="120" r="6.5" fill="#E0463C"/><circle cx="98" cy="118" r="2" fill="#fff" opacity=".7"/>` + wear(`<rect x="40" y="148" width="120" height="9" fill="#D7263D"/>`) + `<circle cx="100" cy="161" r="6" fill="#FFD23F" stroke="#E0A800" stroke-width="1.5"/>` },
  { id: 'elf', cat: 'costume', name: 'Christmas elf', price: 180, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#3FA35B"/><path d="M40 146 L52 160 L64 146 L76 160 L88 146 L100 160 L112 146 L124 160 L136 146 L148 160 L160 146Z" fill="#D7263D"/><rect x="40" y="176" width="120" height="8" fill="#2B2B33"/>`) + `<rect x="93" y="174" width="14" height="12" rx="2" fill="none" stroke="#FFD23F" stroke-width="3"/><path d="M60 74 Q70 32 122 12 Q112 46 140 74Z" fill="#3FA35B"/><rect x="54" y="66" width="92" height="13" rx="6.5" fill="#D7263D"/><circle cx="123" cy="12" r="5.5" fill="#FFD23F"/>` },
  { id: 'witch', cat: 'costume', name: 'Witch', price: 200, propL: `<path d="M20 112 L42 204" stroke="#8C5A32" stroke-width="5" stroke-linecap="round"/><path d="M34 196 L26 216 L58 212 L48 194Z" fill="#E8B84A" stroke="#C4902A" stroke-width="1.5"/>`, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#4B3570"/><rect x="40" y="146" width="120" height="7" fill="#F28A2B"/>`) + star(100, 178, 1, '#FFD23F') + `<ellipse cx="100" cy="66" rx="58" ry="10" fill="#3B2A55"/><path d="M70 64 Q94 32 124 4 Q118 40 132 64Z" fill="#4B3570"/><path d="M73 55 Q100 64 130 55 L131 64 Q100 72 70 64Z" fill="#F28A2B"/>` },
  { id: 'vampire', cat: 'costume', name: 'Vampire', price: 220, back: `<path d="M58 96 Q14 150 28 206 L100 190 L172 206 Q186 150 142 96Z" fill="#2B2B33"/><path d="M52 122 L32 82 L68 104Z M148 122 L168 82 L132 104Z" fill="#B3202F"/>`, svg: `<path d="M58 86 Q60 56 100 56 Q140 56 142 86 Q124 68 100 82 Q76 68 58 86Z" fill="#2B2B33"/><path d="M93 128 L96 136 L99 128Z M101 128 L104 136 L107 128Z" fill="#fff"/>` + wear(`<rect x="40" y="146" width="120" height="60" fill="#2B2B33"/><path d="M86 146 L100 170 L114 146Z" fill="#fff"/>`) + `<path d="M100 152 L86 144 L86 160Z M100 152 L114 144 L114 160Z" fill="#B3202F"/><circle cx="100" cy="152" r="4" fill="#D7263D"/>` },
  { id: 'pumpkinsuit', cat: 'costume', name: 'Pumpkin', price: 180, svg: `<ellipse cx="100" cy="174" rx="64" ry="31" fill="#F28A2B" stroke="#D9701A" stroke-width="2.5"/><path d="M78 146 Q64 174 78 203 M100 143 V205 M122 146 Q136 174 122 203" stroke="#D9701A" stroke-width="2.5" fill="none"/><path d="M80 164 L88 176 L72 176Z M120 164 L128 176 L112 176Z" fill="#3B2A1A"/><path d="M80 186 L88 192 L96 186 L104 192 L112 186 L120 192" stroke="#3B2A1A" stroke-width="3" fill="none"/><rect x="94" y="42" width="12" height="20" rx="4" fill="#5FA644"/><path d="M104 50 Q124 36 134 52 Q118 60 104 50Z" fill="#7CC55A"/>` },
  { id: 'hero', cat: 'costume', name: 'Superhero', price: 250, back: `<path d="M62 92 Q16 150 30 206 L100 190 L170 206 Q184 150 138 92Z" fill="#2F5DA8" stroke="#244A87" stroke-width="2.5" stroke-linejoin="round"/>`, svg: wear(`<rect x="40" y="99" width="120" height="23" fill="#2F5DA8"/><rect x="40" y="146" width="120" height="60" fill="#D7263D"/><rect x="40" y="176" width="120" height="8" fill="#FFD23F"/>`) + `<ellipse cx="82" cy="110.5" rx="9.5" ry="7.5" fill="#fff"/><ellipse cx="118" cy="110.5" rx="9.5" ry="7.5" fill="#fff"/><circle cx="82" cy="111" r="4" fill="#3B2A1A"/><circle cx="118" cy="111" r="4" fill="#3B2A1A"/><circle cx="100" cy="162" r="10" fill="#FFD23F"/><path d="M102 154 L95 163 L100 163 L98 170 L105 161 L100 161Z" fill="#D7263D"/>` },
  { id: 'pirate', cat: 'costume', name: 'Pirate', price: 220, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#fff"/><path d="M40 154 H160 M40 168 H160 M40 182 H160 M40 196 H160" stroke="#D7263D" stroke-width="6"/>`) + `<path d="M56 92 L146 100" stroke="#2B2B33" stroke-width="3"/><circle cx="118" cy="110" r="10.5" fill="#2B2B33"/><path d="M46 72 Q58 28 100 34 Q142 28 154 72 Q100 52 46 72Z" fill="#2B2B33"/><path d="M90 58 L110 44 M90 44 L110 58" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="100" cy="50" r="6" fill="#fff"/>`, propL: `<path d="M30 150 Q15 150 17 138 Q19 129 28 134" stroke="#9AA3AD" stroke-width="4" fill="none" stroke-linecap="round"/>` },
  { id: 'astronaut', cat: 'costume', name: 'Astronaut', price: 260, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#F2F4F7"/><rect x="40" y="146" width="120" height="6" fill="#C9D3DB"/>`) + `<rect x="84" y="162" width="32" height="20" rx="4" fill="#C9D3DB"/><circle cx="92" cy="172" r="3.5" fill="#E0463C"/><circle cx="102" cy="172" r="3.5" fill="#37D67A"/><circle cx="111" cy="172" r="2.5" fill="#6FA8F5"/><path d="M100 42 V27" stroke="#C9D3DB" stroke-width="4"/><circle cx="100" cy="23" r="5" fill="#E0463C"/><circle cx="100" cy="100" r="60" fill="rgba(180,220,255,.22)" stroke="#E3E8EE" stroke-width="6"/><path d="M62 70 Q74 52 92 48" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>` },
  { id: 'princess', cat: 'costume', name: 'Princess', price: 240, svg: `<path d="M58 152 Q100 142 142 152 L174 204 Q100 216 26 204Z" fill="#F7A8D0" stroke="#E57FB6" stroke-width="2" stroke-linejoin="round"/><path d="M50 196 Q100 206 150 196" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>` + wear(`<rect x="40" y="141" width="120" height="14" fill="#E57FB6"/>`) + `<path d="M80 64 L76 44 L90 54 L100 38 L110 54 L124 44 L120 64Z" fill="#FFD23F" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="55" r="4" fill="#FF5C8A"/>` },
  { id: 'bee', cat: 'costume', name: 'Bumblebee', price: 200, back: `<ellipse cx="38" cy="118" rx="22" ry="30" fill="#DDF3FF" stroke="#B5DDF5" stroke-width="2" transform="rotate(-20 38 118)"/><ellipse cx="162" cy="118" rx="22" ry="30" fill="#DDF3FF" stroke="#B5DDF5" stroke-width="2" transform="rotate(20 162 118)"/>`, svg: wear(`<rect x="40" y="146" width="120" height="60" fill="#FFD23F"/><path d="M40 157 H160 M40 177 H160 M40 197 H160" stroke="#2B2B33" stroke-width="9"/>`) + `<path d="M86 62 Q80 42 70 36 M114 62 Q120 42 130 36" stroke="#2B2B33" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="69" cy="35" r="5" fill="#2B2B33"/><circle cx="131" cy="35" r="5" fill="#2B2B33"/>` },
  { id: 'trader', cat: 'costume', name: 'Trader', price: 250, svg: wear(`<rect x="40" y="142" width="120" height="64" fill="#1F2A44"/><path d="M82 142 L100 176 L118 142Z" fill="#fff"/><path d="M82 142 L100 176 M118 142 L100 176" stroke="#141C30" stroke-width="3"/>`) + `<path d="M96 146 L104 146 L106 166 L100 175 L94 166Z" fill="#D7263D"/><path d="M56 100 Q54 52 100 52 Q146 52 144 100" stroke="#2B2B33" stroke-width="5" fill="none"/><rect x="48" y="92" width="13" height="22" rx="6" fill="#2B2B33"/><rect x="139" y="92" width="13" height="22" rx="6" fill="#2B2B33"/><path d="M54 114 Q58 138 78 140" stroke="#2B2B33" stroke-width="3" fill="none"/><circle cx="80" cy="140" r="4" fill="#2B2B33"/>`, propL: `<rect x="2" y="112" width="42" height="36" rx="5" fill="#10192E" stroke="#2F3B5C" stroke-width="2"/><path d="M8 140 L16 131 L22 135 L30 123 L38 117" stroke="#37D67A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 117 L31 117 M38 117 L38 124" stroke="#37D67A" stroke-width="3" stroke-linecap="round"/>` },
  { id: 'seller', cat: 'costume', name: 'Etsy seller', price: 250, svg: wear(`<path d="M80 134 L72 150 M120 134 L128 150" stroke="#D9530F" stroke-width="5"/><rect x="58" y="148" width="84" height="60" rx="6" fill="#F1641E"/>`) + `<rect x="86" y="166" width="28" height="18" rx="4" fill="#D9530F"/>${heart(100, 175, 0.55, '#fff')}<path d="M58 82 Q60 54 100 54 Q140 54 142 82 Q100 66 58 82Z" fill="#F7C8D8" stroke="#E79CB8" stroke-width="1.5"/><path d="M140 76 L156 70 L152 86Z" fill="#F7C8D8" stroke="#E79CB8" stroke-width="1.5" stroke-linejoin="round"/>`, propL: `<rect x="4" y="126" width="36" height="30" rx="3" fill="#D9A766" stroke="#B5803F" stroke-width="2"/><rect x="19" y="126" width="6" height="30" fill="#F2E2C4"/>${heart(32, 147, 0.38, '#E0463C')}` },

  // Pets (one at a time; they stand next to the potato in the garden)
  { id: 'cat', cat: 'pet', name: 'Cat', price: 160, box: '-28 -52 56 56', svg: `<path d="M13 -8 Q28 -12 23 -30" stroke="#F2A65A" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="14" ry="12" fill="#F2A65A"/><path d="M-10 -36 L-9 -47 L-1 -40Z M10 -36 L9 -47 L1 -40Z" fill="#F2A65A"/><circle cx="0" cy="-30" r="11.5" fill="#F7B878"/><path d="M-4 -40 V-36 M0 -41 V-36 M4 -40 V-36" stroke="#D98636" stroke-width="1.6" stroke-linecap="round"/><circle cx="-4.5" cy="-31" r="1.7" fill="#3B2A1A"/><circle cx="4.5" cy="-31" r="1.7" fill="#3B2A1A"/><path d="M-1.6 -27 L1.6 -27 L0 -25Z" fill="#FF8FA8"/><path d="M-6 -26 L-15 -28 M-6 -24.5 L-15 -23.5 M6 -26 L15 -28 M6 -24.5 L15 -23.5" stroke="#3B2A1A" stroke-width=".8"/>` },
  { id: 'dog', cat: 'pet', name: 'Puppy', price: 160, box: '-28 -50 56 54', svg: `<path d="M-13 -12 Q-24 -18 -22 -28" stroke="#C98F5A" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="15" ry="12" fill="#C98F5A"/><ellipse cx="0" cy="-8" rx="8" ry="7" fill="#F3E0C4"/><circle cx="0" cy="-30" r="11.5" fill="#D9A873"/><ellipse cx="-11.5" cy="-29" rx="5" ry="9.5" fill="#8C5A32" transform="rotate(12 -11.5 -29)"/><ellipse cx="11.5" cy="-29" rx="5" ry="9.5" fill="#8C5A32" transform="rotate(-12 11.5 -29)"/><ellipse cx="0" cy="-26" rx="5.5" ry="4.5" fill="#F3E0C4"/><circle cx="-4.5" cy="-32" r="1.8" fill="#3B2A1A"/><circle cx="4.5" cy="-32" r="1.8" fill="#3B2A1A"/><ellipse cx="0" cy="-27.5" rx="2.4" ry="1.8" fill="#3B2A1A"/><path d="M-1.5 -23.5 Q0 -19 1.5 -23.5Z" fill="#FF8FA8"/>` },
  { id: 'hedgehog', cat: 'pet', name: 'Hedgehog', price: 150, box: '-28 -40 56 44', svg: `<path d="M-20 0 L-22 -8 L-17 -9 L-19 -17 L-13 -16 L-13 -24 L-7 -21 L-4 -28 L1 -23 L6 -28 L8 -21 L14 -22 L13 -15 Q18 -8 14 0Z" fill="#8C6B4A"/><path d="M4 0 Q4 -16 16 -14 Q25 -9 24 -4 Q20 0 14 0Z" fill="#F0D2A8"/><circle cx="15" cy="-8.5" r="1.6" fill="#3B2A1A"/><circle cx="24" cy="-4.5" r="2" fill="#3B2A1A"/><ellipse cx="-8" cy="0" rx="4" ry="2" fill="#6E5238"/><ellipse cx="8" cy="0" rx="4" ry="2" fill="#6E5238"/>` },
  { id: 'duck', cat: 'pet', name: 'Duckling', price: 150, box: '-26 -42 52 46', svg: `<path d="M-4 -1 L-8 2 M-4 -1 L-1 2 M5 -1 L2 2 M5 -1 L9 2" stroke="#F28A2B" stroke-width="2" stroke-linecap="round"/><ellipse cx="0" cy="-11" rx="14" ry="10.5" fill="#FFD95A"/><path d="M-13 -13 Q-22 -18 -18 -8Z" fill="#FFD95A"/><ellipse cx="-2" cy="-10" rx="7" ry="5" fill="#F7C63A"/><circle cx="8" cy="-25" r="8.5" fill="#FFD95A"/><path d="M15 -26 L24 -23.5 L15 -21Z" fill="#F28A2B"/><circle cx="10" cy="-27" r="1.6" fill="#3B2A1A"/>` },
  { id: 'fox', cat: 'pet', name: 'Little fox', price: 200, box: '-30 -52 60 56', svg: `<path d="M12 -8 Q30 -6 26 -26 Q20 -14 12 -16Z" fill="#E8742A"/><path d="M26 -26 Q25 -19 21 -17 Q24 -22 26 -26Z" fill="#fff"/><ellipse cx="0" cy="-12" rx="13" ry="12" fill="#E8742A"/><ellipse cx="0" cy="-8" rx="7" ry="7" fill="#fff"/><path d="M-12 -34 L-11 -48 L-2 -40Z M12 -34 L11 -48 L2 -40Z" fill="#E8742A"/><path d="M-12 -32 Q0 -44 12 -32 Q8 -20 0 -18 Q-8 -20 -12 -32Z" fill="#F08A3C"/><path d="M-12 -32 Q-5 -26 0 -18 Q5 -26 12 -32 Q8 -20 0 -18 Q-8 -20 -12 -32Z" fill="#fff"/><circle cx="-4.5" cy="-31" r="1.7" fill="#3B2A1A"/><circle cx="4.5" cy="-31" r="1.7" fill="#3B2A1A"/><circle cx="0" cy="-19.5" r="2" fill="#3B2A1A"/>` },

  // Big garden things
  { id: 'treeswing', cat: 'garden', sub: 'Fun & relax', name: 'Tree swing', price: 180, x: 26, y: 300, box: '-52 -152 116 156', svg: `<rect x="-8" y="-100" width="16" height="102" rx="4" fill="#A9794B"/><path d="M0 -80 Q28 -90 56 -84" stroke="#A9794B" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="-18" cy="-100" r="23" fill="#74B957"/><circle cx="26" cy="-106" r="25" fill="#74B957"/><circle cx="2" cy="-118" r="31" fill="#8BCB6B"/><path d="M36 -86 V-36 M50 -85 V-36" stroke="#C9B28F" stroke-width="2"/><rect x="30" y="-37" width="26" height="6" rx="2" fill="#D7694A"/>` },
  { id: 'swingset', cat: 'garden', sub: 'Fun & relax', name: 'Swing set', price: 160, x: 180, y: 476, box: '-44 -76 88 80', svg: `<g stroke="#D7694A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M-36 0 L-25 -66 L-14 0 M36 0 L25 -66 L14 0 M-25 -66 H25"/></g><path d="M-9 -66 V-22 M9 -66 V-22" stroke="#9AA3AD" stroke-width="2"/><rect x="-13" y="-23" width="26" height="6" rx="2" fill="#F2C230"/>` },
  { id: 'sauna', cat: 'garden', sub: 'Fun & relax', name: 'Sauna', price: 240, x: 58, y: 472, box: '-52 -88 104 92', svg: `<rect x="-40" y="-48" width="80" height="50" fill="#C98F5A"/><path d="M-40 -36 H40 M-40 -24 H40 M-40 -12 H40" stroke="#B07D4A" stroke-width="1.5"/><path d="M-48 -46 L0 -72 L48 -46Z" fill="#8C5A32"/><rect x="18" y="-74" width="9" height="16" fill="#6E5238"/><path d="M22 -78 Q17 -84 22 -90 M28 -80 Q33 -86 28 -92" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".85"/><rect x="-13" y="-36" width="26" height="38" rx="2" fill="#7A4A21"/><rect x="-7" y="-30" width="14" height="12" rx="2" fill="#FFE9A8"/><circle cx="8" cy="-12" r="1.8" fill="#FFD23F"/><rect x="22" y="-34" width="12" height="10" rx="2" fill="#FFE9A8"/>` },
  { id: 'jacuzzi', cat: 'garden', sub: 'Fun & relax', name: 'Jacuzzi', price: 220, x: 296, y: 478, box: '-52 -74 104 86', svg: `<path d="M-46 -30 L-46 -8 Q0 14 46 -8 L46 -30Z" fill="#B07D4A"/><path d="M-30 -22 V2 M-10 -18 V7 M10 -18 V7 M30 -22 V2" stroke="#8C5A32" stroke-width="1.5"/><ellipse cx="0" cy="-30" rx="46" ry="16" fill="#D9A766"/><ellipse cx="0" cy="-30" rx="39" ry="12" fill="#8FD8EE"/><g fill="#fff" opacity=".9"><circle cx="-16" cy="-31" r="3"/><circle cx="-6" cy="-26" r="2.2"/><circle cx="8" cy="-33" r="3.2"/><circle cx="20" cy="-28" r="2.4"/><circle cx="-26" cy="-28" r="2"/></g><path d="M-14 -48 Q-20 -56 -14 -64 M4 -50 Q-2 -58 4 -66 M22 -48 Q16 -56 22 -64" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>` },
  { id: 'pool', cat: 'garden', sub: 'Fun & relax', name: 'Swimming pool', price: 250, x: 110, y: 550, box: '-92 -62 184 70', svg: `<ellipse cx="0" cy="-26" rx="84" ry="26" fill="#EEF2F5" stroke="#C9D3DB" stroke-width="2"/><ellipse cx="0" cy="-26" rx="76" ry="21" fill="#6FCBEA"/><path d="M-50 -30 Q-42 -35 -34 -30 T-18 -30 M10 -18 Q18 -23 26 -18 T42 -18 M-20 -14 Q-12 -19 -4 -14" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/><circle cx="34" cy="-32" r="9" fill="none" stroke="#FF7FAE" stroke-width="5.5"/><path d="M34 -41 V-36.5 M34 -27.5 V-23 M25 -32 H29.5 M38.5 -32 H43" stroke="#fff" stroke-width="2.5"/><path d="M-62 -52 V-28 M-50 -54 V-30 M-62 -44 H-50 M-62 -36 H-50" stroke="#9AA3AD" stroke-width="3" stroke-linecap="round"/>` },
  { id: 'gym', cat: 'garden', sub: 'Fun & relax', name: 'Garden gym', price: 200, x: 292, y: 552, box: '-54 -60 108 66', svg: `<rect x="-48" y="-5" width="96" height="8" rx="3" fill="#6C7A99"/><path d="M-30 -5 V-46 M2 -5 V-46" stroke="#555C68" stroke-width="4" stroke-linecap="round"/><path d="M-44 -46 H16" stroke="#9AA3AD" stroke-width="3.5" stroke-linecap="round"/><rect x="-46" y="-56" width="7" height="20" rx="2" fill="#E0463C"/><rect x="-38" y="-53" width="5" height="14" rx="2" fill="#2B2B33"/><rect x="5" y="-53" width="5" height="14" rx="2" fill="#2B2B33"/><rect x="11" y="-56" width="7" height="20" rx="2" fill="#E0463C"/><rect x="-34" y="-22" width="40" height="7" rx="3" fill="#2B2B33"/><path d="M-28 -15 V-5 M0 -15 V-5" stroke="#555C68" stroke-width="3"/><path d="M26 -18 Q26 -26 33 -26 Q40 -26 40 -18" stroke="#2B2B33" stroke-width="3.5" fill="none"/><circle cx="33" cy="-12" r="8.5" fill="#2B2B33"/><circle cx="30" cy="-14" r="2" fill="#fff" opacity=".35"/>` },

  // Fences and ground (one of each)
  { id: 'picket', cat: 'fence', name: 'White picket', price: 0 },
  { id: 'wood', cat: 'fence', name: 'Wooden fence', price: 80 },
  { id: 'hedge', cat: 'fence', name: 'Hedge', price: 100 },
  { id: 'stone', cat: 'fence', name: 'Stone wall', price: 120 },
  { id: 'lawn', cat: 'ground', name: 'Plain grass', price: 0 },
  { id: 'stripes', cat: 'ground', name: 'Mowed stripes', price: 60 },
  { id: 'meadowflowers', cat: 'ground', name: 'Flower meadow', price: 90 },
  { id: 'leaves', cat: 'ground', name: 'Autumn leaves', price: 90 },
  { id: 'snow', cat: 'ground', name: 'Snow', price: 120 },

  // Hair
  { id: 'hairshort', cat: 'hair', name: 'Short brown', price: 40, svg: hairCap('#6B4423') },
  { id: 'hairlong', cat: 'hair', name: 'Long blonde', price: 60, svg: hairCap('#F2C94C') + `<path d="M58 86 Q44 122 52 164 Q62 170 68 154 Q58 120 68 86Z M142 86 Q156 122 148 164 Q138 170 132 154 Q142 120 132 86Z" fill="#F2C94C"/>` },
  { id: 'hairpony', cat: 'hair', name: 'Ponytail', price: 50, svg: `<path d="M138 70 Q176 62 170 116 Q160 98 146 94Z" fill="#A0522D"/>` + hairCap('#A0522D') + `<circle cx="141" cy="76" r="5" fill="#FF7FAE"/>` },
  { id: 'hairpig', cat: 'hair', name: 'Pigtails', price: 60, svg: `<path d="M64 68 Q30 36 26 76 Q42 72 56 86Z M136 68 Q170 36 174 76 Q158 72 144 86Z" fill="#4A78C2"/>` + hairCap('#4A78C2') + `<circle cx="60" cy="74" r="4.5" fill="#FFD23F"/><circle cx="140" cy="74" r="4.5" fill="#FFD23F"/>` },
  { id: 'haircurly', cat: 'hair', name: 'Curls', price: 60, svg: [[58, 92], [142, 92], [62, 76], [138, 76], [74, 63], [126, 63], [90, 55], [110, 55], [100, 52]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="12" fill="#3B2A1A"/>`).join('') },
  { id: 'hairbun', cat: 'hair', name: 'Top bun', price: 50, svg: `<circle cx="100" cy="42" r="15" fill="#2B2B33"/>` + hairCap('#2B2B33') },
  { id: 'hairbob', cat: 'hair', name: 'Pink bob', price: 70, svg: `<path d="M52 134 Q42 54 100 48 Q158 54 148 134 Q140 140 134 130 Q142 74 100 68 Q58 74 66 130 Q60 140 52 134Z" fill="#F58BB7"/>` },
  { id: 'hairmohawk', cat: 'hair', name: 'Mohawk', price: 70, svg: `<path d="M86 66 L90 34 L96 54 L103 26 L109 54 L116 36 L116 66Z" fill="#FF4F9A" stroke="#FF4F9A" stroke-width="3" stroke-linejoin="round"/>` },
  { id: 'hairginger', cat: 'hair', name: 'Ginger waves', price: 60, svg: hairCap('#D9662B') + `<path d="M58 88 Q46 110 56 128 Q50 140 60 150 Q68 146 64 132 Q70 116 64 88Z M142 88 Q154 110 144 128 Q150 140 140 150 Q132 146 136 132 Q130 116 136 88Z" fill="#D9662B"/>` },
  // More hats, outfits, hand items
  { id: 'santahat', cat: 'hat', name: 'Santa hat', price: 60, svg: `<path d="M56 76 Q56 30 100 30 Q146 30 164 90 L150 88 Q144 66 144 76Z" fill="#D7263D"/><rect x="52" y="66" width="96" height="15" rx="7.5" fill="#fff" stroke="#E6E0D6" stroke-width="1.5"/><circle cx="159" cy="92" r="9" fill="#fff" stroke="#E6E0D6" stroke-width="1.5"/>` },
  { id: 'xmassweater', cat: 'outfit', name: 'Christmas sweater', price: 90, svg: wear(`<rect x="40" y="142" width="120" height="64" fill="#C62F3B"/><rect x="40" y="140" width="120" height="7" fill="#2E8B4E"/><path d="M40 162 L52 152 L64 162 L76 152 L88 162 L100 152 L112 162 L124 152 L136 162 L148 152 L160 162" stroke="#fff" stroke-width="3.5" fill="none"/><rect x="40" y="186" width="120" height="6" fill="#2E8B4E"/>`) + `<g fill="#fff"><circle cx="70" cy="175" r="2.4"/><circle cx="100" cy="177" r="2.4"/><circle cx="130" cy="175" r="2.4"/></g><path d="M100 164 L93 174 H107Z" fill="#2E8B4E"/>` },
  { id: 'pickle', cat: 'hand', name: 'Pickle', price: 25, svgR: `<rect x="165" y="112" width="15" height="40" rx="7.5" fill="#6FAE3C" stroke="#4E8A2A" stroke-width="2" transform="rotate(10 172 132)"/><g fill="#4E8A2A"><circle cx="171" cy="122" r="1.3"/><circle cx="176" cy="130" r="1.3"/><circle cx="170" cy="137" r="1.3"/><circle cx="174" cy="145" r="1.3"/></g>` },
  { id: 'mittens', cat: 'hand', name: 'Mittens', price: 40, svgL: mittenL('#E0463C', 10), svgR: mittenR('#E0463C', 10) },
  { id: 'boxing', cat: 'hand', name: 'Boxing gloves', price: 70, svgL: mittenL('#C62F3B', 13), svgR: mittenR('#C62F3B', 13) },
  // Shoes
  { id: 'sneakers', cat: 'shoes', name: 'Sneakers', price: 40, svg: shoePair('#fff', '#C9D3DB', `<path d="M70 203 L78 200 M130 203 L122 200" stroke="#E0463C" stroke-width="2.5" stroke-linecap="round"/>`) },
  { id: 'pinkshoes', cat: 'shoes', name: 'Pink trainers', price: 45, svg: shoePair('#FF8FB6', '#fff') },
  { id: 'slippers', cat: 'shoes', name: 'Fluffy slippers', price: 50, svg: shoePair('#F7C8D8', '#E79CB8', `<circle cx="70" cy="201" r="4.5" fill="#fff"/><circle cx="130" cy="201" r="4.5" fill="#fff"/>`) },
  { id: 'boots', cat: 'shoes', name: 'Brown boots', price: 55, svg: bootPair('#8C5A32', '#5A3A22') },
  { id: 'rainboots', cat: 'shoes', name: 'Rain boots', price: 55, svg: bootPair('#FFD23F', '#E0A800') },
  { id: 'santaboots', cat: 'shoes', name: 'Santa boots', price: 70, svg: bootPair('#2B2B33', '#000', `<rect x="70" y="184" width="21" height="7" rx="3.5" fill="#fff" stroke="#E6E0D6"/><rect x="109" y="184" width="21" height="7" rx="3.5" fill="#fff" stroke="#E6E0D6"/>`) },
  // More pets
  { id: 'pig', cat: 'pet', name: 'Piglet', price: 170, box: '-28 -50 56 54', svg: `<path d="M14 -12 Q21 -16 19 -10 Q17 -6 22 -8" stroke="#F58BA8" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="15" ry="12" fill="#F7A8C0"/><path d="M-10 -35 L-11 -45 L-3 -39Z M10 -35 L11 -45 L3 -39Z" fill="#F58BA8"/><circle cx="0" cy="-29" r="11.5" fill="#F9B9CC"/><ellipse cx="0" cy="-26" rx="5.8" ry="4.2" fill="#F58BA8"/><circle cx="-2" cy="-26" r="1.1" fill="#C45A7C"/><circle cx="2" cy="-26" r="1.1" fill="#C45A7C"/><circle cx="-4.6" cy="-32.5" r="1.7" fill="#3B2A1A"/><circle cx="4.6" cy="-32.5" r="1.7" fill="#3B2A1A"/><ellipse cx="-7" cy="0" rx="4" ry="2" fill="#F58BA8"/><ellipse cx="7" cy="0" rx="4" ry="2" fill="#F58BA8"/>` },
  { id: 'ghost', cat: 'pet', name: 'Little ghost', price: 180, box: '-26 -56 52 58', svg: `<ellipse cx="0" cy="-1" rx="11" ry="2.5" fill="rgba(0,0,0,.12)"/><path d="M-14 -8 Q-15 -50 0 -50 Q15 -50 14 -8 L9.5 -13 L4.7 -8 L0 -13 L-4.7 -8 L-9.5 -13Z" fill="#fff" stroke="#D8DEE6" stroke-width="1.5" stroke-linejoin="round" opacity=".96"/><ellipse cx="-5" cy="-34" rx="2.4" ry="3.4" fill="#3B2A1A"/><ellipse cx="5" cy="-34" rx="2.4" ry="3.4" fill="#3B2A1A"/><ellipse cx="0" cy="-26" rx="2.4" ry="2" fill="#3B2A1A"/><circle cx="-9" cy="-28" r="2.4" fill="#FFB3D1" opacity=".7"/><circle cx="9" cy="-28" r="2.4" fill="#FFB3D1" opacity=".7"/>` },
  { id: 'blackcat', cat: 'pet', name: 'Black cat', price: 170, box: '-28 -52 56 56', svg: catPet('#2B2B33', '#33333D', '#2B2B33', '#FFD23F') },
  { id: 'deer', cat: 'pet', name: 'Red-nosed reindeer', price: 200, box: '-30 -62 60 66', svg: `<path d="M-8 -2 V4 M8 -2 V4" stroke="#8C5A32" stroke-width="4" stroke-linecap="round"/><ellipse cx="0" cy="-12" rx="14" ry="11" fill="#B07D4A"/><ellipse cx="0" cy="-8" rx="7" ry="6" fill="#F3E0C4"/><g stroke="#8C5A32" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M-6 -40 Q-10 -48 -14 -54 M-9 -46 Q-14 -46 -17 -45"/><path d="M6 -40 Q10 -48 14 -54 M9 -46 Q14 -46 17 -45"/></g><ellipse cx="-12" cy="-35" rx="5" ry="3" fill="#B07D4A" transform="rotate(-25 -12 -35)"/><ellipse cx="12" cy="-35" rx="5" ry="3" fill="#B07D4A" transform="rotate(25 12 -35)"/><circle cx="0" cy="-30" r="10.5" fill="#C98F5A"/><circle cx="-4.4" cy="-32" r="1.7" fill="#3B2A1A"/><circle cx="4.4" cy="-32" r="1.7" fill="#3B2A1A"/><circle cx="0" cy="-26" r="3.4" fill="#E0463C"/><circle cx="-1" cy="-27" r="1" fill="#fff" opacity=".7"/>` },
  // Christmas and more garden things
  { id: 'xmastree', cat: 'garden', sub: 'Christmas', name: 'Christmas tree', price: 0, gift: true, x: 82, y: 300, box: '-70 -192 140 198' },
  { id: 'gifts', cat: 'garden', sub: 'Christmas', name: 'Gifts', price: 40, x: 118, y: 396, box: '-30 -36 60 40', svg: `<rect x="-22" y="-20" width="24" height="20" rx="2" fill="#D7263D"/><rect x="-12" y="-20" width="5" height="20" fill="#FFD23F"/><rect x="-22" y="-12" width="24" height="4" fill="#FFD23F"/><path d="M-9.500 -20 Q-18 -30 -14 -20 M-9.5 -20 Q-1 -30 -5 -20" stroke="#FFD23F" stroke-width="2.5" fill="none"/><rect x="2" y="-14" width="20" height="14" rx="2" fill="#3FA35B"/><rect x="10" y="-14" width="4" height="14" fill="#fff"/><rect x="2" y="-9" width="20" height="3.5" fill="#fff"/>` },
  { id: 'jack', cat: 'garden', sub: 'Decorations', name: "Jack-o'-lantern", price: 45, x: 164, y: 398, box: '-26 -34 52 38', svg: `<ellipse cx="-9" cy="-11" rx="9.5" ry="11.5" fill="#EE8A2B"/><ellipse cx="9" cy="-11" rx="9.5" ry="11.5" fill="#EE8A2B"/><ellipse cx="0" cy="-11" rx="9.5" ry="12.5" fill="#F7A043"/><rect x="-2" y="-29" width="4" height="8" rx="1.5" fill="#5FA644"/><path d="M-9 -17 L-5 -11 H-13Z M9 -17 L13 -11 H5Z" fill="#FFE27A" stroke="#3B2A1A" stroke-width="1"/><path d="M-10 -6 L-6 -3 L-2 -6 L2 -3 L6 -6 L10 -3 L8 0 H-8Z" fill="#FFE27A" stroke="#3B2A1A" stroke-width="1" stroke-linejoin="round"/>` },
  { id: 'fireflies', cat: 'garden', sub: 'Decorations', name: 'Fireflies', price: 70, x: 180, y: 360, box: '0 0 40 40', thumb: `<rect width="40" height="40" rx="8" fill="#2A3368"/>` + [[9, 11], [28, 8], [19, 22], [8, 30], [31, 29]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#FFF3A0" opacity=".35"/><circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#FFF36B"/>`).join(''), svg: [[-150, -112, 0], [-96, -70, 1.1], [-128, -30, 0.5], [118, -96, 1.6], [152, -52, 0.3], [96, -18, 0.9], [-40, -150, 1.3], [54, -140, 0.7], [-20, -92, 0.2], [26, -60, 1.5]].map(p => `<g><circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#FFF3A0" opacity=".35"/><circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="#FFF36B"/><animate attributeName="opacity" values=".25;1;.25" dur="2.4s" begin="${p[2]}s" repeatCount="indefinite"/></g>`).join('') },
];
const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));

/* Recolouring: [main colour, darker trim colour] as drawn. A chosen colour replaces the main one, a darker shade of it the trim. */
const TINTS = {
  hairshort: ['#6B4423'], hairlong: ['#F2C94C'], hairpony: ['#A0522D'], hairpig: ['#4A78C2'], haircurly: ['#3B2A1A'], hairbun: ['#2B2B33'], hairbob: ['#F58BB7'], hairmohawk: ['#FF4F9A'], hairginger: ['#D9662B'],
  round: ['#3B2A1A'], shades: ['#22222A'], hearts: ['#FF5C8A', '#D93A6B'],
  bow: ['#FF7FAE', '#E0558A'], beanie: ['#E86A6A'], tophat: ['#2B2B33'],
  bowtie: ['#5B8DEF', '#3E6BC4'], scarf: ['#E8554E'],
  startee: ['#2F5DA8', '#244A87'], sweater: ['#7CC6A4', '#5DAA88'], tutu: ['#FFB3D1', '#F58BB7'], cape: ['#D7263D', '#A81B2E'],
  mug: ['#5B8DEF', '#3E6BC4'], balloon: ['#FF6B6B'], mittens: ['#E0463C'], boxing: ['#C62F3B'],
  pinkshoes: ['#FF8FB6'], slippers: ['#F7C8D8', '#E79CB8'], boots: ['#8C5A32', '#5A3A22'], rainboots: ['#FFD23F', '#E0A800'],
};
const PALETTE = ['#2B2B33', '#6B4423', '#A0522D', '#D9662B', '#F2C94C', '#E9E4DA', '#E0463C', '#FF7FAE', '#9B6BD9', '#4A78C2', '#3FB8A8', '#6DBE5A'];
const shade = (hex, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
function tinted(i, tint) {
  const c = i && tint && tint[i.id], t = i && TINTS[i.id];
  if (!c || !t) return i;
  const rep = s => typeof s !== 'string' ? s : (t[1] ? s.split(t[1]).join('\u0001') : s).split(t[0]).join(c).split('\u0001').join(shade(c, 0.72));
  const o = Object.assign({}, i);
  ['svg', 'svgL', 'svgR', 'back'].forEach(k => { if (o[k]) o[k] = rep(o[k]); });
  return o;
}

/* ---------- potato ---------- */
function potatoInner(eq, mood, animate) {
  eq = eq || {};
  const I = c => tinted(ITEM_MAP[eq[c]], eq.tint);
  const it = c => { const i = I(c); return i && i.svg ? i.svg : ''; };
  const cos = I('costume'), outfit = cos || I('outfit'), hand = I('hand') || {};   // a costume takes the place of hair, hat, neck and outfit
  const eyes = mood === 'sleepy'
    ? `<path d="M75 111 Q82 117 89 111 M111 111 Q118 117 125 111" stroke="#3B2A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="82" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="118" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="84.5" cy="107.5" r="2.2" fill="#fff"/><circle cx="120.5" cy="107.5" r="2.2" fill="#fff"/>`;
  const mouth = mood === 'sleepy'
    ? `<path d="M94 131 Q100 135 106 131" stroke="#3B2A1A" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M89 127 Q100 142 111 127Z" fill="#7A3B2E" stroke="#3B2A1A" stroke-width="2.5" stroke-linejoin="round"/>`;
  // Each arm (with whatever it holds) sways gently around its shoulder.
  const sway = (deg, cx, dur) => animate ? `<animateTransform attributeName="transform" type="rotate" values="0 ${cx} 136;${deg} ${cx} 136;0 ${cx} 136;${-deg * 0.6} ${cx} 136;0 ${cx} 136" dur="${dur}s" repeatCount="indefinite"/>` : '';
  const limb = 'stroke="#B07D3C" stroke-width="10" stroke-linecap="round"';
  return `<defs><clipPath id="pb"><path d="${P_BODY}"/></clipPath></defs>
<ellipse cx="100" cy="209" rx="52" ry="6" fill="rgba(0,0,0,.14)"/>
${outfit && outfit.back || ''}
<g>${sway(9, 50, 4.2)}<path d="M50 136 L30 150" ${limb}/>${cos && cos.propL || ''}${hand.svgL || ''}</g>
<g>${sway(-9, 152, 3.4)}<path d="M152 136 L172 150" ${limb}/>${hand.svgR || ''}</g>
<g ${limb}><path d="M82 188 L80 205"/><path d="M118 188 L120 205"/></g>
<path d="${P_BODY}" fill="#DDAB62" stroke="#B07D3C" stroke-width="3.5"/>
<g fill="#C9944C"><ellipse cx="66" cy="96" rx="4" ry="3"/><ellipse cx="136" cy="88" rx="3" ry="2.5"/><ellipse cx="140" cy="160" rx="4" ry="3"/><ellipse cx="62" cy="168" rx="3" ry="2.5"/><ellipse cx="104" cy="176" rx="3" ry="2"/></g>
<circle cx="68" cy="126" r="8" fill="#FF9E9E" opacity=".55"/><circle cx="132" cy="126" r="8" fill="#FF9E9E" opacity=".55"/>
${eyes}${mouth}
${outfit ? outfit.svg : ''}${it('shoes')}${cos ? '' : it('neck')}${cos ? '' : it('hair')}${it('glasses')}${cos ? '' : it('hat')}`;
}
function potatoSVG(eq, mood, px) {
  return `<svg class="potato" viewBox="0 0 200 220" width="${px}" height="${px * 1.1}" xmlns="http://www.w3.org/2000/svg">${potatoInner(eq, mood)}</svg>`;
}

/* ---------- garden ---------- */
const SCENES = {
  meadow: { sky: ['#BFE6FF', '#EAF8FF'], lawn: ['#BCE596', '#A2D67D'], tuft: '#8CC96B',
    extra: `<circle cx="300" cy="58" r="22" fill="#FFE27A"/><g fill="#fff" opacity=".95"><ellipse cx="70" cy="60" rx="30" ry="11"/><ellipse cx="90" cy="52" rx="18" ry="10"/><ellipse cx="215" cy="92" rx="22" ry="8"/></g>`,
    hills: `<ellipse cx="80" cy="218" rx="175" ry="62" fill="#9AD67C"/><ellipse cx="295" cy="224" rx="165" ry="56" fill="#ADDF8E"/>` },
  sunset: { sky: ['#FF9A76', '#FFDDB5'], lawn: ['#B7D886', '#9CC56C'], tuft: '#86B458',
    extra: `<circle cx="180" cy="166" r="52" fill="#FFF0B0" opacity=".85"/><g fill="#FFD0C0" opacity=".8"><ellipse cx="80" cy="70" rx="32" ry="9"/><ellipse cx="280" cy="96" rx="26" ry="8"/></g>`,
    hills: `<ellipse cx="80" cy="218" rx="175" ry="62" fill="#B886B8"/><ellipse cx="295" cy="224" rx="165" ry="56" fill="#CC9AC0"/>` },
  night: { sky: ['#1C2350', '#3D4C90'], lawn: ['#6FA57C', '#588C68'], tuft: '#4A7A5A',
    extra: `<circle cx="296" cy="58" r="20" fill="#FFF3C4"/><circle cx="287" cy="52" r="17" fill="#1F2757"/>${[[40, 40], [90, 80], [140, 36], [200, 70], [240, 28], [330, 110], [24, 120], [170, 110]].map(p => star(p[0], p[1], 0.38, '#FFF3C4')).join('')}`,
    hills: `<ellipse cx="80" cy="218" rx="175" ry="62" fill="#34427A"/><ellipse cx="295" cy="224" rx="165" ry="56" fill="#3F4F8C"/>` },
  beach: { sky: ['#AEE4FF', '#E6F7FF'], lawn: ['#FFE6AE', '#F6D38A'], tuft: '#E9C06F', fence: false,
    extra: `<circle cx="62" cy="56" r="22" fill="#FFE27A"/><g fill="#fff" opacity=".95"><ellipse cx="250" cy="62" rx="30" ry="10"/><ellipse cx="270" cy="54" rx="16" ry="9"/></g>`,
    hills: `<rect y="158" width="360" height="52" fill="#5CC4E8"/><path d="M0 170 Q22 164 45 170 T90 170 T135 170 T180 170 T225 170 T270 170 T315 170 T360 170 M0 188 Q22 182 45 188 T90 188 T135 188 T180 188 T225 188 T270 188 T315 188 T360 188" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>` },
};
const GARDEN_H = 560;
// Evenly "random" spots on the lawn (always the same ones, so the garden doesn't jump around).
function scatter(n, seed, draw) {
  let v = seed, out = '';
  const r = () => (v = (v * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) out += draw((12 + r() * 336).toFixed(0), (224 + r() * (GARDEN_H - 236)).toFixed(0), r());
  return out;
}
const pick = (arr, r) => arr[Math.floor(r * arr.length) % arr.length];
function fenceSVG(kind) {
  let f = '';
  if (kind === 'wood') {
    for (let x = 6; x < 360; x += 44) f += `<rect x="${x}" y="174" width="9" height="42" rx="2"/>`;
    return `<g fill="#B07D4A" stroke="#8C5A32" stroke-width="1.5"><rect x="-5" y="184" width="370" height="8"/><rect x="-5" y="200" width="370" height="8"/>${f}</g>`;
  }
  if (kind === 'hedge') {
    for (let x = 8; x < 372; x += 22) f += `<circle cx="${x}" cy="${194 + (x % 44 ? 0 : 3)}" r="15"/>`;
    let hi = ''; for (let x = 14; x < 360; x += 33) hi += `<circle cx="${x}" cy="188" r="5"/>`;
    return `<rect x="-5" y="196" width="370" height="20" fill="#4E9C4A"/><g fill="#5FAE55">${f}</g><g fill="#7CC56B">${hi}</g>`;
  }
  if (kind === 'stone') {
    for (let row = 0; row < 3; row++) for (let x = (row % 2 ? -14 : 0); x < 360; x += 28) f += `<rect x="${x}" y="${184 + row * 10}" width="27" height="9" rx="3"/>`;
    return `<rect x="-5" y="182" width="370" height="34" fill="#9499A1"/><g fill="#C3C7CE">${f}</g><rect x="-5" y="178" width="370" height="6" rx="2" fill="#AEB3BB"/>`;
  }
  for (let x = 4; x < 360; x += 22) f += `<rect x="${x}" y="178" width="10" height="36" rx="5"/>`;
  return `<g fill="#fff" stroke="#E2DACD" stroke-width="1.2"><rect x="-5" y="188" width="370" height="6"/><rect x="-5" y="201" width="370" height="6"/>${f}</g>`;
}
function groundSVG(kind, s) {
  const tufts = [[100, 262], [330, 244], [264, 330], [20, 250], [176, 384], [318, 392], [120, 432], [232, 506], [40, 524], [330, 468]].map(p => `<path transform="translate(${p[0]} ${p[1]})" d="M-8 0 Q-6 -8 -3 0 Q0 -11 3 0 Q6 -8 8 0Z" fill="${s.tuft}"/>`).join('');
  if (kind === 'stripes') { let b = ''; for (let y = 205; y < GARDEN_H; y += 46) b += `<rect y="${y}" width="360" height="23" fill="#fff" opacity=".14"/>`; return b; }
  if (kind === 'meadowflowers') return tufts + scatter(52, 7, (x, y, r) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${pick(['#fff', '#FFD23F', '#FF9CC2', '#C58BF2', '#fff'], r)}"/><circle cx="${x}" cy="${y}" r="1.2" fill="#F2A541"/>`);
  if (kind === 'leaves') return tufts + scatter(64, 11, (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="4.6" ry="2.4" fill="${pick(['#E88E2D', '#D7694A', '#F2C230', '#B5651D'], r)}" transform="rotate(${Math.round(r * 180)} ${x} ${y})"/>`);
  if (kind === 'snow') return `<rect y="205" width="360" height="${GARDEN_H - 205}" fill="#F7FBFF" opacity=".93"/>` + scatter(26, 5, (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${(8 + r * 10).toFixed(0)}" ry="2.5" fill="#DCE9F5"/>`);
  return tufts;
}
function scene(id, fence, ground) {
  if (!SCENES[id]) id = 'meadow';
  const s = SCENES[id];
  const grad = (gid, c) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`;
  // The beach has no fence unless a special one was chosen.
  const showFence = s.fence !== false || (fence && fence !== 'picket');
  return {
    back: `<defs>${grad('sk-' + id, s.sky)}${grad('ln-' + id, s.lawn)}</defs><rect width="360" height="${GARDEN_H}" fill="url(#sk-${id})"/>${s.extra}`,
    hills: s.hills,
    front: `<rect y="205" width="360" height="${GARDEN_H - 205}" fill="url(#ln-${id})"/>${groundSVG(ground, s)}${showFence ? fenceSVG(fence) : ''}`,
  };
}
const PET_SPOT = { x: 264, y: 352 };
// Groups where only one item is out at a time (like pets). The last one put in wins.
const SINGLE_SUBS = ['Fun & relax', 'Trees', 'Flowers', 'Decorations'];
function oneEach(placed) {
  const seen = {};
  return (placed || []).slice().reverse().filter(id => {
    const i = ITEM_MAP[id];
    if (!i || !SINGLE_SUBS.includes(i.sub)) return true;
    if (seen[i.sub]) return false;
    return seen[i.sub] = true;
  }).reverse();
}
// Fun & relax: one big item at the back of the lawn on the right. Width it is drawn at, and where it stands.
const FUN_W = { pool: 236, treeswing: 172 }, FUN_BASE = { pool: 316 }, FUN_RIGHT = 357;
function gardenParts(i) {
  if (i.sub === 'Fun & relax') {
    const b = i.box.split(' ').map(Number), s = (FUN_W[i.id] || 196) / b[2];
    return [Object.assign({}, i, { x: FUN_RIGHT - (b[0] + b[2]) * s, y: FUN_BASE[i.id] || 298, s })];
  }
  return [Object.assign({}, i)];
}
function gardenSVG(eq, placed, mood, orn) {
  eq = eq || {};
  const sc = scene(eq.bg, eq.fence, eq.ground);
  const its = [].concat(...oneEach(placed).map(id => ITEM_MAP[id]).filter(i => i && i.cat === 'garden').map(gardenParts));
  const pet = ITEM_MAP[eq.pet];
  // With a big item out, the potato steps to the left to make room (unless the Christmas tree stands there).
  const big = its.some(i => i.sub === 'Fun & relax'), aside = big && !its.some(i => i.id === 'xmastree');
  if (aside) its.forEach(i => { if (i.sub === 'Decorations' && i.layer === undefined && i.y < 340 && i.x < 120) i.x = 30; });
  if (pet && pet.cat === 'pet') its.push(Object.assign({}, pet, big ? { x: 236, y: 394 } : PET_SPOT));
  its.sort((a, b) => a.y - b.y);
  const put = f => its.filter(f).map(i => i.id === 'xmastree' ? `<g transform="translate(${i.x} ${i.y}) scale(1.3)">${treeSVG(orn)}</g>` : `<g transform="translate(${i.x} ${i.y})${i.s ? ` scale(${i.s})` : ''}">${i.svg}</g>`).join('');
  return `<svg class="garden" viewBox="0 0 360 ${GARDEN_H}" xmlns="http://www.w3.org/2000/svg">
${sc.back}${put(i => i.layer === 0)}${sc.hills}${put(i => i.layer === 1)}${sc.front}${put(i => i.layer === undefined && i.y <= 358)}
<g transform="translate(${aside ? 36 : 80} 150)">${potatoInner(eq, mood, true)}</g>
${put(i => i.layer === undefined && i.y > 358)}</svg>`;
}
// Small picture of one item for the shop.
function itemThumb(i, px) {
  if (i.cat === 'garden' || i.cat === 'pet') return `<svg class="thumb" viewBox="${i.box}" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg">${i.id === 'xmastree' ? treeSVG({}) : i.thumb || i.svg}</svg>`;
  if (i.cat === 'bg' || i.cat === 'fence' || i.cat === 'ground') {
    const sc = i.cat === 'bg' ? scene(i.id) : scene('meadow', i.cat === 'fence' ? i.id : 'picket', i.cat === 'ground' ? i.id : 'lawn');
    return `<svg class="thumb scene" viewBox="${i.cat === 'bg' ? '0 40 360 360' : i.cat === 'fence' ? '60 130 120 120' : '40 170 190 190'}" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg">${sc.back}${sc.hills}${sc.front}</svg>`;
  }
  return potatoSVG({ [i.cat]: i.id, tint: typeof S !== 'undefined' ? S.equipped.tint : null }, 'happy', px);
}
