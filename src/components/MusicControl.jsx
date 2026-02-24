"use client";

import { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";

export default function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.05);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const audioRef = useRef(null);
  const dropdownRef = useRef(null);

  // 检查音频状态并自动播放
  useEffect(() => {
    const checkAudioStatus = () => {
      if (audioRef.current) {
        setIsPlaying(!audioRef.current.paused);
      }
    };

    const interval = setInterval(checkAudioStatus, 1000);
    
    // 尝试自动播放
    const attemptAutoPlay = async () => {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Auto-play prevented by browser');
        }
      }
    };

    // 延迟尝试自动播放
    setTimeout(attemptAutoPlay, 1000);

    return () => clearInterval(interval);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 初始化音频
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // 设置音频分析器
      const setupAudioAnalyser = () => {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx && !window.__bgmCtx) {
          const ctx = new Ctx();
          window.__bgmCtx = ctx;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          window.__bgmAnalyser = analyser;

          const srcNode = ctx.createMediaElementSource(audioRef.current);
          srcNode.connect(analyser);
          analyser.connect(ctx.destination);
        }
      };

      // 用户交互后设置分析器
      const setupOnInteraction = () => {
        setupAudioAnalyser();
        document.removeEventListener('click', setupOnInteraction);
        document.removeEventListener('keydown', setupOnInteraction);
      };

      document.addEventListener('click', setupOnInteraction);
      document.addEventListener('keydown', setupOnInteraction);
    }
  }, [volume]);

  // 控制播放/暂停
  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // 控制音量
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 下拉菜单动画
  const dropdownAnimation = useSpring({
    opacity: isDropdownOpen ? 1 : 0,
    transform: isDropdownOpen ? "translateY(0)" : "translateY(-10px)",
    config: { tension: 300, friction: 30 }
  });

  return (
    <>
      {/* 隐藏的音频元素 */}
      <audio ref={audioRef} src="/audio/luvsic-part3.mp3" preload="auto" loop />
      
      {/* Music control container */}
      <div className="fixed top-4 left-4 z-50" ref={dropdownRef}>
        {/* Music icon button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-transparent border-0 p-0 transition-all duration-300 group"
        >
          {/* 音乐图标 SVG - 线框风格 */}
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#ea580c" 
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isPlaying ? 'animate-spin' : ''}`}
            style={{ 
              animationDuration: '3s',
              animationTimingFunction: 'linear',
              filter: 'drop-shadow(0 0 4px rgba(234, 88, 12, 0.5))'
            }}
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <animated.div 
            style={dropdownAnimation}
            className="absolute top-full left-0 mt-2 bg-orange-950/90 backdrop-blur-md border border-orange-400/50 rounded-lg p-4 min-w-[200px] shadow-xl shadow-orange-500/20"
          >
            {/* Play/Pause control */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-sm font-medium">Music</span>
              <button
                onClick={togglePlay}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  isPlaying 
                    ? 'text-orange-400 hover:text-orange-300' 
                    : 'text-gray-600 hover:text-gray-500'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>

            {/* Volume control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-xs">Volume</span>
                <span className="text-white/60 text-xs">{Math.round(volume * 100)}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, white ${volume * 500}%, rgba(255,255,255,0.2) ${volume * 500}%)`
                  }}
                />
              </div>
            </div>
          </animated.div>
        )}
      </div>

      {/* Custom slider styles */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #fb923c;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid rgba(251,146,60,0.5);
          box-shadow: 0 0 8px rgba(251,146,60,0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #fb923c;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid rgba(251,146,60,0.5);
          box-shadow: 0 0 8px rgba(251,146,60,0.5);
        }
        
        .slider::-webkit-slider-thumb:hover {
          background: #f97316;
          transform: scale(1.1);
          box-shadow: 0 0 12px rgba(249,115,22,0.7);
        }
        
        .slider::-moz-range-thumb:hover {
          background: #f97316;
          transform: scale(1.1);
          box-shadow: 0 0 12px rgba(249,115,22,0.7);
        }
      `}</style>
    </>
  );
}
