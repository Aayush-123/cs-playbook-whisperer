import { CustomerContext, CSPlaybook, ActionItem, RiskOpportunity, RiskAssessment, EmailTemplate, CustomerMetrics } from '@/types/playbook';

// Enhanced scenario templates with comprehensive structure
const scenarioTemplates = {
  payment_issues: {
    signalSummary: "Payment processing issues detected requiring immediate financial and relationship intervention",
    objectives: [
      "Resolve payment/billing discrepancies immediately",
      "Maintain trust and prevent service interruption",
      "Implement proactive billing communication protocols",
      "Identify process improvements to prevent recurrence"
    ],
    communicationTone: 'urgent' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'Service interruption due to payment failure',
        impact: 'high' as const,
        likelihood: 'high' as const,
        category: 'renewal' as const,
        score: 8
      },
      {
        type: 'risk' as const,
        description: 'Damage to customer relationship and trust',
        impact: 'medium' as const,
        likelihood: 'medium' as const,
        category: 'relationship' as const,
        score: 6
      }
    ],
    bestPractices: [
      "Engage billing/finance teams immediately",
      "Provide direct escalation contact for resolution",
      "Document all payment-related communications",
      "Follow up within 24 hours of resolution"
    ]
  },
  
  usage_decline: {
    signalSummary: "Product usage metrics showing concerning downward trends requiring adoption intervention",
    objectives: [
      "Identify root causes of usage decline",
      "Re-engage dormant users with targeted campaigns",
      "Optimize onboarding for active user retention",
      "Implement usage monitoring and alerts"
    ],
    communicationTone: 'consultative' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'Continued usage decline leading to churn',
        impact: 'high' as const,
        likelihood: 'medium' as const,
        category: 'adoption' as const,
        score: 7
      }
    ],
    bestPractices: [
      "Schedule usage review meetings",
      "Provide targeted training for low-adoption features",
      "Create personalized success plans",
      "Monitor weekly usage metrics"
    ]
  },
  
  expansion_opportunity: {
    signalSummary: "Positive engagement signals indicate strong expansion potential for additional products/seats",
    objectives: [
      "Assess expansion readiness and capacity",
      "Present value-aligned expansion options",
      "Facilitate demo/trial of additional features",
      "Secure expansion commitment with timeline"
    ],
    communicationTone: 'relationship-building' as const,
    defaultRisks: [
      {
        type: 'opportunity' as const,
        description: 'Cross-sell additional products or increased licensing',
        impact: 'high' as const,
        likelihood: 'high' as const,
        category: 'expansion' as const,
        score: 8
      }
    ],
    bestPractices: [
      "Prepare ROI calculations for expansion",
      "Involve account management for pricing discussions",
      "Create customized expansion proposals",
      "Schedule executive-level discussions"
    ]
  },
  
  technical_problems: {
    signalSummary: "Technical issues impacting user experience requiring immediate technical and relationship support",
    objectives: [
      "Resolve technical issues with urgency",
      "Prevent user frustration and adoption barriers",
      "Implement preventive technical measures",
      "Strengthen technical support relationships"
    ],
    communicationTone: 'empathetic' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'User frustration leading to platform abandonment',
        impact: 'high' as const,
        likelihood: 'medium' as const,
        category: 'technical' as const,
        score: 7
      }
    ],
    bestPractices: [
      "Engage technical support team immediately",
      "Provide direct technical escalation contacts",
      "Schedule regular technical check-ins",
      "Document technical issue resolution processes"
    ]
  },
  
  executive_change: {
    signalSummary: "Executive leadership changes require relationship re-establishment and strategic realignment",
    objectives: [
      "Establish relationships with new leadership",
      "Reassess strategic alignment and priorities",
      "Demonstrate ongoing value and ROI",
      "Secure continued commitment to partnership"
    ],
    communicationTone: 'executive' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'New leadership may reconsider vendor relationships',
        impact: 'high' as const,
        likelihood: 'medium' as const,
        category: 'relationship' as const,
        score: 7
      }
    ],
    bestPractices: [
      "Research new executive backgrounds and priorities",
      "Prepare executive-level value presentations",
      "Schedule introductory meetings promptly",
      "Align with internal champions for introductions"
    ]
  },
  
  renewal_risk: {
    signalSummary: "Contract renewal at risk requiring comprehensive retention strategy and value demonstration",
    objectives: [
      "Address specific renewal concerns immediately",
      "Demonstrate quantifiable value and ROI",
      "Negotiate favorable renewal terms",
      "Secure long-term partnership commitment"
    ],
    communicationTone: 'relationship-building' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'Contract non-renewal and customer churn',
        impact: 'high' as const,
        likelihood: 'high' as const,
        category: 'renewal' as const,
        score: 9
      }
    ],
    bestPractices: [
      "Prepare comprehensive value documentation",
      "Engage executive sponsors for renewal discussions",
      "Address all concerns proactively",
      "Create win-win renewal proposals"
    ]
  },
  
  onboarding_issues: {
    signalSummary: "Onboarding challenges requiring immediate intervention to ensure successful product adoption",
    objectives: [
      "Identify and resolve onboarding blockers",
      "Accelerate time-to-value for new users",
      "Implement enhanced onboarding support",
      "Establish success metrics and milestones"
    ],
    communicationTone: 'friendly' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'Poor onboarding experience leading to early churn',
        impact: 'high' as const,
        likelihood: 'medium' as const,
        category: 'adoption' as const,
        score: 7
      }
    ],
    bestPractices: [
      "Assign dedicated onboarding specialist",
      "Create personalized onboarding timeline",
      "Schedule frequent check-in calls",
      "Monitor onboarding completion metrics"
    ]
  },
  
  custom: {
    signalSummary: "Custom scenario requiring tailored Customer Success intervention and strategic response",
    objectives: [
      "Analyze specific situation thoroughly",
      "Develop customized response strategy",
      "Implement targeted intervention measures",
      "Monitor outcomes and adjust approach"
    ],
    communicationTone: 'consultative' as const,
    defaultRisks: [
      {
        type: 'risk' as const,
        description: 'Unaddressed custom scenario may impact relationship',
        impact: 'medium' as const,
        likelihood: 'medium' as const,
        category: 'relationship' as const,
        score: 5
      }
    ],
    bestPractices: [
      "Gather comprehensive context and details",
      "Consult with senior CS leadership",
      "Document custom scenario for future reference",
      "Create reusable playbook if applicable"
    ]
  }
};

// Enhanced playbook generation with risk assessment
export function generatePlaybook(context: CustomerContext): CSPlaybook {
  const template = scenarioTemplates[context.scenario] || scenarioTemplates.custom;
  
  // Generate personalized signal summary
  const signalSummary = generateSignalSummary(context, template);
  
  // Generate comprehensive action plan
  const actionPlan = generateActionPlan(context, template);
  
  // Generate enhanced communication template
  const communicationTemplate = generateCommunicationTemplate(context, template);
  
  // Generate risk assessment
  const riskAssessment = generateRiskAssessment(context);
  
  // Generate contextual risks and opportunities
  const risksOpportunities = [
    ...template.defaultRisks,
    ...generateContextualRisks(context)
  ];

  // Generate account snapshot if metrics available
  const accountSnapshot = context.metrics ? {
    metrics: context.metrics,
    healthIndicators: generateHealthIndicators(context),
    keyInsights: generateKeyInsights(context)
  } : undefined;

  return {
    signalSummary,
    objectives: template.objectives,
    actionPlan,
    communicationTemplate,
    risksOpportunities,
    bestPractices: template.bestPractices,
    riskAssessment,
    accountSnapshot,
    escalationTriggers: generateEscalationTriggers(context),
    nextStepsForCSP: generateNextStepsCSP(context),
    nextStepsForAM: generateNextStepsAM(context),
    generatedAt: new Date(),
    scenarioType: context.scenario,
    confidence: calculateConfidence(context)
  };
}

function generateSignalSummary(context: CustomerContext, template: any): string {
  const baseSignal = template.signalSummary;
  if (context.customSignal) {
    return `${context.customerName}: ${context.customSignal}. ${baseSignal}`;
  }
  return `${context.customerName}: ${baseSignal}`;
}

function generateActionPlan(context: CustomerContext, template: any): ActionItem[] {
  const baseActions: ActionItem[] = [
    {
      action: `Immediate outreach to ${context.contactName} to acknowledge the situation`,
      timeline: "Within 2 hours",
      owner: "Customer Success Manager",
      priority: 'high'
    },
    {
      action: `Document situation in CRM with complete context and initial response`,
      timeline: "Within 4 hours",
      owner: "Customer Success Manager",
      priority: 'high'
    }
  ];

  const scenarioActions = getScenarioSpecificActions(context);
  const followUpActions: ActionItem[] = [
    {
      action: `Schedule follow-up meeting to review progress and next steps`,
      timeline: "Within 48 hours",
      owner: "Customer Success Manager",
      priority: 'medium'
    },
    {
      action: `Update stakeholders on situation status and resolution timeline`,
      timeline: "Within 24 hours",
      owner: "Customer Success Manager",
      priority: 'medium'
    }
  ];

  return [...baseActions, ...scenarioActions, ...followUpActions];
}

function getScenarioSpecificActions(context: CustomerContext): ActionItem[] {
  switch (context.scenario) {
    case 'payment_issues':
      return [
        {
          action: "Coordinate with billing team to identify payment discrepancy root cause",
          timeline: "Within 1 hour",
          owner: "Customer Success Manager + Billing",
          priority: 'high'
        },
        {
          action: "Provide customer with detailed payment resolution timeline",
          timeline: "Within 2 hours",
          owner: "Customer Success Manager",
          priority: 'high'
        }
      ];
    
    case 'usage_decline':
      return [
        {
          action: "Analyze usage data to identify specific decline patterns",
          timeline: "Within 6 hours",
          owner: "Customer Success Analyst",
          priority: 'high'
        },
        {
          action: "Schedule usage review meeting with key stakeholders",
          timeline: "Within 2 days",
          owner: "Customer Success Manager",
          priority: 'medium'
        }
      ];
    
    case 'expansion_opportunity':
      return [
        {
          action: "Assess customer readiness for expansion discussion",
          timeline: "Within 24 hours",
          owner: "Customer Success Manager",
          priority: 'medium'
        },
        {
          action: "Coordinate with Account Manager for expansion strategy",
          timeline: "Within 48 hours",
          owner: "Customer Success Manager + Account Manager",
          priority: 'medium'
        }
      ];
    
    case 'technical_problems':
      return [
        {
          action: "Engage technical support team for immediate issue resolution",
          timeline: "Within 1 hour",
          owner: "Customer Success Manager + Technical Support",
          priority: 'high'
        },
        {
          action: "Provide customer with technical escalation contact information",
          timeline: "Within 2 hours",
          owner: "Customer Success Manager",
          priority: 'high'
        }
      ];
    
    case 'executive_change':
      return [
        {
          action: "Research new executive background and priorities",
          timeline: "Within 24 hours",
          owner: "Customer Success Manager",
          priority: 'medium'
        },
        {
          action: "Schedule introductory meeting with new executive",
          timeline: "Within 1 week",
          owner: "Customer Success Manager",
          priority: 'high'
        }
      ];
    
    case 'renewal_risk':
      return [
        {
          action: "Prepare comprehensive value documentation and ROI analysis",
          timeline: "Within 48 hours",
          owner: "Customer Success Manager",
          priority: 'high'
        },
        {
          action: "Schedule renewal discussion meeting with decision makers",
          timeline: "Within 1 week",
          owner: "Customer Success Manager + Account Manager",
          priority: 'high'
        }
      ];
    
    case 'onboarding_issues':
      return [
        {
          action: "Identify specific onboarding blockers and barriers",
          timeline: "Within 6 hours",
          owner: "Customer Success Manager",
          priority: 'high'
        },
        {
          action: "Assign dedicated onboarding specialist to account",
          timeline: "Within 24 hours",
          owner: "Customer Success Manager",
          priority: 'medium'
        }
      ];
    
    default:
      return [
        {
          action: "Conduct thorough situation analysis and stakeholder interviews",
          timeline: "Within 24 hours",
          owner: "Customer Success Manager",
          priority: 'medium'
        }
      ];
  }
}

function generateCommunicationTemplate(context: CustomerContext, template: any): EmailTemplate {
  const { tone } = template.communicationTone ? { tone: template.communicationTone } : { tone: 'friendly' as const };
  
  const subject = generateEmailSubject(context, tone);
  const body = generateEmailBody(context, tone);
  const followUpSubject = generateFollowUpSubject(context, tone);
  const followUpBody = generateFollowUpBody(context, tone);

  return {
    subject,
    body,
    tone,
    followUpSubject,
    followUpBody
  };
}

function generateEmailSubject(context: CustomerContext, tone: EmailTemplate['tone']): string {
  const customer = context.customerName;
  
  switch (tone) {
    case 'urgent':
      return `Immediate Attention Required - ${customer} Account Status`;
    case 'executive':
      return `Strategic Partnership Update - ${customer}`;
    case 'consultative':
      return `Optimization Opportunity - ${customer} Success Review`;
    case 'empathetic':
      return `Support Available - ${customer} Technical Resolution`;
    case 'relationship-building':
      return `Partnership Growth - ${customer} Expansion Discussion`;
    default:
      return `Follow-up on ${customer} Account`;
  }
}

function generateEmailBody(context: CustomerContext, tone: EmailTemplate['tone']): string {
  const greeting = `Hi ${context.contactName},`;
  const closing = `Best regards,\n[Your Name]\nCustomer Success Manager`;
  
  let body = '';
  
  switch (tone) {
    case 'urgent':
      body = `${greeting}\n\nI wanted to reach out immediately regarding the situation with your ${context.customerName} account. I understand the urgency of this matter and want to assure you that we are taking immediate action to resolve this.\n\nHere's what we're doing right now:\n• Investigating the root cause with our technical team\n• Implementing immediate remediation steps\n• Preparing a comprehensive resolution timeline\n\nI will personally oversee this resolution and keep you updated every step of the way. You can reach me directly at any time.\n\n${closing}`;
      break;
    
    case 'executive':
      body = `${greeting}\n\nI hope this message finds you well. As your dedicated Customer Success partner, I wanted to provide you with a strategic update on your ${context.customerName} account and discuss some important opportunities ahead.\n\nOur analysis shows significant potential for optimizing your current implementation and exploring strategic expansion opportunities that align with your business objectives.\n\nI would appreciate the opportunity to schedule a brief executive briefing to discuss:\n• Current performance metrics and ROI\n• Strategic opportunities for enhanced value\n• Partnership roadmap for the coming quarter\n\nWould you have 30 minutes available this week for a strategic discussion?\n\n${closing}`;
      break;
    
    case 'consultative':
      body = `${greeting}\n\nI've been analyzing your recent usage patterns and wanted to share some insights that could help optimize your ${context.customerName} experience.\n\nBased on our review, I've identified several opportunities to enhance your team's productivity and maximize your platform investment:\n\n• Feature optimization recommendations\n• User adoption enhancement strategies\n• Advanced workflow implementations\n\nI'd love to schedule a brief consultation to walk through these recommendations and understand your team's evolving needs. This would also be a great opportunity to ensure we're supporting your success in the most effective way possible.\n\nWhen would be a good time for a 20-minute optimization review?\n\n${closing}`;
      break;
    
    case 'empathetic':
      body = `${greeting}\n\nI understand you've been experiencing some technical challenges, and I want you to know that resolving this is my top priority. Technical issues can be incredibly frustrating, especially when they impact your team's productivity.\n\nHere's what I'm doing to help:\n• Escalating your case to our senior technical team\n• Providing you with a direct escalation contact\n• Monitoring progress personally until resolution\n\nYour success is important to us, and we're committed to getting this resolved quickly. I'll keep you updated throughout the process, and please don't hesitate to reach out if you need anything else.\n\n${closing}`;
      break;
    
    case 'relationship-building':
      body = `${greeting}\n\nI hope you're having a great week! I wanted to reach out because I've been thinking about our partnership and some exciting opportunities that might align with ${context.customerName}'s growth trajectory.\n\nYour team has been doing amazing work with the platform, and the results speak for themselves. Given your success, I believe there might be some natural next steps that could further amplify your results and support your expanding needs.\n\nI'd love to schedule a casual conversation to:\n• Celebrate your recent wins\n• Understand your evolving priorities\n• Explore how we might support your continued growth\n\nWould you be open to a brief coffee chat (virtual or in-person) sometime next week?\n\n${closing}`;
      break;
    
    default:
      body = `${greeting}\n\nI wanted to follow up regarding your ${context.customerName} account and see how things are progressing.\n\nBased on our recent interactions, I believe there are some opportunities to enhance your experience and ensure you're getting maximum value from your platform investment.\n\nWould you have time for a brief check-in call this week to discuss your current priorities and how we can best support your success?\n\n${closing}`;
  }
  
  return body;
}

function generateFollowUpSubject(context: CustomerContext, tone: EmailTemplate['tone']): string {
  return `Follow-up: ${context.customerName} - Next Steps`;
}

function generateFollowUpBody(context: CustomerContext, tone: EmailTemplate['tone']): string {
  return `Hi ${context.contactName},\n\nI wanted to follow up on our recent conversation regarding ${context.customerName} and ensure we're aligned on next steps.\n\nAs discussed, here's what we agreed to move forward with:\n• [Action item 1]\n• [Action item 2]\n• [Action item 3]\n\nI'll be monitoring progress closely and will reach out with updates as we move forward. Please don't hesitate to contact me if you have any questions or concerns.\n\nBest regards,\n[Your Name]\nCustomer Success Manager`;
}

function generateRiskAssessment(context: CustomerContext): RiskAssessment {
  const metrics = context.metrics;
  let userAdoptionRisk = 5; // Default medium risk
  let productAdoptionRisk = 5;
  let renewalRisk = 5;
  
  if (metrics) {
    // Calculate user adoption risk
    const utilizationRatio = metrics.activeUsers / metrics.assignedUsers;
    if (utilizationRatio < 0.3) userAdoptionRisk = 8;
    else if (utilizationRatio < 0.6) userAdoptionRisk = 6;
    else userAdoptionRisk = 3;
    
    // Calculate product adoption risk
    if (metrics.subscriptionUtilization < 30) productAdoptionRisk = 8;
    else if (metrics.subscriptionUtilization < 60) productAdoptionRisk = 6;
    else productAdoptionRisk = 3;
    
    // Calculate renewal risk based on timeline and health
    switch (context.currentHealth) {
      case 'critical':
        renewalRisk = 9;
        break;
      case 'at-risk':
        renewalRisk = 7;
        break;
      case 'healthy':
        renewalRisk = 3;
        break;
    }
    
    // Adjust based on renewal timeline
    if (metrics.renewalTimeline === 'near-term') {
      renewalRisk = Math.min(10, renewalRisk + 2);
    }
  }
  
  const overallRiskScore = Math.round((userAdoptionRisk + productAdoptionRisk + renewalRisk) / 3);
  
  const riskIndicators = [];
  if (userAdoptionRisk > 6) riskIndicators.push('Low user adoption rates');
  if (productAdoptionRisk > 6) riskIndicators.push('Underutilized product features');
  if (renewalRisk > 6) riskIndicators.push('Renewal at risk');
  if (context.currentHealth !== 'healthy') riskIndicators.push('Declining account health');
  
  return {
    userAdoptionRisk,
    productAdoptionRisk,
    renewalRisk,
    overallRiskScore,
    riskIndicators
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
      likelihood: 'high',
      category: 'renewal',
      score: 9
    });
  }

  // Value-based opportunities
  const accountValueNum = parseFloat(context.accountValue.replace(/[$,]/g, ''));
  if (accountValueNum > 100000) {
    risks.push({
      type: 'opportunity',
      description: 'High-value account - potential for expansion and case study',
      impact: 'high',
      likelihood: 'medium',
      category: 'expansion',
      score: 7
    });
  }

  // Metrics-based risks
  if (context.metrics) {
    const { metrics } = context;
    
    if (metrics.loginRate < 30) {
      risks.push({
        type: 'risk',
        description: 'Low login rates indicate poor user engagement',
        impact: 'medium',
        likelihood: 'high',
        category: 'adoption',
        score: 6
      });
    }
    
    if (metrics.assignedUsers < metrics.licensesPurchased * 0.7) {
      risks.push({
        type: 'opportunity',
        description: 'Unutilized licenses present optimization opportunity',
        impact: 'medium',
        likelihood: 'high',
        category: 'adoption',
        score: 6
      });
    }
  }

  return risks;
}

function generateHealthIndicators(context: CustomerContext): string[] {
  const indicators = [];
  
  if (context.metrics) {
    const { metrics } = context;
    
    if (metrics.loginRate > 70) indicators.push('High user engagement');
    else if (metrics.loginRate < 30) indicators.push('Low user engagement');
    
    if (metrics.subscriptionUtilization > 80) indicators.push('Strong feature adoption');
    else if (metrics.subscriptionUtilization < 40) indicators.push('Feature underutilization');
    
    const utilizationRatio = metrics.activeUsers / metrics.assignedUsers;
    if (utilizationRatio > 0.8) indicators.push('Excellent user activation');
    else if (utilizationRatio < 0.4) indicators.push('Poor user activation');
  }
  
  return indicators;
}

function generateKeyInsights(context: CustomerContext): string[] {
  const insights = [];
  
  if (context.metrics) {
    const { metrics } = context;
    
    if (metrics.licensesPurchased > metrics.assignedUsers) {
      insights.push(`${metrics.licensesPurchased - metrics.assignedUsers} unused licenses available for assignment`);
    }
    
    if (metrics.subscriptionUtilization < 50) {
      insights.push('Significant opportunity to increase feature adoption');
    }
    
    if (metrics.renewalTimeline === 'near-term') {
      insights.push('Renewal approaching - proactive engagement recommended');
    }
  }
  
  return insights;
}

function generateEscalationTriggers(context: CustomerContext): string[] {
  const triggers = [];
  
  if (context.currentHealth === 'critical') {
    triggers.push('Account health critical - executive escalation required');
  }
  
  if (context.scenario === 'renewal_risk') {
    triggers.push('Renewal at risk - account management involvement needed');
  }
  
  const accountValue = parseFloat(context.accountValue.replace(/[$,]/g, ''));
  if (accountValue > 500000) {
    triggers.push('High-value account - senior leadership notification');
  }
  
  return triggers;
}

function generateNextStepsCSP(context: CustomerContext): string[] {
  return [
    'Monitor daily usage metrics and user engagement',
    'Schedule weekly check-ins with primary stakeholders',
    'Create targeted adoption campaigns for underutilized features',
    'Document all customer interactions in CRM',
    'Prepare monthly success review with key metrics'
  ];
}

function generateNextStepsAM(context: CustomerContext): string[] {
  const steps = [];
  
  if (context.scenario === 'expansion_opportunity') {
    steps.push('Prepare expansion proposal with ROI calculations');
    steps.push('Schedule executive-level expansion discussion');
  }
  
  if (context.scenario === 'renewal_risk') {
    steps.push('Develop renewal retention strategy');
    steps.push('Prepare competitive positioning materials');
  }
  
  const accountValue = parseFloat(context.accountValue.replace(/[$,]/g, ''));
  if (accountValue > 100000) {
    steps.push('Consider strategic partnership opportunities');
  }
  
  return steps;
}

function calculateConfidence(context: CustomerContext): number {
  let confidence = 7; // Base confidence
  
  // Higher confidence with more complete data
  if (context.metrics) confidence += 1;
  if (context.stakeholders) confidence += 1;
  if (context.relationshipHistory?.length > 50) confidence += 1;
  
  // Adjust based on scenario specificity
  if (context.scenario !== 'custom') confidence += 1;
  
  return Math.min(10, confidence);
}

// Simulate API delay for realistic UX
export async function generatePlaybookAsync(context: CustomerContext): Promise<CSPlaybook> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generatePlaybook(context));
    }, 2000);
  });
}