import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Zap, Crosshair } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface CyberRogueGameProps {
  onScoreUpdate?: (score: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Drone {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  maxHp: number;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'spread' | 'shield' | 'rapid';
  timer: number;
}

export const CyberRogueGame: React.FC<CyberRogueGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('cyber_rogue_highscore') || '1420', 10);
  });
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [powerupActive, setPowerupActive] = useState<string | null>(null);

  // Mutable game refs
  const playerRef = useRef({
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    speed: 4.5,
    angle: 0,
    radius: 16,
    shield: 100,
    fireTimer: 0,
    fireRate: 9, // frames between shots
    spreadShots: false,
    spreadTimer: 0,
    rapidTimer: 0,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseRef = useRef({ x: 400, y: 300, down: false });
  const bulletsRef = useRef<Bullet[]>([]);
  const dronesRef = useRef<Drone[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const waveTimerRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
  };

  const startGame = () => {
    playerRef.current = {
      x: 400,
      y: 300,
      vx: 0,
      vy: 0,
      speed: 4.5,
      angle: 0,
      radius: 16,
      shield: 100,
      fireTimer: 0,
      fireRate: 9,
      spreadShots: false,
      spreadTimer: 0,
      rapidTimer: 0,
    };
    bulletsRef.current = [];
    dronesRef.current = [];
    particlesRef.current = [];
    powerupsRef.current = [];
    waveTimerRef.current = 0;
    setScore(0);
    setWave(1);
    setHealth(100);
    setGameState('playing');
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' && gameState === 'playing') {
        e.preventDefault();
        mouseRef.current.down = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === ' ') {
        mouseRef.current.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;
    let localHealth = 100;
    let localWave = 1;

    const spawnDrone = (currentWave: number) => {
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      const w = canvas.width;
      const h = canvas.height;

      if (edge === 0) { x = Math.random() * w; y = -20; }
      else if (edge === 1) { x = w + 20; y = Math.random() * h; }
      else if (edge === 2) { x = Math.random() * w; y = h + 20; }
      else { x = -20; y = Math.random() * h; }

      const speed = 1.2 + Math.min(2.5, currentWave * 0.2);
      const isHeavy = Math.random() < 0.25;

      dronesRef.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: isHeavy ? 20 : 13,
        hp: isHeavy ? 3 + currentWave : 1 + Math.floor(currentWave / 3),
        maxHp: isHeavy ? 3 + currentWave : 1 + Math.floor(currentWave / 3),
        color: isHeavy ? '#f43f5e' : '#06b6d4',
      });
    };

    const addExplosion = (x: number, y: number, color: string, count: number = 14) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 20 + Math.random() * 15,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const loop = () => {
      const p = playerRef.current;
      const w = canvas.width;
      const h = canvas.height;

      // Clear with subtle cyber trail
      ctx.fillStyle = '#090b14';
      ctx.fillRect(0, 0, w, h);

      // Draw cyber laser grid background
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      if (gameState === 'playing') {
        // Player Movement
        let moveX = 0;
        let moveY = 0;
        if (keysRef.current['w'] || keysRef.current['arrowup']) moveY -= 1;
        if (keysRef.current['s'] || keysRef.current['arrowdown']) moveY += 1;
        if (keysRef.current['a'] || keysRef.current['arrowleft']) moveX -= 1;
        if (keysRef.current['d'] || keysRef.current['arrowright']) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        p.vx = p.vx * 0.8 + moveX * p.speed * 0.2;
        p.vy = p.vy * 0.8 + moveY * p.speed * 0.2;

        p.x = Math.max(p.radius, Math.min(w - p.radius, p.x + p.vx));
        p.y = Math.max(p.radius, Math.min(h - p.radius, p.y + p.vy));

        // Aim towards mouse
        const rect = canvas.getBoundingClientRect();
        const targetX = mouseRef.current.x - rect.left;
        const targetY = mouseRef.current.y - rect.top;
        p.angle = Math.atan2(targetY - p.y, targetX - p.x);

        // Power-ups timers
        if (p.spreadTimer > 0) {
          p.spreadTimer--;
          if (p.spreadTimer === 0) setPowerupActive(null);
        }
        if (p.rapidTimer > 0) {
          p.rapidTimer--;
          if (p.rapidTimer === 0) setPowerupActive(null);
        }

        // Firing
        p.fireTimer++;
        const currentRate = p.rapidTimer > 0 ? 5 : p.fireRate;
        if (mouseRef.current.down && p.fireTimer >= currentRate) {
          p.fireTimer = 0;
          sounds.playLaser();

          const baseSpeed = 10;
          if (p.spreadTimer > 0) {
            [-0.2, 0, 0.2].forEach((offset) => {
              bulletsRef.current.push({
                x: p.x + Math.cos(p.angle) * p.radius,
                y: p.y + Math.sin(p.angle) * p.radius,
                vx: Math.cos(p.angle + offset) * baseSpeed,
                vy: Math.sin(p.angle + offset) * baseSpeed,
                color: '#38bdf8',
              });
            });
          } else {
            bulletsRef.current.push({
              x: p.x + Math.cos(p.angle) * p.radius,
              y: p.y + Math.sin(p.angle) * p.radius,
              vx: Math.cos(p.angle) * baseSpeed,
              vy: Math.sin(p.angle) * baseSpeed,
              color: '#38bdf8',
            });
          }
        }

        // Spawn Wave Drones
        waveTimerRef.current++;
        if (waveTimerRef.current % Math.max(25, 80 - localWave * 6) === 0) {
          spawnDrone(localWave);
        }

        // Advance Wave
        if (waveTimerRef.current % 700 === 0) {
          localWave++;
          setWave(localWave);
          addExplosion(w / 2, h / 2, '#818cf8', 35);
        }

        // Update Bullets
        for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
          const b = bulletsRef.current[i];
          b.x += b.vx;
          b.y += b.vy;

          if (b.x < 0 || b.x > w || b.y < 0 || b.y > h) {
            bulletsRef.current.splice(i, 1);
            continue;
          }

          // Bullet vs Drone collision
          let hit = false;
          for (let j = dronesRef.current.length - 1; j >= 0; j--) {
            const d = dronesRef.current[j];
            const dist = Math.hypot(b.x - d.x, b.y - d.y);
            if (dist < d.size + 4) {
              hit = true;
              d.hp -= 1;
              addExplosion(b.x, b.y, d.color, 4);

              if (d.hp <= 0) {
                sounds.playExplosion();
                addExplosion(d.x, d.y, d.color, 16);
                dronesRef.current.splice(j, 1);
                localScore += d.maxHp > 2 ? 60 : 25;
                setScore(localScore);
                onScoreUpdate?.(localScore);

                // Chance to drop powerup
                if (Math.random() < 0.12) {
                  const types: ('spread' | 'shield' | 'rapid')[] = ['spread', 'shield', 'rapid'];
                  const picked = types[Math.floor(Math.random() * types.length)];
                  powerupsRef.current.push({
                    x: d.x,
                    y: d.y,
                    type: picked,
                    timer: 350,
                  });
                }
              }
              break;
            }
          }

          if (hit) {
            bulletsRef.current.splice(i, 1);
          }
        }

        // Update Drones
        for (let i = dronesRef.current.length - 1; i >= 0; i--) {
          const d = dronesRef.current[i];
          const angleToPlayer = Math.atan2(p.y - d.y, p.x - d.x);
          const droneSpeed = 1.3 + Math.min(2.5, localWave * 0.15);

          d.vx = d.vx * 0.95 + Math.cos(angleToPlayer) * droneSpeed * 0.05;
          d.vy = d.vy * 0.95 + Math.sin(angleToPlayer) * droneSpeed * 0.05;
          d.x += d.vx;
          d.y += d.vy;

          // Drone hits player
          const distToPlayer = Math.hypot(p.x - d.x, p.y - d.y);
          if (distToPlayer < p.radius + d.size) {
            sounds.playExplosion();
            addExplosion(d.x, d.y, '#ef4444', 18);
            dronesRef.current.splice(i, 1);

            localHealth = Math.max(0, localHealth - (d.maxHp > 2 ? 25 : 15));
            setHealth(localHealth);

            if (localHealth <= 0) {
              setGameState('gameover');
              if (localScore > highScore) {
                setHighScore(localScore);
                localStorage.setItem('cyber_rogue_highscore', localScore.toString());
              }
              return;
            }
          }
        }

        // Update Powerups
        for (let i = powerupsRef.current.length - 1; i >= 0; i--) {
          const pw = powerupsRef.current[i];
          pw.timer--;
          if (pw.timer <= 0) {
            powerupsRef.current.splice(i, 1);
            continue;
          }

          const dist = Math.hypot(p.x - pw.x, p.y - pw.y);
          if (dist < p.radius + 14) {
            sounds.playCollect();
            if (pw.type === 'spread') {
              p.spreadTimer = 450;
              setPowerupActive('Tri-Laser Active (7s)');
            } else if (pw.type === 'shield') {
              localHealth = Math.min(100, localHealth + 35);
              setHealth(localHealth);
              setPowerupActive('Shield Repaired (+35)');
            } else if (pw.type === 'rapid') {
              p.rapidTimer = 380;
              setPowerupActive('Overclock Rapid-Fire (6s)');
            }
            addExplosion(pw.x, pw.y, '#38bdf8', 12);
            powerupsRef.current.splice(i, 1);
          }
        }
      }

      // Render Powerups
      powerupsRef.current.forEach((pw) => {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = pw.type === 'shield' ? '#10b981' : pw.type === 'spread' ? '#38bdf8' : '#f59e0b';
        ctx.fillStyle = ctx.shadowColor;
        ctx.beginPath();
        ctx.arc(pw.x, pw.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Bullets
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Drones
      dronesRef.current.forEach((d) => {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.fillStyle = d.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = d.color;

        // Diamond robotic shape
        ctx.beginPath();
        ctx.moveTo(0, -d.size);
        ctx.lineTo(d.size, 0);
        ctx.lineTo(0, d.size);
        ctx.lineTo(-d.size, 0);
        ctx.closePath();
        ctx.fill();

        // Eye core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, d.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life++;
        if (pt.life >= pt.maxLife) {
          particlesRef.current.splice(i, 1);
          continue;
        }
        const alpha = 1 - pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Render Player
      if (gameState === 'playing' || gameState === 'menu') {
        const p = playerRef.current;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Neon engine glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#06b6d4';

        // Ship hull
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.radius + 6, 0);
        ctx.lineTo(-p.radius, -p.radius * 0.8);
        ctx.lineTo(-p.radius * 0.5, 0);
        ctx.lineTo(-p.radius, p.radius * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit core
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(2, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Shield aura if high
        if (health > 30) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, score, highScore, onScoreUpdate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  };

  const handleMouseDown = () => {
    mouseRef.current.down = true;
  };

  const handleMouseUp = () => {
    mouseRef.current.down = false;
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Score</span>
            <span className="text-sky-400 font-mono text-sm font-semibold tabular-nums">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Wave</span>
            <span className="text-indigo-400 font-mono text-sm font-semibold tabular-nums">{wave}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Best</span>
            <span className="text-amber-400 font-mono text-sm font-semibold tabular-nums">{highScore}</span>
          </div>
        </div>

        {/* Health bar */}
        <div className="flex items-center gap-3">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                health > 50 ? 'bg-cyan-400' : health > 25 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="font-mono text-slate-300 tabular-nums w-8 text-right">{health}%</span>

          <button
            onClick={toggleMute}
            className="p-1.5 text-slate-400 hover:text-white transition-colors ml-3 rounded"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[4/3] max-h-[520px] flex items-center justify-center bg-black cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="w-full h-full object-contain"
        />

        {/* Temporary Powerup banner */}
        {powerupActive && (
          <div className="absolute top-4 bg-sky-500/20 backdrop-blur border border-sky-400/40 text-sky-200 text-xs px-3 py-1 rounded-full pointer-events-none animate-pulse">
            {powerupActive}
          </div>
        )}

        {/* Menu Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center mb-4 text-sky-400">
              <Crosshair className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Cyber Rogue 2088</h2>
            <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
              Navigate the neon cyber grid. Neutralize robotic rogue drones, unlock multi-laser powerups, and survive endless waves.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-8 font-mono">
              <span>[WASD / Arrows] Move</span>
              <span aria-hidden="true">·</span>
              <span>[Mouse Aim + Click] Laser Fire</span>
              <span aria-hidden="true">·</span>
              <span>[Space] Rapid Fire</span>
            </div>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Mission
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mb-3 text-rose-400">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Signal Terminated</h2>
            <p className="text-slate-400 text-sm mb-6">Your cyber hull sustained critical breach.</p>
            <div className="grid grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-6 w-64">
              <div>
                <div className="text-slate-400 text-xs">Final Score</div>
                <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">{score}</div>
              </div>
              <div>
                <div className="text-slate-400 text-xs">Waves Cleared</div>
                <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums">{wave}</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Reboot System
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls Help */}
      <div className="w-full px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div>Controls: WASD to maneuver · Mouse to aim and shoot · Spacebar to fire</div>
        <div className="font-mono text-slate-500">HTML5 Canvas · 60 FPS Engine</div>
      </div>
    </div>
  );
};
