// src/components/GuideBlocks/TrialBlockComponent.tsx
import React from 'react';
import type { TrialBlock as TrialBlockType, ListItemElement } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';
// We'll need components for prompts if this block has resource/flag updates
// For now, let's add placeholders for where they would go.

// Placeholder for resource/flag prompts (can be refined later)
const ResourceUpdatePrompt: React.FC<{ update: any }> = ({ update }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed green', fontSize: '0.9em' }}>
        [User Prompt for Resource: {update.name}, Qty: {update.quantity}, Type: {update.updateType}]
    </div>
);
const FlagPrompt: React.FC<{ flag: any }> = ({ flag }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed orange', fontSize: '0.9em' }}>
        [User Prompt for Flag: {flag.itemName}, SetType: {flag.setType}]
    </div>
);


interface TrialBlockProps {
    blockData: TrialBlockType;
    parentScopeKey: string; // For list numbering context if steps form a list that needs scoping
}

const TrialBlockComponent: React.FC<TrialBlockProps> = ({ blockData, parentScopeKey }) => {
    const blockStyle: React.CSSProperties = {
        border: '1px solid #d1c4e9', // Lighter purple border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#f3e5f5', // Very light purple background
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#673ab7', // Example color (Deep Purple) - Color E
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

    // The steps in a TrialBlock are an array of ListItemElements.
    // They often represent an ordered sequence.
    // We'll render them as an <ol> list.
    // Each ListItemElementComponent will handle its own content rendering.
    const listScopeKeyForSteps = `${parentScopeKey}_trialsteps`;

    return (
        <div style={blockStyle}>
            <div style={headerStyle}>CLOISTER OF TRIALS</div>
            <div style={contentStyle}>
                {blockData.steps.length > 0 ? (
                    <ol style={{ paddingLeft: '20px', margin: 0 }}> {/* Basic ordered list styling */}
                        {blockData.steps.map((step, index) => (
                            <ListItemElementComponent
                                key={`trial-step-${index}`}
                                itemData={step}
                                // The parentScopeKey for items within this list is the list's own scope key
                                parentScopeKey={listScopeKeyForSteps}
                                itemIndex={index}
                            />
                        ))}
                    </ol>
                ) : (
                    <p>No steps defined for this trial.</p>
                )}

                {/* Render Tracked Resource Updates (Prompts) */}
                {blockData.trackedResourceUpdates && blockData.trackedResourceUpdates.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
                        {blockData.trackedResourceUpdates.map((update, index) => (
                            <ResourceUpdatePrompt key={`res-${index}`} update={update} />
                        ))}
                    </div>
                )}

                {/* Render Item Acquisition Flags (Prompts) */}
                {blockData.itemAcquisitionFlags && blockData.itemAcquisitionFlags.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
                        {blockData.itemAcquisitionFlags.map((flag, index) => (
                            <FlagPrompt key={`flag-${index}`} flag={flag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrialBlockComponent;