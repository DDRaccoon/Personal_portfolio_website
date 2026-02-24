"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const MUSIC_MUTED_KEY = "ta_portfolio_music_muted";
const MUSIC_UNLOCKED_KEY = "ta_portfolio_music_unlocked";

const VisualMusicContext = createContext(null);

function getSavedBool(key, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

export function VisualMusicProvider({ children }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEnablePrompt, setShowEnablePrompt] = useState(false);

  const syncAudioState = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(!audio.paused);
    setIsMuted(audio.muted);
  };

  const tryAutoplay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setShowEnablePrompt(false);
      setIsPlaying(true);
      window.localStorage.setItem(MUSIC_UNLOCKED_KEY, "true");
    } catch {
      setShowEnablePrompt(true);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedMuted = getSavedBool(MUSIC_MUTED_KEY, false);
    audio.muted = savedMuted;
    setIsMuted(savedMuted);

    const savedUnlocked = getSavedBool(MUSIC_UNLOCKED_KEY, false);
    if (!savedMuted) {
      tryAutoplay();
    } else if (savedUnlocked) {
      setShowEnablePrompt(false);
    }

    const updateState = () => syncAudioState();
    audio.addEventListener("play", updateState);
    audio.addEventListener("pause", updateState);
    audio.addEventListener("volumechange", updateState);

    const unlockOnInteraction = () => {
      if (audio.muted) return;
      if (!audio.paused) return;
      tryAutoplay();
    };

    window.addEventListener("pointerdown", unlockOnInteraction, { once: false });
    window.addEventListener("keydown", unlockOnInteraction, { once: false });

    return () => {
      audio.removeEventListener("play", updateState);
      audio.removeEventListener("pause", updateState);
      audio.removeEventListener("volumechange", updateState);
      window.removeEventListener("pointerdown", unlockOnInteraction);
      window.removeEventListener("keydown", unlockOnInteraction);
    };
  }, []);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
    window.localStorage.setItem(MUSIC_MUTED_KEY, String(nextMuted));

    if (!nextMuted) {
      await tryAutoplay();
    } else {
      setShowEnablePrompt(false);
    }
  };

  const value = useMemo(
    () => ({
      isMuted,
      isPlaying,
      toggleMute,
      showEnablePrompt,
      tryAutoplay,
    }),
    [isMuted, isPlaying, showEnablePrompt]
  );

  return (
    <VisualMusicContext.Provider value={value}>
      <audio ref={audioRef} src="/audio/bg.mp3" loop preload="auto" />
      {children}
    </VisualMusicContext.Provider>
  );
}

export function useVisualMusic() {
  const context = useContext(VisualMusicContext);
  if (!context) {
    throw new Error("useVisualMusic must be used inside VisualMusicProvider");
  }
  return context;
}
