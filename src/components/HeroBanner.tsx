import React from 'react';
import { 
  Sparkles, 
  Send, 
  Upload, 
  Database, 
  CheckCircle2, 
  HardDrive,
  RefreshCw
} from 'lucide-react';

interface HeroBannerProps {
  lessonCount: number;
  onOpenAddModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lessonCount,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-4 mb-5">
      {/* 1. Cinematic Hero Banner with Open Quran & Warm Lantern Glow */}
      <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/35 shadow-2xl bg-[#0a0e0c]">
        {/* Quran Background Image */}
        <div className="relative h-44 sm:h-52 md:h-64 w-full">
          <img
            src="/src/assets/images/habesha_quran_hero_1793374625650.jpg"
            alt="Habesha Islamic Academy Quran"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layer Dark & Gold Vignette Gradients for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d0b] via-[#090d0b]/75 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d0b]/90 via-[#090d0b]/50 to-transparent" />
        </div>

        {/* Text Overlay content */}
        <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end text-left z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0e0c]/80 backdrop-blur-md border border-[#d4af37]/40 text-[11px] sm:text-xs text-[#f5d97e] font-semibold w-fit mb-2 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-ethiopic">ትክክለኛ ኢስላማዊ እውቀት • ጥልቅ ግንዛቤ</span>
            <span className="text-[#d4af37] hidden sm:inline">•</span>
            <span className="font-amiri text-xs text-[#d4af37] hidden sm:inline">طلب العلم فريضة</span>
          </div>

          {/* Academy Main Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-ethiopic text-white tracking-wide drop-shadow-md">
            ሐበሻ የኢስላማዊ ትምህርት አካዳሚ
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#cbd4ce] max-w-2xl mt-1 leading-relaxed font-ethiopic drop-shadow">
            የቪዲዮና የድምፅ ትምህርቶችን (MP3) ያዳምጡ፤ የተሟላ የPDF ጥናት መጽሐፍትን በቀጥታ ያንብቡ እና ያውርዱ።
          </p>
        </div>
      </div>

      {/* 2. System Status & Quick Action Card (Replacing Google Sheet banner!) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#0e1712] via-[#0f1411] to-[#0c100e] border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              የሐበሻ ሎካል ማከማቻ ዝግጁ ነው (OFFLINE & LOCAL STORAGE)
            </span>
            <span className="text-xs text-[#8c978f] hidden sm:inline">•</span>
            <span className="text-xs font-mono text-[#f5d97e] bg-[#141d17] px-2 py-0.5 rounded-md border border-[#d4af37]/20">
              {lessonCount} ትምህርቶች
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-[#f5f7f5] font-ethiopic">
            የትምህርት ርዕሶች፣ የድምፅ (MP3)፣ የቪዲዮ እና የPDF ሰነዶች ማዕከል
          </h3>

          <p className="text-xs text-[#8a968e] font-ethiopic flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>በስልክዎ/ኮምፒውተርዎ ላይ ብቻ የሚቀመጥ ራሱን የቻለ መድረክ • ምንም የውጭ Google Sheet ጥገኝነት የሌለው</span>
          </p>
        </div>

        {/* Action Buttons: Yellow Add Lesson + Cyan Telegram */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Upload className="w-3.5 h-3.5 text-black" />
            <span>+ አዲስ ትምህርት ጫን</span>
          </button>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#70c7f7] border border-[#229ED9]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9]" />
            <span>ቴሌግራም</span>
          </a>
        </div>
      </div>
    </div>
  );
};
