// src/App.tsx
import { useEffect } from 'react';
import { useGlobalState, useGlobalDispatch } from './contexts/GlobalStateContext';
import { GlobalActionType } from './contexts/GlobalStateContext';
import { loadFullGuideData } from './services/guideLoader';

import Layout from './components/Layout/Layout';
import TableOfContents from './components/TableOfContents/TableOfContents';
import MainContentArea from './components/MainContentArea/MainContentArea';
import TrackerAreaComponent from './components/TrackerArea/TrackerAreaComponent';

// MainContentAreaPlaceholder is a fallback for when the real MainContentArea is not used.
// It displays a message or a simple preview of the current chapter/section content.

// TrackerAreaPlaceholder is a fallback for when the real TrackerAreaComponent is not used.

// Main App component. Handles guide data loading, error handling, and renders the main layout.
function App() {
    // Access global state for guide data, loading/error state, and current chapter
    const { guideData, isLoadingGuide, guideLoadError } = useGlobalState();
    const dispatch = useGlobalDispatch();

    // Effect to load the guide data on initial mount or when needed
    useEffect(() => {
        async function fetchData() {
            dispatch({ type: GlobalActionType.SET_GUIDE_LOADING, payload: true });
            try {
                const data = await loadFullGuideData('/data/ffx_guide_main.json');
                if (data) {
                    dispatch({ type: GlobalActionType.SET_GUIDE_DATA, payload: data });
                    // The TableOfContents component will set the initial chapter if needed
                } else {
                    dispatch({ type: GlobalActionType.SET_GUIDE_LOAD_ERROR, payload: 'Failed to load guide data.' });
                }
            } catch (err) {
                console.error('Error in fetchData:', err);
                dispatch({ type: GlobalActionType.SET_GUIDE_LOAD_ERROR, payload: 'An unexpected error occurred.' });
            }
        }

        // Only fetch if not already loaded or errored
        if (!guideData && isLoadingGuide && !guideLoadError) {
            fetchData();
        } else if (guideData && isLoadingGuide) {
            // If guide data is present but still marked as loading, clear loading state
            dispatch({ type: GlobalActionType.SET_GUIDE_LOADING, payload: false });
        }
    }, [dispatch, guideData, isLoadingGuide, guideLoadError]);

    // Show loading message while guide data is being fetched
    if (isLoadingGuide) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>Loading FFX Guide Data...</div>;
    }

    // Show error message if guide data failed to load
    if (guideLoadError) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {guideLoadError}</div>;
    }

    // Show fallback if guide data is not available
    if (!guideData) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>No guide data available.</div>;
    }

    // Render the main app layout with Table of Contents, Main Content, and Tracker
    return (
        <Layout
            tableOfContents={<TableOfContents />}
            tracker={<TrackerAreaComponent />}
        >
            <MainContentArea /> {/* Main content area for chapters/sections */}
        </Layout>
    );
}

export default App;