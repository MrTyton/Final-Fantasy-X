// src/components/Layout/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';

const APP_HEADER_HEIGHT = '48px'; // ENSURE THIS MATCHES YOUR ACTUAL HEADER HEIGHT

const layoutContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full height minus header
    overflow: 'hidden', // Prevent scrollbars on this outermost container
    boxSizing: 'border-box', // Apply to all main containers
};

const headerContainerStyle: React.CSSProperties = {
    height: APP_HEADER_HEIGHT,
    flexShrink: 0,
    position: 'fixed', // Keeps header fixed
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    boxSizing: 'border-box',
    // backgroundColor: '#333', // Example, Header component should manage its own bg
};

const bodyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1,
    marginTop: APP_HEADER_HEIGHT, // Offset for the fixed header
    // Height should be remaining viewport height
    height: `calc(100vh - ${APP_HEADER_HEIGHT})`,
    maxHeight: `calc(100vh - ${APP_HEADER_HEIGHT})`, // Explicitly cap height
    overflow: 'hidden', // This row should not scroll
    boxSizing: 'border-box',
};

const tocStyle: React.CSSProperties = {
    width: '250px',
    flexShrink: 0,
    backgroundColor: '#f0f0f0',
    padding: '15px',
    overflowY: 'auto', // ToC scrolls its own content
    height: '100%',    // Full height of its parent (bodyContainerStyle)
    boxSizing: 'border-box',
    borderRight: '1px solid #ccc',
};

const mainContentWrapperStyle: React.CSSProperties = {
    flexGrow: 1,
    // overflowY: 'auto', // REMOVE SCROLL FROM WRAPPER
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex', // To make MainContentArea child take full height if needed
    flexDirection: 'column',
};

const trackerStyle: React.CSSProperties = {
    width: '300px',
    flexShrink: 0,
    backgroundColor: '#f0f0f0',
    height: '100%', // Full height of its parent (bodyContainerStyle)
    borderLeft: '1px solid #ccc',
    display: 'flex', // To allow TrackerAreaComponent to manage its internal layout
    flexDirection: 'column',
    boxSizing: 'border-box',
    // TrackerAreaComponent manages its own internal scrolling via its contentStyle
};

interface LayoutProps {
    tableOfContents: ReactNode; // Represents the table of contents content
    children: ReactNode;        // Represents the main content
    tracker: ReactNode;         // Represents the tracker content
}
const Layout: React.FC<LayoutProps> = ({ tableOfContents, children, tracker }) => {
    // ... same return structure as before ...
    return (
        <div style={layoutContainerStyle}>
            <div style={headerContainerStyle}>
                <Header />
            </div>
            <div style={bodyContainerStyle}>
                <aside style={tocStyle}>
                    {tableOfContents}
                </aside>
                <div style={mainContentWrapperStyle}>
                    {children}
                </div>
                <aside style={trackerStyle}>
                    {tracker}
                </aside>
            </div>
        </div>
    );
};

export default Layout;