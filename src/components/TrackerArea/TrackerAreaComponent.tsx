// src/components/TrackerArea/TrackerAreaComponent.tsx
import React, { useState } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';

// --- Props Interface ---
interface TrackerAreaProps {
    isMobileView: boolean;
    isTrackerExpandedMobile?: boolean;
    setIsTrackerExpandedMobile?: (isExpanded: boolean) => void;
}

// --- Styles ---
// Original style for the outer tracker area container (desktop).
const desktopTrackerAreaStyle: React.CSSProperties = {
    width: '300px',
    borderLeft: '1px solid #ccc',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Adjusted to fill parent in Layout.tsx
    boxSizing: 'border-box',
};

// Style for mobile footer state
const mobileFooterStyle: React.CSSProperties = {
    height: '60px', // Fixed footer height
    width: '100%',
    padding: '0 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // For summary and button
    backgroundColor: '#f8f9fa', // Match original for consistency
    borderTop: '1px solid #ccc',
    boxSizing: 'border-box',
    position: 'relative', // For internal absolute positioning if needed
};

// Style for mobile fullscreen state
const mobileFullscreenStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0, // Or APP_HEADER_HEIGHT if header is not overlaid
    left: 0,
    width: '100vw',
    height: '100vh', // Full viewport height
    zIndex: 300, // Above other content like TOC
    backgroundColor: '#f8f9fa',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '48px', // Assuming APP_HEADER_HEIGHT is 48px and header is visible
    boxSizing: 'border-box',
};


// Style for the tracker header, including title and expand/collapse button.
const baseHeaderStyle: React.CSSProperties = {
    padding: '10px 15px',
    backgroundColor: '#e9ecef',
    borderBottom: '1px solid #dee2e6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
};

// Style for the tracker title text.
const baseTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.1em',
    fontWeight: 'bold',
};

// Style for the expand/collapse button in the tracker header.
const baseToggleButtonStyle: React.CSSProperties = {
    background: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '0.9em',
};

// Style for the main content area of the tracker, which is scrollable.
const baseContentStyle: React.CSSProperties = {
    padding: '10px 15px',
    overflowY: 'auto',
    flexGrow: 1,
};

// Style for summary text in mobile footer view
const summaryTextStyle: React.CSSProperties = {
    fontSize: '0.9em',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: '10px', // Space before button
};


// Style for section titles within the tracker (e.g., Resources, Flags).
const baseSectionTitleStyle: React.CSSProperties = {
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
const TrackerAreaComponent: React.FC<TrackerAreaProps> = ({
    isMobileView,
    isTrackerExpandedMobile,
    setIsTrackerExpandedMobile,
}) => {
    const { tracker } = useGlobalState();
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(false); // For desktop state

    // Define which resources are "key" and always shown in collapsed view / mobile footer
    const KEY_RESOURCES_FOR_SUMMARY: string[] = ['PowerSphere', 'SpeedSphere', 'Grenade'];

    const allResourceEntries = Object.entries(tracker.resources)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
    const allFlagEntries = Object.entries(tracker.flags)
        .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));

    // Determine current overall style for the component's root element
    let currentTrackerStyle: React.CSSProperties = desktopTrackerAreaStyle;
    if (isMobileView) {
        currentTrackerStyle = isTrackerExpandedMobile ? mobileFullscreenStyle : mobileFooterStyle;
    }

    // Determine button text and action
    let buttonText = isDesktopExpanded ? 'Collapse' : 'Expand All';
    let buttonAction = () => setIsDesktopExpanded(!isDesktopExpanded);

    if (isMobileView && setIsTrackerExpandedMobile) {
        buttonText = isTrackerExpandedMobile ? '↓ Close' : '↑ Details';
        buttonAction = () => setIsTrackerExpandedMobile(!isTrackerExpandedMobile);
    }
    
    // Content for mobile footer view
    const renderMobileFooterContent = () => {
        const summaryItems = KEY_RESOURCES_FOR_SUMMARY.map(key => {
            const quantity = tracker.resources[key] || 0;
            // Shorten names for brevity, e.g., PowerSphere -> Pwr
            const shortName = key.replace('Sphere', '').substring(0,3);
            return `${shortName}: ${quantity}`;
        }).join(', ');
        return <span style={summaryTextStyle}>{summaryItems || "No key items"}</span>;
    };

    // Content for expanded view (desktop or mobile fullscreen)
    const renderExpandedContent = () => {
        const resourcesToDisplay = isMobileView || isDesktopExpanded
            ? allResourceEntries
            : allResourceEntries.filter(([name]) => KEY_RESOURCES_FOR_SUMMARY.includes(name));
        
        const flagsToDisplay = (isMobileView && isTrackerExpandedMobile) || (!isMobileView && isDesktopExpanded)
            ? allFlagEntries
            : [];

        return (
            <>
                <h3 style={baseSectionTitleStyle}>Resources</h3>
                {resourcesToDisplay.length > 0 ? (
                    resourcesToDisplay.map(([name, quantity]) => (
                        <EditableResourceItem key={`res-${name}`} name={name} quantity={quantity as number} />
                    ))
                ) : (
                    <p style={{ fontSize: '0.9em', color: '#6c757d', fontStyle: 'italic' }}>
                        {(isMobileView && isTrackerExpandedMobile) || (!isMobileView && isDesktopExpanded) ? "No resources defined." : "No key resources."}
                    </p>
                )}

                {((isMobileView && isTrackerExpandedMobile) || (!isMobileView && isDesktopExpanded)) && (
                    <>
                        <h3 style={{ ...baseSectionTitleStyle, marginTop: '20px' }}>Flags</h3>
                        {flagsToDisplay.length > 0 ? (
                            flagsToDisplay.map(([name, value]) => (
                                <EditableFlagItem key={`flag-${name}`} name={name} value={value as boolean} />
                            ))
                        ) : (
                            <p style={{ fontSize: '0.9em', color: '#6c757d', fontStyle: 'italic' }}>
                                No flags defined.
                            </p>
                        )}
                    </>
                )}
            </>
        );
    };

    // Header style adjustments for mobile footer
    const currentHeaderStyle = isMobileView && !isTrackerExpandedMobile 
        ? { ...baseHeaderStyle, padding: '0', borderBottom: 'none', backgroundColor: 'transparent' } 
        : baseHeaderStyle;
    
    const currentTitleStyle = isMobileView && !isTrackerExpandedMobile 
        ? { display: 'none' } // Hide title in footer mode
        : baseTitleStyle;

    return (
        // Note: The <aside> tag is in Layout.tsx. This component renders the *content* of that aside.
        // For mobile fullscreen, this component's root div will be styled to be fixed and cover the screen.
        // For mobile footer, this component's root div will be styled for the footer.
        // For desktop, this component's root div will be styled as the original sidebar.
        <div style={currentTrackerStyle}>
            {/* Header: Title and Toggle Button */}
            {/* In mobile footer, header might be just the button or a summary + button */}
            { !(isMobileView && !isTrackerExpandedMobile) && ( // Hide header block in mobile footer, content is directly in the footer
                 <div style={currentHeaderStyle}>
                    <h2 style={currentTitleStyle}>Tracker</h2>
                    <button onClick={buttonAction} style={baseToggleButtonStyle}>
                        {buttonText}
                    </button>
                </div>
            )}

            {/* Content Area */}
            {isMobileView && !isTrackerExpandedMobile ? (
                // Mobile Footer View: Summary and Button are part of the main div with flex justify-space-between
                <> 
                    {renderMobileFooterContent()}
                    <button onClick={buttonAction} style={{...baseToggleButtonStyle, fontSize: '0.8em', padding: '4px 8px'}}>
                        {buttonText}
                    </button>
                </>
            ) : (
                // Desktop View or Mobile Fullscreen View
                <div style={baseContentStyle}>
                    {renderExpandedContent()}
                </div>
            )}
        </div>
    );
};

export default TrackerAreaComponent;