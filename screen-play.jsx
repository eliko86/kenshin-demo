// screen-play.jsx — "Play with Kenshy": games hub + Snake, Tetris, Tic-Tac-Toe.
// Styled to match the purple HOME world. Fully TOUCH-first: swipe to steer/move,
// tap to rotate — no on-screen D-pad, so the play area is big and immersive.
// Kenshy is a collaborative companion: cheers, tips, celebrates, and lifts you up.
// Exports: ScreenPlay

// home-world palette
const PH = {
  bg: 'linear-gradient(180deg,#3A2F72 0%,#2C2462 34%,#241C56 68%,#1E1749 100%)',
  text: '#F5F2FF', muted: '#C3BBEC', dim: '#9A91CE',
  blue: '#5B8DEF', teal: '#3FC9C0', lav: '#9B7CF5', amber: '#FFB454', pink: '#FF7FB0', gold: '#FFD36B', green: '#5FD08A', red: '#FF7A6B',
  card: 'rgba(48,40,96,0.55)', line: 'rgba(190,181,236,0.20)', board: 'rgba(20,15,52,0.45)',
};

function ScreenPlay({ theme, onBack, buddyId, buddyColor, motion }) {
  const D = theme.displayFont, B = theme.bodyFont;
  const [game, setGame] = React.useState(null);
  const KenBody = (window.CHARACTERS || []).find((c) => c.id === (buddyId || 'kenshy'))?.Body;
  const M = motion || 1.05;

  const GAMES = [
    { id: 'snake', name: 'Snake', tag: 'Swipe to steer me', c: PH.teal, emoji: '🐍' },
    { id: 'tetris', name: 'Tetris', tag: 'Swipe & tap to stack', c: PH.blue, emoji: '🧩' },
    { id: 'ttt', name: 'Tic-Tac-Toe', tag: 'Play a round with me', c: PH.pink, emoji: '⭕' },
  ];

  if (game === 'snake') return <SnakeGame D={D} B={B} KenBody={KenBody} onBack={() => setGame(null)} />;
  if (game === 'tetris') return <TetrisGame D={D} B={B} KenBody={KenBody} onBack={() => setGame(null)} />;
  if (game === 'ttt') return <TicTacToe D={D} B={B} KenBody={KenBody} onBack={() => setGame(null)} />;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PH.bg, fontFamily: B }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 40% at 50% 0%, ${hexA(PH.lav, 0.28)} 0%, transparent 62%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '62px 20px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          {onBack && <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 1px ${PH.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={PH.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>}
          {KenBody ? <KenBody size={onBack ? 54 : 66} color={buddyColor || PH.blue} mood="happy" motion={M} /> : null}
          <div>
            <div style={{ color: PH.text, fontFamily: D, fontWeight: 700, fontSize: 23, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Let’s play together!</div>
            <div style={{ color: PH.muted, fontSize: 13.5, marginTop: 3 }}>Pick a game — I’ll play right beside you. 💜</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {GAMES.map((g) => (
            <button key={g.id} onClick={() => setGame(g.id)} style={{
              border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 24, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 16, transition: 'transform .15s',
              background: `linear-gradient(150deg, ${hexA(g.c, 0.26)}, rgba(48,40,96,0.4))`,
              boxShadow: `inset 0 0 0 1.5px ${hexA(g.c, 0.45)}, 0 10px 24px ${hexA(g.c, 0.2)}`,
            }}
              onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <span style={{ width: 58, height: 58, borderRadius: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, background: `radial-gradient(circle at 38% 30%, #fff, ${hexA(g.c, 0.7)})`, boxShadow: `0 6px 16px ${hexA(g.c, 0.45)}` }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: PH.text, fontFamily: D, fontWeight: 700, fontSize: 20 }}>{g.name}</div>
                <div style={{ color: PH.muted, fontSize: 13, marginTop: 2 }}>{g.tag}</div>
              </div>
              <span style={{ color: g.c, fontSize: 22, fontWeight: 700 }}>›</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', color: PH.muted, fontSize: 12, lineHeight: 1.45 }}>
          🎮 We play to have fun and get a little better each time — never to win against each other.
        </div>
      </div>
    </div>
  );
}

// ── shell + companion ────────────────────────────────────────
function GameShell({ D, title, color, onBack, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: PH.bg, fontFamily: "'Nunito',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 36% at 50% 0%, ${hexA(color, 0.24)} 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '54px 18px 6px' }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', boxShadow: `inset 0 0 0 1px ${PH.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={PH.text} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ color: PH.text, fontFamily: D, fontWeight: 600, fontSize: 19 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}
function Companion({ D, KenBody, mood, color, line, size = 50 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 14px 9px 8px', borderRadius: 18, background: PH.card, boxShadow: `inset 0 0 0 1px ${PH.line}`, minHeight: 60 }}>
      <div style={{ flexShrink: 0 }}>{KenBody ? <KenBody size={size} color={color || PH.blue} mood={mood || 'happy'} motion={1.05} /> : null}</div>
      <div style={{ color: PH.text, fontSize: 13.5, fontWeight: 600, fontFamily: D, lineHeight: 1.35 }}>{line}</div>
    </div>
  );
}
function Stat({ D, label, value, color }) {
  return (
    <div style={{ minWidth: 76, textAlign: 'center', padding: '7px 14px', borderRadius: 14, background: PH.card, boxShadow: `inset 0 0 0 1px ${PH.line}` }}>
      <div style={{ color, fontFamily: D, fontWeight: 700, fontSize: 20 }}>{value}</div>
      <div style={{ color: PH.muted, fontSize: 10.5, marginTop: 1 }}>{label}</div>
    </div>
  );
}
function Hint({ children }) {
  return <div style={{ marginTop: 12, color: PH.dim, fontSize: 12, textAlign: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>{children}</div>;
}
function KButton({ color, onClick, children }) {
  return <button onClick={onClick} onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'} onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} style={{ border: 'none', cursor: 'pointer', fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 17, color: '#fff', padding: '13px 26px', borderRadius: 999, background: `linear-gradient(135deg, color-mix(in srgb, ${color} 85%, white), ${color})`, boxShadow: `0 10px 24px ${hexA(color, 0.5)}, inset 0 1px 0 rgba(255,255,255,0.4)`, transition: 'transform .15s' }}>{children}</button>;
}

// ── SNAKE (swipe to steer) ───────────────────────────────────
function SnakeGame({ D, KenBody, onBack }) {
  const N = 15, CELL = 22;
  const [snake, setSnake] = React.useState([[8, 8], [8, 9], [8, 10]]);
  const [food, setFood] = React.useState([8, 4]);
  const [score, setScore] = React.useState(0);
  const [best, setBest] = React.useState(() => { try { return +localStorage.getItem('ken_snake_best') || 0; } catch (e) { return 0; } });
  const [state, setState] = React.useState('ready');
  const [line, setLine] = React.useState('Swipe anywhere to steer me to the treats! 💜');
  const dirRef = React.useRef([0, -1]), nextRef = React.useRef([0, -1]);
  const snakeRef = React.useRef(snake), foodRef = React.useRef(food);
  snakeRef.current = snake; foodRef.current = food;

  const randFood = (sn) => { let f; do { f = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (sn.some((s) => s[0] === f[0] && s[1] === f[1])); return f; };
  const setDir = (d) => { const c = dirRef.current; if (d[0] === -c[0] && d[1] === -c[1]) return; nextRef.current = d; if (state === 'ready') start(); };
  const start = () => { const s0 = [[8, 8], [8, 9], [8, 10]]; setSnake(s0); dirRef.current = [0, -1]; nextRef.current = [0, -1]; setFood(randFood(s0)); setScore(0); setState('play'); setLine('Here we go! I’m cheering for you! 🎉'); };

  React.useEffect(() => {
    if (state !== 'play') return;
    const speed = Math.max(90, 200 - score * 6);
    const iv = setInterval(() => {
      dirRef.current = nextRef.current;
      const sn = snakeRef.current, d = dirRef.current;
      const nx = (sn[0][0] + d[0] + N) % N, ny = (sn[0][1] + d[1] + N) % N;
      if (sn.some((s, i) => i < sn.length - 1 && s[0] === nx && s[1] === ny)) {
        setState('over'); const nb = Math.max(best, score);
        setLine(score >= best && score > 0 ? `New best — ${score}! So proud of you! 🌟` : 'Good run! Let’s beat it together. 💪');
        if (score > best) { setBest(score); try { localStorage.setItem('ken_snake_best', score); } catch (e) {} } return;
      }
      const ate = nx === foodRef.current[0] && ny === foodRef.current[1];
      const ns = [[nx, ny], ...sn]; if (!ate) ns.pop(); setSnake(ns);
      if (ate) { const s2 = score + 1; setScore(s2); setFood(randFood(ns)); setLine(s2 % 5 === 0 ? `${s2}! You’re amazing! 🔥` : ['Yum! 🎉', 'Nice one!', 'Keep going!', 'So good!'][s2 % 4]); }
    }, speed);
    return () => clearInterval(iv);
  }, [state, score, best]);

  React.useEffect(() => { const h = (e) => { const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]; if (m) { e.preventDefault(); setDir(m); } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [state]);

  // swipe
  const g = React.useRef(null);
  const down = (e) => { g.current = { x: e.clientX, y: e.clientY }; };
  const up = (e) => { if (!g.current) return; const dx = e.clientX - g.current.x, dy = e.clientY - g.current.y; g.current = null; if (Math.abs(dx) < 14 && Math.abs(dy) < 14) { if (state === 'ready') start(); return; } if (Math.abs(dx) > Math.abs(dy)) setDir([dx > 0 ? 1 : -1, 0]); else setDir([0, dy > 0 ? 1 : -1]); };

  const mood = state === 'over' ? 'caring' : score >= 5 ? 'proud' : 'happy';
  return (
    <GameShell D={D} title="Snake" color={PH.teal} onBack={onBack}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 18px 24px' }}>
        <div style={{ width: '100%', maxWidth: 340, marginBottom: 12 }}><Companion D={D} KenBody={KenBody} mood={mood} color={PH.teal} line={line} /></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><Stat D={D} label="Score" value={score} color={PH.teal} /><Stat D={D} label="Best" value={best} color={PH.gold} /></div>
        <div onPointerDown={down} onPointerUp={up} style={{ position: 'relative', width: N * CELL, height: N * CELL, borderRadius: 20, background: PH.board, boxShadow: `inset 0 0 0 1.5px ${PH.line}`, overflow: 'hidden', touchAction: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${hexA('#fff', 0.04)} 1px, transparent 1px), linear-gradient(90deg, ${hexA('#fff', 0.04)} 1px, transparent 1px)`, backgroundSize: `${CELL}px ${CELL}px` }} />
          <div style={{ position: 'absolute', left: food[0] * CELL + 2, top: food[1] * CELL + 2, width: CELL - 4, height: CELL - 4, borderRadius: '50%', background: `radial-gradient(circle at 36% 30%, #fff, ${PH.gold})`, boxShadow: `0 0 12px ${hexA(PH.gold, 0.9)}` }} />
          {snake.map((s, i) => (
            <div key={i} style={{ position: 'absolute', left: s[0] * CELL + 1.5, top: s[1] * CELL + 1.5, width: CELL - 3, height: CELL - 3, borderRadius: i === 0 ? 8 : 6, background: i === 0 ? `radial-gradient(circle at 36% 30%, #fff, ${PH.teal})` : hexA(PH.teal, 0.9 - Math.min(i * 0.03, 0.45)), boxShadow: i === 0 ? `0 0 10px ${hexA(PH.teal, 0.8)}` : 'none' }}>
              {i === 0 && <><span style={{ position: 'absolute', top: 4, left: 4, width: 3, height: 3, borderRadius: 9, background: '#16224C' }} /><span style={{ position: 'absolute', top: 4, right: 4, width: 3, height: 3, borderRadius: 9, background: '#16224C' }} /></>}
            </div>
          ))}
          {(state === 'ready' || state === 'over') && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,15,52,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, backdropFilter: 'blur(2px)' }}>
              <div style={{ color: PH.text, fontFamily: D, fontWeight: 700, fontSize: 21 }}>{state === 'over' ? `Score ${score}` : 'Ready?'}</div>
              <KButton color={PH.teal} onClick={start}>{state === 'over' ? 'Play again ✦' : 'Start ✦'}</KButton>
            </div>
          )}
        </div>
        <Hint>👆 Swipe up · down · left · right to steer</Hint>
      </div>
    </GameShell>
  );
}

// ── TETRIS (swipe to move, tap to rotate, swipe down to drop) ─
function TetrisGame({ D, KenBody, onBack }) {
  const COLS = 8, ROWS = 14, CELL = 34;
  const COLORS = { I: PH.teal, O: PH.gold, T: PH.pink, S: PH.green, Z: PH.red, J: PH.blue, L: PH.amber };
  const SHAPES = { I: [[0, 1], [1, 1], [2, 1], [3, 1]], O: [[1, 0], [2, 0], [1, 1], [2, 1]], T: [[1, 0], [0, 1], [1, 1], [2, 1]], S: [[1, 0], [2, 0], [0, 1], [1, 1]], Z: [[0, 0], [1, 0], [1, 1], [2, 1]], J: [[0, 0], [0, 1], [1, 1], [2, 1]], L: [[2, 0], [0, 1], [1, 1], [2, 1]] };
  const KEYS = Object.keys(SHAPES);
  const empty = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const [board, setBoard] = React.useState(empty);
  const [piece, setPiece] = React.useState(null);
  const [score, setScore] = React.useState(0), [lines, setLines] = React.useState(0);
  const [state, setState] = React.useState('ready');
  const [line, setLine] = React.useState('Swipe to slide, tap to spin, swipe down to drop! 🧩');
  const pieceRef = React.useRef(piece), boardRef = React.useRef(board);
  pieceRef.current = piece; boardRef.current = board;

  const collides = (bd, p, dx, dy, cells) => cells.some(([cx, cy]) => { const x = p.x + cx + dx, y = p.y + cy + dy; return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && bd[y][x]); });
  const rotate = (cells) => { const r = cells.map(([x, y]) => [-(y - 1) + 1, (x - 1) + 1]); const mnx = Math.min(...r.map((c) => c[0])), mny = Math.min(...r.map((c) => c[1])); return r.map(([x, y]) => [x - Math.min(0, mnx), y - Math.min(0, mny)]); };
  const spawn = () => { const type = KEYS[Math.floor(Math.random() * KEYS.length)]; const p = { type, cells: SHAPES[type].map((c) => [...c]), x: 2, y: 0 }; if (collides(boardRef.current, p, 0, 0, p.cells)) { setState('over'); setLine(`Great stacking! ${lines} lines. Let’s go again! 💪`); return; } setPiece(p); };
  const start = () => { setBoard(empty()); setScore(0); setLines(0); setState('play'); setLine('Go go go! I’m with you! 🎉'); setTimeout(spawn, 30); };
  const lockClear = (p) => {
    const bd = boardRef.current.map((r) => [...r]);
    p.cells.forEach(([cx, cy]) => { const x = p.x + cx, y = p.y + cy; if (y >= 0) bd[y][x] = COLORS[p.type]; });
    let cl = 0; for (let y = ROWS - 1; y >= 0; y--) { if (bd[y].every((c) => c)) { bd.splice(y, 1); bd.unshift(Array(COLS).fill(null)); cl++; y++; } }
    setBoard(bd);
    if (cl) { setScore((s) => s + [0, 10, 30, 60, 100][cl]); setLines((l) => l + cl); setLine(cl >= 2 ? `WOW! ${cl} lines at once! 🌟` : 'Line clear! Beautiful! 🎉'); }
    setPiece(null); setTimeout(spawn, 20);
  };
  const move = (dx, dy) => { const p = pieceRef.current; if (!p) return false; if (!collides(boardRef.current, p, dx, dy, p.cells)) { setPiece({ ...p, x: p.x + dx, y: p.y + dy }); return true; } if (dy === 1) lockClear(p); return false; };
  const doRotate = () => { const p = pieceRef.current; if (!p) return; const rc = rotate(p.cells); if (!collides(boardRef.current, p, 0, 0, rc)) setPiece({ ...p, cells: rc }); };
  const hardDrop = () => { let p = pieceRef.current; if (!p) return; let dy = 0; while (!collides(boardRef.current, p, 0, dy + 1, p.cells)) dy++; lockClear({ ...p, y: p.y + dy }); };

  React.useEffect(() => { if (state !== 'play') return; const iv = setInterval(() => move(0, 1), Math.max(240, 700 - lines * 24)); return () => clearInterval(iv); }, [state, lines, piece]);
  React.useEffect(() => { const h = (e) => { const k = { ArrowLeft: () => move(-1, 0), ArrowRight: () => move(1, 0), ArrowDown: () => move(0, 1), ArrowUp: doRotate, ' ': hardDrop }[e.key]; if (k) { e.preventDefault(); k(); } }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [state]);

  // gestures: horizontal drag = move columns, tap = rotate, swipe down = hard drop
  const g = React.useRef(null);
  const down = (e) => { if (state !== 'play') return; g.current = { x: e.clientX, y: e.clientY, sx: e.clientX, moved: false }; };
  const moveG = (e) => { const s = g.current; if (!s) return; const dx = e.clientX - s.sx; if (dx > CELL) { move(1, 0); s.sx += CELL; s.moved = true; } else if (dx < -CELL) { move(-1, 0); s.sx -= CELL; s.moved = true; } };
  const up = (e) => { const s = g.current; if (!s) { if (state !== 'play') start(); return; } g.current = null; const dy = e.clientY - s.y, dx = e.clientX - s.x; if (!s.moved) { if (dy > 40 && Math.abs(dy) > Math.abs(dx)) hardDrop(); else doRotate(); } };

  const cells = []; board.forEach((row, y) => row.forEach((c, x) => { if (c) cells.push({ x, y, c }); }));
  if (piece) piece.cells.forEach(([cx, cy]) => { const x = piece.x + cx, y = piece.y + cy; if (y >= 0) cells.push({ x, y, c: COLORS[piece.type] }); });

  return (
    <GameShell D={D} title="Tetris" color={PH.blue} onBack={onBack}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 18px 22px' }}>
        <div style={{ width: '100%', maxWidth: 340, marginBottom: 10 }}><Companion D={D} KenBody={KenBody} mood={state === 'over' ? 'caring' : lines >= 2 ? 'proud' : 'happy'} color={PH.blue} line={line} /></div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}><Stat D={D} label="Score" value={score} color={PH.blue} /><Stat D={D} label="Lines" value={lines} color={PH.teal} /></div>
        <div onPointerDown={down} onPointerMove={moveG} onPointerUp={up} style={{ position: 'relative', width: COLS * CELL, height: ROWS * CELL, borderRadius: 16, background: PH.board, boxShadow: `inset 0 0 0 1.5px ${PH.line}`, overflow: 'hidden', touchAction: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${hexA('#fff', 0.04)} 1px, transparent 1px), linear-gradient(90deg, ${hexA('#fff', 0.04)} 1px, transparent 1px)`, backgroundSize: `${CELL}px ${CELL}px` }} />
          {cells.map((c, i) => (
            <div key={i} style={{ position: 'absolute', left: c.x * CELL + 1, top: c.y * CELL + 1, width: CELL - 2, height: CELL - 2, borderRadius: 6, background: `linear-gradient(150deg, color-mix(in srgb, ${c.c} 82%, white), ${c.c})`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4)` }} />
          ))}
          {(state === 'ready' || state === 'over') && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,15,52,0.76)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ color: PH.text, fontFamily: D, fontWeight: 700, fontSize: 19, textAlign: 'center' }}>{state === 'over' ? `${lines} lines · ${score}` : 'Ready?'}</div>
              <KButton color={PH.blue} onClick={start}>{state === 'over' ? 'Play again ✦' : 'Start ✦'}</KButton>
            </div>
          )}
        </div>
        <Hint>👆 Drag to slide · tap to rotate · swipe ↓ to drop</Hint>
      </div>
    </GameShell>
  );
}

// ── TIC-TAC-TOE (tap to play with friendly Kenshy) ───────────
function TicTacToe({ D, KenBody, onBack }) {
  const [board, setBoard] = React.useState(Array(9).fill(null));
  const [turn, setTurn] = React.useState('X');
  const [status, setStatus] = React.useState('play');
  const [line, setLine] = React.useState('You go first — you’re X. I believe in you! 💜');
  const [hint, setHint] = React.useState(null);
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const winner = (b) => { for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], cells: [a, c, d] }; return null; };
  const winCells = winner(board)?.cells || [];
  const findBest = (b, me) => { const o = me === 'O' ? 'X' : 'O'; for (const L of LINES) { const t = L.map((i) => b[i]); if (t.filter((v) => v === me).length === 2 && t.includes(null)) return L[t.indexOf(null)]; } for (const L of LINES) { const t = L.map((i) => b[i]); if (t.filter((v) => v === o).length === 2 && t.includes(null)) return L[t.indexOf(null)]; } if (b[4] == null) return 4; const cor = [0, 2, 6, 8].filter((i) => b[i] == null); if (cor.length) return cor[Math.floor(Math.random() * cor.length)]; const r = b.map((v, i) => v == null ? i : null).filter((v) => v != null); return r[Math.floor(Math.random() * r.length)]; };
  const kidMove = (i) => { if (status !== 'play' || board[i] || turn !== 'X') return; setHint(null); const b = [...board]; b[i] = 'X'; setBoard(b); if (winner(b)) { setStatus('win-X'); setLine('YOU WIN!! 🎉 I’m SO proud of you!'); return; } if (b.every((v) => v)) { setStatus('draw'); setLine('A tie! Great minds think alike 🤝'); return; } setTurn('O'); setLine('Hmm, my turn… nice move! 👀'); };
  React.useEffect(() => { if (turn !== 'O' || status !== 'play') return; const t = setTimeout(() => { const b = [...board]; const mv = Math.random() < 0.7 ? findBest(b, 'O') : (() => { const r = b.map((v, i) => v == null ? i : null).filter((v) => v != null); return r[Math.floor(Math.random() * r.length)]; })(); b[mv] = 'O'; setBoard(b); if (winner(b)) { setStatus('win-O'); setLine('I got a lucky line! Rematch? 😊'); return; } if (b.every((v) => v)) { setStatus('draw'); setLine('A tie! So close — again? 🤝'); return; } setTurn('X'); setLine('Your turn! Take your time. ✨'); }, 620); return () => clearTimeout(t); }, [turn, status, board]);
  const showHint = () => { if (status !== 'play' || turn !== 'X') return; setHint(findBest(board, 'X')); setLine('Psst… try the glowing square! 👀'); };
  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X'); setStatus('play'); setHint(null); setLine('Fresh game! You’re X — go for it! 💜'); };
  const mood = status === 'win-X' ? 'proud' : 'happy';
  return (
    <GameShell D={D} title="Tic-Tac-Toe" color={PH.pink} onBack={onBack}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 20px 24px' }}>
        <div style={{ width: '100%', maxWidth: 340, marginBottom: 16 }}><Companion D={D} KenBody={KenBody} mood={mood} color={PH.pink} line={line} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 94px)', gridTemplateRows: 'repeat(3, 94px)', gap: 10 }}>
          {board.map((v, i) => { const win = winCells.includes(i); return (
            <button key={i} onClick={() => kidMove(i)} style={{ borderRadius: 20, border: 'none', cursor: v || status !== 'play' ? 'default' : 'pointer', background: win ? hexA(PH.gold, 0.28) : PH.card, boxShadow: hint === i ? `inset 0 0 0 3px ${PH.gold}, 0 0 18px ${hexA(PH.gold, 0.6)}` : `inset 0 0 0 1.5px ${hexA(PH.line, win ? 2.2 : 1)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
              {v === 'X' && <Xmark color={PH.blue} />}{v === 'O' && <Omark color={PH.pink} />}
            </button>
          ); })}
        </div>
        <div style={{ marginTop: 22 }}>{status === 'play' ? <button onClick={showHint} style={{ border: 'none', cursor: 'pointer', fontFamily: D, fontWeight: 600, fontSize: 15, color: PH.text, padding: '11px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', boxShadow: `inset 0 0 0 1.5px ${PH.line}` }}>Need a hint? 👀</button> : <KButton color={PH.pink} onClick={reset}>Play again ✦</KButton>}</div>
        <div style={{ display: 'flex', gap: 20, marginTop: 16, color: PH.muted, fontSize: 12.5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Xmark color={PH.blue} sm /> You</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Omark color={PH.pink} sm /> Kenshy</span>
        </div>
      </div>
    </GameShell>
  );
}
function Xmark({ color, sm }) { const s = sm ? 16 : 46; return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="3.4" strokeLinecap="round"/></svg>; }
function Omark({ color, sm }) { const s = sm ? 16 : 46; return <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.2" stroke={color} strokeWidth="3.4"/></svg>; }

window.ScreenPlay = ScreenPlay;
