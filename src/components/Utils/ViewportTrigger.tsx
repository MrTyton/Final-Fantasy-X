// src/components/Utils/ViewportTrigger.tsx
import React, { useEffect, useRef, ReactNode } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';
import type { TrackedResource } from '../../types';

interface ViewportTriggerProps {
    children?: ReactNode; // For optional debug info inside the trigger div
    autoResourceToMonitor: TrackedResource;
    // scrollRoot?: HTMLElement | null; // For future IO root refinement
}

const ViewportTrigger: React.FC<ViewportTriggerProps> = ({
    children,
    autoResourceToMonitor,
    // scrollRoot,
}) => {
    const { tracker } = useGlobalState();
    const dispatch = useGlobalDispatch();
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        const resUpd = autoResourceToMonitor; // The single resource this instance monitors

        if (!element || !resUpd) {
            // console.warn("[ViewportTrigger] Missing element or resourceToMonitor", {elementExists: !!element, resUpdExists: !!resUpd});
            return;
        }

        // Double-check it's an automatic type (though TrackableRenderer should filter)
        const isAutoType = resUpd.updateType === 'auto_guaranteed' ||
            resUpd.updateType === 'consumption_explicit_fixed' ||
            resUpd.updateType === 'consumption_implicit_grid';

        if (!isAutoType) {
            // console.warn(`[ViewportTrigger] Received non-auto resource: ${resUpd.name} (${resUpd.updateType})`);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const resourceId = resUpd.id;
                    const isCurrentlyApplied = tracker.appliedAutoUpdateIds[resourceId] === true;

                    if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0 && entry.boundingClientRect.top < 0) {
                        // Element scrolled past upwards
                        if (!isCurrentlyApplied) {
                            let changeAmount = resUpd.quantity;
                            if ((resUpd.updateType === 'consumption_explicit_fixed' || resUpd.updateType === 'consumption_implicit_grid') && changeAmount > 0 && resUpd.quantity !== 0) {
                                changeAmount = -Math.abs(resUpd.quantity);
                            }
                            // console.log(`[ViewportTrigger ${resourceId}] APPLYING: ${resUpd.name}, change: ${changeAmount}`);
                            if (changeAmount !== 0) {
                                dispatch({ type: GlobalActionType.UPDATE_RESOURCE_QUANTITY, payload: { name: resUpd.name, change: changeAmount } });
                            }
                            dispatch({ type: GlobalActionType.MARK_AUTO_UPDATE_APPLIED, payload: { id: resourceId } });
                        }
                    } else if (entry.isIntersecting && entry.boundingClientRect.top >= 0 && isCurrentlyApplied) {
                        // Element scrolled back into view
                        // console.log(`[ViewportTrigger ${resourceId}] REVERTING: ${resUpd.name}`);
                        let originalChangeAmount = resUpd.quantity;
                        if ((resUpd.updateType === 'consumption_explicit_fixed' || resUpd.updateType === 'consumption_implicit_grid') && originalChangeAmount > 0 && resUpd.quantity !== 0) {
                            originalChangeAmount = -Math.abs(resUpd.quantity);
                        }
                        if (originalChangeAmount !== 0) {
                            dispatch({ type: GlobalActionType.UPDATE_RESOURCE_QUANTITY, payload: { name: resUpd.name, change: -originalChangeAmount } });
                        }
                        dispatch({ type: GlobalActionType.UNMARK_AUTO_UPDATE_APPLIED, payload: { id: resourceId } });
                    }
                });
            },
            {
                root: null, // TODO: Refine with scrollContext from MainContentArea
                threshold: 0.0, // Trigger as soon as it enters/leaves
            }
        );

        observer.observe(element);
        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
        // Use resUpd.id and resUpd.updateType for more stable dependency if resUpd object reference changes
    }, [autoResourceToMonitor.id, autoResourceToMonitor.name, autoResourceToMonitor.quantity, autoResourceToMonitor.updateType, dispatch, tracker.appliedAutoUpdateIds]);

    // Render a minimal, perhaps effectively invisible, element for observation.
    // Can be made visible for debugging.
    return (
        <div ref={elementRef} style={{ width: '100%', height: '1px', marginTop: '-1px', visibility: 'hidden', pointerEvents: 'none' }}>
            {children}
        </div>
    );
};

export default ViewportTrigger;