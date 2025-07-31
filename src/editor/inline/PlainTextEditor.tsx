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
            display: 'inline-block',
            margin: '2px',
            minWidth: '200px'
        }}>
            <AutoResizeTextarea
                value={node.text}
                onChange={handleChange}
                placeholder="Enter text..."
                minRows={1}
                maxRows={5}
                style={{
                    background: '#f9f9f9',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    minWidth: '200px',
                    width: `${Math.max(200, node.text.length * 8 + 40)}px`
                }}
                spellCheck={true}
            />
        </div>
    );
};