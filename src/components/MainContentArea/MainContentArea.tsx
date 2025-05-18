// src/components/MainContentArea/MainContentArea.tsx
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { useGlobalState, useGlobalDispatch } from '../../contexts/GlobalStateContext';
import { GlobalActionType } from '../../contexts/GlobalStateContext';
import type { ChapterContent, FormattedText } from '../../types';
import ContentRenderer from '../ContentRenderer/ContentRenderer';

const sectionTitleBannerStyle: React.CSSProperties = {
    backgroundColor: '#e9ecef', // A light grey, similar to Tracker header perhaps
    color: '#212529',           // Dark text
    padding: '12px 20px',       // Decent padding
    margin: '-20px -20px 20px -20px', // Negative margins to make it stretch full width of padded parent
    // Assumes parent has 20px padding. Adjust if different.
    fontSize: '1.8em',          // Prominent font size
    fontWeight: 'bold',
    borderBottom: '2px solid #ced4da', // A slightly darker border below
    borderTop: '1px solid #ced4da',    // Optional top border
    textAlign: 'left', // Or 'center' if you prefer
};

const MainContentArea: React.FC = () => {
    const { guideData, currentTopChapterId, renderedChapterIds, settings } = useGlobalState();
    const dispatch = useGlobalDispatch();

    const scrollableContainerRef = React.useRef<HTMLDivElement>(null);
    const chapterSectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // Function to assign refs
    const setChapterSectionRef = useCallback((id: string, element: HTMLElement | null) => { // <<< CORRECTED TYPE HERE
        chapterSectionRefs.current[id] = element;
    }, []);

    // Clear refs for chapters that are no longer rendered
    useEffect(() => {
        const currentRenderedIds = new Set(renderedChapterIds);
        Object.keys(chapterSectionRefs.current).forEach(id => {
            if (!currentRenderedIds.has(id)) {
                delete chapterSectionRefs.current[id];
            }
        });
    }, [renderedChapterIds]);

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

    useEffect(() => {
        if (currentTopChapterId && chapterSectionRefs.current[currentTopChapterId]) {
            // Check if the currentTopChapterId is the *last* item in renderedChapterIds.
            // This is a heuristic: if ToC was clicked, currentTopChapterId becomes the new "end"
            // of the initially rendered set.
            const isTocJump = renderedChapterIds.length > 0 && renderedChapterIds[renderedChapterIds.length - 1] === currentTopChapterId;

            if (isTocJump) {
                // console.log(`[MainContentArea] ToC Click or initial load: Scrolling section ${currentTopChapterId} into view.`);
                // Using 'auto' for behavior makes the jump instant, which is usually better for ToC clicks.
                // 'smooth' can be disorienting if jumping far.
                chapterSectionRefs.current[currentTopChapterId]?.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
            // If not a ToC jump (e.g., currentTopChapterId changed due to IntersectionObserver while scrolling),
            // we don't want to force a scroll, as the user is already controlling scroll position.
        }
    }, [currentTopChapterId, renderedChapterIds]); // Dependency on renderedChapterIds is important here

    const allPossibleSectionIdsInOrder = useMemo(() => {
        if (!guideData) return []; const ids: string[] = [];
        if (guideData.introduction) ids.push('introduction_section');
        if (guideData.chapters) ids.push(...guideData.chapters.map(c => c.id));
        if (guideData.acknowledgements) ids.push('acknowledgements_section');
        return ids;
    }, [guideData]);

    const handleScroll = useCallback(() => {
        const container = scrollableContainerRef.current;
        if (!container || !guideData || renderedChapterIds.length === 0) return;
        const threshold = 300;
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

    useEffect(() => {
        const scrollDiv = scrollableContainerRef.current;
        if (scrollDiv) {
            scrollDiv.addEventListener('scroll', handleScroll);
            return () => scrollDiv.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    useEffect(() => {
        const scrollRoot = scrollableContainerRef.current;
        if (!scrollRoot || renderedChapterIds.length === 0) return;

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
        const observerOptions: IntersectionObserverInit = {
            root: scrollRoot, rootMargin: '0px 0px -80% 0px', threshold: 0.01,
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const targetsToObserve: HTMLElement[] = []; // Ensure this is HTMLElement[]
        renderedChapterIds.forEach(id => {
            const elementToObserve = chapterSectionRefs.current[id]; // This is HTMLElement | null
            if (elementToObserve) {
                targetsToObserve.push(elementToObserve);
                observer.observe(elementToObserve);
            }
        });

        return () => {
            targetsToObserve.forEach(el => observer.unobserve(el));
            observer.disconnect();
        };
    }, [renderedChapterIds, dispatch, currentTopChapterId, settings.csrModeActive]);


    if (!guideData) { return <p style={{ padding: '20px', textAlign: 'center', color: '#555' }}>Guide data is not available.</p>; }
    if (renderedChapterIds.length === 0 && guideData) { return <p style={{ padding: '20px', textAlign: 'center', color: '#555' }}>Loading content or select from Table of Contents...</p>; }

    return (
        <div
            ref={scrollableContainerRef}
            style={{
                padding: '20px', // Keep this padding for content *below* the title banner
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
                        {section.title && (
                            <h1 style={sectionTitleBannerStyle}> {/* Apply new banner style */}
                                {section.title}
                            </h1>
                        )}
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