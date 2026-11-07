import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Navigation } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface CelestialBody {
  x: number;
  y: number;
  radius: number;
  mass: number;
  color: string;
  glowColor: string;
  pulse?: number;
}

interface StarShard {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  angle: number;
}

export const NeuralOrbitGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [launches, setLaunches] = useState(3);
  const [status, setStatus] = useState<'aiming' | 'flying' | 'cleared' | 'crashed' | 'outOfBounds'>('aiming');
  const [isMuted, setIsMuted] = useState(false);

  // Probe physics
  const probeRef = useRef({
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 7,
    trail: [] as { x: number; y: number }[],
    launched: false,
  });

  const dragRef = useRef({
    isDragging: false,
    startX: 100,
    startY: 300,
    currentX: 100,
    currentY: 300,
  });

  const bodiesRef = useRef<CelestialBody[]>([]);
  const shardsRef = useRef<StarShard[]>([]);
  const goalRef = useRef({ x: 700, y: 300, radius: 24, reached: false });
  const animRef = useRef<number | null>(null);

  const initLevel = (lvl: number) => {
    probeRef.current = {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      radius: 7,
      trail: [],
      launched: false,
    };
    dragRef.current = {
      isDragging: false,
      startX: 100,
      startY: 300,
      currentX: 100,
      currentY: 300,
    };

    if (lvl === 1) {
      bodiesRef.current = [
        { x: 400, y: 300, radius: 46, mass: 2200, color: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.4)' },
      ];
      shardsRef.current = [
        { x: 300, y: 200, radius: 7, collected: false, angle: 0 },
        { x: 500, y: 200, radius: 7, collected: false, angle: 0 },
        { x: 400, y: 440, radius: 7, collected: false, angle: 0 },
      ];
      goalRef.current = { x: 720, y: 300, radius: 22, reached: false };
    } else if (lvl === 2) {
      bodiesRef.current = [
        { x: 320, y: 220, radius: 38, mass: 1800, color: '#818cf8', glowColor: 'rgba(129, 140, 248, 0.4)' },
        { x: 480, y: 380, radius: 42, mass: 2000, color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.4)' },
      ];
      shardsRef.current = [
        { x: 320, y: 130, radius: 7, collected: false, angle: 0 },
        { x: 400, y: 300, radius: 7, collected: false, angle: 0 },
        { x: 480, y: 470, radius: 7, collected: false, angle: 0 },
        { x: 230, y: 350, radius: 7, collected: false, angle: 0 },
      ];
      goalRef.current = { x: 720, y: 180, radius: 22, reached: false };
    } else {
      bodiesRef.current = [
        { x: 260, y: 300, radius: 35, mass: 1600, color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
        { x: 440, y: 200, radius: 44, mass: 2400, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
        { x: 560, y: 420, radius: 36, mass: 1700, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.4)' },
      ];
      shardsRef.current = [
        { x: 260, y: 190, radius: 7, collected: false, angle: 0 },
        { x: 440, y: 100, radius: 7, collected: false, angle: 0 },
        { x: 560, y: 300, radius: 7, collected: false, angle: 0 },
        { x: 370, y: 400, radius: 7, collected: false, angle: 0 },
      ];
      goalRef.current = { x: 730, y: 300, radius: 22, reached: false };
    }

    setStatus('aiming');
  };

  useEffect(() => {
    initLevel(level);
  }, [level]);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const simulatePhysics = (pos: { x: number; y: number }, vel: { vx: number; vy: number }) => {
      let ax = 0;
      let ay = 0;
      for (const b of bodiesRef.current) {
        const dx = b.x - pos.x;
        const dy = b.y - pos.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);
        if (dist > b.radius) {
          const force = (b.mass / Math.max(distSq, 1000));
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
        }
      }
      vel.vx += ax * 0.05;
      vel.vy += ay * 0.05;
      pos.x += vel.vx;
      pos.y += vel.vy;
    };

    const loop = () => {
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 223.1) % h);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Goal Jump Gate
      const g = goalRef.current;
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#a855f7';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Celestial Bodies
      bodiesRef.current.forEach((b) => {
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = b.color;

        // Gravitational aura rings
        ctx.strokeStyle = b.glowColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 2.2, 0, Math.PI * 2);
        ctx.stroke();

        // Planet Body
        const grad = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1, b.x, b.y, b.radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, b.color);
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Star Shards
      shardsRef.current.forEach((s) => {
        if (s.collected) return;
        s.angle += 0.03;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fbbf24';
        ctx.fillStyle = '#fbbf24';

        // 4-point diamond star
        ctx.beginPath();
        ctx.moveTo(0, -s.radius * 1.4);
        ctx.lineTo(s.radius * 0.6, 0);
        ctx.lineTo(0, s.radius * 1.4);
        ctx.lineTo(-s.radius * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Draw Trajectory Forecast during aiming
      const p = probeRef.current;
      const d = dragRef.current;
      if (status === 'aiming' && d.isDragging) {
        const pullX = d.startX - d.currentX;
        const pullY = d.startY - d.currentY;
        const launchVx = pullX * 0.08;
        const launchVy = pullY * 0.08;

        // Slingshot elastic band
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(d.startX, d.startY);
        ctx.lineTo(d.currentX, d.currentY);
        ctx.stroke();

        // Predict path
        const simPos = { x: p.x, y: p.y };
        const simVel = { vx: launchVx, vy: launchVy };
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.setLineDash([4, 6]);
        ctx.moveTo(simPos.x, simPos.y);

        for (let step = 0; step < 70; step++) {
          simulatePhysics(simPos, simVel);
          ctx.lineTo(simPos.x, simPos.y);

          // Check if collision with planet during prediction
          const hit = bodiesRef.current.some(b => Math.hypot(simPos.x - b.x, simPos.y - b.y) <= b.radius);
          if (hit) break;
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Physics update during flight
      if (status === 'flying') {
        const vel = { vx: p.vx, vy: p.vy };
        const pos = { x: p.x, y: p.y };
        simulatePhysics(pos, vel);
        p.x = pos.x;
        p.y = pos.y;
        p.vx = vel.vx;
        p.vy = vel.vy;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 50) p.trail.shift();

        // Check star collection
        shardsRef.current.forEach((s) => {
          if (!s.collected && Math.hypot(p.x - s.x, p.y - s.y) < p.radius + s.radius + 4) {
            s.collected = true;
            sounds.playCollect();
            setScore(sc => sc + 250);
          }
        });

        // Check goal reached
        if (Math.hypot(p.x - g.x, p.y - g.y) < p.radius + g.radius) {
          sounds.playCollect();
          setStatus('cleared');
          setScore(sc => sc + 1000);
        }

        // Check crash into planet
        for (const b of bodiesRef.current) {
          if (Math.hypot(p.x - b.x, p.y - b.y) < p.radius + b.radius) {
            sounds.playExplosion();
            setStatus('crashed');
            break;
          }
        }

        // Check out of bounds
        if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
          setStatus('outOfBounds');
        }
      }

      // Draw Flight Trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2;
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.stroke();
      }

      // Draw Probe
      ctx.save();
      ctx.translate(p.x, p.y);
      const angle = Math.atan2(p.vy, p.vx) || 0;
      ctx.rotate(angle);

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#38bdf8';
      ctx.fillStyle = '#ffffff';

      // Probe ship triangle
      ctx.beginPath();
      ctx.moveTo(p.radius + 4, 0);
      ctx.lineTo(-p.radius, -p.radius * 0.7);
      ctx.lineTo(-p.radius * 0.4, 0);
      ctx.lineTo(-p.radius, p.radius * 0.7);
      ctx.closePath();
      ctx.fill();

      // Thruster tail
      if (status === 'flying') {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(-p.radius, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [status]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (status !== 'aiming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);

    const p = probeRef.current;
    if (Math.hypot(mx - p.x, my - p.y) < 40) {
      dragRef.current.isDragging = true;
      dragRef.current.startX = p.x;
      dragRef.current.startY = p.y;
      dragRef.current.currentX = mx;
      dragRef.current.currentY = my;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    dragRef.current.currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
    dragRef.current.currentY = (e.clientY - rect.top) * (canvas.height / rect.height);
  };

  const handleMouseUp = () => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;

    const pullX = dragRef.current.startX - dragRef.current.currentX;
    const pullY = dragRef.current.startY - dragRef.current.currentY;

    if (Math.hypot(pullX, pullY) > 8) {
      sounds.playJump();
      probeRef.current.vx = pullX * 0.08;
      probeRef.current.vy = pullY * 0.08;
      setStatus('flying');
      setLaunches((l) => Math.max(0, l - 1));
    }
  };

  const nextLevel = () => {
    setLevel((l) => (l >= 3 ? 1 : l + 1));
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sector</span>
            <span className="text-indigo-400 font-mono text-sm font-semibold tabular-nums">{level} of 3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Stellar Points</span>
            <span className="text-sky-400 font-mono text-sm font-semibold tabular-nums">{score}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => initLevel(level)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Probe
          </button>
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
      </div>

      {/* Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[520px] flex items-center justify-center bg-black cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full object-contain"
        />

        {/* Clear overlay */}
        {status === 'cleared' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/30 flex items-center justify-center mb-3 text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Jump Gate Reached!</h2>
            <p className="text-slate-300 text-sm max-w-sm mb-6">
              Orbital trajectory achieved. Gravitational acceleration vector plotted successfully.
            </p>
            <button
              onClick={nextLevel}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-semibold text-sm rounded-lg shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
              Proceed to Next Sector
            </button>
          </div>
        )}

        {/* Crash overlay */}
        {(status === 'crashed' || status === 'outOfBounds') && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-rose-400 tracking-tight mb-2">
              {status === 'crashed' ? 'Planetary Collision' : 'Deep Space Drift'}
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              {status === 'crashed'
                ? 'Gravitational pull pulled the probe into the planet core.'
                : 'Probe velocity exceeded celestial exit trajectory.'}
            </p>
            <button
              onClick={() => initLevel(level)}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Slingshot
            </button>
          </div>
        )}
      </div>

      <div className="w-full px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div>Click & pull back on the spacecraft to sling around gravitational fields</div>
        <div className="font-mono text-slate-500">Newtonian Gravitation · Multi-body Simulation</div>
      </div>
    </div>
  );
};
