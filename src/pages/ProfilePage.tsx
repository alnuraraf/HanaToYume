import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, HeartIcon, BookmarkIcon, ClockIcon, PlayIcon, StarIcon } from '../components/Icons';
import { getProfile, setProfile, getWatchHistory, getFavorites, getWatchlist, getContinueWatching } from '../lib/store';
import * as api from '../lib/api';
import type { AnimeData, UserProfile } from '../types/anime';

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(getProfile());
  const [activeTab, setActiveTab] = useState<'history' | 'favorites' | 'watchlist'>('history');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.username);
  const [favoriteAnime, setFavoriteAnime] = useState<AnimeData[]>([]);
  const [watchlistAnime, setWatchlistAnime] = useState<AnimeData[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(false);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const history = getWatchHistory();
  const continueWatching = getContinueWatching();
  const favorites = getFavorites();
  const watchlist = getWatchlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeTab === 'favorites' && favorites.length > 0 && favoriteAnime.length === 0) {
      setLoadingFavs(true);
      Promise.all(
        favorites.slice(0, 20).map(async (id, i) => {
          await new Promise(r => setTimeout(r, i * 400));
          try {
            const res = await api.getAnimeById(id);
            return res.data;
          } catch { return null; }
        })
      ).then(results => {
        setFavoriteAnime(results.filter(Boolean) as AnimeData[]);
        setLoadingFavs(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, favorites.length]);

  useEffect(() => {
    if (activeTab === 'watchlist' && watchlist.length > 0 && watchlistAnime.length === 0) {
      setLoadingWatchlist(true);
      Promise.all(
        watchlist.slice(0, 20).map(async (id, i) => {
          await new Promise(r => setTimeout(r, i * 400));
          try {
            const res = await api.getAnimeById(id);
            return res.data;
          } catch { return null; }
        })
      ).then(results => {
        setWatchlistAnime(results.filter(Boolean) as AnimeData[]);
        setLoadingWatchlist(false);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, watchlist.length]);

  const handleSaveName = () => {
    const updated = { ...userProfile, username: nameInput };
    setUserProfile(updated);
    setProfile(updated);
    setEditingName(false);
  };

  const stats = [
    { label: 'Watched', value: history.length, color: 'text-indigo-400' },
    { label: 'Favorites', value: favorites.length, color: 'text-red-400' },
    { label: 'Watchlist', value: watchlist.length, color: 'text-cyan-400' },
    { label: 'Continue', value: continueWatching.length, color: 'text-green-400' },
  ];

  const tabs = [
    { id: 'history' as const, label: 'Watch History', icon: <ClockIcon size={18} />, count: history.length },
    { id: 'favorites' as const, label: 'Favorites', icon: <HeartIcon size={18} />, count: favorites.length },
    { id: 'watchlist' as const, label: 'Watchlist', icon: <BookmarkIcon size={18} />, count: watchlist.length },
  ];

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl border border-white/5 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <UserIcon size={40} className="text-white" />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              {editingName ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm hover:bg-indigo-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1
                  className="text-2xl font-bold text-white cursor-pointer hover:text-indigo-300 transition-colors"
                  onClick={() => setEditingName(true)}
                  title="Click to edit"
                >
                  {userProfile.username}
                </h1>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(userProfile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map(stat => (
                <div key={stat.label} className="text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'history' && (
            history.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {history.map((item, idx) => (
                  <Link
                    key={`${item.animeId}-${item.episode}-${idx}`}
                    to={`/watch/${item.animeId}/${item.episode}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-22 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">Episode {item.episode}</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                    <PlayIcon size={16} className="text-gray-600 group-hover:text-indigo-400 shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="No watch history yet" sub="Start watching anime and your history will appear here" />
            )
          )}

          {activeTab === 'favorites' && (
            loadingFavs ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] skeleton rounded-xl mb-3" />
                    <div className="h-4 skeleton rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : favoriteAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteAnime.map(anime => (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    className="group rounded-xl overflow-hidden bg-bg-card hover:bg-bg-hover transition-all hover:scale-[1.03]"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {anime.title_english || anime.title}
                      </h3>
                      {anime.score && (
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon size={12} className="text-yellow-400" />
                          <span className="text-xs text-gray-400">{anime.score}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="No favorites yet" sub="Heart anime to add them to your favorites" />
            )
          )}

          {activeTab === 'watchlist' && (
            loadingWatchlist ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] skeleton rounded-xl mb-3" />
                    <div className="h-4 skeleton rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : watchlistAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {watchlistAnime.map(anime => (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    className="group rounded-xl overflow-hidden bg-bg-card hover:bg-bg-hover transition-all hover:scale-[1.03]"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                        {anime.title_english || anime.title}
                      </h3>
                      {anime.score && (
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon size={12} className="text-yellow-400" />
                          <span className="text-xs text-gray-400">{anime.score}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState message="Watchlist is empty" sub="Bookmark anime to add them to your watchlist" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ message: string; sub: string }> = ({ message, sub }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
      <BookmarkIcon size={32} className="text-gray-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-400 mb-2">{message}</h3>
    <p className="text-gray-600">{sub}</p>
    <Link
      to="/search"
      className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
    >
      Browse Anime
    </Link>
  </div>
);

export default ProfilePage;
