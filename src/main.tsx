import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ChatProvider } from './store/chatStore';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>,
);
