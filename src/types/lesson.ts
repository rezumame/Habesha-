export interface MediaSource {
  type: 'upload' | 'url';
  url: string; // Object URL or remote URL
  fileName?: string;
  sizeBytes?: number;
  duration?: string;
  fileBlob?: Blob;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  titleArabic?: string;
  titleAmharic?: string;
  category: string;
  teacher: string;
  description: string;
  video?: MediaSource;
  audio?: MediaSource;
  pdf?: MediaSource;
  createdAt: string;
  updatedAt: string;
  isBookmarked?: boolean;
  isCompleted?: boolean;
}

export type SectionFilter = 'all' | '1-5' | '6-10' | '11-15' | '16-20' | '21+' | string;

export type SupportedLanguage = 'am' | 'ar' | 'en';
