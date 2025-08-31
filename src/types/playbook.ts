export interface CustomerMetrics {
  loginRate: number; // percentage
  activeUsers: number;
  subscriptionUtilization: number; // percentage
  licensesPurchased: number;
  assignedUsers: number;
  renewalTimeline: 'near-term' | 'mid-term' | 'far-term'; // <90, 90-180, >180 days
}

export interface StakeholderInfo {
  primaryContact: string;
  role: string;
  decisionMakers: string[];
  champions: string[];
  influencers: string[];
}

export interface CustomerContext {
  // Basic Info
  customerName: string;
  contactName: string;
  contactRole: string;
  accountValue: string;
  
  // Enhanced Context
  productUsage: string;
  relationshipHistory: string;
  currentHealth: 'healthy' | 'at-risk' | 'critical';
  scenario: CSScenario;
  customSignal: string;
  
  // Phase 2 Additions
  metrics?: CustomerMetrics;
  stakeholders?: StakeholderInfo;
  deploymentType?: 'single-product' | 'multi-product' | 'flex-package';
  implementationStage?: 'onboarding' | 'adoption' | 'expansion' | 'renewal';
  riskFactors?: string[];
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
  category: 'adoption' | 'renewal' | 'expansion' | 'relationship' | 'technical';
  score: number; // 1-10 calculated score
}

export interface RiskAssessment {
  userAdoptionRisk: number; // 1-10
  productAdoptionRisk: number; // 1-10
  renewalRisk: number; // 1-10
  overallRiskScore: number; // 1-10
  riskIndicators: string[];
}

export interface EmailTemplate {
  subject: string;
  body: string;
  tone: 'executive' | 'friendly' | 'urgent' | 'relationship-building' | 'consultative' | 'empathetic';
  followUpSubject?: string;
  followUpBody?: string;
}

export interface CSPlaybook {
  // Core Components
  signalSummary: string;
  objectives: string[];
  actionPlan: ActionItem[];
  communicationTemplate: EmailTemplate;
  risksOpportunities: RiskOpportunity[];
  bestPractices: string[];
  
  // Phase 2 Additions
  riskAssessment: RiskAssessment;
  accountSnapshot?: {
    metrics: CustomerMetrics;
    healthIndicators: string[];
    keyInsights: string[];
  };
  escalationTriggers?: string[];
  nextStepsForCSP?: string[];
  nextStepsForAM?: string[];
  
  // Metadata
  generatedAt: Date;
  scenarioType: CSScenario;
  confidence: number; // 1-10 AI confidence score
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