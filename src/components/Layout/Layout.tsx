// src/components/Layout/Layout.tsx
import React, { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
// Import TableOfContentsProps to ensure type compatibility for props passed
// Assuming TableOfContentsProps is exported from TableOfContents.tsx or a shared types file
// For now, we'll work with the assumption that the props will match.
// import { TableOfContentsProps } from './TableOfContents/TableOfContents'; // Adjust path if necessary

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
    const [isMobileView, setIsMobileView] = useState(false);
    const [isTocCollapsed, setIsTocCollapsed] = useState(false);
    const [isTrackerExpandedMobile, setIsTrackerExpandedMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            let mobile = false;
            if (navigator.userAgentData) {
                mobile = navigator.userAgentData.mobile;
            } else {
                const mediaQuery = window.matchMedia("(max-width: 768px)");
                mobile = mediaQuery.matches;
            }
            setIsMobileView(mobile);
            setIsTocCollapsed(mobile); // TOC defaults to collapsed on mobile
            if (mobile) {
                setIsTrackerExpandedMobile(false); // Tracker defaults to footer on mobile
            }
        };

        checkIfMobile();

        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobileView(event.matches);
            setIsTocCollapsed(event.matches);
            if (event.matches) {
                setIsTrackerExpandedMobile(false); // Reset tracker to footer on switch to mobile
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Define conditional styles
    let currentTocStyle: React.CSSProperties = tocStyle;
    let currentMainContentStyle: React.CSSProperties = mainContentWrapperStyle;
    let currentTrackerContainerStyle: React.CSSProperties = trackerStyle; // For the <aside>
    let currentBodyContainerStyle: React.CSSProperties = bodyContainerStyle;

    const tocIsFullscreenMobile = isMobileView && !isTocCollapsed;
    const trackerIsFullscreenMobile = isMobileView && isTrackerExpandedMobile;

    if (isMobileView) {
        // Default body style for mobile - can be overridden by fullscreen TOC/Tracker
        currentBodyContainerStyle = {
            ...bodyContainerStyle,
            flexDirection: 'column', // Stack main content above tracker footer
            paddingBottom: isTrackerExpandedMobile ? '0px' : '60px', // Space for footer tracker, none if fullscreen
        };

        if (isTocCollapsed) { // TOC is collapsed (minimal or hidden)
            currentTocStyle = {
                ...tocStyle,
                width: '0px',
                padding: '0',
                borderRight: 'none',
                overflow: 'hidden',
            };
            // Main content takes full width if tracker is not fullscreen
            currentMainContentStyle = trackerIsFullscreenMobile 
                ? { display: 'none' } 
                : { ...mainContentWrapperStyle, width: '100%' };
            
            if (trackerIsFullscreenMobile) {
                currentTrackerContainerStyle = { display: 'none' }; // Tracker component handles its own fullscreen
                currentBodyContainerStyle = { ...bodyContainerStyle, paddingBottom: '0px' };
            } else { // Tracker is footer
                currentTrackerContainerStyle = {
                    position: 'fixed',
                    bottom: 0, left: 0, right: 0,
                    height: '60px', // Footer height
                    width: '100vw',
                    zIndex: 150,
                    backgroundColor: '#f0f0f0', // Example footer color
                    borderTop: '1px solid #ccc',
                    // TrackerAreaComponent itself will use display:flex for its content
                };
            }
        } else { // TOC is expanded (fullscreen mobile)
            currentTocStyle = {
                position: 'fixed',
                top: APP_HEADER_HEIGHT, left: 0,
                width: '100vw', height: `calc(100vh - ${APP_HEADER_HEIGHT})`,
                backgroundColor: '#f0f0f0', zIndex: 200,
                padding: '15px', overflowY: 'auto',
                borderRight: 'none', boxSizing: 'border-box',
            };
            currentMainContentStyle = { display: 'none' }; // Hide main content when TOC is fullscreen
            currentTrackerContainerStyle = { display: 'none' }; // Hide tracker when TOC is fullscreen
            currentBodyContainerStyle = { ...bodyContainerStyle, paddingBottom: '0px' }; // No footer space needed
        }

        // If Tracker is fullscreen, it overrides TOC and Main Content visibility
        if (trackerIsFullscreenMobile) {
            currentTocStyle = { ...currentTocStyle, display: 'none' }; // Hide TOC
            currentMainContentStyle = { display: 'none' }; // Hide Main Content
            currentTrackerContainerStyle = { display: 'none' }; // Tracker component handles its own fullscreen
            currentBodyContainerStyle = { ...bodyContainerStyle, paddingBottom: '0px' }; // No footer space needed
        }

    } else { // Desktop view
        // Reset to default styles for desktop
        currentTocStyle = tocStyle;
        currentMainContentStyle = mainContentWrapperStyle;
        currentTrackerContainerStyle = trackerStyle;
        currentBodyContainerStyle = bodyContainerStyle;
    }

    const tocElement = React.isValidElement(tableOfContents)
        ? React.cloneElement(tableOfContents as React.ReactElement<any>, {
              isMobileView,
              isTocCollapsed,
              setIsTocCollapsed,
          })
        : tableOfContents;

    const trackerElement = React.isValidElement(tracker)
        ? React.cloneElement(tracker as React.ReactElement<any>, {
            isMobileView,
            isTrackerExpandedMobile,
            setIsTrackerExpandedMobile,
          })
        : tracker;

    return (
        <div style={layoutContainerStyle}>
            {/* Fixed header at the top of the viewport */}
            <div style={headerContainerStyle}> {/* This one seems duplicated in the original, removing one */}
                <Header />
            </div>
            {/* Main body: ToC (left), main content (center), tracker (right/footer) */}
            <div style={currentBodyContainerStyle}>
                <aside style={currentTocStyle}>
                    {tocElement}
                </aside>
                <div style={currentMainContentStyle}>
                    {children}
                </div>
                {/* The <aside> for tracker might be styled as footer or hidden if TrackerAreaComponent is fullscreen */}
                <aside style={currentTrackerContainerStyle}>
                    {trackerElement}
                </aside>
            </div>
        </div>
    );
};

export default Layout;