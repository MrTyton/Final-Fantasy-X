// src/editor/blocks/shared/blockEditorUtils.ts
import { CSSProperties } from 'react';

/**
 * Standard container style for all block editors
 * Provides consistent layout, spacing, and visual theming per block type
 */
export function getBlockContainerStyle(
    borderColor: string,
    backgroundColor: string,
    borderWidth: string = '2px'
): CSSProperties {
    return {
        border: `${borderWidth} solid ${borderColor}`,
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor,
        position: 'relative'
    };
}

/**
 * Standard header style for block editors
 * Provides consistent header layout across all block types
 */
export function getBlockHeaderStyle(): CSSProperties {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #ccc'
    };
}

/**
 * Standard label style for block editors
 * Provides consistent typography with customizable color
 */
export function getBlockLabelStyle(color: string): CSSProperties {
    return {
        color,
        fontWeight: 'bold',
        fontSize: '14px'
    };
}

/**
 * Standard button style for block editors
 * Provides consistent button appearance across all blocks
 */
export function getBlockButtonStyle(): CSSProperties {
    return {
        padding: '4px 8px',
        margin: '0 2px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px'
    };
}

/**
 * Standard input style for block editors
 * Ensures consistent form control appearance
 */
export function getBlockInputStyle(width?: string): CSSProperties {
    return {
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        margin: '0 4px',
        fontSize: '12px',
        ...(width && { width })
    };
}

/**
 * Standard section style for block editors
 * Used for sub-sections within blocks (like shop sections, encounter details, etc.)
 */
export function getBlockSectionStyle(borderColor: string): CSSProperties {
    return {
        margin: '12px 0',
        padding: '8px',
        border: `1px dashed ${borderColor}`,
        borderRadius: '4px',
        backgroundColor: '#f9f9f9'
    };
}

/**
 * Small action button style for move/delete operations
 * Provides consistent styling for action buttons (up/down/delete)
 */
export function getSmallActionButtonStyle(
    backgroundColor: string,
    isDisabled: boolean = false
): CSSProperties {
    return {
        width: '20px',
        height: '20px',
        borderRadius: '3px',
        border: '1px solid #ccc',
        backgroundColor: isDisabled ? '#ccc' : backgroundColor,
        color: 'white',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDisabled ? 0.3 : 1
    };
}

/**
 * Small button style for inline actions
 * Used for smaller buttons within lists and items
 */
export function getSmallButtonStyle(): CSSProperties {
    return {
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
    };
}

/**
 * Standard list container style for block editors
 * Used for styling lists within blocks (instruction lists, shop items, etc.)
 */
export function getBlockListContainerStyle(borderColor: string): CSSProperties {
    return {
        border: `1px dashed ${borderColor}`,
        borderRadius: '4px',
        padding: '8px',
        backgroundColor: '#fff'
    };
}

/**
 * Standard item container style for list items
 * Provides consistent styling for individual items within lists
 */
export function getBlockItemContainerStyle(): CSSProperties {
    return {
        position: 'relative',
        margin: '4px 0',
        border: '1px solid #e3f2fd',
        borderRadius: '4px',
        backgroundColor: '#fafafa'
    };
}

/**
 * Item toolbar style for action buttons on list items
 * Used for positioning action buttons on list items
 */
export function getItemToolbarStyle(): CSSProperties {
    return {
        position: 'absolute',
        top: '4px',
        right: '4px',
        display: 'flex',
        gap: '2px'
    };
}

/**
 * Remove button style for destructive actions
 * Provides consistent styling for delete/remove buttons
 */
export function getRemoveButtonStyle(): CSSProperties {
    return {
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '20px',
        height: '20px',
        borderRadius: '3px',
        border: '1px solid #ccc',
        backgroundColor: '#f44336',
        color: 'white',
        cursor: 'pointer',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
}

/**
 * Standard colors for different block types
 * Provides consistent color theming across the application
 */
export const BLOCK_COLORS = {
    textParagraph: {
        border: '#4caf50',
        background: '#f1f8e9',
        label: '#2e7d32'
    },
    textParagraphEmphasized: {
        border: '#ffc107',
        background: '#fff3cd',
        label: '#856404'
    },
    instructionList: {
        border: '#2196f3',
        background: '#e3f2fd',
        label: '#1976d2'
    },
    battle: {
        border: '#f44336',
        background: '#fff5f5',
        label: '#d32f2f'
    },
    image: {
        border: '#9c27b0',
        background: '#f3e5f5',
        label: '#7b1fa2'
    },
    conditional: {
        border: '#ff9800',
        background: '#fff3e0',
        label: '#f57c00'
    },
    shop: {
        border: '#ffc107',
        background: '#fffbf0',
        label: '#856404'
    },
    sphereGrid: {
        border: '#17a2b8',
        background: '#f0faff',
        label: '#117a8b'
    },
    sphereGridCharacterActions: {
        border: '#6f42c1',
        background: '#f8f5ff',
        label: '#5a2d91'
    },
    encounters: {
        border: '#dc3545',
        background: '#fff5f5',
        label: '#c82333'
    },
    trial: {
        border: '#fb7185',
        background: '#fff1f2',
        label: '#e11d48'
    },
    blitzballGame: {
        border: '#3b82f6',
        background: '#eff6ff',
        label: '#1d4ed8'
    },
    equip: {
        border: '#10b981',
        background: '#ecfdf5',
        label: '#059669'
    }
} as const;

/**
 * Utility to get standard colors for a block type
 * Provides type-safe access to block color themes
 */
export function getBlockColors(blockType: keyof typeof BLOCK_COLORS) {
    return BLOCK_COLORS[blockType];
}
