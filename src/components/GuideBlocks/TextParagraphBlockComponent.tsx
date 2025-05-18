// src/components/GuideBlocks/TextParagraphBlockComponent.tsx
import React from 'react';
import type { TextParagraphBlock } from '../../types';
import InlineContentRenderer from '../InlineContentRenderer'; // Import the shared component

interface TextParagraphBlockProps {
    blockData: TextParagraphBlock;
}

const TextParagraphBlockComponent: React.FC<TextParagraphBlockProps> = ({ blockData }) => {
    const paragraphContent = blockData.content.map((element, index) => (
        <InlineContentRenderer key={index} element={element} />
    ));

    if (blockData.displayHint === 'emphasizedBlock') {
        const emphasizedStyle: React.CSSProperties = {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.8em',
            margin: '30px 0',
            // color: '#D32F2F', // Base color if needed, specific colors in FormattedText will override
            whiteSpace: 'pre-line',
        };
        return <div style={emphasizedStyle}>{paragraphContent}</div>;
    }

    const standardStyle: React.CSSProperties = {
        margin: '1em 0',
        lineHeight: '1.6',
        whiteSpace: 'pre-line', // If you want \n to work in normal paragraphs too
    };
    return <p style={standardStyle}>{paragraphContent}</p>;
};

export default TextParagraphBlockComponent;