// src/editor/store.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { produce } from 'immer'; // <-- Import Immer
import type { Chapter } from '../types';

interface EditorState {
    activeChapterContent: Chapter['content'];
    activeChapterTitle: string;
    activeChapterId: string;
    activeChapterFilePath: string;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    saveStatus: string | null;
    loadChapter: (filePath: string) => Promise<void>;
    saveChapter: () => Promise<void>;
    // Our new function to update any part of the data
    updateNode: (path: (string | number)[], value: any) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
    activeChapterContent: [],
    activeChapterTitle: '',
    activeChapterId: '',
    activeChapterFilePath: '',
    isLoading: false,
    isSaving: false,
    error: null,
    saveStatus: null,
    loadChapter: async (filePath) => {
        set({ isLoading: true, error: null, saveStatus: null });
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
                activeChapterId: chapterData.id,
                activeChapterFilePath: fullFilename,
                isLoading: false,
            });
        } catch (e: any) {
            console.error(`Failed to load or parse chapter: ${filePath}`, e);
            set({ error: `Failed to load chapter: ${e.message}`, isLoading: false });
        }
    },
    saveChapter: async () => {
        const state = get();
        if (!state.activeChapterFilePath || !state.activeChapterId) {
            set({ error: 'No chapter loaded to save' });
            return;
        }

        set({ isSaving: true, error: null, saveStatus: 'Saving chapter...' });

        try {
            // Construct the full chapter object
            const chapterData: Chapter = {
                id: state.activeChapterId,
                title: state.activeChapterTitle,
                content: state.activeChapterContent
            };

            // Convert to JSON with proper formatting
            const jsonContent = JSON.stringify(chapterData, null, 4);

            // Save the file using Tauri command
            await invoke('write_guide_file', {
                filename: state.activeChapterFilePath,
                content: jsonContent
            });

            set({
                isSaving: false,
                saveStatus: 'Chapter saved successfully! File watchers will auto-rebuild.'
            });

            // Clear save status after 3 seconds
            setTimeout(() => {
                set({ saveStatus: null });
            }, 3000);

        } catch (e: any) {
            console.error('Failed to save chapter:', e);
            set({
                error: `Failed to save chapter: ${e}`,
                isSaving: false,
                saveStatus: null
            });
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