// src/editor/blocks/SphereGridViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { SphereGridBlock } from '../../types';

interface SphereGridViewerProps {
    block: SphereGridBlock;
    path: (string | number)[];
}

export const SphereGridViewer: React.FC<SphereGridViewerProps> = ({ block, path }) => {
    return (
        <div style={{ border: '2px solid #17a2b8', backgroundColor: '#f0faff', padding: '15px', margin: '10px 0', borderRadius: '6px' }}>
            <h3 style={{ marginTop: 0, color: '#117a8b' }}>
                Sphere Grid
                {block.contextInfo && <span style={{ color: '#6c757d', fontWeight: 'normal', fontSize: '14px' }}> - {block.contextInfo}</span>}
            </h3>

            <div>
                {block.content.map((contentItem, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                        <NodeRenderer
                            node={contentItem}
                            path={[...path, 'content', index]}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
