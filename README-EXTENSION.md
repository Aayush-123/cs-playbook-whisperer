# CS Playbook Generator - Chrome Extension

Transform your CS Playbook Generator web app into a Chrome extension for quick access while working in CRMs, support systems, or customer accounts.

## 🚀 Quick Start

### 1. Build the Extension

```bash
# Install dependencies (if not already done)
npm install

# Create extension icons
node scripts/create-icons.js

# Build the extension
node scripts/build-extension.js
```

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked" button
4. Select the `dist-extension` folder
5. The CS Playbook Generator extension should now appear in your Chrome toolbar

### 3. Use the Extension

- Click the CS Playbook icon in your Chrome toolbar
- Fill out the compact customer context form
- Generate comprehensive playbooks instantly
- Copy sections to clipboard with one click
- Access the full app by clicking the external link icon

## 📁 File Structure

```
├── public/
│   ├── manifest.json           # Extension manifest
│   └── icons/                  # Extension icons
├── src/
│   ├── components/
│   │   ├── ExtensionHeader.tsx      # Compact header for popup
│   │   ├── CompactCustomerForm.tsx  # Streamlined form
│   │   └── CompactPlaybookDisplay.tsx # Compact playbook view
│   ├── popup.tsx               # Extension popup entry point
│   └── PopupApp.tsx           # Main popup app component
├── popup.html                 # Extension popup HTML
├── vite.config.extension.ts   # Extension build config
└── scripts/
    ├── build-extension.js     # Extension build script
    └── create-icons.js        # Icon generation script
```

## 🔧 Extension Features

### Popup Interface (400x600px)
- **Compact Form**: Streamlined customer context input
- **Collapsible Sections**: Expandable playbook sections to save space
- **Quick Copy**: One-click copy to clipboard for any section
- **Persistent Storage**: Remembers last playbook for 24 hours
- **Full App Access**: Quick link to open full web app

### Chrome Extension APIs Used
- **Storage API**: Persist playbooks between sessions
- **Tabs API**: Open full app in new tab
- **Active Tab**: Access current page context (future feature)

## 🎨 Icon Creation

The extension includes a script to generate professional SVG icons:

```bash
node scripts/create-icons.js
```

**Convert to PNG**: Use an online converter or ImageMagick:
```bash
# Using ImageMagick (if installed)
magick public/icons/icon128.svg public/icons/icon128.png
```

## 🛠 Development

### Building for Development
```bash
# Build extension
npm run build:extension

# Or use the script directly
node scripts/build-extension.js
```

### Testing Changes
1. Make code changes
2. Run build script
3. Go to `chrome://extensions/`
4. Click refresh icon on your extension
5. Test the updated version

## 📦 Distribution

### Preparing for Chrome Web Store

1. **Create proper PNG icons** (convert from generated SVGs)
2. **Update manifest.json** with final details:
   - Add your developer info
   - Update permissions if needed
   - Set final version number
3. **Test thoroughly** in different Chrome environments
4. **Zip the dist-extension folder** for upload

### Required for Chrome Web Store
- PNG icons (16x16, 32x32, 48x48, 128x128)
- Detailed description
- Screenshots of the extension in use
- Privacy policy (if collecting user data)

## 🔒 Permissions Explained

- **storage**: Save playbooks locally for persistence
- **activeTab**: Access current page (for future CRM integration)
- **tabs** (optional): Open full app in new tab

## 🎯 Future Enhancements

1. **CRM Integration**: Auto-populate customer data from Salesforce, HubSpot, etc.
2. **Content Scripts**: Inject CS insights directly into CRM pages
3. **Background Processing**: Monitor customer signals automatically
4. **Team Sharing**: Share playbooks with team members
5. **Templates**: Save and reuse custom playbook templates

## 🐛 Troubleshooting

### Extension Won't Load
- Check that all files are in `dist-extension/`
- Verify `manifest.json` is valid JSON
- Ensure all required icons exist

### Popup Doesn't Open
- Check console for JavaScript errors
- Verify popup.html and popup.tsx are built correctly
- Test in incognito mode

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check that TypeScript compiles: `npm run build`
- Verify file paths in vite.config.extension.ts

## 📞 Support

For issues specific to the Chrome extension:
1. Check the Chrome DevTools console in the popup
2. Verify extension permissions
3. Test with a fresh build: `node scripts/build-extension.js`

The extension maintains full feature parity with the web app while providing a streamlined, always-accessible interface for busy Customer Success Managers.