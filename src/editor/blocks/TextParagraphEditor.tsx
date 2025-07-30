// src/editor/blocks/TextParagraphEditor.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { TextParagraphBlock } from '../../types';

interface TextParagraphEditorProps {
    block: TextParagraphBlock;
    path: (string | number)[];
}

export const TextParagraphEditor: React.FC<TextParagraphEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const isEmphasized = block.displayHint === 'emphasizedBlock';

    const toggleEmphasis = () => {
        const newBlock = {
            ...block,
            displayHint: isEmphasized ? undefined : 'emphasizedBlock' as const
        };
        updateNode(path, newBlock);
    };

    const addInlineElement = (type: string) => {
        let newElement: any;

        switch (type) {
            case 'plainText':
                newElement = { type: 'plainText', text: 'New text' };
                break;
            case 'formattedText':
                newElement = { type: 'formattedText', text: 'New formatted text' };
                break;
            case 'characterReference':
                newElement = { type: 'characterReference', characterName: 'tidus' };
                break;
            case 'characterCommand':
                newElement = { type: 'characterCommand', characterName: 'tidus', actionText: 'Attack' };
                break;
            case 'gameMacro':
                newElement = { type: 'gameMacro', macroName: 'sd' };
                break;
            case 'formation':
                newElement = {
                    type: 'formation',
                    characters: [{ type: 'characterReference', characterName: 'tidus' }]
                };
                break;
            case 'link':
                newElement = {
                    type: 'link',
                    url: 'https://example.com',
                    text: [{ type: 'formattedText', text: 'Link text' }]
                };
                break;
            case 'nth':
                newElement = { type: 'nth', value: '1st' };
                break;
            case 'num':
                newElement = { type: 'num', value: 0 };
                break;
            case 'mathSymbol':
                newElement = { type: 'mathSymbol', symbol: 'plus' };
                break;
            default:
                newElement = { type: 'plainText', text: 'New text' };
        }

        const newContent = [...block.content, newElement];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const removeInlineElement = (index: number) => {
        const newContent = block.content.filter((_, i) => i !== index);
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const containerStyle: React.CSSProperties = {
        border: '2px solid #4caf50',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: isEmphasized ? '#fff3cd' : '#f1f8e9',
        borderColor: isEmphasized ? '#ffc107' : '#4caf50',
        position: 'relative'
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
        color: isEmphasized ? '#856404' : '#2e7d32',
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

    const contentStyle: React.CSSProperties = {
        lineHeight: '1.4',
        fontWeight: isEmphasized ? 'bold' : 'normal',
        textAlign: isEmphasized ? 'center' : 'left',
        fontSize: isEmphasized ? '1.1em' : '1em',
        minHeight: '20px'
    };

    const inlineItemStyle: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        margin: '2px'
    };

    const removeButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        fontSize: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    📝 {isEmphasized ? 'Emphasized Paragraph' : 'Text Paragraph'}
                </span>
                <div>
                    <button
                        style={{ ...buttonStyle, backgroundColor: isEmphasized ? '#ffc107' : '#fff' }}
                        onClick={toggleEmphasis}
                        title="Toggle emphasis"
                    >
                        {isEmphasized ? '📢' : '📝'} Emphasize
                    </button>
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
                    </select>
                </div>
            </div>

            <div style={contentStyle}>
                {block.content.length === 0 ? (
                    <em style={{ color: '#666', fontSize: '14px' }}>
                        Empty paragraph - click "+ Text" or "+ Format" to add content
                    </em>
                ) : (
                    block.content.map((element, index) => (
                        <div key={index} style={inlineItemStyle}>
                            <NodeRenderer
                                node={element}
                                path={[...path, 'content', index]}
                            />
                            <button
                                style={removeButtonStyle}
                                onClick={() => removeInlineElement(index)}
                                title="Remove this element"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
