// src/editor/inline/NumberEditor.tsx
import React from 'react';
import type { NumberElement } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

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
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.number)}>
            <span style={getStandardLabelStyle()}>123</span>
            <input
                type="number"
                value={node.value}
                onChange={handleValueChange}
                style={getStandardInputStyle('60px')}
                placeholder="Number"
            />
        </div>
    );
};
