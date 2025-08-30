import { CustomerContext, CSPlaybook, ActionItem, RiskOpportunity } from '@/types/playbook';

// Mock data and logic for generating comprehensive CS playbooks
const scenarioTemplates = {
  payment_issues: {
    signalSummary: "Payment processing issue identified with potential impact on renewal",
    objectives: [
      "Resolve immediate payment/billing concern within 24 hours",
      "Restore customer confidence in billing processes", 
      "Prevent escalation to executive level",
      "Document process improvements to prevent recurrence",
      "Strengthen payment management relationship"
    ],
    communicationTone: 'urgent' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Potential churn if payment issues persist', impact: 'high' as const, likelihood: 'medium' as const },
      { type: 'risk' as const, description: 'Damage to trust in billing accuracy', impact: 'medium' as const, likelihood: 'high' as const }
    ],
    bestPractices: [
      "Always acknowledge the inconvenience and take ownership",
      "Provide specific timeline for resolution",
      "Follow up proactively even after resolution",
      "Offer account credit for significant inconvenience"
    ]
  },
  usage_decline: {
    signalSummary: "Significant usage decline detected requiring immediate intervention and support",
    objectives: [
      "Identify root cause of usage decline within 48 hours",
      "Re-engage users with targeted training and support",
      "Restore usage to baseline levels within 30 days",
      "Implement monitoring to prevent future declines",
      "Strengthen product adoption and user engagement"
    ],
    communicationTone: 'relationship-building' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Renewal at risk due to low product value realization', impact: 'high' as const, likelihood: 'high' as const },
      { type: 'opportunity' as const, description: 'Chance to improve training and drive deeper adoption', impact: 'medium' as const, likelihood: 'high' as const }
    ],
    bestPractices: [
      "Focus on business value, not just feature usage",
      "Provide hands-on training rather than documentation",
      "Identify internal champions to drive adoption",
      "Schedule regular check-ins during recovery period"
    ]
  },
  expansion_opportunity: {
    signalSummary: "Strong expansion opportunity identified based on usage patterns and customer feedback",
    objectives: [
      "Quantify expansion opportunity and present business case",
      "Schedule expansion discussion with decision makers",
      "Prepare customized proposal within 2 weeks",
      "Align internal teams (Sales, Implementation) for smooth process",
      "Secure expansion commitment within 60 days"
    ],
    communicationTone: 'executive' as const,
    defaultRisks: [
      { type: 'opportunity' as const, description: 'Significant revenue expansion potential', impact: 'high' as const, likelihood: 'high' as const },
      { type: 'risk' as const, description: 'Competitor may capture expansion opportunity', impact: 'medium' as const, likelihood: 'low' as const }
    ],
    bestPractices: [
      "Lead with business outcomes and ROI",
      "Prepare case studies from similar customer expansions",
      "Involve customer success leader in expansion discussions",
      "Create urgency with limited-time incentives"
    ]
  },
  technical_problems: {
    signalSummary: "Technical issues impacting customer productivity requiring immediate resolution",
    objectives: [
      "Escalate technical issue to highest priority queue immediately",
      "Provide temporary workaround within 4 hours",
      "Deliver permanent solution within 48 hours",
      "Conduct post-resolution review with customer",
      "Implement preventive measures for similar issues"
    ],
    communicationTone: 'urgent' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Customer productivity loss leading to frustration', impact: 'high' as const, likelihood: 'high' as const },
      { type: 'risk' as const, description: 'Potential escalation to executive team', impact: 'medium' as const, likelihood: 'medium' as const }
    ],
    bestPractices: [
      "Acknowledge impact on customer business immediately",
      "Provide regular updates even without resolution",
      "Escalate internally to appropriate technical teams",
      "Offer account credit for significant downtime"
    ]
  },
  executive_change: {
    signalSummary: "Key executive change detected requiring relationship rebuild and strategy alignment",
    objectives: [
      "Research new executive background and priorities within 48 hours",
      "Schedule introduction meeting within 2 weeks",
      "Present renewed value proposition aligned with their goals",
      "Establish trust and credibility with new stakeholder",
      "Secure commitment to existing partnership"
    ],
    communicationTone: 'executive' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'New executive may favor different vendors', impact: 'high' as const, likelihood: 'medium' as const },
      { type: 'opportunity' as const, description: 'Chance to expand relationship with fresh perspective', impact: 'medium' as const, likelihood: 'medium' as const }
    ],
    bestPractices: [
      "Research new executive thoroughly before first contact",
      "Lead with business outcomes relevant to their role",
      "Bring senior leadership to initial meetings",
      "Prepare executive-level value summary document"
    ]
  },
  renewal_risk: {
    signalSummary: "Renewal at risk requiring immediate intervention and value reinforcement",
    objectives: [
      "Conduct urgent risk assessment within 24 hours",
      "Schedule stakeholder alignment meeting within 1 week",
      "Present compelling renewal business case",
      "Address all objections and concerns transparently",
      "Secure renewal commitment with appropriate terms"
    ],
    communicationTone: 'relationship-building' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Customer may not renew contract', impact: 'high' as const, likelihood: 'high' as const },
      { type: 'opportunity' as const, description: 'Address concerns to strengthen long-term relationship', impact: 'medium' as const, likelihood: 'medium' as const }
    ],
    bestPractices: [
      "Be direct about renewal concerns and timeline",
      "Quantify business value delivered to date",
      "Offer renewal incentives or contract modifications",
      "Involve executive sponsor in renewal discussions"
    ]
  },
  onboarding_issues: {
    signalSummary: "Onboarding complications requiring accelerated support and intervention",
    objectives: [
      "Identify specific onboarding blockers within 24 hours",
      "Assign dedicated implementation specialist",
      "Create accelerated onboarding timeline",
      "Ensure successful first value delivery within 30 days",
      "Establish strong foundation for long-term success"
    ],
    communicationTone: 'friendly' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Poor onboarding experience impacts long-term satisfaction', impact: 'high' as const, likelihood: 'medium' as const },
      { type: 'opportunity' as const, description: 'Great onboarding creates loyal customer advocates', impact: 'high' as const, likelihood: 'high' as const }
    ],
    bestPractices: [
      "Take personal ownership of onboarding experience",
      "Provide white-glove service during critical early period",
      "Celebrate early wins and milestones with customer",
      "Gather feedback continuously to improve process"
    ]
  },
  custom: {
    signalSummary: "Custom customer signal requiring tailored approach and strategic response",
    objectives: [
      "Analyze unique customer situation thoroughly",
      "Develop customized action plan based on specific context",
      "Engage appropriate internal resources and expertise",
      "Monitor progress closely with frequent check-ins",
      "Document learnings for future similar situations"
    ],
    communicationTone: 'relationship-building' as const,
    defaultRisks: [
      { type: 'risk' as const, description: 'Unique situation may require specialized approach', impact: 'medium' as const, likelihood: 'medium' as const },
      { type: 'opportunity' as const, description: 'Chance to demonstrate exceptional customer service', impact: 'medium' as const, likelihood: 'high' as const }
    ],
    bestPractices: [
      "Listen actively to understand full context",
      "Collaborate with customer on solution approach",
      "Be transparent about capabilities and limitations",
      "Follow up consistently until resolution"
    ]
  }
};

export function generatePlaybook(context: CustomerContext): CSPlaybook {
  const template = scenarioTemplates[context.scenario];
  
  // Generate personalized signal summary
  const signalSummary = context.scenario === 'custom' 
    ? `${context.customerName}: ${context.customSignal}`
    : `${context.customerName}: ${template.signalSummary}`;

  // Generate action plan based on scenario and context
  const actionPlan = generateActionPlan(context, template);
  
  // Generate communication template
  const communicationTemplate = generateCommunicationTemplate(context, template);
  
  // Generate risks and opportunities
  const risksOpportunities = [
    ...template.defaultRisks,
    ...generateContextualRisks(context)
  ];

  return {
    signalSummary,
    objectives: template.objectives,
    actionPlan,
    communicationTemplate,
    risksOpportunities,
    bestPractices: template.bestPractices,
    generatedAt: new Date()
  };
}

function generateActionPlan(context: CustomerContext, template: any): ActionItem[] {
  const baseActions: ActionItem[] = [
    {
      action: `Immediate outreach to ${context.contactName} to acknowledge the situation`,
      timeline: "Within 2 hours",
      owner: "CS Manager",
      priority: "high"
    },
    {
      action: `Review ${context.customerName} account health and recent activity patterns`,
      timeline: "Within 4 hours", 
      owner: "CS Analyst",
      priority: "high"
    },
    {
      action: `Schedule follow-up meeting with ${context.contactName} and key stakeholders`,
      timeline: "Within 24 hours",
      owner: "CS Manager",
      priority: "medium"
    }
  ];

  // Add scenario-specific actions
  const scenarioActions = getScenarioSpecificActions(context);
  
  return [...baseActions, ...scenarioActions];
}

function getScenarioSpecificActions(context: CustomerContext): ActionItem[] {
  switch (context.scenario) {
    case 'payment_issues':
      return [
        {
          action: "Coordinate with billing team to investigate and resolve payment discrepancy",
          timeline: "Within 4 hours",
          owner: "Billing Specialist",
          priority: "high"
        },
        {
          action: "Prepare account credit authorization if needed",
          timeline: "Within 8 hours",
          owner: "CS Manager",
          priority: "medium"
        }
      ];
    
    case 'usage_decline':
      return [
        {
          action: "Analyze usage data to identify specific decline patterns and affected features",
          timeline: "Within 6 hours",
          owner: "Data Analyst",
          priority: "high"
        },
        {
          action: "Prepare targeted training materials for underutilized features",
          timeline: "Within 24 hours",
          owner: "Training Specialist",
          priority: "medium"
        }
      ];

    case 'expansion_opportunity':
      return [
        {
          action: "Prepare expansion business case with ROI calculations",
          timeline: "Within 1 week",
          owner: "CS Manager",
          priority: "medium"
        },
        {
          action: "Coordinate with Sales team for expansion proposal",
          timeline: "Within 3 days",
          owner: "Sales Rep",
          priority: "medium"
        }
      ];

    default:
      return [
        {
          action: "Develop scenario-specific resolution plan",
          timeline: "Within 24 hours",
          owner: "CS Manager", 
          priority: "medium"
        }
      ];
  }
}

function generateCommunicationTemplate(context: CustomerContext, template: any) {
  const subjects = {
    urgent: `Urgent: Addressing Your Recent ${context.customerName} Concern`,
    friendly: `Following Up on Your ${context.customerName} Experience`,
    executive: `Strategic Partnership Discussion - ${context.customerName}`,
    'relationship-building': `Strengthening Our Partnership - ${context.customerName}`
  };

  const subject = subjects[template.communicationTone];

  const body = `Dear ${context.contactName},

I hope this message finds you well. I'm reaching out regarding the situation you've brought to our attention concerning ${context.customSignal.toLowerCase()}.

First, I want to acknowledge that this situation is not meeting the standards you should expect from our partnership. I take full responsibility for ensuring we resolve this quickly and effectively.

Here's what I'm doing immediately:

• I've prioritized your case with our specialist team
• We're conducting a thorough investigation to understand the root cause
• I'll provide you with regular updates every 24 hours until resolution
• We're implementing additional monitoring to prevent similar issues

Your success is our top priority, and I'm personally committed to making this right. I've scheduled time in my calendar to focus exclusively on your account until we have a satisfactory resolution.

I'll be calling you within the next 2 hours to discuss this further and answer any questions you may have. In the meantime, please don't hesitate to reach out to me directly.

Thank you for your patience and for giving us the opportunity to make this right.

Best regards,
[Your Name]
Customer Success Manager
Direct: [Phone Number]
Email: [Email Address]

P.S. I've also cc'd my manager to ensure you have executive visibility on this matter.`;

  return {
    subject,
    body,
    tone: template.communicationTone
  };
}

function generateContextualRisks(context: CustomerContext): RiskOpportunity[] {
  const risks: RiskOpportunity[] = [];
  
  // Health-based risks
  if (context.currentHealth === 'critical') {
    risks.push({
      type: 'risk',
      description: 'Account in critical health status - immediate intervention required',
      impact: 'high',
      likelihood: 'high'
    });
  }

  // Value-based opportunities
  const accountValueNum = parseFloat(context.accountValue.replace(/[$,]/g, ''));
  if (accountValueNum > 100000) {
    risks.push({
      type: 'opportunity',
      description: 'High-value account - potential for expansion and case study',
      impact: 'high',
      likelihood: 'medium'
    });
  }

  return risks;
}

// Simulate API delay for realistic UX
export async function generatePlaybookAsync(context: CustomerContext): Promise<CSPlaybook> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generatePlaybook(context));
    }, 2000); // 2 second delay to simulate API call
  });
}