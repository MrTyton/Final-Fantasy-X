// src/editor/components/KeyboardShortcut.tsx
import React from 'react';

interface KeyboardShortcutProps {
    keys: string | string[];
    className?: string;
    style?: React.CSSProperties;
}

/**
 * Reusable keyboard shortcut component
 * Provides consistent styling for kbd elements throughout the application
 */
export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
    keys,
    className = '',
    style = {}
}) => {
    const kbdStyle: React.CSSProperties = {
        backgroundColor: '#f1f5f9',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        ...style
    };

    const keyArray = Array.isArray(keys) ? keys : [keys];

    return (
        <>
            {keyArray.map((key, index) => (
                <React.Fragment key={key}>
                    <kbd className={className} style={kbdStyle}>
                        {key}
                    </kbd>
                    {index < keyArray.length - 1 && ' / '}
                </React.Fragment>
            ))}
        </>
    );
};

/**
 * Shortcut row component for help modal
 * Provides consistent layout for shortcut descriptions
 */
interface ShortcutRowProps {
    shortcut: string | string[];
    description: string;
}

export const ShortcutRow: React.FC<ShortcutRowProps> = ({ shortcut, description }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span>
            <KeyboardShortcut keys={shortcut} />
        </span>
        <span>{description}</span>
    </div>
);

/**
 * Section header component for help modal
 * Provides consistent styling for section headers
 */
interface ShortcutSectionProps {
    title: string;
    marginTop?: string;
}

export const ShortcutSection: React.FC<ShortcutSectionProps> = ({
    title,
    marginTop = '0'
}) => (
    <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '12px',
        marginTop,
        color: '#1e293b'
    }}>
        {title}
    </h3>
);

/**
 * Shortcut subsection component for help modal
 * Provides consistent styling for subsection headers
 */
export const ShortcutSubsection: React.FC<ShortcutSectionProps> = ({
    title,
    marginTop = '20px'
}) => (
    <h4 style={{
        fontSize: '16px',
        fontWeight: '600',
        marginBottom: '8px',
        marginTop,
        color: '#374151'
    }}>
        {title}
    </h4>
);
