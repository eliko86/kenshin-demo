// screen-breathe.jsx — "Breathe with me." Kenshin becomes a breathing guide:
// the orb + halo expand on the inhale, hold, and shrink on the exhale; particles
// drift inward and outward with the breath. Exports: ScreenBreathe

function ScreenBreathe({ theme, buddyId, buddyColor }) {
  const BREATHS = 4;
  const PHASES = [
    { k: 'in',   dur: 4, label: 'Breathe in' },
    { k: 'hold', dur: 2, label: 'Hold' },
    { k: 'out',  dur: 6, label: 'And out' },
  ];
  const timeline = React.useMemo(() => {
    const s = []; for (let b = 0; b < BREATHS; b++) PHASES.forEach((p) => s.push({ ...p, breath: b + 1 }));
    return s;
  }, []);

  const [running, setRunning] = React.useState(false);
  const [step, setStep] = React.useState(-1);
  const [phase, setPhase] = React.useState('ready'); // ready | in | hold | out | done
  const [remain, setRemain] = React.useState(0);
  const t0 = React.useRef(0);

  React.useEffect(() => {
    if (!running || step < 0) return;
    if (step >= timeline.length) { setRunning(false); setPhase('done'); return; }
    const cur = timeline[step];
    setPhase(cur.k);
    t0.current = Date.now();
    setRemain(cur.dur);
    const iv = setInterval(() => {
      const el = (Date.now() - t0.current) / 1000;
      setRemain(Math.max(1, Math.ceil(cur.dur - el)));
    }, 120);
    const to = setTimeout(() => setStep((s) => s + 1), cur.dur * 1000);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, [running, step]);

  const begin = () => { setStep(0); setRunning(true); };
  const reset = () => { setRunning(false); setStep(-1); setPhase('ready'); };

  const curBreath = step >= 0 && step < timeline.length ? timeline[step].breath : 0;
  const scale = ({ ready: 1, in: 1.42, hold: 1.42, out: 0.82, done: 1.12 })[phase];
  const dur = ({ in: 4, hold: 2, out: 6 })[phase] || 1;
  const kColor = phase === 'done' ? theme.warm : (phase === 'out' ? theme.primary : theme.secondary);
  const bigLabel = phase === 'ready' ? '' : phase === 'done' ? '' : PHASES.find((p) => p.k === phase)?.label;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont }}>
      <div style={{
        position: 'absolute', inset: 0, transition: 'background 2s',
        background: `radial-gradient(80% 60% at 50% 44%, ${hexA(kColor, phase === 'ready' ? 0.2 : 0.34)} 0%, transparent 62%)`,
      }} />
      <Starfield count={22} seed={11} motion={theme.motion * 0.6} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '78px 24px 40px' }}>
        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <GlowText color={theme.text} size={24} weight={600} font={theme.displayFont} glow={0.35}>
            {phase === 'done' ? 'Beautifully done.' : 'Breathe with me'}
          </GlowText>
          <div style={{ color: theme.muted, fontSize: 13.5, marginTop: 5, lineHeight: 1.4, maxWidth: 280 }}>
            {phase === 'ready' && 'Follow my light. In through your nose, out through your mouth.'}
            {(phase === 'in' || phase === 'hold' || phase === 'out') && `Breath ${curBreath} of ${BREATHS}`}
            {phase === 'done' && 'Notice how your body feels now — a little softer, maybe.'}
          </div>
        </div>

        {/* the breathing stage */}
        <div style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* expanding guide rings */}
          {[1, 0.7, 0.45].map((f, i) => (
            <div key={i} style={{
              position: 'absolute', width: 230 * f, height: 230 * f, borderRadius: '50%',
              border: `1.5px solid ${hexA(kColor, 0.3 - i * 0.06)}`,
              transform: `scale(${scale})`, transition: `transform ${dur}s cubic-bezier(.37,0,.63,1), border-color 1s`,
            }} />
          ))}
          {/* particles that inhale/exhale */}
          {Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            const out = phase === 'out' || phase === 'ready' ? 150 : phase === 'done' ? 130 : 64;
            return (
              <div key={i} style={{
                position: 'absolute', width: 5, height: 5, borderRadius: '50%',
                background: kColor, boxShadow: `0 0 8px ${kColor}`,
                transform: `translate(${Math.cos(ang) * out}px, ${Math.sin(ang) * out}px)`,
                transition: `transform ${dur}s cubic-bezier(.37,0,.63,1), background 1s`,
                opacity: 0.8,
              }} />
            );
          })}
          {/* Kenshin core */}
          <div style={{ transform: `scale(${scale})`, transition: `transform ${dur}s cubic-bezier(.37,0,.63,1)` }}>
            <HeroCharacter buddy={buddyId || 'kenshy'} color={kColor || buddyColor || theme.primary} motion={theme.motion} size={124} />
          </div>
          {/* phase label + count */}
          {bigLabel && (
            <div style={{ position: 'absolute', bottom: -6, textAlign: 'center', pointerEvents: 'none' }}>
              <GlowText color={kColor} size={26} weight={700} font={theme.displayFont} glow={0.6}>{bigLabel}</GlowText>
              <div style={{ color: theme.muted, fontSize: 15, marginTop: 2 }}>{remain}</div>
            </div>
          )}
        </div>

        {/* action */}
        <div style={{ width: '100%', display: 'flex', gap: 10 }}>
          {phase === 'ready' && (
            <KenButton theme={theme} color={theme.secondary} onClick={begin} style={{ flex: 1 }}>Begin ✦</KenButton>
          )}
          {running && (
            <KenButton theme={theme} variant="ghost" onClick={reset} style={{ flex: 1 }}>I'm okay, stop</KenButton>
          )}
          {phase === 'done' && (
            <>
              <KenButton theme={theme} variant="ghost" onClick={reset} style={{ flex: 1 }}>Again</KenButton>
              <KenButton theme={theme} color={theme.warm} onClick={reset} style={{ flex: 1 }}>I feel better</KenButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

window.ScreenBreathe = ScreenBreathe;
