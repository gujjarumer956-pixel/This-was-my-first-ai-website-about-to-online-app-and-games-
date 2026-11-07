import React, { useState } from 'react';
import { X, Sparkles, Upload, Play, Check, Wand2, Code, Terminal, Layers } from 'lucide-react';
import { CreationItem, AppCategory, GameGenre } from '../types';
import { CustomCanvasRunner } from './games/CustomCanvasRunner';
import confetti from 'canvas-confetti';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newItem: CreationItem) => void;
}

const TEMPLATES = [
  {
    name: 'Cyber Laser Grid Defender',
    category: 'game' as AppCategory,
    genre: 'arcade' as GameGenre,
    model: 'Gemini 2.5 Flash',
    prompt: 'Create a high-energy arcade minigame where lasers pulse from grid edges and the player dodges or parries them with mouse clicks. Add glowing particles and wave counters.',
    script: `// Interactive Cyber Laser Dodge
let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 14 };
let obstacles = [];
let particles = [];
let score = 0;
let gameOver = false;

window.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  player.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  player.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});

function spawn() {
  if (gameOver) return;
  const side = Math.floor(Math.random() * 4);
  let x = 0, y = 0, vx = 0, vy = 0;
  if (side === 0) { x = Math.random() * canvas.width; y = 0; vy = 3.5; }
  else if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; vx = -3.5; }
  else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height; vy = -3.5; }
  else { x = 0; y = Math.random() * canvas.height; vx = 3.5; }
  obstacles.push({ x, y, vx, vy, radius: 8 });
}

setInterval(spawn, 250);

function render() {
  ctx.fillStyle = '#080a14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    score++;
    // Draw player
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Update & draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x += o.vx;
      o.y += o.vy;

      ctx.shadowBlur = 10;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      ctx.fill();

      if (Math.hypot(player.x - o.x, player.y - o.y) < player.radius + o.radius) {
        gameOver = true;
      }

      if (o.x < -20 || o.x > canvas.width + 20 || o.y < -20 || o.y > canvas.height + 20) {
        obstacles.splice(i, 1);
      }
    }

    // Score HUD
    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px monospace';
    ctx.fillText('SURVIVAL TIME: ' + Math.floor(score / 60) + 's', 20, 35);
  } else {
    ctx.fillStyle = '#f43f5e';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CRITICAL OVERLOAD', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('Score: ' + Math.floor(score / 60) + 's · Click to Restart', canvas.width / 2, canvas.height / 2 + 20);
  }

  requestAnimationFrame(render);
}
canvas.addEventListener('click', () => {
  if (gameOver) {
    gameOver = false;
    score = 0;
    obstacles = [];
  }
});
render();`,
  },
  {
    name: 'Harmonic Fluid Ripple Lab',
    category: 'app' as AppCategory,
    genre: 'generative' as GameGenre,
    model: 'Gemini 2.5 Pro',
    prompt: 'Interactive generative fluid ripple simulation. Mouse movement displaces color nodes, calculating damping wave propagations with custom palette blending.',
    script: `// Interactive Generative Ripple Canvas
let ripples = [];
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  ripples.push({ x, y, radius: 2, alpha: 1, color: 'hsl(' + (Date.now() / 20 % 360) + ', 80%, 60%)' });
});

function draw() {
  ctx.fillStyle = 'rgba(10, 14, 26, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.radius += 3.5;
    r.alpha -= 0.015;

    ctx.save();
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = r.color;
    ctx.globalAlpha = Math.max(0, r.alpha);
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();

    if (r.alpha <= 0) ripples.splice(i, 1);
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('Move mouse cursor across canvas to synthesize wave harmonics', 20, 30);

  requestAnimationFrame(draw);
}
draw();`,
  },
];

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onPublish }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<AppCategory>('game');
  const [genre, setGenre] = useState<GameGenre>('action');
  const [aiModel, setAiModel] = useState('Gemini 2.5 Flash');
  const [promptText, setPromptText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [techStackInput, setTechStackInput] = useState('HTML5 Canvas, TypeScript, React 19');
  const [customScript, setCustomScript] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('/src/assets/images/game_cyber_rogue_1794030592118.jpg');
  const [previewMode, setPreviewMode] = useState(false);

  // Template loader
  const loadTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setTitle(tmpl.name);
    setTagline('An interactive ' + tmpl.genre + ' experiment generated with ' + tmpl.model);
    setCategory(tmpl.category);
    setGenre(tmpl.genre);
    setAiModel(tmpl.model);
    setPromptText(tmpl.prompt);
    setInstructions('Move your mouse over the game canvas to interact.');
    setCustomScript(tmpl.script);
  };

  // AI Generator helper
  const handleGenerateIdea = () => {
    const ideas = [
      {
        title: 'Quantum Graviton Sorter',
        tagline: 'Match falling quantum isotopes into gravitational stabilizers before entropy collapses the lab',
        category: 'game' as AppCategory,
        genre: 'puzzle' as GameGenre,
        model: 'Gemini 2.5 Flash',
        prompt: 'Build a falling-block quantum physics puzzle game in HTML5 Canvas. Three color-coded energy streams drop from the ceiling; player toggles deflection prisms to guide them into matching magnetic containment pods.',
        instructions: 'Click on screen prisms to rotate reflection angles by 45 degrees. Prevent radioactive energy overload.',
      },
      {
        title: 'Cyber Deck Synth Lab',
        tagline: 'Modular generative audio-visual synthesizer with real-time waveform node linking',
        category: 'app' as AppCategory,
        genre: 'creative-tool' as GameGenre,
        model: 'Gemini 2.5 Pro',
        prompt: 'Design a modular node-based synthesizer visualizer. Drag nodes across canvas to connect harmonic oscillators, with glowing signal pulses and harmonic resonance.',
        instructions: 'Drag parameter knobs to alter frequency modulation and geometric resonance in real time.',
      },
    ];

    const pick = ideas[Math.floor(Math.random() * ideas.length)];
    setTitle(pick.title);
    setTagline(pick.tagline);
    setCategory(pick.category);
    setGenre(pick.genre);
    setAiModel(pick.model);
    setPromptText(pick.prompt);
    setInstructions(pick.instructions);

    // If no custom script yet, populate a working canvas demo
    if (!customScript.trim()) {
      setCustomScript(TEMPLATES[0].script);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) return;

    const newItem: CreationItem = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      tagline: tagline.trim(),
      category,
      genre,
      description: tagline.trim(),
      instructions: instructions.trim() || 'Click and move mouse on the canvas to play.',
      thumbnail: thumbnailUrl || '/src/assets/images/hero_ai_games_showcase_1794030577022.jpg',
      aiModel,
      prompt: promptText.trim() || 'Prompt generated with Gemini 2.5',
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      version: 'v1.0.0',
      releaseDate: new Date().toISOString().split('T')[0],
      author: {
        name: 'Umer Gujjar',
        handle: '@umer_creates',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      metrics: {
        plays: 1,
        upvotes: 1,
        rating: 5.0,
      },
      featured: false,
      gameEngineType: 'custom-script',
      customScript: customScript.trim() || TEMPLATES[0].script,
      codeSnippet: customScript.trim() || TEMPLATES[0].script,
    };

    onPublish(newItem);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium uppercase tracking-wider">
              <span>Creator Publishing Studio</span>
              <span aria-hidden="true">·</span>
              <span>Publish Your AI App / Game</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Publish to AetherForge</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateIdea}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/30 rounded-lg text-xs font-medium transition-colors"
              title="Auto-fill with an AI game concept"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Generate Concept
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Template Picker */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex items-center gap-3 text-xs overflow-x-auto">
          <span className="text-slate-400 font-medium shrink-0">Quick Starters:</span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.name}
              type="button"
              onClick={() => loadTemplate(tmpl)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 text-xs shrink-0 transition-colors"
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                App or Game Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chrono Pulse 3000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* AI Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                AI Model Used *
              </label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (Fast & Low Latency)</option>
                <option value="Gemini 2.5 Pro">Gemini 2.5 Pro (Deep Reasoning & Physics)</option>
                <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                <option value="GPT-4o">GPT-4o</option>
                <option value="DeepSeek R1">DeepSeek R1</option>
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tagline / One-Line Hook *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Fast-paced procedural vector bullet-hell created with a single prompt"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="game">Game & Arcade</option>
                <option value="app">Creative / Utility App</option>
                <option value="simulation">Simulation</option>
                <option value="creative">Generative Art</option>
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as GameGenre)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="action">Action / Shooter</option>
                <option value="arcade">Arcade Runner</option>
                <option value="physics">Physics & Orbital</option>
                <option value="puzzle">Puzzle & Mind</option>
                <option value="creative-tool">Creative Tool</option>
                <option value="generative">Generative Math</option>
              </select>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tech Stack</label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="HTML5 Canvas, WebGL, React"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Full Prompt Used */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Exact AI Prompt Used *
              </label>
              <span className="text-[11px] text-slate-500">Share your prompting blueprint for others</span>
            </div>
            <textarea
              required
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="e.g. Write a 60 FPS HTML5 Canvas arcade game with player movement, enemy drones, particle explosions, and sound feedback..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-sky-200/90 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* How to Play / Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Player Controls & Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. WASD to move, Click to fire, Spacebar for boost"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Playable Canvas Code / Script */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Playable HTML5 / JavaScript Canvas Code
              </label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                {previewMode ? 'Edit Code' : 'Test In Live Sandbox'}
              </button>
            </div>

            {previewMode ? (
              <div className="rounded-xl overflow-hidden border border-slate-800">
                <CustomCanvasRunner
                  code={customScript || TEMPLATES[0].script}
                  title={title || 'Sandbox Test'}
                />
              </div>
            ) : (
              <textarea
                rows={7}
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                placeholder="// Enter JavaScript Canvas code or choose a Quick Starter template above..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            )}
          </div>

          {/* Cover Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Showcase Thumbnail
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Cyber Rogue Style', path: '/src/assets/images/game_cyber_rogue_1794030592118.jpg' },
                { name: 'Neural Orbit Style', path: '/src/assets/images/game_neural_orbit_1794030608674.jpg' },
                { name: 'Creative Studio Style', path: '/src/assets/images/app_promptmorph_studio_1794030626170.jpg' },
              ].map((img) => (
                <button
                  type="button"
                  key={img.path}
                  onClick={() => setThumbnailUrl(img.path)}
                  className={`relative aspect-[16/10] rounded-lg overflow-hidden border text-left transition-all ${
                    thumbnailUrl === img.path
                      ? 'border-sky-400 ring-2 ring-sky-400/30'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.path} alt={img.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-2 text-[10px] text-white font-medium bg-black/60 px-1.5 py-0.5 rounded">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Published directly to your local creator showcase repository.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Publish Creation to Showcase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
