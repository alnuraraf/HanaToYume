import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Edit3, Save, Bookmark, Heart, Clock, Settings,
  ChevronRight, Coffee
} from 'lucide-react';
import { useStore } from '../store/useStore';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, watchHistory, watchlist, favorites, navigate } = useStore();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const stats = [
    { label: 'Watchlist', value: watchlist.length, icon: Bookmark, color: 'text-blue-400' },
    { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-400' },
    { label: 'History', value: watchHistory.length, icon: Clock, color: 'text-green-400' },
  ];

  const totalEpisodesWatched = watchHistory.reduce((sum, w) => sum + w.currentEpisode, 0);

  return (
    <div className="min-h-screen bg-nami-bg pt-20 pb-20 md:pb-12 px-4 md:px-8 max-w-3xl mx-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nami-accent to-nami-accent-2 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-nami-accent/20">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
          </div>
        </div>

        {/* Name */}
        {editing ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="bg-nami-surface border border-nami-border rounded-xl px-4 py-2 text-center text-white focus:outline-none focus:border-nami-accent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateProfile({ name: nameInput });
                  setEditing(false);
                }
              }}
            />
            <button
              onClick={() => {
                updateProfile({ name: nameInput });
                setEditing(false);
              }}
              className="w-10 h-10 rounded-xl bg-nami-accent flex items-center justify-center hover:bg-nami-accent/80 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
            <button
              onClick={() => setEditing(true)}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-nami-muted" />
            </button>
          </div>
        )}

        <p className="text-sm text-nami-muted">
          {totalEpisodesWatched} episodes watched
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-nami-surface border border-nami-border rounded-2xl p-4 text-center"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-nami-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-nami-surface border border-nami-border rounded-2xl overflow-hidden mb-8"
      >
        <ProfileLink
          icon={<Bookmark className="w-5 h-5 text-blue-400" />}
          label="My Watchlist"
          sublabel={`${watchlist.length} anime`}
          onClick={() => navigate('watchlist')}
        />
        <ProfileLink
          icon={<Heart className="w-5 h-5 text-red-400" />}
          label="My Favorites"
          sublabel={`${favorites.length} anime`}
          onClick={() => navigate('watchlist')}
        />
        <ProfileLink
          icon={<Clock className="w-5 h-5 text-green-400" />}
          label="Watch History"
          sublabel={`${watchHistory.length} anime`}
          onClick={() => navigate('watchlist')}
        />
        <ProfileLink
          icon={<Coffee className="w-5 h-5 text-yellow-400" />}
          label="Support NamiTube"
          sublabel="Buy us a coffee"
          onClick={() => navigate('support')}
        />
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-nami-surface border border-nami-border rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <Settings className="w-5 h-5 text-nami-muted" />
          <h3 className="font-semibold text-white">Preferences</h3>
        </div>

        {/* Default language */}
        <div className="flex items-center justify-between py-3 border-t border-nami-border">
          <span className="text-sm text-nami-text">Default Language</span>
          <div className="flex items-center bg-white/5 rounded-lg overflow-hidden">
            <button
              onClick={() => useStore.getState().setLanguage('sub')}
              className={`px-3 py-1.5 text-xs font-medium ${
                useStore.getState().currentLanguage === 'sub'
                  ? 'bg-nami-accent text-white'
                  : 'text-nami-muted'
              }`}
            >
              SUB
            </button>
            <button
              onClick={() => useStore.getState().setLanguage('dub')}
              className={`px-3 py-1.5 text-xs font-medium ${
                useStore.getState().currentLanguage === 'dub'
                  ? 'bg-nami-accent text-white'
                  : 'text-nami-muted'
              }`}
            >
              DUB
            </button>
          </div>
        </div>

        {/* Version */}
        <div className="flex items-center justify-between py-3 border-t border-nami-border">
          <span className="text-sm text-nami-text">Version</span>
          <span className="text-sm text-nami-muted">1.0.0</span>
        </div>
      </motion.div>
    </div>
  );
};

const ProfileLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
}> = ({ icon, label, sublabel, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-nami-border last:border-0"
  >
    {icon}
    <div className="flex-1 text-left">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="text-xs text-nami-muted">{sublabel}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-nami-muted" />
  </button>
);
