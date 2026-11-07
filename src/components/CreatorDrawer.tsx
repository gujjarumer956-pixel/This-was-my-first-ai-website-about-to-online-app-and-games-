import React, { useState } from 'react';
import { X, Award, Play, Edit3, Check, Globe, Github, Sparkles } from 'lucide-react';
import { CreatorProfile, CreationItem } from '../types';

interface CreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreatorProfile;
  creations: CreationItem[];
  onPlayCreation: (item: CreationItem) => void;
  onUpdateProfile: (updated: CreatorProfile) => void;
}

export const CreatorDrawer: React.FC<CreatorDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  creations,
  onPlayCreation,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);

  const totalPlays = creations.reduce((acc, curr) => acc + curr.metrics.plays, 0);
  const totalUpvotes = creations.reduce((acc, curr) => acc + curr.metrics.upvotes, 0);

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name,
      title,
      bio,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/80">
          <h2 className="text-base font-bold text-white tracking-tight">Creator Dossier</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-lg shadow-sky-500/20 bg-slate-800">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
            >
              {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
              {isEditing ? 'Save Bio' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-sky-400 focus:outline-none focus:border-sky-500"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
              />
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-white">{profile.name}</h3>
              <div className="text-xs text-sky-400 font-medium mb-3">{profile.title}</div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{profile.bio}</p>
            </div>
          )}

          {/* Unboxed Metadata Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
            <div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">{creations.length}</div>
              <div className="text-[11px] text-slate-400">Published</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-sky-400 tabular-nums">
                {totalPlays.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">Total Plays</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
                {totalUpvotes.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">Upvotes</div>
            </div>
          </div>
        </div>

        {/* Creator Badges (Rendered as clean unboxed inline items per design guidelines) */}
        <div className="p-6 border-b border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Creator Accreditations
          </h4>
          <div className="space-y-2">
            {profile.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <Award className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Published Works list */}
        <div className="flex-1 p-6 space-y-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Catalog Creations ({creations.length})
          </h4>

          <div className="space-y-3">
            {creations.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onPlayCreation(item);
                  onClose();
                }}
                className="group p-3 bg-slate-950/60 border border-slate-800 hover:border-sky-500/50 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                      {item.title}
                    </h5>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.metrics.plays.toLocaleString()} plays · {item.aiModel}
                    </div>
                  </div>
                </div>

                <button className="p-1.5 text-slate-400 group-hover:text-sky-400 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
