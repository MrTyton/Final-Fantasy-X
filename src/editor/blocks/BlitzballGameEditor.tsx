// src/editor/blocks/BlitzballGameEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { BlitzballGameBlock, ListItemElement } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getBlockSectionStyle,
    getBlockColors
} from './shared/blockEditorUtils';

interface BlitzballGameEditorProps {
    block: BlitzballGameBlock;
    path: (string | number)[];
}

export const BlitzballGameEditor: React.FC<BlitzballGameEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const addStrategy = () => {
        const newStrategy: ListItemElement = {
            type: 'listItem',
            content: [{ type: 'plainText', text: 'New blitzball strategy' }]
        };
        const newStrategies = [...block.strategy, newStrategy];
        const newBlock = { ...block, strategy: newStrategies };
        updateNode(path, newBlock);
    };

    const removeStrategy = (index: number) => {
        const newStrategies = block.strategy.filter((_, i) => i !== index);
        const newBlock = { ...block, strategy: newStrategies };
        updateNode(path, newBlock);
    };

    const colors = getBlockColors('blitzballGame');
    const containerStyle = getBlockContainerStyle(colors.border, colors.background);
    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();
    const sectionStyle = getBlockSectionStyle(colors.border);

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    ⚽ Blitzball Game
                </span>
                <div>
                    <button
                        style={buttonStyle}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? '▼ Collapse' : '▶ Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>Strategy:</strong>
                        <button
                            style={buttonStyle}
                            onClick={addStrategy}
                            title="Add strategy"
                        >
                            + Strategy
                        </button>
                    </div>

                    {block.strategy.length === 0 ? (
                        <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                            No strategy items - click "+ Strategy" to add game strategies
                        </em>
                    ) : (
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {block.strategy.map((strategy, index) => (
                                <li key={index} style={{ position: 'relative', marginBottom: '8px' }}>
                                    <div style={{
                                        position: 'relative',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '4px',
                                        backgroundColor: '#fafafa',
                                        paddingRight: '40px'
                                    }}>
                                        <button
                                            style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '3px',
                                                border: '1px solid #ccc',
                                                backgroundColor: '#f44336',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onClick={() => removeStrategy(index)}
                                            title="Remove strategy"
                                        >
                                            ×
                                        </button>
                                        <NodeRenderer
                                            node={strategy}
                                            path={[...path, 'strategy', index]}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
