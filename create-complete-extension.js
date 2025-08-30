const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function createCompleteExtension() {
  console.log('🚀 Creating complete Chrome extension package...');

  // Create extension directory
  const extensionDir = 'chrome-extension-package';
  if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true });
  }
  fs.mkdirSync(extensionDir, { recursive: true });

  // Create icons directory
  const iconsDir = path.join(extensionDir, 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  // Generate icon SVGs and convert info
  const createIconSVG = (size) => {
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

  // Create icon files
  const iconSizes = [16, 32, 48, 128];
  iconSizes.forEach(size => {
    const iconContent = createIconSVG(size);
    const iconPath = path.join(iconsDir, `icon${size}.svg`);
    fs.writeFileSync(iconPath, iconContent);
    console.log(`✓ Created icon${size}.svg`);
  });

  // Create manifest.json
  const manifest = {
    "manifest_version": 3,
    "name": "CS Playbook Generator",
    "description": "Transform customer signals into comprehensive, actionable Customer Success playbooks with AI-powered insights and strategic action plans.",
    "version": "1.0.0",
    "icons": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png", 
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "action": {
      "default_popup": "popup.html",
      "default_title": "CS Playbook Generator"
    },
    "permissions": [
      "storage",
      "activeTab"
    ],
    "optional_permissions": [
      "tabs"
    ],
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self'"
    },
    "web_accessible_resources": [
      {
        "resources": [
          "assets/*"
        ],
        "matches": ["<all_urls>"]
      }
    ]
  };

  fs.writeFileSync(
    path.join(extensionDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✓ Created manifest.json');

  // Create popup.html
  const popupHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CS Playbook Generator</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 400px;
        height: 600px;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #root {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="popup.js"></script>
  </body>
</html>`;

  fs.writeFileSync(path.join(extensionDir, 'popup.html'), popupHTML);
  console.log('✓ Created popup.html');

  // Try to build the actual extension files
  try {
    console.log('🔨 Building extension files...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Copy built files if they exist
    if (fs.existsSync('dist')) {
      // Copy dist files to extension package
      const copyDir = (src, dest) => {
        if (!fs.existsSync(src)) return;
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        files.forEach(file => {
          const srcFile = path.join(src, file);
          const destFile = path.join(dest, file);
          
          if (fs.statSync(srcFile).isDirectory()) {
            copyDir(srcFile, destFile);
          } else {
            fs.copyFileSync(srcFile, destFile);
          }
        });
      };

      copyDir('dist', extensionDir);
      console.log('✓ Copied built files');
    }
  } catch (error) {
    console.log('⚠️  Build step skipped - you can build manually later');
  }

  // Create README for the extension
  const extensionReadme = `# CS Playbook Generator - Chrome Extension

## 🚀 Installation Instructions

### Method 1: Load Unpacked (Development)
1. Open Chrome and go to \`chrome://extensions/\`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this entire folder
5. The extension will appear in your toolbar

### Method 2: Convert Icons and Package
If you want to prepare for Chrome Web Store:

1. **Convert SVG icons to PNG:**
   - Go to https://convertio.co/svg-png/
   - Upload each icon SVG file in the \`icons/\` folder
   - Download as PNG with same names (icon16.png, icon32.png, etc.)
   - Replace the SVG files with PNG files

2. **Update manifest.json** if needed for your organization

3. **Zip this folder** for Chrome Web Store submission

## 📁 Files Included

- \`manifest.json\` - Extension configuration
- \`popup.html\` - Extension popup interface  
- \`popup.js\` - Extension logic (generated from build)
- \`icons/\` - Extension icons (SVG format, convert to PNG)
- \`assets/\` - Compiled CSS and other assets

## 🔧 Features

- **Quick Access**: Click extension icon for instant CS playbook generation
- **Compact Interface**: Optimized for 400x600px popup window
- **Persistent Storage**: Remembers your last playbook for 24 hours
- **Copy to Clipboard**: One-click copying of any playbook section
- **Full App Link**: Quick access to complete web application

## 🐛 Troubleshooting

**Extension won't load:**
- Check that all files are in the same folder
- Ensure you selected the correct folder in "Load unpacked"
- Try refreshing the extension in chrome://extensions/

**Popup doesn't work:**
- Check browser console for errors
- Verify popup.js file exists and is not empty
- Try reloading the extension

## 📞 Support

For technical issues:
1. Check Chrome DevTools console in the popup
2. Verify all files are present
3. Try building from source code if needed

---
Generated by CS Playbook Generator Extension Builder
`;

  fs.writeFileSync(path.join(extensionDir, 'README.md'), extensionReadme);
  console.log('✓ Created README.md');

  // Create a simple popup.js as fallback
  const popupJS = `// CS Playbook Generator Extension
console.log('CS Playbook Generator Extension loaded');

// Basic extension functionality
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = \`
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h3 style="color: #3B82F6; margin-bottom: 10px;">CS Playbook Generator</h3>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
          Transform customer signals into actionable strategies
        </p>
        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 15px;">
          <p style="margin: 0; font-size: 12px; color: #666;">
            This is a basic fallback interface. For full functionality, please build the extension with the complete source code.
          </p>
        </div>
        <button onclick="openFullApp()" style="
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          width: 100%;
        ">
          Open Full App
        </button>
      </div>
    \`;
  }
});

function openFullApp() {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url: 'https://your-app-url.com' });
  } else {
    window.open('https://your-app-url.com', '_blank');
  }
}`;

  fs.writeFileSync(path.join(extensionDir, 'popup.js'), popupJS);
  console.log('✓ Created popup.js fallback');

  // Create conversion instructions
  const conversionInstructions = `# Icon Conversion Instructions

Your extension icons are currently in SVG format. For Chrome Web Store submission, you need PNG icons.

## Quick Conversion Steps:

1. **Go to https://convertio.co/svg-png/**

2. **Upload these files:**
   - icons/icon16.svg → convert to icon16.png
   - icons/icon32.svg → convert to icon32.png  
   - icons/icon48.svg → convert to icon48.png
   - icons/icon128.svg → convert to icon128.png

3. **Replace the SVG files with PNG files**

4. **Keep the same names** (just change .svg to .png)

## Alternative: Use ImageMagick (if installed)
\`\`\`bash
cd icons/
magick icon16.svg icon16.png
magick icon32.svg icon32.png
magick icon48.svg icon48.png
magick icon128.svg icon128.png
\`\`\`

The SVG icons will work for development, but PNG is required for Chrome Web Store.
`;

  fs.writeFileSync(path.join(extensionDir, 'CONVERT_ICONS.md'), conversionInstructions);
  console.log('✓ Created icon conversion instructions');

  console.log('\n🎉 Chrome Extension Package Created Successfully!');
  console.log(`📁 Location: ${extensionDir}/`);
  console.log('\n📋 Next Steps:');
  console.log('1. Open Chrome and go to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log(`4. Select the "${extensionDir}" folder`);
  console.log('5. (Optional) Convert SVG icons to PNG for Chrome Web Store');
  
  return extensionDir;
}

if (require.main === module) {
  createCompleteExtension().catch(console.error);
}

module.exports = { createCompleteExtension };
`;
  fs.writeFileSync('create-complete-extension.js', content);
}