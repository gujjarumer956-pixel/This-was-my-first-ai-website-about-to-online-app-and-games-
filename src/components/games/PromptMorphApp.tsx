import React, { useEffect, useRef, useState } from 'react';
import { Download, Shuffle, Volume2, VolumeX, Sparkles, Sliders } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const PromptMorphApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frequency, setFrequency] = useState(3.4);
  const [amplitude, setAmplitude] = useState(85);
  const [symmetry, setSymmetry] = useState(6);
  const [colorMode, setColorMode] = useState<'cyber' | 'aurora' | 'solar' | 'amethyst'>('cyber');
  const [speed, setSpeed] = useState(1.0);
  const [chaos, setChaos] = useState(2.2);
  const [isAudioReactive, setIsAudioReactive] = useState(true);
  const [presetName, setPresetName] = useState('Quantum Helix');

  const mousePos = useRef({ x: 400, y: 300 });
  const timeRef = useRef(0);
  const animRef = useRef<number | null>(null);

  const presets = [
    { name: 'Quantum Helix', freq: 3.4, amp: 85, sym: 6, mode: 'cyber' as const, chaos: 2.2 },
    { name: 'Solar Flares', freq: 5.2, amp: 110, sym: 8, mode: 'solar' as const, chaos: 3.8 },
    { name: 'Borealis Ribbon', freq: 1.8, amp: 140, sym: 4, mode: 'aurora' as const, chaos: 1.5 },
    { name: 'Amethyst Mandala', freq: 4.6, amp: 70, sym: 12, mode: 'amethyst' as const, chaos: 4.1 },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setFrequency(p.freq);
    setAmplitude(p.amp);
    setSymmetry(p.sym);
    setColorMode(p.mode);
    setChaos(p.chaos);
    setPresetName(p.name);
    if (isAudioReactive) {
      sounds.playHarmonicNote(300 + p.sym * 40, 0.5);
    }
  };

  const randomize = () => {
    const f = parseFloat((1.0 + Math.random() * 6).toFixed(1));
    const a = Math.floor(40 + Math.random() * 110);
    const s = [3, 4, 6, 8, 10, 12][Math.floor(Math.random() * 6)];
    const modes: ('cyber' | 'aurora' | 'solar' | 'amethyst')[] = ['cyber', 'aurora', 'solar', 'amethyst'];
    const m = modes[Math.floor(Math.random() * modes.length)];
    const c = parseFloat((0.8 + Math.random() * 4.5).toFixed(1));

    setFrequency(f);
    setAmplitude(a);
    setSymmetry(s);
    setColorMode(m);
    setChaos(c);
    setPresetName('Procedural Morph #' + Math.floor(Math.random() * 900 + 100));

    if (isAudioReactive) {
      sounds.playHarmonicNote(220 + s * 45, 0.4);
    }
  };

  const exportCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `promptmorph-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    sounds.playCollect();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const loop = () => {
      timeRef.current += 0.015 * speed;
      const t = timeRef.current;

      // Dark fade for fluid trails
      ctx.fillStyle = 'rgba(7, 9, 15, 0.16)';
      ctx.fillRect(0, 0, w, h);

      // Color scheme selector
      let strokeStyleA = 'rgba(56, 189, 248, 0.8)';
      let strokeStyleB = 'rgba(168, 85, 247, 0.6)';

      if (colorMode === 'solar') {
        strokeStyleA = 'rgba(245, 158, 11, 0.85)';
        strokeStyleB = 'rgba(239, 68, 68, 0.6)';
      } else if (colorMode === 'aurora') {
        strokeStyleA = 'rgba(16, 185, 129, 0.85)';
        strokeStyleB = 'rgba(6, 182, 212, 0.6)';
      } else if (colorMode === 'amethyst') {
        strokeStyleA = 'rgba(217, 70, 239, 0.85)';
        strokeStyleB = 'rgba(99, 102, 241, 0.6)';
      }

      ctx.save();
      ctx.translate(cx, cy);

      const slices = symmetry;
      const sliceAngle = (Math.PI * 2) / slices;

      for (let s = 0; s < slices; s++) {
        ctx.save();
        ctx.rotate(s * sliceAngle);

        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = s % 2 === 0 ? strokeStyleA : strokeStyleB;

        const points = 70;
        for (let i = 0; i < points; i++) {
          const ratio = i / points;
          const dist = ratio * (w * 0.42);

          const wave1 = Math.sin(ratio * frequency * Math.PI + t * 1.5) * amplitude;
          const wave2 = Math.cos(ratio * (frequency * 0.5) * Math.PI - t) * (amplitude * 0.4);
          const chaosEffect = Math.sin(dist * 0.03 + chaos) * 12;

          const px = dist;
          const py = wave1 + wave2 + chaosEffect;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [frequency, amplitude, symmetry, colorMode, speed, chaos]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center select-none">
      {/* Top Controls Header */}
      <div className="w-full flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Preset: {presetName}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 ml-4">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  presetName === p.name
                    ? 'bg-sky-500 text-slate-950 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={randomize}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors text-xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Mutate
          </button>
          <button
            onClick={exportCanvasImage}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded transition-colors text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export PNG
          </button>
          <button
            onClick={() => setIsAudioReactive(!isAudioReactive)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors ml-1 rounded"
            title="Audio feedback"
          >
            {isAudioReactive ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Visualizer Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[480px] flex items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Parameter Sliders Panel */}
      <div className="w-full p-5 bg-slate-900 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Harmonic Freq</span>
            <span className="font-mono text-sky-400">{frequency}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.1"
            value={frequency}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setFrequency(val);
              if (isAudioReactive) sounds.playHarmonicNote(180 + val * 50, 0.1);
            }}
            className="w-full accent-sky-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Amplitude</span>
            <span className="font-mono text-sky-400">{amplitude}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="160"
            value={amplitude}
            onChange={(e) => setAmplitude(parseInt(e.target.value, 10))}
            className="w-full accent-sky-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Kaleidoscope Symmetry</span>
            <span className="font-mono text-sky-400">{symmetry}x</span>
          </div>
          <input
            type="range"
            min="3"
            max="16"
            step="1"
            value={symmetry}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setSymmetry(val);
              if (isAudioReactive) sounds.playHarmonicNote(220 + val * 35, 0.15);
            }}
            className="w-full accent-sky-400 bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Chaos Recursion</span>
            <span className="font-mono text-sky-400">{chaos}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={chaos}
            onChange={(e) => setChaos(parseFloat(e.target.value))}
            className="w-full accent-sky-400 bg-slate-800"
          />
        </div>
      </div>
    </div>
  );
};
