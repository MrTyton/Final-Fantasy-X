# Inline Editor Refactoring Guide

This guide shows how to use the shared utilities to eliminate redundancy and improve maintainability across all inline editor components.

## What We've Refactored

### Before: Individual Styling in Each Component
Each component had its own copy of:
- Container styling (inline-flex, alignItems, gap, etc.)
- Input/select styling (border, padding, borderRadius)
- Character lists and color mappings
- Label styling

### After: Shared Utilities
All common patterns are now centralized in `src/editor/inline/shared/inlineEditorUtils.ts`

## Migration Examples

### 1. Container Styling
**Before:**
```tsx
<div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    margin: '2px',
    padding: '4px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    backgroundColor: '#e0f2f1'
}}>
```

**After:**
```tsx
import { getInlineEditorContainerStyle, INLINE_EDITOR_BACKGROUNDS } from './shared/inlineEditorUtils';

<div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.number)}>
```

### 2. Input/Select Styling
**Before:**
```tsx
<input
    style={{
        border: '1px solid #ccc',
        padding: '2px 4px',
        borderRadius: '2px',
        width: '60px'
    }}
/>
```

**After:**
```tsx
import { getStandardInputStyle } from './shared/inlineEditorUtils';

<input style={getStandardInputStyle('60px')} />
```

### 3. Character Lists
**Before:**
```tsx
const characters = [
    'Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Kimahri', 'Rikku',
    'Seymour', 'Jecht', 'Braska', 'Cid', 'Yunalesca', 'Yu Yevon'
];
```

**After:**
```tsx
import { FFX_CHARACTERS } from './shared/inlineEditorUtils';

// Use FFX_CHARACTERS directly
```

### 4. Character Colors
**Before:**
```tsx
const getDefaultCharacterColor = (characterName: string): string | undefined => {
    const defaultColors: Record<string, string> = {
        'Tidus': 'blue',
        'Yuna': 'gray',
        // ... more colors
    };
    return defaultColors[characterName];
};
```

**After:**
```tsx
import { getDefaultCharacterColor } from './shared/inlineEditorUtils';

// Use the shared function directly
```

## Remaining Components to Refactor

The following components still need to be updated to use the shared utilities:

### High Priority (Most Redundant)
1. **CharacterCommandEditor.tsx** - Uses character list and standard styling
2. **FormationEditor.tsx** - Uses character list and has action buttons
3. **FormattedTextEditor.tsx** - Uses standard styling and textarea
4. **LinkEditor.tsx** - Uses standard styling

### Medium Priority
5. **MathSymbolEditor.tsx** - Uses standard styling (math symbols already centralized)
6. **NthEditor.tsx** - Uses standard styling

## Benefits of This Refactoring

### 1. Consistency
- All components now use exactly the same styling
- Visual alignment issues are eliminated
- Changes apply universally

### 2. Maintainability  
- Single source of truth for styling
- Easy to update colors, spacing, or layout
- Less code duplication

### 3. Developer Experience
- Clear, semantic function names
- Centralized constants for data
- TypeScript support for all utilities

### 4. Future Updates
To change the appearance of all inline editors:
- **Before**: Update 10+ individual files
- **After**: Update 1 shared utilities file

## Example: Updating All Button Colors
```tsx
// In inlineEditorUtils.ts - one change affects all components
export function getStandardButtonStyle(backgroundColor: string, color: string = 'white'): CSSProperties {
    return {
        background: backgroundColor,
        color,
        border: 'none',
        borderRadius: '4px', // Changed from 2px - affects all buttons
        fontSize: '10px',
        padding: '2px 6px', // Increased padding - affects all buttons
        cursor: 'pointer'
    };
}
```

## Next Steps

1. **Complete Migration**: Update remaining 6 components to use shared utilities
2. **Add More Utilities**: Consider adding utilities for common patterns like:
   - Color picker inputs
   - Add/remove button pairs
   - Validation styling
3. **Documentation**: Add JSDoc comments to all utility functions
4. **Testing**: Ensure all components render identically after migration
