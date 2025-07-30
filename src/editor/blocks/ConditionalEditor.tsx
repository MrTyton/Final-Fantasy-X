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

    const addContentToSection = (sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent') => {
        const newContent = {
            type: 'textParagraph',
            paragraphs: [{
                type: 'formattedText',
                text: `New ${sectionName} content`
            }]
        };

        const existingContent = block[sectionName] || [];
        const newSectionContent = [...existingContent, newContent];
        const newBlock = { ...block, [sectionName]: newSectionContent };
        updateNode(path, newBlock);
    };

    const removeContentFromSection = (sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent', index: number) => {
        const existingContent = block[sectionName];
        if (!existingContent) return;

        const newSectionContent = existingContent.filter((_, i) => i !== index);
        const newBlock = { ...block, [sectionName]: newSectionContent.length > 0 ? newSectionContent : undefined };
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
        sectionName: 'winContent' | 'lossContent' | 'bothContent' | 'thenContent' | 'elseContent',
        title: string
    ) => {
        const content = block[sectionName];

        return (
            <div style={sectionStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>{title}:</strong>
                    <button
                        style={buttonStyle}
                        onClick={() => addContentToSection(sectionName)}
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
                            <label>
                                <strong>Resource Name:</strong>
                                <input
                                    type="text"
                                    value={block.resourceName || ''}
                                    onChange={(e) => updateResourceName(e.target.value)}
                                    style={{ marginLeft: '8px', padding: '4px', width: '150px' }}
                                    placeholder="e.g., PowerSphere, SpeedSphere"
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
                                block.textCondition.map((condition, index) => (
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
                </>
            )}
        </div>
    );
};
