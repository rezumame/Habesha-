import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types/lesson';

interface Translations {
  appName: string;
  appSubtitle: string;
  allLessons: string;
  addLesson: string;
  uploadLesson: string;
  searchPlaceholder: string;
  noLessonsTitle: string;
  noLessonsDesc: string;
  uploadFirstLesson: string;
  filterBySection: string;
  all: string;
  videoLesson: string;
  audioLesson: string;
  documentPdf: string;
  downloadAudio: string;
  downloadPdf: string;
  viewDocument: string;
  playAudio: string;
  pauseAudio: string;
  playbackSpeed: string;
  teacher: string;
  description: string;
  share: string;
  shareTelegram: string;
  joinTelegram: string;
  feedback: string;
  sendFeedback: string;
  bookmark: string;
  bookmarks: string;
  completed: string;
  markCompleted: string;
  markIncomplete: string;
  deleteLesson: string;
  deleteConfirm: string;
  editLesson: string;
  lessonNumber: string;
  lessonTitle: string;
  lessonCategory: string;
  videoSource: string;
  audioSource: string;
  pdfSource: string;
  uploadFile: string;
  orEnterUrl: string;
  save: string;
  cancel: string;
  close: string;
  settings: string;
  backupData: string;
  resetData: string;
  nowPlaying: string;
  selectCategory: string;
  general: string;
  aqeedah: string;
  fiqh: string;
  hadith: string;
  tafseer: string;
  seerah: string;
  tajweed: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  am: {
    appName: 'ሐበሻ',
    appSubtitle: 'የኢስላማዊ ትምህርት መድረክ',
    allLessons: 'ሁሉም ትምህርቶች',
    addLesson: 'ትምህርት ጨምር',
    uploadLesson: 'ትምህርት ጫን (ቪዲዮ፣ ድምፅ፣ PDF)',
    searchPlaceholder: 'ትምህርት፣ ኡስታዝ፣ ቁጥር ይፈልጉ...',
    noLessonsTitle: 'ምንም የተጫነ ትምህርት የለም',
    noLessonsDesc: 'ይህ መተግበሪያ ምንም የሙከራ ዳታ አልተጫነበትም። የሚፈልጉትን የቪዲዮ፣ ኦዲዮ (MP3) እና PDF ትምህርቶችን በቀጥታ እዚህ መጫን ይችላሉ።',
    uploadFirstLesson: 'የመጀመሪያውን ትምህርት ጫን',
    filterBySection: 'በክፍል ለይ',
    all: 'ሁሉም',
    videoLesson: 'የቪዲዮ ትምህርት',
    audioLesson: 'የድምፅ ትምህርት (MP3)',
    documentPdf: 'የማመሳከሪያ ኪታብ (PDF)',
    downloadAudio: 'ድምፅ አውርድ (MP3)',
    downloadPdf: 'ኪታብ አውርድ (PDF)',
    viewDocument: 'ሰነድ/ኪታብ ክፈት',
    playAudio: 'አጫውት',
    pauseAudio: 'አቁም',
    playbackSpeed: 'ፍጥነት',
    teacher: 'ኡስታዝ / መምህር',
    description: 'ማብራሪያና ማስታወሻ',
    share: 'አጋራ',
    shareTelegram: 'በቴሌግራም አጋራ',
    joinTelegram: 'ቴሌግራም ቻናል',
    feedback: 'አስተያየትና ጥያቄ',
    sendFeedback: 'አስተያየት ላክ',
    bookmark: 'አስቀምጥ',
    bookmarks: 'የተቀመጡ',
    completed: 'የተጠናቀቁ',
    markCompleted: 'ተጠናቋል',
    markIncomplete: 'ያልተጠናቀቀ አድርግ',
    deleteLesson: 'ሰርዝ',
    deleteConfirm: 'ይህንን ትምህርት መሰረዝ ይፈልጋሉ?',
    editLesson: 'አስተካክል',
    lessonNumber: 'የትምህርት ቁጥር (ደርስ)',
    lessonTitle: 'የትምህርት ርዕስ',
    lessonCategory: 'የትምህርት ዘርፍ',
    videoSource: 'የቪዲዮ ፋይል ወይም Stream Link',
    audioSource: 'የድምፅ (MP3) ፋይል ወይም Link',
    pdfSource: 'የ PDF ኪታብ ሰነድ ወይም Link',
    uploadFile: 'ፋይል ምረጥ (Upload)',
    orEnterUrl: 'ወይም ሊንክ አስገባ',
    save: 'አስቀምጥ',
    cancel: 'ተው',
    close: 'ዝጋ',
    settings: 'ማስተካከያ',
    backupData: 'ኮፒ አውርድ (Backup)',
    resetData: 'ሁሉንም ሰርዝ',
    nowPlaying: 'በመደመጥ ላይ...',
    selectCategory: 'ዘርፍ ምረጥ',
    general: 'አጠቃላይ',
    aqeedah: 'ዓቂዳ',
    fiqh: 'ፊቅህ',
    hadith: 'ሐዲስ',
    tafseer: 'ተፍሲር',
    seerah: 'ሲራ',
    tajweed: 'ተጅዊድ',
  },
  ar: {
    appName: 'الحبشة',
    appSubtitle: 'منصة التعليم الإسلامي',
    allLessons: 'جميع الدروس',
    addLesson: 'إضافة درس',
    uploadLesson: 'رفع درس (فيديو، صوت، PDF)',
    searchPlaceholder: 'ابحث عن درس، أستاذ، رقم...',
    noLessonsTitle: 'لا توجد دروس حالياً',
    noLessonsDesc: 'التطبيق نظيف تماماً وخالٍ من البيانات التجريبية. يمكنك الآن رفع وتثبيت دروسك الخاصة (فيديو، صوت MP3، مستندات PDF) بكل سهولة.',
    uploadFirstLesson: 'رفع أول درس الآن',
    filterBySection: 'الأقسام',
    all: 'الكل',
    videoLesson: 'درس مرئي (فيديو)',
    audioLesson: 'درس صوتي (MP3)',
    documentPdf: 'المستند والكتاب (PDF)',
    downloadAudio: 'تحميل الصوت (MP3)',
    downloadPdf: 'تحميل الكتاب (PDF)',
    viewDocument: 'عرض المستند',
    playAudio: 'تشغيل',
    pauseAudio: 'إيقاف مؤقت',
    playbackSpeed: 'السرعة',
    teacher: 'الأستاذ / الشيخ',
    description: 'الوصف والملاحظات',
    share: 'مشاركة',
    shareTelegram: 'مشاركة عبر تيليجرام',
    joinTelegram: 'قناة التيليجرام',
    feedback: 'الملاحظات والأسئلة',
    sendFeedback: 'إرسال ملاحظة',
    bookmark: 'حفظ في المفضلة',
    bookmarks: 'المفضلة',
    completed: 'المكتملة',
    markCompleted: 'تم إكماله',
    markIncomplete: 'إلغاء الإكمال',
    deleteLesson: 'حذف',
    deleteConfirm: 'هل أنت متأكد من حذف هذا الدرس؟',
    editLesson: 'تعديل',
    lessonNumber: 'رقم الدرس',
    lessonTitle: 'عنوان الدرس',
    lessonCategory: 'التصنيف',
    videoSource: 'ملف الفيديو أو الرابط المباشر',
    audioSource: 'ملف الصوت MP3 أو الرابط',
    pdfSource: 'ملف PDF أو الرابط',
    uploadFile: 'اختيار ملف للرفع',
    orEnterUrl: 'أو أدخل الرابط',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    settings: 'الإعدادات',
    backupData: 'نسخ احتياطي',
    resetData: 'مسح كل البيانات',
    nowPlaying: 'قيد التشغيل...',
    selectCategory: 'اختر التصنيف',
    general: 'عام',
    aqeedah: 'عقيدة',
    fiqh: 'فقه',
    hadith: 'حديث',
    tafseer: 'تفسير',
    seerah: 'سيرة',
    tajweed: 'تجويد',
  },
  en: {
    appName: 'Habesha',
    appSubtitle: 'Islamic Educational Platform',
    allLessons: 'All Lessons',
    addLesson: 'Add Lesson',
    uploadLesson: 'Upload Lesson (Video, MP3, PDF)',
    searchPlaceholder: 'Search by lesson title, ustaz, number...',
    noLessonsTitle: 'No Lessons Uploaded Yet',
    noLessonsDesc: 'Your application is completely clean with zero mock data. Upload your own video lessons, MP3 audios, and PDF documents whenever you are ready.',
    uploadFirstLesson: 'Upload Your First Lesson',
    filterBySection: 'Filter by Section',
    all: 'All',
    videoLesson: 'Video Lesson',
    audioLesson: 'Audio Lesson (MP3)',
    documentPdf: 'Reference Document (PDF)',
    downloadAudio: 'Download Audio (MP3)',
    downloadPdf: 'Download Document (PDF)',
    viewDocument: 'View Document',
    playAudio: 'Play Audio',
    pauseAudio: 'Pause',
    playbackSpeed: 'Speed',
    teacher: 'Ustaz / Teacher',
    description: 'Description & Notes',
    share: 'Share',
    shareTelegram: 'Share to Telegram',
    joinTelegram: 'Telegram Channel',
    feedback: 'Feedback & Contact',
    sendFeedback: 'Send Feedback',
    bookmark: 'Bookmark',
    bookmarks: 'Bookmarks',
    completed: 'Completed',
    markCompleted: 'Mark as Completed',
    markIncomplete: 'Mark as Incomplete',
    deleteLesson: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this lesson?',
    editLesson: 'Edit',
    lessonNumber: 'Lesson Number',
    lessonTitle: 'Lesson Title',
    lessonCategory: 'Category',
    videoSource: 'Video File or Stream URL',
    audioSource: 'Audio (MP3) File or Stream URL',
    pdfSource: 'PDF Document File or Link',
    uploadFile: 'Select File to Upload',
    orEnterUrl: 'Or enter streaming URL',
    save: 'Save Lesson',
    cancel: 'Cancel',
    close: 'Close',
    settings: 'Settings',
    backupData: 'Export Backup',
    resetData: 'Clear All Data',
    nowPlaying: 'Now Playing',
    selectCategory: 'Select Category',
    general: 'General',
    aqeedah: 'Aqeedah',
    fiqh: 'Fiqh',
    hadith: 'Hadith',
    tafseer: 'Tafseer',
    seerah: 'Seerah',
    tajweed: 'Tajweed',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('habesha_lang') as SupportedLanguage) || 'am';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('habesha_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
