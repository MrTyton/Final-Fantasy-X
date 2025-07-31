// src/editor/blocks/TextParagraphEditor.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { TextParagraphBlock } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getRemoveButtonStyle,
    getBlockColors
} from './shared/blockEditorUtils';
import { createInlineElement } from '../shared/elementFactory';

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
        const newElement = createInlineElement(type);
        const newContent = [...block.content, newElement];
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const removeInlineElement = (index: number) => {
        const newContent = block.content.filter((_, i) => i !== index);
        const newBlock = { ...block, content: newContent };
        updateNode(path, newBlock);
    };

    const colors = isEmphasized ? getBlockColors('textParagraphEmphasized') : getBlockColors('textParagraph');

    const containerStyle = {
        ...getBlockContainerStyle(colors.border, colors.background)
    };

    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();

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
        ...getRemoveButtonStyle(),
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        fontSize: '10px'
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
