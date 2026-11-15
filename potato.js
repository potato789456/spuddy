// The potato, its wardrobe and its garden.
// The potato is drawn in a 200 x 220 box; the garden scene is 360 x 400.
const P_BODY = 'M100 58 C140 54 160 92 156 132 C153 172 128 194 98 193 C66 192 44 168 45 130 C46 92 62 60 100 58Z';
const heart = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C-14 -2 -8 -12 0 -5 C8 -12 14 -2 0 8Z" fill="${fill}"/>`;
const flower = (x, y, r, petal, mid, n) => { n = n || 5; let o = ''; for (let k = 0; k < n; k++) { const a = k * 2 * Math.PI / n; o += `<circle cx="${(x + Math.cos(a) * r).toFixed(1)}" cy="${(y + Math.sin(a) * r).toFixed(1)}" r="${(r * (n > 6 ? 0.5 : 0.75)).toFixed(1)}" fill="${petal}"/>`; } return o + `<circle cx="${x}" cy="${y}" r="${(r * 0.6).toFixed(1)}" fill="${mid}"/>`; };
const star = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.5 L6.2 9 L0 4.6 L-6.2 9 L-4.2 1.5 L-10 -3.1 L-2.9 -3.1Z" fill="${fill}"/>`;
const stem = (x1, y1, x2, y2, w) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#5FA644" stroke-width="${w || 3}" stroke-linecap="round"/>`;
const tree = (c1, c2, dots) => `<rect x="-6" y="-52" width="12" height="54" rx="3" fill="#A9794B"/><circle cx="-22" cy="-60" r="23" fill="${c2}"/><circle cx="22" cy="-60" r="23" fill="${c2}"/><circle cx="0" cy="-78" r="31" fill="${c1}"/>${dots || ''}`;
const tulip = (x, y, c) => stem(x, 0, x, y) + `<path transform="translate(${x} ${y})" d="M-6 0 Q-7 -11 -6 -14 L-2 -8 L0 -15 L2 -8 L6 -14 Q7 -11 6 0 Q0 5 -6 0Z" fill="${c}"/>`;

const CATS = [['hat', 'Hats'], ['glasses', 'Glasses'], ['neck', 'Neck'], ['outfit', 'Outfits'], ['hand', 'In hand']];
const GARDEN_SUBS = ['Trees', 'Flowers', 'Decorations'];

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
  { id: 'flower', cat: 'hand', name: 'Flower', price: 20, svg: `<path d="M172 150 Q170 132 176 116" stroke="#5FA644" stroke-width="3.5" fill="none" stroke-linecap="round"/>${flower(176, 110, 7, '#FFC84A', '#E8554E')}` },
  { id: 'mug', cat: 'hand', name: 'Coffee mug', price: 30, svg: `<path d="M17 146 Q8 146 8 152 Q8 158 17 158" stroke="#3E6BC4" stroke-width="3.5" fill="none"/><rect x="16" y="140" width="22" height="22" rx="4" fill="#5B8DEF"/><path d="M22 134 Q25 130 22 126 M31 134 Q34 130 31 126" stroke="#B9B2A8" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  { id: 'balloon', cat: 'hand', name: 'Balloon', price: 35, svg: `<path d="M172 150 Q184 120 182 82" stroke="#8A7A6A" stroke-width="1.8" fill="none"/><ellipse cx="182" cy="62" rx="15" ry="19" fill="#FF6B6B"/><path d="M179 80 L185 80 L182 86Z" fill="#FF6B6B"/><ellipse cx="176" cy="54" rx="3.5" ry="6" fill="#fff" opacity=".5"/>` },
  { id: 'icecream', cat: 'hand', name: 'Ice cream', price: 45, svg: `<path d="M163 130 L181 130 L172 156Z" fill="#E0A458" stroke="#C4863A" stroke-width="1.5" stroke-linejoin="round"/><circle cx="172" cy="123" r="11" fill="#FFB3D1"/><circle cx="172" cy="111" r="3.5" fill="#D7263D"/>` },
  { id: 'dumbbell', cat: 'hand', name: 'Dumbbell', price: 60, svg: `<path d="M14 150 H46" stroke="#777" stroke-width="5" stroke-linecap="round"/><rect x="8" y="138" width="10" height="24" rx="3" fill="#444"/><rect x="42" y="138" width="10" height="24" rx="3" fill="#444"/>` },
  { id: 'wand', cat: 'hand', name: 'Magic wand', price: 100, svg: `<path d="M172 150 L187 118" stroke="#8C6BD9" stroke-width="4" stroke-linecap="round"/>${star(189, 110, 1.2, '#FFD23F')}${star(170, 100, 0.4, '#FFE98A')}${star(196, 132, 0.35, '#FFE98A')}` },
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
  { id: 'lavender', cat: 'garden', sub: 'Flowers', name: 'Lavender', price: 40, x: 250, y: 392, box: '-30 -48 60 52', svg: [-16, -8, 0, 8, 16].map(d => stem(d * 0.3, 0, d, -30, 2) + [0, 1, 2, 3].map(k => `<circle cx="${(d * (1 + k * 0.04)).toFixed(1)}" cy="${-30 - k * 4}" r="${3.4 - k * 0.5}" fill="#9B7BE0"/>`).join('')).join('') },
  { id: 'roses', cat: 'garden', sub: 'Flowers', name: 'Rose bush', price: 50, x: 72, y: 350, box: '-36 -42 72 46', svg: `<circle cx="-14" cy="-10" r="13" fill="#5FAE55"/><circle cx="14" cy="-10" r="13" fill="#5FAE55"/><circle cx="0" cy="-18" r="18" fill="#6DBE5A"/>` + [[-14, -12], [0, -26], [13, -14], [-2, -10], [8, -26]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#E8456B"/><circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#FF8FA8"/>`).join('') },
  { id: 'mushrooms', cat: 'garden', sub: 'Decorations', name: 'Mushrooms', price: 25, x: 288, y: 374, box: '-26 -34 52 38', svg: `<rect x="-10" y="-14" width="8" height="15" rx="3" fill="#FFF3E0"/><path d="M-20 -12 Q-6 -36 8 -12Z" fill="#E8554E"/><circle cx="-8" cy="-20" r="2.5" fill="#fff"/><circle cx="-1" cy="-15" r="1.8" fill="#fff"/><rect x="9" y="-8" width="6" height="9" rx="2.5" fill="#FFF3E0"/><path d="M3 -7 Q12 -22 21 -7Z" fill="#E8554E"/><circle cx="12" cy="-11" r="1.8" fill="#fff"/>` },
  { id: 'pumpkin', cat: 'garden', sub: 'Decorations', name: 'Pumpkin', price: 35, x: 206, y: 393, box: '-26 -30 52 34', svg: `<ellipse cx="-9" cy="-10" rx="9" ry="10.5" fill="#EE8A2B"/><ellipse cx="9" cy="-10" rx="9" ry="10.5" fill="#EE8A2B"/><ellipse cx="0" cy="-10" rx="9" ry="11.5" fill="#F7A043"/><rect x="-2" y="-26" width="4" height="7" rx="1.5" fill="#5FA644"/>` },
  { id: 'butterfly', cat: 'garden', sub: 'Decorations', name: 'Butterfly', price: 45, x: 288, y: 250, box: '-20 -18 40 32', svg: `<ellipse cx="-7" cy="-5" rx="7" ry="9" fill="#C58BF2" transform="rotate(-20 -7 -5)"/><ellipse cx="7" cy="-5" rx="7" ry="9" fill="#C58BF2" transform="rotate(20 7 -5)"/><ellipse cx="-5" cy="6" rx="4.5" ry="5.5" fill="#F29AC1"/><ellipse cx="5" cy="6" rx="4.5" ry="5.5" fill="#F29AC1"/><path d="M0 -8 L0 9" stroke="#3B2A1A" stroke-width="2.5" stroke-linecap="round"/>` },
  { id: 'gnome', cat: 'garden', sub: 'Decorations', name: 'Garden gnome', price: 60, x: 46, y: 300, box: '-26 -68 52 72', svg: `<ellipse cx="-6" cy="0" rx="6" ry="3" fill="#5A4636"/><ellipse cx="6" cy="0" rx="6" ry="3" fill="#5A4636"/><path d="M-13 0 Q-15 -22 0 -24 Q15 -22 13 0Z" fill="#4A78C2"/><circle cx="0" cy="-28" r="8.5" fill="#F6C9A0"/><path d="M-10 -27 Q0 0 10 -27 Q0 -20 -10 -27Z" fill="#fff"/><circle cx="0" cy="-26" r="2.4" fill="#EFA98A"/><circle cx="-3.5" cy="-30" r="1.2" fill="#3B2A1A"/><circle cx="3.5" cy="-30" r="1.2" fill="#3B2A1A"/><path d="M-11 -33 Q-2 -52 2 -64 Q6 -48 11 -33Z" fill="#E8554E"/>` },
  { id: 'birdbath', cat: 'garden', sub: 'Decorations', name: 'Bird bath', price: 70, x: 316, y: 296, box: '-30 -54 60 58', svg: `<ellipse cx="0" cy="0" rx="14" ry="4" fill="#B7BDC7"/><rect x="-4" y="-28" width="8" height="28" fill="#C9CED6"/><path d="M-22 -33 Q0 -14 22 -33Z" fill="#C9CED6"/><ellipse cx="0" cy="-33" rx="21" ry="4.5" fill="#8FD3F4"/><circle cx="11" cy="-41" r="5.5" fill="#FFB347"/><circle cx="15" cy="-45" r="3.5" fill="#FFB347"/><path d="M18 -45 L22 -44 L18 -43Z" fill="#E8554E"/><circle cx="16" cy="-46" r="0.8" fill="#3B2A1A"/>` },
  { id: 'bunny', cat: 'garden', sub: 'Decorations', name: 'Bunny', price: 90, x: 128, y: 391, box: '-26 -50 52 54', svg: `<g fill="#fff" stroke="#DDD3C6" stroke-width="1.5"><ellipse cx="5" cy="-36" rx="3.2" ry="9.5"/><ellipse cx="12" cy="-35" rx="3.2" ry="9.5" transform="rotate(14 12 -35)"/><circle cx="-12" cy="-9" r="4.5"/><ellipse cx="0" cy="-10" rx="12.5" ry="10"/><circle cx="9" cy="-22" r="8.5"/></g><circle cx="12" cy="-23" r="1.4" fill="#3B2A1A"/><circle cx="17" cy="-20" r="1.3" fill="#FF9CC2"/>` },
  { id: 'house', cat: 'garden', sub: 'Decorations', name: 'Little house', price: 120, x: 172, y: 176, layer: 1, box: '-30 -50 60 54', svg: `<rect x="-18" y="-24" width="36" height="26" fill="#FFF1D6"/><path d="M-24 -23 L0 -45 L24 -23Z" fill="#D7694A"/><rect x="-5" y="-13" width="9" height="15" rx="2" fill="#8C5A32"/><rect x="7" y="-18" width="8" height="8" fill="#9ED8F5" stroke="#fff" stroke-width="1.2"/>` },
  { id: 'rainbow', cat: 'garden', sub: 'Decorations', name: 'Rainbow', price: 150, x: 250, y: 212, layer: 0, box: '-80 -80 160 86', svg: ['#F06A5E', '#FFB347', '#FFE066', '#7CC55A', '#6FA8F5', '#B58BF2'].map((c, k) => { const r = 74 - k * 7; return `<path d="M${-r} 0 A${r} ${r} 0 0 1 ${r} 0" fill="none" stroke="${c}" stroke-width="7.4"/>`; }).join('') },
];
const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));

/* ---------- potato ---------- */
function potatoInner(eq, mood) {
  eq = eq || {};
  const it = c => { const i = ITEM_MAP[eq[c]]; return i && i.svg ? i.svg : ''; };
  const outfit = ITEM_MAP[eq.outfit];
  const eyes = mood === 'sleepy'
    ? `<path d="M75 111 Q82 117 89 111 M111 111 Q118 117 125 111" stroke="#3B2A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="82" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="118" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="84.5" cy="107.5" r="2.2" fill="#fff"/><circle cx="120.5" cy="107.5" r="2.2" fill="#fff"/>`;
  const mouth = mood === 'sleepy'
    ? `<path d="M94 131 Q100 135 106 131" stroke="#3B2A1A" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M89 127 Q100 142 111 127Z" fill="#7A3B2E" stroke="#3B2A1A" stroke-width="2.5" stroke-linejoin="round"/>`;
  return `<defs><clipPath id="pb"><path d="${P_BODY}"/></clipPath></defs>
<ellipse cx="100" cy="208" rx="50" ry="6" fill="rgba(0,0,0,.14)"/>
${outfit && outfit.back || ''}
<g stroke="#B07D3C" stroke-width="7" stroke-linecap="round"><path d="M50 136 L30 150"/><path d="M152 136 L172 150"/><path d="M82 188 L80 205"/><path d="M118 188 L120 205"/></g>
<path d="${P_BODY}" fill="#DDAB62" stroke="#B07D3C" stroke-width="3.5"/>
<g fill="#C9944C"><ellipse cx="66" cy="96" rx="4" ry="3"/><ellipse cx="136" cy="88" rx="3" ry="2.5"/><ellipse cx="140" cy="160" rx="4" ry="3"/><ellipse cx="62" cy="168" rx="3" ry="2.5"/><ellipse cx="104" cy="176" rx="3" ry="2"/></g>
<circle cx="68" cy="126" r="8" fill="#FF9E9E" opacity=".55"/><circle cx="132" cy="126" r="8" fill="#FF9E9E" opacity=".55"/>
${eyes}${mouth}
${outfit ? outfit.svg : ''}${it('neck')}${it('glasses')}${it('hat')}${it('hand')}`;
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
function scene(id) {
  if (!SCENES[id]) id = 'meadow';
  const s = SCENES[id];
  const grad = (gid, c) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`;
  let fence = '';
  if (s.fence !== false) {
    for (let x = 4; x < 360; x += 22) fence += `<rect x="${x}" y="178" width="10" height="36" rx="5"/>`;
    fence = `<g fill="#fff" stroke="#E2DACD" stroke-width="1.2"><rect x="-5" y="188" width="370" height="6"/><rect x="-5" y="201" width="370" height="6"/>${fence}</g>`;
  }
  const tufts = [[100, 262], [330, 244], [264, 330], [20, 250], [176, 384], [318, 392]].map(p => `<path transform="translate(${p[0]} ${p[1]})" d="M-8 0 Q-6 -8 -3 0 Q0 -11 3 0 Q6 -8 8 0Z" fill="${s.tuft}"/>`).join('');
  return {
    back: `<defs>${grad('sk-' + id, s.sky)}${grad('ln-' + id, s.lawn)}</defs><rect width="360" height="400" fill="url(#sk-${id})"/>${s.extra}`,
    hills: s.hills,
    front: `<rect y="205" width="360" height="195" fill="url(#ln-${id})"/>${fence}${tufts}`,
  };
}
function gardenSVG(eq, placed, mood) {
  eq = eq || {};
  const sc = scene(eq.bg);
  const its = (placed || []).map(id => ITEM_MAP[id]).filter(i => i && i.cat === 'garden').sort((a, b) => a.y - b.y);
  const put = f => its.filter(f).map(i => `<g transform="translate(${i.x} ${i.y})">${i.svg}</g>`).join('');
  return `<svg class="garden" viewBox="0 0 360 400" xmlns="http://www.w3.org/2000/svg">
${sc.back}${put(i => i.layer === 0)}${sc.hills}${put(i => i.layer === 1)}${sc.front}${put(i => i.layer === undefined && i.y <= 358)}
<g transform="translate(80 150)"><g class="bob">${potatoInner(eq, mood)}</g></g>
${put(i => i.layer === undefined && i.y > 358)}</svg>`;
}
// Small picture of one item for the shop.
function itemThumb(i, px) {
  if (i.cat === 'garden') return `<svg class="thumb" viewBox="${i.box}" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg">${i.svg}</svg>`;
  if (i.cat === 'bg') { const sc = scene(i.id); return `<svg class="thumb scene" viewBox="0 40 360 360" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg">${sc.back}${sc.hills}${sc.front}</svg>`; }
  return potatoSVG({ [i.cat]: i.id }, 'happy', px);
}
