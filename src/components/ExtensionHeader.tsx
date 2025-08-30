import { Target, ExternalLink, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface ExtensionHeaderProps {
  onNewPlaybook?: () => void;
  showNewButton?: boolean;
}

export function ExtensionHeader({ onNewPlaybook, showNewButton = false }: ExtensionHeaderProps) {
  const openFullApp = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    } else {
      // Fallback for development
      window.open('/index.html', '_blank');
    }
  };

  return (
    <header className="border-b bg-gradient-primary px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">CS Playbook</h1>
            <p className="text-primary-foreground/80 text-xs">Quick strategy generator</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showNewButton && onNewPlaybook && (
            <Button
              onClick={onNewPlaybook}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 px-2"
            >
              New
            </Button>
          )}
          <Button
            onClick={openFullApp}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-8 px-2"
            title="Open full app"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}