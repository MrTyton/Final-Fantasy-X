// src/components/GuideBlocks/BlitzballGameBlockComponent.tsx
// BlitzballGameBlockComponent renders a visually distinct block for Blitzball game strategy sections in the walkthrough.
// It displays a styled container with a header and a list of strategy steps, each of which may be a nested list or contain further detail.
// ListItemElementComponent is used to render each strategy item, supporting hierarchical/nested content.

import React from 'react';
import type { BlitzballGameBlock as BlitzballGameBlockType } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';

// Props for the BlitzballGameBlockComponent, including the block data and a parent scope key for context
interface BlitzballGameBlockProps {
    blockData: BlitzballGameBlockType; // The Blitzball game strategy block to render, including all strategy steps/items
    parentScopeKey: string; // Unique string for generating keys and context for nested lists
}

// Main component for rendering a Blitzball strategy block, including header and strategy steps
const BlitzballGameBlockComponent: React.FC<BlitzballGameBlockProps> = ({ blockData, parentScopeKey }) => {
    // Style for the outer block container, visually distinguishing Blitzball sections from other guide blocks
    const blockStyle: React.CSSProperties = {
        border: '1px solid #90caf9', // Light blue border for Blitzball context
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e3f2fd', // Very light blue background
    };
    // Style for the block header, using a strong blue for emphasis
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#2196f3', // Deep blue header for Blitzball
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
    // Generate a unique scope key for this block's strategy list, supporting nested/hierarchical lists
    const listScopeKeyForStrategy = `${parentScopeKey}_blitzballstrategy`;

    // Render the Blitzball strategy block, including header and strategy steps
    return (
        <div style={blockStyle}>
            {/* Header displays the section title for Blitzball */}
            <div style={headerStyle}>BLITZBALL</div>
            <div style={contentStyle}>
                {/* Render a bulleted list of strategy steps if present. Each item may itself be a nested list or contain further structure. */}
                {blockData.strategy.length > 0 ? (
                    <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
                        {blockData.strategy.map((item, index) => (
                            <ListItemElementComponent
                                key={`blitz-item-${index}`}
                                itemData={item}
                                parentScopeKey={listScopeKeyForStrategy}
                                itemIndex={index}
                            />
                        ))}
                    </ul>
                ) : (
                    // Fallback if no strategy steps are defined for this Blitzball section
                    <p style={{ fontStyle: 'italic' }}>No Blitzball strategy defined.</p>
                )}
                {/*
                  Note: Setting of the BlitzballGameWon_Luca flag is handled by a separate AcquiredItemFlag prompt
                  that should follow this block in the JSON structure, not directly within this component.
                */}
            </div>
        </div>
    );
};

export default BlitzballGameBlockComponent;