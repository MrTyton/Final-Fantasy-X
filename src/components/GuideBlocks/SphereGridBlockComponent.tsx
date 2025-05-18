// src/components/GuideBlocks/SphereGridBlockComponent.tsx
import React from 'react';
import type {
    SphereGridBlock as SphereGridBlockType,
    SphereGridCharacterActions,
    ConditionalBlock as ConditionalBlockType, // For casting
    ImageBlock as ImageBlockType,             // For casting
    ListItemElement as ListItemElementType    // For casting
} from '../../types';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For top-level conditionals or list items
import SphereGridCharacterActionsComponent from './SphereGridCharacterActionsComponent'; // We'll create this next

interface SphereGridBlockProps {
    blockData: SphereGridBlockType;
    parentScopeKey: string;
}

const SphereGridBlockComponent: React.FC<SphereGridBlockProps> = ({ blockData, parentScopeKey }) => {
    const blockStyle: React.CSSProperties = {
        border: '1px solid #b3e5fc', // Light blue border
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#e1f5fe', // Very light blue background
    };

    const headerStyle: React.CSSProperties = {
        backgroundColor: '#03a9f4', // Example color (Light Blue) - Color C for Sphere Grid
        color: 'white',
        padding: '8px 15px',
        fontSize: '1.1em',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
    };

    const contentStyle: React.CSSProperties = {
        padding: '15px',
    };

    return (
        <div style={blockStyle}>
            <div style={headerStyle}>SPHERE GRID</div>
            <div style={contentStyle}>
                {blockData.content.map((item, index) => {
                    const itemScopeKey = `${parentScopeKey}_sgitem${index}`;
                    switch (item.type) {
                        case 'sphereGridCharacterActions':
                            return (
                                <SphereGridCharacterActionsComponent
                                    key={index}
                                    actionsData={item as SphereGridCharacterActions}
                                    parentScopeKey={itemScopeKey}
                                />
                            );
                        case 'conditional':
                            // If a top-level conditional dictates which character actions to show
                            return (
                                <ContentRenderer
                                    key={index}
                                    contentItems={[item as ConditionalBlockType]} // ConditionalBlock expects array
                                    currentScopeKey={itemScopeKey}
                                />
                            );
                        case 'image': // Standalone image within a sphere grid block (less common)
                            return (
                                <ContentRenderer
                                    key={index}
                                    contentItems={[item as ImageBlockType]}
                                    currentScopeKey={itemScopeKey}
                                />
                            );
                        case 'listItem': // Standalone list item within a sphere grid block (less common)
                            // This would need to be wrapped in a <ul> or rendered by ListItemElementComponent directly
                            // For now, let ContentRenderer handle it if it can, or show placeholder
                            return (
                                <div style={{ border: '1px dashed orange', padding: '5px' }}>
                                    [Direct ListItem in SphereGridBlock - Needs specific handling or wrapping] -
                                    {(item as ListItemElementType).content.map(c => (c as any).text || (c as any).type).join(' ')}
                                </div>
                            )
                        default:
                            // This should not be hit if types are correct, but good for exhaustiveness
                            const _exhaustiveCheck: never = item;
                            console.warn("SphereGridBlock: Unknown content item type", _exhaustiveCheck);
                            return <div key={index} style={{ color: 'red' }}>Unknown Sphere Grid content type: {(item as any).type}</div>;
                    }
                })}
            </div>
        </div>
    );
};

export default SphereGridBlockComponent;