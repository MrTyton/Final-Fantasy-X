// src/components/GuideBlocks/ConditionalBlockComponent.tsx
import React from 'react';
import type {
  ConditionalBlock as ConditionalBlockType,
  ChapterContent,
  ListItemElement as ListItemElementType,
  InlineElement,
  ConditionalOption,
  FormattedText,
  TextParagraphBlock, // Added for explicit type in Blitzball pending note
} from '../../types';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import ContentRenderer from '../ContentRenderer/ContentRenderer';
import InlineContentRenderer from '../InlineContentRenderer';
import ListItemElementComponent from './ListItemElementComponent';
// Import the auto-generated map
import { JSON_FLAG_ID_TO_TRACKER_KEY_MAP } from '../../generated/flagIdToItemNameMap'; // Adjust path if needed

interface ConditionalBlockProps {
  blockData: ConditionalBlockType;
  parentScopeKey: string;
}

// Helper function to render notes consistently
const NotesRenderer: React.FC<{ notes: FormattedText[] | undefined, showBorders: boolean }> = ({ notes, showBorders }) => {
  if (!notes || notes.length === 0) return null;
  return (
    <div style={{
      fontSize: '0.9em',
      color: 'gray',
      marginTop: '10px',
      paddingLeft: showBorders ? '10px' : '0',
      borderTop: showBorders ? '1px solid #ccc' : 'none',
      paddingTop: showBorders ? '5px' : '0px'
    }}>
      <strong>Note:</strong>{' '}
      {notes.map((n, i) => <InlineContentRenderer key={`note-${i}`} element={n} />)}
    </div>
  );
};

const ConditionalBlockComponent: React.FC<ConditionalBlockProps> = ({ blockData, parentScopeKey }) => {
  const { tracker, settings } = useGlobalState();

  // --- Debug Styles ---
  const baseStyleWithMargin: React.CSSProperties = { margin: '1em 0' };
  const activeStateDrivenBranchStyle: React.CSSProperties = settings.showConditionalBorders ?
    { ...baseStyleWithMargin, padding: '10px', border: '1px dashed #4CAF50', borderRadius: '4px', background: '#E8F5E9' } :
    baseStyleWithMargin;
  const textualOptionContainerStyle: React.CSSProperties = baseStyleWithMargin;
  const textualOptionItemStyle: React.CSSProperties = settings.showConditionalBorders ?
    { marginBottom: '15px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#f9f9f9' } :
    { marginBottom: '15px' };
  const textualInlineIfThenBranchStyle: React.CSSProperties = settings.showConditionalBorders ?
    { padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#f9f9f9' } :
    {};
  // --- End Debug Styles ---

  // Helper to get the canonical tracker key for a flag ID from JSON
  const getActualTrackerFlagKey = (jsonFlagId: string): string => {
    const mappedKey = JSON_FLAG_ID_TO_TRACKER_KEY_MAP[jsonFlagId];
    if (mappedKey) {
      return mappedKey;
    }
    // If no mapping is found, use the provided flag ID directly as the tracker key.
    return jsonFlagId;
  };

  // Helper to render a branch of conditional content, supporting both lists and mixed content.
  const renderBranch = (
    branchContent: (ChapterContent | ListItemElementType | InlineElement)[] | undefined,
    branchKeySuffix: string
  ) => {
    if (!branchContent || branchContent.length === 0) return null;
    const branchBaseScopeKey = `${parentScopeKey}_${branchKeySuffix}`;
    const allAreListItems = branchContent.every(item => 'type' in item && item.type === 'listItem');

    if (allAreListItems) {
      // Render as a bulleted list if all items are list items.
      return (
        <ul style={{ listStylePosition: 'outside', paddingLeft: '20px', margin: '0.5em 0 0.5em 20px' }}>
          {branchContent.map((item, index) => {
            const itemKey = `${branchKeySuffix}_li_${index}`;
            const itemScopeKey = `${branchBaseScopeKey}_li${index}`;
            return (<ListItemElementComponent key={itemKey} itemData={item as ListItemElementType} parentScopeKey={itemScopeKey} itemIndex={index} />);
          })}
        </ul>
      );
    } else {
      // Render mixed or block content, handling inline and block types appropriately.
      return (
        <>
          {branchContent.map((item, index) => {
            const itemKey = `${branchKeySuffix}_item_${index}`;
            const itemScopeKey = `${branchBaseScopeKey}_item${index}`;
            if (!('type' in item)) { console.warn("Untyped item:", item); return <div key={itemKey} style={{ color: 'red' }}>Untyped.</div>; }
            const typedItem = item as { type: string };

            if (typedItem.type === 'listItem') {
              return (<ul key={itemKey} style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0.5em 0' }}><ListItemElementComponent itemData={item as ListItemElementType} parentScopeKey={itemScopeKey} itemIndex={index} /></ul>);
            }
            // Handle inline element types by rendering with InlineContentRenderer.
            const inlineTypes = ['plainText', 'formattedText', 'characterReference', 'characterCommand', 'gameMacro', 'formation', 'link', 'nth', 'num', 'mathSymbol'];
            if (inlineTypes.includes(typedItem.type)) {
              return <span key={itemKey} style={{ display: 'block', margin: '0.5em 0' }}><InlineContentRenderer element={item as InlineElement} /></span>;
            }
            // Default: render as a block using ContentRenderer.
            return <ContentRenderer key={itemKey} contentItems={[item as ChapterContent]} currentScopeKey={itemScopeKey} />;
          })}
        </>
      );
    }
  };

  // --- State for determining which branch to render based on the condition source ---
  let activeContentBranch: (ChapterContent | ListItemElementType | InlineElement)[] | undefined = undefined;
  let branchKeyForScope = 'default_branch';
  let blitzPendingNoteBlock: TextParagraphBlock | null = null;

  // Evaluate the condition source and select the appropriate content branch to render.
  switch (blockData.conditionSource) {
    case 'acquired_item_flag_check':
      if (blockData.flagName) {
        const trackerKey = getActualTrackerFlagKey(blockData.flagName);
        const flagValue = tracker.flags[trackerKey] === true;
        activeContentBranch = flagValue ? blockData.contentToShowIfTrue : blockData.contentToShowIfFalse;
        branchKeyForScope = flagValue ? `flag_${trackerKey}_true` : `flag_${trackerKey}_false`;
      } else { console.warn("ConditionalBlock: 'acquired_item_flag_check' missing flagName (expected flag ID).", blockData); }
      break;

    case 'tracked_resource_check':
      if (blockData.resourceName && blockData.comparison && blockData.value !== undefined) {
        const currentValue = tracker.resources[blockData.resourceName] || 0;
        let conditionMet = false;
        switch (blockData.comparison) {
          case 'less_than': conditionMet = currentValue < blockData.value; break;
          case 'greater_than_or_equal_to': conditionMet = currentValue >= blockData.value; break;
          case 'equals': conditionMet = currentValue === blockData.value; break;
          case 'not_equals': conditionMet = currentValue !== blockData.value; break;
        }
        activeContentBranch = conditionMet ? blockData.contentToShowIfTrue : blockData.contentToShowIfFalse;
        branchKeyForScope = conditionMet ? `res_${blockData.resourceName}_true` : `res_${blockData.resourceName}_false`;
      } else { console.warn("ConditionalBlock: 'tracked_resource_check' missing parameters.", blockData); }
      break;

    case 'blitzballdetermination':
    case 'ifthenelse_blitzresult':
      // Special handling for Blitzball outcome-based branching.
      const blitzFlagNameInTracker = 'BlitzballGameWon_Luca';
      const blitzResult = tracker.flags[blitzFlagNameInTracker];

      if (blitzResult === undefined) {
        // If the outcome is not yet determined, show default or both content and optionally a pending note.
        activeContentBranch = blockData.winContent || blockData.lossContent || blockData.bothContent;
        branchKeyForScope = 'blitz_pending_default';
        if (settings.showConditionalBorders) {
          blitzPendingNoteBlock = {
            type: 'textParagraph',
            content: [{
              type: 'formattedText',
              text: `(Blitzball outcome for "${blitzFlagNameInTracker}" pending, showing default strategy)`,
              isItalic: true,
              color: 'darkorange'
            }]
          };
        }
      } else if (blitzResult === true && blockData.winContent) {
        activeContentBranch = blockData.winContent; branchKeyForScope = 'blitz_win';
      } else if (blitzResult === false && blockData.lossContent) {
        activeContentBranch = blockData.lossContent; branchKeyForScope = 'blitz_loss';
      } else if (blockData.bothContent) {
        activeContentBranch = blockData.bothContent; branchKeyForScope = 'blitz_both';
      }
      break;

    case 'textual_direct_choice':
    case 'textual_block_options':
      // Render a set of textual options, each with its own condition text and content branch.
      return (
        <div className="conditional-textual-options" style={textualOptionContainerStyle}>
          {blockData.options?.map((option: ConditionalOption, index: number) => (
            <div key={index} style={textualOptionItemStyle}>
              <h4 style={{ marginTop: 0, marginBottom: '8px', fontStyle: 'italic', color: '#333', borderBottom: settings.showConditionalBorders ? '1px solid #ddd' : 'none', paddingBottom: '5px' }}>
                {option.conditionText}
              </h4>
              <div style={{ marginLeft: settings.showConditionalBorders ? '0px' : '20px' }}>
                {renderBranch(option.content, `option${index}`)}
              </div>
            </div>
          ))}
          <NotesRenderer notes={blockData.notes} showBorders={settings.showConditionalBorders} />
        </div>
      );

    case 'textual_inline_if_then':
      // Render an inline if-then-else block with condition and corresponding content branches.
      return (
        <div className="conditional-textual-inline" style={baseStyleWithMargin}>
          {blockData.textCondition && blockData.thenContent && (
            <div style={{ ...textualInlineIfThenBranchStyle, marginBottom: (blockData.elseContent ? '15px' : '0') }}>
              <div style={{ fontStyle: 'italic', color: '#555', marginBottom: '5px' }}>
                If:{' '}
                {blockData.textCondition.map((tc, i) => <InlineContentRenderer key={`tc-${i}`} element={tc} />)}
              </div>
              <div style={{ marginLeft: settings.showConditionalBorders ? '0px' : '20px' }}>
                {renderBranch(blockData.thenContent, 'then')}
              </div>
            </div>
          )}
          {blockData.elseContent && (
            <div style={{ ...textualInlineIfThenBranchStyle, marginTop: (blockData.textCondition && blockData.thenContent ? '10px' : '0') }}>
              <div style={{ fontStyle: 'italic', color: '#555', marginBottom: '5px' }}>Else:</div>
              <div style={{ marginLeft: settings.showConditionalBorders ? '0px' : '20px' }}>
                {renderBranch(blockData.elseContent, 'else')}
              </div>
            </div>
          )}
          <NotesRenderer notes={blockData.notes} showBorders={settings.showConditionalBorders} />
        </div>
      );

    default:
      // Fallback for unsupported or unknown condition sources. This ensures exhaustive type checking and provides a visible warning in the UI if an unknown conditionSource is encountered.
      const _exhaustiveCheckNever: never = blockData.conditionSource;
      console.warn('Unsupported conditionalSource:', blockData.conditionSource, _exhaustiveCheckNever);
      return <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>Unsupported Conditional Source: {blockData.conditionSource}</div>;
  }

  // For state-driven conditionals that evaluated to a single branch, render the active branch and any pending Blitzball note if needed.
  // shouldRenderContent: True if there is a content branch to render (not empty)
  const shouldRenderContent = activeContentBranch && activeContentBranch.length > 0;
  // shouldRenderBlitzNote: True if this is a Blitzball outcome conditional and a pending note should be shown
  const shouldRenderBlitzNote = (blockData.conditionSource === 'blitzballdetermination' || blockData.conditionSource === 'ifthenelse_blitzresult') && blitzPendingNoteBlock;

  // Render the active branch and/or pending Blitzball note, along with any notes, if applicable
  if (shouldRenderContent || shouldRenderBlitzNote) {
    return (
      <div className="conditional-active-branch" style={activeStateDrivenBranchStyle}>
        {/* Render the Blitzball pending note if needed */}
        {shouldRenderBlitzNote && <ContentRenderer contentItems={[blitzPendingNoteBlock!]} currentScopeKey={`${parentScopeKey}_blitznote`} />}
        {/* Render the main content branch for this conditional */}
        {shouldRenderContent && renderBranch(activeContentBranch!, branchKeyForScope)}
        {/* Render any notes associated with this conditional block */}
        <NotesRenderer notes={blockData.notes} showBorders={settings.showConditionalBorders} />
      </div>
    );
  }
  // If there is nothing to render, return null (renders nothing)
  return null;
};

export default ConditionalBlockComponent;