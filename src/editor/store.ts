// src/editor/store.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { produce } from 'immer'; // <-- Import Immer
import type { Chapter } from '../types';

interface HistoryEntry {
    content: Chapter['content'];
    timestamp: number;
    description?: string;
}

interface EditorState {
    activeChapterContent: Chapter['content'];
    activeChapterTitle: string;
    activeChapterId: string;
    activeChapterFilePath: string;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    saveStatus: string | null;
    hasUnsavedChanges: boolean;
    lastAutoSave: number | null;
    
    // Undo/Redo functionality
    history: HistoryEntry[];
    historyIndex: number;
    maxHistorySize: number;
    
    // Actions
    loadChapter: (filePath: string) => Promise<void>;
    saveChapter: () => Promise<void>;
    autoSave: () => Promise<void>;
    updateNode: (path: (string | number)[], value: any, description?: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    clearHistory: () => void;
}

// Helper function to create a deep copy for history
const createHistoryEntry = (content: Chapter['content'], description?: string): HistoryEntry => ({
    content: JSON.parse(JSON.stringify(content)),
    timestamp: Date.now(),
    description
});

export const useEditorStore = create<EditorState>((set, get) => ({
    activeChapterContent: [],
    activeChapterTitle: '',
    activeChapterId: '',
    activeChapterFilePath: '',
    isLoading: false,
    isSaving: false,
    error: null,
    saveStatus: null,
    hasUnsavedChanges: false,
    lastAutoSave: null,
    
    // Undo/Redo state
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    
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
                hasUnsavedChanges: false,
                history: [createHistoryEntry(chapterData.content, 'Chapter loaded')],
                historyIndex: 0,
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
                saveStatus: 'Chapter saved successfully! File watchers will auto-rebuild.',
                hasUnsavedChanges: false,
                lastAutoSave: Date.now()
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
    
    autoSave: async () => {
        const state = get();
        if (!state.hasUnsavedChanges || state.isSaving) {
            return;
        }
        
        try {
            const chapterData: Chapter = {
                id: state.activeChapterId,
                title: state.activeChapterTitle,
                content: state.activeChapterContent
            };

            const jsonContent = JSON.stringify(chapterData, null, 4);
            
            await invoke('write_guide_file', {
                filename: state.activeChapterFilePath,
                content: jsonContent
            });

            set({
                hasUnsavedChanges: false,
                lastAutoSave: Date.now(),
                saveStatus: 'Auto-saved'
            });
            
            // Clear auto-save status after 2 seconds
            setTimeout(() => {
                const currentState = get();
                if (currentState.saveStatus === 'Auto-saved') {
                    set({ saveStatus: null });
                }
            }, 2000);
            
        } catch (e: any) {
            console.error('Auto-save failed:', e);
        }
    },
    updateNode: (path, value, description) => {
        const state = get();
        
        // Create a copy of current state for history before making changes
        const newHistory = [...state.history.slice(0, state.historyIndex + 1)];
        
        // Add current state to history if it's different
        if (newHistory.length === 0 || JSON.stringify(newHistory[newHistory.length - 1].content) !== JSON.stringify(state.activeChapterContent)) {
            newHistory.push(createHistoryEntry(state.activeChapterContent, description || 'Edit'));
        }
        
        // Limit history size
        if (newHistory.length > state.maxHistorySize) {
            newHistory.shift();
        }
        
        set(
            produce((draft: EditorState) => {
                // Handle top-level updates (empty path means replace entire content)
                if (path.length === 0) {
                    draft.activeChapterContent = value;
                } else {
                    // Handle nested updates
                    let current: any = draft.activeChapterContent;
                    for (let i = 0; i < path.length - 1; i++) {
                        current = current[path[i]];
                    }
                    current[path[path.length - 1]] = value;
                }
                
                // Update history and state
                draft.history = newHistory;
                draft.historyIndex = newHistory.length - 1;
                draft.hasUnsavedChanges = true;
            })
        );
    },
    
    undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const previousState = state.history[newIndex];
            
            set({
                activeChapterContent: JSON.parse(JSON.stringify(previousState.content)),
                historyIndex: newIndex,
                hasUnsavedChanges: true
            });
        }
    },
    
    redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const nextState = state.history[newIndex];
            
            set({
                activeChapterContent: JSON.parse(JSON.stringify(nextState.content)),
                historyIndex: newIndex,
                hasUnsavedChanges: true
            });
        }
    },
    
    canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
    },
    
    canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
    },
    
    clearHistory: () => {
        const state = get();
        set({
            history: [createHistoryEntry(state.activeChapterContent, 'History cleared')],
            historyIndex: 0
        });
    },
}));

// Auto-save functionality - runs every 2 minutes
let autoSaveInterval: NodeJS.Timeout | null = null;

export const startAutoSave = () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
    }
    
    autoSaveInterval = setInterval(() => {
        const store = useEditorStore.getState();
        if (store.hasUnsavedChanges && !store.isSaving && store.activeChapterFilePath) {
            store.autoSave();
        }
    }, 120000); // 2 minutes
};

export const stopAutoSave = () => {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
};