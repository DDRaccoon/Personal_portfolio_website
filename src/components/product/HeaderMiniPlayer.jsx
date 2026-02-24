"use client";

import Icon from "../ui/Icon";
import { useVisualMusic } from "../visual/VisualMusicProvider";
import { siteCopy } from "../../content/copy/en";

export default function HeaderMiniPlayer() {
  const { isMuted, isPlaying, toggleMute, showEnablePrompt, tryAutoplay } = useVisualMusic();

  return (
    <header
      className="sticky top-0 z-30 h-16"
      style={{
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,122,24,0.12)",
      }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4">
        {/* Mute toggle button */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? siteCopy.music.unmuteLabel : siteCopy.music.muteLabel}
          title={isMuted ? siteCopy.music.unmuteLabel : siteCopy.music.muteLabel}
          className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
          style={{
            border: isMuted
              ? "1px solid rgba(255,122,24,0.25)"
              : "1px solid rgba(255,122,24,0.7)",
            background: isMuted
              ? "rgba(255,122,24,0.04)"
              : "rgba(255,122,24,0.12)",
            boxShadow: isMuted
              ? "none"
              : "0 0 12px rgba(255,122,24,0.25)",
            color: "#FF7A18",
          }}
        >
          {isMuted ? (
            <Icon size={16}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m18 9 4 4m0-4-4 4" />
              </svg>
            </Icon>
          ) : (
            <Icon size={16}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7m2.5-9.5a8.5 8.5 0 0 1 0 12" />
              </svg>
            </Icon>
          )}
        </button>

        {/* Track info + playing indicator */}
        <div className="flex items-center gap-2 overflow-hidden">
          {isPlaying && !isMuted ? (
            /* animated bars */
            <span className="flex items-end gap-[2px]" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="inline-block w-[3px] rounded-sm"
                  style={{
                    height: `${8 + (i % 3) * 4}px`,
                    background: "#FF7A18",
                    animation: `musicBar${i} 0.6s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </span>
          ) : (
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: isMuted ? "rgba(255,255,255,0.2)" : "rgba(255,122,24,0.5)" }}
            />
          )}
          <span
            className="truncate text-xs tracking-wide"
            style={{ color: "rgba(255,255,255,0.45)", maxWidth: 200 }}
          >
            {isMuted ? "Sound off" : isPlaying ? "Now playing" : "Paused"}
          </span>
        </div>
      </div>

      {/* Enable sound prompt */}
      {showEnablePrompt && (
        <button
          type="button"
          onClick={tryAutoplay}
          className="absolute left-4 top-[68px] rounded border px-3 py-1 text-xs transition-all"
          style={{
            background: "rgba(0,0,0,0.75)",
            borderColor: "rgba(255,122,24,0.4)",
            color: "#FF7A18",
            backdropFilter: "blur(8px)",
          }}
        >
          {siteCopy.music.enablePrompt}
        </button>
      )}

      <style>{`
        @keyframes musicBar1 { from { height: 6px; } to { height: 14px; } }
        @keyframes musicBar2 { from { height: 10px; } to { height: 5px; } }
        @keyframes musicBar3 { from { height: 7px; } to { height: 15px; } }
        @keyframes musicBar4 { from { height: 12px; } to { height: 6px; } }
      `}</style>
    </header>
  );
}
