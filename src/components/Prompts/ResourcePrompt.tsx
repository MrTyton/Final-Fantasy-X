// src/components/Prompts/ResourcePrompt.tsx
import React from 'react';
import type { TrackedResource } from '../../types';
import { useGlobalDispatch, useGlobalState, GlobalActionType } from '../../contexts/GlobalStateContext';
import InlineContentRenderer from '../InlineContentRenderer'; // For rendering conditions

export interface ResourcePromptProps {
    resourceUpdate: TrackedResource;
}

export const ResourcePromptComponent: React.FC<ResourcePromptProps> = ({ resourceUpdate }) => {
    const dispatch = useGlobalDispatch();
    const { settings } = useGlobalState(); // For showing auto notes in debug mode

    // Initial value for input, always positive for UI, sign handled by dispatch
    const [currentValue, setCurrentValue] = React.useState(Math.abs(resourceUpdate.quantity));

    const handleConfirm = () => {
        const change = resourceUpdate.updateType === 'user_confirm_rng_consumption' ? -currentValue : currentValue;
        if (change !== 0 || resourceUpdate.name) {
            dispatch({
                type: GlobalActionType.UPDATE_RESOURCE_QUANTITY,
                payload: { name: resourceUpdate.name, change: change }
            });
        }
        // TODO: UI feedback like disabling the prompt, showing "Confirmed!", or resetting currentValue
        // For now, it just dispatches.
    };

    // Only render for user_confirm types
    if (resourceUpdate.updateType === 'user_confirm_rng_gain' || resourceUpdate.updateType === 'user_confirm_rng_consumption') {
        const isConsumption = resourceUpdate.updateType === 'user_confirm_rng_consumption';
        return (
            <div style={{
                margin: '8px 0', padding: '10px',
                border: `1px dashed ${isConsumption ? '#EF9A9A' : '#A5D6A7'}`, // Softer colors
                fontSize: '0.9em', borderRadius: '4px',
                backgroundColor: isConsumption ? '#FFEBEE' : '#E8F5E9',
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
            }}>
                {resourceUpdate.condition && (
                    <div style={{ fontStyle: 'italic', marginBottom: '5px', color: '#424242', width: '100%' /* Take full width if condition present */ }}>
                        Condition: {resourceUpdate.condition.map((el, i) => <InlineContentRenderer key={`cond-${i}`} element={el} />)}
                    </div>
                )}
                <span style={{ fontWeight: 500 }}>
                    {isConsumption ? 'Confirm consumption of ' : 'Confirm gain of '} {resourceUpdate.name}:
                </span>
                <input
                    type="number"
                    min="0"
                    value={currentValue}
                    onChange={e => setCurrentValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    style={{ width: '60px', textAlign: 'right', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                />
                <button
                    onClick={handleConfirm}
                    style={{ padding: '4px 12px', border: 'none', borderRadius: '3px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
                >
                    Confirm
                </button>
                {resourceUpdate.description && <small style={{ color: '#666' }}> ({resourceUpdate.description})</small>}
            </div>
        );
    }

    // Optionally, display info for automatic updates if debug borders are on (as ViewportTrigger's child)
    if (settings.showConditionalBorders &&
        (resourceUpdate.updateType === 'auto_guaranteed' ||
            resourceUpdate.updateType === 'consumption_explicit_fixed' ||
            resourceUpdate.updateType === 'consumption_implicit_grid')) {
        return (
            <div style={{ fontSize: '0.8em', color: 'DimGray', margin: '2px 0', paddingLeft: '15px', fontStyle: 'italic' }}>
                (Auto-Update: {resourceUpdate.name} {resourceUpdate.quantity > 0 ? '+' : ''}{resourceUpdate.quantity} [{resourceUpdate.updateType}])
                {resourceUpdate.description && <small> - {resourceUpdate.description}</small>}
            </div>
        );
    }
    return null;
};