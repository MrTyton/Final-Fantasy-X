// src/editor/inline/FormationEditor.tsx
import React from 'react';
import type { FormationElement, CharacterReference } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardButtonStyle,
    INLINE_EDITOR_BACKGROUNDS,
    FFX_PARTY_CHARACTERS
} from './shared/inlineEditorUtils';

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

    return (
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.formation, '#17a2b8', '2px')}>
            <label style={{ fontSize: '10px', color: '#17a2b8', fontWeight: 'bold' }}>FORMATION:</label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {node.characters.map((character, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <select
                            value={character.characterName}
                            onChange={(e) => handleCharacterNameChange(index, e.target.value)}
                            style={{
                                ...getStandardInputStyle(),
                                fontSize: '11px',
                                color: character.color || '#17a2b8',
                                fontWeight: character.isBold ? 'bold' : 'normal'
                            }}
                        >
                            {FFX_PARTY_CHARACTERS.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleRemoveCharacter(index)}
                            style={getStandardButtonStyle('#dc3545')}
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
                        ...getStandardButtonStyle('#28a745'),
                        marginLeft: '3px',
                        padding: '2px 4px'
                    }}
                    title="Add character"
                >
                    +
                </button>
            </div>
        </div>
    );
};
