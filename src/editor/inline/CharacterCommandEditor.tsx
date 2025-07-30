// src/editor/inline/CharacterCommandEditor.tsx
import React from 'react';
import type { CharacterCommand } from '../../types';

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
            backgroundColor: '#f3e5f5'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Cmd:</span>
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
                value={node.actionText}
                onChange={handleCommandChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    minWidth: '100px'
                }}
                placeholder="Command"
            />
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
