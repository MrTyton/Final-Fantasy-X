// src/editor/blocks/BlitzballGameViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { BlitzballGameBlock } from '../../types';

interface BlitzballGameViewerProps {
    block: BlitzballGameBlock;
    path: (string | number)[];
}

export const BlitzballGameViewer: React.FC<BlitzballGameViewerProps> = ({ block, path }) => {
    return (
        <div style={{
            border: '2px solid #0ea5e9',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px 0',
            backgroundColor: '#f0f9ff'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                color: '#0369a1',
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                ⚽ Blitzball Game
            </h3>

            {/* Strategy */}
            {block.strategy && block.strategy.length > 0 && (
                <div>
                    <strong style={{ color: '#0369a1', marginBottom: '8px', display: 'block' }}>
                        Strategy:
                    </strong>
                    {block.strategy.map((item, index) => (
                        <NodeRenderer
                            key={index}
                            node={item}
                            path={[...path, 'strategy', index]}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
