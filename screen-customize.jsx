// screen-customize.jsx — "Customize Kenshy" + little profile. Styled to the purple
// HOME world. Makes it crystal-clear to a kid what changes the character: a big live
// preview, a friend picker, and a colour picker. Selections apply everywhere live.
// Exports: ScreenCustomize

const PC = {
  bg: 'linear-gradient(180deg,#3A2F72 0%,#2C2462 34%,#241C56 68%,#1E1749 100%)',
  text: '#F5F2FF', muted: '#C3BBEC', dim: '#9A91CE',
  blue: '#5B8DEF', card: 'rgba(48,40,96,0.6)', line: 'rgba(190,181,236,0.20)',
};
const CUST_COLORS = ['#5B8DEF', '#3FC9C0', '#9B7CF5', '#FF7FB0', '#FFB454', '#FF7A3D', '#36C2E0', '#FFD36B'];

function ScreenCustomize({ theme, onBack, buddyId, buddyColor, motion, onSetBuddy, onSetColor, childName }) {
  const D = theme.displayFont, B = theme.bodyFont;
  const CHARS = window.CHARACTERS || [];
  const id = buddyId || 'kenshy';
  const color = buddyColor || PC.blue;
  const M = motion || 1.05;
  const cur = CHARS.find((c) => c.id === id) || CHARS[0];
  const Body = cur?.Body;
  const setBuddy = (v) => onSetBuddy && onSetBuddy(v);
  const setColor = (v) => onSetColor && onSetColor(v);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PC.bg, fontFamily: B, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 40% at 50% 6%, ${hexA(color, 0.3)} 0%, transparent 62%)`, transition: 'background .5s', pointerEvents: 'none' }} />

      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '54px 18px 4px' }}>
        {onBack && <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 1px ${PC.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={PC.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>}
        <span style={{ color: PC.text, fontFamily: D, fontWeight: 700, fontSize: 19 }}>Customize Kenshy</span>
      </div>

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '2px 18px 28px' }}>
        {/* big live preview */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0 6px' }}>
          {Body ? <Body size={150} color={color} mood="happy" motion={M} /> : null}
          <div style={{ marginTop: 4, color: PC.text, fontFamily: D, fontWeight: 700, fontSize: 22 }}>{cur?.name}</div>
          <div style={{ color: PC.muted, fontSize: 13 }}>{cur?.vibe}</div>
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: hexA(color, 0.16), boxShadow: `inset 0 0 0 1px ${hexA(color, 0.4)}` }}>
            <span style={{ fontSize: 13 }}>👇</span>
            <span style={{ color: PC.text, fontSize: 12.5, fontWeight: 600, fontFamily: D }}>Tap a friend or colour to change me!</span>
          </div>
        </div>

        {/* friend picker */}
        <div style={{ color: PC.muted, fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '18px 2px 10px' }}>1 · Choose your friend</div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {CHARS.map((c) => {
            const on = id === c.id; const Mini = c.Body;
            return (
              <button key={c.id} onClick={() => setBuddy(c.id)} style={{ flex: '0 0 auto', width: 84, border: 'none', cursor: 'pointer', borderRadius: 20, padding: '10px 6px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all .2s',
                background: on ? hexA(color, 0.18) : 'rgba(255,255,255,0.05)', boxShadow: on ? `inset 0 0 0 2.5px ${color}, 0 8px 20px ${hexA(color, 0.3)}` : `inset 0 0 0 1px ${PC.line}`, transform: on ? 'translateY(-2px)' : 'none' }}>
                <Mini size={58} color={on ? color : (c.tint || PC.blue)} mood={on ? 'happy' : 'calm'} motion={on ? M : 0.7} />
                <span style={{ fontSize: 12, fontWeight: 600, fontFamily: D, color: on ? PC.text : PC.muted }}>{c.name}</span>
                {on && <span style={{ fontSize: 10, color: color, fontWeight: 700 }}>✓ chosen</span>}
              </button>
            );
          })}
        </div>

        {/* colour picker */}
        <div style={{ color: PC.muted, fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '20px 2px 12px' }}>2 · Pick a colour</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          {CUST_COLORS.map((c) => {
            const on = color.toLowerCase() === c.toLowerCase();
            return (
              <button key={c} onClick={() => setColor(c)} title={c} style={{ width: 46, height: 46, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${c} 22%, white), ${c})`,
                boxShadow: on ? `0 0 0 3px ${'#241C56'}, 0 0 0 6px ${c}, 0 6px 16px ${hexA(c, 0.5)}` : `0 5px 14px ${hexA(c, 0.4)}`,
                transform: on ? 'scale(1.12)' : 'scale(1)', transition: 'all .18s' }} />
            );
          })}
        </div>

        {/* profile note */}
        <div style={{ marginTop: 22, padding: 15, borderRadius: 18, background: PC.card, boxShadow: `inset 0 0 0 1px ${PC.line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#F5A76B,#C97A9E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧒</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: PC.text, fontFamily: D, fontWeight: 700, fontSize: 15 }}>{childName || 'Alex'}</div>
            <div style={{ color: PC.muted, fontSize: 12 }}>Level 12 · your Kenshy is yours to change anytime 💜</div>
          </div>
        </div>

        {onBack && <button onClick={onBack} style={{ width: '100%', marginTop: 18, border: 'none', cursor: 'pointer', fontFamily: D, fontWeight: 600, fontSize: 17, color: '#fff', padding: '14px', borderRadius: 999, background: `linear-gradient(135deg, color-mix(in srgb, ${color} 85%, white), ${color})`, boxShadow: `0 10px 24px ${hexA(color, 0.5)}, inset 0 1px 0 rgba(255,255,255,0.4)` }}>All done ✦</button>}
      </div>
    </div>
  );
}

window.ScreenCustomize = ScreenCustomize;
