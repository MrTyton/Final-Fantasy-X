// src/components/ContentRenderer/ContentRenderer.tsx
import React, { JSX } from 'react';
import type { ChapterContent, FormattedText } from '../../types';

// Import all block components that correspond to possible ChapterContent types
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
// Note: ListItemElementComponent is not used directly here; it is used within other block components for nested content.

interface ContentRendererProps {
    // contentItems: Array of ChapterContent blocks or FormattedText objects to render
    contentItems: ChapterContent[] | FormattedText[];
    // currentScopeKey: Unique string used to generate keys and context for nested components
    currentScopeKey: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ contentItems, currentScopeKey }) => {
    // If there are no content items, render nothing
    if (!contentItems || contentItems.length === 0) {
        return null;
    }

    return (
        // Use React.Fragment to avoid unnecessary DOM wrappers
        <>
            {contentItems.map((item, index) => {
                // Generate a unique scope key for this block instance for use by child components
                const itemSpecificScopeKey = `${currentScopeKey}_block${index}`;
                // Generate a unique React key for this mapped element
                const reactKey = `${itemSpecificScopeKey}`;

                // If the item does not have a 'type' property, treat it as FormattedText (e.g., for acknowledgements or inline text)
                if (!('type' in item)) {
                    const ftItem = item as FormattedText;
                    const style: React.CSSProperties = {};
                    if (ftItem.isBold) style.fontWeight = 'bold';
                    if (ftItem.isItalic) style.fontStyle = 'italic';
                    if (ftItem.color) style.color = ftItem.color;
                    if (ftItem.isLarge) style.fontSize = '1.2em';
                    if (ftItem.textDecoration) style.textDecoration = ftItem.textDecoration;
                    // displayHint is not handled here; assumed to be for special contexts
                    return <p key={reactKey} style={style}>{ftItem.text}</p>;
                }

                // At this point, item is a ChapterContent block; select the appropriate component to render based on its type
                const chapterItem = item as ChapterContent;
                let componentToRender: JSX.Element | null = null;

                // Render the correct block component for each ChapterContent type
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
                    // No 'listItem' case: ListItemElements are handled within their parent block components, not here.
                    default:
                        // If an unsupported ChapterContent type is encountered, render a warning and log to console
                        console.warn('Unsupported ChapterContent type in ContentRenderer:', JSON.stringify(chapterItem, null, 2));
                        componentToRender = <div style={{ color: 'red', border: '1px solid red', padding: '5px', margin: '5px 0' }}>Unsupported Content Block Type: {(chapterItem as any).type || 'Unknown Type'}</div>;
                }
                // Return the rendered component with a unique key, or null if not rendered
                return componentToRender ? React.cloneElement(componentToRender, { key: reactKey }) : null;
            })}
        </>
    );
};

export default ContentRenderer;