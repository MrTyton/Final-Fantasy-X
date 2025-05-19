// src/components/GuideBlocks/TrialBlockComponent.tsx
import React from 'react';
import type { TrialBlock as TrialBlockType } from '../../types';
import ListItemElementComponent from './ListItemElementComponent';

// ResourceUpdatePrompt displays a prompt for resource updates (e.g., items gained/lost, currency changes) at the end of the trial block.
const ResourceUpdatePrompt: React.FC<{ update: any }> = ({ update }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed green', fontSize: '0.9em' }}>
        [User Prompt for Resource: {update.name}, Qty: {update.quantity}, Type: {update.updateType}]
    </div>
);

// FlagPrompt displays a prompt for flag updates (e.g., item acquisition, event triggers) at the end of the trial block.
const FlagPrompt: React.FC<{ flag: any }> = ({ flag }) => (
    <div style={{ marginTop: '5px', padding: '5px', border: '1px dashed orange', fontSize: '0.9em' }}>
        [User Prompt for Flag: {flag.itemName}, SetType: {flag.setType}]
    </div>
);

// Props for the TrialBlockComponent, including the block data and a parent scope key for list context
interface TrialBlockProps {
    blockData: TrialBlockType; // The trial block data, including steps, tracked resource updates, and item acquisition flags
    parentScopeKey: string;    // Used for hierarchical list numbering or context
}

// Main component for rendering a "Cloister of Trials" block, including steps and tracked updates
const TrialBlockComponent: React.FC<TrialBlockProps> = ({ blockData, parentScopeKey }) => {
    // Styling for the outer block container, visually distinguishes the trial section from others
    const blockStyle: React.CSSProperties = {
        border: '1px solid #d1c4e9', // Lighter purple border for visual grouping
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#f3e5f5', // Very light purple background for distinction
    };
    // Styling for the block header, displays the section title
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#673ab7', // Deep purple header for emphasis
        color: 'white',
        padding: '8px 15px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
    };
    // Styling for the content area inside the block
    const contentStyle: React.CSSProperties = {
        padding: '15px',
    };
    // Generate a unique scope key for the steps list to support nested or hierarchical lists
    const listScopeKeyForSteps = `${parentScopeKey}_trialsteps`;

    // Render the trial block, including header, ordered steps, and tracked updates
    return (
        <div style={blockStyle}>
            {/* Header displays the section title for Cloister of Trials */}
            <div style={headerStyle}>CLOISTER OF TRIALS</div>
            <div style={contentStyle}>
                {/* Render the ordered list of steps if present, otherwise show a fallback message */}
                {blockData.steps.length > 0 ? (
                    <ol style={{ paddingLeft: '20px', margin: 0 }}>
                        {blockData.steps.map((step, index) => (
                            <ListItemElementComponent
                                key={`trial-step-${index}`}
                                itemData={step}
                                parentScopeKey={listScopeKeyForSteps}
                                itemIndex={index}
                            />
                        ))}
                    </ol>
                ) : (
                    // Fallback if no steps are defined for this trial
                    <p>No steps defined for this trial.</p>
                )}

                {/* Render prompts for tracked resource updates, if any exist */}
                {blockData.trackedResourceUpdates && blockData.trackedResourceUpdates.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
                        {blockData.trackedResourceUpdates.map((update, index) => (
                            <ResourceUpdatePrompt key={`res-${index}`} update={update} />
                        ))}
                    </div>
                )}

                {/* Render prompts for item acquisition flags, if any exist */}
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