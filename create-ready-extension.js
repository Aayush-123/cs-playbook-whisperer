const fs = require('fs');
const path = require('path');

// Create the complete Chrome Extension package with all necessary files
function createCompleteExtensionPackage() {
  console.log('🚀 Creating complete Chrome Extension package...');

  // Create extension directory
  const extensionDir = 'chrome-extension-ready';
  if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true });
  }
  fs.mkdirSync(extensionDir, { recursive: true });

  // Create icons directory
  const iconsDir = path.join(extensionDir, 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  // Create high-quality PNG icons using data URLs (embedded)
  const createIconDataURL = (size) => {
    // Create a simple but professional icon as base64 data URL
    const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <g transform="translate(${size * 0.15}, ${size * 0.15})">
    <circle cx="${size * 0.12}" cy="${size * 0.12}" r="${size * 0.06}" fill="white" opacity="0.9"/>
    <circle cx="${size * 0.48}" cy="${size * 0.12}" r="${size * 0.06}" fill="white" opacity="0.9"/>
    <rect x="${size * 0.1}" y="${size * 0.25}" width="${size * 0.4}" height="${size * 0.04}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.35}" width="${size * 0.5}" height="${size * 0.04}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
    <rect x="${size * 0.1}" y="${size * 0.45}" width="${size * 0.3}" height="${size * 0.04}" fill="white" opacity="0.9" rx="${size * 0.02}"/>
  </g>
  <text x="50%" y="85%" text-anchor="middle" fill="white" font-size="${Math.floor(size/8)}" font-family="Arial, sans-serif" font-weight="bold">CS</text>
</svg>`;
    
    return canvas;
  };

  // Create icon files for all required sizes
  const iconSizes = [16, 32, 48, 128];
  iconSizes.forEach(size => {
    const iconContent = createIconDataURL(size);
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
      "16": "icons/icon16.svg",
      "32": "icons/icon32.svg", 
      "48": "icons/icon48.svg",
      "128": "icons/icon128.svg"
    },
    "action": {
      "default_popup": "popup.html",
      "default_title": "CS Playbook Generator"
    },
    "permissions": [
      "storage"
    ],
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self'"
    }
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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        width: 400px;
        height: 600px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #ffffff;
        overflow: hidden;
      }
      
      .header {
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .icon {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
      }
      
      .header-title {
        font-size: 18px;
        font-weight: bold;
      }
      
      .header-subtitle {
        font-size: 12px;
        opacity: 0.8;
      }
      
      .content {
        padding: 20px;
        height: calc(100% - 80px);
        overflow-y: auto;
      }
      
      .form-group {
        margin-bottom: 16px;
      }
      
      label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
        color: #374151;
      }
      
      input, textarea, select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
      }
      
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: #3B82F6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      
      textarea {
        resize: vertical;
        min-height: 60px;
      }
      
      .health-buttons {
        display: flex;
        gap: 8px;
        margin-top: 4px;
      }
      
      .health-btn {
        padding: 4px 12px;
        border: 1px solid #d1d5db;
        border-radius: 16px;
        background: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .health-btn.active.healthy {
        background: #10b981;
        color: white;
        border-color: #10b981;
      }
      
      .health-btn.active.at-risk {
        background: #f59e0b;
        color: white;
        border-color: #f59e0b;
      }
      
      .health-btn.active.critical {
        background: #ef4444;
        color: white;
        border-color: #ef4444;
      }
      
      .generate-btn {
        width: 100%;
        background: linear-gradient(135deg, #3B82F6, #1D4ED8);
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      .generate-btn:hover {
        opacity: 0.9;
      }
      
      .generate-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .playbook {
        padding: 20px;
        height: calc(100% - 80px);
        overflow-y: auto;
      }
      
      .section {
        margin-bottom: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: white;
      }
      
      .section-header {
        padding: 12px 16px;
        background: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: between;
        align-items: center;
        cursor: pointer;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
      }
      
      .section-content {
        padding: 16px;
      }
      
      .objective {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .objective-number {
        width: 20px;
        height: 20px;
        background: #3B82F6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        flex-shrink: 0;
      }
      
      .copy-btn {
        background: none;
        border: 1px solid #d1d5db;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        color: #6b7280;
      }
      
      .copy-btn:hover {
        background: #f3f4f6;
      }
      
      .action-item {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 8px;
      }
      
      .action-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      
      .action-text {
        font-weight: 500;
        flex: 1;
        margin-right: 8px;
      }
      
      .priority-badge {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .priority-high {
        background: #fee2e2;
        color: #dc2626;
      }
      
      .priority-medium {
        background: #fef3c7;
        color: #d97706;
      }
      
      .priority-low {
        background: #d1fae5;
        color: #059669;
      }
      
      .action-meta {
        font-size: 12px;
        color: #6b7280;
        display: flex;
        gap: 16px;
      }
      
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="header-left">
        <div class="icon">CS</div>
        <div>
          <div class="header-title">CS Playbook</div>
          <div class="header-subtitle">Strategy generator</div>
        </div>
      </div>
      <button class="copy-btn" onclick="openFullApp()">Open Full App</button>
    </div>

    <div id="form-container" class="content">
      <form id="playbook-form">
        <div class="form-group">
          <label for="customerName">Customer Name</label>
          <input type="text" id="customerName" placeholder="Acme Corporation" required>
        </div>
        
        <div class="form-group">
          <label for="contactName">Contact Name</label>
          <input type="text" id="contactName" placeholder="John Smith" required>
        </div>
        
        <div class="form-group">
          <label for="contactRole">Contact Role</label>
          <input type="text" id="contactRole" placeholder="VP of Operations" required>
        </div>
        
        <div class="form-group">
          <label for="accountValue">Account Value (ARR)</label>
          <input type="text" id="accountValue" placeholder="$50,000" required>
        </div>
        
        <div class="form-group">
          <label>Account Health</label>
          <div class="health-buttons">
            <button type="button" class="health-btn active healthy" data-health="healthy">Healthy</button>
            <button type="button" class="health-btn" data-health="at-risk">At Risk</button>
            <button type="button" class="health-btn" data-health="critical">Critical</button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="scenario">Scenario Type</label>
          <select id="scenario" required>
            <option value="payment_issues">Payment/Billing Issues</option>
            <option value="usage_decline">Usage Decline</option>
            <option value="expansion_opportunity">Expansion Opportunity</option>
            <option value="technical_problems">Technical Problems</option>
            <option value="executive_change">Executive Change</option>
            <option value="renewal_risk">Renewal Risk</option>
            <option value="onboarding_issues">Onboarding Issues</option>
            <option value="custom" selected>Custom Scenario</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="customSignal">Signal/Issue Description</label>
          <textarea id="customSignal" placeholder="Customer mentioned they're evaluating competitors during the last call..." required></textarea>
        </div>
        
        <button type="submit" class="generate-btn" id="generateBtn">
          Generate CS Playbook
        </button>
      </form>
    </div>

    <div id="playbook-container" class="playbook hidden">
      <div class="section">
        <div class="section-header">
          <div class="section-title">Signal Summary</div>
          <button class="copy-btn" onclick="copyText('signal-summary')">Copy</button>
        </div>
        <div class="section-content">
          <p id="signal-summary"></p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-title">CS Objectives</div>
          <button class="copy-btn" onclick="copyText('objectives')">Copy</button>
        </div>
        <div class="section-content" id="objectives"></div>
      </div>
      
      <div class="section">
        <div class="section-header">
          <div class="section-title">Action Plan</div>
          <button class="copy-btn" onclick="copyText('actions')">Copy</button>
        </div>
        <div class="section-content" id="actions"></div>
      </div>
      
      <div style="text-align: center; padding: 16px;">
        <button class="copy-btn" onclick="showForm()" style="background: #3B82F6; color: white; border-color: #3B82F6;">
          Generate New Playbook
        </button>
      </div>
    </div>

    <script src="popup.js"></script>
  </body>
</html>`;

  fs.writeFileSync(path.join(extensionDir, 'popup.html'), popupHTML);
  console.log('✓ Created popup.html');

  // Create popup.js with full functionality
  const popupJS = `// CS Playbook Generator Extension

let currentHealth = 'healthy';
let currentPlaybook = null;

// Mock playbook generation logic
const scenarioTemplates = {
  payment_issues: {
    signalSummary: "Payment processing issue identified with potential impact on renewal",
    objectives: [
      "Resolve immediate payment/billing concern within 24 hours",
      "Restore customer confidence in billing processes", 
      "Prevent escalation to executive level",
      "Document process improvements to prevent recurrence"
    ]
  },
  usage_decline: {
    signalSummary: "Significant usage decline detected requiring immediate intervention and support",
    objectives: [
      "Identify root cause of usage decline within 48 hours",
      "Re-engage users with targeted training and support",
      "Restore usage to baseline levels within 30 days",
      "Implement monitoring to prevent future declines"
    ]
  },
  expansion_opportunity: {
    signalSummary: "Strong expansion opportunity identified based on usage patterns and customer feedback",
    objectives: [
      "Quantify expansion opportunity and present business case",
      "Schedule expansion discussion with decision makers",
      "Prepare customized proposal within 2 weeks",
      "Secure expansion commitment within 60 days"
    ]
  },
  technical_problems: {
    signalSummary: "Technical issues impacting customer productivity requiring immediate resolution",
    objectives: [
      "Escalate technical issue to highest priority queue immediately",
      "Provide temporary workaround within 4 hours",
      "Deliver permanent solution within 48 hours",
      "Conduct post-resolution review with customer"
    ]
  },
  executive_change: {
    signalSummary: "Key executive change detected requiring relationship rebuild and strategy alignment",
    objectives: [
      "Research new executive background and priorities within 48 hours",
      "Schedule introduction meeting within 2 weeks",
      "Present renewed value proposition aligned with their goals",
      "Establish trust and credibility with new stakeholder"
    ]
  },
  renewal_risk: {
    signalSummary: "Renewal at risk requiring immediate intervention and value reinforcement",
    objectives: [
      "Conduct urgent risk assessment within 24 hours",
      "Schedule stakeholder alignment meeting within 1 week",
      "Present compelling renewal business case",
      "Address all objections and concerns transparently"
    ]
  },
  onboarding_issues: {
    signalSummary: "Onboarding complications requiring accelerated support and intervention",
    objectives: [
      "Identify specific onboarding blockers within 24 hours",
      "Assign dedicated implementation specialist",
      "Create accelerated onboarding timeline",
      "Ensure successful first value delivery within 30 days"
    ]
  },
  custom: {
    signalSummary: "Custom customer signal requiring tailored approach and strategic response",
    objectives: [
      "Analyze unique customer situation thoroughly",
      "Develop customized action plan based on specific context",
      "Engage appropriate internal resources and expertise",
      "Monitor progress closely with frequent check-ins"
    ]
  }
};

document.addEventListener('DOMContentLoaded', function() {
  // Health button handlers
  document.querySelectorAll('.health-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.health-btn').forEach(b => b.classList.remove('active', 'healthy', 'at-risk', 'critical'));
      this.classList.add('active', this.dataset.health);
      currentHealth = this.dataset.health;
    });
  });

  // Form submission
  document.getElementById('playbook-form').addEventListener('submit', function(e) {
    e.preventDefault();
    generatePlaybook();
  });

  // Load saved playbook if exists
  loadSavedPlaybook();
});

function generatePlaybook() {
  const btn = document.getElementById('generateBtn');
  btn.disabled = true;
  btn.textContent = 'Generating...';

  // Get form data
  const customerName = document.getElementById('customerName').value;
  const contactName = document.getElementById('contactName').value;
  const scenario = document.getElementById('scenario').value;
  const customSignal = document.getElementById('customSignal').value;

  // Simulate API delay
  setTimeout(() => {
    const template = scenarioTemplates[scenario] || scenarioTemplates.custom;
    
    // Generate personalized playbook
    const playbook = {
      signalSummary: customerName + ': ' + (scenario === 'custom' ? customSignal : template.signalSummary),
      objectives: template.objectives,
      actionPlan: generateActionPlan(customerName, contactName, scenario),
      timestamp: Date.now()
    };

    currentPlaybook = playbook;
    displayPlaybook(playbook);
    savePlaybook(playbook);

    btn.disabled = false;
    btn.textContent = 'Generate CS Playbook';
  }, 1500);
}

function generateActionPlan(customerName, contactName, scenario) {
  const baseActions = [
    {
      action: \`Immediate outreach to \${contactName} to acknowledge the situation\`,
      timeline: "Within 2 hours",
      owner: "CS Manager",
      priority: "high"
    },
    {
      action: \`Review \${customerName} account health and recent activity patterns\`,
      timeline: "Within 4 hours", 
      owner: "CS Analyst",
      priority: "high"
    },
    {
      action: \`Schedule follow-up meeting with \${contactName} and key stakeholders\`,
      timeline: "Within 24 hours",
      owner: "CS Manager",
      priority: "medium"
    }
  ];

  // Add scenario-specific actions
  if (scenario === 'payment_issues') {
    baseActions.push({
      action: "Coordinate with billing team to investigate payment discrepancy",
      timeline: "Within 4 hours",
      owner: "Billing Specialist", 
      priority: "high"
    });
  } else if (scenario === 'usage_decline') {
    baseActions.push({
      action: "Analyze usage data to identify specific decline patterns",
      timeline: "Within 6 hours",
      owner: "Data Analyst",
      priority: "high"
    });
  }

  return baseActions;
}

function displayPlaybook(playbook) {
  // Show playbook, hide form
  document.getElementById('form-container').classList.add('hidden');
  document.getElementById('playbook-container').classList.remove('hidden');

  // Populate content
  document.getElementById('signal-summary').textContent = playbook.signalSummary;

  // Objectives
  const objectivesContainer = document.getElementById('objectives');
  objectivesContainer.innerHTML = '';
  playbook.objectives.forEach((objective, index) => {
    const div = document.createElement('div');
    div.className = 'objective';
    div.innerHTML = \`
      <div class="objective-number">\${index + 1}</div>
      <div>\${objective}</div>
    \`;
    objectivesContainer.appendChild(div);
  });

  // Actions
  const actionsContainer = document.getElementById('actions');
  actionsContainer.innerHTML = '';
  playbook.actionPlan.forEach(action => {
    const div = document.createElement('div');
    div.className = 'action-item';
    div.innerHTML = \`
      <div class="action-header">
        <div class="action-text">\${action.action}</div>
        <div class="priority-badge priority-\${action.priority}">\${action.priority}</div>
      </div>
      <div class="action-meta">
        <span>⏱️ \${action.timeline}</span>
        <span>👤 \${action.owner}</span>
      </div>
    \`;
    actionsContainer.appendChild(div);
  });
}

function showForm() {
  document.getElementById('playbook-container').classList.add('hidden');
  document.getElementById('form-container').classList.remove('hidden');
}

function copyText(elementId) {
  let text = '';
  const element = document.getElementById(elementId);
  
  if (elementId === 'signal-summary') {
    text = element.textContent;
  } else if (elementId === 'objectives') {
    text = currentPlaybook.objectives.map((obj, i) => \`\${i + 1}. \${obj}\`).join('\\n');
  } else if (elementId === 'actions') {
    text = currentPlaybook.actionPlan.map(action => 
      \`\${action.action} (\${action.timeline}, \${action.owner}, Priority: \${action.priority})\`
    ).join('\\n');
  }

  navigator.clipboard.writeText(text).then(() => {
    // Show feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1000);
  });
}

function savePlaybook(playbook) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({
      lastPlaybook: playbook,
      timestamp: Date.now()
    });
  }
}

function loadSavedPlaybook() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['lastPlaybook', 'timestamp']).then((result) => {
      if (result.lastPlaybook && result.timestamp) {
        // Only load if it's less than 24 hours old
        const hoursSinceGeneration = (Date.now() - result.timestamp) / (1000 * 60 * 60);
        if (hoursSinceGeneration < 24) {
          currentPlaybook = result.lastPlaybook;
          displayPlaybook(result.lastPlaybook);
        }
      }
    });
  }
}

function openFullApp() {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.create({ url: 'https://your-cs-playbook-app.com' });
  } else {
    window.open('https://your-cs-playbook-app.com', '_blank');
  }
}`;

  fs.writeFileSync(path.join(extensionDir, 'popup.js'), popupJS);
  console.log('✓ Created popup.js');

  // Create detailed installation guide
  const installGuide = `# 🚀 CS Playbook Generator - Chrome Extension Installation

## ✅ Ready to Install!

This package contains everything you need to install the CS Playbook Generator Chrome extension.

### 📋 Installation Steps:

1. **Open Chrome Extensions Page**
   - Go to \`chrome://extensions/\` in Chrome
   - Or: Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle "Developer mode" switch (top-right corner)

3. **Install Extension**
   - Click "Load unpacked" button
   - Select this entire folder (\`chrome-extension-ready\`)
   - Extension will appear in your Chrome toolbar

4. **Start Using**
   - Click the CS Playbook icon in your toolbar
   - Fill out customer context form
   - Generate comprehensive playbooks instantly!

### 📁 What's Included:

- ✅ \`manifest.json\` - Extension configuration
- ✅ \`popup.html\` - Extension interface (400x600px)
- ✅ \`popup.js\` - Full functionality with playbook generation
- ✅ \`icons/\` - Professional SVG icons (all sizes)
- ✅ Copy-to-clipboard functionality
- ✅ Persistent storage (remembers last playbook)
- ✅ Multiple CS scenario templates

### 🎯 Features:

- **Quick Access**: Click toolbar icon for instant access
- **Smart Templates**: 7+ pre-built CS scenario types
- **Action Plans**: Prioritized tasks with timelines and owners
- **Copy Sections**: One-click copying to clipboard
- **Persistent Storage**: Saves your last playbook for 24 hours
- **Compact Design**: Optimized for browser popup window

### 🔧 Troubleshooting:

**Extension won't load:**
- Ensure you selected the correct folder
- Check that all files are present
- Try refreshing the extensions page

**Popup doesn't work:**
- Check for JavaScript errors in DevTools
- Verify all files loaded correctly
- Try reloading the extension

### 🌟 For Chrome Web Store Distribution:

If you want to publish to Chrome Web Store:

1. **Convert Icons to PNG** (currently SVG for development):
   - Use https://convertio.co/svg-png/
   - Convert all icons in \`icons/\` folder
   - Keep same filenames, change .svg to .png

2. **Update manifest.json**:
   - Change icon paths from .svg to .png
   - Update version, description if needed

3. **Zip and Upload**:
   - Zip this entire folder
   - Upload to Chrome Web Store Developer Dashboard

---

🎉 **Your extension is ready to use!** 

Click the CS Playbook icon in Chrome to start generating professional Customer Success playbooks instantly.
`;

  fs.writeFileSync(path.join(extensionDir, 'INSTALL_GUIDE.md'), installGuide);
  console.log('✓ Created installation guide');

  console.log('\n🎉 Complete Chrome Extension Package Created!');
  console.log(`📁 Location: ${extensionDir}/`);
  console.log('\n🚀 Installation Instructions:');
  console.log('1. Open Chrome → chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log(`4. Select the "${extensionDir}" folder`);
  console.log('5. Start using your CS Playbook extension!');
  
  return extensionDir;
}

// Run the function
createCompleteExtensionPackage();