// src/components/TrackerArea/TrackerAreaComponent.tsx
import React, { useState } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';

// --- Styles ---
// Style for the outer tracker area container. Sets width, background, and layout for the sidebar.
const trackerAreaStyle: React.CSSProperties = {
    width: '300px',
    borderLeft: '1px solid #ccc',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    // Height is set to fill the viewport minus the header. Adjust if header height changes.
    height: 'calc(100vh - 50px)',
};
// Style for the tracker header, including title and expand/collapse button.
const headerStyle: React.CSSProperties = {
    padding: '10px 15px',
    backgroundColor: '#e9ecef', // Light grey for header
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0, // Prevent header from shrinking
};
// Style for the tracker title text.
const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.1em',
    fontWeight: 'bold',
};
// Style for the expand/collapse button in the tracker header.
const toggleButtonStyle: React.CSSProperties = {
    background: '#6c757d', // Darker grey for button
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '0.9em',
};
// Style for the main content area of the tracker, which is scrollable.
const contentStyle: React.CSSProperties = {
    padding: '10px 15px', // Consistent padding
    overflowY: 'auto',   // Make content scrollable
    flexGrow: 1,         // Allow content to take remaining space
};
// Style for section titles within the tracker (e.g., Resources, Flags).
const sectionTitleStyle: React.CSSProperties = {
    marginTop: '0',      // Remove top margin for first section title
    marginBottom: '10px',
    fontSize: '1em',
    fontWeight: 'bold',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '5px',
    color: '#495057', // Darker text for section titles
};
// Style for each resource or flag item row.
const itemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0', // Slightly more padding
    fontSize: '0.9em',
    borderBottom: '1px solid #f1f3f5', // Very light separator for items
};
// Style for the name/label of a resource or flag.
const itemNameStyle: React.CSSProperties = {
    marginRight: '10px',
    wordBreak: 'break-word', // For long flag names
    flexShrink: 1, // Allow name to shrink if needed
};
// Style for the value area (quantity or toggle) of a resource or flag.
const itemValueStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0, // Prevent value part from shrinking excessively
};
// Style for the stepper buttons (+/-) for resource quantity adjustment.
const stepperButtonStyle: React.CSSProperties = {
    width: '25px', height: '25px',
    padding: '0', margin: '0 3px',
    lineHeight: '23px', textAlign: 'center',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    borderRadius: '3px',
};
// Style for the displayed quantity value between stepper buttons.
const quantityDisplaySyle: React.CSSProperties = {
    display: 'inline-block',
    minWidth: '30px',
    textAlign: 'center',
    padding: '0 5px',
    fontWeight: 'bold',
};

// --- Helper: Editable Resource Item ---
// Renders a resource row with stepper buttons for manual adjustment in the tracker.
interface EditableResourceItemProps {
    name: string;
    quantity: number;
}
const EditableResourceItem: React.FC<EditableResourceItemProps> = ({ name, quantity }) => {
    const { tracker: globalTracker } = useGlobalState(); // Access global tracker state
    const dispatch = useGlobalDispatch();

    // Handler for incrementing or decrementing the resource quantity
    const handleQuantityStepChange = (change: number) => {
        const currentVal = globalTracker.resources[name] || 0; // Get current value from global state
        const newVal = Math.max(0, currentVal + change); // Ensure non-negative
        dispatch({ type: GlobalActionType.MANUALLY_EDIT_TRACKER_RESOURCE, payload: { name, newValue: newVal } });
    };

    return (
        <div style={itemStyle} title={`Manually adjust ${name}`}>
            <span style={itemNameStyle}>{name}:</span>
            <div style={itemValueStyle}>
                <button onClick={(e) => { e.stopPropagation(); handleQuantityStepChange(-1); }} style={stepperButtonStyle}>-</button>
                <span style={quantityDisplaySyle}>{quantity}</span>
                <button onClick={(e) => { e.stopPropagation(); handleQuantityStepChange(1); }} style={stepperButtonStyle}>+</button>
            </div>
        </div>
    );
};

// --- Helper: Editable Flag Item ---
// Renders a flag row with a checkbox for manual toggling in the tracker.
interface EditableFlagItemProps {
    name: string;
    value: boolean;
}
const EditableFlagItem: React.FC<EditableFlagItemProps> = ({ name, value }) => {
    const dispatch = useGlobalDispatch();

    // Handler for toggling the flag value
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: GlobalActionType.MANUALLY_EDIT_TRACKER_FLAG, payload: { name, newValue: event.target.checked } });
    };

    return (
        <div style={itemStyle} title={`Toggle ${name}`}>
            <span style={itemNameStyle}>{name}:</span>
            <div style={itemValueStyle}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                    <input type="checkbox" checked={value} onChange={handleChange} style={{ marginRight: '6px', cursor: 'pointer' }} />
                    <span>{value ? 'Yes' : 'No'}</span>
                </label>
            </div>
        </div>
    );
};

// --- Main Tracker Component ---
// Renders the tracker sidebar, including resources and flags, with expand/collapse functionality.
const TrackerAreaComponent: React.FC = () => {
    const { tracker } = useGlobalState();
    const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default

    // Define which resources are "key" and always shown in collapsed view
    // These names MUST match exactly those in KNOWN_TRACKED_RESOURCE_NAMES
    const KEY_RESOURCES_FOR_SUMMARY: string[] = ['PowerSphere', 'SpeedSphere', 'Grenade'];

    // Get all resource entries and sort them alphabetically by name
    const allResourceEntries = Object.entries(tracker.resources)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));

    // Get all flag entries and sort them alphabetically by name
    const allFlagEntries = Object.entries(tracker.flags)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));

    // Determine which resources to display based on expanded/collapsed state
    const resourcesToDisplay = isExpanded
        ? allResourceEntries
        : allResourceEntries.filter(([name]) => KEY_RESOURCES_FOR_SUMMARY.includes(name));

    // Flags are only shown when expanded
    const flagsToDisplay = isExpanded ? allFlagEntries : [];

    return (
        <aside style={trackerAreaStyle}>
            {/* Tracker header with title and expand/collapse button */}
            <div style={headerStyle}>
                <h2 style={titleStyle}>Tracker</h2>
                <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
                    {isExpanded ? 'Collapse' : 'Expand All'}
                </button>
            </div>
            {/* Main content area for resources and flags */}
            <div style={contentStyle}>
                <h3 style={sectionTitleStyle}>Resources</h3>
                {resourcesToDisplay.length > 0 ? (
                    resourcesToDisplay.map(([name, quantity]) => (
                        <EditableResourceItem key={`res-${name}`} name={name} quantity={quantity as number} />
                    ))
                ) : (
                    <p style={{ fontSize: '0.9em', color: '#6c757d', fontStyle: 'italic' }}>
                        {isExpanded ? "No resources defined in system." : "No key resources to display."}
                    </p>
                )}

                {/* Flags section, only shown when expanded */}
                {isExpanded && (
                    <>
                        <h3 style={{ ...sectionTitleStyle, marginTop: '20px' }}>Flags</h3>
                        {flagsToDisplay.length > 0 ? (
                            flagsToDisplay.map(([name, value]) => (
                                <EditableFlagItem key={`flag-${name}`} name={name} value={value as boolean} />
                            ))
                        ) : (
                            <p style={{ fontSize: '0.9em', color: '#6c757d', fontStyle: 'italic' }}>
                                No flags defined in system.
                            </p>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};

export default TrackerAreaComponent;