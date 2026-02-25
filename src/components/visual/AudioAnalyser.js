/**
 * AudioAnalyser — wraps WebAudio AnalyserNode.
 * Provides normalised energy (0–1) for music-reactive circles.
 * Falls back to idle breathing when no audio is available.
 */

export class AudioAnalyser {
  constructor() {
    this._ctx = null;
    this._analyser = null;
    this._source = null;
    this._dataArray = null;
    this._connected = false;
    this.energy = 0;        // 0–1 normalised
    this.bass = 0;          // low freq energy
    this.mid = 0;           // mid freq energy
    this.high = 0;          // high freq energy
  }

  /**
   * Connect to an <audio> element. Safe to call multiple times.
   */
  connect(audioElement) {
    if (this._connected) return;
    if (!audioElement) return;

    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._analyser = this._ctx.createAnalyser();
      this._analyser.fftSize = 256;
      this._analyser.smoothingTimeConstant = 0.8;

      this._source = this._ctx.createMediaElementSource(audioElement);
      this._source.connect(this._analyser);
      this._analyser.connect(this._ctx.destination);

      this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
      this._connected = true;
    } catch (e) {
      // Silently fail — circles will use idle mode
      console.warn("AudioAnalyser: could not connect", e);
    }
  }

  /**
   * Call every frame to update energy values.
   */
  update() {
    if (!this._connected || !this._analyser || !this._dataArray) {
      this.energy = 0;
      this.bass = 0;
      this.mid = 0;
      this.high = 0;
      return;
    }

    // Resume context if suspended (browser policy)
    if (this._ctx.state === "suspended") {
      this._ctx.resume().catch(() => {});
    }

    this._analyser.getByteFrequencyData(this._dataArray);

    const len = this._dataArray.length;
    const bassEnd = Math.floor(len * 0.15);
    const midEnd = Math.floor(len * 0.5);

    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;
    let total = 0;

    for (let i = 0; i < len; i++) {
      const v = this._dataArray[i];
      total += v;
      if (i < bassEnd) bassSum += v;
      else if (i < midEnd) midSum += v;
      else highSum += v;
    }

    this.energy = Math.min(1, total / (len * 200));
    this.bass = Math.min(1, bassSum / (bassEnd * 220));
    this.mid = Math.min(1, midSum / ((midEnd - bassEnd) * 200));
    this.high = Math.min(1, highSum / ((len - midEnd) * 180));
  }

  get isConnected() {
    return this._connected;
  }

  /**
   * Resume AudioContext if suspended (call on user interaction).
   */
  resume() {
    if (this._ctx && this._ctx.state === "suspended") {
      this._ctx.resume().catch(() => {});
    }
  }

  destroy() {
    if (this._source) {
      try { this._source.disconnect(); } catch (_) {}
    }
    if (this._analyser) {
      try { this._analyser.disconnect(); } catch (_) {}
    }
    if (this._ctx && this._ctx.state !== "closed") {
      this._ctx.close().catch(() => {});
    }
    this._connected = false;
  }
}
