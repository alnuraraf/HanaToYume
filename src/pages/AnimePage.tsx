import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnimeDetail, useAnimeEpisodes } from '../hooks/useAnime';
import { PlayIcon, StarIcon, HeartIcon, BookmarkIcon, ArrowLeftIcon, ClockIcon } from '../components/Icons';
import { toggleFavorite, isFavorite, toggleWatchlist, isInWatchlist } from '../lib/store';
import * as api from '../lib/api';
import type { AnimeData } from '../types/anime';
import AnimeCard from '../components/AnimeCard';

const AnimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id || '0', 10);
  const { anime, loading, error } = useAnimeDetail(animeId);
  const { episodes, loading: epsLoading } = useAnimeEpisodes(animeId);
  const [fav, setFav] = useState(false);
  const [watchlisted, setWatchlisted] = useState(false);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [recommendations, setRecommendations] = useState<AnimeData[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setFav(isFavorite(animeId));
    setWatchlisted(isInWatchlist(animeId));
  }, [animeId]);

  useEffect(() => {
    if (animeId) {
      setTimeout(() => {
        api.getAnimeRecommendations(animeId).then(res => {
          const recs = (res.data || []).slice(0, 12).map((r: { entry: AnimeData }) => r.entry);
          setRecommendations(recs);
        }).catch(() => {});
      }, 600);
    }
  }, [animeId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="h-[400px] skeleton" />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          <div className="flex gap-8">
            <div className="w-56 aspect-[3/4] skeleton rounded-2xl shrink-0" />
            <div className="flex-1 pt-8">
              <div className="h-10 skeleton rounded-lg w-96 mb-4" />
              <div className="h-4 skeleton rounded w-64 mb-6" />
              <div className="h-20 skeleton rounded-lg w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Anime not found</h2>
          <p className="text-gray-400 mb-6">{error || 'The requested anime could not be loaded.'}</p>
          <Link to="/" className="px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const bgImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  const handleToggleFav = () => {
    const result = toggleFavorite(animeId);
    setFav(result);
  };

  const handleToggleWatchlist = () => {
    const result = toggleWatchlist(animeId);
    setWatchlisted(result);
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-[450px] lg:h-[500px] overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover object-center blur-md brightness-30 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-20 left-4 sm:left-8 z-10 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <ArrowLeftIcon size={18} />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="w-52 lg:w-60 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img
                src={bgImage}
                alt={anime.title}
                className="w-full h-auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 w-52 lg:w-60">
              <button
                onClick={handleToggleFav}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  fav ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-red-400'
                }`}
              >
                <HeartIcon size={16} filled={fav} />
                {fav ? 'Loved' : 'Love'}
              </button>
              <button
                onClick={handleToggleWatchlist}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  watchlisted ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-indigo-400'
                }`}
              >
                <BookmarkIcon size={16} filled={watchlisted} />
                {watchlisted ? 'Listed' : 'List'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 lg:pt-8">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {anime.title_english || anime.title}
            </h1>
            {anime.title_japanese && (
              <p className="text-gray-500 text-sm mb-4">{anime.title_japanese}</p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {anime.score && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/20">
                  <StarIcon size={14} className="text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">{anime.score}</span>
                  {anime.scored_by && (
                    <span className="text-xs text-gray-500 ml-1">({(anime.scored_by / 1000).toFixed(0)}K)</span>
                  )}
                </div>
              )}
              {anime.rank && (
                <span className="px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-sm text-indigo-300">
                  Rank #{anime.rank}
                </span>
              )}
              {anime.type && (
                <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                  {anime.type}
                </span>
              )}
              {anime.status && (
                <span className={`px-3 py-1.5 rounded-full text-sm border ${
                  anime.status === 'Currently Airing'
                    ? 'bg-green-500/15 border-green-500/20 text-green-400'
                    : 'bg-white/5 border-white/10 text-gray-300'
                }`}>
                  {anime.status}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres?.map(g => (
                <span key={g.mal_id} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 transition-colors cursor-default">
                  {g.name}
                </span>
              ))}
              {anime.themes?.map(g => (
                <span key={g.mal_id} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
              <p className={`text-gray-400 text-sm leading-relaxed ${!showFullSynopsis ? 'line-clamp-3' : ''}`}>
                {anime.synopsis || 'No synopsis available.'}
              </p>
              {anime.synopsis && anime.synopsis.length > 300 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-indigo-400 text-sm mt-2 hover:text-indigo-300 transition-colors"
                >
                  {showFullSynopsis ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Episodes', value: anime.episodes || 'N/A' },
                { label: 'Duration', value: anime.duration || 'N/A' },
                { label: 'Source', value: anime.source || 'N/A' },
                { label: 'Season', value: anime.season ? `${anime.season} ${anime.year}` : 'N/A' },
                { label: 'Rating', value: anime.rating || 'N/A' },
                { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') || 'N/A' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Watch Button */}
            <Link
              to={`/watch/${animeId}/1`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
            >
              <PlayIcon size={20} />
              Start Watching
            </Link>
          </div>
        </div>

        {/* Episodes Section */}
        <div className="mt-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <ClockIcon size={22} className="text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Episodes</h2>
            {!epsLoading && episodes.length > 0 && (
              <span className="text-sm text-gray-500">({episodes.length} episodes)</span>
            )}
          </div>

          {epsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-xl" />
              ))}
            </div>
          ) : episodes.length > 0 ? (
            <EpisodeList episodes={episodes} animeId={animeId} />
          ) : (
            <div className="text-center py-12 bg-white/3 rounded-2xl border border-white/5">
              <p className="text-gray-400">No episodes available yet.</p>
              {anime.episodes && anime.episodes > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-w-3xl mx-auto px-4">
                  {Array.from({ length: Math.min(anime.episodes, 24) }).map((_, i) => (
                    <Link
                      key={i}
                      to={`/watch/${animeId}/${i + 1}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-sm text-gray-300 hover:text-white transition-all"
                    >
                      <PlayIcon size={14} />
                      EP {i + 1}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">You Might Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, idx) => (
                <AnimeCard key={rec.mal_id} anime={rec} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Episode List with search and pagination
const EpisodeList: React.FC<{ episodes: { mal_id: number; title: string | null; filler: boolean; recap: boolean }[]; animeId: number }> = ({ episodes, animeId }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const perPage = 50;

  const filtered = search
    ? episodes.filter(ep =>
        ep.mal_id.toString().includes(search) ||
        (ep.title && ep.title.toLowerCase().includes(search.toLowerCase()))
      )
    : episodes;

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div>
      {episodes.length > 12 && (
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search episodes..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="flex-1 max-w-xs px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          />
          {totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <span>{page + 1}/{totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {paged.map(ep => (
          <Link
            key={ep.mal_id}
            to={`/watch/${animeId}/${ep.mal_id}`}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
              ep.filler
                ? 'bg-orange-500/5 border-orange-500/10 hover:bg-orange-500/10'
                : ep.recap
                  ? 'bg-purple-500/5 border-purple-500/10 hover:bg-purple-500/10'
                  : 'bg-white/3 border-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/20'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-indigo-300">{ep.mal_id}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white line-clamp-1">
                {ep.title || `Episode ${ep.mal_id}`}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {ep.filler && <span className="text-xs text-orange-400">Filler</span>}
                {ep.recap && <span className="text-xs text-purple-400">Recap</span>}
              </div>
            </div>
            <PlayIcon size={16} className="text-gray-500 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AnimePage;
