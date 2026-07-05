// screen-report.jsx — "How did it go?" The child reports back on a real-world try.
// Kenshin reinforces EFFORT (not outcome); a new star ignites in the Confidence
// Constellation and the social-confidence level rises. Exports: ScreenReport

function ScreenReport({ theme }) {
  // constellation node coords in a 0..100 x / 0..56 y space
  const NODES = [[14, 40], [28, 24], [42, 35], [57, 17], [71, 30], [86, 13], [50, 47]];
  const BASE_LINKS = [[0, 1], [1, 2], [2, 3], [3, 4]];

  const RESULTS = [
    { key: 'did',  label: 'I did it!', sub: '✦', color: theme.warm,
      line: 'You actually DID it. That’s huge — and I’m proud of YOU, not the app.', add: 18, mood: 'proud', unlock: true },
    { key: 'tried', label: 'I tried — it was awkward', color: theme.secondary,
      line: 'You tried. That’s the brave part. Awkward just means you’re growing.', add: 11, mood: 'happy', unlock: false },
    { key: 'couldnt', label: 'Couldn’t this time', color: theme.primary,
      line: 'That’s okay. Wanting to counts — we’ll find a smaller step together.', add: 4, mood: 'caring', unlock: false },
  ];

  const [res, setRes] = React.useState(null);
  const [pct, setPct] = React.useState(62);
  const [g, game] = useGame();
  const [celebrate, setCelebrate] = React.useState(0);
  const r = res != null ? RESULTS[res] : null;
  const reported = r != null;

  const pick = (i) => {
    if (res != null) return;
    setRes(i);
    setCelebrate((c) => c + 1);
    game.addPoints(RESULTS[i].add); game.bumpStreak();
    if (RESULTS[i].unlock) game.addBadge('brave');
    setTimeout(() => setPct((p) => Math.min(100, p + RESULTS[i].add)), 220);
  };
  const reset = () => { setRes(null); setPct(62); };

  const litNodes = reported ? 6 : 5;
  const links = reported ? [...BASE_LINKS, [4, 6]] : BASE_LINKS; // node 6 is the new star
  const newColor = r ? r.color : theme.warm;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont }}>
      <div style={{
        position: 'absolute', inset: 0, transition: 'background .8s',
        background: `radial-gradient(95% 50% at 50% 8%, ${hexA(newColor, reported ? 0.34 : 0.24)} 0%, transparent 58%)`,
      }} />
      <Starfield count={26} seed={9} motion={theme.motion} />
      <Confetti fire={celebrate} theme={theme} count={30} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '76px 22px 38px' }}>
        {/* Kenshin + prompt */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 4 }}>
          <Kenshin theme={theme} mood={reported ? r.mood : 'happy'} color={reported ? newColor : theme.secondary} size={60} motion={theme.motion} />
          <div style={{ flex: 1 }}>
            <GlowText color={theme.text} size={20} weight={600} font={theme.displayFont} glow={0.35}>
              {reported ? 'Come here —' : 'You went and tried?!'}
            </GlowText>
            <div style={{ color: theme.muted, fontSize: 13.5, marginTop: 3, lineHeight: 1.4, minHeight: 36 }}>
              {reported ? r.line : 'Tell me how it went — honestly. There’s no wrong answer here.'}
            </div>
          </div>
        </div>

        {/* mission recap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 13px', borderRadius: 13, background: theme.surf(0.05), marginTop: 8 }}>
          <span style={{ color: theme.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Mission</span>
          <span style={{ color: theme.text, fontSize: 13.5 }}>Say hi to someone new</span>
        </div>

        {/* Your night sky — a delight, never a score */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <GlowText color={theme.text} size={15} weight={600} font={theme.displayFont} glow={0.2}>Your night sky</GlowText>
            <span style={{ color: theme.muted, fontSize: 12 }}>{reported ? 'a new star tonight ✦' : 'reach out and a star appears'}</span>
          </div>
          <div style={{
            position: 'relative', width: '100%', borderRadius: 22, padding: '6px 6px 10px',
            background: theme.surf(0.04), boxShadow: `inset 0 0 0 1px ${theme.surf(0.08)}`,
          }}>
            <svg viewBox="0 0 100 56" preserveAspectRatio="none" style={{ width: '100%', height: 150, display: 'block' }}>
              {links.map(([a, b], i) => {
                const isNew = a === 4 && b === 6;
                return <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
                  stroke={isNew ? newColor : hexA(theme.primary, 0.5)} strokeWidth="0.5"
                  strokeLinecap="round" style={{ opacity: isNew ? 0 : 0.9, animation: isNew ? 'ken-fadein .8s .3s ease forwards' : 'none' }} />;
              })}
              {NODES.map(([x, y], i) => {
                const isNewStar = i === 6;
                const lit = i < litNodes || isNewStar && reported;
                if (i === 6 && !reported) return null;
                if (i < 5 || (i === 6 && reported)) {
                  const col = isNewStar ? newColor : theme.warm;
                  return (
                    <g key={i} style={isNewStar ? { transformOrigin: `${x}px ${y}px`, animation: 'ken-star-pop .7s .25s ease-out both' } : {}}>
                      <circle cx={x} cy={y} r="2.6" fill={col} opacity="0.22" />
                      <circle cx={x} cy={y} r="1.1" fill={isNewStar ? '#fff' : col} />
                    </g>
                  );
                }
                return null;
              })}
            </svg>
            {/* unlock toast */}
            {reported && r.unlock && (
              <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999,
                background: hexA(theme.warm, 0.16), boxShadow: `inset 0 0 0 1px ${hexA(theme.warm, 0.5)}`,
                animation: 'ken-rise .5s .4s both', whiteSpace: 'nowrap',
              }}>
                <span style={{ color: theme.warm, filter: `drop-shadow(0 0 6px ${theme.warm})` }}>✦</span>
                <span style={{ color: theme.text, fontSize: 12.5, fontWeight: 600, fontFamily: theme.displayFont }}>New glow unlocked: Aurora</span>
              </div>
            )}
          </div>
        </div>

        {/* results / footer */}
        <div style={{ marginTop: 'auto', paddingTop: 18 }}>
          {!reported ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RESULTS.map((rr, i) => (
                <button key={rr.key} onClick={() => pick(i)} style={{
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  padding: '15px 18px', borderRadius: 16, fontFamily: theme.displayFont,
                  fontSize: 16, fontWeight: 600, color: theme.text,
                  background: hexA(rr.color, 0.12), boxShadow: `inset 0 0 0 1px ${hexA(rr.color, 0.32)}`,
                  display: 'flex', alignItems: 'center', gap: 10, transition: 'transform .15s',
                }}
                  onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: rr.color, boxShadow: `0 0 10px ${rr.color}`, flexShrink: 0 }} />
                  {rr.label}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: theme.muted, fontSize: 12, lineHeight: 1.4 }}>
                <span style={{ fontSize: 14 }}>🔒</span>
                What you tell me stays just between us. ✦
              </div>
              <KenButton theme={theme} color={newColor} onClick={reset} style={{ width: '100%' }}>That felt good ✦</KenButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.ScreenReport = ScreenReport;
