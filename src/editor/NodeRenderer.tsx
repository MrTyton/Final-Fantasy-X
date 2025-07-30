import React from 'react';
import { BattleBlockViewer } from './blocks/BattleBlockViewer';
import { InstructionListViewer } from './blocks/InstructionListViewer';
import { TextParagraphViewer } from './blocks/TextParagraphViewer';
import { ImageViewer } from './blocks/ImageViewer';
import { ConditionalViewer } from './blocks/ConditionalViewer';
import { ShopViewer } from './blocks/ShopViewer';
import { SphereGridViewer } from './blocks/SphereGridViewer';
import { SphereGridCharacterActionsViewer } from './blocks/SphereGridCharacterActionsViewer';
import { EncountersViewer } from './blocks/EncountersViewer';
import { TrialViewer } from './blocks/TrialViewer';
import { BlitzballGameViewer } from './blocks/BlitzballGameViewer';
import { EquipViewer } from './blocks/EquipViewer';
import { ListItemViewer } from './blocks/ListItemViewer';
import { useEditorStore } from './store'; // <-- Import the store
import { PlainTextEditor } from './inline/PlainTextEditor';
import { FormattedTextEditor } from './inline/FormattedTextEditor';
import { CharacterReferenceEditor } from './inline/CharacterReferenceEditor';
import { CharacterCommandEditor } from './inline/CharacterCommandEditor';
import { GameMacroEditor } from './inline/GameMacroEditor';
import { LinkEditor } from './inline/LinkEditor';
import { NthEditor } from './inline/NthEditor';
import { NumberEditor } from './inline/NumberEditor';
import { MathSymbolEditor } from './inline/MathSymbolEditor';
import { FormationEditor } from './inline/FormationEditor';
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

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode); // <-- Get the update function

    switch (node.type) {
        // Block-level elements
        case 'instructionList':
            return <InstructionListViewer block={node as any} path={path} />;
        case 'battle':
            return <BattleBlockViewer block={node as any} path={path} />;
        case 'textParagraph':
            return <TextParagraphViewer block={node as any} path={path} />;
        case 'image':
            return <ImageViewer block={node as any} path={path} />;
        case 'conditional':
            return <ConditionalViewer block={node as any} path={path} />;
        case 'listItem':
            return <ListItemViewer block={node as any} path={path} />;

        // Inline element editors
        case 'plainText':
            return <PlainTextEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'formattedText':
            return <FormattedTextEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'characterReference':
            return <CharacterReferenceEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'characterCommand':
            return <CharacterCommandEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'gameMacro':
            return <GameMacroEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'link':
            return <LinkEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'nth':
            return <NthEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'num':
            return <NumberEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'mathSymbol':
            return <MathSymbolEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;
        case 'formation':
            return <FormationEditor node={node as any} onChange={(newNode) => updateNode(path, newNode)} />;

        // Block-level elements that need viewers
        case 'sphereGrid':
            return <SphereGridViewer block={node as any} path={path} />;
        case 'sphereGridCharacterActions':
            return <SphereGridCharacterActionsViewer block={node as any} path={path} />;
        case 'shop':
            return <ShopViewer block={node as any} path={path} />;
        case 'encounters':
            return <EncountersViewer block={node as any} path={path} />;
        case 'trial':
            return <TrialViewer block={node as any} path={path} />;
        case 'blitzballGame':
            return <BlitzballGameViewer block={node as any} path={path} />;
        case 'equip':
            return <EquipViewer block={node as any} path={path} />;
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