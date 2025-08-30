import { useState } from 'react';
import { CustomerContextForm } from '@/components/CustomerContextForm';
import { PlaybookDisplay } from '@/components/PlaybookDisplay';
import { CustomerContext, CSPlaybook } from '@/types/playbook';
import { generatePlaybookAsync } from '@/services/playbookGenerator';
import { FileText, Target, Users } from 'lucide-react';

const Index = () => {
  const [playbook, setPlaybook] = useState<CSPlaybook | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlaybook = async (context: CustomerContext) => {
    setIsLoading(true);
    try {
      const generatedPlaybook = await generatePlaybookAsync(context);
      setPlaybook(generatedPlaybook);
    } catch (error) {
      console.error('Error generating playbook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPlaybook(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">CS Playbook Generator</h1>
                <p className="text-primary-foreground/80 text-sm">Transform customer signals into actionable strategies</p>
              </div>
            </div>
            {playbook && (
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
              >
                New Playbook
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!playbook ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-foreground">Generate Comprehensive CS Playbooks</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Transform customer signals into detailed, actionable guidance with objectives, action plans, 
                communication templates, and risk analysis.
              </p>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-card">
                  <FileText className="h-8 w-8 text-cs-brand mb-3" />
                  <h3 className="font-semibold mb-2">Smart Analysis</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    AI-powered insights that understand context and generate relevant strategies
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-card">
                  <Target className="h-8 w-8 text-cs-brand mb-3" />
                  <h3 className="font-semibold mb-2">Action-Oriented</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Ready-to-execute plans with timelines, owners, and priorities
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg bg-card border shadow-card">
                  <Users className="h-8 w-8 text-cs-brand mb-3" />
                  <h3 className="font-semibold mb-2">Customer-Centric</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Personalized communication templates and relationship strategies
                  </p>
                </div>
              </div>
            </div>

            <CustomerContextForm onSubmit={handleGeneratePlaybook} isLoading={isLoading} />
          </div>
        ) : (
          <PlaybookDisplay playbook={playbook} />
        )}
      </main>
    </div>
  );
};

export default Index;
