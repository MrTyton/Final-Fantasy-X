// src/components/GuideBlocks/ListItemElementComponent.tsx
import React, { JSX } from 'react';
import type { ListItemElement as ListItemElementType, ChapterContent, InlineElement } from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import InlineContentRenderer from '../InlineContentRenderer';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer';

// RenderableItem type covers all possible content types that can appear in a list item: inline, chapter, or nested list item.
type RenderableItem = InlineElement | ChapterContent | ListItemElementType;

// Props for ListItemElementComponent, including the list item data, parent scope key, and item index for unique context
interface ListItemElementProps {
    itemData: ListItemElementType; // The list item data, including content, subContent, and trackables
    parentScopeKey: string;        // Unique string for generating keys and context for nested lists
    itemIndex: number;             // Index of this item within its parent list
}

// Helper function to render any item that can appear in a list item's content or subContent array
// Handles inline elements, nested list items, and chapter content blocks
const renderListItemContentItem = (
    itemToRender: RenderableItem,
    index: number,
    baseScopeKey: string
): JSX.Element | null => {
    // Generate a unique key for this content item for React rendering
    const uniqueKey = `${baseScopeKey}_item${index}`;
    // Defensive: If the item does not have a 'type', log a warning and skip rendering
    if (!('type' in itemToRender)) {
        console.warn("[ListItemElement] Untyped item in content/subContent:", itemToRender);
        return null;
    }
    const typedItem = itemToRender as { type: string };

    // If the item is itself a list item, render recursively as a nested ListItemElementComponent
    if (typedItem.type === 'listItem') {
        return (
            <ListItemElementComponent
                key={uniqueKey}
                itemData={typedItem as ListItemElementType}
                parentScopeKey={baseScopeKey}
                itemIndex={index}
            />
        );
    }
    // If the item is an inline element (text, macro, link, etc.), render with InlineContentRenderer
    const inlineTypes = [
        'plainText', 'formattedText', 'characterReference', 'characterCommand',
        'gameMacro', 'formation', 'link', 'nth', 'num', 'mathSymbol'
    ];
    if (inlineTypes.includes(typedItem.type)) {
        return <InlineContentRenderer key={uniqueKey} element={typedItem as InlineElement} />;
    }
    // Otherwise, treat as a ChapterContent block and render with ContentRenderer
    return <ContentRenderer key={uniqueKey} contentItems={[typedItem as ChapterContent]} currentScopeKey={baseScopeKey} />;
};

// Main component for rendering a single list item, including its content, subContent, and any trackable prompts
const ListItemElementComponent: React.FC<ListItemElementProps> = ({ itemData, parentScopeKey, itemIndex }) => {
    // Access global settings (e.g., for CSR mode filtering)
    const { settings } = useGlobalState();

    // CSR Behavior Logic: Hide this item if it is CSR-only and CSR mode is not active, or vice versa
    if (itemData.csrBehavior === 'csr_only' && !settings.csrModeActive) return null;
    if (itemData.csrBehavior === 'standard_only' && settings.csrModeActive) return null;

    // Generate a unique scope key for this list item for nested context and stable React keys
    const currentItemBaseScopeKey = `${parentScopeKey}_li${itemIndex}`;

    // Render the list item, including its main content, subContent, and any trackable prompts
    return (
        <li style={{ marginBottom: '0.5em', listStylePosition: 'inside' /* Ensures bullet is part of content flow */ }}>
            {/* Render primary content of the list item (array of inline, block, or nested list items) */}
            {itemData.content.map((contentEl, idx) =>
                renderListItemContentItem(contentEl, idx, `${currentItemBaseScopeKey}_content`)
            )}

            {/* Render subContent if it exists, visually indented and separated from main content */}
            {itemData.subContent && itemData.subContent.length > 0 && (
                <div style={{ marginLeft: '20px', marginTop: '0.5em' }}> {/* Visual indent for sub-content */}
                    {itemData.subContent.map((subContentEl, subIdx) =>
                        renderListItemContentItem(subContentEl, subIdx, `${currentItemBaseScopeKey}_sub`)
                    )}
                </div>
            )}

            {/* Render any tracked resource updates or item acquisition flags for this list item using TrackableRenderer */}
            {(itemData.trackedResourceUpdates || itemData.itemAcquisitionFlags) && (
                <TrackableRenderer
                    trackedResources={itemData.trackedResourceUpdates}
                    itemFlags={itemData.itemAcquisitionFlags}
                />
            )}
        </li>
    );
};

export default ListItemElementComponent;