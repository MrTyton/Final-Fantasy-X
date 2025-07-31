// src/editor/blocks/EncountersEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { EncountersBlock, ListItemElement, ConditionalBlock, FormattedText, TrackedResource, AcquiredItemFlag } from '../../types';

interface EncountersEditorProps {
    block: EncountersBlock;
    path: (string | number)[];
}

export const EncountersEditor: React.FC<EncountersEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const addContentItem = (contentType: string = 'listItem') => {
        let newContent: ListItemElement | ConditionalBlock;

        if (contentType === 'conditional') {
            newContent = {
                type: 'conditional',
                conditionSource: 'textual_direct_choice',
                options: []
            };
        } else {
            newContent = {
                type: 'listItem',
                content: [{ type: 'plainText', text: 'New encounter strategy' }]
            };
        }

        const newContentArray = [...block.content, newContent];
        const newBlock = { ...block, content: newContentArray };
        updateNode(path, newBlock);
    };

    const removeContentItem = (index: number) => {
        const newContent = block.content.filter((_, i) => i !== index);
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const moveContentItemUp = (index: number) => {
        if (index === 0) return;
        const newContent = [...block.content];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const moveContentItemDown = (index: number) => {
        if (index === block.content.length - 1) return;
        const newContent = [...block.content];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const addNote = () => {
        const newNote: FormattedText = {
            type: 'formattedText',
            text: 'New encounter note'
        };
        const newNotes = block.notes ? [...block.notes, newNote] : [newNote];
        const newBlock = { ...block, notes: newNotes };
        updateNode(path, newBlock);
    };

    const removeNote = (index: number) => {
        if (!block.notes) return;
        const newNotes = block.notes.filter((_, i) => i !== index);
        const newBlock = { ...block, notes: newNotes.length > 0 ? newNotes : undefined };
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
            sourceDescription: 'New item acquisition',
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
                    🛡️ Encounters
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
                            <strong>Content:</strong>
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addContentItem(e.target.value);
                                        e.target.value = ''; // Reset selection
                                    }
                                }}
                                style={{
                                    ...buttonStyle,
                                    width: '120px',
                                    cursor: 'pointer'
                                }}
                                defaultValue=""
                                title="Add content"
                            >
                                <option value="" disabled>+ Add Content</option>
                                <option value="listItem">📋 List Item</option>
                                <option value="conditional">🔀 Conditional</option>
                            </select>
                        </div>

                        {block.content.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No content - click "+ Add Content" to add content
                            </em>
                        ) : (
                            block.content.map((contentItem, index) => (
                                <div key={index} style={{
                                    position: 'relative',
                                    margin: '8px 0',
                                    border: '1px solid #e0e7ff',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa',
                                    paddingRight: '80px'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        display: 'flex',
                                        gap: '2px'
                                    }}>
                                        <button
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '3px',
                                                border: '1px solid #ccc',
                                                backgroundColor: index === 0 ? '#ccc' : '#2196f3',
                                                color: 'white',
                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => moveContentItemUp(index)}
                                            disabled={index === 0}
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '3px',
                                                border: '1px solid #ccc',
                                                backgroundColor: index === block.content.length - 1 ? '#ccc' : '#2196f3',
                                                color: 'white',
                                                cursor: index === block.content.length - 1 ? 'not-allowed' : 'pointer',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => moveContentItemDown(index)}
                                            disabled={index === block.content.length - 1}
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            style={{
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
                                            onClick={() => removeContentItem(index)}
                                            title="Remove content"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <NodeRenderer
                                        node={contentItem}
                                        path={[...path, 'content', index]}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Notes:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addNote}
                                title="Add note"
                            >
                                + Note
                            </button>
                        </div>

                        {!block.notes || block.notes.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No notes - click "+ Note" to add notes
                            </em>
                        ) : (
                            block.notes.map((note, index) => (
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
                                        onClick={() => removeNote(index)}
                                        title="Remove note"
                                    >
                                        ×
                                    </button>
                                    <NodeRenderer
                                        node={note}
                                        path={[...path, 'notes', index]}
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
                                    padding: '12px',
                                    border: '1px solid #e0e7ff',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa'
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

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
                                            <strong style={{ fontSize: '12px', marginBottom: '2px' }}>Resource Name:</strong>
                                            <input
                                                type="text"
                                                value={resource.name}
                                                onChange={(e) => updateTrackedResource(index, { ...resource, name: e.target.value })}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px',
                                                    width: '140px'
                                                }}
                                                placeholder="Resource name"
                                            />
                                        </label>

                                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
                                            <strong style={{ fontSize: '12px', marginBottom: '2px' }}>Quantity:</strong>
                                            <input
                                                type="number"
                                                value={resource.quantity}
                                                onChange={(e) => updateTrackedResource(index, { ...resource, quantity: parseInt(e.target.value) || 0 })}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px',
                                                    width: '60px'
                                                }}
                                                min="0"
                                            />
                                        </label>

                                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
                                            <strong style={{ fontSize: '12px', marginBottom: '2px' }}>Update Type:</strong>
                                            <select
                                                value={resource.updateType}
                                                onChange={(e) => updateTrackedResource(index, { ...resource, updateType: e.target.value as any })}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px',
                                                    width: '170px'
                                                }}
                                            >
                                                <option value="auto_guaranteed">Auto Guaranteed</option>
                                                <option value="consumption_explicit_fixed">Consumption Explicit Fixed</option>
                                                <option value="consumption_implicit_grid">Consumption Implicit Grid</option>
                                                <option value="user_confirm_rng_consumption">User Confirm RNG Consumption</option>
                                                <option value="user_confirm_rng_gain">User Confirm RNG Gain</option>
                                            </select>
                                        </label>
                                    </div>

                                    <label style={{ display: 'block', marginTop: '8px' }}>
                                        <strong style={{ fontSize: '12px', marginBottom: '2px', display: 'block' }}>Description (optional):</strong>
                                        <input
                                            type="text"
                                            value={resource.description || ''}
                                            onChange={(e) => updateTrackedResource(index, { ...resource, description: e.target.value || undefined })}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                fontSize: '12px',
                                                width: '100%',
                                                maxWidth: '300px'
                                            }}
                                            placeholder="Optional description"
                                        />
                                    </label>
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
                                    padding: '12px',
                                    border: '1px solid #e0e7ff',
                                    borderRadius: '4px',
                                    backgroundColor: '#fafafa'
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

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
                                            <strong style={{ fontSize: '12px', marginBottom: '2px' }}>Item Name:</strong>
                                            <input
                                                type="text"
                                                value={flag.itemName}
                                                onChange={(e) => updateItemFlag(index, { ...flag, itemName: e.target.value })}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px',
                                                    width: '160px'
                                                }}
                                                placeholder="Item name"
                                            />
                                        </label>

                                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
                                            <strong style={{ fontSize: '12px', marginBottom: '2px' }}>Set Type:</strong>
                                            <select
                                                value={flag.setType}
                                                onChange={(e) => updateItemFlag(index, { ...flag, setType: e.target.value as any })}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #ccc',
                                                    fontSize: '12px',
                                                    width: '200px'
                                                }}
                                            >
                                                <option value="derived_from_user_choice">Derived From User Choice</option>
                                                <option value="user_checkbox_on_pickup_or_drop">User Checkbox On Pickup/Drop</option>
                                                <option value="user_prompt_after_event">User Prompt After Event</option>
                                            </select>
                                        </label>
                                    </div>

                                    <label style={{ display: 'block', marginTop: '8px' }}>
                                        <strong style={{ fontSize: '12px', marginBottom: '2px', display: 'block' }}>Source Description:</strong>
                                        <input
                                            type="text"
                                            value={flag.sourceDescription}
                                            onChange={(e) => updateItemFlag(index, { ...flag, sourceDescription: e.target.value })}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                fontSize: '12px',
                                                width: '100%',
                                                maxWidth: '300px'
                                            }}
                                            placeholder="Description of how this item is acquired"
                                        />
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
