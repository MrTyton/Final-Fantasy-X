// src/editor/blocks/SphereGridCharacterActionsEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { SphereGridCharacterActions, ListItemElement, ImageBlock, TrackedResource } from '../../types';

interface SphereGridCharacterActionsEditorProps {
    block: SphereGridCharacterActions;
    path: (string | number)[];
}

export const SphereGridCharacterActionsEditor: React.FC<SphereGridCharacterActionsEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const updateCharacter = (newCharacter: string) => {
        const newBlock = { ...block, character: newCharacter };
        updateNode(path, newBlock);
    };

    const updateSlvlInfo = (newSlvlInfo: string) => {
        const newBlock = { ...block, slvlInfo: newSlvlInfo || undefined };
        updateNode(path, newBlock);
    };

    const addAction = () => {
        const newAction: ListItemElement = {
            type: 'listItem',
            content: [{ type: 'plainText', text: 'New action' }]
        };
        const newActions = [...block.actions, newAction];
        const newBlock = { ...block, actions: newActions };
        updateNode(path, newBlock);
    };

    const removeAction = (index: number) => {
        const newActions = block.actions.filter((_, i) => i !== index);
        const newBlock = { ...block, actions: newActions };
        updateNode(path, newBlock);
    };

    const addImage = () => {
        const newImage: ImageBlock = {
            type: 'image',
            path: ''
        };
        const newImages = block.associatedImages ? [...block.associatedImages, newImage] : [newImage];
        const newBlock = { ...block, associatedImages: newImages };
        updateNode(path, newBlock);
    };

    const removeImage = (index: number) => {
        if (!block.associatedImages) return;
        const newImages = block.associatedImages.filter((_, i) => i !== index);
        const newBlock = { ...block, associatedImages: newImages.length > 0 ? newImages : undefined };
        updateNode(path, newBlock);
    };

    const addTrackedResource = () => {
        const newResource: TrackedResource = {
            name: 'PowerSphere',
            quantity: 1,
            updateType: 'consumption_implicit_grid',
            id: `resource_${Date.now()}`
        };
        const newResources = block.trackedResourceUpdates ? [...block.trackedResourceUpdates, newResource] : [newResource];
        const newBlock = { ...block, trackedResourceUpdates: newResources };
        updateNode(path, newBlock);
    };

    const removeTrackedResource = (index: number) => {
        if (!block.trackedResourceUpdates) return;
        const newResources = block.trackedResourceUpdates.filter((_, i) => i !== index);
        const newBlock = { ...block, trackedResourceUpdates: newResources.length > 0 ? newResources : undefined };
        updateNode(path, newBlock);
    };

    const containerStyle: React.CSSProperties = {
        border: '2px solid #8b5cf6',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#faf5ff'
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
        color: '#7c3aed',
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

    const inputStyle: React.CSSProperties = {
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        margin: '0 4px',
        fontSize: '12px',
        width: '120px'
    };

    const sectionStyle: React.CSSProperties = {
        margin: '12px 0',
        padding: '8px',
        border: '1px dashed #8b5cf6',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    👤 Character Actions: {block.character}
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
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                        <label>
                            <strong>Character:</strong>
                            <input
                                type="text"
                                value={block.character}
                                onChange={(e) => updateCharacter(e.target.value)}
                                style={inputStyle}
                                placeholder="Character name"
                            />
                        </label>

                        <label>
                            <strong>S.Level Info:</strong>
                            <input
                                type="text"
                                value={block.slvlInfo || ''}
                                onChange={(e) => updateSlvlInfo(e.target.value)}
                                style={{ ...inputStyle, width: '150px' }}
                                placeholder="Optional S.Level info"
                            />
                        </label>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Actions:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addAction}
                                title="Add action"
                            >
                                + Action
                            </button>
                        </div>

                        {block.actions.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No actions - click "+ Action" to add actions
                            </em>
                        ) : (
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {block.actions.map((action, index) => (
                                    <li key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                        <div style={{
                                            position: 'relative',
                                            border: '1px solid #e0e7ff',
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
                                                onClick={() => removeAction(index)}
                                                title="Remove action"
                                            >
                                                ×
                                            </button>
                                            <NodeRenderer
                                                node={action}
                                                path={[...path, 'actions', index]}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Associated Images:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addImage}
                                title="Add image"
                            >
                                + Image
                            </button>
                        </div>

                        {!block.associatedImages || block.associatedImages.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No images - click "+ Image" to add images
                            </em>
                        ) : (
                            block.associatedImages.map((image, index) => (
                                <div key={index} style={{
                                    position: 'relative',
                                    margin: '8px 0',
                                    border: '1px solid #e0e7ff',
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
                                        onClick={() => removeImage(index)}
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                    <NodeRenderer
                                        node={image}
                                        path={[...path, 'associatedImages', index]}
                                    />
                                </div>
                            ))
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
                                    border: '1px solid #e0e7ff',
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
                </>
            )}
        </div>
    );
};
