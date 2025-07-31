// src/editor/inline/GameMacroEditor.tsx
import React from 'react';
import type { GameMacro } from '../../types';
import {
    getInlineEditorContainerStyle,
    getStandardInputStyle,
    getStandardLabelStyle,
    INLINE_EDITOR_BACKGROUNDS
} from './shared/inlineEditorUtils';

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
        <div style={getInlineEditorContainerStyle(INLINE_EDITOR_BACKGROUNDS.macro)}>
            <span style={getStandardLabelStyle()}>Macro:</span>
            <select
                value={node.macroName}
                onChange={handleMacroNameChange}
                style={getStandardInputStyle()}
            >
                {validMacros.map(macro => (
                    <option key={macro} value={macro}>{macro}</option>
                ))}
            </select>
            <input
                type="text"
                value={node.value || ''}
                onChange={handleValueChange}
                style={getStandardInputStyle('60px')}
                placeholder="Value"
            />
        </div>
    );
};
