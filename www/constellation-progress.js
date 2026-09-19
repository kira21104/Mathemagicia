// constellation-progress.js — прогресс игрока по звёздам: чтение, запись, миграция
//
// Источник истины — localStorage["mathgame_collected_stars"]: массив уникальных
// starId. Прогресс любого созвездия ВСЕГДА вычисляется из этого списка
// (getConstellationProgress в constellation-view.jsx) — отдельного состояния
// "ORI progress" / "UMA progress" нигде не хранится.

const COLLECTED_STARS_KEY = 'mathgame_collected_stars';
const MIGRATION_FLAG_KEY = 'mathgame_stars_migration_v1';
const LEGACY_LEVELS_KEY = 'mathgame_levels';

function loadCollectedStars() {
  try {
    const saved = localStorage.getItem(COLLECTED_STARS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveCollectedStars(list) {
  try { localStorage.setItem(COLLECTED_STARS_KEY, JSON.stringify(list)); } catch (e) {}
}

// totalCompleted — общее число успешно завершённых уровней по ВСЕМ 6 главам.
// mathgame_levels[ci] = число завершённых уровней в главе ci (не индекс текущего
// уровня, см. prototype.jsx: incrementLevel вызывается ровно один раз на факт
// прохождения, replay уже пройденного уровня в текущем UI невозможен — клик по
// старому уровню в ChapterSelect всё равно открывает chapterLevels[chapter]+1,
// а не выбранный номер). Поэтому totalCompleted = sum(chapterLevels) без риска
// двойного учёта одного и того же прохождения.
function totalCompletedFromChapterLevels(chapterLevels) {
  return (chapterLevels || []).reduce((sum, n) => sum + (n || 0), 0);
}

// Выдаёт следующую звезду по глобальному индексу totalCompleted (уже увеличенному
// на 1 к моменту вызова, т.е. это порядковый номер только что засчитанного
// прохождения). Один общий индекс на все 6 глав — не 6 отдельных счётчиков.
// Безопасно по границе пула: после starRewardPool.length дальнейшие прохождения
// просто не выдают новую звезду (весь пул уже собран), без ошибок.
function starForCompletionIndex(completionIndex) {
  const pool = window.STAR_REWARD_POOL || [];
  if (completionIndex < 1 || completionIndex > pool.length) return null;
  return pool[completionIndex - 1];
}

function collectStar(starId, collectedStars) {
  if (!starId) return collectedStars;
  if (collectedStars.includes(starId)) return collectedStars; // уже собрана — идемпотентно
  const next = [...collectedStars, starId];
  saveCollectedStars(next);
  return next;
}

// ── Миграция legacy-прогресса (mathgame_levels) в звёзды ──
//
// Выполняется РОВНО ОДИН РАЗ, отмечается флагом MIGRATION_FLAG_KEY.
// mathgame_levels НЕ удаляется и не модифицируется (backward-compat).
//
// Семантика mathgame_levels подтверждена анализом кода prototype.jsx:
// chapterLevels[ci] = количество успешно завершённых уровней главы ci,
// инкрементируется ровно один раз на факт прохождения (incrementLevel,
// вызываемый из handleWinContinue/handleWinChapters). Поэтому суммарное
// число уже "заработанных" звёзд = sum(chapterLevels), взятое как первые N
// элементов стабильного starRewardPool.
function migrateLegacyProgressToStars() {
  try {
    if (localStorage.getItem(MIGRATION_FLAG_KEY) === 'done') {
      return { migrated: false, reason: 'already-done' };
    }

    const rawLevels = localStorage.getItem(LEGACY_LEVELS_KEY);
    let chapterLevels = [0, 0, 0, 0, 0, 0];
    if (rawLevels) {
      try {
        const parsed = JSON.parse(rawLevels);
        if (Array.isArray(parsed) && parsed.length === 6) chapterLevels = parsed;
      } catch (e) {}
    }

    const totalCompleted = totalCompletedFromChapterLevels(chapterLevels);
    const pool = window.STAR_REWARD_POOL || [];

    // N может быть больше длины пула (игрок прошёл больше уровней, чем звёзд
    // существует) — не падаем, безопасно ограничиваем и предупреждаем.
    const n = Math.min(totalCompleted, pool.length);
    if (totalCompleted > pool.length) {
      console.warn(`[constellations] migration: totalCompleted=${totalCompleted} > starRewardPool.length=${pool.length}, ограничено до ${pool.length}`);
    }

    const starsData = window.STAR_DATA || {};
    const migratedStars = pool.slice(0, n).filter(id => {
      const exists = !!starsData[id];
      if (!exists) console.warn(`[constellations] migration: ${id} отсутствует в STAR_DATA, пропущена`);
      return exists;
    });

    // Объединяем с уже существующими collectedStars (на случай если игрок
    // где-то уже успел получить звёзды до миграции — не теряем их).
    const existing = loadCollectedStars();
    const merged = [...new Set([...existing, ...migratedStars])];
    saveCollectedStars(merged);

    localStorage.setItem(MIGRATION_FLAG_KEY, 'done');

    return { migrated: true, totalCompleted, migratedCount: migratedStars.length, collectedStars: merged };
  } catch (e) {
    console.error('[constellations] migration failed:', e);
    return { migrated: false, reason: 'error', error: e };
  }
}

Object.assign(window, {
  loadCollectedStars,
  saveCollectedStars,
  totalCompletedFromChapterLevels,
  starForCompletionIndex,
  collectStar,
  migrateLegacyProgressToStars,
  COLLECTED_STARS_KEY,
  MIGRATION_FLAG_KEY,
  LEGACY_LEVELS_KEY,
});
