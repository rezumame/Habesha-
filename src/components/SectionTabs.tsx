import React from 'react';
import { 
  Search, 
  Bookmark, 
  CheckCircle2, 
  SlidersHorizontal,
  Plus,
  Send,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SectionFilter } from '../types/lesson';

interface SectionTabsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentSection: SectionFilter;
  onSelectSection: (section: SectionFilter) => void;
  availableRanges: string[];
  currentCategory: string;
  onSelectCategory: (cat: string) => void;
  totalLessons: number;
  bookmarkedCount: number;
  completedCount: number;
  showOnlyBookmarks: boolean;
  setShowOnlyBookmarks: (val: boolean) => void;
  showOnlyCompleted: boolean;
  setShowOnlyCompleted: (val: boolean) => void;
  onOpenAddModal: () => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  searchQuery,
  setSearchQuery,
  currentSection,
  onSelectSection,
  availableRanges,
  currentCategory,
  onSelectCategory,
  totalLessons,
  bookmarkedCount,
  completedCount,
  showOnlyBookmarks,
  setShowOnlyBookmarks,
  showOnlyCompleted,
  setShowOnlyCompleted,
  onOpenAddModal,
  sortOrder,
  setSortOrder,
}) => {
  const { t } = useLanguage();

  const standardCategories = [
    { id: 'all', label: 'ሁሉም ዘርፎች' },
    { id: 'Tafseer', label: 'ተፍሲር' },
    { id: 'Aqeedah', label: 'አቂዳ' },
    { id: 'Fiqh', label: 'ፊቅህ' },
    { id: 'Hadith', label: 'ሐዲስ' },
    { id: 'Usul', label: 'ኡሱል' },
    { id: 'Adab', label: 'አደብ' },
    { id: 'Maqasid', label: 'መቃሲድ' },
    { id: 'Tajweed', label: 'ተጅዊድ' },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* 1. Integrated Search Bar with Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="የትምህርቶችን፣ ኡስታዞችን፣ የፅሁፍ ርዕሶችን ወይም ቃላትን ይፈልጉ..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-xs sm:text-sm text-[#e8ebe8] placeholder-[#79857d] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a0a8a2] hover:text-[#f5d97e] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons on right of search */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none gold-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>+ አዲስ ትምህርት</span>
          </button>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#70c7f7] border border-[#229ED9]/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9]" />
            <span className="hidden sm:inline">ቴሌግራም</span>
          </a>
        </div>
      </div>

      {/* 2. Primary Section Navigation Ranges (e.g. ሁሉም, ክፍል 1-10, ክፍል 11-20) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar flex-wrap sm:flex-nowrap">
          {/* All Button */}
          <button
            onClick={() => {
              onSelectSection('all');
              setShowOnlyBookmarks(false);
              setShowOnlyCompleted(false);
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentSection === 'all' && !showOnlyBookmarks && !showOnlyCompleted
                ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/35 scale-105'
                : 'bg-[#111713] text-[#bcc3be] hover:text-[#f4d785] hover:bg-[#18201b] border border-[#d4af37]/20'
            }`}
          >
            ሁሉም ትምህርቶች ({totalLessons})
          </button>

          {/* Section ranges: ክፍል 1-10, ክፍል 11-20, ወዘተ */}
          {['1-10', '11-20', '21-30'].map((range) => (
            <button
              key={range}
              onClick={() => {
                onSelectSection(range);
                setShowOnlyBookmarks(false);
                setShowOnlyCompleted(false);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                currentSection === range && !showOnlyBookmarks && !showOnlyCompleted
                  ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/35 scale-105'
                  : 'bg-[#111713] text-[#bcc3be] hover:text-[#f4d785] hover:bg-[#18201b] border border-[#d4af37]/20'
              }`}
            >
              ክፍል {range}
            </button>
          ))}

          {/* Bookmarks Pill */}
          <button
            onClick={() => {
              setShowOnlyBookmarks(!showOnlyBookmarks);
              setShowOnlyCompleted(false);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              showOnlyBookmarks
                ? 'bg-[#d4af37] text-black font-bold shadow-md shadow-[#d4af37]/35'
                : 'bg-[#111713] text-[#bcc3be] hover:text-[#f4d785] border border-[#d4af37]/20'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>የተቀመጡ ({bookmarkedCount})</span>
          </button>

          {/* Completed Pill */}
          <button
            onClick={() => {
              setShowOnlyCompleted(!showOnlyCompleted);
              setShowOnlyBookmarks(false);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              showOnlyCompleted
                ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/35'
                : 'bg-[#111713] text-[#bcc3be] hover:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>የተጠናቀቁ ({completedCount})</span>
          </button>
        </div>

        {/* Sort Order Selector */}
        <div className="flex items-center gap-1.5 text-xs text-[#8a968e]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>አስተካክል:</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-[#f5d97e] hover:underline font-medium"
          >
            {sortOrder === 'asc' ? 'በቅደም ተከተል (1-X)' : 'ከቅርብ ወደ ኋላ'}
          </button>
        </div>
      </div>

      {/* 3. Subject Sub-Filter Pills (ሁሉም ዘርፎች, ተፍሲር, አቂዳ, ፊቅህ, ሐዲስ...) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none no-scrollbar">
        {standardCategories.map((cat) => {
          const isSelected = currentCategory === cat.id || (cat.id === 'all' && currentCategory === 'all');
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-3 py-1 rounded-lg transition text-xs ${
                isSelected
                  ? 'bg-[#d4af37]/25 text-[#f7e29c] border border-[#d4af37]/60 font-bold shadow-sm'
                  : 'bg-[#101512] text-[#8e9891] hover:text-[#d4af37] border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
