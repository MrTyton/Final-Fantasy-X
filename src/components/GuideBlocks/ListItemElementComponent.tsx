// src/components/GuideBlocks/ListItemElementComponent.tsx
import React, { JSX, useMemo } from 'react';
import type { ListItemElement as ListItemElementType, ChapterContent, InlineElement } from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import InlineContentRenderer from '../InlineContentRenderer';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer'; // Import new TrackableRenderer

// Define RenderableItem type locally or import if shared
type RenderableItem = | InlineElement | ChapterContent | ListItemElementType;

interface ListItemElementProps {
    itemData: ListItemElementType;
    parentScopeKey: string;
    itemIndex: number;
}

// Moved renderItem helper outside to be a standalone function if preferred, or keep inside
const renderListItemContentItem = (
    itemToRender: RenderableItem,
    index: number,
    baseScopeKey: string
): JSX.Element | null => {
    const uniqueKey = `${baseScopeKey}_item${index}`;
    if (!('type' in itemToRender)) {
        console.warn("[ListItemElement] Untyped item in content/subContent:", itemToRender);
        return null;
    }
    const typedItem = itemToRender as { type: string };

    if (typedItem.type === 'listItem') {
        return (<ListItemElementComponent key={uniqueKey} itemData={typedItem as ListItemElementType} parentScopeKey={baseScopeKey} itemIndex={index} />);
    }
    const inlineTypes = ['plainText', 'formattedText', 'characterReference', 'characterCommand', 'gameMacro', 'formation', 'link', 'nth', 'num', 'mathSymbol'];
    if (inlineTypes.includes(typedItem.type)) {
        return <InlineContentRenderer key={uniqueKey} element={typedItem as InlineElement} />;
    }
    // Assumed to be ChapterContent if not listItem or InlineElement
    return <ContentRenderer key={uniqueKey} contentItems={[typedItem as ChapterContent]} currentScopeKey={baseScopeKey} />;
};


const ListItemElementComponent: React.FC<ListItemElementProps> = ({ itemData, parentScopeKey, itemIndex }) => {
    const { settings } = useGlobalState();

    // CSR Behavior Logic
    if (itemData.csrBehavior === 'csr_only' && !settings.csrModeActive) return null;
    if (itemData.csrBehavior === 'standard_only' && settings.csrModeActive) return null;

    const currentItemBaseScopeKey = `${parentScopeKey}_li${itemIndex}`;

    return (
        <li style={{ marginBottom: '0.5em', listStylePosition: 'inside' /* Ensures bullet is part of content flow */ }}>
            {/* Render primary content of the list item */}
            {itemData.content.map((contentEl, idx) =>
                renderListItemContentItem(contentEl, idx, `${currentItemBaseScopeKey}_content`)
            )}

            {/* Render subContent if it exists */}
            {itemData.subContent && itemData.subContent.length > 0 && (
                <div style={{ marginLeft: '20px', marginTop: '0.5em' }}> {/* Visual indent for sub-content */}
                    {itemData.subContent.map((subContentEl, subIdx) =>
                        renderListItemContentItem(subContentEl, subIdx, `${currentItemBaseScopeKey}_sub`)
                    )}
                </div>
            )}

            {/* Delegate ALL trackable handling (both auto and manual prompts) to TrackableRenderer */}
            {(itemData.trackedResourceUpdates || itemData.itemAcquisitionFlags) && (
                <TrackableRenderer
                    trackedResources={itemData.trackedResourceUpdates}
                    itemFlags={itemData.itemAcquisitionFlags}
                // parentKey={`li-${itemData.id || parentScopeKey + itemIndex}`} // Not strictly needed by TrackableRenderer now
                />
            )}
        </li>
    );
};

export default ListItemElementComponent;