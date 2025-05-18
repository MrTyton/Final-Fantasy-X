// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { ListNumberingProvider } from './contexts/ListNumberingContext'; // Import new provider
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GlobalStateProvider>
            <ListNumberingProvider> {/* Wrap with ListNumberingProvider */}
                <App />
            </ListNumberingProvider>
        </GlobalStateProvider>
    </React.StrictMode>,
);