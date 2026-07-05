// game-kit.jsx — Gamification + emotional-reaction layer shared across screens.
// Exports: useGame, sentiment, GameHUD, Confetti, FloatingEmojis, PointPop, XPRing,
//   Badge, BADGES, Pill

// ── shared game state (persisted, synced across screens via window event) ──
const GAME_KEY = 'kenshin_game_v1';
const GAME_DEFAULT = { points: 120, streak: 3, badges: ['hello', 'brave', 'firststar'] };
function readGame() {
  try { return { ...GAME_DEFAULT, ...JSON.parse(localStorage.getItem(GAME_KEY) || '{}') }; }
  catch (e) { return { ...GAME_DEFAULT }; }
}
function writeGame(g) {
  try { localStorage.setItem(GAME_KEY, JSON.stringify(g)); } catch (e) {}
  window.dispatchEvent(new CustomEvent('kenshin-game', { detail: g }));
}
function levelFor(points) { return Math.floor(points / 80) + 1; }
function levelName(lvl) {
  return ['Spark', 'Spark', 'Glow', 'Brave explorer', 'Bright heart', 'Star-mind', 'Constellation'][Math.min(lvl, 6)] || 'Constellation';
}
function useGame() {
  const [g, setG] = React.useState(readGame);
  React.useEffect(() => {
    const h = (e) => setG(e.detail || readGame());
    window.addEventListener('kenshin-game', h);
    return () => window.removeEventListener('kenshin-game', h);
  }, []);
  const api = React.useMemo(() => ({
    addPoints: (n) => { const c = readGame(); c.points += n; writeGame(c); },
    addBadge: (id) => { const c = readGame(); if (!c.badges.includes(id)) { c.badges.push(id); writeGame(c); } },
    bumpStreak: () => { const c = readGame(); c.streak += 1; writeGame(c); },
  }), []);
  return [{ ...g, level: levelFor(g.points), levelName: levelName(levelFor(g.points)) }, api];
}

// ── badge catalog ────────────────────────────────────────────
const BADGES = {
  hello:     { emoji: '👋', label: 'First hello', color: '#3E9BFF' },
  firststar: { emoji: '✦', label: 'First star', color: '#FFB23E' },
  brave:     { emoji: '🦁', label: 'Brave 5', color: '#FF8E6B' },
  streak7:   { emoji: '🔥', label: '7-day streak', color: '#FF6FA3' },
  kind:      { emoji: '💛', label: 'Kindness', color: '#FFC65B' },
  explorer:  { emoji: '🧭', label: 'Explorer', color: '#34C7B5' },
  breath:    { emoji: '🌬️', label: 'Calm master', color: '#9B8CFF' },
  friend:    { emoji: '🤝', label: 'Made a plan', color: '#C46BF0' },
};

// ── live emotional read of the child's words ─────────────────
const SENT = [
  { k: 'excited', kenMood: 'proud',  emoji: ['🤩', '🎉', '✨'], words: ['excited', "can't wait", 'cant wait', 'yay', 'awesome', 'amazing', 'best', 'woohoo', 'pumped', 'so good'] },
  { k: 'happy',   kenMood: 'happy',  emoji: ['😄', '😁', '🌟'], words: ['happy', 'good', 'great', 'fun', 'glad', 'nice', 'cool', 'smile', 'better', 'okay!', 'yes'] },
  { k: 'love',    kenMood: 'caring', emoji: ['🥰', '💛', '🤗'], words: ['love', 'friend', 'hug', 'care', 'thank', 'sweet', 'kind'] },
  { k: 'sad',     kenMood: 'caring', emoji: ['🥺', '💙', '🫂'], words: ['sad', 'cry', 'lonely', 'alone', 'down', 'miss', 'hurt', 'unhappy', 'bad day'] },
  { k: 'worried', kenMood: 'caring', emoji: ['😟', '🫶', '🌱'], words: ['nervous', 'scared', 'afraid', 'worried', 'anxious', 'shy', 'stress', 'fear', 'what if', "don't know", 'dont know'] },
  { k: 'angry',   kenMood: 'caring', emoji: ['😤', '🌬️', '💢'], words: ['angry', 'mad', 'hate', 'annoyed', 'unfair', 'frustrated', 'grr'] },
];
function sentiment(text) {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return { k: 'neutral', kenMood: 'happy', emoji: ['🙂'] };
  for (const s of SENT) if (s.words.some((w) => t.includes(w))) return s;
  return { k: 'neutral', kenMood: 'listening', emoji: ['💬'] };
}

// ── HUD: points + streak pills (top-right of a screen) ───────
function Pill({ theme, icon, val, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 999, background: '#fff', boxShadow: `0 4px 14px ${theme.line(0.16)}, inset 0 0 0 1px ${theme.line(0.08)}` }}>
      <span style={{ fontSize: 13, filter: `drop-shadow(0 0 5px ${hexA(color, 0.6)})` }}>{icon}</span>
      <span style={{ fontFamily: theme.displayFont, fontWeight: 700, fontSize: 13, color: theme.text }}>{val}</span>
    </div>
  );
}
function GameHUD({ theme, points, streak, style }) {
  return (
    <div style={{ position: 'absolute', top: 52, right: 16, display: 'flex', gap: 8, zIndex: 30, ...style }}>
      <Pill theme={theme} icon="✦" val={points} color={theme.warm} />
      <Pill theme={theme} icon="🔥" val={streak} color={theme.pink} />
    </div>
  );
}

// ── celebratory confetti burst (fire = a changing counter) ───
function Confetti({ fire, theme, count = 28 }) {
  const [burst, setBurst] = React.useState(null);
  React.useEffect(() => {
    if (!fire) return;
    const cols = [theme.primary, theme.secondary, theme.warm, theme.pink];
    setBurst(Array.from({ length: count }, (_, i) => ({
      id: i + '-' + fire, x: 4 + Math.random() * 92, c: cols[i % cols.length],
      d: 1.3 + Math.random() * 1.3, delay: Math.random() * 0.25, r: Math.floor(Math.random() * 360), star: Math.random() > 0.5,
    })));
    const to = setTimeout(() => setBurst(null), 2800);
    return () => clearTimeout(to);
  }, [fire]);
  if (!burst) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 55 }}>
      {burst.map((p) => (
        <div key={p.id} style={{
          position: 'absolute', left: p.x + '%', top: '-6%', width: 10, height: 10, background: p.c,
          borderRadius: p.star ? 0 : 2,
          clipPath: p.star ? 'polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)' : 'none',
          animation: `ken-confetti ${p.d}s ease-in ${p.delay}s forwards`, ['--r']: p.r + 'deg',
        }} />
      ))}
    </div>
  );
}

// ── floating emoji that react to the child (fire = counter) ──
function FloatingEmojis({ fire, emoji, originX = 50, originY = 40 }) {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    if (!fire) return;
    const arr = Array.isArray(emoji) ? emoji : [emoji];
    const batch = Array.from({ length: 3 }, (_, i) => ({
      id: fire + '-' + i + '-' + Math.random().toString(36).slice(2, 5),
      e: arr[i % arr.length], x: originX + (i - 1) * 13 + (Math.random() * 8 - 4), d: 1.5 + Math.random() * 0.7,
    }));
    setItems((v) => [...v, ...batch]);
    const to = setTimeout(() => setItems((v) => v.filter((it) => !batch.includes(it))), 2400);
    return () => clearTimeout(to);
  }, [fire]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 40 }}>
      {items.map((it) => (
        <span key={it.id} style={{ position: 'absolute', left: it.x + '%', top: originY + '%', fontSize: 28, animation: `ken-emoji-float ${it.d}s ease-out forwards` }}>{it.e}</span>
      ))}
    </div>
  );
}

// ── "+N ✦" point pop ─────────────────────────────────────────
function PointPop({ fire, n, label = 'real-world points', color }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (!fire) return; setShow(true);
    const to = setTimeout(() => setShow(false), 1900); return () => clearTimeout(to);
  }, [fire]);
  if (!show) return null;
  const c = color || '#FFB23E';
  return (
    <div style={{ position: 'absolute', left: '50%', top: '26%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 60, pointerEvents: 'none', animation: 'ken-point-pop 1.9s ease-out forwards' }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 38, color: c, textShadow: `0 6px 22px ${hexA(c, 0.45)}` }}>+{n} ✦</div>
      <div style={{ color: c, fontSize: 12.5, fontWeight: 700 }}>{label}</div>
    </div>
  );
}

// ── XP progress ring ─────────────────────────────────────────
function XPRing({ pct, size = 72, color, theme, children }) {
  const r = (size - 9) / 2, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.surf(0.12)} strokeWidth={7} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

// ── collectible badge ────────────────────────────────────────
function Badge({ id, theme, locked }) {
  const b = BADGES[id] || { emoji: '?', label: '', color: theme.primary };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 62, opacity: locked ? 0.5 : 1 }}>
      <div style={{
        width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23,
        background: locked ? theme.surf(0.06) : `linear-gradient(150deg, ${hexA(b.color, 0.28)}, #fff)`,
        boxShadow: locked ? `inset 0 0 0 1.5px ${theme.line(0.14)}` : `inset 0 0 0 1.5px ${hexA(b.color, 0.5)}, 0 6px 16px ${hexA(b.color, 0.22)}`,
      }}>{locked ? '🔒' : b.emoji}</div>
      <span style={{ fontSize: 10, color: theme.muted, textAlign: 'center', lineHeight: 1.2 }}>{locked ? '???' : b.label}</span>
    </div>
  );
}

Object.assign(window, { useGame, sentiment, GameHUD, Pill, Confetti, FloatingEmojis, PointPop, XPRing, Badge, BADGES, levelFor, levelName });
