import fs from 'fs';
import path from 'path';

// Create a simple placeholder icon for missing sizes
function createPlaceholderIcon(size: number): string {
  // For now, we'll create a simple text file as placeholder
  // In a real implementation, you'd use a library like sharp to convert SVG to PNG
  return `Placeholder icon for ${size}x${size}`;
}

const requiredIcons: { size: number; filename: string }[] = [
  { size: 192, filename: 'web-app-manifest-192x192.png' },
  { size: 512, filename: 'web-app-manifest-512x512.png' },
];

const iconsDir = path.join(__dirname, '../public/icons');

// Create placeholder files for missing icons
requiredIcons.forEach((icon) => {
  const filePath = path.join(iconsDir, icon.filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, createPlaceholderIcon(icon.size));
    // eslint-disable-next-line no-console
    console.log(`Created placeholder for ${icon.filename}`);
  }
});

// Create browserconfig.xml for Windows tiles
const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/web-app-manifest-192x192.png"/>
            <TileColor>#000000</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

fs.writeFileSync(path.join(iconsDir, 'browserconfig.xml'), browserConfig);

// Create safari-pinned-tab.svg
const safariIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#000000"/>
  <text x="8" y="12" text-anchor="middle" fill="white" font-family="Arial" font-size="10">FT</text>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'safari-pinned-tab.svg'), safariIcon);

console.log('PWA icon files created successfully!');
console.log(
  'Note: You should replace the placeholder icons with actual PNG files for production.',
);
