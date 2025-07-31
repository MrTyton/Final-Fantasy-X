// src/editor/blocks/EquipEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { EquipBlock, ListItemElement, ConditionalBlock } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getBlockSectionStyle,
    getBlockColors
} from './shared/blockEditorUtils';

interface EquipEditorProps {
    block: EquipBlock;
    path: (string | number)[];
}

export const EquipEditor: React.FC<EquipEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const addListItem = () => {
        const newItem: ListItemElement = {
            type: 'listItem',
            content: [{ type: 'plainText', text: 'New equipment item' }]
        };
        const newContent = [...block.content, newItem];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const addConditionalBlock = () => {
        const newConditionalBlock: ConditionalBlock = {
            type: 'conditional',
            conditionSource: 'textual_direct_choice',
            winContent: [{ type: 'plainText', text: 'Content for this condition' }]
        };
        const newContent = [...block.content, newConditionalBlock];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const removeItem = (index: number) => {
        const newContent = block.content.filter((_, i) => i !== index);
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const newContent = [...block.content];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const moveItemDown = (index: number) => {
        if (index === block.content.length - 1) return;
        const newContent = [...block.content];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const colors = getBlockColors('equip');
    const containerStyle = getBlockContainerStyle(colors.border, colors.background);
    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();
    const sectionStyle = getBlockSectionStyle(colors.border);

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    ⚔️ Equipment
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
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>Equipment Content:</strong>
                        <div>
                            <button
                                style={buttonStyle}
                                onClick={addListItem}
                                title="Add list item"
                            >
                                + Item
                            </button>
                            <button
                                style={buttonStyle}
                                onClick={addConditionalBlock}
                                title="Add conditional block"
                            >
                                + Conditional
                            </button>
                        </div>
                    </div>

                    {block.content.length === 0 ? (
                        <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                            No equipment content - click "+ Item" or "+ Conditional" to add content
                        </em>
                    ) : (
                        <div>
                            {block.content.map((item, index) => (
                                <div key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                    <div style={{
                                        position: 'relative',
                                        border: '1px solid #d8b4fe',
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
                                                onClick={() => moveItemUp(index)}
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
                                                onClick={() => moveItemDown(index)}
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
                                                onClick={() => removeItem(index)}
                                                title="Remove item"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <NodeRenderer
                                            node={item}
                                            path={[...path, 'content', index]}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
