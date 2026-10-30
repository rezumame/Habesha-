import { Lesson } from '../types/lesson';

const DB_NAME = 'HabeshaIslamicDB';
const DB_VERSION = 1;
const STORE_NAME = 'lessons';

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('lessonNumber', 'lessonNumber', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Convert stored DB record to Lesson with active ObjectURLs for any binary blobs
function recordToLesson(record: any): Lesson {
  const lesson: Lesson = {
    ...record,
  };

  // If video has stored blob, generate object URL
  if (record.videoBlob && record.video) {
    lesson.video = {
      ...record.video,
      url: URL.createObjectURL(record.videoBlob),
      fileBlob: record.videoBlob,
    };
  }

  // If audio has stored blob, generate object URL
  if (record.audioBlob && record.audio) {
    lesson.audio = {
      ...record.audio,
      url: URL.createObjectURL(record.audioBlob),
      fileBlob: record.audioBlob,
    };
  }

  // If pdf has stored blob, generate object URL
  if (record.pdfBlob && record.pdf) {
    lesson.pdf = {
      ...record.pdf,
      url: URL.createObjectURL(record.pdfBlob),
      fileBlob: record.pdfBlob,
    };
  }

  return lesson;
}

// Convert Lesson to DB record storing binary blobs separately
function lessonToRecord(lesson: Lesson): any {
  const { video, audio, pdf, ...meta } = lesson;
  const record: any = {
    ...meta,
    video: video ? { ...video, url: video.type === 'url' ? video.url : '' } : undefined,
    videoBlob: video?.fileBlob || null,
    audio: audio ? { ...audio, url: audio.type === 'url' ? audio.url : '' } : undefined,
    audioBlob: audio?.fileBlob || null,
    pdf: pdf ? { ...pdf, url: pdf.type === 'url' ? pdf.url : '' } : undefined,
    pdfBlob: pdf?.fileBlob || null,
  };

  return record;
}

export const StorageService = {
  async getAllLessons(): Promise<Lesson[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const records = request.result || [];
          const lessons = records.map(recordToLesson);
          // Sort by lessonNumber ascending
          lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
          resolve(lessons);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error('Error reading lessons from IndexedDB', err);
      return [];
    }
  },

  async saveLesson(lesson: Lesson): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record = lessonToRecord(lesson);
      const request = store.put(record);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async updateLesson(lesson: Lesson): Promise<void> {
    return this.saveLesson(lesson);
  },

  async deleteLesson(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async toggleBookmark(id: string): Promise<boolean> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const record = getReq.result;
        if (!record) {
          resolve(false);
          return;
        }
        record.isBookmarked = !record.isBookmarked;
        const putReq = store.put(record);
        putReq.onsuccess = () => resolve(record.isBookmarked);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  async toggleCompleted(id: string): Promise<boolean> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);

      getReq.onsuccess = () => {
        const record = getReq.result;
        if (!record) {
          resolve(false);
          return;
        }
        record.isCompleted = !record.isCompleted;
        const putReq = store.put(record);
        putReq.onsuccess = () => resolve(record.isCompleted);
        putReq.onerror = () => reject(putReq.error);
      };
      getReq.onerror = () => reject(getReq.error);
    });
  },

  // Export metadata backup
  async exportMetadataJSON(): Promise<string> {
    const lessons = await this.getAllLessons();
    const cleanLessons = lessons.map(l => ({
      ...l,
      video: l.video ? { type: l.video.type, url: l.video.type === 'url' ? l.video.url : '', fileName: l.video.fileName } : undefined,
      audio: l.audio ? { type: l.audio.type, url: l.audio.type === 'url' ? l.audio.url : '', fileName: l.audio.fileName } : undefined,
      pdf: l.pdf ? { type: l.pdf.type, url: l.pdf.type === 'url' ? l.pdf.url : '', fileName: l.pdf.fileName } : undefined,
    }));
    return JSON.stringify(cleanLessons, null, 2);
  },

  // Clear all data if user wants a complete reset
  async clearAllLessons(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};
