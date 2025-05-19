// src/components/Utils/ViewportTrigger.tsx
import React, { useEffect, useRef, ReactNode } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';
import type { TrackedResource } from '../../types';

// Props for the ViewportTrigger component, which monitors when a tracked resource comes into or out of view
interface ViewportTriggerProps {
  children?: ReactNode; // Optional children to render inside the trigger div (usually debug info)
  autoResourceToMonitor: TrackedResource; // The resource update to monitor for viewport entry/exit
  // scrollRoot?: HTMLElement | null; // Optionally, a custom scroll root could be provided
}

// ViewportTrigger sets up an IntersectionObserver to monitor when a tracked resource's trigger point
// enters or leaves the viewport. When the trigger leaves the viewport upwards for the first time,
// it applies the resource update and marks it as applied in global state.
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

    // Only set up observer for automatic resource update types
    const isAutoType = resUpd.updateType === 'auto_guaranteed' ||
      resUpd.updateType === 'consumption_explicit_fixed' ||
      resUpd.updateType === 'consumption_implicit_grid';
    if (!isAutoType) return;

    // Check if this specific resource update has already been applied
    if (tracker.appliedAutoUpdateIds[resUpd.id]) {
      // Already applied, do not set up observer again
      return; // Do not set up observer if already applied
    }

    // Set up IntersectionObserver to monitor when the trigger leaves the viewport upwards
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
            // Calculate the change amount (negative for consumption, positive for gain)
            let changeAmount = resUpd.quantity;
            if ((resUpd.updateType === 'consumption_explicit_fixed' || resUpd.updateType === 'consumption_implicit_grid') && changeAmount > 0 && resUpd.quantity !== 0) {
              changeAmount = -Math.abs(resUpd.quantity);
            }

            // Only dispatch the update if the change is nonzero
            if (changeAmount !== 0) {
              dispatch({ type: GlobalActionType.UPDATE_RESOURCE_QUANTITY, payload: { name: resUpd.name, change: changeAmount } });
            }
            // Mark this auto update as applied in global state
            dispatch({ type: GlobalActionType.MARK_AUTO_UPDATE_APPLIED, payload: { id: resUpd.id } });
            // Once applied, unobserve and disconnect this specific observer as this trigger is now "done"
            observer.unobserve(element);
            observer.disconnect();
          }
        });
      },
      {
        root: null, // Optionally, a custom scroll context could be provided
        threshold: 0.0, // Trigger as soon as it's fully out or fully in
      }
    );

    observer.observe(element);

    // Cleanup: unobserve and disconnect observer when component unmounts or dependencies change
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
    // Dependencies: Key properties of the resource, dispatch, and the appliedAutoUpdateIds map itself.
    // If appliedAutoUpdateIds changes, this effect re-runs to check if an observer is still needed.
  }, [autoResourceToMonitor.id, autoResourceToMonitor.name, autoResourceToMonitor.quantity, autoResourceToMonitor.updateType,
    dispatch, tracker.appliedAutoUpdateIds]);

  // Render a hidden div as the trigger point for the observer. Children are rendered for debug/info only.
  return (
    <div ref={elementRef} style={{ width: '100%', height: '1px', marginTop: '-1px', visibility: 'hidden', pointerEvents: 'none' }}>
      {children}
    </div>
  );
};

export default ViewportTrigger;