import fs from 'fs';
import path from 'path';

// This script creates SVG icons for the extension
// You can later convert these to PNG using an online converter or tools like ImageMagick

const createIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <circle cx="${size * 0.15}" cy="${size * 0.15}" r="${size * 0.08}" fill="white" opacity="0.9"/>
    <circle cx="${size * 0.45}" cy="${size * 0.15}" r="${size * 0.08}" fill="white" opacity="0.9"/>
    <rect x="${size * 0.1}" y="${size * 0.3}" width="${size * 0.4}" height="${size * 0.05}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.4}" width="${size * 0.5}" height="${size * 0.05}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.5}" width="${size * 0.3}" height="${size * 0.05}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
  </g>
  <text x="50%" y="85%" text-anchor="middle" fill="white" font-size="${Math.floor(size/8)}" font-family="Arial, sans-serif" font-weight="bold">CS</text>
</svg>`;
};

const iconsDir = path.join('public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  const iconContent = createIcon(size);
  const iconPath = path.join(iconsDir, `icon${size}.svg`);
  fs.writeFileSync(iconPath, iconContent);
  console.log(`Created icon${size}.svg`);
});

console.log('✅ Icons created in public/icons/');
console.log('💡 Convert these SVG files to PNG for the final extension:');
console.log('   - Use an online converter like convertio.co');
console.log('   - Or use ImageMagick: magick icon128.svg icon128.png');