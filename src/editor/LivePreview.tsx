// src/editor/LivePreview.tsx
import React from 'react';
import ContentRenderer from '../components/ContentRenderer/ContentRenderer';
import { GlobalStateProvider } from '../contexts/GlobalStateContext';
import { ListNumberingProvider } from '../contexts/ListNumberingContext';
import type { Chapter } from '../types';

interface LivePreviewProps {
    chapterContent: Chapter['content'];
    chapterTitle: string;
}

// Live preview component that shows the actual rendered guide content as users would see it
export const LivePreview: React.FC<LivePreviewProps> = ({ chapterContent, chapterTitle }) => {
    console.log('LivePreview rendered with:', {
        chapterTitle,
        chapterContentLength: chapterContent?.length || 0,
        chapterContent: chapterContent
    });

    if (!chapterContent || chapterContent.length === 0) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#64748b',
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                margin: '20px'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No Content</h3>
                <p style={{ margin: 0 }}>Start adding content blocks to see the live preview.</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            minHeight: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            lineHeight: '1.6',
            color: '#1e293b'
        }}>
            {/* Chapter Title Banner - matching the actual app style */}
            <div style={{
                backgroundColor: '#e9ecef',
                color: '#212529',
                padding: '12px 20px',
                margin: '-20px -20px 20px -20px',
                fontSize: '1.8em',
                fontWeight: 'bold',
                borderBottom: '2px solid #ced4da',
                borderTop: '1px solid #ced4da',
                textAlign: 'left'
            }}>
                {chapterTitle}
            </div>

            {/* Chapter Content - rendered exactly as it appears in the main app */}
            <div style={{
                fontSize: '16px',
                lineHeight: '1.7'
            }}>
                <GlobalStateProvider>
                    <ListNumberingProvider>
                        <ContentRenderer
                            contentItems={chapterContent}
                            currentScopeKey={`preview-${chapterTitle}`}
                        />
                    </ListNumberingProvider>
                </GlobalStateProvider>
            </div>
        </div>
    );
};
