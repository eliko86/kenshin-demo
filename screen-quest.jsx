// screen-quest.jsx — "A quest appears." A sealed star floats down; tap to crack it
// open and reveal a real-world social mission, calibrated to the child's courage.
// Points are earned out there, never for opening the app. Exports: ScreenQuest

function ScreenQuest({ theme }) {
  const LEVELS = [
    { name: 'Gentle', stars: 1, color: theme.secondary },
    { name: 'Brave',  stars: 2, color: theme.primary },
    { name: 'Bold',   stars: 3, color: theme.warm },
  ];
  const POOL = {
    0: [
      { t: 'Say hi to one person you don’t usually talk to.', w: 'Just “hi.” Tiny hellos are how every friendship starts.', p: 10 },
      { t: 'Give one person a genuine compliment.', w: 'Notice something true about them — and say it out loud.', p: 10 },
    ],
    1: [
      { t: 'Ask someone a question about their day — and really listen.', w: 'People love being asked. It’s the easiest door in.', p: 20 },
      { t: 'Sit next to someone new for one activity.', w: 'You don’t have to talk much. Just be nearby.', p: 20 },
    ],
    2: [
      { t: 'Invite someone to do something with you.', w: 'Sit together, walk, play — one real invite.', p: 35 },
      { t: 'Start a small group plan for this week.', w: 'This is the big one. Real plans, with real people.', p: 35 },
    ],
  };

  const [stage, setStage] = React.useState('sealed'); // sealed | open | accepted
  const [level, setLevel] = React.useState(0);
  const [idx, setIdx] = React.useState(0);
  const [g, game] = useGame();
  const [crackFire, setCrackFire] = React.useState(0);
  const ch = POOL[level][idx];
  const lv = LEVELS[level];

  const open = () => { setStage('opening'); setCrackFire((c) => c + 1); setTimeout(() => setStage('open'), 620); };
  const accept = () => { setStage('accepted'); game.addBadge('explorer'); };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont }}>
      <div style={{
        position: 'absolute', inset: 0, transition: 'background .8s',
        background: `radial-gradient(90% 55% at 50% ${stage === 'sealed' ? '40%' : '20%'}, ${hexA(lv.color, 0.3)} 0%, transparent 60%)`,
      }} />
      <Starfield count={30} seed={5} motion={theme.motion} />
      <Confetti fire={crackFire} theme={theme} count={26} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '76px 24px 38px' }}>

        {stage === 'sealed' || stage === 'opening' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 999, background: theme.surf(0.06), marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>🗺️</span>
                <span style={{ color: theme.muted, fontSize: 12, fontWeight: 700, fontFamily: theme.displayFont }}>Quest 3 of 7 this week</span>
              </div>
              <GlowText color={theme.text} size={23} weight={600} font={theme.displayFont} glow={0.35}>A quest appears…</GlowText>
              <div style={{ color: theme.muted, fontSize: 14, marginTop: 6, lineHeight: 1.4, maxWidth: 270 }}>
                {({ gentle: 'I’ve got a tiny real-world mission for you. Ready to see it?', playful: 'Oooh — I made you a mission! Wanna peek?', chill: 'Got a small mission for you. Take a look?' })[theme.tone] || 'I’ve got a tiny real-world mission for you. Ready to see it?'}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
              {/* burst particles */}
              {stage === 'opening' && Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return <div key={i} style={{
                  position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: i % 2 ? theme.warm : lv.color,
                  boxShadow: `0 0 10px ${lv.color}`, animation: `ken-burst .6s ease-out forwards`,
                  ['--bx']: `${Math.cos(a) * 150}px`, ['--by']: `${Math.sin(a) * 150}px`,
                }} />;
              })}
              {/* sealed star */}
              <button onClick={open} disabled={stage === 'opening'} style={{
                border: 'none', background: 'none', cursor: 'pointer', position: 'relative',
                width: 150, height: 150, padding: 0,
                animation: stage === 'opening' ? 'ken-pop .6s ease-out forwards' : 'ken-float 5s ease-in-out infinite',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 40% 32%, #fff, ${lv.color})`,
                  clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                  boxShadow: `0 0 40px ${hexA(lv.color, 0.8)}`,
                  filter: `drop-shadow(0 0 18px ${hexA(lv.color, 0.6)})`,
                }} />
                {/* shimmer seam */}
                <div style={{ position: 'absolute', top: '14%', bottom: '14%', left: '50%', width: 2, transform: 'translateX(-50%)', background: hexA('#fff', 0.7), animation: 'ken-twinkle 1.6s ease-in-out infinite' }} />
              </button>
              {stage === 'sealed' && (
                <div style={{ position: 'absolute', bottom: 30, color: theme.muted, fontSize: 13, fontWeight: 600, letterSpacing: 0.5, animation: 'ken-bounce 1.6s ease-in-out infinite' }}>tap to open</div>
              )}
            </div>
            <div style={{ height: 56 }} />
          </>
        ) : (
          <>
            {/* opened: Kenshin + challenge card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, alignSelf: 'flex-start', marginBottom: 14 }}>
              <Kenshin theme={theme} mood={stage === 'accepted' ? 'proud' : 'happy'} color={lv.color} size={56} motion={theme.motion} />
              <div style={{ color: theme.text, fontSize: 16, fontWeight: 600, fontFamily: theme.displayFont, maxWidth: 240, lineHeight: 1.35 }}>
                {stage === 'accepted' ? 'Yes! Go find your moment.' : 'Here’s your mission — for out there.'}
              </div>
            </div>

            {/* the card */}
            <div style={{
              width: '100%', borderRadius: 26, padding: 22, position: 'relative',
              background: `linear-gradient(160deg, ${hexA(lv.color, 0.16)}, ${theme.surf(0.04)})`,
              boxShadow: `inset 0 0 0 1px ${hexA(lv.color, 0.4)}, 0 18px 40px ${hexA(lv.color, 0.22)}`,
              animation: 'ken-rise .5s ease-out',
            }}>
              {/* difficulty selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {LEVELS.map((L, i) => (
                  <button key={i} onClick={() => { setLevel(i); setIdx(0); }} style={{
                    flex: 1, border: 'none', cursor: 'pointer', borderRadius: 13, padding: '8px 4px',
                    background: level === i ? hexA(L.color, 0.28) : theme.surf(0.05),
                    boxShadow: level === i ? `inset 0 0 0 1.5px ${L.color}` : 'none',
                    color: level === i ? theme.text : theme.muted, fontFamily: theme.displayFont, fontWeight: 600, fontSize: 12.5,
                    transition: 'all .2s',
                  }}>
                    <div style={{ color: L.color, letterSpacing: 1, marginBottom: 2 }}>{'✦'.repeat(L.stars)}</div>
                    {L.name}
                  </button>
                ))}
              </div>

              <GlowText color={theme.text} size={22} weight={600} font={theme.displayFont} glow={0.25} style={{ lineHeight: 1.32, display: 'block' }}>
                {ch.t}
              </GlowText>
              <div style={{ color: theme.muted, fontSize: 14.5, marginTop: 10, lineHeight: 1.45 }}>{ch.w}</div>

              {/* reward chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '11px 14px', borderRadius: 14, background: hexA(theme.warm, 0.12) }}>
                <span style={{ fontSize: 18, color: theme.warm, filter: `drop-shadow(0 0 6px ${theme.warm})` }}>✦</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.text, fontWeight: 700, fontSize: 14, fontFamily: theme.displayFont }}>A new star for your sky ✦</div>
                  <div style={{ color: theme.muted, fontSize: 11.5 }}>lights up when you actually do it — out there, with real people</div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16 }}>
              {stage === 'open' ? (
                <>
                  <KenButton theme={theme} color={lv.color} onClick={accept} style={{ width: '100%' }}>I’ll try it ✦</KenButton>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <KenButton theme={theme} variant="ghost" onClick={() => setIdx((idx + 1) % 2)} style={{ flex: 1, fontSize: 14 }}>Show me another</KenButton>
                    {level > 0 && <KenButton theme={theme} variant="ghost" onClick={() => { setLevel(level - 1); setIdx(0); }} style={{ flex: 1, fontSize: 14 }}>Too big right now</KenButton>}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, background: hexA(lv.color, 0.12), marginBottom: 4, animation: 'ken-pop-in .45s ease-out' }}>
                    <span style={{ fontSize: 16 }}>📜</span>
                    <span style={{ color: theme.text, fontSize: 13.5, fontWeight: 700, fontFamily: theme.displayFont }}>Added to your Quest Log!</span>
                  </div>
                  <div style={{ textAlign: 'center', color: theme.muted, fontSize: 13.5, lineHeight: 1.45, paddingBottom: 4 }}>
                    I’ll be right here when you come back — to hear how it went.
                  </div>
                  <KenButton theme={theme} variant="ghost" onClick={() => { setStage('sealed'); setIdx(0); }} style={{ width: '100%' }}>Done — seal a new one</KenButton>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.ScreenQuest = ScreenQuest;
