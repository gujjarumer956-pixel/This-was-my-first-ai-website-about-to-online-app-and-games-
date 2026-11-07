import React, { useState } from 'react';
import { Play, Heart, Star, Code, Cpu } from 'lucide-react';
import { CreationItem } from '../types';

interface CreationCardProps {
  item: CreationItem;
  onPlay: (item: CreationItem) => void;
  onViewDetails: (item: CreationItem) => void;
  onToggleUpvote: (id: string) => void;
  isUpvoted: boolean;
}

export const CreationCard: React.FC<CreationCardProps> = ({
  item,
  onPlay,
  onViewDetails,
  onToggleUpvote,
  isUpvoted,
}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <div className="group relative flex flex-col bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1">
      {/* Media Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onPlay(item)}>
        {imageLoaded ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            onError={() => setImageLoaded(false)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* Styled Fallback container */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 text-center">
            <Cpu className="w-8 h-8 text-sky-400 mb-2 opacity-60" />
            <span className="text-sm font-semibold text-slate-200">{item.title}</span>
            <span className="text-xs text-slate-400 mt-1">{item.category.toUpperCase()}</span>
          </div>
        )}

        {/* Hover overlay with Quick Play button */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold text-xs rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Play Live
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(item);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            Inspect Prompt
          </button>
        </div>

        {/* Clean unboxed category label (NO PILL BOX) */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-medium text-slate-300 border border-white/10">
          {item.category === 'game' ? 'Arcade Game' : 'Creative App'}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Metadata line without pill box */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>{item.aiModel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.version}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-mono tabular-nums">
              <Star className="w-3 h-3 fill-current" />
              {item.metrics.rating}
            </span>
          </div>

          <h3
            onClick={() => onPlay(item)}
            className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors cursor-pointer mb-2 line-clamp-1"
          >
            {item.title}
          </h3>

          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed mb-4">
            {item.tagline}
          </p>

          {/* Clean tech stack unboxed inline text */}
          <div className="text-[11px] text-slate-400 line-clamp-1 mb-4 font-mono">
            {item.techStack.join(' · ')}
          </div>
        </div>

        {/* Card Footer with Plays, Upvote & Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-mono tabular-nums text-slate-300 font-medium">
              {item.metrics.plays.toLocaleString()} plays
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleUpvote(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                isUpvoted
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
              title="Upvote this creation"
            >
              <Heart className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current text-rose-400' : ''}`} />
              <span className="font-mono tabular-nums">{item.metrics.upvotes}</span>
            </button>

            <button
              onClick={() => onPlay(item)}
              className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 rounded-md text-xs font-medium transition-colors"
            >
              Launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
