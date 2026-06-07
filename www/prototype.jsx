// Mathemagicia — Game shell (HUD + puzzle host) + Main Prototype

const { useState: _uS_p, useEffect: _uE_p, useRef: _uR_p } = React;

class PuzzleErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: false }; }
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(err) { console.error('Puzzle crash:', err); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16 }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:13, color:'#D4AF37', letterSpacing:3, textAlign:'center' }}>
            · Erratum ·
          </div>
          <button onClick={() => this.setState({ error: false })}
            style={{ fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:3, color:'rgba(229,193,88,0.85)',
              background:'transparent', border:'1px solid rgba(212,175,55,0.4)', borderRadius:999, padding:'8px 20px' }}>
            RESET
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function GameShell({ chapterIdx, levelIdx, onBack, onWin, onChapters, lang, paletteAccent, difficulty = 'normal' }) {
  const t = useT(lang);
  const [hint, setHint] = _uS_p(false);
  const [hintText, setHintText] = _uS_p(null);
  const [resetKey, setResetKey] = _uS_p(0);
  const [solved, setSolved] = _uS_p(false);
  const [sumInfo, setSumInfo] = _uS_p(null); // { sum, target } for chapter I

  // Per-chapter puzzle & task copy
  const tasks = {
    ru: [
      'Проведи цепочку через узлы — сумма чисел должна равняться цели.',
      'Расставьте числа так, чтобы сумма по строкам, столбцам и диагоналям равнялась 15.',
      'Раскройте тьму — найдите все безопасные звёзды. Удержите, чтобы отметить опасную.',
      'Закрасьте клетки по подсказкам — проявите скрытый рисунок.',
      'Расставьте числа в узлы звезды — суммы по всем лучам должны совпасть.',
      'Зачеркните числа — без повторов в ряду, зачёркнутые не касаются друг друга.',
    ],
    en: [
      'Draw a chain through the nodes — the sum must equal the target.',
      'Place the numbers so every row, column and diagonal sums to 15.',
      'Unveil the darkness — find all safe stars. Hold to mark a dangerous one.',
      'Fill the cells by the clues — reveal the hidden image.',
      'Place numbers in the star — all line sums must be equal.',
      'Cross out numbers — no repeats in a line, crossed cells must not touch.',
    ],
  };
  const taskText = (tasks[lang] || tasks.ru)[chapterIdx] || (tasks.ru[0]);
  const PuzzleByChapter = [GraphPuzzle, MagicSquarePuzzle, ShapesPuzzle, NonogramPuzzle, MagicStarsPuzzle, HitoriPuzzle];
  const Puzzle = PuzzleByChapter[chapterIdx] || GraphPuzzle;

  const handleWin = () => {
    setSolved(true);
    // onWin вызывается самим WinOverlay при нажатии "Продолжить"
  };

  return (
    <div className="screen night-bg starfield" style={{ position:'relative' }}>
      {/* Particles backdrop */}
      <GoldDust count={12} area={{ w:380, h:800 }} />

      {/* HUD top */}
      <div style={{ position:'absolute', top: 62, left: 0, right: 0, padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:6 }}>
        <HudButton onClick={onBack} label="back"><Icon kind="back" size={18} /></HudButton>

        <div style={{ textAlign:'center' }}>
          <div style={{
            fontFamily:'Cinzel, serif', fontSize:13, letterSpacing:4, color:'#E5C158',
            textTransform:'uppercase',
          }}>{t('chapter')} {['I','II','III','IV','V','VI'][chapterIdx] || 'I'}</div>
          <div style={{
            fontFamily:'Comfortaa, sans-serif', fontSize:10, letterSpacing:5,
            color:'rgba(229,193,88,0.65)', marginTop:3,
          }}>· {t('level').toUpperCase()} {String(levelIdx).padStart(2,'0')} ·</div>
        </div>

        <HudButton onClick={() => setHint(true)} label="hint"><Candle size={20} /></HudButton>
      </div>

      {/* Task ribbon — "ink appearing" reveal */}
      <div style={{ position:'absolute', top: 118, left: 26, right: 26, textAlign:'center', zIndex:5 }}>
        <div key={`task-${chapterIdx}-${resetKey}`}
          className="ink-reveal"
          style={{
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:15,
            color:'#fff3b8', lineHeight:1.3, letterSpacing:0.4,
            textShadow:'0 0 12px rgba(229,193,88,0.45), 0 1px 0 rgba(0,0,0,0.4)',
          }}>«{taskText}»</div>
        <div style={{ width: 56, height: 1, margin:'7px auto 0',
          background:'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          opacity: 0.6 }} />
      </div>

      {/* Sum counter — Chapter I only */}
      {chapterIdx === 0 && sumInfo && (
        <div style={{
          position:'absolute', top: 170, left: 0, right: 0,
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:5, pointerEvents:'none',
        }}>
          <div style={{
            fontFamily:'Cinzel, serif', fontWeight:500,
            fontSize: 20, letterSpacing:4,
            color: sumInfo.sum === sumInfo.target ? '#70FFA0'
                 : sumInfo.sum > sumInfo.target ? '#FF6B6B'
                 : sumInfo.sum > 0 ? '#fff3b8'
                 : 'rgba(229,193,88,0.45)',
            textShadow: sumInfo.sum === sumInfo.target ? '0 0 16px #70FFA0'
                      : sumInfo.sum > 0 ? `0 0 10px ${paletteAccent}` : 'none',
            transition: 'color 0.2s',
          }}>
            {sumInfo.sum} <span style={{ fontSize:13, opacity:0.6 }}>/ {sumInfo.target}</span>
          </div>
        </div>
      )}

      {/* Puzzle field — framed velvet */}
      <div style={{
        position:'absolute', top: 200, left: 18, right: 18, bottom: 130,
        borderRadius: 10,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(15,22,40,0.95) 0%, rgba(8,12,22,1) 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(212,175,55,0.35), inset 0 0 30px rgba(0,0,0,0.6)',
        overflow:'hidden',
      }}>
        {/* Corner flourishes */}
        <div style={{ position:'absolute', top:6, left:6 }}><CornerFlourish size={24} /></div>
        <div style={{ position:'absolute', top:6, right:6 }}><CornerFlourish size={24} rotate={90} /></div>
        <div style={{ position:'absolute', bottom:6, left:6 }}><CornerFlourish size={24} rotate={270} /></div>
        <div style={{ position:'absolute', bottom:6, right:6 }}><CornerFlourish size={24} rotate={180} /></div>

        {/* Inner velvet vignette */}
        <div style={{ position:'absolute', inset:14 }}>
          <PuzzleErrorBoundary key={`${resetKey}-${difficulty}`}>
            <Puzzle key={`${resetKey}-${difficulty}`} onWin={handleWin} paletteAccent={paletteAccent} levelIdx={levelIdx}
              difficulty={difficulty} lang={lang}
              onSumChange={chapterIdx === 0 ? (sum, target) => setSumInfo({ sum, target }) : undefined}
              onHint={chapterIdx === 0 ? (h) => setHintText(h) : undefined} />
          </PuzzleErrorBoundary>
        </div>
      </div>

      {/* Bottom — reset button */}
      <div style={{ position:'absolute', bottom: 60, left: 0, right: 0, display:'flex', flexDirection:'column', alignItems:'center', gap:10, zIndex:6 }}>
        <button className="btn-reset" onClick={() => { setResetKey(k => k + 1); setSumInfo(null); }} style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 22px', borderRadius:999,
          background:'transparent',
          border:'1px solid rgba(212,175,55,0.4)',
          color:'rgba(229,193,88,0.85)',
          fontFamily:'Cinzel, serif', letterSpacing:3, fontSize:11,
          textTransform:'uppercase',
        }}>
          <Icon kind="refresh" size={14} color="rgba(229,193,88,0.85)" />
          {t('reset')}
        </button>
      </div>

      {hint && chapterIdx === 0 && <HintModal onClose={() => setHint(false)} lang={lang} paletteAccent={paletteAccent} hintText={hintText} />}
      {hint && chapterIdx > 0 && <ChapterInfoModal onClose={() => setHint(false)} lang={lang} paletteAccent={paletteAccent}
        chapterIdx={chapterIdx} />}
      {solved && <WinOverlay
        onContinue={onWin}
        onChapters={onChapters}
        lang={lang} paletteAccent={paletteAccent}
        levelIdx={levelIdx}
      />}
    </div>
  );
}

// ─────────────────────────── PROTOTYPE — orchestrates screens
function Prototype({ initialScreen = 'loading', initialChapter = 0, initialLevel = 1, variant = 'night', paletteAccentOverride, scale = 1 }) {
  const [screen, setScreen] = _uS_p(initialScreen);
  const [chapter, setChapter] = _uS_p(initialChapter);
  const [lang, setLang] = _uS_p(() => localStorage.getItem('mathgame_lang') || 'en');
  const setLangPersist = (l) => { localStorage.setItem('mathgame_lang', l); setLang(l); };
  const [paletteAccent, setPaletteAccent] = _uS_p(paletteAccentOverride || '#4DEEEA');
  const [theme, setTheme] = _uS_p(variant);
  // Счётчик пройденных уровней по каждой главе (0 = не начата)
  const [chapterLevels, setChapterLevels] = _uS_p([0, 0, 0, 0, 0, 0]);
  const [difficulty, setDifficulty] = _uS_p('normal');
  // Тёмная накладка поверх всего — независима от смены экрана
  const [coverBlack, setCoverBlack] = _uS_p(false);

  _uE_p(() => { if (paletteAccentOverride) setPaletteAccent(paletteAccentOverride); }, [paletteAccentOverride]);

  // Переход между экранами: мгновенно накрываем, меняем экран, плавно открываем
  const goTo = (nextScreen, extraFn) => {
    setCoverBlack(true);
    setTimeout(() => {
      extraFn && extraFn();
      setScreen(nextScreen);
      setTimeout(() => setCoverBlack(false), 50);
    }, 16);
  };

  // Инкремент уровня
  const incrementLevel = (ci) => {
    setChapterLevels(prev => {
      const next = [...prev];
      next[ci] = (next[ci] || 0) + 1;
      return next;
    });
  };

  // Победа → следующий уровень: накрываем экран, меняем уровень (новый key → новый GameShell), снимаем накрытие
  const handleWinContinue = (ci) => {
    setCoverBlack(true);
    // Дать React один кадр чтобы применить coverBlack, затем менять уровень
    setTimeout(() => {
      incrementLevel(ci);
      // Ещё один кадр чтобы новый GameShell смонтировался — потом плавно снимаем накрытие
      setTimeout(() => setCoverBlack(false), 50);
    }, 16);
  };

  // Победа → выбор главы
  const handleWinChapters = (ci) => {
    incrementLevel(ci);
    goTo('chapters');
  };

  let body;
  if (screen === 'loading') {
    body = <LoadingScreen onDone={() => setScreen('cover')} lang={lang} paletteAccent={paletteAccent} />;
  } else if (screen === 'cover') {
    body = <CoverScreen onOpen={() => setScreen('chapters')} onSettings={() => setScreen('settings')}
      lang={lang} setLang={setLangPersist} paletteAccent={paletteAccent} />;
  } else if (screen === 'chapters') {
    body = <ChapterSelect onBack={() => setScreen('cover')}
      onPickLevel={(c, _lvl, diff) => { setChapter(c); if (diff) setDifficulty(diff); setScreen('game'); }}
      lang={lang} paletteAccent={paletteAccent} chapterLevels={chapterLevels}
      initialChapterIdx={chapter} />;
  } else if (screen === 'game') {
    const lvl = chapterLevels[chapter] + 1;
    body = <GameShell key={`${chapter}-${lvl}`} chapterIdx={chapter} levelIdx={lvl}
      onBack={() => goTo('chapters')}
      onWin={() => handleWinContinue(chapter)}
      onChapters={() => handleWinChapters(chapter)}
      lang={lang} paletteAccent={paletteAccent} difficulty={difficulty} />;
  } else if (screen === 'settings') {
    body = <SettingsScreen onBack={() => setScreen('cover')}
      lang={lang} setLang={setLangPersist}
      paletteAccent={paletteAccent} setPaletteAccent={setPaletteAccent}
      theme={theme} setTheme={setTheme} />;
  }

  return (
    <div style={{ width:'100%', height:'100%', position:'relative' }}>
      {body}
      {/* Тёмная накладка для мгновенного сокрытия содержимого при переходах */}
      <div style={{
        position:'absolute', inset:0, background:'#060912', zIndex:100,
        pointerEvents: coverBlack ? 'auto' : 'none',
        opacity: coverBlack ? 1 : 0,
        transition: coverBlack ? 'none' : 'opacity 0.3s ease-out',
      }} />
    </div>
  );
}

function ScreenNav({ screen, setScreen }) {
  const items = [
    { id: 'loading',   label: 'Load' },
    { id: 'cover',     label: 'Cover' },
    { id: 'chapters',  label: 'Chap.' },
    { id: 'game',      label: 'Game' },
    { id: 'hint',      label: 'Hint' },
    { id: 'win',       label: 'Win' },
    { id: 'settings',  label: 'Set.' },
  ];
  const [open, setOpen] = _uS_p(false);
  return (
    <div style={{ position:'absolute', bottom: 12, left: '50%', transform:'translateX(-50%)', zIndex:100, pointerEvents:'auto' }}>
      {open && (
        <div style={{
          position:'absolute', bottom: 36, left: '50%', transform:'translateX(-50%)',
          display:'flex', gap:4, padding:'9px 6px', borderRadius:30,
          background:'rgba(11,16,29,0.85)', backdropFilter:'blur(8px)',
          border:'1px solid rgba(212,175,55,0.3)',
          whiteSpace:'nowrap',
        }}>
          {items.map(i => (
            <button key={i.id} className="btn-reset" onClick={() => { setScreen(i.id); setOpen(false); }} style={{
              padding:'11px 10px', borderRadius:20,
              background: screen === i.id ? 'rgba(229,193,88,0.18)' : 'transparent',
              color: screen === i.id ? '#fff3b8' : 'rgba(229,193,88,0.7)',
              fontFamily:'Comfortaa, sans-serif', fontSize:10, letterSpacing:1.2, textTransform:'uppercase',
            }}>{i.label}</button>
          ))}
        </div>
      )}
      <button className="btn-reset" onClick={() => setOpen(o => !o)} style={{
        width: 30, height: 30, borderRadius:30,
        background:'rgba(11,16,29,0.75)',
        border:'1px solid rgba(212,175,55,0.35)',
        color:'rgba(229,193,88,0.7)',
        fontFamily:'Comfortaa, sans-serif', fontSize:10,
      }} title="Jump to screen">⋯</button>
    </div>
  );
}

Object.assign(window, { GameShell, Prototype, ScreenNav });
