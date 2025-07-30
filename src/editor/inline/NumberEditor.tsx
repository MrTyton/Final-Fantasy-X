// src/editor/inline/NumberEditor.tsx
import React from 'react';
import type { NumberElement } from '../../types';

interface NumberEditorProps {
    node: NumberElement;
    onChange: (newNode: NumberElement) => void;
}

export const NumberEditor: React.FC<NumberEditorProps> = ({ node, onChange }) => {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = parseFloat(e.target.value) || 0;
        onChange({ ...node, value: numValue });
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
            backgroundColor: '#e0f2f1'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>123</span>
            <input
                type="number"
                value={node.value}
                onChange={handleValueChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    width: '60px'
                }}
                placeholder="Number"
            />
        </div>
    );
};
