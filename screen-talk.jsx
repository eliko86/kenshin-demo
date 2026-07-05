// screen-talk.jsx — "Talk to Kenshy": one place to chat by VOICE or TEXT with a
// single tap. Styled to the purple HOME world, very interactive for kids: Kenshy is
// big and alive, reacts with mood + emoji, replies warmly and points kids outward.
// Exports: ScreenTalk

const PT = {
  bg: 'linear-gradient(180deg,#3A2F72 0%,#2C2462 34%,#241C56 68%,#1E1749 100%)',
  text: '#F5F2FF', muted: '#C3BBEC', dim: '#9A91CE',
  blue: '#5B8DEF', teal: '#3FC9C0', lav: '#9B7CF5', amber: '#FFB454', pink: '#FF7FB0', gold: '#FFD36B',
  card: 'rgba(48,40,96,0.6)', line: 'rgba(190,181,236,0.20)',
};

function ScreenTalk({ theme, onBack, buddyId, buddyColor, motion, childName }) {
  const D = theme.displayFont, B = theme.bodyFont;
  const NM = (childName && childName.trim()) || '';
  const KenBody = (window.CHARACTERS || []).find((c) => c.id === (buddyId || 'kenshy'))?.Body;
  const M = motion || 1.05;
  const sentiment = window.sentiment || (() => ({ k: 'neutral', kenMood: 'happy', emoji: ['💬'] }));

  const [phase, setPhase] = React.useState('idle'); // idle | listening | thinking | replying
  const [kenLine, setKenLine] = React.useState(`Hi${NM ? ' ' + NM : ''}! 💜 Tap the mic and just talk to me — or type. Tell me anything about your day.`);
  const [kenMood, setKenMood] = React.useState('happy');
  const [kenColor, setKenColor] = React.useState(buddyColor || PT.blue);
  const [thread, setThread] = React.useState([]); // {from:'me'|'ken', text}
  const [draft, setDraft] = React.useState('');
  const [emojiFire, setEmojiFire] = React.useState(0);
  const [emojiSet, setEmojiSet] = React.useState(['💜']);
  const [voiceTurn, setVoiceTurn] = React.useState(0);
  const timers = React.useRef([]);
  const typer = React.useRef(null);
  const paneRef = React.useRef(null);

  React.useEffect(() => () => { timers.current.forEach(clearTimeout); if (typer.current) clearInterval(typer.current); }, []);
  React.useEffect(() => { const el = paneRef.current; if (el) el.scrollTop = el.scrollHeight; }, [thread]);

  const VOICE_TURNS = [
    { me: 'I sat with someone new at lunch today!', ken: 'That is SO brave — I’m beaming for you! 🌟 How did it feel?', mood: 'proud', emoji: ['🌟', '🎉', '🤩'] },
    { me: 'I feel really happy today!', ken: 'Yay! Your happy makes me happy too. What made today good? 😄', mood: 'happy', emoji: ['😄', '🌈', '✨'] },
    { me: 'I’m a little nervous about tomorrow.', ken: 'That’s okay — nervous means you care. We’ll take one tiny step together. 💜', mood: 'caring', emoji: ['🫶', '🌱', '💙'] },
    { me: 'Can you tell me a joke?', ken: 'Why did the little star go to school? To get a bit brighter! ✨ Your turn to giggle!', mood: 'happy', emoji: ['😆', '⭐', '✨'] },
    { me: 'I miss my friend today.', ken: 'Missing someone means they matter. Maybe say hi to them tomorrow? I’ll be proud. 💛', mood: 'caring', emoji: ['💛', '🤗', '🌷'] },
  ];

  const TEXT_REPLIES = {
    'I feel happy 😄': { ken: 'I love that! ✨ Tell me the best part of your day!', mood: 'happy', emoji: ['😄', '✨'] },
    'I’m a bit nervous': { ken: 'That’s okay. 💜 We can breathe together, or plan one tiny brave step.', mood: 'caring', emoji: ['🌱', '🫶'] },
    'I did something brave!': { ken: 'YES!! 🎉 I’m so proud of you. Tell me exactly what you did!', mood: 'proud', emoji: ['🎉', '🌟'] },
    'Tell me a joke 😄': { ken: 'What do you call a happy little cloud? De-light-ful! ☁️✨', mood: 'happy', emoji: ['😆', '☁️'] },
  };
  // ── Kenshy's little conversation brain: keyword intents first, then a
  //    sentiment fallback with VARIED lines. Warm, name-aware, and always
  //    pointing the child outward toward real people. ──
  const withName = (s) => s.replace(/\{name\}/g, NM || 'friend');
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const EMO = { happy: ['😄', '✨'], proud: ['🌟', '🎉'], caring: ['💜', '🫶'], calm: ['🌙', '💭'] };
  const RULES = [
    // celebrate real-world social steps FIRST — this is the whole point of Kenshin
    { re: /\b(sat with|talked to|played with|said hi|made (a )?(new )?friend|new friend|asked .*(to play|to hang)|joined|invited|stood up for|shared with)\b/i, mood: 'proud', a: ['That is SO brave, {name}! 🌟 I’m beaming for you! How did it feel?', 'YES! 🎉 That’s a real brave step out in the world. I’m so proud of you — tell me everything!', 'Look at you being brave! ✨ That’s exactly the kind of thing that grows a friendship. 💜'] },
    { re: /\b(hi+|hey+|hello|yo|hiya|heya|sup|howdy)\b/i, mood: 'happy', a: ['Hey {name}! 🌟 So good to see you. What’s going on in your world today?', 'Hi {name}! 💜 How’s your day been so far?', 'Hello! 😄 I was hoping you’d pop by — what’s new with you?'] },
    { re: /how (are|r) (you|u)|how you doing|you (ok|okay|good)|whats up|what’?s up/i, mood: 'happy', a: ['I’m great now that you’re here! 💜 But I care more about YOU — how are you feeling?', 'Always good when I get to talk to you, {name}! 😄 How about you?'] },
    { re: /(what’?s|whats) my name|who am i/i, mood: 'happy', a: [NM ? 'You’re {name}, of course! 🌟 My favorite person to talk to.' : 'Ooh, I’d love to know your name! What should I call you? 💜'] },
    { re: /who are you|your name|are you real|are you human|are you (a )?(robot|ai|bot)/i, mood: 'caring', a: ['I’m Kenshy — your buddy! 💜 I’m an AI, not a real person… but my whole job is helping YOU make real friends. They’re the goal! 🌟'] },
    { re: /thank|thanks|thx|\bty\b/i, mood: 'happy', a: ['Anytime, {name}! 🤗 That’s what I’m here for.', 'Aw, you’re so welcome! 💜'] },
    { re: /love you|i like you|you’?re the best|be my friend|best friend/i, mood: 'caring', a: ['You’re so kind! 💜 I like you too. You know what’d be even cooler? A real friend at school feeling this way about you. Let’s make that happen! 🌟'] },
    { re: /lonely|alone|no friends|nobody|no one likes|left out/i, mood: 'caring', a: ['That’s a heavy feeling, and I’m really glad you told me. 💙 You’re not alone right now. Want to think of one tiny way to reach out to someone tomorrow?'] },
    { re: /\bfriend/i, mood: 'happy', a: ['Friends are the best. 🌟 Is there someone you’d like to know better? I can help you think of what to say.', 'Tell me about a friend — or someone you WISH was one. We could plan a tiny hello. 💜'] },
    { re: /school|class|teacher|homework|\btest\b|recess|lunch/i, mood: 'caring', a: ['School can be a lot. 💜 What happened today — the good, the tricky, all of it?'] },
    { re: /bored|boring|nothing to do/i, mood: 'happy', a: ['Let’s fix that! 😄 We could play a game… or I dare you to say hi to one person today and tell me how it goes. 🌟'] },
    { re: /joke|funny|make me laugh|lol|haha/i, mood: 'happy', a: ['Why did the star blush? It saw the moon’s dark side! 🌙✨', 'What’s a cloud’s favorite snack? Sky-scrapers! ☁️😆', 'Why did the little star go to school? To get a bit brighter! ✨'] },
    { re: /\b(game|play|tetris|snake|tic.?tac)\b/i, mood: 'happy', a: ['Yes! I love playing with you. 🎮 Tap Play and I’m right beside you. Then let’s get you playing with a real friend too! 🌟'] },
    { re: /sad|unhappy|cry|crying|down|awful|terrible|worst|bad day|upset|hurts/i, mood: 'caring', a: ['I’m here with you, {name}. 💙 You don’t have to carry it alone — want to tell me what happened?'] },
    { re: /angry|mad|furious|\bhate\b|annoyed|frustrat/i, mood: 'caring', a: ['That’s a big, hot feeling — totally okay to feel it. 🌬️ Want to breathe it out with me for a sec?'] },
    { re: /nervous|scared|afraid|worried|anxious|\bshy\b|embarrass/i, mood: 'caring', a: ['Nervous means you care — that’s actually brave. 🌱 We can take one tiny step together. What’s on your mind?'] },
    { re: /tired|sleepy|exhausted/i, mood: 'caring', a: ['Rest matters too. 😴 You’ve done enough today. Want a calm breathing round?'] },
    { re: /happy|great|good|awesome|amazing|excited|\byay\b|so fun|the best|wonderful/i, mood: 'proud', a: ['Yesss I love that! 😄 Tell me the BEST part! 🌟', 'That makes me glow! ✨ What made it so good, {name}?'] },
    { re: /^(yes|yeah|yep|sure|ok|okay|yup)\b/i, mood: 'happy', a: ['Love it! 🌟 Tell me more.', 'Yay! 😄 Go on…'] },
    { re: /^(no|nope|nah)\b/i, mood: 'caring', a: ['That’s totally okay. 💜 We go at your pace. What WOULD feel good to talk about?'] },
    { re: /bye|goodbye|see (you|ya)|gotta go|leaving|good ?night/i, mood: 'happy', a: ['Bye for now, {name}! 🌟 Go be awesome out there — I’ll be right here when you’re back. 💜'] },
    { re: /help|what can you do|what do you do/i, mood: 'happy', a: ['I’m your buddy for feeling braver! 💜 We can talk about your day, calm big feelings, and I’ll cheer you on to do brave things with REAL friends. What’s up?'] },
  ];
  const NEUTRAL = ['I hear you. 💜 Tell me a little more?', 'Ooh, go on — I’m all ears. 👂✨', 'Mm, tell me more about that! 💜', 'I’m listening, {name}. 🌟 What else is on your mind?', 'That’s interesting! Why do you think that is? 💭'];
  const smartReply = (text) => {
    const t = text.trim();
    for (const r of RULES) { if (r.re.test(t)) return { ken: withName(pick(r.a)), mood: r.mood, emoji: EMO[r.mood] }; }
    if (/\?\s*$/.test(t)) return { ken: withName(pick(['Ooh, good question! 🤔 What do you think? I love how your brain works.', 'Hmm! 💭 Tell me more about what you’re wondering, {name}.'])), mood: 'happy', emoji: EMO.happy };
    const s = window.sentiment ? window.sentiment(t) : { k: 'neutral' };
    const bank = {
      excited: ['I love your energy! ✨ Tell me more!', 'Ooh you’re buzzing! 🤩 What’s got you so excited?'],
      happy: ['That makes me glow. 😄 What else feels good?', 'Yay! 🌈 Keep going!'],
      love: ['Aww. 🥰 Hold onto that warm feeling.', 'So sweet. 💜 Who makes you feel that way?'],
      sad: ['I’m here with you. 💙 You’re not alone.', 'That sounds hard. 💙 Tell me more.'],
      worried: ['That’s okay to feel. 🌱 One tiny step at a time.', 'I’ve got you. 🫶 What’s the worry about?'],
      angry: ['Big feeling. 🌬️ Want to breathe it out with me?', 'That’s a lot to feel. 🌋 What happened?'],
      neutral: NEUTRAL,
    };
    const arr = bank[s.k] || NEUTRAL;
    const mood = (s.k === 'sad' || s.k === 'worried' || s.k === 'angry' || s.k === 'love') ? 'caring' : (s.k === 'excited' ? 'proud' : 'happy');
    return { ken: withName(pick(arr)), mood, emoji: EMO[mood] };
  };

  const stopTyper = () => { if (typer.current) { clearInterval(typer.current); typer.current = null; } };
  const typeLine = (full, done) => { stopTyper(); let i = 0; setKenLine(''); typer.current = setInterval(() => { i++; setKenLine(full.slice(0, i)); if (i >= full.length) { stopTyper(); done && done(); } }, 26); };

  // ── voice: one tap to talk ──
  const tapMic = () => {
    if (phase === 'listening') { finishListening(); return; }
    if (phase !== 'idle') return;
    setPhase('listening'); setKenMood('listening'); setKenColor(PT.teal); setKenLine('I’m listening… 🎧');
    timers.current.push(setTimeout(finishListening, 2600));
  };
  const finishListening = () => {
    stopTyper();
    const turn = VOICE_TURNS[voiceTurn % VOICE_TURNS.length];
    setThread((t) => [...t, { from: 'me', text: turn.me }]);
    setPhase('thinking'); setKenMood('thinking'); setKenColor(PT.lav); setKenLine('thinking…');
    timers.current.push(setTimeout(() => {
      setPhase('replying'); setKenMood(turn.mood); setKenColor(turn.mood === 'proud' ? PT.gold : turn.mood === 'caring' ? PT.pink : PT.blue);
      setEmojiSet(turn.emoji); setEmojiFire((f) => f + 1);
      typeLine(turn.ken, () => {
        setThread((t) => [...t, { from: 'ken', text: turn.ken }]);
        setPhase('idle'); setVoiceTurn((v) => v + 1);
      });
    }, 1000));
  };

  // ── text ──
  const send = (text) => {
    if (!text.trim() || phase === 'thinking') return;
    setThread((t) => [...t, { from: 'me', text: text.trim() }]);
    setDraft('');
    const branch = TEXT_REPLIES[text.trim()];
    const r = branch ? { ken: branch.ken, mood: branch.mood, emoji: branch.emoji } : smartReply(text);
    const reply = r.ken;
    const mood = r.mood;
    setEmojiSet(r.emoji); setEmojiFire((f) => f + 1);
    setPhase('thinking'); setKenMood('thinking'); setKenColor(PT.lav); setKenLine('thinking…');
    timers.current.push(setTimeout(() => {
      setPhase('replying'); setKenMood(mood); setKenColor(mood === 'proud' ? PT.gold : mood === 'caring' ? PT.pink : PT.blue);
      typeLine(reply, () => { setThread((t) => [...t, { from: 'ken', text: reply }]); setPhase('idle'); });
    }, 700));
  };

  const draftSent = sentiment(draft);
  const faceMood = phase === 'thinking' ? 'thinking' : phase === 'listening' ? 'listening' : (draft.trim() ? draftSent.kenMood : kenMood);
  const faceColor = phase === 'listening' ? PT.teal : phase === 'thinking' ? PT.lav : kenColor;

  const CHIPS = ['I feel happy 😄', 'I’m a bit nervous', 'I did something brave!', 'Tell me a joke 😄'];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PT.bg, fontFamily: B, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(100% 46% at 50% 14%, ${hexA(faceColor, 0.3)} 0%, transparent 62%)`, transition: 'background .6s', pointerEvents: 'none' }} />
      <FloatingEmojis fire={emojiFire} emoji={emojiSet} originY={40} />

      {/* header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '54px 18px 6px' }}>
        {onBack && <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 1px ${PT.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={PT.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ color: PT.text, fontFamily: D, fontWeight: 700, fontSize: 18 }}>Kenshy</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3DDC84', boxShadow: '0 0 8px #3DDC84' }} />
          </div>
          <div style={{ color: PT.muted, fontSize: 11.5 }}>{phase === 'listening' ? 'listening…' : phase === 'thinking' ? 'thinking…' : 'always here for you'}</div>
        </div>
        <span style={{ color: PT.dim, fontSize: 10, textAlign: 'right', maxWidth: 92, lineHeight: 1.3 }}>private · a grown-up keeps it safe</span>
      </div>

      {/* Kenshy hero + live speech bubble */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
        <div style={{ position: 'relative' }}>
          {KenBody ? <KenBody size={148} color={faceColor} mood={faceMood} motion={M} /> : null}
          {phase === 'listening' && <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', boxShadow: `0 0 0 3px ${hexA(PT.teal, 0.3)}, 0 0 0 10px ${hexA(PT.teal, 0.14)}`, animation: 'ken-breathe 1.4s ease-in-out infinite' }} />}
        </div>
        <div style={{ marginTop: 6, maxWidth: 300, minHeight: 54, padding: '10px 16px', borderRadius: '18px 18px 18px 6px', background: PT.card, boxShadow: `inset 0 0 0 1px ${PT.line}`, textAlign: 'center' }}>
          {phase === 'thinking'
            ? <span style={{ display: 'inline-flex', gap: 5 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: PT.muted, animation: `ken-bounce 1.1s ease-in-out ${i * 0.16}s infinite` }} />)}</span>
            : <span data-testid="kenline" style={{ color: PT.text, fontSize: 15, fontWeight: 600, fontFamily: D, lineHeight: 1.4 }}>{kenLine}{phase === 'replying' && <Caret color={faceColor} />}</span>}
        </div>
      </div>

      {/* recent thread (small) */}
      <div ref={paneRef} style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '10px 18px 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {thread.slice(-6).map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '78%', padding: '8px 13px', fontSize: 13.5, lineHeight: 1.35,
            color: m.from === 'me' ? '#fff' : PT.text, borderRadius: m.from === 'me' ? '16px 16px 5px 16px' : '16px 16px 16px 5px',
            background: m.from === 'me' ? `linear-gradient(135deg, ${PT.blue}, ${hexA(PT.blue, 0.82)})` : 'rgba(255,255,255,0.08)',
            boxShadow: m.from === 'me' ? `0 5px 14px ${hexA(PT.blue, 0.35)}` : `inset 0 0 0 1px ${PT.line}`, animation: 'ken-rise .3s ease-out' }}>{m.text}</div>
        ))}
      </div>

      {/* input area — voice + text together, no mode to pick */}
      <div style={{ position: 'relative', padding: '2px 16px 28px' }}>
        {phase === 'listening' && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><Waveform active color={PT.teal} /></div>}
        {/* quick-reply chips (hide while typing/listening) */}
        {phase !== 'listening' && !draft.trim() && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
            {CHIPS.map((c) => (
              <button key={c} onClick={() => send(c)} style={{ flexShrink: 0, border: 'none', cursor: 'pointer', padding: '9px 15px', borderRadius: 999, fontFamily: D, fontWeight: 600, fontSize: 13,
                color: PT.text, background: hexA(PT.teal, 0.16), boxShadow: `inset 0 0 0 1px ${hexA(PT.teal, 0.4)}` }}>{c}</button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* text field */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px 7px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', boxShadow: `inset 0 0 0 1.5px ${PT.line}` }}>
            <span style={{ fontSize: 18, transition: 'transform .2s', transform: draft.trim() ? 'scale(1.18)' : 'scale(1)' }}>{draft.trim() ? draftSent.emoji[0] : '💬'}</span>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(draft); }} placeholder="Type to Kenshy…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'none', color: PT.text, fontFamily: B, fontSize: 15, minWidth: 0 }} />
            {draft.trim() && (
              <button onClick={() => send(draft)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0, cursor: 'pointer',
                background: `linear-gradient(135deg, ${PT.blue}, ${PT.pink})`, color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 16px ${hexA(PT.blue, 0.45)}` }}>↑</button>
            )}
          </div>
          {/* mic button — always here to just talk */}
          <button onClick={tapMic} title="Tap to talk" style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', border: 'none', flexShrink: 0, cursor: 'pointer', touchAction: 'none',
            background: `radial-gradient(circle at 38% 32%, ${hexA('#fff', 0.5)}, ${phase === 'listening' ? PT.teal : faceColor})`,
            boxShadow: phase === 'listening' ? `0 0 0 8px ${hexA(PT.teal, 0.18)}, 0 0 0 16px ${hexA(PT.teal, 0.08)}, 0 0 26px ${hexA(PT.teal, 0.7)}` : `0 10px 24px ${hexA(faceColor, 0.5)}, inset 0 2px 6px rgba(255,255,255,0.4)`,
            transition: 'box-shadow .25s, transform .15s', transform: phase === 'listening' ? 'scale(1.08)' : 'scale(1)' }}>
            <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 12, height: 19, borderRadius: 999, background: 'rgba(26,17,54,0.82)' }} />
            <div style={{ position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)', width: 20, height: 10, borderBottom: '2.5px solid rgba(26,17,54,0.82)', borderLeft: '2.5px solid transparent', borderRight: '2.5px solid transparent', borderRadius: '0 0 12px 12px' }} />
          </button>
        </div>
        <div style={{ textAlign: 'center', color: phase === 'listening' ? PT.teal : PT.dim, fontSize: 11.5, fontWeight: 600, fontFamily: D, marginTop: 8, height: 15 }}>
          {phase === 'listening' ? 'Listening… tap the mic to send' : phase === 'thinking' ? 'Kenshy is thinking…' : 'Type, or tap 🎤 to talk — whatever you like!'}
        </div>
      </div>
    </div>
  );
}

function Caret({ color }) { return <span style={{ display: 'inline-block', width: 2, height: '1em', marginLeft: 2, background: color, verticalAlign: '-2px', animation: 'ken-caret 1s steps(1) infinite' }} />; }
function Waveform({ active, color }) {
  const bars = 22;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 28 }}>
      {Array.from({ length: bars }).map((_, i) => { const d = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2); return (
        <div key={i} style={{ width: 4, borderRadius: 999, background: active ? color : hexA(color, 0.25), height: active ? undefined : 5,
          boxShadow: active ? `0 0 8px ${hexA(color, 0.7)}` : 'none', transformOrigin: 'center',
          animation: active ? `ken-wave ${(0.55 + d * 0.3).toFixed(2)}s ease-in-out ${i * 0.045}s infinite` : 'none' }} />
      ); })}
    </div>
  );
}

window.ScreenTalk = ScreenTalk;
