// src/components/ContentRenderer/ContentRenderer.tsx
import React, { JSX } from 'react';
import type { ChapterContent, FormattedText, ListItemElement as ListItemElementType } from '../../types';

// NO ViewportTrigger import here

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

interface ContentRendererProps {
    contentItems: ChapterContent[] | FormattedText[];
    currentScopeKey: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ contentItems, currentScopeKey }) => {
    if (!contentItems || contentItems.length === 0) {
        return null;
    }

    return (
        <>
            {contentItems.map((item, index) => {
                const itemSpecificScopeKey = `${currentScopeKey}_block${index}`;
                // Use a more robust key if items have IDs, otherwise fallback.
                const itemKey = (item as any).id ? `content-${(item as any).id}` : `content-${itemSpecificScopeKey}-${index}`;

                if (!('type' in item)) {
                    const ftItem = item as FormattedText;
                    const style: React.CSSProperties = {};
                    if (ftItem.isBold) style.fontWeight = 'bold';
                    if (ftItem.isItalic) style.fontStyle = 'italic';
                    if (ftItem.color) style.color = ftItem.color;
                    return <p key={itemKey} style={style}>{ftItem.text}</p>;
                }

                const chapterItem = item as ChapterContent;
                let componentToRender: JSX.Element | null = null;

                switch (chapterItem.type) {
                    case 'textParagraph': componentToRender = <TextParagraphBlockComponent blockData={chapterItem} />; break;
                    case 'instructionList': componentToRender = <InstructionListBlockComponent blockData={chapterItem} listScopeKey={itemSpecificScopeKey} />; break;
                    case 'image': componentToRender = <ImageBlockComponent blockData={chapterItem} />; break;
                    case 'equip': componentToRender = <EquipBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'trial': componentToRender = <TrialBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'shop': componentToRender = <ShopBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'encounters': componentToRender = <EncountersBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'blitzballGame': componentToRender = <BlitzballGameBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'conditional': componentToRender = <ConditionalBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'battle': componentToRender = <BattleBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    case 'sphereGrid': componentToRender = <SphereGridBlockComponent blockData={chapterItem} parentScopeKey={itemSpecificScopeKey} />; break;
                    default:
                        const _exhaustiveCheck: never = chapterItem;
                        console.warn('Unsupported ChapterContent type in ContentRenderer:', _exhaustiveCheck);
                        componentToRender = <div style={{ color: 'red' }}>Unsupported: {(chapterItem as any).type}</div>;
                }

                // Add key directly to the component instance
                return componentToRender ? React.cloneElement(componentToRender, { key: itemKey }) : null;
            })}
        </>
    );
};

export default ContentRenderer;