"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import BackgroundLightPoints from "./BackgroundLightPoints";
import AudioCircle from "./AudioCircle";
import MeteorParticles from "./MeteorParticles";

export default function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <BackgroundLightPoints count={200} />
          <AudioCircle />
          <MeteorParticles count={15} />
        </Suspense>
      </Canvas>
    </div>
  );
}
