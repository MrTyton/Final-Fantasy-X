// src/editor/inline/FormattedTextEditor.tsx
import React from 'react';
import type { FormattedText } from '../../types';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';

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
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            margin: '2px',
            padding: '4px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#f8f9fa'
        }}>
            <AutoResizeTextarea
                value={node.text}
                onChange={handleTextChange}
                placeholder="Text content"
                minRows={1}
                maxRows={1}
                style={{
                    minWidth: '200px',
                    width: `${Math.max(200, node.text.length * 8 + 40)}px`,
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    background: 'transparent',
                    border: 'none',
                    resize: 'none',
                    outline: 'none',
                    padding: '2px 4px',
                    height: '20px',
                    lineHeight: '16px'
                }}
                spellCheck={true}
            />
            <input
                type="text"
                value={node.color || ''}
                onChange={handleColorChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    width: '60px'
                }}
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
