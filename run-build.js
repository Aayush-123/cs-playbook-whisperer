const { execSync } = require('child_process');

try {
  console.log('🚀 Building your Chrome Extension...\n');
  execSync('node execute-build.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error.message);
}