// src/components/Utils/TrackableRenderer.tsx
import React from 'react';
import type { TrackedResource, AcquiredItemFlag } from '../../types';
import ViewportTrigger from './ViewportTrigger';
import { ResourcePromptComponent } from '../Prompts/ResourcePrompt'; // Assuming path is correct
import { FlagPromptComponent } from '../Prompts/FlagPrompt';       // Assuming path is correct
import { useGlobalState } from '../../contexts/GlobalStateContext';

interface TrackableRendererProps {
  trackedResources?: TrackedResource[];
  itemFlags?: AcquiredItemFlag[];
}

export const TrackableRenderer: React.FC<TrackableRendererProps> = ({ 
  trackedResources, 
  itemFlags 
}) => {
  const { settings } = useGlobalState();

  return (
    <>
      {/* Render Tracked Resources */}
      {trackedResources?.map((resUpd) => {
        const key = `tr-${resUpd.id}`; // Use the resource's own unique ID for the React key

        const isAutoType = 
          resUpd.updateType === 'auto_guaranteed' || 
          resUpd.updateType === 'consumption_explicit_fixed' || 
          resUpd.updateType === 'consumption_implicit_grid';

        const isUserConfirmType = 
          resUpd.updateType === 'user_confirm_rng_gain' || 
          resUpd.updateType === 'user_confirm_rng_consumption';

        console.log(`[TrackableRenderer] Processing Resource: ${resUpd.name}, ID: ${resUpd.id}, Type: ${resUpd.updateType}, IsAuto: ${isAutoType}, IsUserConfirm: ${isUserConfirmType}`);

        if (isAutoType) {
          // For AUTOMATIC types, render ViewportTrigger.
          // ResourcePromptComponent is passed as a child ONLY for debug display.
          return (
            <ViewportTrigger key={key} autoResourceToMonitor={resUpd}>
              {settings.showConditionalBorders && 
                <ResourcePromptComponent resourceUpdate={resUpd} /> 
              }
            </ViewportTrigger>
          );
        } else if (isUserConfirmType) {
          // For MANUAL resource prompts, render ResourcePromptComponent directly.
          return <ResourcePromptComponent key={key} resourceUpdate={resUpd} />;
        }
        
        // Fallback for unhandled resource updateType
        console.warn(`TrackableRenderer: Unhandled TrackedResource updateType: ${resUpd.updateType} for ${resUpd.name} [${resUpd.id}]`);
        return null; 
      })}

      {/* Render Item Acquisition Flags */}
      {itemFlags?.map((flag) => {
        const key = `af-${flag.id}`; 

        const isUserPromptFlag = 
          flag.setType === 'user_checkbox_on_pickup_or_drop' || 
          flag.setType === 'user_prompt_after_event';

        if (isUserPromptFlag) { 
          return <FlagPromptComponent key={key} flag={flag} />;
        }
        
        console.warn(`TrackableRenderer: Unhandled AcquiredItemFlag setType: ${flag.setType} for ${flag.itemName} [${flag.id}]`);
        return null;
      })}
    </>
  );
};

// Make sure it's the default export if you import it as default elsewhere,
// or keep it as a named export if you import it as { TrackableRenderer }.
// Based on previous usage, it seems to be a named export.
// export default TrackableRenderer; 