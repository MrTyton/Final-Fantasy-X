// src/components/GuideBlocks/EquipBlockComponent.tsx
import React from 'react';
import type { EquipBlock as EquipBlockType, ListItemElement, ConditionalBlock, ChapterContent } from '../../types'; // Assuming all types are in types.ts
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For handling nested ConditionalBlocks or other ChapterContent

interface EquipBlockProps {
    blockData: EquipBlockType;
    // We need to pass down the currentScopeKey for any lists inside conditionals etc.
    // This scopeKey is for list numbering if this block itself contains lists,
    // or if its children (like ConditionalBlock) contain lists.
    parentScopeKey: string;
}

const EquipBlockComponent: React.FC<EquipBlockProps> = ({ blockData, parentScopeKey }) => {
    // Define a base style for the block, can be moved to CSS
    const blockStyle: React.CSSProperties = {
        border: '1px solid #e0e0e0', // Light border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#f9f9f9', // Light background for the block
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#607d8b', // Example color (Greyish Blue) - Color F
        color: 'white',
        padding: '8px 15px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
    };

    const contentStyle: React.CSSProperties = {
        padding: '15px',
    };

    return (
        <div style={blockStyle}>
            <div style={headerStyle}>EQUIPMENT</div>
            <div style={contentStyle}>
                {/* 
          The content of an EquipBlock is (ListItemElement | ConditionalBlock)[].
          ListItemElementComponent can handle ListItemElement.
          ConditionalBlock will be handled by ContentRenderer (using its placeholder for now).
        */}
                {blockData.content.map((item, index) => {
                    const itemScopeKey = `${parentScopeKey}_equipitem${index}`; // Scope key for potential lists within this item

                    if (item.type === 'listItem') {
                        // Cast to ListItemElement if necessary, though TypeScript should infer
                        return (
                            <ul key={index} style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}> {/* Outer ul for consistent list appearance */}
                                <ListItemElementComponent
                                    itemData={item as ListItemElement}
                                    parentScopeKey={itemScopeKey} // Pass down scope for potential nested lists in the LI
                                    itemIndex={0} // This item is the 0th (only) in this temp ul for styling
                                />
                            </ul>
                        );
                    } else if (item.type === 'conditional') {
                        // ConditionalBlock placeholder will be used by ContentRenderer
                        return (
                            <ContentRenderer
                                key={index}
                                contentItems={[item as ConditionalBlock]} // Pass as array
                                currentScopeKey={itemScopeKey}
                            />
                        );
                    } else {
                        // Should not happen based on EquipBlockType definition, but good to have a fallback
                        console.warn("Unexpected item type in EquipBlock:", item);
                        return <div key={index} style={{ color: 'red' }}>Unknown equip item type</div>;
                    }
                })}
            </div>
        </div>
    );
};

export default EquipBlockComponent;