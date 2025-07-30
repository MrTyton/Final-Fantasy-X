// src/editor/blocks/TrialViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { TrialBlock } from '../../types';

interface TrialViewerProps {
    block: TrialBlock;
    path: (string | number)[];
}

export const TrialViewer: React.FC<TrialViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            border: '2px solid #059669',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px 0',
            backgroundColor: '#f0fdf4'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#047857',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                🏛️ Cloister of Trials
            </h3>

            {/* Steps */}
            {block.steps && block.steps.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#047857', marginBottom: '8px', display: 'block' }}>
                        Steps:
                    </strong>
                    {block.steps.map((step, index) => (
                        <NodeRenderer
                            key={index}
                            node={step}
                            path={[...path, 'steps', index]}
                        />
                    ))}
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
