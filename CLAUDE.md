# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Mathemagicia — a mystical, alchemy-themed math puzzle game for any kind, built as React 18
running directly in the browser (no bundler) and packaged for Android via Capacitor.

## Commands

- **Install deps:** `npm install`
- **Run the game in a browser:** open `www/index.html` (mounts the real game fullscreen).
- **Run the design canvas** (all screens/chapters laid out as Figma-style artboards): open
  `MathGame/index.html`. This is a dev/design tool, *not* the game. It pulls React/Babel from
  the unpkg CDN (needs network); `www/index.html` vendors them locally.
- **PWA variant with a dev server:** `cd WebGame && node server.js` → http://localhost:3000
- **Sync web assets into Android:** `npm run sync` (`npx cap sync android`)
- **Build debug APK:** `npm run build` (`npx cap sync android && cd android && gradlew assembleDebug`)
  → APK at `android/app/build/outputs/apk/debug/`
- **Regenerate Android icons:** `npm run icons` (`node generate-icons.js`; needs `icon.png` in
  repo root — not currently committed — and uses `sharp` to emit all mipmap DPIs)

There is **no test framework, linter, or bundler config** (no vite/webpack/tsconfig/babelrc).
Web "builds" happen at runtime: Babel Standalone transpiles JSX in the browser.

## Critical: two duplicated source trees

The editable source lives in `MathGame/`, but the shipped app is `www/` (Capacitor's `webDir`).
The shared `.jsx`/`.js`/`.css` files are **byte-identical copies in both dirs**. `cap sync`
copies `www/`→`android/` only — nothing copies `MathGame/`→`www/`.

**Any game-logic edit must be applied to both `MathGame/` and `www/` by hand**, or the
browser/design view and the Android build diverge. After editing, verify with
`diff MathGame/<file> www/<file>` (should be identical) before building.

`GodotGame/` is an archived Godot 4 prototype (see `devlog.md`); not part of the active app.

## Architecture

### No modules — global scope + script load order
There are no ES `import`/`export` statements. Every component, helper, and engine is a global,
wired up purely by `<script>` tag order in `index.html`:

```
graph-gen.js → constellations-data.js → atoms.jsx → puzzles.jsx → puzzles-2.jsx
→ screens.jsx → prototype.jsx → app.jsx
```

Each file ends with `Object.assign(window, { ...Components })` (e.g. `prototype.jsx:311`,
`puzzles.jsx:604`, `puzzles-2.jsx:1361`, `screens.jsx:1274`) to register its exports, and
cross-file references use `window.X` (e.g. `window.CONSTELLATIONS_DB`,
`window.generateGraphLevel`). A new component must be added to one of these `Object.assign`
calls to be visible elsewhere, and helpers must be defined before their first use in the load
order above.

### Entry / orchestration
`app.jsx` differs between trees: in `www/` it mounts `<Prototype>` fullscreen (the game); in
`MathGame/` it mounts `<DesignCanvas>` (the artboard viewer, via `design-canvas.jsx` +
`ios-frame.jsx`).

`prototype.jsx` is the screen router and state owner. It holds `screen`
(`loading`→`cover`→`chapters`→`game`→`win`/`settings`), `chapter`, `difficulty`, `lang`, and
`chapterLevels`. `GameShell` (in `prototype.jsx`) wraps the active puzzle.

### Chapter → puzzle registry (canonical)
`prototype.jsx:56`:

```js
const PuzzleByChapter = [GraphPuzzle, MagicSquarePuzzle, ShapesPuzzle,
                         NonogramPuzzle, MagicStarsPuzzle, HitoriPuzzle]; // indexed by chapterIdx
```

Six chapters (README only documents four — it's stale). Each puzzle is a self-contained
component taking `{ onWin, paletteAccent, levelIdx, difficulty, lang }` and calls `onWin()` to
advance. `GraphPuzzle` + `ShapesPuzzle` live in `puzzles.jsx`; the other four (plus
`ConstellationPuzzle`) in `puzzles-2.jsx`.

**Gotcha:** chapter III's component is named `ShapesPuzzle` but its body is actually a
minesweeper ("Tenebrae" — mines, flags, flood-fill). The name is a leftover from a
since-replaced shapes puzzle.

### Level generation
`graph-gen.js` exposes `window.generateGraphLevel(difficulty, seed)` and
`window.GRAPH_DIFFICULTY`, using a seeded xorshift PRNG plus `validateLevel`/DFS path-sum checks
to avoid unsolvable or ambiguous levels. Other puzzles generate and validate their level inline
within their own component (seeded off `levelIdx` for reproducibility). Difficulty is
`'easy' | 'normal' | 'hard'`; chapter I uses adaptive difficulty instead of the picker.

### Shared UI + engines (`atoms.jsx`)
- Reusable SVG components: `Icon`, `HudButton`, `Astrolabe`, `Candle`, `Constellation`, …
- **i18n:** `STRINGS` (`ru`/`en`) + `useT(lang)` hook returning `t(key)`.
- **SFX** engine (Web Audio, `SFX.tap/place/error/win/...`) and **VIB** haptics engine
  (Vibration API, matching method names).
- Persistence in `localStorage`: `mg_sound`, `mg_haptics`, `mg_music` (`'off'` disables);
  language under `mathgame_lang`. Note: `chapterLevels` progress is **in-memory only** and
  resets on reload.

### Screens (`screens.jsx`)
`CoverScreen`, `ChapterSelect` (grimoire spread — level constellations, difficulty picker, and
"sky" button), `SkyCollection` / `ChapterConstCarousel` (the "sky carousel" of unlocked
constellations, data from `constellations-data.js` — 88 real IAU constellations),
`WinOverlay`, `ChapterInfoModal` (`CHAPTER_RULES`), `SettingsScreen`, `LoadingScreen`.

## Adding a chapter

1. Define the puzzle component in `puzzles.jsx`/`puzzles-2.jsx` with the standard props and
   `onWin()`, and add it to that file's `Object.assign(window, {...})`.
2. Append it to `PuzzleByChapter` (`prototype.jsx:56`).
3. Extend the arrays that assume 6 entries: `chapterLevels`, and `CHAPTER_RULES` /
   `DIFFICULTY_LABELS` (`screens.jsx`) / `STRINGS.chapters` etc. (`atoms.jsx`).
4. Mirror every edit into `www/`.
