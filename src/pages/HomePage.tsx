import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ChevronRight } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { AnimeRow } from '../components/AnimeRow';
import { BannerSkeleton } from '../components/ui/Skeleton';
import { LazyImage } from '../components/ui/LazyImage';
import { getTrendingAnime, getPopularAnime, getSeasonalAnime, getUpcomingAnime, getTopAnime } from '../lib/api';
import { useStore, type AnimeBasic, type WatchProgress } from '../store/useStore';

export const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<AnimeBasic[]>([]);
  const [popular, setPopular] = useState<AnimeBasic[]>([]);
  const [seasonal, setSeasonal] = useState<AnimeBasic[]>([]);
  const [upcoming, setUpcoming] = useState<AnimeBasic[]>([]);
  const [topRated, setTopRated] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(true);

  const watchHistory = useStore((s) => s.watchHistory);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        const trendingData = await getTrendingAnime();
        if (!cancelled) {
          setTrending(trendingData);
          setLoading(false);
        }

        // Load the rest with delays to avoid rate limit
        await new Promise((r) => setTimeout(r, 400));
        const popularData = await getPopularAnime();
        if (!cancelled) setPopular(popularData);

        await new Promise((r) => setTimeout(r, 400));
        const seasonalData = await getSeasonalAnime();
        if (!cancelled) setSeasonal(seasonalData);

        await new Promise((r) => setTimeout(r, 400));
        const topData = await getTopAnime(1, 25);
        if (!cancelled) setTopRated(topData.data || []);

        await new Promise((r) => setTimeout(r, 400));
        const upcomingData = await getUpcomingAnime();
        if (!cancelled) setUpcoming(upcomingData);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-nami-bg pb-20 md:pb-0">
      {/* Hero banner */}
      {loading ? (
        <BannerSkeleton />
      ) : (
        <HeroBanner anime={trending} />
      )}

      <div className="-mt-12 relative z-10">
        {/* Continue watching */}
        {watchHistory.length > 0 && (
          <ContinueWatchingRow history={watchHistory} />
        )}

        {/* Trending */}
        <AnimeRow title="Trending Now" anime={trending} loading={loading} />

        {/* This Season */}
        <AnimeRow title="This Season" anime={seasonal} loading={seasonal.length === 0 && !loading} />

        {/* Top Rated */}
        <AnimeRow title="Top Rated" anime={topRated} loading={topRated.length === 0 && !loading} showRank />

        {/* Popular */}
        <AnimeRow title="Most Popular" anime={popular} loading={popular.length === 0 && !loading} />

        {/* Upcoming */}
        <AnimeRow title="Upcoming" anime={upcoming} loading={upcoming.length === 0 && !loading} />

        {/* Because you watched section */}
        {watchHistory.length > 0 && trending.length > 0 && (
          <AnimeRow
            title={`Because You Watched ${watchHistory[0]?.title?.split(' ').slice(0, 3).join(' ')}...`}
            anime={[...trending].sort(() => Math.random() - 0.5).slice(0, 15)}
          />
        )}
      </div>
    </div>
  );
};

/* ─── Continue Watching Row ─── */
const ContinueWatchingRow: React.FC<{ history: WatchProgress[] }> = ({ history }) => {
  const navigate = useStore((s) => s.navigate);
  const setEpisode = useStore((s) => s.setEpisode);
  const setLanguage = useStore((s) => s.setLanguage);

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-center justify-between px-4 md:px-12 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-nami-accent" />
          Continue Watching
        </h2>
      </div>
      <div className="flex gap-3 md:gap-4 px-4 md:px-12 overflow-x-auto hide-scrollbar pb-2">
        {history.slice(0, 10).map((item, i) => (
          <motion.div
            key={item.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-shrink-0 w-[240px] md:w-[300px] cursor-pointer group"
            onClick={() => {
              setEpisode(item.currentEpisode);
              setLanguage(item.language);
              navigate('watch', item.mal_id);
            }}
          >
            <div className="relative rounded-xl overflow-hidden aspect-video shadow-lg">
              <LazyImage
                src={item.image}
                alt={item.title}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-gradient-to-r from-nami-accent to-nami-accent-2 rounded-full"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <p className="text-xs text-nami-muted">
                  EP {item.currentEpisode} {item.totalEpisodes ? `/ ${item.totalEpisodes}` : ''} · {item.language.toUpperCase()}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-nami-muted flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
