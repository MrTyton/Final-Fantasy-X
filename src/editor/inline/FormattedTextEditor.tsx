// src/editor/inline/FormattedTextEditor.tsx
import React from 'react';
import type { FormattedText } from '../../types';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardTextareaStyle,
    calculateDynamicWidth,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

interface FormattedTextEditorProps {
    node: FormattedText;
    onChange: (newNode: FormattedText) => void;
}

export const FormattedTextEditor: React.FC<FormattedTextEditorProps> = ({ node, onChange }) => {
    const handleTextChange = (value: string) => {
        onChange({ ...node, text: value });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, color: e.target.value || undefined });
    };

    const handleBoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, isBold: e.target.checked || undefined });
    };

    const handleItalicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, isItalic: e.target.checked || undefined });
    };

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.formattedText)}>
            <AutoResizeTextarea
                value={node.text}
                onChange={handleTextChange}
                placeholder="Text content"
                minRows={1}
                maxRows={1}
                style={{
                    ...getStandardTextareaStyle(),
                    minWidth: '200px',
                    width: calculateDynamicWidth(node.text)
                }}
                spellCheck={true}
            />
            <input
                type="text"
                value={node.color || ''}
                onChange={handleColorChange}
                style={getStandardInputStyle('60px')}
                placeholder="Color"
            />
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                    type="checkbox"
                    checked={node.isBold || false}
                    onChange={handleBoldChange}
                />
                B
            </label>
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                    type="checkbox"
                    checked={node.isItalic || false}
                    onChange={handleItalicChange}
                />
                I
            </label>
        </div>
    );
};
