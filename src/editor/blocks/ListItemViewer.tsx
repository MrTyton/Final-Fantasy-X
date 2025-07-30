// src/editor/blocks/ListItemViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { ListItemElement } from '../../types';

interface ListItemViewerProps {
    block: ListItemElement;
    path: (string | number)[];
}

export const ListItemViewer: React.FC<ListItemViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            margin: '4px 0',
            padding: '4px 0'
        }}>
            {/* Bullet point */}
            <span style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#666',
                marginTop: '2px',
                minWidth: '8px'
            }}>
                •
            </span>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {/* Main content */}
                {block.content && block.content.length > 0 && (
                    <div style={{ marginBottom: '4px' }}>
                        {block.content.map((item, index) => (
                            <NodeRenderer
                                key={index}
                                node={item}
                                path={[...path, 'content', index]}
                            />
                        ))}
                    </div>
                )}

                {/* Sub content */}
                {block.subContent && block.subContent.length > 0 && (
                    <div style={{
                        marginLeft: '16px',
                        marginTop: '4px',
                        borderLeft: '2px solid #e5e7eb',
                        paddingLeft: '8px'
                    }}>
                        {block.subContent.map((item, index) => (
                            <NodeRenderer
                                key={index}
                                node={item}
                                path={[...path, 'subContent', index]}
                            />
                        ))}
                    </div>
                )}

                {/* CSR Note */}
                {block.csrNote && block.csrNote.length > 0 && (
                    <div style={{
                        backgroundColor: '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        fontSize: '12px'
                    }}>
                        <strong style={{ color: '#92400e' }}>CSR:</strong>
                        {block.csrNote.map((note, index) => (
                            <NodeRenderer
                                key={index}
                                node={note}
                                path={[...path, 'csrNote', index]}
                            />
                        ))}
                    </div>
                )}

                {/* Tracked resources */}
                {block.trackedResourceUpdates && block.trackedResourceUpdates.length > 0 && (
                    <div style={{
                        backgroundColor: '#e0e7ff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        fontSize: '12px'
                    }}>
                        <strong style={{ color: '#3730a3' }}>Resources:</strong>
                        {block.trackedResourceUpdates.map((resource, index) => (
                            <span key={index} style={{ marginLeft: '4px' }}>
                                {resource.name}: {resource.quantity > 0 ? '+' : ''}{resource.quantity}
                                {index < block.trackedResourceUpdates!.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                )}

                {/* Item acquisition flags */}
                {block.itemAcquisitionFlags && block.itemAcquisitionFlags.length > 0 && (
                    <div style={{
                        backgroundColor: '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        fontSize: '12px'
                    }}>
                        <strong style={{ color: '#92400e' }}>Items:</strong>
                        {block.itemAcquisitionFlags.map((flag, index) => (
                            <span key={index} style={{ marginLeft: '4px' }}>
                                {flag.itemName}
                                {index < block.itemAcquisitionFlags!.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
