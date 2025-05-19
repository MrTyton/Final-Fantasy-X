// src/contexts/ListNumberingContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ListCounters maps each unique scope key to the last number used by a list in that scope.
interface ListCounters {
    [scopeKey: string]: number; // scopeKey -> last number used by a list in that scope
}

// ListNumberingContextType defines the API for managing list numbering across nested lists/blocks.
// - getCachedLastNumber: Returns the last number used for a given scope (0 if not found).
// - updateLastNumber: Updates the last number for a given scope.
// - resetCountersForScopePrefix: Resets all counters that start with a given prefix (e.g., for a chapter or section).
interface ListNumberingContextType {
    getCachedLastNumber: (scopeKey: string) => number;
    updateLastNumber: (scopeKey: string, lastNum: number) => void;
    resetCountersForScopePrefix: (scopeKeyPrefix: string) => void;
}

// Create the React context for list numbering, initially undefined.
const ListNumberingContext = createContext<ListNumberingContextType | undefined>(undefined);

// ListNumberingProvider manages the state and provides the context to its children.
export const ListNumberingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State: Map of scope keys to their last used number.
    const [counters, setCounters] = useState<ListCounters>({});

    // Returns the last number used for a given scope key, or 0 if not found.
    const getCachedLastNumber = useCallback((scopeKey: string): number => {
        const lastNum = counters[scopeKey] || 0;
        // console.log(`[ListNumberingContext] getCachedLastNumber for ${scopeKey}: ${lastNum}`);
        return lastNum;
    }, [counters]);

    // Updates the last number for a given scope key, only if it has changed.
    const updateLastNumber = useCallback((scopeKey: string, lastNum: number) => {
        setCounters(prevCounters => {
            if (prevCounters[scopeKey] === lastNum) {
                // No change needed if value is already correct.
                return prevCounters;
            }
            // Update the counter for this scope key.
            return {
                ...prevCounters,
                [scopeKey]: lastNum,
            };
        });
    }, []);

    // Resets all counters whose keys start with the given prefix (e.g., when a chapter is reloaded).
    const resetCountersForScopePrefix = useCallback((scopeKeyPrefix: string) => {
        setCounters(prevCounters => {
            let changed = false;
            const newCounters: ListCounters = {};
            for (const key in prevCounters) {
                if (key.startsWith(scopeKeyPrefix)) {
                    changed = true; // This counter will be removed
                } else {
                    newCounters[key] = prevCounters[key];
                }
            }
            if (!changed) {
                // No counters matched the prefix; return previous state
                return prevCounters;
            }
            // Return the new counters object with the relevant keys removed
            return newCounters;
        });
    }, []);

    // Provide the context value to all children
    return (
        <ListNumberingContext.Provider value={{ getCachedLastNumber, updateLastNumber, resetCountersForScopePrefix }}>
            {children}
        </ListNumberingContext.Provider>
    );
};

// Custom hook to access the ListNumberingContext. Throws if used outside the provider.
export const useListNumbering = (): ListNumberingContextType => {
    const context = useContext(ListNumberingContext);
    if (context === undefined) {
        throw new Error('useListNumbering must be used within a ListNumberingProvider');
    }
    return context;
};