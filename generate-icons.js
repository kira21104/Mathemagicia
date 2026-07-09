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
    console.log(`✓ ${dir} (${size}x${size})`);
  }

  // Foreground для adaptive icon (108dp canvas, изображение занимает 72dp — безопасная зона 66%)
  // Отступ = (108 - 72) / 2 = 18dp с каждой стороны
  const foregroundSizes = [
    { dir: 'mipmap-mdpi',    canvas: 108, inner: 72  },
    { dir: 'mipmap-hdpi',    canvas: 162, inner: 108 },
    { dir: 'mipmap-xhdpi',   canvas: 216, inner: 144 },
    { dir: 'mipmap-xxhdpi',  canvas: 324, inner: 216 },
    { dir: 'mipmap-xxxhdpi', canvas: 432, inner: 288 },
  ];
  for (const { dir, canvas, inner } of foregroundSizes) {
    const outDir = path.join(androidBase, dir);
    const pad = Math.round((canvas - inner) / 2);
    await sharp(src)
      .resize(inner, inner)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 6, g: 9, b: 18, alpha: 0 } })
      .toFile(path.join(outDir, 'ic_launcher_foreground.png'));
  }

  // ic_launcher и ic_launcher_round — тоже с отступом чтобы не обрезались
  for (const { dir, size } of androidSizes) {
    const outDir = path.join(androidBase, dir);
    const inner = Math.round(size * 0.75);
    const pad = Math.round((size - inner) / 2);
    await sharp(src)
      .resize(inner, inner)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 6, g: 9, b: 18, alpha: 255 } })
      .toFile(path.join(outDir, 'ic_launcher.png'));
    await sharp(src)
      .resize(inner, inner)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 6, g: 9, b: 18, alpha: 255 } })
      .toFile(path.join(outDir, 'ic_launcher_round.png'));
  }

  console.log('\nДеланo! Все иконки сгенерированы.');
}

run().catch(console.error);
