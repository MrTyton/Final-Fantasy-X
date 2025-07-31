// src/editor/blocks/ImageEditor.tsx
import React, { useState } from 'react';
import { useEditorStore } from '../store';
import type { ImageBlock } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getBlockInputStyle,
    getBlockSectionStyle,
    getBlockColors
} from './shared/blockEditorUtils';

interface ImageEditorProps {
    block: ImageBlock;
    path: (string | number)[];
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const updatePath = (newPath: string) => {
        const newBlock = { ...block, path: newPath };
        updateNode(path, newBlock);
    };

    const updateWidth = (newWidth: string) => {
        const newBlock = { ...block, width: newWidth || undefined };
        updateNode(path, newBlock);
    };

    const updateMultiColumnWidth = (newWidth: string) => {
        const newBlock = { ...block, multiColumnWidth: newWidth || undefined };
        updateNode(path, newBlock);
    };

    const updateSingleColumnWidth = (newWidth: string) => {
        const newBlock = { ...block, singleColumnWidth: newWidth || undefined };
        updateNode(path, newBlock);
    };

    const colors = getBlockColors('image');
    const containerStyle = getBlockContainerStyle(colors.border, colors.background);
    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();
    const inputStyle = getBlockInputStyle('120px');

    const fieldRowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '8px'
    };

    const previewStyle: React.CSSProperties = {
        ...getBlockSectionStyle(colors.border),
        marginTop: '12px',
        textAlign: 'center'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    🖼️ Image
                </span>
                <div>
                    <button
                        style={buttonStyle}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '▼ Collapse' : '▶ Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div style={fieldRowStyle}>
                        <label>
                            <strong>Image Path:</strong>
                            <input
                                type="text"
                                value={block.path}
                                onChange={(e) => updatePath(e.target.value)}
                                style={{ ...inputStyle, width: '300px' }}
                                placeholder="Enter image path (e.g., graphics/image.png)"
                            />
                        </label>
                    </div>

                    <div style={fieldRowStyle}>
                        <label>
                            <strong>Width:</strong>
                            <input
                                type="text"
                                value={block.width || ''}
                                onChange={(e) => updateWidth(e.target.value)}
                                style={{ ...inputStyle, width: '120px' }}
                                placeholder="e.g., 300px, 50%, auto"
                            />
                        </label>

                        <label>
                            <strong>Multi-Column Width:</strong>
                            <input
                                type="text"
                                value={block.multiColumnWidth || ''}
                                onChange={(e) => updateMultiColumnWidth(e.target.value)}
                                style={{ ...inputStyle, width: '120px' }}
                                placeholder="e.g., 400px, 80%"
                            />
                        </label>

                        <label>
                            <strong>Single-Column Width:</strong>
                            <input
                                type="text"
                                value={block.singleColumnWidth || ''}
                                onChange={(e) => updateSingleColumnWidth(e.target.value)}
                                style={{ ...inputStyle, width: '120px' }}
                                placeholder="e.g., 200px, 60%"
                            />
                        </label>
                    </div>

                    <div style={previewStyle}>
                        <strong>Preview:</strong>
                        <div style={{ marginTop: '8px' }}>
                            {block.path ? (
                                <img
                                    src={`/graphics/${block.path}`}
                                    alt={`Image: ${block.path}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        width: block.width || 'auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent && !parent.querySelector('.error-message')) {
                                            const errorDiv = document.createElement('div');
                                            errorDiv.className = 'error-message';
                                            errorDiv.style.color = '#f44336';
                                            errorDiv.style.fontStyle = 'italic';
                                            errorDiv.textContent = `Failed to load image: /graphics/${block.path}`;
                                            parent.appendChild(errorDiv);
                                        }
                                    }}
                                    onLoad={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'inline';
                                        const parent = target.parentElement;
                                        const errorMsg = parent?.querySelector('.error-message');
                                        if (errorMsg) {
                                            errorMsg.remove();
                                        }
                                    }}
                                />
                            ) : (
                                <em style={{ color: '#666' }}>No image path specified</em>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
