// CS Playbook Generator - Chrome Extension
// Main popup functionality

class CSPlaybookGenerator {
    constructor() {
        this.currentPlaybook = null;
        this.expandedSections = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLastPlaybook();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('customerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePlaybook();
        });

        // Health selection
        document.querySelectorAll('.health-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.health-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            });
        });

        // New playbook button
        document.getElementById('newBtn').addEventListener('click', () => {
            this.showForm();
        });
    }

    async loadLastPlaybook() {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const result = await chrome.storage.local.get(['lastPlaybook', 'lastGenerated']);
                if (result.lastPlaybook && result.lastGenerated) {
                    const lastGenerated = new Date(result.lastGenerated);
                    const now = new Date();
                    const hoursDiff = (now - lastGenerated) / (1000 * 60 * 60);
                    
                    // Show last playbook if generated within 24 hours
                    if (hoursDiff < 24) {
                        this.currentPlaybook = result.lastPlaybook;
                        this.displayPlaybook(this.currentPlaybook);
                        return;
                    }
                }
            }
        } catch (error) {
            console.log('No previous playbook found');
        }
        this.showForm();
    }

    async savePlaybook(playbook) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                await chrome.storage.local.set({
                    lastPlaybook: playbook,
                    lastGenerated: new Date().toISOString()
                });
            }
        } catch (error) {
            console.log('Could not save playbook');
        }
    }

    showForm() {
        document.getElementById('formContainer').classList.remove('hidden');
        document.getElementById('playbookContainer').classList.add('hidden');
        document.getElementById('newBtn').style.display = 'none';
    }

    async generatePlaybook() {
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span>Generating...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const context = this.getFormData();
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate playbook
            const playbook = this.generatePlaybookFromContext(context);
            
            // Save and display
            await this.savePlaybook(playbook);
            this.currentPlaybook = playbook;
            this.displayPlaybook(playbook);
            
        } catch (error) {
            console.error('Error generating playbook:', error);
            alert('Error generating playbook. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    getFormData() {
        const selectedHealth = document.querySelector('.health-option.selected');
        
        return {
            customerName: document.getElementById('customerName').value,
            contactName: document.getElementById('contactName').value,
            contactRole: document.getElementById('contactRole').value,
            accountValue: document.getElementById('accountValue').value,
            currentHealth: selectedHealth ? selectedHealth.dataset.health : 'healthy',
            scenario: document.getElementById('scenario').value,
            customSignal: document.getElementById('customSignal').value,
            productUsage: '',
            relationshipHistory: ''
        };
    }

    generatePlaybookFromContext(context) {
        const templates = this.getScenarioTemplates();
        const template = templates[context.scenario] || templates.custom;
        
        const playbook = {
            signalSummary: this.generateSignalSummary(context, template),
            objectives: template.objectives.map(obj => 
                obj.replace('{customerName}', context.customerName)
                   .replace('{contactName}', context.contactName)
            ),
            actionPlan: this.generateActionPlan(context),
            communicationTemplate: this.generateCommunicationTemplate(context, template),
            risksOpportunities: this.generateRisksOpportunities(context),
            bestPractices: template.bestPractices,
            generatedAt: new Date()
        };

        return playbook;
    }

    generateSignalSummary(context, template) {
        return template.signalSummary
            .replace('{customerName}', context.customerName)
            .replace('{contactName}', context.contactName)
            .replace('{contactRole}', context.contactRole)
            .replace('{customSignal}', context.customSignal)
            .replace('{accountValue}', context.accountValue);
    }

    generateActionPlan(context) {
        const baseActions = [
            {
                action: `Reach out to ${context.contactName} within 24 hours`,
                timeline: '24 hours',
                owner: 'CSM',
                priority: 'high'
            },
            {
                action: 'Document the situation in CRM with detailed notes',
                timeline: 'Immediate',
                owner: 'CSM',
                priority: 'high'
            }
        ];

        const scenarioActions = this.getScenarioSpecificActions(context);
        return [...baseActions, ...scenarioActions];
    }

    getScenarioSpecificActions(context) {
        const scenarioActions = {
            payment_issues: [
                {
                    action: 'Coordinate with billing team to review account status',
                    timeline: '2 hours',
                    owner: 'CSM + Billing',
                    priority: 'high'
                },
                {
                    action: 'Prepare payment plan options if needed',
                    timeline: '1 day',
                    owner: 'CSM',
                    priority: 'medium'
                }
            ],
            usage_decline: [
                {
                    action: 'Analyze usage patterns and identify drop-off points',
                    timeline: '4 hours',
                    owner: 'CSM + Data Team',
                    priority: 'high'
                },
                {
                    action: 'Schedule product training session',
                    timeline: '3 days',
                    owner: 'CSM',
                    priority: 'medium'
                }
            ],
            expansion_opportunity: [
                {
                    action: 'Prepare ROI analysis for additional features',
                    timeline: '2 days',
                    owner: 'CSM + Sales',
                    priority: 'medium'
                },
                {
                    action: 'Schedule expansion discussion meeting',
                    timeline: '1 week',
                    owner: 'CSM + AE',
                    priority: 'medium'
                }
            ],
            technical_problems: [
                {
                    action: 'Escalate to technical support team',
                    timeline: '2 hours',
                    owner: 'CSM + Support',
                    priority: 'high'
                },
                {
                    action: 'Schedule follow-up technical review',
                    timeline: '1 week',
                    owner: 'CSM + Engineering',
                    priority: 'medium'
                }
            ],
            executive_change: [
                {
                    action: 'Research new executive background and priorities',
                    timeline: '1 day',
                    owner: 'CSM',
                    priority: 'high'
                },
                {
                    action: 'Prepare relationship transition plan',
                    timeline: '3 days',
                    owner: 'CSM + AE',
                    priority: 'medium'
                }
            ],
            renewal_risk: [
                {
                    action: 'Assess renewal timeline and create retention plan',
                    timeline: '1 day',
                    owner: 'CSM + AE',
                    priority: 'high'
                },
                {
                    action: 'Schedule stakeholder alignment meeting',
                    timeline: '3 days',
                    owner: 'CSM',
                    priority: 'high'
                }
            ],
            onboarding_issues: [
                {
                    action: 'Review onboarding progress and identify blockers',
                    timeline: '4 hours',
                    owner: 'CSM + Onboarding',
                    priority: 'high'
                },
                {
                    action: 'Create accelerated onboarding plan',
                    timeline: '1 day',
                    owner: 'CSM',
                    priority: 'medium'
                }
            ]
        };

        return scenarioActions[context.scenario] || [
            {
                action: 'Develop situation-specific action plan',
                timeline: '1 day',
                owner: 'CSM',
                priority: 'medium'
            }
        ];
    }

    generateCommunicationTemplate(context, template) {
        const subjects = {
            payment_issues: `Important: Account Status Update - ${context.customerName}`,
            usage_decline: `Let's Optimize Your Success with Our Platform - ${context.customerName}`,
            expansion_opportunity: `Exciting Growth Opportunities for ${context.customerName}`,
            technical_problems: `Technical Support Update - ${context.customerName}`,
            executive_change: `Welcome & Partnership Continuation - ${context.customerName}`,
            renewal_risk: `Partnership Strategy Discussion - ${context.customerName}`,
            onboarding_issues: `Accelerating Your Success - ${context.customerName}`,
            custom: `Partnership Update - ${context.customerName}`
        };

        const body = `Hi ${context.contactName},

I hope this message finds you well. I wanted to reach out regarding ${context.customSignal}.

Based on our analysis and your current situation, I've prepared a comprehensive plan to address this together. I'd love to schedule a brief call to discuss the next steps and ensure we're providing the best possible support for ${context.customerName}.

Would you be available for a 15-minute call this week? I'm confident we can resolve this quickly and continue driving value for your team.

Best regards,
[Your Name]
Customer Success Manager`;

        return {
            subject: subjects[context.scenario] || subjects.custom,
            body: body,
            tone: template.communicationTone
        };
    }

    generateRisksOpportunities(context) {
        const risks = [];
        const opportunities = [];

        // Add context-based risks
        if (context.currentHealth === 'critical') {
            risks.push({
                type: 'risk',
                description: 'High churn risk due to critical health status',
                impact: 'high',
                likelihood: 'high'
            });
        }

        if (context.currentHealth === 'at-risk') {
            risks.push({
                type: 'risk',
                description: 'Potential account downgrade or churn',
                impact: 'medium',
                likelihood: 'medium'
            });
        }

        // Add value-based opportunities
        const accountValue = parseFloat(context.accountValue.replace(/[^0-9]/g, ''));
        if (accountValue >= 100000) {
            opportunities.push({
                type: 'opportunity',
                description: 'High-value account with expansion potential',
                impact: 'high',
                likelihood: 'medium'
            });
        }

        return [...risks, ...opportunities];
    }

    displayPlaybook(playbook) {
        document.getElementById('formContainer').classList.add('hidden');
        document.getElementById('playbookContainer').classList.remove('hidden');
        document.getElementById('newBtn').style.display = 'block';

        const container = document.getElementById('playbookContent');
        container.innerHTML = this.renderPlaybook(playbook);

        // Setup section toggles and copy buttons
        this.setupPlaybookInteractions();
    }

    renderPlaybook(playbook) {
        const totalActions = playbook.actionPlan.length;
        const highPriorityActions = playbook.actionPlan.filter(a => a.priority === 'high').length;
        const totalRisks = playbook.risksOpportunities.filter(r => r.type === 'risk').length;

        return `
            <div class="playbook-section">
                <div class="section-header" data-section="signal">
                    <span class="section-title">📊 Signal Summary</span>
                    <button class="copy-btn" data-copy="signal">Copy</button>
                </div>
                <div class="section-content" data-content="signal">
                    <p>${playbook.signalSummary}</p>
                </div>
            </div>

            <div class="playbook-section">
                <div class="section-header" data-section="objectives">
                    <span class="section-title">🎯 Objectives</span>
                    <div>
                        <button class="copy-btn" data-copy="objectives">Copy</button>
                        <span class="toggle-icon">▼</span>
                    </div>
                </div>
                <div class="section-content collapsed" data-content="objectives">
                    <ul>
                        ${playbook.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="playbook-section">
                <div class="section-header" data-section="actions">
                    <span class="section-title">⚡ Action Plan</span>
                    <div>
                        <button class="copy-btn" data-copy="actions">Copy</button>
                        <span class="toggle-icon">▼</span>
                    </div>
                </div>
                <div class="section-content collapsed" data-content="actions">
                    ${playbook.actionPlan.map(action => `
                        <div class="action-item">
                            <div class="action-priority priority-${action.priority}">${action.priority.toUpperCase()}</div>
                            <div><strong>${action.action}</strong></div>
                            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                                📅 ${action.timeline} | 👤 ${action.owner}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="playbook-section">
                <div class="section-header" data-section="email">
                    <span class="section-title">📧 Email Template</span>
                    <div>
                        <button class="copy-btn" data-copy="email">Copy</button>
                        <span class="toggle-icon">▼</span>
                    </div>
                </div>
                <div class="section-content collapsed" data-content="email">
                    <div><strong>Subject:</strong> ${playbook.communicationTemplate.subject}</div>
                    <div style="margin-top: 12px; white-space: pre-line;">${playbook.communicationTemplate.body}</div>
                </div>
            </div>

            <div class="playbook-section">
                <div class="section-header">
                    <span class="section-title">📈 Quick Stats</span>
                </div>
                <div class="section-content">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${totalActions}</div>
                            <div class="stat-label">Total Actions</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${highPriorityActions}</div>
                            <div class="stat-label">High Priority</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${totalRisks}</div>
                            <div class="stat-label">Risks</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupPlaybookInteractions() {
        // Section toggles
        document.querySelectorAll('.section-header[data-section]').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.classList.contains('copy-btn')) return;
                
                const section = header.dataset.section;
                const content = document.querySelector(`[data-content="${section}"]`);
                const toggle = header.querySelector('.toggle-icon');
                
                if (content.classList.contains('collapsed')) {
                    content.classList.remove('collapsed');
                    toggle.classList.add('rotated');
                    this.expandedSections.add(section);
                } else {
                    content.classList.add('collapsed');
                    toggle.classList.remove('rotated');
                    this.expandedSections.delete(section);
                }
            });
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copySection(btn.dataset.copy, btn);
            });
        });
    }

    async copySection(section, button) {
        let content = '';
        const playbook = this.currentPlaybook;

        switch (section) {
            case 'signal':
                content = playbook.signalSummary;
                break;
            case 'objectives':
                content = 'Objectives:\n' + playbook.objectives.map(obj => `• ${obj}`).join('\n');
                break;
            case 'actions':
                content = 'Action Plan:\n' + playbook.actionPlan.map(action => 
                    `${action.priority.toUpperCase()}: ${action.action} (${action.timeline}, ${action.owner})`
                ).join('\n');
                break;
            case 'email':
                content = `Subject: ${playbook.communicationTemplate.subject}\n\n${playbook.communicationTemplate.body}`;
                break;
        }

        try {
            await navigator.clipboard.writeText(content);
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }

    getScenarioTemplates() {
        return {
            payment_issues: {
                signalSummary: `{customerName} (${'{accountValue}'}) is experiencing payment/billing issues. Immediate attention required to maintain relationship with {contactName} ({contactRole}).`,
                objectives: [
                    'Resolve payment/billing issues promptly',
                    'Maintain trust and relationship with {customerName}',
                    'Prevent account churn due to billing problems',
                    'Ensure clear communication throughout resolution'
                ],
                communicationTone: 'executive',
                bestPractices: [
                    'Respond to payment issues within 2 hours',
                    'Involve billing team immediately',
                    'Offer payment plan options when appropriate',
                    'Document all billing communications'
                ]
            },
            usage_decline: {
                signalSummary: `{customerName} is showing declining usage patterns. {contactName} ({contactRole}) needs proactive support to re-engage and maximize platform value.`,
                objectives: [
                    'Identify root causes of usage decline',
                    'Re-engage {customerName} with platform features',
                    'Provide targeted training and support',
                    'Restore usage to healthy levels'
                ],
                communicationTone: 'friendly',
                bestPractices: [
                    'Analyze usage data before outreach',
                    'Focus on value realization',
                    'Offer personalized training sessions',
                    'Create usage improvement plans'
                ]
            },
            expansion_opportunity: {
                signalSummary: `{customerName} presents expansion opportunity. {contactName} ({contactRole}) is well-positioned for additional platform features or increased usage.`,
                objectives: [
                    'Assess expansion readiness and appetite',
                    'Present relevant upgrade options',
                    'Build business case for expansion',
                    'Coordinate with sales team for execution'
                ],
                communicationTone: 'relationship-building',
                bestPractices: [
                    'Lead with customer success metrics',
                    'Focus on ROI and business value',
                    'Prepare customized expansion proposals',
                    'Align timing with customer priorities'
                ]
            },
            technical_problems: {
                signalSummary: `{customerName} is experiencing technical issues that require immediate resolution. {contactName} ({contactRole}) needs expert technical support and clear communication.`,
                objectives: [
                    'Resolve technical issues quickly',
                    'Prevent business impact for {customerName}',
                    'Restore confidence in platform reliability',
                    'Implement preventive measures'
                ],
                communicationTone: 'urgent',
                bestPractices: [
                    'Escalate critical issues immediately',
                    'Provide regular status updates',
                    'Involve technical experts early',
                    'Document solutions for future reference'
                ]
            },
            executive_change: {
                signalSummary: `{customerName} has experienced executive changes. New relationship building required with updated stakeholders while maintaining existing relationships.`,
                objectives: [
                    'Establish relationships with new executives',
                    'Understand new priorities and objectives',
                    'Maintain continuity of service',
                    'Align platform value with new direction'
                ],
                communicationTone: 'executive',
                bestPractices: [
                    'Research new executive backgrounds',
                    'Prepare relationship transition plans',
                    'Schedule introduction meetings',
                    'Update account stakeholder mapping'
                ]
            },
            renewal_risk: {
                signalSummary: `{customerName} shows renewal risk indicators. Immediate intervention needed with {contactName} ({contactRole}) to address concerns and secure renewal.`,
                objectives: [
                    'Identify and address renewal concerns',
                    'Demonstrate ongoing platform value',
                    'Negotiate favorable renewal terms',
                    'Prevent account churn'
                ],
                communicationTone: 'relationship-building',
                bestPractices: [
                    'Start renewal conversations early',
                    'Quantify value delivered',
                    'Address concerns proactively',
                    'Involve executive sponsors when needed'
                ]
            },
            onboarding_issues: {
                signalSummary: `{customerName} is experiencing onboarding challenges. {contactName} ({contactRole}) requires additional support to achieve initial success and value realization.`,
                objectives: [
                    'Accelerate successful onboarding',
                    'Remove implementation blockers',
                    'Ensure early value achievement',
                    'Set foundation for long-term success'
                ],
                communicationTone: 'friendly',
                bestPractices: [
                    'Identify onboarding bottlenecks',
                    'Provide hands-on implementation support',
                    'Set realistic milestone expectations',
                    'Celebrate early wins'
                ]
            },
            custom: {
                signalSummary: `{customerName} requires attention for: {customSignal}. {contactName} ({contactRole}) is the primary stakeholder for this situation.`,
                objectives: [
                    'Understand the specific situation thoroughly',
                    'Develop appropriate response strategy',
                    'Maintain strong customer relationship',
                    'Prevent negative impact on account health'
                ],
                communicationTone: 'friendly',
                bestPractices: [
                    'Listen actively to customer concerns',
                    'Respond promptly and professionally',
                    'Escalate when necessary',
                    'Follow up consistently'
                ]
            }
        };
    }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CSPlaybookGenerator();
});