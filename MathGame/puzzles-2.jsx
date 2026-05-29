// Mathemagicia — Magic Square (Chapter II) & Constellation (Chapter IV) puzzles

const { useState: _uS_q, useEffect: _uE_q, useRef: _uR_q, useMemo: _uM_q } = React;

// ─────────────────────────────────────────────────────────────
// MAGIC SQUARE  —  Drag numbered tiles into a 3×3 grid.
// Rows/columns/diagonals must sum to 15. Some cells are seeded.
// ─────────────────────────────────────────────────────────────

// Все 8 трансформаций базовой раскладки (повороты + отражения)
function msTransforms(base) {
  const rot90 = g => [
    [g[2][0], g[1][0], g[0][0]],
    [g[2][1], g[1][1], g[0][1]],
    [g[2][2], g[1][2], g[0][2]],
  ];
  const flip = g => g.map(row => [...row].reverse());
  const t0 = base;
  const t1 = rot90(t0);
  const t2 = rot90(t1);
  const t3 = rot90(t2);
  return [t0, t1, t2, t3, flip(t0), flip(t1), flip(t2), flip(t3)];
}

// Сколько ячеек остаётся открытыми (не запечатанными) по уровню
function msOpenCount(levelIdx) {
  if (levelIdx <= 3)  return 3; // 6 seeded, 3 open
  if (levelIdx <= 6)  return 4; // 5 seeded, 4 open
  if (levelIdx <= 10) return 5; // 4 seeded, 5 open
  if (levelIdx <= 15) return 6; // 3 seeded, 6 open
  return 7;                     // 2 seeded, 7 open
}

// xorshift для детерминированного перемешивания по номеру уровня
function xr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

function msGenLevel(levelIdx) {
  const rng = xr(levelIdx * 1013 + 7);
  const BASE = [[2,7,6],[9,5,1],[4,3,8]];
  const variants = msTransforms(BASE);
  const variantIdx = Math.floor(rng() * 8);
  const solution = variants[variantIdx];

  const openCount = msOpenCount(levelIdx);
  // Все позиции кроме центра (1,1) — центр всегда 5, лучше оставить как подсказку на низких уровнях
  const positions = [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]];
  // Перемешиваем позиции через rng
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  // Открытые позиции — первые openCount из перемешанного списка
  const openSet = new Set(positions.slice(0, openCount).map(([r,c]) => `${r},${c}`));

  // SEED: null для открытых ячеек, значение для закрытых
  const seed = solution.map((row, r) => row.map((v, c) => openSet.has(`${r},${c}`) ? null : v));

  // Перемешиваем числа в лотке
  const remaining = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (seed[r][c] == null) remaining.push(solution[r][c]);
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  return { solution, seed, remaining };
}

function MagicSquarePuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1 }) {
  const { solution: SOLUTION, seed: SEED, remaining: SHUFFLED } = _uM_q(
    () => msGenLevel(levelIdx), [levelIdx]
  );

  // SVG layout in 360 × 520
  const CELL = 70, GRID_X = 75, GRID_Y = 70;
  const cellCenter = (r, c) => ({ x: GRID_X + c * CELL + CELL / 2, y: GRID_Y + r * CELL + CELL / 2 });

  const trayY = 410, traySpacing = 50;
  const TILE_R = 22;
  // Центрируем лоток по количеству фишек
  const trayStartX = 180 - ((SHUFFLED.length - 1) * traySpacing) / 2;

  // Pieces (only the missing-from-seed numbers)
  const initialPieces = SHUFFLED.map((n, i) => ({
    id: `p${i}`, value: n,
    x: trayStartX + i * traySpacing, y: trayY,
    home: { x: trayStartX + i * traySpacing, y: trayY },
    placed: null,
  }));

  const [pieces, setPieces] = _uS_q(initialPieces);
  const [drag, setDrag] = _uS_q(null);
  const [pointer, setPointer] = _uS_q(null);
  const [solved, setSolved] = _uS_q(false);
  const [error, setError] = _uS_q(null);
  const svgRef = _uR_q(null);

  // Compute grid values from placed pieces + seeds
  const gridValues = (() => {
    const g = SEED.map(row => row.slice());
    pieces.forEach(p => { if (p.placed) g[p.placed.r][p.placed.c] = p.value; });
    return g;
  })();

  const sumRow = r => gridValues[r].reduce((s, v) => s + (v || 0), 0);
  const sumCol = c => gridValues.reduce((s, row) => s + (row[c] || 0), 0);
  const sumDiag = (k) => k === 0
    ? gridValues[0][0] + gridValues[1][1] + gridValues[2][2]
    : gridValues[0][2] + gridValues[1][1] + gridValues[2][0];
  const cellFilled = (r, c) => gridValues[r][c] != null;

  // Win check
  _uE_q(() => {
    const filled = gridValues.every(row => row.every(v => v != null));
    if (!filled) return;
    const sums = [sumRow(0), sumRow(1), sumRow(2), sumCol(0), sumCol(1), sumCol(2), sumDiag(0), sumDiag(1)];
    if (sums.every(s => s === 15)) {
      setSolved(true);
      setTimeout(() => onWin && onWin(), 1400);
    }
  }, [pieces]);

  const ptr = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const touch = e.changedTouches ? e.changedTouches[0] : (e.touches ? e.touches[0] : null);
    const cx = touch ? touch.clientX : e.clientX;
    const cy = touch ? touch.clientY : e.clientY;
    return {
      x: (cx - rect.left) * (360 / rect.width),
      y: (cy - rect.top)  * (520 / rect.height),
    };
  };

  const startDrag = (piece) => (e) => {
    e.preventDefault();
    if (solved) return;
    const p = ptr(e);
    const dx = p.x - piece.x;
    const dy = p.y - piece.y;
    setPieces(ps => ps.map(pc => pc.id === piece.id ? { ...pc, placed: null } : pc));
    setDrag({ id: piece.id, dx, dy });
    setPointer(p);
  };

  const onMove = (e) => {
    if (!drag) return;
    const p = ptr(e);
    setPointer(p);
    setPieces(ps => ps.map(pc => pc.id === drag.id ? { ...pc, x: p.x - drag.dx, y: p.y - drag.dy } : pc));
  };

  const onUp = () => {
    if (!drag) return;
    const piece = pieces.find(pc => pc.id === drag.id);
    // Determine nearest empty cell within snap radius
    let target = null, best = Infinity;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (SEED[r][c] != null) continue;
      // Skip if another piece is already in this cell
      if (pieces.some(p => p.id !== piece.id && p.placed && p.placed.r === r && p.placed.c === c)) continue;
      const ctr = cellCenter(r, c);
      const d = Math.hypot(ctr.x - piece.x, ctr.y - piece.y);
      if (d < best && d < 52) { best = d; target = { r, c }; }
    }
    if (target) {
      const ctr = cellCenter(target.r, target.c);
      // Soft check — if cell expects a different number, allow but flash if wrong
      const correct = SOLUTION[target.r][target.c] === piece.value;
      setPieces(ps => ps.map(pc => pc.id === piece.id ? { ...pc, x: ctr.x, y: ctr.y, placed: target } : pc));
      if (!correct) {
        setError({ r: target.r, c: target.c });
        setTimeout(() => setError(null), 700);
      }
    } else {
      // spring back home
      setPieces(ps => ps.map(pc => pc.id === piece.id ? { ...pc, x: pc.home.x, y: pc.home.y, placed: null } : pc));
    }
    setDrag(null);
    setPointer(null);
  };

  // Tile renderer
  const Tile = ({ x, y, value, locked = false, isDrag = false, isErr = false }) => (
    <g transform={`translate(${x}, ${y})`}
      style={{ transition: isDrag ? 'none' : 'transform 0.32s cubic-bezier(.4,1.5,.5,1)' }}>
      {isDrag && <ellipse cx="0" cy="26" rx="22" ry="5" fill="black" opacity="0.5" style={{ filter:'blur(3px)' }} />}
      <g transform={`translate(0, ${isDrag ? -4 : 0}) scale(${isDrag ? 1.08 : 1})`}>
        <circle r={TILE_R} fill="rgba(11,16,29,0.92)"
          stroke={isErr ? '#FF6B6B' : (locked ? '#D4AF37' : (solved ? '#E5C158' : paletteAccent))}
          strokeWidth={locked ? 1.4 : 1.8}
          style={{
            filter: isErr ? 'drop-shadow(0 0 6px #FF6B6B)' :
              ((locked && !solved) ? 'none' : `drop-shadow(0 0 6px ${solved ? '#E5C158' : paletteAccent})`),
          }} />
        <text x="0" y="6" textAnchor="middle"
          fontFamily="Cinzel, serif" fontWeight="600" fontSize="18"
          fill={locked ? '#D4AF37' : (solved ? '#fff3b8' : '#fff')}>{value}</text>
      </g>
    </g>
  );

  // Magic-line indicator (gold when sum=15)
  const sumLabel = (s, x, y, hidden, key) => {
    if (hidden) return null;
    const ok = s === 15;
    return (
      <g key={key} transform={`translate(${x}, ${y})`}>
        <text textAnchor="middle"
          fontFamily="Comfortaa, sans-serif" fontSize="11" letterSpacing="1.5"
          fill={ok ? '#E5C158' : (s > 15 ? '#FF6B6B' : 'rgba(212,175,55,0.55)')}
          style={{ filter: ok ? 'drop-shadow(0 0 4px #E5C158)' : 'none' }}>
          {s || '·'}
        </text>
      </g>
    );
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%"
        style={{ touchAction:'none', display:'block' }}
        onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchMove={onMove} onTouchEnd={onUp}>
        {/* Chapter mark */}
        <text x="180" y="40" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="13" fill="#D4AF37" letterSpacing="4">II · QUADRATUM</text>

        {/* Decorative mandala behind grid */}
        <g opacity="0.18" transform={`translate(${GRID_X + CELL*1.5}, ${GRID_Y + CELL*1.5})`}>
          <circle r="130" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle r="100" fill="none" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="2 4" />
          {Array.from({length: 8}).map((_, i) => (
            <line key={i} x1="0" y1="0" x2="0" y2="-130"
              transform={`rotate(${i*45})`} stroke="#D4AF37" strokeWidth="0.3" />
          ))}
        </g>

        {/* Grid */}
        <g>
          {[0,1,2].flatMap(r => [0,1,2].map(c => {
            const isErr = error && error.r === r && error.c === c;
            const filled = cellFilled(r, c);
            const seeded = SEED[r][c] != null;
            return (
              <rect key={`${r}-${c}`}
                x={GRID_X + c * CELL} y={GRID_Y + r * CELL}
                width={CELL} height={CELL}
                fill={filled ? 'rgba(11,16,29,0.4)' : 'rgba(11,16,29,0.7)'}
                stroke={isErr ? '#FF6B6B' : (seeded ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.55)')}
                strokeWidth="0.8"
                strokeDasharray={filled ? 'none' : (seeded ? 'none' : '3 3')}
              />
            );
          }))}
        </g>

        {/* Diagonal cross (when in win state) */}
        {solved && (
          <g stroke="#E5C158" strokeWidth="1" opacity="0.6">
            <line x1={GRID_X} y1={GRID_Y} x2={GRID_X + 3*CELL} y2={GRID_Y + 3*CELL} style={{filter:'drop-shadow(0 0 4px #E5C158)'}} />
            <line x1={GRID_X + 3*CELL} y1={GRID_Y} x2={GRID_X} y2={GRID_Y + 3*CELL} style={{filter:'drop-shadow(0 0 4px #E5C158)'}} />
          </g>
        )}

        {/* Row sums */}
        {[0,1,2].map(r => sumLabel(sumRow(r), GRID_X + 3*CELL + 22, GRID_Y + r*CELL + CELL/2 + 4, false, `r${r}`))}
        {/* Col sums */}
        {[0,1,2].map(c => sumLabel(sumCol(c), GRID_X + c*CELL + CELL/2, GRID_Y - 12, false, `c${c}`))}
        {/* Diag sums */}
        {sumLabel(sumDiag(0), GRID_X - 18, GRID_Y - 12, false, 'd0')}
        {sumLabel(sumDiag(1), GRID_X + 3*CELL + 18, GRID_Y - 12, false, 'd1')}

        {/* Seeded numbers (always in grid, never draggable) */}
        {[0,1,2].flatMap(r => [0,1,2].map(c => {
          if (SEED[r][c] == null) return null;
          const { x, y } = cellCenter(r, c);
          return <Tile key={`s${r}${c}`} x={x} y={y} value={SEED[r][c]} locked={true} />;
        }))}

        {/* Tray divider */}
        <line x1="40" y1={trayY - 35} x2="320" y2={trayY - 35} stroke="#D4AF37" strokeOpacity="0.3" strokeDasharray="1 3" strokeWidth="0.6" />
        <text x="180" y={trayY - 42} textAnchor="middle" fontFamily="Cinzel, serif"
          fontSize="10" letterSpacing="3" fill="rgba(212,175,55,0.55)">·  NUMERI  ·</text>

        {/* Draggable pieces */}
        {pieces.map(p => {
          const isDrag = drag && drag.id === p.id;
          const isErr = error && p.placed && error.r === p.placed.r && error.c === p.placed.c;
          return (
            <g key={p.id} onMouseDown={startDrag(p)} onTouchStart={startDrag(p)}
              style={{ cursor: solved ? 'default' : 'grab' }}>
              <Tile x={p.x} y={p.y} value={p.value} isDrag={isDrag} isErr={isErr} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION  —  Connect numbered stars 1 → 2 → 3 → …
// Each step emits a cyan trail; finishing the sequence reveals a constellation.
// ─────────────────────────────────────────────────────────────
function ConstellationPuzzle({ onWin, paletteAccent = '#4DEEEA' }) {
  // Numbered stars in order. Layout in 360x520
  const STARS = [
    { id: 1, x:  70, y: 110 },
    { id: 2, x: 160, y:  80 },
    { id: 3, x: 250, y: 120 },
    { id: 4, x: 290, y: 220 },
    { id: 5, x: 220, y: 290 },
    { id: 6, x: 130, y: 300 },
    { id: 7, x:  60, y: 230 },
    { id: 8, x: 180, y: 200 },  // central — return
    { id: 9, x: 270, y: 410 },
    { id: 10, x: 100, y: 410 },
  ];
  const NEXT = STARS.length;

  const [edges, setEdges] = _uS_q([]); // [{a,b}]
  const [connected, setConnected] = _uS_q([1]); // chain so far (ids in order)
  const [dragFrom, setDragFrom] = _uS_q(null);
  const [pointer, setPointer] = _uS_q(null);
  const [trail, setTrail] = _uS_q([]);
  const [error, setError] = _uS_q(null);
  const [solved, setSolved] = _uS_q(false);
  const svgRef = _uR_q(null);

  _uE_q(() => {
    if (connected.length === NEXT) {
      setSolved(true);
      setTimeout(() => onWin && onWin(), 1500);
    }
  }, [connected]);

  const ptr = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left) * (360 / rect.width);
    const y = ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top) * (520 / rect.height);
    return { x, y };
  };

  const lastConnected = connected[connected.length - 1];

  const startDrag = (star) => (e) => {
    e.preventDefault();
    if (star.id !== lastConnected) {
      // Show subtle error pulse to inform user
      setError(star.id);
      setTimeout(() => setError(null), 600);
      return;
    }
    setDragFrom(star);
    setPointer({ x: star.x, y: star.y });
    setTrail([{ x: star.x, y: star.y, id: Date.now() }]);
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

  const onUp = () => {
    if (!dragFrom) { return; }
    const p = pointer || { x: dragFrom.x, y: dragFrom.y };
    let target = null, best = Infinity;
    STARS.forEach(s => {
      if (s.id === dragFrom.id) return;
      const d = Math.hypot(s.x - p.x, s.y - p.y);
      if (d < best && d < 38) { best = d; target = s; }
    });
    if (target) {
      const expected = lastConnected + 1;
      if (target.id === expected) {
        setEdges(e => [...e, { a: dragFrom.id, b: target.id }]);
        setConnected(c => [...c, target.id]);
      } else {
        setError(target.id);
        setTimeout(() => setError(null), 700);
      }
    }
    setDragFrom(null);
    setPointer(null);
    setTrail([]);
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}
      onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchMove={onMove} onTouchEnd={onUp}>
      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%" style={{ touchAction:'none', display:'block' }}>
        {/* Chapter mark */}
        <text x="180" y="40" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="13" fill="#D4AF37" letterSpacing="4">IV · ASTRA</text>

        {/* Backdrop — fine star dust + zodiac ring */}
        <g opacity="0.5">
          {Array.from({length: 60}).map((_, i) => {
            const x = ((i * 37) % 340) + 10;
            const y = ((i * 71) % 460) + 50;
            const r = ((i * 13) % 7) / 10 + 0.4;
            return <circle key={i} cx={x} cy={y} r={r} fill="#E5C158" opacity={(i % 4) * 0.18 + 0.15} />;
          })}
        </g>
        <g opacity="0.18" transform="translate(180, 250)">
          <circle r="170" fill="none" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="1 4" />
          <circle r="140" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
          {Array.from({length: 12}).map((_, i) => (
            <g key={i} transform={`rotate(${i*30})`}>
              <line x1="0" y1="-170" x2="0" y2="-180" stroke="#D4AF37" strokeWidth="0.6" />
            </g>
          ))}
        </g>

        {/* Hint outline of full constellation — very faint */}
        <g stroke="rgba(212,175,55,0.16)" strokeWidth="0.6" strokeDasharray="2 4" fill="none">
          {STARS.slice(0, -1).map((s, i) => {
            const t = STARS[i + 1];
            return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} />;
          })}
        </g>

        {/* Player connections */}
        {edges.map((e, i) => {
          const A = STARS.find(s => s.id === e.a);
          const B = STARS.find(s => s.id === e.b);
          const gold = solved;
          return (
            <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={gold ? '#E5C158' : paletteAccent}
              strokeWidth={gold ? 2.6 : 2.0} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 5px ${gold ? '#E5C158' : paletteAccent}) drop-shadow(0 0 12px ${gold ? '#E5C158' : paletteAccent})` }} />
          );
        })}

        {/* Drag line */}
        {dragFrom && pointer && (
          <line x1={dragFrom.x} y1={dragFrom.y} x2={pointer.x} y2={pointer.y}
            stroke={paletteAccent} strokeWidth="1.8" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${paletteAccent})` }} />
        )}

        {/* Trail */}
        {trail.map((t, i) => {
          const o = (i + 1) / trail.length;
          return <circle key={t.id} cx={t.x} cy={t.y} r={1.5 + o * 2}
            fill={paletteAccent} opacity={o * 0.9}
            style={{ filter: `drop-shadow(0 0 4px ${paletteAccent})` }} />;
        })}

        {/* Stars */}
        {STARS.map(s => {
          const isConnected = connected.includes(s.id);
          const isNext = s.id === lastConnected + 1;
          const isCurrent = s.id === lastConnected;
          const isErr = error === s.id;
          const r = isCurrent ? 13 : (isNext ? 10 : 8);
          const col = solved ? '#E5C158' : (isConnected ? paletteAccent : '#D4AF37');
          return (
            <g key={s.id}
              onMouseDown={startDrag(s)} onTouchStart={startDrag(s)}
              style={{ cursor: 'grab' }}>
              {/* Pulse on the next available */}
              {(isCurrent || (isNext && !dragFrom)) && !solved && (
                <circle cx={s.x} cy={s.y} r={r + 6} fill="none"
                  stroke={paletteAccent} strokeWidth="0.7" opacity="0.5">
                  <animate attributeName="r" values={`${r+3};${r+12};${r+3}`} dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Star 4-point glyph */}
              <g transform={`translate(${s.x}, ${s.y})`}
                style={{ filter: isErr ? 'drop-shadow(0 0 6px #FF6B6B)' : (isConnected || isCurrent ? `drop-shadow(0 0 6px ${col})` : 'drop-shadow(0 0 3px rgba(212,175,55,0.4))') }}>
                <polygon points={`0,${-r} ${r*0.3},${-r*0.3} ${r},0 ${r*0.3},${r*0.3} 0,${r} ${-r*0.3},${r*0.3} ${-r},0 ${-r*0.3},${-r*0.3}`}
                  fill={isErr ? '#FF6B6B' : (isConnected ? col : 'rgba(11,16,29,0.8)')}
                  stroke={isErr ? '#FF6B6B' : col}
                  strokeWidth="1" />
                {/* Number */}
                <text x="0" y={r + 13} textAnchor="middle"
                  fontFamily="Comfortaa, sans-serif" fontSize="10" letterSpacing="1"
                  fill={isErr ? '#FF6B6B' : col} opacity="0.95">{s.id}</text>
              </g>
            </g>
          );
        })}

        {/* Hint line */}
        <text x="180" y="490" textAnchor="middle"
          fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="12"
          fill="rgba(212,175,55,0.55)">
          {solved ? '· Constellatio revelata ·' : `· Соедините звезду ${lastConnected} → ${Math.min(lastConnected + 1, NEXT)} ·`}
        </text>
      </svg>
    </div>
  );
}

Object.assign(window, { MagicSquarePuzzle, ConstellationPuzzle });
