// src/editor/inline/MathSymbolEditor.tsx
import React from 'react';
import type { MathSymbolElement } from '../../types';

interface MathSymbolEditorProps {
    node: MathSymbolElement;
    onChange: (newNode: MathSymbolElement) => void;
}

export const MathSymbolEditor: React.FC<MathSymbolEditorProps> = ({ node, onChange }) => {
    const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...node, symbol: e.target.value });
    };

    const mathSymbols = ['=', '≠', '<', '>', '≤', '≥', '+', '-', '×', '÷', '±', '≈', '∞'];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            margin: '2px',
            padding: '4px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#fff8e1'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>∑</span>
            <select
                value={node.symbol}
                onChange={handleSymbolChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px'
                }}
            >
                {mathSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                ))}
            </select>
        </div>
    );
};
