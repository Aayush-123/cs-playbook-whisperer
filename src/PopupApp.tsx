import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ExtensionHeader } from '@/components/ExtensionHeader';
import { CompactCustomerForm } from '@/components/CompactCustomerForm';
import { CompactPlaybookDisplay } from '@/components/CompactPlaybookDisplay';
import { CustomerContext, CSPlaybook } from '@/types/playbook';
import { generatePlaybookAsync } from '@/services/playbookGenerator';

const queryClient = new QueryClient();

const PopupApp = () => {
  const [playbook, setPlaybook] = useState<CSPlaybook | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlaybook = async (context: CustomerContext) => {
    setIsLoading(true);
    try {
      const generatedPlaybook = await generatePlaybookAsync(context);
      setPlaybook(generatedPlaybook);
      
      // Store in Chrome storage for persistence
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({
          lastPlaybook: generatedPlaybook,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error generating playbook:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPlaybook = () => {
    setPlaybook(null);
  };

  // Load last playbook on mount
  useState(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['lastPlaybook', 'timestamp']).then((result) => {
        if (result.lastPlaybook && result.timestamp) {
          // Only load if it's less than 24 hours old
          const hoursSinceGeneration = (Date.now() - result.timestamp) / (1000 * 60 * 60);
          if (hoursSinceGeneration < 24) {
            setPlaybook(result.lastPlaybook);
          }
        }
      });
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="w-[400px] h-[600px] bg-background flex flex-col">
          <ExtensionHeader 
            onNewPlaybook={handleNewPlaybook} 
            showNewButton={!!playbook} 
          />
          
          <div className="flex-1 p-4 overflow-hidden">
            {!playbook ? (
              <CompactCustomerForm 
                onSubmit={handleGeneratePlaybook} 
                isLoading={isLoading} 
              />
            ) : (
              <CompactPlaybookDisplay playbook={playbook} />
            )}
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default PopupApp;