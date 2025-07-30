// src/editor/inline/CharacterReferenceEditor.tsx
import React from 'react';
import type { CharacterReference } from '../../types';

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

    // Default character colors based on the JSON data
    const getDefaultCharacterColor = (characterName: string): string | undefined => {
        const defaultColors: Record<string, string> = {
            'Tidus': 'blue',
            'Yuna': 'gray',
            'Auron': 'red',
            'Wakka': 'BurntOrange',
            'Lulu': 'purple',
            'Kimahri': 'Tan',
            'Rikku': 'ForestGreen'
        };
        return defaultColors[characterName];
    };

    // Common FFX character names
    const characters = [
        'Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Kimahri', 'Rikku',
        'Seymour', 'Jecht', 'Braska', 'Cid', 'Yunalesca', 'Yu Yevon'
    ];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            margin: '2px',
            padding: '4px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            backgroundColor: '#e3f2fd'
        }}>
            <select
                value={node.characterName}
                onChange={handleCharacterChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px'
                }}
            >
                {characters.map(char => (
                    <option key={char} value={char}>{char}</option>
                ))}
                <option value="">Custom...</option>
            </select>
            {!characters.includes(node.characterName) && (
                <input
                    type="text"
                    value={node.characterName}
                    onChange={(e) => onChange({ ...node, characterName: e.target.value })}
                    style={{
                        border: '1px solid #ccc',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        width: '80px'
                    }}
                    placeholder="Character"
                />
            )}
            <input
                type="text"
                value={node.color || ''}
                onChange={handleColorChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    width: '60px'
                }}
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
