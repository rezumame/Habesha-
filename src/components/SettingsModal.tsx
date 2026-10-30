import React, { useRef, useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  Trash2, 
  Globe, 
  Send, 
  ShieldCheck, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storage';
import { SupportedLanguage } from '../types/lesson';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    try {
      const json = await StorageService.exportMetadataJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Habesha_Lessons_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessMsg('Backup downloaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      setErrorMsg('Failed to export backup: ' + e.message);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const importedLessons = JSON.parse(text);
        if (Array.isArray(importedLessons)) {
          for (const item of importedLessons) {
            await StorageService.saveLesson(item);
          }
          setSuccessMsg(`Successfully restored ${importedLessons.length} lessons!`);
          onDataChanged();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setErrorMsg('Invalid backup file format.');
        }
      } catch (err: any) {
        setErrorMsg('Error reading backup JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all uploaded lessons? This action cannot be undone.')) {
      await StorageService.clearAllLessons();
      onDataChanged();
      setSuccessMsg('All lessons cleared. App is completely pristine.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'am', label: 'አማርኛ (Amharic)' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c100e] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#d4af37]/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 text-[#f5d97e]">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#f7e29c] font-cinzel">
                {t.settings}
              </h3>
              <p className="text-xs text-[#8e9891]">
                Habesha (الحبشة) Configuration & Data
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

        {/* Feedback alerts */}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#cbd4ce] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>ቋንቋ ይምረጡ (Select Language)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border transition ${
                  language === l.code
                    ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7e29c] font-bold'
                    : 'bg-[#121914] border-transparent text-[#9ea7a1] hover:text-white hover:bg-[#18211b]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Backup & Restore */}
        <div className="space-y-2.5 pt-2 border-t border-[#d4af37]/15">
          <label className="text-xs font-semibold text-[#cbd4ce] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>የዳታ አስተዳደር (Data Backup & Restore)</span>
          </label>
          <p className="text-[11px] text-[#849088]">
            ሁሉንም የጫኗቸውን ትምህርቶች ወደ JSON ፋይል ኮፒ ያውርዱ ወይም የነበረውን ኮፒ መልሰው ይጫኑ።
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleExportBackup}
              className="p-3 rounded-xl bg-[#141c16] hover:bg-[#1c2720] text-[#f5d97e] border border-[#d4af37]/30 flex items-center justify-center gap-2 text-xs font-semibold transition"
            >
              <Download className="w-4 h-4" />
              <span>{t.backupData}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-[#141c16] hover:bg-[#1c2720] text-[#cbd4ce] hover:text-white border border-[#d4af37]/30 flex items-center justify-center gap-2 text-xs font-semibold transition"
            >
              <Upload className="w-4 h-4 text-[#d4af37]" />
              <span>Restore Backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        </div>

        {/* Reset Clean App */}
        <div className="space-y-2 pt-2 border-t border-[#d4af37]/15">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-300">
                {t.resetData}
              </h4>
              <p className="text-[11px] text-[#7d8881]">
                ሁሉንም የተጫኑ ትምህርቶች በማጽዳት መተግበሪያውን ንፁህ ማድረግ
              </p>
            </div>

            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* About Applet Info */}
        <div className="p-3 rounded-xl bg-[#101512] border border-[#d4af37]/20 text-[11px] text-[#86928a] text-center">
          <p className="font-cinzel text-xs font-bold text-[#f7e29c] mb-0.5">
            Habesha (الحبشة) v1.0
          </p>
          <p>Islamic Educational Mobile & Web Experience</p>
        </div>
      </div>
    </div>
  );
};
