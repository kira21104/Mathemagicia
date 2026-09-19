// constellation-view.jsx — переиспользуемый компонент отрисовки одного созвездия
//
// Рисует ТОЛЬКО из данных: constellation.lines (topology) + constellation.display.stars
// (x/y для SVG). Состояние "собрана/не собрана" вычисляется из collectedStars —
// никакого отдельного progress-state на созвездие не хранится.

const { useState: _uS_cv } = React;

// Прогресс конкретного созвездия, целиком выведенный из collectedStars.
// Ничего не хранится отдельно — это чистая функция от переданного состояния.
function getConstellationProgress(constellation, collectedStars) {
  const total = constellation.stars.length;
  const collected = constellation.stars.filter(id => collectedStars.has(id)).length;
  return { collected, total, completed: total > 0 && collected === total };
}

function ConstellationView({ constellation, stars, collectedStars, size = 180, padding = 18, lineColor = 'rgba(212,175,55,0.55)' }) {
  const [revealedStar, setRevealedStar] = _uS_cv(null); // starId с показанным именем (tap-to-reveal)

  const d = constellation.display;
  const ids = constellation.stars;

  // viewBox по реальным display-координатам этого созвездия, с отступом
  const xs = ids.map(id => d.stars[id].x), ys = ids.map(id => d.stars[id].y);
  const minX = Math.min(...xs) - padding, maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding, maxY = Math.max(...ys) + padding;
  const vbW = maxX - minX, vbH = maxY - minY;
  const viewBox = `${minX} ${minY} ${vbW} ${vbH}`;

  const revealedName = revealedStar && stars[revealedStar] && stars[revealedStar].name;

  return (
    <svg viewBox={viewBox} width={size} height={size} style={{ overflow: 'visible' }}
      onClick={() => setRevealedStar(null)}>
      <g stroke={lineColor} strokeWidth="1.4">
        {constellation.lines.map(([a, b], li) => {
          const A = d.stars[a], B = d.stars[b];
          if (!A || !B) return null;
          const lit = collectedStars.has(a) && collectedStars.has(b);
          return <line key={li} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
            stroke={lit ? '#FFD700' : lineColor} strokeOpacity={lit ? 0.75 : 1} />;
        })}
      </g>
      {ids.map(id => {
        const p = d.stars[id];
        const lit = collectedStars.has(id);
        return (
          <g key={id}
            onClick={(e) => { e.stopPropagation(); setRevealedStar(prev => prev === id ? null : id); }}
            style={{ cursor: 'pointer' }}>
            {/* увеличенная невидимая зона тапа для маленьких звёзд */}
            <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
            {lit && <circle cx={p.x} cy={p.y} r="14" fill="#E5C158" opacity="0.10" />}
            {lit && <circle cx={p.x} cy={p.y} r="7" fill="#E5C158" opacity="0.20" />}
            <circle cx={p.x} cy={p.y}
              r={lit ? 4.5 : 2.2}
              fill={lit ? '#FFF0A0' : 'rgba(212,175,55,0.2)'}
              style={{ filter: lit ? 'drop-shadow(0 0 6px #FFD700) drop-shadow(0 0 3px #fff)' : 'none' }}
            />
          </g>
        );
      })}
      {revealedStar && d.stars[revealedStar] && (
        <g style={{ pointerEvents: 'none' }}>
          <text x={d.stars[revealedStar].x} y={d.stars[revealedStar].y - 8}
            textAnchor="middle" fontSize="7" fontFamily="Cormorant Garamond, serif" fontStyle="italic"
            fill="#fff3b8" stroke="#060912" strokeWidth="2" paintOrder="stroke">
            {revealedName || '—'}
          </text>
        </g>
      )}
    </svg>
  );
}

Object.assign(window, { ConstellationView, getConstellationProgress });
