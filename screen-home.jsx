// screen-home.jsx — the HOME hub, redesigned for kids-first UX:
// calm, uncluttered, big friendly targets, one gentle daily ritual (mood check-in),
// four large activity choices, one clear mission, a soft daily tip. Everything is
// reachable in one tap; nothing competes for attention.
// Exports: ScreenHome

const H = {
  text: '#F5F2FF', muted: '#C3BBEC', dim: '#9A91CE',
  blue: '#5B8DEF', teal: '#3FC9C0', lav: '#9B7CF5', amber: '#FFB454', pink: '#FF7FB0', gold: '#FFD36B',
  card: 'rgba(48,40,96,0.55)', line: 'rgba(190,181,236,0.18)',
};

function ScreenHome({ theme }) {
  const D = theme.displayFont, B = theme.bodyFont;
  const KenBody = (window.CHARACTERS || []).find((c) => c.id === 'kenshy')?.Body;

  const [mood, setMood] = React.useState(null);
  const MOODS = [
    { k: 'great', e: '😄', label: 'Great', c: H.teal },
    { k: 'good', e: '🙂', label: 'Good', c: H.blue },
    { k: 'meh', e: '😐', label: 'Okay', c: H.lav },
    { k: 'low', e: '😔', label: 'Low', c: H.pink },
  ];

  // four big, calm activity choices — single words, large targets
  const ACTS = [
    { key: 'Chat', sub: 'Talk about anything', c: H.blue, Icon: IChat },
    { key: 'Play', sub: 'Games together', c: H.teal, Icon: IGame },
    { key: 'Calm', sub: 'Breathe & relax', c: H.lav, Icon: ILeaf },
    { key: 'Create', sub: 'Dress up Kenshy', c: H.amber, Icon: IShirt },
  ];

  const NAV = [
    { key: 'Home', Icon: IHome, on: true },
    { key: 'Missions', Icon: IFlag },
    { key: '__ken' },
    { key: 'Store', Icon: IBag },
    { key: 'Me', Icon: ISmile },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', fontFamily: B, display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg,#3A2F72 0%,#2C2462 34%,#241C56 68%,#1E1749 100%)' }}>
      <CalmRoom />

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', paddingBottom: 96 }}>
        {/* ── top bar (light, uncluttered) ── */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '54px 20px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#6455C8,#4133A0)', boxShadow: '0 6px 16px rgba(60,40,150,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="11" r="1.4" fill="#fff"/><circle cx="15" cy="11" r="1.4" fill="#fff"/><path d="M9 14.5c1 1 5 1 6 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </div>
            <span style={{ color: H.text, fontFamily: D, fontWeight: 600, fontSize: 18 }}>kenshin.ai</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: 'rgba(26,20,60,0.5)', boxShadow: `inset 0 0 0 1px ${H.line}`, color: H.text, fontWeight: 700, fontSize: 14, fontFamily: D }}>⭐ 125</div>
            <div style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#F5A76B,#C97A9E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧒
              <span style={{ position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: '50%', background: '#3DDC84', boxShadow: '0 0 0 2px #241a4a' }} />
            </div>
          </div>
        </div>

        {/* ── hero: greeting + Kenshy (one clear focal point) ── */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '16px 20px 0' }}>
          <div style={{ color: H.text, fontFamily: D, fontWeight: 700, fontSize: 27, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>Hey there, Alex! 👋</div>
          <div style={{ color: H.muted, fontSize: 14.5, marginTop: 4 }}>Nice to see you. What shall we do?</div>

          <div style={{ position: 'relative', height: 176, marginTop: 4, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {/* soft rug */}
            <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 190, height: 44, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,124,245,0.5), transparent 72%)' }} />
            {KenBody ? <div style={{ position: 'relative' }}><KenBody size={158} color={H.blue} mood="happy" motion={1.05} /></div> : null}
            {/* gentle speech bubble */}
            <div style={{ position: 'absolute', top: 8, right: 8, padding: '8px 13px', borderRadius: '16px 16px 16px 4px', background: 'rgba(48,40,96,0.85)', boxShadow: `inset 0 0 0 1px ${H.line}`, maxWidth: 130 }}>
              <div style={{ color: H.text, fontSize: 12.5, fontWeight: 600, fontFamily: D, lineHeight: 1.3 }}>I’m so happy you’re here 💜</div>
            </div>
          </div>
        </div>

        {/* ── the daily ritual: mood check-in, big and inviting ── */}
        <div style={{ position: 'relative', margin: '6px 16px 0', padding: '15px 16px', borderRadius: 24, background: H.card, boxShadow: `inset 0 0 0 1px ${H.line}`, backdropFilter: 'blur(6px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: H.text, fontFamily: D, fontWeight: 600, fontSize: 16 }}>{mood ? 'Thanks for sharing 💜' : 'How are you feeling?'}</span>
            {mood && <span style={{ color: H.muted, fontSize: 12.5 }}>tap to change</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {MOODS.map((m) => {
              const on = mood === m.k;
              return (
                <button key={m.k} onClick={() => setMood(m.k)} style={{
                  border: 'none', cursor: 'pointer', borderRadius: 18, padding: '12px 4px', minHeight: 72,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all .18s',
                  background: on ? hexA(m.c, 0.28) : 'rgba(255,255,255,0.06)',
                  boxShadow: on ? `inset 0 0 0 2px ${m.c}, 0 8px 18px ${hexA(m.c, 0.35)}` : 'none',
                  transform: on ? 'translateY(-2px)' : 'none',
                }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{m.e}</span>
                  <span style={{ color: on ? H.text : H.muted, fontSize: 12, fontWeight: 600, fontFamily: D }}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── four big activity choices (2×2, generous targets) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 16px 0' }}>
          {ACTS.map((a) => (
            <button key={a.key} style={{
              position: 'relative', border: 'none', cursor: 'pointer', borderRadius: 24, padding: '16px 16px', minHeight: 96, textAlign: 'left', color: '#fff', overflow: 'hidden',
              background: `linear-gradient(150deg, ${a.c}, ${shade(a.c).dark})`,
              boxShadow: `0 10px 24px ${hexA(a.c, 0.4)}, inset 0 1px 0 rgba(255,255,255,0.25)`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform .14s',
            }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <span style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><a.Icon /></span>
              <span>
                <span style={{ display: 'block', fontFamily: D, fontWeight: 700, fontSize: 19, lineHeight: 1 }}>{a.key}</span>
                <span style={{ display: 'block', fontSize: 12, opacity: 0.92, marginTop: 3 }}>{a.sub}</span>
              </span>
            </button>
          ))}
        </div>

        {/* ── one clear mission ── */}
        <div style={{ margin: '14px 16px 0', padding: 16, borderRadius: 24, background: 'linear-gradient(150deg, rgba(255,180,84,0.18), rgba(48,40,96,0.5))', boxShadow: `inset 0 0 0 1px ${H.line}`, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: H.gold, fontSize: 12, fontWeight: 700, fontFamily: D, letterSpacing: 0.3 }}>🚩 TODAY’S MISSION</div>
            <div style={{ color: H.text, fontFamily: D, fontWeight: 700, fontSize: 18, marginTop: 5 }}>Spread Kindness</div>
            <div style={{ color: H.muted, fontSize: 12.5, marginTop: 3, lineHeight: 1.35 }}>Do 3 kind things and tell me about them!</div>
            {/* progress dots — clearer than a fraction for kids */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11 }}>
              {[1, 1, 0].map((done, i) => (
                <span key={i} style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', background: done ? H.teal : 'rgba(255,255,255,0.12)', boxShadow: done ? `0 2px 8px ${hexA(H.teal, 0.5)}` : 'none' }}>{done ? '✓' : ''}</span>
              ))}
              <span style={{ marginLeft: 6, color: H.gold, fontSize: 12.5, fontWeight: 700, fontFamily: D }}>⭐ +30</span>
            </div>
          </div>
          <div style={{ fontSize: 52, filter: 'drop-shadow(0 6px 14px rgba(255,206,62,0.45))' }}>🌟</div>
        </div>

        {/* ── soft daily tip ── */}
        <div style={{ margin: '12px 16px 0', padding: '14px 16px', borderRadius: 24, background: H.card, boxShadow: `inset 0 0 0 1px ${H.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: H.muted, fontSize: 11.5, fontWeight: 700, fontFamily: D }}>❤️ KENSHY’S TIP</div>
            <div style={{ color: H.text, fontSize: 13.5, marginTop: 5, lineHeight: 1.4, fontWeight: 600 }}>You don’t have to be perfect to be amazing. Just be you! ✨</div>
          </div>
          <div style={{ flexShrink: 0 }}>{KenBody ? <KenBody size={56} color={H.blue} mood="happy" motion={0.85} /> : null}</div>
        </div>
      </div>

      {/* ── bottom nav: 5 clear destinations, big targets ── */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '10px 12px 26px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
        background: 'linear-gradient(180deg, rgba(30,23,73,0), rgba(24,18,60,0.96) 42%)', backdropFilter: 'blur(12px)' }}>
        {NAV.map((n) => n.key === '__ken' ? (
          <div key="ken" style={{ display: 'flex', justifyContent: 'center', marginTop: -24, width: 64 }}>
            <button style={{ width: 62, height: 62, borderRadius: 20, border: 'none', cursor: 'pointer', background: 'linear-gradient(145deg,#5B8DEF,#3E63E0)', boxShadow: '0 10px 24px rgba(62,99,224,0.6), inset 0 1px 0 rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="9.3" cy="11" r="1.6" fill="#fff"/><circle cx="14.7" cy="11" r="1.6" fill="#fff"/><path d="M9.3 14c1 1 4.4 1 5.4 0" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </button>
          </div>
        ) : (
          <button key={n.key} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 56, minHeight: 48, color: n.on ? H.text : H.dim }}>
            <span style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.on ? H.blue : H.dim }}><n.Icon /></span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: D }}>{n.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── calm room backdrop (subtle, uncluttered) ──
function CalmRoom() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 420, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,110,235,0.38), transparent 66%)' }} />
      {/* soft window */}
      <div style={{ position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)', width: 210, height: 132, borderRadius: '16px 16px 10px 10px', background: 'linear-gradient(180deg,#33407C,#3A2E6E)', boxShadow: 'inset 0 0 0 4px rgba(120,105,190,0.35)', opacity: 0.7 }}>
        <div style={{ position: 'absolute', top: 6, bottom: 6, left: '50%', width: 3, transform: 'translateX(-50%)', background: 'rgba(120,105,190,0.4)' }} />
        <div style={{ position: 'absolute', left: 6, right: 6, top: '50%', height: 3, transform: 'translateY(-50%)', background: 'rgba(120,105,190,0.4)' }} />
        <div style={{ position: 'absolute', top: 16, right: 24, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%,#FFF3C4,#F5D06B)', boxShadow: '0 0 14px rgba(255,220,120,0.6)' }} />
      </div>
      {/* gentle floating sparkles */}
      {[[16, 150], [86, 130], [24, 250], [80, 240]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x + '%', top: y, width: 6, height: 6, background: ['#9BC9FF', '#FFD79A', '#D9B8FF', '#A7E8D6'][i], clipPath: 'polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%)', opacity: 0.6, animation: `ken-twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.4}s infinite` }} />
      ))}
    </div>
  );
}

// ── friendly line icons ──
function IChat() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z" fill="#fff" opacity="0.25"/><path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v7a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="9" cy="9.5" r="1.1" fill="#fff"/><circle cx="12" cy="9.5" r="1.1" fill="#fff"/><circle cx="15" cy="9.5" r="1.1" fill="#fff"/></svg>; }
function IGame() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="10" rx="5" fill="#fff" opacity="0.25" stroke="#fff" strokeWidth="1.7"/><path d="M8 11v4M6 13h4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/><circle cx="16" cy="12.5" r="1.2" fill="#fff"/><circle cx="18" cy="14.5" r="1.2" fill="#fff"/></svg>; }
function ILeaf() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" fill="#fff" opacity="0.25" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round"/><path d="M5 19C9 15 13 11 17 9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function IShirt() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 4l3 2 3-2 4 3-2 3-2-1v8H9v-8l-2 1-2-3 4-3z" fill="#fff" opacity="0.25" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round"/></svg>; }
function IBag() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 11a1 1 0 01-1 1H8a1 1 0 01-1-1L6 8z" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function IFlag() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 3v18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M6 4h11l-2 3 2 3H6V4z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>; }
function IHome() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>; }
function ISmile() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.7"/><circle cx="9.5" cy="10.5" r="1.1" fill="currentColor"/><circle cx="14.5" cy="10.5" r="1.1" fill="currentColor"/><path d="M9 14c1 1.2 5 1.2 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }

window.ScreenHome = ScreenHome;
