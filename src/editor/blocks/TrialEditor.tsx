// src/editor/blocks/TrialEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { TrialBlock, ListItemElement, TrackedResource, AcquiredItemFlag } from '../../types';

interface TrialEditorProps {
    block: TrialBlock;
    path: (string | number)[];
}

export const TrialEditor: React.FC<TrialEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const addStep = () => {
        const newStep: ListItemElement = {
            type: 'listItem',
            content: [{ type: 'plainText', text: 'New trial step' }]
        };
        const newSteps = [...block.steps, newStep];
        const newBlock = { ...block, steps: newSteps };
        updateNode(path, newBlock);
    };

    const removeStep = (index: number) => {
        const newSteps = block.steps.filter((_, i) => i !== index);
        const newBlock = { ...block, steps: newSteps };
        updateNode(path, newBlock);
    };

    const addTrackedResource = () => {
        const newResource: TrackedResource = {
            name: 'PowerSphere',
            quantity: 1,
            updateType: 'auto_guaranteed',
            id: `resource_${Date.now()}`
        };
        const newResources = block.trackedResourceUpdates ? [...block.trackedResourceUpdates, newResource] : [newResource];
        const newBlock = { ...block, trackedResourceUpdates: newResources };
        updateNode(path, newBlock);
    };

    const updateTrackedResource = (index: number, updatedResource: TrackedResource) => {
        if (!block.trackedResourceUpdates) return;
        const newResources = [...block.trackedResourceUpdates];
        newResources[index] = updatedResource;
        const newBlock = { ...block, trackedResourceUpdates: newResources };
        updateNode(path, newBlock);
    };

    const removeTrackedResource = (index: number) => {
        if (!block.trackedResourceUpdates) return;
        const newResources = block.trackedResourceUpdates.filter((_, i) => i !== index);
        const newBlock = { ...block, trackedResourceUpdates: newResources.length > 0 ? newResources : undefined };
        updateNode(path, newBlock);
    };

    const addItemFlag = () => {
        const newFlag: AcquiredItemFlag = {
            itemName: 'ZombieStrikeWeapon',
            setType: 'user_prompt_after_event',
            sourceDescription: 'Trial completion flag',
            id: `flag_${Date.now()}`
        };
        const newFlags = block.itemAcquisitionFlags ? [...block.itemAcquisitionFlags, newFlag] : [newFlag];
        const newBlock = { ...block, itemAcquisitionFlags: newFlags };
        updateNode(path, newBlock);
    };

    const updateItemFlag = (index: number, updatedFlag: AcquiredItemFlag) => {
        if (!block.itemAcquisitionFlags) return;
        const newFlags = [...block.itemAcquisitionFlags];
        newFlags[index] = updatedFlag;
        const newBlock = { ...block, itemAcquisitionFlags: newFlags };
        updateNode(path, newBlock);
    };

    const removeItemFlag = (index: number) => {
        if (!block.itemAcquisitionFlags) return;
        const newFlags = block.itemAcquisitionFlags.filter((_, i) => i !== index);
        const newBlock = { ...block, itemAcquisitionFlags: newFlags.length > 0 ? newFlags : undefined };
        updateNode(path, newBlock);
    };

    const containerStyle: React.CSSProperties = {
        border: '2px solid #fb7185',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#fff1f2'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #ccc'
    };

    const labelStyle: React.CSSProperties = {
        color: '#e11d48',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const buttonStyle: React.CSSProperties = {
        padding: '4px 8px',
        margin: '0 2px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px'
    };

    const sectionStyle: React.CSSProperties = {
        margin: '12px 0',
        padding: '8px',
        border: '1px dashed #fb7185',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    🏛️ Trial
                </span>
                <div>
                    <button
                        style={buttonStyle}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '▼ Collapse' : '▶ Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Steps:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addStep}
                                title="Add step"
                            >
                                + Step
                            </button>
                        </div>

                        {block.steps.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No steps - click "+ Step" to add trial steps
                            </em>
                        ) : (
                            <ol style={{ paddingLeft: '20px', margin: 0 }}>
                                {block.steps.map((step, index) => (
                                    <li key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                        <div style={{ 
                                            position: 'relative',
                                            border: '1px solid #fecaca',
                                            borderRadius: '4px',
                                            backgroundColor: '#fafafa',
                                            paddingRight: '40px'
                                        }}>
                                            <button
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '3px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => removeStep(index)}
                                                title="Remove step"
                                            >
                                                ×
                                            </button>
                                            <NodeRenderer
                                                node={step}
                                                path={[...path, 'steps', index]}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Tracked Resources:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addTrackedResource}
                                title="Add tracked resource"
                            >
                                + Resource
                            </button>
                        </div>

                        {!block.trackedResourceUpdates || block.trackedResourceUpdates.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No tracked resources - click "+ Resource" to add resources
                            </em>
                        ) : (
                            block.trackedResourceUpdates.map((resource, index) => (
                                <div key={index} style={{ 
                                    position: 'relative', 
                                    margin: '8px 0',
                                    padding: '8px',
                                    border: '1px solid #fecaca',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa',
                                    paddingRight: '40px'
                                }}>
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '3px',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => removeTrackedResource(index)}
                                        title="Remove resource"
                                    >
                                        ×
                                    </button>
                                    <div>
                                        <strong>{resource.name}</strong> - {resource.updateType} {resource.quantity}
                                        {resource.description && <div style={{ fontSize: '12px', color: '#666' }}>{resource.description}</div>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Item Acquisition Flags:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addItemFlag}
                                title="Add item flag"
                            >
                                + Flag
                            </button>
                        </div>

                        {!block.itemAcquisitionFlags || block.itemAcquisitionFlags.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No item flags - click "+ Flag" to add flags
                            </em>
                        ) : (
                            block.itemAcquisitionFlags.map((flag, index) => (
                                <div key={index} style={{ 
                                    position: 'relative', 
                                    margin: '8px 0',
                                    padding: '8px',
                                    border: '1px solid #fecaca',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa',
                                    paddingRight: '40px'
                                }}>
                                    <button
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '3px',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#f44336',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => removeItemFlag(index)}
                                        title="Remove flag"
                                    >
                                        ×
                                    </button>
                                    <div>
                                        <strong>{flag.itemName}</strong> - {flag.setType}
                                        <div style={{ fontSize: '12px', color: '#666' }}>{flag.sourceDescription}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
