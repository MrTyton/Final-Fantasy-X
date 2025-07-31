// src/editor/inline/NthEditor.tsx
import React from 'react';
import type { NthElement } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

interface NthEditorProps {
    node: NthElement;
    onChange: (newNode: NthElement) => void;
}

export const NthEditor: React.FC<NthEditorProps> = ({ node, onChange }) => {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, value: e.target.value });
    };

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.nth)}>
            <span style={getStandardLabelStyle()}>#</span>
            <input
                type="text"
                value={node.value}
                onChange={handleValueChange}
                style={getStandardInputStyle('60px')}
                placeholder="1st, 2nd..."
            />
        </div>
    );
};
