"use client";

import { useEffect, useRef } from "react";
import { GeometryRenderer } from "./GeometryRenderer";
import { ParallaxController } from "./ParallaxController";
import { AudioAnalyser } from "./AudioAnalyser";
import { PerformanceGuard } from "./PerformanceGuard";

/**
 * GeometryBackgroundCanvas — mounts a full-screen 2D canvas
 * and orchestrates the geometry background system.
 */
export default function GeometryBackgroundCanvas() {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const parallaxRef = useRef(null);
  const audioRef = useRef(null);
  const perfRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Instantiate subsystems
    const parallax = new ParallaxController();
    const audio = new AudioAnalyser();
    const perf = new PerformanceGuard();
    const renderer = new GeometryRenderer(canvas, parallax, audio, perf);

    parallaxRef.current = parallax;
    audioRef.current = audio;
    perfRef.current = perf;
    rendererRef.current = renderer;

    // Try to connect audio analyser to the page's <audio> element
    // The audio element is rendered by VisualMusicProvider
    const tryConnectAudio = () => {
      const audioEl = document.querySelector("audio");
      if (audioEl && !audio.isConnected) {
        audio.connect(audioEl);
      }
    };

    // Attempt on mount and on user interaction (audio may not be ready immediately)
    tryConnectAudio();
    const audioCheckInterval = setInterval(tryConnectAudio, 2000);

    // Also try on any user interaction (helps with autoplay policy)
    const onInteraction = () => {
      tryConnectAudio();
      if (audio.isConnected) audio.resume();
    };
    window.addEventListener("pointerdown", onInteraction, { passive: true });
    window.addEventListener("keydown", onInteraction, { passive: true });

    renderer.start();

    return () => {
      clearInterval(audioCheckInterval);
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
      renderer.destroy();
      parallax.destroy();
      audio.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
