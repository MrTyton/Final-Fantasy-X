// src/editor/blocks/TextParagraphViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { TextParagraphBlock } from '../../types';

interface TextParagraphViewerProps {
    block: TextParagraphBlock;
    path: (string | number)[];
}

export const TextParagraphViewer: React.FC<TextParagraphViewerProps> = ({ block, path }) => {
    const isEmphasized = block.displayHint === 'emphasizedBlock';

    const containerStyle: React.CSSProperties = {
        border: '1px solid #e0e0e0',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        backgroundColor: isEmphasized ? '#fff3cd' : '#fafafa',
        borderColor: isEmphasized ? '#ffc107' : '#e0e0e0'
    };

    const labelStyle: React.CSSProperties = {
        color: isEmphasized ? '#856404' : '#007acc',
        marginBottom: '10px',
        display: 'block',
        fontWeight: 'bold'
    };

    const contentStyle: React.CSSProperties = {
        lineHeight: '1.4',
        fontWeight: isEmphasized ? 'bold' : 'normal',
        textAlign: isEmphasized ? 'center' : 'left',
        fontSize: isEmphasized ? '1.1em' : '1em'
    };

    return (
        <div style={containerStyle}>
            <strong style={labelStyle}>
                {isEmphasized ? 'Emphasized Paragraph' : 'Text Paragraph'}
            </strong>
            <div style={contentStyle}>
                {block.content.map((element, index) => (
                    <NodeRenderer
                        key={index}
                        node={element}
                        path={[...path, 'content', index]}
                    />
                ))}
            </div>
        </div>
    );
};
