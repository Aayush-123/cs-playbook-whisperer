import { build } from 'vite';
import fs from 'fs';
import path from 'path';

async function buildExtension() {
  console.log('Building Chrome Extension...');
  
  // Build the extension using the extension config
  await build({
    configFile: 'vite.config.extension.ts'
  });

  // Copy manifest.json to dist-extension
  const manifestSource = path.join('public', 'manifest.json');
  const manifestDest = path.join('dist-extension', 'manifest.json');
  
  if (fs.existsSync(manifestSource)) {
    fs.copyFileSync(manifestSource, manifestDest);
    console.log('Copied manifest.json');
  }

  // Create icons directory and placeholder icons if they don't exist
  const iconsDir = path.join('dist-extension', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create simple placeholder icons (you should replace these with actual icons)
  const createIcon = (size) => {
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#3B82F6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="${Math.floor(size/3)}" font-family="Arial">CS</text>
    </svg>`;
    return svg;
  };

  const iconSizes = [16, 32, 48, 128];
  iconSizes.forEach(size => {
    const iconPath = path.join(iconsDir, `icon${size}.png`);
    if (!fs.existsSync(iconPath)) {
      // Create a simple SVG icon (you'll want to convert this to PNG)
      const svgContent = createIcon(size);
      fs.writeFileSync(iconPath.replace('.png', '.svg'), svgContent);
      console.log(`Created placeholder icon${size}.svg`);
    }
  });

  console.log('✅ Extension built successfully!');
  console.log('📁 Extension files are in: dist-extension/');
  console.log('🔧 To load in Chrome:');
  console.log('   1. Open Chrome and go to chrome://extensions/');
  console.log('   2. Enable "Developer mode"');
  console.log('   3. Click "Load unpacked" and select the dist-extension folder');
}

buildExtension().catch(console.error);