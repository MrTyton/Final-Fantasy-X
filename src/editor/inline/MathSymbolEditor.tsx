// src/editor/inline/MathSymbolEditor.tsx
import React from 'react';
import type { MathSymbolElement } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    getStandardButtonStyle,
    INLINE_EDITOR_BACKGROUNDS,
    MATH_SYMBOLS
} from './shared/inlineEditorUtils';

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

    const isCustomSymbol = !MATH_SYMBOLS.includes(node.symbol as any);

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.math)}>
            <span style={getStandardLabelStyle()}>∑</span>
            {isCustomSymbol ? (
                <input
                    type="text"
                    value={node.symbol}
                    onChange={handleCustomSymbolChange}
                    style={getStandardInputStyle('120px')}
                    placeholder="LaTeX symbol"
                />
            ) : (
                <select
                    value={node.symbol}
                    onChange={handleSymbolChange}
                    style={getStandardInputStyle()}
                >
                    {MATH_SYMBOLS.map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                </select>
            )}
            <button
                onClick={() => {
                    if (isCustomSymbol) {
                        // Switch back to dropdown if current symbol is in list
                        const firstMatch = MATH_SYMBOLS.find(s => s === node.symbol) || MATH_SYMBOLS[0];
                        onChange({ ...node, symbol: firstMatch });
                    } else {
                        // Switch to custom input
                        // Don't change the symbol value, just let the UI switch
                    }
                }}
                style={getStandardButtonStyle('#ccc', '#000')}
                title={isCustomSymbol ? 'Use dropdown' : 'Custom LaTeX'}
            >
                {isCustomSymbol ? '📋' : '✏️'}
            </button>
        </div>
    );
};
