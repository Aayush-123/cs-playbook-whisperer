import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CustomerContext, CSScenario, scenarioLabels } from '@/types/playbook';
import { BadgeVariant } from './ui/badge-variant';

interface CustomerContextFormProps {
  onSubmit: (context: CustomerContext) => void;
  isLoading: boolean;
}

const healthColors = {
  healthy: 'success',
  'at-risk': 'warning',
  critical: 'destructive'
} as const;

export function CustomerContextForm({ onSubmit, isLoading }: CustomerContextFormProps) {
  const [context, setContext] = useState<CustomerContext>({
    customerName: '',
    contactName: '',
    contactRole: '',
    accountValue: '',
    productUsage: '',
    relationshipHistory: '',
    currentHealth: 'healthy',
    scenario: 'custom',
    customSignal: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(context);
  };

  const updateContext = (field: keyof CustomerContext, value: any) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-xl">Customer Success Signal Input</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Provide context to generate a comprehensive CS playbook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer/Company Name</Label>
              <Input
                id="customerName"
                value={context.customerName}
                onChange={(e) => updateContext('customerName', e.target.value)}
                placeholder="Acme Corporation"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={context.contactName}
                onChange={(e) => updateContext('contactName', e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactRole">Contact Role</Label>
              <Input
                id="contactRole"
                value={context.contactRole}
                onChange={(e) => updateContext('contactRole', e.target.value)}
                placeholder="VP of Operations"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountValue">Account Value (ARR)</Label>
              <Input
                id="accountValue"
                value={context.accountValue}
                onChange={(e) => updateContext('accountValue', e.target.value)}
                placeholder="$50,000"
                required
              />
            </div>
          </div>

          {/* Account Health */}
          <div className="space-y-2">
            <Label>Current Account Health</Label>
            <div className="flex gap-2">
              {(['healthy', 'at-risk', 'critical'] as const).map((health) => (
                <button
                  key={health}
                  type="button"
                  onClick={() => updateContext('currentHealth', health)}
                  className={`transition-all ${context.currentHealth === health ? 'scale-105' : 'opacity-60 hover:opacity-80'}`}
                >
                  <BadgeVariant
                    variant={context.currentHealth === health ? healthColors[health] : 'outline'}
                    size="lg"
                  >
                    {health.charAt(0).toUpperCase() + health.slice(1).replace('-', ' ')}
                  </BadgeVariant>
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="space-y-2">
            <Label htmlFor="scenario">CS Scenario Type</Label>
            <Select
              value={context.scenario}
              onValueChange={(value: CSScenario) => updateContext('scenario', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scenario type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(scenarioLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Context Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productUsage">Product Usage Pattern</Label>
              <Textarea
                id="productUsage"
                value={context.productUsage}
                onChange={(e) => updateContext('productUsage', e.target.value)}
                placeholder="Daily active users down 40% over last 30 days, mainly in reporting module..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipHistory">Relationship History</Label>
              <Textarea
                id="relationshipHistory"
                value={context.relationshipHistory}
                onChange={(e) => updateContext('relationshipHistory', e.target.value)}
                placeholder="Strong relationship with John, occasional escalations to VP level..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customSignal">Specific Signal/Issue</Label>
              <Textarea
                id="customSignal"
                value={context.customSignal}
                onChange={(e) => updateContext('customSignal', e.target.value)}
                placeholder="Customer mentioned they're evaluating competitors during the last call..."
                rows={3}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant"
            size="lg"
          >
            {isLoading ? 'Generating Playbook...' : 'Generate CS Playbook'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}