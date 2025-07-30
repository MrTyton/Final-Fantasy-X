// src/editor/inline/NthEditor.tsx
import React from 'react';
import type { NthElement } from '../../types';

interface NthEditorProps {
    node: NthElement;
    onChange: (newNode: NthElement) => void;
}

export const NthEditor: React.FC<NthEditorProps> = ({ node, onChange }) => {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, value: e.target.value });
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
            backgroundColor: '#fce4ec'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>#</span>
            <input
                type="text"
                value={node.value}
                onChange={handleValueChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    width: '60px'
                }}
                placeholder="1st, 2nd..."
            />
        </div>
    );
};
