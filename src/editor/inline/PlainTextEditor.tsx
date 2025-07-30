// src/editor/inline/PlainTextEditor.tsx
import React from 'react';
import type { PlainTextElement } from '../../types';

interface PlainTextEditorProps {
    node: PlainTextElement;
    // This function will be called when the text changes
    onChange: (newNode: PlainTextElement) => void;
}

export const PlainTextEditor: React.FC<PlainTextEditorProps> = ({ node, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // When the input changes, we call the onChange prop
        // with a new node object containing the updated text.
        onChange({ ...node, text: e.target.value });
    };

    return (
        <input
            type="text"
            value={node.text}
            onChange={handleChange}
            style={{
                border: '1px solid #ccc',
                padding: '2px',
                borderRadius: '3px',
                margin: '0 2px',
                background: '#f9f9f9'
            }}
        />
    );
};