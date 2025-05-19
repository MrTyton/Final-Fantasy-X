// src/components/Utils/TrackableRenderer.tsx
import React from 'react';
import type { TrackedResource, AcquiredItemFlag } from '../../types';
import ViewportTrigger from './ViewportTrigger';
import { ResourcePromptComponent } from '../Prompts/ResourcePrompt';
import { FlagPromptComponent } from '../Prompts/FlagPrompt';
import { useGlobalState } from '../../contexts/GlobalStateContext';

// Props for the TrackableRenderer component, which renders tracked resources and item acquisition flags
interface TrackableRendererProps {
  trackedResources?: TrackedResource[]; // Array of tracked resource updates to render
  itemFlags?: AcquiredItemFlag[];       // Array of item acquisition flags to render
}

// TrackableRenderer renders all tracked resources and item acquisition flags for a given block or list item.
// It handles both automatic (auto) and user-interactive (manual) resource/flag prompts.
export const TrackableRenderer: React.FC<TrackableRendererProps> = ({
  trackedResources,
  itemFlags
}) => {
  // Access global settings (e.g., for debug/conditional border display)
  const { settings } = useGlobalState();

  return (
    <>
      {/* Render all tracked resource updates, handling both auto and manual prompt types */}
      {trackedResources?.map((resUpd) => {
        // Use the resource's own unique ID for the React key
        const key = `tr-${resUpd.id}`;

        // Determine if this resource update is automatic (auto) or user-interactive (manual)
        const isAutoType =
          resUpd.updateType === 'auto_guaranteed' ||
          resUpd.updateType === 'consumption_explicit_fixed' ||
          resUpd.updateType === 'consumption_implicit_grid';

        const isUserConfirmType =
          resUpd.updateType === 'user_confirm_rng_gain' ||
          resUpd.updateType === 'user_confirm_rng_consumption';

        // Debug log for resource processing (can be removed in production)
        console.log(`[TrackableRenderer] Processing Resource: ${resUpd.name}, ID: ${resUpd.id}, Type: ${resUpd.updateType}, IsAuto: ${isAutoType}, IsUserConfirm: ${isUserConfirmType}`);

        if (isAutoType) {
          // For AUTOMATIC types, render ViewportTrigger to monitor when the resource comes into view.
          // ResourcePromptComponent is rendered as a child ONLY for debug display (when showConditionalBorders is enabled).
          return (
            <ViewportTrigger key={key} autoResourceToMonitor={resUpd}>
              {settings.showConditionalBorders &&
                <ResourcePromptComponent resourceUpdate={resUpd} />
              }
            </ViewportTrigger>
          );
        } else if (isUserConfirmType) {
          // For MANUAL resource prompts, render ResourcePromptComponent directly (user must confirm the update).
          return <ResourcePromptComponent key={key} resourceUpdate={resUpd} />;
        }
        // Fallback for unhandled resource updateType (should not occur in normal usage)
        console.warn(`TrackableRenderer: Unhandled TrackedResource updateType: ${resUpd.updateType} for ${resUpd.name} [${resUpd.id}]`);
        return null;
      })}

      {/* Render all item acquisition flags, handling only user-interactive flag types */}
      {itemFlags?.map((flag) => {
        // Use the flag's own unique ID for the React key
        const key = `af-${flag.id}`;

        // Determine if this flag is user-interactive (toggle or prompt)
        const isUserPromptFlag =
          flag.setType === 'user_checkbox_on_pickup_or_drop' ||
          flag.setType === 'user_prompt_after_event';

        if (isUserPromptFlag) {
          // Render FlagPromptComponent for user-interactive flags
          return <FlagPromptComponent key={key} flag={flag} />;
        }
        // Fallback for unhandled flag setType (should not occur in normal usage)
        console.warn(`TrackableRenderer: Unhandled AcquiredItemFlag setType: ${flag.setType} for ${flag.itemName} [${flag.id}]`);
        return null;
      })}
    </>
  );
};

// Note: This is a named export. Import as { TrackableRenderer } where needed.