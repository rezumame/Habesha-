import React, { useState } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  Trash2, 
  Search, 
  X,
  User, 
  Clock 
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { useAudio } from '../context/AudioContext';

interface AudioLessonsViewProps {
  lessons: Lesson[];
  onOpenAddModal: () => void;
  onOpenLessonDetail: (lesson: Lesson) => void;
  onDeleteLesson?: (id: string) => void;
}

export const AudioLessonsView: React.FC<AudioLessonsViewProps> = ({
  lessons,
  onOpenAddModal,
  onOpenLessonDetail,
  onDeleteLesson,
}) => {
  const { currentLesson, isPlaying, playLessonAudio, downloadAudioFile } = useAudio();
  const [audioSearch, setAudioSearch] = useState<string>('');

  const audioLessons = lessons.filter((l) => l.audio && l.audio.url);

  const filteredAudios = audioLessons.filter((l) => {
    if (!audioSearch.trim()) return true;
    const q = audioSearch.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.teacher?.toLowerCase().includes(q) ||
      l.category?.toLowerCase().includes(q) ||
      String(l.lessonNumber) === q
    );
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c110e] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f5d97e]">
              <Headphones className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-[#f7e29c] font-ethiopic">
              የድምፅ ትምህርቶች ማዕከል (MP3 Audio Lessons)
            </h2>
          </div>
          <p className="text-xs text-[#8c978f] mt-1 font-ethiopic">
            ሁሉንም የድምፅ ትምህርቶች በተከታታይ ያዳምጡ፤ ወደ ስልክዎ አውርደው ያለ ኢንተርኔት ያጥኑ።
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#141d17] text-emerald-400 border border-emerald-500/30 font-mono">
            {audioLessons.length} ድምፆች
          </span>

          <button
            onClick={onOpenAddModal}
            className="gold-gradient-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ MP3 ጫን</span>
          </button>
        </div>
      </div>

      {/* Search Bar for Audios */}
      {audioLessons.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4af37]/70" />
          <input
            type="text"
            value={audioSearch}
            onChange={(e) => setAudioSearch(e.target.value)}
            placeholder="የድምፅ ትምህርቶችን፣ ኡስታዝ ወይም ቁጥር ይፈልጉ..."
            className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#79857d] focus:outline-none focus:border-[#d4af37]"
          />
          {audioSearch && (
            <button
              onClick={() => setAudioSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a0a8a2] hover:text-[#f5d97e] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* List of Audios or Empty State */}
      {audioLessons.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto px-4 bg-[#0a0e0c] rounded-2xl border border-[#d4af37]/20 p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#141c16] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#f5f7f5] font-ethiopic">
            ምንም የተጫነ የድምፅ ትምህርት የለም (100% ንፁህ)
          </h3>
          <p className="text-xs text-[#869189] font-ethiopic">
            አዲስ ደርስ ሲጭኑ የ MP3 ድምፅ ፋይል በማያያዝ እዚህ ማዳመጥ፣ ማውረድና ማስተዳደር ይችላሉ።
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAddModal}
              className="gold-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>የመጀመሪያውን ድምፅ ጫን</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredAudios.map((lesson) => {
            const isThisPlaying = currentLesson?.id === lesson.id && isPlaying;
            return (
              <div
                key={lesson.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                  isThisPlaying
                    ? 'bg-[#152119] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : 'bg-[#0c100e] border-[#d4af37]/20 hover:border-[#d4af37]/40'
                }`}
              >
                {/* Left: Play button & info */}
                <div className="flex items-center gap-3 min-w-0 flex-grow">
                  <button
                    onClick={() => playLessonAudio(lesson)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition ${
                      isThisPlaying
                        ? 'bg-[#d4af37] text-black shadow-md'
                        : 'bg-[#18211b] text-[#f5d97e] hover:bg-[#d4af37]/20 border border-[#d4af37]/30'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#f5d97e] font-bold">
                        ትምህርት {lesson.lessonNumber}
                      </span>
                      <span className="text-[#647168]">•</span>
                      <span className="text-[#9ea7a0] truncate">
                        {lesson.teacher || 'ኡስታዝ'}
                      </span>
                    </div>

                    <h4 
                      onClick={() => onOpenLessonDetail(lesson)}
                      className="text-sm font-bold text-[#f2f4f2] hover:text-[#f7e29c] truncate cursor-pointer transition font-ethiopic"
                    >
                      ክፍል {lesson.lessonNumber}: {lesson.title}
                    </h4>
                  </div>
                </div>

                {/* Right: Download MP3 & Delete Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => downloadAudioFile(lesson)}
                    className="px-3 py-1.5 rounded-lg bg-[#18211b] hover:bg-[#222d25] text-xs text-[#f5d97e] border border-[#d4af37]/30 flex items-center gap-1.5 font-medium transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">MP3 አውርድ</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
};
