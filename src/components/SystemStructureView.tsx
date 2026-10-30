import React from 'react';
import { 
  Layers, 
  Video, 
  Headphones, 
  FileText, 
  Database, 
  Send, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const SystemStructureView: React.FC = () => {
  const pillars = [
    {
      title: 'የቪዲዮ ትምህርት ስትሪሚንግ (Video Streaming Engine)',
      desc: 'የተጫኑ የቪዲዮ ፋይሎችን (.mp4, .webm) ወይም የ YouTube እና Vimeo ስትሪሞችን በከፍተኛ ጥራት በሙሉ ስክሪን የማጫወት አቅም።',
      icon: Video,
      color: 'text-[#d4af37]',
      bg: 'bg-[#d4af37]/15',
    },
    {
      title: 'የ MP3 ድምፅ ማጫወቻና ማውረጃ (Audio & Download Engine)',
      desc: 'በመተግበሪያው ውስጥ ሳይቋረጥ የሚጫወት ድምፅ፣ የፍጥነት መቆጣጠሪያ (0.75x - 2x) እና ተማሪዎች በቀጥታ እንዲያወርዱ (Download MP3) የሚያስችል ፈጣን ቁልፍ።',
      icon: Headphones,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
    },
    {
      title: 'ሁለገብ የ PDF ኪታብ ሰነድ መመልከቻ (Universal Document Viewer)',
      desc: 'የማመሳከሪያ ኪታቦችን በሙሉ ስክሪን ከአጉሊ መነጽር (Zoom) ጋር የማንበብ እና በስልክ የማውረድ (Download PDF) ድጋፍ።',
      icon: FileText,
      color: 'text-[#f5d97e]',
      bg: 'bg-[#f5d97e]/15',
    },
    {
      title: 'ከመስመር ውጭ የዳታ ቋት (Independent Local Storage)',
      desc: 'ምንም ዓይነት የውጭ Google Sheet ወይም የሶስተኛ ወገን አገልግሎት የማይፈልግ፤ ሙሉ በሙሉ በራስዎ ስልክና ኮምፒውተር ደህንነቱ ተጠብቆ የሚቀመጥ ራሱን የቻለ IndexedDB አሰራር።',
      icon: Database,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
    },
    {
      title: 'የቴሌግራም እና ማህበራዊ ማጋሪያ (Telegram Community Network)',
      desc: 'የትምህርት መረጃዎችን ወደ Telegram፣ WhatsApp እና ማህበራዊ ሚዲያዎች በአንድ ክሊክ በማጋራት የተማሪዎችን ግንኙነት ማጠናከር።',
      icon: Send,
      color: 'text-[#229ED9]',
      bg: 'bg-[#229ED9]/15',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="p-4 rounded-2xl bg-[#0c110e] border border-[#d4af37]/30 shadow-lg">
        <h2 className="text-lg font-bold text-[#f7e29c] font-ethiopic flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#d4af37]" />
          <span>የሐበሻ መተግበሪያ ስርዓተ-መዋቅር (System Architecture)</span>
        </h2>
        <p className="text-xs text-[#8c978f] mt-0.5 font-ethiopic">
          የተሟላ የኢስላማዊ ትምህርት ስነ-ምህዳር መዋቅርና ቴክኒካዊ አሰራር ዝርዝር።
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#0c100e] border border-[#d4af37]/20 hover:border-[#d4af37]/45 transition space-y-2 shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl ${pillar.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${pillar.color}`} />
                </div>
                <h3 className="text-sm font-bold text-[#f5f7f5] font-ethiopic">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-xs text-[#8c968f] leading-relaxed font-ethiopic">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
