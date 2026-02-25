/**
 * GeometryRenderer — pure 2D Canvas renderer for the geometry background.
 * Draws: points, lines, wireframe mountains, streak meteors, music circles.
 * Driven by ParallaxController, AudioAnalyser, PerformanceGuard.
 */

import { GEO_CONFIG } from "./geometryConfig";

// ── Helpers ──────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Simple 2D Perlin-ish noise (value noise with smoothstep). */
class SimpleNoise {
  constructor(seed = 42) {
    this._perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this._perm[i] = i;
    // Fisher-Yates with seed
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      const j = s % (i + 1);
      [this._perm[i], this._perm[j]] = [this._perm[j], this._perm[i]];
    }
    for (let i = 0; i < 256; i++) this._perm[i + 256] = this._perm[i];
  }
  _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  _grad(hash, x) { return (hash & 1) === 0 ? x : -x; }
  noise1D(x) {
    const xi = Math.floor(x) & 255;
    const xf = x - Math.floor(x);
    const u = this._fade(xf);
    const a = this._perm[xi];
    const b = this._perm[xi + 1];
    return lerp(this._grad(a, xf), this._grad(b, xf - 1), u);
  }
  noise2D(x, y) {
    // Use 1D noise on two axes combined
    return (this.noise1D(x + y * 0.7) + this.noise1D(y + x * 0.3)) * 0.5;
  }
}

const noise = new SimpleNoise(37);

// ── Main Renderer ────────────────────────────────────────────────────────

export class GeometryRenderer {
  constructor(canvas, parallax, audioAnalyser, perfGuard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.parallax = parallax;
    this.audio = audioAnalyser;
    this.perf = perfGuard;

    this._frame = 0;
    this._time = 0;
    this._running = false;
    this._rafId = null;
    this._dpr = Math.min(window.devicePixelRatio || 1, 2);

    // State
    this._points = [];
    this._meteors = [];
    this._nextMeteorTime = 0;
    this._circles = [];

    this._resize();
    this._initPoints();
    this._initCircles();

    this._onResize = this._resize.bind(this);
    window.addEventListener("resize", this._onResize, { passive: true });
  }

  // ── Setup ──

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * this._dpr;
    this.canvas.height = h * this._dpr;
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    this.W = w;
    this.H = h;
  }

  _initPoints() {
    const cfg = GEO_CONFIG.points;
    this._points = [];
    for (let i = 0; i < cfg.count; i++) {
      this._points.push({
        x: rand(0, this.W || 1920),
        y: rand(0, this.H || 1080),
        vx: rand(-cfg.driftSpeed, cfg.driftSpeed),
        vy: rand(-cfg.driftSpeed, cfg.driftSpeed),
        alpha: rand(cfg.minAlpha, cfg.maxAlpha),
        isOrange: Math.random() < cfg.orangeRatio,
        radius: rand(1, cfg.radius),
      });
    }
  }

  _initCircles() {
    const cfg = GEO_CONFIG.circles;
    this._circles = [];
    for (let i = 0; i < cfg.count; i++) {
      this._circles.push({
        cx: rand(this.W * 0.2, this.W * 0.8),
        cy: rand(this.H * 0.25, this.H * 0.65),
        baseRadius: rand(cfg.baseRadius[0], cfg.baseRadius[1]),
        phase: rand(0, Math.PI * 2),
      });
    }
  }

  // ── Main loop ──

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTs = performance.now();
    this._loop();
  }

  _loop() {
    if (!this._running) return;
    this._rafId = requestAnimationFrame((ts) => {
      const dt = Math.min(ts - this._lastTs, 50); // cap at 50ms
      this._lastTs = ts;
      this._frame++;
      this._time += dt * 0.001;

      this.perf.tick();
      this.parallax.update();
      this.audio.update();

      this._update(dt);
      this._draw();
      this._loop();
    });
  }

  stop() {
    this._running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this._onResize);
  }

  // ── Update ──

  _update(dt) {
    const settings = this.perf.getSettings();
    const dtFactor = dt / 16.67; // normalise to 60fps

    // Trim points if perf degraded
    while (this._points.length > settings.pointCount) this._points.pop();

    // Update points
    for (const p of this._points) {
      p.x += p.vx * dtFactor;
      p.y += p.vy * dtFactor;
      // Wrap around
      if (p.x < -20) p.x = this.W + 20;
      if (p.x > this.W + 20) p.x = -20;
      if (p.y < -20) p.y = this.H + 20;
      if (p.y > this.H + 20) p.y = -20;
    }

    // Spawn meteors
    if (settings.meteorsEnabled) {
      const now = performance.now();
      if (now > this._nextMeteorTime) {
        this._spawnMeteor();
        const cfg = GEO_CONFIG.meteors;
        this._nextMeteorTime = now + rand(cfg.interval[0], cfg.interval[1]);
      }
      // Update meteors
      for (let i = this._meteors.length - 1; i >= 0; i--) {
        const m = this._meteors[i];
        m.x += m.vx * dtFactor;
        m.y += m.vy * dtFactor;
        m.life -= dt;
        if (m.life <= 0) this._meteors.splice(i, 1);
      }
    }
  }

  _spawnMeteor() {
    const cfg = GEO_CONFIG.meteors;
    const angle = (cfg.angle * Math.PI) / 180;
    const speed = rand(cfg.speed[0], cfg.speed[1]);
    // Spawn from top or right edge
    const startX = rand(-100, this.W + 200);
    const startY = rand(-200, -20);

    this._meteors.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed, // negative because angle is measured upward
      length: rand(cfg.length[0], cfg.length[1]),
      life: 4000,
    });
  }

  // ── Draw ──

  _draw() {
    const ctx = this.ctx;
    const W = this.W;
    const H = this.H;
    const settings = this.perf.getSettings();
    const colors = GEO_CONFIG.colors;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Get parallax offsets
    const farOff = this.parallax.getOffset("far");
    const midOff = this.parallax.getOffset("mid");
    const nearOff = this.parallax.getOffset("near");

    // Draw order: mountains (far) → points+lines (far) → circles (mid) → meteors (near) → vignette

    // ── Wireframe Mountains (far layer) ──
    this._drawMountains(ctx, W, H, farOff);

    // ── Points + Lines (far layer) ──
    this._drawPointsAndLines(ctx, W, H, farOff, settings);

    // ── Music Circles (mid layer) ──
    this._drawCircles(ctx, W, H, midOff, settings);

    // ── Meteors (near layer) ──
    if (settings.meteorsEnabled) {
      this._drawMeteors(ctx, W, H, nearOff);
    }

    // ── Content Safety Vignette ──
    this._drawVignette(ctx, W, H);
  }

  // ── Draw sub-systems ──

  _drawPointsAndLines(ctx, W, H, offset, settings) {
    const cfg = GEO_CONFIG.points;
    const lineCfg = GEO_CONFIG.lines;
    const colors = GEO_CONFIG.colors;

    ctx.save();
    ctx.translate(offset.x, offset.y);

    // Draw lines first (behind points)
    if (settings.linesEnabled) {
      ctx.lineWidth = lineCfg.lineWidth;
      for (let i = 0; i < this._points.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < this._points.length; j++) {
          if (connections >= lineCfg.maxConnections) break;
          const a = this._points[i];
          const b = this._points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < lineCfg.maxDistance) {
            const alpha = lerp(lineCfg.maxAlpha, lineCfg.minAlpha, dist / lineCfg.maxDistance);
            const isOrange = (a.isOrange || b.isOrange) && Math.random() < lineCfg.orangeHighlightRatio * 10;
            const rgb = isOrange ? colors.orangeRgb : colors.whiteRgb;
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            connections++;
          }
        }
      }
    }

    // Draw points
    for (const p of this._points) {
      const rgb = p.isOrange ? colors.orangeRgb : colors.whiteRgb;
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawMountains(ctx, W, H, offset) {
    const cfg = GEO_CONFIG.mountains;
    const colors = GEO_CONFIG.colors;
    const baseY = H * (1 - cfg.heightRatio);

    ctx.save();
    ctx.translate(offset.x * 0.5, offset.y * 0.3);

    for (let layer = 0; layer < cfg.layers; layer++) {
      const layerRatio = layer / (cfg.layers - 1); // 0=back, 1=front
      const alpha = lerp(cfg.baseAlpha, cfg.frontAlpha, layerRatio);
      const heightScale = lerp(0.3, 1.0, layerRatio);
      const layerY = baseY + (1 - layerRatio) * (H * cfg.heightRatio * 0.3);
      const noiseOffset = layer * 100 + this._time * cfg.noiseSpeed * 1000;

      ctx.strokeStyle = `rgba(${colors.whiteRgb[0]},${colors.whiteRgb[1]},${colors.whiteRgb[2]},${alpha})`;
      ctx.lineWidth = cfg.lineWidth;
      ctx.beginPath();

      for (let i = 0; i <= cfg.segmentCount; i++) {
        const x = (i / cfg.segmentCount) * (W + 40) - 20;
        const n = noise.noise2D(x * cfg.noiseScale + noiseOffset, layer * 10);
        const y = layerY - n * H * cfg.heightRatio * heightScale * 0.5;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      // Vertical wireframe lines (sparse)
      const step = Math.floor(cfg.segmentCount / 12);
      for (let i = 0; i <= cfg.segmentCount; i += step) {
        const x = (i / cfg.segmentCount) * (W + 40) - 20;
        const n = noise.noise2D(x * cfg.noiseScale + noiseOffset, layer * 10);
        const y = layerY - n * H * cfg.heightRatio * heightScale * 0.5;

        ctx.strokeStyle = `rgba(${colors.whiteRgb[0]},${colors.whiteRgb[1]},${colors.whiteRgb[2]},${alpha * 0.3})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  _drawMeteors(ctx, W, H, offset) {
    const cfg = GEO_CONFIG.meteors;
    const colors = GEO_CONFIG.colors;
    const rgb = colors.orangeRgb;

    ctx.save();
    ctx.translate(offset.x, offset.y);

    for (const m of this._meteors) {
      const angle = Math.atan2(m.vy, m.vx);
      const tailX = m.x - Math.cos(angle) * m.length;
      const tailY = m.y - Math.sin(angle) * m.length;

      // Trail gradient
      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
      grad.addColorStop(0.7, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.4)`);
      grad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.9)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = cfg.lineWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      // Glowing head
      const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, cfg.glowRadius);
      headGrad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.8)`);
      headGrad.addColorStop(0.3, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.3)`);
      headGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, cfg.glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Solid head dot
      ctx.fillStyle = `rgba(255,255,255,0.9)`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, cfg.headSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawCircles(ctx, W, H, offset, settings) {
    const cfg = GEO_CONFIG.circles;
    const colors = GEO_CONFIG.colors;
    const rgb = colors.orangeRgb;

    // Music energy or idle breathing
    let energy = 0;
    if (settings.musicReactive && this.audio.isConnected) {
      energy = this.audio.bass * cfg.musicMultiplier;
    }

    ctx.save();
    ctx.translate(offset.x, offset.y);

    for (const c of this._circles) {
      // Idle breath
      const breathPhase = this._time * cfg.breathSpeed * Math.PI * 2 + c.phase;
      const idleBreath = Math.sin(breathPhase) * 0.5 + 0.5; // 0–1
      const breathAmount = lerp(cfg.breathScale[0], cfg.breathScale[1], idleBreath);

      // Music boost
      const musicBoost = energy * cfg.breathScale[1] * cfg.musicMultiplier;
      const radiusMod = 1 + breathAmount + musicBoost;

      // Draw concentric rings
      for (let ring = 0; ring < cfg.concentricRings; ring++) {
        const r = (c.baseRadius - ring * cfg.ringGap) * radiusMod;
        if (r <= 0) continue;

        const ringAlpha = cfg.alpha * (1 - ring * 0.25);
        const lw = cfg.lineWidth + (energy * 0.8);

        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${ringAlpha})`;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle glow on innermost ring
        if (ring === 0 && (energy > 0.1 || idleBreath > 0.7)) {
          const glowAlpha = Math.min(0.08, energy * 0.06 + idleBreath * 0.02);
          const glowGrad = ctx.createRadialGradient(c.cx, c.cy, r * 0.9, c.cx, c.cy, r * 1.2);
          glowGrad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${glowAlpha})`);
          glowGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(c.cx, c.cy, r * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  _drawVignette(ctx, W, H) {
    const cfg = GEO_CONFIG.safetyZone;
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * cfg.vignetteRadius, W / 2, H / 2, W * 0.9);
    grad.addColorStop(0, `rgba(0,0,0,${cfg.vignetteAlpha})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
}
