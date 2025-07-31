// src/editor/App.tsx - Updated with JSON Preview Panel
import React, { useEffect, useCallback, useState } from 'react';
import { ChapterBrowser } from './ChapterBrowser';
import { NodeRenderer } from './NodeRenderer';
import { useEditorStore } from './store';
import { LivePreview } from './LivePreview';

export const EditorViewer: React.FC = () => {
    // Connect to our Zustand store to get the state and the action function
    const {
        activeChapterContent,
        activeChapterTitle,
        isLoading,
        isSaving,
        error,
        saveStatus,
        loadChapter,
        saveChapter,
        updateNode,
    } = useEditorStore();

    const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedSubItemPath, setSelectedSubItemPath] = useState<number[]>([]); // For future sub-item navigation
    const [quickAddMode, setQuickAddMode] = useState<string | null>(null);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showJsonPreview, setShowJsonPreview] = useState(false);

    const blockTypes = [
        {
            category: 'Content',
            items: [
                { value: 'textParagraph', label: '📝 Text Paragraph', shortcut: '1' },
                { value: 'instructionList', label: '📋 Instruction List', shortcut: '2' },
                { value: 'image', label: '🖼️ Image', shortcut: '3' }
            ]
        },
        {
            category: 'Gameplay',
            items: [
                { value: 'battle', label: '⚔️ Battle', shortcut: '4' },
                { value: 'encounters', label: '👹 Encounters', shortcut: '5' },
                { value: 'trial', label: '🏛️ Trial', shortcut: '6' },
                { value: 'blitzballGame', label: '⚽ Blitzball Game', shortcut: '7' }
            ]
        },
        {
            category: 'Character',
            items: [
                { value: 'sphereGrid', label: '🔮 Sphere Grid', shortcut: '8' },
                { value: 'sphereGridCharacterActions', label: '👤 Character Actions', shortcut: '9' },
                { value: 'equip', label: '⚔️ Equipment', shortcut: '0' }
            ]
        },
        {
            category: 'Other',
            items: [
                { value: 'shop', label: '🏪 Shop', shortcut: 'S' },
                { value: 'conditional', label: '🔀 Conditional', shortcut: 'C' }
            ]
        }
    ];

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Save: Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (activeChapterTitle) {
                saveChapter();
            }
        }

        // Add Block: Ctrl+Shift+A
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            if (activeChapterTitle) {
                setIsAddBlockModalOpen(true);
            }
        }

        // Quick Add Content: Ctrl+1
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            if (activeChapterTitle) {
                setQuickAddMode('content');
            }
        }

        // Quick Add Gameplay: Ctrl+2
        if (e.ctrlKey && e.key === '2') {
            e.preventDefault();
            if (activeChapterTitle) {
                setQuickAddMode('gameplay');
            }
        }

        // Quick Add Character: Ctrl+3
        if (e.ctrlKey && e.key === '3') {
            e.preventDefault();
            if (activeChapterTitle) {
                setQuickAddMode('character');
            }
        }

        // Quick Add Other: Ctrl+4
        if (e.ctrlKey && e.key === '4') {
            e.preventDefault();
            if (activeChapterTitle) {
                setQuickAddMode('other');
            }
        }

        // Move block up: Ctrl+Shift+↑
        if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedBlockIndex !== null && selectedBlockIndex > 0) {
                moveBlockUp(selectedBlockIndex);
                setSelectedBlockIndex(selectedBlockIndex - 1);
            }
        }

        // Move block down: Ctrl+Shift+↓
        if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedBlockIndex !== null && selectedBlockIndex < activeChapterContent.length - 1) {
                moveBlockDown(selectedBlockIndex);
                setSelectedBlockIndex(selectedBlockIndex + 1);
            }
        }

        // Delete block: Ctrl+Shift+Delete
        if (e.ctrlKey && e.shiftKey && e.key === 'Delete') {
            e.preventDefault();
            if (selectedBlockIndex !== null) {
                removeTopLevelBlock(selectedBlockIndex);
                setSelectedBlockIndex(null);
            }
        }

        // Escape: Close modal or deselect
        if (e.key === 'Escape') {
            e.preventDefault();
            setIsAddBlockModalOpen(false);
            setSelectedBlockIndex(null);
            setQuickAddMode(null);
            setShowKeyboardHelp(false);
            setShowJsonPreview(false);
        }

        // Help shortcut
        if (e.key === 'F1' || (e.ctrlKey && e.key === '?')) {
            e.preventDefault();
            setShowKeyboardHelp(!showKeyboardHelp);
        }

        // Live Preview shortcut
        if (e.key === 'F2' || (e.ctrlKey && e.key === 'j')) {
            e.preventDefault();
            setShowJsonPreview(!showJsonPreview);
        }

        // Quick add mode number shortcuts
        if (quickAddMode && /^[1-9]$/.test(e.key)) {
            e.preventDefault();
            const num = parseInt(e.key);
            const category = blockTypes.find(cat => cat.category.toLowerCase() === quickAddMode);
            if (category && category.items[num - 1]) {
                addTopLevelBlock(category.items[num - 1].value);
                setQuickAddMode(null);
            }
        }

        // Direct shortcuts for common block types
        if (e.ctrlKey && e.shiftKey) {
            switch (e.key) {
                case 'T': // Text Paragraph
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('textParagraph');
                    }
                    break;
                case 'L': // Instruction List
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('instructionList');
                    }
                    break;
                case 'B': // Battle
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('battle');
                    }
                    break;
                case 'E': // Encounters
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('encounters');
                    }
                    break;
                case 'S': // Shop
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('shop');
                    }
                    break;
                case 'G': // Sphere Grid
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('sphereGrid');
                    }
                    break;
                case 'I': // Image
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('image');
                    }
                    break;
                case 'C': // Conditional
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('conditional');
                    }
                    break;
                case 'R': // Trial (R for tRial)
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('trial');
                    }
                    break;
                case 'Q': // Equipment (Q for eQuipment)
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('equip');
                    }
                    break;
                case 'F': // Blitzball Game (F for Final fantasy blitzball)
                    e.preventDefault();
                    if (activeChapterTitle) {
                        addTopLevelBlock('blitzballGame');
                    }
                    break;
                case 'A': // Character Actions (Ctrl+Shift+A already used for Add Block modal)
                    // Skip this since A is already used for Add Block modal
                    break;
            }
        }

        // Quick actions for selected blocks
        if (selectedBlockIndex !== null && e.ctrlKey && !e.shiftKey) {
            switch (e.key) {
                case 'Enter': // Add sub-item to current block
                    e.preventDefault();
                    addSubItemToBlock(selectedBlockIndex);
                    break;
                case 'n': // Add new item to list-type blocks
                    e.preventDefault();
                    addSubItemToBlock(selectedBlockIndex);
                    break;
                case 'd': // Duplicate current block
                    e.preventDefault();
                    duplicateBlock(selectedBlockIndex);
                    break;
            }
        }

        // Arrow key navigation for block selection (Ctrl+Up/Down for blocks)
        if (!quickAddMode && !isAddBlockModalOpen && activeChapterTitle) {
            if (e.key === 'ArrowUp' && e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                if (selectedBlockIndex === null) {
                    const newIndex = activeChapterContent.length - 1;
                    setSelectedBlockIndex(newIndex);
                    scrollToBlock(newIndex);
                } else if (selectedBlockIndex > 0) {
                    const newIndex = selectedBlockIndex - 1;
                    setSelectedBlockIndex(newIndex);
                    scrollToBlock(newIndex);
                }
                setSelectedSubItemPath([]);
            }

            if (e.key === 'ArrowDown' && e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                if (selectedBlockIndex === null) {
                    setSelectedBlockIndex(0);
                    scrollToBlock(0);
                } else if (selectedBlockIndex < activeChapterContent.length - 1) {
                    const newIndex = selectedBlockIndex + 1;
                    setSelectedBlockIndex(newIndex);
                    scrollToBlock(newIndex);
                }
                setSelectedSubItemPath([]);
            }

            // Arrow key navigation within blocks (Up/Down for sub-items)
            if (selectedBlockIndex !== null && e.key === 'ArrowUp' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                const handled = navigateWithinBlock('up', selectedBlockIndex);
                if (!handled && selectedBlockIndex > 0) {
                    const newIndex = selectedBlockIndex - 1;
                    setSelectedBlockIndex(newIndex);
                    scrollToBlock(newIndex);
                    setSelectedSubItemPath([]);
                }
            }

            if (selectedBlockIndex !== null && e.key === 'ArrowDown' && !e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                const handled = navigateWithinBlock('down', selectedBlockIndex);
                if (!handled && selectedBlockIndex < activeChapterContent.length - 1) {
                    const newIndex = selectedBlockIndex + 1;
                    setSelectedBlockIndex(newIndex);
                    scrollToBlock(newIndex);
                    setSelectedSubItemPath([]);
                }
            }
        }
    }, [activeChapterTitle, saveChapter, selectedBlockIndex, activeChapterContent.length, isAddBlockModalOpen, quickAddMode, activeChapterContent, setSelectedSubItemPath]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Scroll to selected block
    const scrollToBlock = (blockIndex: number) => {
        const blockElement = document.querySelector(`[data-block-index="${blockIndex}"]`);
        if (blockElement) {
            blockElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    };

    // Enhanced navigation with sub-item support
    const navigateWithinBlock = (direction: 'up' | 'down', blockIndex: number): boolean => {
        const block = activeChapterContent[blockIndex];
        if (!block) return false;

        // For now, this is a simplified implementation
        // In a full implementation, this would track current sub-item selection
        // and navigate within lists, shop sections, etc.
        // The direction parameter will be used when implementing detailed sub-navigation
        console.log(`Navigation direction: ${direction}, block: ${blockIndex}`); // Future implementation

        // Future: selectedSubItemPath will track the current path within nested structures
        void selectedSubItemPath; // Acknowledge future usage

        // Handle different block types for internal navigation
        switch (block.type) {
            case 'instructionList':
                if ((block as any).items && (block as any).items.length > 0) {
                    // Could implement sub-item navigation here based on direction
                    // For now, return false to indicate no internal navigation happened
                    return false;
                }
                break;
            case 'shop':
                if ((block as any).sections && (block as any).sections.length > 0) {
                    // Could implement section navigation here based on direction
                    return false;
                }
                break;
            case 'encounters':
                if ((block as any).encounters && (block as any).encounters.length > 0) {
                    // Could implement encounter navigation here based on direction
                    return false;
                }
                break;
            case 'trial':
                if ((block as any).steps && (block as any).steps.length > 0) {
                    // Could implement step navigation here based on direction
                    return false;
                }
                break;
            default:
                // Block type doesn't support internal navigation
                return false;
        }
        return false;
    };

    const addTopLevelBlock = (blockType: string) => {
        let newBlock;

        switch (blockType) {
            case 'textParagraph':
                newBlock = {
                    type: 'textParagraph',
                    content: [{ type: 'plainText', text: 'New paragraph' }]
                };
                break;
            case 'instructionList':
                newBlock = {
                    type: 'instructionList',
                    items: []
                };
                break;
            case 'battle':
                newBlock = {
                    type: 'battle',
                    enemyName: 'New Enemy',
                    strategy: []
                };
                break;
            case 'image':
                newBlock = {
                    type: 'image',
                    path: ''
                };
                break;
            case 'conditional':
                newBlock = {
                    type: 'conditional',
                    conditionSource: 'textual_direct_choice',
                    winContent: [{ type: 'plainText', text: 'Content when condition is true' }],
                    lossContent: [{ type: 'plainText', text: 'Content when condition is false' }]
                };
                break;
            case 'shop':
                newBlock = {
                    type: 'shop',
                    gilInfo: 'Gil information',
                    sections: []
                };
                break;
            case 'sphereGrid':
                newBlock = {
                    type: 'sphereGrid',
                    characters: []
                };
                break;
            case 'sphereGridCharacterActions':
                newBlock = {
                    type: 'sphereGridCharacterActions',
                    character: 'Tidus',
                    actions: []
                };
                break;
            case 'encounters':
                newBlock = {
                    type: 'encounters',
                    area: 'New Area',
                    encounters: []
                };
                break;
            case 'trial':
                newBlock = {
                    type: 'trial',
                    steps: []
                };
                break;
            case 'blitzballGame':
                newBlock = {
                    type: 'blitzballGame',
                    strategy: []
                };
                break;
            case 'equip':
                newBlock = {
                    type: 'equip',
                    content: []
                };
                break;
            default:
                newBlock = {
                    type: 'textParagraph',
                    content: [{ type: 'plainText', text: 'New content' }]
                };
        }

        const newContent = [...activeChapterContent, newBlock];
        updateNode([], newContent);
        setIsAddBlockModalOpen(false);
        setSelectedBlockIndex(newContent.length - 1); // Select the newly added block
    };

    const removeTopLevelBlock = (index: number) => {
        const newContent = activeChapterContent.filter((_, i) => i !== index);
        updateNode([], newContent);
        setSelectedBlockIndex(null);
    };

    const moveBlockUp = (index: number) => {
        if (index <= 0) return;
        const newContent = [...activeChapterContent];
        [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
        updateNode([], newContent);
    };

    const moveBlockDown = (index: number) => {
        if (index >= activeChapterContent.length - 1) return;
        const newContent = [...activeChapterContent];
        [newContent[index], newContent[index + 1]] = [newContent[index + 1], newContent[index]];
        updateNode([], newContent);
    };

    const addSubItemToBlock = (blockIndex: number) => {
        const block = activeChapterContent[blockIndex];
        if (!block) return;

        switch (block.type) {
            case 'instructionList':
                addItemToInstructionList(blockIndex);
                break;
            case 'encounters':
                addEncounter(blockIndex);
                break;
            case 'shop':
                addShopItem(blockIndex);
                break;
            case 'sphereGrid':
                addSphereGridMove(blockIndex);
                break;
            case 'equip':
                addEquipChange(blockIndex);
                break;
            case 'conditional':
                addConditionalOption(blockIndex);
                break;
            case 'trial':
                addTrialStep(blockIndex);
                break;
            case 'blitzballGame':
                addBlitzballAction(blockIndex);
                break;
            default:
                // For blocks that don't have sub-items, do nothing
                break;
        }
    };

    const duplicateBlock = (blockIndex: number) => {
        const block = activeChapterContent[blockIndex];
        if (!block) return;

        const duplicatedBlock = { ...block };
        const newContent = [...activeChapterContent];
        newContent.splice(blockIndex + 1, 0, duplicatedBlock);
        updateNode([], newContent);
        setSelectedBlockIndex(blockIndex + 1);
    };

    // Helper functions for adding sub-items to different block types
    const addItemToInstructionList = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'instructionList') {
            if (!block.items) block.items = [];
            block.items.push({ type: 'plainText', text: 'New instruction' });
            updateNode([], newContent);
        }
    };

    const addEncounter = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'encounters') {
            if (!block.encounters) block.encounters = [];
            block.encounters.push({
                enemy: 'New Enemy',
                strategy: [{ type: 'plainText', text: 'Strategy' }]
            });
            updateNode([], newContent);
        }
    };

    const addShopItem = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'shop') {
            if (!block.sections) block.sections = [];
            block.sections.push({
                sectionName: 'New Section',
                items: []
            });
            updateNode([], newContent);
        }
    };

    const addSphereGridMove = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'sphereGrid') {
            if (!block.characters) block.characters = [];
            block.characters.push({
                character: 'Character',
                actions: []
            });
            updateNode([], newContent);
        }
    };

    const addEquipChange = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'equip') {
            if (!block.content) block.content = [];
            block.content.push({ type: 'plainText', text: 'New equipment change' });
            updateNode([], newContent);
        }
    };

    const addConditionalOption = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'conditional') {
            // Conditionals don't typically have sub-items, but we could add to win/loss content
            if (!block.winContent) block.winContent = [];
            block.winContent.push({ type: 'plainText', text: 'New win condition content' });
            updateNode([], newContent);
        }
    };

    const addTrialStep = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'trial') {
            if (!block.steps) block.steps = [];
            block.steps.push([{ type: 'plainText', text: 'New trial step' }]);
            updateNode([], newContent);
        }
    };

    const addBlitzballAction = (blockIndex: number) => {
        const newContent = [...activeChapterContent];
        const block = newContent[blockIndex] as any;
        if (block.type === 'blitzballGame') {
            if (!block.strategy) block.strategy = [];
            block.strategy.push({ type: 'plainText', text: 'New blitzball action' });
            updateNode([], newContent);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            backgroundColor: '#f8fafc',
            color: '#1e293b'
        }}>
            {/* Left Sidebar: Chapter Browser */}
            <aside style={{
                width: '280px',
                minWidth: '280px',
                borderRight: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#0f172a'
                    }}>
                        📖 Chapters
                    </h2>
                    <p style={{
                        margin: '4px 0 0',
                        fontSize: '13px',
                        color: '#64748b'
                    }}>
                        Select a chapter to edit
                    </p>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    <ChapterBrowser onSelectChapter={loadChapter} />
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                backgroundColor: '#ffffff'
            }}>
                <main style={{
                    flex: showJsonPreview ? '0 0 60%' : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    position: 'relative'
                }}>
                    {/* Top Toolbar */}
                    <header style={{
                        padding: '16px 24px',
                        borderBottom: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minHeight: '72px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h1 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#0f172a'
                            }}>
                                {activeChapterTitle || '📝 FFX Guide Editor'}
                            </h1>
                            {activeChapterTitle && (
                                <div style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    backgroundColor: '#f1f5f9',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    {activeChapterContent.length} blocks
                                </div>
                            )}
                        </div>

                        {activeChapterTitle && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {/* Quick Action Buttons */}
                                <div style={{ display: 'flex', gap: '6px', marginRight: '12px' }}>
                                    <button
                                        onClick={() => setQuickAddMode('content')}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: quickAddMode === 'content' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                            backgroundColor: quickAddMode === 'content' ? '#eff6ff' : '#ffffff',
                                            color: quickAddMode === 'content' ? '#3b82f6' : '#64748b',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '100px',
                                            justifyContent: 'center'
                                        }}
                                        title="Quick add content blocks (Ctrl+1)"
                                    >
                                        📝 Content <kbd style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>Ctrl+1</kbd>
                                    </button>
                                    <button
                                        onClick={() => setQuickAddMode('gameplay')}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: quickAddMode === 'gameplay' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                            backgroundColor: quickAddMode === 'gameplay' ? '#f3f4f6' : '#ffffff',
                                            color: quickAddMode === 'gameplay' ? '#8b5cf6' : '#64748b',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '110px',
                                            justifyContent: 'center'
                                        }}
                                        title="Quick add gameplay blocks (Ctrl+2)"
                                    >
                                        ⚔️ Gameplay <kbd style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>Ctrl+2</kbd>
                                    </button>
                                    <button
                                        onClick={() => setQuickAddMode('character')}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: quickAddMode === 'character' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                                            backgroundColor: quickAddMode === 'character' ? '#fffbeb' : '#ffffff',
                                            color: quickAddMode === 'character' ? '#f59e0b' : '#64748b',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '110px',
                                            justifyContent: 'center'
                                        }}
                                        title="Quick add character blocks (Ctrl+3)"
                                    >
                                        👤 Character <kbd style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>Ctrl+3</kbd>
                                    </button>
                                    <button
                                        onClick={() => setQuickAddMode('other')}
                                        style={{
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            border: quickAddMode === 'other' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                                            backgroundColor: quickAddMode === 'other' ? '#fef2f2' : '#ffffff',
                                            color: quickAddMode === 'other' ? '#ef4444' : '#64748b',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            minWidth: '90px',
                                            justifyContent: 'center'
                                        }}
                                        title="Quick add other blocks (Ctrl+4)"
                                    >
                                        🔧 Other <kbd style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>Ctrl+4</kbd>
                                    </button>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={saveChapter}
                                    disabled={isSaving}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: isSaving
                                            ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: isSaving ? '#9ca3af' : 'white',
                                        cursor: isSaving ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        minWidth: '140px',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        boxShadow: isSaving ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        transform: isSaving ? 'none' : 'translateY(-1px)'
                                    }}
                                    title="Save chapter to file (Ctrl+S)"
                                    onMouseEnter={(e) => !isSaving && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => !isSaving && (e.currentTarget.style.transform = 'translateY(-1px)')}
                                >
                                    {isSaving ? (
                                        <>
                                            <span style={{
                                                display: 'inline-block',
                                                width: '14px',
                                                height: '14px',
                                                border: '2px solid #d1d5db',
                                                borderTop: '2px solid #9ca3af',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></span>
                                            Saving Chapter...
                                        </>
                                    ) : (
                                        <>💾 Save Chapter</>
                                    )}
                                </button>

                                {/* Add Block Button */}
                                <button
                                    onClick={() => setIsAddBlockModalOpen(true)}
                                    style={{
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        transform: 'translateY(-1px)'
                                    }}
                                    title="Add new content block (Ctrl+Shift+A)"
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                >
                                    ➕ Add New Block
                                </button>

                                {/* JSON Preview Button */}
                                <button
                                    onClick={() => setShowJsonPreview(!showJsonPreview)}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '8px',
                                        border: showJsonPreview ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                                        background: showJsonPreview
                                            ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        color: showJsonPreview ? 'white' : '#374151',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: showJsonPreview
                                            ? '0 4px 6px -1px rgba(139, 92, 246, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                        transform: 'translateY(-1px)'
                                    }}
                                    title="Toggle live preview panel (F2 or Ctrl+J)"
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                >
                                    �️ {showJsonPreview ? 'Hide' : 'Show'} Preview
                                </button>
                            </div>
                        )}
                    </header>

                    {/* Status Messages */}
                    {(error || saveStatus) && (
                        <div style={{
                            padding: '12px 24px',
                            borderBottom: '1px solid #e2e8f0'
                        }}>
                            {error && (
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span>🚨</span>
                                    <strong>Error:</strong> {error}
                                </div>
                            )}
                            {saveStatus && (
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '8px',
                                    color: '#16a34a',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <span>✅</span>
                                    {saveStatus}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content Area - Split Layout */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden'
                    }}>
                        {/* Editor Panel */}
                        <div style={{
                            flex: showJsonPreview ? '1 1 60%' : '1 1 100%',
                            overflowY: 'auto',
                            padding: '24px',
                            transition: 'flex 0.3s ease'
                        }}>
                            {/* Loading State */}
                            {isLoading && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '200px',
                                    gap: '16px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        border: '3px solid #e2e8f0',
                                        borderTop: '3px solid #3b82f6',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    <p style={{ color: '#64748b', fontSize: '16px' }}>Loading Chapter...</p>
                                </div>
                            )}

                            {/* Chapter Content */}
                            {!isLoading && !error && activeChapterContent.length >= 0 && activeChapterTitle && (
                                <>
                                    {/* Compact Keyboard Shortcuts Help */}
                                    <div style={{
                                        marginBottom: '24px',
                                        padding: '16px 20px',
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        color: '#64748b',
                                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px'
                                        }}>
                                            <div style={{ fontWeight: '600', color: '#374151', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                ⌨️ Quick Reference
                                            </div>
                                            <button
                                                onClick={() => setShowKeyboardHelp(true)}
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #d1d5db',
                                                    backgroundColor: '#ffffff',
                                                    color: '#374151',
                                                    cursor: 'pointer',
                                                    fontSize: '11px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="View full keyboard shortcuts (F1)"
                                            >
                                                View All (F1)
                                            </button>
                                        </div>

                                        {/* Compact Grid Layout */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '12px 16px',
                                            maxWidth: '100%'
                                        }}>
                                            {/* Essential Shortcuts */}
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1f2937', fontSize: '13px' }}>Essential</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Save Chapter</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+S</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Add Block</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+A</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Help</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>F1</kbd>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Add Categories */}
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1f2937', fontSize: '13px' }}>Quick Add Categories</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>📝 Content</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+1</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>⚔️ Gameplay</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+2</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>👤 Character</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+3</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>🔧 Other</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+4</kbd>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Navigation */}
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1f2937', fontSize: '13px' }}>Navigation</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Navigate Blocks</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+↑/↓</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Move Block</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+↑/↓</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Delete Block</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+Del</kbd>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Most Common Direct Creates */}
                                            <div>
                                                <div style={{ fontWeight: '600', marginBottom: '6px', color: '#1f2937', fontSize: '13px' }}>Quick Creates</div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Text</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+T</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>List</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+L</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>Battle</span>
                                                        <kbd style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '10px', fontWeight: '600' }}>Ctrl+Shift+B</kbd>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>+ More...</span>
                                                        <kbd style={{ background: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: '500', color: '#64748b' }}>F1</kbd>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Blocks */}
                                    {activeChapterContent.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {activeChapterContent.map((node, index) => (
                                                <div
                                                    key={index}
                                                    data-block-index={index}
                                                    style={{
                                                        position: 'relative',
                                                        background: selectedBlockIndex === index
                                                            ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                                                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                                        border: selectedBlockIndex === index ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                        borderRadius: '16px',
                                                        padding: '24px',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        boxShadow: selectedBlockIndex === index
                                                            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(59, 130, 246, 0.05)'
                                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                        transform: selectedBlockIndex === index ? 'translateY(-2px)' : 'translateY(0)',
                                                        backdropFilter: 'blur(8px)'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedBlockIndex(index);
                                                        setSelectedSubItemPath([]);
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (selectedBlockIndex !== index) {
                                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                                            e.currentTarget.style.boxShadow = '0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (selectedBlockIndex !== index) {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                                        }
                                                    }}
                                                >
                                                    {/* Block Controls */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '16px',
                                                        right: '16px',
                                                        display: 'flex',
                                                        gap: '8px',
                                                        opacity: selectedBlockIndex === index ? 1 : 0.7,
                                                        transition: 'opacity 0.3s ease'
                                                    }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveBlockUp(index);
                                                            }}
                                                            disabled={index === 0}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: index === 0
                                                                    ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                                                                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                                                color: index === 0 ? '#9ca3af' : '#374151',
                                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '4px',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: index === 0 ? 'none' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                                                                backdropFilter: 'blur(8px)'
                                                            }}
                                                            title="Move block up (Ctrl+Shift+↑)"
                                                            onMouseEnter={(e) => {
                                                                if (index !== 0) {
                                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.15)';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (index !== 0) {
                                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                                    e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
                                                                }
                                                            }}
                                                        >
                                                            ↑ Up
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                moveBlockDown(index);
                                                            }}
                                                            disabled={index === activeChapterContent.length - 1}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: index === activeChapterContent.length - 1
                                                                    ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                                                                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                                                color: index === activeChapterContent.length - 1 ? '#9ca3af' : '#374151',
                                                                cursor: index === activeChapterContent.length - 1 ? 'not-allowed' : 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '4px',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: index === activeChapterContent.length - 1 ? 'none' : '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                                                                backdropFilter: 'blur(8px)'
                                                            }}
                                                            title="Move block down (Ctrl+Shift+↓)"
                                                            onMouseEnter={(e) => {
                                                                if (index !== activeChapterContent.length - 1) {
                                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.15)';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (index !== activeChapterContent.length - 1) {
                                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                                    e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
                                                                }
                                                            }}
                                                        >
                                                            ↓ Down
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeTopLevelBlock(index);
                                                            }}
                                                            style={{
                                                                padding: '8px 12px',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                fontSize: '12px',
                                                                fontWeight: '600',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                gap: '4px',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                            title="Delete this block (Ctrl+Shift+Delete)"
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(220, 38, 38, 0.4)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)';
                                                            }}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>

                                                    {/* Block Index */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '12px',
                                                        left: '12px',
                                                        backgroundColor: selectedBlockIndex === index ? '#3b82f6' : '#f1f5f9',
                                                        color: selectedBlockIndex === index ? 'white' : '#64748b',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        border: selectedBlockIndex === index ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        transition: 'all 0.3s ease'
                                                    }}>
                                                        {selectedBlockIndex === index && <span>📍</span>}
                                                        #{index + 1}
                                                    </div>

                                                    {/* Block Content */}
                                                    <div style={{ marginTop: '20px' }}>
                                                        <NodeRenderer
                                                            node={node}
                                                            path={[index]}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '60px 20px',
                                            backgroundColor: '#f8fafc',
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: '12px',
                                            margin: '20px 0'
                                        }}>
                                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                                            <h3 style={{
                                                margin: '0 0 8px 0',
                                                color: '#374151',
                                                fontSize: '20px',
                                                fontWeight: '600'
                                            }}>
                                                No blocks in this chapter
                                            </h3>
                                            <p style={{
                                                margin: '0 0 20px 0',
                                                color: '#64748b',
                                                fontSize: '16px'
                                            }}>
                                                Click "Add Block" to add your first block, or press <kbd style={{
                                                    background: '#fff',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #d1d5db',
                                                    fontSize: '14px'
                                                }}>Ctrl+Shift+A</kbd>
                                            </p>
                                            <button
                                                onClick={() => setIsAddBlockModalOpen(true)}
                                                style={{
                                                    padding: '12px 24px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #3b82f6',
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    transition: 'all 0.2s ease',
                                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                                }}
                                            >
                                                ➕ Add Your First Block
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Welcome Message */}
                            {!isLoading && !activeChapterTitle && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    maxWidth: '600px',
                                    margin: '40px auto'
                                }}>
                                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>📖</div>
                                    <h2 style={{
                                        margin: '0 0 16px 0',
                                        color: '#0f172a',
                                        fontSize: '32px',
                                        fontWeight: '700'
                                    }}>
                                        Welcome to FFX Guide Editor
                                    </h2>
                                    <p style={{
                                        margin: '0 0 32px 0',
                                        color: '#64748b',
                                        fontSize: '18px',
                                        lineHeight: '1.6'
                                    }}>
                                        Select a chapter from the sidebar to begin editing. Create, modify, and organize your Final Fantasy X speedrun guide with ease.
                                    </p>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '16px',
                                        marginTop: '32px'
                                    }}>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>Fast Editing</h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Keyboard shortcuts for efficient workflow</p>
                                        </div>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💾</div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>Auto-Save</h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Changes are automatically rebuilt</p>
                                        </div>
                                        <div style={{
                                            padding: '16px',
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>Precise Control</h4>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Rich content blocks for speedrun guides</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Add Overlay */}
                        {quickAddMode && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 999,
                                backdropFilter: 'blur(4px)'
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    width: '90%',
                                    maxWidth: '500px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    border: '1px solid #e2e8f0',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#6b7280'
                                    }}
                                        onClick={() => setQuickAddMode(null)}
                                    >
                                        ×
                                    </div>

                                    <div style={{
                                        textAlign: 'center',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{
                                            margin: '0 0 8px 0',
                                            fontSize: '24px',
                                            fontWeight: '700',
                                            background: quickAddMode === 'content' ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                                                quickAddMode === 'gameplay' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' :
                                                    quickAddMode === 'character' ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                                                        'linear-gradient(135deg, #ef4444, #dc2626)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            Quick Add {quickAddMode.charAt(0).toUpperCase() + quickAddMode.slice(1)}
                                        </h3>
                                        <p style={{
                                            margin: 0,
                                            color: '#64748b',
                                            fontSize: '14px'
                                        }}>
                                            Press 1-{blockTypes.find(cat => cat.category.toLowerCase() === quickAddMode)?.items.length || 0} or click to add
                                        </p>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        {blockTypes.find(cat => cat.category.toLowerCase() === quickAddMode)?.items.map((item, index) => (
                                            <button
                                                key={item.value}
                                                onClick={() => {
                                                    addTopLevelBlock(item.value);
                                                    setQuickAddMode(null);
                                                }}
                                                style={{
                                                    padding: '16px',
                                                    borderRadius: '12px',
                                                    border: '2px solid transparent',
                                                    background: quickAddMode === 'content' ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' :
                                                        quickAddMode === 'gameplay' ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' :
                                                            quickAddMode === 'character' ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' :
                                                                'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <span>{item.label}</span>
                                                <div style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: quickAddMode === 'content' ? '#3b82f6' :
                                                        quickAddMode === 'gameplay' ? '#8b5cf6' :
                                                            quickAddMode === 'character' ? '#f59e0b' :
                                                                '#ef4444',
                                                    border: '1px solid rgba(255, 255, 255, 0.5)'
                                                }}>
                                                    {index + 1}
                                                </div>
                                            </button>
                                        )) || []}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Add Block Modal */}
                        {isAddBlockModalOpen && (
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    width: '90%',
                                    maxWidth: '600px',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '24px'
                                    }}>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '20px',
                                            fontWeight: '600',
                                            color: '#0f172a'
                                        }}>
                                            ➕ Add New Block
                                        </h3>
                                        <button
                                            onClick={() => setIsAddBlockModalOpen(false)}
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '6px',
                                                border: '1px solid #d1d5db',
                                                backgroundColor: '#ffffff',
                                                color: '#374151',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {blockTypes.map((category) => (
                                            <div key={category.category}>
                                                <h4 style={{
                                                    margin: '0 0 12px 0',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#64748b',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    {category.category}
                                                </h4>
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: '8px'
                                                }}>
                                                    {category.items.map((item) => (
                                                        <button
                                                            key={item.value}
                                                            onClick={() => addTopLevelBlock(item.value)}
                                                            style={{
                                                                padding: '12px 16px',
                                                                borderRadius: '8px',
                                                                border: '1px solid #e2e8f0',
                                                                backgroundColor: '#ffffff',
                                                                color: '#374151',
                                                                cursor: 'pointer',
                                                                fontSize: '14px',
                                                                fontWeight: '500',
                                                                textAlign: 'left',
                                                                transition: 'all 0.2s ease',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                                                e.currentTarget.style.borderColor = '#3b82f6';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#ffffff';
                                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                            }}
                                                        >
                                                            <span>{item.label}</span>
                                                            <kbd style={{
                                                                background: '#f1f5f9',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #cbd5e1',
                                                                fontSize: '12px',
                                                                color: '#64748b'
                                                            }}>
                                                                {item.shortcut}
                                                            </kbd>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* JSON Preview Panel */}
                {showJsonPreview && (
                    <div style={{
                        flex: '0 0 40%',
                        borderLeft: '1px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f8fafc'
                    }}>
                        {/* JSON Panel Header */}
                        <div style={{
                            padding: '16px 24px',
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '72px',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#0f172a'
                                }}>
                                    �️ Live Preview
                                </h2>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#64748b',
                                    backgroundColor: '#f1f5f9',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    Main App View
                                </div>
                            </div>

                            <button
                                onClick={() => setShowJsonPreview(false)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    backgroundColor: '#ffffff',
                                    color: '#374151',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s ease'
                                }}
                                title="Close live preview (Esc)"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {/* App Preview Content */}
                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            backgroundColor: '#f8fafc'
                        }}>
                            <LivePreview
                                key={`${activeChapterTitle}-${activeChapterContent?.length || 0}`}
                                chapterContent={activeChapterContent || []}
                                chapterTitle={activeChapterTitle || 'Chapter'}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Keyboard Help Modal */}
            {showKeyboardHelp && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '32px',
                        maxWidth: '1000px',
                        width: '90vw',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            borderBottom: '2px solid #e2e8f0',
                            paddingBottom: '16px'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '24px',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>Keyboard Shortcuts</h2>
                            <button
                                onClick={() => setShowKeyboardHelp(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#64748b',
                                    padding: '4px'
                                }}
                            >×</button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '24px'
                        }}>
                            {/* General Shortcuts */}
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>General</h3>
                                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+S</kbd></span>
                                        <span>Save chapter</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>F1</kbd> / <kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+?</kbd></span>
                                        <span>Show/hide help</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Esc</kbd></span>
                                        <span>Close modals/deselect</span>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#1e293b' }}>Navigation</h3>
                                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+↑/↓</kbd></span>
                                        <span>Navigate blocks</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>↑/↓</kbd></span>
                                        <span>Navigate sub-items</span>
                                    </div>
                                </div>
                            </div>

                            {/* Block Management */}
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>Block Management</h3>
                                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+A</kbd></span>
                                        <span>Add block (modal)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+↑/↓</kbd></span>
                                        <span>Move block up/down</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+Del</kbd></span>
                                        <span>Delete selected block</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+D</kbd></span>
                                        <span>Duplicate block</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Enter</kbd></span>
                                        <span>Add sub-item</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+N</kbd></span>
                                        <span>Add sub-item (alternative)</span>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', marginTop: '20px', color: '#1e293b' }}>Quick Add Categories</h3>
                                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+1</kbd></span>
                                        <span>Quick add content (text, lists, images)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+2</kbd></span>
                                        <span>Quick add gameplay (battles, encounters, trials)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+3</kbd></span>
                                        <span>Quick add character (sphere grid, equipment)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+4</kbd></span>
                                        <span>Quick add other (shops, conditionals)</span>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                                        After activating quick add mode, press number keys (1-9) to select items from that category.
                                    </div>
                                </div>
                            </div>

                            {/* Direct Block Creation */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1e293b' }}>Direct Block Creation (Ctrl+Shift+Key)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '14px', lineHeight: '1.6' }}>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Content Blocks</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+T</kbd></span>
                                            <span>Text Paragraph</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+L</kbd></span>
                                            <span>Instruction List</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+I</kbd></span>
                                            <span>Image</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Gameplay Blocks</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+B</kbd></span>
                                            <span>Battle</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+E</kbd></span>
                                            <span>Encounters</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+R</kbd></span>
                                            <span>Trial</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+F</kbd></span>
                                            <span>Blitzball Game</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Character & Other</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+G</kbd></span>
                                            <span>Sphere Grid</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+Q</kbd></span>
                                            <span>Equipment</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+S</kbd></span>
                                            <span>Shop</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span><kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>Ctrl+Shift+C</kbd></span>
                                            <span>Conditional</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                                    Note: Ctrl+Shift+A is used for the Add Block modal. Character Actions block is only available via the modal or quick add mode.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};