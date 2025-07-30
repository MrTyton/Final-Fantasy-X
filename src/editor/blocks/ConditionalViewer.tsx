// src/editor/blocks/ConditionalViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { ConditionalBlock } from '../../types';

interface ConditionalViewerProps {
    block: ConditionalBlock;
    path: (string | number)[];
}

export const ConditionalViewer: React.FC<ConditionalViewerProps> = ({ block, path }) => {
    const containerStyle: React.CSSProperties = {
        border: '2px solid #6f42c1',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '6px',
        backgroundColor: '#f8f6ff'
    };

    const labelStyle: React.CSSProperties = {
        color: '#6f42c1',
        marginBottom: '12px',
        display: 'block',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const sectionStyle: React.CSSProperties = {
        marginBottom: '8px',
        padding: '6px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '4px'
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontWeight: 'bold',
        fontSize: '12px',
        color: '#6f42c1',
        marginBottom: '4px'
    };

    const renderContent = (content: any[] | undefined, title: string, pathSuffix: string) => {
        if (!content || content.length === 0) return null;

        return (
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>{title}:</div>
                {content.map((item, index) => (
                    <NodeRenderer
                        key={index}
                        node={item}
                        path={[...path, pathSuffix, index]}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={containerStyle}>
            <strong style={labelStyle}>
                Conditional Block ({block.conditionSource})
            </strong>

            {/* Basic info */}
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                {block.flagName && <div><strong>Flag:</strong> {block.flagName}</div>}
                {block.resourceName && <div><strong>Resource:</strong> {block.resourceName}</div>}
                {block.comparison && <div><strong>Comparison:</strong> {block.comparison}</div>}
                {block.value !== undefined && <div><strong>Value:</strong> {block.value}</div>}
            </div>

            {/* Content sections */}
            {renderContent(block.winContent, 'Win Content', 'winContent')}
            {renderContent(block.lossContent, 'Loss Content', 'lossContent')}
            {renderContent(block.bothContent, 'Both Content', 'bothContent')}
            {renderContent(block.thenContent, 'Then Content', 'thenContent')}
            {renderContent(block.elseContent, 'Else Content', 'elseContent')}
            {renderContent(block.contentToShowIfTrue, 'If True', 'contentToShowIfTrue')}
            {renderContent(block.contentToShowIfFalse, 'If False', 'contentToShowIfFalse')}
            {renderContent(block.thenContentForAll, 'Then For All', 'thenContentForAll')}

            {/* Options */}
            {block.options && block.options.length > 0 && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>Options:</div>
                    {block.options.map((option, index) => (
                        <div key={index} style={{ marginBottom: '6px', padding: '4px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{option.conditionText}</div>
                            {option.content.map((item, itemIndex) => (
                                <NodeRenderer
                                    key={itemIndex}
                                    node={item}
                                    path={[...path, 'options', index, 'content', itemIndex]}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Text condition */}
            {block.textCondition && block.textCondition.length > 0 && (
                <div style={sectionStyle}>
                    <div style={sectionTitleStyle}>Text Condition:</div>
                    {block.textCondition.map((item, index) => (
                        <NodeRenderer
                            key={index}
                            node={item}
                            path={[...path, 'textCondition', index]}
                        />
                    ))}
                </div>
            )}

            {/* Additional info */}
            {block.additionalNote && (
                <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic', marginTop: '8px' }}>
                    Note: {block.additionalNote}
                </div>
            )}
        </div>
    );
};
