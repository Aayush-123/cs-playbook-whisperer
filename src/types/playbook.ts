export interface CustomerContext {
  customerName: string;
  contactName: string;
  contactRole: string;
  accountValue: string;
  productUsage: string;
  relationshipHistory: string;
  currentHealth: 'healthy' | 'at-risk' | 'critical';
  scenario: CSScenario;
  customSignal: string;
}

export type CSScenario = 
  | 'payment_issues'
  | 'usage_decline' 
  | 'expansion_opportunity'
  | 'technical_problems'
  | 'executive_change'
  | 'renewal_risk'
  | 'onboarding_issues'
  | 'custom';

export interface ActionItem {
  action: string;
  timeline: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RiskOpportunity {
  type: 'risk' | 'opportunity';
  description: string;
  impact: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
}

export interface CSPlaybook {
  signalSummary: string;
  objectives: string[];
  actionPlan: ActionItem[];
  communicationTemplate: {
    subject: string;
    body: string;
    tone: 'executive' | 'friendly' | 'urgent' | 'relationship-building';
  };
  risksOpportunities: RiskOpportunity[];
  bestPractices: string[];
  generatedAt: Date;
}

export const scenarioLabels: Record<CSScenario, string> = {
  payment_issues: 'Payment/Billing Issues',
  usage_decline: 'Usage Decline',
  expansion_opportunity: 'Expansion Opportunity',
  technical_problems: 'Technical Problems',
  executive_change: 'Executive Change',
  renewal_risk: 'Renewal Risk',
  onboarding_issues: 'Onboarding Issues',
  custom: 'Custom Scenario'
};