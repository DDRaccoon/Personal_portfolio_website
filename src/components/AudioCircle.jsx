"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AudioCircle() {
  const ringRef = useRef();
  const analyserData = useRef(new Uint8Array(128));

  useFrame((state) => {
    if (!ringRef.current) return;
    const time = state.clock.elapsedTime;

    // Try to get audio data
    if (window.__bgmAnalyser) {
      window.__bgmAnalyser.getByteFrequencyData(analyserData.current);
    }

    // Calculate average frequency
    let avg = 0;
    for (let i = 0; i < analyserData.current.length; i++) {
      avg += analyserData.current[i];
    }
    avg = avg / analyserData.current.length / 255;

    // Animate ring based on audio
    const scale = 1 + avg * 0.5;
    ringRef.current.scale.set(scale, scale, 1);
    ringRef.current.rotation.z = time * 0.1;
    ringRef.current.material.opacity = 0.3 + avg * 0.5;
  });

  return (
    <mesh ref={ringRef} position={[0, 0, -2]}>
      <ringGeometry args={[1.8, 2, 64]} />
      <meshBasicMaterial
        color="#ff6622"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
