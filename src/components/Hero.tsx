import React from 'react';
import { Play, Sparkles, Code2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onPublishClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onPublishClick }) => {
  return (
    <section className="relative w-full border-b border-slate-800 bg-slate-950 overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed text kicker (NO PILL BOX) */}
            <div className="flex items-center gap-2 text-xs font-medium text-sky-400 mb-4 tracking-wider uppercase">
              <span>AetherForge Creator Hub</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 2.5 & Web Canvas</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6 text-balance">
              Crafted with Intelligence. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400">
                Built for Immediate Play.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Explore a curated public laboratory of playable web games and generative applications built entirely with AI. Play instant 60 FPS browser demos, deconstruct exact prompting blueprints, and publish your own AI-generated games to the global community.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-6 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-sm rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                Launch Playable Arcade
              </button>

              <button
                onClick={onPublishClick}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg border border-slate-700 hover:border-slate-600 transition-all"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                Publish Your App or Game
              </button>
            </div>

            {/* Editorial attribution line */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Curated by Umer Gujjar</span>
              <span aria-hidden="true">·</span>
              <span>Updated November 2026</span>
              <span aria-hidden="true">·</span>
              <span>Open Source & Public Blueprints</span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Visual Container */}
          <div className="lg:col-span-5 flex items-center">
            <div className="relative w-full h-[380px] lg:h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
              <img
                src="/src/assets/images/hero_ai_games_showcase_1794030577022.jpg"
                alt="AetherForge AI Games and Creative Computational Applications Studio Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-slate-950/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Live Prototype Lab</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">4 Featured Games Ready</span>
                </div>
                <button
                  onClick={onExploreClick}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  Quick Play <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width proof metrics row below the split (Strictly compliant with skill) */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              28,840+
            </div>
            <div className="text-xs text-slate-400 mt-1">Play Sessions Completed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums">
              60 FPS
            </div>
            <div className="text-xs text-slate-400 mt-1">Zero-Lag HTML5 Canvas Engine</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              4.9 / 5.0
            </div>
            <div className="text-xs text-slate-400 mt-1">Community Rating Across Demos</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tabular-nums">
              100% Free
            </div>
            <div className="text-xs text-slate-400 mt-1">Open Prompts & Sandbox Testing</div>
          </div>
        </div>
      </div>
    </section>
  );
};
