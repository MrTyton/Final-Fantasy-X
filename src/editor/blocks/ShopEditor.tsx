// src/editor/blocks/ShopEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { ShopBlock, ShopSection, ListItemElement } from '../../types';
import {
    getBlockContainerStyle,
    getBlockHeaderStyle,
    getBlockLabelStyle,
    getBlockButtonStyle,
    getBlockInputStyle,
    getBlockSectionStyle,
    getBlockColors
} from './shared/blockEditorUtils';

interface ShopEditorProps {
    block: ShopBlock;
    path: (string | number)[];
}

export const ShopEditor: React.FC<ShopEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);

    const updateGilInfo = (newGilInfo: string) => {
        const newBlock = { ...block, gilInfo: newGilInfo };
        updateNode(path, newBlock);
    };

    const addSection = () => {
        const newSection: ShopSection = {
            title: 'New Section',
            items: []
        };
        const newSections = [...block.sections, newSection];
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const removeSection = (sectionIndex: number) => {
        const newSections = block.sections.filter((_, i) => i !== sectionIndex);
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const updateSectionTitle = (sectionIndex: number, newTitle: string) => {
        const newSections = [...block.sections];
        newSections[sectionIndex] = { ...newSections[sectionIndex], title: newTitle };
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const addItemToSection = (sectionIndex: number, contentType: string = 'plainText') => {
        let newContent;
        switch (contentType) {
            case 'plainText':
                newContent = [{ type: 'plainText', text: 'New item' }];
                break;
            case 'formattedText':
                newContent = [{ type: 'formattedText', text: 'New formatted item' }];
                break;
            case 'characterReference':
                newContent = [{ type: 'characterReference', characterName: 'tidus' }];
                break;
            case 'characterCommand':
                newContent = [{ type: 'characterCommand', characterName: 'tidus', actionText: 'Action' }];
                break;
            case 'gameMacro':
                newContent = [{ type: 'gameMacro', macroName: 'sd' }];
                break;
            case 'formation':
                newContent = [{ type: 'formation', characters: [{ type: 'characterReference', characterName: 'tidus' }] }];
                break;
            case 'link':
                newContent = [{ type: 'link', url: 'https://example.com', text: 'Link' }];
                break;
            case 'nth':
                newContent = [{ type: 'nth', number: 1 }];
                break;
            case 'num':
                newContent = [{ type: 'num', value: 1 }];
                break;
            case 'mathSymbol':
                newContent = [{ type: 'mathSymbol', symbol: 'plus' }];
                break;
            case 'conditional':
                newContent = [{ type: 'conditional', condition: 'condition', trueContent: [], falseContent: [] }];
                break;
            case 'textParagraph':
                newContent = [{ type: 'textParagraph', content: [{ type: 'plainText', text: 'New paragraph' }] }];
                break;
            case 'battle':
                newContent = [{ type: 'battle', enemyName: 'Enemy', strategy: [] }];
                break;
            case 'instructionList':
                newContent = [{ type: 'instructionList', items: [] }];
                break;
            default:
                newContent = [{ type: 'plainText', text: 'New item' }];
        }

        const newItem: ListItemElement = {
            type: 'listItem',
            content: newContent as any
        };

        const newSections = [...block.sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            items: [...newSections[sectionIndex].items, newItem]
        };
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const removeItemFromSection = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...block.sections];
        newSections[sectionIndex] = {
            ...newSections[sectionIndex],
            items: newSections[sectionIndex].items.filter((_, i) => i !== itemIndex)
        };
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const moveItemUpInSection = (sectionIndex: number, itemIndex: number) => {
        if (itemIndex === 0) return;
        const newSections = [...block.sections];
        const sectionItems = [...newSections[sectionIndex].items];
        [sectionItems[itemIndex - 1], sectionItems[itemIndex]] = [sectionItems[itemIndex], sectionItems[itemIndex - 1]];
        newSections[sectionIndex] = { ...newSections[sectionIndex], items: sectionItems };
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const moveItemDownInSection = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...block.sections];
        const sectionItems = [...newSections[sectionIndex].items];
        if (itemIndex === sectionItems.length - 1) return;
        [sectionItems[itemIndex], sectionItems[itemIndex + 1]] = [sectionItems[itemIndex + 1], sectionItems[itemIndex]];
        newSections[sectionIndex] = { ...newSections[sectionIndex], items: sectionItems };
        const newBlock = { ...block, sections: newSections };
        updateNode(path, newBlock);
    };

    const colors = getBlockColors('shop');
    const containerStyle = getBlockContainerStyle(colors.border, colors.background);
    const headerStyle = getBlockHeaderStyle();
    const labelStyle = getBlockLabelStyle(colors.label);
    const buttonStyle = getBlockButtonStyle();
    const inputStyle = getBlockInputStyle('200px');
    const sectionStyle = getBlockSectionStyle(colors.border);

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={labelStyle}>
                    🏪 Shop
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
                <>
                    <div style={{ marginBottom: '12px' }}>
                        <label>
                            <strong>Gil Info:</strong>
                            <input
                                type="text"
                                value={block.gilInfo}
                                onChange={(e) => updateGilInfo(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter gil information"
                            />
                        </label>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong>Sections:</strong>
                            <button
                                style={buttonStyle}
                                onClick={addSection}
                                title="Add section"
                            >
                                + Section
                            </button>
                        </div>

                        {block.sections.length === 0 ? (
                            <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                No sections - click "+ Section" to add sections
                            </em>
                        ) : (
                            block.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex} style={{
                                    margin: '8px 0',
                                    padding: '8px',
                                    border: '1px solid #fff3cd',
                                    borderRadius: '4px',
                                    backgroundColor: '#fefefe',
                                    position: 'relative'
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
                                        onClick={() => removeSection(sectionIndex)}
                                        title="Remove section"
                                    >
                                        ×
                                    </button>

                                    <div style={{ marginBottom: '8px', paddingRight: '30px' }}>
                                        <label>
                                            <strong>Title:</strong>
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                                                style={{ ...inputStyle, width: '150px' }}
                                                placeholder="Section title"
                                            />
                                        </label>
                                    </div>

                                    <div style={{ marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <strong>Items:</strong>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addItemToSection(sectionIndex, e.target.value);
                                                        e.target.value = ''; // Reset selection
                                                    }
                                                }}
                                                style={{
                                                    ...buttonStyle,
                                                    width: '100px',
                                                    cursor: 'pointer'
                                                }}
                                                defaultValue=""
                                                title="Add item"
                                            >
                                                <option value="" disabled>+ Add Item</option>
                                                <optgroup label="Inline">
                                                    <option value="plainText">📝 Text</option>
                                                    <option value="formattedText">🎨 Formatted</option>
                                                    <option value="characterReference">👤 Character</option>
                                                    <option value="characterCommand">⚡ Command</option>
                                                    <option value="gameMacro">🎮 Macro</option>
                                                    <option value="formation">👥 Formation</option>
                                                    <option value="link">🔗 Link</option>
                                                    <option value="nth">🔢 Nth</option>
                                                    <option value="num">💯 Number</option>
                                                    <option value="mathSymbol">➕ Math Symbol</option>
                                                </optgroup>
                                                <optgroup label="Blocks">
                                                    <option value="conditional">🔀 Conditional</option>
                                                    <option value="textParagraph">📝 Text Paragraph</option>
                                                    <option value="battle">⚔️ Battle</option>
                                                    <option value="instructionList">📋 Instruction List</option>
                                                </optgroup>
                                            </select>
                                        </div>

                                        {section.items.length === 0 ? (
                                            <em style={{ color: '#666', fontSize: '12px', display: 'block', textAlign: 'center', padding: '10px' }}>
                                                No items - click "+ Add Item" to add items
                                            </em>
                                        ) : (
                                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                                {section.items.map((item, itemIndex) => (
                                                    <li key={itemIndex} style={{ position: 'relative', marginBottom: '6px' }}>
                                                        <div style={{
                                                            position: 'relative',
                                                            border: '1px solid #fff3cd',
                                                            borderRadius: '3px',
                                                            backgroundColor: '#fafafa',
                                                            paddingRight: '70px'
                                                        }}>
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '4px',
                                                                right: '4px',
                                                                display: 'flex',
                                                                gap: '2px'
                                                            }}>
                                                                <button
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '2px',
                                                                        border: '1px solid #ccc',
                                                                        backgroundColor: itemIndex === 0 ? '#ccc' : '#2196f3',
                                                                        color: 'white',
                                                                        cursor: itemIndex === 0 ? 'not-allowed' : 'pointer',
                                                                        fontSize: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                    onClick={() => moveItemUpInSection(sectionIndex, itemIndex)}
                                                                    disabled={itemIndex === 0}
                                                                    title="Move up"
                                                                >
                                                                    ↑
                                                                </button>
                                                                <button
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '2px',
                                                                        border: '1px solid #ccc',
                                                                        backgroundColor: itemIndex === section.items.length - 1 ? '#ccc' : '#2196f3',
                                                                        color: 'white',
                                                                        cursor: itemIndex === section.items.length - 1 ? 'not-allowed' : 'pointer',
                                                                        fontSize: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                    onClick={() => moveItemDownInSection(sectionIndex, itemIndex)}
                                                                    disabled={itemIndex === section.items.length - 1}
                                                                    title="Move down"
                                                                >
                                                                    ↓
                                                                </button>
                                                                <button
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        borderRadius: '2px',
                                                                        border: '1px solid #ccc',
                                                                        backgroundColor: '#f44336',
                                                                        color: 'white',
                                                                        cursor: 'pointer',
                                                                        fontSize: '8px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center'
                                                                    }}
                                                                    onClick={() => removeItemFromSection(sectionIndex, itemIndex)}
                                                                    title="Remove item"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <NodeRenderer
                                                                node={item}
                                                                path={[...path, 'sections', sectionIndex, 'items', itemIndex]}
                                                            />
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
