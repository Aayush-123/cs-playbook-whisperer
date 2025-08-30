require('child_process').exec('node create-ready-extension.js', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(stdout);
  if (stderr) console.error('Stderr:', stderr);
  
  // Now create the ZIP
  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');

  if (fs.existsSync('chrome-extension-ready')) {
    try {
      // Create ZIP for download
      if (process.platform === 'win32') {
        // Windows - using PowerShell
        execSync('powershell Compress-Archive -Path chrome-extension-ready/* -DestinationPath cs-playbook-chrome-extension.zip -Force');
      } else {
        // Unix/Mac
        execSync('cd chrome-extension-ready && zip -r ../cs-playbook-chrome-extension.zip . -x "*.DS_Store" && cd ..');
      }
      
      console.log('\n✅ SUCCESS! Your Chrome Extension is ready!\n');
      console.log('📦 Files created:');
      console.log('   📁 chrome-extension-ready/ (development folder)');
      console.log('   📥 cs-playbook-chrome-extension.zip (downloadable)\n');
      console.log('🚀 To install in Chrome:');
      console.log('   1. Download/extract the ZIP file');
      console.log('   2. Go to chrome://extensions/');
      console.log('   3. Enable "Developer mode"');
      console.log('   4. Click "Load unpacked"');
      console.log('   5. Select the extracted folder\n');
      console.log('🎯 Your extension includes:');
      console.log('   ✓ Professional popup interface (400x600px)');
      console.log('   ✓ Full CS playbook generation');
      console.log('   ✓ 7+ scenario templates');
      console.log('   ✓ Copy-to-clipboard functionality');
      console.log('   ✓ Persistent storage');
      console.log('   ✓ Professional icons');
      console.log('   ✓ Complete installation guide\n');
      console.log('🎉 Ready to make your CS work super easy!');
      
    } catch (zipError) {
      console.log('\n✅ Extension created successfully!');
      console.log('📁 Location: chrome-extension-ready/');
      console.log('⚠️  Could not create ZIP automatically, but you can:');
      console.log('   - Use the chrome-extension-ready folder directly');
      console.log('   - Or manually zip it for sharing');
    }
  } else {
    console.log('❌ Error: Extension folder not created');
  }
});