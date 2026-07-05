// screen-checkin.jsx — "How's your sky tonight?" feelings check-in.
// Tap a mood-aurora to bloom it; drag the shooting-star beam to rate intensity.
// Exports: ScreenCheckin

function ScreenCheckin({ theme, onNav }) {
  const MOODS = [
    { key: 'Happy',   emoji: '😄', color: theme.secondary, mood: 'happy',  line: "Love that. What made it good?" },
    { key: 'Excited', emoji: '🤩', color: theme.warm,      mood: 'proud',  line: "Ooh! Tell me what you're excited about." },
    { key: 'Calm',    emoji: '😌', color: theme.primary,   mood: 'calm',   line: "A calm sky is a good sky." },
    { key: 'Loved',   emoji: '🥰', color: theme.pink,      mood: 'caring', line: "That's a warm feeling to carry." },
    { key: 'Meh',     emoji: '😐', color: '#8E9BD9',       mood: 'calm',   line: "Some days are just in-between. That's okay." },
    { key: 'Worried', emoji: '😟', color: '#F0A45B',       mood: 'caring', line: "I'm right here. We can sit with it." },
    { key: 'Sad',     emoji: '🥺', color: '#5B8DEF',       mood: 'caring', line: "Thank you for telling me. You're not alone." },
    { key: 'Angry',   emoji: '😤', color: '#E8606B',       mood: 'caring', line: "Big feeling. Let's let some of it out." },
  ];
  const RATE = ['a tiny bit', 'a little', 'some', 'a lot', 'so much'];
  const COPY = {
    gentle:  { hi: "How’s your sky tonight?", sub: 'Tap the feeling that fits right now.' },
    playful: { hi: "Hey you! What’s the weather in there?", sub: 'Tap whatever’s glowing in you.' },
    chill:   { hi: "What’s your vibe right now?", sub: 'Tap what fits.' },
  };
  const copy = COPY[theme.tone] || COPY.gentle;

  const [sel, setSel] = React.useState(null);
  const [val, setVal] = React.useState(3);
  const [done, setDone] = React.useState(false);
  const [g, game] = useGame();
  const [emojiFire, setEmojiFire] = React.useState(0);
  const [celebrate, setCelebrate] = React.useState(0);
  const beamRef = React.useRef(null);
  const m = sel != null ? MOODS[sel] : null;

  const confirm = () => {
    setDone(true); setCelebrate((c) => c + 1);
    game.addPoints(5); game.bumpStreak();
  };

  const setFromY = (clientY) => {
    const el = beamRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = 1 - (clientY - r.top) / r.height; // top = high
    setVal(Math.max(1, Math.min(5, Math.round(ratio * 4 + 1))));
  };
  const drag = (e) => {
    e.preventDefault();
    setFromY(e.clientY);
    const move = (ev) => setFromY(ev.clientY);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const glow = m ? m.color : theme.primary;

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: theme.bg, fontFamily: theme.bodyFont,
      transition: 'background .6s',
    }}>
      {/* aurora wash that tints to the chosen mood */}
      <div style={{
        position: 'absolute', inset: 0, transition: 'opacity .8s, background .8s',
        background: `radial-gradient(120% 70% at 50% 6%, ${hexA(glow, m ? 0.5 : 0.32)} 0%, transparent 58%), radial-gradient(90% 50% at 80% 96%, ${hexA(theme.pink, 0.16)} 0%, transparent 60%)`,
      }} />
      <Starfield count={30} seed={3} motion={theme.motion} />
      <FloatingEmojis fire={emojiFire} emoji={m ? m.emoji : '✨'} originY={46} />
      <Confetti fire={celebrate} theme={theme} count={22} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '78px 22px 40px' }}>
        {/* greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <Kenshin theme={theme} mood={done ? 'proud' : (m ? m.mood : 'calm')} size={62} motion={theme.motion} color={glow} />
          <div style={{ flex: 1 }}>
            <GlowText color={theme.text} size={21} weight={600} font={theme.displayFont} glow={0.35}>
              {done ? "Thanks for telling me. ✦" : copy.hi}
            </GlowText>
            <div style={{ color: theme.muted, fontSize: 13.5, marginTop: 3, lineHeight: 1.35, minHeight: 18 }}>
              {done ? "Naming a feeling is brave. Want to take a breath together?" : (m ? m.line : copy.sub)}
            </div>
          </div>
        </div>

        {/* mood auroras */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 18,
          transition: 'opacity .4s, transform .4s',
          opacity: done ? 0.35 : 1,
        }}>
          {MOODS.map((mm, i) => {
            const active = sel === i;
            return (
              <button key={mm.key} onClick={() => { setSel(i); setDone(false); setEmojiFire((f) => f + 1); }}
                style={{
                  position: 'relative', border: 'none', cursor: 'pointer',
                  borderRadius: 22, padding: '16px 14px', textAlign: 'left',
                  fontFamily: theme.displayFont, color: theme.text, fontSize: 17, fontWeight: 600,
                  background: active ? hexA(mm.color, 0.22) : theme.surf(0.05),
                  boxShadow: active
                    ? `inset 0 0 0 1.5px ${hexA(mm.color, 0.8)}, 0 10px 30px ${hexA(mm.color, 0.35)}`
                    : `inset 0 0 0 1px ${theme.surf(0.1)}`,
                  transform: active ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all .25s cubic-bezier(.2,.8,.2,1)',
                  display: 'flex', alignItems: 'center', gap: 11,
                }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: `radial-gradient(circle at 35% 30%, #fff, ${mm.color})`,
                  boxShadow: `0 0 ${active ? 16 : 9}px ${hexA(mm.color, 0.9)}`,
                  transition: 'box-shadow .25s',
                }} />
                {mm.key}
              </button>
            );
          })}
        </div>

        {/* intensity beam */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26,
          marginTop: 16, opacity: m ? 1 : 0.25, pointerEvents: m ? 'auto' : 'none',
          transition: 'opacity .4s',
        }}>
          <div style={{ textAlign: 'right', width: 96 }}>
            <div style={{ color: theme.muted, fontSize: 12.5, marginBottom: 4 }}>and it feels like</div>
            <GlowText color={glow} size={22} weight={700} font={theme.displayFont} glow={0.5}>
              {RATE[val - 1]}
            </GlowText>
          </div>
          {/* the beam */}
          <div ref={beamRef} onPointerDown={drag}
            style={{ position: 'relative', width: 54, height: 210, cursor: 'grab', touchAction: 'none' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 5, transform: 'translateX(-50%)',
              borderRadius: 999, background: theme.surf(0.1),
            }} />
            <div style={{
              position: 'absolute', left: '50%', bottom: 0, width: 5, transform: 'translateX(-50%)',
              height: `${(val - 1) / 4 * 100}%`, borderRadius: 999,
              background: `linear-gradient(to top, ${glow}, ${hexA(glow, 0.5)})`,
              boxShadow: `0 0 16px ${hexA(glow, 0.8)}`, transition: 'height .2s, background .4s',
            }} />
            {/* notches */}
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} style={{
                position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)',
                bottom: `calc(${n / 4 * 100}% - 1px)`, width: 11, height: 11, borderRadius: '50%',
                background: n <= val - 1 ? glow : theme.surf(0.18),
              }} />
            ))}
            {/* draggable star handle */}
            <div style={{
              position: 'absolute', left: '50%', bottom: `${(val - 1) / 4 * 100}%`,
              transform: 'translate(-50%, 50%)', width: 30, height: 30,
              transition: 'bottom .15s', filter: `drop-shadow(0 0 10px ${hexA(glow, 0.9)})`,
            }}>
              <div style={{ position: 'absolute', inset: 0, background: glow, clipPath: 'polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)' }} />
            </div>
          </div>
        </div>

        {/* action */}
        <div style={{ marginTop: 'auto' }}>
          {!done ? (
            <KenButton theme={theme} color={glow} disabled={!m} onClick={confirm}
              style={{ width: '100%' }}>
              {m ? 'That’s my sky tonight ✦' : 'Pick a feeling first'}
            </KenButton>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <KenButton theme={theme} variant="ghost" onClick={() => { setSel(null); setDone(false); setVal(3); }}
                style={{ flex: '0 0 auto', width: 128 }}>
                Again
              </KenButton>
              <KenButton theme={theme} color={glow} onClick={() => onNav && onNav('breathe')}
                style={{ flex: 1 }}>
                Breathe together ✦
              </KenButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.ScreenCheckin = ScreenCheckin;
