// src/editor/blocks/ConditionalEditor.tsx
import React, { useState } from 'react';
import { NodeRenderer } from '../NodeRenderer';
import { useEditorStore } from '../store';
import type { ConditionalBlock, FormattedText } from '../../types';

interface ConditionalEditorProps {
    block: ConditionalBlock;
    path: (string | number)[];
}

export const ConditionalEditor: React.FC<ConditionalEditorProps> = ({ block, path }) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [isExpanded, setIsExpanded] = useState(true);
    const [showContentTypeModal, setShowContentTypeModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState<'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent' | 'contentToShowIfTrue' | 'contentToShowIfFalse' | null>(null);

    const contentTypes = [
        { value: 'textParagraph', label: '📝 Text Paragraph', description: 'Simple text content' },
        { value: 'instructionList', label: '📋 Instruction List', description: 'Step-by-step instructions' },
        { value: 'battle', label: '⚔️ Battle', description: 'Battle encounter setup' },
        { value: 'image', label: '🖼️ Image', description: 'Image with caption' },
        { value: 'shop', label: '🛒 Shop', description: 'Shop purchase list' },
        { value: 'sphereGrid', label: '🌐 Sphere Grid', description: 'Sphere grid actions' },
        { value: 'encounters', label: '👹 Encounters', description: 'Enemy encounter details' },
        { value: 'trial', label: '🏛️ Trial', description: 'Cloister trial information' },
        { value: 'equip', label: '⚔️ Equipment', description: 'Equipment changes' },
        { value: 'conditional', label: '❓ Conditional', description: 'Nested conditional logic' },
        { value: 'listItem', label: '• List Item', description: 'Single list item' }
    ];

    const openContentTypeModal = (sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent' | 'contentToShowIfTrue' | 'contentToShowIfFalse') => {
        setSelectedSection(sectionName);
        setShowContentTypeModal(true);
    };

    const addContentToSection = (sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent' | 'contentToShowIfTrue' | 'contentToShowIfFalse', contentType: string) => {
        let newContent;

        switch (contentType) {
            case 'textParagraph':
                newContent = {
                    type: 'textParagraph',
                    content: [{
                        type: 'formattedText',
                        text: `New ${sectionName} content`
                    }]
                };
                break;
            case 'instructionList':
                newContent = {
                    type: 'instructionList',
                    ordered: false,
                    items: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: `New instruction for ${sectionName}`
                        }]
                    }]
                };
                break;
            case 'battle':
                newContent = {
                    type: 'battle',
                    enemyName: 'New Battle',
                    battleStrategy: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New battle strategy'
                        }]
                    }]
                };
                break;
            case 'image':
                newContent = {
                    type: 'image',
                    src: 'placeholder.png',
                    alt: 'New image'
                };
                break;
            case 'shop':
                newContent = {
                    type: 'shop',
                    shopName: 'New Shop',
                    items: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New shop item'
                        }]
                    }]
                };
                break;
            case 'sphereGrid':
                newContent = {
                    type: 'sphereGrid',
                    content: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New sphere grid action'
                        }]
                    }]
                };
                break;
            case 'encounters':
                newContent = {
                    type: 'encounters',
                    content: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New encounter strategy'
                        }]
                    }]
                };
                break;
            case 'trial':
                newContent = {
                    type: 'trial',
                    trialName: 'New Trial',
                    content: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New trial instruction'
                        }]
                    }]
                };
                break;
            case 'equip':
                newContent = {
                    type: 'equip',
                    content: [{
                        type: 'listItem',
                        content: [{
                            type: 'formattedText',
                            text: 'New equipment change'
                        }]
                    }]
                };
                break;
            case 'conditional':
                newContent = {
                    type: 'conditional',
                    conditionSource: 'textual_inline_if_then',
                    textCondition: [{
                        type: 'formattedText',
                        text: 'New condition'
                    }],
                    thenContent: [{
                        type: 'textParagraph',
                        content: [{
                            type: 'formattedText',
                            text: 'Then content'
                        }]
                    }]
                };
                break;
            case 'listItem':
                newContent = {
                    type: 'listItem',
                    content: [{
                        type: 'formattedText',
                        text: `New list item for ${sectionName}`
                    }]
                };
                break;
            default:
                // Fallback to text paragraph
                newContent = {
                    type: 'textParagraph',
                    content: [{
                        type: 'formattedText',
                        text: `New ${sectionName} content`
                    }]
                };
        }

        const existingContent = block[sectionName] || [];
        const newSectionContent = [...existingContent, newContent];
        const newBlock = { ...block, [sectionName]: newSectionContent };
        updateNode(path, newBlock);

        setShowContentTypeModal(false);
        setSelectedSection(null);
    };

    const updateConditionSource = (newSource: ConditionalBlock['conditionSource']) => {
        const newBlock = { ...block, conditionSource: newSource };
        updateNode(path, newBlock);
    };

    const updateDisplayAsItemized = (checked: boolean) => {
        const newBlock = { ...block, displayAsItemizedCondition: checked };
        updateNode(path, newBlock);
    };

    const updateResourceName = (newName: string) => {
        const newBlock = { ...block, resourceName: newName || undefined };
        updateNode(path, newBlock);
    };

    const updateComparison = (newComparison: string) => {
        const newBlock = { ...block, comparison: newComparison || undefined };
        updateNode(path, newBlock);
    };

    const updateValue = (newValue: string) => {
        const numValue = parseInt(newValue, 10);
        const newBlock = { ...block, value: isNaN(numValue) ? undefined : numValue };
        updateNode(path, newBlock);
    };

    const addTextCondition = () => {
        const newCondition: FormattedText = {
            type: 'formattedText',
            text: 'New condition text'
        };

        const newTextCondition = block.textCondition ? [...block.textCondition, newCondition] : [newCondition];
        const newBlock = { ...block, textCondition: newTextCondition };
        updateNode(path, newBlock);
    };

    const removeTextCondition = (index: number) => {
        if (!block.textCondition) return;
        const newTextCondition = block.textCondition.filter((_, i) => i !== index);
        const newBlock = { ...block, textCondition: newTextCondition.length > 0 ? newTextCondition : undefined };
        updateNode(path, newBlock);
    };

    const removeContentFromSection = (sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent' | 'contentToShowIfTrue' | 'contentToShowIfFalse', index: number) => {
        const content = block[sectionName];
        if (!content) return;
        const newContent = content.filter((_, i) => i !== index);
        const newBlock = { ...block, [sectionName]: newContent.length > 0 ? newContent : undefined };
        updateNode(path, newBlock);
    };

    const containerStyle: React.CSSProperties = {
        border: '2px solid #ff9800',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        backgroundColor: '#fff8e1'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #ccc'
    };

    const labelStyle: React.CSSProperties = {
        color: '#f57c00',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const buttonStyle: React.CSSProperties = {
        padding: '4px 8px',
        margin: '0 2px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '12px'
    };

    const sectionStyle: React.CSSProperties = {
        margin: '12px 0',
        padding: '8px',
        border: '1px dashed #ff9800',
        borderRadius: '4px',
        backgroundColor: '#fff'
    };

    const renderContentSection = (
        sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent' | 'contentToShowIfTrue' | 'contentToShowIfFalse',
        title: string
    ) => {
        const content = block[sectionName];

        return (
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>{title}:</strong>
                    <button
                        style={buttonStyle}
                        onClick={() => openContentTypeModal(sectionName)}
                        title={`Add ${title.toLowerCase()} content`}
                    >
                        + Content
                    </button>
                </div>

                {!content || content.length === 0 ? (
                    <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                        No {title.toLowerCase()} content - click "+ Content" to add
                    </em>
                ) : (
                    content.map((item, index) => (
                        <div key={index} style={{
                            position: 'relative',
                            margin: '8px 0',
                            border: '1px solid #fff3e0',
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
                                onClick={() => removeContentFromSection(sectionName, index)}
                                title="Remove content"
                            >
                                ×
                            </button>
                            <NodeRenderer
                                node={item}
                                path={[...path, sectionName, index]}
                            />
                        </div>
                    ))
                )}
            </div>
        );
    };

    return (
        <>
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <span style={labelStyle}>
                        🔀 Conditional: {block.conditionSource}
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
                                <strong>Condition Source:</strong>
                                <select
                                    value={block.conditionSource}
                                    onChange={(e) => updateConditionSource(e.target.value as ConditionalBlock['conditionSource'])}
                                    style={{ marginLeft: '8px', padding: '4px' }}
                                >
                                    <option value="blitzballdetermination">Blitzball Determination</option>
                                    <option value="ifthenelse_blitzresult">If-Then-Else Blitz Result</option>
                                    <option value="textual_direct_choice">Textual Direct Choice</option>
                                    <option value="textual_inline_if_then">Textual Inline If-Then</option>
                                    <option value="textual_block_options">Textual Block Options</option>
                                    <option value="tracked_resource_check">Tracked Resource Check</option>
                                    <option value="acquired_item_flag_check">Acquired Item Flag Check</option>
                                </select>
                            </label>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={block.displayAsItemizedCondition || false}
                                    onChange={(e) => updateDisplayAsItemized(e.target.checked)}
                                    style={{ marginRight: '8px' }}
                                />
                                <strong>Display as itemized condition</strong>
                            </label>
                        </div>

                        {(block.conditionSource === 'tracked_resource_check') && (
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '8px' }}>
                                    <strong>Resource Name:</strong>
                                    <input
                                        type="text"
                                        value={block.resourceName || ''}
                                        onChange={(e) => updateResourceName(e.target.value)}
                                        style={{ marginLeft: '8px', padding: '4px', width: '150px' }}
                                        placeholder="e.g., PowerSphere, SpeedSphere"
                                    />
                                </label>
                                <label style={{ display: 'block', marginBottom: '8px' }}>
                                    <strong>Comparison:</strong>
                                    <select
                                        value={block.comparison || 'less_than'}
                                        onChange={(e) => updateComparison(e.target.value)}
                                        style={{ marginLeft: '8px', padding: '4px' }}
                                    >
                                        <option value="less_than">Less Than</option>
                                        <option value="greater_than">Greater Than</option>
                                        <option value="equal_to">Equal To</option>
                                        <option value="greater_than_or_equal">Greater Than or Equal</option>
                                        <option value="less_than_or_equal">Less Than or Equal</option>
                                    </select>
                                </label>
                                <label style={{ display: 'block', marginBottom: '8px' }}>
                                    <strong>Value:</strong>
                                    <input
                                        type="number"
                                        value={block.value || 0}
                                        onChange={(e) => updateValue(e.target.value)}
                                        style={{ marginLeft: '8px', padding: '4px', width: '80px' }}
                                        placeholder="0"
                                    />
                                </label>
                            </div>
                        )}

                        {block.textCondition && (
                            <div style={sectionStyle}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong>Text Condition:</strong>
                                    <button
                                        style={buttonStyle}
                                        onClick={addTextCondition}
                                        title="Add text condition"
                                    >
                                        + Text
                                    </button>
                                </div>

                                {block.textCondition.length === 0 ? (
                                    <em style={{ color: '#666', fontSize: '14px', display: 'block', textAlign: 'center', padding: '20px' }}>
                                        No text condition - click "+ Text" to add
                                    </em>
                                ) : (
                                    block.textCondition.map((condition: FormattedText, index: number) => (
                                        <div key={index} style={{
                                            position: 'relative',
                                            margin: '8px 0',
                                            border: '1px solid #fff3e0',
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
                                                onClick={() => removeTextCondition(index)}
                                                title="Remove condition"
                                            >
                                                ×
                                            </button>
                                            <NodeRenderer
                                                node={condition}
                                                path={[...path, 'textCondition', index]}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Render different content sections based on condition source */}
                        {(block.conditionSource === 'blitzballdetermination' || block.conditionSource === 'ifthenelse_blitzresult') && (
                            <>
                                {renderContentSection('winContent', 'Win Content')}
                                {renderContentSection('lossContent', 'Loss Content')}
                                {renderContentSection('bothContent', 'Both Content')}
                            </>
                        )}

                        {(block.conditionSource === 'textual_inline_if_then') && (
                            <>
                                {renderContentSection('thenContent', 'Then Content')}
                                {renderContentSection('elseContent', 'Else Content')}
                            </>
                        )}

                        {(block.conditionSource === 'tracked_resource_check') && (
                            <>
                                {renderContentSection('contentToShowIfTrue', 'Content If True')}
                                {renderContentSection('contentToShowIfFalse', 'Content If False')}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Content Type Selection Modal */}
            {showContentTypeModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>
                            Select Content Type for {selectedSection}
                        </h3>

                        <div style={{ display: 'grid', gap: '8px' }}>
                            {contentTypes.map(contentType => (
                                <button
                                    key={contentType.value}
                                    onClick={() => addContentToSection(selectedSection!, contentType.value)}
                                    style={{
                                        padding: '12px 16px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                        e.currentTarget.style.borderColor = '#007acc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#ddd';
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        {contentType.label}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {contentType.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                                onClick={() => setShowContentTypeModal(false)}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
