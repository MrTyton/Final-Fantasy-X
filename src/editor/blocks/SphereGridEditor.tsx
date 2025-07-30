// src/editor/blocks/SphereGridEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { SphereGridBlock, SphereGridCharacterActions, ConditionalBlock, ImageBlock, ListItemElement } from '../../types';

interface SphereGridEditorProps {
    block: SphereGridBlock;
    path: (string | number)[];
}

export const SphereGridEditor: React.FC<SphereGridEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const updateContextInfo = (newContextInfo: string) => {
        const newBlock = { ...block, contextInfo: newContextInfo || undefined };
        updateNode(path, newBlock);
    };

    const addContentItem = (contentType: string = 'plainText') => {
        let newContent: SphereGridCharacterActions | ConditionalBlock | ImageBlock | ListItemElement;
        switch (contentType) {
            case 'sphereGridCharacterActions':
                newContent = {
                    type: 'sphereGridCharacterActions',
                    character: 'Tidus',
                    actions: []
                };
                break;
            case 'conditional':
                newContent = { type: 'conditional', conditionSource: 'textual_direct_choice', options: [] };
                break;
            case 'image':
                newContent = { type: 'image', path: '' };
                break;
            case 'listItem':
                newContent = {
                    type: 'listItem',
                    content: [{ type: 'plainText', text: 'New list item' }]
                };
                break;
            default:
                newContent = {
                    type: 'listItem',
                    content: [{ type: 'plainText', text: 'New content' }]
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

    const containerStyle: React.CSSProperties = {
        border: '2px solid #17a2b8',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#f0faff'
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
        color: '#117a8b',
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
        width: '200px'
    };

    const sectionStyle: React.CSSProperties = {
        margin: '12px 0',
        padding: '8px',
        border: '1px dashed #17a2b8',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    🔮 Sphere Grid
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
                    <div style={{ marginBottom: '12px' }}>
                        <label>
                            <strong>Context Info:</strong>
                            <input
                                type="text"
                                value={block.contextInfo || ''}
                                onChange={(e) => updateContextInfo(e.target.value)}
                                style={inputStyle}
                                placeholder="Optional context information"
                            />
                        </label>
                    </div>

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
                                <option value="sphereGridCharacterActions">👤 Character Actions</option>
                                <option value="conditional">🔀 Conditional</option>
                                <option value="image">�️ Image</option>
                                <option value="listItem">📋 List Item</option>
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
                                    border: '1px solid #b3e5fc',
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
                                        onClick={() => removeContentItem(index)}
                                        title="Remove content"
                                    >
                                        ×
                                    </button>
                                    <NodeRenderer
                                        node={contentItem}
                                        path={[...path, 'content', index]}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
