// src/contexts/GlobalStateContext.tsx
import React, { createContext, useReducer, useContext, Dispatch, ReactNode, useEffect } from 'react';
import type { FFXSpeedrunGuide, TrackedResource, AcquiredItemFlag } from '../types'; // Assuming types.ts is at ../types
import { KNOWN_TRACKED_RESOURCE_NAMES, KNOWN_ACQUIRED_ITEM_FLAG_NAMES } from '../generated/knownTrackables'; // Adjust path if needed

// --- State Shape ---
export interface TrackerData {
  resources: Record<string, number>; 
  flags: Record<string, boolean>;   
  appliedAutoUpdateIds: Record<string, true>; // Stores IDs of auto-updates that have been applied ONCE
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
  // Guide Data
  SET_GUIDE_DATA = 'SET_GUIDE_DATA',
  SET_GUIDE_LOADING = 'SET_GUIDE_LOADING',
  SET_GUIDE_LOAD_ERROR = 'SET_GUIDE_LOAD_ERROR',

  // Navigation / Display
  SET_CURRENT_CHAPTER = 'SET_CURRENT_CHAPTER', // Represents the chapter most visible at the top
  ADD_RENDERED_CHAPTER = 'ADD_RENDERED_CHAPTER',
  SET_INITIAL_RENDERED_CHAPTERS = 'SET_INITIAL_RENDERED_CHAPTERS',

  // Tracker Manual Updates (from prompts or direct tracker edit)
  UPDATE_RESOURCE_QUANTITY = 'UPDATE_RESOURCE_QUANTITY', // For relative changes (+/-)
  SET_FLAG_VALUE = 'SET_FLAG_VALUE',
  TOGGLE_FLAG_VALUE = 'TOGGLE_FLAG_VALUE',
  MANUALLY_EDIT_TRACKER_RESOURCE = 'MANUALLY_EDIT_TRACKER_RESOURCE', // For absolute value set
  MANUALLY_EDIT_TRACKER_FLAG = 'MANUALLY_EDIT_TRACKER_FLAG',     // For absolute value set

  // Settings
  TOGGLE_CSR_MODE = 'TOGGLE_CSR_MODE',
  SET_THEME = 'SET_THEME',
  SET_TEXT_SIZE = 'SET_TEXT_SIZE',
  TOGGLE_CONDITIONAL_BORDERS = 'TOGGLE_CONDITIONAL_BORDERS',

  // Viewport Auto-Actions State
  MARK_AUTO_UPDATE_APPLIED = 'MARK_AUTO_UPDATE_APPLIED',
  // UNMARK_AUTO_UPDATE_APPLIED = 'UNMARK_AUTO_UPDATE_APPLIED', // Disabled as per request
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
  | { type: GlobalActionType.MARK_AUTO_UPDATE_APPLIED; payload: { id: string } };
  // | { type: GlobalActionType.UNMARK_AUTO_UPDATE_APPLIED; payload: { id: string } }; // Disabled

// --- Reducer Function ---
export const globalAppReducer = (state: GlobalAppState, action: GlobalAppAction): GlobalAppState => {
  switch (action.type) {
    case GlobalActionType.SET_GUIDE_LOADING:
      return { ...state, isLoadingGuide: action.payload };
    case GlobalActionType.SET_GUIDE_DATA:
      return { ...state, guideData: action.payload, isLoadingGuide: false, guideLoadError: null };
    case GlobalActionType.SET_GUIDE_LOAD_ERROR:
      return { ...state, guideLoadError: action.payload, isLoadingGuide: false, guideData: null };
    
    case GlobalActionType.SET_CURRENT_CHAPTER:
      return { ...state, currentTopChapterId: action.payload };
    case GlobalActionType.ADD_RENDERED_CHAPTER:
      if (state.renderedChapterIds.includes(action.payload)) {
        return state; 
      }
      return { ...state, renderedChapterIds: [...state.renderedChapterIds, action.payload] };
    case GlobalActionType.SET_INITIAL_RENDERED_CHAPTERS:
      return { ...state, renderedChapterIds: action.payload };

    case GlobalActionType.UPDATE_RESOURCE_QUANTITY: {
      const { name, change } = action.payload;
      const currentQuantity = state.tracker.resources[name] || 0;
      return {
        ...state,
        tracker: {
          ...state.tracker,
          resources: { ...state.tracker.resources, [name]: Math.max(0, currentQuantity + change) },
        },
      };
    }
    case GlobalActionType.MANUALLY_EDIT_TRACKER_RESOURCE: {
      const { name, newValue } = action.payload;
      return {
        ...state,
        tracker: {
          ...state.tracker,
          resources: { ...state.tracker.resources, [name]: Math.max(0, newValue) },
        },
      };
    }
    case GlobalActionType.SET_FLAG_VALUE: {
      const { name, value } = action.payload;
      return {
        ...state,
        tracker: { ...state.tracker, flags: { ...state.tracker.flags, [name]: value } },
      };
    }
    case GlobalActionType.TOGGLE_FLAG_VALUE: {
      const { name } = action.payload;
      const currentValue = state.tracker.flags[name] || false;
      return {
        ...state,
        tracker: { ...state.tracker, flags: { ...state.tracker.flags, [name]: !currentValue } },
      };
    }
    case GlobalActionType.MANUALLY_EDIT_TRACKER_FLAG: {
        const { name, newValue } = action.payload;
        return {
            ...state,
            tracker: { ...state.tracker, flags: { ...state.tracker.flags, [name]: newValue } },
        };
    }

    case GlobalActionType.TOGGLE_CSR_MODE:
      return { ...state, settings: { ...state.settings, csrModeActive: !state.settings.csrModeActive } };
    case GlobalActionType.SET_THEME:
      return { ...state, settings: { ...state.settings, theme: action.payload } };
    case GlobalActionType.SET_TEXT_SIZE:
      return { ...state, settings: { ...state.settings, textSize: action.payload } };
    case GlobalActionType.TOGGLE_CONDITIONAL_BORDERS:
      return { ...state, settings: { ...state.settings, showConditionalBorders: !state.settings.showConditionalBorders } };

    case GlobalActionType.MARK_AUTO_UPDATE_APPLIED:
      if (state.tracker.appliedAutoUpdateIds[action.payload.id]) { // Already marked
        return state;
      }
      return {
        ...state,
        tracker: {
          ...state.tracker,
          appliedAutoUpdateIds: { ...state.tracker.appliedAutoUpdateIds, [action.payload.id]: true },
        },
      };
    // case GlobalActionType.UNMARK_AUTO_UPDATE_APPLIED: // Disabled
    //   const newApplied = { ...state.tracker.appliedAutoUpdateIds };
    //   if (!newApplied[action.payload.id]) return state; 
    //   delete newApplied[action.payload.id];
    //   return { ...state, tracker: { ...state.tracker, appliedAutoUpdateIds: newApplied } };

    default:
      // For exhaustiveness check with TypeScript, if you add it back:
      // const _exhaustiveCheck: never = action;
      // console.warn(`Unhandled action type: ${(_exhaustiveCheck as any)?.type}`);
      return state;
  }
};

// --- Provider Component & Custom Hooks ---
const StateContext = createContext<GlobalAppState | undefined>(undefined);
const DispatchContext = createContext<Dispatch<GlobalAppAction> | undefined>(undefined);

interface GlobalStateProviderProps { children: ReactNode; }

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({ children }) => {
  useEffect(() => {
    console.log('[GlobalStateProvider] Initializing with state:', initialGlobalState);
  }, []); 

  const loggingReducer = (state: GlobalAppState, action: GlobalAppAction): GlobalAppState => {
    console.log(
      '[GlobalDispatch] Action Dispatched:',
      action.type,
      'payload' in action ? (action as any).payload : ''
    );
    const newState = globalAppReducer(state, action);
    // console.log('[GlobalState] Next State:', newState); // Can be very verbose, enable if needed
    return newState;
  };

  const [state, dispatch] = useReducer(loggingReducer, initialGlobalState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useGlobalState = (): GlobalAppState => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const useGlobalDispatch = (): Dispatch<GlobalAppAction> => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalStateProvider');
  }
  return context;
};