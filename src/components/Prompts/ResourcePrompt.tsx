// src/components/Prompts/ResourcePrompt.tsx
import React from 'react';
import type { TrackedResource } from '../../types';
import { useGlobalDispatch, useGlobalState, GlobalActionType } from '../../contexts/GlobalStateContext';
import InlineContentRenderer from '../InlineContentRenderer';

// Props for the ResourcePromptComponent, which renders a prompt for a tracked resource update
export interface ResourcePromptProps {
  resourceUpdate: TrackedResource; // The resource update object, including name, quantity, type, and description
}

// Main component for rendering a user-interactive or informational resource prompt
export const ResourcePromptComponent: React.FC<ResourcePromptProps> = ({ resourceUpdate }) => {
  // Access global dispatch for updating resource quantities
  const dispatch = useGlobalDispatch();
  // Access settings for debug/conditional border display
  const { settings } = useGlobalState();

  // State for the input field, used only by 'user_confirm' types
  // Initialize with the absolute quantity from JSON, as input should always be positive.
  const [inputValue, setInputValue] = React.useState(Math.abs(resourceUpdate.quantity));

  // Update inputValue if the resourceUpdate prop changes (e.g., different item selected)
  React.useEffect(() => {
    setInputValue(Math.abs(resourceUpdate.quantity));
  }, [resourceUpdate.quantity, resourceUpdate.id]); // Depend on quantity and ID to reset for new resource

  // Handler for confirming the resource update (dispatches the change to global state)
  const handleConfirm = () => {
    let changeAmount = inputValue; // User's input from the field
    // For consumption, make the change negative
    if (resourceUpdate.updateType === 'user_confirm_rng_consumption') {
      changeAmount = -inputValue;
    }
    // Only dispatch if resource name exists (should always be true)
    if (resourceUpdate.name) {
      dispatch({
        type: GlobalActionType.UPDATE_RESOURCE_QUANTITY,
        payload: { name: resourceUpdate.name, change: changeAmount }
      });
    }
    // Optionally, UI feedback could be added here (e.g., disable prompt, show confirmation, reset input)
  };

  // --- Conditional Rendering based on resourceUpdate.updateType ---

  // 1. Handle MANUAL "user_confirm" types (Interactive UI for user input)
  if (
    resourceUpdate.updateType === 'user_confirm_rng_gain' ||
    resourceUpdate.updateType === 'user_confirm_rng_consumption'
  ) {
    // Determine if this is a consumption (subtract) or gain (add)
    const isConsumption = resourceUpdate.updateType === 'user_confirm_rng_consumption';
    // Log for debugging which prompt is being rendered
    console.log(`[ResourcePromptComponent] Rendering INTERACTIVE UI for: ${resourceUpdate.name} (ID: ${resourceUpdate.id}, Type: ${resourceUpdate.updateType})`);
    return (
      <div style={{
        margin: '10px 0',
        padding: '12px',
        border: `2px solid ${isConsumption ? '#FFB74D' : '#81C784'}`, // Orange for consumption, Green for gain
        fontSize: '0.9em',
        borderRadius: '6px',
        backgroundColor: isConsumption ? '#FFF8E1' : '#E8F5E9', // Lighter shades
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px' // Consistent gap
      }}>
        {/* If there is a condition, render it above the prompt */}
        {resourceUpdate.condition && (
          <div style={{ fontStyle: 'italic', marginBottom: '5px', color: '#37474F', width: '100%' }}>
            If: {resourceUpdate.condition.map((el, i) => <InlineContentRenderer key={`cond-${resourceUpdate.id}-${i}`} element={el} />)}
          </div>
        )}
        {/* Label for the resource action (Gain/Consume) and resource name */}
        <span style={{ fontWeight: 'bold', color: '#263238' }}>
          {isConsumption ? 'Consume ' : 'Gain '}{resourceUpdate.name}:
        </span>
        {/* Numeric input for user to specify the quantity (can be negative for subtraction) */}
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(parseInt(e.target.value, 10) || 0)}
          style={{
            width: '60px',
            textAlign: 'right',
            padding: '5px',
            border: '1px solid #BDBDBD',
            borderRadius: '4px',
            fontSize: '1em',
          }}
        />
        {/* Confirm button to apply the resource update */}
        <button
          onClick={handleConfirm}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Confirm
        </button>
        {/* Optional description for the resource update, shown in smaller italic text */}
        {resourceUpdate.description && <small style={{ color: '#546E7A', fontStyle: 'italic' }}>({resourceUpdate.description})</small>}
      </div>
    );
  }

  // 2. Handle AUTOMATIC types (Informational display for debug mode only)
  // Only render this block if showConditionalBorders is enabled in settings
  if (settings.showConditionalBorders &&
    (resourceUpdate.updateType === 'auto_guaranteed' ||
      resourceUpdate.updateType === 'consumption_explicit_fixed' ||
      resourceUpdate.updateType === 'consumption_implicit_grid')) {
    // Log for debugging which auto-update is being rendered
    console.log(`[ResourcePromptComponent] Rendering DEBUG INFO for AUTO: ${resourceUpdate.name} (ID: ${resourceUpdate.id}, Type: ${resourceUpdate.updateType})`);
    return (
      <div style={{
        fontSize: '0.85em',
        color: '#424242', // Darker grey for better readability
        margin: '4px 0px 4px 0px', // No left indent, let parent handle if needed
        padding: '4px 8px',
        fontStyle: 'italic',
        backgroundColor: '#F5F5F5', // Very light grey background
        borderLeft: '3px solid #90A4AE', // Accent border
        borderRadius: '3px'
      }}>
        (Auto-Update: {resourceUpdate.name} {resourceUpdate.quantity > 0 ? `+${resourceUpdate.quantity}` : resourceUpdate.quantity} [{resourceUpdate.updateType}]
        {resourceUpdate.description && <small> - {resourceUpdate.description}</small>})
      </div>
    );
  }

  // If not a user_confirm type AND (it's not an auto type OR showConditionalBorders is false), render nothing.
  // This ensures prompts only appear when appropriate for the update type and settings.
  console.log(`[ResourcePromptComponent] Returning NULL for: ${resourceUpdate.name} (ID: ${resourceUpdate.id}, Type: ${resourceUpdate.updateType})`);
  return null;
};