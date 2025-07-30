import React from 'react';
import { BattleBlockEditor } from './blocks/BattleBlockEditor';
import { InstructionListEditor } from './blocks/InstructionListEditor';
import { TextParagraphEditor } from './blocks/TextParagraphEditor';
import { ImageEditor } from './blocks/ImageEditor';
import { ConditionalEditor } from './blocks/ConditionalEditor';
import { ShopEditor } from './blocks/ShopEditor';
import { SphereGridEditor } from './blocks/SphereGridEditor';
import { SphereGridCharacterActionsEditor } from './blocks/SphereGridCharacterActionsEditor';
import { EncountersEditor } from './blocks/EncountersEditor';
import { TrialEditor } from './blocks/TrialEditor';
import { BlitzballGameEditor } from './blocks/BlitzballGameEditor';
import { EquipEditor } from './blocks/EquipEditor';
import { ListItemEditor } from './blocks/ListItemEditor';
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
            return <InstructionListEditor block={node as any} path={path} />;
        case 'battle':
            return <BattleBlockEditor block={node as any} path={path} />;
        case 'textParagraph':
            return <TextParagraphEditor block={node as any} path={path} />;
        case 'image':
            return <ImageEditor block={node as any} path={path} />;
        case 'conditional':
            return <ConditionalEditor block={node as any} path={path} />;
        case 'listItem':
            return <ListItemEditor block={node as any} path={path} />;

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
            return <SphereGridEditor block={node as any} path={path} />;
        case 'sphereGridCharacterActions':
            return <SphereGridCharacterActionsEditor block={node as any} path={path} />;
        case 'shop':
            return <ShopEditor block={node as any} path={path} />;
        case 'encounters':
            return <EncountersEditor block={node as any} path={path} />;
        case 'trial':
            return <TrialEditor block={node as any} path={path} />;
        case 'blitzballGame':
            return <BlitzballGameEditor block={node as any} path={path} />;
        case 'equip':
            return <EquipEditor block={node as any} path={path} />;
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