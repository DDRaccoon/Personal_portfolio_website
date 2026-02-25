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

  // === B) Music-reactive Circles (enhanced — HUD/Orbital style) ===
  circles: {
    count: 2,                    // 1–3 large circles
    baseRadius: [140, 220],      // px — larger for more presence
    stroke: 2.2,                 // 1.5–3px (clearly thicker than line network 0.5px)
    alpha: 0.22,                 // base stroke alpha
    fillOpacity: 0.04,           // 0.03–0.08 semi-transparent fill
    glowOpacity: 0.14,           // 0.08–0.22 inner glow
    glowSpread: 1.35,            // glow radius = ring radius × this

    // Breathing (idle — no music)
    breathSpeed: 0.12,           // cycles per second (period ~8s)
    breathScale: [0.03, 0.07],   // idle radius variation ±3%–7%

    // Music reactivity (stronger)
    bassRadiusAmp: 0.08,         // 0.04–0.10 bass → radius
    midFlickerAmp: 0.04,         // 0.02–0.06 mid → tick/detail flicker
    musicMultiplier: 2.5,        // overall music energy scale
    musicLerp: 0.12,             // smooth factor (prevents jitter)

    // Concentric rings
    concentricRings: 4,
    ringGap: 22,

    // HUD tick marks (orbital detail)
    tickCount: 36,               // small tick marks around outermost ring
    tickLength: 6,               // px
    tickWidth: 1,
    tickAlpha: 0.18,

    // Positioning — avoid text, prefer mid-right / mid-left
    positions: [
      { xRatio: 0.72, yRatio: 0.38 },  // circle 1: right-center
      { xRatio: 0.22, yRatio: 0.62 },  // circle 2: left-lower
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
