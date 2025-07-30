// src/editor/inline/PlainTextEditor.tsx
import React from 'react';
import type { PlainTextElement } from '../../types';

interface PlainTextEditorProps {
    node: PlainTextElement;
    // This function will be called when the text changes
    onChange: (newNode: PlainTextElement) => void;
}

export const PlainTextEditor: React.FC<PlainTextEditorProps> = ({ node, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // When the input changes, we call the onChange prop
        // with a new node object containing the updated text.
        onChange({ ...node, text: e.target.value });
    };

    return (
        <textarea
            value={node.text}
            onChange={handleChange}
            style={{
                border: '1px solid #ccc',
                padding: '4px',
                borderRadius: '3px',
                margin: '0 2px',
                background: '#f9f9f9',
                minWidth: '200px',
                width: `${Math.max(200, node.text.length * 8 + 40)}px`,
                minHeight: '24px',
                resize: 'both',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                overflow: 'hidden'
            }}
            rows={Math.max(1, Math.ceil(node.text.length / 50))}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
            }}
        />
    );
};