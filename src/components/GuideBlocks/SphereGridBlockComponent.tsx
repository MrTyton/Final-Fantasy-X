// src/components/GuideBlocks/SphereGridBlockComponent.tsx
import React from 'react';
import type {
    SphereGridBlock as SphereGridBlockType,
    SphereGridCharacterActions,
    ConditionalBlock as ConditionalBlockType, // Used for conditional branching within the Sphere Grid block
    ImageBlock as ImageBlockType,             // Used for rendering images within the Sphere Grid block
    ListItemElement as ListItemElementType    // Used for rendering list items within the Sphere Grid block
} from '../../types';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // Used for rendering nested content blocks
import SphereGridCharacterActionsComponent from './SphereGridCharacterActionsComponent'; // Renders character-specific Sphere Grid actions

// Props for the SphereGridBlockComponent, including the block data and a parent scope key for context
interface SphereGridBlockProps {
    blockData: SphereGridBlockType; // The Sphere Grid block data, including all content items (actions, images, conditionals, etc.)
    parentScopeKey: string;         // Unique string for generating keys and context for nested lists/blocks
}

// Main component for rendering a "Sphere Grid" block, including character actions, images, and conditional logic
const SphereGridBlockComponent: React.FC<SphereGridBlockProps> = ({ blockData, parentScopeKey }) => {
    // Style for the outer Sphere Grid block container, visually distinguishing Sphere Grid sections
    const blockStyle: React.CSSProperties = {
        border: '1px solid #b3e5fc', // Light blue border for Sphere Grid context
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e1f5fe', // Very light blue background
    };
    // Style for the block header, showing the section title
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#03a9f4', // Light blue header for emphasis
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

    // Render the Sphere Grid block, including header and all content items (character actions, images, conditionals, etc.)
    return (
        <div style={blockStyle}>
            {/* Header displays the section title for Sphere Grid */}
            <div style={headerStyle}>SPHERE GRID</div>
            <div style={contentStyle}>
                {/* Iterate over each item in the SphereGridBlock's content array. Items can be character actions, conditionals, images, or list items. */}
                {blockData.content.map((item, index) => {
                    // Generate a unique scope key for each item, supporting nested lists or conditionals
                    const itemScopeKey = `${parentScopeKey}_sgitem${index}`;
                    switch (item.type) {
                        case 'sphereGridCharacterActions':
                            // Render a character's Sphere Grid actions using the dedicated component
                            return (
                                <SphereGridCharacterActionsComponent
                                    key={index}
                                    actionsData={item as SphereGridCharacterActions}
                                    parentScopeKey={itemScopeKey}
                                />
                            );
                        case 'conditional':
                            // Render a conditional block using ContentRenderer (for branching logic)
                            return (
                                <ContentRenderer
                                    key={index}
                                    contentItems={[item as ConditionalBlockType]}
                                    currentScopeKey={itemScopeKey}
                                />
                            );
                        case 'image':
                            // Render a standalone image within the Sphere Grid block using ContentRenderer
                            return (
                                <ContentRenderer
                                    key={index}
                                    contentItems={[item as ImageBlockType]}
                                    currentScopeKey={itemScopeKey}
                                />
                            );
                        case 'listItem':
                            // Render a standalone list item within the Sphere Grid block (rare)
                            // This could be improved by wrapping in a <ul> or using ListItemElementComponent directly
                            return (
                                <div key={index} style={{ border: '1px dashed orange', padding: '5px' }}>
                                    [Direct ListItem in SphereGridBlock - Needs specific handling or wrapping] -
                                    {(item as ListItemElementType).content.map(c => (c as any).text || (c as any).type).join(' ')}
                                </div>
                            );
                        default:
                            // Fallback for unknown or unsupported content item types; ensures exhaustive type checking
                            const _exhaustiveCheck: never = item;
                            console.warn("SphereGridBlock: Unknown content item type", _exhaustiveCheck);
                            return <div key={index} style={{ color: 'red' }}>Unknown Sphere Grid content type: {(item as any).type}</div>;
                    }
                })}
            </div>
        </div>
    );
};

export default SphereGridBlockComponent;