// buddy-characters.jsx — a family of glossy, 3D, idly-animated buddy characters.
// Each shares an expressive face (blinks + moods) but has a distinct body shape.
// Exports to window: CHARACTERS, hexA, shade

function hexA(hex, a) {
  const h = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
  return hex + h;
}
const dur = (base, motion) => (base / Math.max(0.45, motion)).toFixed(2) + 's';
function shade(c) {
  return {
    light: `color-mix(in srgb, ${c} 20%, white)`,
    base: c,
    dark: `color-mix(in srgb, ${c} 78%, #15224f)`,
    rim: `color-mix(in srgb, ${c} 42%, white)`,
  };
}
const EYE = '#16224C';

// ── shared face ──────────────────────────────────────────────
function Face({ size, mood = 'calm', motion = 1, fx = 50, fy = 45, gap = 0.15, s = 1 }) {
  const eyeW = size * 0.066 * s, eyeH = size * 0.185 * s;
  const blinkAnim = `bl-blink ${dur(4.6, motion)} ease-in-out infinite`;

  const eye = (side) => {
    const cx = fx + side * gap * 100;
    const left = `${cx}%`, top = `${fy}%`;
    const hi = <div key="h" style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: '48%', height: '20%', borderRadius: '50%', background: 'rgba(255,255,255,0.92)' }} />;
    if (mood === 'happy') {
      return <div key={side} style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', width: eyeW * 2.1, height: eyeW * 1.5, borderTop: `${size * 0.028 * s}px solid ${EYE}`, borderRadius: `${eyeW * 2}px ${eyeW * 2}px 0 0` }} />;
    }
    if (mood === 'sleepy') {
      return <div key={side} style={{ position: 'absolute', left, top: `${fy + 1}%`, transform: 'translate(-50%,-50%)', width: eyeW * 2.1, height: eyeW * 1.4, borderBottom: `${size * 0.028 * s}px solid ${EYE}`, borderRadius: `0 0 ${eyeW * 2}px ${eyeW * 2}px` }} />;
    }
    if (mood === 'love') {
      const hs = size * 0.16 * s;
      return <div key={side} style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', width: hs, height: hs }}>
        <svg viewBox="0 0 24 22" style={{ width: '100%', height: '100%' }}><path d="M12 21 C2 13 1 6 6 3 C9 1 12 4 12 7 C12 4 15 1 18 3 C23 6 22 13 12 21 Z" fill="#FF5C9A" /></svg>
      </div>;
    }
    const wide = mood === 'excited';
    return (
      <div key={side} style={{ position: 'absolute', left, top, transform: 'translate(-50%,-50%)', width: wide ? eyeW * 1.4 : eyeW, height: wide ? eyeH * 1.12 : eyeH, borderRadius: 999, background: EYE, transformOrigin: 'center', animation: blinkAnim }}>{hi}</div>
    );
  };

  const blush = (side) => (
    <div key={'b' + side} style={{
      position: 'absolute', left: `${fx + side * (gap + 0.11) * 100}%`, top: `${fy + size * 0.0002 + 14}%`, transform: 'translate(-50%,-50%)',
      width: size * 0.135 * s, height: size * 0.11 * s, borderRadius: '50%',
      background: 'radial-gradient(circle at 36% 30%, #F4CDFF, #C46BF0 55%, #8A3FC4)',
      boxShadow: `inset ${size * 0.008}px ${size * 0.01}px ${size * 0.018}px rgba(255,255,255,0.6), 0 ${size * 0.008}px ${size * 0.02}px rgba(120,40,160,0.28)`,
    }} />
  );

  let mouth;
  if (mood === 'excited') {
    mouth = <div style={{ position: 'absolute', left: `${fx}%`, top: `${fy + 13}%`, transform: 'translate(-50%,-50%)', width: size * 0.13 * s, height: size * 0.12 * s, borderRadius: '46% 46% 50% 50%', background: EYE, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)', width: '62%', height: '46%', borderRadius: '50%', background: '#FF6Fa3' }} />
    </div>;
  } else if (mood === 'sleepy') {
    mouth = <div style={{ position: 'absolute', left: `${fx}%`, top: `${fy + 12}%`, transform: 'translate(-50%,-50%)', width: size * 0.05 * s, height: size * 0.05 * s, borderRadius: '50%', border: `${size * 0.022 * s}px solid ${EYE}`, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }} />;
  } else {
    const big = mood === 'happy' || mood === 'love';
    mouth = <div style={{ position: 'absolute', left: `${fx}%`, top: `${fy + (big ? 11 : 12)}%`, transform: 'translate(-50%,-50%)', width: (big ? size * 0.19 : size * 0.14) * s, height: (big ? size * 0.1 : size * 0.07) * s, borderBottom: `${size * 0.03 * s}px solid ${EYE}`, borderLeft: `${size * 0.024 * s}px solid transparent`, borderRight: `${size * 0.024 * s}px solid transparent`, borderRadius: `0 0 ${size}px ${size}px` }} />;
  }

  return <>{eye(-1)}{eye(1)}{blush(-1)}{blush(1)}{mouth}</>;
}

function Gloss({ top = '13%', left = '15%', w = '44%', h = '32%', o = 0.8 }) {
  return <div style={{ position: 'absolute', top, left, width: w, height: h, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,${o}), transparent 64%)`, filter: 'blur(1.5px)', pointerEvents: 'none' }} />;
}
function Shadow({ size, motion }) {
  return <div style={{ position: 'absolute', left: '50%', bottom: -size * 0.01, width: size * 0.58, height: size * 0.12, borderRadius: '50%', background: 'radial-gradient(circle, rgba(40,50,90,0.26), transparent 70%)', filter: 'blur(2px)', transform: 'translateX(-50%)', animation: `bl-shadow ${dur(4.4, motion)} ease-in-out infinite`, pointerEvents: 'none' }} />;
}

// generic 3D stage: contact shadow + bob + sway + breathe, with children (shape+face)
function Stage({ size, motion, sway = 3, breathe = 'bl-breathe', children }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Shadow size={size} motion={motion} />
      <div style={{ width: '100%', height: '100%', animation: `bl-bob ${dur(4.4, motion)} ease-in-out infinite` }}>
        <div style={{ width: '100%', height: '100%', animation: `bl-sway ${dur(6, motion)} ease-in-out infinite` }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', animation: `${breathe} ${dur(3.8, motion)} ease-in-out infinite`, transformOrigin: '50% 82%' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// helper for unique gradient ids
function uid() { return 'g' + Math.random().toString(36).slice(2, 8); }

// small limb helpers — give the crew that lively "arms & feet" feel from the art
function Arm({ size, color, side, motion, y = '58%' }) {
  const s = shade(color);
  return (
    <div style={{ position: 'absolute', top: y, [side === -1 ? 'left' : 'right']: '-3%', width: size * 0.16, height: size * 0.09, borderRadius: 999,
      background: `linear-gradient(${side === -1 ? '90deg' : '270deg'}, ${s.dark}, ${s.base})`,
      transformOrigin: side === -1 ? 'right center' : 'left center',
      animation: `bl-arm${side === -1 ? 'L' : 'R'} ${dur(2.6, motion)} ease-in-out infinite`,
      boxShadow: `0 ${size * 0.01}px ${size * 0.02}px ${hexA(color, 0.3)}` }} />
  );
}
function Feet({ size, color }) {
  const s = shade(color);
  const foot = { position: 'absolute', bottom: '-1%', width: size * 0.16, height: size * 0.08, borderRadius: '50%', background: `radial-gradient(circle at 40% 30%, ${s.light}, ${s.dark})` };
  return <>
    <div style={{ ...foot, left: '30%' }} />
    <div style={{ ...foot, right: '30%' }} />
  </>;
}

// ── 1. Kenshy — the blue chat-square hero ────────────────────
function Kenshy({ size = 200, color, mood, motion = 1 }) {
  const g = uid(), s = shade(color);
  return (
    <Stage size={size} motion={motion}>
      <Arm size={size} color={color} side={-1} motion={motion} />
      <Arm size={size} color={color} side={1} motion={motion} />
      <div style={{ position: 'absolute', inset: '4% 8% 8%', filter: `drop-shadow(0 ${size * 0.05}px ${size * 0.09}px ${hexA(color, 0.34)})` }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs><radialGradient id={g} cx="36%" cy="28%" r="86%"><stop offset="0%" stopColor={s.light} /><stop offset="46%" stopColor={s.base} /><stop offset="100%" stopColor={s.dark} /></radialGradient></defs>
          <rect x="8" y="6" width="84" height="84" rx="30" ry="30" fill={`url(#${g})`} stroke={s.rim} strokeWidth={size * 0.05} />
          <path d="M40 88 L34 99 L52 89 Z" fill={s.base} stroke={s.rim} strokeWidth={size * 0.03} strokeLinejoin="round" />
        </svg>
        <Gloss top="14%" left="15%" />
        <Face size={size} mood={mood} motion={motion} fy={45} gap={0.15} />
      </div>
    </Stage>
  );
}

// ── 2. Ember — orange flame ──────────────────────────────────
function Ember({ size = 200, color, mood, motion = 1 }) {
  const g = uid(), s = shade(color);
  return (
    <Stage size={size} motion={motion} sway={4} breathe="bl-flick">
      <Arm size={size} color={color} side={-1} motion={motion} y="62%" />
      <Arm size={size} color={color} side={1} motion={motion} y="62%" />
      <div style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 ${size * 0.05}px ${size * 0.09}px ${hexA(color, 0.4)})` }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs><radialGradient id={g} cx="42%" cy="62%" r="70%"><stop offset="0%" stopColor={s.light} /><stop offset="52%" stopColor={s.base} /><stop offset="100%" stopColor={s.dark} /></radialGradient></defs>
          <path d="M50 4 C60 26 78 30 74 52 C86 48 86 66 78 76 C88 82 78 96 50 96 C22 96 12 82 22 76 C14 66 14 48 26 52 C22 30 40 26 50 4 Z" fill={`url(#${g})`} stroke={s.rim} strokeWidth={size * 0.04} strokeLinejoin="round" />
        </svg>
        <Gloss top="30%" left="26%" w="34%" h="24%" />
        <Face size={size} mood={mood} motion={motion} fy={58} gap={0.13} s={0.9} />
      </div>
    </Stage>
  );
}

// ── 3. Sprout — green leaf sprout ────────────────────────────
function Sprout({ size = 200, color, mood, motion = 1 }) {
  const s = shade(color), leaf = '#5FD08A', leafD = '#39A867';
  return (
    <Stage size={size} motion={motion} breathe="bl-squish">
      {/* sprout on top */}
      <div style={{ position: 'absolute', top: '-4%', left: '50%', transform: 'translateX(-50%)', width: size * 0.5, height: size * 0.3, animation: `bl-sway ${dur(4, motion)} ease-in-out infinite`, transformOrigin: 'bottom center' }}>
        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <path d="M50 60 V26" stroke={leafD} strokeWidth="7" strokeLinecap="round" />
          <path d="M50 34 C30 34 18 22 20 6 C40 6 52 18 50 34 Z" fill={leaf} stroke={leafD} strokeWidth="3" strokeLinejoin="round" />
          <path d="M50 30 C70 30 82 18 80 2 C60 2 48 14 50 30 Z" fill={leaf} stroke={leafD} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
      <Arm size={size} color={color} side={-1} motion={motion} />
      <Arm size={size} color={color} side={1} motion={motion} />
      <div style={{ position: 'absolute', inset: '18% 12% 8%', borderRadius: '46% 46% 48% 48% / 52% 52% 46% 46%',
        background: `radial-gradient(circle at 36% 28%, ${s.light}, ${s.base} 52%, ${s.dark})`,
        boxShadow: `inset ${size * 0.03}px ${size * 0.04}px ${size * 0.06}px rgba(255,255,255,0.5), inset -${size * 0.035}px -${size * 0.045}px ${size * 0.07}px ${hexA('#15224f', 0.3)}, 0 ${size * 0.05}px ${size * 0.1}px ${hexA(color, 0.3)}` }}>
        <Gloss top="14%" left="18%" />
      </div>
      <Face size={size} mood={mood} motion={motion} fy={56} gap={0.14} s={0.92} />
    </Stage>
  );
}

// ── 4. Luna — crescent moon ──────────────────────────────────
function Luna({ size = 200, color, mood, motion = 1 }) {
  const g = uid(), s = shade(color);
  return (
    <Stage size={size} motion={motion} sway={4}>
      <div style={{ position: 'absolute', inset: 0, filter: `drop-shadow(0 ${size * 0.05}px ${size * 0.09}px ${hexA(color, 0.34)})` }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs><radialGradient id={g} cx="34%" cy="30%" r="90%"><stop offset="0%" stopColor={s.light} /><stop offset="52%" stopColor={s.base} /><stop offset="100%" stopColor={s.dark} /></radialGradient></defs>
          <path d="M60 6 A46 46 0 1 0 60 94 A34 36 0 1 1 60 6 Z" fill={`url(#${g})`} stroke={s.rim} strokeWidth={size * 0.045} strokeLinejoin="round" />
        </svg>
        <Gloss top="18%" left="14%" w="34%" h="30%" />
        <Face size={size} mood={mood} motion={motion} fx={44} fy={47} gap={0.12} s={0.9} />
      </div>
      {/* little sparkle stars */}
      {[[84, 22, 0.09], [80, 62, 0.06]].map(([x, y, r], i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: size * r, height: size * r, background: shade(color).light, clipPath: 'polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)', animation: `ken-twinkle ${1.6 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }} />
      ))}
    </Stage>
  );
}

// ── 5. Aqua — water droplet ──────────────────────────────────
function Aqua({ size = 200, color, mood, motion = 1 }) {
  const s = shade(color);
  return (
    <Stage size={size} motion={motion} breathe="bl-wobble">
      <Arm size={size} color={color} side={-1} motion={motion} y="60%" />
      <Arm size={size} color={color} side={1} motion={motion} y="60%" />
      <div style={{ position: 'absolute', inset: '8% 16% 8%', borderRadius: '50% 50% 50% 50% / 68% 68% 38% 38%',
        background: `radial-gradient(circle at 34% 24%, ${s.light}, ${s.base} 50%, ${s.dark})`,
        boxShadow: `inset ${size * 0.035}px ${size * 0.05}px ${size * 0.07}px rgba(255,255,255,0.65), inset -${size * 0.035}px -${size * 0.045}px ${size * 0.07}px ${hexA('#15224f', 0.28)}, 0 ${size * 0.05}px ${size * 0.1}px ${hexA(color, 0.34)}` }}>
        <Gloss top="12%" left="22%" w="40%" h="30%" o={0.9} />
        {/* shine dot */}
        <div style={{ position: 'absolute', top: '30%', left: '66%', width: '10%', height: '8%', borderRadius: '50%', background: 'rgba(255,255,255,0.7)' }} />
      </div>
      <Face size={size} mood={mood} motion={motion} fy={50} gap={0.14} s={0.92} />
    </Stage>
  );
}

// ── 6. Bolt — yellow lightning ───────────────────────────────
function Bolt({ size = 200, color, mood, motion = 1 }) {
  const s = shade(color);
  return (
    <Stage size={size} motion={motion} sway={5} breathe="bl-zap">
      {/* bolt tuft on top */}
      <div style={{ position: 'absolute', top: '-6%', left: '52%', transform: 'translateX(-50%)', width: size * 0.24, height: size * 0.26, animation: `ken-twinkle ${dur(1.4, motion)} ease-in-out infinite` }}>
        <svg viewBox="0 0 40 50" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <path d="M24 2 L6 28 H18 L14 48 L34 20 H22 Z" fill={s.light} stroke={s.dark} strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
      <Arm size={size} color={color} side={-1} motion={motion} />
      <Arm size={size} color={color} side={1} motion={motion} />
      <div style={{ position: 'absolute', inset: '20% 12% 8%', borderRadius: '46%',
        background: `radial-gradient(circle at 35% 26%, ${s.light}, ${s.base} 52%, ${s.dark})`,
        boxShadow: `inset ${size * 0.03}px ${size * 0.04}px ${size * 0.06}px rgba(255,255,255,0.55), inset -${size * 0.035}px -${size * 0.045}px ${size * 0.07}px ${hexA('#15224f', 0.28)}, 0 ${size * 0.05}px ${size * 0.1}px ${hexA(color, 0.34)}` }}>
        <Gloss top="14%" left="18%" />
      </div>
      <Face size={size} mood={mood} motion={motion} fy={57} gap={0.14} s={0.92} />
    </Stage>
  );
}

// ── 7. Bloomi — pink flower ──────────────────────────────────
function Bloomi({ size = 200, color, mood, motion = 1 }) {
  const g = uid(), s = shade(color);
  const petals = Array.from({ length: 7 });
  return (
    <Stage size={size} motion={motion} breathe="bl-breathe">
      <Arm size={size} color={color} side={-1} motion={motion} y="64%" />
      <Arm size={size} color={color} side={1} motion={motion} y="64%" />
      <div style={{ position: 'absolute', inset: '4%', filter: `drop-shadow(0 ${size * 0.05}px ${size * 0.09}px ${hexA(color, 0.34)})` }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs><radialGradient id={g} cx="42%" cy="34%" r="70%"><stop offset="0%" stopColor={s.light} /><stop offset="55%" stopColor={s.base} /><stop offset="100%" stopColor={s.dark} /></radialGradient></defs>
          <g style={{ transformOrigin: '50px 50px', animation: `bl-spin ${dur(22, motion)} linear infinite` }}>
            {petals.map((_, i) => (
              <ellipse key={i} cx="50" cy="20" rx="15" ry="21" fill={`url(#${g})`} stroke={s.rim} strokeWidth="2.5" transform={`rotate(${(360 / petals.length) * i} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="26" fill={`url(#${g})`} stroke={s.rim} strokeWidth="2.5" />
          <circle cx="50" cy="50" r="24" fill={`radial-gradient(${s.light},${s.base})`} opacity="0" />
        </svg>
        <Gloss top="34%" left="30%" w="26%" h="20%" />
        <Face size={size} mood={mood} motion={motion} fy={50} gap={0.12} s={0.82} />
      </div>
    </Stage>
  );
}

// ── Sprite-based crew (finished 3D art, matted to transparent in characters/soft/*) ──
// tint per character so a dark buddy still lifts off a dark surface
function SpriteBody({ src, size = 200, motion = 1, color, style = {} }) {
  const dur = (4.4 / Math.max(0.5, motion)).toFixed(2) + 's';
  const glow = color || '#5B8DEF';
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `bl-bob ${dur} ease-in-out infinite`, ...style }}>
      <div style={{ position: 'absolute', inset: '8% 4% 6%', borderRadius: '50%',
        background: `radial-gradient(circle at 50% 46%, ${glow}30 0%, transparent 66%)`, filter: 'blur(10px)' }} />
      <img src={src} draggable="false" style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none',
        filter: `saturate(1.08) drop-shadow(0 ${size * 0.04}px ${size * 0.08}px rgba(0,0,0,0.28))` }} />
    </div>
  );
}
const mkBody = (src, tint) => (props) => <SpriteBody src={src} color={props.color || tint} {...props} />;
const ASSET_V = '3'; // bump to bust CDN/browser cache when sprite art changes
const soft = (id) => `characters/soft/${id}.png?v=${ASSET_V}`;

const CHARACTERS = [
  { id: 'kenshy', name: 'Kenshy', vibe: 'your first friend', tint: '#3E9BFF', Body: mkBody(soft('kenshy'), '#3E9BFF') },
  { id: 'nova', name: 'Nova', vibe: 'brave hero', tint: '#6C5CE7', Body: mkBody(soft('nova'), '#6C5CE7') },
  { id: 'ember', name: 'Ember', vibe: 'warm & brave', tint: '#FF7A3D', Body: mkBody(soft('ember'), '#FF7A3D') },
  { id: 'sprout', name: 'Sprout', vibe: 'gentle & growing', tint: '#54C86E', Body: mkBody(soft('sprout'), '#54C86E') },
  { id: 'luna', name: 'Luna', vibe: 'quiet & wise', tint: '#9B7CF5', Body: mkBody(soft('luna'), '#9B7CF5') },
  { id: 'aqua', name: 'Aqua', vibe: 'calm & cool', tint: '#36C2E0', Body: mkBody(soft('aqua'), '#36C2E0') },
  { id: 'bolt', name: 'Bolt', vibe: 'zippy & fun', tint: '#FFC92E', Body: mkBody(soft('bolt'), '#FFC92E') },
  { id: 'bloomi', name: 'Bloomi', vibe: 'kind & caring', tint: '#FF7FB0', Body: mkBody(soft('bloomi'), '#FF7FB0') },
];

// ── Shared hero: full-body hi-res buddy with colored aura + ground shadow ──
// One component so every screen shows the SAME 3D character as Home.
function HeroCharacter({ buddy = 'kenshy', color = '#5B8DEF', motion = 1, size = 180, glow = true, style = {} }) {
  const dur = (4.2 / Math.max(0.5, motion)).toFixed(2) + 's';
  const w = size, h = size * 1.42;
  return (
    <div style={{ position: 'relative', width: w, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', ...style }}>
      {glow && <div style={{ position: 'absolute', inset: '6% -14% 8%', borderRadius: '50%',
        background: `radial-gradient(circle at 50% 46%, ${color}4d 0%, ${color}18 46%, transparent 68%)`, filter: 'blur(16px)' }} />}
      <div style={{ position: 'absolute', bottom: '3%', left: '50%', transform: 'translateX(-50%)', width: '50%', height: '5.5%',
        borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(6,3,22,0.5), transparent 78%)', filter: 'blur(2px)' }} />
      <img src={`characters/soft/${buddy}.png`} draggable="false" alt=""
        style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none',
          filter: `saturate(1.12) brightness(1.05) drop-shadow(0 8px 14px ${color}55) drop-shadow(0 10px 16px rgba(0,0,0,0.4))`,
          animation: `bl-bob ${dur} ease-in-out infinite` }} />
    </div>
  );
}

// ── Shared night ground: deep-indigo gradient + drifting twinkles ──
function NightBg({ stars = 24, seed = 7 }) {
  const pts = React.useMemo(() => {
    let s = seed * 9973; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: stars }, () => ({ x: rnd() * 100, y: rnd() * 66, r: 1 + rnd() * 2.1, d: 2.5 + rnd() * 3, delay: rnd() * 4, o: 0.35 + rnd() * 0.5 }));
  }, [stars, seed]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      background: 'radial-gradient(120% 60% at 50% -8%, #3a2570 0%, transparent 55%), radial-gradient(90% 50% at 100% 4%, #4a2a6e 0%, transparent 50%), linear-gradient(178deg, #241653 0%, #1b1140 46%, #150d33 100%)' }}>
      {pts.map((st, i) => (
        <div key={i} style={{ position: 'absolute', left: st.x + '%', top: st.y + '%', width: st.r, height: st.r, borderRadius: '50%',
          background: '#fff', opacity: st.o, boxShadow: '0 0 6px rgba(255,255,255,0.8)',
          animation: `ken-twinkle ${st.d}s ease-in-out ${st.delay}s infinite` }} />
      ))}
    </div>
  );
}

Object.assign(window, { CHARACTERS, SpriteBody, HeroCharacter, NightBg, Face, hexA, shade });
