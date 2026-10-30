import React, { useRef, useState } from 'react';
import { 
  HardDrive, 
  Download, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2,
  Database
} from 'lucide-react';
import { Lesson } from '../types/lesson';
import { StorageService } from '../services/storage';

interface OfflineStorageViewProps {
  lessons: Lesson[];
  onDataChanged: () => void;
}

export const OfflineStorageView: React.FC<OfflineStorageViewProps> = ({
  lessons,
  onDataChanged,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const videoCount = lessons.filter((l) => l.video?.url).length;
  const audioCount = lessons.filter((l) => l.audio?.url).length;
  const pdfCount = lessons.filter((l) => l.pdf?.url).length;

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
      setStatusMessage('ኮፒው በስኬት ወርዷል!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (e: any) {
      setStatusMessage('ስህተት፡ ' + e.message);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const imported = JSON.parse(text);
        if (Array.isArray(imported)) {
          for (const item of imported) {
            await StorageService.saveLesson(item);
          }
          setStatusMessage(`${imported.length} ትምህርቶች ተመልሰዋል!`);
          onDataChanged();
          setTimeout(() => setStatusMessage(''), 3000);
        }
      } catch (err: any) {
        setStatusMessage('ፋይሉን ማንበብ አልተቻለም፡ ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = async () => {
    if (window.confirm('ሁሉንም የተጫኑ ትምህርቶች ማጽዳት ይፈልጋሉ?')) {
      await StorageService.clearAllLessons();
      onDataChanged();
      setStatusMessage('ሁሉም ትምህርቶች ጸድተዋል።');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-[#0c110e] border border-[#d4af37]/30 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-[#f7e29c] font-ethiopic flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#d4af37]" />
            <span>ከመስመር ውጭ ማከማቻ (Offline Local Storage)</span>
          </h2>
          <p className="text-xs text-[#8c978f] mt-0.5 font-ethiopic">
            መተግበሪያው ምንም አይነት የውጭ Google Sheet ወይም የሶስተኛ ወገን ዳታ ሳይጠቀም በስልክዎ/ኮምፒውተርዎ ላይ ብቻ ይሰራል።
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active (IndexedDB)</span>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300">
          {statusMessage}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-center">
          <span className="text-2xl font-bold font-mono text-[#f5d97e]">{lessons.length}</span>
          <span className="block text-xs text-[#8a968e] mt-1 font-ethiopic">ጠቅላላ ትምህርቶች</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-center">
          <span className="text-2xl font-bold font-mono text-emerald-400">{audioCount}</span>
          <span className="block text-xs text-[#8a968e] mt-1 font-ethiopic">MP3 ድምፆች</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-center">
          <span className="text-2xl font-bold font-mono text-cyan-400">{videoCount}</span>
          <span className="block text-xs text-[#8a968e] mt-1 font-ethiopic">ቪዲዮዎች</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d120f] border border-[#d4af37]/25 text-center">
          <span className="text-2xl font-bold font-mono text-[#d4af37]">{pdfCount}</span>
          <span className="block text-xs text-[#8a968e] mt-1 font-ethiopic">የPDF ኪታቦች</span>
        </div>
      </div>

      {/* Data Backup Card */}
      <div className="p-5 rounded-2xl bg-[#0d120f] border border-[#d4af37]/25 space-y-3 shadow-lg">
        <h3 className="text-sm font-bold text-[#f5f7f5] font-ethiopic flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
          <span>የትምህርት መረጃዎችን Backup ማውረድና መጫን</span>
        </h3>
        <p className="text-xs text-[#88948c] font-ethiopic">
          የጫኗቸውን ትምህርቶች ኮፒ አድርገው በ JSON ፋይል ማውረድ ወይም ከዚህ በፊት ያወረዱትን ኮፒ መልሰው መጫን ይችላሉ።
        </p>

        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="gold-gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-black" />
            <span>ኮፒ አውርድ (Export Backup)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-[#18211b] hover:bg-[#202b23] text-xs text-[#cbd4ce] border border-[#d4af37]/30 flex items-center gap-1.5 font-semibold transition"
          >
            <Upload className="w-4 h-4 text-[#d4af37]" />
            <span>ኮፒ መልስ (Restore Backup)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />

          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-xs text-rose-400 border border-rose-500/30 flex items-center gap-1.5 font-semibold transition ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>መተግበሪያውን አጽዳ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
