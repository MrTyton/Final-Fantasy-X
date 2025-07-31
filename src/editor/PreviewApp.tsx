// src/editor/PreviewApp.tsx
import React, { useEffect } from 'react';
import { useGlobalState, useGlobalDispatch } from '../contexts/GlobalStateContext';
import { GlobalActionType } from '../contexts/GlobalStateContext';
import { loadFullGuideData } from '../services/guideLoader';
import Layout from '../components/Layout/Layout';
import TableOfContents from '../components/TableOfContents/TableOfContents';
import MainContentArea from '../components/MainContentArea/MainContentArea';
import TrackerAreaComponent from '../components/TrackerArea/TrackerAreaComponent';

interface PreviewAppProps {
    currentChapterId?: string;
}

// Preview version of the main App component that automatically navigates to a specific chapter
export const PreviewApp: React.FC<PreviewAppProps> = ({ currentChapterId }) => {
    const { guideData, isLoadingGuide, guideLoadError, currentTopChapterId } = useGlobalState();
    const dispatch = useGlobalDispatch();

    // Load guide data on mount
    useEffect(() => {
        async function fetchData() {
            dispatch({ type: GlobalActionType.SET_GUIDE_LOADING, payload: true });
            try {
                const data = await loadFullGuideData('/data/ffx_guide_main.json');
                if (data) {
                    dispatch({ type: GlobalActionType.SET_GUIDE_DATA, payload: data });
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

    // Auto-navigate to the current chapter when guide data is loaded
    useEffect(() => {
        if (guideData && guideData.chapters && currentChapterId && currentTopChapterId !== currentChapterId) {
            // Find the chapter in the guide data
            const targetChapter = guideData.chapters.find(chapter => chapter.id === currentChapterId);
            if (targetChapter) {
                console.log('Auto-navigating to chapter:', targetChapter.title);
                // Set the current chapter to match the editor
                dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: currentChapterId });
                // Also set it as the initial rendered chapter
                dispatch({ type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS, payload: [currentChapterId] });
            }
        }
    }, [guideData, currentChapterId, currentTopChapterId, dispatch]);

    // Show loading message while guide data is being fetched
    if (isLoadingGuide) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                fontSize: '1.2em',
                color: '#64748b',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                Loading FFX Guide Data...
            </div>
        );
    }

    // Show error message if guide data failed to load
    if (guideLoadError) {
        return (
            <div style={{
                color: '#ef4444',
                textAlign: 'center',
                padding: '50px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                margin: '20px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                <div style={{ fontSize: '1.2em', marginBottom: '8px' }}>⚠️ Error Loading Guide</div>
                <div>{guideLoadError}</div>
            </div>
        );
    }

    // Show fallback if guide data is not available
    if (!guideData) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: '#64748b',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                No guide data available.
            </div>
        );
    }

    // Render the preview layout
    return (
        <div style={{
            height: '100%',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            // Override the fixed header positioning in preview mode
            position: 'relative'
        }}>
            {/* Custom styles to hide or adjust the header in preview mode */}
            <style>{`
                /* Hide the header in preview mode by making it very small */
                .preview-container .layout-header {
                    height: 0px !important;
                    overflow: hidden !important;
                }
                /* Adjust the body container margin for no header */
                .preview-container .layout-body {
                    margin-top: 0px !important;
                    height: 100vh !important;
                    max-height: 100vh !important;
                }
            `}</style>
            <div className="preview-container">
                <Layout
                    tableOfContents={<TableOfContents />}
                    tracker={<TrackerAreaComponent />}
                >
                    <MainContentArea />
                </Layout>
            </div>
        </div>
    );
};
