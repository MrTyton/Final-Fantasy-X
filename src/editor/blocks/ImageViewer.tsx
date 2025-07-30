// src/editor/blocks/ImageViewer.tsx
import React from 'react';
import type { ImageBlock } from '../../types';

interface ImageViewerProps {
    block: ImageBlock;
    path: (string | number)[];
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ block, path }) => {
    const containerStyle: React.CSSProperties = {
        border: '1px solid #28a745',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        backgroundColor: '#f8fff9'
    };

    const labelStyle: React.CSSProperties = {
        color: '#28a745',
        marginBottom: '10px',
        display: 'block',
        fontWeight: 'bold'
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%',
        height: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px'
    };

    const detailsStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#666',
        marginTop: '8px'
    };

    return (
        <div style={containerStyle}>
            <strong style={labelStyle}>Image Block</strong>

            <div style={{ marginBottom: '10px' }}>
                <img
                    src={`/graphics/${block.path}`}
                    alt={block.path}
                    style={imageStyle}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = `Image not found: ${block.path}`;
                    }}
                />
                <div style={{ color: 'red', fontStyle: 'italic', display: 'none' }}></div>
            </div>

            <div style={detailsStyle}>
                <div><strong>Path:</strong> {block.path}</div>
                {block.width && <div><strong>Width:</strong> {block.width}</div>}
                {block.multiColumnWidth && <div><strong>Multi-column Width:</strong> {block.multiColumnWidth}</div>}
                {block.singleColumnWidth && <div><strong>Single-column Width:</strong> {block.singleColumnWidth}</div>}
            </div>
        </div>
    );
};
