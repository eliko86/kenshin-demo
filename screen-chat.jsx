// screen-chat.jsx — "Just talk." A sophisticated classic text chat with Kenshin.
// Refined glass bubbles, message grouping with a mini-orb, a real typing indicator,
// smart quick-reply chips, an inline mission card, and a calm composer. Auto-scrolls
// within its own pane (never the document). Exports: ScreenChat

function ScreenChat({ theme }) {
  // a message: { from:'ken'|'me', text, card?, react? }
  const SEED = [
    { from: 'ken', text: 'Hey ✦ I’m really glad you’re here. How’s your heart today?' },
  ];
  // scripted branches keyed by the chip/text the child sends
  const FLOW = {
    'A bit nervous': {
      reply: ['Nervous is okay — it usually means something matters to you.', 'Want to tell me what’s on your mind?'],
      chips: ['School stuff', 'Talking to people', 'I don’t know'],
    },
    'Talking to people': {
      reply: ['That’s a big, brave thing to work on. You’re not the only one who finds it hard.', 'Here’s a tiny step we could try together — no pressure:'],
      card: { title: 'Say hi to one person', sub: 'Just “hi.” Tiny hellos start everything.', pts: 10 },
      chips: ['Okay, I’ll try', 'Too scary right now'],
    },
    'School stuff': {
      reply: ['School can be a lot. What part feels heaviest right now?'],
      chips: ['Lunch is lonely', 'Group work', 'Too scary right now'],
    },
    'Lunch is lonely': {
      reply: ['That’s a hard one, and I’m sorry it feels lonely.', 'What if next time you found one person who seems kind — and just sat nearby? You don’t even have to talk much.'],
      chips: ['Okay, I’ll try', 'I don’t know'],
    },
    'Okay, I’ll try': {
      reply: ['I believe in you — really.', 'Go find your moment, then come back and tell me how it went. I want to hear about THEM, not about me. ✦'],
      chips: ['Thanks, Kenshin'],
    },
    'Too scary right now': {
      reply: ['Totally okay. Brave isn’t about doing the big thing — it’s about wanting to.', 'We’ll find a smaller step. Want to just breathe together for a sec?'],
      chips: ['Yes, let’s breathe', 'Thanks, Kenshin'],
    },
    'Group work': {
      reply: ['Group work is its own kind of tricky. You could be the one who asks, “what should we start with?” — it gives everyone a door in.'],
      chips: ['Okay, I’ll try', 'I don’t know'],
    },
    'I don’t know': {
      reply: ['That’s a real answer, and it’s allowed. We can just sit here for a moment.', 'I’m not going anywhere.'],
      chips: ['Thanks, Kenshin', 'A bit nervous'],
    },
    'Yes, let’s breathe': {
      reply: ['Let’s do it. In through the nose… and slowly out. I’ll glow with you. ✦'],
      chips: ['Thanks, Kenshin'],
    },
    'Thanks, Kenshin': {
      reply: ['Always. ✦ Now go be out there — your real people are waiting.'],
      chips: ['A bit nervous'],
    },
  };
  const START_CHIPS = ['A bit nervous', 'Pretty good!', 'School stuff'];
  const EXTRA = {
    'Pretty good!': {
      reply: ['Love that! ✦ What made today good — was it a person?'],
      chips: ['A friend', 'Talking to people'],
    },
    'A friend': {
      reply: ['Friends are everything. Hold onto that feeling — and maybe tell them it mattered.'],
      chips: ['Okay, I’ll try', 'Thanks, Kenshin'],
    },
  };
  const ALL = { ...FLOW, ...EXTRA };
  // empathetic fallback replies, chosen by how the child's words feel
  // each key is a pool of varied single replies; send() picks one at random
  const SENT_REPLY = {
    excited: ['I love your energy! ✨ Tell me more!', 'Ooh you’re buzzing! 🤩 What’s got you so excited?'],
    happy: ['That makes me glow. 😄 What else feels good?', 'Yay! 🌈 I love hearing that — keep going!'],
    love: ['Aww. 🥰 Hold onto that warm feeling.', 'So sweet. 💜 Who makes you feel that way?'],
    sad: ['I’m here with you. 💙 You don’t have to carry that alone.', 'That sounds hard. 💙 I’m listening — tell me more.'],
    worried: ['That’s okay to feel. 🌱 We can take one tiny step together.', 'I’ve got you. 🫶 What’s the worry about?'],
    angry: ['Big feeling. 🌬️ Want to breathe it out with me?', 'That’s a lot to feel. 🌋 I’m right here. What happened?'],
    neutral: ['I hear you. 💜 Tell me a little more?', 'Ooh, go on — I’m all ears. 👂✨', 'Mm, tell me more about that! 💜', 'That’s interesting! Why do you think that is? 💭'],
  };

  const [msgs, setMsgs] = React.useState(SEED);
  const [chips, setChips] = React.useState(START_CHIPS);
  const [typing, setTyping] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [reactMood, setReactMood] = React.useState('happy');
  const [emojiSet, setEmojiSet] = React.useState(['✨']);
  const [emojiFire, setEmojiFire] = React.useState(0);
  const [questFire, setQuestFire] = React.useState(0);
  const paneRef = React.useRef(null);
  const timers = React.useRef([]);
  const draftSent = sentiment(draft);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  React.useEffect(() => {
    const el = paneRef.current; if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const send = (text) => {
    if (!text.trim() || typing) return;
    const sent = sentiment(text);
    setReactMood(sent.kenMood); setEmojiSet(sent.emoji); setEmojiFire((f) => f + 1);
    setChips([]);
    setMsgs((m) => [...m, { from: 'me', text: text.trim() }]);
    const branch = ALL[text.trim()];
    setTyping(true);
    const pool = SENT_REPLY[sent.k] || SENT_REPLY.neutral;
    const replies = branch ? branch.reply : [pool[Math.floor(Math.random() * pool.length)]];
    const nextChips = branch ? (branch.chips || []) : ['A bit nervous', 'School stuff'];
    let delay = 650;
    replies.forEach((r, i) => {
      const last = i === replies.length - 1;
      timers.current.push(setTimeout(() => {
        const card = last && branch && branch.card ? branch.card : null;
        setMsgs((m) => [...m, { from: 'ken', text: r, card }]);
        if (card) setQuestFire((q) => q + 1);
        if (last) { setTyping(false); setChips(nextChips); }
      }, delay));
      delay += 250 + r.length * 24;
    });
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 40% at 50% 0%, ${hexA(theme.primary, 0.22)} 0%, transparent 55%)` }} />
      <Starfield count={18} seed={13} motion={theme.motion * 0.5} />

      {/* header */}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '58px 20px 14px',
        borderBottom: `1px solid ${theme.surf(0.08)}`,
        background: `linear-gradient(${hexA(theme.bg, 0.6)}, ${hexA(theme.bg, 0)})`, backdropFilter: 'blur(8px)',
      }}>
        <Kenshin theme={theme} mood={typing ? 'thinking' : (draft.trim() ? draftSent.kenMood : reactMood)} size={46} motion={theme.motion} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <GlowText color={theme.text} size={18} weight={600} font={theme.displayFont} glow={0.3}>Kenshin</GlowText>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: theme.secondary, boxShadow: `0 0 8px ${theme.secondary}` }} />
          </div>
          <div style={{ color: theme.muted, fontSize: 11.5, marginTop: 1 }}>{typing ? 'typing…' : 'AI friend · here for you'}</div>
        </div>
        <div style={{ color: theme.muted, fontSize: 10, textAlign: 'right', maxWidth: 92, lineHeight: 1.3 }}>private · a grown-up keeps it safe</div>
      </div>

      {/* messages pane */}
      <FloatingEmojis fire={emojiFire} emoji={emojiSet} originY={52} />
      <Confetti fire={questFire} theme={theme} count={20} />
      <div ref={paneRef} style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '16px 18px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ alignSelf: 'center', color: theme.muted, fontSize: 11, padding: '2px 12px', borderRadius: 999, background: theme.surf(0.05), marginBottom: 6 }}>Today</div>
        {msgs.map((m, i) => {
          const mine = m.from === 'me';
          const prev = msgs[i - 1];
          const grouped = prev && prev.from === m.from;
          return (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'flex-end',
              flexDirection: mine ? 'row-reverse' : 'row',
              marginTop: grouped ? 1 : 8, animation: 'ken-rise .35s ease-out',
            }}>
              {/* mini bubble buddy for ken, only on group start */}
              {!mine && (
                <div style={{ width: 30, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  {!grouped && <Kenshin theme={theme} size={30} breathing={false} motion={theme.motion} mood="happy" />}
                </div>
              )}
              <div style={{ maxWidth: '76%' }}>
                <div style={{
                  padding: '11px 15px', fontSize: 15, lineHeight: 1.42, color: mine ? '#fff' : theme.text,
                  borderRadius: mine ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                  background: mine
                    ? `linear-gradient(135deg, ${theme.primary}, ${hexA(theme.primary, 0.82)})`
                    : theme.surf(0.08),
                  boxShadow: mine ? `0 6px 18px ${hexA(theme.primary, 0.35)}` : `inset 0 0 0 1px ${theme.surf(0.1)}`,
                }}>{m.text}</div>
                {/* inline mission card */}
                {m.card && (
                  <div style={{
                    marginTop: 7, padding: 14, borderRadius: 16,
                    background: `linear-gradient(160deg, ${hexA(theme.warm, 0.16)}, ${theme.surf(0.04)})`,
                    boxShadow: `inset 0 0 0 1px ${hexA(theme.warm, 0.4)}`,
                    animation: 'ken-pop-in .4s ease-out',
                  }}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: theme.warm, fontFamily: theme.displayFont }}>✦ NEW QUEST</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: theme.warm, fontSize: 16, filter: `drop-shadow(0 0 6px ${theme.warm})` }}>🎯</span>
                      <span style={{ color: theme.text, fontWeight: 700, fontSize: 14.5, fontFamily: theme.displayFont }}>{m.card.title}</span>
                    </div>
                    <div style={{ color: theme.muted, fontSize: 12.5, marginTop: 5, lineHeight: 1.4 }}>{m.card.sub}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ color: theme.warm, fontSize: 12, fontWeight: 700 }}>A new star ✦</span>
                      <span style={{ color: theme.muted, fontSize: 10.5 }}>out there, for real</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 8 }}>
            <div style={{ width: 30, flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Kenshin theme={theme} size={30} breathing={true} motion={theme.motion} mood="thinking" /></div>
            <div style={{ padding: '13px 16px', borderRadius: '20px 20px 20px 6px', background: theme.surf(0.08), display: 'flex', gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: theme.muted, animation: `ken-bounce 1.1s ease-in-out ${i * 0.16}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* quick-reply chips */}
      {chips.length > 0 && !typing && (
        <div style={{ position: 'relative', display: 'flex', gap: 8, padding: '6px 16px 4px', flexWrap: 'wrap' }}>
          {chips.map((c) => (
            <button key={c} onClick={() => send(c)} style={{
              border: 'none', cursor: 'pointer', padding: '9px 15px', borderRadius: 999,
              fontFamily: theme.displayFont, fontWeight: 600, fontSize: 13.5, color: theme.text,
              background: hexA(theme.secondary, 0.14), boxShadow: `inset 0 0 0 1px ${hexA(theme.secondary, 0.4)}`,
              animation: 'ken-rise .3s ease-out', transition: 'transform .15s',
            }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>{c}</button>
          ))}
        </div>
      )}

      {/* composer */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 16px 30px' }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 12px', borderRadius: 999,
          background: theme.surf(0.07), boxShadow: `inset 0 0 0 1.5px ${theme.surf(0.13)}`,
        }}>
          <span style={{ fontSize: 18, transition: 'transform .2s', transform: draft.trim() ? 'scale(1.18)' : 'scale(1)' }}>{draft.trim() ? draftSent.emoji[0] : '💬'}</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { send(draft); setDraft(''); } }}
            placeholder="Tell Kenshin anything…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', color: theme.text, fontFamily: theme.bodyFont, fontSize: 15 }} />
          <button onClick={() => { send(draft); setDraft(''); }} disabled={!draft.trim() || typing} style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none', flexShrink: 0,
            cursor: draft.trim() && !typing ? 'pointer' : 'default',
            background: draft.trim() && !typing ? `linear-gradient(135deg, ${theme.primary}, ${theme.pink})` : theme.surf(0.1),
            color: '#fff', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: draft.trim() && !typing ? `0 6px 16px ${hexA(theme.primary, 0.45)}` : 'none', transition: 'all .2s',
          }}>↑</button>
        </div>
      </div>
    </div>
  );
}

window.ScreenChat = ScreenChat;
