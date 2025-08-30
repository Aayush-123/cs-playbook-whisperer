node create-ready-extension.js

echo "🎁 Creating downloadable ZIP package..."

# Create ZIP file for easy download
if [ -d "chrome-extension-ready" ]; then
    # Remove any existing zip
    rm -f cs-playbook-chrome-extension.zip
    
    # Create zip file 
    cd chrome-extension-ready
    zip -r ../cs-playbook-chrome-extension.zip . -x "*.DS_Store"
    cd ..
    
    echo ""
    echo "✅ SUCCESS! Your Chrome Extension is ready!"
    echo ""
    echo "📦 Files created:"
    echo "   📁 chrome-extension-ready/ (for development)"
    echo "   📥 cs-playbook-chrome-extension.zip (for easy sharing)"
    echo ""
    echo "🚀 To install in Chrome:"
    echo "   1. Extract the ZIP file" 
    echo "   2. Go to chrome://extensions/"
    echo "   3. Enable 'Developer mode'"
    echo "   4. Click 'Load unpacked'"
    echo "   5. Select the extracted folder"
    echo ""
    echo "🎯 Your extension includes:"
    echo "   ✓ Professional popup interface (400x600px)"
    echo "   ✓ Full CS playbook generation"
    echo "   ✓ 7+ scenario templates"
    echo "   ✓ Copy-to-clipboard functionality"
    echo "   ✓ Persistent storage"
    echo "   ✓ Professional icons"
    echo "   ✓ Complete installation guide"
    echo ""
    echo "🎉 Ready to make your CS work super easy!"
else
    echo "❌ Error creating extension package"
fi