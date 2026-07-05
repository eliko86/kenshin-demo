// screen-missions.jsx — "Missions": real-world quests Kenshy gives the kid to grow
// emotional skills, communication with friends, and outdoor activities. Completing
// them earns points & levels (tracked via game-kit, persisted). Purple HOME world.
// Exports: ScreenMissions

const PM = {
  bg: 'linear-gradient(180deg,#3A2F72 0%,#2C2462 34%,#241C56 68%,#1E1749 100%)',
  text: '#F5F2FF', muted: '#C3BBEC', dim: '#9A91CE',
  blue: '#5B8DEF', teal: '#3FC9C0', lav: '#9B7CF5', amber: '#FFB454', pink: '#FF7FB0', gold: '#FFD36B', green: '#5FD08A',
  card: 'rgba(48,40,96,0.6)', line: 'rgba(190,181,236,0.20)',
};

const MISSION_GROUPS = [
  { cat: 'Feelings', icon: '💛', color: '#FFB454', tasks: [
    { id: 'm_mood', t: 'Name your feeling', d: 'Do a mood check-in with me today.', p: 10 },
    { id: 'm_breath', t: 'Breathe it out', d: 'Try one calm breathing round.', p: 10 },
    { id: 'm_grat', t: 'Three good things', d: 'Tell me 3 good things about today.', p: 15 },
  ] },
  { cat: 'Friends', icon: '🤝', color: '#5B8DEF', tasks: [
    { id: 'm_hi', t: 'Say hi', d: 'Say hi to someone new at school.', p: 15 },
    { id: 'm_kind', t: 'Give a compliment', d: 'Tell a friend something kind and true.', p: 15 },
    { id: 'm_listen', t: 'Ask & listen', d: 'Ask a friend about their day — really listen.', p: 20 },
  ] },
  { cat: 'Outdoors', icon: '🌳', color: '#5FD08A', tasks: [
    { id: 'm_play', t: 'Play outside', d: 'Play outside with a friend.', p: 25 },
    { id: 'm_invite', t: 'Make a plan', d: 'Invite a friend to do something fun.', p: 30 },
    { id: 'm_team', t: 'Team up', d: 'Join a group game or activity.', p: 30 },
  ] },
];

function ScreenMissions({ theme, onBack, buddyId, buddyColor, motion }) {
  const D = theme.displayFont, B = theme.bodyFont;
  const KenBody = (window.CHARACTERS || []).find((c) => c.id === (buddyId || 'kenshy'))?.Body;
  const M = motion || 1.05;
  const [g, game] = (window.useGame ? window.useGame() : [{ points: 0, level: 1, levelName: 'Spark', streak: 0 }, { addPoints: () => {} }]);
  const [done, setDone] = React.useState(() => { try { return JSON.parse(localStorage.getItem('ken_missions_done') || '[]'); } catch (e) { return []; } });
  const [tab, setTab] = React.useState(0);
  const [cheer, setCheer] = React.useState(0);
  const [line, setLine] = React.useState('Here are your quests — real-world missions to grow braver! 💜');

  const persist = (arr) => { try { localStorage.setItem('ken_missions_done', JSON.stringify(arr)); } catch (e) {} };
  const toggle = (task) => {
    if (done.includes(task.id)) return; // completing is one-way (celebrate!)
    const arr = [...done, task.id]; setDone(arr); persist(arr);
    game.addPoints(task.p); setCheer((c) => c + 1);
    setLine(`Amazing — "${task.t}" done! +${task.p} ⭐ I’m so proud of you!`);
  };

  const grp = MISSION_GROUPS[tab];
  const totalTasks = MISSION_GROUPS.reduce((n, gp) => n + gp.tasks.length, 0);
  const doneCount = done.length;
  const xpInLevel = g.points % 80, xpPct = (xpInLevel / 80) * 100;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PM.bg, fontFamily: B, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 34% at 50% 0%, ${hexA(grp.color, 0.2)} 0%, transparent 60%)`, transition: 'background .5s', pointerEvents: 'none' }} />
      <Confetti fire={cheer} theme={{ primary: PM.blue, secondary: PM.teal, warm: PM.gold, pink: PM.pink }} count={26} />

      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '54px 18px 4px' }}>
        {onBack && <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 1px ${PM.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={PM.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>}
        <span style={{ color: PM.text, fontFamily: D, fontWeight: 700, fontSize: 19 }}>Missions</span>
      </div>

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '4px 16px 28px' }}>
        {/* companion + level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 14px 8px 8px', borderRadius: 18, background: PM.card, boxShadow: `inset 0 0 0 1px ${PM.line}`, marginBottom: 12 }}>
          <div style={{ flexShrink: 0 }}>{KenBody ? <KenBody size={50} color={buddyColor || PM.blue} mood="happy" motion={M} /> : null}</div>
          <div style={{ color: PM.text, fontSize: 13, fontWeight: 600, fontFamily: D, lineHeight: 1.35 }}>{line}</div>
        </div>

        {/* level card */}
        <div style={{ padding: 16, borderRadius: 20, background: `linear-gradient(150deg, ${hexA(PM.amber, 0.18)}, rgba(48,40,96,0.5))`, boxShadow: `inset 0 0 0 1px ${PM.line}`, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <div>
              <div style={{ color: PM.text, fontFamily: D, fontWeight: 700, fontSize: 18 }}>Level {g.level} · {g.levelName}</div>
              <div style={{ color: PM.muted, fontSize: 11.5, marginTop: 2 }}>{doneCount}/{totalTasks} missions done</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: PM.gold, fontWeight: 700, fontSize: 13, fontFamily: D }}>⭐ {g.points}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: PM.pink, fontWeight: 700, fontSize: 13, fontFamily: D }}>🔥 {g.streak}</span>
            </div>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{ width: `${xpPct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${PM.amber}, ${PM.gold})`, boxShadow: `0 0 12px ${hexA(PM.gold, 0.6)}`, transition: 'width .8s cubic-bezier(.2,.8,.2,1)' }} />
          </div>
          <div style={{ color: PM.muted, fontSize: 11, marginTop: 6, textAlign: 'right' }}>{80 - xpInLevel} XP to Level {g.level + 1}</div>
        </div>

        {/* category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {MISSION_GROUPS.map((gp, i) => {
            const on = tab === i;
            return (
              <button key={gp.cat} onClick={() => setTab(i)} style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 14, padding: '10px 4px', fontFamily: D, fontWeight: 600, fontSize: 12.5,
                color: on ? '#fff' : PM.muted, background: on ? `linear-gradient(150deg, ${gp.color}, color-mix(in srgb, ${gp.color} 70%, #241C56))` : 'rgba(255,255,255,0.05)',
                boxShadow: on ? `0 8px 18px ${hexA(gp.color, 0.4)}` : `inset 0 0 0 1px ${PM.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all .2s' }}>
                <span style={{ fontSize: 17 }}>{gp.icon}</span>{gp.cat}
              </button>
            );
          })}
        </div>

        {/* tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {grp.tasks.map((task) => {
            const isDone = done.includes(task.id);
            return (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', borderRadius: 18,
                background: isDone ? hexA(grp.color, 0.14) : PM.card, boxShadow: `inset 0 0 0 1px ${isDone ? hexA(grp.color, 0.5) : PM.line}`, transition: 'all .2s' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: PM.text, fontFamily: D, fontWeight: 700, fontSize: 15.5, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>{task.t}</div>
                  <div style={{ color: PM.muted, fontSize: 12.5, marginTop: 2, lineHeight: 1.35 }}>{task.d}</div>
                  <div style={{ color: PM.gold, fontSize: 12, fontWeight: 700, fontFamily: D, marginTop: 6 }}>⭐ +{task.p} points</div>
                </div>
                <button onClick={() => toggle(task)} disabled={isDone} style={{ width: 46, height: 46, borderRadius: '50%', border: 'none', flexShrink: 0, cursor: isDone ? 'default' : 'pointer',
                  background: isDone ? `radial-gradient(circle at 38% 30%, #fff, ${grp.color})` : 'rgba(255,255,255,0.08)', boxShadow: isDone ? `0 6px 16px ${hexA(grp.color, 0.5)}` : `inset 0 0 0 2px ${PM.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                  {isDone ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-10" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span style={{ color: PM.muted, fontSize: 12, fontWeight: 700, fontFamily: D }}>Do it</span>}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', color: PM.dim, fontSize: 11.5, marginTop: 16, lineHeight: 1.45 }}>
          🌟 Points are earned out in the real world — tap “Do it” after you’ve really done it.
        </div>
      </div>
    </div>
  );
}

window.ScreenMissions = ScreenMissions;
