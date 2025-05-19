// src/components/GuideBlocks/EquipBlockComponent.tsx
import React from 'react';
import type { EquipBlock as EquipBlockType, ListItemElement, ConditionalBlock } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';

// Props for the EquipBlockComponent, including the block data and a parent scope key for context
interface EquipBlockProps {
    blockData: EquipBlockType; // The equipment block data, including all equipment items and conditionals
    parentScopeKey: string;    // Unique string for generating keys and context for nested lists/conditionals
}

// Main component for rendering an "Equipment" block, including a list of equipment items and conditional branches
const EquipBlockComponent: React.FC<EquipBlockProps> = ({ blockData, parentScopeKey }) => {
    // Style for the outer equipment block container, visually distinguishing equipment sections
    const blockStyle: React.CSSProperties = {
        border: '1px solid #e0e0e0', // Light gray border for equipment context
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#f9f9f9', // Very light gray background
    };
    // Style for the block header, showing the section title
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#607d8b', // Blue-gray header for emphasis
        color: 'white',
        padding: '8px 15px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
    };
    // Style for the content area inside the block
    const contentStyle: React.CSSProperties = {
        padding: '15px',
    };

    // Render the equipment block, including header and all equipment items/conditionals
    return (
        <div style={blockStyle}>
            {/* Header displays the section title for Equipment */}
            <div style={headerStyle}>EQUIPMENT</div>
            <div style={contentStyle}>
                {/* Iterate over each item in the EquipBlock's content array. Items can be list items or conditional blocks. */}
                {blockData.content.map((item, index) => {
                    // Generate a unique scope key for each item, supporting nested lists or conditionals
                    const itemScopeKey = `${parentScopeKey}_equipitem${index}`;

                    // Render a single equipment item as a list item if type is 'listItem'
                    if (item.type === 'listItem') {
                        return (
                            <ul key={index} style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}>
                                <ListItemElementComponent
                                    itemData={item as ListItemElement}
                                    parentScopeKey={itemScopeKey}
                                    itemIndex={0}
                                />
                            </ul>
                        );
                        // Render a conditional block using ContentRenderer if type is 'conditional'
                    } else if (item.type === 'conditional') {
                        return (
                            <ContentRenderer
                                key={index}
                                contentItems={[item as ConditionalBlock]}
                                currentScopeKey={itemScopeKey}
                            />
                        );
                        // Fallback for unexpected item types (should not occur with valid EquipBlockType)
                    } else {
                        console.warn("Unexpected item type in EquipBlock:", item);
                        return <div key={index} style={{ color: 'red' }}>Unknown equip item type</div>;
                    }
                })}
            </div>
        </div>
    );
};

export default EquipBlockComponent;