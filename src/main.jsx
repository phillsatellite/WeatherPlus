import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import { RecentsProvider } from './context/RecentsContext';
import { ThemeProvider } from './context/ThemeContext';
import { UnitsProvider } from './context/UnitsContext';
import './index.css';

// App entry point. BrowserRouter wraps the providers so routing works
// everywhere.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UnitsProvider>
          <FavoritesProvider>
            <RecentsProvider>
              <App />
            </RecentsProvider>
          </FavoritesProvider>
        </UnitsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
