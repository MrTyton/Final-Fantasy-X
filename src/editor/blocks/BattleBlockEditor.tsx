// src/editor/blocks/BattleBlockEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { BattleBlock, ListItemElement, FormattedText, TrackedResource, AcquiredItemFlag } from '../../types';
import { TrackingInterface } from '../components/TrackingInterface';

interface BattleBlockEditorProps {
    block: BattleBlock;
    path: (string | number)[];
}

export const BattleBlockEditor: React.FC<BattleBlockEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);
    const updateEnemyName = (newName: string) => {
        const newBlock = { ...block, enemyName: newName };
        updateNode(path, newBlock);
    };

    const updateHP = (newHP: number | null) => {
        const newBlock = { ...block, hp: newHP || undefined };
        updateNode(path, newBlock);
    };

    const addStrategyItem = (contentType: string = 'plainText') => {
        let newContent;
        switch (contentType) {
            case 'plainText':
                newContent = [{ type: 'plainText', text: 'New strategy step' }];
                break;
            case 'formattedText':
                newContent = [{ type: 'formattedText', text: 'New formatted step' }];
                break;
            case 'characterReference':
                newContent = [{ type: 'characterReference', characterName: 'tidus' }];
                break;
            case 'characterCommand':
                newContent = [{ type: 'characterCommand', characterName: 'tidus', actionText: 'Attack' }];
                break;
            case 'gameMacro':
                newContent = [{ type: 'gameMacro', macroName: 'sd' }];
                break;
            default:
                newContent = [{ type: 'plainText', text: 'New strategy step' }];
        }

        const newItem: ListItemElement = {
            type: 'listItem',
            content: newContent as any
        };

        const newStrategy = [...block.strategy, newItem];
        const newBlock = { ...block, strategy: newStrategy };
        updateNode(path, newBlock);
    };

    const removeStrategyItem = (index: number) => {
        const newStrategy = block.strategy.filter((_, i) => i !== index);
        const newBlock = { ...block, strategy: newStrategy };
        updateNode(path, newBlock);
    };

    const addNoteParagraph = () => {
        const newParagraph: FormattedText = {
            type: 'formattedText',
            text: 'New battle note'
        };

        const newNotes = block.notes ? [...block.notes, newParagraph] : [newParagraph];
        const newBlock = { ...block, notes: newNotes };
        updateNode(path, newBlock);
    };

    const removeNoteParagraph = (index: number) => {
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
            itemName: 'VictoryItem',
            setType: 'user_prompt_after_event',
            sourceDescription: 'Battle completion flag',
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
        border: '2px solid #f44336',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#fff5f5'
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
        color: '#d32f2f',
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
        border: '1px dashed #f44336',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    const fieldRowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '8px'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    ⚔️ Battle: {block.enemyName}
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
                    <div style={fieldRowStyle}>
                        <label>
                            <strong>Enemy Name:</strong>
                            <input
                                type="text"
                                value={block.enemyName}
                                onChange={(e) => updateEnemyName(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter enemy name"
                            />
                        </label>

                        <label>
                            <strong>HP:</strong>
                            <input
                                type="number"
                                value={block.hp || ''}
                                onChange={(e) => updateHP(e.target.value ? parseInt(e.target.value) : null)}
                                style={{ ...inputStyle, width: '80px' }}
                                placeholder="HP"
                                min="0"
                            />
                        </label>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Strategy:</strong>
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addStrategyItem(e.target.value);
                                        e.target.value = ''; // Reset selection
                                    }
                                }}
                                style={{
                                    ...buttonStyle,
                                    width: '120px',
                                    cursor: 'pointer'
                                }}
                                defaultValue=""
                                title="Add strategy step"
                            >
                                <option value="" disabled>+ Add Step</option>
                                <option value="plainText">📝 Text</option>
                                <option value="formattedText">🎨 Formatted</option>
                                <option value="characterReference">👤 Character</option>
                                <option value="characterCommand">⚡ Command</option>
                                <option value="gameMacro">🎮 Macro</option>
                            </select>
                        </div>

                        {block.strategy.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No strategy steps - click "+ Step" to add steps
                            </em>
                        ) : (
                            <ol style={{ paddingLeft: '20px', margin: 0 }}>
                                {block.strategy.map((step, index) => (
                                    <li key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                        <div style={{
                                            position: 'relative',
                                            border: '1px solid #ffebee',
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
                                                onClick={() => removeStrategyItem(index)}
                                                title="Remove step"
                                            >
                                                ×
                                            </button>
                                            <NodeRenderer
                                                node={step}
                                                path={[...path, 'strategy', index]}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Notes:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addNoteParagraph}
                                title="Add note paragraph"
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
                                    border: '1px solid #ffebee',
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
                                        onClick={() => removeNoteParagraph(index)}
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

                    {/* Tracking Interface */}
                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Tracking & Resources:</strong>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                    style={buttonStyle}
                                    onClick={addTrackedResource}
                                    title="Add tracked resource"
                                >
                                    + Resource
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={addItemFlag}
                                    title="Add item flag"
                                >
                                    + Flag
                                </button>
                            </div>
                        </div>

                        <TrackingInterface
                            trackedResources={block.trackedResourceUpdates}
                            itemFlags={block.itemAcquisitionFlags}
                            onUpdateTrackedResource={updateTrackedResource}
                            onRemoveTrackedResource={removeTrackedResource}
                            onUpdateItemFlag={updateItemFlag}
                            onRemoveItemFlag={removeItemFlag}
                        />

                        {(!block.trackedResourceUpdates || block.trackedResourceUpdates.length === 0) &&
                            (!block.itemAcquisitionFlags || block.itemAcquisitionFlags.length === 0) && (
                                <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                    No tracked resources or item flags - use the buttons above to add them
                                </em>
                            )}
                    </div>
                </>
            )}
        </div>
    );
};
