import React from 'react';
import { 
  Play, 
  Pause, 
  Video, 
  FileText, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Headphones,
  ArrowRight
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

interface LessonCardProps {
  lesson: Lesson;
  onOpenDetail: (lesson: Lesson) => void;
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onShare: (lesson: Lesson, e: React.MouseEvent) => void;
  onDeleteLesson?: (id: string, e: React.MouseEvent) => void;
  onEditLesson?: (lesson: Lesson, e: React.MouseEvent) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onOpenDetail,
  onToggleBookmark,
  onShare,
  onDeleteLesson,
  onEditLesson,
}) => {
  const { currentLesson, isPlaying, playLessonAudio } = useAudio();
  const { t } = useLanguage();

  const isCurrentAudioPlaying = currentLesson?.id === lesson.id && isPlaying;

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playLessonAudio(lesson);
  };

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div
      onClick={() => onOpenDetail(lesson)}
      className="habesha-card habesha-card-interactive p-4 sm:p-5 relative cursor-pointer group overflow-hidden transition-all flex flex-col justify-between rounded-2xl bg-[#0c100e] border border-[#d4af37]/25 hover:border-[#d4af37]/60 shadow-lg"
    >
      {/* Decorative Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4af37]/15 transition-all" />

      {/* 1. Top Meta Line: ትምህርት X • ዘርፍ • ርዝመት + Bookmark */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10 text-xs">
        <div className="flex items-center gap-1.5 font-medium flex-wrap">
          <span className="text-[#f5d97e] font-bold">
            ትምህርት {lesson.lessonNumber}
          </span>
          <span className="text-[#627066]">•</span>
          <span className="text-[#a8b3ab]">
            {lesson.category || 'አጠቃላይ'}
          </span>
          {lesson.audio?.duration && (
            <>
              <span className="text-[#627066]">•</span>
              <span className="text-[#8e9891] font-mono text-[11px]">
                {lesson.audio.duration}
              </span>
            </>
          )}
          {lesson.isCompleted && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>ተጠናቋል</span>
            </span>
          )}
        </div>

        {/* Edit, Bookmark & Delete Actions */}
        <div className="flex items-center gap-1">
          {onEditLesson && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLesson(lesson, e);
              }}
              title="አስተካክል (Edit)"
              className="p-1.5 rounded-lg bg-[#121814] text-[#8e9891] hover:text-[#d4af37] hover:bg-[#1a231d] border border-transparent hover:border-[#d4af37]/30 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}

          <button
            onClick={(e) => onToggleBookmark(lesson.id, e)}
            title={t.bookmark}
            className={`p-1.5 rounded-lg border transition ${
              lesson.isBookmarked
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5d97e]'
                : 'bg-[#121814] border-transparent text-[#7d8780] hover:text-[#d4af37] hover:border-[#d4af37]/30'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${lesson.isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {onDeleteLesson && (
            confirmDelete ? (
              <div 
                className="flex items-center gap-1 bg-rose-950/90 px-2 py-0.5 rounded-lg border border-rose-500/50 shadow-md" 
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[10px] text-rose-300 font-bold">ይሰረዝ?</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLesson(lesson.id, e);
                    setConfirmDelete(false);
                  }}
                  className="text-[10px] text-white font-bold px-1.5 py-0.5 bg-rose-600 hover:bg-rose-700 rounded transition"
                >
                  አዎ
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="text-[10px] text-[#9da59f] hover:text-white px-1 py-0.5 transition"
                >
                  ተመለስ
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                title="ሰርዝ (Delete)"
                className="p-1.5 rounded-lg bg-[#121814] text-[#7d8780] hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                </svg>
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. Main Title (ክፍል X: ...) */}
      <div className="mb-2.5 relative z-10">
        <h3 className="text-sm sm:text-base font-bold text-[#f2f5f3] group-hover:text-[#f7e29c] transition leading-snug font-ethiopic">
          ክፍል {lesson.lessonNumber}: {lesson.title}
        </h3>

        {/* Arabic Title (الدرس ...) */}
        {lesson.titleArabic && (
          <p className="font-amiri text-xs sm:text-sm text-[#d4af37] mt-1 line-clamp-1" dir="rtl">
            {lesson.titleArabic}
          </p>
        )}
      </div>

      {/* 3. Description Paragraph */}
      <div className="mb-4 relative z-10 flex-grow">
        {lesson.description ? (
          <p className="text-xs text-[#8c968f] line-clamp-2 leading-relaxed font-ethiopic">
            {lesson.description}
          </p>
        ) : (
          <p className="text-xs text-[#6e7771] italic font-ethiopic">
            የደርሱ ዝርዝር ማብራሪያና ነጥቦች...
          </p>
        )}
      </div>

      {/* 4. Bottom Action Row: Left Pills + Right "ትምህርቱን አጥና ▶" */}
      <div className="pt-3 border-t border-[#d4af37]/15 flex items-center justify-between gap-2 relative z-10">
        {/* Left Media Badges (ድምፅ ብቻ, MP3 ድምፅ, ቪዲዮ, PDF) */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
          {lesson.video?.url && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131c16] text-[#b8c2ba] border border-[#d4af37]/25">
              <Video className="w-3 h-3 text-[#d4af37]" />
              <span>ቪዲዮ</span>
            </span>
          )}

          {lesson.audio?.url && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131c16] text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>MP3 ድምፅ</span>
            </span>
          )}

          {lesson.pdf?.url && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131c16] text-[#f5d97e] border border-[#d4af37]/25">
              <FileText className="w-3 h-3 text-[#d4af37]" />
              <span>PDF</span>
            </span>
          )}
        </div>

        {/* Right Study Button matching screenshot: "ትምህርቱን አጥና ▶" */}
        <div className="flex items-center gap-2">
          {lesson.audio?.url && (
            <button
              onClick={handleAudioClick}
              title={isCurrentAudioPlaying ? t.pauseAudio : t.playAudio}
              className={`p-1.5 rounded-full transition flex items-center justify-center ${
                isCurrentAudioPlaying
                  ? 'bg-[#d4af37] text-black shadow-md scale-105'
                  : 'bg-[#18211b] text-[#d4af37] hover:bg-[#d4af37]/20 border border-[#d4af37]/30'
              }`}
            >
              {isCurrentAudioPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
              )}
            </button>
          )}

          <div className="flex items-center gap-1 text-xs font-bold text-[#f7e29c] group-hover:text-white transition">
            <span>ትምህርቱን አጥና</span>
            <span className="text-[10px]">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};
