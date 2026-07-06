// kenshin-core.jsx — Kenshin the chat-bubble buddy, BRIGHT/light calm theme,
// soft bokeh ambient, shared helpers.
// Exports to window: PALETTES, FONTS, buildTheme, moodColor, Kenshin, Starfield,
//   GlowText, KenButton, hexA

// ── Palettes (bright & calm) ─────────────────────────────────
// each: [lightBg, primary(blue), secondary(mint), warm(sun), pink(blush)]
const PALETTES = {
  'Soft sky':   ['#EAF4FF', '#3E9BFF', '#34C7B5', '#FFB23E', '#C46BF0'],
  'Bubblegum':  ['#FFF0F7', '#5B8DEF', '#FF8FB8', '#FFC65B', '#B06CF0'],
  'Fresh mint': ['#EAFBF4', '#3EC0FF', '#2FD9A8', '#FFCF5B', '#9B8CFF'],
  'Warm peach': ['#FFF4EC', '#FF8E6B', '#FF9F5B', '#FFC95B', '#FF6FA3'],
};

const EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";
const FONTS = {
  Fredoka: `'Fredoka', ${EMOJI}, system-ui, sans-serif`,
  'Baloo 2': `'Baloo 2', ${EMOJI}, system-ui, sans-serif`,
  Quicksand: `'Quicksand', ${EMOJI}, system-ui, sans-serif`,
};

const INK = '#2B3566';      // primary text — deep soft indigo
const INK_TINT = '#33407A'; // surface tint base

// hex + alpha(0..1) -> 8-digit hex
function hexA(hex, a) {
  const h = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
  return hex + h;
}

// Kenshin runs on ONE cohesive night theme. Accents come from the palette;
// the ground, text and translucent surfaces are tuned for a dark room so every
// screen matches Home. `bg` stays a solid hex (it's fed to hexA / box-shadow).
function buildTheme(t) {
  const pal = PALETTES[t.palette] || PALETTES['Soft sky'];
  const [, primary, secondary, warm, pink] = pal;
  const motion = ({ calm: 0.65, lively: 1, playful: 1.45 })[t.motion] ?? 1;
  const LIGHT = '#EDE9FF'; // base for translucent light-on-dark surfaces
  return {
    bg: '#171043',                 // deep indigo ground (solid hex on purpose)
    primary, secondary, warm, pink,
    ink: LIGHT,
    text: '#F4F1FF',
    muted: '#B3ACE0',
    // translucent LIGHT surfaces that read cleanly on the dark ground
    surf: (a) => hexA(LIGHT, Math.min(a * 1.25, 0.5)),
    line: (a) => hexA(LIGHT, Math.min(a * 1.1, 0.42)),
    card: '#221A4A',               // solid dark card surface
    displayFont: FONTS[t.font] || FONTS.Fredoka,
    bodyFont: `'Nunito', ${EMOJI}, system-ui, sans-serif`,
    dark: true,
    motion,
    tone: t.tone || 'gentle',
  };
}

function moodColor(theme, mood) {
  return ({
    calm: theme.primary,
    happy: theme.secondary,
    proud: theme.warm,
    caring: theme.pink,
    listening: theme.secondary,
    thinking: theme.primary,
  })[mood] || theme.primary;
}

// ── Kenshin — the chat-bubble buddy ──────────────────────────
function Kenshin({ color, theme, mood = 'calm', size = 120, motion = 1, breathing = true, look = 'center', style = {} }) {
  const c = color || (theme ? theme.primary : '#3E9BFF');
  const rim = `color-mix(in srgb, ${c} 42%, white)`;
  const breatheDur = (3.8 / Math.max(0.4, motion)).toFixed(2) + 's';
  const floatDur = (5.2 / Math.max(0.4, motion)).toFixed(2) + 's';
  const uid = React.useMemo(() => 'kg' + Math.random().toString(36).slice(2, 8), []);

  const eyeDark = '#15224F';
  const lookX = look === 'left' ? -size * 0.03 : look === 'right' ? size * 0.03 : 0;
  const lookY = look === 'up' ? -size * 0.035 : 0;
  const happy = mood === 'happy' || mood === 'proud';
  const wide = mood === 'listening';

  const eyeW = size * (wide ? 0.085 : 0.072);
  const eyeH = size * (wide ? 0.22 : 0.2);
  const eyeY = 0.40, eyeGap = 0.145;

  const Eye = ({ side }) => {
    const cx = 0.5 + side * eyeGap;
    if (happy) {
      // upward arc (^) happy eye
      return (
        <div style={{
          position: 'absolute', left: `${cx * 100}%`, top: `${(eyeY + 0.04) * 100 + lookY * 100 / size}%`,
          transform: 'translate(-50%,-50%)', width: eyeW * 2.1, height: eyeW * 1.4,
          borderTop: `${size * 0.03}px solid ${eyeDark}`, borderRadius: `${eyeW * 2}px ${eyeW * 2}px 0 0`,
        }} />
      );
    }
    return (
      <div style={{
        position: 'absolute', left: `calc(${cx * 100}% + ${lookX}px)`, top: `calc(${eyeY * 100}% + ${lookY}px)`,
        transform: 'translate(-50%,-50%)', width: eyeW, height: eyeH, borderRadius: eyeW,
        background: eyeDark,
      }}>
        <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', width: '46%', height: '20%', borderRadius: '50%', background: 'rgba(255,255,255,0.92)' }} />
      </div>
    );
  };

  const smileBig = happy || mood === 'caring';
  const Smile = () => {
    if (mood === 'thinking') {
      return <div style={{ position: 'absolute', left: '50%', top: `calc(58% + ${lookY}px)`, transform: 'translate(-50%,-50%)', width: size * 0.06, height: size * 0.035, borderRadius: 999, background: eyeDark }} />;
    }
    return (
      <div style={{
        position: 'absolute', left: '50%', top: `calc(${(smileBig ? 56 : 57)}% + ${lookY}px)`, transform: 'translate(-50%,-50%)',
        width: smileBig ? size * 0.2 : size * 0.15, height: smileBig ? size * 0.1 : size * 0.07,
        borderBottom: `${size * 0.032}px solid ${eyeDark}`,
        borderLeft: `${size * 0.026}px solid transparent`, borderRight: `${size * 0.026}px solid transparent`,
        borderRadius: `0 0 ${size}px ${size}px`,
      }} />
    );
  };

  const Cheek = ({ side }) => (
    <div style={{
      position: 'absolute', left: `${(0.5 + side * 0.255) * 100}%`, top: '60%', transform: 'translate(-50%,-50%)',
      width: size * 0.155, height: size * 0.13, borderRadius: '50%',
      background: `radial-gradient(circle at 36% 30%, #F2CBFF 0%, ${theme ? theme.pink : '#C46BF0'} 52%, color-mix(in srgb, ${theme ? theme.pink : '#C46BF0'} 78%, #6A2E9E) 100%)`,
      boxShadow: `0 ${size * 0.012}px ${size * 0.03}px rgba(120,40,160,0.3), inset ${size * 0.01}px ${size * 0.012}px ${size * 0.02}px rgba(255,255,255,0.6)`,
    }} />
  );

  // proud sparkles around the bubble
  const sparkles = mood === 'proud' ? [0, 1, 2].map((i) => (
    <div key={i} style={{
      position: 'absolute', width: size * 0.11, height: size * 0.11,
      top: [size * -0.06, size * 0.04, size * 0.7][i], left: [size * 0.84, size * -0.08, size * 0.92][i],
      animation: `ken-twinkle ${(1.4 + i * 0.3)}s ease-in-out ${i * 0.2}s infinite`,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: theme ? theme.warm : '#FFB23E', clipPath: 'polygon(50% 0,58% 42%,100% 50%,58% 58%,50% 100%,42% 58%,0 50%,42% 42%)' }} />
    </div>
  )) : null;

  return (
    <div style={{ position: 'relative', width: size, height: size, ...style, animation: `ken-float ${floatDur} ease-in-out infinite` }}>
      {/* soft glow halo */}
      <div style={{
        position: 'absolute', inset: -size * 0.32, borderRadius: '46%',
        background: `radial-gradient(circle, ${hexA(c, 0.4)} 0%, ${hexA(c, 0.1)} 48%, transparent 70%)`,
        filter: 'blur(3px)', pointerEvents: 'none',
        animation: breathing ? `ken-breathe ${breatheDur} ease-in-out infinite` : 'none',
      }} />
      {/* bubble body (svg shape: rounded square + tail) */}
      <div style={{ position: 'absolute', inset: 0, animation: breathing ? `ken-breathe ${breatheDur} ease-in-out infinite` : 'none', filter: `drop-shadow(0 ${size * 0.06}px ${size * 0.12}px ${hexA(c, 0.32)})` }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <radialGradient id={uid} cx="38%" cy="30%" r="85%">
              <stop offset="0%" stopColor={`color-mix(in srgb, ${c} 18%, white)`} />
              <stop offset="48%" stopColor={c} />
              <stop offset="100%" stopColor={`color-mix(in srgb, ${c} 80%, #1c3d7a)`} />
            </radialGradient>
          </defs>
          <path
            d="M28 6 H72 Q92 6 92 26 V60 Q92 80 72 80 H46 L43 92 Q39 98 35 92 L31 80 H28 Q8 80 8 60 V26 Q8 6 28 6 Z"
            fill={`url(#${uid})`} stroke={rim} strokeWidth={size * 0.05} strokeLinejoin="round" />
        </svg>
        {/* top-left gloss */}
        <div style={{ position: 'absolute', top: '14%', left: '14%', width: '46%', height: '34%', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.7), transparent 65%)', filter: 'blur(2px)', pointerEvents: 'none' }} />
        {/* face */}
        <Cheek side={-1} />
        <Cheek side={1} />
        <Eye side={-1} />
        <Eye side={1} />
        <Smile />
      </div>
      {sparkles}
    </div>
  );
}

// ── Ambient: soft floating bokeh (light-friendly) ────────────
function Starfield({ count = 12, seed = 1, motion = 1, color }) {
  const palette = ['#9BC9FF', '#A7E8D6', '#FFD79A', '#D9B8FF', '#FFB8D0'];
  const blobs = React.useMemo(() => {
    let s = seed * 9973;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: count }, (_, i) => ({
      x: rnd() * 100, y: rnd() * 100,
      size: 30 + rnd() * 130,
      c: palette[Math.floor(rnd() * palette.length)],
      o: 0.1 + rnd() * 0.14,
      d: 7 + rnd() * 7, delay: rnd() * 5,
      spark: rnd() > 0.62,
    }));
  }, [count, seed]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {blobs.map((b, i) => b.spark ? (
        <div key={i} style={{
          position: 'absolute', left: b.x + '%', top: b.y + '%', width: 6, height: 6,
          background: b.c, clipPath: 'polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)',
          opacity: 0.7, animation: `ken-twinkle ${(b.d / 2 / Math.max(0.5, motion)).toFixed(2)}s ease-in-out ${b.delay}s infinite`,
        }} />
      ) : (
        <div key={i} style={{
          position: 'absolute', left: b.x + '%', top: b.y + '%',
          width: b.size, height: b.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
          opacity: b.o, filter: 'blur(6px)',
          animation: `ken-float ${(b.d / Math.max(0.5, motion)).toFixed(2)}s ease-in-out ${b.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function GlowText({ children, color = INK, size = 16, weight = 600, glow = 0.4, style = {}, font }) {
  return (
    <span style={{
      color, fontSize: size, fontWeight: weight, fontFamily: font,
      textShadow: glow > 0 ? `0 1px 0 rgba(255,255,255,0.5), 0 0 ${size * 0.5}px ${hexA(typeof color === 'string' && color.startsWith('#') ? color : '#3E9BFF', glow * 0.35)}` : 'none',
      ...style,
    }}>{children}</span>
  );
}

function KenButton({ children, onClick, theme, variant = 'solid', color, style = {}, disabled }) {
  const c = color || theme.primary;
  const base = {
    border: 'none', cursor: disabled ? 'default' : 'pointer', font: 'inherit',
    fontFamily: theme.displayFont, fontWeight: 600, fontSize: 17,
    padding: '14px 22px', borderRadius: 999, letterSpacing: 0.2,
    transition: 'transform .15s ease, box-shadow .25s ease, opacity .2s',
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    solid: {
      color: '#fff', background: `linear-gradient(135deg, color-mix(in srgb, ${c} 85%, white), ${c})`,
      boxShadow: `0 10px 24px ${hexA(c, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.5)`,
    },
    ghost: {
      color: theme.text, background: theme.surf(0.06),
      boxShadow: `inset 0 0 0 1.5px ${theme.line(0.16)}`,
    },
  };
  return (
    <button disabled={disabled} onClick={onClick}
      onPointerDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.95)'; }}
      onPointerUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

Object.assign(window, { PALETTES, FONTS, buildTheme, moodColor, Kenshin, Starfield, GlowText, KenButton, hexA });
