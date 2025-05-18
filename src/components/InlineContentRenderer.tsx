// src/components/InlineContentRenderer.tsx
import React, { JSX } from 'react';
import type { InlineElement, FormattedText, CharacterReference, GameMacro, LinkElement, NthElement, NumberElement, MathSymbolElement, CharacterCommand, FormationElement } from '../types';

// Define default character colors
const DEFAULT_CHARACTER_COLORS: Record<string, string> = {
    TIDUS: '#0070D1',    // Blue
    YUNA: '#E85D75',     // Pinkish-Red
    AURON: '#C02E21',    // Red
    WAKKA: '#F37F00',    // Burnt Orange / Orange
    LULU: '#784283',     // Purple
    RIKKU: '#64A843',    // Green
    KIMAHRI: '#3B5998',  // Dark Blue / Indigo
    SEYMOUR: '#4B0082',  // Indigo/Dark Purple (example)
    ENEMY: '#FF0000',    // Red for general enemy emphasis
    VALEFOR: '#ADD8E6',  // Light Blue (example for Aeon)
    IFRIT: '#FF4500',    // Orange-Red (example for Aeon)
    IXION: '#FFFF00',    // Yellow (example for Aeon)
    SHIVA: '#00FFFF',    // Cyan (example for Aeon)
    // Add other characters/entities as needed
};

const InlineContentRenderer: React.FC<{ element: InlineElement }> = ({ element }) => {
    switch (element.type) {
        case 'plainText':
            return <>{element.text}</>;
        case 'formattedText':
            const ft = element as FormattedText;
            const style: React.CSSProperties = {};
            if (ft.isBold) style.fontWeight = 'bold';
            if (ft.isItalic) style.fontStyle = 'italic';
            if (ft.color) style.color = ft.color;
            if (ft.isLarge) style.fontSize = '1.2em';
            if (ft.textDecoration) style.textDecoration = ft.textDecoration;
            return <span style={style}>{ft.text}</span>;

        case 'characterReference':
            const cr = element as CharacterReference;
            const characterKey = cr.characterName.toUpperCase();
            const colorFromDefaultMap = DEFAULT_CHARACTER_COLORS[characterKey];

            const crStyle: React.CSSProperties = {
                color: colorFromDefaultMap || cr.color || 'inherit', // Priority: Default Map, then JSON, then inherit
                fontWeight: cr.isBold ? 'bold' : 'normal',
            };
            return <span style={crStyle}>{cr.characterName}</span>;

        case 'characterCommand':
            const cc = element as CharacterCommand;
            const cmdCharKey = cc.characterName.toUpperCase();
            const cmdColorFromDefaultMap = DEFAULT_CHARACTER_COLORS[cmdCharKey];

            const ccStyle: React.CSSProperties = {
                color: cmdColorFromDefaultMap || cc.color || 'inherit', // Priority: Default Map, then JSON, then inherit
                fontWeight: cc.isBold ? 'bold' : 'normal',
            };
            // TODO: Handle cc.subItems if they exist (might need a more complex component)
            return <span style={ccStyle}>{cc.characterName}: {cc.actionText}</span>;

        case 'gameMacro':
            const gm = element as GameMacro;
            const gmStyle: React.CSSProperties = { fontWeight: 'bold' };
            return <span style={gmStyle}>{gm.macroName.toUpperCase()}{gm.value ? ` (${gm.value})` : ''}</span>;

        case 'formation':
            const form = element as FormationElement;
            return (
                <span style={{ fontStyle: 'italic' }}>
                    (Formation: {form.characters.map((char, idx) => (
                        <React.Fragment key={idx}>
                            <InlineContentRenderer element={char} />
                            {idx < form.characters.length - 1 && ', '}
                        </React.Fragment>
                    ))})
                </span>
            );

        case 'link':
            const link = element as LinkElement;
            return (
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.text.map((lt, i) => <InlineContentRenderer key={i} element={lt} />)}
                </a>
            );
        case 'nth':
            return <>{element.value}</>;
        case 'num':
            const numEl = element as NumberElement;
            return <>{numEl.value.toLocaleString()}</>;
        case 'mathSymbol':
            let remainingSymbol = (element as MathSymbolElement).symbol;
            const output: JSX.Element[] = [];
            let key = 0;
            const symbolMap: Record<string, string> = {
                '\\leftarrow': '←',   // U+2190
                '\\rightarrow': '→',  // U+2192
                '\\uparrow': '↑',     // U+2191
                '\\downarrow': '↓',   // U+2193
                '\\nearrow': '↗',     // U+2197 North-East
                '\\searrow': '↘',     // U+2198 South-East
                '\\swarrow': '↙',     // U+2199 South-West
                '\\nwarrow': '↖',     // U+2196 North-West
                // Add longest matches first if there's ambiguity, e.g. \leftrightarrow before \leftarrow
            };
            const knownSymbols = Object.keys(symbolMap).sort((a, b) => b.length - a.length); // Process longer symbols first

            while (remainingSymbol.length > 0) {
                let foundMatch = false;
                for (const latexSymbol of knownSymbols) {
                    if (remainingSymbol.startsWith(latexSymbol)) {
                        output.push(<React.Fragment key={key++}>{symbolMap[latexSymbol]}</React.Fragment>);
                        remainingSymbol = remainingSymbol.substring(latexSymbol.length);
                        foundMatch = true;
                        break;
                    }
                }
                if (!foundMatch) {
                    // Take the first character if no known symbol matches, and continue
                    output.push(<React.Fragment key={key++}>{remainingSymbol[0]}</React.Fragment>);
                    remainingSymbol = remainingSymbol.substring(1);
                }
            }
            return <>{output}</>;
        default:
            const _exhaustiveCheck: never = element;
            console.warn('Unsupported InlineElement type:', _exhaustiveCheck);
            return <span style={{ color: 'red' }}>Unsupported inline: {(element as any).type}</span>;
    }
};

export default InlineContentRenderer;