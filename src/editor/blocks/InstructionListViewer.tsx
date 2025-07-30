// src/editor/blocks/InstructionListViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { InstructionListBlock, ListItemElement } from '../../types';

interface InstructionListViewerProps {
    block: InstructionListBlock;
    path: (string | number)[]; // The path to this InstructionListBlock itself
}

/**
 * A sub-component responsible for rendering a single <li> item.
 * It maps over the item's 'content' array and passes the full path to each element.
 */
const InstructionListItemRenderer: React.FC<{ item: ListItemElement; itemPath: (string | number)[] }> = ({ item, itemPath }) => {
    return (
        <li style={{ marginBottom: '5px' }}>
            {/* The content of a list item is an array of inline elements */}
            {item.content.map((contentNode, contentIndex) => (
                <NodeRenderer
                    key={contentIndex}
                    node={contentNode}
                    // The path is built by extending the parent's path
                    path={[...itemPath, 'content', contentIndex]}
                />
            ))}
        </li>
    );
};

export const InstructionListViewer: React.FC<InstructionListViewerProps> = ({ block, path }) => {
    const ListComponent = block.ordered ? 'ol' : 'ul';

    return (
        <div style={{ border: '1px solid #e0e0e0', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
            <strong style={{ color: '#007acc', marginBottom: '10px', display: 'block' }}>
                {block.ordered ? 'Ordered List' : 'Unordered List'}
            </strong>
            <ListComponent style={{ paddingLeft: '20px', margin: 0 }}>
                {block.items.map((item, index) => (
                    <InstructionListItemRenderer
                        key={index}
                        item={item}
                        // The path to each item is the block's path + 'items' + its index
                        itemPath={[...path, 'items', index]}
                    />
                ))}
            </ListComponent>
        </div>
    );
};