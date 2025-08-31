import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { CustomerContext, CSScenario, scenarioLabels, CustomerMetrics, StakeholderInfo } from '@/types/playbook';
import { BadgeVariant } from './ui/badge-variant';
import { ChevronLeft, ChevronRight, Users, TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface WizardCustomerFormProps {
  onSubmit: (context: CustomerContext) => void;
  isLoading: boolean;
}

type WizardStep = 'basic' | 'metrics' | 'stakeholders' | 'context';

const stepConfig = {
  basic: { title: 'Basic Information', icon: Target, step: 1 },
  metrics: { title: 'Account Metrics', icon: TrendingUp, step: 2 },
  stakeholders: { title: 'Stakeholders', icon: Users, step: 3 },
  context: { title: 'Context & Scenario', icon: AlertTriangle, step: 4 }
};

const healthColors = {
  healthy: 'success',
  'at-risk': 'warning',
  critical: 'destructive'
} as const;

export function WizardCustomerForm({ onSubmit, isLoading }: WizardCustomerFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [context, setContext] = useState<CustomerContext>({
    customerName: '',
    contactName: '',
    contactRole: '',
    accountValue: '',
    productUsage: '',
    relationshipHistory: '',
    currentHealth: 'healthy',
    scenario: 'custom',
    customSignal: '',
    metrics: {
      loginRate: 0,
      activeUsers: 0,
      subscriptionUtilization: 0,
      licensesPurchased: 0,
      assignedUsers: 0,
      renewalTimeline: 'mid-term'
    },
    stakeholders: {
      primaryContact: '',
      role: '',
      decisionMakers: [],
      champions: [],
      influencers: []
    },
    deploymentType: 'single-product',
    implementationStage: 'adoption',
    riskFactors: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(context);
  };

  const updateContext = (field: keyof CustomerContext, value: any) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const updateMetrics = (field: keyof CustomerMetrics, value: any) => {
    setContext(prev => ({
      ...prev,
      metrics: { ...prev.metrics!, [field]: value }
    }));
  };

  const updateStakeholders = (field: keyof StakeholderInfo, value: any) => {
    setContext(prev => ({
      ...prev,
      stakeholders: { ...prev.stakeholders!, [field]: value }
    }));
  };

  const nextStep = () => {
    const steps: WizardStep[] = ['basic', 'metrics', 'stakeholders', 'context'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['basic', 'metrics', 'stakeholders', 'context'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'basic':
        return context.customerName && context.contactName && context.contactRole && context.accountValue;
      case 'metrics':
        return true; // Optional step
      case 'stakeholders':
        return true; // Optional step
      case 'context':
        return context.customSignal;
      default:
        return false;
    }
  };

  const progress = ((stepConfig[currentStep].step - 1) / 3) * 100;

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <Card className="shadow-elegant">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              {React.createElement(stepConfig[currentStep].icon, { className: "h-4 w-4" })}
              {stepConfig[currentStep].title}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Step {stepConfig[currentStep].step} of 4
            </div>
          </div>
          <Progress value={progress} className="h-1" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentStep === 'basic' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="customerName" className="text-xs">Customer *</Label>
                    <Input
                      id="customerName"
                      value={context.customerName}
                      onChange={(e) => updateContext('customerName', e.target.value)}
                      placeholder="Acme Corp"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contactName" className="text-xs">Contact *</Label>
                    <Input
                      id="contactName"
                      value={context.contactName}
                      onChange={(e) => updateContext('contactName', e.target.value)}
                      placeholder="John Smith"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="contactRole" className="text-xs">Role *</Label>
                    <Input
                      id="contactRole"
                      value={context.contactRole}
                      onChange={(e) => updateContext('contactRole', e.target.value)}
                      placeholder="VP Operations"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="accountValue" className="text-xs">ARR *</Label>
                    <Input
                      id="accountValue"
                      value={context.accountValue}
                      onChange={(e) => updateContext('accountValue', e.target.value)}
                      placeholder="$50k"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Account Health</Label>
                  <div className="flex gap-1">
                    {(['healthy', 'at-risk', 'critical'] as const).map((health) => (
                      <button
                        key={health}
                        type="button"
                        onClick={() => updateContext('currentHealth', health)}
                        className={`transition-all ${context.currentHealth === health ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
                      >
                        <BadgeVariant
                          variant={context.currentHealth === health ? healthColors[health] : 'outline'}
                          size="sm"
                        >
                          {health.charAt(0).toUpperCase() + health.slice(1).replace('-', ' ')}
                        </BadgeVariant>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Deployment Type</Label>
                    <Select
                      value={context.deploymentType}
                      onValueChange={(value: any) => updateContext('deploymentType', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-product">Single Product</SelectItem>
                        <SelectItem value="multi-product">Multi Product</SelectItem>
                        <SelectItem value="flex-package">Flex Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Implementation Stage</Label>
                    <Select
                      value={context.implementationStage}
                      onValueChange={(value: any) => updateContext('implementationStage', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="adoption">Adoption</SelectItem>
                        <SelectItem value="expansion">Expansion</SelectItem>
                        <SelectItem value="renewal">Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'metrics' && (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground mb-3">
                  Optional: Add metrics data for enhanced risk assessment
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Login Rate (%)</Label>
                    <Input
                      type="number"
                      value={context.metrics?.loginRate || ''}
                      onChange={(e) => updateMetrics('loginRate', Number(e.target.value))}
                      placeholder="75"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Active Users</Label>
                    <Input
                      type="number"
                      value={context.metrics?.activeUsers || ''}
                      onChange={(e) => updateMetrics('activeUsers', Number(e.target.value))}
                      placeholder="45"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Subscription Utilization (%)</Label>
                    <Input
                      type="number"
                      value={context.metrics?.subscriptionUtilization || ''}
                      onChange={(e) => updateMetrics('subscriptionUtilization', Number(e.target.value))}
                      placeholder="65"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Licenses Purchased</Label>
                    <Input
                      type="number"
                      value={context.metrics?.licensesPurchased || ''}
                      onChange={(e) => updateMetrics('licensesPurchased', Number(e.target.value))}
                      placeholder="50"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Assigned Users</Label>
                    <Input
                      type="number"
                      value={context.metrics?.assignedUsers || ''}
                      onChange={(e) => updateMetrics('assignedUsers', Number(e.target.value))}
                      placeholder="48"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Renewal Timeline</Label>
                    <Select
                      value={context.metrics?.renewalTimeline}
                      onValueChange={(value: any) => updateMetrics('renewalTimeline', value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="near-term">&lt;90 days</SelectItem>
                        <SelectItem value="mid-term">90-180 days</SelectItem>
                        <SelectItem value="far-term">&gt;180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'stakeholders' && (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground mb-3">
                  Optional: Stakeholder information for relationship mapping
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Primary Contact</Label>
                  <Input
                    value={context.stakeholders?.primaryContact || ''}
                    onChange={(e) => updateStakeholders('primaryContact', e.target.value)}
                    placeholder="Primary contact name"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Decision Makers</Label>
                  <Textarea
                    value={context.stakeholders?.decisionMakers?.join(', ') || ''}
                    onChange={(e) => updateStakeholders('decisionMakers', e.target.value.split(', ').filter(Boolean))}
                    placeholder="CEO, CTO, VP Engineering (comma separated)"
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Champions</Label>
                  <Textarea
                    value={context.stakeholders?.champions?.join(', ') || ''}
                    onChange={(e) => updateStakeholders('champions', e.target.value.split(', ').filter(Boolean))}
                    placeholder="Internal advocates (comma separated)"
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Influencers</Label>
                  <Textarea
                    value={context.stakeholders?.influencers?.join(', ') || ''}
                    onChange={(e) => updateStakeholders('influencers', e.target.value.split(', ').filter(Boolean))}
                    placeholder="Key influencers (comma separated)"
                    rows={2}
                    className="text-xs resize-none"
                  />
                </div>
              </div>
            )}

            {currentStep === 'context' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="scenario" className="text-xs">Scenario</Label>
                  <Select
                    value={context.scenario}
                    onValueChange={(value: CSScenario) => updateContext('scenario', value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(scenarioLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="customSignal" className="text-xs">Signal/Issue *</Label>
                  <Textarea
                    id="customSignal"
                    value={context.customSignal}
                    onChange={(e) => updateContext('customSignal', e.target.value)}
                    placeholder="Customer mentioned evaluating competitors due to low usage and concerns about ROI..."
                    rows={4}
                    className="text-xs resize-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Product Usage Context</Label>
                  <Textarea
                    value={context.productUsage}
                    onChange={(e) => updateContext('productUsage', e.target.value)}
                    placeholder="Using primarily for project management, limited adoption of advanced features..."
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Relationship History</Label>
                  <Textarea
                    value={context.relationshipHistory}
                    onChange={(e) => updateContext('relationshipHistory', e.target.value)}
                    placeholder="Strong relationship with IT team, recent executive changes, successful Q3 review..."
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 'basic'}
                className="h-8 text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Back
              </Button>

              {currentStep === 'context' ? (
                <Button 
                  type="submit" 
                  disabled={isLoading || !isStepValid()}
                  className="bg-gradient-primary hover:opacity-90 h-8 text-xs"
                >
                  {isLoading ? 'Generating...' : 'Generate Playbook'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="h-8 text-xs"
                >
                  Next
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}