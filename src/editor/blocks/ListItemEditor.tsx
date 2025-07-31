// src/editor/blocks/ListItemEditor.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { ListItemElement, TrackedResource, AcquiredItemFlag, FormattedText } from '../../types';
import { TrackingInterface } from '../components/TrackingInterface';
import {
    getBlockButtonStyle
} from './shared/blockEditorUtils';
import { createInlineElement } from '../shared/elementFactory';

interface ListItemEditorProps {
    block: ListItemElement;
    path: (string | number)[];
}

export const ListItemEditor: React.FC<ListItemEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);

    const addInlineElement = (type: string) => {
        let newElement: any;

        // Check if it's an inline element first
        const inlineTypes = ['plainText', 'formattedText', 'characterReference', 'characterCommand', 'gameMacro', 'formation', 'link', 'nth', 'num', 'mathSymbol'];

        if (inlineTypes.includes(type)) {
            newElement = createInlineElement(type);
        } else {
            // Handle block-level content types
            switch (type) {
                case 'conditional':
                    newElement = {
                        type: 'conditional',
                        conditionSource: 'textual_direct_choice',
                        displayAsItemizedCondition: false
                    };
                    break;
                case 'textParagraph':
                    newElement = {
                        type: 'textParagraph',
                        content: [createInlineElement('plainText', 'New paragraph content')]
                    };
                    break;
                case 'battle':
                    newElement = {
                        type: 'battle',
                        enemyName: 'New Enemy',
                        strategy: []
                    };
                    break;
                case 'instructionList':
                    newElement = {
                        type: 'instructionList',
                        ordered: false,
                        items: []
                    };
                    break;
                default:
                    newElement = createInlineElement('plainText');
            }
        }

        const newContent = [...block.content, newElement];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const removeContentItem = (index: number) => {
        const newContent = block.content.filter((_, i) => i !== index);
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const addSubContent = () => {
        const newSubItem: ListItemElement = {
            type: 'listItem',
            content: [{ type: 'plainText', text: 'New sub-item' }]
        };

        const newSubContent = [...(block.subContent || []), newSubItem];
        const newBlock = { ...block, subContent: newSubContent };
        updateNode(path, newBlock);
    };

    const removeSubContentItem = (index: number) => {
        if (!block.subContent) return;
        const newSubContent = block.subContent.filter((_, i) => i !== index);
        const newBlock = {
            ...block,
            subContent: newSubContent.length > 0 ? newSubContent : undefined
        };
        updateNode(path, newBlock);
    };

    const addTrackedResource = () => {
        const newResource: TrackedResource = {
            name: 'PowerSphere',
            quantity: 1,
            updateType: 'auto_guaranteed',
            id: `resource_${Date.now()}`,
            description: 'Sphere obtained from battle victory'
        };

        const newTrackedResources = [...(block.trackedResourceUpdates || []), newResource];
        const newBlock = { ...block, trackedResourceUpdates: newTrackedResources };
        updateNode(path, newBlock);
    };

    const removeTrackedResource = (index: number) => {
        if (!block.trackedResourceUpdates) return;
        const newTrackedResources = block.trackedResourceUpdates.filter((_, i) => i !== index);
        const newBlock = {
            ...block,
            trackedResourceUpdates: newTrackedResources.length > 0 ? newTrackedResources : undefined
        };
        updateNode(path, newBlock);
    };

    const updateTrackedResource = (index: number, updatedResource: TrackedResource) => {
        if (!block.trackedResourceUpdates) return;
        const newTrackedResources = [...block.trackedResourceUpdates];
        newTrackedResources[index] = updatedResource;
        const newBlock = { ...block, trackedResourceUpdates: newTrackedResources };
        updateNode(path, newBlock);
    };

    const addItemFlag = () => {
        const newFlag: AcquiredItemFlag = {
            itemName: 'Lv2KeySphere',
            setType: 'user_prompt_after_event',
            sourceDescription: 'Item acquired from battle victory',
            id: `flag_${Date.now()}`
        };

        const newFlags = [...(block.itemAcquisitionFlags || []), newFlag];
        const newBlock = { ...block, itemAcquisitionFlags: newFlags };
        updateNode(path, newBlock);
    };

    const removeItemFlag = (index: number) => {
        if (!block.itemAcquisitionFlags) return;
        const newFlags = block.itemAcquisitionFlags.filter((_, i) => i !== index);
        const newBlock = {
            ...block,
            itemAcquisitionFlags: newFlags.length > 0 ? newFlags : undefined
        };
        updateNode(path, newBlock);
    };

    const updateItemFlag = (index: number, updatedFlag: AcquiredItemFlag) => {
        if (!block.itemAcquisitionFlags) return;
        const newFlags = [...block.itemAcquisitionFlags];
        newFlags[index] = updatedFlag;
        const newBlock = { ...block, itemAcquisitionFlags: newFlags };
        updateNode(path, newBlock);
    };

    const updateCSRBehavior = (behavior: string) => {
        const newBlock = {
            ...block,
            csrBehavior: behavior === 'none' ? undefined : behavior as any
        };
        updateNode(path, newBlock);
    };

    const addCSRNote = () => {
        const newNote: FormattedText = {
            type: 'formattedText',
            text: 'New CSR note'
        };

        const newNotes = [...(block.csrNote || []), newNote];
        const newBlock = { ...block, csrNote: newNotes };
        updateNode(path, newBlock);
    };

    const removeCSRNote = (index: number) => {
        if (!block.csrNote) return;
        const newNotes = block.csrNote.filter((_, i) => i !== index);
        const newBlock = {
            ...block,
            csrNote: newNotes.length > 0 ? newNotes : undefined
        };
        updateNode(path, newBlock);
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        margin: '4px 0',
        padding: '8px',
        border: '1px solid #e3f2fd',
        borderRadius: '6px',
        backgroundColor: '#fafafa',
        position: 'relative'
    };

    const bulletStyle: React.CSSProperties = {
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#1976d2',
        marginTop: '2px',
        minWidth: '8px',
        fontWeight: 'bold'
    };

    const contentContainerStyle: React.CSSProperties = {
        flex: 1,
        position: 'relative'
    };

    const contentAreaStyle: React.CSSProperties = {
        minHeight: '20px',
        padding: '4px',
        border: '1px dashed #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    const buttonStyle = getBlockButtonStyle();

    const toolbarStyle: React.CSSProperties = {
        display: 'flex',
        gap: '4px',
        marginBottom: '6px',
        flexWrap: 'wrap'
    };

    const removeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        fontSize: '9px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const subContentStyle: React.CSSProperties = {
        marginLeft: '16px',
        marginTop: '8px',
        borderLeft: '2px solid #e3f2fd',
        paddingLeft: '8px'
    };

    const inlineItemStyle: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        margin: '1px'
    };

    return (
        <div style={containerStyle}>
            {/* Bullet point */}
            <span style={bulletStyle}>•</span>

            {/* Content */}
            <div style={contentContainerStyle}>
                {/* Toolbar */}
                <div style={toolbarStyle}>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                addInlineElement(e.target.value);
                                e.target.value = ''; // Reset selection
                            }
                        }}
                        style={{
                            ...buttonStyle,
                            width: '140px',
                            cursor: 'pointer'
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>+ Add Content</option>
                        <optgroup label="📝 Text & Formatting">
                            <option value="plainText">📝 Plain Text</option>
                            <option value="formattedText">🎨 Formatted Text</option>
                        </optgroup>
                        <optgroup label="👤 Characters & Actions">
                            <option value="characterReference">👤 Character</option>
                            <option value="characterCommand">⚡ Command</option>
                            <option value="formation">👥 Formation</option>
                        </optgroup>
                        <optgroup label="🎮 Game Elements">
                            <option value="gameMacro">🎮 Game Macro</option>
                            <option value="link">🔗 Link</option>
                            <option value="nth">🔢 Ordinal (1st, 2nd)</option>
                            <option value="num">🔢 Number</option>
                            <option value="mathSymbol">➕ Math Symbol</option>
                        </optgroup>
                        <optgroup label="📋 Block Content">
                            <option value="conditional">🔀 If/Else Conditional</option>
                            <option value="textParagraph">📄 Text Paragraph</option>
                            <option value="battle">⚔️ Battle</option>
                            <option value="instructionList">📋 Instruction List</option>
                        </optgroup>
                    </select>
                    <button
                        style={buttonStyle}
                        onClick={addSubContent}
                        title="Add sub-item"
                    >
                        + Sub-item
                    </button>
                </div>

                {/* Main content */}
                <div style={contentAreaStyle}>
                    {block.content.length === 0 ? (
                        <em style={{ color: '#666', fontSize: '12px' }}>
                            Empty list item - add content above
                        </em>
                    ) : (
                        block.content.map((item, index) => (
                            <div key={index} style={inlineItemStyle}>
                                <NodeRenderer
                                    node={item}
                                    path={[...path, 'content', index]}
                                />
                                <button
                                    style={removeButtonStyle}
                                    onClick={() => removeContentItem(index)}
                                    title="Remove this content"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Sub content */}
                {block.subContent && block.subContent.length > 0 && (
                    <div style={subContentStyle}>
                        <strong style={{ fontSize: '11px', color: '#666' }}>Sub-items:</strong>
                        {block.subContent.map((item, index) => (
                            <div key={index} style={{ position: 'relative', margin: '4px 0' }}>
                                <NodeRenderer
                                    node={item}
                                    path={[...path, 'subContent', index]}
                                />
                                <button
                                    style={{ ...removeButtonStyle, top: '4px', right: '4px' }}
                                    onClick={() => removeSubContentItem(index)}
                                    title="Remove this sub-item"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tracking & Advanced Features */}
                <div style={{ marginTop: '12px', borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}>
                    <div style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '12px', color: '#666' }}>Tracking & CSR</strong>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                        <button
                            style={{ ...buttonStyle, fontSize: '10px' }}
                            onClick={addTrackedResource}
                            title="Add tracked resource"
                        >
                            + Resource
                        </button>
                        <button
                            style={{ ...buttonStyle, fontSize: '10px' }}
                            onClick={addItemFlag}
                            title="Add item flag"
                        >
                            + Item Flag
                        </button>
                        <button
                            style={{ ...buttonStyle, fontSize: '10px' }}
                            onClick={addCSRNote}
                            title="Add CSR note"
                        >
                            + CSR Note
                        </button>
                        <select
                            value={block.csrBehavior || 'none'}
                            onChange={(e) => updateCSRBehavior(e.target.value)}
                            style={{ ...buttonStyle, fontSize: '10px', width: '120px' }}
                        >
                            <option value="none">No CSR Behavior</option>
                            <option value="standard_only">Standard Only</option>
                            <option value="csr_only">CSR Only</option>
                            <option value="always_relevant">Always Relevant</option>
                        </select>
                    </div>

                    {/* Tracking Interface */}
                    <TrackingInterface
                        trackedResources={block.trackedResourceUpdates}
                        itemFlags={block.itemAcquisitionFlags}
                        onUpdateTrackedResource={updateTrackedResource}
                        onRemoveTrackedResource={removeTrackedResource}
                        onUpdateItemFlag={updateItemFlag}
                        onRemoveItemFlag={removeItemFlag}
                    />

                    {/* CSR Notes */}
                    {block.csrNote && block.csrNote.length > 0 && (
                        <div style={{ marginBottom: '4px' }}>
                            {block.csrNote.map((note, index) => (
                                <div key={index} style={{
                                    backgroundColor: '#e3f2fd',
                                    padding: '2px 6px',
                                    borderRadius: '3px',
                                    marginBottom: '2px',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <NodeRenderer
                                        node={note}
                                        path={[...path, 'csrNote', index]}
                                    />
                                    <button
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#f44336',
                                            cursor: 'pointer',
                                            fontSize: '10px'
                                        }}
                                        onClick={() => removeCSRNote(index)}
                                        title="Remove CSR note"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
