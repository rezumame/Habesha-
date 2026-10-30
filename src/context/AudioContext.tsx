import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Lesson } from '../types/lesson';

interface AudioContextType {
  currentLesson: Lesson | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  playLessonAudio: (lesson: Lesson) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  seekRelative: (offsetSeconds: number) => void;
  setRate: (rate: number) => void;
  setVolumeLevel: (vol: number) => void;
  downloadAudioFile: (lesson: Lesson) => void;
  closeAudioBar: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audioElementRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      audio.playbackRate = playbackRate;
    };
    const onEnded = () => setIsPlaying(false);
    const onError = (e: any) => {
      console.warn('Audio playback error', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const playLessonAudio = (lesson: Lesson) => {
    if (!lesson.audio?.url) return;
    const audio = audioElementRef.current;
    if (!audio) return;

    if (currentLesson?.id === lesson.id && audio.src) {
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    setCurrentLesson(lesson);
    audio.src = lesson.audio.url;
    audio.playbackRate = playbackRate;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const togglePlay = () => {
    const audio = audioElementRef.current;
    if (!audio || !audio.src) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const pause = () => {
    const audio = audioElementRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    const audio = audioElementRef.current;
    if (audio && Number.isFinite(time)) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
      setCurrentTime(audio.currentTime);
    }
  };

  const seekRelative = (offset: number) => {
    const audio = audioElementRef.current;
    if (audio) {
      seek(audio.currentTime + offset);
    }
  };

  const setRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = rate;
    }
  };

  const setVolumeLevel = (vol: number) => {
    setVolume(vol);
    if (audioElementRef.current) {
      audioElementRef.current.volume = vol;
    }
  };

  const downloadAudioFile = (lesson: Lesson) => {
    if (!lesson.audio?.url) return;
    const link = document.createElement('a');
    link.href = lesson.audio.url;
    link.download = lesson.audio.fileName || `Habesha_Lesson_${lesson.lessonNumber}_${lesson.title.replace(/\s+/g, '_')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeAudioBar = () => {
    pause();
    setCurrentLesson(null);
  };

  return (
    <AudioContext.Provider
      value={{
        currentLesson,
        isPlaying,
        currentTime,
        duration,
        playbackRate,
        volume,
        playLessonAudio,
        togglePlay,
        pause,
        seek,
        seekRelative,
        setRate,
        setVolumeLevel,
        downloadAudioFile,
        closeAudioBar,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
