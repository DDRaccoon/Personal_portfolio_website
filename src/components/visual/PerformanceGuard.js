/**
 * PerformanceGuard — monitors FPS and returns degradation level.
 * Level 0 = full quality, Level 3 = minimal static background.
 */

import { GEO_CONFIG } from "./geometryConfig";

export class PerformanceGuard {
  constructor() {
    this.level = 0;
    this._frames = 0;
    this._lastTime = performance.now();
    this._fps = 60;
    this._lowFpsStart = 0;
    this._degradeAfterMs = GEO_CONFIG.performance.degradeAfterMs;
    this._fpsThreshold = GEO_CONFIG.performance.fpsThreshold;
    this._maxLevel = GEO_CONFIG.performance.levels.length - 1;
  }

  /**
   * Call once per frame. Returns current degradation level.
   */
  tick() {
    this._frames++;
    const now = performance.now();
    const elapsed = now - this._lastTime;

    // Measure FPS every ~500ms
    if (elapsed >= 500) {
      this._fps = (this._frames / elapsed) * 1000;
      this._frames = 0;
      this._lastTime = now;

      if (this._fps < this._fpsThreshold) {
        if (this._lowFpsStart === 0) {
          this._lowFpsStart = now;
        } else if (now - this._lowFpsStart > this._degradeAfterMs) {
          // Sustained low FPS — degrade one level
          if (this.level < this._maxLevel) {
            this.level++;
            this._lowFpsStart = 0; // reset timer for next potential degrade
          }
        }
      } else {
        // FPS recovered — reset timer (don't auto-upgrade, stay at current level)
        this._lowFpsStart = 0;
      }
    }

    return this.level;
  }

  /**
   * Get current quality settings based on degradation level.
   */
  getSettings() {
    return GEO_CONFIG.performance.levels[this.level];
  }

  get fps() {
    return Math.round(this._fps);
  }
}
