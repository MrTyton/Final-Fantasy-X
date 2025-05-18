// src/contexts/ListNumberingContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ListCounters {
    [scopeKey: string]: number; // scopeKey -> last number used by a list in that scope
}

// THIS IS THE IMPORTANT INTERFACE
interface ListNumberingContextType {
    /** Gets the last number recorded for a given scope. Returns 0 if scope not found. */
    getCachedLastNumber: (scopeKey: string) => number; // Make sure this name matches
    /** Updates the last number for a given scope. */
    updateLastNumber: (scopeKey: string, lastNum: number) => void; // Make sure this name matches
    /** Resets all counters that start with the given prefix (e.g., for a chapter). */
    resetCountersForScopePrefix: (scopeKeyPrefix: string) => void; // Make sure this name matches
}

const ListNumberingContext = createContext<ListNumberingContextType | undefined>(undefined);

export const ListNumberingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [counters, setCounters] = useState<ListCounters>({});

    const getCachedLastNumber = useCallback((scopeKey: string): number => {
        const lastNum = counters[scopeKey] || 0;
        // console.log(`[ListNumberingContext] getCachedLastNumber for ${scopeKey}: ${lastNum}`);
        return lastNum;
    }, [counters]);

    const updateLastNumber = useCallback((scopeKey: string, lastNum: number) => {
        setCounters(prevCounters => {
            if (prevCounters[scopeKey] === lastNum) {
                // console.log(`[ListNumberingContext] updateLastNumber - No change needed for ${scopeKey}, value is already ${lastNum}`);
                return prevCounters;
            }
            // console.log(`[ListNumberingContext] updateLastNumber - Updating ${scopeKey} from ${prevCounters[scopeKey] || 'undefined'} to ${lastNum}`);
            return {
                ...prevCounters,
                [scopeKey]: lastNum,
            };
        });
    }, []);

    const resetCountersForScopePrefix = useCallback((scopeKeyPrefix: string) => {
        setCounters(prevCounters => {
            let changed = false;
            const newCounters: ListCounters = {};

            for (const key in prevCounters) {
                if (key.startsWith(scopeKeyPrefix)) {
                    changed = true;
                } else {
                    newCounters[key] = prevCounters[key];
                }
            }

            if (!changed) {
                return prevCounters;
            }

            return newCounters;
        });
    }, []);

    return (
        <ListNumberingContext.Provider value={{ getCachedLastNumber, updateLastNumber, resetCountersForScopePrefix }}>
            {children}
        </ListNumberingContext.Provider>
    );
};

export const useListNumbering = (): ListNumberingContextType => {
    const context = useContext(ListNumberingContext);
    if (context === undefined) {
        throw new Error('useListNumbering must be used within a ListNumberingProvider');
    }
    return context;
};