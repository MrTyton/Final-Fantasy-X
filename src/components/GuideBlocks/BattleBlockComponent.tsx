// src/components/GuideBlocks/BattleBlockComponent.tsx
import React, { useMemo } from 'react';
import type {
    BattleBlock as BattleBlockType,
    ListItemElement as ListItemElementType,
    ConditionalBlock as ConditionalBlockType,
    FormattedText
} from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import InlineContentRenderer from '../InlineContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer'; // Import TrackableRenderer

// Remove ResourcePromptComponent and FlagPromptComponent definitions from here.
// They should be in their own files and imported by TrackableRenderer.

interface BattleBlockProps {
    blockData: BattleBlockType;
    parentScopeKey: string;
}

const BattleBlockComponent: React.FC<BattleBlockProps> = ({ blockData, parentScopeKey }) => {
    const { settings } = useGlobalState();

    const blockStyle: React.CSSProperties = {
        border: '1px solid #ffcdd2', borderRadius: '4px', margin: '1em 0', backgroundColor: '#ffebee',
    };
    const headerStyle: React.CSSProperties = {
        backgroundColor: '#d32f2f', color: 'white', padding: '10px 15px', fontSize: '1.2em',
        fontWeight: 'bold', borderTopLeftRadius: '3px', borderTopRightRadius: '3px',
    };
    const contentStyle: React.CSSProperties = { padding: '15px' };
    const strategyScopeKey = `${parentScopeKey}_battle_strategy`;

    // For debug display of what TrackableRenderer will process
    const allBlockTrackablesForDebug = useMemo(() => {
        return blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags;
    }, [blockData.trackedResourceUpdates, blockData.itemAcquisitionFlags]);


    return (
        <div style={blockStyle}>
            <div style={headerStyle}>
                {blockData.enemyName} {blockData.hp ? `- ${blockData.hp.toLocaleString()} HP` : ''}
            </div>
            <div style={contentStyle}>
                {/* Render Strategy Items */}
                {blockData.strategy.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0 0 15px 0' }}>
                        {blockData.strategy.map((item, index) => {
                            const itemKey = `strat-${index}`;
                            const itemScopeKey = `${strategyScopeKey}_item${index}`;
                            if (item.type === 'listItem') {
                                return (<ListItemElementComponent key={itemKey} itemData={item as ListItemElementType} parentScopeKey={itemScopeKey} itemIndex={index} />);
                            } else if (item.type === 'conditional') {
                                return (<li key={itemKey} style={{ listStyle: 'none', marginLeft: '-20px' }}><ContentRenderer contentItems={[item as ConditionalBlockType]} currentScopeKey={itemScopeKey} /></li>);
                            }
                            return <div key={itemKey} style={{ color: 'red' }}>Unknown strategy item type</div>;
                        })}
                    </ul>
                ) : (<p style={{ fontStyle: 'italic' }}>No specific strategy defined.</p>)}

                {/* Render Block-Level Notes */}
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

                {/* Delegate all block-level trackables to TrackableRenderer */}
                {(blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags) && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ffcdd2' }}>
                        <TrackableRenderer
                            trackedResources={blockData.trackedResourceUpdates}
                            itemFlags={blockData.itemAcquisitionFlags}
                        />
                    </div>
                )}

                {/* Optional: Keep the debug info section */}
                {settings.showConditionalBorders && allBlockTrackablesForDebug && (
                    <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffab91', opacity: 0.7 }}>
                        <p style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#555' }}>Block Trackables (Debug Info):</p>
                        {blockData.trackedResourceUpdates?.map((update, idx) => <div key={`dbg-res-${idx}`} style={{ fontSize: '0.8em' }}>Res: {update.name} ({update.updateType}) [{update.id}]</div>)}
                        {blockData.itemAcquisitionFlags?.map((flag, idx) => <div key={`dbg-flag-${idx}`} style={{ fontSize: '0.8em' }}>Flag: {flag.itemName} ({flag.setType}) [{flag.id}]</div>)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BattleBlockComponent;