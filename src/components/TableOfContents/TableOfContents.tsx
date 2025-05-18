// src/components/TableOfContents/TableOfContents.tsx
import React, { useMemo } from 'react'; // Added useMemo
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';

// import type { Chapter } from '../../types'; // Not directly used here anymore

// Basic styling (can be moved to a CSS file later)
const tocListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const tocItemBaseStyle: React.CSSProperties = { // Renamed for clarity
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    userSelect: 'none', // Prevent text selection on click
};

const activeTocItemStyle: React.CSSProperties = {
    ...tocItemBaseStyle,
    backgroundColor: '#e0e0e0', // Highlight for active chapter
    fontWeight: 'bold',
    color: '#333', // Darker text for active item
};

const inactiveTocItemStyle: React.CSSProperties = { // Style for inactive items
    ...tocItemBaseStyle,
    color: '#555', // Default text color
};

const TableOfContents: React.FC = () => {
    const { guideData, currentTopChapterId, renderedChapterIds } = useGlobalState();
    const dispatch = useGlobalDispatch();

    // Memoized list of all navigable item IDs in their correct order
    const allNavigableItemIdsInOrder = useMemo(() => {
        if (!guideData) return [];
        const ids: string[] = [];
        if (guideData.introduction) ids.push('introduction_section');
        if (guideData.chapters) ids.push(...guideData.chapters.map(c => c.id));
        if (guideData.acknowledgements) ids.push('acknowledgements_section');
        return ids;
    }, [guideData]);

    // Memoize the displayable items for the ToC
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
                // console.log(`[ToC useEffect] Setting initial state: ${initialIdToRender}`);
                dispatch({ type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS, payload: [initialIdToRender] });
                dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: initialIdToRender });
            }
        }
    }, [guideData, renderedChapterIds, allNavigableItemIdsInOrder, dispatch]);


    const handleChapterClick = (targetSectionId: string) => {
        const targetIndex = allNavigableItemIdsInOrder.indexOf(targetSectionId);
        if (targetIndex === -1) {
            console.error(`[ToC] Clicked sectionId ${targetSectionId} not found in ordered list.`);
            return;
        }

        // Create an array of all IDs from the start up to and including the clicked one
        const newRenderedChapterIds = allNavigableItemIdsInOrder.slice(0, targetIndex + 1);

        // console.log(`[ToC] Clicked: ${targetSectionId}. Setting renderedChapterIds to:`, newRenderedChapterIds);
        dispatch({ type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS, payload: newRenderedChapterIds });
        dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: targetSectionId });
        // MainContentArea's useEffect will handle scrolling to targetSectionId
    };


    if (!guideData || navigableItemsForDisplay.length === 0) {
        return <p style={{ padding: '10px', color: '#777' }}>Loading navigation...</p>;
    }

    return (
        <div>
            <h2 style={{ marginTop: 0, fontSize: '1.2em', marginBottom: '10px', paddingBottom: '5px', borderBottom: '1px solid #ccc' }}>
                Table of Contents
            </h2>
            <ul style={/* tocListStyle */ { listStyle: 'none', padding: 0, margin: 0 }}>
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
        </div>
    );
};

export default TableOfContents;