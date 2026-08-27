import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Image as ImageIcon, 
  Minus, 
  FilePlus, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Sliders, 
  Layout, 
  Settings2, 
  Sparkles,
  Palette,
  Eye,
  Check,
  RefreshCw,
  Copy
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { PrivacyBadge } from '../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../components/common/ProcessingOverlay';
import { 
  DocumentSettings, 
  DocumentSection, 
  PageSize, 
  PageOrientation, 
  MarginSize, 
  PageTheme, 
  FontFamily 
} from '../types';
import { 
  generatePdfDocument, 
  downloadPdfBlob, 
  printPdfBlob, 
  PAGE_SIZES, 
  MARGIN_PRESETS 
} from '../services/pdfGeneratorService';
import { DOCUMENT_TEMPLATES } from '../data/templates';
import { useToast } from '../context/ToastContext';

export const GeneratorPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('blank-doc');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'settings' | 'templates'>('editor');
  const [mobileView, setMobileView] = useState<'editor' | 'preview' | 'settings'>('editor');

  // Initial State from Blank Template
  const [settings, setSettings] = useState<DocumentSettings>(DOCUMENT_TEMPLATES[4].settings);
  const [sections, setSections] = useState<DocumentSection[]>(DOCUMENT_TEMPLATES[4].sections);

  // Apply template
  const handleSelectTemplate = (templateId: string) => {
    const tpl = DOCUMENT_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setSelectedTemplateId(templateId);
      setSettings(JSON.parse(JSON.stringify(tpl.settings)));
      setSections(JSON.parse(JSON.stringify(tpl.sections)));
      success('Template Applied', `Loaded "${tpl.name}".`);
    }
  };

  // Add a new section block
  const handleAddSection = (type: DocumentSection['type']) => {
    const newId = 'sec-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    let defaultContent = '';
    let items: string[] | undefined = undefined;

    if (type === 'heading1') defaultContent = 'New Section Title';
    else if (type === 'heading2') defaultContent = 'Sub-heading Title';
    else if (type === 'heading3') defaultContent = 'Topic Title';
    else if (type === 'paragraph') defaultContent = 'Enter your text content here. You can customize font size, color, and alignment.';
    else if (type === 'bullet_list') items = ['First key point', 'Second key point', 'Third key point'];
    else if (type === 'numbered_list') items = ['First step', 'Second step', 'Third step'];
    else if (type === 'blockquote') defaultContent = 'A meaningful quote or prominent statement that captures the core idea.';
    else if (type === 'code') defaultContent = 'const documentEngine = new PragatiPdfEngine({\n  precision: "vector",\n  privacy: "client-side"\n});';
    else if (type === 'image') defaultContent = '';

    const newSection: DocumentSection = {
      id: newId,
      type,
      content: defaultContent,
      items,
      align: 'left',
      fontSize: type === 'heading1' ? 22 : type === 'heading2' ? 16 : type === 'heading3' ? 13 : settings.baseFontSize,
    };

    setSections((prev) => [...prev, newSection]);
  };

  // Update section content
  const handleUpdateSection = (id: string, updates: Partial<DocumentSection>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  // Remove section
  const handleRemoveSection = (id: string) => {
    if (sections.length <= 1) {
      info('Minimum Blocks', 'Document must have at least one block.');
      return;
    }
    setSections((prev) => prev.filter((sec) => sec.id !== id));
  };

  // Move section up/down
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
  };

  // Handle Image Upload
  const handleImageUpload = (sectionId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      handleUpdateSection(sectionId, { imageUrl: dataUrl, imageWidth: 80 });
      success('Image Inserted', 'Image embedded successfully.');
    };
    reader.readAsDataURL(file);
  };

  // Generate & Download PDF
  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generatePdfDocument(settings, sections);
      const filename = `${settings.title || 'document'}.pdf`.replace(/\s+/g, '_');
      downloadPdfBlob(pdfBytes, filename);
      success('PDF Generated', `Downloaded ${filename}`);
    } catch (err: any) {
      console.error(err);
      error('Generation Failed', err?.message || 'Could not generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Print PDF
  const handlePrintPdf = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generatePdfDocument(settings, sections);
      printPdfBlob(pdfBytes);
    } catch (err: any) {
      error('Print Error', err?.message || 'Could not prepare print.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 dark:bg-dark-bg">
      <SeoHead
        title="Online PDF Generator & Creator - Rich Vector Documents"
        description="Free, professional online PDF Generator. Create high-resolution vector PDFs from text and images with custom page sizes, margins, headers, and dynamic page numbering."
        keywords="PDF generator, online PDF creator, create PDF from text, make PDF online, free PDF builder, PDF editor"
        canonicalPath="/pdf-generator"
      />

      {isGenerating && <ProcessingOverlay message="Compiling Vector PDF..." submessage="Executing client-side layout calculation and embedding fonts" />}

      {/* Top Studio Action Bar */}
      <div className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-4 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Document Title Input */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              placeholder="Untitled Document"
              className="font-bold text-sm sm:text-base bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1 py-0.5 w-full max-w-sm truncate"
            />
          </div>

          {/* Template Quick Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedTemplateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="text-xs font-semibold bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DOCUMENT_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  Template: {t.name}
                </option>
              ))}
            </select>

            {/* Print */}
            <button
              onClick={handlePrintPdf}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover rounded-xl border border-slate-200 dark:border-dark-border transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface px-4 py-2 gap-2 text-xs font-semibold">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-1.5 rounded-lg ${mobileView === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          1. Edit Blocks
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-1.5 rounded-lg ${mobileView === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          2. Live Preview
        </button>
        <button
          onClick={() => setMobileView('settings')}
          className={`flex-1 py-1.5 rounded-lg ${mobileView === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
        >
          3. Settings
        </button>
      </div>

      {/* Main Studio Grid: 3-Column Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Section Blocks & Content Creator */}
        <div className={`lg:col-span-4 space-y-4 ${mobileView !== 'editor' ? 'hidden lg:block' : ''}`}>
          {/* Add Block Toolbar */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Add Document Element</span>
              <span className="text-[10px] font-normal text-slate-400">{sections.length} blocks</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => handleAddSection('heading1')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Heading1 className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Heading 1</span>
              </button>

              <button
                onClick={() => handleAddSection('heading2')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Heading2 className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Heading 2</span>
              </button>

              <button
                onClick={() => handleAddSection('paragraph')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Type className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Paragraph</span>
              </button>

              <button
                onClick={() => handleAddSection('bullet_list')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <List className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Bullet List</span>
              </button>

              <button
                onClick={() => handleAddSection('numbered_list')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Numbered</span>
              </button>

              <button
                onClick={() => handleAddSection('blockquote')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Quote className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Quote</span>
              </button>

              <button
                onClick={() => handleAddSection('code')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Code className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Code Box</span>
              </button>

              <button
                onClick={() => handleAddSection('image')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Image</span>
              </button>

              <button
                onClick={() => handleAddSection('divider')}
                className="p-2 rounded-xl border border-slate-200 dark:border-dark-border hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-dark-surface flex flex-col items-center gap-1 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Minus className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-medium">Divider</span>
              </button>
            </div>
          </div>

          {/* Section Blocks List */}
          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 shadow-sm space-y-2.5 transition-all"
              >
                {/* Block header */}
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-dark-border pb-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
                    <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{section.type.replace('_', ' ')}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Up/Down */}
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => handleRemoveSection(section.id)}
                      className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 ml-1"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Block Editor Controls & Input */}
                {section.type === 'divider' || section.type === 'page_break' ? (
                  <div className="text-center py-2 text-xs text-slate-400 italic">
                    — {section.type === 'divider' ? 'Horizontal Line' : 'Forced Page Break'} —
                  </div>
                ) : section.type === 'image' ? (
                  <div className="space-y-2">
                    {section.imageUrl ? (
                      <div className="space-y-2">
                        <img
                          src={section.imageUrl}
                          alt="Embedded preview"
                          className="max-h-40 rounded-lg border border-slate-200 dark:border-dark-border object-contain mx-auto"
                        />
                        <input
                          type="text"
                          placeholder="Optional image caption..."
                          value={section.imageCaption || ''}
                          onChange={(e) => handleUpdateSection(section.id, { imageCaption: e.target.value })}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface"
                        />
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl p-4 flex flex-col items-center gap-1 cursor-pointer hover:border-indigo-400 text-slate-500 text-xs">
                        <ImageIcon className="w-6 h-6 text-indigo-500" />
                        <span>Click to choose PNG or JPG</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleImageUpload(section.id, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                ) : section.type === 'bullet_list' || section.type === 'numbered_list' ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={(section.items || []).join('\n')}
                      onChange={(e) =>
                        handleUpdateSection(section.id, {
                          items: e.target.value.split('\n'),
                          content: e.target.value,
                        })
                      }
                      placeholder="One list item per line..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs">
                      {/* Alignment */}
                      <button
                        onClick={() => handleUpdateSection(section.id, { align: 'left' })}
                        className={`p-1 rounded ${section.align === 'left' || !section.align ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
                      >
                        <AlignLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateSection(section.id, { align: 'center' })}
                        className={`p-1 rounded ${section.align === 'center' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
                      >
                        <AlignCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateSection(section.id, { align: 'right' })}
                        className={`p-1 rounded ${section.align === 'right' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
                      >
                        <AlignRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                      {/* Bold / Italic */}
                      <button
                        onClick={() => handleUpdateSection(section.id, { bold: !section.bold })}
                        className={`p-1 rounded ${section.bold ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold' : 'text-slate-400'}`}
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdateSection(section.id, { italic: !section.italic })}
                        className={`p-1 rounded ${section.italic ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600' : 'text-slate-400'}`}
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={section.type === 'heading1' ? 2 : section.type === 'heading2' ? 2 : 4}
                      value={section.content}
                      onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                      placeholder="Write content..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Real-Time Live Document Preview */}
        <div className={`lg:col-span-5 flex flex-col items-center ${mobileView !== 'preview' ? 'hidden lg:flex' : ''}`}>
          <div className="w-full sticky top-36">
            <div className="text-center mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Interactive Document Preview
              </span>
            </div>

            {/* Document Canvas Render */}
            <div className="p-2 sm:p-4 rounded-2xl bg-slate-300/60 dark:bg-dark-surface border border-slate-200 dark:border-dark-border shadow-inner flex justify-center">
              <div
                className={`w-full max-w-md shadow-2xl rounded-sm transition-all duration-200 flex flex-col justify-between ${
                  settings.theme === 'warm'
                    ? 'bg-[#fbf9f4] text-slate-900'
                    : settings.theme === 'cream'
                    ? 'bg-[#fdf6e2] text-slate-900'
                    : settings.theme === 'dark'
                    ? 'bg-[#0f141c] text-slate-100'
                    : 'bg-white text-slate-900'
                } ${settings.theme === 'border' ? 'border-4 border-slate-300 dark:border-slate-700' : ''}`}
                style={{
                  minHeight: '520px',
                  padding: `${(settings.margins?.top || 54) / 3}px ${(settings.margins?.right || 54) / 3}px ${(settings.margins?.bottom || 54) / 3}px ${(settings.margins?.left || 54) / 3}px`,
                  fontFamily: settings.fontFamily === 'TimesRoman' ? 'serif' : settings.fontFamily === 'Courier' ? 'monospace' : 'sans-serif',
                }}
              >
                {/* Simulated Header */}
                {settings.headerText && (
                  <div className="text-[9px] text-slate-400 border-b border-slate-200/80 dark:border-slate-800 pb-1 mb-3">
                    {settings.headerText.replace('{{title}}', settings.title)}
                  </div>
                )}

                {/* Body Content */}
                <div className="space-y-3 text-xs leading-relaxed flex-1">
                  {sections.map((sec) => (
                    <div key={sec.id} style={{ textAlign: sec.align || 'left' }}>
                      {sec.type === 'heading1' && (
                        <h1 className="font-extrabold text-base text-slate-900 dark:text-white" style={{ color: sec.color }}>
                          {sec.content || 'Heading 1'}
                        </h1>
                      )}
                      {sec.type === 'heading2' && (
                        <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200" style={{ color: sec.color }}>
                          {sec.content || 'Heading 2'}
                        </h2>
                      )}
                      {sec.type === 'heading3' && (
                        <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300" style={{ color: sec.color }}>
                          {sec.content || 'Heading 3'}
                        </h3>
                      )}
                      {sec.type === 'paragraph' && (
                        <p className={`text-[11px] ${sec.bold ? 'font-bold' : ''} ${sec.italic ? 'italic' : ''}`} style={{ color: sec.color }}>
                          {sec.content || ''}
                        </p>
                      )}
                      {sec.type === 'bullet_list' && (
                        <ul className="list-disc list-inside text-[11px] space-y-0.5">
                          {(sec.items || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {sec.type === 'numbered_list' && (
                        <ol className="list-decimal list-inside text-[11px] space-y-0.5">
                          {(sec.items || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ol>
                      )}
                      {sec.type === 'blockquote' && (
                        <blockquote className="border-l-2 border-indigo-600 pl-2 text-[11px] italic text-slate-600 dark:text-slate-400">
                          {sec.content}
                        </blockquote>
                      )}
                      {sec.type === 'code' && (
                        <pre className="p-2 rounded bg-slate-100 dark:bg-slate-900 text-[10px] font-mono whitespace-pre-wrap overflow-x-auto">
                          {sec.content}
                        </pre>
                      )}
                      {sec.type === 'image' && sec.imageUrl && (
                        <div className="space-y-1">
                          <img
                            src={sec.imageUrl}
                            alt="preview"
                            className="max-h-36 rounded mx-auto object-contain"
                          />
                          {sec.imageCaption && (
                            <div className="text-[9px] italic text-slate-400 text-center">{sec.imageCaption}</div>
                          )}
                        </div>
                      )}
                      {sec.type === 'divider' && <hr className="border-slate-200 dark:border-slate-800 my-2" />}
                      {sec.type === 'page_break' && (
                        <div className="my-2 border-b border-dashed border-indigo-400/50 text-[9px] text-indigo-500 text-center">
                          — Page Break —
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Simulated Footer & Numbering */}
                <div className="border-t border-slate-200/80 dark:border-slate-800 pt-1.5 mt-4 flex items-center justify-between text-[9px] text-slate-400">
                  <span>{settings.footerText}</span>
                  {settings.showPageNumbers && <span>Page 1 of 1</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document & Page Settings */}
        <div className={`lg:col-span-3 space-y-4 ${mobileView !== 'settings' ? 'hidden lg:block' : ''}`}>
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-4 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Document Settings</span>
            </div>

            {/* Page Size */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Page Size</label>
              <select
                value={settings.pageSize}
                onChange={(e) => setSettings({ ...settings, pageSize: e.target.value as PageSize })}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white"
              >
                <option value="a4">ISO A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="a5">ISO A5 (148 × 210 mm)</option>
                <option value="legal">US Legal (8.5 × 14 in)</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, orientation: 'portrait' })}
                  className={`py-1.5 rounded-xl text-xs font-semibold border ${
                    settings.orientation === 'portrait'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Portrait
                </button>
                <button
                  onClick={() => setSettings({ ...settings, orientation: 'landscape' })}
                  className={`py-1.5 rounded-xl text-xs font-semibold border ${
                    settings.orientation === 'landscape'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-dark-surface border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Margins</label>
              <select
                value={settings.marginPreset}
                onChange={(e) => {
                  const preset = e.target.value as MarginSize;
                  setSettings({
                    ...settings,
                    marginPreset: preset,
                    margins: MARGIN_PRESETS[preset] || MARGIN_PRESETS.normal,
                  });
                }}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white"
              >
                <option value="normal">Normal (0.75 in)</option>
                <option value="compact">Compact (0.5 in)</option>
                <option value="wide">Wide (1.0 in)</option>
                <option value="none">Minimal (0.25 in)</option>
              </select>
            </div>

            {/* Paper Theme */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Paper Tone</label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'white' })}
                  className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                    settings.theme === 'white' ? 'border-indigo-600 font-bold bg-white text-slate-900' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border bg-white" />
                  <span>White</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'warm' })}
                  className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                    settings.theme === 'warm' ? 'border-indigo-600 font-bold bg-[#fbf9f4] text-slate-900' : 'border-slate-200 bg-[#fbf9f4] text-slate-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fbf9f4] border" />
                  <span>Warm</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'cream' })}
                  className={`p-1.5 rounded-lg border flex items-center justify-center gap-1 ${
                    settings.theme === 'cream' ? 'border-indigo-600 font-bold bg-[#fdf6e2] text-slate-900' : 'border-slate-200 bg-[#fdf6e2] text-slate-600'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fdf6e2] border" />
                  <span>Cream</span>
                </button>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value as FontFamily })}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white"
              >
                <option value="Helvetica">Helvetica / Clean Sans</option>
                <option value="TimesRoman">Times Roman / Serif</option>
                <option value="Courier">Courier / Monospace</option>
              </select>
            </div>

            {/* Headers & Footers */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-dark-border">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Running Header</label>
                <input
                  type="text"
                  placeholder="e.g. {{title}} • Confidential"
                  value={settings.headerText}
                  onChange={(e) => setSettings({ ...settings, headerText: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Running Footer</label>
                <input
                  type="text"
                  placeholder="e.g. {{date}} • Pragati Sahayak"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface"
                />
              </div>

              {/* Page Numbering Check */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Page Numbers</span>
                <input
                  type="checkbox"
                  checked={settings.showPageNumbers}
                  onChange={(e) => setSettings({ ...settings, showPageNumbers: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <PrivacyBadge variant="compact" />
        </div>
      </div>
    </div>
  );
};
