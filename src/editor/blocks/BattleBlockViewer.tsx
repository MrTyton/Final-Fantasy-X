// src/editor/blocks/BattleBlockViewer.tsx
import React from 'react';
import { NodeRenderer } from '../NodeRenderer';
import type { BattleBlock } from '../../types';

interface BattleBlockViewerProps {
    block: BattleBlock;
    path: (string | number)[]; // The path to this BattleBlock itself
}

export const BattleBlockViewer: React.FC<BattleBlockViewerProps> = ({ block, path }) => {
    return (
        <div style={{ border: '1px solid #ffcdd2', backgroundColor: '#fff8f8', padding: '15px', margin: '10px 0', borderRadius: '4px' }}>
            <h3 style={{ marginTop: 0, color: '#c62828' }}>
                Battle: {block.enemyName}
                {block.hp && <span style={{ color: '#777', fontWeight: 'normal' }}> - {block.hp} HP</span>}
            </h3>

            <div>
                <strong>Strategy:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    {block.strategy.map((strategyNode, index) => (
                        <li key={index}>
                            <NodeRenderer
                                node={strategyNode}
                                // The path to each strategy step is the block's path + 'strategy' + its index
                                path={[...path, 'strategy', index]}
                            />
                        </li>
                    ))}
                </ul>
            </div>

            {block.notes && block.notes.length > 0 && (
                <div style={{ marginTop: '15px', borderTop: '1px dashed #e57373', paddingTop: '10px' }}>
                    <strong>Notes:</strong>
                    <div style={{ fontStyle: 'italic', color: '#555', marginLeft: '20px' }}>
                        {block.notes.map((noteNode, index) => (
                            <NodeRenderer
                                key={index}
                                node={noteNode}
                                path={[...path, 'notes', index]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};