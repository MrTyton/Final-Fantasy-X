// src/components/GuideBlocks/InstructionListBlockComponent.tsx
import React, { useMemo } from 'react'; // Removed useEffect as resume logic is simplified
import type { InstructionListBlock as InstructionListBlockType } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
// import { useListNumbering } from '../../contexts/ListNumberingContext'; // Context not used for resume now
import { useGlobalState } from '../../contexts/GlobalStateContext';

interface InstructionListBlockProps {
    blockData: InstructionListBlockType;
    listScopeKey: string; // Still useful for unique keys for list items & if nested items need scoping
}

const InstructionListBlockComponent: React.FC<InstructionListBlockProps> = ({ blockData, listScopeKey }) => {
    const { settings } = useGlobalState(); // Get settings for csrModeActive

    // Memoize visibleItems to prevent re-filtering on every render unless dependencies change.
    // This calculates which items should be rendered based on CSR mode.
    const visibleItems = useMemo(() => {
        return blockData.items.filter(item => {
            if (item.csrBehavior === 'csr_only' && !settings.csrModeActive) return false;
            if (item.csrBehavior === 'standard_only' && settings.csrModeActive) return false;
            return true;
        });
    }, [blockData.items, settings.csrModeActive]);

    // RESUME FUNCTIONALITY DISABLED FOR STABILITY:
    // startNumber will always be 1 for ordered lists, or undefined for ul (which is correct HTML default).
    const startNumberForRender = useMemo(() => {
        return blockData.ordered ? 1 : undefined;
    }, [blockData.ordered]);


    // If there are no visible items (e.g., all filtered out by CSR), render nothing.
    if (visibleItems.length === 0) {
        return null;
    }

    if (blockData.ordered) {
        return (
            <ol start={startNumberForRender} style={{ paddingLeft: '20px', marginBlockStart: '1em', marginBlockEnd: '1em' }}>
                {visibleItems.map((item, index) => (
                    <ListItemElementComponent
                        // Attempt to create a somewhat stable key, though if item content is identical, this isn't perfect.
                        // If ListItemElement type had an 'id', that would be best.
                        key={`li-${listScopeKey}-${item.content.map(c => (c as any).text || (c as any).type || `idx${index}`).join('-').slice(0, 20)}-${index}`}
                        itemData={item}
                        parentScopeKey={listScopeKey} // This list's scope key becomes parent for its items' potential nested lists
                        itemIndex={index}             // Index of the item within the visibleItems array
                    />
                ))}
            </ol>
        );
    }

    return (
        <ul style={{ paddingLeft: '20px', marginBlockStart: '1em', marginBlockEnd: '1em' }}>
            {visibleItems.map((item, index) => (
                <ListItemElementComponent
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