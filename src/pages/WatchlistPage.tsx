import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Heart, Clock, Trash2 } from 'lucide-react';
import { getAnimeById } from '../lib/api';
import { useStore, type AnimeBasic } from '../store/useStore';
import { AnimeCard } from '../components/AnimeCard';
import { CardSkeleton } from '../components/ui/Skeleton';

type Tab = 'watchlist' | 'favorites' | 'history';

export const WatchlistPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('watchlist');
  const [watchlistAnime, setWatchlistAnime] = useState<AnimeBasic[]>([]);
  const [favoritesAnime, setFavoritesAnime] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(false);

  const { watchlist, favorites, watchHistory, clearHistory, navigate, setEpisode, setLanguage } = useStore();

  // Load watchlist anime details
  useEffect(() => {
    if (activeTab === 'watchlist' && watchlist.length > 0 && watchlistAnime.length === 0) {
      setLoading(true);
      const load = async () => {
        const results: AnimeBasic[] = [];
        for (const id of watchlist.slice(0, 20)) {
          try {
            await new Promise((r) => setTimeout(r, 350));
            const data = await getAnimeById(id);
            if (data) results.push(data);
          } catch {}
        }
        setWatchlistAnime(results);
        setLoading(false);
      };
      load();
    }
  }, [activeTab, watchlist]);

  useEffect(() => {
    if (activeTab === 'favorites' && favorites.length > 0 && favoritesAnime.length === 0) {
      setLoading(true);
      const load = async () => {
        const results: AnimeBasic[] = [];
        for (const id of favorites.slice(0, 20)) {
          try {
            await new Promise((r) => setTimeout(r, 350));
            const data = await getAnimeById(id);
            if (data) results.push(data);
          } catch {}
        }
        setFavoritesAnime(results);
        setLoading(false);
      };
      load();
    }
  }, [activeTab, favorites]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'watchlist', label: 'Watchlist', icon: <Bookmark className="w-4 h-4" />, count: watchlist.length },
    { key: 'favorites', label: 'Favorites', icon: <Heart className="w-4 h-4" />, count: favorites.length },
    { key: 'history', label: 'History', icon: <Clock className="w-4 h-4" />, count: watchHistory.length },
  ];

  return (
    <div className="min-h-screen bg-nami-bg pt-20 pb-20 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-6">My Library</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-nami-accent to-nami-accent-2 text-white shadow-lg shadow-nami-accent/20'
                : 'bg-white/5 text-nami-muted hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-white/20' : 'bg-white/5'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'watchlist' && (
        <div>
          {loading ? (
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : watchlistAnime.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              {watchlistAnime.map((a, i) => (
                <AnimeCard key={a.mal_id} anime={a} index={i} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={<Bookmark className="w-12 h-12" />}
              title="Your watchlist is empty"
              subtitle="Browse anime and add them to your watchlist"
            />
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div>
          {loading ? (
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : favoritesAnime.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              {favoritesAnime.map((a, i) => (
                <AnimeCard key={a.mal_id} anime={a} index={i} />
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={<Heart className="w-12 h-12" />}
              title="No favorites yet"
              subtitle="Heart the anime you love"
            />
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {watchHistory.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {watchHistory.map((item) => (
                  <div
                    key={item.mal_id}
                    onClick={() => {
                      setEpisode(item.currentEpisode);
                      setLanguage(item.language);
                      navigate('watch', item.mal_id);
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-nami-surface border border-nami-border hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-nami-muted">
                        EP {item.currentEpisode}{item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''} · {item.language.toUpperCase()}
                      </p>
                      {/* Progress bar */}
                      <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-nami-accent to-nami-accent-2 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-nami-muted flex-shrink-0">
                      {formatTimeAgo(item.lastWatched)}
                    </span>
                  </div>
                ))}
              </motion.div>
            </>
          ) : (
            <EmptyState
              icon={<Clock className="w-12 h-12" />}
              title="No watch history"
              subtitle="Start watching anime to build your history"
            />
          )}
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-nami-muted/30 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-nami-muted">{subtitle}</p>
  </div>
);

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
