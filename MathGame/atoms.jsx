// Mathemagicia — shared atoms (icons, particles, runes, frames)

const { useState, useEffect, useRef, useMemo } = React;

// ─────────── i18n
const STRINGS = {
  ru: {
    open: 'Открыть',
    title: 'Mathemagicia',
    subtitle: 'Книга Магии Математики',
    chapter: 'Глава',
    level: 'Уровень',
    chapters: ['Граф связей', 'Магический квадрат', 'Тёмные звёзды', 'Нонограмма', 'Магические звёзды', 'Хитори'],
    chapterSub: ['Теория соединений', 'Числа в равновесии', 'Свет во тьме', 'Проявление форм', 'Звёздное равновесие', 'Искусство исключения'],
    settings: 'Настройки',
    sound: 'Звук',
    music: 'Музыка',
    haptics: 'Тактильный отклик',
    language: 'Язык',
    theme: 'Оформление',
    about: 'О книге',
    reset: 'Сброс',
    hint: 'Подсказка',
    menu: 'В меню',
    chooseTitle: 'Выбор главы',
    levels: 'Уровней',
    solved: 'Пройдено',
    win: 'Глава раскрыта',
    winSub: 'Чернила превратились в золото',
    continue: 'Продолжить',
    openLevel: 'Открыть уровень',
    hintTitle: 'Магическая подсказка',
    hintBody: 'Свеча покажет, какие узлы соединены первой связью. Используйте, когда устанете.',
    light: 'Зажечь свечу',
    cost: 'Стоит 1 свечу',
    candles: 'Свечи',
    drag: 'Перетащите фигуру в паз',
    connect: 'Соедините узлы так, чтобы сумма равнялась 12',
    placed: 'Все фигуры на местах',
    backCover: 'К обложке',
    understood: 'Понятно',
    notStarted: '— не начата —',
    start: 'Начать',
    skyTitle: 'Небо открытий',
    skySubtitle: 'Коллекция созвездий',
    skyEmpty: 'Пройди первый уровень,\nчтобы открыть созвездие',
    accent: 'Акцент',
    resetProgress: 'Сбросить прогресс',
    resetConfirm: 'Сбросить весь прогресс? Это нельзя отменить.',
    resetDone: 'Прогресс сброшен',
  },
  en: {
    open: 'Open',
    title: 'Mathemagicia',
    subtitle: 'The Book of Mathematical Magic',
    chapter: 'Chapter',
    level: 'Level',
    chapters: ['Graph of Bonds', 'Magic Square', 'Dark Stars', 'Nonogram', 'Magic Stars', 'Hitori'],
    chapterSub: ['Theory of links', 'Numbers in balance', 'Light in darkness', 'Shapes revealed', 'Stellar balance', 'Art of exclusion'],
    settings: 'Settings',
    sound: 'Sound',
    music: 'Music',
    haptics: 'Haptics',
    language: 'Language',
    theme: 'Theme',
    about: 'About the book',
    reset: 'Reset',
    hint: 'Hint',
    menu: 'To menu',
    chooseTitle: 'Choose chapter',
    levels: 'Levels',
    solved: 'Solved',
    win: 'Chapter revealed',
    winSub: 'Ink has turned to gold',
    continue: 'Continue',
    openLevel: 'Open level',
    hintTitle: 'Magical hint',
    hintBody: 'The candle reveals which nodes share the first bond. Use it when you grow weary.',
    light: 'Light candle',
    cost: 'Costs 1 candle',
    candles: 'Candles',
    drag: 'Drag the shape into its slot',
    connect: 'Connect the nodes so the sum equals 12',
    placed: 'All shapes are placed',
    backCover: 'To cover',
    understood: 'Got it',
    notStarted: '— not started —',
    start: 'Start',
    skyTitle: 'Sky of discoveries',
    skySubtitle: 'Constellation collection',
    skyEmpty: 'Complete the first level\nto unlock a constellation',
    accent: 'Accent',
    resetProgress: 'Reset progress',
    resetConfirm: 'Reset all progress? This cannot be undone.',
    resetDone: 'Progress has been reset',
  },
};
const useT = (lang) => (k) => (STRINGS[lang] || STRINGS.ru)[k];

// ─────────── Floating gold dust particles
function GoldDust({ count = 22, area = { w: 380, h: 720 } }) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => {
    const seed = i * 17 + 3;
    return {
      x: (seed * 31) % area.w,
      y: (seed * 53) % area.h,
      size: 1.2 + ((seed * 7) % 30) / 10,
      opacity: 0.35 + ((seed * 11) % 60) / 100,
      delay: ((seed * 3) % 70) / 10,
      duration: 5 + ((seed * 13) % 50) / 10,
    };
  }), [count, area.w, area.h]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p, i) => (
        <span key={i} className="dust" style={{
          left: p.x, top: p.y,
          width: p.size * 3, height: p.size * 3,
          '--o': p.opacity,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}
    </div>
  );
}

// ─────────── Candle icon
function Candle({ size = 28, lit = true }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 28 40">
      {lit && (
        <g style={{ transformOrigin: '14px 4px' }} className="flicker">
          <ellipse cx="14" cy="6" rx="3.4" ry="6" fill="url(#flameG)" />
          <ellipse cx="14" cy="7" rx="1.6" ry="3.6" fill="#fff7c2" />
        </g>
      )}
      <rect x="10" y="14" width="8" height="22" rx="1.5" fill="url(#waxG)" />
      <ellipse cx="14" cy="14" rx="4" ry="1.4" fill="#f6e3b3" />
      <ellipse cx="14" cy="14" rx="0.6" ry="0.6" fill="#3a2a10" />
      <line x1="14" y1="13.4" x2="14" y2="11" stroke="#3a2a10" strokeWidth="0.7" />
      <defs>
        <linearGradient id="flameG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7c2" />
          <stop offset="0.4" stopColor="#ffd25a" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="waxG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5C158" />
          <stop offset="1" stopColor="#8a6f1f" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─────────── Generic gold icon
function Icon({ kind, size = 22, color = '#E5C158' }) {
  const s = size, sw = 1.4;
  const props = { stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    back: <path d="M14 5L7 12L14 19" {...props} />,
    chevR: <path d="M9 5L16 12L9 19" {...props} />,
    settings: <g {...props}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></g>,
    sound: <g {...props}><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 8c1.5 1.2 1.5 6.8 0 8" /><path d="M19 5c3 2.5 3 11.5 0 14" /></g>,
    soundOff: <g {...props}><path d="M4 9v6h4l5 4V5L8 9H4z" /><line x1="23" y1="5" x2="17" y2="11" /><line x1="17" y1="5" x2="23" y2="11" /></g>,
    close: <g {...props}><path d="M6 6l12 12M18 6L6 18" /></g>,
    eye: <g {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></g>,
    refresh: <g {...props}><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></g>,
    book: <g {...props}><path d="M4 4h7a3 3 0 0 1 3 3v13" /><path d="M20 4h-7a3 3 0 0 0-3 3v13" /><path d="M4 4v16h7" /><path d="M20 4v16h-7" /></g>,
    star: <path d="M12 2l2.6 6.6L21 9.5l-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.4-0.9L12 2z" {...props} />,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24">{paths[kind]}</svg>;
}

// ─────────── Icon button (HUD pill)
function HudButton({ children, onClick, label, size = 44 }) {
  // click → SFX обработает глобальный listener (см. ниже в этом файле)
  // hover: только для мыши — игнорируем enter от touch
  const handleEnter = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    SFX && SFX.buttonHover();
  };
  return (
    <button className="btn-reset" onClick={onClick} onPointerEnter={handleEnter} aria-label={label} style={{
      width: size, height: size, borderRadius: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 30% 30%, rgba(229,193,88,0.18), rgba(11,16,29,0.6) 70%)',
      border: '1px solid rgba(212,175,55,0.45)',
      boxShadow: '0 0 0 1px rgba(212,175,55,0.08), inset 0 0 8px rgba(212,175,55,0.12)',
      color: '#E5C158',
    }}>
      {children}
    </button>
  );
}

// ─────────── Decorative corner flourish (engraved gold)
function CornerFlourish({ size = 32, rotate = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ transform: `rotate(${rotate}deg)` }}>
      <g stroke="#D4AF37" strokeWidth="0.8" fill="none" strokeLinecap="round">
        <path d="M1 1 L1 12" />
        <path d="M1 1 L12 1" />
        <path d="M1 12 C 4 12, 6 10, 6 6 C 6 4, 8 4, 12 4" />
        <circle cx="6" cy="6" r="1" fill="#D4AF37" />
        <path d="M3 3 L7 3" opacity="0.6" />
      </g>
    </svg>
  );
}

// ─────────── Astrolabe-style decorative dial
function Astrolabe({ size = 180, color = '#D4AF37', strokeOp = 0.7, spin = false }) {
  const r1 = size / 2 - 2;
  const ticks = Array.from({ length: 36 });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ animation: spin ? 'slowRotate 90s linear infinite' : 'none' }}>
      <g stroke={color} strokeOpacity={strokeOp} fill="none">
        <circle cx={size/2} cy={size/2} r={r1} strokeWidth="0.7" />
        <circle cx={size/2} cy={size/2} r={r1 - 8} strokeWidth="0.4" />
        <circle cx={size/2} cy={size/2} r={r1 - 30} strokeWidth="0.7" />
        <circle cx={size/2} cy={size/2} r={r1 - 55} strokeWidth="0.4" />
        <circle cx={size/2} cy={size/2} r={r1 - 70} strokeWidth="0.6" strokeDasharray="2 3" />
        {ticks.map((_, i) => {
          const a = (i * 360) / ticks.length;
          const rad = (a * Math.PI) / 180;
          const x1 = size/2 + Math.cos(rad) * (r1 - 2);
          const y1 = size/2 + Math.sin(rad) * (r1 - 2);
          const x2 = size/2 + Math.cos(rad) * (r1 - (i % 3 === 0 ? 10 : 5));
          const y2 = size/2 + Math.sin(rad) * (r1 - (i % 3 === 0 ? 10 : 5));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.5" />;
        })}
        <line x1={size/2} y1={2} x2={size/2} y2={size - 2} strokeWidth="0.4" opacity="0.4" />
        <line x1={2} y1={size/2} x2={size - 2} y2={size/2} strokeWidth="0.4" opacity="0.4" />
        <g transform={`translate(${size/2}, ${size/2}) rotate(30)`}>
          <line x1={-r1 + 16} y1="0" x2={r1 - 16} y2="0" strokeWidth="0.5" opacity="0.6" />
        </g>
        <circle cx={size/2} cy={size/2} r="2" fill={color} />
      </g>
    </svg>
  );
}

// ─────────── Rune glyph (decorative, alchemical)
function Rune({ glyph = 0, size = 24, color = '#D4AF37' }) {
  const glyphs = [
    // Mercury
    <g key="0"><circle cx="12" cy="11" r="4" /><line x1="12" y1="15" x2="12" y2="21" /><line x1="9" y1="19" x2="15" y2="19" /><path d="M8 5 C 8 8, 16 8, 16 5" /></g>,
    // Sulfur
    <g key="1"><polygon points="12,4 18,14 6,14" /><line x1="12" y1="14" x2="12" y2="20" /><line x1="9" y1="18" x2="15" y2="18" /></g>,
    // Salt
    <g key="2"><circle cx="12" cy="12" r="8" /><line x1="4" y1="12" x2="20" y2="12" /></g>,
    // Air
    <g key="3"><polygon points="12,4 20,18 4,18" /><line x1="7" y1="13" x2="17" y2="13" /></g>,
    // Water
    <g key="4"><polygon points="12,20 4,6 20,6" /></g>,
    // Aether
    <g key="5"><circle cx="12" cy="12" r="7" /><polygon points="12,5 14,11 20,11 15,15 17,21 12,17 7,21 9,15 4,11 10,11" transform="scale(0.5) translate(12 5)" /></g>,
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {glyphs[glyph % glyphs.length]}
    </svg>
  );
}

// ─────────── Constellation backdrop (dots + faint lines)
function Constellation({ width = 220, height = 280, points }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position:'absolute', inset:0 }}>
      <g stroke="rgba(212,175,55,0.25)" strokeWidth="0.6" fill="none">
        {points.map((p, i) => i > 0 && <line key={`l${i}`} x1={points[i-1].x} y1={points[i-1].y} x2={p.x} y2={p.y} />)}
      </g>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r || 1.6} fill="#E5C158" opacity={p.o || 0.85} />
      ))}
    </svg>
  );
}

// ─────────── Sound engine (Web Audio API)
const SFX = (() => {
  let ctx = null;
  let enabled = true;

  // Кэш загруженных семплов (записи с челесты)
  const sampleBuffers = {};
  const samplePromises = {};

  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  // Загрузить семпл асинхронно и раскодировать в AudioBuffer
  const loadSample = (name, url) => {
    if (samplePromises[name]) return samplePromises[name];
    samplePromises[name] = fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => new Promise((resolve, reject) => {
        getCtx().decodeAudioData(buf, resolve, reject);
      }))
      .then(audioBuf => { sampleBuffers[name] = audioBuf; return audioBuf; })
      .catch(err => { console.warn('SFX sample load failed:', name, err); return null; });
    return samplePromises[name];
  };

  // Активные "голоса" по имени семпла — чтобы новый tap глушил хвост предыдущего.
  const activeVoices = {};

  // Воспроизвести загруженный семпл. Если ещё не загружен — вернуть false.
  // Гасит предыдущий экземпляр этого же семпла (за 30 мс), чтобы не было эха/наложения.
  const playSample = (name, gainMul = 1) => {
    if (!enabled) return true;
    const buf = sampleBuffers[name];
    if (!buf) return false;
    const c = getCtx();
    const now = c.currentTime;

    // Плавно гасим предыдущий экземпляр этого имени (30 мс — незаметно на слух, но убирает наложение)
    const prev = activeVoices[name];
    if (prev && prev.gain) {
      try {
        prev.gain.gain.cancelScheduledValues(now);
        prev.gain.gain.setValueAtTime(prev.gain.gain.value, now);
        prev.gain.gain.linearRampToValueAtTime(0, now + 0.03);
        prev.src.stop(now + 0.035);
      } catch (e) { /* уже остановлен */ }
    }

    const src = c.createBufferSource();
    src.buffer = buf;
    const gain = c.createGain();
    gain.gain.value = gainMul;
    src.connect(gain);
    gain.connect(c.destination);
    src.start(0);
    activeVoices[name] = { src, gain };
    src.onended = () => {
      if (activeVoices[name] && activeVoices[name].src === src) {
        activeVoices[name] = null;
      }
    };
    return true;
  };

  // Базовый строительный блок: один осциллятор с огибающей громкости
  const tone = (freq, type, startTime, duration, gainPeak, fadeIn = 0.01, fadeOut = 0.08) => {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + fadeIn);
    gain.gain.linearRampToValueAtTime(0, startTime + duration - fadeOut);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  // Частотный свип — для "вшух" и подхватов
  const sweep = (fStart, fEnd, type, startTime, duration, gainPeak, fadeIn = 0.01, fadeOut = 0.1) => {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(fStart, startTime);
    osc.frequency.exponentialRampToValueAtTime(fEnd, startTime + duration);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + fadeIn);
    gain.gain.linearRampToValueAtTime(0, startTime + duration - fadeOut);
    osc.start(startTime); osc.stop(startTime + duration);
  };

  // Тон с лёгким вибрато (LFO по частоте) — для "живых" магических нот
  const toneVibrato = (freq, type, startTime, duration, gainPeak, vibRate, vibDepth, fadeIn = 0.02, fadeOut = 0.2) => {
    const c = getCtx();
    const osc = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    lfo.frequency.setValueAtTime(vibRate, startTime);
    lfoGain.gain.setValueAtTime(vibDepth, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain); gain.connect(c.destination);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + fadeIn);
    gain.gain.linearRampToValueAtTime(0, startTime + duration - fadeOut);
    osc.start(startTime); osc.stop(startTime + duration);
    lfo.start(startTime); lfo.stop(startTime + duration);
  };

  // Фильтрованный белый шум со свипом фильтра — для шорохов, "вшух", "дыхания"
  const filteredNoise = (startTime, duration, gainPeak, fStart, fEnd, q, fadeIn = 0.02, fadeOut = 0.15) => {
    const c = getCtx();
    const bufSize = Math.floor(c.sampleRate * duration);
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(fStart, startTime);
    filter.frequency.exponentialRampToValueAtTime(fEnd, startTime + duration);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + fadeIn);
    gain.gain.linearRampToValueAtTime(0, startTime + duration - fadeOut);
    src.connect(filter); filter.connect(gain); gain.connect(c.destination);
    src.start(startTime); src.stop(startTime + duration);
  };

  // Пустышка — используется для звуков, которые ещё не записаны на пианино.
  // Пользователь видит какие события уже озвучены (играют), а какие пока молчат.
  const silent = () => {};

  return {
    setEnabled(v) { enabled = v; },
    loadSample,

    // ── Записаны на пианино (челеста) ──────────────────────────────
    tap()  { if (enabled) playSample('tap',   0.45); },
    place(){ if (enabled) playSample('place', 0.9);  },
    win()  { if (enabled) playSample('win',   0.9);  },

    // ── Пока не записаны — молчат ──────────────────────────────────
    error:         silent,
    lineOk:        silent,
    reveal:        silent,
    boom:          silent,
    transition:    silent,
    buttonHover:   silent,
    buttonPress:   silent,
    hint:          silent,
    chapterUnlock: silent,
    starCollect:   silent,
    dragStart:     silent,
    dragEnd:       silent,
  };
})();

// ─────────── Haptics engine (Vibration API)
const VIB = (() => {
  let enabled = true;
  const vib = (pattern) => {
    if (!enabled || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  };
  return {
    setEnabled(v) { enabled = v; },
    tap()           { vib(8); },
    place()         { vib([6, 30, 10]); },
    error()         { vib([20, 40, 20]); },
    win()           { vib([10, 40, 15, 40, 25]); },
    lineOk()        { vib([6, 20, 12]); },
    reveal()        { vib(5); },
    boom()          { vib([40, 30, 40]); },
    transition()    { vib(12); },
    buttonHover()   { /* без вибрации — hover только на десктопе */ },
    buttonPress()   { /* без вибрации — HUD/меню, по решению пользователя только игровые элементы вибрируют */ },
    hint()          { vib([8, 60, 4]); },
    chapterUnlock() { vib([15, 60, 10, 60, 20, 60, 30]); },
    starCollect()   { vib([6, 30, 14]); },
    dragStart()     { vib(4); },
    dragEnd()       { vib([4, 20, 8]); },
  };
})();

// ─────────── Music engine (HTMLAudioElement — простой, поддерживает loop)
const MUSIC = (() => {
  let el = null;
  let enabled = true;
  let targetVolume = 0.5;
  let currentUrl = null;
  let fadeTimer = null;
  // В Capacitor WebView (Android) mediaPlaybackRequiresUserGesture=false — autoplay разрешён сразу.
  // В обычном браузере первый play() может провалиться, тогда markInteraction сработает от клика.
  let userInteracted = true;

  const ensureEl = () => {
    if (el) return el;
    el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    return el;
  };

  const clearFade = () => {
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
  };

  const fadeTo = (targetVol, ms, onDone) => {
    clearFade();
    if (!el) { onDone && onDone(); return; }
    const startVol = el.volume;
    const steps = Math.max(1, Math.round(ms / 40));
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      const k = i / steps;
      el.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * k));
      if (i >= steps) {
        clearFade();
        onDone && onDone();
      }
    }, 40);
  };

  const tryPlay = () => {
    if (!el || !enabled || !userInteracted) return;
    const p = el.play();
    if (p && p.catch) p.catch(() => { /* autoplay заблокирован — сыграет после первого действия */ });
  };

  return {
    setEnabled(v) {
      enabled = v;
      if (!el) return;
      if (!v) {
        fadeTo(0, 400, () => { el.pause(); });
      } else if (currentUrl) {
        tryPlay();
        fadeTo(targetVolume, 600);
      }
    },
    setVolume(v) {
      targetVolume = Math.max(0, Math.min(1, v));
      if (el && !fadeTimer && enabled) el.volume = targetVolume;
    },
    // Отметить что пользователь взаимодействовал — можно начинать autoplay
    markInteraction() {
      userInteracted = true;
      if (el && enabled && currentUrl && el.paused) tryPlay();
    },
    // Играть трек. Идемпотентно: отменяет любой fade-out, гарантированно возобновляет.
    play(url) {
      ensureEl();
      clearFade(); // отменяем возможный текущий fade-out от stop()
      // Тот же трек — просто убедимся что он играет и вернём громкость
      if (currentUrl === url) {
        if (el.paused) tryPlay();
        fadeTo(targetVolume, 600);
        return;
      }
      // Смена трека
      const start = () => {
        currentUrl = url;
        el.src = url;
        el.volume = 0;
        if (enabled) { tryPlay(); fadeTo(targetVolume, 900); }
      };
      if (el.src && !el.paused) {
        fadeTo(0, 400, () => { el.pause(); start(); });
      } else {
        start();
      }
    },
    // Мягко остановить (без сброса currentUrl — можно возобновить play с тем же url)
    stop() {
      if (!el) return;
      fadeTo(0, 400, () => { if (el) el.pause(); });
    },
  };
})();

// Восстанавливаем настройки из localStorage при загрузке
SFX.setEnabled(localStorage.getItem('mg_sound') !== 'off');
VIB.setEnabled(localStorage.getItem('mg_haptics') !== 'off');
MUSIC.setEnabled(localStorage.getItem('mg_music') !== 'off');
MUSIC.setVolume(0.7);

// Предзагрузка семплов челесты (запускается лениво после первого пользовательского действия)
if (typeof document !== 'undefined' && !window.__mgSamplesQueued) {
  window.__mgSamplesQueued = true;
  const startLoad = () => {
    SFX.loadSample('tap',   'audio/tap.wav');
    SFX.loadSample('place', 'audio/place.wav');
    SFX.loadSample('win',   'audio/win.wav');
    document.removeEventListener('pointerdown', startLoad);
    document.removeEventListener('click', startLoad);
  };
  document.addEventListener('pointerdown', startLoad, { once: true });
  document.addEventListener('click', startLoad, { once: true });
}

// Глобальный click-listener: отмечает первое взаимодействие для запуска музыки (autoplay policy).
// SFX.buttonPress() сейчас молчит — вернём когда будет записана челеста на клик.
if (typeof document !== 'undefined' && !window.__mgClickSfxBound) {
  window.__mgClickSfxBound = true;
  document.addEventListener('click', () => { MUSIC && MUSIC.markInteraction(); }, true);
  document.addEventListener('pointerdown', () => { MUSIC && MUSIC.markInteraction(); }, { once: true });
}

// Автопауза музыки при сворачивании приложения
if (typeof document !== 'undefined' && !window.__mgVisibilityBound) {
  window.__mgVisibilityBound = true;
  document.addEventListener('visibilitychange', () => {
    if (!MUSIC) return;
    if (document.hidden) MUSIC.stop();
    else if (localStorage.getItem('mg_music') !== 'off') {
      // возобновление сработает автоматически если play() был вызван для текущего экрана
    }
  });
}

Object.assign(window, { useT, STRINGS, GoldDust, Candle, Icon, HudButton, CornerFlourish, Astrolabe, Rune, Constellation, SFX, VIB, MUSIC });
