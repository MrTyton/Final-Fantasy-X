// src/editor/store.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { produce } from 'immer'; // <-- Import Immer
import type { Chapter } from '../types';

interface EditorState {
    activeChapterContent: Chapter['content'];
    activeChapterTitle: string;
    isLoading: boolean;
    error: string | null;
    loadChapter: (filePath: string) => Promise<void>;
    // Our new function to update any part of the data
    updateNode: (path: (string | number)[], value: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    activeChapterContent: [],
    activeChapterTitle: '',
    isLoading: false,
    error: null,
    loadChapter: async (filePath) => {
        set({ isLoading: true, error: null });
        try {
            // Extract the filename from the path
            // filePath looks like '/data/chapters/05_ss_liki.json'
            const filename = filePath.split('/').pop() || '';
            const fullFilename = `chapters/${filename}`;

            console.log('Loading chapter file:', fullFilename);

            // Use the Tauri command to read the file
            const fileContent = await invoke<string>('read_guide_file', {
                filename: fullFilename
            });

            console.log('Successfully loaded chapter:', fullFilename);
            const chapterData: Chapter = JSON.parse(fileContent);

            set({
                activeChapterContent: chapterData.content,
                activeChapterTitle: chapterData.title,
                isLoading: false,
            });
        } catch (e: any) {
            console.error(`Failed to load or parse chapter: ${filePath}`, e);
            set({ error: `Failed to load chapter: ${e.message}`, isLoading: false });
        }
    },
    updateNode: (path, value) => {
        set(
            produce((draft: EditorState) => {
                // Handle top-level updates (empty path means replace entire content)
                if (path.length === 0) {
                    draft.activeChapterContent = value;
                    return;
                }
                
                // Handle nested updates
                let current: any = draft.activeChapterContent;
                for (let i = 0; i < path.length - 1; i++) {
                    current = current[path[i]];
                }
                current[path[path.length - 1]] = value;
            })
        );
    },
}));