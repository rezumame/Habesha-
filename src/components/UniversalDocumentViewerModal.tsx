import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  FileText 
} from 'lucide-react';
import { MediaSource } from '../types/lesson';
import { useLanguage } from '../context/LanguageContext';

interface UniversalDocumentViewerModalProps {
  pdf: MediaSource | null;
  lessonTitle: string;
  onClose: () => void;
}

export const UniversalDocumentViewerModal: React.FC<UniversalDocumentViewerModalProps> = ({
  pdf,
  lessonTitle,
  onClose,
}) => {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState<number>(100);

  if (!pdf || !pdf.url) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.fileName || `${lessonTitle.replace(/\s+/g, '_')}_Document.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    window.open(pdf.url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#0c100e] border border-[#d4af37]/35 rounded-2xl shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#111713] border-b border-[#d4af37]/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5d97e]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-[#f2efe9] truncate">
                {pdf.fileName || lessonTitle}
              </h3>
              <p className="text-xs text-[#959e97] truncate">
                {lessonTitle} • PDF Document
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-[#18211b] px-2 py-1 rounded-lg border border-[#d4af37]/20 text-xs">
              <button
                onClick={() => setZoom(Math.max(60, zoom - 15))}
                title="Zoom Out"
                className="p-1 hover:text-[#f5d97e] text-[#a0aaa2]"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-[#d4af37] font-mono text-[11px]">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(180, zoom + 15))}
                title="Zoom In"
                className="p-1 hover:text-[#f5d97e] text-[#a0aaa2]"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Open in New Window */}
            <button
              onClick={handleOpenNewTab}
              title="Open in new window"
              className="p-2 rounded-lg bg-[#18211b] hover:bg-[#202b24] text-[#c4cbc6] hover:text-[#f5d97e] border border-[#d4af37]/20 transition hidden sm:flex items-center gap-1 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Open Tab</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="gold-gradient-btn px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadPdf}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#18211b] hover:bg-rose-950/40 text-[#a0aaa2] hover:text-rose-400 border border-[#d4af37]/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewing Area */}
        <div className="flex-grow bg-[#090b0a] overflow-auto flex items-center justify-center p-2 relative">
          <div 
            className="w-full h-full transition-transform duration-150 origin-top flex items-center justify-center"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <object
              data={pdf.url}
              type="application/pdf"
              className="w-full h-full rounded-lg shadow-xl border border-white/5 bg-neutral-900"
            >
              {/* Fallback if browser doesn't natively render PDF in object tag */}
              <iframe
                src={`${pdf.url}#view=FitH`}
                className="w-full h-full rounded-lg border-0"
                title="PDF Document"
              >
                <div className="flex flex-col items-center justify-center p-8 text-center text-[#c2c8c4]">
                  <FileText className="w-16 h-16 text-[#d4af37] mb-3" />
                  <p className="text-base font-semibold mb-2">
                    {pdf.fileName || 'PDF Document'}
                  </p>
                  <p className="text-xs text-[#828c85] mb-4">
                    Click below to open or download the document directly.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="gold-gradient-btn px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPdf}</span>
                  </button>
                </div>
              </iframe>
            </object>
          </div>
        </div>
      </div>
    </div>
  );
};
