/**
 * 8-Stage Progression Data & Stage Boss Archetypes
 */
import { EnemyBullet, SoundEffects } from './game.ts';

export interface StageConfig {
  stageNum: number;
  name: string;
  themeName: string;
  bgGradient: [string, string]; // Top & Bottom radial gradient colors
  accentColor: string;
  starSpeedMul: number;
  targetKillsToMiniBoss: number;
  targetKillsToBoss: number;
  miniBossName: string;
  bossName: string;
  clearBonus: number;
  bossType: number; // 1 to 8
}

export const STAGES: StageConfig[] = [
  {
    stageNum: 1,
    name: 'NEBULA PERIMETER',
    themeName: 'Deep Space Nebula',
    bgGradient: ['#0d1430', '#050711'],
    accentColor: '#38bdf8',
    starSpeedMul: 1.0,
    targetKillsToMiniBoss: 10,
    targetKillsToBoss: 22,
    miniBossName: 'MINI-BOSS: CRUSHER',
    bossName: 'BOSS: VOID DREADNOUGHT',
    clearBonus: 10000,
    bossType: 1
  },
  {
    stageNum: 2,
    name: 'ASTEROID FRONTIER',
    themeName: 'Silicon & Heavy Metals Belt',
    bgGradient: ['#291e12', '#080504'],
    accentColor: '#f59e0b',
    starSpeedMul: 1.15,
    targetKillsToMiniBoss: 12,
    targetKillsToBoss: 26,
    miniBossName: 'MINI-BOSS: MINER RIG',
    bossName: 'BOSS: IRON GOLEM TITAN',
    clearBonus: 15000,
    bossType: 2
  },
  {
    stageNum: 3,
    name: 'SOLAR FLARE SECTOR',
    themeName: 'Solar Corona Corona Storm',
    bgGradient: ['#3b1406', '#0f0402'],
    accentColor: '#f97316',
    starSpeedMul: 1.25,
    targetKillsToMiniBoss: 14,
    targetKillsToBoss: 28,
    miniBossName: 'MINI-BOSS: SOLAR PROBE',
    bossName: 'BOSS: HELIOS CARRIER',
    clearBonus: 20000,
    bossType: 3
  },
  {
    stageNum: 4,
    name: 'CYBERNETIC GRID',
    themeName: 'Neon Digital Matrix',
    bgGradient: ['#042f2e', '#021214'],
    accentColor: '#06b6d4',
    starSpeedMul: 1.35,
    targetKillsToMiniBoss: 15,
    targetKillsToBoss: 30,
    miniBossName: 'MINI-BOSS: LOGIC NODE',
    bossName: 'BOSS: CYBER CORE MATRIX',
    clearBonus: 25000,
    bossType: 4
  },
  {
    stageNum: 5,
    name: 'BIO-TOXIC SWARM',
    themeName: 'Organic Acid Spore Zone',
    bgGradient: ['#142e05', '#040d02'],
    accentColor: '#22c55e',
    starSpeedMul: 1.45,
    targetKillsToMiniBoss: 16,
    targetKillsToBoss: 32,
    miniBossName: 'MINI-BOSS: SPORE SPITTER',
    bossName: 'BOSS: HIVE EMPRESS',
    clearBonus: 30000,
    bossType: 5
  },
  {
    stageNum: 6,
    name: 'DARK MATTER RIFT',
    themeName: 'Gravitational Singularity',
    bgGradient: ['#280938', '#07020d'],
    accentColor: '#a855f7',
    starSpeedMul: 1.55,
    targetKillsToMiniBoss: 18,
    targetKillsToBoss: 34,
    miniBossName: 'MINI-BOSS: VOID STALKER',
    bossName: 'BOSS: SHADOW PHANTOM',
    clearBonus: 35000,
    bossType: 6
  },
  {
    stageNum: 7,
    name: 'CRIMSON CITADEL',
    themeName: 'Fleet Fortress Heavy Armory',
    bgGradient: ['#3f0713', '#110206'],
    accentColor: '#ef4444',
    starSpeedMul: 1.65,
    targetKillsToMiniBoss: 20,
    targetKillsToBoss: 36,
    miniBossName: 'MINI-BOSS: SIEGE CANNON',
    bossName: 'BOSS: ORBITAL FORTRESS',
    clearBonus: 40000,
    bossType: 7
  },
  {
    stageNum: 8,
    name: 'OMEGA GALACTIC CORE',
    themeName: 'Center of the Galaxy',
    bgGradient: ['#1e1b4b', '#030712'],
    accentColor: '#eab308',
    starSpeedMul: 1.8,
    targetKillsToMiniBoss: 22,
    targetKillsToBoss: 40,
    miniBossName: 'MINI-BOSS: OMEGA HERALD',
    bossName: 'BOSS: OMEGA DREADNOUGHT',
    clearBonus: 60000,
    bossType: 8
  }
];

// Stage Boss with individual attacks, visuals, and multi-phases per stage!
export class StageBoss {
  canvasWidth: number;
  stageNum: number;
  type = 'stageboss';
  name: string;
  width = 160;
  height = 95;
  hp: number;
  maxHp: number;
  scoreValue: number;
  phase = 1;
  maxPhases: number;
  color: string;
  x: number;
  y = -120;
  targetY = 110;
  speedX = 1.6;
  active = true;
  hitFlash = 0;
  attackTimer = 0;
  animTime = 0;
  loopMultiplier = 1;

  constructor(cw: number, stageNum: number, loopNum = 1) {
    this.canvasWidth = cw;
    this.stageNum = stageNum;
    this.loopMultiplier = 1 + (loopNum - 1) * 0.25;
    this.x = cw / 2;

    const cfg = STAGES[Math.min(stageNum - 1, 7)];
    this.name = cfg.bossName;
    this.color = cfg.accentColor;

    // HP scales progressively from Stage 1 (80) to Stage 8 (260) with loop bonus
    const baseHp = 70 + stageNum * 24;
    this.maxHp = Math.round(baseHp * this.loopMultiplier);
    this.hp = this.maxHp;
    this.scoreValue = (3000 + stageNum * 1000) * loopNum;
    this.maxPhases = stageNum === 8 ? 3 : 2;
  }

  update(
    player: { x: number; y: number },
    spawnBulletCallback: (b: EnemyBullet) => void,
    sound: SoundEffects,
    onPhaseChangeCallback: (x: number, y: number, newPhase: number) => void
  ) {
    this.animTime += 0.05;

    // Entry movement
    if (this.y < this.targetY) {
      this.y += 1.4;
    } else {
      this.x += this.speedX;
      if (this.x < 90) { this.x = 90; this.speedX *= -1; }
      if (this.x > this.canvasWidth - 90) { this.x = this.canvasWidth - 90; this.speedX *= -1; }
    }

    if (this.hitFlash > 0) this.hitFlash--;

    // Phase checks
    if (this.maxPhases === 3) {
      if (this.phase === 1 && this.hp <= this.maxHp * 0.66) {
        this.phase = 2;
        this.speedX = Math.sign(this.speedX) * 2.6;
        sound.playPhaseShift();
        onPhaseChangeCallback(this.x, this.y, 2);
      } else if (this.phase === 2 && this.hp <= this.maxHp * 0.33) {
        this.phase = 3;
        this.speedX = Math.sign(this.speedX) * 3.4;
        sound.playPhaseShift();
        onPhaseChangeCallback(this.x, this.y, 3);
      }
    } else if (this.maxPhases === 2) {
      if (this.phase === 1 && this.hp <= this.maxHp * 0.5) {
        this.phase = 2;
        this.speedX = Math.sign(this.speedX) * 2.8;
        sound.playPhaseShift();
        onPhaseChangeCallback(this.x, this.y, 2);
      }
    }

    // Boss Attack Patterns according to Stage and Phase!
    if (this.y >= this.targetY - 5) {
      this.attackTimer++;
      this.executeAttackPattern(player, spawnBulletCallback, sound);
    }
  }

  executeAttackPattern(
    player: { x: number; y: number },
    spawnBulletCallback: (b: EnemyBullet) => void,
    sound: SoundEffects
  ) {
    const t = this.attackTimer;
    const px = player.x;
    const py = player.y;

    switch (this.stageNum) {
      case 1: { // Stage 1: Void Dreadnought
        if (this.phase === 1) {
          if (t % 45 === 0) {
            spawnBulletCallback(new EnemyBullet(this.x - 38, this.y + 36, 0, 4.2, '#ef4444', 4.5));
            spawnBulletCallback(new EnemyBullet(this.x + 38, this.y + 36, 0, 4.2, '#ef4444', 4.5));
            sound.playEnemyShoot();
          }
          if (t % 120 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.25, 0, 0.25].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 40, Math.cos(angle + off) * 4.2, Math.sin(angle + off) * 4.2, '#f97316', 4.5));
            });
            sound.playBossLaser();
          }
        } else {
          // Phase 2: Red Crystal Spiral
          if (t % 11 === 0) {
            const spd = 3.8;
            const spiral = this.animTime * 4;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(spiral) * spd, Math.sin(spiral) * spd, '#ef4444', 4));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(spiral + Math.PI) * spd, Math.sin(spiral + Math.PI) * spd, '#ef4444', 4));
          }
          if (t % 40 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            spawnBulletCallback(new EnemyBullet(this.x - 18, this.y + 35, Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, '#dc2626', 4, true));
            spawnBulletCallback(new EnemyBullet(this.x + 18, this.y + 35, Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, '#dc2626', 4, true));
            sound.playBossLaser();
          }
        }
        break;
      }

      case 2: { // Stage 2: Iron Golem Titan (Spread clusters & Heavy Stone Flak)
        if (this.phase === 1) {
          if (t % 50 === 0) {
            [-0.3, -0.1, 0.1, 0.3].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 30, off * 8, 4.4, '#f59e0b', 5));
            });
            sound.playEnemyShoot();
          }
        } else {
          // Phase 2: Rapid Heavy Clusters
          if (t % 25 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.2, 0, 0.2].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 30, Math.cos(angle + off) * 5.2, Math.sin(angle + off) * 5.2, '#f59e0b', 5.5));
            });
            sound.playEnemyShoot();
          }
        }
        break;
      }

      case 3: { // Stage 3: Helios Carrier (Solar Burst waves)
        if (this.phase === 1) {
          if (t % 40 === 0) {
            const count = 7;
            for (let i = 0; i < count; i++) {
              const ang = Math.PI * 0.2 + (Math.PI * 0.6 * i) / (count - 1);
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(ang) * 4.2, Math.sin(ang) * 4.2, '#f97316', 4));
            }
            sound.playBossLaser();
          }
        } else {
          // Phase 2: Solar Corona Eruption
          if (t % 16 === 0) {
            const ang = this.animTime * 3 + (t % 32 === 0 ? 0 : Math.PI);
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang) * 4.8, Math.sin(ang) * 4.8, '#ea580c', 4.5));
          }
          if (t % 60 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.15, 0, 0.15].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 30, Math.cos(angle + off) * 6.2, Math.sin(angle + off) * 6.2, '#f97316', 4, true));
            });
            sound.playBossLaser();
          }
        }
        break;
      }

      case 4: { // Stage 4: Cyber Core Matrix (Grid Lasers & Electric Spark Rings)
        if (this.phase === 1) {
          if (t % 35 === 0) {
            spawnBulletCallback(new EnemyBullet(this.x - 45, this.y + 30, -1.5, 5.0, '#06b6d4', 4, true));
            spawnBulletCallback(new EnemyBullet(this.x + 45, this.y + 30, 1.5, 5.0, '#06b6d4', 4, true));
            sound.playBossLaser();
          }
          if (t % 70 === 0) {
            const count = 8;
            for (let i = 0; i < count; i++) {
              const ang = (Math.PI * 2 * i) / count;
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang) * 3.8, Math.sin(ang) * 3.8, '#22d3ee', 4));
            }
            sound.playEnemyShoot();
          }
        } else {
          // Phase 2: Rapid Matrix Grid
          if (t % 18 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(angle) * 6.8, Math.sin(angle) * 6.8, '#06b6d4', 4.5, true));
            sound.playBossLaser();
          }
          if (t % 45 === 0) {
            [-0.35, -0.18, 0, 0.18, 0.35].forEach(off => {
              const ang = Math.PI / 2 + off;
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 30, Math.cos(ang) * 4.5, Math.sin(ang) * 4.5, '#38bdf8', 4));
            });
            sound.playEnemyShoot();
          }
        }
        break;
      }

      case 5: { // Stage 5: Hive Empress (Acid Spores & Caustic Needles)
        if (this.phase === 1) {
          if (t % 30 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            spawnBulletCallback(new EnemyBullet(this.x - 30, this.y + 20, Math.cos(angle - 0.1) * 4.8, Math.sin(angle - 0.1) * 4.8, '#22c55e', 4));
            spawnBulletCallback(new EnemyBullet(this.x + 30, this.y + 20, Math.cos(angle + 0.1) * 4.8, Math.sin(angle + 0.1) * 4.8, '#22c55e', 4));
            sound.playEnemyShoot();
          }
        } else {
          // Phase 2: Toxic Needle Barrage
          if (t % 14 === 0) {
            const spread = (Math.random() - 0.5) * 0.8;
            const angle = Math.atan2(py - this.y, px - this.x) + spread;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(angle) * 5.4, Math.sin(angle) * 5.4, '#84cc16', 3.5));
          }
          if (t % 65 === 0) {
            const count = 10;
            for (let i = 0; i < count; i++) {
              const ang = (Math.PI * 2 * i) / count + this.animTime;
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang) * 3.6, Math.sin(ang) * 3.6, '#4ade80', 4.5));
            }
            sound.playBossLaser();
          }
        }
        break;
      }

      case 6: { // Stage 6: Shadow Phantom (Singularity Vortex & Mirror Beams)
        if (this.phase === 1) {
          if (t % 40 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.24, -0.08, 0.08, 0.24].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 30, Math.cos(angle + off) * 4.6, Math.sin(angle + off) * 4.6, '#a855f7', 4));
            });
            sound.playEnemyShoot();
          }
        } else {
          // Phase 2: Void Vortex Waves
          if (t % 10 === 0) {
            const ang = this.animTime * 5;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang) * 4.2, Math.sin(ang) * 4.2, '#c084fc', 4));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang + Math.PI) * 4.2, Math.sin(ang + Math.PI) * 4.2, '#c084fc', 4));
          }
          if (t % 50 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            spawnBulletCallback(new EnemyBullet(this.x - 30, this.y + 25, Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, '#9333ea', 4, true));
            spawnBulletCallback(new EnemyBullet(this.x + 30, this.y + 25, Math.cos(angle) * 6.5, Math.sin(angle) * 6.5, '#9333ea', 4, true));
            sound.playBossLaser();
          }
        }
        break;
      }

      case 7: { // Stage 7: Orbital Fortress (Triple Battlement Laser & Heavy Artillery)
        if (this.phase === 1) {
          if (t % 35 === 0) {
            spawnBulletCallback(new EnemyBullet(this.x - 55, this.y + 35, 0, 5.0, '#ef4444', 5, true));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 40, 0, 5.0, '#ef4444', 5, true));
            spawnBulletCallback(new EnemyBullet(this.x + 55, this.y + 35, 0, 5.0, '#ef4444', 5, true));
            sound.playBossLaser();
          }
          if (t % 80 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.3, -0.15, 0, 0.15, 0.3].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 40, Math.cos(angle + off) * 4.6, Math.sin(angle + off) * 4.6, '#f87171', 4.5));
            });
            sound.playEnemyShoot();
          }
        } else {
          // Phase 2: Overloaded Battery Curtain
          if (t % 16 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.18, 0, 0.18].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 35, Math.cos(angle + off) * 5.8, Math.sin(angle + off) * 5.8, '#ef4444', 4.5));
            });
            sound.playEnemyShoot();
          }
          if (t % 35 === 0) {
            spawnBulletCallback(new EnemyBullet(this.x - 40, this.y + 35, -1, 6.8, '#dc2626', 5, true));
            spawnBulletCallback(new EnemyBullet(this.x + 40, this.y + 35, 1, 6.8, '#dc2626', 5, true));
            sound.playBossLaser();
          }
        }
        break;
      }

      case 8: { // Stage 8: Omega Dreadnought (3 Phases of Pure Danmaku!)
        if (this.phase === 1) {
          if (t % 32 === 0) {
            const count = 9;
            for (let i = 0; i < count; i++) {
              const ang = Math.PI * 0.15 + (Math.PI * 0.7 * i) / (count - 1);
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 35, Math.cos(ang) * 4.5, Math.sin(ang) * 4.5, '#eab308', 4.5));
            }
            sound.playBossLaser();
          }
        } else if (this.phase === 2) {
          // Phase 2: Dimensional Cross Vortex
          if (t % 8 === 0) {
            const ang = this.animTime * 6;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(ang) * 4.5, Math.sin(ang) * 4.5, '#ef4444', 4));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(ang + Math.PI * 0.5) * 4.5, Math.sin(ang + Math.PI * 0.5) * 4.5, '#38bdf8', 4));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(ang + Math.PI) * 4.5, Math.sin(ang + Math.PI) * 4.5, '#ef4444', 4));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 25, Math.cos(ang + Math.PI * 1.5) * 4.5, Math.sin(ang + Math.PI * 1.5) * 4.5, '#38bdf8', 4));
          }
          if (t % 40 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            [-0.12, 0, 0.12].forEach(off => {
              spawnBulletCallback(new EnemyBullet(this.x, this.y + 35, Math.cos(angle + off) * 6.5, Math.sin(angle + off) * 6.5, '#facc15', 4.5, true));
            });
            sound.playBossLaser();
          }
        } else {
          // Phase 3: OMEGA SINGULARITY (Final Danmaku Barrage!)
          if (t % 6 === 0) {
            const ang = this.animTime * 7;
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang) * 5.0, Math.sin(ang) * 5.0, '#fbbf24', 4.5));
            spawnBulletCallback(new EnemyBullet(this.x, this.y + 20, Math.cos(ang + Math.PI) * 5.0, Math.sin(ang + Math.PI) * 5.0, '#f43f5e', 4.5));
          }
          if (t % 25 === 0) {
            const angle = Math.atan2(py - this.y, px - this.x);
            spawnBulletCallback(new EnemyBullet(this.x - 25, this.y + 35, Math.cos(angle) * 7.2, Math.sin(angle) * 7.2, '#ffffff', 5, true));
            spawnBulletCallback(new EnemyBullet(this.x + 25, this.y + 35, Math.cos(angle) * 7.2, Math.sin(angle) * 7.2, '#ffffff', 5, true));
            sound.playBossLaser();
          }
        }
        break;
      }
    }
  }

  hit(dmg = 1): boolean {
    this.hp -= dmg;
    this.hitFlash = 4;
    return this.hp <= 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const isPhaseEnraged = this.phase >= 2;
    ctx.shadowBlur = 18;
    ctx.shadowColor = this.hitFlash > 0 ? '#ffffff' : (isPhaseEnraged ? '#ef4444' : this.color);

    // Dynamic hull drawing tailored per stage
    const mainFill = this.hitFlash > 0 ? '#ffffff' : (isPhaseEnraged ? '#1e0707' : '#0f172a');
    ctx.fillStyle = mainFill;
    ctx.strokeStyle = isPhaseEnraged ? '#ef4444' : this.color;
    ctx.lineWidth = 3;

    // Boss Hull
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.lineTo(76, 12);
    ctx.lineTo(60, -32);
    ctx.lineTo(28, -44);
    ctx.lineTo(-28, -44);
    ctx.lineTo(-60, -32);
    ctx.lineTo(-76, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing Heavy Cannons
    ctx.fillStyle = '#334155';
    ctx.fillRect(-52, 6, 14, 26);
    ctx.fillRect(38, 6, 14, 26);

    // Stage specific decorative details
    if (this.stageNum === 4) {
      // Cyber circuit line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-25, -20, 50, 32);
    } else if (this.stageNum === 8) {
      // Omega Gold Embellishment
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Glowing Central Core
    const corePulse = 1 + Math.sin(this.animTime * 3) * 0.18;
    ctx.save();
    ctx.scale(corePulse, corePulse);
    ctx.shadowBlur = isPhaseEnraged ? 28 : 16;
    ctx.shadowColor = isPhaseEnraged ? '#ef4444' : this.color;

    ctx.fillStyle = isPhaseEnraged ? '#ef4444' : this.color;
    ctx.beginPath();
    ctx.arc(0, 4, isPhaseEnraged ? 14 : 10, 0, Math.PI * 2);
    ctx.fill();

    // Hot inner core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 4, isPhaseEnraged ? 6 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }
}
