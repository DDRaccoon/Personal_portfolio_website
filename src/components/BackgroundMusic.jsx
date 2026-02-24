"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic({ enabled = false }) {
  const audioRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const audio = new Audio("/audio/luvsic-part3.mp3");
    audio.loop = true;
    audio.volume = 0.05;
    audioRef.current = audio;

    const setupAudio = async () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        contextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(ctx.destination);

        // Expose analyser globally for AudioCircle
        window.__bgmAnalyser = analyser;
        window.__bgmCtx = ctx;

        await audio.play();
      } catch (error) {
        console.log("Audio setup failed:", error);
      }
    };

    // Setup on first user interaction
    const handleInteraction = () => {
      setupAudio();
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (contextRef.current) {
        contextRef.current.close();
      }
    };
  }, [enabled]);

  return null;
}
