// src/components/GuideBlocks/BattleBlockComponent.tsx
import React, { useMemo } from 'react';
import type {
    BattleBlock as BattleBlockType,
    ListItemElement as ListItemElementType,
    ConditionalBlock as ConditionalBlockType
} from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import InlineContentRenderer from '../InlineContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer';

// Props for the BattleBlockComponent, specifying the battle block data and a parent scope key for context and unique keys
interface BattleBlockProps {
    blockData: BattleBlockType; // The battle block data, including enemy name, HP, strategy, notes, and trackables
    parentScopeKey: string;     // Unique string for generating keys and context for nested lists/blocks
}

// Main component for rendering a styled block for boss or enemy encounters, including strategy, notes, and trackable updates
const BattleBlockComponent: React.FC<BattleBlockProps> = ({ blockData, parentScopeKey }) => {
    // Access global settings (e.g., for debug/conditional border display)
    const { settings } = useGlobalState();

    // Style for the outer battle block container, visually distinguishing battle sections
    const blockStyle: React.CSSProperties = {
        border: '1px solid #ffcdd2', // Light red border for battle context
        borderRadius: '4px',
        margin: '1em 0',
        backgroundColor: '#ffebee', // Very light red background
    };
    // Style for the block header, showing enemy name and HP
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#d32f2f', // Deep red header for emphasis
        color: 'white',
        padding: '10px 15px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px',
    };
    // Style for the content area inside the block
    const contentStyle: React.CSSProperties = { padding: '15px' };
    // Unique scope key for strategy list items, supporting nested/hierarchical lists
    const strategyScopeKey = `${parentScopeKey}_battle_strategy`;

    // Memoized debug info for block-level trackables (resource updates or item flags)
    // Used for debug display if enabled in settings
    const allBlockTrackablesForDebug = useMemo(() => {
        return blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags;
    }, [blockData.trackedResourceUpdates, blockData.itemAcquisitionFlags]);

    // Render the battle block, including header, strategy, notes, trackables, and optional debug info
    return (
        <div style={blockStyle}>
            {/* Header displays enemy name and HP if available */}
            <div style={headerStyle}>
                {blockData.enemyName} {blockData.hp ? `- ${blockData.hp.toLocaleString()} HP` : ''}
            </div>
            <div style={contentStyle}>
                {/* Render the list of strategy steps for this battle, supporting nested and conditional items */}
                {blockData.strategy.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0 0 15px 0' }}>
                        {blockData.strategy.map((item, index) => {
                            // Generate unique keys and scope for each strategy item
                            const itemKey = `strat-${index}`;
                            const itemScopeKey = `${strategyScopeKey}_item${index}`;
                            // Render a list item if type is 'listItem'
                            if (item.type === 'listItem') {
                                return (
                                    <ListItemElementComponent
                                        key={itemKey}
                                        itemData={item as ListItemElementType}
                                        parentScopeKey={itemScopeKey}
                                        itemIndex={index}
                                    />
                                );
                                // Render a conditional block if type is 'conditional'
                            } else if (item.type === 'conditional') {
                                return (
                                    <li key={itemKey} style={{ listStyle: 'none', marginLeft: '-20px' }}>
                                        <ContentRenderer contentItems={[item as ConditionalBlockType]} currentScopeKey={itemScopeKey} />
                                    </li>
                                );
                            }
                            // Fallback for unknown strategy item types
                            return <div key={itemKey} style={{ color: 'red' }}>Unknown strategy item type</div>;
                        })}
                    </ul>
                ) : (
                    // Fallback if no strategy steps are defined
                    <p style={{ fontStyle: 'italic' }}>No specific strategy defined.</p>
                )}

                {/* Render any block-level notes, if present, below the strategy list */}
                {blockData.notes && blockData.notes.length > 0 && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ffcdd2', fontSize: '0.9em' }}>
                        <strong>Notes:</strong>
                        {blockData.notes.map((note, index) => (
                            <div key={`note-${index}`} style={{ marginLeft: '10px', marginTop: '5px' }}>
                                <InlineContentRenderer element={note} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Render all block-level trackable resource updates and item acquisition flags using TrackableRenderer */}
                {(blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags) && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ffcdd2' }}>
                        <TrackableRenderer
                            trackedResources={blockData.trackedResourceUpdates}
                            itemFlags={blockData.itemAcquisitionFlags}
                        />
                    </div>
                )}

                {/* Optionally render debug info for block-level trackables if enabled in settings */}
                {settings.showConditionalBorders && allBlockTrackablesForDebug && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffab91', opacity: 0.7 }}>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#555' }}>Block Trackables (Debug Info):</p>
                        {blockData.trackedResourceUpdates?.map((update, idx) => (
                            <div key={`dbg-res-${idx}`} style={{ fontSize: '0.8em' }}>
                                Res: {update.name} ({update.updateType}) [{update.id}]
                            </div>
                        ))}
                        {blockData.itemAcquisitionFlags?.map((flag, idx) => (
                            <div key={`dbg-flag-${idx}`} style={{ fontSize: '0.8em' }}>
                                Flag: {flag.itemName} ({flag.setType}) [{flag.id}]
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BattleBlockComponent;