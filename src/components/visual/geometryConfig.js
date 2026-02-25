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

  // === 2.1 Point Field ===
  points: {
    count: 150,           // 80–250, auto-scaled by perf guard
    minAlpha: 0.12,
    maxAlpha: 0.35,
    radius: 1.5,          // px
    driftSpeed: 0.15,     // px/frame at 60fps
    color: "white",       // "white" | "orange"
    orangeRatio: 0.08,    // 8% of points are orange
  },

  // === 2.2 Line Network ===
  lines: {
    maxDistance: 120,      // px — connect points within this range
    maxConnections: 3,     // per point
    lineWidth: 0.5,
    minAlpha: 0.06,
    maxAlpha: 0.18,
    orangeHighlightRatio: 0.08, // 8% of lines get orange tint
  },

  // === 2.3 Wireframe Mountains ===
  mountains: {
    layers: 4,            // number of terrain layers
    heightRatio: 0.30,    // occupy bottom 30% of canvas
    segmentCount: 80,     // vertices per layer
    noiseScale: 0.004,    // perlin noise frequency
    noiseSpeed: 0.0003,   // animation speed
    lineWidth: 0.8,
    baseAlpha: 0.12,      // back layers more transparent
    frontAlpha: 0.25,     // front layer
    color: "white",
  },

  // === 2.4 Streak Meteors ===
  meteors: {
    interval: [2000, 6000], // ms between meteors
    speed: [4, 8],          // px/frame
    length: [60, 160],      // trail length px
    headSize: 3,            // glow head radius
    lineWidth: 1.5,
    color: "orange",
    angle: -30,             // degrees from horizontal (top-right to bottom-left)
    glowRadius: 12,
  },

  // === 2.5 Music-reactive Circles ===
  circles: {
    count: 2,               // 1–3 large circles
    baseRadius: [120, 200],  // px — range for each circle
    lineWidth: 1,
    alpha: 0.15,
    breathScale: [0.02, 0.06], // ±2%–6% radius variation
    breathSpeed: 0.02,          // idle breathing speed
    musicMultiplier: 1.5,       // how much music energy amplifies
    color: "orange",
    concentricRings: 3,         // rings per circle
    ringGap: 18,                // px between concentric rings
  },

  // === 3.1 Mouse Parallax ===
  parallax: {
    mouse: {
      far: 4,      // px max displacement
      mid: 10,
      near: 16,
      lerp: 0.06,  // easeOut interpolation factor
    },
    // === 3.2 Scroll Parallax ===
    scroll: {
      far: 0.2,    // multiplier of scroll position
      mid: 0.45,
      near: 0.9,
      lerp: 0.08,
    },
  },

  // === 4.2 Performance Guard ===
  performance: {
    fpsThreshold: 30,
    degradeAfterMs: 2000,
    levels: [
      // level 0: full quality (default)
      { pointCount: 150, linesEnabled: true, meteorsEnabled: true, musicReactive: true },
      // level 1: reduce particles + lines
      { pointCount: 80,  linesEnabled: true, meteorsEnabled: true, musicReactive: true },
      // level 2: disable lines + reduce meteors
      { pointCount: 60,  linesEnabled: false, meteorsEnabled: true, musicReactive: false },
      // level 3: minimal — static dots only
      { pointCount: 30,  linesEnabled: false, meteorsEnabled: false, musicReactive: false },
    ],
  },

  // === 4.3 Content Safety Zone ===
  safetyZone: {
    vignetteAlpha: 0.55,    // center darkening strength
    vignetteRadius: 0.45,   // 0=center, 1=edge (how far the clear zone extends)
  },
};
