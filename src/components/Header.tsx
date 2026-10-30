import React from 'react';
import { 
  Plus, 
  Send, 
  Globe, 
  FileText, 
  Headphones, 
  HardDrive, 
  Layers, 
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../types/lesson';

export type MainNavTab = 'lessons' | 'documents' | 'audio' | 'offline' | 'structure';

interface HeaderProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenAddModal: () => void;
  onOpenFeedback: () => void;
  lessonCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenFeedback,
  lessonCount,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'am', label: 'አማርኛ' },
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080b09]/98 backdrop-blur-md border-b border-[#d4af37]/25 shadow-lg">
      {/* 
        Top Horizontal Bar exactly matching the user's reference photo:
        [Logo: ሐበሻ] [የትምህርቶች ማውጫ] [የሰነዶች ማዕከል] [የድምፅ ትምህርቶች (MP3)] [ከመስመር ውጭ (Offline)] [የስርዓቱ መዋቅር] [+ ይዘት ጫን] [ቴሌግራም ተቀላቀል]
      */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('lessons')}
          className="flex items-center gap-2 shrink-0 cursor-pointer pr-1 hover:opacity-90 transition"
        >
          {/* Gold circular emblem */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5be49] to-[#b38622] flex items-center justify-center shrink-0 shadow-md text-black font-bold text-sm">
            <span>ሐ</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="font-bold text-sm text-[#f5f7f5] font-ethiopic tracking-wide">
              ሐበሻ
            </span>
            <span className="font-amiri text-xs text-[#d4af37] font-normal">
              (الحبشة)
            </span>
          </div>
        </div>

        <div className="h-5 w-[1px] bg-[#d4af37]/20 shrink-0 mx-0.5" />

        {/* 1. የትምህርቶች ማውጫ */}
        <button
          onClick={() => setActiveTab('lessons')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'lessons'
              ? 'bg-[#d4af37]/20 text-[#f7e29c] border border-[#d4af37]/50 shadow-sm'
              : 'text-[#9ea8a1] hover:text-white hover:bg-[#121914] border border-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>የትምህርቶች ማውጫ</span>
        </button>

        {/* 2. የሰነዶች ማዕከል */}
        <button
          onClick={() => setActiveTab('documents')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'bg-[#d4af37]/20 text-[#f7e29c] border border-[#d4af37]/50 shadow-sm'
              : 'text-[#9ea8a1] hover:text-white hover:bg-[#121914] border border-transparent'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>የሰነዶች ማዕከል</span>
        </button>

        {/* 3. የድምፅ ትምህርቶች (MP3) */}
        <button
          onClick={() => setActiveTab('audio')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'audio'
              ? 'bg-[#d4af37]/20 text-[#f7e29c] border border-[#d4af37]/50 shadow-sm'
              : 'text-[#9ea8a1] hover:text-white hover:bg-[#121914] border border-transparent'
          }`}
        >
          <Headphones className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>የድምፅ ትምህርቶች (MP3)</span>
        </button>

        {/* 4. ከመስመር ውጭ (Offline) */}
        <button
          onClick={() => setActiveTab('offline')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'offline'
              ? 'bg-[#d4af37]/20 text-[#f7e29c] border border-[#d4af37]/50 shadow-sm'
              : 'text-[#9ea8a1] hover:text-white hover:bg-[#121914] border border-transparent'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>ከመስመር ውጭ (Offline)</span>
        </button>

        {/* 5. የስርዓቱ መዋቅር */}
        <button
          onClick={() => setActiveTab('structure')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'structure'
              ? 'bg-[#d4af37]/20 text-[#f7e29c] border border-[#d4af37]/50 shadow-sm'
              : 'text-[#9ea8a1] hover:text-white hover:bg-[#121914] border border-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>የስርዓቱ መዋቅር</span>
        </button>

        <div className="h-5 w-[1px] bg-[#d4af37]/20 shrink-0 mx-0.5" />

        {/* Action: + ይዘት ጫን (Yellow/Gold Button matching photo) */}
        <button
          onClick={onOpenAddModal}
          className="shrink-0 gold-gradient-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5 text-black" />
          <span>+ ይዘት ጫን</span>
        </button>

        {/* Action: ቴሌግራም ተቀላቀል (Cyan/Blue Button matching photo) */}
        <a
          href="https://t.me"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1.5 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#72c9f5] border border-[#229ED9]/30 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Send className="w-3 h-3 text-[#229ED9]" />
          <span>ቴሌግራም ተቀላቀል</span>
        </a>

        {/* Language dropdown */}
        <div className="relative group shrink-0 ml-auto">
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#111713] hover:bg-[#18211b] border border-[#d4af37]/25 text-[11px] text-[#e8ebe8] transition">
            <Globe className="w-3 h-3 text-[#d4af37]" />
            <span className="font-medium">
              {languages.find((l) => l.code === language)?.label}
            </span>
          </button>
          <div className="absolute right-0 mt-1 w-28 bg-[#0c100e] border border-[#d4af37]/35 rounded-xl shadow-xl py-1 hidden group-hover:block group-focus-within:block z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full text-left px-2.5 py-1 text-xs flex items-center justify-between hover:bg-[#d4af37]/15 transition ${
                  language === lang.code ? 'text-[#f5d97e] font-semibold bg-[#d4af37]/10' : 'text-[#c7ccc8]'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <span className="text-[#d4af37]">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
