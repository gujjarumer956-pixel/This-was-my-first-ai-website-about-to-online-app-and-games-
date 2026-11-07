import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Flame } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const RetroRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed'>('idle');
  const [distance, setDistance] = useState(0);
  const [gems, setGems] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('retro_runner_highscore') || '420', 10);
  });
  const [isMuted, setIsMuted] = useState(false);

  // Runner state
  const runnerRef = useRef({
    x: 90,
    y: 350,
    vy: 0,
    width: 24,
    height: 36,
    isGrounded: true,
    jumpCount: 0,
    ducking: false,
  });

  const obstaclesRef = useRef<{ x: number; y: number; w: number; h: number; type: 'spike' | 'barrier' }[]>([]);
  const gemsRef = useRef<{ x: number; y: number; collected: boolean }[]>([]);
  const speedRef = useRef(5.5);
  const distCountRef = useRef(0);
  const animRef = useRef<number | null>(null);

  const startRun = () => {
    runnerRef.current = {
      x: 90,
      y: 350,
      vy: 0,
      width: 24,
      height: 36,
      isGrounded: true,
      jumpCount: 0,
      ducking: false,
    };
    obstaclesRef.current = [];
    gemsRef.current = [];
    speedRef.current = 5.5;
    distCountRef.current = 0;
    setDistance(0);
    setGems(0);
    setGameState('running');
  };

  const jump = () => {
    const r = runnerRef.current;
    if (r.jumpCount < 2) {
      sounds.playJump();
      r.vy = -12.5;
      r.jumpCount++;
      r.isGrounded = false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'crashed') {
          startRun();
        } else {
          jump();
        }
      }
      if (e.code === 'ArrowDown' || e.key === 's') {
        runnerRef.current.ducking = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.key === 's') {
        runnerRef.current.ducking = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const groundY = 400;

    let frame = 0;

    const loop = () => {
      frame++;
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, w, h);

      // Parallax Neon Grid Horizon
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.lineWidth = 1;
      for (let x = -((frame * 2) % 60); x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 180);
        ctx.lineTo(x * 1.5 - w * 0.25, groundY);
        ctx.stroke();
      }

      // Ground Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (gameState === 'running') {
        distCountRef.current += 0.2;
        setDistance(Math.floor(distCountRef.current));
        speedRef.current = 5.5 + Math.min(6, distCountRef.current * 0.005);

        // Spawn Obstacles
        if (frame % Math.floor(75 - Math.min(25, distCountRef.current * 0.03)) === 0) {
          const type = Math.random() < 0.6 ? 'spike' : 'barrier';
          obstaclesRef.current.push({
            x: w + 20,
            y: type === 'spike' ? groundY - 26 : groundY - 50,
            w: type === 'spike' ? 22 : 28,
            h: type === 'spike' ? 26 : 50,
            type,
          });

          // Chance to spawn gem above obstacle
          if (Math.random() < 0.7) {
            gemsRef.current.push({
              x: w + 60,
              y: groundY - 70 - Math.random() * 40,
              collected: false,
            });
          }
        }

        // Runner Physics
        const r = runnerRef.current;
        r.vy += 0.65; // gravity
        r.y += r.vy;

        const currentHeight = r.ducking ? 20 : 36;
        if (r.y + currentHeight >= groundY) {
          r.y = groundY - currentHeight;
          r.vy = 0;
          r.isGrounded = true;
          r.jumpCount = 0;
        }

        // Update Obstacles
        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.x -= speedRef.current;

          // Collision
          const rx = r.x;
          const ry = r.y;
          const rw = r.width;
          const rh = currentHeight;

          if (
            rx < obs.x + obs.w &&
            rx + rw > obs.x &&
            ry < obs.y + obs.h &&
            ry + rh > obs.y
          ) {
            sounds.playExplosion();
            setGameState('crashed');
            const totalScore = Math.floor(distCountRef.current);
            if (totalScore > highScore) {
              setHighScore(totalScore);
              localStorage.setItem('retro_runner_highscore', totalScore.toString());
            }
            return;
          }

          if (obs.x + obs.w < -20) {
            obstaclesRef.current.splice(i, 1);
          }
        }

        // Update Gems
        for (let i = gemsRef.current.length - 1; i >= 0; i--) {
          const g = gemsRef.current[i];
          g.x -= speedRef.current;

          if (!g.collected && Math.hypot(r.x + 12 - g.x, r.y + 18 - g.y) < 26) {
            g.collected = true;
            sounds.playCollect();
            setGems(prev => prev + 1);
          }

          if (g.x < -20) {
            gemsRef.current.splice(i, 1);
          }
        }
      }

      // Draw Obstacles
      obstaclesRef.current.forEach((obs) => {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#f43f5e';
        ctx.fillStyle = '#f43f5e';

        if (obs.type === 'spike') {
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.h);
          ctx.lineTo(obs.x + obs.w / 2, obs.y);
          ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        }
        ctx.restore();
      });

      // Draw Gems
      gemsRef.current.forEach((g) => {
        if (g.collected) return;
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(g.x, g.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Runner
      const r = runnerRef.current;
      const rh = r.ducking ? 20 : 36;
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#06b6d4';
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(r.x, r.y, r.width, rh);

      // Visor eye
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(r.x + r.width - 6, r.y + 6, 5, 4);

      // Jetpack sparks if jumping
      if (!r.isGrounded) {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(r.x - 6, r.y + rh - 6, 6, 4);
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState, highScore]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Distance</span>
            <span className="text-sky-400 font-mono text-sm font-semibold tabular-nums">{distance}m</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Data Gems</span>
            <span className="text-cyan-400 font-mono text-sm font-semibold tabular-nums">{gems}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Record</span>
            <span className="text-amber-400 font-mono text-sm font-semibold tabular-nums">{highScore}m</span>
          </div>
        </div>

        <button
          onClick={() => {
            const next = !isMuted;
            setIsMuted(next);
            sounds.setMuted(next);
          }}
          className="p-1.5 text-slate-400 hover:text-white transition-colors rounded"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[480px] flex items-center justify-center bg-black cursor-pointer" onClick={() => {
        if (gameState === 'running') jump();
      }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          className="w-full h-full object-contain"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center mb-3 text-sky-400">
              <Flame className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Vector Runner: Cyber Surge</h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              Sprint across the synthwave grid. Double-jump over laser spikes and collect quantum data shards.
            </p>
            <div className="text-xs text-slate-400 mb-6 font-mono">
              [Space / Click] Jump & Double Jump · [Down Arrow / S] Duck
            </div>
            <button
              onClick={startRun}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              Begin Run
            </button>
          </div>
        )}

        {gameState === 'crashed' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-rose-400 tracking-tight mb-1">Impact Detected</h2>
            <p className="text-slate-400 text-sm mb-6">You reached {distance} meters with {gems} data gems.</p>
            <button
              onClick={startRun}
              className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="w-full px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div>Click or press Spacebar to jump (supports double-jump)</div>
        <div className="font-mono text-slate-500">Procedural Endless Generation</div>
      </div>
    </div>
  );
};
