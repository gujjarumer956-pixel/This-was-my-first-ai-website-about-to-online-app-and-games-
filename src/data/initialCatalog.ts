import { CreationItem, CreatorProfile } from '../types';

export const initialCreatorProfile: CreatorProfile = {
  name: 'Umer Gujjar',
  handle: '@umer_creates',
  title: 'AI Game Architect & Creative Engineer',
  bio: 'Designing generative games, interactive procedural simulations, and computational tools using Gemini and cutting-edge web graphics.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  links: {
    github: 'https://github.com',
    x: 'https://x.com',
    portfolio: 'https://aetherforge.dev',
  },
  badges: ['Founding Creator', 'Master Prompt Engineer', '60 FPS Canvas Jammer', 'Algorithmic Designer'],
};

export const initialCatalog: CreationItem[] = [
  {
    id: 'cyber-rogue-2088',
    title: 'Cyber Rogue 2088',
    tagline: 'Endless neon arcade arena shooter with rogue AI drones and real-time weapon overclocking',
    category: 'game',
    genre: 'action',
    description: 'An adrenaline-fueled top-down neon roguelite arena shooter where players control an overclocked cybernetic operative defending against swarms of rogue hunter drones. Features real-time particle physics, multi-laser beam drops, and responsive 60 FPS canvas gameplay.',
    instructions: 'Use WASD or Arrow Keys to maneuver. Aim with your mouse and click to fire plasma bolts. Press Spacebar for emergency sustained rapid-fire. Collect fallen glowing orbs to activate Tri-Laser and Shield repairs.',
    thumbnail: '/src/assets/images/game_cyber_rogue_1794030592118.jpg',
    aiModel: 'Gemini 2.5 Flash',
    prompt: `Create a complete high-performance 60 FPS HTML5 Canvas arcade shooter named "Cyber Rogue 2088".
Requirements:
1. Top-down isometric cyber grid with reactive glow styling.
2. Player ship with directional laser aim tracking the mouse cursor.
3. Swarm AI drone enemies with distinct HP, collision physics, and explosion particles.
4. Power-up drop system: Tri-Laser spread, Overclock Rapid Fire, and Shield repair.
5. Wave progression system with score multiplier and retro sound feedback via Web Audio API.`,
    techStack: ['HTML5 Canvas', 'React 19', 'Web Audio API', 'TypeScript', 'Tailwind CSS'],
    version: 'v1.4.2',
    releaseDate: '2026-10-18',
    author: {
      name: 'Umer Gujjar',
      handle: '@umer_creates',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    metrics: {
      plays: 8420,
      upvotes: 642,
      rating: 4.9,
    },
    featured: true,
    gameEngineType: 'cyber-rogue',
    codeSnippet: `// Cyber Rogue 2088 - Plasma Firing Core
function firePlasmaBeam(player, mouseAngle, powerupActive) {
  const speed = 10;
  if (powerupActive === 'spread') {
    [-0.2, 0, 0.2].forEach(offset => {
      bullets.push({
        x: player.x + Math.cos(player.angle) * player.radius,
        y: player.y + Math.sin(player.angle) * player.radius,
        vx: Math.cos(mouseAngle + offset) * speed,
        vy: Math.sin(mouseAngle + offset) * speed,
        color: '#38bdf8'
      });
    });
  } else {
    bullets.push({
      x: player.x + Math.cos(player.angle) * player.radius,
      y: player.y + Math.sin(player.angle) * player.radius,
      vx: Math.cos(mouseAngle) * speed,
      vy: Math.sin(mouseAngle) * speed,
      color: '#38bdf8'
    });
  }
}`,
  },
  {
    id: 'neural-orbit',
    title: 'Neural Orbit: Gravitational Sling',
    tagline: 'Newtonian orbital mechanics puzzle simulator across deep celestial gravity wells',
    category: 'game',
    genre: 'physics',
    description: 'A precision orbital navigation simulator powered by actual Newtonian gravitational calculations ($F = G \\cdot M / r^2$). Sling your quantum probe through shifting planetary fields, collect stellar data cores, and hit the sub-light jump gate without crashing.',
    instructions: 'Click and drag backward from the probe to adjust launch velocity and trajectory. Observe the dotted predictive flight curve through the gravity fields, then release to launch into orbit.',
    thumbnail: '/src/assets/images/game_neural_orbit_1794030608674.jpg',
    aiModel: 'Gemini 2.5 Pro',
    prompt: `Write a Newtonian orbital mechanics physics puzzle game in React with HTML5 Canvas.
1. Implement real gravitational attraction toward multiple celestial bodies using F = (G * M) / r^2.
2. Provide a slingshot pull-back aim mechanic with a multi-step Euler trajectory prediction line.
3. Feature glowing planetary atmospheres, collectible star shards, and jump gate objectives.
4. Include multiple sectors with increasing celestial gravitational complexity.`,
    techStack: ['HTML5 Canvas', 'Newtonian Physics', 'React 19', 'TypeScript', 'Web Audio API'],
    version: 'v2.1.0',
    releaseDate: '2026-10-24',
    author: {
      name: 'Umer Gujjar',
      handle: '@umer_creates',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    metrics: {
      plays: 6190,
      upvotes: 518,
      rating: 4.8,
    },
    featured: true,
    gameEngineType: 'neural-orbit',
    codeSnippet: `// Newtonian Gravitation Vector Solver
function applyGravity(probe, celestialBodies, dt) {
  let ax = 0, ay = 0;
  for (const planet of celestialBodies) {
    const dx = planet.x - probe.x;
    const dy = planet.y - probe.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    if (dist > planet.radius) {
      const force = (planet.mass / Math.max(distSq, 1000));
      ax += (dx / dist) * force;
      ay += (dy / dist) * force;
    }
  }
  probe.vx += ax * dt;
  probe.vy += ay * dt;
  probe.x += probe.vx;
  probe.y += probe.vy;
}`,
  },
  {
    id: 'promptmorph-studio',
    title: 'PromptMorph Generative Visual Lab',
    tagline: 'Interactive harmonic wave synthesizer and mathematical kaleidoscopic art generator',
    category: 'app',
    genre: 'creative-tool',
    description: 'An interactive mathematical creative studio where users synthesize algorithmic geometry, kaleidoscopic harmonic curves, and flowing particle ribbons. Equipped with sound-reactive micro-tones and high-resolution PNG artwork exporting.',
    instructions: 'Tweak the harmonic frequency, amplitude, kaleidoscope symmetry, and chaos recursion sliders. Click "Mutate" to generate new procedural seeds or "Export PNG" to download your creation in high resolution.',
    thumbnail: '/src/assets/images/app_promptmorph_studio_1794030626170.jpg',
    aiModel: 'Gemini 2.5 Flash',
    prompt: `Create an interactive generative art application called "PromptMorph Studio".
Key capabilities:
- Procedural trigonometric kaleidoscope wave rendering with variable symmetry.
- Real-time parameter controls: Frequency, Amplitude, Symmetry (3x to 16x), and Chaos recursion.
- Synesthetic harmonic audio engine mapping mathematical parameters to ethereal micro-tones.
- Presets selector and instant one-click PNG image export.`,
    techStack: ['Algorithmic Canvas', 'Web Audio API', 'React 19', 'Generative Math', 'TypeScript'],
    version: 'v3.0.1',
    releaseDate: '2026-11-01',
    author: {
      name: 'Umer Gujjar',
      handle: '@umer_creates',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    metrics: {
      plays: 9340,
      upvotes: 785,
      rating: 5.0,
    },
    featured: true,
    gameEngineType: 'promptmorph',
    codeSnippet: `// Multi-Harmonic Wave Math Formula
function calculateWavePoint(index, total, freq, amp, t, chaos) {
  const ratio = index / total;
  const dist = ratio * 320;
  const primaryWave = Math.sin(ratio * freq * Math.PI + t * 1.5) * amp;
  const secondaryHarmonic = Math.cos(ratio * (freq * 0.5) * Math.PI - t) * (amp * 0.4);
  const chaosOffset = Math.sin(dist * 0.03 + chaos) * 12;
  return { x: dist, y: primaryWave + secondaryHarmonic + chaosOffset };
}`,
  },
  {
    id: 'retro-vector-runner',
    title: 'Vector Runner: Cyber Surge',
    tagline: 'High-speed synthwave procedural platformer with double jump acrobatics and audio pulses',
    category: 'game',
    genre: 'arcade',
    description: 'Sprint across an infinitely generating synthwave grid. Time double-jumps over laser spikes, duck beneath high energy barriers, and collect quantum data cubes in this retro-future 60 FPS endless runner.',
    instructions: 'Press Spacebar, Up Arrow, or Click to jump. Press again in mid-air to trigger jetpack double-jump. Press Down Arrow to slide under barriers.',
    thumbnail: '/src/assets/images/hero_ai_games_showcase_1794030577022.jpg',
    aiModel: 'Gemini 2.5 Flash',
    prompt: `Build an endless 2D side-scrolling platformer runner called "Vector Runner: Cyber Surge".
1. Procedural obstacle generation with spikes and barriers.
2. Smooth physics jump and double-jump mechanics with gravity and floor snapping.
3. Synthwave grid parallax perspective and collectible data cubes.
4. Distance meters, high score tracking via localStorage, and sound effects.`,
    techStack: ['HTML5 Canvas', 'Procedural Generation', 'React 19', 'Web Audio API'],
    version: 'v1.1.0',
    releaseDate: '2026-11-03',
    author: {
      name: 'Umer Gujjar',
      handle: '@umer_creates',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    metrics: {
      plays: 4890,
      upvotes: 390,
      rating: 4.7,
    },
    featured: false,
    gameEngineType: 'retro-runner',
    codeSnippet: `// Double Jump & Obstacle Collision
if (keys.jump && player.jumpCount < 2) {
  player.vy = -12.5;
  player.jumpCount++;
  sounds.playJump();
}`,
  },
];
