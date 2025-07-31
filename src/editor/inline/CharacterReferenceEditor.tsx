// src/editor/inline/CharacterReferenceEditor.tsx
import React from 'react';
import type { CharacterReference } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    INLINE_EDITOR_BACKGROUNDS,
    FFX_CHARACTERS,
    getDefaultCharacterColor
} from './shared/inlineEditorUtils';

interface CharacterReferenceEditorProps {
    node: CharacterReference;
    onChange: (newNode: CharacterReference) => void;
}

export const CharacterReferenceEditor: React.FC<CharacterReferenceEditorProps> = ({ node, onChange }) => {
    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const characterName = e.target.value;
        const defaultColor = getDefaultCharacterColor(characterName);
        onChange({
            ...node,
            characterName,
            color: defaultColor || node.color
        });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, color: e.target.value || undefined });
    };

    const handleBoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, isBold: e.target.checked || undefined });
    };

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.character)}>
            <select
                value={node.characterName}
                onChange={handleCharacterChange}
                style={getStandardInputStyle()}
            >
                {FFX_CHARACTERS.map(char => (
                    <option key={char} value={char}>{char}</option>
                ))}
                <option value="">Custom...</option>
            </select>
            {!FFX_CHARACTERS.includes(node.characterName as any) && (
                <input
                    type="text"
                    value={node.characterName}
                    onChange={(e) => onChange({ ...node, characterName: e.target.value })}
                    style={getStandardInputStyle('80px')}
                    placeholder="Character"
                />
            )}
            <input
                type="text"
                value={node.color || ''}
                onChange={handleColorChange}
                style={getStandardInputStyle('60px')}
                placeholder="Color"
            />
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                    type="checkbox"
                    checked={node.isBold || false}
                    onChange={handleBoldChange}
                />
                B
            </label>
        </div>
    );
};
