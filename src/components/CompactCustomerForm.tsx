import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CustomerContext, CSScenario, scenarioLabels } from '@/types/playbook';
import { BadgeVariant } from './ui/badge-variant';

interface CompactCustomerFormProps {
  onSubmit: (context: CustomerContext) => void;
  isLoading: boolean;
}

const healthColors = {
  healthy: 'success',
  'at-risk': 'warning',
  critical: 'destructive'
} as const;

export function CompactCustomerForm({ onSubmit, isLoading }: CompactCustomerFormProps) {
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
    <div className="max-h-[500px] overflow-y-auto">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Customer Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="customerName" className="text-xs">Customer</Label>
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
                <Label htmlFor="contactName" className="text-xs">Contact</Label>
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
                <Label htmlFor="contactRole" className="text-xs">Role</Label>
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
                <Label htmlFor="accountValue" className="text-xs">ARR</Label>
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

            {/* Health Status */}
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

            {/* Scenario */}
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

            {/* Context */}
            <div className="space-y-1">
              <Label htmlFor="customSignal" className="text-xs">Signal/Issue</Label>
              <Textarea
                id="customSignal"
                value={context.customSignal}
                onChange={(e) => updateContext('customSignal', e.target.value)}
                placeholder="Customer mentioned evaluating competitors..."
                rows={3}
                className="text-xs resize-none"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90 h-8 text-xs"
            >
              {isLoading ? 'Generating...' : 'Generate Playbook'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}