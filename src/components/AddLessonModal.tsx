import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Music, 
  FileText, 
  Link as LinkIcon, 
  Check, 
  Trash2, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { Lesson, MediaSource } from '../types/lesson';
import { useLanguage } from '../context/LanguageContext';

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
  editingLesson?: Lesson | null;
  nextSuggestedNumber: number;
}

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingLesson,
  nextSuggestedNumber,
}) => {
  const { t } = useLanguage();

  const [lessonNumber, setLessonNumber] = useState<number>(nextSuggestedNumber);
  const [title, setTitle] = useState<string>('');
  const [titleArabic, setTitleArabic] = useState<string>('');
  const [titleAmharic, setTitleAmharic] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [teacher, setTeacher] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Video State
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [existingVideo, setExistingVideo] = useState<MediaSource | undefined>(undefined);

  // Audio State
  const [audioMode, setAudioMode] = useState<'upload' | 'url'>('upload');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [existingAudio, setExistingAudio] = useState<MediaSource | undefined>(undefined);

  // PDF State
  const [pdfMode, setPdfMode] = useState<'upload' | 'url'>('upload');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState<MediaSource | undefined>(undefined);

  // Form error
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingLesson) {
      setLessonNumber(editingLesson.lessonNumber);
      setTitle(editingLesson.title);
      setTitleArabic(editingLesson.titleArabic || '');
      setTitleAmharic(editingLesson.titleAmharic || '');
      setCategory(editingLesson.category || 'General');
      setTeacher(editingLesson.teacher || '');
      setDescription(editingLesson.description || '');

      if (editingLesson.video) {
        setExistingVideo(editingLesson.video);
        if (editingLesson.video.type === 'url') {
          setVideoMode('url');
          setVideoUrl(editingLesson.video.url);
        } else {
          setVideoMode('upload');
        }
      }

      if (editingLesson.audio) {
        setExistingAudio(editingLesson.audio);
        if (editingLesson.audio.type === 'url') {
          setAudioMode('url');
          setAudioUrl(editingLesson.audio.url);
        } else {
          setAudioMode('upload');
        }
      }

      if (editingLesson.pdf) {
        setExistingPdf(editingLesson.pdf);
        if (editingLesson.pdf.type === 'url') {
          setPdfMode('url');
          setPdfUrl(editingLesson.pdf.url);
        } else {
          setPdfMode('upload');
        }
      }
    } else {
      setLessonNumber(nextSuggestedNumber);
      setTitle('');
      setTitleArabic('');
      setTitleAmharic('');
      setCategory('General');
      setTeacher('');
      setDescription('');
      setVideoFile(null);
      setVideoUrl('');
      setAudioFile(null);
      setAudioUrl('');
      setPdfFile(null);
      setPdfUrl('');
      setExistingVideo(undefined);
      setExistingAudio(undefined);
      setExistingPdf(undefined);
    }
    setError('');
  }, [editingLesson, nextSuggestedNumber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a lesson title.');
      return;
    }

    if (!lessonNumber || lessonNumber < 1) {
      setError('Please enter a valid lesson number (1, 2, 3...).');
      return;
    }

    // Prepare video source
    let finalVideo: MediaSource | undefined = existingVideo;
    if (videoMode === 'upload' && videoFile) {
      finalVideo = {
        type: 'upload',
        url: URL.createObjectURL(videoFile),
        fileName: videoFile.name,
        sizeBytes: videoFile.size,
        fileBlob: videoFile,
      };
    } else if (videoMode === 'url' && videoUrl.trim()) {
      finalVideo = {
        type: 'url',
        url: videoUrl.trim(),
        fileName: 'Stream Video',
      };
    }

    // Prepare audio source
    let finalAudio: MediaSource | undefined = existingAudio;
    if (audioMode === 'upload' && audioFile) {
      finalAudio = {
        type: 'upload',
        url: URL.createObjectURL(audioFile),
        fileName: audioFile.name,
        sizeBytes: audioFile.size,
        fileBlob: audioFile,
      };
    } else if (audioMode === 'url' && audioUrl.trim()) {
      finalAudio = {
        type: 'url',
        url: audioUrl.trim(),
        fileName: 'Stream Audio',
      };
    }

    // Prepare PDF source
    let finalPdf: MediaSource | undefined = existingPdf;
    if (pdfMode === 'upload' && pdfFile) {
      finalPdf = {
        type: 'upload',
        url: URL.createObjectURL(pdfFile),
        fileName: pdfFile.name,
        sizeBytes: pdfFile.size,
        fileBlob: pdfFile,
      };
    } else if (pdfMode === 'url' && pdfUrl.trim()) {
      finalPdf = {
        type: 'url',
        url: pdfUrl.trim(),
        fileName: 'Document (.pdf)',
      };
    }

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'General') : category;

    const newOrUpdatedLesson: Lesson = {
      id: editingLesson ? editingLesson.id : `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      lessonNumber: Number(lessonNumber),
      title: title.trim(),
      titleArabic: titleArabic.trim() || undefined,
      titleAmharic: titleAmharic.trim() || undefined,
      category: finalCategory,
      teacher: teacher.trim(),
      description: description.trim(),
      video: finalVideo,
      audio: finalAudio,
      pdf: finalPdf,
      createdAt: editingLesson ? editingLesson.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBookmarked: editingLesson?.isBookmarked || false,
      isCompleted: editingLesson?.isCompleted || false,
    };

    onSave(newOrUpdatedLesson);
    onClose();
  };

  const categories = [
    { value: 'General', label: 'General / አጠቃላይ' },
    { value: 'Aqeedah', label: 'Aqeedah / ዓቂዳ' },
    { value: 'Fiqh', label: 'Fiqh / ፊቅህ' },
    { value: 'Hadith', label: 'Hadith / ሐዲስ' },
    { value: 'Tafseer', label: 'Tafseer / ተፍሲር' },
    { value: 'Seerah', label: 'Seerah / ሲራ' },
    { value: 'Tajweed', label: 'Tajweed / ተጅዊድ' },
    { value: 'Custom', label: '+ Other (Custom Category)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0c100e] border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111713] border-b border-[#d4af37]/25 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h3 className="text-base md:text-lg font-bold text-[#f7e29c] font-cinzel flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#d4af37]" />
              <span>{editingLesson ? t.editLesson : t.uploadLesson}</span>
            </h3>
            <p className="text-xs text-[#8c978f] mt-0.5 font-ethiopic">
              ቪዲዮ፣ ድምፅ (MP3) እና የኪታብ PDF ሰነድ እዚህ ይጫኑ
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#18211b] hover:bg-rose-950/40 text-[#a0aaa2] hover:text-rose-300 border border-[#d4af37]/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-grow">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Top Row: Lesson Number & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#c8d0ca] mb-1.5">
                {t.lessonNumber} <span className="text-[#d4af37]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  required
                  value={lessonNumber}
                  onChange={(e) => setLessonNumber(Number(e.target.value))}
                  placeholder="1"
                  className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/30 text-sm text-[#f5d97e] font-bold focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#c8d0ca] mb-1.5">
                {t.lessonCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/30 text-sm text-[#e8ebe8] focus:outline-none focus:border-[#d4af37]"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value} className="bg-[#111613] text-[#e8ebe8]">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {category === 'Custom' && (
            <div>
              <label className="block text-xs font-medium text-[#c8d0ca] mb-1">
                Enter Custom Category Name
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Usul al-Thalatha / الأصول الثلاثة"
                className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/30 text-sm text-[#e8ebe8] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          )}

          {/* Lesson Titles */}
          <div>
            <label className="block text-xs font-semibold text-[#c8d0ca] mb-1.5">
              {t.lessonTitle} <span className="text-[#d4af37]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., ደርስ 1 - የዓቂዳ መግቢያ / مقدمة في العقيدة"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#111613] border border-[#d4af37]/30 text-sm text-[#f5f7f5] font-medium placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Subtitles: Arabic and Amharic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#a0aaa2] mb-1">
                Arabic Title (العنوان بالعربية) <span className="text-[10px] text-[#69726b]">(اختياري)</span>
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleArabic}
                onChange={(e) => setTitleArabic(e.target.value)}
                placeholder="الدرس الأول..."
                className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/25 text-sm font-amiri text-[#d4af37] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#a0aaa2] mb-1">
                Amharic Subtitle (አማርኛ ንዑስ ርዕስ)
              </label>
              <input
                type="text"
                value={titleAmharic}
                onChange={(e) => setTitleAmharic(e.target.value)}
                placeholder="የትምህርቱ ንዑስ ማብራሪያ..."
                className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/25 text-sm font-ethiopic text-[#cbd4ce] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Ustaz / Teacher Name */}
          <div>
            <label className="block text-xs font-semibold text-[#c8d0ca] mb-1.5">
              {t.teacher}
            </label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="e.g., ኡስታዝ ጀማል / الشيخ عبد الرحمن"
              className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/25 text-sm text-[#e8ebe8] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* ======================================================== */}
          {/* MEDIA UPLOAD SECTION 1: VIDEO                           */}
          {/* ======================================================== */}
          <div className="p-3.5 rounded-xl bg-[#101612] border border-[#d4af37]/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-[#f7e29c]">{t.videoLesson}</span>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#18211b] p-0.5 rounded-lg border border-[#d4af37]/20 text-[11px]">
                <button
                  type="button"
                  onClick={() => setVideoMode('upload')}
                  className={`px-2 py-0.5 rounded transition ${videoMode === 'upload' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setVideoMode('url')}
                  className={`px-2 py-0.5 rounded transition ${videoMode === 'url' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  Stream URL / YouTube
                </button>
              </div>
            </div>

            {videoMode === 'upload' ? (
              <div>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#d4af37]/35 rounded-xl cursor-pointer hover:bg-[#151e18] transition text-center">
                  <Upload className="w-5 h-5 text-[#d4af37] mb-1" />
                  <span className="text-xs text-[#d2dad4] font-medium">
                    {videoFile ? videoFile.name : (existingVideo?.fileName || 'Choose Video file (.mp4, .webm, .mov)')}
                  </span>
                  <span className="text-[10px] text-[#78827a] mt-0.5">Click or drag & drop</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {(videoFile || existingVideo) && (
                  <div className="flex items-center justify-between text-xs bg-[#16201a] border border-emerald-500/30 rounded-xl p-2.5 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[#e2e8e4] font-medium truncate">
                        {videoFile?.name || existingVideo?.fileName}
                      </span>
                      {(videoFile?.size || existingVideo?.sizeBytes) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111713] text-[#d4af37] border border-[#d4af37]/20 shrink-0">
                          {formatBytes(videoFile?.size || existingVideo?.sizeBytes)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setExistingVideo(undefined);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 ml-2 shrink-0 underline"
                    >
                      አስወግድ (Remove)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                className="w-full px-3 py-2 rounded-xl bg-[#141b16] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
              />
            )}
          </div>

          {/* ======================================================== */}
          {/* MEDIA UPLOAD SECTION 2: AUDIO (MP3)                      */}
          {/* ======================================================== */}
          <div className="p-3.5 rounded-xl bg-[#101612] border border-[#d4af37]/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-[#f7e29c]">{t.audioLesson}</span>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#18211b] p-0.5 rounded-lg border border-[#d4af37]/20 text-[11px]">
                <button
                  type="button"
                  onClick={() => setAudioMode('upload')}
                  className={`px-2 py-0.5 rounded transition ${audioMode === 'upload' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  Upload MP3
                </button>
                <button
                  type="button"
                  onClick={() => setAudioMode('url')}
                  className={`px-2 py-0.5 rounded transition ${audioMode === 'url' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  Audio URL
                </button>
              </div>
            </div>

            {audioMode === 'upload' ? (
              <div>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#d4af37]/35 rounded-xl cursor-pointer hover:bg-[#151e18] transition text-center">
                  <Upload className="w-5 h-5 text-[#d4af37] mb-1" />
                  <span className="text-xs text-[#d2dad4] font-medium">
                    {audioFile ? audioFile.name : (existingAudio?.fileName || 'Choose Audio file (.mp3, .m4a, .wav)')}
                  </span>
                  <span className="text-[10px] text-[#78827a] mt-0.5">Click or drag & drop</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAudioFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {(audioFile || existingAudio) && (
                  <div className="flex items-center justify-between text-xs bg-[#16201a] border border-emerald-500/30 rounded-xl p-2.5 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[#e2e8e4] font-medium truncate">
                        {audioFile?.name || existingAudio?.fileName}
                      </span>
                      {(audioFile?.size || existingAudio?.sizeBytes) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111713] text-[#d4af37] border border-[#d4af37]/20 shrink-0">
                          {formatBytes(audioFile?.size || existingAudio?.sizeBytes)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile(null);
                        setExistingAudio(undefined);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 ml-2 shrink-0 underline"
                    >
                      አስወግድ (Remove)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://domain.com/lesson1.mp3"
                className="w-full px-3 py-2 rounded-xl bg-[#141b16] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
              />
            )}
          </div>

          {/* ======================================================== */}
          {/* MEDIA UPLOAD SECTION 3: UNIVERSAL PDF DOCUMENT           */}
          {/* ======================================================== */}
          <div className="p-3.5 rounded-xl bg-[#101612] border border-[#d4af37]/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-[#f7e29c]">{t.documentPdf}</span>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#18211b] p-0.5 rounded-lg border border-[#d4af37]/20 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPdfMode('upload')}
                  className={`px-2 py-0.5 rounded transition ${pdfMode === 'upload' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPdfMode('url')}
                  className={`px-2 py-0.5 rounded transition ${pdfMode === 'url' ? 'bg-[#d4af37] text-black font-semibold' : 'text-[#9fa9a2]'}`}
                >
                  PDF Link
                </button>
              </div>
            </div>

            {pdfMode === 'upload' ? (
              <div>
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-[#d4af37]/35 rounded-xl cursor-pointer hover:bg-[#151e18] transition text-center">
                  <Upload className="w-5 h-5 text-[#d4af37] mb-1" />
                  <span className="text-xs text-[#d2dad4] font-medium">
                    {pdfFile ? pdfFile.name : (existingPdf?.fileName || 'Choose PDF Document (.pdf)')}
                  </span>
                  <span className="text-[10px] text-[#78827a] mt-0.5">Click or drag & drop</span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPdfFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {(pdfFile || existingPdf) && (
                  <div className="flex items-center justify-between text-xs bg-[#16201a] border border-emerald-500/30 rounded-xl p-2.5 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[#e2e8e4] font-medium truncate">
                        {pdfFile?.name || existingPdf?.fileName}
                      </span>
                      {(pdfFile?.size || existingPdf?.sizeBytes) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#111713] text-[#d4af37] border border-[#d4af37]/20 shrink-0">
                          {formatBytes(pdfFile?.size || existingPdf?.sizeBytes)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfFile(null);
                        setExistingPdf(undefined);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 ml-2 shrink-0 underline"
                    >
                      አስወግድ (Remove)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://domain.com/kitab_lesson.pdf"
                className="w-full px-3 py-2 rounded-xl bg-[#141b16] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37]"
              />
            )}
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#c8d0ca] mb-1.5">
              {t.description}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation, topics covered, core hadiths or ayahs referenced..."
              className="w-full px-3 py-2 rounded-xl bg-[#111613] border border-[#d4af37]/25 text-xs text-[#e8ebe8] placeholder-[#6a756e] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          {/* Footer Save / Cancel Buttons */}
          <div className="pt-3 border-t border-[#d4af37]/20 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#18211b] hover:bg-[#222d25] text-xs font-semibold text-[#b8c2ba] transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="gold-gradient-btn px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4 text-black" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
