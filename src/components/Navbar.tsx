import React from 'react';
import { Plus, Sparkles, User, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenPublish: () => void;
  onOpenProfile: () => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPublish,
  onOpenProfile,
  activeFilter,
  onSelectFilter,
  darkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors"
        >
          AetherForge
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              onSelectFilter('all');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeFilter === 'all' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            All Creations
          </button>
          <button
            onClick={() => {
              onSelectFilter('game');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeFilter === 'game' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            Games & Arcade
          </button>
          <button
            onClick={() => {
              onSelectFilter('app');
              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeFilter === 'app' ? 'text-sky-400 font-semibold' : ''
            }`}
          >
            Creative Apps
          </button>
          <button
            onClick={onOpenProfile}
            className="whitespace-nowrap shrink-0 text-slate-300 hover:text-white transition-colors"
          >
            Creator Profile
          </button>
          <a
            href="#how-it-works"
            className="whitespace-nowrap shrink-0 text-slate-300 hover:text-white transition-colors"
          >
            How It Works
          </a>
        </nav>

        {/* Zone 3: 1 primary action with secondary profile triggers */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="View Creator Profile"
          >
            <User className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={onOpenPublish}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Publish Creation
          </button>
        </div>
      </div>
    </header>
  );
};
