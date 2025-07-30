// src/editor/inline/FormationEditor.tsx
import React from 'react';
import type { FormationElement, CharacterReference } from '../../types';

interface FormationEditorProps {
    node: FormationElement;
    onChange: (newNode: FormationElement) => void;
}

export const FormationEditor: React.FC<FormationEditorProps> = ({ node, onChange }) => {
    const handleAddCharacter = () => {
        const newCharacter: CharacterReference = {
            type: 'characterReference',
            characterName: 'Tidus'
        };
        onChange({
            ...node,
            characters: [...node.characters, newCharacter]
        });
    };

    const handleRemoveCharacter = (index: number) => {
        const newCharacters = node.characters.filter((_, i) => i !== index);
        onChange({
            ...node,
            characters: newCharacters
        });
    };

    const handleCharacterNameChange = (index: number, newName: string) => {
        const newCharacters = [...node.characters];
        newCharacters[index] = { ...newCharacters[index], characterName: newName };
        onChange({
            ...node,
            characters: newCharacters
        });
    };

    const characterOptions = [
        'Tidus', 'Yuna', 'Auron', 'Wakka', 'Lulu', 'Rikku', 'Kimahri', 'Seymour'
    ];

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            margin: '2px',
            padding: '6px',
            border: '2px solid #17a2b8',
            borderRadius: '4px',
            backgroundColor: '#e6f7ff'
        }}>
            <label style={{ fontSize: '10px', color: '#17a2b8', fontWeight: 'bold' }}>FORMATION:</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {node.characters.map((character, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <select
                            value={character.characterName}
                            onChange={(e) => handleCharacterNameChange(index, e.target.value)}
                            style={{
                                border: '1px solid #ccc',
                                padding: '1px',
                                borderRadius: '2px',
                                fontSize: '11px',
                                color: character.color || '#17a2b8',
                                fontWeight: character.isBold ? 'bold' : 'normal'
                            }}
                        >
                            {characterOptions.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleRemoveCharacter(index)}
                            style={{
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '2px',
                                fontSize: '10px',
                                padding: '1px 3px',
                                cursor: 'pointer'
                            }}
                            title="Remove character"
                        >
                            ×
                        </button>
                        {index < node.characters.length - 1 && (
                            <span style={{ fontSize: '10px', color: '#666' }}>,</span>
                        )}
                    </div>
                ))}

                <button
                    onClick={handleAddCharacter}
                    style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '10px',
                        padding: '2px 4px',
                        cursor: 'pointer',
                        marginLeft: '3px'
                    }}
                    title="Add character"
                >
                    +
                </button>
            </div>
        </div>
    );
};
