"use client";

import { useState } from "react";
import Icon from "../ui/Icon";
import { useLanguage, useSiteCopy } from "../i18n/LanguageProvider";
import { useAdmin } from "../auth/AdminProvider";
import { useVisualMusic } from "../visual/VisualMusicProvider";

export default function HeaderMiniPlayer() {
  const { locale, toggleLocale } = useLanguage();
  const siteCopy = useSiteCopy();
  const { isAdmin, login, logout } = useAdmin();
  const { isMuted, isPlaying, volume, setVolume, toggleMute, showEnablePrompt, tryAutoplay } = useVisualMusic();
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPwInput, setShowPwInput] = useState(false);

  const handlePwSubmit = () => {
    if (login(pw)) {
      setPw("");
      setPwError(false);
      setShowPwInput(false);
    } else {
      setPwError(true);
    }
  };

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

        <div className="flex items-center pr-2">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(volume * 100)}
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            aria-label={siteCopy.music.volumeLabel}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(255,122,24,0.9) 0%, rgba(255,122,24,0.9) var(--volume), rgba(255,255,255,0.15) var(--volume), rgba(255,255,255,0.15) 100%)",
              "--volume": `${Math.round(volume * 100)}%`,
            }}
          />
        </div>

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
            {isMuted ? siteCopy.music.soundOff : isPlaying ? siteCopy.music.nowPlaying : siteCopy.music.paused}
          </span>
        </div>

        {/* Spacer to push right-side controls */}
        <div className="ml-auto flex items-center gap-2">
          {/* Admin lock control */}
          {isAdmin ? (
            <button
              type="button"
              onClick={logout}
              title="Admin (click to lock)"
              className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
              style={{
                borderColor: "rgba(255,122,24,0.6)",
                color: "#FF7A18",
                background: "rgba(255,122,24,0.12)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
          ) : showPwInput ? (
            <form
              className="flex items-center gap-1.5"
              onSubmit={(e) => { e.preventDefault(); handlePwSubmit(); }}
            >
              <input
                type="password"
                value={pw}
                onChange={(e) => { setPw(e.target.value); setPwError(false); }}
                placeholder="Password"
                autoFocus
                className="h-7 w-24 rounded border bg-transparent px-2 text-xs text-white/80 placeholder-white/25 outline-none transition-colors"
                style={{
                  borderColor: pwError ? "rgba(239,68,68,0.5)" : "rgba(255,122,24,0.3)",
                }}
              />
              <button
                type="submit"
                className="flex h-7 w-7 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: "rgba(255,122,24,0.4)",
                  color: "#FF7A18",
                  background: "rgba(255,122,24,0.08)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => { setShowPwInput(false); setPw(""); setPwError(false); }}
                className="flex h-7 w-7 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowPwInput(true)}
              title="Admin login"
              className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.35)",
                background: "transparent",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
            </button>
          )}

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={siteCopy.music.languageToggleLabel}
            title={siteCopy.music.languageToggleLabel}
            className="h-8 rounded-full border px-3 text-xs tracking-wide transition-colors"
            style={{
              borderColor: "rgba(255,122,24,0.4)",
              color: "#FFB58C",
              background: "rgba(255,122,24,0.08)",
            }}
          >
            {locale === "en" ? "EN" : "中文"}
          </button>
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
