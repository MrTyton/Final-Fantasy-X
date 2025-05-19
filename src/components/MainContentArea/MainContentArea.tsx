// src/components/MainContentArea/MainContentArea.tsx
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';
import type { ChapterContent } from '../../types';
import ContentRenderer from '../ContentRenderer/ContentRenderer';

// Style for the section title banner at the top of each chapter/section
const sectionTitleBannerStyle: React.CSSProperties = {
    backgroundColor: '#e9ecef', // Light grey background for section banner
    color: '#212529',           // Dark text for contrast
    padding: '12px 20px',       // Padding for visual separation
    margin: '-20px -20px 20px -20px', // Negative margins to stretch banner full width of padded parent
    // Assumes parent has 20px padding. Adjust if different.
    fontSize: '1.8em',          // Prominent font size for section titles
    fontWeight: 'bold',
    borderBottom: '2px solid #ced4da', // Slightly darker border below
    borderTop: '1px solid #ced4da',    // Optional top border for separation
    textAlign: 'left', // Section titles are left-aligned by default
};

// MainContentArea is the central scrollable area that displays the main guide content.
// It manages dynamic loading of chapters, scroll-to-section, and intersection observer for ToC sync.
const MainContentArea: React.FC = () => {
    // Access global state for guide data, current chapter, rendered chapters, and settings
    const { guideData, currentTopChapterId, renderedChapterIds, settings } = useGlobalState();
    const dispatch = useGlobalDispatch();

    // Ref to the scrollable container div for main content
    const scrollableContainerRef = React.useRef<HTMLDivElement>(null);
    // Ref object to hold references to each chapter/section DOM element
    const chapterSectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Assigns a ref to a chapter section element for scroll and intersection observer logic
    const setChapterSectionRef = useCallback((id: string, element: HTMLElement | null) => {
        chapterSectionRefs.current[id] = element;
    }, []);

    // Clean up refs for chapters that are no longer rendered (e.g., after ToC jump or dynamic loading)
    useEffect(() => {
        const currentRenderedIds = new Set(renderedChapterIds);
        Object.keys(chapterSectionRefs.current).forEach(id => {
            if (!currentRenderedIds.has(id)) {
                delete chapterSectionRefs.current[id];
            }
        });
    }, [renderedChapterIds]);

    // Helper to get section data (title, content, id) for a given section id
    // Handles introduction, acknowledgements, and regular chapters
    const getSectionData = useCallback((id: string): { title: string; content: ChapterContent[]; id: string } | null => {
        if (!guideData) return null;
        if (id === 'introduction_section' && guideData.introduction) {
            return { id, title: 'Introduction', content: guideData.introduction };
        }
        if (id === 'acknowledgements_section' && guideData.acknowledgements) {
            const ackContent = guideData.acknowledgements.map(ft => ({ type: 'textParagraph', content: [ft] } as ChapterContent));
            return { id, title: 'Acknowledgements', content: ackContent };
        }
        const chapter = guideData.chapters?.find(c => c.id === id);
        if (chapter) { return { id: chapter.id, title: chapter.title, content: chapter.content }; }
        return null;
    }, [guideData]);

    // Scroll to the currentTopChapterId if it is the last in renderedChapterIds (i.e., ToC jump or initial load)
    useEffect(() => {
        if (currentTopChapterId && chapterSectionRefs.current[currentTopChapterId]) {
            // Heuristic: if ToC was clicked, currentTopChapterId becomes the new "end" of the rendered set
            const isTocJump = renderedChapterIds.length > 0 && renderedChapterIds[renderedChapterIds.length - 1] === currentTopChapterId;
            if (isTocJump) {
                // Use 'auto' for instant jump (better for ToC clicks)
                chapterSectionRefs.current[currentTopChapterId]?.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
            // If not a ToC jump (e.g., changed by IntersectionObserver), do not force scroll
        }
    }, [currentTopChapterId, renderedChapterIds]);

    // Compute the full list of possible section IDs in order (introduction, chapters, acknowledgements)
    const allPossibleSectionIdsInOrder = useMemo(() => {
        if (!guideData) return [];
        const ids: string[] = [];
        if (guideData.introduction) ids.push('introduction_section');
        if (guideData.chapters) ids.push(...guideData.chapters.map(c => c.id));
        if (guideData.acknowledgements) ids.push('acknowledgements_section');
        return ids;
    }, [guideData]);

    // Infinite scroll: when user nears the bottom, add the next chapter to renderedChapterIds
    const handleScroll = useCallback(() => {
        const container = scrollableContainerRef.current;
        if (!container || !guideData || renderedChapterIds.length === 0) return;
        const threshold = 300; // px from bottom to trigger loading
        const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
        if (nearBottom) {
            const lastRenderedId = renderedChapterIds[renderedChapterIds.length - 1];
            const currentIndexInAll = allPossibleSectionIdsInOrder.indexOf(lastRenderedId);
            if (currentIndexInAll !== -1 && currentIndexInAll < allPossibleSectionIdsInOrder.length - 1) {
                const nextSectionId = allPossibleSectionIdsInOrder[currentIndexInAll + 1];
                if (!renderedChapterIds.includes(nextSectionId)) {
                    dispatch({ type: GlobalActionType.ADD_RENDERED_CHAPTER, payload: nextSectionId });
                }
            }
        }
    }, [guideData, renderedChapterIds, allPossibleSectionIdsInOrder, dispatch]);

    // Attach/detach scroll event listener for infinite scroll
    useEffect(() => {
        const scrollDiv = scrollableContainerRef.current;
        if (scrollDiv) {
            scrollDiv.addEventListener('scroll', handleScroll);
            return () => scrollDiv.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // IntersectionObserver: update currentTopChapterId as user scrolls through sections
    useEffect(() => {
        const scrollRoot = scrollableContainerRef.current;
        if (!scrollRoot || renderedChapterIds.length === 0) return;

        // Callback for IntersectionObserver: finds the topmost visible section
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            let topVisibleEntry: IntersectionObserverEntry | null = null;
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if (!topVisibleEntry || entry.boundingClientRect.top < topVisibleEntry.boundingClientRect.top) {
                        topVisibleEntry = entry;
                    }
                }
            }
            if (topVisibleEntry) {
                const chapterId = topVisibleEntry.target.getAttribute('data-chapter-id');
                if (chapterId && chapterId !== currentTopChapterId) {
                    dispatch({ type: GlobalActionType.SET_CURRENT_CHAPTER, payload: chapterId });
                }
            }
        };
        // Observer options: root is the scrollable div, rootMargin to trigger early, threshold for minimal intersection
        const observerOptions: IntersectionObserverInit = {
            root: scrollRoot, rootMargin: '0px 0px -80% 0px', threshold: 0.01,
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all currently rendered chapter section elements
        const targetsToObserve: HTMLElement[] = [];
        renderedChapterIds.forEach(id => {
            const elementToObserve = chapterSectionRefs.current[id];
            if (elementToObserve) {
                targetsToObserve.push(elementToObserve);
                observer.observe(elementToObserve);
            }
        });

        // Cleanup: unobserve all and disconnect observer
        return () => {
            targetsToObserve.forEach(el => observer.unobserve(el));
            observer.disconnect();
        };
    }, [renderedChapterIds, dispatch, currentTopChapterId, settings.csrModeActive]);

    // Fallback UI if guide data is not loaded or no chapters are rendered
    if (!guideData) {
        return <p style={{ padding: '20px', textAlign: 'center', color: '#555' }}>Guide data is not available.</p>;
    }
    if (renderedChapterIds.length === 0 && guideData) {
        return <p style={{ padding: '20px', textAlign: 'center', color: '#555' }}>Loading content or select from Table of Contents...</p>;
    }

    // Render the main content area, including all currently rendered chapters/sections
    return (
        <div
            ref={scrollableContainerRef}
            style={{
                padding: '20px', // Padding for content below the title banner
                height: '100%',
                overflowY: 'auto',
                boxSizing: 'border-box',
            }}
        >
            {renderedChapterIds.map(id => {
                const section = getSectionData(id);
                if (!section) return null;
                const sectionScopeKey = `section_${id}_level0`;

                return (
                    <section
                        key={id}
                        id={`section-${id}`}
                        ref={element => setChapterSectionRef(id, element)}
                        data-chapter-id={id}
                        // Remove bottom margin from section if title banner provides enough separation
                        style={{ marginBottom: '20px', outline: settings.showConditionalBorders ? '1px dotted purple' : 'none' }}
                    >
                        {/* Section title banner, always shown if present */}
                        {section.title && (
                            <h1 style={sectionTitleBannerStyle}>
                                {section.title}
                            </h1>
                        )}
                        {/* Render the content for this section using ContentRenderer */}
                        <ContentRenderer
                            contentItems={section.content}
                            currentScopeKey={sectionScopeKey}
                        />
                    </section>
                );
            })}
        </div>
    );
};

export default MainContentArea;