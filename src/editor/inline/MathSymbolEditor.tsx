// src/editor/inline/MathSymbolEditor.tsx
import React from 'react';
import type { MathSymbolElement } from '../../types';

interface MathSymbolEditorProps {
    node: MathSymbolElement;
    onChange: (newNode: MathSymbolElement) => void;
}

export const MathSymbolEditor: React.FC<MathSymbolEditorProps> = ({ node, onChange }) => {
    const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== 'custom') {
            onChange({ ...node, symbol: e.target.value });
        }
    };

    const handleCustomSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, symbol: e.target.value });
    };

    const mathSymbols = [
        '=', '≠', '<', '>', '≤', '≥', '+', '-', '×', '÷', '±', '≈', '∞',
        // Arrows - LaTeX style
        '\\uparrow', '\\downarrow', '\\leftarrow', '\\rightarrow',
        '\\nwarrow', '\\nearrow', '\\swarrow', '\\searrow',
        '\\uparrow\\uparrow', '\\downarrow\\downarrow', 
        '\\leftarrow\\leftarrow', '\\rightarrow\\rightarrow',
        '\\leftarrow\\leftarrow\\leftarrow', '\\leftarrow\\leftarrow\\leftarrow\\leftarrow',
        '\\nwarrow\\leftarrow\\leftarrow', '\\swarrow\\swarrow',
        // Common LaTeX math symbols
        '\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon', '\\theta', '\\lambda', '\\mu', '\\pi', '\\sigma', '\\omega',
        '\\sum', '\\prod', '\\int', '\\sqrt{}', '\\frac{}{}', '\\cdot', '\\times', '\\div',
        '\\leq', '\\geq', '\\neq', '\\approx', '\\equiv', '\\propto',
        '\\in', '\\subset', '\\supset', '\\cup', '\\cap', '\\emptyset',
        '\\forall', '\\exists', '\\neg', '\\land', '\\lor', '\\implies', '\\iff'
    ];

    const isCustomSymbol = !mathSymbols.includes(node.symbol);

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
            {isCustomSymbol ? (
                <input
                    type="text"
                    value={node.symbol}
                    onChange={handleCustomSymbolChange}
                    style={{
                        border: '1px solid #ccc',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        width: '120px'
                    }}
                    placeholder="LaTeX symbol"
                />
            ) : (
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
            )}
            <button
                onClick={() => {
                    if (isCustomSymbol) {
                        // Switch back to dropdown if current symbol is in list
                        const firstMatch = mathSymbols.find(s => s === node.symbol) || mathSymbols[0];
                        onChange({ ...node, symbol: firstMatch });
                    } else {
                        // Switch to custom input
                        // Don't change the symbol value, just let the UI switch
                    }
                }}
                style={{
                    border: '1px solid #ccc',
                    padding: '1px 4px',
                    borderRadius: '2px',
                    fontSize: '10px',
                    cursor: 'pointer'
                }}
                title={isCustomSymbol ? 'Use dropdown' : 'Custom LaTeX'}
            >
                {isCustomSymbol ? '📋' : '✏️'}
            </button>
        </div>
    );
};
