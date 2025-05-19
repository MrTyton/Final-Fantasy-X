// src/components/GuideBlocks/EncountersBlockComponent.tsx
import React, { useMemo } from 'react';
import type { 
    EncountersBlock as EncountersBlockType, 
    ListItemElement as ListItemElementType, 
    ConditionalBlock as ConditionalBlockType,
    ChapterContent // For casting
} from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer';

interface EncountersBlockProps {
  blockData: EncountersBlockType;
  parentScopeKey: string;
}

const EncountersBlockComponent: React.FC<EncountersBlockProps> = ({ blockData, parentScopeKey }) => {
  const { settings } = useGlobalState();

  const blockStyle: React.CSSProperties = {
    border: '1px solid #ffcc80', 
    borderRadius: '4px',
    margin: '1em 0',
    backgroundColor: '#fff8e1', 
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ff9800', 
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

  // For debug display of what TrackableRenderer will process for block-level items
  const allBlockTrackablesForDebug = useMemo(() => {
      return blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags;
  }, [blockData.trackedResourceUpdates, blockData.itemAcquisitionFlags]);

  return (
    <div style={blockStyle}>
      <div style={headerStyle}>ENCOUNTERS</div>
      <div style={contentStyle}>
        {/* Render main content (list of strategies) */}
        {blockData.content.length > 0 ? (
          <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
            {blockData.content.map((item, index) => {
              // Create a unique scope key for this item within the EncountersBlock
              const itemScopeKey = `${parentScopeKey}_encounteritem${index}`;
              // Create a unique React key for this mapped element
              const reactKey = `enc_cont_${itemScopeKey}`; 

              if (item.type === 'listItem') {
                return (
                  <ListItemElementComponent
                    key={reactKey} 
                    itemData={item as ListItemElementType}
                    parentScopeKey={itemScopeKey} // This becomes the parent scope for content within the LI
                    itemIndex={index} // Index of this LI within the EncountersBlock.content
                  />
                );
              } else if (item.type === 'conditional') {
                return (
                  // ConditionalBlock is not an <li> itself, render it directly.
                  // ContentRenderer will handle its rendering.
                  <ContentRenderer 
                    key={reactKey} 
                    contentItems={[item as ConditionalBlockType]} // Pass as a single-item array
                    currentScopeKey={itemScopeKey} // This scope for content within the conditional
                  />
                );
              } else {
                 // Fallback for any other ChapterContent types (should not happen based on type definition)
                console.warn("Unexpected type in EncountersBlock content:", item);
                return ( 
                    <ContentRenderer 
                        key={reactKey} 
                        contentItems={[item as ChapterContent]} 
                        currentScopeKey={itemScopeKey} 
                    /> 
                );
              }
            })}
          </ul>
        ) : (
          <p style={{ fontStyle: 'italic' }}>No specific encounter strategies defined.</p>
        )}

        {/* Delegate all block-level trackables to TrackableRenderer */}
        {(blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags) && (
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffcc80' }}>
            <TrackableRenderer 
              trackedResources={blockData.trackedResourceUpdates}
              itemFlags={blockData.itemAcquisitionFlags}
              // No parentKeyPrefix needed if TrackableRenderer uses item.id for its internal keys
            />
          </div>
        )}

        {/* Optional: Keep the debug info section for what TrackableRenderer is handling */}
        {settings.showConditionalBorders && allBlockTrackablesForDebug && (
           <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dotted #FFB74D', opacity: 0.8 }}>
            <p style={{fontWeight: 'bold', fontSize: '0.9em', color: '#555', margin:'0 0 5px 0'}}>Block Trackables (Debug Info):</p>
            {/* Ensure keys are unique for these debug map items too */}
            {blockData.trackedResourceUpdates?.map((update, idx) => <div key={`dbg-res-${update.id}-${idx}`} style={{fontSize:'0.8em', marginLeft:'10px'}}>Res: {update.name} ({update.updateType}) [{update.id}]</div>)}
            {blockData.itemAcquisitionFlags?.map((flag, idx) => <div key={`dbg-flag-${flag.id}-${idx}`} style={{fontSize:'0.8em', marginLeft:'10px'}}>Flag: {flag.itemName} ({flag.setType}) [{flag.id}]</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncountersBlockComponent;