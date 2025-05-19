// src/components/GuideBlocks/SphereGridCharacterActionsComponent.tsx
// SphereGridCharacterActionsComponent renders a character's Sphere Grid actions, including inline conditions and associated images.
// It supports rendering a list of actions (with nested conditionals), and a column of images if present.

import React from 'react';
import type {
  SphereGridCharacterActions, // Data structure for a character's Sphere Grid actions
} from '../../types';
import ImageBlockComponent from './ImageBlockComponent';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For rendering conditional actions
import InlineContentRenderer from '../InlineContentRenderer'; // For rendering inline condition text

// Props for the SphereGridCharacterActionsComponent, including the character's actions data and a parent scope key for context
interface SphereGridCharacterActionsProps {
  actionsData: SphereGridCharacterActions; // The character's Sphere Grid actions, including actions, inline conditions, and images
  parentScopeKey: string; // Unique string for generating keys and context for nested lists/blocks
}

const SphereGridCharacterActionsComponent: React.FC<SphereGridCharacterActionsProps> = ({ actionsData, parentScopeKey }) => {
  // Styles for the container, actions column, image column, character header, S.LvL info, and inline condition text
  const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '30px', paddingTop: '15px', borderTop: '1px dashed #b3e5fc' };
  const actionsColumnStyle: React.CSSProperties = { flex: '1 1 60%' };
  const imageColumnStyle: React.CSSProperties = { flex: '1 1 40%', minWidth: '200px' };
  const characterHeaderStyle: React.CSSProperties = { fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px', color: '#0277bd' };
  const slvlStyle: React.CSSProperties = { fontSize: '0.9em', fontStyle: 'italic', color: '#555', marginLeft: '10px' };
  const inlineConditionStyle: React.CSSProperties = { display: 'block', fontSize: '0.9em', fontStyle: 'italic', color: 'SaddleBrown', marginBottom: '10px' };

  // Render the character's Sphere Grid actions, including inline conditions and associated images
  return (
    <div style={containerStyle}> {/* Flex container for actions and images columns */}
      {/* Actions Column (Text) - Contains character name, S.LvL info, inline conditions, and the list of actions */}
      <div style={actionsColumnStyle}>
        {/* Character name and S.LvL info (if present) */}
        <h4 style={characterHeaderStyle}>
          {actionsData.character}
          {actionsData.slvlInfo && <span style={slvlStyle}>({actionsData.slvlInfo})</span>}
        </h4>
        {/* Inline condition text, if present, rendered above the actions list */}
        {actionsData.inlineCondition && actionsData.inlineCondition.length > 0 && (
          <div style={inlineConditionStyle}>
            {actionsData.inlineCondition.map((text, idx) => (
              <InlineContentRenderer key={idx} element={text} />
            ))}
          </div>
        )}
        {/* List of actions for the character, each can be a list item or a conditional block */}
        {actionsData.actions.length > 0 ? (
          <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
            {actionsData.actions.map((actionItem, index) => {
              // Generate a unique scope key for each action item for nested context and React keys
              const itemScopeKey = `${parentScopeKey}_action${index}`;
              // Render a list item if type is 'listItem'
              if (actionItem.type === 'listItem') {
                return (
                  <ListItemElementComponent
                    key={`sg-actionitem-${index}`}
                    itemData={actionItem}
                    parentScopeKey={itemScopeKey}
                    itemIndex={index}
                  />
                );
                // Render a conditional block if type is 'conditional'
              } else if (actionItem.type === 'conditional') {
                return (
                  <li key={`sg-actioncond-${index}`} style={{ listStyle: 'none', marginLeft: '-20px' }}>
                    <ContentRenderer contentItems={[actionItem]} currentScopeKey={itemScopeKey} />
                  </li>
                );
                // Fallback for unknown action item types
              } else {
                return <li key={index} style={{ color: 'red' }}>Unknown action item type</li>;
              }
            })}
          </ul>
        ) : (
          // Fallback if no actions are defined for this character
          <p>No actions defined for {actionsData.character}.</p>
        )}
      </div>

      {/* Image Column - Renders associated images for the character's actions, if any exist */}
      {actionsData.associatedImages && actionsData.associatedImages.length > 0 && (
        <div style={imageColumnStyle}>
          {actionsData.associatedImages.map((imgBlock, idx) => (
            <div key={`assoc-img-${idx}`} style={{ marginBottom: idx < actionsData.associatedImages!.length - 1 ? '10px' : '0' }}>
              <ImageBlockComponent blockData={imgBlock} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SphereGridCharacterActionsComponent;