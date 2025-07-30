// src/editor/blocks/ShopViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { ShopBlock } from '../../types';

interface ShopViewerProps {
    block: ShopBlock;
    path: (string | number)[];
}

export const ShopViewer: React.FC<ShopViewerProps> = ({ block, path }) => {
    return (
        <div style={{ border: '1px solid #ffc107', backgroundColor: '#fffbf0', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0, color: '#856404' }}>
                Shop
            </h3>

            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#856404' }}>
                <strong>Gil Info:</strong> {block.gilInfo}
            </div>

            {block.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: '#856404', marginBottom: '8px' }}>{section.title}</h4>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                        {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} style={{ marginBottom: '4px' }}>
                                <NodeRenderer
                                    node={item}
                                    path={[...path, 'sections', sectionIndex, 'items', itemIndex]}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
