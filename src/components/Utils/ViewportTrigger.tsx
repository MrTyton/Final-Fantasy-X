// src/components/Utils/ViewportTrigger.tsx
import React, { useEffect, useRef, ReactNode } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';
import type { TrackedResource } from '../../types';

interface ViewportTriggerProps {
  children?: ReactNode;
  autoResourceToMonitor: TrackedResource;
  // scrollRoot?: HTMLElement | null; 
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
    const resUpd = autoResourceToMonitor;
    if (!element || !resUpd) return;

    const isAutoType = resUpd.updateType === 'auto_guaranteed' || 
                       resUpd.updateType === 'consumption_explicit_fixed' ||
                       resUpd.updateType === 'consumption_implicit_grid';
    if (!isAutoType) return; 

    // Check if this specific resource update has already been applied
    if (tracker.appliedAutoUpdateIds[resUpd.id]) {
      // console.log(`[ViewportTrigger ${resUpd.id}] Already applied, not observing.`);
      return; // Do not set up observer if already applied
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Check again if applied, in case of race conditions or multiple triggers
          if (tracker.appliedAutoUpdateIds[resUpd.id]) {
            // If it got applied by another means or a quick re-render, unobserve and exit.
            observer.unobserve(element);
            observer.disconnect();
            return;
          }

          // Trigger ONLY when scrolling OUT OF VIEW UPWARDS (passed for the first time)
          if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0 && entry.boundingClientRect.top < 0) {
            // console.log(`[ViewportTrigger ${resUpd.id}] APPLYING (first time): ${resUpd.name}`);
            
            let changeAmount = resUpd.quantity;
            if ((resUpd.updateType === 'consumption_explicit_fixed' || resUpd.updateType === 'consumption_implicit_grid') && changeAmount > 0 && resUpd.quantity !== 0 ) {
              changeAmount = -Math.abs(resUpd.quantity);
            }

            if (changeAmount !== 0) {
                dispatch({ type: GlobalActionType.UPDATE_RESOURCE_QUANTITY, payload: { name: resUpd.name, change: changeAmount } });
            }
            dispatch({ type: GlobalActionType.MARK_AUTO_UPDATE_APPLIED, payload: { id: resUpd.id } });
            
            // Once applied, unobserve and disconnect this specific observer
            // as this trigger is now "done".
            observer.unobserve(element);
            observer.disconnect();
          }
        });
      },
      { 
        root: null, // TODO: Refine with scrollContext
        threshold: 0.0, // Trigger as soon as it's fully out or fully in
      }
    );

    observer.observe(element);

    return () => {
      // console.log(`[ViewportTrigger ${resUpd.id}] Cleaning up observer.`);
      observer.unobserve(element);
      observer.disconnect();
    };
  // Dependencies: Key properties of the resource, dispatch, and the appliedAutoUpdateIds map itself.
  // If appliedAutoUpdateIds changes, this effect re-runs to check if an observer is still needed.
  }, [autoResourceToMonitor.id, autoResourceToMonitor.name, autoResourceToMonitor.quantity, autoResourceToMonitor.updateType, 
      dispatch, tracker.appliedAutoUpdateIds]);

  return (
    <div ref={elementRef} style={{width: '100%', height: '1px', marginTop: '-1px', visibility: 'hidden', pointerEvents: 'none'}}>
        {children}
    </div>
  );
};

export default ViewportTrigger;