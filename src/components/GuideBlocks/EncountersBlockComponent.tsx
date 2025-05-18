// src/components/GuideBlocks/EncountersBlockComponent.tsx
import React from 'react';
import type { EncountersBlock as EncountersBlockType, ListItemElement, ConditionalBlock, ChapterContent } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For ConditionalBlock items

// Placeholders for block-level prompts (can be replaced with actual prompt components later)
const BlockLevelResourcePrompt: React.FC<{ update: any }> = ({ update }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed #FF9800', fontSize: '0.9em', backgroundColor: '#FFF3E0' }}>
        [BLock-Level User Prompt for Resource: {update.name}, Qty: {update.quantity}, Type: {update.updateType}]
    </div>
);
const BlockLevelFlagPrompt: React.FC<{ flag: any }> = ({ flag }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed #FF9800', fontSize: '0.9em', backgroundColor: '#FFF3E0' }}>
        [Block-Level User Prompt for Flag: {flag.itemName}, SetType: {flag.setType}]
    </div>
);

interface EncountersBlockProps {
    blockData: EncountersBlockType;
    parentScopeKey: string;
}

const EncountersBlockComponent: React.FC<EncountersBlockProps> = ({ blockData, parentScopeKey }) => {
    const blockStyle: React.CSSProperties = {
        border: '1px solid #ffcc80', // Light orange border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#fff8e1', // Very light orange/yellow background
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#ff9800', // Example color (Orange) - Color H
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
            <div style={headerStyle}>ENCOUNTERS</div>
            <div style={contentStyle}>
                {blockData.content.length > 0 ? (
                    // This <ul> is for the top-level items of the EncountersBlock content.
                    <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
                        {blockData.content.map((item, index) => {
                            const itemScopeKey = `${parentScopeKey}_encounteritem${index}`;
                            if (item.type === 'listItem') {
                                // ListItemElementComponent renders its own <li>
                                return (
                                    <ListItemElementComponent
                                        key={`encitem-${index}`} // Key is on the component that renders the <li>
                                        itemData={item as ListItemElement}
                                        parentScopeKey={itemScopeKey}
                                        itemIndex={index}
                                    />
                                );
                            } else if (item.type === 'conditional') {
                                // ConditionalBlock (via ContentRenderer) renders its own root (usually a <div>)
                                // It should NOT be wrapped in an <li> by EncountersBlockComponent
                                return (
                                    <ContentRenderer // Render directly, not inside an <li> from this map
                                        key={`enccond-${index}`}
                                        contentItems={[item as ConditionalBlock]}
                                        currentScopeKey={itemScopeKey}
                                    />
                                );
                            } else {
                                // Fallback for other ChapterContent types if they could appear here
                                // (though EncountersBlock.content is (ListItemElement | ConditionalBlock)[])
                                // This also should not be wrapped in an <li> by this map
                                return (
                                    <ContentRenderer
                                        key={`enc-other-${index}`}
                                        contentItems={[item as ChapterContent]}
                                        currentScopeKey={itemScopeKey}
                                    />
                                );
                            }
                        })}
                    </ul>
                ) : (
                    <p style={{ fontStyle: 'italic' }}>No specific encounter strategies defined.</p>
                )}

                {/* Render BLOCK-LEVEL Tracked Resource Updates (Prompts) */}
                {blockData.trackedResourceUpdates && blockData.trackedResourceUpdates.length > 0 && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffcc80' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Area Resource Notes:</p>
                        {blockData.trackedResourceUpdates.map((update, index) => (
                            <BlockLevelResourcePrompt key={`bl_res-${index}`} update={update} />
                        ))}
                    </div>
                )}

                {/* Render BLOCK-LEVEL Item Acquisition Flags (Prompts) */}
                {blockData.itemAcquisitionFlags && blockData.itemAcquisitionFlags.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ffcc80' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Area Item Notes:</p>
                        {blockData.itemAcquisitionFlags.map((flag, index) => (
                            <BlockLevelFlagPrompt key={`bl_flag-${index}`} flag={flag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncountersBlockComponent;