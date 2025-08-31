import { CSPlaybook } from '@/types/playbook';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Copy, CheckCircle, AlertTriangle, Clock, User, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BadgeVariant } from './ui/badge-variant';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { EnhancedPlaybookDisplay } from './EnhancedPlaybookDisplay';

interface CompactPlaybookDisplayProps {
  playbook: CSPlaybook;
}

const priorityColors = {
  high: 'destructive',
  medium: 'warning',
  low: 'success'
} as const;

export function CompactPlaybookDisplay({ playbook }: CompactPlaybookDisplayProps) {
  // Use the enhanced display for better UX
  return <EnhancedPlaybookDisplay playbook={playbook} />;
}

function LegacyCompactPlaybookDisplay({ playbook }: CompactPlaybookDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    objectives: true,
    actions: false,
    communication: false,
    risks: false
  });
  const { toast } = useToast();

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
      toast({
        title: "Copied",
        description: `${section} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => copyToClipboard(text, section)}
      className="h-6 w-6 p-0"
    >
      {copiedSection === section ? (
        <CheckCircle className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto">
      {/* Signal Summary */}
      <Card className="shadow-sm border-l-4 border-l-cs-brand">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm text-cs-brand">Signal Summary</CardTitle>
            <CopyButton text={playbook.signalSummary} section="Summary" />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {playbook.signalSummary}
          </p>
        </CardHeader>
      </Card>

      {/* Objectives */}
      <Collapsible open={expandedSections.objectives} onOpenChange={() => toggleSection('objectives')}>
        <Card className="shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {expandedSections.objectives ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Objectives ({playbook.objectives.length})
                </CardTitle>
                <CopyButton text={playbook.objectives.join('\n• ')} section="Objectives" />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              {playbook.objectives.slice(0, 3).map((objective, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-cs-brand-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-cs-brand">{index + 1}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{objective}</p>
                </div>
              ))}
              {playbook.objectives.length > 3 && (
                <p className="text-xs text-muted-foreground">+{playbook.objectives.length - 3} more objectives</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Action Plan */}
      <Collapsible open={expandedSections.actions} onOpenChange={() => toggleSection('actions')}>
        <Card className="shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {expandedSections.actions ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Actions ({playbook.actionPlan.length})
                </CardTitle>
                <CopyButton 
                  text={playbook.actionPlan.map(action => 
                    `${action.action} (${action.timeline}, ${action.owner})`
                  ).join('\n')} 
                  section="Actions" 
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              {playbook.actionPlan.slice(0, 3).map((action, index) => (
                <div key={index} className="p-2 rounded border bg-muted/30">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-medium flex-1">{action.action}</p>
                    <BadgeVariant variant={priorityColors[action.priority]} size="sm">
                      {action.priority}
                    </BadgeVariant>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2 w-2" />
                      {action.timeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-2 w-2" />
                      {action.owner}
                    </span>
                  </div>
                </div>
              ))}
              {playbook.actionPlan.length > 3 && (
                <p className="text-xs text-muted-foreground">+{playbook.actionPlan.length - 3} more actions</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Communication Template */}
      <Collapsible open={expandedSections.communication} onOpenChange={() => toggleSection('communication')}>
        <Card className="shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {expandedSections.communication ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Email Template
                </CardTitle>
                <CopyButton 
                  text={`Subject: ${playbook.communicationTemplate.subject}\n\n${playbook.communicationTemplate.body}`} 
                  section="Email" 
                />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Subject:</p>
                <p className="text-xs bg-muted/50 p-2 rounded">{playbook.communicationTemplate.subject}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
                <p className="text-xs bg-muted/50 p-2 rounded line-clamp-3">
                  {playbook.communicationTemplate.body.substring(0, 150)}...
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quick Stats */}
      <Card className="shadow-sm">
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Actions</p>
              <p className="text-sm font-semibold">{playbook.actionPlan.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">High Priority</p>
              <p className="text-sm font-semibold text-destructive">
                {playbook.actionPlan.filter(a => a.priority === 'high').length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risks</p>
              <p className="text-sm font-semibold text-warning">
                {playbook.risksOpportunities.filter(r => r.type === 'risk').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}