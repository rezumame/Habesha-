import React from 'react';
import { 
  Upload, 
  Video, 
  Music, 
  FileText, 
  Sparkles, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EmptyStateProps {
  onOpenAddModal: () => void;
  isSearchActive?: boolean;
  onClearSearch?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenAddModal,
  isSearchActive = false,
  onClearSearch,
}) => {
  const { t } = useLanguage();

  if (isSearchActive) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-[#131b16] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
          🔍
        </div>
        <h3 className="text-lg font-bold text-[#f5f7f5] mb-1">
          ምንም የተገኘ ትምህርት የለም
        </h3>
        <p className="text-xs text-[#8a958e] mb-4">
          የተለየ የፍለጋ ቃል ይሞክሩ ወይም ፍለጋውን ያጽዱ።
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-4 py-2 rounded-xl bg-[#18211b] hover:bg-[#222c24] text-xs text-[#f5d97e] border border-[#d4af37]/30 transition"
          >
            ፍለጋውን አጽዳ (Clear Search)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 px-4 max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
      {/* Decorative Gold Crescent/Star Medallion */}
      <div className="relative inline-block">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a231d] via-[#101612] to-[#070a08] border-2 border-[#d4af37]/50 flex items-center justify-center mx-auto shadow-2xl shadow-[#d4af37]/20 group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-10 h-10 text-[#d4af37]">
            <path d="M12 2L14.8 6.5L20 6.8L16.5 10.7L17.8 15.8L12 13.5L6.2 15.8L7.5 10.7L4 6.8L9.2 6.5L12 2Z" fill="rgba(212, 175, 55, 0.25)" />
            <circle cx="12" cy="12" r="3" fill="#d4af37" />
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-[#d4af37]/20 blur-md -z-10" />
      </div>

      {/* Main Messaging */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-xs text-[#f5d97e] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>100% ንፁህ አዲስ መተግበሪያ (Clean Slate)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-cinzel text-[#f7e29c] tracking-wide">
          {t.noLessonsTitle}
        </h2>
        <p className="text-xs md:text-sm text-[#a3aca5] max-w-lg mx-auto leading-relaxed font-ethiopic">
          ምንም አይነት የሙከራ ድምፅ፣ ቪዲዮ ወይም ፋይል አልተጫነበትም። ምንም አይነት Google Sheet ወይም የውጭ ጥገኝነት የለውም፤ ሁሉም ዳታዎ በራስዎ ስልክ/ኮምፒውተር በከፍተኛ ጥንቃቄ በ IndexedDB ይቀመጣል።
        </p>
      </div>

      {/* Feature Capabilities Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-xl bg-[#0f1411] border border-[#d4af37]/25 space-y-1.5 hover:border-[#d4af37]/50 transition shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Video className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#f5f7f5]">
            የቪዲዮ ትምህርት (Video)
          </h4>
          <p className="text-[11px] text-[#869189]">
            የራስዎን MP4/WebM ቪዲዮ ፋይሎች ይጫኑ ወይም የ YouTube ስትሪም ሊንክ ያያይዙ።
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1411] border border-[#d4af37]/25 space-y-1.5 hover:border-[#d4af37]/50 transition shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <Music className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#f5f7f5]">
            የድምፅ ትምህርት (MP3 Audio)
          </h4>
          <p className="text-[11px] text-[#869189]">
            የ MP3 ድምፅ ፋይሎችን ይጫኑ፤ ተማሪዎች በቀጥታ እንዲያደምጡና በስልካቸው እንዲያወርዱ (Download) ያድርጉ።
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0f1411] border border-[#d4af37]/25 space-y-1.5 hover:border-[#d4af37]/50 transition shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
            <FileText className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-[#f5f7f5]">
            የማመሳከሪያ ኪታብ (PDF)
          </h4>
          <p className="text-[11px] text-[#869189]">
            የተለያዩ PDF ኪታቦችን አያይዘው በመተግበሪያው ውስጥ በሙሉ ስክሪን አንባቢ የማንበብና የማውረድ ሁለገብ ድጋፍ።
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          onClick={onOpenAddModal}
          className="gold-gradient-btn px-7 py-3.5 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2.5 mx-auto cursor-pointer shadow-xl shadow-[#d4af37]/25 hover:scale-105 active:scale-95 transition"
        >
          <Upload className="w-5 h-5 text-black" />
          <span className="font-ethiopic">{t.uploadFirstLesson}</span>
        </button>
      </div>
    </div>
  );
};
