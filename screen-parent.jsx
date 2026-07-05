// screen-parent.jsx — the GROWN-UP side. The registered parent/guardian is the only
// one who sees progress metrics: a social-confidence trend, weekly activity, and
// feeling *patterns* (categories only — never the child's words). Plus a privacy &
// settings screen. Exports: ScreenParentDash, ScreenParentPrivacy

// shared little parts -------------------------------------------------
function PCard({ theme, children, style }) {
  return <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.055)', border: 'none', boxShadow: `0 10px 30px ${theme.line(0.14)}, inset 0 0 0 1px rgba(255,255,255,0.10)`, overflow: 'hidden', ...style }}>{children}</div>;
}
function PLabel({ theme, children, style }) {
  return <div style={{ color: theme.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', ...style }}>{children}</div>;
}
function ParentChrome({ theme, active }) {
  // a small persona banner so it's unmistakable this is the grown-up view
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px', borderRadius: 999, background: theme.surf(0.06), alignSelf: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: `linear-gradient(135deg, #7C84B8, #4E567F)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👤</span>
      <span style={{ color: theme.text, fontSize: 12.5, fontWeight: 700, fontFamily: theme.displayFont }}>Grown-up view</span>
      <span style={{ color: theme.muted, fontSize: 11.5 }}>· {active}</span>
    </div>
  );
}

// ── Dashboard (multi-child) ──────────────────────────────────
const KIDS = [
  { name: 'Maya', age: 11, buddy: 'kenshy', cKey: 'primary', pron: 'her', trend: [50, 53, 51, 56, 59, 64],
    act: [['5/7', 'check-ins'], ['4', 'missions tried'], ['3', 'completed'], ['6d', 'streak']],
    moods: [['Happy', 34, 's'], ['Calm', 26, 'p'], ['Worried', 22, '#F0A45B'], ['Sad', 10, '#5B8DEF'], ['Excited', 8, 'w']],
    note: 'Maya’s felt a little worried around lunchtime lately. Kenshy is gently encouraging small lunch-table steps — no pressure, her pace.' },
  { name: 'Leo', age: 9, buddy: 'ember', cKey: 'warm', pron: 'his', trend: [38, 41, 44, 43, 49, 56],
    act: [['7/7', 'check-ins'], ['5', 'missions tried'], ['4', 'completed'], ['9d', 'streak']],
    moods: [['Excited', 38, 'w'], ['Happy', 30, 's'], ['Calm', 18, 'p'], ['Worried', 9, '#F0A45B'], ['Sad', 5, '#5B8DEF']],
    note: 'Leo made a new friend at football this week — his confidence is climbing fast. A lovely stretch.' },
  { name: 'Ava', age: 13, buddy: 'luna', cKey: 'pink', pron: 'her', trend: [58, 57, 60, 61, 60, 66],
    act: [['4/7', 'check-ins'], ['3', 'missions tried'], ['3', 'completed'], ['4d', 'streak']],
    moods: [['Calm', 36, 'p'], ['Happy', 28, 's'], ['Worried', 18, '#F0A45B'], ['Excited', 12, 'w'], ['Sad', 6, '#5B8DEF']],
    note: 'Ava’s been quieter but steady. She invited a classmate to study together — a big, brave step for her.' },
];

function ScreenParentDash({ theme }) {
  const [sel, setSel] = React.useState(0);
  const COLS = { primary: theme.primary, secondary: theme.secondary, warm: theme.warm, pink: theme.pink, p: theme.primary, s: theme.secondary, w: theme.warm };
  const kid = KIDS[sel];
  const kColor = COLS[kid.cKey];
  const TREND = kid.trend;
  const WEEKS = ['Apr', '', 'May', '', '', 'Jun'];
  const maxT = 72, minT = 36;
  const pts = TREND.map((v, i) => [(i / (TREND.length - 1)) * 100, 40 - ((v - minT) / (maxT - minT)) * 36 - 2]);
  const linePath = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const areaPath = `${linePath} L100 40 L0 40 Z`;
  const deltaPct = Math.round(((TREND[5] - TREND[0]) / TREND[0]) * 100);
  const MOODS = kid.moods.map(([k, v, c]) => ({ k, v, c: COLS[c] || c }));

  const kidBody = (id) => { const c = (window.CHARACTERS || []).find((x) => x.id === id); return c ? c.Body : null; };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 36% at 50% 0%, ${hexA(kColor, 0.16)} 0%, transparent 60%)`, transition: 'background .5s' }} />
      <Starfield count={12} seed={21} motion={theme.motion * 0.5} />

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '58px 18px 34px' }}>
        <ParentChrome theme={theme} active={`Family · ${KIDS.length} children`} />

        {/* child switcher */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, overflowX: 'auto', padding: '2px 2px 8px' }}>
          {KIDS.map((k, i) => {
            const on = sel === i; const B = kidBody(k.buddy); const c = COLS[k.cKey];
            return (
              <button key={k.name} onClick={() => setSel(i)} style={{ flex: '0 0 auto', border: 'none', cursor: 'pointer', borderRadius: 16, padding: '8px 14px 8px 8px', display: 'flex', alignItems: 'center', gap: 9, background: on ? '#fff' : theme.surf(0.04), boxShadow: on ? `0 8px 20px ${hexA(c, 0.22)}, inset 0 0 0 2px ${c}` : `inset 0 0 0 1px ${theme.line(0.08)}`, transition: 'all .2s' }}>
                <span style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{B ? <B size={38} color={c} mood="happy" motion={on ? 1 : 0.6} /> : null}</span>
                <span style={{ textAlign: 'left' }}>
                  <span style={{ display: 'block', fontFamily: theme.displayFont, fontWeight: 600, fontSize: 14, color: on ? theme.text : theme.muted }}>{k.name}</span>
                  <span style={{ display: 'block', fontSize: 10.5, color: theme.muted }}>age {k.age}</span>
                </span>
              </button>
            );
          })}
          <button style={{ flex: '0 0 auto', border: 'none', cursor: 'pointer', borderRadius: 16, padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: theme.surf(0.03), boxShadow: `inset 0 0 0 1.5px ${theme.line(0.12)}`, color: theme.muted }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>＋</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>Add child</span>
          </button>
        </div>

        <div style={{ margin: '10px 2px 14px' }}>
          <GlowText color={theme.text} size={23} weight={600} font={theme.displayFont} glow={0.18}>{kid.name}’s week</GlowText>
          <div style={{ color: theme.muted, fontSize: 12.5, marginTop: 3, lineHeight: 1.4 }}>Each child has their own private Kenshy &amp; account. You see growth and patterns — never {kid.pron} words.</div>
        </div>

        {/* confidence trend */}
        <PCard theme={theme} style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <PLabel theme={theme}>Social confidence</PLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: theme.displayFont, fontWeight: 700, fontSize: 26, color: theme.text }}>{TREND[5]}</span>
                <span style={{ color: theme.secondary, fontWeight: 700, fontSize: 13 }}>▲ {deltaPct}% this month</span>
              </div>
            </div>
            <span style={{ fontSize: 22 }}>📈</span>
          </div>
          <svg viewBox="0 0 100 42" preserveAspectRatio="none" style={{ width: '100%', height: 96, display: 'block' }}>
            <defs>
              <linearGradient id={`ptrend${sel}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={hexA(kColor, 0.34)} />
                <stop offset="100%" stopColor={hexA(kColor, 0)} />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#ptrend${sel})`} />
            <path d={linePath} fill="none" stroke={kColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={i === pts.length - 1 ? 2.2 : 1.2} fill={i === pts.length - 1 ? kColor : '#fff'} stroke={kColor} strokeWidth="0.8" />)}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {WEEKS.map((w, i) => <span key={i} style={{ color: theme.muted, fontSize: 10 }}>{w}</span>)}
          </div>
        </PCard>

        {/* weekly activity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 12 }}>
          {kid.act.map(([n, l]) => (
            <PCard key={l} theme={theme} style={{ padding: '12px 6px', textAlign: 'center' }}>
              <div style={{ fontFamily: theme.displayFont, fontWeight: 700, fontSize: 20, color: theme.text }}>{n}</div>
              <div style={{ color: theme.muted, fontSize: 10.5, marginTop: 2, lineHeight: 1.2 }}>{l}</div>
            </PCard>
          ))}
        </div>

        {/* feeling patterns */}
        <PCard theme={theme} style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <PLabel theme={theme}>Feeling patterns</PLabel>
            <span style={{ color: theme.muted, fontSize: 11 }}>categories only</span>
          </div>
          <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            {MOODS.map((m) => <div key={m.k} style={{ width: m.v + '%', background: m.c }} />)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px' }}>
            {MOODS.map((m) => (
              <div key={m.k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: m.c }} />
                <span style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{m.k}</span>
                <span style={{ color: theme.muted, fontSize: 12 }}>{m.v}%</span>
              </div>
            ))}
          </div>
        </PCard>

        {/* gentle insight */}
        <div style={{ display: 'flex', gap: 11, padding: 15, borderRadius: 16, background: `linear-gradient(160deg, ${hexA(theme.warm, 0.14)}, rgba(255,255,255,0.04))`, boxShadow: `inset 0 0 0 1px ${hexA(theme.warm, 0.3)}` }}>
          <span style={{ fontSize: 18 }}>🌱</span>
          <div style={{ color: theme.text, fontSize: 12.5, lineHeight: 1.5 }}>
            <strong style={{ fontFamily: theme.displayFont }}>A gentle note: </strong>
            <span style={{ color: theme.muted }}>{kid.note}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: theme.muted, fontSize: 11.5, marginTop: 16, lineHeight: 1.5 }}>
          🔒 Kenshy shows you the <strong style={{ color: theme.text }}>shape</strong> of {kid.pron} week — never {kid.pron} diary.
        </div>
      </div>
    </div>
  );
}

// ── Privacy & settings ───────────────────────────────────────
function ScreenParentPrivacy({ theme }) {
  const [weekly, setWeekly] = React.useState(true);
  const [alerts, setAlerts] = React.useState(true);

  const SEEN = [
    ['📈', 'Confidence trend over time'],
    ['🎯', 'Missions tried & completed'],
    ['🗓️', 'Check-in frequency & streaks'],
    ['🎨', 'Feeling categories (happy, worried…)'],
  ];
  const PRIVATE = [
    ['💬', 'Everything she types or says'],
    ['🎙️', 'Her voice conversations'],
    ['📔', 'The details of how she feels'],
    ['✨', 'What she tells Kenshin in confidence'],
  ];
  const SetRow = ({ icon, title, sub, on, onClick }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: theme.text, fontSize: 14, fontWeight: 600, fontFamily: theme.displayFont }}>{title}</div>
        <div style={{ color: theme.muted, fontSize: 11.5, marginTop: 1 }}>{sub}</div>
      </div>
      <PToggle theme={theme} on={on} onClick={onClick} />
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 36% at 50% 0%, ${hexA(theme.secondary, 0.14)} 0%, transparent 60%)` }} />
      <Starfield count={12} seed={23} motion={theme.motion * 0.5} />

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '60px 18px 34px' }}>
        <ParentChrome theme={theme} active="Privacy & settings" />

        <div style={{ margin: '16px 2px 8px' }}>
          <GlowText color={theme.text} size={22} weight={600} font={theme.displayFont} glow={0.18}>What you can see</GlowText>
        </div>

        {/* shared */}
        <PCard theme={theme} style={{ padding: '6px 4px', marginBottom: 12 }}>
          {SEEN.map(([ic, t], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: hexA(theme.secondary, 0.16), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{ic}</span>
              <span style={{ flex: 1, color: theme.text, fontSize: 13.5 }}>{t}</span>
              <span style={{ color: theme.secondary, fontSize: 16 }}>✓</span>
            </div>
          ))}
        </PCard>

        {/* private */}
        <PLabel theme={theme} style={{ margin: '18px 4px 8px', color: theme.muted }}>Stays private — always hers</PLabel>
        <PCard theme={theme} style={{ padding: '6px 4px', marginBottom: 12, background: theme.surf(0.03) }}>
          {PRIVATE.map(([ic, t], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: theme.surf(0.07), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, opacity: 0.8 }}>{ic}</span>
              <span style={{ flex: 1, color: theme.muted, fontSize: 13.5 }}>{t}</span>
              <span style={{ color: theme.muted, fontSize: 14 }}>🔒</span>
            </div>
          ))}
        </PCard>

        {/* settings */}
        <PLabel theme={theme} style={{ margin: '18px 4px 8px' }}>Settings</PLabel>
        <PCard theme={theme}>
          <SetRow icon="✉️" title="Weekly summary email" sub="A calm Sunday recap of her week" on={weekly} onClick={() => setWeekly((v) => !v)} />
          <div style={{ height: 1, background: theme.line(0.07), margin: '0 16px' }} />
          <SetRow icon="🫶" title="Gentle alerts" sub="If she seems to be having a hard stretch" on={alerts} onClick={() => setAlerts((v) => !v)} />
        </PCard>

        <div style={{ display: 'flex', gap: 11, marginTop: 16, padding: 15, borderRadius: 16, background: `linear-gradient(160deg, ${hexA(theme.primary, 0.12)}, rgba(255,255,255,0.04))`, boxShadow: `inset 0 0 0 1px ${hexA(theme.primary, 0.26)}` }}>
          <span style={{ fontSize: 18 }}>🤝</span>
          <div style={{ color: theme.muted, fontSize: 12.5, lineHeight: 1.5 }}>
            <strong style={{ color: theme.text, fontFamily: theme.displayFont }}>Why it works this way: </strong>
            Kids open up when they feel safe and unjudged. You get the reassurance of seeing her grow; she gets a private space to be honest.
          </div>
        </div>
      </div>
    </div>
  );
}

function PToggle({ on, onClick, theme }) {
  return (
    <button onClick={onClick} style={{
      width: 46, height: 27, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
      background: on ? theme.secondary : theme.surf(0.16), transition: 'background .25s', boxShadow: on ? `0 0 12px ${hexA(theme.secondary, 0.4)}` : 'none',
    }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .25s', boxShadow: '0 2px 5px rgba(40,50,90,0.25)' }} />
    </button>
  );
}

Object.assign(window, { ScreenParentDash, ScreenParentPrivacy });
