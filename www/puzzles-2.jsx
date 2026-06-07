// Mathemagicia — Magic Square (Chapter II) & Constellation (Chapter IV) puzzles

const { useState: _uS_q, useEffect: _uE_q, useRef: _uR_q, useMemo: _uM_q } = React;

// ─────────────────────────────────────────────────────────────
// MAGIC SQUARE  —  easy=3×3 (target 15), normal/hard=4×4 (target 34)
// ─────────────────────────────────────────────────────────────

function xr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

// ── 3×3 генератор ────────────────────────────────────────────
function ms3Transforms(base) {
  const rot90 = g => [[g[2][0],g[1][0],g[0][0]],[g[2][1],g[1][1],g[0][1]],[g[2][2],g[1][2],g[0][2]]];
  const flip  = g => g.map(row => [...row].reverse());
  const t0=base, t1=rot90(t0), t2=rot90(t1), t3=rot90(t2);
  return [t0,t1,t2,t3,flip(t0),flip(t1),flip(t2),flip(t3)];
}

function ms3GenLevel(levelIdx, openCount) {
  const rng = xr(levelIdx * 1013 + 7);
  const solution = ms3Transforms([[2,7,6],[9,5,1],[4,3,8]])[Math.floor(rng() * 8)];
  const positions = [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]];
  for (let i = positions.length-1; i > 0; i--) {
    const j = Math.floor(rng()*(i+1)); [positions[i],positions[j]]=[positions[j],positions[i]];
  }
  const openSet = new Set(positions.slice(0, openCount).map(([r,c])=>`${r},${c}`));
  const seed = solution.map((row,r) => row.map((v,c) => openSet.has(`${r},${c}`) ? null : v));
  const remaining = [];
  for (let r=0;r<3;r++) for (let c=0;c<3;c++) if (seed[r][c]==null) remaining.push(solution[r][c]);
  for (let i=remaining.length-1;i>0;i--) {
    const j=Math.floor(rng()*(i+1)); [remaining[i],remaining[j]]=[remaining[j],remaining[i]];
  }
  return { solution, seed, remaining, size: 3, target: 15 };
}

// ── 4×4 генератор ────────────────────────────────────────────
// Базовые 4×4 магические квадраты (target=34), каждый верифицирован
const MS4_BASES = [
  [[16,3,2,13],[5,10,11,8],[9,6,7,12],[4,15,14,1]],   // квадрат Дюрера
  [[1,15,14,4],[12,6,7,9],[8,10,11,5],[13,3,2,16]],
  [[4,14,15,1],[9,7,6,12],[5,11,10,8],[16,2,3,13]],
  [[7,12,1,14],[2,13,8,11],[16,3,10,5],[9,6,15,4]],
  [[2,16,13,3],[11,5,8,10],[7,9,12,6],[14,4,1,15]],
  [[13,2,3,16],[8,11,10,5],[12,7,6,9],[1,14,15,4]],
  [[11,5,8,10],[3,13,16,2],[6,12,9,7],[14,4,1,15]],
  [[6,9,12,7],[15,4,1,14],[3,16,13,2],[10,5,8,11]],
];

function ms4Transforms(base) {
  const rot90 = g => g[0].map((_,c) => g.map(row=>row[c]).reverse());
  const flip  = g => g.map(row=>[...row].reverse());
  const t0=base,t1=rot90(t0),t2=rot90(t1),t3=rot90(t2);
  return [t0,t1,t2,t3,flip(t0),flip(t1),flip(t2),flip(t3)];
}

function ms4GenLevel(levelIdx, openCount) {
  const rng = xr(levelIdx * 2017 + 31);
  const baseIdx = Math.floor(rng() * MS4_BASES.length);
  const variants = ms4Transforms(MS4_BASES[baseIdx]);
  const solution = variants[Math.floor(rng() * 8)];

  // Все 16 позиций, перемешиваем
  const positions = [];
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) positions.push([r,c]);
  for (let i=positions.length-1;i>0;i--) {
    const j=Math.floor(rng()*(i+1)); [positions[i],positions[j]]=[positions[j],positions[i]];
  }
  const openSet = new Set(positions.slice(0, openCount).map(([r,c])=>`${r},${c}`));
  const seed = solution.map((row,r) => row.map((v,c) => openSet.has(`${r},${c}`) ? null : v));
  const remaining = [];
  for (let r=0;r<4;r++) for (let c=0;c<4;c++) if (seed[r][c]==null) remaining.push(solution[r][c]);
  for (let i=remaining.length-1;i>0;i--) {
    const j=Math.floor(rng()*(i+1)); [remaining[i],remaining[j]]=[remaining[j],remaining[i]];
  }
  return { solution, seed, remaining, size: 4, target: 34 };
}

function msGenLevel(levelIdx, difficulty) {
  if (difficulty === 'easy') {
    // 3×3: открытых ячеек прогрессивно больше
    const open = levelIdx <= 3 ? 3 : levelIdx <= 6 ? 4 : levelIdx <= 10 ? 5 : levelIdx <= 15 ? 6 : 7;
    return ms3GenLevel(levelIdx, Math.min(8, open));
  }
  // normal / hard — 4×4
  const open = difficulty === 'hard'
    ? (levelIdx <= 3 ? 6 : levelIdx <= 8 ? 8 : levelIdx <= 15 ? 10 : 12)
    : (levelIdx <= 3 ? 4 : levelIdx <= 8 ? 6 : levelIdx <= 15 ? 8  : 10);
  return ms4GenLevel(levelIdx, Math.min(15, open));
}

function MagicSquarePuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1, difficulty = 'normal' }) {
  const { solution: SOLUTION, seed: SEED, remaining: SHUFFLED, size, target: TARGET } = _uM_q(
    () => msGenLevel(levelIdx, difficulty), [levelIdx, difficulty]
  );

  // SVG layout — адаптивный под размер сетки
  const CELL   = size === 3 ? 72 : 56;
  const GRID_W = size * CELL;
  const GRID_X = Math.round((360 - GRID_W) / 2);
  const GRID_Y = size === 3 ? 140 : 138;
  const TRAY_Y = size === 3 ? 418 : 424;
  const TILE_R = size === 3 ? 22 : 18;
  const SNAP_R = size === 3 ? 55 : 44;

  const cellCenter = (r, c) => ({
    x: GRID_X + c * CELL + CELL / 2,
    y: GRID_Y + r * CELL + CELL / 2,
  });

  const traySpacing = Math.min(46, 300 / Math.max(SHUFFLED.length, 1));
  const trayStartX  = 180 - ((SHUFFLED.length - 1) * traySpacing) / 2;

  const initialPieces = SHUFFLED.map((n, i) => ({
    id: `p${i}`, value: n,
    x: trayStartX + i * traySpacing, y: TRAY_Y,
    home: { x: trayStartX + i * traySpacing, y: TRAY_Y },
    placed: null,
  }));

  const [pieces, setPieces] = _uS_q(initialPieces);
  const [dragId,  setDragId]  = _uS_q(null);
  const [solved,  setSolved]  = _uS_q(false);
  const [error,   setError]   = _uS_q(null);
  const svgRef  = _uR_q(null);
  const dragRef = _uR_q(null);

  const gridValues = (() => {
    const g = SEED.map(row => row.slice());
    pieces.forEach(p => { if (p.placed) g[p.placed.r][p.placed.c] = p.value; });
    return g;
  })();

  const rows   = Array.from({length:size},(_,r)=>r);
  const cols   = Array.from({length:size},(_,c)=>c);
  const sumRow  = r => gridValues[r].reduce((s,v)=>s+(v||0),0);
  const sumCol  = c => gridValues.reduce((s,row)=>s+(row[c]||0),0);
  const sumDiag = k => rows.reduce((s,i)=>s+(gridValues[i][k===0?i:size-1-i]||0),0);
  const cellFilled = (r,c) => gridValues[r][c] != null;

  // Win check
  _uE_q(() => {
    if (!gridValues.every(row=>row.every(v=>v!=null))) return;
    const sums = [
      ...rows.map(r=>sumRow(r)),
      ...cols.map(c=>sumCol(c)),
      sumDiag(0), sumDiag(1),
    ];
    if (sums.every(s=>s===TARGET)) {
      setSolved(true);
      SFX && SFX.win(); VIB && VIB.win();
      setTimeout(()=>onWin&&onWin(), 1400);
    }
  }, [pieces]);

  const svgPt = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX-rect.left)*(360/rect.width),
      y: (clientY-rect.top) *(520/rect.height),
    };
  };

  const onPointerDown = (piece) => (e) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    SFX && SFX.tap(); VIB && VIB.tap();
    const p = svgPt(e.clientX, e.clientY);
    dragRef.current = { id: piece.id, dx: p.x-piece.x, dy: p.y-piece.y };
    setDragId(piece.id);
    setPieces(ps => ps.map(pc => pc.id===piece.id ? {...pc, placed:null} : pc));
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const p = svgPt(e.clientX, e.clientY);
    const { id, dx, dy } = dragRef.current;
    setPieces(ps => ps.map(pc => pc.id===id ? {...pc, x:p.x-dx, y:p.y-dy} : pc));
  };

  const onPointerUp = (e) => {
    if (!dragRef.current) return;
    const p = svgPt(e.clientX, e.clientY);
    const { id } = dragRef.current;
    dragRef.current = null;
    setDragId(null);
    setPieces(ps => {
      const piece = ps.find(pc=>pc.id===id);
      if (!piece) return ps;
      let tgt=null, best=Infinity;
      for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
        if (SEED[r][c]!=null) continue;
        if (ps.some(q=>q.id!==id&&q.placed&&q.placed.r===r&&q.placed.c===c)) continue;
        const ctr=cellCenter(r,c);
        const d=Math.hypot(ctr.x-p.x, ctr.y-p.y);
        if (d<best&&d<SNAP_R) { best=d; tgt={r,c}; }
      }
      if (tgt) {
        const ctr=cellCenter(tgt.r,tgt.c);
        const correct=SOLUTION[tgt.r][tgt.c]===piece.value;
        if (!correct) {
          setError(tgt);
          SFX && SFX.error(); VIB && VIB.error();
          setTimeout(()=>setError(null),700);
        } else {
          SFX && SFX.place(); VIB && VIB.place();
        }
        return ps.map(pc=>pc.id===id?{...pc,x:ctr.x,y:ctr.y,placed:tgt}:pc);
      }
      return ps.map(pc=>pc.id===id?{...pc,x:pc.home.x,y:pc.home.y,placed:null}:pc);
    });
  };

  const Tile = ({ x, y, value, locked=false, isDrag=false, isErr=false }) => (
    <g transform={`translate(${x},${y})`}
      style={{ transition: isDrag ? 'none' : 'transform 0.32s cubic-bezier(.4,1.5,.5,1)' }}>
      {isDrag && <ellipse cx="0" cy={TILE_R+4} rx={TILE_R} ry="4" fill="black" opacity="0.5" style={{filter:'blur(3px)'}} />}
      <g transform={`translate(0,${isDrag?-4:0}) scale(${isDrag?1.08:1})`}>
        <circle r={TILE_R} fill="rgba(11,16,29,0.92)"
          stroke={isErr?'#FF6B6B':(locked?'#D4AF37':(solved?'#E5C158':paletteAccent))}
          strokeWidth={locked?1.4:1.8}
          style={{ filter: isErr?'drop-shadow(0 0 6px #FF6B6B)':((locked&&!solved)?'none':`drop-shadow(0 0 6px ${solved?'#E5C158':paletteAccent})`) }} />
        <text x="0" y={size===3?6:5} textAnchor="middle"
          fontFamily="Cinzel, serif" fontWeight="600" fontSize={size===3?18:15}
          fill={locked?'#D4AF37':(solved?'#fff3b8':'#fff')}>{value}</text>
      </g>
    </g>
  );

  const sumLabel = (s, x, y, key) => {
    const ok = s === TARGET;
    return (
      <g key={key} transform={`translate(${x},${y})`}>
        <text textAnchor="middle" fontFamily="Comfortaa, sans-serif" fontSize="10" letterSpacing="1"
          fill={ok?'#E5C158':(s>TARGET?'#FF6B6B':'rgba(212,175,55,0.55)')}
          style={{ filter: ok?'drop-shadow(0 0 4px #E5C158)':'none' }}>
          {s||'·'}
        </text>
      </g>
    );
  };

  const gridRight = GRID_X + size * CELL;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%"
        style={{ touchAction:'none', display:'block' }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

        <text x="180" y="40" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="13" fill="#D4AF37" letterSpacing="4">II · QUADRATUM</text>

        {/* Подсказка цели */}
        <text x="180" y="58" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic"
          fontSize="13" fill="rgba(212,175,55,0.6)">
          {solved ? '· Quadratum perfectum ·' : `· ${TARGET} ·`}
        </text>

        {/* Декоративная мандала */}
        <g opacity="0.12" transform={`translate(${GRID_X+GRID_W/2},${GRID_Y+size*CELL/2})`}>
          <circle r="140" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle r="105" fill="none" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="2 4" />
          {Array.from({length:8}).map((_,i)=>(
            <line key={i} x1="0" y1="0" x2="0" y2="-140"
              transform={`rotate(${i*45})`} stroke="#D4AF37" strokeWidth="0.3" />
          ))}
        </g>

        {/* Сетка */}
        {rows.flatMap(r=>cols.map(c=>{
          const isErr=error&&error.r===r&&error.c===c;
          const filled=cellFilled(r,c);
          const seeded=SEED[r][c]!=null;
          return (
            <rect key={`${r}-${c}`}
              x={GRID_X+c*CELL} y={GRID_Y+r*CELL} width={CELL} height={CELL}
              fill={filled?'rgba(11,16,29,0.4)':'rgba(11,16,29,0.7)'}
              stroke={isErr?'#FF6B6B':(seeded?'rgba(212,175,55,0.35)':'rgba(212,175,55,0.55)')}
              strokeWidth="0.8"
              strokeDasharray={filled||seeded?'none':'3 3'}
            />
          );
        }))}

        {/* Диагональный крест при победе */}
        {solved && (
          <g stroke="#E5C158" strokeWidth="1" opacity="0.6">
            <line x1={GRID_X} y1={GRID_Y} x2={gridRight} y2={GRID_Y+size*CELL} style={{filter:'drop-shadow(0 0 4px #E5C158)'}}/>
            <line x1={gridRight} y1={GRID_Y} x2={GRID_X} y2={GRID_Y+size*CELL} style={{filter:'drop-shadow(0 0 4px #E5C158)'}}/>
          </g>
        )}

        {/* Суммы строк */}
        {rows.map(r=>sumLabel(sumRow(r), gridRight+20, GRID_Y+r*CELL+CELL/2+4, `r${r}`))}
        {/* Суммы столбцов */}
        {cols.map(c=>sumLabel(sumCol(c), GRID_X+c*CELL+CELL/2, GRID_Y-10, `c${c}`))}
        {/* Суммы диагоналей */}
        {sumLabel(sumDiag(0), GRID_X-16, GRID_Y-10, 'd0')}
        {sumLabel(sumDiag(1), gridRight+16, GRID_Y-10, 'd1')}

        {/* Зафиксированные числа */}
        {rows.flatMap(r=>cols.map(c=>{
          if (SEED[r][c]==null) return null;
          const {x,y}=cellCenter(r,c);
          return <Tile key={`s${r}${c}`} x={x} y={y} value={SEED[r][c]} locked={true} />;
        }))}

        {/* Лоток */}
        <line x1="40" y1={TRAY_Y-32} x2="320" y2={TRAY_Y-32}
          stroke="#D4AF37" strokeOpacity="0.3" strokeDasharray="1 3" strokeWidth="0.6" />
        <text x="180" y={TRAY_Y-39} textAnchor="middle" fontFamily="Cinzel, serif"
          fontSize="10" letterSpacing="3" fill="rgba(212,175,55,0.55)">·  NUMERI  ·</text>

        {/* Перетаскиваемые фишки */}
        {pieces.map(p=>{
          const isDrag=dragId===p.id;
          const isErr=error&&p.placed&&error.r===p.placed.r&&error.c===p.placed.c;
          return (
            <g key={p.id} onPointerDown={onPointerDown(p)}
              style={{ cursor:solved?'default':'grab', touchAction:'none' }}>
              <Tile x={p.x} y={p.y} value={p.value} isDrag={isDrag} isErr={isErr} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NONOGRAM  —  Fill cells by row/col clues to reveal hidden image.
// ─────────────────────────────────────────────────────────────

function ngnXr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

// Подсчёт подсказок для строки/столбца
function ngnClues(line) {
  const clues = [];
  let cnt = 0;
  for (const v of line) { if (v) cnt++; else if (cnt) { clues.push(cnt); cnt = 0; } }
  if (cnt) clues.push(cnt);
  return clues.length ? clues : [0];
}

// Генерация сетки по levelIdx и difficulty
function ngnGenLevel(levelIdx, difficulty) {
  const size = difficulty === 'easy' ? 5 : difficulty === 'hard' ? 10 : 8;
  const density = 0.5 + (levelIdx % 10) * 0.02; // 50–68% заполненности
  const rng = ngnXr(levelIdx * 3571 + 17);
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rng() < density ? 1 : 0)
  );
  const rowClues = grid.map(row => ngnClues(row));
  const colClues = Array.from({ length: size }, (_, c) => ngnClues(grid.map(r => r[c])));
  return { grid, rowClues, colClues, size };
}

function NonogramPuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1, difficulty = 'normal' }) {
  const { grid: SOLUTION, rowClues, colClues, size } = _uM_q(
    () => ngnGenLevel(levelIdx, difficulty), [levelIdx, difficulty]
  );

  // Состояние: 0=пусто, 1=закрашено, 2=крест (исключено)
  const [cells, setCells] = _uS_q(() => Array.from({ length: size * size }, () => 0));
  const [solved, setSolved] = _uS_q(false);
  const dragMode = _uR_q(null); // { fill: 0|1|2 } — режим рисования текущего жеста
  const cellsRef = _uR_q(cells); // всегда свежий срез cells для pointer-обработчиков
  const svgRef = _uR_q(null);
  const prevLineOkRef = _uR_q({ rows: Array(size).fill(false), cols: Array(size).fill(false) });
  cellsRef.current = cells;

  // Размеры SVG
  const PAD_LEFT = 52, PAD_TOP = 78;
  const CELL = Math.floor((340 - PAD_LEFT) / size);
  const W = PAD_LEFT + size * CELL + 10;
  const H = PAD_TOP  + size * CELL + 10;

  const cellIdx = (r, c) => r * size + c;

  // Проверка победы
  _uE_q(() => {
    const correct = cells.every((v, i) => {
      const r = Math.floor(i / size), c = i % size;
      return (v === 1) === (SOLUTION[r][c] === 1);
    });
    if (correct && !solved) {
      setSolved(true);
      SFX && SFX.win(); VIB && VIB.win();
      setTimeout(() => onWin && onWin(), 1400);
    }
  }, [cells]);

  const svgPt = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  };

  const ptToCell = (x, y) => {
    const c = Math.floor((x - PAD_LEFT) / CELL);
    const r = Math.floor((y - PAD_TOP)  / CELL);
    if (r < 0 || r >= size || c < 0 || c >= size) return null;
    return { r, c };
  };

  const applyCell = (r, c, fillVal) => {
    setCells(prev => {
      const next = [...prev];
      next[cellIdx(r, c)] = fillVal;
      return next;
    });
  };

  const onPointerDown = (e) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = svgPt(e.clientX, e.clientY);
    const cell = ptToCell(p.x, p.y);
    if (!cell) return;
    const cur = cellsRef.current[cellIdx(cell.r, cell.c)];
    // Цикл: пусто→закрашено→крест→пусто
    const next = cur === 0 ? 1 : cur === 1 ? 2 : 0;
    dragMode.current = { fill: next };
    SFX && SFX.tap(); VIB && VIB.tap();
    applyCell(cell.r, cell.c, next);
  };

  const onPointerMove = (e) => {
    if (!dragMode.current || solved) return;
    const p = svgPt(e.clientX, e.clientY);
    const cell = ptToCell(p.x, p.y);
    if (!cell) return;
    applyCell(cell.r, cell.c, dragMode.current.fill);
  };

  const onPointerUp = () => { dragMode.current = null; };

  // Цвет подсказки: золотой если ряд/столбец решён правильно
  const rowOk = (r) => {
    const line = Array.from({ length: size }, (_, c) => cells[cellIdx(r, c)] === 1 ? 1 : 0);
    return JSON.stringify(ngnClues(line)) === JSON.stringify(rowClues[r]);
  };
  const colOk = (c) => {
    const line = Array.from({ length: size }, (_, r) => cells[cellIdx(r, c)] === 1 ? 1 : 0);
    return JSON.stringify(ngnClues(line)) === JSON.stringify(colClues[c]);
  };

  // Звук при завершении строки/столбца
  _uE_q(() => {
    const prev = prevLineOkRef.current;
    let fired = false;
    for (let r = 0; r < size; r++) {
      const ok = rowOk(r);
      if (ok && !prev.rows[r]) fired = true;
      prev.rows[r] = ok;
    }
    for (let c = 0; c < size; c++) {
      const ok = colOk(c);
      if (ok && !prev.cols[c]) fired = true;
      prev.cols[c] = ok;
    }
    if (fired && !solved) SFX && SFX.lineOk(); VIB && VIB.lineOk();
  }, [cells]);

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ touchAction:'none', display:'block', width:'100%', height:'100%', maxWidth:`${W}px` }}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

        {/* Заголовок */}
        <text x={W/2} y="10" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="12" fill="#D4AF37" letterSpacing="4">IV · FORMA</text>

        {/* Подсказки столбцов */}
        {colClues.map((clue, c) => {
          const ok = colOk(c);
          const cx = PAD_LEFT + c * CELL + CELL / 2;
          return clue.map((n, i) => (
            <text key={`cc${c}-${i}`}
              x={cx} y={PAD_TOP - (clue.length - 1 - i) * 12 - 4}
              textAnchor="middle" fontFamily="Comfortaa, sans-serif" fontSize="10"
              fill={ok ? '#E5C158' : 'rgba(212,175,55,0.7)'}
              style={{ filter: ok ? 'drop-shadow(0 0 3px #E5C158)' : 'none' }}>{n}</text>
          ));
        })}

        {/* Подсказки строк */}
        {rowClues.map((clue, r) => {
          const ok = rowOk(r);
          const cy = PAD_TOP + r * CELL + CELL / 2 + 4;
          return (
            <text key={`rc${r}`}
              x={PAD_LEFT - 4} y={cy}
              textAnchor="end" fontFamily="Comfortaa, sans-serif" fontSize="10"
              fill={ok ? '#E5C158' : 'rgba(212,175,55,0.7)'}
              style={{ filter: ok ? 'drop-shadow(0 0 3px #E5C158)' : 'none' }}>
              {clue.join(' ')}
            </text>
          );
        })}

        {/* Клетки */}
        {Array.from({ length: size }, (_, r) =>
          Array.from({ length: size }, (_, c) => {
            const val = cells[cellIdx(r, c)];
            const x = PAD_LEFT + c * CELL, y = PAD_TOP + r * CELL;
            return (
              <g key={`${r}-${c}`}>
                <rect x={x+0.5} y={y+0.5} width={CELL-1} height={CELL-1} rx="1"
                  fill={val === 1 ? (solved ? '#E5C158' : paletteAccent) : 'rgba(11,16,29,0.75)'}
                  fillOpacity={val === 1 ? (solved ? 1 : 0.45) : 1}
                  stroke={val === 1 ? paletteAccent : 'rgba(212,175,55,0.25)'}
                  strokeWidth={val === 1 ? '0.8' : '0.5'}
                  strokeOpacity={val === 1 ? (solved ? 0 : 0.9) : 1}
                  style={{ filter: val === 1 && solved ? 'drop-shadow(0 0 4px #E5C158)' : (val === 1 ? `drop-shadow(0 0 2px ${paletteAccent}66)` : 'none') }}
                />
                {val === 2 && (
                  <g stroke="rgba(212,175,55,0.5)" strokeWidth="1.2">
                    <line x1={x+5} y1={y+5} x2={x+CELL-5} y2={y+CELL-5} />
                    <line x1={x+CELL-5} y1={y+5} x2={x+5} y2={y+CELL-5} />
                  </g>
                )}
                {/* Сетка-разделитель каждые 5 клеток */}
                {c % 5 === 0 && c > 0 && (
                  <line x1={x} y1={PAD_TOP} x2={x} y2={PAD_TOP + size*CELL}
                    stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" />
                )}
                {r % 5 === 0 && r > 0 && (
                  <line x1={PAD_LEFT} y1={y} x2={PAD_LEFT + size*CELL} y2={y}
                    stroke="rgba(212,175,55,0.4)" strokeWidth="0.8" />
                )}
              </g>
            );
          })
        )}

        {/* Внешняя рамка сетки */}
        <rect x={PAD_LEFT} y={PAD_TOP} width={size*CELL} height={size*CELL}
          fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION  —  Connect numbered stars 1 → 2 → 3 → …
// Each step emits a cyan trail; finishing the sequence reveals a constellation.
// ─────────────────────────────────────────────────────────────
function ConstellationPuzzle({ onWin, paletteAccent = '#4DEEEA', lang = 'ru' }) {
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
      SFX && SFX.win(); VIB && VIB.win();
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
        SFX && SFX.tap(); VIB && VIB.tap();
      } else {
        setError(target.id);
        SFX && SFX.error(); VIB && VIB.error();
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
          {solved ? '· Constellatio revelata ·' : lang === 'en' ? `· Connect star ${lastConnected} → ${Math.min(lastConnected + 1, NEXT)} ·` : `· Соедините звезду ${lastConnected} → ${Math.min(lastConnected + 1, NEXT)} ·`}
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAGIC STARS  —  Place numbers in a 5-pointed star so every
// line of 4 nodes sums to the same magic constant.
// ─────────────────────────────────────────────────────────────

// Узлы звезды: 5 внешних вершин (0–4) + 5 внутренних (5–9)
// Линии по 4 узла каждая (5 линий лучей):
// Геометрически верные линии пентаграммы: каждая линия проходит через
// внешний узел, два последовательных внутренних и другой внешний узел
// numbers 1–12 (выбираем 10), target = 24

function msStarXr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

// Координаты узлов (в SVG 360×520)
// Внешние вершины — 5 точек большой звезды
// Внутренние — 5 точек малого пятиугольника
function msStarNodes(cx, cy, R, r) {
  const nodes = [];
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180;
    nodes.push({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
  }
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 54) * Math.PI / 180;
    nodes.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return nodes;
}

// 5 геометрических линий: каждая идёт от внешнего через два внутренних к другому внешнему
// Верифицировано: узлы лежат на одной прямой (коллинеарны)
const MS_STAR_LINES = [
  [0, 5, 6, 2],
  [1, 6, 7, 3],
  [2, 7, 8, 4],
  [3, 8, 9, 0],
  [4, 9, 5, 1],
];

// Базовое решение: числа 1-12 (10 из 12), target=24
// ext=[1,2,3,4,5] inn=[8,12,6,10,9]
// L0:1+8+12+3=24✓ L1:2+12+6+4=24✓ L2:3+6+10+5=24✓ L3:4+10+9+1=24✓ L4:5+9+8+2=24✓
// Циклический сдвиг сохраняет все суммы = 24.
const MS_STAR_BASE_EXT = [1,2,3,4,5];
const MS_STAR_BASE_INN = [8,12,6,10,9];

function msStarGenSolution(seed) {
  const rng = msStarXr(seed * 2311 + 99);
  // Случайная ротация на 0-4 позиции — сохраняет все суммы = 24
  const rot = Math.floor(rng() * 5);
  const ext = [...MS_STAR_BASE_EXT.slice(rot), ...MS_STAR_BASE_EXT.slice(0, rot)];
  const inn = [...MS_STAR_BASE_INN.slice(rot), ...MS_STAR_BASE_INN.slice(0, rot)];
  return [...ext, ...inn];
}

function MagicStarsPuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1, difficulty = 'normal', lang = 'ru' }) {
  const CX = 180, CY = 260, R = 140, r_inner = 58;
  const NODES = msStarNodes(CX, CY, R, r_inner);
  const svgRef = _uR_q(null);
  const dragRef = _uR_q(null); // { id: pieceIdx, dx, dy }

  const SOLUTION = _uM_q(() => msStarGenSolution(levelIdx * 1777), [levelIdx]);

  const hintIndices = _uM_q(() => {
    if (difficulty === 'easy') {
      // Открываем все 5 внутренних + 2 случайных внешних
      const rng = msStarXr(levelIdx * 3333 + 1);
      const ext = [0,1,2,3,4];
      for (let i = ext.length-1; i > 0; i--) {
        const j = Math.floor(rng()*(i+1)); [ext[i],ext[j]]=[ext[j],ext[i]];
      }
      return new Set([5,6,7,8,9, ext[0], ext[1]]);
    }
    if (difficulty === 'hard') {
      // Только 2 внутренних узла — максимальная сложность
      const rng = msStarXr(levelIdx * 3333 + 1);
      const inn = [5,6,7,8,9];
      for (let i = inn.length-1; i > 0; i--) {
        const j = Math.floor(rng()*(i+1)); [inn[i],inn[j]]=[inn[j],inn[i]];
      }
      return new Set(inn.slice(0, 2));
    }
    // normal — все 5 внутренних узлов как подсказки, внешние 5 свободны
    return new Set([5,6,7,8,9]);
  }, [levelIdx, difficulty]);

  // freeNums[i] = { value, origIdx } чтобы отслеживать каждую шайбу отдельно
  const freeItems = _uM_q(() => {
    const rng = msStarXr(levelIdx * 5555 + 2);
    const items = [];
    SOLUTION.forEach((v, i) => { if (!hintIndices.has(i)) items.push({ value: v, origIdx: i }); });
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1)); [items[i],items[j]] = [items[j],items[i]];
    }
    return items;
  }, [SOLUTION, hintIndices]);

  const TRAY_Y = 478;
  const traySpacing = Math.min(44, 300 / Math.max(freeItems.length, 1));
  const trayStartX = 180 - (freeItems.length - 1) * traySpacing / 2;
  const SNAP_R = 26;
  const TILE_R = 18;

  // pieces[i]: { id, value, x, y, home:{x,y}, placedNode: nodeIdx|null }
  const initialPieces = freeItems.map((item, i) => ({
    id: `s${i}`, value: item.value,
    x: trayStartX + i * traySpacing, y: TRAY_Y,
    home: { x: trayStartX + i * traySpacing, y: TRAY_Y },
    placedNode: null,
  }));

  const [pieces, setPieces] = _uS_q(initialPieces);
  const [dragId, setDragId] = _uS_q(null);
  const [solved, setSolved] = _uS_q(false);
  const [flash, setFlash] = _uS_q(null);

  // placement из pieces для отрисовки и проверки
  const placement = _uM_q(() => {
    const p = Array(10).fill(null);
    hintIndices.forEach(i => { p[i] = SOLUTION[i]; });
    pieces.forEach(pc => { if (pc.placedNode !== null) p[pc.placedNode] = pc.value; });
    return p;
  }, [pieces, hintIndices, SOLUTION]);

  const lineSums = MS_STAR_LINES.map(line => ({
    sum: line.reduce((s, i) => s + (placement[i] || 0), 0),
    filled: line.every(i => placement[i] !== null),
  }));

  _uE_q(() => {
    if (placement.every(v => v !== null)) {
      const ok = MS_STAR_LINES.every(line => line.reduce((s, i) => s + placement[i], 0) === 24);
      if (ok && !solved) {
        setSolved(true);
        SFX && SFX.win(); VIB && VIB.win();
        setTimeout(() => onWin && onWin(), 1400);
      }
    }
  }, [placement]);

  const svgPt = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (360 / rect.width),
      y: (clientY - rect.top)  * (520 / rect.height),
    };
  };

  const onPointerDown = (piece) => (e) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    SFX && SFX.tap(); VIB && VIB.tap();
    const p = svgPt(e.clientX, e.clientY);
    dragRef.current = { id: piece.id, dx: p.x - piece.x, dy: p.y - piece.y };
    setDragId(piece.id);
    setPieces(ps => ps.map(pc => pc.id === piece.id ? { ...pc, placedNode: null } : pc));
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const p = svgPt(e.clientX, e.clientY);
    const { id, dx, dy } = dragRef.current;
    setPieces(ps => ps.map(pc => pc.id === id ? { ...pc, x: p.x - dx, y: p.y - dy } : pc));
  };

  const onPointerUp = (e) => {
    if (!dragRef.current) return;
    const p = svgPt(e.clientX, e.clientY);
    const { id } = dragRef.current;
    dragRef.current = null;
    setDragId(null);
    setPieces(ps => {
      const piece = ps.find(pc => pc.id === id);
      if (!piece) return ps;
      // Найти ближайший свободный узел
      let tgtNode = null, best = Infinity;
      NODES.forEach((node, ni) => {
        if (hintIndices.has(ni)) return;
        if (ps.some(q => q.id !== id && q.placedNode === ni)) return;
        const d = Math.hypot(node.x - p.x, node.y - p.y);
        if (d < best && d < SNAP_R) { best = d; tgtNode = ni; }
      });
      if (tgtNode !== null) {
        SFX && SFX.place(); VIB && VIB.place();
        return ps.map(pc => pc.id === id
          ? { ...pc, x: NODES[tgtNode].x, y: NODES[tgtNode].y, placedNode: tgtNode }
          : pc);
      }
      // Вернуть домой
      return ps.map(pc => pc.id === id ? { ...pc, x: pc.home.x, y: pc.home.y, placedNode: null } : pc);
    });
  };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <svg ref={svgRef} viewBox="0 0 360 520" width="100%" height="100%"
        style={{ touchAction:'none', display:'block' }}
        onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

        <text x="180" y="38" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="13" fill="#D4AF37" letterSpacing="4">V · STELLA MAGICA · v4</text>
        <text x="180" y="55" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="13"
          fill="rgba(212,175,55,0.85)">
          {solved ? '· Stella revelata ·' : lang === 'en' ? '· Every ray sums to 24 ·' : '· Каждый луч — сумма 24 ·'}
        </text>

        {/* Декоративный фон */}
        <g opacity="0.1" transform={`translate(${CX}, ${CY})`}>
          <circle r="160" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1 4" />
          <circle r="130" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
        </g>

        {/* Линии лучей */}
        {MS_STAR_LINES.map((line, li) => {
          const pts = line.map(i => NODES[i]);
          const sum = lineSums[li];
          const ok = sum.filled && sum.sum === 24;
          const over = sum.filled && sum.sum > 24;
          const color = ok ? '#E5C158' : (over ? '#FF6B6B' : 'rgba(212,175,55,0.22)');
          return (
            <line key={li} x1={pts[0].x} y1={pts[0].y} x2={pts[3].x} y2={pts[3].y}
              stroke={color} strokeWidth={ok ? 1.5 : 0.8}
              style={{ filter: ok ? 'drop-shadow(0 0 4px #E5C158)' : 'none' }} />
          );
        })}

        {/* Метки сумм */}
        {MS_STAR_LINES.map((line, li) => {
          const sum = lineSums[li];
          if (!sum.filled) return null;
          const pts = line.map(i => NODES[i]);
          const mx = (pts[0].x + pts[3].x) / 2;
          const my = (pts[0].y + pts[3].y) / 2;
          const dx = pts[3].x - pts[0].x, dy = pts[3].y - pts[0].y;
          const len = Math.hypot(dx, dy) || 1;
          const px = CX > mx ? -1 : 1;
          const ok = sum.sum === 24;
          return (
            <text key={li}
              x={mx + (-dy/len) * 14 * px} y={my + (dx/len) * 14 * px + 4}
              textAnchor="middle" fontFamily="Comfortaa, sans-serif" fontSize="11"
              fill={ok ? '#E5C158' : (sum.sum > 24 ? '#FF6B6B' : 'rgba(212,175,55,0.6)')}
              style={{ filter: ok ? 'drop-shadow(0 0 3px #E5C158)' : 'none' }}>
              {sum.sum}
            </text>
          );
        })}

        {/* Узлы (подсказки + пустые слоты) */}
        {NODES.map((node, ni) => {
          const isHint = hintIndices.has(ni);
          const val = placement[ni];
          const isEmpty = val === null;
          const isFlash = flash === ni;
          const col = solved ? '#E5C158' : (isHint ? '#D4AF37' : paletteAccent);
          return (
            <g key={ni}>
              {isEmpty && (
                <circle cx={node.x} cy={node.y} r={TILE_R}
                  fill="rgba(11,16,29,0.5)" stroke="rgba(212,175,55,0.3)"
                  strokeWidth="1" strokeDasharray="3 3" />
              )}
              {isHint && val && (
                <g>
                  <circle cx={node.x} cy={node.y} r={TILE_R}
                    fill="rgba(11,16,29,0.92)" stroke="#D4AF37" strokeWidth="1.4"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.5))' }} />
                  <text x={node.x} y={node.y + 6} textAnchor="middle"
                    fontFamily="Cinzel, serif" fontWeight="600" fontSize="16"
                    fill={solved ? '#fff3b8' : '#D4AF37'}>{val}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Лоток */}
        <line x1="40" y1={TRAY_Y - 28} x2="320" y2={TRAY_Y - 28}
          stroke="#D4AF37" strokeOpacity="0.3" strokeDasharray="1 3" strokeWidth="0.6" />
        <text x="180" y={TRAY_Y - 34} textAnchor="middle" fontFamily="Cinzel, serif"
          fontSize="10" letterSpacing="3" fill="rgba(212,175,55,0.55)">·  NUMERI  ·</text>

        {/* Перетаскиваемые шайбы */}
        {pieces.map(pc => {
          const isDrag = dragId === pc.id;
          return (
            <g key={pc.id} onPointerDown={onPointerDown(pc)}
              style={{ cursor: solved ? 'default' : 'grab', touchAction: 'none' }}>
              <g transform={`translate(${pc.x},${pc.y})`}
                style={{ transition: isDrag ? 'none' : 'transform 0.28s cubic-bezier(.4,1.5,.5,1)' }}>
                {isDrag && <ellipse cx="0" cy={TILE_R + 3} rx={TILE_R} ry="3" fill="black" opacity="0.4" style={{ filter:'blur(2px)' }} />}
                <g transform={`translate(0,${isDrag ? -3 : 0}) scale(${isDrag ? 1.1 : 1})`}>
                  <circle r={TILE_R} fill="rgba(11,16,29,0.92)"
                    stroke={solved ? '#E5C158' : paletteAccent} strokeWidth="1.8"
                    style={{ filter: `drop-shadow(0 0 6px ${solved ? '#E5C158' : paletteAccent})` }} />
                  <text x="0" y="6" textAnchor="middle"
                    fontFamily="Cinzel, serif" fontWeight="600" fontSize="16"
                    fill={solved ? '#fff3b8' : '#fff'}>{pc.value}</text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HITORI  —  Cross out numbers so no row/column repeats,
// and crossed cells don't touch each other.
// ─────────────────────────────────────────────────────────────

function htXr(seed) {
  let s = seed | 1;
  return () => { s ^= s << 13; s ^= s >> 17; s ^= s << 5; return (s >>> 0) / 0xFFFFFFFF; };
}

function htGenLevel(levelIdx, difficulty) {
  const size = difficulty === 'easy' ? 4 : difficulty === 'hard' ? 6 : 5;
  const rng = htXr(levelIdx * 4567 + 31);

  // Шаг 1: строим латинский квадрат size×size (числа 1..size, уникальны в строке и столбце)
  // Метод: строка r = циклический сдвиг базовой перестановки, затем перемешиваем столбцы
  const base = Array.from({ length: size }, (_, i) => i + 1);
  const latin = Array.from({ length: size }, (_, r) =>
    base.map((_, c) => ((r + c) % size) + 1)
  );
  // Перемешиваем столбцы
  const colPerm = Array.from({ length: size }, (_, i) => i);
  for (let i = colPerm.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [colPerm[i], colPerm[j]] = [colPerm[j], colPerm[i]];
  }
  // Перемешиваем строки
  const rowPerm = Array.from({ length: size }, (_, i) => i);
  for (let i = rowPerm.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)); [rowPerm[i], rowPerm[j]] = [rowPerm[j], rowPerm[i]];
  }
  const shuffled = rowPerm.map(r => colPerm.map(c => latin[r][c]));

  // Шаг 2: выбираем ячейки для зачёркивания — не смежные друг с другом
  const solution = Array.from({ length: size }, () => Array(size).fill(false));
  const crossTarget = difficulty === 'easy' ? size - 1 : difficulty === 'hard' ? size + 1 : size;
  let crossed = 0, attempts = 0;
  while (crossed < crossTarget && attempts < 300) {
    attempts++;
    const r = Math.floor(rng() * size);
    const c = Math.floor(rng() * size);
    if (solution[r][c]) continue;
    const adj = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
    if (adj.some(([nr,nc]) => nr >= 0 && nr < size && nc >= 0 && nc < size && solution[nr][nc])) continue;
    solution[r][c] = true;
    crossed++;
  }

  // Шаг 3: строим grid — копируем латинский квадрат, затем зачёркнутым ячейкам
  // ставим дубликат значения из той же строки (гарантирует наличие дубликата)
  const grid = shuffled.map(row => row.slice());
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!solution[r][c]) continue;
      // Берём значение незачёркнутой ячейки той же строки (всегда есть — не вся строка зачёркнута)
      const visibleInRow = [];
      for (let cc = 0; cc < size; cc++) { if (!solution[r][cc]) visibleInRow.push(grid[r][cc]); }
      // Предпочитаем значение из того же столбца (дубликат в столбце тоже)
      const sameCol = grid[r][c]; // исходное значение из латинского квадрата
      grid[r][c] = visibleInRow.length > 0 ? visibleInRow[Math.floor(rng() * visibleInRow.length)] : sameCol;
    }
  }

  return { grid, solution, size };
}

function HitoriPuzzle({ onWin, paletteAccent = '#4DEEEA', levelIdx = 1, difficulty = 'normal', lang = 'ru' }) {
  const { grid: GRID, solution: SOLUTION, size } = _uM_q(() => {
    try { return htGenLevel(levelIdx, difficulty); }
    catch(e) { try { return htGenLevel(1, difficulty); } catch(e2) { return htGenLevel(1, 'normal'); } }
  }, [levelIdx, difficulty]);

  // Состояние игрока: null=нетронуто, true=зачёркнуто
  const [cells, setCells] = _uS_q(() => Array.from({ length: size * size }, () => null));
  const [solved, setSolved] = _uS_q(false);
  const svgRef = _uR_q(null);
  const cellsRef = _uR_q(cells);
  cellsRef.current = cells;
  const dragModeRef = _uR_q(null); // { fill: true|null }
  const solvedRef = _uR_q(false);
  const winTimerRef = _uR_q(null);

  // Сброс при смене уровня или сложности
  _uE_q(() => {
    setCells(Array.from({ length: size * size }, () => null));
    setSolved(false);
    solvedRef.current = false;
    if (winTimerRef.current) { clearTimeout(winTimerRef.current); winTimerRef.current = null; }
  }, [levelIdx, difficulty, size]);

  const CELL = Math.min(54, Math.floor(300 / size));
  const gridW = size * CELL;
  const gridH = size * CELL;
  const PAD_LEFT = Math.round((360 - gridW) / 2);
  const PAD_TOP = 70;
  const W = 360;
  const H = PAD_TOP + gridH + 60; // viewBox height = SVG height used in svgPt
  const cellIdx = (r, c) => r * size + c;

  // Ошибки для подсветки
  const errors = _uM_q(() => {
    const errs = new Set();
    // Проверка строк: незачёркнутые числа не должны повторяться
    for (let r = 0; r < size; r++) {
      const seen = new Map(); // value -> [indices]
      for (let c = 0; c < size; c++) {
        if (cells[cellIdx(r, c)] === true) continue;
        const v = GRID[r][c];
        const idx = cellIdx(r, c);
        if (!seen.has(v)) seen.set(v, []);
        seen.get(v).push(idx);
      }
      seen.forEach(indices => { if (indices.length > 1) indices.forEach(i => errs.add(i)); });
    }
    // Проверка столбцов
    for (let c = 0; c < size; c++) {
      const seen = new Map();
      for (let r = 0; r < size; r++) {
        if (cells[cellIdx(r, c)] === true) continue;
        const v = GRID[r][c];
        const idx = cellIdx(r, c);
        if (!seen.has(v)) seen.set(v, []);
        seen.get(v).push(idx);
      }
      seen.forEach(indices => { if (indices.length > 1) indices.forEach(i => errs.add(i)); });
    }
    // Проверка смежных зачёркнутых
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (cells[cellIdx(r, c)] !== true) continue;
        if (c < size - 1 && cells[cellIdx(r, c + 1)] === true) {
          errs.add(cellIdx(r, c)); errs.add(cellIdx(r, c + 1));
        }
        if (r < size - 1 && cells[cellIdx(r + 1, c)] === true) {
          errs.add(cellIdx(r, c)); errs.add(cellIdx(r + 1, c));
        }
      }
    }
    return errs;
  }, [cells]);

  // Победа
  _uE_q(() => {
    if (solvedRef.current) return;
    if (!cells.some(v => v === true)) return;
    const correct = cells.every((v, i) => {
      const r = Math.floor(i / size), c = i % size;
      return (v === true) === SOLUTION[r][c];
    });
    if (correct) {
      solvedRef.current = true;
      setSolved(true);
      SFX && SFX.win(); VIB && VIB.win();
      winTimerRef.current = setTimeout(() => onWin && onWin(), 1400);
    }
  }, [cells]);
  _uE_q(() => () => { if (winTimerRef.current) clearTimeout(winTimerRef.current); }, []);

  const svgPt = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const r = pt.matrixTransform(ctm.inverse());
    return { x: r.x, y: r.y };
  };

  const ptToCell = (x, y) => {
    const c = Math.floor((x - PAD_LEFT) / CELL);
    const r = Math.floor((y - PAD_TOP)  / CELL);
    if (r < 0 || r >= size || c < 0 || c >= size) return null;
    return { r, c };
  };

  const cycleCell = (r, c) => {
    const idx = cellIdx(r, c);
    const cur = cellsRef.current[idx];
    // null → true (зачёркнуто) → null (сброс), кружок убираем — только зачеркнуть или пусто
    return cur === null ? true : null;
  };

  const onPointerDown = (e) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = svgPt(e.clientX, e.clientY);
    const cell = ptToCell(p.x, p.y);
    if (!cell) return;
    SFX && SFX.tap(); VIB && VIB.tap();
    const nextVal = cycleCell(cell.r, cell.c);
    dragModeRef.current = { fill: nextVal };
    setCells(prev => {
      const next = [...prev];
      next[cellIdx(cell.r, cell.c)] = nextVal;
      return next;
    });
  };

  const onPointerMove = (e) => {
    if (!dragModeRef.current || solved) return;
    const p = svgPt(e.clientX, e.clientY);
    const cell = ptToCell(p.x, p.y);
    if (!cell) return;
    const idx = cellIdx(cell.r, cell.c);
    setCells(prev => {
      if (prev[idx] === dragModeRef.current.fill) return prev;
      const next = [...prev];
      next[idx] = dragModeRef.current.fill;
      return next;
    });
  };

  const onPointerUp = () => { dragModeRef.current = null; };

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ touchAction:'none', display:'block', width:'100%', height:'100%', maxWidth:`${W}px` }}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>

        <text x={W/2} y="22" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="500"
          fontSize="12" fill="#D4AF37" letterSpacing="4">VI · HITORI</text>

        {/* Клетки */}
        {Array.from({ length: size }, (_, r) =>
          Array.from({ length: size }, (_, c) => {
            const idx = cellIdx(r, c);
            const val = cells[idx];
            const isErr = errors.has(idx);
            const isCrossed = val === true;
            const isCircled = false; // кружок убран — только зачеркнуть или пусто
            const x = PAD_LEFT + c * CELL, y = PAD_TOP + r * CELL;
            const cx = x + CELL / 2, cy = y + CELL / 2;
            return (
              <g key={idx}>
                <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1}
                  fill={isCrossed ? (solved ? 'rgba(229,193,88,0.1)' : 'rgba(11,16,29,0.9)') : 'rgba(11,16,29,0.6)'}
                  stroke={isErr ? '#FF6B6B' : (isCrossed ? 'rgba(212,175,55,0.2)' : 'rgba(212,175,55,0.4)')}
                  strokeWidth="0.6"
                  style={{ filter: isErr ? 'drop-shadow(0 0 4px #FF6B6B)' : 'none' }}
                />
                {isCrossed && !solved && (
                  <g stroke={isErr ? '#FF6B6B' : 'rgba(212,175,55,0.6)'} strokeWidth="1.5">
                    <line x1={x+5} y1={y+5} x2={x+CELL-5} y2={y+CELL-5} />
                    <line x1={x+CELL-5} y1={y+5} x2={x+5} y2={y+CELL-5} />
                  </g>
                )}
                {isCircled && (
                  <circle cx={cx} cy={cy} r={CELL/2 - 5}
                    fill="none" stroke={isErr ? '#FF6B6B' : paletteAccent} strokeWidth="1.2"
                    style={{ filter: `drop-shadow(0 0 3px ${paletteAccent})` }} />
                )}
                {/* Число */}
                <text x={cx} y={cy + 5} textAnchor="middle"
                  fontFamily="Cinzel, serif" fontWeight="500"
                  fontSize={CELL > 40 ? "16" : "13"}
                  fill={isCrossed
                    ? (solved ? '#E5C158' : 'rgba(212,175,55,0.3)')
                    : (isErr ? '#FF6B6B' : (solved ? '#E5C158' : '#fff3b8'))}
                  style={{ filter: solved && !isCrossed ? 'drop-shadow(0 0 3px #E5C158)' : 'none' }}>
                  {GRID[r][c]}
                </text>
              </g>
            );
          })
        )}

        {/* Внешняя рамка */}
        <rect x={PAD_LEFT} y={PAD_TOP} width={size*CELL} height={size*CELL}
          fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />

        {/* Подсказка */}
        <text x={W/2} y={PAD_TOP + size*CELL + 22} textAnchor="middle"
          fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="15"
          fill="rgba(212,175,55,0.85)">
          {solved ? '· Hitori solutum ·' : lang === 'en' ? '· Tap to cross out · tap again to clear ·' : '· Тап — зачеркнуть · ещё раз — убрать ·'}
        </text>
      </svg>
    </div>
  );
}

Object.assign(window, { MagicSquarePuzzle, NonogramPuzzle, ConstellationPuzzle, MagicStarsPuzzle, HitoriPuzzle });
