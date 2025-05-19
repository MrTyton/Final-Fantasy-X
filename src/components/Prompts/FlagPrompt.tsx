// src/components/Prompts/FlagPrompt.tsx
import React from 'react';
import type { AcquiredItemFlag } from '../../types';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';

// --- STYLES ---
// Container for the toggle switch and label. Visually groups the flag prompt and makes the whole area clickable.
const toggleSwitchContainerStyle: React.CSSProperties = {
  margin: '8px 0',
  padding: '10px 12px', // Slightly more padding for better click area
  border: '1px solid #B0BEC5',
  fontSize: '0.95em',
  borderRadius: '4px',
  backgroundColor: '#ECEFF1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer', // Make the whole container indicate clickability
  userSelect: 'none',  // Prevent text selection on click
};
// Style for the label text next to the toggle switch.
const toggleSwitchLabelStyle: React.CSSProperties = {
  marginRight: '15px',
  // flexGrow: 1, // Allow label to take available space if needed
};
// Style for the visual toggle switch (outer track).
const toggleSwitchStyle: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  width: '50px',
  height: '26px',
  flexShrink: 0, // Prevent switch from shrinking if label is long
};
// Style for the hidden checkbox input (for accessibility, not used directly here).
const toggleSwitchInputStyle: React.CSSProperties = {
  opacity: 0,
  width: 0,
  height: 0,
  position: 'absolute', // Take it out of flow but still allow focus/interaction
};
// Style for the slider (background track of the toggle switch).
const sliderStyle: React.CSSProperties = {
  position: 'absolute',
  // cursor: 'pointer', // Moved to container
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: '#ccc',
  transition: '.3s',
  borderRadius: '26px',
};
// Style for the knob (circle) of the toggle switch.
const sliderBeforeStyle: React.CSSProperties = {
  position: 'absolute',
  content: '""',
  height: '20px', width: '20px',
  left: '3px', bottom: '3px',
  backgroundColor: 'white',
  transition: '.3s',
  borderRadius: '50%',
};
// --- END STYLES ---

// Props for the FlagPromptComponent, which renders a toggle for a user-interactive flag.
export interface FlagPromptProps {
  flag: AcquiredItemFlag; // The flag object, including name, setType, and prompt text
}

// Main component for rendering a user-interactive flag prompt as a toggle switch.
export const FlagPromptComponent: React.FC<FlagPromptProps> = ({ flag }) => {
  // Access tracker state and dispatch for updating flag values
  const { tracker } = useGlobalState();
  const dispatch = useGlobalDispatch();

  // Use flag.itemName as the key for tracker.flags
  const trackerKey = flag.itemName;
  // Get the current value of the flag from the tracker (default to false if not set)
  const currentValue = tracker.flags[trackerKey] || false;

  // Handler to toggle the flag value in global state
  const toggleFlag = () => {
    dispatch({
      type: GlobalActionType.SET_FLAG_VALUE,
      payload: { name: trackerKey, value: !currentValue } // Dispatch the new toggled value
    });
  };

  // Style for slider when 'on' (active state)
  const sliderOnStyle: React.CSSProperties = { ...sliderStyle, backgroundColor: '#2196F3' };
  // Style for knob when 'on' (active state)
  const sliderBeforeOnStyle: React.CSSProperties = { ...sliderBeforeStyle, transform: 'translateX(24px)' };

  // Choose the correct style for the slider and knob based on current value
  const currentSliderStyle = currentValue ? sliderOnStyle : sliderStyle;
  const currentSliderBeforeStyle = currentValue ? sliderBeforeOnStyle : sliderBeforeStyle;

  // Only render for interactive flag types (user toggles or prompts)
  if (flag.setType === 'user_checkbox_on_pickup_or_drop' || flag.setType === 'user_prompt_after_event') {
    // For 'user_prompt_after_event' that are complex (like Biran/Yenke choice),
    // this simple toggle is a placeholder. A different component would be needed for button groups.
    return (
      <div
        style={toggleSwitchContainerStyle}
        onClick={toggleFlag} // Clicking anywhere on the div toggles the flag
        role="button" // More appropriate than label if whole thing is clickable
        aria-pressed={currentValue}
        tabIndex={0} // Make it focusable
        onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFlag(); }} // Keyboard accessible
        title={flag.promptText || `Toggle ${flag.itemName}`} // Tooltip for the whole item
      >
        {/* Label for the flag prompt, shows prompt text or a default */}
        <span style={toggleSwitchLabelStyle}>
          {flag.promptText || `Event: ${flag.itemName}`}
          {/* Removed flag.sourceDescription from direct display as per your request */}
          {/* If sourceDescription is needed for a tooltip on the label only, that's an option */}
        </span>
        {/* The visual toggle switch - not directly interactive, container handles click */}
        <div style={toggleSwitchStyle} aria-hidden="true"> {/* Hide from screen readers as container is button */}
          <span style={currentSliderStyle}>
            <span style={currentSliderBeforeStyle}></span>
          </span>
        </div>
        {/* Hidden actual checkbox for semantics if needed, but not strictly required if role="button" is used */}
        {/* <input 
            type="checkbox" 
            style={toggleSwitchInputStyle}
            checked={currentValue} 
            onChange={toggleFlag} // This would also work but might cause double toggle with div click
            tabIndex={-1} // Not focusable if div is
        /> */}
      </div>
    );
  }

  // If the flag is not user-interactive, render nothing
  return null;
};