// src/editor/blocks/InstructionListEditor.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { InstructionListBlock, ListItemElement } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getBlockColors,
    getBlockSectionStyle
} from './shared/blockEditorUtils';

interface InstructionListEditorProps {
    block: InstructionListBlock;
    path: (string | number)[];
}

export const InstructionListEditor: React.FC<InstructionListEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);

    const toggleOrdered = () => {
        const newBlock = { ...block, ordered: !block.ordered };
        updateNode(path, newBlock);
    };

    const addListItem = (contentType: string = 'plainText') => {
        let newContent;
        switch (contentType) {
            case 'plainText':
                newContent = [{ type: 'plainText', text: 'New list item' }];
                break;
            case 'formattedText':
                newContent = [{ type: 'formattedText', text: 'New formatted item' }];
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
                newContent = [{ type: 'plainText', text: 'New list item' }];
        }

        const newItem: ListItemElement = {
            type: 'listItem',
            content: newContent as any
        };

        const newItems = [...block.items, newItem];
        const newBlock = { ...block, items: newItems };
        updateNode(path, newBlock);
    };

    const removeListItem = (index: number) => {
        const newItems = block.items.filter((_, i) => i !== index);
        const newBlock = { ...block, items: newItems };
        updateNode(path, newBlock);
    };

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...block.items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        const newBlock = { ...block, items: newItems };
        updateNode(path, newBlock);
    };

    const moveItemDown = (index: number) => {
        if (index === block.items.length - 1) return;
        const newItems = [...block.items];
        [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        const newBlock = { ...block, items: newItems };
        updateNode(path, newBlock);
    };

    const colors = getBlockColors('instructionList');
    const containerStyle = getBlockContainerStyle(colors.border, colors.background);
    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();

    const listContainerStyle = getBlockSectionStyle(colors.border);

    const itemContainerStyle: React.CSSProperties = {
        position: 'relative',
        margin: '4px 0',
        border: '1px solid #e3f2fd',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
    };

    const itemToolbarStyle: React.CSSProperties = {
        position: 'absolute',
        top: '4px',
        right: '4px',
        display: 'flex',
        gap: '2px'
    };

    const smallButtonStyle: React.CSSProperties = {
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
    };

    const ListComponent = block.ordered ? 'ol' : 'ul';

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    📋 {block.ordered ? 'Ordered List' : 'Unordered List'}
                </span>
                <div>
                    <button
                        style={{
                            ...buttonStyle,
                            backgroundColor: block.ordered ? '#2196f3' : '#fff',
                            color: block.ordered ? '#fff' : '#000'
                        }}
                        onClick={toggleOrdered}
                        title="Toggle ordered/unordered"
                    >
                        {block.ordered ? '1.' : '•'} {block.ordered ? 'Ordered' : 'Unordered'}
                    </button>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                addListItem(e.target.value);
                                e.target.value = ''; // Reset selection
                            }
                        }}
                        style={{
                            ...buttonStyle,
                            width: '120px',
                            cursor: 'pointer',
                            marginLeft: '4px'
                        }}
                        defaultValue=""
                        title="Add new list item"
                    >
                        <option value="" disabled>+ Add Item</option>
                        <option value="plainText">📝 Text</option>
                        <option value="formattedText">🎨 Formatted</option>
                        <option value="characterReference">👤 Character</option>
                        <option value="characterCommand">⚡ Command</option>
                        <option value="gameMacro">🎮 Macro</option>
                    </select>
                </div>
            </div>

            <div style={listContainerStyle}>
                {block.items.length === 0 ? (
                    <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                        Empty list - click "+ Item" to add items
                    </em>
                ) : (
                    <ListComponent style={{ paddingLeft: '20px', margin: 0 }}>
                        {block.items.map((item, index) => (
                            <li key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                <div style={itemContainerStyle}>
                                    <div style={itemToolbarStyle}>
                                        <button
                                            style={{
                                                ...smallButtonStyle,
                                                opacity: index === 0 ? 0.3 : 1,
                                                cursor: index === 0 ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => moveItemUp(index)}
                                            disabled={index === 0}
                                            title="Move up"
                                        >
                                            ↑
                                        </button>
                                        <button
                                            style={{
                                                ...smallButtonStyle,
                                                opacity: index === block.items.length - 1 ? 0.3 : 1,
                                                cursor: index === block.items.length - 1 ? 'not-allowed' : 'pointer'
                                            }}
                                            onClick={() => moveItemDown(index)}
                                            disabled={index === block.items.length - 1}
                                            title="Move down"
                                        >
                                            ↓
                                        </button>
                                        <button
                                            style={{ ...smallButtonStyle, backgroundColor: '#f44336', color: 'white' }}
                                            onClick={() => removeListItem(index)}
                                            title="Remove item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div style={{ paddingRight: '80px', paddingTop: '4px' }}>
                                        <NodeRenderer
                                            node={item}
                                            path={[...path, 'items', index]}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ListComponent>
                )}
            </div>
        </div>
    );
};
