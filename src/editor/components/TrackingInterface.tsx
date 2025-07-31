// src/editor/components/TrackingInterface.tsx
import React from 'react';
import type { TrackedResource, AcquiredItemFlag } from '../../types';
import { KNOWN_TRACKED_RESOURCE_NAMES, KNOWN_ACQUIRED_ITEM_FLAG_NAMES } from '../../generated/knownTrackables';

interface TrackingInterfaceProps {
    trackedResources?: TrackedResource[];
    itemFlags?: AcquiredItemFlag[];
    onUpdateTrackedResource: (index: number, resource: TrackedResource) => void;
    onRemoveTrackedResource: (index: number) => void;
    onUpdateItemFlag: (index: number, flag: AcquiredItemFlag) => void;
    onRemoveItemFlag: (index: number) => void;
}

export const TrackingInterface: React.FC<TrackingInterfaceProps> = ({
    trackedResources,
    itemFlags,
    onUpdateTrackedResource,
    onRemoveTrackedResource,
    onUpdateItemFlag,
    onRemoveItemFlag
}) => {
    return (
        <>
            {/* Tracked Resources */}
            {trackedResources && trackedResources.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    {trackedResources.map((resource, index) => (
                        <div key={index} style={{
                            backgroundColor: '#e8f5e8',
                            padding: '8px',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '11px',
                            position: 'relative'
                        }}>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'none',
                                    border: '1px solid #ccc',
                                    borderRadius: '3px',
                                    color: '#f44336',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => onRemoveTrackedResource(index)}
                                title="Remove resource"
                            >
                                ×
                            </button>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px', paddingRight: '25px' }}>
                                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '100px' }}>
                                    <strong style={{ fontSize: '10px', marginBottom: '2px' }}>Resource Type:</strong>
                                    <select
                                        value={KNOWN_TRACKED_RESOURCE_NAMES.includes(resource.name) ? resource.name : 'Custom'}
                                        onChange={(e) => {
                                            if (e.target.value === 'Custom') {
                                                // Don't change the name if Custom is selected - let user edit in text field
                                            } else {
                                                onUpdateTrackedResource(index, { ...resource, name: e.target.value });
                                            }
                                        }}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '110px',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        {KNOWN_TRACKED_RESOURCE_NAMES.map(resourceName => (
                                            <option key={resourceName} value={resourceName}>{resourceName}</option>
                                        ))}
                                        <option value="Custom">Custom...</option>
                                    </select>
                                    <span style={{ fontSize: '9px', color: '#666', marginBottom: '1px' }}>Custom Name:</span>
                                    <input
                                        type="text"
                                        value={resource.name}
                                        onChange={(e) => onUpdateTrackedResource(index, { ...resource, name: e.target.value })}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '100px'
                                        }}
                                        placeholder="Resource name"
                                    />
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '50px' }}>
                                    <strong style={{ fontSize: '10px', marginBottom: '2px' }}>Qty:</strong>
                                    <input
                                        type="number"
                                        value={resource.quantity}
                                        onChange={(e) => onUpdateTrackedResource(index, { ...resource, quantity: parseInt(e.target.value) || 0 })}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '50px'
                                        }}
                                    />
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
                                    <strong style={{ fontSize: '10px', marginBottom: '2px' }}>Update Type:</strong>
                                    <select
                                        value={resource.updateType}
                                        onChange={(e) => onUpdateTrackedResource(index, { ...resource, updateType: e.target.value as any })}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '120px'
                                        }}
                                    >
                                        <option value="auto_guaranteed">Auto Guaranteed</option>
                                        <option value="consumption_explicit_fixed">Consumption Explicit Fixed</option>
                                        <option value="consumption_implicit_grid">Consumption Implicit Grid</option>
                                        <option value="user_confirm_rng_consumption">User Confirm RNG Consumption</option>
                                        <option value="user_confirm_rng_gain">User Confirm RNG Gain</option>
                                    </select>
                                </label>
                            </div>

                            <label style={{ display: 'block', marginTop: '4px' }}>
                                <strong style={{ fontSize: '10px', marginBottom: '2px', display: 'block' }}>Description:</strong>
                                <input
                                    type="text"
                                    value={resource.description || ''}
                                    onChange={(e) => onUpdateTrackedResource(index, { ...resource, description: e.target.value || undefined })}
                                    style={{
                                        padding: '2px 4px',
                                        fontSize: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '2px',
                                        width: '100%',
                                        maxWidth: '250px'
                                    }}
                                    placeholder="Optional description"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* Item Flags */}
            {itemFlags && itemFlags.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    {itemFlags.map((flag, index) => (
                        <div key={index} style={{
                            backgroundColor: '#fef3c7',
                            padding: '8px',
                            borderRadius: '4px',
                            marginBottom: '4px',
                            fontSize: '11px',
                            position: 'relative'
                        }}>
                            <button
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'none',
                                    border: '1px solid #ccc',
                                    borderRadius: '3px',
                                    color: '#f44336',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => onRemoveItemFlag(index)}
                                title="Remove item flag"
                            >
                                ×
                            </button>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px', paddingRight: '25px' }}>
                                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '180px' }}>
                                    <strong style={{ fontSize: '10px', marginBottom: '2px' }}>Item Type:</strong>
                                    <select
                                        value={KNOWN_ACQUIRED_ITEM_FLAG_NAMES.includes(flag.itemName) ? flag.itemName : 'Custom'}
                                        onChange={(e) => {
                                            if (e.target.value === 'Custom') {
                                                // Don't change the name if Custom is selected - let user edit in text field
                                            } else {
                                                onUpdateItemFlag(index, { ...flag, itemName: e.target.value });
                                            }
                                        }}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '180px',
                                            marginBottom: '2px'
                                        }}
                                    >
                                        {KNOWN_ACQUIRED_ITEM_FLAG_NAMES.map(flagName => (
                                            <option key={flagName} value={flagName}>{flagName}</option>
                                        ))}
                                        <option value="Custom">Custom...</option>
                                    </select>
                                    <span style={{ fontSize: '9px', color: '#666', marginBottom: '1px' }}>Custom Name:</span>
                                    <input
                                        type="text"
                                        value={flag.itemName}
                                        onChange={(e) => onUpdateItemFlag(index, { ...flag, itemName: e.target.value })}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '170px'
                                        }}
                                        placeholder="Item name"
                                    />
                                </label>

                                <label style={{ display: 'flex', flexDirection: 'column', minWidth: '140px' }}>
                                    <strong style={{ fontSize: '10px', marginBottom: '2px' }}>Set Type:</strong>
                                    <select
                                        value={flag.setType}
                                        onChange={(e) => onUpdateItemFlag(index, { ...flag, setType: e.target.value as any })}
                                        style={{
                                            padding: '2px 4px',
                                            fontSize: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '2px',
                                            width: '140px'
                                        }}
                                    >
                                        <option value="derived_from_user_choice">Derived From User Choice</option>
                                        <option value="user_checkbox_on_pickup_or_drop">User Checkbox On Pickup/Drop</option>
                                        <option value="user_prompt_after_event">User Prompt After Event</option>
                                    </select>
                                </label>
                            </div>

                            <label style={{ display: 'block', marginTop: '4px' }}>
                                <strong style={{ fontSize: '10px', marginBottom: '2px', display: 'block' }}>Source Description:</strong>
                                <input
                                    type="text"
                                    value={flag.sourceDescription}
                                    onChange={(e) => onUpdateItemFlag(index, { ...flag, sourceDescription: e.target.value })}
                                    style={{
                                        padding: '2px 4px',
                                        fontSize: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '2px',
                                        width: '100%',
                                        maxWidth: '250px'
                                    }}
                                    placeholder="Description of how this item is acquired"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
