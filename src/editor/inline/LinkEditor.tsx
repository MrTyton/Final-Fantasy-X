// src/editor/inline/LinkEditor.tsx
import React from 'react';
import type { LinkElement, FormattedText } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

interface LinkEditorProps {
    node: LinkElement;
    onChange: (newNode: LinkElement) => void;
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ node, onChange }) => {
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convert string to FormattedText array
        const newText: FormattedText[] = [{ type: 'formattedText', text: e.target.value }];
        onChange({ ...node, text: newText });
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, url: e.target.value });
    };

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.link)}>
            <span style={getStandardLabelStyle()}>🔗</span>
            <input
                type="text"
                value={node.text[0]?.text || ''}
                onChange={handleTextChange}
                style={getStandardInputStyle('80px')}
                placeholder="Link text"
            />
            <input
                type="text"
                value={node.url}
                onChange={handleUrlChange}
                style={getStandardInputStyle('120px')}
                placeholder="URL"
            />
        </div>
    );
};
