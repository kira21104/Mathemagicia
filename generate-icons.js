const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const src = path.join(__dirname, 'icon.png');

// Android mipmap sizes
const androidSizes = [
  { dir: 'mipmap-mdpi',    size: 48  },
  { dir: 'mipmap-hdpi',    size: 72  },
  { dir: 'mipmap-xhdpi',   size: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const androidBase = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

async function run() {
  for (const { dir, size } of androidSizes) {
    const outDir = path.join(androidBase, dir);
    fs.mkdirSync(outDir, { recursive: true });
    // ic_launcher.png — стандартная иконка
    await sharp(src).resize(size, size).toFile(path.join(outDir, 'ic_launcher.png'));
    // ic_launcher_round.png — круглая иконка (Android 7.1+)
    await sharp(src).resize(size, size).toFile(path.join(outDir, 'ic_launcher_round.png'));
    // ic_launcher_foreground.png — для adaptive icon
    await sharp(src).resize(size, size).toFile(path.join(outDir, 'ic_launcher_foreground.png'));
    console.log(`✓ ${dir} (${size}x${size})`);
  }

  // Foreground для adaptive icon (108dp = размер * 1.5 с отступом)
  const foregroundSizes = [
    { dir: 'mipmap-mdpi',    size: 108 },
    { dir: 'mipmap-hdpi',    size: 162 },
    { dir: 'mipmap-xhdpi',   size: 216 },
    { dir: 'mipmap-xxhdpi',  size: 324 },
    { dir: 'mipmap-xxxhdpi', size: 432 },
  ];
  for (const { dir, size } of foregroundSizes) {
    const outDir = path.join(androidBase, dir);
    await sharp(src).resize(size, size).toFile(path.join(outDir, 'ic_launcher_foreground.png'));
  }

  console.log('\nДеланo! Все иконки сгенерированы.');
}

run().catch(console.error);
