"use client";

import VisualBackground from "./VisualBackground";
import { VisualMusicProvider } from "./VisualMusicProvider";

export default function VisualShell({ children }) {
  return (
    <VisualMusicProvider>
      <VisualBackground />
      {children}
    </VisualMusicProvider>
  );
}
