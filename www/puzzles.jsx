// Mathemagicia — Graph & Shapes puzzle (interactive screens)

const { useState: _uS_g, useEffect: _uE_g, useRef: _uR_g, useMemo: _uM_g } = React;

// ─────────────────────────────────────────────────────────────
// GRAPH PUZZLE — Chapter I "Теория соединений"
//
// Правило: проведи цепочку через узлы так, чтобы сумма
// чисел в цепочке равнялась цели (target).
// Цепочка = путь без ветвлений, каждый узел — не более одного раза.
// Граф подсказывает возможные соединения пунктиром.
// ─────────────────────────────────────────────────────────────

// Уровни генерируются динамически через generateGraphLevel() из graph-gen.js
// Прогрессия difficulty 1–10:
//   1–3:  3–4 узла пути, цель 6–10, мало ловушек
//   4–7:  4–5 узлов пути, цель 12–15, ловушки
//   8–10: 5–6 узлов пути, цель 18–20, сложный граф


// ─────────────────────────────────────────────────────────────
// Компонент GraphPuzzle
// Props: onWin, paletteAccent, levelIdx (1-based, дефолт 1)
// ─────────────────────────────────────────────────────────────
// Переводим номер уровня (1-based, бесконечный) в difficulty 1–10
function levelToDifficulty(levelIdx) {
  // Уровни 1–3 → diff 1–3 (обучение)
  // Уровни 4–10 → diff 4–7 (основной диапазон)
  // Уровни 11+ → diff 8–10 (сложные), зацикливаем с вариацией
  if (levelIdx <= 10) return Math.min(levelIdx, 10);
  // После 10-го: difficulty 7–10 по кругу
  return 7 + ((levelIdx - 11) % 4);
}

function GraphPuzzle({ onWin, onSumChange, onHint, paletteAccent = '#4DEEEA', levelIdx = 1 }) {
  const lvl = _uM_g(
    () => generateGraphLevel(levelToDifficulty(levelIdx), levelIdx * 3571 + 13),
    [levelIdx]
  );
  const { nodes: NODES, edges: ALLOWED_EDGES, target: TARGET, hint: HINT } = lvl;

  _uE_g(() => {
    onHint && onHint(HINT);
  }, [HINT]);

  // Нормализуем допустимые рёбра в строки "min-max"
  const allowedSet = new Set(ALLOWED_EDGES.map(([a,b]) => [a,b].sort().join('-')));

  // chain — массив id узлов в порядке соединения
  const [chain, setChain] = _uS_g([]);
  const [dragFrom, setDragFrom] = _uS_g(null);
  const [pointer, setPointer] = _uS_g(null);
  const [trail, setTrail] = _uS_g([]);
  const [error, setError] = _uS_g(null); // строка "a-b" — мигает красным
  const [solved, setSolved] = _uS_g(false);
  const svgRef = _uR_g(null);

  // Текущая сумма цепочки
  const chainSum = chain.reduce((s, id) => {
    const n = NODES.find(nd => nd.id === id);
    return s + (n ? n.n : 0);
  }, 0);

  _uE_g(() => {
    onSumChange && onSumChange(chainSum, TARGET);
  }, [chainSum, TARGET]);

  // Можно ли добавить узел к цепочке
  const canAppend = (toId) => {
    if (chain.includes(toId)) return false;
    if (chain.length === 0) return true;
    const lastId = chain[chain.length - 1];
    const key = [lastId, toId].sort().join('-');
    return allowedSet.has(key);
  };

  // Координаты по событию мыши/тача в SVG-пространстве
  const ptr = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    return {
      x: (cx - rect.left) * (360 / rect.width),
      y: (cy - rect.top)  * (520 / rect.height),
    };
  };

  const startDrag = (node) => (e) => {
    e.preventDefault();
    if (solved) return;
    // Если цепочка не пуста — можно тянуть только с последнего узла
    if (chain.length > 0 && node.id !== chain[chain.length - 1]) return;
    setDragFrom(node);
    setPointer({ x: node.x, y: node.y });
    setTrail([{ x: node.x, y: node.y, id: Date.now() }]);
    setError(null);
  };

  const onMove = (e) => {
    if (!dragFrom) return;
    const p = ptr(e);
    setPointer(p);
    setTrail(t => {
      const last = t[t.length - 1];
      if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 8) {
        return [...t, { x: p.x, y: p.y, id: Math.random() }].slice(-22);
      }
      return t;
    });
  };

  const onUp = (e) => {
    if (!dragFrom) return;
    const p = pointer ?? { x: dragFrom.x, y: dragFrom.y };

    // Найти ближайший узел в радиусе 42px
    let target = null, best = Infinity;
    NODES.forEach(n => {
      if (n.id === dragFrom.id) return;
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d < best && d < 42) { best = d; target = n; }
    });

    if (target) {
      const key = [dragFrom.id, target.id].sort().join('-');
      if (!allowedSet.has(key)) {
        // Ребро не существует в графе
        setError(key);
        SFX && SFX.error(); VIB && VIB.error();
        setTimeout(() => setError(null), 600);
      } else if (chain.includes(target.id)) {
        // Уже в цепочке — ошибка
        setError(key);
        SFX && SFX.error(); VIB && VIB.error();
        setTimeout(() => setError(null), 600);
      } else if (!canAppend(target.id)) {
        // Не продолжение цепочки
        setError(key);
        SFX && SFX.error(); VIB && VIB.error();
        setTimeout(() => setError(null), 600);
      } else {
        // Добавляем узел в цепочку
        const newChain = chain.length === 0
          ? [dragFrom.id, target.id]
          : [...chain, target.id];

        const newSum = newChain.reduce((s, id) => {
          const nd = NODES.find(n => n.id === id);
          return s + (nd ? nd.n : 0);
        }, 0);

        if (newSum > TARGET) {
          // Перебор — сброс
          setError(key);
          SFX && SFX.error(); VIB && VIB.error();
          setTimeout(() => {
            setError(null);
            setChain([]);
          }, 600);
        } else {
          setChain(newChain);
          SFX && SFX.tap(); VIB && VIB.tap();
          if (newSum === TARGET) {
            setSolved(true);
            SFX && SFX.win(); VIB && VIB.win();
            setTimeout(() => onWin && onWin(), 1400);
          }
        }
      }
    }

    setDragFrom(null);
    setPointer(null);
    setTrail([]);
  };

  // Ребро активно (в цепочке)
  const isChainEdge = (a, b) => {
    const key = [a, b].sort().join('-');
    for (let i = 0; i < chain.length - 1; i++) {
      if ([chain[i], chain[i+1]].sort().join('-') === key) return true;
    }
    return false;
  };

  const nodeInChain = (id) => chain.includes(id);
  const isLastInChain = (id) => chain.length > 0 && chain[chain.length - 1] === id;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}
      onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchMove={onMove} onTouchEnd={onUp}>

      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%"
        style={{ touchAction:'none', display:'block' }}>

        {/* Допустимые рёбра — пунктир */}
        <g stroke="rgba(212,175,55,0.2)" strokeWidth="1" strokeDasharray="4 5" fill="none">
          {ALLOWED_EDGES.map(([a,b], i) => {
            const A = NODES.find(n => n.id === a);
            const B = NODES.find(n => n.id === b);
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} />;
          })}
        </g>

        {/* Рёбра цепочки */}
        {ALLOWED_EDGES.map(([a,b], i) => {
          if (!isChainEdge(a, b)) return null;
          const A = NODES.find(n => n.id === a);
          const B = NODES.find(n => n.id === b);
          return (
            <line key={`chain-${i}`}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={solved ? '#E5C158' : paletteAccent}
              strokeWidth={solved ? 3 : 2.5}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${solved ? '#E5C158' : paletteAccent}) drop-shadow(0 0 12px ${solved ? '#E5C158' : paletteAccent})` }}
            />
          );
        })}

        {/* Ошибочное ребро */}
        {error && (() => {
          const [a, b] = error.split('-').map(Number);
          const A = NODES.find(n => n.id === a);
          const B = NODES.find(n => n.id === b);
          if (!A || !B) return null;
          return <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round"
            opacity="0.9"
            style={{ filter:'drop-shadow(0 0 6px #FF6B6B)' }} />;
        })()}

        {/* Линия перетаскивания */}
        {dragFrom && pointer && (
          <line x1={dragFrom.x} y1={dragFrom.y} x2={pointer.x} y2={pointer.y}
            stroke={paletteAccent} strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4"
            style={{ filter:`drop-shadow(0 0 4px ${paletteAccent})` }} />
        )}

        {/* Частицы следа */}
        {trail.map((t, i) => {
          const o = (i + 1) / trail.length;
          return <circle key={t.id} cx={t.x} cy={t.y} r={1.5 + o * 2.5}
            fill={paletteAccent} opacity={o * 0.75}
            style={{ filter:`drop-shadow(0 0 3px ${paletteAccent})` }} />;
        })}

        {/* Узлы */}
        {NODES.map(n => {
          const inChain   = nodeInChain(n.id);
          const isLast    = isLastInChain(n.id);
          const isHovered = dragFrom && dragFrom.id !== n.id && pointer &&
                            Math.hypot(pointer.x - n.x, pointer.y - n.y) < 42;
          const canAdd    = dragFrom && canAppend(n.id) && !inChain;

          const ringColor = solved    ? '#E5C158'
                          : inChain   ? paletteAccent
                          : canAdd    ? 'rgba(255,255,255,0.6)'
                          : 'rgba(212,175,55,0.4)';

          const circleStroke = solved  ? '#E5C158'
                             : isLast  ? '#ffffff'
                             : inChain ? paletteAccent
                             : '#D4AF37';

          return (
            <g key={n.id}
              onMouseDown={startDrag(n)}
              onTouchStart={startDrag(n)}
              style={{ cursor: solved ? 'default' : 'grab' }}>

              {/* Пульсирующий ореол у последнего узла цепочки */}
              {isLast && !solved && (
                <circle cx={n.x} cy={n.y} r="30" fill="none"
                  stroke={paletteAccent} strokeWidth="1" opacity="0.35">
                  <animate attributeName="r" values="26;34;26" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Внешнее кольцо */}
              <circle cx={n.x} cy={n.y} r={isHovered ? 27 : 23}
                fill="none" stroke={ringColor} strokeWidth="1"
                opacity={isHovered || inChain ? 0.9 : 0.45}
                style={{ transition:'r 0.15s ease' }} />

              {/* Основной круг */}
              <circle cx={n.x} cy={n.y} r="19"
                fill={inChain ? 'rgba(20,30,55,0.95)' : 'rgba(11,16,29,0.85)'}
                stroke={circleStroke}
                strokeWidth={isLast ? 2.5 : inChain ? 2 : 1.5}
                style={{
                  filter: (inChain || isHovered)
                    ? `drop-shadow(0 0 6px ${solved ? '#E5C158' : paletteAccent})`
                    : 'none',
                  transition: 'all 0.2s',
                }}
              />

              {/* Число */}
              <text x={n.x} y={n.y + 6} textAnchor="middle"
                fontFamily="Cinzel, serif" fontWeight="500" fontSize="17"
                fill={solved ? '#fff3b8' : inChain ? '#ffffff' : '#E5C158'}>
                {n.n}
              </text>
            </g>
          );
        })}

        {/* Декоративные углы */}
        <g opacity="0.25">
          <circle cx="16" cy="16" r="8" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
          <circle cx="344" cy="16" r="8" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
          <circle cx="16" cy="504" r="8" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
          <circle cx="344" cy="504" r="8" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
        </g>
      </svg>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// SHAPES PUZZLE — Chapter III "Геометрия фигур"
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// MINESWEEPER  —  9×9 grid, tap to reveal, long-press to flag.
// First tap is always safe. Win: all safe cells revealed.
// ─────────────────────────────────────────────────────────────
function msrXr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

function msrMineCount(levelIdx, difficulty = 'normal') {
  const base = levelIdx <= 5 ? 18 : levelIdx <= 15 ? 24 : levelIdx <= 30 ? 30 : 36;
  if (difficulty === 'easy') return Math.max(10, base - 8);
  if (difficulty === 'hard') return Math.min(50, base + 10);
  return base;
}

function msrPlaceMines(firstIdx, total, count, rng) {
  const pool = Array.from({ length: total }, (_, i) => i).filter(i => i !== firstIdx);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return new Set(pool.slice(0, count));
}

function msrNeighbours(idx, cols, total) {
  const r = Math.floor(idx / cols), c = idx % cols;
  const nb = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (dr === 0 && dc === 0) continue;
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < total / cols && nc >= 0 && nc < cols) nb.push(nr * cols + nc);
  }
  return nb;
}

function ShapesPuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1, difficulty = 'normal', lang = 'ru' }) {
  const COLS = 12, ROWS = 12, TOTAL = COLS * ROWS;
  const MINES = msrMineCount(levelIdx, difficulty);

  // SVG layout: сетка центрирована в viewBox 420×580
  const CELL = 35;
  const GRID_X = (420 - COLS * CELL) / 2;
  const GRID_Y = 60;

  const rngSeed = levelIdx * 2971 + 13;

  // Состояние игры
  const [mines, setMines] = _uS_g(null);         // Set<idx> — null до первого хода
  const [revealed, setRevealed] = _uS_g(new Set());
  const [marks, setMarks] = _uS_g(new Map()); // idx → 'flag' | 'question'
  const [dead, setDead] = _uS_g(false);
  const [won, setWon] = _uS_g(false);
  const longPressRef = _uR_g(null);

  // Числа соседей — вычисляем когда мины известны
  const neighbourCount = _uM_g(() => {
    if (!mines) return {};
    const res = {};
    for (let i = 0; i < TOTAL; i++) {
      if (mines.has(i)) continue;
      res[i] = msrNeighbours(i, COLS, TOTAL).filter(n => mines.has(n)).length;
    }
    return res;
  }, [mines]);

  // Flood-fill открытие пустых клеток
  const floodReveal = (startIdx, minesSet, currentRevealed) => {
    const toReveal = new Set(currentRevealed);
    const queue = [startIdx];
    while (queue.length) {
      const idx = queue.shift();
      if (toReveal.has(idx)) continue;
      toReveal.add(idx);
      const nb = msrNeighbours(idx, COLS, TOTAL);
      const cnt = nb.filter(n => minesSet.has(n)).length;
      if (cnt === 0) nb.forEach(n => { if (!toReveal.has(n) && !minesSet.has(n)) queue.push(n); });
    }
    return toReveal;
  };

  const reveal = (idx) => {
    if (dead || won || marks.get(idx) === 'flag' || revealed.has(idx)) return;

    if (!mines) {
      // Первый ход — расставляем мины гарантированно не на этот idx
      const rng = msrXr(rngSeed);
      const minesSet = msrPlaceMines(idx, TOTAL, MINES, rng);
      setMines(minesSet);
      const newRevealed = floodReveal(idx, minesSet, new Set());
      setRevealed(newRevealed);
      SFX && SFX.reveal(); VIB && VIB.reveal();
      // Победа сразу (бывает на маленьких полях)
      if (newRevealed.size === TOTAL - MINES) {
        setWon(true);
        SFX && SFX.win(); VIB && VIB.win();
        setTimeout(() => onWin && onWin(), 1400);
      }
      return;
    }

    if (mines.has(idx)) {
      setRevealed(r => new Set([...r, idx]));
      setDead(true);
      SFX && SFX.boom(); VIB && VIB.boom();
      return;
    }

    const newRevealed = floodReveal(idx, mines, revealed);
    setRevealed(newRevealed);
    SFX && SFX.reveal(); VIB && VIB.reveal();
    if (newRevealed.size === TOTAL - MINES) {
      setWon(true);
      SFX && SFX.win(); VIB && VIB.win();
      setTimeout(() => onWin && onWin(), 1400);
    }
  };

  const toggleMark = (idx) => {
    if (dead || won || revealed.has(idx)) return;
    SFX && SFX.tap(); VIB && VIB.tap();
    setMarks(m => {
      const next = new Map(m);
      const cur = next.get(idx);
      if (!cur)           next.set(idx, 'flag');
      else if (cur === 'flag') next.set(idx, 'question');
      else                next.delete(idx); // question → пусто
      return next;
    });
  };

  const reset = () => {
    setMines(null);
    setRevealed(new Set());
    setMarks(new Map());
    setDead(false);
    setWon(false);
  };

  // Pointer handlers — tap = reveal, long press (500ms) = flag
  const onPointerDown = (idx) => (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    longPressRef.current = setTimeout(() => {
      longPressRef.current = null;
      toggleMark(idx);
    }, 450);
  };

  const onPointerUp = (idx) => (e) => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
      reveal(idx);
    }
  };

  const onPointerCancel = () => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null; }
  };

  // Цвет цифры по количеству соседей (классические цвета сапёра)
  const numColor = n => ['', '#4DEEEA','#57D26B','#FF6B6B','#7B5EA7','#C0392B','#1ABC9C','#2C3E50','#888'][n] || '#888';

  const cellX = idx => GRID_X + (idx % COLS) * CELL + CELL / 2;
  const cellY = idx => GRID_Y + Math.floor(idx / COLS) * CELL + CELL / 2;

  const flagCount = [...marks.values()].filter(v => v === 'flag').length;
  const minesLeft = MINES - flagCount;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <svg viewBox="0 0 420 580" width="100%" height="100%" style={{ touchAction:'none', display:'block' }}>

        {/* Заголовок */}
        <text x="210" y="35" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="13" fill="#D4AF37" letterSpacing="4">III · TENEBRAE</text>

        {/* Счётчик мин и статус */}
        <text x="28" y="55" fontFamily="Comfortaa, sans-serif" fontSize="11" fill="rgba(212,175,55,0.7)">
          {'✦ ' + minesLeft}
        </text>
        {dead && (
          <text x="210" y="55" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
            fontStyle="italic" fontSize="12" fill="#FF6B6B">· tenebrае vicerunt ·</text>
        )}
        {won && (
          <text x="210" y="55" textAnchor="middle" fontFamily="Cormorant Garamond, serif"
            fontStyle="italic" fontSize="12" fill="#E5C158">· lux aeterna ·</text>
        )}

        {/* Сетка */}
        {Array.from({ length: TOTAL }, (_, idx) => {
          const cx = cellX(idx), cy = cellY(idx);
          const isRevealed = revealed.has(idx);
          const mark = marks.get(idx); // 'flag' | 'question' | undefined
          const isMine = mines && mines.has(idx);
          const isBoom = dead && isMine && isRevealed;
          const cnt = neighbourCount[idx] || 0;

          return (
            <g key={idx}
              onPointerDown={onPointerDown(idx)}
              onPointerUp={onPointerUp(idx)}
              onPointerCancel={onPointerCancel}
              style={{ touchAction: 'none', cursor: isRevealed ? 'default' : 'pointer' }}>

              {/* Фон клетки */}
              <rect
                x={GRID_X + (idx % COLS) * CELL + 1}
                y={GRID_Y + Math.floor(idx / COLS) * CELL + 1}
                width={CELL - 2} height={CELL - 2} rx="3"
                fill={
                  isBoom        ? 'rgba(255,80,80,0.35)' :
                  isRevealed    ? 'rgba(11,16,29,0.3)' :
                  'rgba(11,16,29,0.75)'
                }
                stroke={
                  isBoom        ? '#FF6B6B' :
                  isRevealed    ? 'rgba(212,175,55,0.15)' :
                  'rgba(212,175,55,0.35)'
                }
                strokeWidth="0.6"
              />

              {/* Содержимое */}
              {isRevealed && isMine && (
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14">✦</text>
              )}
              {isRevealed && !isMine && cnt > 0 && (
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fontFamily="Cinzel, serif" fontWeight="700" fontSize="14"
                  fill={numColor(cnt)}
                  style={{ filter: `drop-shadow(0 0 3px ${numColor(cnt)})` }}>{cnt}</text>
              )}
              {!isRevealed && mark === 'flag' && (
                <g transform={`translate(${cx}, ${cy})`}
                  style={{ filter: 'drop-shadow(0 0 6px #E5C158)' }}>
                  <polygon points="0,-11 2.8,-2.8 11,0 2.8,2.8 0,11 -2.8,2.8 -11,0 -2.8,-2.8"
                    fill="#E5C158" />
                </g>
              )}
              {!isRevealed && mark === 'question' && (
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fontFamily="Cinzel, serif" fontWeight="700" fontSize="15"
                  fill="rgba(212,175,55,0.75)"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' }}>?</text>
              )}
              {/* Тусклая точка на нераскрытой без метки */}
              {!isRevealed && !mark && (
                <circle cx={cx} cy={cy} r="1.5" fill="rgba(212,175,55,0.25)" />
              )}
            </g>
          );
        })}

        {/* Кнопка рестарта после проигрыша */}
        {dead && (
          <g onClick={reset} style={{ cursor: 'pointer' }}>
            <rect x="150" y="508" width="120" height="36" rx="8"
              fill="rgba(11,16,29,0.9)" stroke="#D4AF37" strokeWidth="1" />
            <text x="210" y="531" textAnchor="middle"
              fontFamily="Cinzel, serif" fontSize="13" fill="#D4AF37" letterSpacing="2">ITERUM</text>
          </g>
        )}

        {/* Подсказка */}
        {!dead && !won && (
          <text x="210" y="558" textAnchor="middle"
            fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="14"
            fill="rgba(212,175,55,0.4)">{lang === 'en' ? '· hold to flag · tap to reveal ·' : '· удержи для флага · тап для открытия ·'}</text>
        )}
      </svg>
    </div>
  );
}

Object.assign(window, { GraphPuzzle, ShapesPuzzle });
