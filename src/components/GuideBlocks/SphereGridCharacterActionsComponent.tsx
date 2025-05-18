// src/components/GuideBlocks/SphereGridCharacterActionsComponent.tsx
import React from 'react';
import type {
  SphereGridCharacterActions, ImageBlock as ImageBlockType // Keep ImageBlockType for individual images
} from '../../types';
import ImageBlockComponent from './ImageBlockComponent';
import ListItemElementComponent from './ListItemElementComponent';
import ContentRenderer from '../ContentRenderer/ContentRenderer'; // For conditionals in actions
import InlineContentRenderer from '../InlineContentRenderer'; // For inlineCondition

interface SphereGridCharacterActionsProps {
  actionsData: SphereGridCharacterActions;
  parentScopeKey: string;
}

const SphereGridCharacterActionsComponent: React.FC<SphereGridCharacterActionsProps> = ({ actionsData, parentScopeKey }) => {
  // ... (styles: containerStyle, actionsColumnStyle, imageColumnStyle, characterHeaderStyle, etc. remain the same)
  const containerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '30px', paddingTop: '15px', borderTop: '1px dashed #b3e5fc' };
  const actionsColumnStyle: React.CSSProperties = { flex: '1 1 60%' };
  const imageColumnStyle: React.CSSProperties = { flex: '1 1 40%', minWidth: '200px' };
  const characterHeaderStyle: React.CSSProperties = { fontSize: '1.2em', fontWeight: 'bold', marginBottom: '10px', color: '#0277bd' };
  const slvlStyle: React.CSSProperties = { fontSize: '0.9em', fontStyle: 'italic', color: '#555', marginLeft: '10px' };
  const inlineConditionStyle: React.CSSProperties = { display: 'block', fontSize: '0.9em', fontStyle: 'italic', color: 'SaddleBrown', marginBottom: '10px' };


  return (
    <div style={containerStyle}> {/* Remember to handle first item's border styling if needed */}
      {/* Actions Column (Text) - Rendered first if you want text on left */}
      <div style={actionsColumnStyle}>
        <h4 style={characterHeaderStyle}>
          {actionsData.character}
          {actionsData.slvlInfo && <span style={slvlStyle}>({actionsData.slvlInfo})</span>}
        </h4>
        {actionsData.inlineCondition && actionsData.inlineCondition.length > 0 && (
          <div style={inlineConditionStyle}>
            {actionsData.inlineCondition.map((text, idx) => (
              <InlineContentRenderer key={idx} element={text} />
            ))}
          </div>
        )}
        {actionsData.actions.length > 0 ? (
          <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: 0 }}>
            {actionsData.actions.map((actionItem, index) => {
              const itemScopeKey = `${parentScopeKey}_action${index}`;
              if (actionItem.type === 'listItem') {
                return (<ListItemElementComponent key={`sg-actionitem-${index}`} itemData={actionItem} parentScopeKey={itemScopeKey} itemIndex={index} />);
              } else if (actionItem.type === 'conditional') {
                return (<li key={`sg-actioncond-${index}`} style={{ listStyle: 'none', marginLeft: '-20px' }}> <ContentRenderer contentItems={[actionItem]} currentScopeKey={itemScopeKey} /> </li>);
              } else {
                return <li key={index} style={{ color: 'red' }}>Unknown action item type</li>;
              }
            })}
          </ul>
        ) : (
          <p>No actions defined for {actionsData.character}.</p>
        )}
      </div>

      {/* Image Column - Rendered second if you want images on right */}
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