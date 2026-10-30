import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Maximize2, 
  Upload, 
  Trash2, 
  Search, 
  X,
  BookOpen
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { UniversalDocumentViewerModal } from './UniversalDocumentViewerModal';

interface DocumentCenterViewProps {
  lessons: Lesson[];
  onOpenAddModal: () => void;
  onOpenLessonDetail: (lesson: Lesson) => void;
  onDeleteLesson?: (id: string) => void;
}

export const DocumentCenterView: React.FC<DocumentCenterViewProps> = ({
  lessons,
  onOpenAddModal,
  onOpenLessonDetail,
  onDeleteLesson,
}) => {
  const [selectedPdfLesson, setSelectedPdfLesson] = useState<Lesson | null>(null);
  const [docSearch, setDocSearch] = useState<string>('');

  const pdfLessons = lessons.filter((l) => l.pdf && l.pdf.url);

  const filteredPdfs = pdfLessons.filter((l) => {
    if (!docSearch.trim()) return true;
    const q = docSearch.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.pdf?.fileName?.toLowerCase().includes(q) ||
      l.category?.toLowerCase().includes(q) ||
      String(l.lessonNumber) === q
    );
  });

  const handleDownload = (lesson: Lesson) => {
    if (!lesson.pdf?.url) return;
    const a = document.createElement('a');
    a.href = lesson.pdf.url;
    a.download = lesson.pdf.fileName || `Habesha_Lesson_${lesson.lessonNumber}_Kitab.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Fullscreen Viewer Sub-modal */}
      {selectedPdfLesson && selectedPdfLesson.pdf && (
        <UniversalDocumentViewerModal
          pdf={selectedPdfLesson.pdf}
          lessonTitle={selectedPdfLesson.title}
          onClose={() => setSelectedPdfLesson(null)}
        />
      )}

      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c110e] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5d97e]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-[#f7e29c] font-ethiopic">
              የሰነዶችና የኪታቦች ማዕከል (Universal Document Center)
            </h2>
          </div>
          <p className="text-xs text-[#8c978f] mt-1 font-ethiopic">
            የትምህርት ማመሳከሪያዎችን፣ የፊቅህና የዓቂዳ ኪታቦችን በPDF ያንብቡ፤ በቀላሉ ያውርዱ ወይም ያስተዳድሩ።
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#141d17] text-emerald-400 border border-emerald-500/30 font-mono">
            {pdfLessons.length} ሰነዶች
          </span>

          <button
            onClick={onOpenAddModal}
            className="gold-gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ PDF ጫን</span>
          </button>
        </div>
      </div>

      {/* Search Input for Documents if documents exist */}
      {pdfLessons.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/70" />
          <input
            type="text"
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
            placeholder="የሰነዶችን ርዕስ፣ የኪታብ ስም ወይም ቁጥር ይፈልጉ..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#79857d] focus:outline-none focus:border-[#d4af37]"
          />
          {docSearch && (
            <button
              onClick={() => setDocSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a0a8a2] hover:text-[#f5d97e] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* List of PDFs or Empty State */}
      {pdfLessons.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto px-4 bg-[#0a0e0c] rounded-2xl border border-[#d4af37]/20 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#141c16] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#f5f7f5] font-ethiopic">
            ምንም የተጫነ የPDF ኪታብ የለም (100% ንፁህ)
          </h3>
          <p className="text-xs text-[#869189] font-ethiopic">
            አዲስ ደርስ ሲጭኑ የ PDF ማመሳከሪያ ሰነድ በማያያዝ እዚህ ማንበብ፣ ማውረድና ማስተዳደር ይችላሉ።
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAddModal}
              className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>የመጀመሪያውን ሰነድ ጫን</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredPdfs.map((lesson) => (
            <div
              key={lesson.id}
              className="p-4 rounded-xl bg-[#0c100e] border border-[#d4af37]/25 hover:border-[#d4af37]/50 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#f5d97e] font-bold">
                    ትምህርት {lesson.lessonNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#131b16] text-[#a0aaa2] border border-white/5">
                    {lesson.category || 'ኪታብ'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#f2f4f2] leading-snug font-ethiopic">
                  {lesson.title}
                </h4>

                {lesson.pdf?.fileName && (
                  <p className="text-xs text-[#d4af37] mt-1 font-mono truncate">
                    📄 {lesson.pdf.fileName}
                  </p>
                )}
              </div>

              {/* Action Buttons: Read, Download, Delete */}
              <div className="pt-3 mt-3 border-t border-[#d4af37]/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedPdfLesson(lesson)}
                  className="px-3 py-1.5 rounded-lg bg-[#18211b] hover:bg-[#222d25] text-xs text-[#f5d97e] border border-[#d4af37]/30 flex items-center gap-1.5 font-medium transition"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>በሙሉ ስክሪን ክፈት</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(lesson)}
                    className="p-2 rounded-lg bg-[#18211b] hover:bg-[#222d25] text-[#cbd4ce] hover:text-[#f5d97e] border border-white/5 transition"
                    title="PDF አውርድ"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {onDeleteLesson && (
                    <button
                      onClick={() => onDeleteLesson(lesson.id)}
                      className="p-2 rounded-lg bg-[#18211b] hover:bg-rose-950/40 text-[#7e8781] hover:text-rose-400 border border-white/5 transition"
                      title="ሰርዝ (Delete)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
