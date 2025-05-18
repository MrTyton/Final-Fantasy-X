// src/components/Utils/TrackableRenderer.tsx
import React from 'react';
import type { TrackedResource, AcquiredItemFlag } from '../../types';
import ViewportTrigger from './ViewportTrigger'; // Assuming ViewportTrigger.tsx is in the same Utils folder
import { ResourcePromptComponent } from '../Prompts/ResourcePrompt'; // Adjust path if your Prompts folder is elsewhere
import { FlagPromptComponent } from '../Prompts/FlagPrompt';       // Adjust path
import { useGlobalState } from '../../contexts/GlobalStateContext';

interface TrackableRendererProps {
  trackedResources?: TrackedResource[];
  itemFlags?: AcquiredItemFlag[];
  // parentKeyPrefix was considered for React keys but using item.id is better
}

export const TrackableRenderer: React.FC<TrackableRendererProps> = ({ 
  trackedResources, 
  itemFlags 
}) => {
  const { settings } = useGlobalState(); // For conditional debug info visibility

  return (
    <>
      {/* Render Tracked Resources */}
      {trackedResources?.map((resource) => {
        // Use the resource's own unique ID for the React key.
        // This assumes all TrackedResource objects in your JSON have a unique `id`.
        const key = `trk-res-${resource.id}`; 

        if (
          resource.updateType === 'auto_guaranteed' || 
          resource.updateType === 'consumption_explicit_fixed' || 
          resource.updateType === 'consumption_implicit_grid'
        ) {
          // For AUTOMATIC types, render ViewportTrigger.
          // The ViewportTrigger itself renders a minimal div for observation.
          // We pass ResourcePromptComponent as a child to ViewportTrigger only for debug display.
          return (
            <ViewportTrigger key={key} autoResourceToMonitor={resource}>
              {/* 
                ResourcePromptComponent has logic to display info for auto-types 
                when settings.showConditionalBorders is true.
              */}
              {settings.showConditionalBorders && 
                <ResourcePromptComponent resourceUpdate={resource} />
              }
            </ViewportTrigger>
          );
        } else if (
          resource.updateType === 'user_confirm_rng_gain' || 
          resource.updateType === 'user_confirm_rng_consumption'
        ) {
          // For MANUAL resource prompts, render ResourcePromptComponent directly.
          return <ResourcePromptComponent key={key} resourceUpdate={resource} />;
        }
        
        // Fallback for unhandled resource updateType
        // console.warn(`TrackableRenderer: Unhandled TrackedResource updateType: ${resource.updateType} for ${resource.name} [${resource.id}]`);
        return null; 
      })}

      {/* Render Item Acquisition Flags */}
      {itemFlags?.map((flag) => {
        // Use the flag's own unique ID for the React key.
        // This assumes all AcquiredItemFlag objects in your JSON have a unique `id`.
        const key = `acq-flag-${flag.id}`; 

        // Check for flag types that require user interaction (manual prompts)
        if (
          flag.setType === 'user_checkbox_on_pickup_or_drop' || 
          flag.setType === 'user_prompt_after_event'
          // Add other manual flag setTypes here if any in the future
        ) { 
          return <FlagPromptComponent key={key} flag={flag} />;
        }
        
        // If 'auto_set_on_pass' for flags were implemented, ViewportTrigger would be used here.
        // 'derived_from_user_choice' flags are typically not directly rendered as prompts by TrackableRenderer;
        // their state changes as a consequence of other interactions.
        // console.warn(`TrackableRenderer: Unhandled/Non-prompt AcquiredItemFlag setType: ${flag.setType} for ${flag.itemName} [${flag.id}]`);
        return null;
      })}
    </>
  );
};

// If this is the only export from this file, you might prefer:
// export default TrackableRenderer;
// However, keeping it as a named export is also fine.