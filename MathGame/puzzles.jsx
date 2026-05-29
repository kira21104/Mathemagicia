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
    () => generateGraphLevel(levelToDifficulty(levelIdx)),
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
        setTimeout(() => setError(null), 600);
      } else if (chain.includes(target.id)) {
        // Уже в цепочке — ошибка
        setError(key);
        setTimeout(() => setError(null), 600);
      } else if (!canAppend(target.id)) {
        // Не продолжение цепочки
        setError(key);
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
          setTimeout(() => {
            setError(null);
            setChain([]);
          }, 600);
        } else {
          setChain(newChain);
          if (newSum === TARGET) {
            setSolved(true);
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

function ShapesPuzzle({ onWin, paletteAccent = '#4DEEEA' }) {
  const SLOTS = [
    { id: 'tri', x: 90,  y: 380, shape: 'tri' },
    { id: 'cir', x: 180, y: 380, shape: 'cir' },
    { id: 'sqr', x: 270, y: 380, shape: 'sqr' },
  ];
  const STARTS = [
    { id: 'cir', x: 90,  y: 130, shape: 'cir', label: 3 },
    { id: 'tri', x: 270, y: 130, shape: 'tri', label: 5 },
    { id: 'sqr', x: 180, y: 220, shape: 'sqr', label: 2 },
  ];
  const [pieces, setPieces] = _uS_g(STARTS);
  const [drag, setDrag] = _uS_g(null);
  const [pointer, setPointer] = _uS_g(null);
  const [placed, setPlaced] = _uS_g({});
  const [solved, setSolved] = _uS_g(false);
  const svgRef = _uR_g(null);

  _uE_g(() => {
    if (Object.keys(placed).length === SLOTS.length) {
      setSolved(true);
      setTimeout(() => onWin && onWin(), 1400);
    }
  }, [placed]);

  const ptr = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    return {
      x: (cx - rect.left) * (360 / rect.width),
      y: (cy - rect.top)  * (520 / rect.height),
    };
  };

  const startDrag = (piece) => (e) => {
    e.preventDefault();
    if (placed[piece.id] || solved) return;
    setDrag(piece);
    setPointer(ptr(e));
  };

  const onMove = (e) => {
    if (!drag) return;
    setPointer(ptr(e));
  };

  const onUp = () => {
    if (!drag || !pointer) { setDrag(null); return; }
    const slot = SLOTS.find(s =>
      s.shape === drag.shape && Math.hypot(s.x - pointer.x, s.y - pointer.y) < 40
    );
    if (slot && !Object.values(placed).includes(slot.id)) {
      setPlaced(p => ({ ...p, [drag.id]: slot.id }));
      setPieces(ps => ps.map(p => p.id === drag.id ? { ...p, x: slot.x, y: slot.y } : p));
    }
    setDrag(null);
    setPointer(null);
  };

  const ShapeGlyph = ({ shape, x, y, size = 28, color, opacity = 1 }) => {
    const s = size;
    if (shape === 'cir') return <circle cx={x} cy={y} r={s * 0.55} fill="none" stroke={color} strokeWidth="2" opacity={opacity} />;
    if (shape === 'tri') return <polygon
      points={`${x},${y - s * 0.65} ${x + s * 0.6},${y + s * 0.45} ${x - s * 0.6},${y + s * 0.45}`}
      fill="none" stroke={color} strokeWidth="2" opacity={opacity} />;
    if (shape === 'sqr') return <rect x={x - s * 0.5} y={y - s * 0.5} width={s} height={s}
      fill="none" stroke={color} strokeWidth="2" opacity={opacity} />;
    return null;
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}
      onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchMove={onMove} onTouchEnd={onUp}>
      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%"
        style={{ touchAction:'none', display:'block' }}>

        {/* Слоты */}
        {SLOTS.map(s => (
          <g key={s.id}>
            <circle cx={s.x} cy={s.y} r="36"
              fill="rgba(212,175,55,0.06)" stroke="rgba(212,175,55,0.35)" strokeWidth="1" strokeDasharray="4 4" />
            <ShapeGlyph shape={s.shape} x={s.x} y={s.y} size={32}
              color={placed[s.id] ? paletteAccent : 'rgba(212,175,55,0.4)'} />
          </g>
        ))}

        {/* Фигуры */}
        {pieces.map(p => {
          const isPlaced = !!placed[p.id];
          const isDragging = drag?.id === p.id;
          const px = isDragging && pointer ? pointer.x : p.x;
          const py = isDragging && pointer ? pointer.y : p.y;
          return (
            <g key={p.id}
              onMouseDown={startDrag(p)} onTouchStart={startDrag(p)}
              style={{ cursor: isPlaced ? 'default' : 'grab' }}>
              <circle cx={px} cy={py} r="34"
                fill={isPlaced ? 'rgba(77,238,234,0.1)' : 'rgba(11,16,29,0.85)'}
                stroke={isPlaced ? paletteAccent : '#D4AF37'}
                strokeWidth={isPlaced ? 2 : 1.5}
                style={{ filter: isPlaced ? `drop-shadow(0 0 8px ${paletteAccent})` : 'none' }} />
              <ShapeGlyph shape={p.shape} x={px} y={py} size={30}
                color={isPlaced ? '#fff3b8' : '#E5C158'} />
              <text x={px} y={py + 50} textAnchor="middle"
                fontFamily="Cinzel, serif" fontSize="13" fill="rgba(229,193,88,0.7)">{p.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

Object.assign(window, { GraphPuzzle, ShapesPuzzle });
