// src/components/Layout/Header.tsx
import React from 'react';
// Header component for the application. Displays the main title and (optionally) a settings icon.
// Settings icon and related functionality are commented out for future implementation.

// Inline style for the header container. Sets background, text color, padding, and alignment.
const headerStyle: React.CSSProperties = {
    backgroundColor: '#333', // Dark background for header
    color: 'white',          // White text for contrast
    padding: '10px 20px',    // Padding around the header
    textAlign: 'center',     // Center the title horizontally
    // display: 'flex',      // Uncomment for flex layout if adding settings icon
    // justifyContent: 'space-between', // Space out title and icon
    // alignItems: 'center',            // Vertically center content
};

// Inline style for the main title text in the header.
const titleStyle: React.CSSProperties = {
    margin: 0,           // Remove default margin
    fontSize: '1.5em',   // Larger font for emphasis
};

// Header functional component. Renders the main title and (optionally) a settings icon.
const Header: React.FC = () => {
    // Uncomment and use when settings functionality is implemented.
    // const dispatch = useGlobalDispatch();
    // const handleSettingsClick = () => {
    //   // TODO: Implement settings modal/dropdown toggle
    //   console.log('Settings icon clicked');
    // };

    return (
        <header style={headerStyle}>
            {/* Main application title. This is always shown. */}
            <h1 style={titleStyle}>FFX Interactive Speedrun Guide</h1>
            {/*
            Settings button placeholder. Uncomment and implement when ready.
            <button onClick={handleSettingsClick} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5em', cursor: 'pointer' }}>
              ⚙️ Settings Icon Placeholder
            </button>
            */}
        </header>
    );
};

export default Header;