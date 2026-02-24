'use client';

import { useState, useEffect, useRef } from 'react';
import { MusicIcon, SoundOffIcon, SoundOnIcon } from './icons';

export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(null);

  // 尝试自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        // 自动播放失败，显示提示
        setShowPrompt(true);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, []);

  // 处理用户交互
  const handleUserInteraction = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setUserInteracted(true);
    setShowPrompt(false);

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setShowPrompt(true);
    }
  };

  // 如果用户关闭了音乐，本次会话不再自动播放
  useEffect(() => {
    if (!isPlaying && userInteracted) {
      // 用户主动关闭，不再尝试自动播放
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [isPlaying, userInteracted]);

  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        loop
        muted={false}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/music/background.mp3" type="audio/mpeg" />
        <source src="/music/background.ogg" type="audio/ogg" />
      </audio>

      {/* 音乐控制按钮 */}
      <div className="fixed bottom-4 right-4 z-50">
        {showPrompt ? (
          <button
            onClick={handleUserInteraction}
            className="bg-accent-orange text-text-strong px-3 py-2 rounded-button text-sm font-medium transition-hover hover:opacity-90"
          >
            Click to enable sound
          </button>
        ) : (
          <button
            onClick={handleUserInteraction}
            className="bg-bg-1 border border-border text-text-strong p-2 rounded-button transition-hover hover:bg-accent-orange hover:border-accent-orange"
            title={isPlaying ? 'Mute music' : 'Play music'}
          >
            {isPlaying ? <SoundOnIcon size={16} /> : <SoundOffIcon size={16} />}
          </button>
        )}
      </div>
    </>
  );
}