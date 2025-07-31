// src/editor/inline/shared/inlineEditorUtils.ts
import { CSSProperties } from 'react';

/**
 * Standard container style for all inline editors
 * Provides consistent layout, spacing, and visual appearance
 */
export function getInlineEditorContainerStyle(
    backgroundColor: string,
    borderColor: string = '#ddd',
    borderWidth: string = '1px'
): CSSProperties {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        margin: '2px',
        padding: '4px',
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: '3px',
        backgroundColor
    };
}

/**
 * Standard style for input and select elements
 * Ensures consistent appearance across all form controls
 */
export function getStandardInputStyle(width?: string): CSSProperties {
    return {
        border: '1px solid #ccc',
        padding: '2px 4px',
        borderRadius: '2px',
        ...(width && { width })
    };
}

/**
 * Standard style for labels in inline editors
 * Provides consistent typography for component labels
 */
export function getStandardLabelStyle(): CSSProperties {
    return {
        fontSize: '12px',
        fontWeight: 'bold'
    };
}

/**
 * Standard style for small action buttons (add/remove)
 * Used for consistent button appearance in inline editors
 */
export function getStandardButtonStyle(backgroundColor: string, color: string = 'white'): CSSProperties {
    return {
        background: backgroundColor,
        color,
        border: 'none',
        borderRadius: '2px',
        fontSize: '10px',
        padding: '1px 3px',
        cursor: 'pointer'
    };
}

/**
 * Standard style for textarea elements in inline editors
 * Ensures consistent height and appearance with other inputs
 */
export function getStandardTextareaStyle(width?: string): CSSProperties {
    return {
        background: 'transparent',
        border: 'none',
        resize: 'none' as const,
        outline: 'none',
        padding: '2px 4px',
        height: '20px',
        lineHeight: '16px',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        ...(width && { width })
    };
}

/**
 * Complete list of Final Fantasy X characters
 * Used consistently across character selection components
 */
export const FFX_CHARACTERS = [
    'Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Kimahri', 'Rikku',
    'Seymour', 'Jecht', 'Braska', 'Cid', 'Yunalesca', 'Yu Yevon'
] as const;

/**
 * Main party characters (subset of FFX_CHARACTERS)
 * Used in formation editor and other party-specific components
 */
export const FFX_PARTY_CHARACTERS = [
    'Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Rikku', 'Kimahri', 'Seymour'
] as const;

/**
 * Default character colors for consistency across components
 * Maps character names to their thematic colors
 */
export const FFX_CHARACTER_COLORS: Record<string, string> = {
    'Tidus': 'blue',
    'Yuna': 'gray',
    'Auron': 'red',
    'Wakka': 'BurntOrange',
    'Lulu': 'purple',
    'Kimahri': 'Tan',
    'Rikku': 'ForestGreen'
};

/**
 * Get the default color for a character
 * Returns undefined if no default color is set
 */
export function getDefaultCharacterColor(characterName: string): string | undefined {
    return FFX_CHARACTER_COLORS[characterName];
}

/**
 * Background colors for different types of inline editors
 * Provides visual distinction between component types
 */
export const INLINE_EDITOR_BACKGROUNDS = {
    text: '#f5f5f5',           // Plain text elements
    formattedText: '#f8f9fa',  // Formatted text elements
    character: '#e3f2fd',      // Character reference elements
    command: '#f3e5f5',        // Character command elements
    formation: '#e6f7ff',      // Formation elements
    macro: '#fff3e0',          // Game macro elements
    number: '#e0f2f1',         // Number elements
    link: '#e8f5e9',           // Link elements
    math: '#fff8e1',           // Math symbol elements
    nth: '#fce4ec'             // Nth elements
} as const;

/**
 * Common math symbols used in MathSymbolEditor
 * Centralized list for consistency and easy updates
 */
export const MATH_SYMBOLS = [
    '=', '≠', '<', '>', '≤', '≥', '+', '-', '×', '÷', '±', '≈', '∞',
    // Arrows - LaTeX style
    '\\uparrow', '\\downarrow', '\\leftarrow', '\\rightarrow',
    '\\nwarrow', '\\nearrow', '\\swarrow', '\\searrow',
    '\\uparrow\\uparrow', '\\downarrow\\downarrow',
    '\\leftarrow\\leftarrow', '\\rightarrow\\rightarrow',
    '\\leftarrow\\leftarrow\\leftarrow', '\\leftarrow\\leftarrow\\leftarrow\\leftarrow',
    '\\nwarrow\\leftarrow\\leftarrow', '\\swarrow\\swarrow',
    // Common LaTeX math symbols
    '\\alpha', '\\beta', '\\gamma', '\\delta', '\\epsilon', '\\theta', '\\lambda', '\\mu', '\\pi', '\\sigma', '\\omega',
    '\\sum', '\\prod', '\\int', '\\sqrt{}', '\\frac{}{}', '\\cdot', '\\times', '\\div',
    '\\leq', '\\geq', '\\neq', '\\approx', '\\equiv', '\\propto',
    '\\in', '\\subset', '\\supset', '\\cup', '\\cap', '\\emptyset',
    '\\forall', '\\exists', '\\neg', '\\land', '\\lor', '\\implies', '\\iff'
] as const;

/**
 * Utility to calculate dynamic width for text inputs based on content length
 * Ensures text inputs are appropriately sized for their content
 */
export function calculateDynamicWidth(text: string, minWidth: number = 200): string {
    return `${Math.max(minWidth, text.length * 8 + 40)}px`;
}
