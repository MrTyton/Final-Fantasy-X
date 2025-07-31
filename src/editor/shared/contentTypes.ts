// src/editor/shared/contentTypes.ts

/**
 * Centralized content type definitions used across editors
 * Provides consistent labels, icons, and descriptions
 */

export interface ContentType {
    value: string;
    label: string;
    description?: string;
    shortcut?: string;
    category?: string;
}

export interface ContentTypeCategory {
    category: string;
    items: ContentType[];
}

/**
 * Comprehensive content types with descriptions for ConditionalEditor
 */
export const CONTENT_TYPES_WITH_DESCRIPTIONS: ContentType[] = [
    { value: 'textParagraph', label: '📝 Text Paragraph', description: 'Simple text content' },
    { value: 'instructionList', label: '📋 Instruction List', description: 'Step-by-step instructions' },
    { value: 'battle', label: '⚔️ Battle', description: 'Battle encounter setup' },
    { value: 'image', label: '🖼️ Image', description: 'Image with caption' },
    { value: 'shop', label: '🛒 Shop', description: 'Shop purchase list' },
    { value: 'sphereGrid', label: '🌐 Sphere Grid', description: 'Sphere grid actions' },
    { value: 'encounters', label: '👹 Encounters', description: 'Enemy encounter details' },
    { value: 'trial', label: '🏛️ Trial', description: 'Cloister trial information' },
    { value: 'equip', label: '⚔️ Equipment', description: 'Equipment changes' },
    { value: 'conditional', label: '❓ Conditional', description: 'Nested conditional logic' },
    { value: 'listItem', label: '• List Item', description: 'Single list item' }
];

/**
 * Categorized content types with shortcuts for EditorViewer
 */
export const CONTENT_TYPE_CATEGORIES: ContentTypeCategory[] = [
    {
        category: 'Content',
        items: [
            { value: 'textParagraph', label: '📝 Text Paragraph', shortcut: '1' },
            { value: 'instructionList', label: '📋 Instruction List', shortcut: '2' },
            { value: 'image', label: '🖼️ Image', shortcut: '3' }
        ]
    },
    {
        category: 'Gameplay',
        items: [
            { value: 'battle', label: '⚔️ Battle', shortcut: '4' },
            { value: 'encounters', label: '👹 Encounters', shortcut: '5' },
            { value: 'trial', label: '🏛️ Trial', shortcut: '6' },
            { value: 'blitzballGame', label: '⚽ Blitzball Game', shortcut: '7' }
        ]
    },
    {
        category: 'Character',
        items: [
            { value: 'sphereGrid', label: '🔮 Sphere Grid', shortcut: '8' },
            { value: 'sphereGridCharacterActions', label: '👤 Character Actions', shortcut: '9' },
            { value: 'equip', label: '⚔️ Equipment', shortcut: '0' }
        ]
    },
    {
        category: 'Other',
        items: [
            { value: 'shop', label: '🏪 Shop', shortcut: 'S' },
            { value: 'conditional', label: '🔀 Conditional', shortcut: 'C' }
        ]
    }
];

/**
 * Flattened list of all content types with shortcuts for easy lookup
 */
export const ALL_CONTENT_TYPES: ContentType[] = CONTENT_TYPE_CATEGORIES.flatMap(category => category.items);
