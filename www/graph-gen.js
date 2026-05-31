// graph-gen.js — генератор уровней для главы I "Граф связей"

(function () {

  function rng(seed) {
    let s = (seed ^ 0xdeadbeef) | 1;
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

  const DIFFICULTY = [
    null,
    { pathLen: 3, target: 6,  extraNodes: 1, extraEdges: 1, numRange: [1, 4] },
    { pathLen: 3, target: 8,  extraNodes: 2, extraEdges: 2, numRange: [1, 5] },
    { pathLen: 4, target: 10, extraNodes: 2, extraEdges: 2, numRange: [1, 5] },
    { pathLen: 4, target: 12, extraNodes: 2, extraEdges: 3, numRange: [2, 6] },
    { pathLen: 4, target: 12, extraNodes: 3, extraEdges: 3, numRange: [2, 7] },
    { pathLen: 5, target: 15, extraNodes: 3, extraEdges: 3, numRange: [2, 7] },
    { pathLen: 5, target: 15, extraNodes: 3, extraEdges: 4, numRange: [2, 8] },
    { pathLen: 5, target: 18, extraNodes: 4, extraEdges: 4, numRange: [2, 8] },
    { pathLen: 6, target: 18, extraNodes: 3, extraEdges: 4, numRange: [2, 8] },
    { pathLen: 6, target: 20, extraNodes: 4, extraEdges: 5, numRange: [2, 9] },
  ];

  // Разбить target на count слагаемых в [min, max]
  function splitTarget(target, count, min, max, rand) {
    if (target < count * min || target > count * max) return null;
    const nums = new Array(count).fill(min);
    let remaining = target - count * min;
    const indices = shuffle(Array.from({ length: count }, (_, i) => i), rand);
    for (const i of indices) {
      const canAdd = Math.min(remaining, max - min);
      if (canAdd <= 0) break;
      const add = randInt(0, canAdd, rand);
      nums[i] += add;
      remaining -= add;
    }
    if (remaining > 0) {
      for (let i = 0; i < count && remaining > 0; i++) {
        const canAdd = max - nums[i];
        const add = Math.min(canAdd, remaining);
        nums[i] += add;
        remaining -= add;
      }
    }
    if (remaining !== 0) return null;
    return shuffle(nums, rand);
  }

  function layoutNodes(pathLen, extraNodes, rand) {
    const total = pathLen + extraNodes;
    const positions = [];
    const W = 360, H = 480;
    const margin = 50;

    const stepY = (H - margin * 2) / (pathLen - 1 || 1);
    for (let i = 0; i < pathLen; i++) {
      const jitter = randInt(-60, 60, rand);
      const x = Math.max(margin + 20, Math.min(W - margin - 20, W / 2 + jitter));
      const y = margin + i * stepY;
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }

    let attempts = 0;
    while (positions.length < total && attempts < 200) {
      attempts++;
      const x = randInt(margin, W - margin, rand);
      const y = randInt(margin, H - margin, rand);
      if (!positions.some(p => Math.hypot(p.x - x, p.y - y) < 70))
        positions.push({ x, y });
    }
    return positions;
  }

  // Перебрать все пути в графе длиной до maxLen и вернуть суммы
  function allPathSums(nodes, edgeSet, pathIds, trapIds) {
    const allIds = [...pathIds, ...trapIds];
    const adj = {};
    allIds.forEach(id => { adj[id] = []; });
    edgeSet.forEach(k => {
      const [a, b] = k.split('-').map(Number);
      if (adj[a]) adj[a].push(b);
      if (adj[b]) adj[b].push(a);
    });

    const sums = new Set();
    // DFS по всем путям длиной >= 2
    function dfs(cur, visited, sum) {
      if (visited.length >= 2) sums.add(sum);
      for (const nb of adj[cur]) {
        if (!visited.includes(nb)) {
          dfs(nb, [...visited, nb], sum + nodes.find(n => n.id === nb).n);
        }
      }
    }
    for (const startId of allIds) {
      const startN = nodes.find(n => n.id === startId).n;
      dfs(startId, [startId], startN);
    }
    return sums;
  }

  // Проверить что правильный путь (pathIds по порядку) достижим и его сумма = target
  function validateLevel(nodes, edgeSet, pathIds, target) {
    // Все рёбра пути должны быть в графе
    for (let i = 0; i < pathIds.length - 1; i++) {
      const key = [pathIds[i], pathIds[i + 1]].sort().join('-');
      if (!edgeSet.has(key)) return false;
    }
    // Сумма пути должна равняться target
    const sum = pathIds.reduce((s, id) => s + nodes.find(n => n.id === id).n, 0);
    return sum === target;
  }

  function addTrapEdges(pathIds, trapIds, allNodes, target, edgeSet, count, rand) {
    const allIds = [...pathIds, ...trapIds];

    // Каждый trap-узел получает хотя бы одно ребро к узлу пути
    for (const trapId of trapIds) {
      const hasEdge = Array.from(edgeSet).some(k => k.split('-').map(Number).includes(trapId));
      if (hasEdge) continue;
      const candidates = shuffle(pathIds, rand);
      for (const pathId of candidates) {
        const key = [trapId, pathId].sort().join('-');
        if (!edgeSet.has(key)) { edgeSet.add(key); break; }
      }
    }

    // Дополнительные рёбра-ловушки (не рёбра пути)
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
    shuffle(extras, rand).slice(0, count).forEach(([a, b]) => {
      edgeSet.add([a, b].sort().join('-'));
    });
  }

  // Подобрать число для ловушки так, чтобы оно не создавало
  // альтернативных путей с суммой = target при соединении с любым
  // подмножеством узлов пути.
  function safeTrapNumber(pathNums, target, min, max, rand) {
    // Генерируем кандидата и проверяем: ни одна частичная сумма пути + trapNum не = target
    const pathSubSums = new Set();
    const n = pathNums.length;
    for (let mask = 1; mask < (1 << n); mask++) {
      let s = 0;
      for (let i = 0; i < n; i++) if (mask & (1 << i)) s += pathNums[i];
      pathSubSums.add(s);
    }

    // Запрещённые числа для ловушки: target - любая подсумма пути
    const forbidden = new Set();
    pathSubSums.forEach(s => {
      const bad = target - s;
      if (bad >= min && bad <= max) forbidden.add(bad);
    });

    // Также запрещаем само значение target (ловушка не должна равняться цели)
    forbidden.add(target);

    // Ищем безопасное число
    const candidates = [];
    for (let v = min; v <= max; v++) {
      if (!forbidden.has(v)) candidates.push(v);
    }

    if (candidates.length === 0) {
      // Крайний случай: берём любое, только не target
      return randInt(min, max, rand);
    }
    return candidates[Math.floor(rand() * candidates.length)];
  }

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

  function generateGraphLevel(difficulty, seed) {
    difficulty = Math.max(1, Math.min(difficulty, DIFFICULTY.length - 1));
    const params = DIFFICULTY[difficulty];

    // Детерминированный seed: если не передан — используем difficulty как основу
    const rand = rng(seed !== undefined ? seed : difficulty * 7919 + 1);

    const { pathLen, target, extraNodes, extraEdges, numRange } = params;
    const [numMin, numMax] = numRange;

    // Пробуем до 30 раз сгенерировать валидный уровень
    for (let attempt = 0; attempt < 30; attempt++) {
      // Каждая попытка — чуть другой seed
      const r = rng(seed !== undefined ? seed + attempt : difficulty * 7919 + attempt + 1);

      // 1. Числа на узлах пути
      let pathNums = splitTarget(target, pathLen, numMin, numMax, r);
      if (!pathNums) {
        const base = Math.floor(target / pathLen);
        pathNums = new Array(pathLen).fill(base);
        pathNums[0] += target - base * pathLen;
      }

      // 2. Позиции и id
      const positions = layoutNodes(pathLen, extraNodes, r);
      const pathIds = Array.from({ length: pathLen }, (_, i) => i);
      const trapIds = Array.from({ length: extraNodes }, (_, i) => pathLen + i);

      // 3. Числа на ловушках — безопасные
      const trapNums = trapIds.map(() => safeTrapNumber(pathNums, target, numMin, numMax, r));

      // 4. Узлы
      const nodes = [
        ...pathIds.map((id, i) => ({ id, x: positions[i].x, y: positions[i].y, n: pathNums[i] })),
        ...trapIds.map((id, i) => ({ id, x: positions[pathLen + i].x, y: positions[pathLen + i].y, n: trapNums[i] })),
      ];

      // 5. Рёбра пути
      const edgeSet = new Set();
      for (let i = 0; i < pathLen - 1; i++) {
        edgeSet.add([pathIds[i], pathIds[i + 1]].sort().join('-'));
      }

      // 6. Ловушечные рёбра
      addTrapEdges(pathIds, trapIds, nodes, target, edgeSet, extraEdges, r);

      // 7. Проверка: правильный путь существует и решаем
      if (!validateLevel(nodes, edgeSet, pathIds, target)) continue;

      // 8. Проверка: нет случайных альтернативных путей с той же суммой
      // через ловушечные узлы (допускаем что правильный путь один)
      // Для простоты: проверяем что ловушечные числа не дают target в паре с путём
      // (глубокая проверка allPathSums слишком дорога для рантайма)
      const trapSumOk = trapIds.every(tid => {
        const tNum = nodes.find(n => n.id === tid).n;
        // tNum + любое подмножество pathNums не должно = target
        const n = pathNums.length;
        for (let mask = 0; mask < (1 << n); mask++) {
          let s = tNum;
          for (let i = 0; i < n; i++) if (mask & (1 << i)) s += pathNums[i];
          if (s === target) return false;
        }
        return true;
      });

      if (!trapSumOk) continue;

      const edges = Array.from(edgeSet).map(k => k.split('-').map(Number));
      const hint = HINTS[Math.floor(r() * HINTS.length)];

      return { nodes, edges, target, hint, solution: pathIds, difficulty };
    }

    // Финальный фолбэк: простейший уровень без ловушек
    const r = rng(seed !== undefined ? seed : difficulty * 7919);
    const pathLen2 = params.pathLen;
    const pathNums = splitTarget(target, pathLen2, numMin, numMax, r) ||
      (() => { const b = Math.floor(target / pathLen2); const a = new Array(pathLen2).fill(b); a[0] += target - b * pathLen2; return a; })();
    const positions = layoutNodes(pathLen2, 0, r);
    const pathIds = Array.from({ length: pathLen2 }, (_, i) => i);
    const nodes = pathIds.map((id, i) => ({ id, x: positions[i].x, y: positions[i].y, n: pathNums[i] }));
    const edgeSet = new Set();
    for (let i = 0; i < pathLen2 - 1; i++) edgeSet.add([i, i + 1].sort().join('-'));
    const edges = Array.from(edgeSet).map(k => k.split('-').map(Number));
    return { nodes, edges, target, hint: HINTS[0], solution: pathIds, difficulty };
  }

  window.generateGraphLevel = generateGraphLevel;
  window.GRAPH_DIFFICULTY = DIFFICULTY;

})();
