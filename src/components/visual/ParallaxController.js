/**
 * ParallaxController — tracks mouse + scroll for 3-layer parallax.
 * Outputs smooth offset values for far/mid/near layers.
 */

import { GEO_CONFIG } from "./geometryConfig";

export class ParallaxController {
  constructor() {
    const cfg = GEO_CONFIG.parallax;

    // Mouse state
    this._mouseX = 0.5; // normalised 0–1
    this._mouseY = 0.5;
    this.mouseOffsetX = { far: 0, mid: 0, near: 0 };
    this.mouseOffsetY = { far: 0, mid: 0, near: 0 };

    // Scroll state
    this._scrollProgress = 0; // 0–1 page progress
    this.scrollOffset = { far: 0, mid: 0, near: 0 };

    // Config
    this._mouseCfg = cfg.mouse;
    this._scrollCfg = cfg.scroll;

    // Bind handlers
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onScroll = this._onScroll.bind(this);

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", this._onMouseMove, { passive: true });
      window.addEventListener("scroll", this._onScroll, { passive: true });
      // Init scroll
      this._onScroll();
    }
  }

  _onMouseMove(e) {
    this._mouseX = e.clientX / window.innerWidth;
    this._mouseY = e.clientY / window.innerHeight;
  }

  _onScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    this._scrollProgress = window.scrollY / maxScroll;
  }

  /**
   * Call every frame — smoothly interpolates offsets.
   */
  update() {
    const mc = this._mouseCfg;
    const sc = this._scrollCfg;

    // Mouse: center-based (-0.5 to 0.5)
    const mx = (this._mouseX - 0.5) * 2;
    const my = (this._mouseY - 0.5) * 2;

    // Lerp mouse offsets
    const mLerp = mc.lerp;
    this.mouseOffsetX.far  += (mx * mc.far  - this.mouseOffsetX.far)  * mLerp;
    this.mouseOffsetX.mid  += (mx * mc.mid  - this.mouseOffsetX.mid)  * mLerp;
    this.mouseOffsetX.near += (mx * mc.near - this.mouseOffsetX.near) * mLerp;

    this.mouseOffsetY.far  += (my * mc.far  - this.mouseOffsetY.far)  * mLerp;
    this.mouseOffsetY.mid  += (my * mc.mid  - this.mouseOffsetY.mid)  * mLerp;
    this.mouseOffsetY.near += (my * mc.near - this.mouseOffsetY.near) * mLerp;

    // Scroll offsets (scroll progress * canvas height * multiplier)
    const sLerp = sc.lerp;
    const scrollPx = this._scrollProgress * window.innerHeight;
    this.scrollOffset.far  += (scrollPx * sc.far  - this.scrollOffset.far)  * sLerp;
    this.scrollOffset.mid  += (scrollPx * sc.mid  - this.scrollOffset.mid)  * sLerp;
    this.scrollOffset.near += (scrollPx * sc.near - this.scrollOffset.near) * sLerp;
  }

  /**
   * Combined offset for a given layer.
   */
  getOffset(layer) {
    return {
      x: this.mouseOffsetX[layer],
      y: this.mouseOffsetY[layer] + this.scrollOffset[layer],
    };
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", this._onMouseMove);
      window.removeEventListener("scroll", this._onScroll);
    }
  }
}
