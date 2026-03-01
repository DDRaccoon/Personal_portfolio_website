"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Lightbox({ src, alt, caption, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt || ""}
          className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        />
        {caption && (
          <p className="mt-3 text-center text-sm tracking-wide text-white/55">
            {caption}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white/70 shadow-lg backdrop-blur-sm transition-colors hover:bg-black hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
