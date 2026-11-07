import React, { useState, useEffect, useMemo } from 'react';
import { initialCatalog, initialCreatorProfile } from './data/initialCatalog';
import { CreationItem, CreatorProfile } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CreationCard } from './components/CreationCard';
import { PlayerModal } from './components/PlayerModal';
import { PublishModal } from './components/PublishModal';
import { CreatorDrawer } from './components/CreatorDrawer';
import { Search, Sparkles, Filter, Play, Code, ArrowUpRight, Flame, Layers } from 'lucide-react';

export default function App() {
  // Catalog items loaded from localStorage or default
  const [catalog, setCatalog] = useState<CreationItem[]>(() => {
    try {
      const saved = localStorage.getItem('aetherforge_catalog');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialCatalog;
  });

  // Creator profile
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>(() => {
    try {
      const saved = localStorage.getItem('aetherforge_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialCreatorProfile;
  });

  // Upvoted item IDs
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('aetherforge_upvotes');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
    return new Set(['cyber-rogue-2088', 'promptmorph-studio']);
  });

  // Active filters and query
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  // Modals state
  const [activePlayItem, setActivePlayItem] = useState<CreationItem | null>(null);
  const [playerInitialTab, setPlayerInitialTab] = useState<'player' | 'prompt' | 'code' | 'reviews'>('player');
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aetherforge_catalog', JSON.stringify(catalog));
    } catch {
      // storage full or disabled
    }
  }, [catalog]);

  useEffect(() => {
    try {
      localStorage.setItem('aetherforge_profile', JSON.stringify(creatorProfile));
    } catch {
      // fallback
    }
  }, [creatorProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('aetherforge_upvotes', JSON.stringify(Array.from(upvotedIds)));
    } catch {
      // fallback
    }
  }, [upvotedIds]);

  // Toggle upvote
  const handleToggleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const isUpvoted = next.has(id);

      if (isUpvoted) {
        next.delete(id);
      } else {
        next.add(id);
      }

      // Update catalog count
      setCatalog((items) =>
        items.map((it) => {
          if (it.id === id) {
            return {
              ...it,
              metrics: {
                ...it.metrics,
                upvotes: isUpvoted ? it.metrics.upvotes - 1 : it.metrics.upvotes + 1,
              },
            };
          }
          return it;
        })
      );

      return next;
    });
  };

  // Launch Play Modal
  const handlePlay = (item: CreationItem) => {
    setActivePlayItem(item);
    setPlayerInitialTab('player');

    // Increment play count
    setCatalog((items) =>
      items.map((it) => {
        if (it.id === item.id) {
          return {
            ...it,
            metrics: {
              ...it.metrics,
              plays: it.metrics.plays + 1,
            },
          };
        }
        return it;
      })
    );
  };

  // Inspect prompt & code
  const handleViewDetails = (item: CreationItem) => {
    setActivePlayItem(item);
    setPlayerInitialTab('prompt');
  };

  // Publish new creation
  const handlePublish = (newItem: CreationItem) => {
    setCatalog((prev) => [newItem, ...prev]);
    setActivePlayItem(newItem);
    setPlayerInitialTab('player');
  };

  // Filtered & Sorted Creations
  const filteredCatalog = useMemo(() => {
    return catalog.filter((item) => {
      // Category filter
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'game' && item.category !== 'game') return false;
        if (selectedFilter === 'app' && item.category !== 'app') return false;
        if (selectedFilter === 'creative' && item.genre !== 'creative-tool' && item.genre !== 'generative') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTagline = item.tagline.toLowerCase().includes(q);
        const matchPrompt = item.prompt.toLowerCase().includes(q);
        const matchTech = item.techStack.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchTagline && !matchPrompt && !matchTech) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.metrics.plays - a.metrics.plays;
      if (sortBy === 'rating') return b.metrics.rating - a.metrics.rating;
      if (sortBy === 'newest') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      return 0;
    });
  }, [catalog, selectedFilter, searchQuery, sortBy]);

  // Featured Item Spotlight
  const featuredItem = useMemo(() => {
    return catalog.find((i) => i.featured) || catalog[0];
  }, [catalog]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      {/* 3-Zone Navigation Header */}
      <Navbar
        onOpenPublish={() => setIsPublishOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        activeFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        darkMode={true}
        onToggleTheme={() => {}}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreClick={() => {
            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onPublishClick={() => setIsPublishOpen(true)}
        />

        {/* Featured Creation Spotlight Bento */}
        {featuredItem && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-medium mb-3">
                    <span>Spotlight Creation</span>
                    <span aria-hidden="true">·</span>
                    <span>Most Played This Week</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                    {featuredItem.title}
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {featuredItem.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-6 font-mono">
                    <span>{featuredItem.aiModel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredItem.metrics.plays.toLocaleString()} plays</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredItem.techStack.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlay(featuredItem)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-xs rounded-lg shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play Interactive Demo
                    </button>
                    <button
                      onClick={() => handleViewDetails(featuredItem)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Deconstruct Prompt
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div
                    onClick={() => handlePlay(featuredItem)}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-800 group cursor-pointer"
                  >
                    <img
                      src={featuredItem.thumbnail}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Catalog Showcase Section */}
        <section id="catalog-section" className="max-w-7xl mx-auto px-6 py-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-xs text-sky-400 font-medium tracking-wider uppercase mb-1">
                Public Creator Archive
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Playable Games & Applications
              </h2>
            </div>

            {/* Filter Tabs & Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Functional Segmented Button Filter Bar (Zero-Pill Compliance) */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({catalog.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('game')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedFilter === 'game'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Games
                </button>
                <button
                  onClick={() => setSelectedFilter('app')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedFilter === 'app'
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Creative Apps
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts or games..."
                  className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-44 sm:w-56"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'newest')}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
              >
                <option value="popular">Most Played</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Recently Published</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCatalog.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((item) => (
                <CreationCard
                  key={item.id}
                  item={item}
                  onPlay={handlePlay}
                  onViewDetails={handleViewDetails}
                  onToggleUpvote={handleToggleUpvote}
                  isUpvoted={upvotedIds.has(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No creations found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                No apps or games match your search query "{searchQuery}". Try a different keyword or publish your own!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>

        {/* Editorial Architecture / "How It Works" Section */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800/80">
          <div className="max-w-3xl mb-12">
            <div className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-2">
              Engineering Method
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4 text-balance">
              How AI Creates Working Web Games & Computational Apps
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every creation published on AetherForge is generated from natural language prompts using Google's Gemini models. Here is the architectural methodology behind crafting zero-dependency 60 FPS canvas web games:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-sm font-mono text-sky-400 mb-2">01. Mathematical Specification</div>
              <h3 className="text-lg font-bold text-white mb-2">Physics & Logic Prompting</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than asking for "a fun game", specify explicit physics formulas—such as Newtonian gravity curves ($F = G \cdot M / r^2$), delta time step integration, and spatial grid bounds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-sm font-mono text-sky-400 mb-2">02. Zero-Dependency Loop</div>
              <h3 className="text-lg font-bold text-white mb-2">Native HTML5 & Web Audio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gemini codes directly into standard HTML5 Canvas 2D contexts and synthesized Web Audio API frequency ramps. No heavy 50MB engine downloads—everything loads in under 200 milliseconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-sm font-mono text-sky-400 mb-2">03. Community Publishing</div>
              <h3 className="text-lg font-bold text-white mb-2">Immediate Sandboxed Play</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Creators publish prototypes directly through our Creator Publishing Studio. Visitors can play immediately in-browser, inspect the prompt, and clone the underlying code.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">AetherForge</span>
            <span aria-hidden="true">·</span>
            <span>AI Apps & Games Laboratory</span>
            <span aria-hidden="true">·</span>
            <span>Created by Umer Gujjar</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsPublishOpen(true)}
              className="hover:text-white transition-colors"
            >
              Publish Creation
            </button>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-white transition-colors"
            >
              Creator Profile
            </button>
            <a
              href="#catalog-section"
              className="hover:text-white transition-colors"
            >
              Back to Top
            </a>
          </div>
        </div>
      </footer>

      {/* Play & Detail Modal */}
      <PlayerModal
        item={activePlayItem}
        onClose={() => setActivePlayItem(null)}
        onToggleUpvote={handleToggleUpvote}
        isUpvoted={activePlayItem ? upvotedIds.has(activePlayItem.id) : false}
        initialTab={playerInitialTab}
      />

      {/* Publish Creation Modal */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        onPublish={handlePublish}
      />

      {/* Creator Dossier Profile Drawer */}
      <CreatorDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={creatorProfile}
        creations={catalog}
        onPlayCreation={handlePlay}
        onUpdateProfile={setCreatorProfile}
      />
    </div>
  );
}
