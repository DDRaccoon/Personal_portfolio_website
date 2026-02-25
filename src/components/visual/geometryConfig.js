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

  // === B) Circle/Sphere Layer (dot matrix + local interaction) ===
  circles: {
    count: 2,
    baseRadius: [130, 210],

    // Always-on rotation + music boost
    baseRotSpeedX: 0.012,
    baseRotSpeedY: 0.05,
    baseRotSpeedZ: 0.01,
    rotBoostMax: 0.06,

    // Breathing (idle + music)
    breatheAmp: 0.12,
    breathePeriod: 8,

    // Inner geometry — straight lines only
    insideLineCount: 10,
    insideStrokeWidth: 1.15,
    insideOpacity: 0.25,
    insidePointCount: 6,
    insideCenterLines: true,

    // Silhouette + glow
    ringStrokeWidth: 3.2,
    ringOpacity: 0.38,
    ringGlowOpacity: 0.24,
    ringGlowSpread: 1.45,

    // Music smoothing
    musicMultiplier: 3.2,
    musicLerp: 0.10,

    // Positioning — two spheres, left/right with different scales
    positions: [
      { xRatio: 0.26, yRatio: 0.61, radiusScale: 0.82, spinSpeedMul: 0.7, pointCount: 5, lineCount: 8, centerLines: true },
      { xRatio: 0.72, yRatio: 0.43, radiusScale: 1.14, spinSpeedMul: 1.3, pointCount: 8, lineCount: 14, centerLines: false },
    ],

    color: "orange",
  },

  // === 3 Parallax ===
  parallax: {
    mouse: {
      far: 4,
      mid: 6,        // reduced to prevent spheres leaving viewport
      near: 16,
      lerp: 0.06,
    },
    scroll: {
      far: 0.2,
      mid: 0.18,     // reduced to prevent spheres leaving viewport
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
