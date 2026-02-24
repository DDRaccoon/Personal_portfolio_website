"use client";

import InteractiveBackground from "../InteractiveBackground";

export default function VisualBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <InteractiveBackground />
    </div>
  );
}
