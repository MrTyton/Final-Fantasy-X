// src/editor/inline/GameMacroEditor.tsx
import React from 'react';
import type { GameMacro } from '../../types';

interface GameMacroEditorProps {
    node: GameMacro;
    onChange: (newNode: GameMacro) => void;
}

export const GameMacroEditor: React.FC<GameMacroEditorProps> = ({ node, onChange }) => {
    const handleMacroNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as GameMacro['macroName'];
        onChange({ ...node, macroName: value });
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...node, value: e.target.value || undefined });
    };

    // Valid macro names from the type definition
    const validMacros: GameMacro['macroName'][] = [
        'sd', 'cs', 'fmv', 'skippableFmv', 'save', 'pickup', 'od'
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
            backgroundColor: '#fff3e0'
        }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Macro:</span>
            <select
                value={node.macroName}
                onChange={handleMacroNameChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px'
                }}
            >
                {validMacros.map(macro => (
                    <option key={macro} value={macro}>{macro}</option>
                ))}
            </select>
            <input
                type="text"
                value={node.value || ''}
                onChange={handleValueChange}
                style={{
                    border: '1px solid #ccc',
                    padding: '2px 4px',
                    borderRadius: '2px',
                    width: '60px'
                }}
                placeholder="Value"
            />
        </div>
    );
};
