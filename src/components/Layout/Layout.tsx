// src/components/Layout/Layout.tsx
import React, { ReactNode } from 'react';
import Header from './Header';

// Constant for the header height. This value must match the actual rendered header height for correct layout offset.
const APP_HEADER_HEIGHT = '48px';

// Style for the outermost layout container. Sets up a column flex layout and ensures the app fills the viewport.
const layoutContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
    overflow: 'hidden', // Prevent scrollbars on the outer container
    boxSizing: 'border-box', // Ensure padding/border are included in size calculations
};

// Style for the header container. Keeps the header fixed at the top and above other content.
const headerContainerStyle: React.CSSProperties = {
    height: APP_HEADER_HEIGHT,
    flexShrink: 0,
    position: 'fixed', // Header stays at the top of the viewport
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Ensure header is above other content
    boxSizing: 'border-box',
    // backgroundColor: '#333', // Header component manages its own background
};

// Style for the main body container. Arranges ToC, main content, and tracker horizontally.
const bodyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexGrow: 1,
    marginTop: APP_HEADER_HEIGHT, // Offset for the fixed header
    height: `calc(100vh - ${APP_HEADER_HEIGHT})`, // Remaining viewport height
    maxHeight: `calc(100vh - ${APP_HEADER_HEIGHT})`, // Explicitly cap height
    overflow: 'hidden', // Prevent scrolling on this row
    boxSizing: 'border-box',
};

// Style for the Table of Contents (ToC) sidebar. Scrolls independently from main content.
const tocStyle: React.CSSProperties = {
    width: '250px',
    flexShrink: 0,
    backgroundColor: '#f0f0f0',
    padding: '15px',
    overflowY: 'auto', // ToC can scroll if content overflows
    height: '100%',    // Full height of its parent (bodyContainerStyle)
    boxSizing: 'border-box',
    borderRight: '1px solid #ccc',
};

// Style for the main content wrapper. Ensures main content fills available space and is not scrollable here.
const mainContentWrapperStyle: React.CSSProperties = {
    flexGrow: 1,
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    display: 'flex', // Allows MainContentArea child to take full height if needed
    flexDirection: 'column',
};

// Style for the tracker sidebar. Scrolls independently and is visually separated from main content.
const trackerStyle: React.CSSProperties = {
    width: '300px',
    flexShrink: 0,
    backgroundColor: '#f0f0f0',
    height: '100%', // Full height of its parent (bodyContainerStyle)
    borderLeft: '1px solid #ccc',
    display: 'flex', // Allows TrackerAreaComponent to manage its internal layout
    flexDirection: 'column',
    boxSizing: 'border-box',
    // TrackerAreaComponent manages its own internal scrolling via its contentStyle
};

// Props for the Layout component, representing the three main regions of the app
interface LayoutProps {
    tableOfContents: ReactNode; // React node for the Table of Contents sidebar
    children: ReactNode;        // React node for the main content area
    tracker: ReactNode;         // React node for the tracker sidebar
}

// Main Layout component. Arranges header, ToC, main content, and tracker in a responsive, fixed layout.
const Layout: React.FC<LayoutProps> = ({ tableOfContents, children, tracker }) => {
    return (
        <div style={layoutContainerStyle}>
            {/* Fixed header at the top of the viewport */}
            <div style={headerContainerStyle}>
                <Header />
            </div>
            {/* Main body: ToC (left), main content (center), tracker (right) */}
            <div style={bodyContainerStyle}>
                {/* Table of Contents sidebar, scrolls independently */}
                <aside style={tocStyle}>
                    {tableOfContents}
                </aside>
                {/* Main content area, fills available space */}
                <div style={mainContentWrapperStyle}>
                    {children}
                </div>
                {/* Tracker sidebar, scrolls independently */}
                <aside style={trackerStyle}>
                    {tracker}
                </aside>
            </div>
        </div>
    );
};

export default Layout;