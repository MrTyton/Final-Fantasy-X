// src/editor/blocks/EquipEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { EquipBlock, ListItemElement, ConditionalBlock } from '../../types';

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

    const containerStyle: React.CSSProperties = {
        border: '2px solid #8b5cf6',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#f3f4f6'
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
                                            onClick={() => removeItem(index)}
                                            title="Remove item"
                                        >
                                            ×
                                        </button>
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
