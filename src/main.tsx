import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {PerfumesProvider} from './PerfumesContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PerfumesProvider>
      <App />
    </PerfumesProvider>
  </StrictMode>,
);
