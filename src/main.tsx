// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import { ListNumberingProvider } from './contexts/ListNumberingContext';
import { EditorViewer } from './editor/EditorViewer'; // <-- Import our new editor view
import './index.css';

// The root element to render into
const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

// Read the environment variable we set in the .env file
const appMode = import.meta.env.VITE_APP_MODE;

// Conditionally render based on the mode
if (appMode === 'editor') {
    // If we are in 'editor' mode, render the new EditorView
    console.log("Running in Editor Mode");
    root.render(
        <React.StrictMode>
            <EditorViewer />
        </React.StrictMode>
    );
} else {
    // Otherwise, render the original FFX viewer App with all its providers
    console.log("Running in Viewer Mode");
    root.render(
        <React.StrictMode>
            <GlobalStateProvider>
                <ListNumberingProvider>
                    <App />
                </ListNumberingProvider>
            </GlobalStateProvider>
        </React.StrictMode>
    );
}