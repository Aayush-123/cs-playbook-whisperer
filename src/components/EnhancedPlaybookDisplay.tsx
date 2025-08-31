import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BadgeVariant } from './ui/badge-variant';
import { CSPlaybook } from '@/types/playbook';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Clock,
  Award,
  Brain,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

interface EnhancedPlaybookDisplayProps {
  playbook: CSPlaybook;
}

const priorityColors = {
  high: 'destructive',
  medium: 'warning', 
  low: 'success'
} as const;

const riskColors = {
  1: '#22c55e', 2: '#22c55e', 3: '#22c55e',  // Low: Green
  4: '#eab308', 5: '#eab308', 6: '#eab308',  // Medium: Yellow
  7: '#f97316', 8: '#ef4444', 9: '#ef4444', 10: '#ef4444'  // High: Orange to Red
};

export function EnhancedPlaybookDisplay({ playbook }: EnhancedPlaybookDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const { toast } = useToast();

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      toast({
        description: `${section} copied to clipboard`,
        duration: 2000,
      });
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      toast({
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const CopyButton = ({ text, section, size = "sm" }: { text: string; section: string; size?: "sm" }) => (
    <Button
      variant="ghost"
      size={size}
      onClick={() => copyToClipboard(text, section)}
      className={`shrink-0 ${copiedSection === section ? 'text-success' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );

  const CollapsibleSection = ({ 
    id, 
    title, 
    icon: Icon, 
    children, 
    copyText, 
    defaultExpanded = false 
  }: {
    id: string;
    title: string;
    icon: any;
    children: React.ReactNode;
    copyText?: string;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <Card className="shadow-card">
        <CardHeader 
          className="pb-2 cursor-pointer hover:bg-accent/5 transition-colors"
          onClick={() => toggleSection(id)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {copyText && <CopyButton text={copyText} section={title} size="sm" />}
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  const RiskIndicator = ({ score, label }: { score: number; label: string }) => (
    <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300" 
            style={{ 
              width: `${score * 10}%`, 
              backgroundColor: riskColors[score as keyof typeof riskColors] 
            }}
          />
        </div>
        <span className="text-xs font-mono w-6 text-right">{score}</span>
      </div>
    </div>
  );

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-4">
      {/* Quick Overview */}
      <Card className="shadow-elegant bg-gradient-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Signal Summary
            <BadgeVariant variant="outline" size="sm">
              Confidence: {playbook.confidence}/10
            </BadgeVariant>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-start gap-2">
            <p className="text-xs leading-relaxed flex-1">{playbook.signalSummary}</p>
            <CopyButton text={playbook.signalSummary} section="Signal Summary" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment Dashboard */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RiskIndicator score={playbook.riskAssessment.userAdoptionRisk} label="User Adoption" />
          <RiskIndicator score={playbook.riskAssessment.productAdoptionRisk} label="Product Adoption" />
          <RiskIndicator score={playbook.riskAssessment.renewalRisk} label="Renewal Risk" />
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
              <span className="text-sm font-bold">Overall Risk Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-3 bg-border rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300" 
                    style={{ 
                      width: `${playbook.riskAssessment.overallRiskScore * 10}%`, 
                      backgroundColor: riskColors[playbook.riskAssessment.overallRiskScore as keyof typeof riskColors] 
                    }}
                  />
                </div>
                <span className="text-sm font-mono w-8 text-right font-bold">
                  {playbook.riskAssessment.overallRiskScore}
                </span>
              </div>
            </div>
          </div>
          
          {playbook.riskAssessment.riskIndicators.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium mb-2">Key Risk Indicators:</p>
              <div className="flex flex-wrap gap-1">
                {playbook.riskAssessment.riskIndicators.map((indicator, index) => (
                  <BadgeVariant key={index} variant="destructive" size="sm">
                    {indicator}
                  </BadgeVariant>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-8">
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          <TabsTrigger value="communication" className="text-xs">Email</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Insights</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-3 mt-3">
          <CollapsibleSection
            id="objectives"
            title="CS Objectives"
            icon={Target}
            copyText={playbook.objectives.join('\n• ')}
            defaultExpanded
          >
            <ul className="space-y-1">
              {playbook.objectives.map((objective, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span className="leading-relaxed">{objective}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection
            id="actionPlan"
            title={`Action Plan (${playbook.actionPlan.length} items)`}
            icon={Clock}
            copyText={playbook.actionPlan.map(action => 
              `${action.action} | ${action.timeline} | ${action.owner} | Priority: ${action.priority}`
            ).join('\n')}
          >
            <div className="space-y-2">
              {playbook.actionPlan.map((action, index) => (
                <div key={index} className="p-2 bg-accent/20 rounded border-l-2 border-primary">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-medium leading-relaxed">{action.action}</p>
                    <BadgeVariant variant={priorityColors[action.priority]} size="sm">
                      {action.priority}
                    </BadgeVariant>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>⏰ {action.timeline}</span>
                    <span>👤 {action.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {playbook.escalationTriggers && playbook.escalationTriggers.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Escalation Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {playbook.escalationTriggers.map((trigger, index) => (
                    <li key={index} className="text-xs flex items-start gap-2">
                      <span className="text-warning">⚠</span>
                      <span className="leading-relaxed">{trigger}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="communication" className="space-y-3 mt-3">
          <CollapsibleSection
            id="emailTemplate"
            title={`Email Template (${playbook.communicationTemplate.tone})`}
            icon={Mail}
            copyText={`Subject: ${playbook.communicationTemplate.subject}\n\n${playbook.communicationTemplate.body}`}
            defaultExpanded
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">Subject:</p>
                <p className="text-xs p-2 bg-accent/20 rounded font-mono">
                  {playbook.communicationTemplate.subject}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Body:</p>
                <div className="text-xs p-3 bg-accent/20 rounded leading-relaxed whitespace-pre-line font-mono">
                  {playbook.communicationTemplate.body}
                </div>
              </div>
              
              {playbook.communicationTemplate.followUpSubject && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-2">Follow-up Email:</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                      <p className="text-xs p-2 bg-accent/10 rounded font-mono">
                        {playbook.communicationTemplate.followUpSubject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Body:</p>
                      <div className="text-xs p-3 bg-accent/10 rounded leading-relaxed whitespace-pre-line font-mono">
                        {playbook.communicationTemplate.followUpBody}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </TabsContent>

        <TabsContent value="insights" className="space-y-3 mt-3">
          <CollapsibleSection
            id="risksOpportunities"
            title="Risks & Opportunities"
            icon={TrendingUp}
            copyText={playbook.risksOpportunities.map(item => 
              `${item.type.toUpperCase()}: ${item.description} (Impact: ${item.impact}, Likelihood: ${item.likelihood})`
            ).join('\n')}
          >
            <div className="space-y-2">
              {playbook.risksOpportunities.map((item, index) => (
                <div key={index} className={`p-2 rounded border-l-2 ${
                  item.type === 'risk' ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success'
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs leading-relaxed">{item.description}</p>
                    <div className="flex gap-1">
                      <BadgeVariant variant={item.type === 'risk' ? 'destructive' : 'success'} size="sm">
                        {item.type}
                      </BadgeVariant>
                      <span className="text-xs font-mono bg-background px-1 rounded">
                        {item.score}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Impact: {item.impact}</span>
                    <span>Likelihood: {item.likelihood}</span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="bestPractices"
            title="Best Practices"
            icon={Award}
            copyText={playbook.bestPractices.join('\n• ')}
          >
            <ul className="space-y-1">
              {playbook.bestPractices.map((practice, index) => (
                <li key={index} className="text-xs flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span className="leading-relaxed">{practice}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          {playbook.nextStepsForCSP && playbook.nextStepsForCSP.length > 0 && (
            <CollapsibleSection
              id="nextStepsCSP"
              title="Next Steps for CSM"
              icon={Users}
              copyText={playbook.nextStepsForCSP.join('\n• ')}
            >
              <ul className="space-y-1">
                {playbook.nextStepsForCSP.map((step, index) => (
                  <li key={index} className="text-xs flex items-start gap-2">
                    <span className="text-primary">→</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {playbook.nextStepsForAM && playbook.nextStepsForAM.length > 0 && (
            <CollapsibleSection
              id="nextStepsAM"
              title="Next Steps for Account Manager"
              icon={TrendingUp}
              copyText={playbook.nextStepsForAM.join('\n• ')}
            >
              <ul className="space-y-1">
                {playbook.nextStepsForAM.map((step, index) => (
                  <li key={index} className="text-xs flex items-start gap-2">
                    <span className="text-accent-foreground">💼</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-3 mt-3">
          {playbook.accountSnapshot && (
            <>
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Account Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-accent/20 rounded">
                      <p className="text-xs text-muted-foreground">Login Rate</p>
                      <p className="text-sm font-bold">{playbook.accountSnapshot.metrics.loginRate}%</p>
                    </div>
                    <div className="text-center p-2 bg-accent/20 rounded">
                      <p className="text-xs text-muted-foreground">Active Users</p>
                      <p className="text-sm font-bold">{playbook.accountSnapshot.metrics.activeUsers}</p>
                    </div>
                    <div className="text-center p-2 bg-accent/20 rounded">
                      <p className="text-xs text-muted-foreground">Utilization</p>
                      <p className="text-sm font-bold">{playbook.accountSnapshot.metrics.subscriptionUtilization}%</p>
                    </div>
                    <div className="text-center p-2 bg-accent/20 rounded">
                      <p className="text-xs text-muted-foreground">License Usage</p>
                      <p className="text-sm font-bold">
                        {playbook.accountSnapshot.metrics.assignedUsers}/{playbook.accountSnapshot.metrics.licensesPurchased}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {playbook.accountSnapshot.keyInsights.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {playbook.accountSnapshot.keyInsights.map((insight, index) => (
                        <li key={index} className="text-xs flex items-start gap-2">
                          <span className="text-primary">💡</span>
                          <span className="leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Playbook Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center p-2 bg-accent/20 rounded">
                  <p className="text-muted-foreground">Total Actions</p>
                  <p className="font-bold">{playbook.actionPlan.length}</p>
                </div>
                <div className="text-center p-2 bg-accent/20 rounded">
                  <p className="text-muted-foreground">High Priority</p>
                  <p className="font-bold text-destructive">
                    {playbook.actionPlan.filter(a => a.priority === 'high').length}
                  </p>
                </div>
                <div className="text-center p-2 bg-accent/20 rounded">
                  <p className="text-muted-foreground">Risks</p>
                  <p className="font-bold text-warning">
                    {playbook.risksOpportunities.filter(r => r.type === 'risk').length}
                  </p>
                </div>
                <div className="text-center p-2 bg-accent/20 rounded">
                  <p className="text-muted-foreground">Opportunities</p>
                  <p className="font-bold text-success">
                    {playbook.risksOpportunities.filter(r => r.type === 'opportunity').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}