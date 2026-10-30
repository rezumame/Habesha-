import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Download, 
  FileText, 
  Video as VideoIcon, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  CheckCircle2, 
  Share2, 
  Send, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Maximize2, 
  User, 
  Sparkles,
  Plus
} from 'lucide-react';
import { Lesson, MediaSource } from '../types/lesson';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';
import { UniversalDocumentViewerModal } from './UniversalDocumentViewerModal';

interface LessonDetailModalProps {
  lesson: Lesson;
  allLessons: Lesson[];
  onClose: () => void;
  onNavigateLesson: (targetLesson: Lesson) => void;
  onToggleBookmark: (id: string) => void;
  onToggleCompleted: (id: string) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
  onOpenFeedback: (lessonContext?: string) => void;
  onOpenShare: (lesson: Lesson) => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  allLessons,
  onClose,
  onNavigateLesson,
  onToggleBookmark,
  onToggleCompleted,
  onEditLesson,
  onDeleteLesson,
  onOpenFeedback,
  onOpenShare,
}) => {
  const { t, language } = useLanguage();
  const { 
    currentLesson, 
    isPlaying: isGlobalAudioPlaying, 
    playLessonAudio, 
    togglePlay, 
    seekRelative, 
    seek, 
    currentTime, 
    duration, 
    playbackRate, 
    setRate, 
    downloadAudioFile 
  } = useAudio();

  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'audio' | 'pdf'>('all');
  const [showFullPdfViewer, setShowFullPdfViewer] = useState<boolean>(false);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check if current lesson is playing on global audio
  const isThisAudioPlaying = currentLesson?.id === lesson.id && isGlobalAudioPlaying;

  // Find previous and next lessons
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Helper to detect and extract YouTube video embed URL
  const getEmbedVideoUrl = (url: string): string | null => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    if (url.includes('vimeo.com/')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
    return null;
  };

  const embedUrl = lesson.video ? getEmbedVideoUrl(lesson.video.url) : null;

  // Handle Video Speed
  const handleVideoSpeedChange = (speed: number) => {
    setVideoPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Helper format time (mm:ss)
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle PDF Download
  const handleDownloadPdf = () => {
    if (!lesson.pdf?.url) return;
    const link = document.createElement('a');
    link.href = lesson.pdf.url;
    link.download = lesson.pdf.fileName || `Habesha_Lesson_${lesson.lessonNumber}_Doc.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Share to Telegram
  const handleShareToTelegram = () => {
    const text = encodeURIComponent(
      `📚 Habesha (الحبشة) Islamic Education\n\nLesson #${lesson.lessonNumber}: ${lesson.title}\nTeacher: ${lesson.teacher || 'Ustaz'}\n\nListen, watch & download on Habesha App!`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Fullscreen PDF Reader Sub-Modal */}
      {showFullPdfViewer && lesson.pdf && (
        <UniversalDocumentViewerModal
          pdf={lesson.pdf}
          lessonTitle={lesson.title}
          onClose={() => setShowFullPdfViewer(false)}
        />
      )}

      <div className="relative w-full max-w-4xl my-auto bg-[#0d120f] border border-[#d4af37]/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-[#111713] border-b border-[#d4af37]/20 flex items-center justify-between gap-3 shrink-0">
          {/* Left: Lesson Number & Prev / Next */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5d97e] font-cinzel font-bold text-xs tracking-wider">
              DERS {lesson.lessonNumber < 10 ? `0${lesson.lessonNumber}` : lesson.lessonNumber}
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && onNavigateLesson(prevLesson)}
                title="Previous Lesson"
                className="p-1.5 rounded-lg bg-[#18211b] text-[#b0b8b2] hover:text-[#f5d97e] hover:bg-[#202b23] disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && onNavigateLesson(nextLesson)}
                title="Next Lesson"
                className="p-1.5 rounded-lg bg-[#18211b] text-[#b0b8b2] hover:text-[#f5d97e] hover:bg-[#202b23] disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Actions (Bookmark, Completed, Share, Edit, Close) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(lesson.id)}
              title={t.bookmark}
              className={`p-2 rounded-lg border transition ${
                lesson.isBookmarked
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f5d97e]'
                  : 'bg-[#18211b] border-[#d4af37]/20 text-[#a0aaa2] hover:text-[#d4af37]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${lesson.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onToggleCompleted(lesson.id)}
              title={lesson.isCompleted ? t.markIncomplete : t.markCompleted}
              className={`p-2 rounded-lg border transition ${
                lesson.isCompleted
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                  : 'bg-[#18211b] border-[#d4af37]/20 text-[#a0aaa2] hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenShare(lesson)}
              title={t.share}
              className="p-2 rounded-lg bg-[#18211b] border border-[#d4af37]/20 text-[#a0aaa2] hover:text-[#d4af37] transition"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEditLesson(lesson)}
              title={t.editLesson}
              className="p-2 rounded-lg bg-[#18211b] border border-[#d4af37]/20 text-[#a0aaa2] hover:text-[#d4af37] transition"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onDeleteLesson(lesson.id);
                onClose();
              }}
              title={t.deleteLesson}
              className="p-2 rounded-lg bg-[#18211b] border border-[#d4af37]/20 text-[#a0aaa2] hover:text-rose-400 hover:bg-rose-950/30 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-[#d4af37]/20 mx-1" />

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#18211b] text-[#a0aaa2] hover:text-rose-300 hover:bg-rose-950/40 border border-[#d4af37]/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Lesson Title & Ustaz Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f5d97e] border border-[#d4af37]/30 font-semibold">
                {lesson.category || 'General'}
              </span>
              {lesson.teacher && (
                <span className="flex items-center gap-1 text-xs text-[#a4aca6] bg-[#111713] px-2.5 py-0.5 rounded-full border border-white/5">
                  <User className="w-3 h-3 text-[#d4af37]" />
                  <span>{lesson.teacher}</span>
                </span>
              )}
              {lesson.isCompleted && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.completed}</span>
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-[#f5f7f5] leading-tight">
              {lesson.title}
            </h2>

            {lesson.titleArabic && (
              <p className="font-amiri text-lg text-[#d4af37] mt-1" dir="rtl">
                {lesson.titleArabic}
              </p>
            )}
            {lesson.titleAmharic && language !== 'am' && (
              <p className="font-ethiopic text-sm text-[#a8b1ab] mt-1">
                {lesson.titleAmharic}
              </p>
            )}
          </div>

          {/* Quick Media Filter Tabs within Lesson Detail */}
          <div className="flex items-center gap-2 border-b border-[#d4af37]/15 pb-2 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeTab === 'all'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#9ea7a1] hover:text-white bg-[#131a15]'
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'video'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#9ea7a1] hover:text-white bg-[#131a15]'
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>{t.videoLesson}</span>
              {lesson.video?.url && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'audio'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#9ea7a1] hover:text-white bg-[#131a15]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
              <span>{t.audioLesson}</span>
              {lesson.audio?.url && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'pdf'
                  ? 'bg-[#d4af37] text-black font-bold'
                  : 'text-[#9ea7a1] hover:text-white bg-[#131a15]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.documentPdf}</span>
              {lesson.pdf?.url && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          </div>

          {/* ======================================================== */}
          {/* 1. VIDEO PLAYER SECTION                                 */}
          {/* ======================================================== */}
          {(activeTab === 'all' || activeTab === 'video') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#f7e29c] flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.videoLesson}</span>
                </h3>
                {lesson.video?.url && (
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-[#808a82] mr-1">{t.playbackSpeed}:</span>
                    {[1, 1.25, 1.5, 2].map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleVideoSpeedChange(sp)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          videoPlaybackRate === sp
                            ? 'bg-[#d4af37] text-black font-bold'
                            : 'bg-[#18211b] text-[#9ea7a1]'
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {lesson.video?.url ? (
                <div className="relative rounded-xl overflow-hidden border border-[#d4af37]/30 bg-black aspect-video shadow-xl">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={lesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={lesson.video.url}
                      controls
                      className="w-full h-full object-contain"
                      poster=""
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#111713] border border-dashed border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#828c85]">
                    <VideoIcon className="w-4 h-4 text-[#d4af37]/50" />
                    <span>No video file or stream attached to this lesson yet.</span>
                  </div>
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="text-xs text-[#f5d97e] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Video</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. AUDIO PLAYER (MP3) SECTION                           */}
          {/* ======================================================== */}
          {(activeTab === 'all' || activeTab === 'audio') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#f7e29c] flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span>{t.audioLesson}</span>
                </h3>

                {lesson.audio?.url && (
                  <button
                    onClick={() => downloadAudioFile(lesson)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#18211b] hover:bg-[#222e26] text-[#f5d97e] border border-[#d4af37]/30 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.downloadAudio}</span>
                  </button>
                )}
              </div>

              {lesson.audio?.url ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#121914] via-[#0f1411] to-[#0c100e] border border-[#d4af37]/30 shadow-lg space-y-3">
                  {/* Scrubber progress */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentLesson?.id === lesson.id ? currentTime : 0}
                      onChange={(e) => {
                        if (currentLesson?.id === lesson.id) {
                          seek(Number(e.target.value));
                        }
                      }}
                      className="w-full h-1.5 bg-[#202923] rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8e9891] font-mono">
                      <span>{currentLesson?.id === lesson.id ? formatTime(currentTime) : '0:00'}</span>
                      <span>{currentLesson?.id === lesson.id && duration ? formatTime(duration) : (lesson.audio.duration || 'MP3')}</span>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between gap-3">
                    {/* Play/Pause & Seeks */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => seekRelative(-10)}
                        title="Rewind 10 seconds"
                        className="p-2 rounded-full bg-[#18211b] hover:bg-[#202c24] text-[#c7cec9] hover:text-[#f5d97e] transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => playLessonAudio(lesson)}
                        className="gold-gradient-btn w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-[#d4af37]/30"
                      >
                        {isThisAudioPlaying ? (
                          <Pause className="w-5 h-5 fill-current text-black" />
                        ) : (
                          <Play className="w-5 h-5 fill-current text-black translate-x-0.5" />
                        )}
                      </button>

                      <button
                        onClick={() => seekRelative(10)}
                        title="Forward 10 seconds"
                        className="p-2 rounded-full bg-[#18211b] hover:bg-[#202c24] text-[#c7cec9] hover:text-[#f5d97e] transition"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-[#18211b] px-2 py-1 rounded-lg border border-[#d4af37]/20 text-xs">
                      <span className="text-[10px] text-[#78827a]">{t.playbackSpeed}:</span>
                      {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setRate(rate)}
                          className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                            playbackRate === rate
                              ? 'bg-[#d4af37] text-black font-bold'
                              : 'text-[#9ea7a1] hover:text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#111713] border border-dashed border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#828c85]">
                    <span className="w-2 h-2 rounded-full bg-[#d4af37]/40" />
                    <span>No audio file (MP3) attached to this lesson yet.</span>
                  </div>
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="text-xs text-[#f5d97e] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach MP3</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. UNIVERSAL DOCUMENT VIEWER (PDF)                       */}
          {/* ======================================================== */}
          {(activeTab === 'all' || activeTab === 'pdf') && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#f7e29c] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>{t.documentPdf}</span>
                </h3>

                {lesson.pdf?.url && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFullPdfViewer(true)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#18211b] hover:bg-[#202b24] text-[#c4cbc6] hover:text-[#f5d97e] border border-[#d4af37]/25 flex items-center gap-1.5 transition"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{t.viewDocument}</span>
                    </button>

                    <button
                      onClick={handleDownloadPdf}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#18211b] hover:bg-[#222e26] text-[#f5d97e] border border-[#d4af37]/30 flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadPdf}</span>
                    </button>
                  </div>
                )}
              </div>

              {lesson.pdf?.url ? (
                <div className="rounded-xl overflow-hidden border border-[#d4af37]/30 bg-[#0a0d0c] shadow-lg">
                  {/* Inline PDF Preview frame */}
                  <div className="w-full h-72 md:h-96 relative bg-neutral-900">
                    <object
                      data={lesson.pdf.url}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <iframe
                        src={`${lesson.pdf.url}#view=FitH`}
                        className="w-full h-full border-0"
                        title={lesson.title}
                      >
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <FileText className="w-12 h-12 text-[#d4af37] mb-2" />
                          <p className="text-sm font-medium mb-3">
                            {lesson.pdf.fileName || `${lesson.title} PDF`}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowFullPdfViewer(true)}
                              className="gold-gradient-btn px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                            >
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>{t.viewDocument}</span>
                            </button>
                            <button
                              onClick={handleDownloadPdf}
                              className="px-3 py-1.5 rounded-lg bg-[#18211b] text-[#f5d97e] border border-[#d4af37]/30 text-xs flex items-center gap-1.5"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{t.downloadPdf}</span>
                            </button>
                          </div>
                        </div>
                      </iframe>
                    </object>
                  </div>

                  <div className="px-4 py-2 bg-[#101612] border-t border-[#d4af37]/15 flex items-center justify-between text-xs text-[#8f9892]">
                    <span className="truncate">{lesson.pdf.fileName || 'Reference Document (.pdf)'}</span>
                    <button
                      onClick={() => setShowFullPdfViewer(true)}
                      className="text-[#f5d97e] hover:underline flex items-center gap-1"
                    >
                      <span>Open Full Reader</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#111713] border border-dashed border-[#d4af37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#828c85]">
                    <FileText className="w-4 h-4 text-[#d4af37]/50" />
                    <span>No PDF document attached to this lesson yet.</span>
                  </div>
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="text-xs text-[#f5d97e] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach PDF</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Description & Notes */}
          {lesson.description && (
            <div className="p-4 rounded-xl bg-[#101512] border border-[#d4af37]/15 space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                {t.description}
              </h4>
              <p className="text-sm text-[#cbd4ce] whitespace-pre-line leading-relaxed">
                {lesson.description}
              </p>
            </div>
          )}

          {/* Telegram and Social Feedback / Sharing Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#121914] to-[#0c100e] border border-[#d4af37]/25 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-[#f7e29c] flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Telegram & Community Sharing</span>
              </h4>
              <p className="text-[11px] text-[#8a948d] mt-0.5">
                Share this lesson with your study circle or send questions to the Ustaz.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShareToTelegram}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#72c9f5] border border-[#229ED9]/30 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.shareTelegram}</span>
              </button>

              <button
                onClick={() => onOpenFeedback(`Question about Lesson #${lesson.lessonNumber}: ${lesson.title}`)}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-[#18211b] hover:bg-[#222d25] text-[#f5d97e] border border-[#d4af37]/30 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <span>{t.feedback}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Nav Bar within modal (Prev / Next) */}
        <div className="px-4 py-3 bg-[#111713] border-t border-[#d4af37]/20 flex items-center justify-between gap-2 shrink-0">
          <button
            disabled={!prevLesson}
            onClick={() => prevLesson && onNavigateLesson(prevLesson)}
            className="px-3 py-1.5 rounded-lg bg-[#18211b] text-xs text-[#c2c9c4] hover:text-[#f5d97e] disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Previous: Lesson #{prevLesson?.lessonNumber}</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <span className="text-xs text-[#808b83]">
            {currentIndex + 1} of {allLessons.length}
          </span>

          <button
            disabled={!nextLesson}
            onClick={() => nextLesson && onNavigateLesson(nextLesson)}
            className="px-3 py-1.5 rounded-lg bg-[#18211b] text-xs text-[#c2c9c4] hover:text-[#f5d97e] disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next: Lesson #{nextLesson?.lessonNumber}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
