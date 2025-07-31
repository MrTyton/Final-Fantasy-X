// src/editor/SimplePreview.tsx
import React from 'react';
import { NodeRenderer } from './NodeRenderer';
import type { Chapter } from '../types';

interface SimplePreviewProps {
    chapterContent: Chapter['content'];
    chapterTitle: string;
}

// Simple preview component that just shows the chapter content with proper styling
export const SimplePreview: React.FC<SimplePreviewProps> = ({ chapterContent, chapterTitle }) => {
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
                <p style={{ margin: 0 }}>Start adding content blocks to see the preview.</p>
            </div>
        );
    }

    return (
        <div style={{
            padding: '24px',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            minHeight: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            lineHeight: '1.6',
            color: '#1e293b'
        }}>
            {/* Chapter Title */}
            <header style={{
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e2e8f0'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#0f172a',
                    textAlign: 'center'
                }}>
                    {chapterTitle}
                </h1>
            </header>

            {/* Chapter Content */}
            <main style={{
                fontSize: '16px',
                lineHeight: '1.7'
            }}>
                {chapterContent.map((block, index) => (
                    <div key={index} style={{ marginBottom: '24px' }}>
                        <NodeRenderer
                            node={block}
                            path={[index]}
                        />
                    </div>
                ))}
            </main>
        </div>
    );
};
