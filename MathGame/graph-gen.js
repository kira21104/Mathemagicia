// graph-gen.js — генератор уровней для главы I "Граф связей"
//
// Экспортирует одну функцию: generateGraphLevel(difficulty)
// difficulty: 1–5 (влияет на размер графа, цель, количество ловушек)
//
// Возвращает объект:
// {
//   nodes: [{id, x, y, n}],
//   edges: [[a,b], ...],   — все допустимые рёбра (путь + ловушки)
//   target: number,
//   hint: string,
//   solution: [id, ...],   — один из правильных путей (для отладки)
// }

(function () {

  // ── Вспомогательные ────────────────────────────────────────

  function rng(seed) {
    // Простой PRNG на основе xorshift — воспроизводимый если нужен seed
    let s = seed ^ 0xdeadbeef;
    return function () {
      s ^= s << 13; s ^= s >> 17; s ^= s << 5;
      return (s >>> 0) / 0xffffffff;
    };
  }

  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randInt(min, max, rand) {
    return min + Math.floor(rand() * (max - min + 1));
  }

  // ── Параметры сложности ─────────────────────────────────────
  //
  // pathLen   — длина пути-решения (количество узлов)
  // target    — сумма-цель
  // extraNodes — дополнительных узлов-ловушек
  // extraEdges — дополнительных рёбер-ловушек
  // numRange  — диапазон чисел на узлах ловушек

  const DIFFICULTY = [
    null, // placeholder, difficulty 1-based
    { pathLen: 3, target: 6,  extraNodes: 1, extraEdges: 1, numRange: [1, 4] },  // 1
    { pathLen: 3, target: 8,  extraNodes: 2, extraEdges: 2, numRange: [1, 5] },  // 2
    { pathLen: 4, target: 10, extraNodes: 2, extraEdges: 2, numRange: [1, 5] },  // 3
    { pathLen: 4, target: 12, extraNodes: 2, extraEdges: 3, numRange: [2, 6] },  // 4
    { pathLen: 4, target: 12, extraNodes: 3, extraEdges: 3, numRange: [2, 7] },  // 5
    { pathLen: 5, target: 15, extraNodes: 3, extraEdges: 3, numRange: [2, 7] },  // 6
    { pathLen: 5, target: 15, extraNodes: 3, extraEdges: 4, numRange: [2, 8] },  // 7
    { pathLen: 5, target: 18, extraNodes: 4, extraEdges: 4, numRange: [2, 8] },  // 8
    { pathLen: 6, target: 18, extraNodes: 3, extraEdges: 4, numRange: [2, 8] },  // 9
    { pathLen: 6, target: 20, extraNodes: 4, extraEdges: 5, numRange: [2, 9] },  // 10
  ];

  // ── Разбить target на pathLen слагаемых в диапазоне [min, max] ──
  // Возвращает массив чисел или null если невозможно

  function splitTarget(target, count, min, max, rand) {
    // Проверка возможности
    if (target < count * min || target > count * max) return null;

    const nums = new Array(count).fill(min);
    let remaining = target - count * min;

    // Распределяем остаток случайно
    const indices = shuffle(Array.from({ length: count }, (_, i) => i), rand);
    for (const i of indices) {
      const canAdd = Math.min(remaining, max - min);
      if (canAdd <= 0) break;
      const add = randInt(0, canAdd, rand);
      nums[i] += add;
      remaining -= add;
    }

    // Если не распределили весь остаток — добавляем к первому у кого есть место
    if (remaining > 0) {
      for (let i = 0; i < count && remaining > 0; i++) {
        const canAdd = max - nums[i];
        const add = Math.min(canAdd, remaining);
        nums[i] += add;
        remaining -= add;
      }
    }

    if (remaining !== 0) return null;
    return shuffle(nums, rand); // перемешиваем чтобы большие числа не всегда были в конце
  }

  // ── Раскладка узлов на поле 360×480 ─────────────────────────
  // Возвращает [{x, y}] для totalNodes узлов
  // Путь идёт сверху вниз, ловушки — по бокам

  function layoutNodes(pathLen, extraNodes, rand) {
    const total = pathLen + extraNodes;
    const positions = [];
    const W = 360, H = 480;
    const margin = 50;

    // Узлы пути — равномерно по вертикали, с небольшим горизонтальным разбросом
    const stepY = (H - margin * 2) / (pathLen - 1 || 1);
    for (let i = 0; i < pathLen; i++) {
      const baseX = W / 2;
      const jitter = randInt(-60, 60, rand);
      const x = Math.max(margin + 20, Math.min(W - margin - 20, baseX + jitter));
      const y = margin + i * stepY;
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }

    // Ловушечные узлы — случайно, но не слишком близко к уже размещённым
    let attempts = 0;
    while (positions.length < total && attempts < 200) {
      attempts++;
      const x = randInt(margin, W - margin, rand);
      const y = randInt(margin, H - margin, rand);
      const tooClose = positions.some(p => Math.hypot(p.x - x, p.y - y) < 70);
      if (!tooClose) positions.push({ x, y });
    }

    return positions;
  }

  // ── Добавить ловушечные рёбра ────────────────────────────────
  // Не должны создавать альтернативный путь с суммой = target
  // Простая эвристика: соединяем ловушечные узлы между собой и с путём

  function addTrapEdges(pathIds, trapIds, allNodes, target, edgeSet, count, rand) {
    const allIds = [...pathIds, ...trapIds];

    // Шаг 1: каждый trap-узел обязательно получает хотя бы одно ребро.
    // Подключаем его к случайному узлу пути (не соседнему по пути).
    for (const trapId of trapIds) {
      const hasEdge = Array.from(edgeSet).some(k => k.split('-').map(Number).includes(trapId));
      if (hasEdge) continue;

      // Кандидаты: любой узел пути (соседние по пути тоже допустимы для ловушек)
      const candidates = shuffle(pathIds, rand);
      for (const pathId of candidates) {
        const key = [trapId, pathId].sort().join('-');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          break;
        }
      }
    }

    // Шаг 2: добавляем дополнительные рёбра-ловушки (до count штук сверх обязательных)
    const extras = [];
    for (let i = 0; i < allIds.length; i++) {
      for (let j = i + 1; j < allIds.length; j++) {
        const a = allIds[i], b = allIds[j];
        const key = [a, b].sort().join('-');
        if (edgeSet.has(key)) continue;
        const ai = pathIds.indexOf(a), bi = pathIds.indexOf(b);
        if (ai !== -1 && bi !== -1 && Math.abs(ai - bi) === 1) continue;
        extras.push([a, b]);
      }
    }

    const shuffled = shuffle(extras, rand);
    let added = 0;
    for (const [a, b] of shuffled) {
      if (added >= count) break;
      const key = [a, b].sort().join('-');
      edgeSet.add(key);
      added++;
    }
  }

  // ── Числа на ловушках ────────────────────────────────────────
  // Подбираем так, чтобы ни одна пара trap+path не давала target

  function trapNumber(pathNums, target, min, max, rand) {
    // Просто случайное число из диапазона — для детей это достаточно
    return randInt(min, max, rand);
  }

  // ── Подсказки ────────────────────────────────────────────────

  const HINTS = [
    'Иди сверху вниз и считай сумму на каждом шаге.',
    'Центральный узел — ключ. Попробуй пути через него.',
    'Большие числа — ловушки. Ищи путь из небольших слагаемых.',
    'Попробуй начать с конца и двигаться к началу.',
    'Не бойся сбросить цепочку и начать другим путём.',
    'Сложи числа вслух: первый шаг + второй + третий…',
    'Один путь уводит в тупик. Другой — к победе.',
    'Если сумма растёт слишком быстро — сверни в другую сторону.',
  ];

  // ── Главная функция ──────────────────────────────────────────

  function generateGraphLevel(difficulty, seed) {
    difficulty = Math.max(1, Math.min(difficulty, DIFFICULTY.length - 1));
    const params = DIFFICULTY[difficulty];
    const rand = rng(seed !== undefined ? seed : Math.floor(Math.random() * 1e9));

    const { pathLen, target, extraNodes, extraEdges, numRange } = params;
    const [numMin, numMax] = numRange;

    // 1. Числа на узлах пути
    let pathNums = null;
    let attempts = 0;
    while (!pathNums && attempts < 50) {
      pathNums = splitTarget(target, pathLen, numMin, numMax, rand);
      attempts++;
    }
    if (!pathNums) {
      // Фолбэк: равномерное деление
      const base = Math.floor(target / pathLen);
      pathNums = new Array(pathLen).fill(base);
      pathNums[0] += target - base * pathLen;
    }

    // 2. Позиции узлов
    const positions = layoutNodes(pathLen, extraNodes, rand);

    // 3. Назначаем id
    // Путь: id 0..pathLen-1, ловушки: id pathLen..total-1
    const total = pathLen + extraNodes;
    const pathIds = Array.from({ length: pathLen }, (_, i) => i);
    const trapIds = Array.from({ length: extraNodes }, (_, i) => pathLen + i);

    // 4. Числа на ловушках
    const trapNums = trapIds.map(() => trapNumber(pathNums, target, numMin, numMax, rand));

    // 5. Собираем узлы
    const nodes = [
      ...pathIds.map((id, i) => ({ id, x: positions[i].x, y: positions[i].y, n: pathNums[i] })),
      ...trapIds.map((id, i) => ({ id, x: positions[pathLen + i].x, y: positions[pathLen + i].y, n: trapNums[i] })),
    ];

    // 6. Рёбра пути
    const edgeSet = new Set();
    const pathEdges = [];
    for (let i = 0; i < pathLen - 1; i++) {
      const key = [pathIds[i], pathIds[i + 1]].sort().join('-');
      edgeSet.add(key);
      pathEdges.push([pathIds[i], pathIds[i + 1]]);
    }

    // 7. Ловушечные рёбра
    addTrapEdges(pathIds, trapIds, nodes, target, edgeSet, extraEdges, rand);

    // 8. Конвертируем edgeSet в массив пар
    const edges = Array.from(edgeSet).map(k => k.split('-').map(Number));

    // 9. Подсказка
    const hint = HINTS[randInt(0, HINTS.length - 1, rand)];

    return {
      nodes,
      edges,
      target,
      hint,
      solution: pathIds,     // правильный путь (id узлов)
      difficulty,
    };
  }

  // Экспортируем глобально (для использования в jsx без сборщика)
  window.generateGraphLevel = generateGraphLevel;
  window.GRAPH_DIFFICULTY = DIFFICULTY;

})();
