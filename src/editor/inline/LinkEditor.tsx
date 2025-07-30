// src/editor/inline/LinkEditor.tsx
import React from 'react';
import type { LinkElement, FormattedText } from '../../types';

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
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            margin: '2px',
            padding: '4px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#e8f5e9'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>🔗</span>
            <input
                type="text"
                value={node.text[0]?.text || ''}
                onChange={handleTextChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    minWidth: '80px'
                }}
                placeholder="Link text"
            />
            <input
                type="text"
                value={node.url}
                onChange={handleUrlChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    minWidth: '120px'
                }}
                placeholder="URL"
            />
        </div>
    );
};
