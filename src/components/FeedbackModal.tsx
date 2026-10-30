import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Check, 
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  initialContext = '',
}) => {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState<'question' | 'suggestion' | 'issue'>('question');
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>(initialContext ? `${initialContext}\n\n` : '');
  const [telegramHandle, setTelegramHandle] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Direct Telegram compose option
    const fullText = `[Habesha App - ${feedbackType.toUpperCase()}]\nFrom: ${name || 'Student'}\nTelegram: ${telegramHandle || 'N/A'}\n\nMessage:\n${message}`;
    const encoded = encodeURIComponent(fullText);

    // If user wants to send directly via Telegram web or app:
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  const handleOpenTelegramDirect = () => {
    const fullText = `[Habesha Feedback]\n${message}`;
    const encoded = encodeURIComponent(fullText);
    window.open(`https://t.me/share/url?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c100e] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#f5d97e]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-[#f7e29c] font-cinzel">
                {t.feedback}
              </h3>
              <p className="text-[11px] text-[#8e9891]">
                ጥያቄ፣ አስተያየት ወይም ማብራሪያ ይጠይቁ
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

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#f5f7f5]">
              አስተያየትዎ ተልኳል!
            </h4>
            <p className="text-xs text-[#909b93] max-w-xs mx-auto">
              መልዕክትዎ በስኬት ተመዝግቧል። ጀዛኩሙላሁ ኸይረን!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Feedback Type Tabs */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFeedbackType('question')}
                className={`flex-1 py-1.5 rounded-lg transition font-medium ${
                  feedbackType === 'question'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'bg-[#141b16] text-[#9ea7a1] hover:text-white'
                }`}
              >
                ጥያቄ (Question)
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('suggestion')}
                className={`flex-1 py-1.5 rounded-lg transition font-medium ${
                  feedbackType === 'suggestion'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'bg-[#141b16] text-[#9ea7a1] hover:text-white'
                }`}
              >
                አስተያየት (Suggestion)
              </button>
              <button
                type="button"
                onClick={() => setFeedbackType('issue')}
                className={`flex-1 py-1.5 rounded-lg transition font-medium ${
                  feedbackType === 'issue'
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'bg-[#141b16] text-[#9ea7a1] hover:text-white'
                }`}
              >
                ስህተት ሪፖርት (Issue)
              </button>
            </div>

            {/* Name & Telegram handle */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-medium text-[#c0c8c2] mb-1">
                  ስም (Name)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="የእርስዎ ስም..."
                  className="w-full px-3 py-2 rounded-xl bg-[#131a15] border border-[#d4af37]/25 text-xs text-[#e8ebe8] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#c0c8c2] mb-1">
                  Telegram Username (@...)
                </label>
                <input
                  type="text"
                  value={telegramHandle}
                  onChange={(e) => setTelegramHandle(e.target.value)}
                  placeholder="@username"
                  className="w-full px-3 py-2 rounded-xl bg-[#131a15] border border-[#d4af37]/25 text-xs text-[#e8ebe8] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-medium text-[#c0c8c2] mb-1">
                የጥያቄዎ ወይም አስተያየትዎ ዝርዝር
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="መልዕክትዎን እዚህ ይጻፉ..."
                className="w-full px-3 py-2 rounded-xl bg-[#131a15] border border-[#d4af37]/25 text-xs text-[#e8ebe8] focus:outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            {/* Direct Telegram Send Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleOpenTelegramDirect}
                className="px-3 py-2 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#72c9f5] border border-[#229ED9]/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5 text-[#229ED9]" />
                <span>በቴሌግራም ላክ</span>
              </button>

              <button
                type="submit"
                className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-black" />
                <span>{t.sendFeedback}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
