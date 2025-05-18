// src/components/GuideBlocks/ShopBlockComponent.tsx
import React from 'react';
import type { ShopBlock as ShopBlockType, ShopSection, ListItemElement, ConditionalBlock } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For ConditionalBlock items

interface ShopBlockProps {
    blockData: ShopBlockType;
    parentScopeKey: string; // For list numbering context if any items are lists or contain lists
}

const ShopBlockComponent: React.FC<ShopBlockProps> = ({ blockData, parentScopeKey }) => {
    const blockStyle: React.CSSProperties = {
        border: '1px solid #c8e6c9', // Light green border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e8f5e9', // Very light green background
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#4caf50', // Example color (Green) - Color D
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

    const sectionHeaderStyle: React.CSSProperties = {
        marginTop: '15px',
        marginBottom: '8px',
        fontSize: '1.05em',
        fontWeight: 'bold',
        borderBottom: '1px solid #a5d6a7', // Lighter green accent
        paddingBottom: '5px',
    };

    // First section should not have top margin
    const firstSectionHeaderStyle: React.CSSProperties = {
        ...sectionHeaderStyle,
        marginTop: '0',
    };

    return (
        <div style={blockStyle}>
            <div style={headerStyle}>SHOP - {blockData.gilInfo}</div>
            <div style={contentStyle}>
                {blockData.sections.map((section, sectionIndex) => {
                    // Create a scope key for items within this section
                    const sectionScopeKey = `${parentScopeKey}_shopsection${sectionIndex}`;
                    return (
                        <div key={section.title + sectionIndex}>
                            <h3 style={sectionIndex === 0 ? firstSectionHeaderStyle : sectionHeaderStyle}>
                                {section.title}
                            </h3>
                            {section.items.length > 0 ? (
                                <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
                                    {section.items.map((item, itemIndex) => {
                                        const itemScopeKey = `${sectionScopeKey}_item${itemIndex}`;
                                        if (item.type === 'listItem') {
                                            return (
                                                <ListItemElementComponent
                                                    key={`shopitem-${itemIndex}`}
                                                    itemData={item as ListItemElement}
                                                    parentScopeKey={itemScopeKey} // For potential nested lists in LI
                                                    itemIndex={itemIndex} // Index within this section's items
                                                />
                                            );
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
                                        } else {
                                            // Fallback for unexpected item types
                                            return <li key={`unk-${itemIndex}`} style={{ color: 'red' }}>Unknown shop item type</li>;
                                        }
                                    })}
                                </ul>
                            ) : (
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