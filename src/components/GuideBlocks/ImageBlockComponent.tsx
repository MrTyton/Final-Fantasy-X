// src/components/GuideBlocks/ImageBlockComponent.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for createPortal
import type { ImageBlock as ImageBlockType } from '../../types';

// --- STYLES ---

// Styles for the THUMBNAIL image in the document flow
const imageContainerStyle: React.CSSProperties = {
    margin: '1em 0',
    textAlign: 'center',
    clear: 'both',
};

const imageStyleBase: React.CSSProperties = {
    display: 'inline-block',
    maxWidth: '100%',
    maxHeight: '60vh', // Initial constraint for thumbnail
    cursor: 'zoom-in', // For click to open modal
    // No transform or z-index here for the base thumbnail for hover, portal handles it
    transition: 'opacity 0.2s ease-out', // Can add a slight opacity transition if desired
    border: '1px solid #ddd',
    borderRadius: '4px',
    verticalAlign: 'middle',
};

// Styles for the PORTALLED hover-zoomed image
const portalImageBaseStyle: React.CSSProperties = {
    position: 'fixed',
    transformOrigin: 'center center', // Scale from the center
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    zIndex: 999, // High z-index, but below full modal (modal is 1000 typically)
    pointerEvents: 'none', // So it doesn't interfere with mouse events
    border: '2px solid white',
    boxShadow: '0px 5px 15px rgba(0,0,0,0.3)',
    borderRadius: '4px',
    objectFit: 'contain', // Ensure aspect ratio is maintained within its dimensions
    // backgroundColor: 'rgba(255,255,255,0.9)', // Optional light background for better visibility
};

// Styles for the FULLSCREEN MODAL (using the version that scaled correctly for you)
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    cursor: 'zoom-out',
};

const modalImageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalImageStyle: React.CSSProperties = {
    display: 'block',
    width: '80vw',
    height: '80vh',
    objectFit: 'contain',
    boxShadow: '0 5px 25px rgba(0,0,0,0.4)',
    backgroundColor: 'transparent',
    cursor: 'zoom-out',
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px', // Relative to modalImageWrapperStyle edges or overlay if wrapper is minimal
    right: '15px',
    fontSize: '1.8em', color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
    border: 'none', borderRadius: '50%',
    width: '30px', height: '30px', lineHeight: '30px', textAlign: 'center',
    cursor: 'pointer', zIndex: 1002,
};
// --- END STYLES ---

interface ImageBlockProps {
    blockData: ImageBlockType;
}

const ImageBlockComponent: React.FC<ImageBlockProps> = ({ blockData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoverZoomState, setHoverZoomState] = useState<{
        visible: boolean;
        src: string;
        alt: string;
        top: number;    // Target Y for center of zoomed image
        left: number;   // Target X for center of zoomed image
        origWidth: number; // Original thumbnail width
        origHeight: number; // Original thumbnail height
    } | null>(null);

    const thumbnailRef = useRef<HTMLImageElement>(null);

    const processedPath = useMemo(() => {
        let path = blockData.path;
        if (!/\.(jpeg|jpg|gif|png|svg)$/i.test(path)) {
            path += '.png';
        }
        path = path.startsWith('/') ? path : `/${path}`;
        return path;
    }, [blockData.path]);

    const openModal = () => {
        // Hide hover zoom if it's active when modal opens
        if (hoverZoomState?.visible) {
            setHoverZoomState(prev => prev ? { ...prev, visible: false } : null);
            setTimeout(() => setHoverZoomState(null), 300); // Clear after transition
        }
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const getInitialWidth = () => {
        if (blockData.singleColumnWidth) return blockData.singleColumnWidth;
        if (blockData.multiColumnWidth) return blockData.multiColumnWidth;
        if (blockData.width) return blockData.width;
        return 'auto';
    };

    const initialWidth = getInitialWidth();
    const currentImageStyle = { ...imageStyleBase, width: initialWidth };
    const altText = processedPath.split('/').pop()?.split('.')[0] || 'Guide image';

    const handleMouseEnter = (event: React.MouseEvent<HTMLImageElement>) => {
        if (thumbnailRef.current) {
            const rect = thumbnailRef.current.getBoundingClientRect();
            setHoverZoomState({
                visible: true,
                src: processedPath,
                alt: altText,
                // Position the zoomed image's center over the thumbnail's center
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
                origWidth: rect.width,
                origHeight: rect.height,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoverZoomState(prev => prev ? { ...prev, visible: false } : null);
        // Remove from DOM after transition
        setTimeout(() => {
            setHoverZoomState(null);
        }, 150); // Should match transition duration in portalImageBaseStyle
    };

    // Portal component for the hover zoom
    const HoverZoomImagePortal = () => {
        if (!hoverZoomState || !hoverZoomState.src) return null; // Don't render if no state or src

        const scale = 2.0; // Hover zoom scale factor

        // The portal image is initially sized to the original thumbnail's dimensions,
        // then scaled. The top/left positions its center.
        const dynamicPortalStyle: React.CSSProperties = {
            ...portalImageBaseStyle,
            top: `${hoverZoomState.top}px`,
            left: `${hoverZoomState.left}px`,
            width: `${hoverZoomState.origWidth}px`,
            height: `${hoverZoomState.origHeight}px`,
            transform: `translate(-50%, -50%) scale(${hoverZoomState.visible ? scale : 1.0})`, // Centering and scaling
            opacity: hoverZoomState.visible ? 1 : 0,
        };

        return ReactDOM.createPortal(
            <img src={hoverZoomState.src} alt={hoverZoomState.alt + " zoom preview"} style={dynamicPortalStyle} />,
            document.body // Render directly into the body
        );
    };

    return (
        <div style={imageContainerStyle}>
            <img
                ref={thumbnailRef}
                src={processedPath}
                alt={altText}
                style={currentImageStyle}
                onClick={openModal}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            <HoverZoomImagePortal /> {/* Render the portal component */}

            {/* Fullscreen Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle} onClick={closeModal} role="dialog" aria-modal="true">
                    <div style={modalImageWrapperStyle} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={processedPath}
                            alt={altText}
                            style={modalImageStyle}
                            onClick={closeModal}
                        />
                        <button
                            style={closeButtonStyle}
                            onClick={(e) => { e.stopPropagation(); closeModal(); }}
                            aria-label="Close image viewer"
                        >×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageBlockComponent;