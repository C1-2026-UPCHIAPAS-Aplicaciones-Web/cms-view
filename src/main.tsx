import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@shared/view/tokens.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
