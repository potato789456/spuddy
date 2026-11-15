// The potato and its wardrobe. Everything is drawn in a 200 x 220 SVG canvas.
const P_BODY = 'M100 58 C140 54 160 92 156 132 C153 172 128 194 98 193 C66 192 44 168 45 130 C46 92 62 60 100 58Z';
const heart = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C-14 -2 -8 -12 0 -5 C8 -12 14 -2 0 8Z" fill="${fill}"/>`;
const flower = (x, y, r, petal, mid) => [0, 72, 144, 216, 288].map(a =>
  `<circle cx="${x + Math.cos(a * Math.PI / 180) * r}" cy="${y + Math.sin(a * Math.PI / 180) * r}" r="${r * 0.75}" fill="${petal}"/>`).join('') +
  `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="${mid}"/>`;
const star = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.5 L6.2 9 L0 4.6 L-6.2 9 L-4.2 1.5 L-10 -3.1 L-2.9 -3.1Z" fill="${fill}"/>`;

const CATS = [['hat', 'Hats'], ['glasses', 'Glasses'], ['neck', 'Neck'], ['outfit', 'Outfits'], ['hand', 'In hand'], ['bg', 'Backgrounds']];

const ITEMS = [
  // Hats
  { id: 'sprout', cat: 'hat', name: 'Sprout', price: 0, svg: `<path d="M100 60 Q99 50 100 43" stroke="#5FA644" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M100 45 Q84 28 73 40 Q86 53 100 45Z" fill="#7CC55A"/><path d="M100 45 Q116 26 128 37 Q116 52 100 45Z" fill="#8FD46B"/>` },
  { id: 'bow', cat: 'hat', name: 'Pink bow', price: 25, svg: `<path d="M126 64 L108 52 L110 76Z M126 64 L144 52 L142 76Z" fill="#FF7FAE" stroke="#E0558A" stroke-width="2" stroke-linejoin="round"/><circle cx="126" cy="64" r="6" fill="#FF9CC2" stroke="#E0558A" stroke-width="2"/>` },
  { id: 'beanie', cat: 'hat', name: 'Beanie', price: 30, svg: `<path d="M56 76 Q56 34 100 34 Q144 34 144 76Z" fill="#E86A6A"/><rect x="52" y="66" width="96" height="15" rx="7.5" fill="#FFF3E6" stroke="#EAD9C5" stroke-width="1.5"/><circle cx="100" cy="30" r="10" fill="#FFF3E6" stroke="#EAD9C5" stroke-width="1.5"/>` },
  { id: 'party', cat: 'hat', name: 'Party hat', price: 40, svg: `<path d="M76 64 L100 16 L124 64Z" fill="#7FB8FF"/><path d="M88 40 L112 40 L116 48 L84 48Z" fill="#FFD95A"/><path d="M80 56 L120 56 L124 64 L76 64Z" fill="#FF8FB6"/><circle cx="100" cy="15" r="7" fill="#FFD95A"/>` },
  { id: 'chef', cat: 'hat', name: 'Chef hat', price: 60, svg: `<circle cx="80" cy="40" r="15" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><circle cx="120" cy="40" r="15" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><circle cx="100" cy="32" r="18" fill="#fff" stroke="#DDD3C6" stroke-width="2"/><rect x="74" y="44" width="52" height="22" rx="4" fill="#fff" stroke="#DDD3C6" stroke-width="2"/>` },
  { id: 'flowers', cat: 'hat', name: 'Flower crown', price: 70, svg: `<path d="M62 76 Q100 50 138 76" stroke="#6DB15A" stroke-width="4" fill="none"/>${flower(66, 73, 6, '#FF9CC2', '#FFE066')}${flower(83, 64, 6, '#FFF', '#FFE066')}${flower(100, 60, 7, '#FF9CC2', '#FFE066')}${flower(117, 64, 6, '#FFF', '#FFE066')}${flower(134, 73, 6, '#FF9CC2', '#FFE066')}` },
  { id: 'cowboy', cat: 'hat', name: 'Cowboy hat', price: 80, svg: `<ellipse cx="100" cy="64" rx="60" ry="11" fill="#9C6B3E"/><path d="M72 62 Q68 26 88 30 Q100 38 112 30 Q132 26 128 62Z" fill="#B07D4A"/><path d="M72 54 Q100 62 128 54 L128 62 Q100 68 72 62Z" fill="#6B4423"/>` },
  { id: 'crown', cat: 'hat', name: 'Crown', price: 200, svg: `<path d="M70 66 L64 34 L85 50 L100 26 L115 50 L136 34 L130 66Z" fill="#FFD23F" stroke="#E0A800" stroke-width="2.5" stroke-linejoin="round"/><circle cx="100" cy="54" r="5" fill="#FF5C8A"/><circle cx="82" cy="58" r="3.5" fill="#6EC6FF"/><circle cx="118" cy="58" r="3.5" fill="#6EC6FF"/>` },
  // Glasses
  { id: 'round', cat: 'glasses', name: 'Round glasses', price: 30, svg: `<g fill="rgba(255,255,255,.3)" stroke="#3B2A1A" stroke-width="3"><circle cx="82" cy="110" r="14"/><circle cx="118" cy="110" r="14"/><path d="M96 110 L104 110" fill="none"/></g>` },
  { id: 'shades', cat: 'glasses', name: 'Sunglasses', price: 50, svg: `<rect x="64" y="100" width="33" height="21" rx="9" fill="#22222A"/><rect x="103" y="100" width="33" height="21" rx="9" fill="#22222A"/><path d="M96 106 L104 106" stroke="#22222A" stroke-width="4"/><path d="M70 105 L78 105 M109 105 L117 105" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>` },
  { id: 'hearts', cat: 'glasses', name: 'Heart glasses', price: 90, svg: `${heart(82, 111, 1.5, '#FF5C8A')}${heart(118, 111, 1.5, '#FF5C8A')}<path d="M94 108 L106 108" stroke="#D93A6B" stroke-width="3"/>` },
  // Neck
  { id: 'bowtie', cat: 'neck', name: 'Bow tie', price: 30, svg: `<path d="M100 152 L82 142 L82 162Z M100 152 L118 142 L118 162Z" fill="#5B8DEF" stroke="#3E6BC4" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="152" r="5" fill="#7FA8FF" stroke="#3E6BC4" stroke-width="2"/>` },
  { id: 'scarf', cat: 'neck', name: 'Scarf', price: 40, svg: `<g clip-path="url(#pb)"><rect x="40" y="141" width="120" height="16" fill="#E8554E"/><path d="M60 141 V157 M80 141 V157 M100 141 V157 M120 141 V157 M140 141 V157" stroke="#FFD9A0" stroke-width="3"/></g><rect x="112" y="150" width="16" height="32" rx="4" fill="#E8554E"/><path d="M112 170 H128 M112 176 H128" stroke="#FFD9A0" stroke-width="3"/>` },
  { id: 'pearls', cat: 'neck', name: 'Pearls', price: 60, svg: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => { const t = i / 8, x = 62 + t * 76, y = 144 + Math.sin(t * Math.PI) * 14; return `<circle cx="${x}" cy="${y}" r="5" fill="#FFFDF8" stroke="#D8CDBE" stroke-width="1.5"/>`; }).join('') },
  // Outfits
  { id: 'sweater', cat: 'outfit', name: 'Cozy sweater', price: 70, svg: `<g clip-path="url(#pb)"><rect x="40" y="142" width="120" height="60" fill="#7CC6A4"/><path d="M40 156 H160 M40 172 H160" stroke="#FFF7E8" stroke-width="5" stroke-dasharray="8 6"/><rect x="40" y="140" width="120" height="7" fill="#5DAA88"/></g>` },
  { id: 'tutu', cat: 'outfit', name: 'Tutu', price: 80, svg: `<path d="M46 164 Q100 150 154 164 L166 190 L150 182 L138 195 L123 184 L108 197 L93 184 L78 196 L64 183 L50 192 L35 188Z" fill="#FFB3D1" stroke="#F58BB7" stroke-width="2" stroke-linejoin="round" opacity=".95"/><g clip-path="url(#pb)"><rect x="40" y="158" width="120" height="9" fill="#FF7FAE"/></g>` },
  { id: 'cape', cat: 'outfit', name: 'Hero cape', price: 120, back: `<path d="M62 92 Q16 150 30 206 L100 190 L170 206 Q184 150 138 92Z" fill="#D7263D" stroke="#A81B2E" stroke-width="2.5" stroke-linejoin="round"/>`, svg: `<g clip-path="url(#pb)"><rect x="40" y="141" width="120" height="8" fill="#D7263D"/></g>${star(100, 146, 0.9, '#FFD23F')}` },
  // Hand
  { id: 'flower', cat: 'hand', name: 'Flower', price: 20, svg: `<path d="M172 150 Q170 132 176 116" stroke="#5FA644" stroke-width="3.5" fill="none" stroke-linecap="round"/>${flower(176, 110, 7, '#FFC84A', '#E8554E')}` },
  { id: 'balloon', cat: 'hand', name: 'Balloon', price: 35, svg: `<path d="M172 150 Q184 120 182 82" stroke="#8A7A6A" stroke-width="1.8" fill="none"/><ellipse cx="182" cy="62" rx="15" ry="19" fill="#FF6B6B"/><path d="M179 80 L185 80 L182 86Z" fill="#FF6B6B"/><ellipse cx="176" cy="54" rx="3.5" ry="6" fill="#fff" opacity=".5"/>` },
  { id: 'dumbbell', cat: 'hand', name: 'Dumbbell', price: 60, svg: `<path d="M14 150 H46" stroke="#777" stroke-width="5" stroke-linecap="round"/><rect x="8" y="138" width="10" height="24" rx="3" fill="#444"/><rect x="42" y="138" width="10" height="24" rx="3" fill="#444"/>` },
  { id: 'wand', cat: 'hand', name: 'Magic wand', price: 100, svg: `<path d="M172 150 L187 118" stroke="#8C6BD9" stroke-width="4" stroke-linecap="round"/>${star(189, 110, 1.2, '#FFD23F')}${star(170, 100, 0.4, '#FFE98A')}${star(196, 132, 0.35, '#FFE98A')}` },
  // Backgrounds
  { id: 'meadow', cat: 'bg', name: 'Meadow', price: 0, svg: `<rect width="200" height="220" fill="#D4F0FF"/><circle cx="166" cy="34" r="16" fill="#FFE27A"/><ellipse cx="40" cy="40" rx="22" ry="9" fill="#fff" opacity=".9"/><ellipse cx="100" cy="232" rx="160" ry="48" fill="#A8DB8A"/>` },
  { id: 'sunset', cat: 'bg', name: 'Sunset', price: 50, svg: `<defs><linearGradient id="gsun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9A76"/><stop offset=".6" stop-color="#FFC6A0"/><stop offset="1" stop-color="#FFE3C2"/></linearGradient></defs><rect width="200" height="220" fill="url(#gsun)"/><circle cx="100" cy="150" r="46" fill="#FFE27A" opacity=".8"/><ellipse cx="100" cy="234" rx="160" ry="48" fill="#8E6BB0"/>` },
  { id: 'night', cat: 'bg', name: 'Starry night', price: 80, svg: `<rect width="200" height="220" fill="#232B5C"/><circle cx="160" cy="36" r="15" fill="#FFF3C4"/><circle cx="153" cy="32" r="13" fill="#232B5C"/>${[[24, 30], [60, 18], [92, 44], [130, 20], [30, 80], [178, 86], [16, 130], [186, 140]].map(p => star(p[0], p[1], 0.3, '#FFF3C4')).join('')}<ellipse cx="100" cy="234" rx="160" ry="48" fill="#3F4A8A"/>` },
  { id: 'beach', cat: 'bg', name: 'Beach', price: 100, svg: `<rect width="200" height="220" fill="#BDEBFF"/><circle cx="34" cy="34" r="16" fill="#FFE27A"/><rect y="130" width="200" height="50" fill="#5CC4E8"/><path d="M0 138 Q25 132 50 138 T100 138 T150 138 T200 138" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/><ellipse cx="100" cy="226" rx="170" ry="56" fill="#FFE0A3"/>` },
];
const ITEM_MAP = Object.fromEntries(ITEMS.map(i => [i.id, i]));

function potatoSVG(eq, mood, px) {
  eq = eq || {};
  const it = c => { const i = ITEM_MAP[eq[c]]; return i ? i.svg : ''; };
  const outfit = ITEM_MAP[eq.outfit];
  const eyes = mood === 'sleepy'
    ? `<path d="M75 111 Q82 117 89 111 M111 111 Q118 117 125 111" stroke="#3B2A1A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="82" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="118" cy="110" r="6.5" fill="#3B2A1A"/><circle cx="84.5" cy="107.5" r="2.2" fill="#fff"/><circle cx="120.5" cy="107.5" r="2.2" fill="#fff"/>`;
  const mouth = mood === 'sleepy'
    ? `<path d="M94 131 Q100 135 106 131" stroke="#3B2A1A" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M89 127 Q100 142 111 127Z" fill="#7A3B2E" stroke="#3B2A1A" stroke-width="2.5" stroke-linejoin="round"/>`;
  return `<svg class="potato" viewBox="0 0 200 220" width="${px}" height="${px * 1.1}" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="pb"><path d="${P_BODY}"/></clipPath></defs>
${it('bg')}
<ellipse cx="100" cy="208" rx="50" ry="6" fill="rgba(0,0,0,.14)"/>
${outfit && outfit.back || ''}
<g stroke="#B07D3C" stroke-width="7" stroke-linecap="round"><path d="M50 136 L30 150"/><path d="M152 136 L172 150"/><path d="M82 188 L80 205"/><path d="M118 188 L120 205"/></g>
<path d="${P_BODY}" fill="#DDAB62" stroke="#B07D3C" stroke-width="3.5"/>
<g fill="#C9944C"><ellipse cx="66" cy="96" rx="4" ry="3"/><ellipse cx="136" cy="88" rx="3" ry="2.5"/><ellipse cx="140" cy="160" rx="4" ry="3"/><ellipse cx="62" cy="168" rx="3" ry="2.5"/><ellipse cx="104" cy="176" rx="3" ry="2"/></g>
<circle cx="68" cy="126" r="8" fill="#FF9E9E" opacity=".55"/><circle cx="132" cy="126" r="8" fill="#FF9E9E" opacity=".55"/>
${eyes}${mouth}
${outfit ? outfit.svg : ''}${it('neck')}${it('glasses')}${it('hat')}${it('hand')}
</svg>`;
}
