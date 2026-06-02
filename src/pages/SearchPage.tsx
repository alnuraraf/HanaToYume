import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import { getTrendingAnime, getPopularAnime, getSeasonalAnime } from '../lib/api';
import { AnimeCard } from '../components/AnimeCard';
import { AnimeRow } from '../components/AnimeRow';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useStore, type AnimeBasic } from '../store/useStore';

export const SearchPage: React.FC = () => {
  const [trending, setTrending] = useState<AnimeBasic[]>([]);
  const [popular, setPopular] = useState<AnimeBasic[]>([]);
  const [seasonal, setSeasonal] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const setSearchOpen = useStore((s) => s.setSearchOpen);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const t = await getTrendingAnime();
        if (!cancelled) setTrending(t);
        setLoading(false);

        await new Promise((r) => setTimeout(r, 400));
        const p = await getPopularAnime();
        if (!cancelled) setPopular(p);

        await new Promise((r) => setTimeout(r, 400));
        const s = await getSeasonalAnime();
        if (!cancelled) setSeasonal(s);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-nami-bg pt-20 pb-20 md:pb-12">
      {/* Search prompt */}
      <div className="px-4 md:px-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-black text-white mb-4">
            Explore Anime
          </h1>
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full max-w-xl flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-nami-surface border border-nami-border hover:border-nami-accent/50 transition-colors text-left"
          >
            <Search className="w-5 h-5 text-nami-muted" />
            <span className="text-nami-muted">Search anime...</span>
            <kbd className="hidden md:inline-flex ml-auto text-[11px] text-nami-muted px-2 py-0.5 rounded bg-white/5 border border-white/10">
              Ctrl+K
            </kbd>
          </button>
        </motion.div>
      </div>

      {/* Trending grid */}
      <div className="px-4 md:px-12 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-nami-accent" />
          <h2 className="text-lg font-bold text-white">Trending Now</h2>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)
            : trending.slice(0, 12).map((a, i) => (
                <AnimeCard key={a.mal_id} anime={a} index={i} showRank />
              ))
          }
        </div>
      </div>

      {/* Rows */}
      <AnimeRow title="Most Popular" anime={popular} loading={popular.length === 0} />
      <AnimeRow title="This Season" anime={seasonal} loading={seasonal.length === 0} />
    </div>
  );
};
