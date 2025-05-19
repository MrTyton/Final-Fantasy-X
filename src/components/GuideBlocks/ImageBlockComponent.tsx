// src/components/GuideBlocks/ImageBlockComponent.tsx
import React, { useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import type { ImageBlock as ImageBlockType } from '../../types';

// --- STYLES ---
// Container for the entire image block, centers the image and separates it from other content.
const imageContainerStyle: React.CSSProperties = {
    margin: '1em 0',
    textAlign: 'center',
    clear: 'both',
};
// Base style for the thumbnail image, including border, rounded corners, and zoom cursor.
const imageStyleBase: React.CSSProperties = {
    display: 'inline-block',
    maxWidth: '100%',
    maxHeight: '60vh',
    cursor: 'zoom-in',
    transition: 'opacity 0.2s ease-out',
    border: '1px solid #ddd',
    borderRadius: '4px',
    verticalAlign: 'middle',
};
// Style for the hover-zoomed image rendered in a portal above all content.
const portalImageBaseStyle: React.CSSProperties = {
    position: 'fixed',
    transformOrigin: 'center center',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    zIndex: 999,
    pointerEvents: 'none',
    border: '2px solid white',
    boxShadow: '0px 5px 15px rgba(0,0,0,0.3)',
    borderRadius: '4px',
    objectFit: 'contain',
};
// Overlay for the fullscreen modal, darkens the background and centers the image.
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    cursor: 'zoom-out',
};
// Wrapper for the modal image, allows for close button positioning.
const modalImageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
// Style for the image displayed in the fullscreen modal.
const modalImageStyle: React.CSSProperties = {
    display: 'block',
    width: '80vw',
    height: '80vh',
    objectFit: 'contain',
    boxShadow: '0 5px 25px rgba(0,0,0,0.4)',
    backgroundColor: 'transparent',
    cursor: 'zoom-out',
};
// Style for the close button in the modal.
const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '1.8em', color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
    border: 'none', borderRadius: '50%',
    width: '30px', height: '30px', lineHeight: '30px', textAlign: 'center',
    cursor: 'pointer', zIndex: 1002,
};
// --- END STYLES ---

// Props for the ImageBlockComponent, receives the block data for the image.
interface ImageBlockProps {
    blockData: ImageBlockType;
}

// Main component for rendering an image block with thumbnail, hover zoom, and fullscreen modal.
const ImageBlockComponent: React.FC<ImageBlockProps> = ({ blockData }) => {
    // State to control whether the fullscreen modal is open.
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State for hover zoom preview, including position and image details.
    const [hoverZoomState, setHoverZoomState] = useState<{
        visible: boolean;
        src: string;
        alt: string;
        top: number;
        left: number;
        origWidth: number;
        origHeight: number;
    } | null>(null);
    // Ref to the thumbnail image element for measuring its position and size.
    const thumbnailRef = useRef<HTMLImageElement>(null);

    // Compute the image path, appending .png if no extension is present, and prepending the Vite base URL if needed.
    const processedPath = useMemo(() => {
        let relativePathFromJson = blockData.path;
        if (!/\.(jpeg|jpg|gif|png|svg)$/i.test(relativePathFromJson)) {
            relativePathFromJson += '.png';
        }
        const appBaseUrl = import.meta.env.BASE_URL;
        if (appBaseUrl === '/') {
            return `/${relativePathFromJson}`;
        } else {
            return `${appBaseUrl}${relativePathFromJson}`;
        }
    }, [blockData.path]);

    // Open the fullscreen modal, close any hover zoom, and lock page scroll.
    const openModal = () => {
        if (hoverZoomState?.visible) {
            setHoverZoomState(prev => prev ? { ...prev, visible: false } : null);
            setTimeout(() => setHoverZoomState(null), 300);
        }
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };
    // Close the modal and restore page scroll.
    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };
    // Determine the initial width for the thumbnail image, using blockData properties in order of priority.
    const getInitialWidth = () => {
        if (blockData.singleColumnWidth) return blockData.singleColumnWidth;
        if (blockData.multiColumnWidth) return blockData.multiColumnWidth;
        if (blockData.width) return blockData.width;
        return 'auto';
    };
    const initialWidth = getInitialWidth();
    // Merge the base image style with the computed width.
    const currentImageStyle = { ...imageStyleBase, width: initialWidth };
    // Generate alt text from the image filename or use a default.
    const altText = processedPath.split('/').pop()?.split('.')[0] || 'Guide image';

    // Show the hover zoom preview when the mouse enters the thumbnail image.
    const handleMouseEnter = () => {
        if (thumbnailRef.current) {
            const rect = thumbnailRef.current.getBoundingClientRect();
            setHoverZoomState({
                visible: true,
                src: processedPath,
                alt: altText,
                top: rect.top + rect.height / 2,
                left: rect.left + rect.width / 2,
                origWidth: rect.width,
                origHeight: rect.height,
            });
        }
    };
    // Hide the hover zoom preview when the mouse leaves the thumbnail image.
    const handleMouseLeave = () => {
        setHoverZoomState(prev => prev ? { ...prev, visible: false } : null);
        setTimeout(() => {
            setHoverZoomState(null);
        }, 150);
    };

    // Portal component for rendering the hover-zoomed image above all content, using ReactDOM.createPortal.
    const HoverZoomImagePortal = () => {
        if (!hoverZoomState || !hoverZoomState.src) return null;
        const scale = 2.0; // Magnification factor for hover zoom
        const dynamicPortalStyle: React.CSSProperties = {
            ...portalImageBaseStyle,
            top: `${hoverZoomState.top}px`,
            left: `${hoverZoomState.left}px`,
            width: `${hoverZoomState.origWidth}px`,
            height: `${hoverZoomState.origHeight}px`,
            transform: `translate(-50%, -50%) scale(${hoverZoomState.visible ? scale : 1.0})`,
            opacity: hoverZoomState.visible ? 1 : 0,
        };
        return ReactDOM.createPortal(
            <img src={hoverZoomState.src} alt={hoverZoomState.alt + " zoom preview"} style={dynamicPortalStyle} />,
            document.body
        );
    };

    // Render the image block, including thumbnail, hover zoom, and fullscreen modal.
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
            <HoverZoomImagePortal />
            {/* Fullscreen Modal for image viewing, overlays the entire page and allows closing by clicking outside or on the close button. */}
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