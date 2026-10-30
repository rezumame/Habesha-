import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  lesson: Lesson | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ lesson, onClose }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);

  if (!lesson) return null;

  const currentUrl = window.location.href;
  const shareText = `📚 Habesha (الحبشة) - Islamic Educational Platform\n\nLesson #${lesson.lessonNumber}: ${lesson.title}\n${lesson.teacher ? `Teacher: ${lesson.teacher}\n` : ''}${lesson.category ? `Category: ${lesson.category}\n` : ''}\nAccess lesson video, MP3 audio, and PDF documents!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToTelegram = () => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(currentUrl);
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const encoded = encodeURIComponent(`${shareText}\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const shareToTwitter = () => {
    const encoded = encodeURIComponent(`${shareText}\n${currentUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0c100e] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#f5d97e]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#f7e29c] font-cinzel">
                {t.share}
              </h3>
              <p className="text-[11px] text-[#8e9891]">
                Lesson #{lesson.lessonNumber}: {lesson.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18211b] text-[#a0aaa2] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Telegram Share Button */}
          <button
            onClick={shareToTelegram}
            className="p-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#6ec7f7] border border-[#229ED9]/30 flex items-center gap-2.5 text-xs font-semibold transition"
          >
            <Send className="w-4 h-4 text-[#229ED9]" />
            <span>Telegram</span>
          </button>

          {/* WhatsApp Share Button */}
          <button
            onClick={shareToWhatsApp}
            className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 flex items-center gap-2.5 text-xs font-semibold transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-[#8f9991]">
            Copy Lesson Link & Details
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${lesson.title} - Habesha App`}
              className="flex-grow px-3 py-2 rounded-xl bg-[#131a15] border border-[#d4af37]/25 text-xs text-[#cbd4ce] focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'gold-gradient-btn text-black'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Telegram Official Channel Promo */}
        <div className="p-3 rounded-xl bg-[#111713] border border-[#d4af37]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#b0b8b2]">
            <Send className="w-4 h-4 text-[#229ED9]" />
            <span>Join Habesha Telegram Channel</span>
          </div>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5d97e] hover:underline flex items-center gap-1"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
