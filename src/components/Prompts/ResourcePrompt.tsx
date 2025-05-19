// src/components/Prompts/ResourcePrompt.tsx
import React from 'react';
import type { TrackedResource } from '../../types';
import { useGlobalDispatch, useGlobalState, GlobalActionType } from '../../contexts/GlobalStateContext';
import InlineContentRenderer from '../InlineContentRenderer'; // Assuming path is correct for types.ts

export interface ResourcePromptProps {
  resourceUpdate: TrackedResource;
}

export const ResourcePromptComponent: React.FC<ResourcePromptProps> = ({ resourceUpdate }) => {
  const dispatch = useGlobalDispatch();
  const { settings } = useGlobalState(); // To check for showConditionalBorders
  
  // State for the input field, used only by 'user_confirm' types
  // Initialize with the absolute quantity from JSON, as input should always be positive.
  const [inputValue, setInputValue] = React.useState(Math.abs(resourceUpdate.quantity));

  // Update inputValue if the resourceUpdate prop changes (e.g., different item selected)
  React.useEffect(() => {
    setInputValue(Math.abs(resourceUpdate.quantity));
  }, [resourceUpdate.quantity, resourceUpdate.id]); // Depend on quantity and ID to reset for new resource

  const handleConfirm = () => {
    let changeAmount = inputValue; // User's input from the field
    if (resourceUpdate.updateType === 'user_confirm_rng_consumption') {
      changeAmount = -inputValue; // Make it negative for consumption
    }
    
    // Only dispatch if there's an actual change planned, 
    // or if it's a gain of 0 (e.g. user explicitly enters 0) you might still want to record the interaction.
    // For simplicity, dispatching even for 0 change from user_confirm types.
    if (resourceUpdate.name) { // Ensure name exists
        dispatch({ 
          type: GlobalActionType.UPDATE_RESOURCE_QUANTITY, 
          payload: { name: resourceUpdate.name, change: changeAmount } 
        });
    }
    // TODO: Add UI feedback after confirmation, e.g., disable prompt, show "Confirmed!", or reset inputValue.
    // For example, you might want to reset inputValue to the default if it's a repeatable action:
    // setInputValue(Math.abs(resourceUpdate.quantity)); 
  };

  // --- Conditional Rendering based on resourceUpdate.updateType ---

  // 1. Handle MANUAL "user_confirm" types (Interactive UI)
  if (
    resourceUpdate.updateType === 'user_confirm_rng_gain' || 
    resourceUpdate.updateType === 'user_confirm_rng_consumption'
  ) {
    const isConsumption = resourceUpdate.updateType === 'user_confirm_rng_consumption';
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
        {resourceUpdate.condition && (
          <div style={{fontStyle:'italic', marginBottom:'5px', color: '#37474F', width: '100%'}}>
            If: {resourceUpdate.condition.map((el,i)=><InlineContentRenderer key={`cond-${resourceUpdate.id}-${i}`} element={el}/>)}
          </div>
        )}
        <span style={{fontWeight: 'bold', color: '#263238'}}>
            {isConsumption ? 'Consume ' : 'Gain '}{resourceUpdate.name}:
        </span>
        <input 
            type="number" 
            min="0" // Prevent negative numbers in input
            value={inputValue} 
            onChange={e => setInputValue(Math.max(0, parseInt(e.target.value,10) || 0))} 
            style={{
                width: '60px', 
                textAlign: 'right', 
                padding: '5px', 
                border: '1px solid #BDBDBD', 
                borderRadius: '4px',
                fontSize: '1em',
            }}
        />
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
        {resourceUpdate.description && <small style={{color: '#546E7A', fontStyle: 'italic'}}>({resourceUpdate.description})</small>}
      </div>
    );
  }

  // 2. Handle AUTOMATIC types (Informational display for debug mode)
  // This block is only entered if the first 'if' (for user_confirm types) is FALSE.
  if (settings.showConditionalBorders && 
      (resourceUpdate.updateType === 'auto_guaranteed' || 
       resourceUpdate.updateType === 'consumption_explicit_fixed' || 
       resourceUpdate.updateType === 'consumption_implicit_grid')) {
    console.log(`[ResourcePromptComponent] Rendering DEBUG INFO for AUTO: ${resourceUpdate.name} (ID: ${resourceUpdate.id}, Type: ${resourceUpdate.updateType})`);
    return ( 
        <div style={{
            fontSize: '0.85em', 
            color: '#424242', // Darker grey for better readability
            margin: '4px 0px 4px 0px', // No left indent, let parent handle if needed
            padding: '4px 8px', 
            fontStyle:'italic', 
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
  console.log(`[ResourcePromptComponent] Returning NULL for: ${resourceUpdate.name} (ID: ${resourceUpdate.id}, Type: ${resourceUpdate.updateType})`);
  return null; 
};