import React, { useState } from 'react';
import { X, Play, Code2, Sparkles, Heart, Share2, Star, Send, Copy, Check, MessageSquare } from 'lucide-react';
import { CreationItem, Comment } from '../types';
import { CyberRogueGame } from './games/CyberRogueGame';
import { NeuralOrbitGame } from './games/NeuralOrbitGame';
import { PromptMorphApp } from './games/PromptMorphApp';
import { RetroRunnerGame } from './games/RetroRunnerGame';
import { CustomCanvasRunner } from './games/CustomCanvasRunner';
import confetti from 'canvas-confetti';

interface PlayerModalProps {
  item: CreationItem | null;
  onClose: () => void;
  onToggleUpvote: (id: string) => void;
  isUpvoted: boolean;
  initialTab?: 'player' | 'prompt' | 'code' | 'reviews';
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  item,
  onClose,
  onToggleUpvote,
  isUpvoted,
  initialTab = 'player',
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState<'player' | 'prompt' | 'code' | 'reviews'>(initialTab);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: 'Elena Vance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      timestamp: '2 hours ago',
      content: 'The 60 FPS responsiveness is remarkable. The particle effects and sound design really bring this alive in the browser.',
      rating: 5,
    },
    {
      id: 'c2',
      author: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      timestamp: '1 day ago',
      content: 'Inspected the prompt structure—the mathematical formulation constraints really helped Gemini output clean Euler physics!',
      rating: 5,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(item.codeSnippet || item.customScript || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: 'c-' + Date.now(),
      author: 'You (Visitor)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      timestamp: 'Just now',
      content: newCommentText.trim(),
      rating: newCommentRating,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{item.aiModel}</span>
                <span aria-hidden="true">·</span>
                <span>By {item.author.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-400">{item.version}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{item.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleUpvote(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isUpvoted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current text-rose-400' : ''}`} />
              <span className="font-mono tabular-nums">{item.metrics.upvotes}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Share creation"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Segmented buttons) */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'player'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Live Demo & Game
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'prompt'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Prompt & Architecture
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code Inspector
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Discussion ({comments.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {activeTab === 'player' && (
            <div className="flex flex-col gap-6">
              {/* Game / App Runner */}
              {item.gameEngineType === 'cyber-rogue' && <CyberRogueGame />}
              {item.gameEngineType === 'neural-orbit' && <NeuralOrbitGame />}
              {item.gameEngineType === 'promptmorph' && <PromptMorphApp />}
              {item.gameEngineType === 'retro-runner' && <RetroRunnerGame />}
              {item.gameEngineType === 'custom-script' && (
                <CustomCanvasRunner
                  code={item.customScript || item.codeSnippet}
                  title={item.title}
                />
              )}
              {!item.gameEngineType && (
                <CustomCanvasRunner
                  code={item.customScript || item.codeSnippet}
                  title={item.title}
                />
              )}

              {/* Instructions and Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900 border border-slate-800 p-5 rounded-xl text-xs">
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-200 text-sm mb-2">How to Play & Controls</h4>
                  <p className="text-slate-300 leading-relaxed">{item.instructions}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm mb-2">Specifications</h4>
                  <div className="space-y-1.5 text-slate-400">
                    <div>
                      <span className="text-slate-500">Framework: </span>
                      <span className="text-slate-300">{item.techStack.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">AI Model: </span>
                      <span className="text-slate-300">{item.aiModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Published: </span>
                      <span className="text-slate-300">{item.releaseDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Full Prompt Blueprint</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    The exact natural language instructions fed to {item.aiModel} to generate this game.
                  </p>
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPrompt ? 'Copied Prompt' : 'Copy Prompt'}
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-sky-200/90 whitespace-pre-wrap leading-relaxed">
                {item.prompt}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-semibold text-white mb-2">Why This Prompt Worked</h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                    <li>Strict mathematical formulation preventing hallucinations.</li>
                    <li>Explicit request for 60 FPS HTML5 Canvas game loop without heavy bundles.</li>
                    <li>Audio feedback requested via standard Web Audio API oscillators.</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h4 className="text-sm font-semibold text-white mb-2">AI Prompt Engineering Tip</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Always specify boundaries, state structures (e.g. key listeners, particle arrays), and frame timing when generating game prototypes with Gemini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Engine Implementation</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Key mechanics, state transitions, and canvas drawing loop.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied Code' : 'Copy Code'}
                </button>
              </div>

              <pre className="p-5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{item.codeSnippet || item.customScript}</code>
              </pre>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleAddComment} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Leave Feedback or Bug Report</h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewCommentRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= newCommentRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts on the gameplay, mechanics, or AI prompt design..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Post Review
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.author}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-slate-200">{c.author}</span>
                        <span className="text-[11px] text-slate-500">{c.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: c.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-8">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toast for Share */}
        {shareToast && (
          <div className="absolute bottom-6 right-6 bg-sky-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            Share link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};
