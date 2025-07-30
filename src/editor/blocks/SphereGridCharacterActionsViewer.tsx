// src/editor/blocks/SphereGridCharacterActionsViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { SphereGridCharacterActions } from '../../types';

interface SphereGridCharacterActionsViewerProps {
    block: SphereGridCharacterActions;
    path: (string | number)[];
}

export const SphereGridCharacterActionsViewer: React.FC<SphereGridCharacterActionsViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            border: '2px solid #7c3aed',
            borderRadius: '8px',
            padding: '12px',
            margin: '8px 0',
            backgroundColor: '#faf5ff'
        }}>
            <h4 style={{
                margin: '0 0 8px 0',
                color: '#7c3aed',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>🔮</span>
                <span>{block.character} - Sphere Grid Actions</span>
            </h4>

            {/* S.Level Info */}
            {block.slvlInfo && (
                <div style={{
                    backgroundColor: '#f3e8ff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px',
                    fontStyle: 'italic',
                    color: '#7c3aed'
                }}>
                    <strong>S.Lvl:</strong> {block.slvlInfo}
                </div>
            )}

            {/* Inline Condition */}
            {block.inlineCondition && block.inlineCondition.length > 0 && (
                <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px'
                }}>
                    <strong style={{ color: '#92400e' }}>Condition:</strong>
                    <span style={{ marginLeft: '4px' }}>
                        {block.inlineCondition.map((condition, index) => (
                            <NodeRenderer
                                key={index}
                                node={condition}
                                path={[...path, 'inlineCondition', index]}
                            />
                        ))}
                    </span>
                </div>
            )}

            {/* Actions */}
            {block.actions && block.actions.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#7c3aed', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                        Actions:
                    </strong>
                    {block.actions.map((action, index) => (
                        <NodeRenderer
                            key={index}
                            node={action}
                            path={[...path, 'actions', index]}
                        />
                    ))}
                </div>
            )}

            {/* Associated Images */}
            {block.associatedImages && block.associatedImages.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#7c3aed', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                        Images:
                    </strong>
                    {block.associatedImages.map((image, index) => (
                        <NodeRenderer
                            key={index}
                            node={image}
                            path={[...path, 'associatedImages', index]}
                        />
                    ))}
                </div>
            )}

            {/* Tracked resources */}
            {block.trackedResourceUpdates && block.trackedResourceUpdates.length > 0 && (
                <div style={{
                    backgroundColor: '#e0e7ff',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    <strong style={{ color: '#3730a3' }}>Resource Updates:</strong>
                    <div style={{ marginTop: '2px' }}>
                        {block.trackedResourceUpdates.map((resource, index) => (
                            <span key={index} style={{ marginRight: '8px' }}>
                                {resource.name}: {resource.quantity > 0 ? '+' : ''}{resource.quantity} ({resource.updateType})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
