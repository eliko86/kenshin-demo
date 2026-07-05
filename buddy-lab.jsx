// buddy-lab.jsx — "Choose your buddy." A playful chooser: a big animated 3D hero,
// a rail of all characters (each alive), color swatches, and mood options.

const LAB_COLORS = [
  { name: 'Sky', c: '#3E9BFF' },
  { name: 'Mint', c: '#2FD9A8' },
  { name: 'Grape', c: '#9B7CF5' },
  { name: 'Bubblegum', c: '#FF7FB0' },
  { name: 'Sunshine', c: '#FFB23E' },
  { name: 'Coral', c: '#FF8E6B' },
  { name: 'Aqua', c: '#36C9D6' },
  { name: 'Berry', c: '#C46BF0' },
];
const LAB_MOODS = [
  { k: 'calm', label: 'Calm', emoji: '🙂' },
  { k: 'happy', label: 'Happy', emoji: '😄' },
  { k: 'excited', label: 'Excited', emoji: '🤩' },
  { k: 'love', label: 'Loving', emoji: '🥰' },
  { k: 'sleepy', label: 'Sleepy', emoji: '😴' },
];
const FONT_D = "'Fredoka', system-ui, sans-serif";
const FONT_B = "'Nunito', system-ui, sans-serif";
const INK = '#2B3566', MUTED = '#7A82AE';

function LabApp() {
  const [sel, setSel] = React.useState('kenshy');
  const [color, setColor] = React.useState('#3E9BFF');
  const [mood, setMood] = React.useState('happy');
  const [chosen, setChosen] = React.useState(null);
  const [pop, setPop] = React.useState(0);

  const list = window.CHARACTERS;
  const cur = list.find((c) => c.id === sel) || list[0];
  const Body = cur.Body;

  const choose = () => { setChosen(cur.id); setPop((p) => p + 1); try { localStorage.setItem('kenshin_buddy', JSON.stringify({ id: cur.id, color })); } catch (e) {} };
  const selectChar = (id) => { setSel(id); setPop((p) => p + 1); const c = (window.CHARACTERS || []).find((x) => x.id === id); if (c && c.tint) setColor(c.tint); };

  // moods are automatic — gently cycle to show the buddy is alive & expressive
  React.useEffect(() => {
    const seq = ['happy', 'calm', 'love', 'excited', 'sleepy'];
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % seq.length; setMood(seq[i]); }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: '100vh', fontFamily: FONT_B, color: INK, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '34px 20px 60px' }}>
      {/* header */}
      <div style={{ textAlign: 'center', maxWidth: 680, marginBottom: 6 }}>
        <div style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 34, letterSpacing: 0.3, color: INK }}>Choose your friend</div>
        <div style={{ color: MUTED, fontSize: 15, marginTop: 6, lineHeight: 1.45 }}>
          Meet the <strong style={{ color: INK }}>Kenshin Crew</strong> — seven little friends, all 3D and alive (they bob, breathe, blink and sway). Pick a <strong style={{ color: INK }}>friend</strong> and a <strong style={{ color: INK }}>colour</strong> to make them yours. Their moods you don’t choose: they change on their own, with how the child feels.
        </div>
      </div>

      {/* hero stage */}
      <div style={{ position: 'relative', width: 'min(560px, 94vw)', marginTop: 18, borderRadius: 34, padding: '34px 24px 26px',
        background: `radial-gradient(120% 90% at 50% 0%, ${hexA(color, 0.18)} 0%, #ffffff 62%)`,
        boxShadow: `0 30px 70px ${hexA(color, 0.2)}, inset 0 0 0 1px rgba(43,53,102,0.06)`, overflow: 'hidden' }}>
        <Bokeh color={color} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div key={pop} style={{ animation: 'bl-pop .5s cubic-bezier(.2,.9,.3,1.2)' }}>
            <Body size={232} color={color} mood={mood} motion={1.1} />
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 26, color: INK }}>{cur.name}</div>
            <div style={{ color: MUTED, fontSize: 14, marginTop: 1 }}>{cur.vibe}</div>
          </div>
          {/* moods are automatic — shown cycling, not chosen */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 16, padding: '7px 14px', borderRadius: 999, background: 'rgba(43,53,102,0.05)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
            <span style={{ color: MUTED, fontSize: 12.5, fontWeight: 600, fontFamily: FONT_D }}>Moods change automatically ✦</span>
          </div>
        </div>
      </div>

      {/* colour swatches */}
      <div style={{ marginTop: 26, width: 'min(560px, 94vw)' }}>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>Colour</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {LAB_COLORS.map((cc) => {
            const on = color === cc.c;
            return (
              <button key={cc.c} onClick={() => setColor(cc.c)} title={cc.name} style={{
                width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0,
                background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${cc.c} 20%, white), ${cc.c})`,
                boxShadow: on ? `0 0 0 3px #fff, 0 0 0 5px ${cc.c}, 0 6px 16px ${hexA(cc.c, 0.5)}` : `0 4px 12px ${hexA(cc.c, 0.4)}`,
                transform: on ? 'scale(1.12)' : 'scale(1)', transition: 'all .18s',
              }} />
            );
          })}
        </div>
      </div>

      {/* character rail */}
      <div style={{ marginTop: 30, width: 'min(820px, 96vw)' }}>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>All buddies · tap to try</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14 }}>
          {list.map((c) => {
            const on = sel === c.id;
            const Mini = c.Body;
            return (
              <button key={c.id} onClick={() => selectChar(c.id)} style={{
                border: 'none', cursor: 'pointer', borderRadius: 22, padding: '14px 8px 12px', background: '#fff',
                boxShadow: on ? `0 14px 30px ${hexA(color, 0.28)}, inset 0 0 0 2px ${color}` : '0 8px 22px rgba(43,53,102,0.1), inset 0 0 0 1px rgba(43,53,102,0.05)',
                transform: on ? 'translateY(-3px)' : 'none', transition: 'box-shadow .2s, transform .2s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <Mini size={88} color={on ? color : (c.tint || '#9DB4D6')} mood={on ? 'happy' : 'calm'} motion={on ? 1.1 : 0.8} />
                <span style={{ fontFamily: FONT_D, fontWeight: 600, fontSize: 14, color: on ? INK : MUTED, marginTop: 2 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: MUTED, opacity: 0.8 }}>{c.vibe}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* choose button */}
      <button onClick={choose} style={{
        marginTop: 34, border: 'none', cursor: 'pointer', fontFamily: FONT_D, fontWeight: 600, fontSize: 18,
        color: '#fff', padding: '15px 34px', borderRadius: 999,
        background: `linear-gradient(135deg, color-mix(in srgb, ${color} 85%, white), ${color})`,
        boxShadow: `0 12px 28px ${hexA(color, 0.45)}, inset 0 1px 0 rgba(255,255,255,0.5)`, transition: 'transform .15s',
      }}
        onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
        onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        {chosen === cur.id ? `${cur.name} is your buddy! ✦` : `Make ${cur.name} my buddy ✦`}
      </button>
      {chosen === cur.id && (
        <div style={{ color: MUTED, fontSize: 13, marginTop: 12, textAlign: 'center', maxWidth: 360, lineHeight: 1.5, animation: 'bl-pop .4s ease-out' }}>
          Saved! This is just a preview lab — say the word and I’ll wire <strong style={{ color: INK }}>{cur.name}</strong> through every screen of the app.
        </div>
      )}
    </div>
  );
}

function Bokeh({ color }) {
  const dots = [['#9BC9FF', 10, 14, 80], ['#FFD79A', 82, 20, 60], ['#D9B8FF', 88, 70, 90], ['#A7E8D6', 12, 74, 70]];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots.map((d, i) => (
        <div key={i} style={{ position: 'absolute', left: d[1] + '%', top: d[2] + '%', width: d[3], height: d[3], borderRadius: '50%', background: `radial-gradient(circle, ${d[0]}, transparent 70%)`, opacity: 0.5, filter: 'blur(8px)', animation: `bl-bob ${5 + i}s ease-in-out ${i * 0.6}s infinite` }} />
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LabApp />);
