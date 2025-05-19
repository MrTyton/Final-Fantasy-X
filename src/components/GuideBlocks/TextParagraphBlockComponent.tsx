// src/components/GuideBlocks/TextParagraphBlockComponent.tsx
import React from 'react';
import type { TextParagraphBlock } from '../../types';
import InlineContentRenderer from '../InlineContentRenderer'; // Renders inline elements (text, macros, etc.) within the paragraph

// Props for the TextParagraphBlockComponent, including the block data to render
interface TextParagraphBlockProps {
    blockData: TextParagraphBlock; // The paragraph block data, including content and display hints
}

// Main component for rendering a paragraph block, supporting both standard and emphasized display styles
const TextParagraphBlockComponent: React.FC<TextParagraphBlockProps> = ({ blockData }) => {
    // Map each inline element in the paragraph's content to an InlineContentRenderer
    // This allows for rich inline formatting, macros, and links within the paragraph
    const paragraphContent = blockData.content.map((element, index) => (
        <InlineContentRenderer key={index} element={element} />
    ));

    // If the displayHint is 'emphasizedBlock', render the paragraph with a bold, centered, large style
    // This is used for callouts, major section headers, or important notes
    if (blockData.displayHint === 'emphasizedBlock') {
        const emphasizedStyle: React.CSSProperties = {
            textAlign: 'center', // Center the text horizontally
            fontWeight: 'bold',  // Make the text bold
            fontSize: '1.8em',   // Increase font size for emphasis
            margin: '30px 0',    // Add vertical spacing above and below
            // color: '#D32F2F', // Optional: base color for emphasis (overridden by FormattedText color if present)
            whiteSpace: 'pre-line', // Preserve line breaks in the text
        };
        return <div style={emphasizedStyle}>{paragraphContent}</div>;
    }

    // Standard paragraph style for normal text blocks
    const standardStyle: React.CSSProperties = {
        margin: '1em 0',        // Standard vertical spacing
        lineHeight: '1.6',      // Improve readability with increased line height
        whiteSpace: 'pre-line', // Preserve line breaks in the text
    };
    // Render the paragraph as a <p> element with standard styling
    return <p style={standardStyle}>{paragraphContent}</p>;
};

export default TextParagraphBlockComponent;