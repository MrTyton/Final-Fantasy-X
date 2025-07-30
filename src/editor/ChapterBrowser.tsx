// src/editor/ChapterBrowser.tsx
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { FFXSpeedrunGuide } from '../types';

// We'll pass a function to tell the parent component which chapter to load
interface ChapterBrowserProps {
    onSelectChapter: (path: string) => void;
}

export const ChapterBrowser: React.FC<ChapterBrowserProps> = ({ onSelectChapter }) => {
    const [chapterFiles, setChapterFiles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChapters = async () => {
            try {
                console.log('Loading chapters using Tauri command...');

                // Use the Tauri command to read the file
                const mainGuideContent = await invoke<string>('read_guide_file', {
                    filename: 'ffx_guide_main.json'
                });

                console.log('Successfully loaded ffx_guide_main.json via Tauri command');

                const mainGuide: FFXSpeedrunGuide = JSON.parse(mainGuideContent);
                if (mainGuide.chapterFiles) {
                    setChapterFiles(mainGuide.chapterFiles);
                    console.log('Chapter files loaded:', mainGuide.chapterFiles);
                }
            } catch (e) {
                setError('Failed to load ffx_guide_main.json. Check path and file contents.');
                console.error('Error loading chapters:', e);
            }
        };

        loadChapters();
    }, []);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="chapter-browser">
            <h2>Chapters</h2>
            <ul>
                {chapterFiles.map((filePath) => (
                    <li key={filePath}>
                        <button onClick={() => onSelectChapter(filePath)}>
                            {filePath.split('/').pop()?.replace('.json', '')}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};