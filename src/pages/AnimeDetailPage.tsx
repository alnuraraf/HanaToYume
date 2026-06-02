import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Bookmark, Heart, Star, Calendar, Film, Clock,
  ChevronDown, ChevronUp, X, ExternalLink
} from 'lucide-react';
import { getAnimeById, getAnimeRecommendations } from '../lib/api';
import { useStore, type AnimeBasic } from '../store/useStore';
import { LazyImage } from '../components/ui/LazyImage';
import { AnimeRow } from '../components/AnimeRow';
import { DetailSkeleton } from '../components/ui/Skeleton';

export const AnimeDetailPage: React.FC = () => {
  const [anime, setAnime] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const {
    currentAnimeId,
    navigate,
    toggleWatchlist,
    toggleFavorite,
    isInWatchlist,
    isFavorite,
    getWatchProgress,
  } = useStore();

  const inWatchlist = currentAnimeId ? isInWatchlist(currentAnimeId) : false;
  const inFavorites = currentAnimeId ? isFavorite(currentAnimeId) : false;
  const progress = currentAnimeId ? getWatchProgress(currentAnimeId) : undefined;

  useEffect(() => {
    if (!currentAnimeId) return;
    setLoading(true);
    setAnime(null);

    const load = async () => {
      try {
        const data = await getAnimeById(currentAnimeId);
        setAnime(data);
        setLoading(false);

        await new Promise((r) => setTimeout(r, 400));
        const recs = await getAnimeRecommendations(currentAnimeId);
        setRecommendations(recs.map((r: any) => r.entry));
      } catch (err) {
        console.error('Failed to load anime:', err);
        setLoading(false);
      }
    };
    load();
  }, [currentAnimeId]);

  if (loading) return <DetailSkeleton />;
  if (!anime) return (
    <div className="min-h-screen flex items-center justify-center text-nami-muted">
      Anime not found
    </div>
  );

  const title = anime.title_english || anime.title;
  const bgImage = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const coverImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
  const synopsis = anime.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim() || '';

  return (
    <div className="min-h-screen bg-nami-bg pb-20 md:pb-12">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nami-bg via-nami-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-nami-bg/80 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative -mt-[30vh] md:-mt-[35vh] z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 mx-auto md:mx-0"
          >
            <div className="w-48 md:w-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border-2 border-white/10">
              <LazyImage src={coverImage} alt={title} className="w-full aspect-[3/4]" />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 leading-tight">
              {title}
            </h1>

            {anime.title !== title && (
              <p className="text-sm text-nami-muted mb-3">{anime.title}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              {anime.score && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {anime.score}
                </span>
              )}
              {anime.type && (
                <MetaBadge icon={<Film className="w-3.5 h-3.5" />} text={anime.type} />
              )}
              {anime.episodes && (
                <MetaBadge icon={<Clock className="w-3.5 h-3.5" />} text={`${anime.episodes} Episodes`} />
              )}
              {anime.year && (
                <MetaBadge icon={<Calendar className="w-3.5 h-3.5" />} text={String(anime.year)} />
              )}
              {anime.status && (
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  anime.status === 'Currently Airing'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-white/5 text-nami-muted'
                }`}>
                  {anime.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {anime.genres?.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
                {anime.genres.map((g: any) => (
                  <span
                    key={g.mal_id}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-nami-text hover:border-nami-accent/50 transition-colors cursor-default"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <button
                onClick={() => {
                  if (progress) {
                    useStore.getState().setEpisode(progress.currentEpisode);
                    useStore.getState().setLanguage(progress.language);
                  }
                  navigate('watch', anime.mal_id);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-nami-accent to-nami-accent-2 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-nami-accent/30"
              >
                <Play className="w-5 h-5 fill-white" />
                {progress ? `Resume EP ${progress.currentEpisode}` : 'Watch Now'}
              </button>

              <button
                onClick={() => toggleWatchlist(anime.mal_id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                  inWatchlist
                    ? 'border-nami-accent bg-nami-accent/10 text-nami-accent'
                    : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${inWatchlist ? 'fill-nami-accent' : ''}`} />
                {inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>

              <button
                onClick={() => toggleFavorite(anime.mal_id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                  inFavorites
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-white/20 bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${inFavorites ? 'fill-red-500' : ''}`} />
              </button>

              {anime.trailer?.youtube_id && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Trailer
                </button>
              )}
            </div>

            {/* Studios */}
            {anime.studios?.length > 0 && (
              <p className="text-sm text-nami-muted mb-4">
                Studio: <span className="text-nami-text">{anime.studios.map((s: any) => s.name).join(', ')}</span>
              </p>
            )}

            {/* Synopsis */}
            {synopsis && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2">Synopsis</h3>
                <p className={`text-sm text-gray-400 leading-relaxed ${
                  !synopsisExpanded ? 'line-clamp-4' : ''
                }`}>
                  {synopsis}
                </p>
                {synopsis.length > 300 && (
                  <button
                    onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs text-nami-accent hover:text-nami-accent-2 transition-colors"
                  >
                    {synopsisExpanded ? (
                      <>Show less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                      <>Read more <ChevronDown className="w-3 h-3" /></>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Episode list preview */}
        {anime.episodes && anime.episodes > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {Array.from({ length: Math.min(anime.episodes, 50) }, (_, i) => {
                const epNum = i + 1;
                const isWatched = progress && progress.currentEpisode > epNum;
                const isCurrent = progress && progress.currentEpisode === epNum;
                return (
                  <button
                    key={epNum}
                    onClick={() => {
                      useStore.getState().setEpisode(epNum);
                      navigate('watch', anime.mal_id);
                    }}
                    className={`h-10 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-nami-accent to-nami-accent-2 text-white shadow-lg shadow-nami-accent/30'
                        : isWatched
                        ? 'bg-nami-accent/20 text-nami-accent border border-nami-accent/30'
                        : 'bg-white/5 text-nami-muted hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    {epNum}
                  </button>
                );
              })}
            </div>
            {anime.episodes > 50 && (
              <button
                onClick={() => navigate('watch', anime.mal_id)}
                className="mt-3 text-sm text-nami-accent hover:underline"
              >
                View all {anime.episodes} episodes
              </button>
            )}
          </motion.section>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <AnimeRow title="You Might Also Like" anime={recommendations} />
          </div>
        )}
      </div>

      {/* Trailer modal */}
      <AnimatePresence>
        {showTrailer && anime.trailer?.youtube_id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl aspect-video relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}?autoplay=1`}
                title="Trailer"
                className="w-full h-full rounded-2xl"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetaBadge: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 text-xs text-nami-muted">
    {icon}
    {text}
  </span>
);
