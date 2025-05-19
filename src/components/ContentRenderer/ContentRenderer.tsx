// src/components/ContentRenderer/ContentRenderer.tsx
import React, { JSX } from 'react';
import type { ChapterContent, FormattedText } from '../../types'; // ListItemElement is not a direct ChapterContent type

// Import ALL your real block components
import TextParagraphBlockComponent from '../GuideBlocks/TextParagraphBlockComponent';
import InstructionListBlockComponent from '../GuideBlocks/InstructionListBlockComponent';
import ImageBlockComponent from '../GuideBlocks/ImageBlockComponent';
import EquipBlockComponent from '../GuideBlocks/EquipBlockComponent';
import TrialBlockComponent from '../GuideBlocks/TrialBlockComponent';
import ShopBlockComponent from '../GuideBlocks/ShopBlockComponent';
import EncountersBlockComponent from '../GuideBlocks/EncountersBlockComponent';
import BlitzballGameBlockComponent from '../GuideBlocks/BlitzballGameBlockComponent';
import ConditionalBlockComponent from '../GuideBlocks/ConditionalBlockComponent';
import BattleBlockComponent from '../GuideBlocks/BattleBlockComponent';
import SphereGridBlockComponent from '../GuideBlocks/SphereGridBlockComponent';
// ListItemElementComponent is used by InstructionListBlockComponent and ConditionalBlockComponent's renderBranch,
// not directly by ContentRenderer for top-level ChapterContent items.

interface ContentRendererProps {
  contentItems: ChapterContent[] | FormattedText[]; // Accepts an array of ChapterContent or FormattedText
  currentScopeKey: string; // Used to build unique keys and scopes for children
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ contentItems, currentScopeKey }) => {
  if (!contentItems || contentItems.length === 0) {
    return null;
  }

  return (
    <> {/* Use React.Fragment to avoid adding an unnecessary div wrapper by default */}
      {contentItems.map((item, index) => {
        // Create a unique scope key for this specific block being rendered
        const itemSpecificScopeKey = `${currentScopeKey}_block${index}`;
        // Create a unique React key for this mapped element
        const reactKey = `${itemSpecificScopeKey}`; // Simpler key based on derived scope

        // Handle FormattedText[] case (e.g., for Acknowledgements if not pre-processed)
        if (!('type' in item)) {
            const ftItem = item as FormattedText;
            const style: React.CSSProperties = {};
            if (ftItem.isBold) style.fontWeight = 'bold';
            if (ftItem.isItalic) style.fontStyle = 'italic';
            if (ftItem.color) style.color = ftItem.color;
            if (ftItem.isLarge) style.fontSize = '1.2em'; // Added from FormattedText type
            if (ftItem.textDecoration) style.textDecoration = ftItem.textDecoration; // Added
            // displayHint on FormattedText is not directly handled here, assumed to be for specific contexts
            return <p key={reactKey} style={style}>{ftItem.text}</p>;
        }

        // Item is now confirmed or cast to ChapterContent
        const chapterItem = item as ChapterContent; 
        let componentToRender: JSX.Element | null = null;

        // Dispatch to the correct block component based on type
        // Each component receives its blockData and a parentScopeKey for its children's context
        switch (chapterItem.type) {
            case 'textParagraph': 
                componentToRender = <TextParagraphBlockComponent blockData={chapterItem} />; 
                break;
            case 'instructionList': 
                componentToRender = <InstructionListBlockComponent blockData={chapterItem} listScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'image': 
                componentToRender = <ImageBlockComponent blockData={chapterItem} />; 
                break;
            case 'equip': 
                componentToRender = <EquipBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'trial': 
                componentToRender = <TrialBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'shop': 
                componentToRender = <ShopBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'encounters': 
                componentToRender = <EncountersBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'blitzballGame': 
                componentToRender = <BlitzballGameBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'conditional': 
                componentToRender = <ConditionalBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'battle': 
                componentToRender = <BattleBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            case 'sphereGrid': 
                componentToRender = <SphereGridBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; 
                break;
            // No 'listItem' case here, as it's not a direct ChapterContent type.
            // ListItemElements are handled within InstructionListBlock or ConditionalBlock's renderBranch.
            default:
                // This will catch any type in ChapterContent union that's not handled above,
                // or if 'item' was not actually a ChapterContent type after the 'type' in item check.
                const _exhaustiveCheck: never = chapterItem; // For TypeScript exhaustiveness checking
                console.warn('Unsupported ChapterContent type in ContentRenderer:', JSON.stringify(chapterItem, null, 2));
                componentToRender = <div style={{color: 'red', border: '1px solid red', padding: '5px', margin: '5px 0'}}>Unsupported Content Block Type: {(chapterItem as any).type || 'Unknown Type'}</div>;
        }
        
        // Add the React key to the component instance if it was successfully created
        return componentToRender ? React.cloneElement(componentToRender, { key: reactKey }) : null;
      })}
    </>
  );
};

export default ContentRenderer;