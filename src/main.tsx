import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import './index.css';
import App from './components/App/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
