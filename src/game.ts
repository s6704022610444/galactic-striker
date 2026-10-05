/**
 * 2D Space Shooter - Complete Advanced Enemy & Multi-Phase Boss System
 */
import { STAGES, StageBoss, StageConfig } from './stages.ts';

// Web Audio API Procedural Sound FX
export class SoundEffects {
  ctx: AudioContext | null = null;
  enabled = true;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  playEnemyShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  playBossLaser() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.28);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  playWarningAlarm() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 330, 440, 330].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.14;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {}
  }

  playPhaseShift() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.5);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch {}
  }

  playExplosion(isLarge = false) {
    if (!this.enabled || !this.ctx) return;
    try {
      const duration = isLarge ? 0.45 : 0.22;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isLarge ? 350 : 600, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + duration);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isLarge ? 0.38 : 0.22, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  playPlayerHit() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(90, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  playItemCollect() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.06;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {}
  }

  playLaserShoot() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
      gain.gain.setValueAtTime(0.19, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  playPowerUp() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.055;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch {}
  }

  playRocketLaunch() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  playHomingLaunch() {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  playNukeExplosion() {
    if (!this.enabled || !this.ctx) return;
    try {
      const duration = 0.6;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);
      filter.linearRampToValueAtTime?.(30, this.ctx.currentTime + duration);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {}
  }

  playGameOver() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [320, 270, 220, 160].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.14;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      });
    } catch {}
  }

  playStageClear() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.24, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {}
  }
}

// Particle System
export class Particle {
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  isShard: boolean;
  rotation: number;
  rotSpeed: number;

  constructor(x: number, y: number, color: string, speed: number, size: number, life: number, isShard = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed * (0.5 + Math.random() * 0.8);
    this.vy = Math.sin(angle) * speed * (0.5 + Math.random() * 0.8);
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.isShard = isShard;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.2;
  }

  update(): boolean {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.life--;
    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    if (this.isShard) {
      ctx.rotate(this.rotation);
      ctx.fillRect(-this.size, -this.size * 0.5, this.size * 2, this.size);
    } else {
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Score text popup
export class ScoreText {
  x: number;
  y: number;
  text: string;
  color: string;
  life = 45;
  maxLife = 45;

  constructor(x: number, y: number, text: string, color = '#38bdf8') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
  }

  update(): boolean {
    this.y -= 1.1;
    this.life--;
    return this.life > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.life / this.maxLife;
    ctx.fillStyle = this.color;
    ctx.font = 'bold 15px monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 6;
    ctx.shadowColor = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Starfield Background
export class Starfield {
  width: number;
  height: number;
  bgGradient: [string, string] = ['#0d1430', '#050711'];
  stars: Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    brightness: number;
    pulseVal: number;
    pulseSpeed: number;
  }> = [];

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.initStars();
  }

  initStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.6,
        speed: Math.random() * 2.2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2,
        pulseVal: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.05 + 0.01,
      });
    }
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.initStars();
  }

  update(speedMultiplier = 1, isWarping = false) {
    for (const s of this.stars) {
      s.y += isWarping ? s.speed * 8.5 : s.speed * speedMultiplier;
      s.pulseVal += s.pulseSpeed;
      if (s.y > this.height) {
        s.y = 0;
        s.x = Math.random() * this.width;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, isWarping = false) {
    const grad = ctx.createRadialGradient(
      this.width / 2, this.height * 0.35, 10,
      this.width / 2, this.height * 0.35, this.height * 0.85
    );
    grad.addColorStop(0, this.bgGradient[0]);
    grad.addColorStop(1, this.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    for (const s of this.stars) {
      const glow = (Math.sin(s.pulseVal) + 1) * 0.5;
      const alpha = s.brightness * (0.6 + glow * 0.4);
      if (isWarping) {
        ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.9})`;
        ctx.fillRect(s.x, s.y, s.size, s.size + s.speed * 16);
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (s.size > 2) {
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

// Player Bullet
export class Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: string;
  damage: number;
  width: number;
  height: number;
  active = true;
  pierce: number;

  constructor(x: number, y: number, vx = 0, vy = -11, type = 'vulcan', damage = 1, width = 6, height = 15) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.damage = damage;
    this.width = width;
    this.height = height;
    this.pierce = type === 'laser' && damage >= 4.5 ? 2 : 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y + this.height < -10 || this.y > 900 || this.x < -30 || this.x > 530) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    if (this.type === 'vulcan') {
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 10;
      const angle = Math.atan2(this.vy, this.vx) + Math.PI / 2;
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width * 0.28, this.height * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(this.x - this.width / 2, this.y, this.width, this.height, this.width / 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(this.x - Math.max(1, this.width * 0.2), this.y + 2, Math.max(2, this.width * 0.4), this.height - 4, 1);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Enemy Bullet
export class EnemyBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  isLaser: boolean;
  active = true;

  constructor(x: number, y: number, vx: number, vy: number, color = '#f43f5e', radius = 4, isLaser = false) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.radius = radius;
    this.isLaser = isLaser;
  }

  update(canvasW: number, canvasH: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -20 || this.x > canvasW + 20 || this.y < -30 || this.y > canvasH + 30) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    if (this.isLaser) {
      ctx.beginPath();
      ctx.roundRect(this.x - 2.5, this.y - 8, 5, 16, 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(this.x - 1, this.y - 5, 2, 10);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

// Item Drop
export class ItemDrop {
  x: number;
  y: number;
  vy = 1.35;
  vx = (Math.random() - 0.5) * 0.5;
  size = 28;
  active = true;
  rotation = 0;
  spawnTime: number;
  switchIntervalMs = 1800;
  colorType: 'vulcan' | 'laser';

  constructor(x: number, y: number, initialColor: 'vulcan' | 'laser' = 'vulcan') {
    this.x = x;
    this.y = y;
    this.spawnTime = performance.now();
    this.colorType = initialColor;
  }

  update(canvasH: number, now = performance.now()) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += 0.02;
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    this.colorType = cycle % 2 === 0 ? 'vulcan' : 'laser';
    if (this.y > canvasH + 40) this.active = false;
  }

  getCurrentColor(now = performance.now()): 'vulcan' | 'laser' {
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    return cycle % 2 === 0 ? 'vulcan' : 'laser';
  }

  draw(ctx: CanvasRenderingContext2D, now = performance.now()) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    const activeType = cycle % 2 === 0 ? 'vulcan' : 'laser';
    const timeInCycle = elapsed % this.switchIntervalMs;
    const remainingInCycle = this.switchIntervalMs - timeInCycle;
    let renderColor = activeType;
    if (remainingInCycle < 360 && Math.floor(now / 75) % 2 === 0) {
      renderColor = activeType === 'vulcan' ? 'laser' : 'vulcan';
    }
    const isRed = renderColor === 'vulcan';
    const mainColor = isRed ? '#ef4444' : '#38bdf8';
    const letter = isRed ? 'V' : 'L';
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 3;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.strokeStyle = isRed ? 'rgba(254, 202, 202, 0.7)' : 'rgba(186, 230, 253, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-this.size / 2 + 3, -this.size / 2 + 3, this.size - 6, this.size - 6);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  }
}

// Secondary Item Drop
export class SecondaryItemDrop {
  x: number;
  y: number;
  vy = 1.3;
  vx = (Math.random() - 0.5) * 0.5;
  radius = 14;
  active = true;
  spawnTime: number;
  switchIntervalMs = 1800;
  missileType: 'nuclear' | 'homing';

  constructor(x: number, y: number, initialType: 'nuclear' | 'homing' = 'nuclear') {
    this.x = x;
    this.y = y;
    this.spawnTime = performance.now();
    this.missileType = initialType;
  }

  update(canvasH: number, now = performance.now()) {
    this.x += this.vx;
    this.y += this.vy;
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    this.missileType = cycle % 2 === 0 ? 'nuclear' : 'homing';
    if (this.y > canvasH + 40) this.active = false;
  }

  getCurrentType(now = performance.now()): 'nuclear' | 'homing' {
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    return cycle % 2 === 0 ? 'nuclear' : 'homing';
  }

  draw(ctx: CanvasRenderingContext2D, now = performance.now()) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const elapsed = Math.max(0, now - this.spawnTime);
    const cycle = Math.floor(elapsed / this.switchIntervalMs);
    const activeType = cycle % 2 === 0 ? 'nuclear' : 'homing';
    const timeInCycle = elapsed % this.switchIntervalMs;
    const remainingInCycle = this.switchIntervalMs - timeInCycle;
    let renderType = activeType;
    if (remainingInCycle < 360 && Math.floor(now / 75) % 2 === 0) {
      renderType = activeType === 'nuclear' ? 'homing' : 'nuclear';
    }
    const isNuke = renderType === 'nuclear';
    const mainColor = isNuke ? '#facc15' : '#4ade80';
    const letter = isNuke ? 'M' : 'H';
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 0, 0);
    ctx.restore();
  }
}

// Nuclear Missile
export class NuclearMissile {
  x: number;
  y: number;
  vy = -8.8;
  damage: number;
  aoeRadius: number;
  burnDamage: number;
  active = true;
  flameAnim = 0;

  constructor(x: number, y: number, damage = 7.5, aoeRadius = 45, burnDamage = 1.5) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.aoeRadius = aoeRadius;
    this.burnDamage = burnDamage;
  }

  update() {
    this.y += this.vy;
    this.flameAnim += 0.3;
    if (this.y < -40) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-3, 10);
    ctx.lineTo(0, 18 + Math.sin(this.flameAnim) * 5);
    ctx.lineTo(3, 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#eab308';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(5, -4);
    ctx.lineTo(5, 8);
    ctx.lineTo(8, 12);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-5, 8);
    ctx.lineTo(-5, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

// Fire AoE
export class FireAoE {
  x: number;
  y: number;
  maxRadius: number;
  radius = 12;
  burnDamage: number;
  duration = 32;
  life = 32;
  active = true;
  tickTimer = 0;

  constructor(x: number, y: number, maxRadius = 42, burnDamage = 1.2) {
    this.x = x;
    this.y = y;
    this.maxRadius = maxRadius;
    this.burnDamage = burnDamage;
  }

  update() {
    this.life--;
    if (this.radius < this.maxRadius) {
      this.radius += (this.maxRadius - this.radius) * 0.22;
    }
    this.tickTimer++;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.duration;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#f97316';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    grad.addColorStop(0.35, 'rgba(249, 115, 22, 0.7)');
    grad.addColorStop(0.8, 'rgba(220, 38, 38, 0.4)');
    grad.addColorStop(1, 'rgba(220, 38, 38, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export interface Targetable {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  active: boolean;
  isTurret?: boolean;
  isLeft?: boolean;
  parentBoss?: MiniBoss;
  type?: string;
  hp?: number;
  hit?: (dmg: number) => boolean;
}

// Homing Missile
export class HomingMissile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  speed: number;
  angle: number;
  turnSpeed: number;
  maxSpeed: number;
  active = true;
  life = 140;
  target: Targetable | null = null;

  constructor(x: number, y: number, vx: number, vy: number, damage = 3.2, turnSpeed = 0.18, maxSpeed = 10) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.speed = Math.hypot(vx, vy);
    this.angle = Math.atan2(vy, vx);
    this.turnSpeed = turnSpeed;
    this.maxSpeed = maxSpeed;
  }

  update(potentialTargets: Targetable[]) {
    this.life--;
    if (this.life <= 0) {
      this.active = false;
      return;
    }
    if (this.speed < this.maxSpeed) this.speed += 0.38;
    if (!this.target || !this.target.active || (this.target.hp !== undefined && this.target.hp <= 0)) {
      let closestDist = Infinity;
      this.target = null;
      for (const e of potentialTargets) {
        if (e.active && e.y > -20 && e.y < 750) {
          const d = Math.hypot(e.x - this.x, e.y - this.y);
          if (d < closestDist) {
            closestDist = d;
            this.target = e;
          }
        }
      }
    }
    if (this.target && this.target.active) {
      const targetAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += Math.sign(diff) * Math.min(Math.abs(diff), this.turnSpeed);
    }
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -30 || this.x > 510 || this.y < -40 || this.y > 850) {
      this.active = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(3, -2);
    ctx.lineTo(3, 6);
    ctx.lineTo(5, 8);
    ctx.lineTo(-5, 8);
    ctx.lineTo(-3, 6);
    ctx.lineTo(-3, -2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Player Spaceship
export class Player {
  canvasWidth: number;
  canvasHeight: number;
  width = 42;
  height = 46;
  x = 0;
  y = 0;
  speed = 5.5;
  vx = 0;
  vy = 0;
  friction = 0.86;
  invulnerableTimer = 0;
  thrusterAnim = 0;
  weaponType: 'vulcan' | 'laser' = 'vulcan';
  weaponLevel = 1;
  secondaryType: 'nuclear' | 'homing' | null = null;
  secondaryLevel = 0;

  constructor(cw: number, ch: number) {
    this.canvasWidth = cw;
    this.canvasHeight = ch;
    this.reset();
  }

  reset() {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight - 80;
    this.speed = 5.5;
    this.vx = 0;
    this.vy = 0;
    this.friction = 0.86;
    this.invulnerableTimer = 0;
    this.thrusterAnim = 0;
    this.weaponType = 'vulcan';
    this.weaponLevel = 1;
    this.secondaryType = null;
    this.secondaryLevel = 0;
  }

  update(keys: Record<string, boolean>) {
    let moveX = 0;
    let moveY = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) moveX -= 1;
    if (keys['ArrowRight'] || keys['KeyD']) moveX += 1;
    if (keys['ArrowUp'] || keys['KeyW']) moveY -= 1;
    if (keys['ArrowDown'] || keys['KeyS']) moveY += 1;
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }
    this.vx = (this.vx + moveX * (this.speed * 0.28)) * this.friction;
    this.vy = (this.vy + moveY * (this.speed * 0.28)) * this.friction;
    this.x += this.vx;
    this.y += this.vy;
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    if (this.x - halfW < 0) { this.x = halfW; this.vx = 0; }
    if (this.x + halfW > this.canvasWidth) { this.x = this.canvasWidth - halfW; this.vx = 0; }
    if (this.y - halfH < 60) { this.y = 60 + halfH; this.vy = 0; }
    if (this.y + halfH > this.canvasHeight - 10) { this.y = this.canvasHeight - 10 - halfH; this.vy = 0; }
    if (this.invulnerableTimer > 0) this.invulnerableTimer--;
    this.thrusterAnim += 0.25;
  }

  triggerInvulnerability(duration = 100) {
    this.invulnerableTimer = duration;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
      return;
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.max(-0.25, Math.min(0.25, this.vx * 0.04)));
    const flameH = 12 + Math.sin(this.thrusterAnim) * 5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(-7, 18);
    ctx.lineTo(0, 18 + flameH);
    ctx.lineTo(7, 18);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 12;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(18, 16);
    ctx.lineTo(10, 14);
    ctx.lineTo(10, 18);
    ctx.lineTo(-10, 18);
    ctx.lineTo(-10, 14);
    ctx.lineTo(-18, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, -2, 4, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    if (this.invulnerableTimer > 0) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// Scout Enemy
export class ScoutEnemy {
  canvasWidth: number;
  type = 'scout';
  width = 30;
  height = 30;
  hp = 1;
  maxHp = 1;
  scoreValue = 120;
  color = '#facc15';
  startX: number;
  x: number;
  y = -35;
  time = 0;
  speedY = 2.4;
  amp = 65;
  hasShot = false;
  active = true;
  hitFlash = 0;

  constructor(cw: number) {
    this.canvasWidth = cw;
    this.startX = Math.random() * (cw - 120) + 60;
    this.x = this.startX;
  }

  update(player: Player, spawnBulletCallback: (b: EnemyBullet) => void, sound: SoundEffects) {
    this.time += 0.05;
    this.y += this.speedY;
    this.x = this.startX + Math.sin(this.time) * this.amp;
    if (!this.hasShot && this.y > 180 && this.y < 350) {
      this.hasShot = true;
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      const speed = 4.2;
      spawnBulletCallback(new EnemyBullet(this.x, this.y + 12, Math.cos(angle) * speed, Math.sin(angle) * speed, '#facc15', 4));
      sound.playEnemyShoot();
      this.speedY = 4.2;
    }
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.y > 850) this.active = false;
  }

  hit(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : '#422006';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(15, -12);
    ctx.lineTo(0, -6);
    ctx.lineTo(-15, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Assault Enemy
export class AssaultEnemy {
  canvasWidth: number;
  type = 'assault';
  width = 32;
  height = 36;
  hp = 2;
  maxHp = 2;
  scoreValue = 180;
  color = '#ef4444';
  x: number;
  y = -40;
  speedY = 3.2;
  hasShot = false;
  active = true;
  hitFlash = 0;

  constructor(cw: number) {
    this.canvasWidth = cw;
    this.x = Math.random() * (cw - 80) + 40;
  }

  update(player: Player, spawnBulletCallback: (b: EnemyBullet) => void, sound: SoundEffects) {
    this.y += this.speedY;
    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    if (!this.hasShot && distToPlayer < 310) {
      this.hasShot = true;
      const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);
      [-0.24, 0, 0.24].forEach(offset => {
        const ang = baseAngle + offset;
        const spd = 4.8;
        spawnBulletCallback(new EnemyBullet(this.x, this.y + 14, Math.cos(ang) * spd, Math.sin(ang) * spd, '#ef4444', 3.5));
      });
      sound.playEnemyShoot();
      this.speedY = 5.2;
    }
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.y > 850) this.active = false;
  }

  hit(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : '#450a0a';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(16, -14);
    ctx.lineTo(6, -8);
    ctx.lineTo(0, -14);
    ctx.lineTo(-6, -8);
    ctx.lineTo(-16, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

// Cargo Transport
export class CargoTransport {
  canvasWidth: number;
  type = 'cargo';
  cargoType: 'main' | 'secondary';
  width = 46;
  height = 42;
  hp = 6;
  maxHp = 6;
  scoreValue = 300;
  color: string;
  x: number;
  y = -50;
  speedY = 1.15;
  active = true;
  hitFlash = 0;

  constructor(x: number, cargoType: 'main' | 'secondary' = 'main') {
    this.canvasWidth = 480;
    this.cargoType = cargoType;
    this.x = x;
    this.color = cargoType === 'main' ? '#facc15' : '#38bdf8';
  }

  update() {
    this.y += this.speedY;
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.y > 850) this.active = false;
  }

  hit(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const isMain = this.cargoType === 'main';
    const mainCol = isMain ? '#facc15' : '#38bdf8';
    const fillCol = isMain ? '#261b05' : '#082f49';
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : mainCol;
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : fillCol;
    ctx.strokeStyle = mainCol;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-18, -16);
    ctx.lineTo(18, -16);
    ctx.lineTo(22, 4);
    ctx.lineTo(14, 18);
    ctx.lineTo(-14, 18);
    ctx.lineTo(-22, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isMain ? '#eab308' : '#0284c7';
    ctx.fillRect(-12, -8, 10, 14);
    ctx.fillRect(2, -8, 10, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isMain ? 'W' : 'M', 0, 0);
    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-18, -26, 36, 4);
      ctx.fillStyle = mainCol;
      ctx.fillRect(-18, -26, 36 * (this.hp / this.maxHp), 4);
    }
    ctx.restore();
  }
}

// Bomber Enemy
export class BomberEnemy {
  canvasWidth: number;
  type = 'bomber';
  width = 48;
  height = 40;
  hp = 5;
  maxHp = 5;
  scoreValue = 350;
  color = '#a855f7';
  x: number;
  y = -50;
  targetY: number;
  state = 'entering';
  chargeTimer = 0;
  active = true;
  hitFlash = 0;

  constructor(cw: number) {
    this.canvasWidth = cw;
    this.x = Math.random() * (cw - 120) + 60;
    this.targetY = 160 + Math.random() * 60;
  }

  update(player: Player, spawnBulletCallback: (b: EnemyBullet) => void, sound: SoundEffects) {
    if (this.state === 'entering') {
      this.y += 2.0;
      if (this.y >= this.targetY) {
        this.state = 'charging';
        this.chargeTimer = 45;
      }
    } else if (this.state === 'charging') {
      this.chargeTimer--;
      if (this.chargeTimer <= 0) {
        const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);
        [-0.35, -0.18, 0, 0.18, 0.35].forEach(angOff => {
          const ang = baseAngle + angOff;
          const spd = 3.6;
          spawnBulletCallback(new EnemyBullet(this.x, this.y + 16, Math.cos(ang) * spd, Math.sin(ang) * spd, '#c084fc', 4.5));
        });
        sound.playBossLaser();
        this.state = 'leaving';
      }
    } else {
      this.y += 2.2;
    }
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.y > 850) this.active = false;
  }

  hit(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : '#3b0764';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(24, -8);
    ctx.lineTo(16, -16);
    ctx.lineTo(-16, -16);
    ctx.lineTo(-24, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-18, -24, 36, 4);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-18, -24, 36 * (this.hp / this.maxHp), 4);
    }
    ctx.restore();
  }
}

// Mini-Boss
export class MiniBoss {
  canvasWidth: number;
  type = 'miniboss';
  width = 96;
  height = 64;
  hp = 35;
  maxHp = 35;
  scoreValue = 1500;
  color = '#f59e0b';
  x: number;
  y = -80;
  targetY = 130;
  active = true;
  hitFlash = 0;
  time = 0;
  turretL = { offsetX: -34, offsetY: 8, radius: 14, hp: 12, maxHp: 12, hitFlash: 0, destroyed: false, fireCooldown: 80 };
  turretR = { offsetX: 34, offsetY: 8, radius: 14, hp: 12, maxHp: 12, hitFlash: 0, destroyed: false, fireCooldown: 120 };
  coreAttackTimer = 0;
  attackMode = 'laser';

  constructor(cw: number) {
    this.canvasWidth = cw;
    this.x = cw / 2;
  }

  update(player: Player, spawnBulletCallback: (b: EnemyBullet) => void, sound: SoundEffects) {
    this.time += 0.03;
    if (this.y < this.targetY) {
      this.y += 1.5;
    } else {
      this.x = this.canvasWidth / 2 + Math.sin(this.time) * 90;
    }
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.turretL.hitFlash > 0) this.turretL.hitFlash--;
    if (this.turretR.hitFlash > 0) this.turretR.hitFlash--;
    if (!this.turretL.destroyed) {
      this.turretL.fireCooldown--;
      if (this.turretL.fireCooldown <= 0 && this.y >= this.targetY - 10) {
        this.turretL.fireCooldown = 110;
        const tx = this.x + this.turretL.offsetX;
        const ty = this.y + this.turretL.offsetY;
        const angle = Math.atan2(player.y - ty, player.x - tx);
        spawnBulletCallback(new EnemyBullet(tx, ty, Math.cos(angle) * 4.2, Math.sin(angle) * 4.2, '#f59e0b', 4));
        sound.playEnemyShoot();
      }
    }
    if (!this.turretR.destroyed) {
      this.turretR.fireCooldown--;
      if (this.turretR.fireCooldown <= 0 && this.y >= this.targetY - 10) {
        this.turretR.fireCooldown = 110;
        const tx = this.x + this.turretR.offsetX;
        const ty = this.y + this.turretR.offsetY;
        const angle = Math.atan2(player.y - ty, player.x - tx);
        spawnBulletCallback(new EnemyBullet(tx, ty, Math.cos(angle) * 4.2, Math.sin(angle) * 4.2, '#f59e0b', 4));
        sound.playEnemyShoot();
      }
    }
    if (this.y >= this.targetY - 5) {
      this.coreAttackTimer++;
      if (this.coreAttackTimer >= 140) {
        this.coreAttackTimer = 0;
        if (this.attackMode === 'laser') {
          const angle = Math.atan2(player.y - this.y, player.x - this.x);
          [-0.1, 0.1].forEach(off => {
            const ang = angle + off;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 24, Math.cos(ang) * 5.5, Math.sin(ang) * 5.5, '#ef4444', 4, true));
          });
          sound.playBossLaser();
          this.attackMode = 'radial';
        } else {
          const bulletCount = 10;
          for (let i = 0; i < bulletCount; i++) {
            const ang = (Math.PI * 2 * i) / bulletCount + this.time;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 12, Math.cos(ang) * 3.2, Math.sin(ang) * 3.2, '#38bdf8', 4));
          }
          sound.playEnemyShoot();
          this.attackMode = 'laser';
        }
      }
    }
  }

  hitTurret(isLeft: boolean, dmg = 1): boolean {
    const turret = isLeft ? this.turretL : this.turretR;
    if (turret.destroyed) return false;
    turret.hp -= dmg;
    turret.hitFlash = 4;
    if (turret.hp <= 0) {
      turret.destroyed = true;
      return true;
    }
    return false;
  }

  hitBody(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.shadowBlur = 14;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : this.color;
    ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : '#1e1b4b';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(48, -10);
    ctx.lineTo(38, -26);
    ctx.lineTo(-38, -26);
    ctx.lineTo(-48, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    [-34, 34].forEach(off => {
      const isL = off < 0;
      const t = isL ? this.turretL : this.turretR;
      ctx.save();
      ctx.translate(off, 8);
      if (t.destroyed) {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = t.hitFlash > 0 ? '#ffffff' : '#b45309';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-35, -36, 70, 5);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-35, -36, 70 * (this.hp / this.maxHp), 5);
    ctx.restore();
  }
}

// Game Engine
export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  sound = new SoundEffects();
  starfield: Starfield;
  player: Player;
  bullets: Bullet[] = [];
  missiles: (NuclearMissile | HomingMissile)[] = [];
  fireAoEs: FireAoE[] = [];
  enemyBullets: EnemyBullet[] = [];
  enemies: (ScoutEnemy | AssaultEnemy | CargoTransport | BomberEnemy | MiniBoss | StageBoss)[] = [];
  itemDrops: ItemDrop[] = [];
  secondaryItemDrops: SecondaryItemDrop[] = [];
  particles: Particle[] = [];
  scoreTexts: ScoreText[] = [];
  score = 0;
  highScore: number;
  lives = 3;
  enemiesKilled = 0;
  stage = 1;
  loop = 1;
  stageKills = 0;
  isStageClearing = false;
  warpEffect = 0;
  state: 'start' | 'playing' | 'gameover' = 'start';
  keys: Record<string, boolean> = {};
  lastShotTime = 0;
  lastMissileTime = 0;
  spawnTimer = 0;
  screenShake = 0;
  activeBoss: MiniBoss | StageBoss | null = null;
  miniBossSpawned = false;
  stageBossSpawned = false;
  isPaused = false;
  pauseStartTime = 0;
  cargoSchedule: Array<{ kills: number; x: number; type: 'main' | 'secondary'; spawned: boolean }> = [];

  scoreDisplay: HTMLElement;
  livesContainer: HTMLElement;
  bossBarEl: HTMLElement;
  bossNameEl: HTMLElement;
  bossPhaseBadgeEl: HTMLElement;
  bossHpFillEl: HTMLElement;
  warningBannerEl: HTMLElement;
  stageBadgeEl: HTMLElement | null;
  loopBadgeEl: HTMLElement | null;
  stageClearBannerEl: HTMLElement | null;
  startScreen: HTMLElement;
  gameOverScreen: HTMLElement;
  pauseScreen: HTMLElement | null;
  pauseBtn: HTMLElement | null;
  pauseIcon: HTMLElement | null;
  pauseText: HTMLElement | null;
  startHighScoreEl: HTMLElement;
  finalScoreEl: HTMLElement;
  finalHighScoreEl: HTMLElement;
  enemiesKilledEl: HTMLElement;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.starfield = new Starfield(this.canvas.width, this.canvas.height);
    this.player = new Player(this.canvas.width, this.canvas.height);
    this.highScore = parseInt(localStorage.getItem('space_shooter_high_score') || '0', 10);

    this.scoreDisplay = document.getElementById('score-display')!;
    this.livesContainer = document.getElementById('lives-container')!;
    this.bossBarEl = document.getElementById('boss-bar')!;
    this.bossNameEl = document.getElementById('boss-name')!;
    this.bossPhaseBadgeEl = document.getElementById('boss-phase-badge')!;
    this.bossHpFillEl = document.getElementById('boss-hp-fill')!;
    this.warningBannerEl = document.getElementById('warning-banner')!;
    this.stageBadgeEl = document.getElementById('stage-badge');
    this.loopBadgeEl = document.getElementById('loop-badge');
    this.stageClearBannerEl = document.getElementById('stage-clear-banner');
    this.startScreen = document.getElementById('start-screen')!;
    this.gameOverScreen = document.getElementById('game-over-screen')!;
    this.pauseScreen = document.getElementById('pause-screen');
    this.pauseBtn = document.getElementById('pause-btn');
    this.pauseIcon = document.getElementById('pause-icon');
    this.pauseText = document.getElementById('pause-text');
    this.startHighScoreEl = document.getElementById('start-high-score')!;
    this.finalScoreEl = document.getElementById('final-score')!;
    this.finalHighScoreEl = document.getElementById('final-high-score')!;
    this.enemiesKilledEl = document.getElementById('enemies-killed')!;

    this.initCargoSchedule();
    this.setupEvents();
    this.resizeCanvas();
    this.updateHUD();
    this.startHighScoreEl.textContent = this.highScore.toLocaleString();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  togglePause() {
    if (this.state !== 'playing') return;
    if (this.isPaused) this.resumeGame();
    else this.pauseGame();
  }

  pauseGame() {
    if (this.state !== 'playing' || this.isPaused) return;
    this.isPaused = true;
    this.keys = {};
    this.pauseStartTime = performance.now();
    if (this.pauseScreen) this.pauseScreen.classList.remove('hidden');
    if (this.pauseIcon) this.pauseIcon.textContent = '▶️';
    if (this.pauseText) this.pauseText.textContent = 'ต่อ';
  }

  resumeGame() {
    if (!this.isPaused) return;
    const pausedDuration = performance.now() - this.pauseStartTime;
    this.lastShotTime += pausedDuration;
    this.lastMissileTime += pausedDuration;
    this.itemDrops.forEach(item => item.spawnTime += pausedDuration);
    this.secondaryItemDrops.forEach(item => item.spawnTime += pausedDuration);
    this.keys = {};
    this.isPaused = false;
    if (this.pauseScreen) this.pauseScreen.classList.add('hidden');
    if (this.pauseIcon) this.pauseIcon.textContent = '⏸️';
    if (this.pauseText) this.pauseText.textContent = 'พัก';
  }

  initCargoSchedule() {
    const cfg = STAGES[this.stage - 1] || STAGES[0];
    const mb = cfg.targetKillsToMiniBoss;
    const sb = cfg.targetKillsToBoss;
    const k1 = Math.max(3, Math.round(mb * 0.35));
    const k2 = Math.max(k1 + 3, Math.round(mb * 0.75));
    const k3 = mb + Math.max(3, Math.round((sb - mb) * 0.35));
    const k4 = mb + Math.max((k3 - mb) + 3, Math.round((sb - mb) * 0.75));

    this.cargoSchedule = [
      { kills: k1, x: 140, type: 'main', spawned: false },
      { kills: k2, x: 340, type: 'secondary', spawned: false },
      { kills: k3, x: 200, type: 'main', spawned: false },
      { kills: k4, x: 300, type: 'secondary', spawned: false }
    ];
  }

  resizeCanvas() {
    const wrapper = document.getElementById('game-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    this.canvas.width = 480;
    this.canvas.height = Math.max(680, Math.min(840, Math.round(480 * (rect.height / rect.width))));
    this.starfield.resize(this.canvas.width, this.canvas.height);
    this.player.canvasWidth = this.canvas.width;
    this.player.canvasHeight = this.canvas.height;
  }

  setupEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('keydown', (e) => {
      this.sound.init();
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'playing') {
          e.preventDefault();
          this.togglePause();
          return;
        }
      }
      this.keys[e.code] = true;
      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.state === 'start' || this.state === 'gameover') {
          e.preventDefault();
          this.startGame();
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    document.getElementById('start-btn')?.addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });
    document.getElementById('resume-btn')?.addEventListener('click', () => {
      this.sound.init();
      if (this.isPaused) this.resumeGame();
    });

    this.pauseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.init();
      if (this.state === 'playing') this.togglePause();
    });

    const soundBtn = document.getElementById('sound-toggle-btn');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');
    soundBtn?.addEventListener('click', () => {
      this.sound.init();
      this.sound.enabled = !this.sound.enabled;
      if (soundIcon) soundIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
      if (soundText) soundText.textContent = this.sound.enabled ? 'เสียง' : 'ปิด';
    });

    const bindTouch = (id: string, code: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const startP = (e: Event) => {
        e.preventDefault();
        this.sound.init();
        this.keys[code] = true;
        el.classList.add('active');
      };
      const endP = (e: Event) => {
        e.preventDefault();
        this.keys[code] = false;
        el.classList.remove('active');
      };
      el.addEventListener('touchstart', startP, { passive: false });
      el.addEventListener('touchend', endP, { passive: false });
      el.addEventListener('touchcancel', endP, { passive: false });
      el.addEventListener('mousedown', startP);
      el.addEventListener('mouseup', endP);
      el.addEventListener('mouseleave', endP);
    };

    bindTouch('m-up', 'KeyW');
    bindTouch('m-down', 'KeyS');
    bindTouch('m-left', 'KeyA');
    bindTouch('m-right', 'KeyD');
    bindTouch('m-fire', 'Space');

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (this.state !== 'playing') return;
      this.sound.init();
      const t = e.touches[0];
      const r = this.canvas.getBoundingClientRect();
      lastX = ((t.clientX - r.left) / r.width) * this.canvas.width;
      lastY = ((t.clientY - r.top) / r.height) * this.canvas.height;
      isDragging = true;
      this.keys['Space'] = true;
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (!isDragging || this.state !== 'playing') return;
      const t = e.touches[0];
      const r = this.canvas.getBoundingClientRect();
      const curX = ((t.clientX - r.left) / r.width) * this.canvas.width;
      const curY = ((t.clientY - r.top) / r.height) * this.canvas.height;
      this.player.x += (curX - lastX) * 1.15;
      this.player.y += (curY - lastY) * 1.15;
      lastX = curX;
      lastY = curY;
    }, { passive: true });

    const stopDrag = () => {
      isDragging = false;
      if (!document.getElementById('m-fire')?.classList.contains('active')) {
        this.keys['Space'] = false;
      }
    };
    this.canvas.addEventListener('touchend', stopDrag);
    this.canvas.addEventListener('touchcancel', stopDrag);
  }

  startGame() {
    this.score = 0;
    this.lives = 3;
    this.enemiesKilled = 0;
    this.stage = 1;
    this.loop = 1;
    this.stageKills = 0;
    this.isStageClearing = false;
    this.warpEffect = 0;
    this.bullets = [];
    this.missiles = [];
    this.fireAoEs = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.itemDrops = [];
    this.secondaryItemDrops = [];
    this.particles = [];
    this.scoreTexts = [];
    this.spawnTimer = 0;
    this.screenShake = 0;
    this.activeBoss = null;
    this.miniBossSpawned = false;
    this.stageBossSpawned = false;
    this.initCargoSchedule();
    this.starfield.bgGradient = STAGES[0].bgGradient;
    this.hideBossBar();
    this.hideWarning();
    this.player.reset();
    this.player.triggerInvulnerability(60);
    this.isPaused = false;
    if (this.pauseScreen) this.pauseScreen.classList.add('hidden');
    if (this.pauseIcon) this.pauseIcon.textContent = '⏸️';
    if (this.pauseText) this.pauseText.textContent = 'พัก';
    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    if (this.stageClearBannerEl) this.stageClearBannerEl.classList.add('hidden');
    this.state = 'playing';
    this.updateHUD();
  }

  triggerGameOver() {
    this.state = 'gameover';
    this.isPaused = false;
    if (this.pauseScreen) this.pauseScreen.classList.add('hidden');
    this.sound.playGameOver();
    this.createExplosion(this.player.x, this.player.y, '#38bdf8', 40, 7);
    this.createExplosion(this.player.x, this.player.y, '#f97316', 30, 6);
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('space_shooter_high_score', this.highScore.toString());
    }
    const finalStageEl = document.getElementById('final-stage-reached');
    if (finalStageEl) {
      finalStageEl.textContent = `STAGE ${this.stage}${this.loop > 1 ? ` (LOOP ${this.loop})` : ''}`;
    }
    this.finalScoreEl.textContent = this.score.toLocaleString();
    this.finalHighScoreEl.textContent = this.highScore.toLocaleString();
    this.enemiesKilledEl.textContent = `${this.enemiesKilled} ลำ`;
    setTimeout(() => {
      this.gameOverScreen.classList.remove('hidden');
    }, 600);
  }

  createExplosion(x: number, y: number, color = '#f97316', count = 20, speed = 4, isShard = false) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color, speed, Math.random() * 3 + 1.5, Math.random() * 25 + 15, isShard));
    }
  }

  showWarning(text: string, durationMs = 2400) {
    this.warningBannerEl.textContent = text;
    this.warningBannerEl.classList.add('active');
    this.sound.playWarningAlarm();
    setTimeout(() => {
      this.hideWarning();
    }, durationMs);
  }

  hideWarning() {
    this.warningBannerEl.classList.remove('active');
  }

  showBossBar(name: string, badgeText: string) {
    this.bossNameEl.textContent = name;
    this.bossPhaseBadgeEl.textContent = badgeText;
    this.bossPhaseBadgeEl.className = 'boss-phase-badge';
    this.bossHpFillEl.className = 'boss-hp-fill';
    this.bossHpFillEl.style.width = '100%';
    this.bossBarEl.classList.add('active');
  }

  hideBossBar() {
    this.bossBarEl.classList.remove('active');
  }

  updateBossBar(currentHp: number, maxHp: number, isPhase2 = false) {
    const pct = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));
    this.bossHpFillEl.style.width = `${pct}%`;
    if (isPhase2) {
      this.bossPhaseBadgeEl.textContent = 'PHASE 2 (ENRAGED)';
      this.bossPhaseBadgeEl.classList.add('phase2');
      this.bossHpFillEl.classList.add('phase2');
    }
  }

  spawnEnemy() {
    if (this.activeBoss || this.isStageClearing) return;
    const cfg = STAGES[this.stage - 1] || STAGES[0];

    for (let i = 0; i < this.cargoSchedule.length; i++) {
      const c = this.cargoSchedule[i];
      if (!c.spawned && this.stageKills >= c.kills) {
        c.spawned = true;
        this.enemies.push(new CargoTransport(c.x, c.type));
        return;
      }
    }

    if (!this.miniBossSpawned && this.stageKills >= cfg.targetKillsToMiniBoss) {
      this.miniBossSpawned = true;
      this.showWarning(`⚠️ WARNING: ${cfg.miniBossName} DETECTED ⚠️`, 2400);
      setTimeout(() => {
        if (this.state !== 'playing' || this.isStageClearing) return;
        const mb = new MiniBoss(this.canvas.width);
        this.enemies.push(mb);
        this.activeBoss = mb;
        this.showBossBar(cfg.miniBossName, 'DUAL TURRETS');
      }, 1000);
      return;
    }

    if (!this.stageBossSpawned && this.stageKills >= cfg.targetKillsToBoss) {
      this.stageBossSpawned = true;
      this.showWarning(`🚨 WARNING: ${cfg.bossName} APPROACHING 🚨`, 2800);
      setTimeout(() => {
        if (this.state !== 'playing' || this.isStageClearing) return;
        const sb = new StageBoss(this.canvas.width, this.stage, this.loop);
        this.enemies.push(sb);
        this.activeBoss = sb;
        this.showBossBar(cfg.bossName, 'PHASE 1');
      }, 1200);
      return;
    }

    const r = Math.random();
    if (this.stage >= 5) {
      if (r < 0.28) {
        this.enemies.push(new ScoutEnemy(this.canvas.width));
      } else if (r < 0.62) {
        this.enemies.push(new AssaultEnemy(this.canvas.width));
      } else {
        this.enemies.push(new BomberEnemy(this.canvas.width));
      }
    } else {
      if (r < 0.42) {
        this.enemies.push(new ScoutEnemy(this.canvas.width));
      } else if (r < 0.76) {
        this.enemies.push(new AssaultEnemy(this.canvas.width));
      } else {
        this.enemies.push(new BomberEnemy(this.canvas.width));
      }
    }
  }

  fireBullet() {
    const now = performance.now();
    const cooldown = this.player.weaponType === 'laser' ? 140 : 130;
    if (now - this.lastShotTime >= cooldown) {
      this.lastShotTime = now;
      const px = this.player.x;
      const py = this.player.y;
      const type = this.player.weaponType;
      const lv = this.player.weaponLevel;
      if (type === 'vulcan') {
        this.sound.playShoot();
        let angles = [0];
        if (lv === 2) angles = [-0.08, 0.08];
        else if (lv === 3) angles = [-0.16, 0, 0.16];
        else if (lv === 4) angles = [-0.24, -0.08, 0.08, 0.24];
        else if (lv === 5) angles = [-0.32, -0.16, 0, 0.16, 0.32];
        else if (lv === 6) angles = [-0.40, -0.24, -0.08, 0.08, 0.24, 0.40];
        else if (lv === 7) angles = [-0.48, -0.32, -0.16, 0, 0.16, 0.32, 0.48];
        else if (lv >= 8) angles = [-0.54, -0.36, -0.18, 0, 0.18, 0.36, 0.54];
        const bulletSpeed = lv >= 8 ? 12.5 : 11.5;
        const dmg = lv >= 8 ? 1.6 : 1.0 + (lv - 1) * 0.08;
        const w = lv >= 8 ? 8 : 6;
        const h = lv >= 8 ? 18 : 15;
        angles.forEach(ang => {
          const vx = Math.sin(ang) * bulletSpeed;
          const vy = -Math.cos(ang) * bulletSpeed;
          this.bullets.push(new Bullet(px, py - 16, vx, vy, 'vulcan', dmg, w, h));
        });
      } else {
        this.sound.playLaserShoot();
        const beamConfigs = [
          [{ off: 0, w: 5, dmg: 1.8 }],
          [{ off: -8, w: 5, dmg: 2.0 }, { off: 8, w: 5, dmg: 2.0 }],
          [{ off: -9, w: 7, dmg: 2.5 }, { off: 9, w: 7, dmg: 2.5 }],
          [{ off: -14, w: 5, dmg: 2.6 }, { off: 0, w: 8, dmg: 3.0 }, { off: 14, w: 5, dmg: 2.6 }],
          [{ off: -12, w: 8, dmg: 3.4 }, { off: 0, w: 8, dmg: 3.4 }, { off: 12, w: 8, dmg: 3.4 }],
          [{ off: -16, w: 8, dmg: 3.8 }, { off: -6, w: 8, dmg: 3.8 }, { off: 6, w: 8, dmg: 3.8 }, { off: 16, w: 8, dmg: 3.8 }],
          [{ off: -20, w: 9, dmg: 4.5 }, { off: -10, w: 9, dmg: 4.5 }, { off: 0, w: 10, dmg: 4.8 }, { off: 10, w: 9, dmg: 4.5 }, { off: 20, w: 9, dmg: 4.5 }],
          [{ off: -22, w: 11, dmg: 5.6 }, { off: -11, w: 11, dmg: 5.6 }, { off: 0, w: 13, dmg: 6.2 }, { off: 11, w: 11, dmg: 5.6 }, { off: 22, w: 11, dmg: 5.6 }]
        ];
        const cfg = beamConfigs[Math.min(lv, 8) - 1];
        cfg.forEach(beam => {
          this.bullets.push(new Bullet(px + beam.off, py - 18, 0, -14, 'laser', beam.dmg, beam.w, 24));
        });
      }
    }
    this.fireSecondaryMissile(now);
  }

  fireSecondaryMissile(now: number) {
    if (!this.player.secondaryType || this.player.secondaryLevel <= 0) return;
    const secType = this.player.secondaryType;
    const secLv = this.player.secondaryLevel;
    const px = this.player.x;
    const py = this.player.y;
    if (secType === 'nuclear') {
      if (now - this.lastMissileTime < 540) return;
      this.lastMissileTime = now;
      this.sound.playRocketLaunch();
      let offsets = [0];
      let dmg = 7.5;
      let aoe = 45;
      let burn = 1.5;
      if (secLv === 2) { offsets = [-14, 14]; dmg = 8.5; aoe = 50; burn = 1.8; }
      else if (secLv === 3) { offsets = [-20, 0, 20]; dmg = 9.5; aoe = 55; burn = 2.0; }
      else if (secLv >= 4) { offsets = [-24, -8, 8, 24]; dmg = 11.0; aoe = 65; burn = 2.5; }
      offsets.forEach(off => {
        this.missiles.push(new NuclearMissile(px + off, py - 12, dmg, aoe, burn));
      });
    } else if (secType === 'homing') {
      if (now - this.lastMissileTime < 380) return;
      this.lastMissileTime = now;
      this.sound.playHomingLaunch();
      let configs: Array<{ offX: number; vx: number; vy: number; turn: number; dmg: number; maxSpd: number }> = [];
      if (secLv === 1) {
        configs = [
          { offX: -14, vx: -3.5, vy: -6.5, turn: 0.16, dmg: 3.2, maxSpd: 9.5 },
          { offX: 14, vx: 3.5, vy: -6.5, turn: 0.16, dmg: 3.2, maxSpd: 9.5 }
        ];
      } else if (secLv === 2) {
        configs = [
          { offX: -16, vx: -4.5, vy: -6.0, turn: 0.20, dmg: 3.6, maxSpd: 10.2 },
          { offX: 0, vx: 0, vy: -7.5, turn: 0.20, dmg: 3.6, maxSpd: 10.2 },
          { offX: 16, vx: 4.5, vy: -6.0, turn: 0.20, dmg: 3.6, maxSpd: 10.2 }
        ];
      } else if (secLv === 3) {
        configs = [
          { offX: -18, vx: -5.5, vy: -5.5, turn: 0.24, dmg: 4.0, maxSpd: 11.0 },
          { offX: -6, vx: -2.0, vy: -7.0, turn: 0.24, dmg: 4.0, maxSpd: 11.0 },
          { offX: 6, vx: 2.0, vy: -7.0, turn: 0.24, dmg: 4.0, maxSpd: 11.0 },
          { offX: 18, vx: 5.5, vy: -5.5, turn: 0.24, dmg: 4.0, maxSpd: 11.0 }
        ];
      } else {
        configs = [
          { offX: -22, vx: -6.5, vy: -5.0, turn: 0.28, dmg: 4.5, maxSpd: 12.0 },
          { offX: -14, vx: -4.0, vy: -6.2, turn: 0.28, dmg: 4.5, maxSpd: 12.0 },
          { offX: -5, vx: -1.5, vy: -7.5, turn: 0.28, dmg: 4.5, maxSpd: 12.0 },
          { offX: 5, vx: 1.5, vy: -7.5, turn: 0.28, dmg: 4.5, maxSpd: 12.0 },
          { offX: 14, vx: 4.0, vy: -6.2, turn: 0.28, dmg: 4.5, maxSpd: 12.0 },
          { offX: 22, vx: 6.5, vy: -5.0, turn: 0.28, dmg: 4.5, maxSpd: 12.0 }
        ];
      }
      configs.forEach(c => {
        this.missiles.push(new HomingMissile(px + c.offX, py - 10, c.vx, c.vy, c.dmg, c.turn, c.maxSpd));
      });
    }
  }

  handleEnemyDefeat(enemy: ScoutEnemy | AssaultEnemy | CargoTransport | BomberEnemy | MiniBoss | StageBoss) {
    enemy.active = false;
    this.enemiesKilled++;
    this.stageKills++;
    this.score += enemy.scoreValue;
    this.updateHUD();

    if (enemy.type === 'cargo') {
      const cargo = enemy as CargoTransport;
      if (cargo.cargoType === 'main') {
        this.itemDrops.push(new ItemDrop(enemy.x, enemy.y, 'vulcan'));
      } else {
        this.secondaryItemDrops.push(new SecondaryItemDrop(enemy.x, enemy.y, 'nuclear'));
      }
    }

    if (enemy === this.activeBoss) {
      const isStageBoss = enemy.type === 'stageboss';
      this.activeBoss = null;
      this.hideBossBar();
      this.enemyBullets = [];
      this.screenShake = 18;
      this.sound.playExplosion(true);
      for (let k = 0; k < 7; k++) {
        setTimeout(() => {
          this.createExplosion(
            enemy.x + (Math.random() - 0.5) * 85,
            enemy.y + (Math.random() - 0.5) * 65,
            '#ef4444', 28, 6.5
          );
        }, k * 110);
      }
      this.scoreTexts.push(new ScoreText(enemy.x, enemy.y, `+${enemy.scoreValue} ${isStageBoss ? 'STAGE CLEARED!' : 'MINI-BOSS CLEARED!'}`, '#facc15'));

      if (isStageBoss) {
        this.triggerStageClear();
      }
    } else {
      this.sound.playExplosion(enemy.type === 'bomber');
      this.createExplosion(enemy.x, enemy.y, enemy.color, 20, 4.5);
      this.scoreTexts.push(new ScoreText(enemy.x, enemy.y, `+${enemy.scoreValue}`, '#facc15'));
    }
  }

  triggerStageClear() {
    this.isStageClearing = true;
    this.sound.playStageClear();
    this.warpEffect = 1;
    this.enemyBullets = [];

    const currentCfg = STAGES[this.stage - 1] || STAGES[0];
    const bonus = currentCfg.clearBonus * this.loop;
    this.score += bonus;
    this.updateHUD();

    const banner = this.stageClearBannerEl;
    const titleEl = document.getElementById('stage-clear-title');
    const bonusEl = document.getElementById('stage-clear-bonus');
    const nextEl = document.getElementById('stage-clear-next');
    const progressEl = document.getElementById('stage-clear-progress');
    const tagEl = document.getElementById('stage-clear-tag');

    if (tagEl) tagEl.textContent = this.stage === 8 ? '🎉 MISSION COMPLETE 🎉' : 'MISSION ACCOMPLISHED';
    if (titleEl) titleEl.textContent = `STAGE ${this.stage} CLEARED!`;
    if (bonusEl) bonusEl.textContent = `+${bonus.toLocaleString()} PTS (STAGE CLEAR BONUS)`;

    if (nextEl) {
      if (this.stage < 8) {
        const nextCfg = STAGES[this.stage];
        nextEl.textContent = `WARPING TO STAGE ${this.stage + 1}: ${nextCfg.name}...`;
      } else {
        nextEl.textContent = `ALL 8 STAGES CONQUERED! PREPARING LOOP ${this.loop + 1}...`;
      }
    }

    if (banner) banner.classList.remove('hidden');

    const duration = 3500;
    const startT = performance.now();

    const animInterval = setInterval(() => {
      const elapsed = performance.now() - startT;
      const pct = Math.min(100, (elapsed / duration) * 100);
      if (progressEl) progressEl.style.width = `${pct}%`;

      if (elapsed >= duration) {
        clearInterval(animInterval);
        if (banner) banner.classList.add('hidden');
        if (progressEl) progressEl.style.width = '0%';
        this.advanceToNextStage();
      }
    }, 30);
  }

  advanceToNextStage() {
    this.isStageClearing = false;
    this.warpEffect = 0;
    this.stageKills = 0;
    this.miniBossSpawned = false;
    this.stageBossSpawned = false;

    if (this.stage < 8) {
      this.stage++;
    } else {
      this.stage = 1;
      this.loop++;
    }

    this.initCargoSchedule();
    const cfg = STAGES[this.stage - 1] || STAGES[0];
    this.starfield.bgGradient = cfg.bgGradient;
    this.updateHUD();
    this.player.triggerInvulnerability(90);
    this.showWarning(`ENTERING STAGE ${this.stage}: ${cfg.name}`, 2200);
  }

  updateHUD() {
    this.scoreDisplay.textContent = this.score.toLocaleString();
    const hearts = this.livesContainer.querySelectorAll('.heart-icon');
    hearts.forEach((h, i) => {
      if (i < this.lives) h.classList.remove('lost');
      else h.classList.add('lost');
    });

    const stageBadge = document.getElementById('stage-badge');
    const loopBadge = document.getElementById('loop-badge');
    if (stageBadge) {
      stageBadge.textContent = `STAGE ${this.stage}/8`;
    }
    if (loopBadge) {
      if (this.loop > 1) {
        loopBadge.className = 'loop-badge';
        loopBadge.textContent = `LOOP ${this.loop}`;
      } else {
        loopBadge.className = 'loop-badge hidden';
      }
    }

    const wStatus = document.getElementById('weapon-status');
    const wName = document.getElementById('weapon-name-display');
    const pipsContainer = document.getElementById('weapon-pips-container');
    if (wStatus && wName && pipsContainer) {
      const type = this.player.weaponType;
      const lv = this.player.weaponLevel;
      wStatus.className = `weapon-badge ${type}`;
      wName.className = `weapon-title ${type}`;
      wName.textContent = `${type.toUpperCase()} LV.${lv}${lv >= 8 ? ' (MAX)' : ''}`;
      const pips = pipsContainer.querySelectorAll('.pip');
      pips.forEach((p, idx) => {
        p.className = 'pip' + (idx < lv ? ` active ${type}` : '');
      });
    }

    const sStatus = document.getElementById('secondary-status');
    const sName = document.getElementById('secondary-name-display');
    const sPipsContainer = document.getElementById('secondary-pips-container');
    if (sStatus && sName && sPipsContainer) {
      const sType = this.player.secondaryType;
      const sLv = this.player.secondaryLevel;
      if (!sType || sLv <= 0) {
        sStatus.className = 'weapon-badge none';
        sName.className = 'weapon-title none';
        sName.textContent = 'MISSILE: -';
        const pips = sPipsContainer.querySelectorAll('.pip');
        pips.forEach(p => { p.className = 'pip'; });
      } else {
        sStatus.className = `weapon-badge ${sType}`;
        sName.className = `weapon-title ${sType}`;
        sName.textContent = `${sType.toUpperCase()} LV.${sLv}${sLv >= 4 ? ' (MAX)' : ''}`;
        const pips = sPipsContainer.querySelectorAll('.pip');
        pips.forEach((p, idx) => {
          p.className = 'pip' + (idx < sLv ? ` active ${sType}` : '');
        });
      }
    }
  }

  checkCollision(r1: { x: number; y: number; width: number; height: number }, r2: { x: number; y: number; width: number; height: number }) {
    return (
      r1.x - r1.width / 2 < r2.x + r2.width / 2 &&
      r1.x + r1.width / 2 > r2.x - r2.width / 2 &&
      r1.y - r1.height / 2 < r2.y + r2.height / 2 &&
      r1.y + r1.height / 2 > r2.y - r2.height / 2
    );
  }

  update(timestamp: number) {
    if (this.isPaused) return;
    const now = timestamp || performance.now();
    const currentCfg = STAGES[this.stage - 1] || STAGES[0];
    this.starfield.update(currentCfg.starSpeedMul, this.warpEffect > 0);
    if (this.screenShake > 0) {
      this.screenShake *= 0.88;
      if (this.screenShake < 0.2) this.screenShake = 0;
    }
    this.particles = this.particles.filter(p => p.update());
    this.scoreTexts = this.scoreTexts.filter(st => st.update());
    if (this.state !== 'playing') return;

    this.player.update(this.keys);
    if (this.keys['Space']) this.fireBullet();

    this.bullets.forEach(b => b.update());
    this.bullets = this.bullets.filter(b => b.active);

    this.enemyBullets.forEach(eb => eb.update(this.canvas.width, this.canvas.height));
    this.enemyBullets = this.enemyBullets.filter(eb => eb.active);

    this.itemDrops.forEach(item => item.update(this.canvas.height, now));
    this.itemDrops = this.itemDrops.filter(item => item.active);

    this.secondaryItemDrops.forEach(item => item.update(this.canvas.height, now));
    this.secondaryItemDrops = this.secondaryItemDrops.filter(item => item.active);

    this.spawnTimer++;
    if (this.spawnTimer >= 75) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    const spawnEnemyBullet = (eb: EnemyBullet) => this.enemyBullets.push(eb);
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.type === 'miniboss') {
        (e as MiniBoss).update(this.player, spawnEnemyBullet, this.sound);
        this.updateBossBar(e.hp, e.maxHp, false);
      } else if (e.type === 'stageboss') {
        const sb = e as StageBoss;
        sb.update(this.player, spawnEnemyBullet, this.sound, (x, y, newPhase) => {
          this.screenShake = 18;
          this.createExplosion(x, y, '#ef4444', 36, 8, true);
          this.createExplosion(x, y, '#ffffff', 25, 6);
          this.scoreTexts.push(new ScoreText(x, y - 40, `💥 PHASE ${newPhase}: ENRAGED! 💥`, '#ef4444'));
        });
        this.updateBossBar(sb.hp, sb.maxHp, sb.phase >= 2);
      } else {
        (e as ScoutEnemy | AssaultEnemy | BomberEnemy).update(this.player, spawnEnemyBullet, this.sound);
      }
    }
    this.enemies = this.enemies.filter(e => e.active);

    const targetables: Targetable[] = [];
    for (const e of this.enemies) {
      if (e.active) {
        if (e.type === 'miniboss') {
          const mb = e as MiniBoss;
          if (!mb.turretL.destroyed) {
            targetables.push({
              x: mb.x + mb.turretL.offsetX,
              y: mb.y + mb.turretL.offsetY,
              width: mb.turretL.radius * 2,
              height: mb.turretL.radius * 2,
              radius: mb.turretL.radius,
              active: true,
              isTurret: true,
              isLeft: true,
              parentBoss: mb
            });
          }
          if (!mb.turretR.destroyed) {
            targetables.push({
              x: mb.x + mb.turretR.offsetX,
              y: mb.y + mb.turretR.offsetY,
              width: mb.turretR.radius * 2,
              height: mb.turretR.radius * 2,
              radius: mb.turretR.radius,
              active: true,
              isTurret: true,
              isLeft: false,
              parentBoss: mb
            });
          }
          targetables.push(mb);
        } else {
          targetables.push(e);
        }
      }
    }

    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i];
      if (m instanceof NuclearMissile) {
        m.update();
      } else if (m instanceof HomingMissile) {
        m.update(targetables);
      }
      if (!m.active) continue;

      for (let j = 0; j < targetables.length; j++) {
        const target = targetables[j];
        if (!target.active) continue;
        const hitBoxW = target.radius ? target.radius * 2 : (target.width || 30);
        const hitBoxH = target.radius ? target.radius * 2 : (target.height || 30);
        const isColliding = (
          m.x > target.x - hitBoxW / 2 &&
          m.x < target.x + hitBoxW / 2 &&
          m.y > target.y - hitBoxH / 2 &&
          m.y < target.y + hitBoxH / 2
        );
        if (isColliding) {
          m.active = false;
          if (m instanceof NuclearMissile) {
            this.fireAoEs.push(new FireAoE(m.x, m.y, m.aoeRadius, m.burnDamage));
            this.createExplosion(m.x, m.y, '#facc15', 26, 6);
            this.createExplosion(m.x, m.y, '#ef4444', 18, 5);
            this.sound.playNukeExplosion();
            this.screenShake = Math.max(this.screenShake, 9);
          } else {
            this.createExplosion(m.x, m.y, '#22c55e', 14, 3.5);
            this.sound.playExplosion(false);
          }
          if (target.isTurret && target.parentBoss) {
            const destroyed = target.parentBoss.hitTurret(!!target.isLeft, m.damage);
            if (destroyed) {
              target.active = false;
              this.sound.playExplosion(true);
              this.createExplosion(target.x, target.y, '#f59e0b', 22, 5);
              this.scoreTexts.push(new ScoreText(target.x, target.y, '+300 TURRET DESTROYED', '#facc15'));
              this.score += 300;
              this.updateHUD();
            }
          } else if (target.type === 'miniboss') {
            const destroyed = (target as MiniBoss).hitBody(m.damage);
            if (destroyed) this.handleEnemyDefeat(target as MiniBoss);
          } else if (target.type === 'stageboss') {
            const destroyed = (target as StageBoss).hit(m.damage);
            if (destroyed) this.handleEnemyDefeat(target as StageBoss);
          } else if (target.hit) {
            const destroyed = target.hit(m.damage);
            if (destroyed) this.handleEnemyDefeat(target as ScoutEnemy);
          }
          break;
        }
      }
    }
    this.missiles = this.missiles.filter(m => m.active);

    for (let i = this.fireAoEs.length - 1; i >= 0; i--) {
      const fire = this.fireAoEs[i];
      fire.update();
      if (!fire.active) continue;
      if (fire.tickTimer % 5 === 0) {
        for (const target of targetables) {
          if (!target.active) continue;
          const d = Math.hypot(fire.x - target.x, fire.y - target.y);
          const hitDist = fire.radius + (target.radius || (target.width ? target.width / 2 : 16));
          if (d < hitDist) {
            this.createExplosion(target.x + (Math.random() - 0.5) * 16, target.y + (Math.random() - 0.5) * 16, '#f97316', 2, 2);
            if (target.isTurret && target.parentBoss) {
              const destroyed = target.parentBoss.hitTurret(!!target.isLeft, fire.burnDamage);
              if (destroyed) {
                target.active = false;
                this.sound.playExplosion(true);
                this.createExplosion(target.x, target.y, '#f59e0b', 22, 5);
                this.scoreTexts.push(new ScoreText(target.x, target.y, '+300 TURRET MELTED!', '#facc15'));
                this.score += 300;
                this.updateHUD();
              }
            } else if (target.type === 'miniboss') {
              const destroyed = (target as MiniBoss).hitBody(fire.burnDamage);
              if (destroyed) this.handleEnemyDefeat(target as MiniBoss);
            } else if (target.type === 'stageboss') {
              const destroyed = (target as StageBoss).hit(fire.burnDamage);
              if (destroyed) this.handleEnemyDefeat(target as StageBoss);
            } else if (target.hit) {
              const destroyed = target.hit(fire.burnDamage);
              if (destroyed) this.handleEnemyDefeat(target as ScoutEnemy);
            }
          }
        }
      }
    }
    this.fireAoEs = this.fireAoEs.filter(f => f.active);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (enemy.type === 'miniboss') {
          const mb = enemy as MiniBoss;
          let hitTurret = false;
          if (!mb.turretL.destroyed) {
            const tx = mb.x + mb.turretL.offsetX;
            const ty = mb.y + mb.turretL.offsetY;
            if (Math.hypot(b.x - tx, b.y - ty) < mb.turretL.radius + 6) {
              if (b.pierce) { b.pierce--; if (b.pierce <= 0) b.active = false; } else { b.active = false; }
              hitTurret = true;
              const destroyed = mb.hitTurret(true, b.damage || 1);
              if (destroyed) {
                this.sound.playExplosion(true);
                this.createExplosion(tx, ty, '#f59e0b', 22, 5);
                this.scoreTexts.push(new ScoreText(tx, ty, '+300 TURRET DESTROYED', '#facc15'));
                this.score += 300;
                this.updateHUD();
              } else {
                this.createExplosion(b.x, b.y, '#ffffff', 3, 2);
              }
            }
          }
          if (!mb.turretR.destroyed && !hitTurret) {
            const tx = mb.x + mb.turretR.offsetX;
            const ty = mb.y + mb.turretR.offsetY;
            if (Math.hypot(b.x - tx, b.y - ty) < mb.turretR.radius + 6) {
              if (b.pierce) { b.pierce--; if (b.pierce <= 0) b.active = false; } else { b.active = false; }
              hitTurret = true;
              const destroyed = mb.hitTurret(false, b.damage || 1);
              if (destroyed) {
                this.sound.playExplosion(true);
                this.createExplosion(tx, ty, '#f59e0b', 22, 5);
                this.scoreTexts.push(new ScoreText(tx, ty, '+300 TURRET DESTROYED', '#facc15'));
                this.score += 300;
                this.updateHUD();
              } else {
                this.createExplosion(b.x, b.y, '#ffffff', 3, 2);
              }
            }
          }
          if (hitTurret) break;
        }

        if (this.checkCollision(b, enemy)) {
          if (b.pierce) { b.pierce--; if (b.pierce <= 0) b.active = false; } else { b.active = false; }
          let destroyed = false;
          if (enemy.type === 'miniboss') {
            destroyed = (enemy as MiniBoss).hitBody(b.damage || 1);
          } else {
            destroyed = (enemy as ScoutEnemy | AssaultEnemy | CargoTransport | BomberEnemy | StageBoss).hit(b.damage || 1);
          }
          if (destroyed) {
            this.handleEnemyDefeat(enemy);
          } else {
            this.createExplosion(b.x, b.y, '#ffffff', 3, 2);
          }
          break;
        }
      }
    }

    if (this.player.invulnerableTimer <= 0) {
      for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
        const eb = this.enemyBullets[i];
        if (Math.hypot(eb.x - this.player.x, eb.y - this.player.y) < 18) {
          eb.active = false;
          this.sound.playPlayerHit();
          this.createExplosion(this.player.x, this.player.y, '#ef4444', 20, 4.5);
          this.lives--;
          this.updateHUD();
          this.screenShake = 10;
          if (this.lives <= 0) {
            this.triggerGameOver();
            return;
          } else {
            this.player.triggerInvulnerability(90);
          }
          break;
        }
      }
    }

    if (this.player.invulnerableTimer <= 0) {
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const enemy = this.enemies[i];
        if (this.checkCollision(this.player, enemy)) {
          if (enemy !== this.activeBoss) enemy.active = false;
          this.sound.playPlayerHit();
          this.createExplosion(this.player.x, this.player.y, '#ef4444', 24, 4.5);
          this.lives--;
          this.updateHUD();
          this.screenShake = 11;
          if (this.lives <= 0) {
            this.triggerGameOver();
            return;
          } else {
            this.player.triggerInvulnerability(90);
          }
          break;
        }
      }
    }

    for (let i = this.itemDrops.length - 1; i >= 0; i--) {
      const item = this.itemDrops[i];
      if (Math.hypot(item.x - this.player.x, item.y - this.player.y) < 32) {
        item.active = false;
        const itemType = item.getCurrentColor(now);
        const colorHex = itemType === 'vulcan' ? '#ef4444' : '#38bdf8';
        if (this.player.weaponType === itemType) {
          if (this.player.weaponLevel < 8) {
            this.player.weaponLevel++;
            this.sound.playPowerUp();
            this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 30, `+${itemType.toUpperCase()} LV.${this.player.weaponLevel}!`, colorHex));
            this.score += 300;
          } else {
            this.score += 5000;
            this.sound.playPowerUp();
            this.sound.playItemCollect();
            this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 32, '⭐ +5,000 MAX POWER BONUS! ⭐', '#facc15'));
            this.createExplosion(this.player.x, this.player.y, '#facc15', 32, 6, true);
          }
        } else {
          this.player.weaponType = itemType;
          this.sound.playPowerUp();
          this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 30, `SWITCHED TO ${itemType.toUpperCase()} (LV.${this.player.weaponLevel})`, colorHex));
          this.score += 300;
        }
        this.updateHUD();
        this.player.triggerInvulnerability(50);
        this.createExplosion(item.x, item.y, colorHex, 20, 5);
      }
    }

    for (let i = this.secondaryItemDrops.length - 1; i >= 0; i--) {
      const item = this.secondaryItemDrops[i];
      if (Math.hypot(item.x - this.player.x, item.y - this.player.y) < 32) {
        item.active = false;
        const itemType = item.getCurrentType(now);
        const colorHex = itemType === 'nuclear' ? '#facc15' : '#4ade80';
        const typeName = itemType === 'nuclear' ? 'NUCLEAR' : 'HOMING';
        if (!this.player.secondaryType) {
          this.player.secondaryType = itemType;
          this.player.secondaryLevel = 1;
          this.sound.playPowerUp();
          this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 30, `+${typeName} MISSILE LV.1!`, colorHex));
          this.score += 300;
        } else if (this.player.secondaryType === itemType) {
          if (this.player.secondaryLevel < 4) {
            this.player.secondaryLevel++;
            this.sound.playPowerUp();
            this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 30, `+${typeName} LV.${this.player.secondaryLevel}!`, colorHex));
            this.score += 300;
          } else {
            this.score += 5000;
            this.sound.playPowerUp();
            this.sound.playItemCollect();
            this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 32, '⭐ +5,000 MAX MISSILE BONUS! ⭐', '#facc15'));
            this.createExplosion(this.player.x, this.player.y, '#facc15', 32, 6, true);
          }
        } else {
          this.player.secondaryType = itemType;
          this.sound.playPowerUp();
          this.scoreTexts.push(new ScoreText(this.player.x, this.player.y - 30, `SWITCHED TO ${typeName} (LV.${this.player.secondaryLevel})`, colorHex));
          this.score += 300;
        }
        this.updateHUD();
        this.player.triggerInvulnerability(50);
        this.createExplosion(item.x, item.y, colorHex, 20, 5);
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    if (this.screenShake > 0) {
      const sx = (Math.random() - 0.5) * this.screenShake * 2;
      const sy = (Math.random() - 0.5) * this.screenShake * 2;
      this.ctx.translate(sx, sy);
    }
    const now = performance.now();
    this.starfield.draw(this.ctx, this.warpEffect > 0);

    for (const fire of this.fireAoEs) fire.draw(this.ctx);
    for (const item of this.itemDrops) item.draw(this.ctx, now);
    for (const secItem of this.secondaryItemDrops) secItem.draw(this.ctx, now);
    for (const b of this.bullets) b.draw(this.ctx);
    for (const m of this.missiles) m.draw(this.ctx);
    for (const eb of this.enemyBullets) eb.draw(this.ctx);
    for (const enemy of this.enemies) enemy.draw(this.ctx);
    if (this.state === 'playing') this.player.draw(this.ctx);
    for (const p of this.particles) p.draw(this.ctx);
    for (const st of this.scoreTexts) st.draw(this.ctx);

    this.ctx.restore();
  }

  gameLoop(timestamp: number) {
    this.update(timestamp);
    this.render();
    requestAnimationFrame((t) => this.gameLoop(t));
  }
}

// Auto-instantiate when DOM is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new GameEngine();
    });
  } else {
    new GameEngine();
  }
}
