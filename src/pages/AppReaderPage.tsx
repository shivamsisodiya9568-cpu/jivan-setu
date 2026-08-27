import React from 'react';
import { PdfUploader } from '../components/uploader/PdfUploader';
import { PdfCanvasViewer } from '../components/reader/PdfCanvasViewer';
import { TextReaderPane } from '../components/reader/TextReaderPane';
import { AudiobookView } from '../components/reader/AudiobookView';
import { AudioPlayerBar } from '../components/player/AudioPlayerBar';
import { AiAssistantDrawer } from '../components/assistant/AiAssistantDrawer';
import { SeoHead } from '../components/common/SeoHead';
import { useReadTriangle } from '../context/ReadTriangleContext';

export const AppReaderPage: React.FC = () => {
  const { documentState, playback } = useReadTriangle();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-bg flex flex-col transition-colors pb-24">
      <SeoHead
        title="Studio Reader Workspace"
        description="Read & Listen to your uploaded PDF document with natural neural AI speech, sentence highlighting, and page synchronization."
        canonicalUrl="https://readtriangle.com/app"
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* If no document uploaded, show uploader box */}
        {!documentState.file ? (
          <div className="max-w-3xl mx-auto py-12 space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ReadTriangle Studio Reader
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upload your PDF to begin natural voice playback and reading.
              </p>
            </div>
            <PdfUploader />
          </div>
        ) : (
          /* Reader Workspace Layout */
          <div className="space-y-4">
            
            {/* Top Document Summary Status Banner */}
            <PdfUploader />

            {/* Split Panel View depending on Reading Mode */}
            <div className="h-[75vh] min-h-[500px]">
              {playback.mode === 'pdf' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                  <PdfCanvasViewer />
                  <TextReaderPane />
                </div>
              ) : playback.mode === 'text' ? (
                <div className="h-full max-w-4xl mx-auto">
                  <TextReaderPane />
                </div>
              ) : (
                <div className="h-full max-w-4xl mx-auto">
                  <AudiobookView />
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Sticky Bottom Audio Player Bar */}
      <AudioPlayerBar />

      {/* Slide-over AI Assistant Drawer */}
      <AiAssistantDrawer />
    </div>
  );
};
