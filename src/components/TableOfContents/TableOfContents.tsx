// src/components/TableOfContents/TableOfContents.tsx
import React, { useMemo, useState, useEffect } from 'react'; // Keep useEffect for now, might remove if not needed
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';

// Define Props interface
interface TableOfContentsProps {
    isMobileView: boolean;
    isTocCollapsed: boolean;
    setIsTocCollapsed: (isCollapsed: boolean) => void;
}

// Style for the Table of Contents (ToC) list container. Removes default list styling and spacing.
const tocListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};
// Base style for each ToC item. Sets padding, cursor, and border for item separation.
const tocItemBaseStyle: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    userSelect: 'none', // Prevent text selection on click
};
// Style for the currently active ToC item (highlighted, bold, darker text).
const activeTocItemStyle: React.CSSProperties = {
    ...tocItemBaseStyle,
    backgroundColor: '#e0e0e0', // Highlight for active chapter
    fontWeight: 'bold',
    color: '#333', // Darker text for active item
};
// Style for inactive ToC items (default color, not bold).
const inactiveTocItemStyle: React.CSSProperties = {
    ...tocItemBaseStyle,
    color: '#555', // Default text color
};

// Style for the toggle button
const toggleButtonStyleBase: React.CSSProperties = {
    position: 'fixed', // Or 'absolute' if container is relative and fills viewport part
    top: '60px', // Below header
    left: '10px',
    zIndex: 250, // Above expanded ToC but ensure it's clickable
    padding: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
};

const toggleButtonStyleExpanded: React.CSSProperties = {
    ...toggleButtonStyleBase,
    // When TOC is expanded, button might be better placed within the TOC content
    // For now, keep it fixed, but adjust left to be inside the expanded TOC
    left: 'calc(100vw - 70px)', // Example: 100% width - button width - padding
    top: '10px', // Relative to the TOC container top
    position: 'absolute', // Relative to the TOC container
};


// Main TableOfContents component. Renders a clickable, keyboard-accessible list of all guide sections.
const TableOfContents: React.FC<TableOfContentsProps> = ({ isMobileView, isTocCollapsed, setIsTocCollapsed }) => {
    // Access global state for guide data, current chapter, and rendered chapters
    const { guideData, currentTopChapterId, renderedChapterIds } = useGlobalState();
    const dispatch = useGlobalDispatch();

    // Memoized list of all navigable item IDs in their correct order (introduction, chapters, acknowledgements)
    const allNavigableItemIdsInOrder = useMemo(() => {
        if (!guideData) return [];
        const ids: string[] = [];
        if (guideData.introduction) ids.push('introduction_section');
        if (guideData.chapters) ids.push(...guideData.chapters.map(c => c.id));
        if (guideData.acknowledgements) ids.push('acknowledgements_section');
        return ids;
    }, [guideData]);

    // Memoize the displayable items for the ToC, mapping IDs to titles for display
    const navigableItemsForDisplay = useMemo(() => {
        if (!guideData) return [];
        // This constructs {id, title} for display, order matches allNavigableItemIdsInOrder
        return allNavigableItemIdsInOrder.map(id => {
            if (id === 'introduction_section') return { id, title: 'Introduction' };
            if (id === 'acknowledgements_section') return { id, title: 'Acknowledgements' };
            const chapter = guideData.chapters?.find(c => c.id === id);
            return { id, title: chapter?.title || 'Unknown Chapter' };
        });
    }, [guideData, allNavigableItemIdsInOrder]);

    // Effect to set initial rendered chapter and top chapter when guide data loads
    React.useEffect(() => {
        if (guideData && renderedChapterIds.length === 0 && allNavigableItemIdsInOrder.length > 0) {
            const initialIdToRender = allNavigableItemIdsInOrder[0];
            if (initialIdToRender) {
                // Set the initial rendered chapter and current top chapter for the app
                dispatch({ type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS, payload: [initialIdToRender] });
                dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: initialIdToRender });
            }
        }
    }, [guideData, renderedChapterIds, allNavigableItemIdsInOrder, dispatch]);

    // Handler for clicking or keyboard-activating a ToC item. Updates rendered chapters and scrolls to the target section.
    const handleChapterClick = (targetSectionId: string) => {
        const targetIndex = allNavigableItemIdsInOrder.indexOf(targetSectionId);
        if (targetIndex === -1) {
            console.error(`[ToC] Clicked sectionId ${targetSectionId} not found in ordered list.`);
            return;
        }
        // Create an array of all IDs from the start up to and including the clicked one
        const newRenderedChapterIds = allNavigableItemIdsInOrder.slice(0, targetIndex + 1);
        dispatch({ type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS, payload: newRenderedChapterIds });
        dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: targetSectionId });
        // MainContentArea's useEffect will handle scrolling to targetSectionId
    };

    // If guide data is not loaded or there are no items to display, show a loading message
    if (!guideData || navigableItemsForDisplay.length === 0) {
        return <p style={{ padding: '10px', color: '#777' }}>Loading navigation...</p>;
    }

    const renderToggleButton = () => {
        if (!isMobileView) {
            return null;
        }

        // Button style depends on whether the TOC is collapsed or expanded
        // When TOC is expanded (fullscreen mobile), button should be part of that view
        // When TOC is collapsed, button is fixed to edge of screen
        const buttonStyle = isTocCollapsed ? toggleButtonStyleBase : toggleButtonStyleExpanded;
        
        return (
            <button
                onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                style={buttonStyle}
                aria-label={isTocCollapsed ? "Expand Table of Contents" : "Collapse Table of Contents"}
                aria-expanded={!isTocCollapsed}
            >
                {isTocCollapsed ? '➔' : '←'}
            </button>
        );
    };

    // Render the Table of Contents as a vertical list of clickable/keyboard-accessible items
    // Conditional rendering based on isMobileView and isTocCollapsed
    if (isMobileView && isTocCollapsed) {
        return (
            <>
                {renderToggleButton()}
                {/* TOC Content is hidden */}
            </>
        );
    }

    return (
        <div>
            {renderToggleButton()}
            {/* Section header for the ToC - only render if not mobile and collapsed */}
            {(!isMobileView || (isMobileView && !isTocCollapsed)) && (
                <h2 style={{ marginTop: isMobileView ? '40px' : 0, fontSize: '1.2em', marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #ccc' }}>
                    Table of Contents
                </h2>
            )}
            {(!isMobileView || (isMobileView && !isTocCollapsed)) && (
                <ul style={tocListStyle}>
                    {navigableItemsForDisplay.map((item) => (
                        <li
                            key={item.id}
                            style={item.id === currentTopChapterId ? activeTocItemStyle : inactiveTocItemStyle}
                            onClick={() => handleChapterClick(item.id)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleChapterClick(item.id);
                                }
                            }}
                        >
                            {item.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TableOfContents;