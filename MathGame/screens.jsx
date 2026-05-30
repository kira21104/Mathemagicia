// Mathemagicia — non-game screens (cover, chapters, win, hint, settings)

const { useState: _uS_s, useEffect: _uE_s, useRef: _uR_s, useMemo: _uM_s } = React;

// ─────────────────────────── COVER (Main menu)
function CoverScreen({ onOpen, onSettings, lang, setLang, paletteAccent }) {
  const t = useT(lang);
  return (
    <div className="screen night-bg starfield" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'70px 28px 50px' }}>
      <GoldDust count={30} area={{ w: 380, h: 800 }} />

      {/* Top — chapter pill */}
      <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', gap:10, marginTop: 20 }}>
        <div style={{
          fontFamily:'Comfortaa, sans-serif', fontSize:10, letterSpacing:5,
          color: '#D4AF37', opacity:0.7, textTransform:'uppercase'
        }}>·  MMXXVI  ·</div>
      </div>

      {/* Book cover */}
      <div style={{ position:'relative', zIndex:2, width: 240, height: 340 }}>
        {/* Astrolabe glow behind */}
        <div style={{ position:'absolute', inset:'-50px -60px', display:'flex', alignItems:'center', justifyContent:'center', filter:'blur(0.2px)' }}>
          <Astrolabe size={340} color="#D4AF37" strokeOp={0.32} spin={true} />
        </div>

        {/* Book cover */}
        <div style={{
          position:'relative', width:'100%', height:'100%',
          background: 'linear-gradient(135deg, #2a1a0c 0%, #1a1006 55%, #0d0804 100%)',
          borderRadius: 6,
          boxShadow: '0 30px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.2), inset 0 0 30px rgba(0,0,0,0.4), inset 0 0 0 6px #1a1006',
          padding: 14,
          overflow:'hidden',
        }}>
          {/* Leather grain via repeating gradient */}
          <div style={{ position:'absolute', inset:0, background:
            'repeating-linear-gradient(45deg, rgba(255,255,255,0.018) 0 2px, transparent 2px 7px), repeating-linear-gradient(-30deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 5px)',
            mixBlendMode:'overlay' }} />

          {/* Engraved inner frame */}
          <div className="gold-double" style={{
            position:'absolute', inset:14, borderRadius:3,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between',
            padding:'24px 16px',
          }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <CornerFlourish size={28} />
              <div style={{ fontFamily:'Cinzel, serif', fontSize:8, letterSpacing:6, color:'#8a6f1f' }}>LIBER · I</div>
            </div>

            {/* Title */}
            <div style={{ textAlign:'center' }}>
              <div className="gold-shimmer" style={{
                fontFamily:'Cinzel, serif', fontWeight:700, fontSize:24,
                letterSpacing:1, lineHeight:1.05, textTransform:'uppercase',
              }}>Mathe<br/>magicia</div>
              <div style={{ height: 1, width: 80, margin:'12px auto', background:'#8a6f1f', opacity:0.8 }} />
              <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:11, color:'#D4AF37', opacity:0.85, lineHeight:1.3, padding:'0 6px' }}>
                {t('subtitle')}
              </div>
            </div>

            {/* Alchemical sigil */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <svg width="56" height="56" viewBox="0 0 60 60" stroke="#D4AF37" strokeOpacity="0.85" fill="none">
                <circle cx="30" cy="30" r="22" strokeWidth="0.6" />
                <circle cx="30" cy="30" r="14" strokeWidth="0.6" />
                <polygon points="30,12 47,40 13,40" strokeWidth="0.8" />
                <polygon points="30,48 13,20 47,20" strokeWidth="0.8" opacity="0.7" />
                <circle cx="30" cy="30" r="2.5" fill="#D4AF37" />
              </svg>
              <CornerFlourish size={28} rotate={180} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:24, width:'100%' }}>
        <button className="btn-reset" onClick={onOpen} style={{
          padding:'14px 56px', borderRadius:999,
          background:'transparent',
          border:'1px solid rgba(212,175,55,0.6)',
          fontFamily:'Cinzel, serif', fontWeight:500, letterSpacing:6,
          fontSize:14, color:'#E5C158',
          boxShadow:'inset 0 0 18px rgba(212,175,55,0.12), 0 0 28px rgba(212,175,55,0.18)',
          textTransform:'uppercase',
        }}>{t('open')}</button>

        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <HudButton onClick={onSettings} label="settings"><Icon kind="settings" size={20} /></HudButton>
          <button className="btn-reset" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            style={{
              width: 44, height: 44, borderRadius: 999, color:'#E5C158',
              background:'radial-gradient(circle at 30% 30%, rgba(229,193,88,0.16), rgba(11,16,29,0.6) 70%)',
              border:'1px solid rgba(212,175,55,0.45)',
              fontFamily:'Cinzel, serif', fontWeight:500, fontSize:11, letterSpacing:1.5,
            }} aria-label="language">{lang === 'ru' ? 'EN' : 'RU'}</button>
          <HudButton onClick={() => {}} label="sound"><Icon kind="sound" size={20} /></HudButton>
        </div>
      </div>
    </div>
  );
}

// ── Получить данные созвездия по глобальному индексу
// Каждая глава смещается на четверть базы, чтобы не повторяться
function getConstellationData(pageIdx, chapterIdx = 0) {
  const db = window.CONSTELLATIONS_DB;
  if (!db || !db.length) return { pts: [{x:80,y:120,r:2.8}], lines: [], ru: '?' };
  const total = db.length;
  const offset = Math.floor((chapterIdx / 6) * total);
  const c = db[(offset + pageIdx) % total];
  // Масштабируем координаты в viewBox 160×240 с отступом
  const xs = c.stars.map(s => s.x), ys = c.stars.map(s => s.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeX = maxX - minX || 1, rangeY = maxY - minY || 1;
  const pad = 26;
  const pts = c.stars.map(s => ({
    x: Math.round(pad + (s.x - minX) / rangeX * (160 - pad * 2)),
    y: Math.round(pad + (s.y - minY) / rangeY * (240 - pad * 2)),
    r: s.r || 2.8,
  }));
  return { pts, lines: c.lines || [], ru: c.ru, en: c.en, la: c.la };
}

function getPagePoints(pageIdx, chapterIdx = 0) {
  return getConstellationData(pageIdx, chapterIdx).pts;
}

// ─────────────────────────── CHAPTERS — book spread
function ChapterSelect({ onBack, onPickLevel, lang, paletteAccent, chapterLevels = [0,0,0,0,0,0], initialChapterIdx = 0 }) {
  const t = useT(lang);
  const [chapterIdx, setChapterIdx] = _uS_s(initialChapterIdx);
  const [skyOpen, setSkyOpen] = _uS_s(false);
  const chapters = STRINGS[lang].chapters;
  const chapterSubs = STRINGS[lang].chapterSub;

  // Гравюры (левая страница) — по одной на главу
  const constellations = [
    [{x:60,y:50,r:3},{x:120,y:90,r:2.4},{x:140,y:140,r:3},{x:80,y:170,r:2.4},{x:100,y:230,r:2.4},{x:50,y:190,r:2.6}],
    [{x:50,y:55,r:2.6},{x:110,y:55,r:2.6},{x:80,y:100,r:3.2},{x:50,y:155,r:2.6},{x:110,y:155,r:2.6},{x:80,y:210,r:2.8}],
    [{x:80,y:35,r:3},{x:35,y:115,r:2.4},{x:125,y:115,r:2.4},{x:60,y:200,r:3},{x:100,y:200,r:2.6},{x:80,y:130,r:3.2}],
    [{x:45,y:65,r:2.4},{x:90,y:40,r:2.8},{x:135,y:80,r:3},{x:120,y:145,r:2.6},{x:65,y:155,r:3.2},{x:50,y:205,r:2.4}],
    [{x:80,y:40,r:3.2},{x:130,y:90,r:2.4},{x:110,y:155,r:2.8},{x:50,y:155,r:2.8},{x:30,y:90,r:2.4},{x:80,y:120,r:2}],
    [{x:50,y:50,r:2.6},{x:110,y:50,r:2.6},{x:110,y:110,r:2.6},{x:50,y:110,r:2.6},{x:80,y:170,r:3},{x:80,y:220,r:2.4}],
  ];

  // Engraving per chapter — different visual
  const engravings = [
    <svg viewBox="0 0 200 240" key="0">
      <g stroke="#5b4a2a" strokeWidth="0.6" fill="none" strokeLinecap="round">
        <line x1="100" y1="220" x2="100" y2="120" /><line x1="100" y1="160" x2="50" y2="200" />
        <line x1="100" y1="140" x2="160" y2="180" /><line x1="100" y1="120" x2="60" y2="80" />
        <line x1="100" y1="120" x2="140" y2="60" /><line x1="140" y1="60" x2="170" y2="40" />
        <line x1="60" y1="80" x2="30" y2="60" />
        {[[100,220],[100,120],[50,200],[160,180],[60,80],[140,60],[170,40],[30,60]].map(([cx,cy],i)=>
          <circle key={i} cx={cx} cy={cy} r={i===0?4:i>5?2.5:3} fill="#5b4a2a" />)}
      </g>
    </svg>,
    <svg viewBox="0 0 200 240" key="1">
      <g stroke="#5b4a2a" strokeWidth="0.7" fill="none">
        <rect x="50" y="60" width="100" height="100" />
        <line x1="50" y1="93" x2="150" y2="93" /><line x1="50" y1="127" x2="150" y2="127" />
        <line x1="83" y1="60" x2="83" y2="160" /><line x1="117" y1="60" x2="117" y2="160" />
        {[[4,9,2],[3,5,7],[8,1,6]].map((r,ri)=>r.map((v,ci)=>(
          <text key={`${ri}-${ci}`} x={66+ci*34} y={84+ri*34} textAnchor="middle"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="20" fill="#5b4a2a">{v}</text>
        )))}
        <circle cx="100" cy="200" r="14" /><polygon points="100,189 109,206 91,206" />
      </g>
    </svg>,
    <svg viewBox="0 0 200 240" key="2">
      <g stroke="#5b4a2a" strokeWidth="0.7" fill="none">
        <circle cx="80" cy="130" r="50" /><circle cx="120" cy="130" r="50" /><circle cx="100" cy="90" r="50" />
        <polygon points="100,80 130,160 70,160" strokeWidth="0.5" />
        <line x1="40" y1="200" x2="160" y2="200" strokeWidth="0.4" />
      </g>
    </svg>,
    <svg viewBox="0 0 200 240" key="3">
      <g stroke="#5b4a2a" strokeWidth="0.6" fill="none">
        <line x1="40" y1="60" x2="80" y2="100" /><line x1="80" y1="100" x2="140" y2="70" />
        <line x1="140" y1="70" x2="170" y2="130" /><line x1="170" y1="130" x2="110" y2="170" />
        <line x1="110" y1="170" x2="60" y2="190" /><line x1="60" y1="190" x2="80" y2="100" />
        {[[40,60],[80,100],[140,70],[170,130],[110,170],[60,190]].map(([x,y],i)=>
          <circle key={i} cx={x} cy={y} r="3" fill="#5b4a2a" />)}
      </g>
    </svg>,
    <svg viewBox="0 0 200 240" key="4">
      <g stroke="#5b4a2a" strokeWidth="0.7" fill="none">
        {Array.from({length:5}).map((_,i)=><line key={`h${i}`} x1="30" y1={60+i*30} x2="170" y2={60+i*30} strokeWidth="0.4"/>)}
        {Array.from({length:5}).map((_,i)=><line key={`v${i}`} x1={30+i*35} y1="60" x2={30+i*35} y2="180" strokeWidth="0.4"/>)}
        {[[0,0],[1,2],[2,1],[3,3],[4,0],[1,4],[3,1],[0,3],[2,3],[4,2]].map(([c,r],i)=>
          <rect key={i} x={31+c*35} y={61+r*30} width={34} height={29} fill="#5b4a2a" opacity="0.35"/>)}
        <polygon points="100,195 115,215 85,215" fill="#5b4a2a" opacity="0.5"/>
      </g>
    </svg>,
    <svg viewBox="0 0 200 240" key="5">
      <g stroke="#5b4a2a" strokeWidth="0.7" fill="none">
        <polygon points="100,30 170,120 140,210 60,210 30,120" />
        <line x1="100" y1="30" x2="100" y2="210" strokeWidth="0.4"/><line x1="30" y1="120" x2="170" y2="120" strokeWidth="0.4"/>
        <line x1="170" y1="120" x2="60" y2="210" strokeWidth="0.4"/><line x1="30" y1="120" x2="140" y2="210" strokeWidth="0.4"/>
        {[[100,30],[170,120],[140,210],[60,210],[30,120]].map(([x,y],i)=>
          <circle key={i} cx={x} cy={y} r="4" fill="#5b4a2a"/>)}
        {[[100,93],[69,117],[81,152],[119,152],[131,117]].map(([x,y],i)=>
          <circle key={i} cx={x} cy={y} r="2.5" fill="#5b4a2a" opacity="0.6"/>)}
      </g>
    </svg>,
  ];

  const [difficulty, setDifficulty] = _uS_s('normal');
  const DIFF_LABELS = { ru: { easy:'Легко', normal:'Нормально', hard:'Сложно' }, en: { easy:'Easy', normal:'Normal', hard:'Hard' } };
  const diffLabels = DIFF_LABELS[lang] || DIFF_LABELS.ru;

  const LEVELS_PER_PAGE = 6;
  const doneLevels = chapterLevels[chapterIdx] || 0;
  const nextLevel = doneLevels + 1;

  // Страница: 0 = уровни 1–6, 1 = 7–12, …
  // Показываем страницу с текущим активным уровнем
  const [levelPage, setLevelPage] = _uS_s(() => Math.floor(Math.max(doneLevels - 1, 0) / LEVELS_PER_PAGE));
  // При смене главы сбрасываем страницу
  _uE_s(() => {
    setLevelPage(Math.floor(Math.max((chapterLevels[chapterIdx] || 0) - 1, 0) / LEVELS_PER_PAGE));
  }, [chapterIdx]);

  const pageOffset = levelPage * LEVELS_PER_PAGE; // глобальный номер первого уровня на странице
  const pageConstellation = getConstellationData(levelPage, chapterIdx);
  const pagePoints = pageConstellation.pts;

  // Сколько полных страниц уже открыто (хотя бы 1 уровень пройден)
  const totalPages = Math.max(Math.ceil(nextLevel / LEVELS_PER_PAGE), 1);

  return (
    <div className="screen paper-dark" style={{ position:'relative' }}>
      <GoldDust count={14} area={{ w:380, h:800 }} />

      {/* HUD */}
      <div style={{ position:'absolute', top:62, left:0, right:0, padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:5 }}>
        <HudButton onClick={onBack} label="back"><Icon kind="back" size={18} /></HudButton>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:13, letterSpacing:5, color:'#D4AF37' }}>{t('chooseTitle').toUpperCase()}</div>
          <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:13, color:'rgba(212,175,55,0.7)', marginTop:2 }}>{chapterSubs[chapterIdx]}</div>
        </div>
        <HudButton onClick={() => setSkyOpen(true)} label="sky"><Icon kind="star" size={18} /></HudButton>
      </div>

      {/* Book spread */}
      <div style={{ position:'absolute', top: 140, left: 16, right: 16, bottom: 175, display:'flex' }}>
        {/* Left page — engraving */}
        <div style={{ flex:1, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'18px 8px' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(212,175,55,0.04), transparent 60%)', borderRadius:4 }} />
          <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:4, color:'rgba(212,175,55,0.7)', position:'relative' }}>
            {['I','II','III','IV','V','VI'][chapterIdx] || 'I'}
          </div>
          <div style={{ width:'100%', flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            {React.cloneElement(engravings[chapterIdx], { width:'100%', height:'auto', style:{ opacity:0.85, filter:'drop-shadow(0 0 6px rgba(212,175,55,0.18))' } })}
          </div>
          <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:12, color:'rgba(212,175,55,0.7)', textAlign:'center', maxWidth:160, lineHeight:1.3 }}>
            {chapters[chapterIdx]}
          </div>
        </div>

        {/* Book spine */}
        <div style={{ width:1, background:'linear-gradient(180deg, transparent, rgba(212,175,55,0.4) 20%, rgba(212,175,55,0.4) 80%, transparent)' }} />

        {/* Right page — level constellation */}
        <div style={{ flex:1, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'18px 8px' }}>

          {/* Декоративный фон страницы — уникальный для каждой главы */}
          {[
            // Глава 0 — Граф связей: узлы и рёбра, числа 1–9
            <svg key="bg0" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {/* Звёзды */}
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#E5C158" opacity={i%4===0?0.28:0.16} />
              ))}
              {/* Граф-паутина на фоне */}
              <g stroke="#D4AF37" strokeWidth="0.5" opacity="0.12">
                <line x1="30" y1="80" x2="80" y2="50" /><line x1="80" y1="50" x2="140" y2="70" />
                <line x1="140" y1="70" x2="130" y2="140" /><line x1="130" y1="140" x2="60" y2="160" />
                <line x1="60" y1="160" x2="30" y2="80" /><line x1="80" y1="50" x2="130" y2="140" />
                <line x1="20" y1="200" x2="70" y2="230" /><line x1="70" y1="230" x2="140" y2="210" />
                <line x1="140" y1="210" x2="110" y2="280" /><line x1="20" y1="200" x2="110" y2="280" />
                <circle cx="30" cy="80" r="3" fill="none" /><circle cx="80" cy="50" r="3" fill="none" />
                <circle cx="140" cy="70" r="3" fill="none" /><circle cx="130" cy="140" r="3" fill="none" />
                <circle cx="60" cy="160" r="3" fill="none" /><circle cx="20" cy="200" r="3" fill="none" />
                <circle cx="70" cy="230" r="3" fill="none" /><circle cx="140" cy="210" r="3" fill="none" />
                <circle cx="110" cy="280" r="3" fill="none" />
              </g>
              {/* Числа */}
              {[['3',22,65],['7',138,95],['5',55,195],['+',148,250],['2',18,285],['9',105,315]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="22"
                  fill="#D4AF37" opacity="0.13" style={{userSelect:'none'}}>{v}</text>
              ))}
            </svg>,

            // Глава 1 — Магический квадрат: сетка и числа 1–9
            <svg key="bg1" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#E5C158" opacity={i%4===0?0.28:0.16} />
              ))}
              {/* Сетка магического квадрата */}
              <g stroke="#D4AF37" strokeWidth="0.5" opacity="0.14">
                <rect x="20" y="55" width="75" height="75" />
                <line x1="20" y1="80" x2="95" y2="80" /><line x1="20" y1="105" x2="95" y2="105" />
                <line x1="45" y1="55" x2="45" y2="130" /><line x1="70" y1="55" x2="70" y2="130" />
              </g>
              {/* Числа в ячейках */}
              {[[32,76,'4'],[57,76,'9'],[82,76,'2'],[32,101,'3'],[57,101,'5'],[82,101,'7'],[32,126,'8'],[57,126,'1'],[82,126,'6']].map(([x,y,v],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic"
                  fontSize="17" fill="#D4AF37" opacity="0.15" style={{userSelect:'none'}}>{v}</text>
              ))}
              {/* Вторая сетка — меньше, внизу */}
              <g stroke="#D4AF37" strokeWidth="0.4" opacity="0.09">
                <rect x="70" y="200" width="60" height="60" />
                <line x1="70" y1="220" x2="130" y2="220" /><line x1="70" y1="240" x2="130" y2="240" />
                <line x1="90" y1="200" x2="90" y2="260" /><line x1="110" y1="200" x2="110" y2="260" />
              </g>
              {[['=',18,230],['15',148,175],['∑',22,295],['15',130,310]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="20"
                  fill="#D4AF37" opacity="0.12" style={{userSelect:'none'}}>{v}</text>
              ))}
            </svg>,

            // Глава 2 — Геометрия: фигуры
            <svg key="bg2" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#E5C158" opacity={i%4===0?0.28:0.16} />
              ))}
              <g stroke="#D4AF37" strokeWidth="0.55" fill="none" opacity="0.13">
                <circle cx="110" cy="80" r="32" />
                <circle cx="50" cy="80" r="32" />
                <polygon points="80,28 130,115 30,115" />
              </g>
              <g stroke="#D4AF37" strokeWidth="0.45" fill="none" opacity="0.10">
                <rect x="18" y="175" width="50" height="50" />
                <circle cx="125" cy="200" r="25" />
                <polygon points="80,260 110,310 50,310" />
              </g>
              {[['△',148,155],['○',14,145],['□',148,285],['◇',20,310]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="20"
                  fill="#D4AF37" opacity="0.12" style={{userSelect:'none'}}>{v}</text>
              ))}
            </svg>,

            // Глава 3 — Созвездия: звёздное небо, линии, точки крупнее
            <svg key="bg3" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.4:0.9} fill="#E5C158" opacity={i%4===0?0.32:0.18} />
              ))}
              <g stroke="#D4AF37" strokeWidth="0.5" opacity="0.13">
                <line x1="25" y1="60" x2="65" y2="90" /><line x1="65" y1="90" x2="120" y2="65" />
                <line x1="120" y1="65" x2="148" y2="130" /><line x1="148" y1="130" x2="95" y2="170" />
                <line x1="95" y1="170" x2="40" y2="155" /><line x1="40" y1="155" x2="25" y2="60" />
              </g>
              <g stroke="#D4AF37" strokeWidth="0.4" opacity="0.10">
                <line x1="30" y1="220" x2="75" y2="250" /><line x1="75" y1="250" x2="130" y2="230" />
                <line x1="130" y1="230" x2="145" y2="285" /><line x1="145" y1="285" x2="80" y2="305" />
                <line x1="80" y1="305" x2="30" y2="280" />
              </g>
              {[[25,60],[65,90],[120,65],[148,130],[95,170],[40,155],[30,220],[75,250],[130,230],[145,285],[80,305],[30,280]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="1.8" fill="#E5C158" opacity="0.22" />
              ))}
              {[['★',15,195],['✦',150,175],['★',95,310]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="16"
                  fill="#E5C158" opacity="0.15" style={{userSelect:'none'}}>{v}</text>
              ))}
            </svg>,

            // Глава 4 — Магические звёзды: пятиконечная звезда с числами
            <svg key="bg4" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#E5C158" opacity={i%4===0?0.28:0.16} />
              ))}
              {/* Пятиконечная звезда */}
              <g stroke="#D4AF37" strokeWidth="0.55" fill="none" opacity="0.13" transform="translate(80,110)">
                <polygon points="0,-58 17,-18 60,-18 26,10 38,52 0,26 -38,52 -26,10 -60,-18 -17,-18" />
                <circle cx="0" cy="-58" r="4" fill="#D4AF37" opacity="0.3"/>
                <circle cx="60" cy="-18" r="4" fill="#D4AF37" opacity="0.3"/>
                <circle cx="38" cy="52" r="4" fill="#D4AF37" opacity="0.3"/>
                <circle cx="-38" cy="52" r="4" fill="#D4AF37" opacity="0.3"/>
                <circle cx="-60" cy="-18" r="4" fill="#D4AF37" opacity="0.3"/>
              </g>
              <g stroke="#D4AF37" strokeWidth="0.4" fill="none" opacity="0.09" transform="translate(80,230) scale(0.65)">
                <polygon points="0,-58 17,-18 60,-18 26,10 38,52 0,26 -38,52 -26,10 -60,-18 -17,-18" />
              </g>
              {[['✦',14,180],['✦',148,185],['✦',80,310]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="14"
                  fill="#D4AF37" opacity="0.12" style={{userSelect:'none'}}>{v}</text>
              ))}
            </svg>,

            // Глава 5 — Хитори: клетки с числами, зачёркнутые
            <svg key="bg5" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}
              viewBox="0 0 160 320" preserveAspectRatio="xMidYMid slice">
              {[[14,22],[90,12],[148,30],[28,58],[122,50],[68,40],[154,78],[10,96],[104,88],[48,120],[138,112],[24,150],[155,148],[78,168],[112,185],[36,210],[150,215],[16,242],[98,234],[132,255],[52,272],[158,268],[82,298],[18,310],[148,302]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%3===0?1.2:0.8} fill="#E5C158" opacity={i%4===0?0.28:0.16} />
              ))}
              {/* Сетка хитори */}
              <g stroke="#D4AF37" strokeWidth="0.45" fill="none" opacity="0.12">
                <rect x="18" y="50" width="124" height="100" />
                {[0,1,2,3].map(i=><line key={`h${i}`} x1="18" y1={75+i*25} x2="142" y2={75+i*25} strokeWidth="0.3"/>)}
                {[0,1,2,3,4].map(i=><line key={`v${i}`} x1={18+i*25} y1="50" x2={18+i*25} y2="150" strokeWidth="0.3"/>)}
              </g>
              {/* Зачёркнутые клетки */}
              {[[19,51],[69,101],[119,51],[44,126]].map(([x,y],i)=>(
                <g key={i} opacity="0.18">
                  <rect x={x} y={y} width="24" height="24" fill="#D4AF37"/>
                  <line x1={x+3} y1={y+3} x2={x+21} y2={y+21} stroke="#000" strokeWidth="1"/>
                  <line x1={x+21} y1={y+3} x2={x+3} y2={y+21} stroke="#000" strokeWidth="1"/>
                </g>
              ))}
              {/* Числа */}
              {[['3',30,70],['2',55,70],['1',80,70],['3',105,70],['2',130,70],
                ['1',30,95],['3',55,95],['2',80,95],['1',105,95],['4',130,95]].map(([v,x,y],i)=>(
                <text key={i} x={x} y={y} textAnchor="middle" fontFamily="Cinzel, serif" fontSize="13"
                  fill="#D4AF37" opacity="0.13" style={{userSelect:'none'}}>{v}</text>
              ))}
              <g stroke="#D4AF37" strokeWidth="0.4" opacity="0.09">
                <rect x="30" y="190" width="100" height="80" />
                {[0,1,2,3].map(i=><line key={`h2${i}`} x1="30" y1={210+i*20} x2="130" y2={210+i*20} strokeWidth="0.3"/>)}
                {[0,1,2,3,4].map(i=><line key={`v2${i}`} x1={30+i*25} y1="190" x2={30+i*25} y2="270" strokeWidth="0.3"/>)}
              </g>
            </svg>,
          ][chapterIdx] || null}

          <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:4, color:'rgba(212,175,55,0.7)', position:'relative' }}>{t('levels').toUpperCase()}</div>

          {/* Пагинация страниц созвездий */}
          {totalPages > 1 && (
            <div style={{ display:'flex', alignItems:'center', gap:6, position:'absolute', top:14, right:6 }}>
              <button className="btn-reset" onClick={e => { e.stopPropagation(); setLevelPage(p => Math.max(0, p-1)); }}
                style={{ color: levelPage === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.7)', lineHeight:1, fontSize:14 }}>‹</button>
              <span style={{ fontFamily:'Comfortaa, sans-serif', fontSize:7, color:'rgba(212,175,55,0.5)' }}>{levelPage+1}/{totalPages}</span>
              <button className="btn-reset" onClick={e => { e.stopPropagation(); setLevelPage(p => Math.min(totalPages-1, p+1)); }}
                style={{ color: levelPage >= totalPages-1 ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.7)', lineHeight:1, fontSize:14 }}>›</button>
            </div>
          )}

          <div style={{ position:'relative', width:'100%', flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg viewBox="0 0 160 240" width="100%" height="100%" style={{ overflow:'visible' }}>
              {/* Реальные линии созвездия */}
              <g stroke="rgba(212,175,55,0.18)" strokeWidth="0.8">
                {(pageConstellation.lines || []).map(([a, b], i) => {
                  const A = pagePoints[a], B = pagePoints[b];
                  if (!A || !B) return null;
                  return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />;
                })}
              </g>
              {pagePoints.map((p, i) => {
                const globalIdx = pageOffset + i;  // 0-based
                const levelNum = globalIdx + 1;
                const isDone = globalIdx < doneLevels;
                const isCurrent = globalIdx === doneLevels;
                const isLocked = globalIdx > doneLevels;
                return (
                  <g key={i} style={{ cursor: !isLocked ? 'pointer' : 'default' }}
                    onClick={e => { e.stopPropagation(); !isLocked && onPickLevel(chapterIdx, levelNum, difficulty); }}>
                    <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
                    {isCurrent && (
                      <circle cx={p.x} cy={p.y} r="11" fill="none" stroke={paletteAccent} strokeWidth="0.8" opacity="0.5">
                        <animate attributeName="r" values="9;14;9" dur="2.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={p.x} cy={p.y}
                      r={isCurrent ? 5.5 : (isDone ? 4.5 : 3)}
                      fill={isCurrent ? paletteAccent : (isDone ? '#E5C158' : 'rgba(212,175,55,0.2)')}
                      stroke={isLocked ? 'rgba(212,175,55,0.2)' : (isCurrent ? paletteAccent : '#E5C158')}
                      strokeWidth={isCurrent ? 1.5 : 0.8}
                      style={{ filter: !isLocked ? `drop-shadow(0 0 4px ${isCurrent ? paletteAccent : '#E5C158'})` : 'none' }}
                    />
                    {!isLocked && (
                      <text x={p.x} y={p.y - 10} textAnchor="middle"
                        fontFamily="Comfortaa, sans-serif" fontSize="8"
                        fill={isCurrent ? paletteAccent : 'rgba(212,175,55,0.75)'}>{levelNum}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:12,
              color:'rgba(229,193,88,0.75)', letterSpacing:0.5, textAlign:'center' }}>
              {pageConstellation[lang] || pageConstellation.ru}
            </div>
            <div style={{ fontFamily:'Comfortaa, sans-serif', fontSize:9, letterSpacing:2, color:'rgba(212,175,55,0.5)' }}>
              {doneLevels > 0 ? `${doneLevels} ${t('solved').toUpperCase()}` : t('notStarted')}
            </div>
          </div>
        </div>
      </div>

      {/* Выбор сложности — только для глав II–VI */}
      {chapterIdx > 0 && (
        <div style={{ position:'absolute', bottom: 142, left:0, right:0, display:'flex', justifyContent:'center', gap:8, zIndex:5 }}>
          {['easy','normal','hard'].map(d => (
            <button key={d} className="btn-reset" onClick={() => setDifficulty(d)} style={{
              padding:'6px 14px', borderRadius:999,
              border:`1px solid ${difficulty === d ? paletteAccent : 'rgba(212,175,55,0.3)'}`,
              background: difficulty === d ? `${paletteAccent}18` : 'transparent',
              fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:2,
              color: difficulty === d ? paletteAccent : 'rgba(212,175,55,0.55)',
              textTransform:'uppercase',
              boxShadow: difficulty === d ? `0 0 8px ${paletteAccent}44` : 'none',
            }}>{diffLabels[d]}</button>
          ))}
        </div>
      )}

      {/* Primary CTA */}
      <div style={{ position:'absolute', bottom: 78, left:0, right:0, display:'flex', justifyContent:'center', zIndex:5 }}>
        <button className="btn-reset" onClick={() => onPickLevel(chapterIdx, nextLevel, difficulty)} style={{
          display:'flex', alignItems:'center', gap:14,
          padding:'12px 26px', borderRadius:999,
          background:'radial-gradient(circle at 30% 30%, rgba(77,238,234,0.18), rgba(11,16,29,0.55) 70%)',
          border:`1px solid ${paletteAccent}aa`,
          color:'#fff3b8',
          fontFamily:'Cinzel, serif', fontWeight:500, fontSize:12, letterSpacing:4,
          textTransform:'uppercase',
          boxShadow:`0 0 18px ${paletteAccent}33, inset 0 0 12px ${paletteAccent}22`,
        }}>
          <span>{doneLevels === 0 ? t('start') : t('openLevel')}</span>
          <span style={{ width:1, height:14, background:'rgba(229,193,88,0.4)' }} />
          <span style={{ fontFamily:'Comfortaa, sans-serif', fontSize:13, letterSpacing:2, color: paletteAccent,
            textShadow:`0 0 8px ${paletteAccent}`, fontWeight:500 }}>
            {String(nextLevel).padStart(2, '0')}
          </span>
        </button>
      </div>

      {/* Chapter pager */}
      <div style={{ position:'absolute', bottom: 28, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center', gap:18, zIndex:5 }}>
        <button className="btn-reset" onClick={() => setChapterIdx(Math.max(0, chapterIdx - 1))}>
          <Icon kind="back" size={20} color={chapterIdx === 0 ? 'rgba(212,175,55,0.25)' : '#E5C158'} />
        </button>
        <div style={{ display:'flex', gap:8 }}>
          {chapters.map((_, i) => (
            <button key={i} className="btn-reset" onClick={() => setChapterIdx(i)} style={{
              width: 8, height: 8, borderRadius:8,
              background: i === chapterIdx ? '#E5C158' : 'transparent',
              border: '1px solid rgba(212,175,55,0.6)',
              boxShadow: i === chapterIdx ? '0 0 6px rgba(229,193,88,0.7)' : 'none',
            }} />
          ))}
        </div>
        <button className="btn-reset" onClick={() => setChapterIdx(Math.min(chapters.length - 1, chapterIdx + 1))}>
          <Icon kind="chevR" size={20} color={chapterIdx === chapters.length - 1 ? 'rgba(212,175,55,0.25)' : '#E5C158'} />
        </button>
      </div>

      {/* Небо коллекции */}
      {skyOpen && (
        <SkyCollection
          chapters={chapters}
          chapterLevels={chapterLevels}
          paletteAccent={paletteAccent}
          lang={lang}
          onClose={() => setSkyOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────── SKY COLLECTION (global — all chapters)
function SkyCollection({ chapters, chapterLevels = [0,0,0,0,0,0], paletteAccent, lang = 'ru', onClose }) {
  const t = useT(lang);
  const LEVELS_PER_PAGE = 6;
  const chapterRomanNums = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  // Собираем все завершённые созвездия по всем главам
  const allGroups = chapters.map((chapterName, ci) => {
    const done = chapterLevels[ci] || 0;
    if (done === 0) return null;
    const totalPgs = Math.ceil(done / LEVELS_PER_PAGE);
    const constellations = Array.from({ length: totalPgs }, (_, pi) => {
      const cdata = getConstellationData(pi, ci);
      const starsTotal = cdata.pts.length;
      const pageStart = pi * LEVELS_PER_PAGE;
      const starsLit = Math.min(starsTotal, done - pageStart);
      return { pts: cdata.pts, lines: cdata.lines, ru: cdata.ru, en: cdata.en, la: cdata.la, starsLit, pi, ci };
    });
    return { chapterName, ci, constellations };
  }).filter(Boolean);

  const totalAny = allGroups.reduce((s, g) => s + g.constellations.length, 0);

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:50,
      background:'radial-gradient(ellipse at 50% 20%, rgba(10,18,45,0.98), rgba(2,4,10,0.99) 75%)',
      display:'flex', flexDirection:'column', alignItems:'center',
    }}>
      <GoldDust count={50} area={{ w:380, h:800 }} />

      {/* Фоновые звёзды */}
      <svg style={{ position:'absolute', inset:0, pointerEvents:'none' }} width="100%" height="100%">
        {Array.from({length:80}).map((_,i)=>{
          const x = (i * 137.508) % 100;
          const y = (i * 97.3 + i * 13.7) % 100;
          const r = 0.35 + (i % 4) * 0.28;
          return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={r} fill="#E5C158" opacity={0.15 + (i % 6) * 0.06} />;
        })}
      </svg>

      {/* Header */}
      <div style={{ position:'relative', zIndex:2, marginTop:66, textAlign:'center', paddingBottom:10 }}>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:6, color:'rgba(212,175,55,0.55)', textTransform:'uppercase' }}>{t('skyTitle')}</div>
        <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:20, color:'#fff3b8', marginTop:3, letterSpacing:0.5 }}>{t('skySubtitle')}</div>
        <div style={{ width:70, height:1, margin:'8px auto 0', background:'linear-gradient(90deg,transparent,#D4AF37,transparent)', opacity:0.5 }} />
      </div>

      {/* Созвездия — прокручиваемая область */}
      <div style={{ position:'relative', zIndex:2, flex:1, width:'100%', overflowY:'auto', padding:'12px 16px 24px' }}>
        {totalAny === 0 ? (
          <div style={{ textAlign:'center', marginTop:80,
            fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
            fontSize:17, color:'rgba(229,193,88,0.35)', lineHeight:1.5 }}>
            {t('skyEmpty').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br/>}</span>)}
          </div>
        ) : (
          allGroups.map(({ chapterName, ci, constellations }) => (
            <div key={ci} style={{ marginBottom:22 }}>
              {/* Заголовок главы */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.3))' }} />
                <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:4,
                  color:'rgba(212,175,55,0.6)', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                  {chapterRomanNums[ci]} · {chapterName}
                </div>
                <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(212,175,55,0.3),transparent)' }} />
              </div>

              {/* Карточки созвездий этой главы */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
                {constellations.map(({ pts, lines, ru, en, la, starsLit, pi }) => (
                  <div key={`${ci}-${pi}`} style={{
                    width: 134,
                    background:'rgba(8,12,28,0.82)',
                    border:'1px solid rgba(212,175,55,0.25)',
                    borderRadius:10,
                    padding:'8px 6px 7px',
                    display:'flex', flexDirection:'column', alignItems:'center',
                  }}>
                    <svg viewBox="0 0 160 240" width="108" height="116" style={{ overflow:'visible' }}>
                      {/* Линии */}
                      <g stroke="rgba(212,175,55,0.22)" strokeWidth="1">
                        {(lines || []).map(([a, b], li) => {
                          const A = pts[a], B = pts[b];
                          if (!A || !B) return null;
                          return <line key={li} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />;
                        })}
                      </g>
                      {/* Звёзды */}
                      {pts.map((p, si) => {
                        const lit = si < starsLit;
                        return (
                          <g key={si}>
                            {lit && (
                              <circle cx={p.x} cy={p.y} r="7" fill={paletteAccent} opacity="0.08" />
                            )}
                            <circle cx={p.x} cy={p.y}
                              r={lit ? 3.8 : 2}
                              fill={lit ? '#E5C158' : 'rgba(212,175,55,0.15)'}
                              style={{ filter: lit ? 'drop-shadow(0 0 4px rgba(229,193,88,0.9))' : 'none' }}
                            />
                          </g>
                        );
                      })}
                    </svg>
                    <div style={{
                      fontFamily:'Cormorant Garamond, serif', fontStyle:'italic',
                      fontSize:11, color:'rgba(229,193,88,0.85)', textAlign:'center',
                      marginTop:4, lineHeight:1.2,
                    }}>{lang === 'en' ? (en || ru) : ru}</div>
                    {la && (
                      <div style={{
                        fontFamily:'Comfortaa, sans-serif', fontSize:7, letterSpacing:0.5,
                        color:'rgba(212,175,55,0.38)', marginTop:1, textAlign:'center',
                      }}>{la}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Закрыть */}
      <button onClick={onClose} className="btn-reset" style={{
        position:'absolute', top:62, right:18, zIndex:10,
      }}>
        <Icon kind="close" size={22} />
      </button>
    </div>
  );
}

// ─────────────────────────── WIN
const WIN_MESSAGES = [
  {
    ru: { title: 'Уровень пройден', sub: 'Ещё одна страница книги ожила' },
    en: { title: 'Level complete', sub: 'Another page of the book came to life' },
  },
  {
    ru: { title: 'Ты молодец', sub: 'Магия чисел тебе покорилась' },
    en: { title: 'Well done', sub: 'The magic of numbers has yielded to you' },
  },
  {
    ru: { title: 'Безупречно', sub: 'Ещё три звезды зажглись на твоём небосклоне' },
    en: { title: 'Flawless', sub: 'Three more stars lit up your firmament' },
  },
  {
    ru: { title: 'Формула раскрыта', sub: 'Чернила слагаются в новое заклинание' },
    en: { title: 'Formula revealed', sub: 'The ink weaves itself into a new spell' },
  },
  {
    ru: { title: 'Гримуар доволен', sub: 'Знание прибавилось — тьма отступила' },
    en: { title: 'The grimoire is pleased', sub: 'Knowledge grows — the darkness retreats' },
  },
  {
    ru: { title: 'Созвездие открыто', sub: 'Звёзды выстроились по твоей воле' },
    en: { title: 'Constellation unlocked', sub: 'The stars aligned at your command' },
  },
];

function WinOverlay({ onContinue, onChapters, lang, paletteAccent, levelIdx = 1 }) {
  const t = useT(lang);
  const [stage, setStage] = _uS_s(0);
  const msg = WIN_MESSAGES[(levelIdx - 1) % WIN_MESSAGES.length][lang] || WIN_MESSAGES[(levelIdx - 1) % WIN_MESSAGES.length].ru;

  _uE_s(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Prototype ставит coverBlack мгновенно, WinOverlay просто вызывает колбэк
  const dismiss = (cb) => cb && cb();

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:30,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background: stage >= 1 ? 'rgba(6,9,18,0.88)' : 'rgba(6,9,18,0)',
      backdropFilter: stage >= 1 ? 'blur(6px)' : 'none',
      transition: 'background 0.7s ease-out, backdrop-filter 0.7s ease-out',
    }}>
      <GoldDust count={40} area={{ w:380, h:800 }} />

      {/* Burst rays */}
      <svg width="320" height="320" viewBox="0 0 320 320" style={{ position:'absolute', opacity: stage >= 1 ? 0.55 : 0, transition:'opacity 1s', mixBlendMode:'screen' }}>
        <defs>
          <radialGradient id="winG">
            <stop offset="0" stopColor="#fff7c2" stopOpacity="0.6" />
            <stop offset="0.4" stopColor="#E5C158" stopOpacity="0.3" />
            <stop offset="1" stopColor="#E5C158" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="160" fill="url(#winG)" />
        <g stroke="#E5C158" strokeWidth="0.5" opacity="0.4">
          {Array.from({length: 24}).map((_, i) => (
            <line key={i} x1="160" y1="160" x2="160" y2="20"
              transform={`rotate(${i*15} 160 160)`} />
          ))}
        </g>
      </svg>

      {/* Card — подложка под весь контент */}
      <div style={{
        position:'relative', zIndex:5,
        display:'flex', flexDirection:'column', alignItems:'center',
        width: 300,
        background:'linear-gradient(180deg, rgba(20,26,45,0.97) 0%, rgba(10,14,26,0.98) 100%)',
        border:'1px solid rgba(212,175,55,0.45)',
        borderRadius:16,
        boxShadow:'0 0 0 1px rgba(212,175,55,0.12), 0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(229,193,88,0.12)',
        padding:'32px 24px 28px',
        opacity: stage >= 2 ? 1 : 0,
        transform: `translateY(${stage >= 2 ? 0 : 22}px)`,
        transition:'all 0.7s ease-out',
      }}>
        <Astrolabe size={120} color="#E5C158" strokeOp={0.55} spin={true} />

        <div style={{ marginTop: 20, textAlign:'center' }}>
          <div className="gold-shimmer" style={{ fontFamily:'Cinzel, serif', fontWeight:600, fontSize:24, letterSpacing:4, textTransform:'uppercase', lineHeight:1.15 }}>{msg.title}</div>
          <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:16, color:'rgba(229,193,88,0.85)', marginTop:10, lineHeight:1.45 }}>«{msg.sub}»</div>
        </div>

        <div style={{ display:'flex', justifyContent:'center', gap: 6, margin:'18px auto 0' }}>
          {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:7, background:'#E5C158', boxShadow:'0 0 6px #E5C158' }} />)}
        </div>

        <div style={{ marginTop:24, display:'flex', flexDirection:'column', alignItems:'center', gap:10, width:'100%' }}>
          {/* Главная кнопка — следующий уровень */}
          <button onClick={() => dismiss(onContinue)} className="btn-reset" style={{
            width:'100%', padding:'13px 0', borderRadius:999,
            border:'1px solid rgba(229,193,88,0.7)',
            background:'rgba(229,193,88,0.12)',
            fontFamily:'Cinzel, serif', letterSpacing:4, color:'#fff3b8', fontSize:13,
            textTransform:'uppercase',
            boxShadow:'0 0 20px rgba(229,193,88,0.2)',
          }}>{t('continue')}</button>

          {/* Вторичная кнопка — выбор главы */}
          <button onClick={() => dismiss(onChapters)} className="btn-reset" style={{
            width:'100%', padding:'11px 0', borderRadius:999,
            border:'1px solid rgba(212,175,55,0.3)',
            background:'transparent',
            fontFamily:'Cinzel, serif', letterSpacing:3, color:'rgba(229,193,88,0.6)', fontSize:11,
            textTransform:'uppercase',
          }}>{t('chooseTitle')}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── HINT (modal)
// ─────────────────────────── CHAPTER INFO MODAL (правила + сложность для глав II–VI)
const CHAPTER_RULES = {
  ru: [
    null, // глава I — используется обычный HintModal
    'Расставьте числа 1–9 в сетку 3×3 так, чтобы сумма по каждой строке, каждому столбцу и обеим диагоналям равнялась 15. Числа в лотке внизу — ваши инструменты.',
    'Найдите все безопасные звёзды, не задев тёмные. Тап — открыть клетку. Долгое нажатие — поставить метку ✦ (звезда), ещё раз — знак ?, ещё раз — снять метку.',
    'Закрасьте клетки по числовым подсказкам рядом с каждой строкой и столбцом. Число означает сколько клеток закрашено подряд в этом ряду. Несколько чисел — несколько групп, между ними хотя бы одна пустая.',
    'Расставьте числа 1–10 в узлы пятиконечной звезды так, чтобы сумма по каждому лучу (4 узла) равнялась 22. Нажмите на число в банке, затем на узел звезды.',
    'Зачеркните некоторые числа по правилам: в каждой строке и столбце не должно быть двух одинаковых незачёркнутых чисел; зачёркнутые клетки не должны касаться друг друга по горизонтали или вертикали.',
  ],
  en: [
    null,
    'Place numbers 1–9 in the 3×3 grid so that every row, column and both diagonals sum to 15. The tiles in the tray below are your tools.',
    'Find all safe stars without hitting dark ones. Tap to reveal. Long-press to mark ✦, again for ?, again to clear.',
    'Fill cells following the number clues beside each row and column. A number means that many consecutive filled cells. Multiple numbers mean multiple groups with at least one gap between.',
    'Place numbers 1–10 in the star nodes so each ray of 4 nodes sums to 22. Tap a number in the bank, then tap a node to place it.',
    'Cross out numbers so that: no row or column has two identical uncrossed numbers; crossed cells do not touch each other horizontally or vertically.',
  ],
};

const DIFFICULTY_LABELS = {
  ru: { easy: 'Лёгкая', normal: 'Нормальная', hard: 'Сложная' },
  en: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
};

function ChapterInfoModal({ onClose, lang, paletteAccent, chapterIdx }) {
  const rules = (CHAPTER_RULES[lang] || CHAPTER_RULES.ru)[chapterIdx];
  const t = useT(lang);

  return (
    <div style={{ position:'absolute', inset:0, zIndex:40,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(6,8,15,0.82)', backdropFilter:'blur(10px)' }}>
      <div style={{
        position:'relative', width: 310,
        background: 'linear-gradient(180deg, #1a1f30 0%, #0d1220 100%)',
        border:'1px solid rgba(212,175,55,0.55)',
        borderRadius: 14,
        boxShadow:'0 30px 60px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.15)',
        padding: '28px 22px 24px',
        textAlign:'center',
      }}>
        <button onClick={onClose} className="btn-reset" style={{ position:'absolute', top:12, right:12 }}>
          <Icon kind="close" size={18} />
        </button>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:12, filter:'drop-shadow(0 0 10px rgba(255,210,90,0.5))' }}>
          <Candle size={32} />
        </div>
        <div style={{ fontFamily:'Cinzel, serif', fontWeight:500, fontSize:13, letterSpacing:4, color:'#E5C158', textTransform:'uppercase', marginBottom:14 }}>
          {t('hintTitle')}
        </div>
        <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:15, color:'rgba(255,243,184,0.88)', lineHeight:1.55, textAlign:'left', marginBottom:24 }}>
          {rules}
        </div>
        <button onClick={onClose} className="btn-reset" style={{
          padding:'11px 32px', borderRadius:999,
          border:'1px solid rgba(212,175,55,0.6)',
          background:'rgba(212,175,55,0.08)',
          fontFamily:'Cinzel, serif', letterSpacing:3, fontSize:12,
          color:'#E5C158', textTransform:'uppercase',
          boxShadow:'0 0 16px rgba(212,175,55,0.15)',
        }}>{t('understood')}</button>
      </div>
    </div>
  );
}

function HintModal({ onClose, lang, paletteAccent, hintText }) {
  const t = useT(lang);
  return (
    <div style={{ position:'absolute', inset:0, zIndex:40,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(6,8,15,0.8)', backdropFilter:'blur(10px)' }}>
      <div style={{
        position:'relative', width: 300,
        background: 'linear-gradient(180deg, #1a1f30 0%, #0d1220 100%)',
        border:'1px solid rgba(212,175,55,0.55)',
        borderRadius: 14,
        boxShadow:'0 30px 60px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.15)',
        padding: '28px 22px 24px',
        textAlign:'center',
      }}>
        <button onClick={onClose} className="btn-reset" style={{ position:'absolute', top: 12, right: 12 }}>
          <Icon kind="close" size={18} />
        </button>

        <div style={{ display:'flex', justifyContent:'center', marginBottom: 12, filter:'drop-shadow(0 0 10px rgba(255,210,90,0.5))' }}>
          <Candle size={36} />
        </div>

        <div style={{ fontFamily:'Cinzel, serif', fontWeight:500, fontSize:15, letterSpacing:4, color:'#E5C158', textTransform:'uppercase' }}>{t('hintTitle')}</div>
        <div style={{ height:1, width:60, margin:'14px auto', background:'rgba(212,175,55,0.5)' }} />

        <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:17, color:'rgba(255,243,184,0.9)', lineHeight:1.5 }}>
          «{hintText || t('hintBody')}»
        </div>

        <button onClick={onClose} className="btn-reset" style={{
          marginTop: 24,
          padding: '11px 32px', borderRadius:999,
          border:'1px solid rgba(212,175,55,0.6)',
          background:'rgba(212,175,55,0.08)',
          fontFamily:'Cinzel, serif', letterSpacing:3, fontSize:12,
          color:'#E5C158', textTransform:'uppercase',
          boxShadow:'0 0 16px rgba(212,175,55,0.15)',
        }}>{t('understood')}</button>
      </div>
    </div>
  );
}

// ─────────────────────────── SETTINGS
function SettingsScreen({ onBack, lang, setLang, paletteAccent, setPaletteAccent, theme, setTheme }) {
  const t = useT(lang);
  const [sound, setSound] = _uS_s(true);
  const [music, setMusic] = _uS_s(true);
  const [haptics, setHaptics] = _uS_s(true);

  const Row = ({ label, right, last }) => (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'16px 4px', borderBottom: last ? 'none' : '1px solid rgba(212,175,55,0.15)',
    }}>
      <div style={{ fontFamily:'Cormorant Garamond, serif', fontSize:17, color:'#f1e2b8', fontStyle:'italic', letterSpacing:0.5 }}>{label}</div>
      <div>{right}</div>
    </div>
  );

  const Toggle = ({ on, onChange }) => (
    <button className="btn-reset" onClick={() => onChange(!on)} style={{
      width: 44, height: 22, borderRadius: 22,
      background: on ? 'rgba(77,238,234,0.18)' : 'rgba(212,175,55,0.06)',
      border: `1px solid ${on ? 'rgba(77,238,234,0.6)' : 'rgba(212,175,55,0.35)'}`,
      position:'relative', transition:'all 0.2s ease',
      boxShadow: on ? `0 0 10px ${paletteAccent}55` : 'none',
    }}>
      <div style={{
        width: 16, height: 16, borderRadius:16,
        position:'absolute', top: 2, left: on ? 24 : 2,
        background: on ? paletteAccent : '#E5C158',
        boxShadow: on ? `0 0 6px ${paletteAccent}` : '0 0 4px #E5C158',
        transition:'left 0.2s ease, background 0.2s ease',
      }} />
    </button>
  );

  const Segment = ({ options, value, onChange }) => (
    <div style={{ display:'flex', gap:0, border:'1px solid rgba(212,175,55,0.4)', borderRadius:999, padding:2 }}>
      {options.map(o => (
        <button key={o.value} className="btn-reset" onClick={() => onChange(o.value)} style={{
          padding:'5px 12px', borderRadius:999,
          background: value === o.value ? 'rgba(229,193,88,0.18)' : 'transparent',
          color: value === o.value ? '#fff3b8' : 'rgba(229,193,88,0.6)',
          fontFamily:'Comfortaa, sans-serif', fontSize:11, letterSpacing:2, textTransform:'uppercase',
          fontWeight: 500,
        }}>{o.label}</button>
      ))}
    </div>
  );

  const Swatch = ({ color, active, onClick }) => (
    <button className="btn-reset" onClick={onClick} style={{
      width: 22, height: 22, borderRadius:22, background: color,
      boxShadow: active ? `0 0 0 2px #0B101D, 0 0 0 3px ${color}, 0 0 10px ${color}` : `0 0 6px ${color}55`,
      border:'none',
    }} />
  );

  return (
    <div className="screen night-bg starfield" style={{ overflowY:'auto' }}>
      {/* HUD */}
      <div style={{ position:'absolute', top:62, left:0, right:0, padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:5 }}>
        <HudButton onClick={onBack} label="back"><Icon kind="back" size={18} /></HudButton>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:13, letterSpacing:5, color:'#D4AF37' }}>{t('settings').toUpperCase()}</div>
        <div style={{ width: 44 }} />
      </div>

      <div style={{ padding:'140px 26px 60px' }}>
        <div className="gold-frame" style={{ padding:'4px 20px 8px', borderRadius:10, background:'rgba(11,16,29,0.5)' }}>
          <Row label={t('sound')} right={<Toggle on={sound} onChange={setSound} />} />
          <Row label={t('music')} right={<Toggle on={music} onChange={setMusic} />} />
          <Row label={t('haptics')} right={<Toggle on={haptics} onChange={setHaptics} />} last />
        </div>

        <div style={{ height: 22 }} />

        <div className="gold-frame" style={{ padding:'4px 20px 8px', borderRadius:10, background:'rgba(11,16,29,0.5)' }}>
          <Row label={t('language')} right={
            <Segment value={lang} onChange={setLang} options={[{value:'ru',label:'RU'},{value:'en',label:'EN'}]} />
          } />
          <Row label={t('theme')} right={
            <Segment value={theme} onChange={setTheme} options={[{value:'night',label:'Nox'},{value:'parchment',label:'Carta'}]} />
          } last />
        </div>

        <div style={{ height: 22 }} />

        <div className="gold-frame" style={{ padding:'18px 20px 18px', borderRadius:10, background:'rgba(11,16,29,0.5)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:17, color:'#f1e2b8' }}>{t('accent')}</div>
            <div style={{ display:'flex', gap:12 }}>
              {['#4DEEEA', '#70FFA0', '#E5C158', '#b78cff'].map(c => (
                <Swatch key={c} color={c} active={paletteAccent === c} onClick={() => setPaletteAccent(c)} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, textAlign:'center', fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', color:'rgba(212,175,55,0.5)', fontSize:13, letterSpacing:1 }}>
          «Mathemagicia · MMXXVI»<br/>
          <span style={{ fontSize:11, color:'rgba(212,175,55,0.4)' }}>{t('about')}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── LOADING / SPLASH
function LoadingScreen({ onDone, lang = 'ru', paletteAccent = '#4DEEEA', duration = 3800 }) {
  const t = useT(lang);
  const [progress, setProgress] = _uS_s(0);
  const [phase, setPhase] = _uS_s(0); // 0 fade-in, 1 main, 2 fade-out

  _uE_s(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setPhase(2);
        setTimeout(() => onDone && onDone(), 600);
      }
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase(1), 250);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); };
  }, [duration, onDone]);

  const incantations = {
    ru: [
      'Зажигаем свечи…',
      'Считаем созвездия…',
      'Чертим линии судьбы…',
      'Раскрываем гримуар…',
    ],
    en: [
      'Lighting the candles…',
      'Counting constellations…',
      'Tracing lines of fate…',
      'Unbinding the grimoire…',
    ],
  };
  const lines = incantations[lang] || incantations.ru;
  const lineIdx = Math.min(lines.length - 1, Math.floor(progress * lines.length));

  return (
    <div className="screen night-bg starfield" style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding: '0 32px',
      opacity: phase === 2 ? 0 : 1, transition:'opacity 0.6s ease-out',
    }}>
      <GoldDust count={26} area={{ w:380, h:800 }} />

      {/* Centered seal — astrolabe + sigil */}
      <div style={{ position:'relative', width: 220, height: 220, display:'flex', alignItems:'center', justifyContent:'center',
        opacity: phase >= 1 ? 1 : 0, transform: `scale(${phase >= 1 ? 1 : 0.92})`,
        transition: 'opacity 1s ease-out, transform 1.2s cubic-bezier(.2,.8,.2,1)' }}>
        {/* Outer astrolabe — slow */}
        <div style={{ position:'absolute' }}>
          <Astrolabe size={220} color="#D4AF37" strokeOp={0.55} spin={true} />
        </div>
        {/* Inner counter-rotating ring */}
        <div style={{ position:'absolute', animation:'slowRotate 40s linear infinite reverse' }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <g stroke="#E5C158" strokeOpacity="0.7" fill="none">
              <circle cx="75" cy="75" r="60" strokeWidth="0.5" strokeDasharray="1 6" />
              <circle cx="75" cy="75" r="46" strokeWidth="0.4" />
              {[0, 60, 120, 180, 240, 300].map(a => {
                const r = a * Math.PI / 180;
                return <circle key={a} cx={75 + Math.cos(r) * 60} cy={75 + Math.sin(r) * 60} r="1.6" fill="#E5C158" />;
              })}
            </g>
          </svg>
        </div>
        {/* Central sigil (hexagram + pentacle) */}
        <svg width="78" height="78" viewBox="0 0 80 80" style={{ position:'relative', filter:`drop-shadow(0 0 8px ${paletteAccent}55)` }}>
          <g stroke="#E5C158" strokeWidth="0.8" fill="none" strokeOpacity="0.95">
            <circle cx="40" cy="40" r="32" />
            <polygon points="40,12 64,52 16,52" />
            <polygon points="40,68 16,28 64,28" />
            <circle cx="40" cy="40" r="14" />
            <circle cx="40" cy="40" r="2" fill="#E5C158" />
          </g>
          <g stroke={paletteAccent} strokeWidth="0.8" fill="none" opacity="0.8"
            style={{ transformOrigin: '40px 40px', animation:'slowRotate 18s linear infinite' }}>
            <circle cx="40" cy="40" r="22" strokeDasharray="2 3" />
          </g>
        </svg>
      </div>

      {/* Title */}
      <div style={{ marginTop: 36, textAlign:'center',
        opacity: phase >= 1 ? 1 : 0, transform: `translateY(${phase >= 1 ? 0 : 8}px)`,
        transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s' }}>
        <div className="gold-shimmer" style={{
          fontFamily:'Cinzel, serif', fontWeight:600, fontSize:26, letterSpacing:6,
          textTransform:'uppercase',
        }}>Mathemagicia</div>
        <div style={{ fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:14,
          color:'rgba(229,193,88,0.7)', marginTop:8, letterSpacing:0.5 }}>
          «{t('subtitle')}»
        </div>
      </div>

      {/* Progress */}
      <div style={{ position:'absolute', bottom: 80, left: 0, right: 0,
        display:'flex', flexDirection:'column', alignItems:'center', gap: 14, padding: '0 50px',
        opacity: phase >= 1 ? 1 : 0, transition:'opacity 0.8s ease-out 0.5s' }}>
        {/* Thin double bar */}
        <div style={{ width:'100%', height: 1, background:'rgba(212,175,55,0.18)', position:'relative' }}>
          <div style={{
            position:'absolute', top:-0.5, left:0, height:2, width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, transparent, #D4AF37 30%, #fff3b8 70%, #D4AF37)',
            boxShadow: '0 0 8px #D4AF37, 0 0 14px rgba(229,193,88,0.6)',
            transition: 'width 0.18s linear',
          }} />
          {/* Trailing spark */}
          <div style={{
            position:'absolute', top:-2.5, left: `calc(${progress * 100}% - 3px)`, width:6, height:6,
            borderRadius:6, background:'#fff3b8',
            boxShadow:'0 0 8px #fff3b8, 0 0 14px #E5C158',
            opacity: progress < 1 ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
          }} />
        </div>

        {/* Incantation text */}
        <div style={{ height: 18, position:'relative', width:'100%', textAlign:'center' }}>
          {lines.map((l, i) => (
            <div key={i} style={{
              position:'absolute', left:0, right:0, top:0,
              fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', fontSize:13,
              color:'rgba(229,193,88,0.75)', letterSpacing:0.4,
              opacity: i === lineIdx ? 1 : 0,
              transform: `translateY(${i === lineIdx ? 0 : 6}px)`,
              transition:'opacity 0.45s ease-out, transform 0.45s ease-out',
            }}>{l}</div>
          ))}
        </div>

        {/* Percent */}
        <div style={{
          fontFamily:'Comfortaa, sans-serif', fontSize:10, letterSpacing:4,
          color:'rgba(212,175,55,0.55)',
        }}>{String(Math.floor(progress * 100)).padStart(2, '0')} %</div>
      </div>

      {/* Tiny corner mark */}
      <div style={{ position:'absolute', top: 70, left: 0, right: 0, textAlign:'center',
        fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:5, color:'rgba(212,175,55,0.55)' }}>
        ·  LIBER  I  ·  MMXXVI  ·
      </div>
    </div>
  );
}

Object.assign(window, { CoverScreen, ChapterSelect, WinOverlay, HintModal, ChapterInfoModal, SettingsScreen, LoadingScreen, SkyCollection });
