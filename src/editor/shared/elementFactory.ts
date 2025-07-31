// src/editor/shared/elementFactory.ts
import type { InlineElement, ChapterContent, ListItemElement } from '../../types';

/**
 * Factory function to create inline elements with consistent defaults
 * Eliminates duplication across block editors
 */
export function createInlineElement(type: string, customText?: string): InlineElement {
    switch (type) {
        case 'plainText':
            return {
                type: 'plainText',
                text: customText || 'New text'
            };
        case 'formattedText':
            return {
                type: 'formattedText',
                text: customText || 'New formatted text'
            };
        case 'characterReference':
            return {
                type: 'characterReference',
                characterName: 'tidus'
            };
        case 'characterCommand':
            return {
                type: 'characterCommand',
                characterName: 'tidus',
                actionText: 'Attack'
            };
        case 'gameMacro':
            return {
                type: 'gameMacro',
                macroName: 'sd'
            };
        case 'formation':
            return {
                type: 'formation',
                characters: [{ type: 'characterReference', characterName: 'tidus' }]
            };
        case 'link':
            return {
                type: 'link',
                url: 'https://example.com',
                text: [{ type: 'formattedText', text: 'Link text' }]
            };
        case 'nth':
            return {
                type: 'nth',
                value: '1st'
            };
        case 'num':
            return {
                type: 'num',
                value: 0
            };
        case 'mathSymbol':
            return {
                type: 'mathSymbol',
                symbol: 'plus'
            };
        default:
            return {
                type: 'plainText',
                text: customText || 'New text'
            };
    }
}

/**
 * Factory function to create block templates with consistent defaults
 * Centralizes block creation logic from EditorViewer
 */
export function createBlockTemplate(blockType: string): ChapterContent {
    switch (blockType) {
        case 'textParagraph':
            return {
                type: 'textParagraph',
                content: [createInlineElement('plainText', 'New paragraph')]
            };
        case 'instructionList':
            return {
                type: 'instructionList',
                ordered: false,
                items: []
            };
        case 'battle':
            return {
                type: 'battle',
                enemyName: 'New Enemy',
                strategy: []
            };
        case 'image':
            return {
                type: 'image',
                path: ''
            };
        case 'conditional':
            return {
                type: 'conditional',
                conditionSource: 'textual_direct_choice',
                winContent: [createInlineElement('plainText', 'Content when condition is true')],
                lossContent: [createInlineElement('plainText', 'Content when condition is false')]
            };
        case 'shop':
            return {
                type: 'shop',
                gilInfo: 'Gil information',
                sections: []
            };
        case 'sphereGrid':
            return {
                type: 'sphereGrid',
                content: []
            };
        case 'encounters':
            return {
                type: 'encounters',
                content: []
            };
        case 'trial':
            return {
                type: 'trial',
                steps: []
            };
        case 'blitzballGame':
            return {
                type: 'blitzballGame',
                strategy: []
            };
        case 'equip':
            return {
                type: 'equip',
                content: []
            };
        default:
            return {
                type: 'textParagraph',
                content: [createInlineElement('plainText', 'New content')]
            };
    }
}

/**
 * Helper function to create a ListItemElement with inline content
 * Used by block editors that need to wrap inline elements in list items
 */
export function createListItemWithContent(contentType: string, customText?: string): ListItemElement {
    const content = [createInlineElement(contentType, customText)];
    return {
        type: 'listItem',
        content: content as any
    };
}

/**
 * Common inline element types for dropdown options
 * Provides consistent categorization across components
 */
export const INLINE_ELEMENT_TYPES = [
    // Text & Formatting
    { value: 'plainText', label: '📝 Plain Text', category: 'text' },
    { value: 'formattedText', label: '🎨 Formatted Text', category: 'text' },

    // Characters & Actions
    { value: 'characterReference', label: '👤 Character', category: 'character' },
    { value: 'characterCommand', label: '⚡ Command', category: 'character' },
    { value: 'formation', label: '👥 Formation', category: 'character' },

    // Game Elements
    { value: 'gameMacro', label: '🎮 Game Macro', category: 'game' },
    { value: 'link', label: '🔗 Link', category: 'game' },
    { value: 'nth', label: '🔢 Ordinal (1st, 2nd)', category: 'game' },
    { value: 'num', label: '🔢 Number', category: 'game' },
    { value: 'mathSymbol', label: '➕ Math Symbol', category: 'game' }
] as const;

/**
 * Get inline element types by category for organized dropdowns
 */
export function getInlineElementsByCategory() {
    return {
        text: INLINE_ELEMENT_TYPES.filter(type => type.category === 'text'),
        character: INLINE_ELEMENT_TYPES.filter(type => type.category === 'character'),
        game: INLINE_ELEMENT_TYPES.filter(type => type.category === 'game')
    };
}
