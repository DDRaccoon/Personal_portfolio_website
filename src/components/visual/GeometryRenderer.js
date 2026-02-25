/**
 * GeometryRenderer — pure 2D Canvas renderer for the geometry background.
 * Draws: aurora field, points, lines, wireframe mountains, streak meteors,
 *        HUD-style music circles, content-safe vignette.
 * Driven by ParallaxController, AudioAnalyser, PerformanceGuard.
 */

import { GEO_CONFIG } from "./geometryConfig";

// ── Helpers ──────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/** Simple 2D value noise with smoothstep. */
class SimpleNoise {
  constructor(seed = 42) {
    this._perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this._perm[i] = i;
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
    return (this.noise1D(x + y * 0.7) + this.noise1D(y + x * 0.3)) * 0.5;
  }
}

const noise = new SimpleNoise(37);
const noise2 = new SimpleNoise(73); // second noise for aurora warp

/** Rotate RGB by hue degrees. Simple matrix rotation in RGB space. */
function rotateHue(r, g, b, degrees) {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const nr = clamp(r * (0.299 + 0.701 * cos + 0.168 * sin) + g * (0.587 - 0.587 * cos + 0.330 * sin) + b * (0.114 - 0.114 * cos - 0.497 * sin), 0, 255);
  const ng = clamp(r * (0.299 - 0.299 * cos - 0.328 * sin) + g * (0.587 + 0.413 * cos + 0.035 * sin) + b * (0.114 - 0.114 * cos + 0.292 * sin), 0, 255);
  const nb = clamp(r * (0.299 - 0.300 * cos + 1.250 * sin) + g * (0.587 - 0.588 * cos - 1.050 * sin) + b * (0.114 + 0.886 * cos - 0.203 * sin), 0, 255);
  return [Math.round(nr), Math.round(ng), Math.round(nb)];
}

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

    // Smoothed music energy (prevents jitter)
    this._smoothBass = 0;
    this._smoothMid = 0;
    this._smoothEnergy = 0;

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
      const pos = cfg.positions[i] || { xRatio: rand(0.2, 0.8), yRatio: rand(0.3, 0.7) };
      this._circles.push({
        cx: (this.W || 1920) * pos.xRatio,
        cy: (this.H || 1080) * pos.yRatio,
        baseRadius: rand(cfg.baseRadius[0], cfg.baseRadius[1]),
        phase: rand(0, Math.PI * 2),
        tickRotation: rand(0, Math.PI * 2),
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
      const dt = Math.min(ts - this._lastTs, 50);
      this._lastTs = ts;
      this._frame++;
      this._time += dt * 0.001;

      this.perf.tick();
      this.parallax.update();
      this.audio.update();

      // Smooth music energy
      const mLerp = GEO_CONFIG.circles.musicLerp;
      this._smoothBass = lerp(this._smoothBass, this.audio.bass, mLerp);
      this._smoothMid = lerp(this._smoothMid, this.audio.mid, mLerp);
      this._smoothEnergy = lerp(this._smoothEnergy, this.audio.energy, mLerp);

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
    const dtFactor = dt / 16.67;

    while (this._points.length > settings.pointCount) this._points.pop();

    for (const p of this._points) {
      p.x += p.vx * dtFactor;
      p.y += p.vy * dtFactor;
      if (p.x < -20) p.x = this.W + 20;
      if (p.x > this.W + 20) p.x = -20;
      if (p.y < -20) p.y = this.H + 20;
      if (p.y > this.H + 20) p.y = -20;
    }

    if (settings.meteorsEnabled) {
      const now = performance.now();
      if (now > this._nextMeteorTime) {
        this._spawnMeteor();
        const cfg = GEO_CONFIG.meteors;
        this._nextMeteorTime = now + rand(cfg.interval[0], cfg.interval[1]);
      }
      for (let i = this._meteors.length - 1; i >= 0; i--) {
        const m = this._meteors[i];
        m.x += m.vx * dtFactor;
        m.y += m.vy * dtFactor;
        m.life -= dt;
        if (m.life <= 0) this._meteors.splice(i, 1);
      }
    }

    // Slowly rotate circle tick marks
    for (const c of this._circles) {
      c.tickRotation += 0.0003 * dtFactor;
    }
  }

  _spawnMeteor() {
    const cfg = GEO_CONFIG.meteors;
    const angle = (cfg.angle * Math.PI) / 180;
    const speed = rand(cfg.speed[0], cfg.speed[1]);
    const startX = rand(-100, this.W + 200);
    const startY = rand(-200, -20);
    this._meteors.push({
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
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

    ctx.clearRect(0, 0, W, H);

    const farOff = this.parallax.getOffset("far");
    const midOff = this.parallax.getOffset("mid");
    const nearOff = this.parallax.getOffset("near");

    // Draw order: aurora → mountains → points+lines → circles → meteors → vignette

    // ── Aurora Gradient Field (deepest layer) ──
    if (settings.auroraEnabled && GEO_CONFIG.aurora.enabled) {
      this._drawAurora(ctx, W, H);
    }

    // ── Wireframe Mountains (far layer) ──
    this._drawMountains(ctx, W, H, farOff);

    // ── Points + Lines (far layer) ──
    this._drawPointsAndLines(ctx, W, H, farOff, settings);

    // ── Music Circles (mid layer — prominent) ──
    this._drawCircles(ctx, W, H, midOff, settings);

    // ── Meteors (near layer) ──
    if (settings.meteorsEnabled) {
      this._drawMeteors(ctx, W, H, nearOff);
    }

    // ── Content Safety Vignette ──
    this._drawVignette(ctx, W, H);
  }

  // ── A) Aurora Gradient Field ──

  _drawAurora(ctx, W, H) {
    const cfg = GEO_CONFIG.aurora;
    const t = this._time;

    // Scroll-linked hue shift
    const scrollProgress = this.parallax._scrollProgress || 0;
    const hueShift = cfg.scrollHueShift * (scrollProgress * 2 - 1); // ±degrees

    for (let i = 0; i < cfg.blobs.length; i++) {
      const blob = cfg.blobs[i];

      // Noise-warped position
      const nx = noise2.noise2D(i * 7.3 + t * cfg.driftSpeed * 1000, i * 3.1) * cfg.driftAmplitude;
      const ny = noise2.noise2D(i * 2.7 + t * cfg.driftSpeed * 800, i * 5.9 + 100) * cfg.driftAmplitude;
      const bx = (blob.x + nx) * W;
      const by = (blob.y + ny) * H;
      const br = blob.radius * Math.max(W, H);

      // Apply hue shift
      let [cr, cg, cb] = blob.color;
      if (cfg.scrollHueShift > 0) {
        [cr, cg, cb] = rotateHue(cr, cg, cb, hueShift);
      }

      // Noise-modulated intensity (slow breathing)
      const breathNoise = noise2.noise2D(t * 0.05 + i * 20, i * 13) * 0.5 + 0.5; // 0–1
      const alpha = cfg.intensity * lerp(0.6, 1.0, breathNoise);

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
      grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // ── Points + Lines ──

  _drawPointsAndLines(ctx, W, H, offset, settings) {
    const cfg = GEO_CONFIG.points;
    const lineCfg = GEO_CONFIG.lines;
    const colors = GEO_CONFIG.colors;

    ctx.save();
    ctx.translate(offset.x, offset.y);

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

    for (const p of this._points) {
      const rgb = p.isOrange ? colors.orangeRgb : colors.whiteRgb;
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Wireframe Mountains ──

  _drawMountains(ctx, W, H, offset) {
    const cfg = GEO_CONFIG.mountains;
    const colors = GEO_CONFIG.colors;
    const baseY = H * (1 - cfg.heightRatio);

    ctx.save();
    ctx.translate(offset.x * 0.5, offset.y * 0.3);

    for (let layer = 0; layer < cfg.layers; layer++) {
      const layerRatio = layer / (cfg.layers - 1);
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
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

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

  // ── Meteors ──

  _drawMeteors(ctx, W, H, offset) {
    const cfg = GEO_CONFIG.meteors;
    const rgb = GEO_CONFIG.colors.orangeRgb;

    ctx.save();
    ctx.translate(offset.x, offset.y);

    for (const m of this._meteors) {
      const angle = Math.atan2(m.vy, m.vx);
      const tailX = m.x - Math.cos(angle) * m.length;
      const tailY = m.y - Math.sin(angle) * m.length;

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

      const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, cfg.glowRadius);
      headGrad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.8)`);
      headGrad.addColorStop(0.3, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.3)`);
      headGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(m.x, m.y, cfg.glowRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(m.x, m.y, cfg.headSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── B) Enhanced HUD/Orbital Circles ──

  _drawCircles(ctx, W, H, offset, settings) {
    const cfg = GEO_CONFIG.circles;
    const rgb = GEO_CONFIG.colors.orangeRgb;

    // Smoothed music energy
    const hasMusicInput = settings.musicReactive && this.audio.isConnected && this._smoothEnergy > 0.01;
    const bassE = hasMusicInput ? this._smoothBass * cfg.musicMultiplier : 0;
    const midE = hasMusicInput ? this._smoothMid * cfg.musicMultiplier : 0;

    ctx.save();
    ctx.translate(offset.x, offset.y);

    for (let ci = 0; ci < this._circles.length; ci++) {
      const c = this._circles[ci];

      // ── Idle breathing (always active, 6–12s period) ──
      const breathPhase = this._time * cfg.breathSpeed * Math.PI * 2 + c.phase;
      const idleBreath = Math.sin(breathPhase) * 0.5 + 0.5; // 0–1
      const idleAmount = lerp(cfg.breathScale[0], cfg.breathScale[1], idleBreath);

      // ── Music-driven radius boost ──
      const musicRadius = bassE * cfg.bassRadiusAmp;
      // Smooth transition: when music starts, idle fades out proportionally
      const musicBlend = clamp(this._smoothEnergy * 4, 0, 1); // 0=idle only, 1=music dominates
      const radiusMod = 1 + lerp(idleAmount, musicRadius + idleAmount * 0.5, hasMusicInput ? musicBlend : 0);

      const outerR = c.baseRadius * radiusMod;

      // ── Semi-transparent fill (innermost area) ──
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${cfg.fillOpacity})`;
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, outerR * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // ── Inner glow ──
      const glowAlpha = cfg.glowOpacity * (0.5 + idleBreath * 0.3 + bassE * 0.3);
      const glowR = outerR * cfg.glowSpread;
      const glowGrad = ctx.createRadialGradient(c.cx, c.cy, outerR * 0.3, c.cx, c.cy, glowR);
      glowGrad.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(glowAlpha, 0, 0.22)})`);
      glowGrad.addColorStop(0.6, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(glowAlpha * 0.3, 0, 0.08)})`);
      glowGrad.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Concentric rings (thick, clearly distinct from line network) ──
      for (let ring = 0; ring < cfg.concentricRings; ring++) {
        const r = (outerR - ring * cfg.ringGap * radiusMod);
        if (r <= 0) continue;

        const ringAlpha = cfg.alpha * (1 - ring * 0.18);
        const strokeVar = hasMusicInput ? bassE * 1.2 : idleBreath * 0.3;
        const lw = cfg.stroke + strokeVar;

        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${clamp(ringAlpha, 0, 0.35)})`;
        ctx.lineWidth = lw;
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ── HUD tick marks (outermost ring — orbital detail) ──
      const tickR = outerR + 4;
      const tickAlphaBase = cfg.tickAlpha;
      ctx.lineWidth = cfg.tickWidth;

      for (let t = 0; t < cfg.tickCount; t++) {
        const angle = c.tickRotation + (t / cfg.tickCount) * Math.PI * 2;

        // Mid-frequency flicker on every 3rd tick
        let tickAlpha = tickAlphaBase;
        if (hasMusicInput && t % 3 === 0) {
          tickAlpha += midE * cfg.midFlickerAmp * 3;
        }
        tickAlpha = clamp(tickAlpha, 0.05, 0.35);

        // Alternate tick lengths
        const tLen = (t % 6 === 0) ? cfg.tickLength * 1.8 : cfg.tickLength;

        const x1 = c.cx + Math.cos(angle) * tickR;
        const y1 = c.cy + Math.sin(angle) * tickR;
        const x2 = c.cx + Math.cos(angle) * (tickR + tLen);
        const y2 = c.cy + Math.sin(angle) * (tickR + tLen);

        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${tickAlpha})`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // ── Crosshair lines (subtle HUD accent) ──
      const chLen = outerR * 0.15;
      const chAlpha = 0.08 + idleBreath * 0.04;
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${chAlpha})`;
      ctx.lineWidth = 0.5;
      // horizontal
      ctx.beginPath();
      ctx.moveTo(c.cx - outerR - chLen, c.cy);
      ctx.lineTo(c.cx - outerR + 8, c.cy);
      ctx.moveTo(c.cx + outerR - 8, c.cy);
      ctx.lineTo(c.cx + outerR + chLen, c.cy);
      // vertical
      ctx.moveTo(c.cx, c.cy - outerR - chLen);
      ctx.lineTo(c.cx, c.cy - outerR + 8);
      ctx.moveTo(c.cx, c.cy + outerR - 8);
      ctx.lineTo(c.cx, c.cy + outerR + chLen);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── Content Safety Vignette (stronger, with edge darkening) ──

  _drawVignette(ctx, W, H) {
    const cfg = GEO_CONFIG.safetyZone;

    // Center vignette — darkens content area for readability
    const grad = ctx.createRadialGradient(W / 2, H / 2, W * cfg.vignetteRadius * 0.5, W / 2, H / 2, W * 0.85);
    grad.addColorStop(0, `rgba(0,0,0,${cfg.vignetteStrength})`);
    grad.addColorStop(0.6, `rgba(0,0,0,${cfg.vignetteStrength * 0.4})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Edge darkening — subtle frame effect
    if (cfg.edgeDarken > 0) {
      // Top edge
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.15);
      topGrad.addColorStop(0, `rgba(0,0,0,${cfg.edgeDarken})`);
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H * 0.15);

      // Bottom edge
      const btmGrad = ctx.createLinearGradient(0, H * 0.85, 0, H);
      btmGrad.addColorStop(0, "rgba(0,0,0,0)");
      btmGrad.addColorStop(1, `rgba(0,0,0,${cfg.edgeDarken})`);
      ctx.fillStyle = btmGrad;
      ctx.fillRect(0, H * 0.85, W, H * 0.15);

      // Left edge
      const leftGrad = ctx.createLinearGradient(0, 0, W * 0.08, 0);
      leftGrad.addColorStop(0, `rgba(0,0,0,${cfg.edgeDarken * 0.7})`);
      leftGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, W * 0.08, H);

      // Right edge
      const rightGrad = ctx.createLinearGradient(W * 0.92, 0, W, 0);
      rightGrad.addColorStop(0, "rgba(0,0,0,0)");
      rightGrad.addColorStop(1, `rgba(0,0,0,${cfg.edgeDarken * 0.7})`);
      ctx.fillStyle = rightGrad;
      ctx.fillRect(W * 0.92, 0, W * 0.08, H);
    }
  }
}
