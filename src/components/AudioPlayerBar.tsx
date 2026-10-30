import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Volume2, 
  VolumeX, 
  X, 
  Headphones,
  Maximize2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

interface AudioPlayerBarProps {
  onOpenLessonDetail: (lessonId: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ onOpenLessonDetail }) => {
  const { 
    currentLesson, 
    isPlaying, 
    togglePlay, 
    seekRelative, 
    seek, 
    currentTime, 
    duration, 
    playbackRate, 
    setRate, 
    downloadAudioFile, 
    closeAudioBar 
  } = useAudio();

  const { t } = useLanguage();

  if (!currentLesson || !currentLesson.audio?.url) return null;

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 sm:bottom-4 right-3 sm:right-6 z-40 max-w-md w-full animate-fadeIn">
      {/* Floating Pill Player matching screenshot: "በመደመጥ ላይ ያለ ... ክፍል X: ... ▶ ከፈት" */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0c120e]/95 backdrop-blur-xl border border-[#d4af37]/40 shadow-2xl shadow-black/80 flex items-center justify-between gap-3">
        {/* Left: Yellow icon badge */}
        <div 
          onClick={() => onOpenLessonDetail(currentLesson.id)}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-grow"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e5be49] to-[#b38622] flex items-center justify-center shrink-0 shadow-md">
            <Headphones className="w-5 h-5 text-black" />
          </div>

          <div className="min-w-0">
            <span className="text-[10px] text-[#f5d97e] font-semibold block leading-tight">
              በመደመጥ ላይ ያለ
            </span>
            <h4 className="text-xs font-bold text-white truncate max-w-[190px] sm:max-w-[220px]">
              ክፍል {currentLesson.lessonNumber}: {currentLesson.title}
            </h4>
            <span className="text-[10px] text-[#8e9891] font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right Controls: Play/Pause, Open (ከፈት), and Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-[#18211b] hover:bg-[#222e25] text-[#f7e29c] border border-[#d4af37]/30 transition"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => onOpenLessonDetail(currentLesson.id)}
            className="px-2.5 py-1.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#f5d97e] border border-[#d4af37]/40 text-xs font-bold transition flex items-center gap-1"
          >
            <span>ከፈት</span>
          </button>

          <button
            onClick={closeAudioBar}
            className="p-1.5 text-[#79837c] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
