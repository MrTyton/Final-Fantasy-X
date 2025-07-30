// src/editor/NodeRenderer.tsx
import React from 'react';
import { BattleBlockViewer } from './blocks/BattleBlockViewer';
import { InstructionListViewer } from './blocks/InstructionListViewer';
import { useEditorStore } from './store'; // <-- Import the store
import { PlainTextEditor } from './inline/PlainTextEditor'; // <-- Import our new editor
// Import other viewers as we create them

// A generic "node" can be any object from our schema with a 'type' property
interface Node {
    type: string;
    [key: string]: any;
}

interface NodeRendererProps {
    node: Node;
    path: (string | number)[]; // <-- Add path prop
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node }) => {
    const updateNode = useEditorStore((state) => state.updateNode); // <-- Get the update function

    switch (node.type) {
        case 'instructionList':
            // Pass the path down to the children
            return <InstructionListViewer block={node as any} path={path} />;
        case 'battle':
            return <BattleBlockViewer block={node as any} />;
        // case 'image': return <ImageViewer block={node} />;
        // case 'textParagraph': return <TextParagraphViewer block={node} />;
        // ... etc.
        case 'plainText':
            return <PlainTextEditor node={node} onChange={(newNode) => updateNode(path, newNode)} />;
        // Default fallback for any type we haven't implemented yet
        default:
            return (
                <div style={{ border: '1px dashed grey', margin: '4px', padding: '4px' }}>
                    <p>
                        <strong>Type:</strong> {node.type} (Viewer not implemented)
                    </p>
                    <pre>{JSON.stringify(node, null, 2)}</pre>
                </div>
            );
    }
};