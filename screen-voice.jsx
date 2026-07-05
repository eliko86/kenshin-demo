// screen-voice.jsx — Living voice-first conversation. No chat bubbles: the child's
// words and Kenshin's replies appear as drifting light. Hold the orb-mic to talk.
// Exports: ScreenVoice

function ScreenVoice({ theme, buddyId, buddyColor }) {
  const SCRIPT = [
    { child: "I want to sit with someone new at lunch… but it's kind of scary.",
      ken: "That takes guts to even want. Who's one person there who seems kind?" },
    { child: "Maybe Maya. She likes drawing, like me.",
      ken: "Drawing is a perfect bridge. You could just ask what she's working on." },
    { child: "Okay… I think I could try that tomorrow.",
      ken: "I believe you. Come tell me how it goes — I want to hear about Maya, not about me." },
  ];
  const TONE_LEAD = { gentle: '', playful: 'Ooh — ', chill: '' };

  const [turn, setTurn] = React.useState(0);
  const [phase, setPhase] = React.useState('idle'); // idle | listening | thinking | replying
  const [childShown, setChildShown] = React.useState('');
  const [kenShown, setKenShown] = React.useState('');
  const typer = React.useRef(null);
  const ex = SCRIPT[turn];

  const stopTyper = () => { if (typer.current) { clearInterval(typer.current); typer.current = null; } };
  const type = (full, setter, speed, done) => {
    stopTyper(); let i = 0; setter('');
    typer.current = setInterval(() => {
      i++; setter(full.slice(0, i));
      if (i >= full.length) { stopTyper(); done && done(); }
    }, speed);
  };

  React.useEffect(() => () => stopTyper(), []);

  const start = () => {
    if (phase !== 'idle') return;
    setKenShown(''); setChildShown('');
    setPhase('listening');
    type(ex.child, setChildShown, 38);
  };
  const finish = () => {
    if (phase !== 'listening') return;
    stopTyper(); setChildShown(ex.child);
    setPhase('thinking');
    setTimeout(() => {
      setPhase('replying');
      type(ex.ken, setKenShown, 30, () => {
        setPhase('idle');
        setTimeout(() => setTurn((t) => (t + 1) % SCRIPT.length), 1400);
      });
    }, 1150);
  };

  React.useEffect(() => {
    if (phase !== 'listening') return;
    const up = () => finish();
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, [phase]);

  const kColor = phase === 'listening' ? theme.secondary
    : phase === 'replying' ? theme.pink
    : phase === 'thinking' ? theme.primary : theme.primary;
  const kMood = phase === 'listening' ? 'listening'
    : phase === 'thinking' ? 'thinking'
    : phase === 'replying' ? 'caring' : 'calm';

  const label = { idle: 'Hold to talk', listening: 'Listening…', thinking: 'thinking…', replying: 'Kenshin' }[phase];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont }}>
      <div style={{
        position: 'absolute', inset: 0, transition: 'background .8s',
        background: `radial-gradient(90% 60% at 50% 38%, ${hexA(kColor, 0.32)} 0%, transparent 60%), radial-gradient(70% 40% at 50% 100%, ${hexA(theme.primary, 0.16)} 0%, transparent 60%)`,
      }} />
      <Starfield count={26} seed={7} motion={theme.motion} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '74px 24px 36px' }}>
        {/* AI disclosure — required, made warm */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999,
            background: theme.surf(0.06), boxShadow: `inset 0 0 0 1px ${theme.surf(0.12)}`,
            color: theme.muted, fontSize: 11.5, fontWeight: 600,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.secondary, boxShadow: `0 0 8px ${theme.secondary}` }} />
            I'm an AI · your real friends are the goal
          </div>
        </div>

        {/* child's words — drifting light, upper area */}
        <div style={{ minHeight: 84, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', textAlign: 'right' }}>
          <div style={{
            maxWidth: '88%', transition: 'opacity .5s',
            opacity: childShown ? 1 : 0,
          }}>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>you</div>
            <span style={{ color: hexA(theme.text, 0.92), fontSize: 18, fontWeight: 500, lineHeight: 1.4, fontStyle: 'italic' }}>
              {childShown}{phase === 'listening' && <Caret color={theme.secondary} />}
            </span>
          </div>
        </div>

        {/* Kenshin */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <HeroCharacter buddy={buddyId || 'kenshy'} color={kColor || buddyColor || theme.primary} motion={theme.motion} size={150} />
          {/* Kenshin reply — warm glowing light */}
          <div style={{ minHeight: 78, maxWidth: 320, textAlign: 'center' }}>
            {(phase === 'replying' || (phase === 'idle' && kenShown)) && (
              <GlowText color={theme.text} size={20} weight={600} font={theme.displayFont} glow={0.4}
                style={{ lineHeight: 1.45 }}>
                {kenShown}{phase === 'replying' && <Caret color={theme.pink} />}
              </GlowText>
            )}
            {phase === 'thinking' && <ThinkingDots color={theme.primary} />}
          </div>
        </div>

        {/* hold-to-talk mic */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Waveform active={phase === 'listening'} color={kColor} />
          <button
            onPointerDown={(e) => { e.preventDefault(); start(); }}
            style={{
              position: 'relative', width: 88, height: 88, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: `radial-gradient(circle at 38% 32%, ${hexA('#fff', 0.5)}, ${kColor})`,
              boxShadow: phase === 'listening'
                ? `0 0 0 12px ${hexA(kColor, 0.16)}, 0 0 0 26px ${hexA(kColor, 0.08)}, 0 0 36px ${hexA(kColor, 0.7)}`
                : `0 10px 30px ${hexA(kColor, 0.5)}, inset 0 2px 6px rgba(255,255,255,0.4)`,
              transition: 'box-shadow .25s, transform .15s', touchAction: 'none',
              transform: phase === 'listening' ? 'scale(1.06)' : 'scale(1)',
            }}>
            {/* mic glyph (simple rounded rect + base) */}
            <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', width: 18, height: 28, borderRadius: 999, background: 'rgba(26,17,54,0.78)' }} />
            <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', width: 30, height: 14, borderBottom: '3px solid rgba(26,17,54,0.78)', borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderRadius: '0 0 16px 16px' }} />
          </button>
          <div style={{ color: phase === 'idle' ? theme.muted : kColor, fontSize: 13, fontWeight: 600, fontFamily: theme.displayFont, letterSpacing: 0.3, height: 18 }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

function Caret({ color }) {
  return <span style={{ display: 'inline-block', width: 2, height: '1em', marginLeft: 2, background: color, verticalAlign: '-2px', animation: 'ken-caret 1s steps(1) infinite', boxShadow: `0 0 6px ${color}` }} />;
}
function ThinkingDots({ color }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center', paddingTop: 22 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}`, animation: `ken-bounce 1.1s ease-in-out ${i * 0.16}s infinite` }} />
      ))}
    </div>
  );
}
function Waveform({ active, color }) {
  const bars = 18;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 30 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const d = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2); // 0 center -> 1 edge
        return (
          <div key={i} style={{
            width: 4, borderRadius: 999, background: active ? color : hexA(color, 0.25),
            height: active ? undefined : 5,
            boxShadow: active ? `0 0 8px ${hexA(color, 0.7)}` : 'none',
            animation: active ? `ken-wave ${(0.55 + d * 0.3).toFixed(2)}s ease-in-out ${i * 0.05}s infinite` : 'none',
            transformOrigin: 'center',
          }} />
        );
      })}
    </div>
  );
}

window.ScreenVoice = ScreenVoice;
