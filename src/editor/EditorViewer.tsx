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
        error,
        loadChapter,
    } = useEditorStore();

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
                {!isLoading && !error && activeChapterContent.length > 0 && (
                    <>
                        <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>{activeChapterTitle}</h1>

                        {/* 
                          This is the main render loop. It iterates over the top-level blocks
                          of the chapter (e.g., InstructionListBlock, BattleBlock) and uses our 
                          NodeRenderer to render the correct editor/viewer for each one.
                        */}
                        {activeChapterContent.map((node, index) => (
                            <NodeRenderer
                                key={index}
                                node={node}
                                // The path for a top-level node is simply its index in the array
                                path={[index]}
                            />
                        ))}
                    </>
                )}

                {/* Show a welcome message if no chapter is selected yet */}
                {!isLoading && activeChapterContent.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#777', marginTop: '40px' }}>
                        <h2>Welcome to the FFX Guide Editor</h2>
                        <p>Please select a chapter from the left sidebar to begin editing.</p>
                    </div>
                )}
            </main>
        </div>
    );
};