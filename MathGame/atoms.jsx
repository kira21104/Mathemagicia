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
  return (
    <button className="btn-reset" onClick={onClick} aria-label={label} style={{
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

Object.assign(window, { useT, STRINGS, GoldDust, Candle, Icon, HudButton, CornerFlourish, Astrolabe, Rune, Constellation });
