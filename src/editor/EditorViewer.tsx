// src/editor/App.tsx
import React from 'react';
import { ChapterBrowser } from './ChapterBrowser';
import { NodeRenderer } from './NodeRenderer';
import { useEditorStore } from './store';

export const EditorViewer: React.FC = () => {
    // Connect to our Zustand store to get the state and the action function
    const {
        activeChapterContent,
        activeChapterTitle,
        isLoading,
        isSaving,
        error,
        saveStatus,
        loadChapter,
        saveChapter,
        updateNode,
    } = useEditorStore();

    const addTopLevelBlock = (blockType: string) => {
        let newBlock;

        switch (blockType) {
            case 'textParagraph':
                newBlock = {
                    type: 'textParagraph',
                    content: [{ type: 'plainText', text: 'New paragraph' }]
                };
                break;
            case 'instructionList':
                newBlock = {
                    type: 'instructionList',
                    items: []
                };
                break;
            case 'battle':
                newBlock = {
                    type: 'battle',
                    enemyName: 'New Enemy',
                    strategy: []
                };
                break;
            case 'image':
                newBlock = {
                    type: 'image',
                    path: ''
                };
                break;
            case 'conditional':
                newBlock = {
                    type: 'conditional',
                    conditionSource: 'textual_direct_choice',
                    winContent: [{ type: 'plainText', text: 'Content when condition is true' }],
                    lossContent: [{ type: 'plainText', text: 'Content when condition is false' }]
                };
                break;
            case 'shop':
                newBlock = {
                    type: 'shop',
                    gilInfo: 'Gil information',
                    sections: []
                };
                break;
            case 'sphereGrid':
                newBlock = {
                    type: 'sphereGrid',
                    characters: []
                };
                break;
            case 'sphereGridCharacterActions':
                newBlock = {
                    type: 'sphereGridCharacterActions',
                    character: 'Tidus',
                    actions: []
                };
                break;
            case 'encounters':
                newBlock = {
                    type: 'encounters',
                    area: 'New Area',
                    encounters: []
                };
                break;
            case 'trial':
                newBlock = {
                    type: 'trial',
                    steps: []
                };
                break;
            case 'blitzballGame':
                newBlock = {
                    type: 'blitzballGame',
                    strategy: []
                };
                break;
            case 'equip':
                newBlock = {
                    type: 'equip',
                    content: []
                };
                break;
            default:
                newBlock = {
                    type: 'textParagraph',
                    content: [{ type: 'plainText', text: 'New content' }]
                };
        }

        const newContent = [...activeChapterContent, newBlock];
        // Update the entire chapter content array
        updateNode([], newContent);
    };

    const removeTopLevelBlock = (index: number) => {
        const newContent = activeChapterContent.filter((_, i) => i !== index);
        updateNode([], newContent);
    };

    const moveBlockUp = (index: number) => {
        if (index <= 0) return;
        const newContent = [...activeChapterContent];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        updateNode([], newContent);
    };

    const moveBlockDown = (index: number) => {
        if (index >= activeChapterContent.length - 1) return;
        const newContent = [...activeChapterContent];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        updateNode([], newContent);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd' }}>
            {/* Left Column: The Chapter Browser */}
            <aside style={{ width: '250px', minWidth: '250px', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                <ChapterBrowser onSelectChapter={loadChapter} />
            </aside>

            {/* Right Column: The Main Content Editor */}
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {/* Show a loading message while a chapter is being loaded from disk */}
                {isLoading && <div>Loading Chapter...</div>}

                {/* Show an error message if something went wrong */}
                {error && <div style={{ color: 'red' }}><strong>Error:</strong> {error}</div>}

                {/* If not loading and no errors, and we have content, show the editor */}
                {!isLoading && !error && activeChapterContent.length >= 0 && (
                    <>
                        <div style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 100,
                            backgroundColor: '#fdfdfd',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '2px solid #eee',
                            paddingBottom: '10px',
                            paddingTop: '10px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <h1 style={{ margin: 0 }}>{activeChapterTitle || 'No Chapter Selected'}</h1>
                            {activeChapterTitle && (
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    {/* Save Button */}
                                    <button
                                        onClick={saveChapter}
                                        disabled={isSaving}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: '1px solid #4CAF50',
                                            backgroundColor: isSaving ? '#f0f0f0' : '#4CAF50',
                                            color: isSaving ? '#999' : 'white',
                                            cursor: isSaving ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '100px',
                                            justifyContent: 'center'
                                        }}
                                        title="Save chapter - file watchers will auto-rebuild"
                                    >
                                        {isSaving ? (
                                            <>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '12px',
                                                    height: '12px',
                                                    border: '2px solid #999',
                                                    borderTop: '2px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite'
                                                }}></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>💾 Save</>
                                        )}
                                    </button>

                                    {/* Save Status */}
                                    {saveStatus && (
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#4CAF50',
                                            fontWeight: 'bold',
                                            backgroundColor: '#E8F5E8',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid #4CAF50'
                                        }}>
                                            {saveStatus}
                                        </span>
                                    )}

                                    <div style={{ width: '1px', height: '24px', backgroundColor: '#ddd' }}></div>

                                    <span style={{ fontSize: '14px', color: '#666' }}>Add Block:</span>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                addTopLevelBlock(e.target.value);
                                                e.target.value = ''; // Reset selection
                                            }
                                        }}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            backgroundColor: '#fff',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>+ Add Block</option>
                                        <optgroup label="Content">
                                            <option value="textParagraph">📝 Text Paragraph</option>
                                            <option value="instructionList">📋 Instruction List</option>
                                            <option value="image">🖼️ Image</option>
                                        </optgroup>
                                        <optgroup label="Gameplay">
                                            <option value="battle">⚔️ Battle</option>
                                            <option value="encounters">👹 Encounters</option>
                                            <option value="trial">🏛️ Trial</option>
                                            <option value="blitzballGame">⚽ Blitzball Game</option>
                                        </optgroup>
                                        <optgroup label="Character">
                                            <option value="sphereGrid">🔮 Sphere Grid</option>
                                            <option value="sphereGridCharacterActions">👤 Character Actions</option>
                                            <option value="equip">⚔️ Equipment</option>
                                        </optgroup>
                                        <optgroup label="Other">
                                            <option value="shop">🏪 Shop</option>
                                            <option value="conditional">🔀 Conditional</option>
                                        </optgroup>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* 
                          This is the main render loop. It iterates over the top-level blocks
                          of the chapter (e.g., InstructionListBlock, BattleBlock) and uses our 
                          NodeRenderer to render the correct editor/viewer for each one.
                        */}
                        {activeChapterContent.length > 0 ? (
                            activeChapterContent.map((node, index) => (
                                <div key={index} style={{ position: 'relative', marginBottom: '16px', paddingTop: '12px', paddingRight: '90px' }}>
                                    {activeChapterTitle && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            display: 'flex',
                                            gap: '4px',
                                            zIndex: 5,
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            padding: '2px',
                                            borderRadius: '4px',
                                            border: '1px solid rgba(0, 0, 0, 0.1)'
                                        }}>
                                            <button
                                                onClick={() => moveBlockUp(index)}
                                                disabled={index === 0}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '3px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: index === 0 ? '#f0f0f0' : '#fff',
                                                    color: index === 0 ? '#ccc' : '#333',
                                                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Move up"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveBlockDown(index)}
                                                disabled={index === activeChapterContent.length - 1}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '3px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: index === activeChapterContent.length - 1 ? '#f0f0f0' : '#fff',
                                                    color: index === activeChapterContent.length - 1 ? '#ccc' : '#333',
                                                    cursor: index === activeChapterContent.length - 1 ? 'not-allowed' : 'pointer',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Move down"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => removeTopLevelBlock(index)}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '3px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f44336',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Remove block"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    <NodeRenderer
                                        key={index}
                                        node={node}
                                        // The path for a top-level node is simply its index in the array
                                        path={[index]}
                                    />
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: '#777', marginTop: '40px', padding: '20px', border: '2px dashed #ddd', borderRadius: '8px' }}>
                                <h3>No blocks in this chapter</h3>
                                <p>Use the "Add Block" dropdown above to add your first block.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Show a welcome message if no chapter is selected yet */}
                {!isLoading && activeChapterContent.length === 0 && !activeChapterTitle && (
                    <div style={{ textAlign: 'center', color: '#777', marginTop: '40px' }}>
                        <h2>Welcome to the FFX Guide Editor</h2>
                        <p>Please select a chapter from the left sidebar to begin editing.</p>
                    </div>
                )}
            </main>
        </div>
    );
};