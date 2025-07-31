// src/editor/components/ResizableSplitter.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ResizableSplitterProps {
    children: [React.ReactNode, React.ReactNode];
    defaultSplit?: number; // 0-1, default split ratio
    minSize?: number; // minimum size for either panel in pixels
    className?: string;
    style?: React.CSSProperties;
    onResize?: (leftWidth: number, rightWidth: number) => void;
}

export const ResizableSplitter: React.FC<ResizableSplitterProps> = ({
    children,
    defaultSplit = 0.6,
    minSize = 200,
    className = '',
    style = {},
    onResize
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [splitPosition, setSplitPosition] = useState(defaultSplit);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<number>(0);
    const dragStartSplit = useRef<number>(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartPos.current = e.clientX;
        dragStartSplit.current = splitPosition;

        // Add global mouse event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    }, [splitPosition]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const deltaX = e.clientX - dragStartPos.current;
        const deltaRatio = deltaX / containerWidth;

        let newSplit = dragStartSplit.current + deltaRatio;

        // Apply minimum size constraints
        const minRatio = minSize / containerWidth;
        const maxRatio = 1 - minRatio;

        newSplit = Math.max(minRatio, Math.min(maxRatio, newSplit));

        setSplitPosition(newSplit);

        if (onResize) {
            onResize(containerWidth * newSplit, containerWidth * (1 - newSplit));
        }
    }, [minSize, onResize]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, [handleMouseMove]);

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };
    }, [handleMouseMove, handleMouseUp]);

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
        ...style
    };

    const leftPanelStyle: React.CSSProperties = {
        flex: `0 0 ${splitPosition * 100}%`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const rightPanelStyle: React.CSSProperties = {
        flex: `0 0 ${(1 - splitPosition) * 100}%`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const splitterStyle: React.CSSProperties = {
        width: '6px',
        backgroundColor: isDragging ? '#3b82f6' : '#e2e8f0',
        cursor: 'col-resize',
        position: 'relative',
        flexShrink: 0,
        transition: isDragging ? 'none' : 'background-color 0.2s ease',
        borderLeft: '1px solid #d1d5db',
        borderRight: '1px solid #d1d5db'
    };

    const splitterHandleStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '40px',
        backgroundColor: isDragging ? '#3b82f6' : '#9ca3af',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: isDragging ? 'none' : 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        opacity: isDragging ? 1 : 0.7
    };

    return (
        <div ref={containerRef} className={className} style={containerStyle}>
            {/* Left Panel */}
            <div style={leftPanelStyle}>
                {children[0]}
            </div>

            {/* Splitter */}
            <div
                style={splitterStyle}
                onMouseDown={handleMouseDown}
                onMouseEnter={(e) => {
                    if (!isDragging) {
                        e.currentTarget.style.backgroundColor = '#cbd5e1';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDragging) {
                        e.currentTarget.style.backgroundColor = '#e2e8f0';
                    }
                }}
            >
                <div style={splitterHandleStyle}>
                    ⋮⋮
                </div>
            </div>

            {/* Right Panel */}
            <div style={rightPanelStyle}>
                {children[1]}
            </div>
        </div>
    );
};
