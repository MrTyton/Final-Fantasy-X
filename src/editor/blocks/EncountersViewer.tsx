// src/editor/blocks/EncountersViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { EncountersBlock } from '../../types';

interface EncountersViewerProps {
    block: EncountersBlock;
    path: (string | number)[];
}

export const EncountersViewer: React.FC<EncountersViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            border: '2px solid #8b5cf6',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px 0',
            backgroundColor: '#faf5ff'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#7c3aed',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                🛡️ Encounters
            </h3>

            {/* Main content */}
            {block.content && block.content.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                    {block.content.map((item, index) => (
                        <NodeRenderer
                            key={index}
                            node={item}
                            path={[...path, 'content', index]}
                        />
                    ))}
                </div>
            )}

            {/* Notes section */}
            {block.notes && block.notes.length > 0 && (
                <div style={{
                    backgroundColor: '#f3e8ff',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '8px'
                }}>
                    <strong style={{ color: '#7c3aed' }}>Notes:</strong>
                    <div style={{ marginTop: '4px' }}>
                        {block.notes.map((note, index) => (
                            <NodeRenderer
                                key={index}
                                node={note}
                                path={[...path, 'notes', index]}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tracked resources */}
            {block.trackedResourceUpdates && block.trackedResourceUpdates.length > 0 && (
                <div style={{
                    backgroundColor: '#e0e7ff',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '8px'
                }}>
                    <strong style={{ color: '#3730a3' }}>Tracked Resources:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {block.trackedResourceUpdates.map((resource, index) => (
                            <li key={index} style={{ fontSize: '14px' }}>
                                {resource.name}: {resource.quantity > 0 ? '+' : ''}{resource.quantity} ({resource.updateType})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Item acquisition flags */}
            {block.itemAcquisitionFlags && block.itemAcquisitionFlags.length > 0 && (
                <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '8px',
                    borderRadius: '4px'
                }}>
                    <strong style={{ color: '#92400e' }}>Item Flags:</strong>
                    <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {block.itemAcquisitionFlags.map((flag, index) => (
                            <li key={index} style={{ fontSize: '14px' }}>
                                {flag.itemName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
