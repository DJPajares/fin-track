import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const ICONS_DIR = path.join(process.cwd(), 'public', 'icons');
const PADDING_RATIO = 0.15; // 15% padding on each side

interface IconConfig {
  name: string;
  size: number;
  outputName: string;
}

const iconConfigs: IconConfig[] = [
  { name: 'favicon-96x96.png', size: 96, outputName: 'favicon-96x96.png' },
  {
    name: 'web-app-manifest-192x192.png',
    size: 192,
    outputName: 'web-app-manifest-192x192.png',
  },
  {
    name: 'web-app-manifest-512x512.png',
    size: 512,
    outputName: 'web-app-manifest-512x512.png',
  },
  {
    name: 'apple-touch-icon.png',
    size: 180,
    outputName: 'apple-touch-icon.png',
  },
];

async function resizeIconWithPadding(config: IconConfig) {
  const inputPath = path.join(ICONS_DIR, config.name);
  const outputPath = path.join(ICONS_DIR, config.outputName);

  // Calculate the new size for the inner image (with padding)
  const innerSize = Math.round(config.size * (1 - PADDING_RATIO * 2));

  try {
    // Create a new image with the original size and transparent background
    const resizedIcon = await sharp(inputPath)
      .resize(innerSize, innerSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png();

    // Create a new canvas with the target size and center the resized icon
    await sharp({
      create: {
        width: config.size,
        height: config.size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: await resizedIcon.toBuffer(),
          top: Math.round((config.size - innerSize) / 2),
          left: Math.round((config.size - innerSize) / 2),
        },
      ])
      .png()
      .toFile(outputPath);

    console.log(
      `✅ Created ${config.outputName} (${config.size}x${config.size}) with ${Math.round(PADDING_RATIO * 100)}% padding`,
    );
  } catch (error) {
    console.error(`❌ Error processing ${config.name}:`, error);
  }
}

async function main() {
  console.log('🎨 Resizing icons with better padding...\n');

  // Create backup of original icons
  const backupDir = path.join(ICONS_DIR, 'backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Backup original icons
  for (const config of iconConfigs) {
    const originalPath = path.join(ICONS_DIR, config.name);
    const backupPath = path.join(backupDir, config.name);
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
    }
  }
  console.log('📦 Original icons backed up to icons/backup/\n');

  // Process each icon
  for (const config of iconConfigs) {
    await resizeIconWithPadding(config);
  }

  console.log('\n🎉 Icon resizing complete!');
  console.log(
    `📝 Icons now have ${Math.round(PADDING_RATIO * 100)}% padding around the content`,
  );
  console.log('💾 Original icons are backed up in icons/backup/');
}

main().catch(console.error);
