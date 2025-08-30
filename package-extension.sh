#!/bin/bash

echo "🚀 Creating downloadable Chrome Extension package..."

# Create the extension package
node create-complete-extension.js

# Create a zip file for easy download
if [ -d "chrome-extension-package" ]; then
    echo "📦 Creating downloadable ZIP file..."
    
    # Remove any existing zip
    rm -f cs-playbook-extension.zip
    
    # Create zip file
    cd chrome-extension-package
    zip -r ../cs-playbook-extension.zip . -x "*.DS_Store" "*/.git/*"
    cd ..
    
    echo "✅ Extension package created!"
    echo "📁 Folder: chrome-extension-package/"
    echo "📥 Download: cs-playbook-extension.zip"
    echo ""
    echo "🔧 Installation Steps:"
    echo "1. Extract cs-playbook-extension.zip"
    echo "2. Open Chrome → chrome://extensions/"
    echo "3. Enable 'Developer mode'"
    echo "4. Click 'Load unpacked'"
    echo "5. Select the extracted folder"
    echo ""
    echo "💡 For Chrome Web Store: Convert SVG icons to PNG first"
else
    echo "❌ Failed to create extension package"
fi