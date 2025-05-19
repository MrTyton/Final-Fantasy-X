// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { ListNumberingProvider } from './contexts/ListNumberingContext'; // Provides context for list numbering in nested lists
import './index.css'; // Global CSS for the app

// Entry point for the React application.
// Renders the App component into the root div, wrapped with global providers for state and list numbering.
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* GlobalStateProvider supplies global app state and dispatch to all components */}
        <GlobalStateProvider>
            {/* ListNumberingProvider supplies context for managing ordered list numbering across nested lists/blocks */}
            <ListNumberingProvider>
                <App /> {/* Main application component */}
            </ListNumberingProvider>
        </GlobalStateProvider>
    </React.StrictMode>,
);