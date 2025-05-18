// src/components/GuideBlocks/BlitzballGameBlockComponent.tsx
import React from 'react';
import type { BlitzballGameBlock as BlitzballGameBlockType, ListItemElement } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
// No direct conditionals within BlitzballGameBlock itself, but ListItemElements might contain them.

interface BlitzballGameBlockProps {
    blockData: BlitzballGameBlockType;
    parentScopeKey: string; // For list numbering context if strategy items form lists
}

const BlitzballGameBlockComponent: React.FC<BlitzballGameBlockProps> = ({ blockData, parentScopeKey }) => {
    const blockStyle: React.CSSProperties = {
        border: '1px solid #90caf9', // Light blue border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e3f2fd', // Very light blue background
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#2196f3', // Example color (Blue) - Color G
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

    // The strategy items often have a natural order and hierarchy
    // (e.g., "First Half", "Second Half" as list items containing further nested items).
    // ListItemElementComponent will handle rendering the content of each.
    const listScopeKeyForStrategy = `${parentScopeKey}_blitzballstrategy`;

    return (
        <div style={blockStyle}>
            <div style={headerStyle}>BLITZBALL</div>
            <div style={contentStyle}>
                {blockData.strategy.length > 0 ? (
                    // Using a <ul> here; if the strategy items themselves are InstructionListBlocks,
                    // they will render their own <ol> or <ul>.
                    // If strategy items are just plain text describing steps, this <ul> gives bullets.
                    <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
                        {blockData.strategy.map((item, index) => (
                            <ListItemElementComponent
                                key={`blitz-item-${index}`}
                                itemData={item}
                                parentScopeKey={listScopeKeyForStrategy} // For potential nested lists within items
                                itemIndex={index}
                            />
                        ))}
                    </ul>
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No Blitzball strategy defined.</p>
                )}
                {/* 
          Note: The setting of the BlitzballGameWon_Luca flag is handled by a separate
          AcquiredItemFlag prompt that should follow this block in the JSON structure,
          not directly within this component based on current types.ts.
        */}
            </div>
        </div>
    );
};

export default BlitzballGameBlockComponent;