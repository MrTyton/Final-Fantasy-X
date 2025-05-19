// src/components/GuideBlocks/InstructionListBlockComponent.tsx
import React, { useMemo } from 'react';
import type { InstructionListBlock as InstructionListBlockType } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
import { useGlobalState } from '../../contexts/GlobalStateContext';

// Props for the InstructionListBlockComponent, including the block data and a unique scope key for list context
interface InstructionListBlockProps {
    blockData: InstructionListBlockType; // The instruction list block data, including all list items and ordering info
    listScopeKey: string; // Unique string for generating keys and context for nested lists
}

// Main component for rendering an ordered or unordered instruction list, with CSR filtering and stable keys
const InstructionListBlockComponent: React.FC<InstructionListBlockProps> = ({ blockData, listScopeKey }) => {
    // Access global settings (e.g., for CSR mode filtering)
    const { settings } = useGlobalState();

    // Memoize the filtered list of items to display, based on CSR mode and item-specific behavior
    // Only items matching the current mode (CSR or standard) are included in the rendered list
    const visibleItems = useMemo(() => {
        return blockData.items.filter(item => {
            // Exclude items marked as CSR-only if not in CSR mode
            if (item.csrBehavior === 'csr_only' && !settings.csrModeActive) return false;
            // Exclude items marked as standard-only if in CSR mode
            if (item.csrBehavior === 'standard_only' && settings.csrModeActive) return false;
            // Include all other items
            return true;
        });
    }, [blockData.items, settings.csrModeActive]);

    // Determine the starting number for ordered lists (always 1 for this implementation)
    // For unordered lists, this will be undefined, which is the correct HTML default
    const startNumberForRender = useMemo(() => {
        return blockData.ordered ? 1 : undefined;
    }, [blockData.ordered]);

    // If there are no visible items (e.g., all filtered out by CSR logic), render nothing
    if (visibleItems.length === 0) {
        return null;
    }

    // Render an ordered list (<ol>) if blockData.ordered is true
    if (blockData.ordered) {
        return (
            <ol
                start={startNumberForRender}
                style={{ paddingLeft: '20px', marginBlockStart: '1em', marginBlockEnd: '1em' }}
            >
                {visibleItems.map((item, index) => (
                    <ListItemElementComponent
                        // Generate a stable key for each list item using content and index
                        key={`li-${listScopeKey}-${item.content.map(c => (c as any).text || (c as any).type || `idx${index}`).join('-').slice(0, 20)}-${index}`}
                        itemData={item}
                        parentScopeKey={listScopeKey} // Pass the list's scope key for nested lists
                        itemIndex={index}             // Index of the item within the visibleItems array
                    />
                ))}
            </ol>
        );
    }

    // Render an unordered list (<ul>) if blockData.ordered is false
    return (
        <ul style={{ paddingLeft: '20px', marginBlockStart: '1em', marginBlockEnd: '1em' }}>
            {visibleItems.map((item, index) => (
                <ListItemElementComponent
                    // Generate a stable key for each list item using content and index
                    key={`li-${listScopeKey}-${item.content.map(c => (c as any).text || (c as any).type || `idx${index}`).join('-').slice(0, 20)}-${index}`}
                    itemData={item}
                    parentScopeKey={listScopeKey}
                    itemIndex={index}
                />
            ))}
        </ul>
    );
};

export default InstructionListBlockComponent;