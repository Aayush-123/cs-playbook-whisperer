import { CSPlaybook } from '@/types/playbook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, CheckCircle, AlertTriangle, TrendingUp, Clock, User, Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BadgeVariant } from './ui/badge-variant';

interface PlaybookDisplayProps {
  playbook: CSPlaybook;
}

const priorityColors = {
  high: 'destructive',
  medium: 'warning',
  low: 'success'
} as const;

const impactColors = {
  high: 'destructive',
  medium: 'warning', 
  low: 'success'
} as const;

export function PlaybookDisplay({ playbook }: PlaybookDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: `${section} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, section)}
      className="h-8 px-2"
    >
      {copiedSection === section ? (
        <CheckCircle className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Signal Summary Header */}
      <Card className="shadow-card border-l-4 border-l-cs-brand">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg text-cs-brand">Signal Summary</CardTitle>
              <CardDescription className="mt-2 text-base leading-relaxed">
                {playbook.signalSummary}
              </CardDescription>
            </div>
            <CopyButton text={playbook.signalSummary} section="Signal Summary" />
          </div>
        </CardHeader>
      </Card>

      {/* Main Playbook Tabs */}
      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="objectives" className="text-xs">Objectives</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Action Plan</TabsTrigger>
          <TabsTrigger value="communication" className="text-xs">Email</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs">Risks</TabsTrigger>
          <TabsTrigger value="practices" className="text-xs lg:block hidden">Best Practices</TabsTrigger>
          <TabsTrigger value="overview" className="text-xs lg:block hidden">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cs-brand" />
                  CS Objectives
                </CardTitle>
                <CopyButton text={playbook.objectives.join('\n• ')} section="Objectives" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {playbook.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-cs-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-cs-brand">{index + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{objective}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cs-brand" />
                  Action Plan
                </CardTitle>
                <CopyButton 
                  text={playbook.actionPlan.map(action => 
                    `${action.action} (${action.timeline}, ${action.owner}, Priority: ${action.priority})`
                  ).join('\n')} 
                  section="Action Plan" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playbook.actionPlan.map((action, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="font-medium text-sm flex-1">{action.action}</p>
                      <BadgeVariant variant={priorityColors[action.priority]} size="sm">
                        {action.priority.toUpperCase()}
                      </BadgeVariant>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {action.timeline}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {action.owner}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cs-brand" />
                  Communication Template
                </CardTitle>
                <CopyButton 
                  text={`Subject: ${playbook.communicationTemplate.subject}\n\n${playbook.communicationTemplate.body}`} 
                  section="Email Template" 
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Tone:</span>
                <BadgeVariant variant="cs" size="sm">
                  {playbook.communicationTemplate.tone.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </BadgeVariant>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Subject Line</Label>
                <div className="mt-1 p-3 bg-muted/50 rounded border">
                  <p className="font-medium">{playbook.communicationTemplate.subject}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email Body</Label>
                <div className="mt-1 p-4 bg-muted/50 rounded border">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {playbook.communicationTemplate.body}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-cs-brand" />
                  Risk & Opportunity Analysis
                </CardTitle>
                <CopyButton 
                  text={playbook.risksOpportunities.map(item => 
                    `${item.type.toUpperCase()}: ${item.description} (Impact: ${item.impact}, Likelihood: ${item.likelihood})`
                  ).join('\n')} 
                  section="Risk Analysis" 
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {playbook.risksOpportunities.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3 mb-3">
                      <BadgeVariant 
                        variant={item.type === 'risk' ? 'destructive' : 'success'} 
                        size="sm"
                      >
                        {item.type.toUpperCase()}
                      </BadgeVariant>
                      <p className="text-sm flex-1">{item.description}</p>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground">Impact:</span>
                        <BadgeVariant variant={impactColors[item.impact]} size="sm">
                          {item.impact}
                        </BadgeVariant>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground">Likelihood:</span>
                        <BadgeVariant variant={impactColors[item.likelihood]} size="sm">
                          {item.likelihood}
                        </BadgeVariant>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-cs-brand" />
                  Best Practices
                </CardTitle>
                <CopyButton text={playbook.bestPractices.join('\n• ')} section="Best Practices" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {playbook.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{practice}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {playbook.actionPlan.slice(0, 3).map((action, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-cs-brand flex-shrink-0"></div>
                    <span className="truncate">{action.action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Actions:</span>
                  <BadgeVariant variant="cs" size="sm">{playbook.actionPlan.length}</BadgeVariant>
                </div>
                <div className="flex justify-between text-sm">
                  <span>High Priority:</span>
                  <BadgeVariant variant="destructive" size="sm">
                    {playbook.actionPlan.filter(a => a.priority === 'high').length}
                  </BadgeVariant>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risks Identified:</span>
                  <BadgeVariant variant="warning" size="sm">
                    {playbook.risksOpportunities.filter(r => r.type === 'risk').length}
                  </BadgeVariant>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>;
}