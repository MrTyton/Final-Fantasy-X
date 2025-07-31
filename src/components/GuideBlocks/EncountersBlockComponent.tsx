// src/components/GuideBlocks/EncountersBlockComponent.tsx
import React, { useMemo } from 'react';
import type {
  EncountersBlock as EncountersBlockType,
  ListItemElement as ListItemElementType,
  ConditionalBlock as ConditionalBlockType,
  ChapterContent
} from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import { TrackableRenderer } from '../Utils/TrackableRenderer';

// Props for the EncountersBlockComponent, including the block data and a parent scope key for context
interface EncountersBlockProps {
  blockData: EncountersBlockType; // The encounters block data, including all encounter steps and trackables
  parentScopeKey: string; // Unique string for generating keys and context for nested lists
}

// Main component for rendering an "Encounters" block, including a list of encounter strategies and tracked updates
const EncountersBlockComponent: React.FC<EncountersBlockProps> = ({ blockData, parentScopeKey }) => {
  // Access global settings (e.g., for debug/conditional border display)
  const { settings } = useGlobalState();

  // Style for the outer block container, visually distinguishing encounter sections
  const blockStyle: React.CSSProperties = {
    border: '1px solid #ffcc80', // Orange border for encounter context
    borderRadius: '4px',
    margin: '1em 0',
    backgroundColor: '#fff8e1', // Very light orange background
  };
  // Style for the block header, showing the section title
  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ff9800', // Deep orange header for emphasis
    color: 'white',
    padding: '8px 15px',
    fontSize: '1.1em',
    fontWeight: 'bold',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
  };
  // Style for the content area inside the block
  const contentStyle: React.CSSProperties = {
    padding: '15px',
  };

  // Memoized debug info for block-level trackables (resource updates or item flags)
  // Used for debug display if enabled in settings
  const allBlockTrackablesForDebug = useMemo(() => {
    return blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags;
  }, [blockData.trackedResourceUpdates, blockData.itemAcquisitionFlags]);

  // Render the encounters block, including header, strategy list, trackables, and optional debug info
  return (
    <div style={blockStyle}>
      {/* Header displays the section title for Encounters */}
      <div style={headerStyle}>ENCOUNTERS</div>
      <div style={contentStyle}>
        {/* Render the main list of encounter strategies, supporting list items and conditional blocks */}
        {blockData.content.length > 0 ? (
          <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
            {blockData.content.map((item, index) => {
              // Generate a unique scope key and React key for each item for proper React rendering and nested context
              const itemScopeKey = `${parentScopeKey}_encounteritem${index}`;
              const reactKey = `enc_cont_${itemScopeKey}`;

              // Render a single encounter step as a list item if type is 'listItem'
              if (item.type === 'listItem') {
                return (
                  <ListItemElementComponent
                    key={reactKey}
                    itemData={item as ListItemElementType}
                    parentScopeKey={itemScopeKey}
                    itemIndex={index}
                  />
                );
                // Render a conditional block (branching logic) using ContentRenderer if type is 'conditional'
              } else if (item.type === 'conditional') {
                return (
                  <ContentRenderer
                    key={reactKey}
                    contentItems={[item as ConditionalBlockType]}
                    currentScopeKey={itemScopeKey}
                  />
                );
                // Fallback for any other ChapterContent types (should not occur in normal usage)
              } else {
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
          // Fallback if no encounter strategies are defined for this section
          <p style={{ fontStyle: 'italic' }}>No specific encounter strategies defined.</p>
        )}

        {/* Render notes if they exist */}
        {blockData.notes && blockData.notes.length > 0 && (
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffcc80' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1em', color: '#333', margin: '0 0 8px 0' }}>Notes:</p>
            <div style={{ fontStyle: 'italic', color: '#555' }}>
              {blockData.notes.map((noteText, index) => (
                <span key={`note-${index}`}>
                  {noteText.text}
                  {index < blockData.notes!.length - 1 && ' '}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Render block-level resource updates and item acquisition flags using TrackableRenderer */}
        {(blockData.trackedResourceUpdates || blockData.itemAcquisitionFlags) && (
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #ffcc80' }}>
            <TrackableRenderer
              trackedResources={blockData.trackedResourceUpdates}
              itemFlags={blockData.itemAcquisitionFlags}
            />
          </div>
        )}

        {/* Optionally render debug info for block-level trackables if enabled in settings */}
        {settings.showConditionalBorders && allBlockTrackablesForDebug && (
          <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dotted #FFB74D', opacity: 0.8 }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9em', color: '#555', margin: '0 0 5px 0' }}>Block Trackables (Debug Info):</p>
            {/* List all tracked resource updates for debug purposes */}
            {blockData.trackedResourceUpdates?.map((update, idx) => <div key={`dbg-res-${update.id}-${idx}`} style={{ fontSize: '0.8em', marginLeft: '10px' }}>Res: {update.name} ({update.updateType}) [{update.id}]</div>)}
            {/* List all item acquisition flags for debug purposes */}
            {blockData.itemAcquisitionFlags?.map((flag, idx) => <div key={`dbg-flag-${flag.id}-${idx}`} style={{ fontSize: '0.8em', marginLeft: '10px' }}>Flag: {flag.itemName} ({flag.setType}) [{flag.id}]</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default EncountersBlockComponent;