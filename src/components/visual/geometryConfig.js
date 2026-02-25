/**
 * Geometry Background Configuration
 * All tunable visual parameters in one place.
 */

export const GEO_CONFIG = {
  // === Colors ===
  colors: {
    background: "#000000",
    orange: "#FF7A18",
    orangeRgb: [255, 122, 24],
    white: "#FFFFFF",
    whiteRgb: [255, 255, 255],
  },

  // === A) Aurora Gradient Field ===
  aurora: {
    enabled: true,
    blobs: [
      { color: [27, 42, 107],  x: 0.15, y: 0.25, radius: 0.45 }, // Deep Blue
      { color: [75, 43, 111],  x: 0.75, y: 0.20, radius: 0.40 }, // Purple
      { color: [14, 74, 74],   x: 0.55, y: 0.75, radius: 0.38 }, // Teal
      { color: [90, 44, 12],   x: 0.25, y: 0.80, radius: 0.35 }, // Warm Amber
    ],
    intensity: 0.12,          // 0.05–0.18 global alpha multiplier
    driftSpeed: 0.00008,      // noise speed for position warp (8–20s cycle)
    driftAmplitude: 0.08,     // how far blobs wander (fraction of canvas)
    noiseScale: 0.3,          // spatial noise frequency for warp
    scrollHueShift: 12,       // ±degrees hue shift linked to scroll (0 to disable)
  },

  // === 2.1 Point Field ===
  points: {
    count: 150,
    minAlpha: 0.12,
    maxAlpha: 0.35,
    radius: 1.5,
    driftSpeed: 0.15,
    color: "white",
    orangeRatio: 0.08,
  },

  // === 2.2 Line Network ===
  lines: {
    maxDistance: 120,
    maxConnections: 3,
    lineWidth: 0.5,
    minAlpha: 0.06,
    maxAlpha: 0.18,
    orangeHighlightRatio: 0.08,
  },

  // === 2.3 Wireframe Mountains ===
  mountains: {
    layers: 4,
    heightRatio: 0.30,
    segmentCount: 80,
    noiseScale: 0.004,
    noiseSpeed: 0.0003,
    lineWidth: 0.8,
    baseAlpha: 0.12,
    frontAlpha: 0.25,
    color: "white",
  },

  // === 2.4 Streak Meteors ===
  meteors: {
    interval: [2000, 6000],
    speed: [4, 8],
    length: [60, 160],
    headSize: 3,
    lineWidth: 1.5,
    color: "orange",
    angle: -30,
    glowRadius: 12,
  },

  // === B) Circle Layer (single outer ring + inner geometry lines) ===
  circles: {
    count: 2,
    baseRadius: [140, 220],

    // Outer ring — ONE ring only, thick and prominent
    ringStrokeWidth: 4.5,        // 3–6px (desktop 4–5, mobile 3–4)
    ringOpacity: 0.40,           // 0.25–0.60
    ringGlowOpacity: 0.16,      // 0.10–0.25 subtle inner glow
    ringGlowSpread: 1.25,       // glow radius = ring radius × this

    // Inner geometry — straight lines only, NO arcs/circles
    insideLineCount: 10,         // 6–16 line segments inside
    insideStrokeWidth: 1.2,      // 1–2px (thinner than outer ring)
    insideOpacity: 0.22,         // 0.12–0.35
    insidePointCount: 6,         // anchor points on ring edge (vertices)
    insideCenterLines: true,     // draw lines from center to edge points

    // Breathing (idle — no music, period ~8s)
    breathSpeed: 0.12,
    breathScale: [0.03, 0.07],

    // Music reactivity
    bassRadiusAmp: 0.08,         // 0.04–0.10 bass → outer ring radius ±
    musicMultiplier: 2.5,
    musicLerp: 0.12,             // smooth factor (prevents jitter)

    // Positioning — avoid text, prefer mid-right / mid-left
    positions: [
      { xRatio: 0.72, yRatio: 0.38 },
      { xRatio: 0.22, yRatio: 0.62 },
    ],

    color: "orange",
  },

  // === 3 Parallax ===
  parallax: {
    mouse: {
      far: 4,
      mid: 14,       // ↑ from 10 → more obvious circle movement
      near: 16,
      lerp: 0.06,
    },
    scroll: {
      far: 0.2,
      mid: 0.55,     // ↑ from 0.45
      near: 0.9,
      lerp: 0.08,
    },
  },

  // === 4.2 Performance Guard ===
  performance: {
    fpsThreshold: 30,
    degradeAfterMs: 2000,
    levels: [
      { pointCount: 150, linesEnabled: true,  meteorsEnabled: true,  musicReactive: true,  auroraEnabled: true  },
      { pointCount: 80,  linesEnabled: true,  meteorsEnabled: true,  musicReactive: true,  auroraEnabled: true  },
      { pointCount: 60,  linesEnabled: false, meteorsEnabled: true,  musicReactive: false, auroraEnabled: false },
      { pointCount: 30,  linesEnabled: false, meteorsEnabled: false, musicReactive: false, auroraEnabled: false },
    ],
  },

  // === 4.3 Content Safety Zone (stronger vignette) ===
  safetyZone: {
    vignetteStrength: 0.50,   // 0.35–0.65 center-area darkening
    vignetteRadius: 0.40,
    edgeDarken: 0.15,         // extra darkening at screen edges
  },
};
