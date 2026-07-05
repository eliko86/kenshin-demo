// icons.jsx — Kenshin kid-friendly icon set.
// Chunky, glossy, gradient-filled glyphs that read as soft 3D toys — not thin line icons.
// Export: window.KIcon  ·  <KIcon name="chat" size={26} c="#5B8DEF" />

const KI_PATHS = {
  // solid single-fill silhouettes (so the gloss clip works cleanly)
  chat:  'M6 4h12a4 4 0 014 4v6a4 4 0 01-4 4h-5.2L7 22.5a1 1 0 01-1.6-.8V18H6a4 4 0 01-4-4V8a4 4 0 014-4z',
  call:  'M7.3 3.4c.9.1 1.5.7 1.8 1.6l.7 2.2c.3.9 0 1.6-.6 2.1l-1 .9a11.5 11.5 0 004.9 4.9l.9-1c.5-.6 1.2-.9 2.1-.6l2.2.7c.9.3 1.5.9 1.6 1.8l.1 2.3c0 1.3-1 2.4-2.4 2.3C10.4 23.7.3 13.6.4 5.4.3 4 1.4 3 2.7 3l2.3.1a20 20 0 002.3.3z',
  play:  'M7 7h10a5.5 5.5 0 015.5 5.5A4.5 4.5 0 0114 15.6l-.7-1h-2.6l-.7 1A4.5 4.5 0 011.5 12.5 5.5 5.5 0 017 7z',
  shirt: 'M9 3l3 2.2L15 3l6 4-2.6 4.3L16 10v11H8V10l-2.4 1.3L3 7l6-4z',
  bag:   'M6 8h12l-.8 11.4a2.2 2.2 0 01-2.2 2H9a2.2 2.2 0 01-2.2-2L6 8z',
  flag:  'M7 3a1.2 1.2 0 00-1.2 1.2V21a1.2 1.2 0 002.4 0v-5.4l9.1 1.6a.8.8 0 00.95-.9l-.7-4.2.7-4.2a.8.8 0 00-.65-.92L8.2 5.1V4.2A1.2 1.2 0 007 3z',
  home:  'M12 2.6a1.6 1.6 0 00-1 .4l-8 6.8A1.4 1.4 0 004 12.3h.8V20a1.5 1.5 0 001.5 1.5H9.5V15.5h5V21.5h3.2A1.5 1.5 0 0019.2 20V12.3H20a1.4 1.4 0 001-2.5l-8-6.8a1.6 1.6 0 00-1-.4z',
  heart: 'M12 21.3C4.8 16 2.5 12.3 2.5 8.9 2.5 5.9 4.8 4 7.4 4c1.8 0 3.4.9 4.6 2.6C13.2 4.9 14.8 4 16.6 4c2.6 0 4.9 1.9 4.9 4.9 0 3.4-2.3 7.1-9.5 12.4z',
  star:  'M12 2.2l2.9 6 6.6.9-4.8 4.7 1.2 6.6L12 21.2l-5.9 3.2 1.2-6.6L2.5 9.1l6.6-.9z',
  mic:   'M12 2.5a3.6 3.6 0 013.6 3.6v5.1a3.6 3.6 0 01-7.2 0V6.1A3.6 3.6 0 0112 2.5z',
  spark: 'M12 1.8l2.2 6.4 6.4 2.2-6.4 2.2L12 19.2l-2.2-6.6L3.4 10.4l6.4-2.2z',
  leaf:  'M4.5 19.5C4.5 11 10.9 4.6 20 4.6c.4 8.6-6 15-15.5 15z',
  book:  'M5 4.5A2.5 2.5 0 017.5 2H19a1 1 0 011 1v15.5a1 1 0 01-1 1H7.5A2.5 2.5 0 005 22V4.5z',
};

// tiny white detail overlays baked on top of the glossy body
function KI_Extra({ name }) {
  const w = { fill: '#fff' };
  if (name === 'chat') return <g opacity="0.92">{[9, 12, 15].map((x) => <circle key={x} cx={x} cy="10.6" r="1.15" {...w} />)}</g>;
  if (name === 'play') return <g><rect x="5.4" y="10.6" width="4.4" height="1.5" rx=".7" {...w} /><rect x="6.85" y="9.15" width="1.5" height="4.4" rx=".7" {...w} /><circle cx="15.4" cy="10.9" r="1.15" {...w} /><circle cx="17.6" cy="13" r="1.15" {...w} /></g>;
  if (name === 'mic')  return <path d="M6.4 11.4a5.6 5.6 0 0011.2 0M12 17v3.4M8.6 20.5h6.8" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />;
  return null;
}

function KIcon({ name, size = 26, c = '#5B8DEF', gloss = true, style = {} }) {
  const uid = React.useMemo(() => 'ki' + Math.random().toString(36).slice(2, 7), []);
  const d = KI_PATHS[name];
  if (!d) return null;
  const top = `color-mix(in srgb, ${c} 45%, white)`;
  const bot = `color-mix(in srgb, ${c} 92%, #241a4a)`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', overflow: 'visible', ...style }}>
      <defs>
        <linearGradient id={uid + 'g'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={c} />
          <stop offset="1" stopColor={bot} />
        </linearGradient>
        <clipPath id={uid + 'c'}><path d={d} /></clipPath>
      </defs>
      <path d={d} fill={`color-mix(in srgb, ${c} 80%, #100a28)`} transform="translate(0,0.6)" opacity="0.5" />
      <path d={d} fill={`url(#${uid}g)`} stroke={`color-mix(in srgb, ${c} 70%, white)`} strokeWidth="0.5" strokeOpacity="0.5" />
      {gloss && <g clipPath={`url(#${uid}c)`}><ellipse cx="9.5" cy="3.5" rx="13" ry="8" fill="#fff" opacity="0.26" /></g>}
      <KI_Extra name={name} />
    </svg>
  );
}

Object.assign(window, { KIcon });
