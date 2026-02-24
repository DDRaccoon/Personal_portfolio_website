"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MeteorParticles({ count = 15 }) {
  const meshRef = useRef();

  const meteors = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const lifetimes = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      velocities.push({
        x: (Math.random() - 0.7) * 0.15,
        y: -(Math.random() * 0.1 + 0.05),
        z: 0
      });

      lifetimes.push(Math.random() * 100);
    }

    return { positions, velocities, lifetimes };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      meteors.lifetimes[i]++;

      positions[i * 3] += meteors.velocities[i].x;
      positions[i * 3 + 1] += meteors.velocities[i].y;

      if (positions[i * 3 + 1] < -10 || meteors.lifetimes[i] > 200) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = Math.random() * 15 + 5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

        meteors.velocities[i] = {
          x: (Math.random() - 0.7) * 0.15,
          y: -(Math.random() * 0.1 + 0.05),
          z: 0
        };
        meteors.lifetimes[i] = 0;
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={meteors.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffaa55"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
