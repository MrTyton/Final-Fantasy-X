// src/components/Layout/Header.tsx
import React from 'react';
// We'll add settings icon and functionality later
// import { useGlobalDispatch } from '../../contexts/GlobalStateContext';
// import { GlobalActionType } from '../../contexts/GlobalStateContext';

// Basic styling (can be moved to a CSS file later)
const headerStyle: React.CSSProperties = {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    // display: 'flex', // For aligning title and settings icon
    // justifyContent: 'space-between',
    // alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.5em',
};

const Header: React.FC = () => {
    // const dispatch = useGlobalDispatch();

    // const handleSettingsClick = () => {
    //   // TODO: Implement settings modal/dropdown toggle
    //   console.log('Settings icon clicked');
    // };

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>FFX Interactive Speedrun Guide</h1>
            {/* 
        <button onClick={handleSettingsClick} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5em', cursor: 'pointer' }}>
          ⚙️ Settings Icon Placeholder
        </button> 
      */}
        </header>
    );
};

export default Header;