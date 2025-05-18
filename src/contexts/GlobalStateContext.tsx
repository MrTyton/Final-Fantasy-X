// src/contexts/GlobalStateContext.tsx
import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from 'react';
import type { FFXSpeedrunGuide, TrackedResource, AcquiredItemFlag } from '../types';
import { KNOWN_TRACKED_RESOURCE_NAMES, KNOWN_ACQUIRED_ITEM_FLAG_NAMES } from '../generated/knownTrackables';

// --- State Shape ---
export interface TrackerData {
    resources: Record<string, number>;
    flags: Record<string, boolean>;
    appliedAutoUpdateIds: Record<string, true>; // Stores IDs of auto-updates that have been applied
}

export interface GlobalAppSettings {
    csrModeActive: boolean;
    theme: 'light' | 'dark';
    textSize: 'small' | 'medium' | 'large';
    showConditionalBorders: boolean;
}

export interface GlobalAppState {
    guideData: FFXSpeedrunGuide | null;
    isLoadingGuide: boolean;
    guideLoadError: string | null;
    currentTopChapterId: string | null;
    renderedChapterIds: string[];
    tracker: TrackerData;
    settings: GlobalAppSettings;
}

// --- Initial State ---
const initialResources: Record<string, number> = {};
KNOWN_TRACKED_RESOURCE_NAMES.forEach(name => { initialResources[name] = 0; });
const initialFlags: Record<string, boolean> = {};
KNOWN_ACQUIRED_ITEM_FLAG_NAMES.forEach(name => { initialFlags[name] = false; });

export const initialGlobalState: GlobalAppState = {
    guideData: null,
    isLoadingGuide: true,
    guideLoadError: null,
    currentTopChapterId: null,
    renderedChapterIds: [],
    tracker: {
        resources: initialResources,
        flags: initialFlags,
        appliedAutoUpdateIds: {}, // Initialize as empty
    },
    settings: {
        csrModeActive: false,
        theme: 'light',
        textSize: 'medium',
        showConditionalBorders: false,
    },
};

// --- Action Types ---
export enum GlobalActionType {
    SET_GUIDE_DATA = 'SET_GUIDE_DATA', SET_GUIDE_LOADING = 'SET_GUIDE_LOADING', SET_GUIDE_LOAD_ERROR = 'SET_GUIDE_LOAD_ERROR',
    SET_CURRENT_CHAPTER = 'SET_CURRENT_CHAPTER', ADD_RENDERED_CHAPTER = 'ADD_RENDERED_CHAPTER', SET_INITIAL_RENDERED_CHAPTERS = 'SET_INITIAL_RENDERED_CHAPTERS',
    UPDATE_RESOURCE_QUANTITY = 'UPDATE_RESOURCE_QUANTITY', SET_FLAG_VALUE = 'SET_FLAG_VALUE', TOGGLE_FLAG_VALUE = 'TOGGLE_FLAG_VALUE',
    MANUALLY_EDIT_TRACKER_RESOURCE = 'MANUALLY_EDIT_TRACKER_RESOURCE', MANUALLY_EDIT_TRACKER_FLAG = 'MANUALLY_EDIT_TRACKER_FLAG',
    TOGGLE_CSR_MODE = 'TOGGLE_CSR_MODE', SET_THEME = 'SET_THEME', SET_TEXT_SIZE = 'SET_TEXT_SIZE', TOGGLE_CONDITIONAL_BORDERS = 'TOGGLE_CONDITIONAL_BORDERS',
    MARK_AUTO_UPDATE_APPLIED = 'MARK_AUTO_UPDATE_APPLIED',       // For viewport auto-actions
    UNMARK_AUTO_UPDATE_APPLIED = 'UNMARK_AUTO_UPDATE_APPLIED',   // For viewport auto-actions
}

// --- Action Payloads ---
export type GlobalAppAction =
    | { type: GlobalActionType.SET_GUIDE_DATA; payload: FFXSpeedrunGuide | null }
    | { type: GlobalActionType.SET_GUIDE_LOADING; payload: boolean }
    | { type: GlobalActionType.SET_GUIDE_LOAD_ERROR; payload: string | null }
    | { type: GlobalActionType.SET_CURRENT_CHAPTER; payload: string | null }
    | { type: GlobalActionType.ADD_RENDERED_CHAPTER; payload: string }
    | { type: GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS; payload: string[] }
    | { type: GlobalActionType.UPDATE_RESOURCE_QUANTITY; payload: { name: string; change: number } }
    | { type: GlobalActionType.SET_FLAG_VALUE; payload: { name: string; value: boolean } }
    | { type: GlobalActionType.TOGGLE_FLAG_VALUE; payload: { name: string } }
    | { type: GlobalActionType.MANUALLY_EDIT_TRACKER_RESOURCE; payload: { name: string; newValue: number } }
    | { type: GlobalActionType.MANUALLY_EDIT_TRACKER_FLAG; payload: { name: string; newValue: boolean } }
    | { type: GlobalActionType.TOGGLE_CSR_MODE }
    | { type: GlobalActionType.SET_THEME; payload: 'light' | 'dark' }
    | { type: GlobalActionType.SET_TEXT_SIZE; payload: 'small' | 'medium' | 'large' }
    | { type: GlobalActionType.TOGGLE_CONDITIONAL_BORDERS }
    | { type: GlobalActionType.MARK_AUTO_UPDATE_APPLIED; payload: { id: string } }    // For viewport auto-actions
    | { type: GlobalActionType.UNMARK_AUTO_UPDATE_APPLIED; payload: { id: string } }; // For viewport auto-actions

// --- Reducer Function ---
export const globalAppReducer = (state: GlobalAppState, action: GlobalAppAction): GlobalAppState => {
    switch (action.type) {
        // ... (all other cases remain the same)
        case GlobalActionType.SET_GUIDE_LOADING: return { ...state, isLoadingGuide: action.payload };
        case GlobalActionType.SET_GUIDE_DATA: return { ...state, guideData: action.payload, isLoadingGuide: false, guideLoadError: null };
        case GlobalActionType.SET_GUIDE_LOAD_ERROR: return { ...state, guideLoadError: action.payload, isLoadingGuide: false, guideData: null };
        case GlobalActionType.SET_CURRENT_CHAPTER: return { ...state, currentTopChapterId: action.payload };
        case GlobalActionType.ADD_RENDERED_CHAPTER: if (state.renderedChapterIds.includes(action.payload)) return state; return { ...state, renderedChapterIds: [...state.renderedChapterIds, action.payload] };
        case GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS: return { ...state, renderedChapterIds: action.payload };
        case GlobalActionType.UPDATE_RESOURCE_QUANTITY: { /* ... */ return { ...state, tracker: { ...state.tracker, resources: { ...state.tracker.resources, [action.payload.name]: Math.max(0, (state.tracker.resources[action.payload.name] || 0) + action.payload.change) } } } };
        case GlobalActionType.MANUALLY_EDIT_TRACKER_RESOURCE: { /* ... */ return { ...state, tracker: { ...state.tracker, resources: { ...state.tracker.resources, [action.payload.name]: Math.max(0, action.payload.newValue) } } } };
        case GlobalActionType.SET_FLAG_VALUE: { /* ... */ return { ...state, tracker: { ...state.tracker, flags: { ...state.tracker.flags, [action.payload.name]: action.payload.value } } } };
        case GlobalActionType.TOGGLE_FLAG_VALUE: { /* ... */ return { ...state, tracker: { ...state.tracker, flags: { ...state.tracker.flags, [action.payload.name]: !(state.tracker.flags[action.payload.name] || false) } } } };
        case GlobalActionType.MANUALLY_EDIT_TRACKER_FLAG: { /* ... */ return { ...state, tracker: { ...state.tracker, flags: { ...state.tracker.flags, [action.payload.name]: action.payload.newValue } } } };
        case GlobalActionType.TOGGLE_CSR_MODE: return { ...state, settings: { ...state.settings, csrModeActive: !state.settings.csrModeActive } };
        case GlobalActionType.SET_THEME: return { ...state, settings: { ...state.settings, theme: action.payload } };
        case GlobalActionType.SET_TEXT_SIZE: return { ...state, settings: { ...state.settings, textSize: action.payload } };
        case GlobalActionType.TOGGLE_CONDITIONAL_BORDERS: return { ...state, settings: { ...state.settings, showConditionalBorders: !state.settings.showConditionalBorders } };

        // New Reducer Cases for Viewport Auto-Actions
        case GlobalActionType.MARK_AUTO_UPDATE_APPLIED:
            return {
                ...state,
                tracker: {
                    ...state.tracker,
                    appliedAutoUpdateIds: { ...state.tracker.appliedAutoUpdateIds, [action.payload.id]: true },
                },
            };
        case GlobalActionType.UNMARK_AUTO_UPDATE_APPLIED:
            const newApplied = { ...state.tracker.appliedAutoUpdateIds };
            delete newApplied[action.payload.id]; // Remove the key
            return {
                ...state,
                tracker: {
                    ...state.tracker,
                    appliedAutoUpdateIds: newApplied
                }
            };

        default:
            return state;
    }
};

// --- Provider Component (GlobalStateProvider) & Custom Hooks (useGlobalState, useGlobalDispatch) ---
// These remain the same, ensure loggingReducer is still in use if you want logs.
const StateContext = createContext<GlobalAppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch<GlobalAppAction> | undefined>(undefined);
interface GlobalStateProviderProps { children: ReactNode; }
export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
    useEffect(() => { console.log('[GlobalStateProvider] Initializing with state:', initialGlobalState); }, []);
    const loggingReducer = (state: GlobalAppState, action: GlobalAppAction): GlobalAppState => {
        console.log('[GlobalDispatch] Action Dispatched:', action); const newState = globalAppReducer(state, action); console.log('[GlobalState] Next State:', newState); return newState;
    };
    const [state, dispatch] = useReducer(loggingReducer, initialGlobalState);
    return (<StateContext.Provider value={state}><DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider></StateContext.Provider>);
};
export const useGlobalState = (): GlobalAppState => { const c = useContext(StateContext); if (!c) throw new Error('useGlobalState must be used within a GlobalStateProvider'); return c; };
export const useGlobalDispatch = (): Dispatch<GlobalAppAction> => { const c = useContext(DispatchContext); if (!c) throw new Error('useGlobalDispatch must be used within a GlobalStateProvider'); return c; };