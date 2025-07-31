// src/editor/inline/CharacterCommandEditor.tsx
import React from 'react';
import type { CharacterCommand } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    INLINE_EDITOR_BACKGROUNDS,
    FFX_CHARACTERS
} from './shared/inlineEditorUtils';

interface CharacterCommandEditorProps {
    node: CharacterCommand;
    onChange: (newNode: CharacterCommand) => void;
}

export const CharacterCommandEditor: React.FC<CharacterCommandEditorProps> = ({ node, onChange }) => {
    const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...node, characterName: e.target.value });
    };

    const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, actionText: e.target.value });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, color: e.target.value || undefined });
    };

    const handleBoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, isBold: e.target.checked || undefined });
    };

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.command)}>
            <span style={getStandardLabelStyle()}>Cmd:</span>
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
                value={node.actionText}
                onChange={handleCommandChange}
                style={getStandardInputStyle('100px')}
                placeholder="Command"
            />
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
