// src/editor/components/AutoResizeTextarea.tsx
import React, { useRef, useEffect, useCallback } from 'react';

interface AutoResizeTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minRows?: number;
    maxRows?: number;
    style?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
    spellCheck?: boolean;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
    value,
    onChange,
    placeholder = '',
    minRows = 1,
    maxRows = 10,
    style = {},
    className = '',
    disabled = false,
    spellCheck = true
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hiddenDivRef = useRef<HTMLDivElement>(null);

    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current;
        const hiddenDiv = hiddenDivRef.current;

        if (!textarea || !hiddenDiv) return;

        // Copy styles to hidden div
        const computedStyle = window.getComputedStyle(textarea);
        hiddenDiv.style.font = computedStyle.font;
        hiddenDiv.style.fontSize = computedStyle.fontSize;
        hiddenDiv.style.fontFamily = computedStyle.fontFamily;
        hiddenDiv.style.fontWeight = computedStyle.fontWeight;
        hiddenDiv.style.lineHeight = computedStyle.lineHeight;
        hiddenDiv.style.padding = computedStyle.padding;
        hiddenDiv.style.border = computedStyle.border;
        hiddenDiv.style.width = textarea.clientWidth + 'px';

        // Set content to measure height
        hiddenDiv.textContent = value || placeholder;

        // Calculate the desired height
        const contentHeight = hiddenDiv.scrollHeight;
        const lineHeight = parseInt(computedStyle.lineHeight) || parseInt(computedStyle.fontSize) * 1.2;
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;

        const newHeight = Math.max(minHeight, Math.min(maxHeight, contentHeight));
        textarea.style.height = newHeight + 'px';
    }, [value, placeholder, minRows, maxRows]);

    useEffect(() => {
        adjustHeight();
    }, [adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const combinedStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px',
        fontFamily: 'inherit',
        fontSize: '14px',
        lineHeight: '1.4',
        resize: 'none',
        overflow: 'hidden',
        minHeight: '24px',
        width: '100%',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        ...style
    };

    const focusStyle: React.CSSProperties = {
        borderColor: '#4CAF50',
        boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
        outline: 'none'
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                spellCheck={spellCheck}
                className={className}
                style={combinedStyle}
                onFocus={(e) => {
                    Object.assign(e.target.style, focusStyle);
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                }}
            />
            {/* Hidden div for measuring text height */}
            <div
                ref={hiddenDivRef}
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: '-9999px',
                    visibility: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}
            />
        </div>
    );
};
