// src/App.tsx
import React, { useEffect } from 'react';
import { useGlobalState, useGlobalDispatch } from './contexts/GlobalStateContext';
import { GlobalActionType } from './contexts/GlobalStateContext';
import { loadFullGuideData } from './services/guideLoader';

import Layout from './components/Layout/Layout';
import TableOfContents from './components/TableOfContents/TableOfContents';
import MainContentArea from './components/MainContentArea/MainContentArea';
import TrackerAreaComponent from './components/TrackerArea/TrackerAreaComponent';

// Placeholder for MainContentArea and TrackerArea
const MainContentAreaPlaceholder: React.FC = () => {
    const { guideData, currentTopChapterId } = useGlobalState();
    if (!guideData) return <p>Loading content...</p>;

    let contentToDisplay = <p>Select a chapter to view its content.</p>;

    if (currentTopChapterId === 'introduction_section' && guideData.introduction) {
        contentToDisplay = (
            <div>
                <h2>Introduction</h2>
                <p>(Intro content will be rendered here: {guideData.introduction.length} blocks)</p>
            </div>
        );
    } else if (currentTopChapterId === 'acknowledgements_section' && guideData.acknowledgements) {
        contentToDisplay = (
            <div>
                <h2>Acknowledgements</h2>
                <p>(Acknowledgements content will be rendered here: {guideData.acknowledgements.length} lines)</p>
            </div>
        );
    } else if (currentTopChapterId) {
        const chapter = guideData.chapters?.find(c => c.id === currentTopChapterId);
        if (chapter) {
            contentToDisplay = (
                <div>
                    <h2>{chapter.title}</h2>
                    <p>(Content for {chapter.title} will be rendered here: {chapter.content.length} blocks)</p>
                </div>
            );
        } else {
            contentToDisplay = <p>Chapter content not found for ID: {currentTopChapterId}</p>;
        }
    }
    return <div style={{ padding: '20px' }}>{contentToDisplay}</div>;
};

const TrackerAreaPlaceholder: React.FC = () => {
    // We'll fetch and display tracker data later
    return <div style={{ padding: '10px' }}>Tracker Area (Coming Soon)</div>;
};


function App() {
    const { guideData, isLoadingGuide, guideLoadError, currentTopChapterId } = useGlobalState(); // Added currentTopChapterId
    const dispatch = useGlobalDispatch();

    useEffect(() => {
        async function fetchData() {
            dispatch({ type: GlobalActionType.SET_GUIDE_LOADING, payload: true });
            try {
                const data = await loadFullGuideData('/data/ffx_guide_main.json');
                if (data) {
                    dispatch({ type: GlobalActionType.SET_GUIDE_DATA, payload: data });
                    // Set initial chapter AFTER data is loaded and if no chapter is set by ToC's own effect yet
                    // The ToC useEffect will likely fire first if guideData becomes available.
                } else {
                    dispatch({ type: GlobalActionType.SET_GUIDE_LOAD_ERROR, payload: 'Failed to load guide data.' });
                }
            } catch (err) {
                console.error('Error in fetchData:', err);
                dispatch({ type: GlobalActionType.SET_GUIDE_LOAD_ERROR, payload: 'An unexpected error occurred.' });
            }
        }

        if (!guideData && isLoadingGuide && !guideLoadError) {
            fetchData();
        } else if (guideData && isLoadingGuide) {
            dispatch({ type: GlobalActionType.SET_GUIDE_LOADING, payload: false });
        }
    }, [dispatch, guideData, isLoadingGuide, guideLoadError]);

    if (isLoadingGuide) {
        return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5em' }}>Loading FFX Guide Data...</div>;
    }

    if (guideLoadError) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {guideLoadError}</div>;
    }

    if (!guideData) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>No guide data available.</div>;
    }

    return (
        <Layout
            tableOfContents={<TableOfContents />}
            tracker={<TrackerAreaComponent />}
        >
            <MainContentArea /> {/* <-- Use the real component */}
        </Layout>
    );
}

export default App;