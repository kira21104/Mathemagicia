// constellation-validate.js — автоматическая проверка данных созвездий
//
// Ничего в этом файле не хардкодит "правильные" числа (88, 745 и т.п.) —
// все ожидаемые величины вычисляются из самих данных STAR_DATA/CONSTELLATION_DATA/
// STAR_REWARD_POOL и сверяются друг с другом.

function validateConstellations() {
  const stars = window.STAR_DATA || {};
  const constellations = window.CONSTELLATION_DATA || {};
  const pool = window.STAR_REWARD_POOL || [];

  const errors = [];
  const warnings = [];

  const constellationCodes = Object.keys(constellations);

  // ── 1. Уникальные starId, реально используемые в topology ──
  const topologyStarIds = new Set();
  for (const code of constellationCodes) {
    for (const id of constellations[code].stars) topologyStarIds.add(id);
  }

  // ── 2. Каждый starId из topology существует в STAR_DATA ──
  for (const code of constellationCodes) {
    for (const id of constellations[code].stars) {
      if (!stars[id]) errors.push(`${code}: звезда ${id} отсутствует в STAR_DATA`);
    }
  }

  // ── 3. Каждая линия ссылается на существующие звёзды этого же созвездия ──
  for (const code of constellationCodes) {
    const c = constellations[code];
    const starSet = new Set(c.stars);
    for (const [a, b] of c.lines) {
      if (!starSet.has(a)) errors.push(`${code}: линия ссылается на ${a}, не входящий в stars`);
      if (!starSet.has(b)) errors.push(`${code}: линия ссылается на ${b}, не входящий в stars`);
      if (!c.display || !c.display.stars || !c.display.stars[a]) errors.push(`${code}: нет display.x/y для ${a}`);
      if (!c.display || !c.display.stars || !c.display.stars[b]) errors.push(`${code}: нет display.x/y для ${b}`);
    }
    // display coordinates для каждой звезды созвездия
    for (const id of c.stars) {
      if (!c.display || !c.display.stars || !c.display.stars[id]) {
        errors.push(`${code}: звезда ${id} не имеет display.x/y`);
      }
    }
    if (c.stars.length === 0) errors.push(`${code}: созвездие не содержит звёзд`);
  }

  // ── 4. Нет дубликатов constellation id ──
  const seenCodes = new Set();
  for (const code of constellationCodes) {
    if (seenCodes.has(code)) errors.push(`Дублирующийся constellation id: ${code}`);
    seenCodes.add(code);
  }

  // ── 5. Reward pool: без дубликатов ──
  const poolSeen = new Set();
  for (const id of pool) {
    if (poolSeen.has(id)) errors.push(`starRewardPool: дубликат ${id}`);
    poolSeen.add(id);
  }

  // ── 6. Каждый starId из pool существует в STAR_DATA ──
  for (const id of pool) {
    if (!stars[id]) errors.push(`starRewardPool: ${id} отсутствует в STAR_DATA`);
  }

  // ── 7. Все звёзды topology попали в reward pool (иначе созвездие не собрать) ──
  const missingFromPool = [...topologyStarIds].filter(id => !poolSeen.has(id));
  if (missingFromPool.length) {
    errors.push(`Звёзды из topology отсутствуют в starRewardPool (${missingFromPool.length}): ${missingFromPool.slice(0, 10).join(', ')}${missingFromPool.length > 10 ? '…' : ''}`);
  }

  // ── 8. Ни одна лишняя звезда не попала в reward pool ──
  const extraInPool = pool.filter(id => !topologyStarIds.has(id));
  if (extraInPool.length) {
    errors.push(`Лишние звёзды в starRewardPool, не входящие ни в одно созвездие (${extraInPool.length}): ${extraInPool.slice(0, 10).join(', ')}${extraInPool.length > 10 ? '…' : ''}`);
  }

  // ── 9. Каждое созвездие потенциально достижимо N/N, если весь pool собран ──
  const fullyCollectible = constellationCodes.every(code =>
    constellations[code].stars.every(id => poolSeen.has(id))
  );
  if (!fullyCollectible) {
    warnings.push('Не все созвездия могут достичь N/N при полном прохождении reward pool');
  }

  const report = {
    constellationsCount: constellationCodes.length,
    uniqueStarsInTopology: topologyStarIds.size,
    totalLines: constellationCodes.reduce((s, c) => s + constellations[c].lines.length, 0),
    rewardPoolLength: pool.length,
    errors,
    warnings,
    ok: errors.length === 0,
  };

  return report;
}

function printValidationReport(report) {
  console.log('[constellations] validation:', report.ok ? 'OK ✓' : 'FAILED ✗');
  console.log(`  созвездий: ${report.constellationsCount}`);
  console.log(`  уникальных звёзд в topology: ${report.uniqueStarsInTopology}`);
  console.log(`  линий: ${report.totalLines}`);
  console.log(`  starRewardPool.length: ${report.rewardPoolLength}`);
  if (report.errors.length) {
    console.error(`  ${report.errors.length} ошибок:`);
    report.errors.forEach(e => console.error('   - ' + e));
  }
  if (report.warnings.length) {
    report.warnings.forEach(w => console.warn('   ! ' + w));
  }
}

Object.assign(window, { validateConstellations, printValidationReport });
