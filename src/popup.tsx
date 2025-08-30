import { createRoot } from 'react-dom/client';
import PopupApp from './PopupApp';
import './index.css';

// Check if we're in the extension popup context
if (document.getElementById('root')) {
  createRoot(document.getElementById('root')!).render(<PopupApp />);
}