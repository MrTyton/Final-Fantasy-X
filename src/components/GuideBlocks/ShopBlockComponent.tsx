// src/components/GuideBlocks/ShopBlockComponent.tsx
import React from 'react';
import type { ShopBlock as ShopBlockType, ListItemElement, ConditionalBlock } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';

// Props for the ShopBlockComponent, including the block data and a parent scope key for context
interface ShopBlockProps {
    blockData: ShopBlockType; // The shop block data, including all shop sections and items
    parentScopeKey: string;   // Unique string for generating keys and context for nested lists/sections
}

// Main component for rendering a "Shop" block, including all shop sections, items, and conditional logic
const ShopBlockComponent: React.FC<ShopBlockProps> = ({ blockData, parentScopeKey }) => {
    // Style for the outer shop block container, visually distinguishing shop sections
    const blockStyle: React.CSSProperties = {
        border: '1px solid #c8e6c9', // Light green border for shop context
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e8f5e9', // Very light green background
    };
    // Style for the block header, showing the section title and gil info
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#4caf50', // Deep green header for emphasis
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
    // Style for section headers within the shop block
    const sectionHeaderStyle: React.CSSProperties = {
        marginTop: '15px',
        marginBottom: '8px',
        fontSize: '1.05em',
        fontWeight: 'bold',
        borderBottom: '1px solid #a5d6a7', // Lighter green accent
        paddingBottom: '5px',
    };
    // Style for the first section header (no top margin)
    const firstSectionHeaderStyle: React.CSSProperties = {
        ...sectionHeaderStyle,
        marginTop: '0',
    };

    // Render the shop block, including all sections and their items
    return (
        <div style={blockStyle}>
            {/* Header displays the section title for Shop and gil info */}
            <div style={headerStyle}>SHOP - {blockData.gilInfo}</div>
            <div style={contentStyle}>
                {/* Iterate over each shop section and render its items */}
                {blockData.sections.map((section, sectionIndex) => {
                    // Create a scope key for items within this section for unique context and React keys
                    const sectionScopeKey = `${parentScopeKey}_shopsection${sectionIndex}`;
                    return (
                        <div key={section.title + sectionIndex}>
                            {/* Section header, styled differently for the first section */}
                            <h3 style={sectionIndex === 0 ? firstSectionHeaderStyle : sectionHeaderStyle}>
                                {section.title}
                            </h3>
                            {/* Render the list of items in this shop section, or a fallback if empty */}
                            {section.items.length > 0 ? (
                                <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
                                    {section.items.map((item, itemIndex) => {
                                        // Generate a unique scope key for each item in the section
                                        const itemScopeKey = `${sectionScopeKey}_item${itemIndex}`;
                                        // Render a shop item as a list item if type is 'listItem'
                                        if (item.type === 'listItem') {
                                            return (
                                                <ListItemElementComponent
                                                    key={`shopitem-${itemIndex}`}
                                                    itemData={item as ListItemElement}
                                                    parentScopeKey={itemScopeKey} // For potential nested lists in LI
                                                    itemIndex={itemIndex} // Index within this section's items
                                                />
                                            );
                                            // Render a conditional block using ContentRenderer if type is 'conditional'
                                        } else if (item.type === 'conditional') {
                                            // ConditionalBlock items are rendered via ContentRenderer
                                            return (
                                                <li key={`shopcond-${itemIndex}`} style={{ listStyle: 'none', marginLeft: '-20px' /* Offset default li style if parent is ul */ }}>
                                                    <ContentRenderer
                                                        contentItems={[item as ConditionalBlock]} // Pass as array
                                                        currentScopeKey={itemScopeKey}
                                                    />
                                                </li>
                                            );
                                            // Fallback for unexpected item types (should not occur with valid ShopBlockType)
                                        } else {
                                            return <li key={`unk-${itemIndex}`} style={{ color: 'red' }}>Unknown shop item type</li>;
                                        }
                                    })}
                                </ul>
                            ) : (
                                // Fallback if no items are present in this section
                                <p style={{ fontStyle: 'italic', marginLeft: '20px' }}>No items in this section.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShopBlockComponent;