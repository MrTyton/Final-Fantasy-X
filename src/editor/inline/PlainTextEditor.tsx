// src/editor/inline/PlainTextEditor.tsx
import React from 'react';
import type { PlainTextElement } from '../../types';
import { AutoResizeTextarea } from '../components/AutoResizeTextarea';
import {
    getInlineEditorContainerStyle,
    getStandardTextareaStyle,
    calculateDynamicWidth,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

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
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.text)}>
            <AutoResizeTextarea
                value={node.text}
                onChange={handleChange}
                placeholder="Enter text..."
                minRows={1}
                maxRows={1}
                style={{
                    ...getStandardTextareaStyle(),
                    minWidth: '200px',
                    width: calculateDynamicWidth(node.text)
                }}
                spellCheck={true}
            />
        </div>
    );
};