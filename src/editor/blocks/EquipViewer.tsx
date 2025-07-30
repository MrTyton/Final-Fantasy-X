// src/editor/blocks/EquipViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { EquipBlock } from '../../types';

interface EquipViewerProps {
    block: EquipBlock;
    path: (string | number)[];
}

export const EquipViewer: React.FC<EquipViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px 0',
            backgroundColor: '#fef2f2'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#b91c1c',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                ⚔️ Equipment Setup
            </h3>

            {/* Content */}
            {block.content && block.content.length > 0 && (
                <div>
                    {block.content.map((item, index) => (
                        <NodeRenderer
                            key={index}
                            node={item}
                            path={[...path, 'content', index]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
