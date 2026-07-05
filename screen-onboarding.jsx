// screen-onboarding.jsx — The registered flow. New kids sign up; returning kids or
// grown-ups SIGN IN to restore their account on another phone. The buddy pick is a
// CHARACTER STYLE + colour only — moods are automatic (they follow real feelings).
// Exports: ScreenOnboarding

function ScreenOnboarding({ theme, onDone }) {
  const KEN_COLORS = [
    { name: 'Sky', c: theme.primary },
    { name: 'Mint', c: theme.secondary },
    { name: 'Gold', c: theme.warm },
    { name: 'Rose', c: theme.pink },
  ];
  const AGES = [8, 9, 10, 11, 12, 13, 14];
  const CHARS = (typeof window !== 'undefined' && window.CHARACTERS) ? window.CHARACTERS : [];

  const [mode, setMode] = React.useState('signup'); // signup | signin
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState(null);
  const [ken, setKen] = React.useState(0);          // colour index
  const [colorTouched, setColorTouched] = React.useState(false);
  const [kenStyle, setKenStyle] = React.useState('kenshy'); // character style id
  const [email, setEmail] = React.useState('');
  const [consent, setConsent] = React.useState(false);

  // sign-in state
  const [siStep, setSiStep] = React.useState(0);    // 0 credentials, 1 who, 2 done
  const [siEmail, setSiEmail] = React.useState('');
  const [siPass, setSiPass] = React.useState('');
  const [siWho, setSiWho] = React.useState(null);   // 'kid' | 'grownup'

  const selCharTint = (CHARS.find((c) => c.id === kenStyle) || {}).tint;
  const kColor = colorTouched ? KEN_COLORS[ken].c : (selCharTint || KEN_COLORS[ken].c);
  const TOTAL = 5;
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));
  const canNext = [true, name.trim().length > 0, age != null, true, /\S+@\S+\.\S+/.test(email) && consent][step];

  const [, game] = useGame();
  const [celebrate, setCelebrate] = React.useState(0);
  React.useEffect(() => {
    if (mode === 'signup' && step === 5) {
      setCelebrate((c) => c + 1); game.addBadge('hello'); game.addBadge('firststar');
      try { localStorage.setItem('kenshin_buddy', JSON.stringify({ id: kenStyle, color: kColor })); } catch (e) {}
    }
  }, [step, mode]);

  const restart = () => { setStep(0); setName(''); setAge(null); setKen(0); setColorTouched(false); setKenStyle('kenshy'); setEmail(''); setConsent(false); };
  const toSignin = () => { setMode('signin'); setSiStep(0); setSiWho(null); };
  const toSignup = () => { setMode('signup'); };

  const selChar = CHARS.find((c) => c.id === kenStyle) || CHARS[0];
  const Body = selChar ? selChar.Body : null;
  const HeroBuddy = ({ size, mood }) => Body
    ? <Body size={size} color={kColor} mood={mood} motion={theme.motion} />
    : <Kenshin theme={theme} color={kColor} size={size} mood={mood} motion={theme.motion} />;

  const inputStyle = {
    width: '100%', border: 'none', outline: 'none', color: theme.text,
    fontFamily: theme.bodyFont, fontSize: 17, padding: '15px 18px', borderRadius: 16,
    background: theme.surf(0.07), boxShadow: `inset 0 0 0 1.5px ${theme.surf(0.14)}`,
  };

  const heroMood = mode === 'signin'
    ? (siStep === 2 ? 'proud' : 'happy')
    : (step === 5 ? 'proud' : step === 4 ? 'caring' : step === 0 ? 'happy' : 'calm');
  const heroSize = (mode === 'signup' && step === 5) || (mode === 'signin' && siStep === 2) ? 128 : (step === 0 && mode === 'signup' ? 120 : 86);

  const siCanContinue = /\S+@\S+\.\S+/.test(siEmail) && siPass.length >= 4;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont }}>
      <div style={{ position: 'absolute', inset: 0, transition: 'background .8s', background: `radial-gradient(100% 55% at 50% 16%, ${hexA(kColor, (mode === 'signup' && step === 5) ? 0.42 : 0.3)} 0%, transparent 60%)` }} />
      <Starfield count={26} seed={2} motion={theme.motion} />
      <Confetti fire={celebrate} theme={theme} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '64px 24px 34px' }}>
        {/* progress dots (signup only) */}
        {mode === 'signup' && step < 5 && (
          <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 18 }}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} style={{ height: 5, borderRadius: 999, transition: 'all .35s', width: i === step ? 26 : 7, background: i <= step ? kColor : theme.surf(0.16), boxShadow: i === step ? `0 0 10px ${hexA(kColor, 0.8)}` : 'none' }} />
            ))}
          </div>
        )}
        {mode === 'signin' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1, color: theme.muted, background: theme.surf(0.06), padding: '5px 13px', borderRadius: 999 }}>WELCOME BACK</span>
          </div>
        )}

        {/* hero buddy */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <HeroBuddy size={heroSize} mood={heroMood} />
        </div>

        {/* body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {mode === 'signin' ? (
            <SignInBody {...{ theme, siStep, setSiStep, siWho, setSiWho, kColor, HeroBuddy, name, onDone, kenStyle }} />
          ) : (
            <>
              {step === 0 && (
                <StepWrap theme={theme} center>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                    <Title theme={theme} color={kColor} big>Hi, I’m Kenshy</Title>
                    <span style={{ fontSize: 30, display: 'inline-block', transformOrigin: '70% 90%', animation: 'ken-wiggle 1.2s ease-in-out infinite' }}>👋</span>
                  </div>
                  <Sub theme={theme} center>I’m your buddy for feeling braver with real people. Ready to start our adventure?</Sub>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '11px 16px', borderRadius: 13, background: theme.surf(0.05) }}>
                    <span style={{ fontSize: 15 }}>🔒</span>
                    <span style={{ color: theme.muted, fontSize: 12.5, lineHeight: 1.4 }}>A calm, private space. A grown-up helps keep it safe.</span>
                  </div>
                </StepWrap>
              )}

              {step === 1 && (
                <StepWrap theme={theme}>
                  <Title theme={theme} color={kColor}>What should I call you?</Title>
                  <Sub theme={theme}>Just a first name or a nickname — whatever feels like you.</Sub>
                  <input style={{ ...inputStyle, marginTop: 20 }} value={name} maxLength={20} onChange={(e) => setName(e.target.value)} placeholder="Type your name" autoFocus />
                  {name && <div style={{ marginTop: 14, color: kColor, fontSize: 15, fontFamily: theme.displayFont, fontWeight: 600 }}>Nice to meet you, {name.trim()} ✦</div>}
                </StepWrap>
              )}

              {step === 2 && (
                <StepWrap theme={theme}>
                  <Title theme={theme} color={kColor}>How old are you?</Title>
                  <Sub theme={theme}>This helps me get the missions just right for you.</Sub>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
                    {AGES.map((a) => (
                      <button key={a} onClick={() => setAge(a)} style={{ width: 56, height: 56, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: theme.displayFont, fontWeight: 600, fontSize: 19, color: age === a ? '#fff' : theme.text, background: age === a ? `linear-gradient(135deg, ${kColor}, ${hexA(kColor, 0.8)})` : theme.surf(0.06), boxShadow: age === a ? `0 8px 22px ${hexA(kColor, 0.4)}` : `inset 0 0 0 1px ${theme.surf(0.12)}`, transform: age === a ? 'scale(1.06)' : 'scale(1)', transition: 'all .2s' }}>{a}</button>
                    ))}
                  </div>
                </StepWrap>
              )}

              {step === 3 && (
                <StepWrap theme={theme}>
                  <Title theme={theme} color={kColor}>Pick your Kenshy</Title>
                  <Sub theme={theme}>Choose a <strong style={{ color: theme.text }}>style</strong> and a colour. Their moods are automatic — they’ll change with how you feel ✦</Sub>
                  {/* character styles */}
                  <div style={{ display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto', padding: '4px 2px 8px', scrollSnapType: 'x mandatory' }}>
                    {CHARS.map((c) => {
                      const on = kenStyle === c.id; const Mini = c.Body;
                      return (
                        <button key={c.id} onClick={() => setKenStyle(c.id)} style={{ flex: '0 0 auto', scrollSnapAlign: 'center', border: 'none', cursor: 'pointer', borderRadius: 18, padding: '8px 6px 6px', background: on ? hexA(kColor, 0.12) : theme.surf(0.04), boxShadow: on ? `inset 0 0 0 2px ${kColor}` : `inset 0 0 0 1px ${theme.surf(0.08)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all .2s', width: 78 }}>
                          <Mini size={54} color={on ? kColor : (c.tint || theme.primary)} mood={on ? 'happy' : 'calm'} motion={on ? 1 : 0.75} />
                          <span style={{ fontSize: 11, fontWeight: 600, fontFamily: theme.displayFont, color: on ? theme.text : theme.muted, marginTop: 2 }}>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  {/* colours */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                    {KEN_COLORS.map((kc, i) => (
                      <button key={i} onClick={() => { setKen(i); setColorTouched(true); }} title={kc.name} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0, background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${kc.c} 20%, white), ${kc.c})`, boxShadow: ken === i ? `0 0 0 3px #fff, 0 0 0 5px ${kc.c}, 0 6px 16px ${hexA(kc.c, 0.5)}` : `0 4px 12px ${hexA(kc.c, 0.4)}`, transform: ken === i ? 'scale(1.12)' : 'scale(1)', transition: 'all .18s' }} />
                    ))}
                  </div>
                </StepWrap>
              )}

              {step === 4 && (
                <StepWrap theme={theme}>
                  <Title theme={theme} color={kColor}>A grown-up to keep you safe</Title>
                  <Sub theme={theme}>Kenshy is for ages 8–14, so a parent or guardian sets up alongside you. <strong style={{ color: theme.text }}>This is the account you’ll sign back into</strong> on any phone.</Sub>
                  <input style={{ ...inputStyle, marginTop: 18 }} value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Grown-up’s email" />
                  <button onClick={() => setConsent((c) => !c)} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginTop: 14, cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left', padding: 0, width: '100%' }}>
                    <span style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, marginTop: 1, background: consent ? kColor : theme.surf(0.07), boxShadow: consent ? `0 0 12px ${hexA(kColor, 0.6)}` : `inset 0 0 0 1.5px ${theme.surf(0.22)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, transition: 'all .2s' }}>{consent ? '✓' : ''}</span>
                    <span style={{ color: theme.muted, fontSize: 12.5, lineHeight: 1.45 }}>A grown-up is helping me set this up and agrees to the safety &amp; privacy terms.</span>
                  </button>
                </StepWrap>
              )}

              {step === 5 && (
                <StepWrap theme={theme} center>
                  <Title theme={theme} color={kColor} big>You’re all set, {name.trim() || 'friend'}! ✦</Title>
                  <Sub theme={theme} center>Your adventure starts now. Sign back in with your grown-up’s email any time — your buddy and your space follow you to any phone.</Sub>
                  <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16, animation: 'ken-pop-in .5s .2s both' }}>
                    <Badge id="hello" theme={theme} />
                    <Badge id="firststar" theme={theme} />
                  </div>
                  <div style={{ color: theme.warm, fontSize: 13, fontWeight: 700, fontFamily: theme.displayFont, marginTop: 10 }}>2 badges unlocked! 🎉</div>
                </StepWrap>
              )}
            </>
          )}
        </div>

        {/* footer */}
        {mode === 'signup' ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {step > 0 && step < 5 && <KenButton theme={theme} variant="ghost" onClick={back} style={{ flex: '0 0 auto', width: 90 }}>Back</KenButton>}
              {step < 5 ? (
                <KenButton theme={theme} color={kColor} disabled={!canNext} onClick={next} style={{ flex: 1 }}>{step === 4 ? 'Create my space ✦' : step === 0 ? 'Let’s go ✦' : 'Continue'}</KenButton>
              ) : (
                <KenButton theme={theme} color={kColor} onClick={() => onDone ? onDone({ buddy: kenStyle, color: kColor, who: 'kid', name: name.trim() }) : restart()} style={{ flex: 1 }}>Enter my space ✦</KenButton>
              )}
            </div>
            {step === 0 && (
              <button onClick={toSignin} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', marginTop: 12, color: theme.muted, fontSize: 13.5, fontFamily: theme.bodyFont }}>
                Already have a buddy? <strong style={{ color: kColor, fontFamily: theme.displayFont }}>Sign in</strong>
              </button>
            )}
          </div>
        ) : (
          <SignInFooter {...{ theme, siStep, setSiStep, siWho, toSignup, restart, onDone, kenStyle, kColor }} />
        )}
      </div>
    </div>
  );
}

// ── sign-in body — passwordless (Apple / Google / Face ID) ───
function SignInBody({ theme, siStep, setSiStep, siWho, setSiWho, kColor, HeroBuddy, name }) {
  const [auth, setAuth] = React.useState(null); // null | 'face' | 'apple' | 'google'
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const signIn = (method, who) => {
    setAuth(method); setSiWho(who);
    timer.current = setTimeout(() => { setAuth(null); setSiStep(2); }, method === 'face' ? 1300 : 900);
  };

  if (siStep === 0) {
    if (auth) {
      return (
        <StepWrap theme={theme} center>
          <div style={{ marginTop: 6 }}><FaceID color={kColor} size={96} scanning={auth === 'face'} /></div>
          <div style={{ marginTop: 16, color: theme.text, fontFamily: theme.displayFont, fontWeight: 600, fontSize: 16 }}>
            {auth === 'face' ? 'Looking for you…' : auth === 'apple' ? 'Signing in with Apple…' : 'Signing in with Google…'}
          </div>
          <div style={{ color: theme.muted, fontSize: 12.5, marginTop: 4 }}>No password needed ✦</div>
        </StepWrap>
      );
    }
    return (
      <StepWrap theme={theme} center>
        <Title theme={theme} color={kColor} big>Welcome back ✦</Title>
        <Sub theme={theme} center>No passwords to remember — just you. Sign in the way you already do.</Sub>
        {/* Face ID */}
        <button onClick={() => signIn('face', 'kid')} style={{ marginTop: 18, border: 'none', cursor: 'pointer', background: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <FaceID color={kColor} size={76} />
          <span style={{ fontFamily: theme.displayFont, fontWeight: 600, fontSize: 14, color: theme.text }}>Tap to sign in with Face ID</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', margin: '16px 0 14px' }}>
          <div style={{ flex: 1, height: 1, background: theme.line(0.12) }} />
          <span style={{ color: theme.muted, fontSize: 11.5 }}>or</span>
          <div style={{ flex: 1, height: 1, background: theme.line(0.12) }} />
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => signIn('apple', 'kid')} style={{ width: '100%', border: 'none', cursor: 'pointer', borderRadius: 14, padding: '13px', background: '#111', color: '#fff', fontFamily: theme.displayFont, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <AppleLogo /> Continue with Apple
          </button>
          <button onClick={() => signIn('google', 'kid')} style={{ width: '100%', cursor: 'pointer', borderRadius: 14, padding: '13px', background: '#fff', color: '#2B3566', border: 'none', boxShadow: `inset 0 0 0 1.5px ${theme.line(0.16)}`, fontFamily: theme.displayFont, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <GoogleG /> Continue with Google
          </button>
        </div>
      </StepWrap>
    );
  }
  // siStep 2 — landed
  const kid = siWho === 'kid';
  return (
    <StepWrap theme={theme} center>
      <Title theme={theme} color={kColor} big>{kid ? `Welcome back, ${name.trim() || 'Maya'}! ✦` : 'Welcome back ✦'}</Title>
      <Sub theme={theme} center>
        {kid
          ? 'Your buddy and your private space are right here — exactly as you left them, on this new phone.'
          : 'Your family is all here. Each child has their own private Kenshy & account — you see growth and patterns, never their words.'}
      </Sub>
      {kid ? (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
          <Badge id="hello" theme={theme} /><Badge id="firststar" theme={theme} /><Badge id="brave" theme={theme} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 16 }}>
          {['Maya', 'Leo', 'Ava'].map((nm, i) => (
            <div key={nm} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: `radial-gradient(circle at 36% 30%, color-mix(in srgb, ${[theme.primary, theme.warm, theme.pink][i]} 20%, white), ${[theme.primary, theme.warm, theme.pink][i]})`, boxShadow: `0 6px 14px ${hexA([theme.primary, theme.warm, theme.pink][i], 0.4)}` }} />
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: theme.displayFont, color: theme.text }}>{nm}</span>
            </div>
          ))}
        </div>
      )}
    </StepWrap>
  );
}

function SignInFooter({ theme, siStep, setSiStep, siWho, toSignup, onDone, kenStyle, kColor }) {
  return (
    <div style={{ marginTop: 12 }}>
      {siStep === 2 && <KenButton theme={theme} color={theme.primary} onClick={() => onDone ? onDone({ buddy: kenStyle, color: kColor, who: siWho === 'grownup' ? 'parent' : 'kid' }) : setSiStep(0)} style={{ width: '100%' }}>{siWho === 'kid' ? 'Enter my space ✦' : 'Open family dashboard ✦'}</KenButton>}
      {siStep === 0 && (
        <button onClick={() => { setSiStep(0); toSignup(); }} style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', marginTop: 4, color: theme.muted, fontSize: 13.5, fontFamily: theme.bodyFont }}>
          New here? <strong style={{ color: theme.primary, fontFamily: theme.displayFont }}>Create an account</strong>
        </button>
      )}
    </div>
  );
}

// Face ID glyph (corner brackets + simple face), with optional scan sweep
function FaceID({ color, size = 80, scanning }) {
  const sw = 4.5;
  return (
    <div style={{ position: 'relative', width: size, height: size, overflow: 'hidden', borderRadius: size * 0.22 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 12 H18 Q12 12 12 18 V24" /><path d="M76 12 H82 Q88 12 88 18 V24" />
        <path d="M24 88 H18 Q12 88 12 82 V76" /><path d="M76 88 H82 Q88 88 88 82 V76" />
        <path d="M38 40 V48" /><path d="M62 40 V48" />
        <path d="M50 42 V54 H46" />
        <path d="M40 64 Q50 72 60 64" />
      </svg>
      {scanning && <div style={{ position: 'absolute', left: '12%', right: '12%', top: '50%', height: 3, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}`, animation: 'ken-scan 1.1s ease-in-out infinite' }} />}
    </div>
  );
}
function AppleLogo() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.04.28.04.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.65 0-2.24.91-3.61.91-1.4 0-2.4-1.25-3.46-2.62-1.65-2.13-2.94-5.69-2.94-9.1 0-5.39 3.5-8.26 6.93-8.26 1.5 0 2.74.96 3.65.96.88 0 2.32-1.02 4.03-1.02.64 0 2.94.06 4.45 2.23-.12.07-2.56 1.49-2.56 4.46 0 3.42 3.01 4.61 3.13 4.65z" /></svg>;
}
function GoogleG() {
  return <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" /><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" /><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" /><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" /></svg>;
}

function StepWrap({ children, theme, center }) {
  return <div style={{ animation: 'ken-rise .4s ease-out', textAlign: center ? 'center' : 'left', display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'stretch' }}>{children}</div>;
}
function Title({ children, theme, color, big }) {
  return <GlowText color={theme.text} size={big ? 25 : 23} weight={600} font={theme.displayFont} glow={0.35} style={{ lineHeight: 1.25, display: 'block' }}>{children}</GlowText>;
}
function Sub({ children, theme, center }) {
  return <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.5, marginTop: 9, maxWidth: center ? 300 : 'none' }}>{children}</div>;
}

window.ScreenOnboarding = ScreenOnboarding;
