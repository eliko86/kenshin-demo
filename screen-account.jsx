// screen-account.jsx — "Your space." A calm account/profile screen: identity,
// confidence level, real-world stats, the Kenshin you chose, the linked grown-up,
// and a privacy panel that makes the safety model legible. Exports: ScreenAccount

function ScreenAccount({ theme, buddyId, buddyColor, childName, onSignOut }) {
  const KEN_COLORS = [theme.primary, theme.secondary, theme.warm, theme.pink];
  const [ken, setKen] = React.useState(0);
  const [g] = useGame();
  const kColor = KEN_COLORS[ken];

  const Row = ({ icon, title, sub, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px' }}>
      <div style={{ width: 34, height: 34, borderRadius: 11, background: theme.surf(0.07), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: theme.text, fontSize: 14.5, fontWeight: 600, fontFamily: theme.displayFont }}>{title}</div>
        {sub && <div style={{ color: theme.muted, fontSize: 12, marginTop: 1, lineHeight: 1.35 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
  const Divider = () => <div style={{ height: 1, background: theme.surf(0.07), margin: '0 16px' }} />;
  const Card = ({ children, style }) => (
    <div style={{ borderRadius: 20, background: theme.surf(0.04), boxShadow: `inset 0 0 0 1px ${theme.surf(0.08)}`, overflow: 'hidden', ...style }}>{children}</div>
  );


  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: theme.bg, fontFamily: theme.bodyFont, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(100% 40% at 50% 0%, ${hexA(kColor, 0.3)} 0%, transparent 55%)`, transition: 'background .6s' }} />
      <Starfield count={20} seed={17} motion={theme.motion * 0.6} />

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: '62px 20px 36px' }}>
        <div style={{ color: theme.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Your space</div>

        {/* identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <HeroCharacter buddy={buddyId || 'kenshy'} color={kColor || buddyColor || theme.primary} motion={theme.motion} size={96} />
          <div>
            <GlowText color={theme.text} size={24} weight={600} font={theme.displayFont} glow={0.3}>{childName || 'Maya'}</GlowText>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '4px 12px', borderRadius: 999, background: hexA(kColor, 0.14), boxShadow: `inset 0 0 0 1px ${hexA(kColor, 0.4)}` }}>
              <span style={{ color: kColor }}>✦</span>
              <span style={{ color: theme.text, fontSize: 12.5, fontWeight: 700, fontFamily: theme.displayFont }}>Sky explorer</span>
            </div>
          </div>
        </div>

        {/* my stickers — fun treasures, never a score */}
        <div style={{ color: theme.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '4px 0 9px 4px' }}>My stickers</div>
        <Card style={{ padding: '16px 10px', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', rowGap: 16 }}>
            {g.badges.map((id) => (<Badge key={id} id={id} theme={theme} />))}
          </div>
          <div style={{ textAlign: 'center', color: theme.muted, fontSize: 11.5, marginTop: 12 }}>Little treasures from being brave out there ✦</div>
        </Card>


        {/* your Kenshin */}
        <div style={{ color: theme.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '20px 0 9px 4px' }}>Your Kenshin</div>
        <Card style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {KEN_COLORS.map((c, i) => (
              <button key={i} onClick={() => setKen(i)} style={{
                border: 'none', background: 'none', cursor: 'pointer', padding: 4,
                width: 52, height: 52, borderRadius: '50%',
                boxShadow: ken === i ? `0 0 0 2px ${theme.bg}, 0 0 0 4px ${c}` : 'none', transition: 'box-shadow .2s',
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `radial-gradient(circle at 38% 30%, #fff, ${c})`, boxShadow: `0 0 12px ${hexA(c, 0.6)}` }} />
              </button>
            ))}
          </div>
        </Card>

        {/* grown-up + privacy */}
        <div style={{ color: theme.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', margin: '20px 0 9px 4px' }}>Safety &amp; privacy</div>
        <Card>
          <Row icon="👤" title="A grown-up keeps you safe" sub="They help look after you here" right={<span style={{ color: theme.secondary, fontSize: 12, fontWeight: 700 }}>Linked</span>} />
          <Divider />
          <Row icon="🔒" title="Your feelings are just yours" sub="Your chats, check-ins and feelings stay private" right={<span style={{ color: theme.muted, fontSize: 16 }}>›</span>} />
        </Card>

        {/* the outward reminder */}
        <div style={{ display: 'flex', gap: 11, marginTop: 16, padding: 15, borderRadius: 16, background: `linear-gradient(160deg, ${hexA(theme.secondary, 0.12)}, ${theme.surf(0.03)})`, boxShadow: `inset 0 0 0 1px ${hexA(theme.secondary, 0.28)}` }}>
          <span style={{ fontSize: 18 }}>🌅</span>
          <div style={{ color: theme.muted, fontSize: 12.5, lineHeight: 1.45 }}>
            <span style={{ color: theme.text, fontWeight: 700, fontFamily: theme.displayFont }}>Kenshin’s promise: </span>
            I’ll never try to keep you here. My job is to help you go be brave <em style={{ color: theme.secondary, fontStyle: 'normal' }}>out there</em>.
          </div>
        </div>

        <button onClick={() => onSignOut && onSignOut()} style={{
          width: '100%', marginTop: 16, padding: '13px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: theme.surf(0.05), color: theme.muted, fontSize: 14, fontWeight: 600, fontFamily: theme.displayFont,
        }}>Sign out</button>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, theme, color }) {
  return (
    <button onClick={onClick} style={{
      width: 46, height: 27, borderRadius: 999, border: 'none', cursor: 'pointer', position: 'relative',
      background: on ? color : theme.surf(0.14), transition: 'background .25s',
      boxShadow: on ? `0 0 14px ${hexA(color, 0.5)}` : 'none', flexShrink: 0,
    }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: '50%', background: '#fff', transition: 'left .25s', boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

window.ScreenAccount = ScreenAccount;
