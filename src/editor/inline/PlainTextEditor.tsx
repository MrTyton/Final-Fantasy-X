// src/editor/inline/PlainTextEditor.tsx
import React from 'react';
import type { PlainTextElement } from '../../types';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';

interface PlainTextEditorProps {
    node: PlainTextElement;
    // This function will be called when the text changes
    onChange: (newNode: PlainTextElement) => void;
}

export const PlainTextEditor: React.FC<PlainTextEditorProps> = ({ node, onChange }) => {
    const handleChange = (value: string) => {
        onChange({ ...node, text: value });
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            margin: '2px',
            padding: '4px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#f5f5f5'
        }}>
            <AutoResizeTextarea
                value={node.text}
                onChange={handleChange}
                placeholder="Enter text..."
                minRows={1}
                maxRows={1}
                style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    minWidth: '200px',
                    width: `${Math.max(200, node.text.length * 8 + 40)}px`,
                    resize: 'none',
                    outline: 'none',
                    padding: '2px 4px',
                    height: '20px',
                    lineHeight: '16px'
                }}
                spellCheck={true}
            />
        </div>
    );
};