/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Bookmark, 
  Home, 
  Settings as SettingsIcon, 
  Send, 
  BookOpen,
  FileText,
  Headphones,
  HardDrive,
  Layers
} from 'lucide-react';
import { Lesson, SectionFilter } from './types/lesson';
import { StorageService } from './services/storage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import { Header, MainNavTab } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { SectionTabs } from './components/SectionTabs';
import { LessonCard } from './components/LessonCard';
import { LessonDetailModal } from './components/LessonDetailModal';
import { AddLessonModal } from './components/AddLessonModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { EmptyState } from './components/EmptyState';
import { DocumentCenterView } from './components/DocumentCenterView';
import { AudioLessonsView } from './components/AudioLessonsView';
import { OfflineStorageView } from './components/OfflineStorageView';
import { SystemStructureView } from './components/SystemStructureView';
import { ShareModal } from './components/ShareModal';
import { FeedbackModal } from './components/FeedbackModal';
import { SettingsModal } from './components/SettingsModal';

function MainApp() {
  const { t } = useLanguage();
  const { currentLesson } = useAudio();

  // Active top/bottom Navigation Tab (matching screenshot tabs!)
  const [activeTab, setActiveTab] = useState<MainNavTab>('lessons');

  // Lessons Data State (Starts clean and empty - zero mock data as requested!)
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Navigation States
  const [currentSection, setCurrentSection] = useState<SectionFilter>('all');
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [showOnlyCompleted, setShowOnlyCompleted] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [activeLessonForDetail, setActiveLessonForDetail] = useState<Lesson | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackContext, setFeedbackContext] = useState<string>('');
  const [sharingLesson, setSharingLesson] = useState<Lesson | null>(null);

  // Load lessons from local IndexedDB on mount
  const loadLessons = async () => {
    try {
      setIsLoading(true);
      const data = await StorageService.getAllLessons();
      setLessons(data);
    } catch (err) {
      console.error('Failed to load lessons', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  // Compute available number ranges (e.g. 1-10, 11-20, 21-30)
  const availableRanges = useMemo(() => {
    const maxLessonNum = lessons.reduce((max, l) => Math.max(max, l.lessonNumber), 0);
    const ranges: string[] = ['1-10', '11-20', '21-30'];
    if (maxLessonNum > 30) {
      for (let i = 31; i <= Math.ceil(maxLessonNum / 10) * 10; i += 10) {
        ranges.push(`${i}-${i + 9}`);
      }
    }
    return ranges;
  }, [lessons]);

  // Compute counts
  const bookmarkedCount = useMemo(() => lessons.filter((l) => l.isBookmarked).length, [lessons]);
  const completedCount = useMemo(() => lessons.filter((l) => l.isCompleted).length, [lessons]);

  // Suggested next lesson number
  const nextSuggestedNumber = useMemo(() => {
    if (lessons.length === 0) return 1;
    return Math.max(...lessons.map((l) => l.lessonNumber)) + 1;
  }, [lessons]);

  // Filter lessons based on active filters
  const filteredLessons = useMemo(() => {
    const result = lessons.filter((lesson) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesArabic = lesson.titleArabic?.toLowerCase().includes(q);
        const matchesAmharic = lesson.titleAmharic?.toLowerCase().includes(q);
        const matchesTeacher = lesson.teacher?.toLowerCase().includes(q);
        const matchesDesc = lesson.description?.toLowerCase().includes(q);
        const matchesNum = String(lesson.lessonNumber) === q;
        if (!matchesTitle && !matchesArabic && !matchesAmharic && !matchesTeacher && !matchesDesc && !matchesNum) {
          return false;
        }
      }

      // 2. Bookmarks Only
      if (showOnlyBookmarks && !lesson.isBookmarked) {
        return false;
      }

      // 3. Completed Only
      if (showOnlyCompleted && !lesson.isCompleted) {
        return false;
      }

      // 4. Category
      if (currentCategory !== 'all' && lesson.category !== currentCategory) {
        return false;
      }

      // 5. Section Filter (e.g. 1-10, 11-20)
      if (currentSection !== 'all') {
        const parts = currentSection.split('-');
        if (parts.length === 2) {
          const min = parseInt(parts[0], 10);
          const max = parseInt(parts[1], 10);
          if (lesson.lessonNumber < min || lesson.lessonNumber > max) {
            return false;
          }
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.lessonNumber - b.lessonNumber;
      } else {
        return b.lessonNumber - a.lessonNumber;
      }
    });

    return result;
  }, [lessons, searchQuery, showOnlyBookmarks, showOnlyCompleted, currentCategory, currentSection, sortOrder]);

  // Save or update lesson handler
  const handleSaveLesson = async (lesson: Lesson) => {
    await StorageService.saveLesson(lesson);
    await loadLessons();
    if (activeLessonForDetail?.id === lesson.id) {
      setActiveLessonForDetail(lesson);
    }
  };

  // Delete lesson handler
  const handleDeleteLesson = async (id: string) => {
    await StorageService.deleteLesson(id);
    await loadLessons();
  };

  // Toggle Bookmark handler
  const handleToggleBookmark = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await StorageService.toggleBookmark(id);
    await loadLessons();
    if (activeLessonForDetail?.id === id) {
      setActiveLessonForDetail((prev) => (prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null));
    }
  };

  // Toggle Completed handler
  const handleToggleCompleted = async (id: string) => {
    await StorageService.toggleCompleted(id);
    await loadLessons();
    if (activeLessonForDetail?.id === id) {
      setActiveLessonForDetail((prev) => (prev ? { ...prev, isCompleted: !prev.isCompleted } : null));
    }
  };

  // Open detail from audio bar
  const handleOpenLessonDetailFromBar = (lessonId: string) => {
    const target = lessons.find((l) => l.id === lessonId);
    if (target) {
      setActiveLessonForDetail(target);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b09] text-[#e8ebe8] selection:bg-[#d4af37]/30 flex flex-col font-ethiopic">
      {/* Top Navbar matching screenshot */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingLesson(null);
          setIsAddModalOpen(true);
        }}
        onOpenFeedback={() => {
          setFeedbackContext('');
          setIsFeedbackOpen(true);
        }}
        lessonCount={lessons.length}
      />

      {/* Main Content Viewport */}
      <main className={`flex-grow max-w-7xl mx-auto w-full px-3.5 sm:px-4 py-4 sm:py-6 ${currentLesson ? 'pb-32' : 'pb-20'}`}>
        
        {/* TAB 1: LESSONS CATALOG (Exact screenshot structure) */}
        {activeTab === 'lessons' && (
          <div>
            {/* Hero Banner with open Quran image & local storage status card */}
            <HeroBanner
              lessonCount={lessons.length}
              onOpenAddModal={() => {
                setEditingLesson(null);
                setIsAddModalOpen(true);
              }}
            />

            {/* Search and Section Tabs */}
            <SectionTabs
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              currentSection={currentSection}
              onSelectSection={setCurrentSection}
              availableRanges={availableRanges}
              currentCategory={currentCategory}
              onSelectCategory={setCurrentCategory}
              totalLessons={lessons.length}
              bookmarkedCount={bookmarkedCount}
              completedCount={completedCount}
              showOnlyBookmarks={showOnlyBookmarks}
              setShowOnlyBookmarks={setShowOnlyBookmarks}
              showOnlyCompleted={showOnlyCompleted}
              setShowOnlyCompleted={setShowOnlyCompleted}
              onOpenAddModal={() => {
                setEditingLesson(null);
                setIsAddModalOpen(true);
              }}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            {/* Lessons Card Grid or Empty State */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#d4af37]">
                <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
                <span className="text-xs text-[#9ba49d]">መረጃውን በመጫን ላይ...</span>
              </div>
            ) : lessons.length === 0 ? (
              <EmptyState
                onOpenAddModal={() => {
                  setEditingLesson(null);
                  setIsAddModalOpen(true);
                }}
              />
            ) : filteredLessons.length === 0 ? (
              <EmptyState
                isSearchActive={true}
                onClearSearch={() => {
                  setSearchQuery('');
                  setCurrentSection('all');
                  setCurrentCategory('all');
                  setShowOnlyBookmarks(false);
                  setShowOnlyCompleted(false);
                }}
                onOpenAddModal={() => {
                  setEditingLesson(null);
                  setIsAddModalOpen(true);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onOpenDetail={(l) => setActiveLessonForDetail(l)}
                    onToggleBookmark={(id, e) => handleToggleBookmark(id, e)}
                    onShare={(l, e) => {
                      e.stopPropagation();
                      setSharingLesson(l);
                    }}
                    onDeleteLesson={(id) => handleDeleteLesson(id)}
                    onEditLesson={(l) => {
                      setEditingLesson(l);
                      setIsAddModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UNIVERSAL DOCUMENT CENTER */}
        {activeTab === 'documents' && (
          <DocumentCenterView
            lessons={lessons}
            onOpenAddModal={() => {
              setEditingLesson(null);
              setIsAddModalOpen(true);
            }}
            onOpenLessonDetail={(l) => setActiveLessonForDetail(l)}
            onDeleteLesson={(id) => handleDeleteLesson(id)}
          />
        )}

        {/* TAB 3: AUDIO LESSONS (MP3) */}
        {activeTab === 'audio' && (
          <AudioLessonsView
            lessons={lessons}
            onOpenAddModal={() => {
              setEditingLesson(null);
              setIsAddModalOpen(true);
            }}
            onOpenLessonDetail={(l) => setActiveLessonForDetail(l)}
            onDeleteLesson={(id) => handleDeleteLesson(id)}
          />
        )}

        {/* TAB 4: OFFLINE STORAGE & LOCAL DB */}
        {activeTab === 'offline' && (
          <OfflineStorageView
            lessons={lessons}
            onDataChanged={loadLessons}
          />
        )}

        {/* TAB 5: SYSTEM STRUCTURE & ABOUT */}
        {activeTab === 'structure' && (
          <SystemStructureView />
        )}
      </main>

      {/* Bottom Mobile Navigation Bar (Matching 5 icons from screenshot!) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#090d0b]/98 backdrop-blur-xl border-t border-[#d4af37]/20 px-2 py-2 flex items-center justify-around text-[10px]">
        {/* 1. ትምህርቶች */}
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'lessons' ? 'text-[#f5d97e] font-bold' : 'text-[#828d85]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ትምህርቶች</span>
        </button>

        {/* 2. ሰነዶች */}
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'documents' ? 'text-[#f5d97e] font-bold' : 'text-[#828d85]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>ሰነዶች</span>
        </button>

        {/* 3. ድምጾች */}
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'audio' ? 'text-[#f5d97e] font-bold' : 'text-[#828d85]'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>ድምጾች</span>
        </button>

        {/* 4. ማከማቻ (Offline) */}
        <button
          onClick={() => setActiveTab('offline')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'offline' ? 'text-[#f5d97e] font-bold' : 'text-[#828d85]'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>ማከማቻ</span>
        </button>

        {/* 5. መዋቅር */}
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'structure' ? 'text-[#f5d97e] font-bold' : 'text-[#828d85]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>መዋቅር</span>
        </button>
      </nav>

      {/* Floating persistent bottom audio player (matching screenshot pill) */}
      <AudioPlayerBar onOpenLessonDetail={handleOpenLessonDetailFromBar} />

      {/* Modals */}
      {activeLessonForDetail && (
        <LessonDetailModal
          lesson={activeLessonForDetail}
          allLessons={filteredLessons.length > 0 ? filteredLessons : lessons}
          onClose={() => setActiveLessonForDetail(null)}
          onNavigateLesson={(target) => setActiveLessonForDetail(target)}
          onToggleBookmark={handleToggleBookmark}
          onToggleCompleted={handleToggleCompleted}
          onEditLesson={(l) => {
            setEditingLesson(l);
            setIsAddModalOpen(true);
          }}
          onDeleteLesson={handleDeleteLesson}
          onOpenFeedback={(ctx) => {
            setFeedbackContext(ctx || '');
            setIsFeedbackOpen(true);
          }}
          onOpenShare={(l) => setSharingLesson(l)}
        />
      )}

      {isAddModalOpen && (
        <AddLessonModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingLesson(null);
          }}
          onSave={handleSaveLesson}
          editingLesson={editingLesson}
          nextSuggestedNumber={nextSuggestedNumber}
        />
      )}

      {sharingLesson && (
        <ShareModal
          lesson={sharingLesson}
          onClose={() => setSharingLesson(null)}
        />
      )}

      {isFeedbackOpen && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          initialContext={feedbackContext}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onDataChanged={loadLessons}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AudioProvider>
        <MainApp />
      </AudioProvider>
    </LanguageProvider>
  );
}
