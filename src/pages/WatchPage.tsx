import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAnimeDetail, useAnimeEpisodes } from '../hooks/useAnime';
import { PlayIcon, ArrowLeftIcon, SkipForwardIcon, SkipBackIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, SearchIcon } from '../components/Icons';
import { addToWatchHistory, updateContinueWatching } from '../lib/store';
import { getStreamUrl } from '../lib/api';

const WatchPage: React.FC = () => {
  const { id, episode } = useParams<{ id: string; episode: string }>();
  const navigate = useNavigate();
  const animeId = parseInt(id || '0', 10);
  const episodeNum = parseInt(episode || '1', 10);

  const { anime, loading } = useAnimeDetail(animeId);
  const { episodes } = useAnimeEpisodes(animeId);
  const [language, setLanguage] = useState<'sub' | 'dub'>('sub');
  const [epSearch, setEpSearch] = useState('');
  const [epPage, setEpPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const totalEpisodes = anime?.episodes || episodes.length || 0;
  const hasNext = episodeNum < totalEpisodes;
  const hasPrev = episodeNum > 1;

  const streamUrl = getStreamUrl(animeId, episodeNum, language);

  // Record watch history
  useEffect(() => {
    if (anime) {
      const historyItem = {
        animeId,
        episode: episodeNum,
        timestamp: Date.now(),
        title: anime.title_english || anime.title,
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
        progress: totalEpisodes > 0 ? (episodeNum / totalEpisodes) * 100 : 0,
      };
      addToWatchHistory(historyItem);
      updateContinueWatching(historyItem);
    }
  }, [anime, animeId, episodeNum, totalEpisodes]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [episodeNum]);

  const goToEpisode = useCallback((ep: number) => {
    navigate(`/watch/${animeId}/${ep}`);
  }, [navigate, animeId]);

  const perPage = 50;
  const filteredEps = episodes.filter(ep =>
    !epSearch || ep.mal_id.toString().includes(epSearch) || (ep.title && ep.title.toLowerCase().includes(epSearch.toLowerCase()))
  );
  const pagedEps = filteredEps.slice(epPage * perPage, (epPage + 1) * perPage);
  const totalEpPages = Math.ceil(filteredEps.length / perPage);

  // Generate episode numbers if API doesn't return episodes
  const episodeList = episodes.length > 0
    ? pagedEps
    : Array.from({ length: Math.min(totalEpisodes || 24, 200) }, (_, i) => ({
        mal_id: i + 1,
        title: `Episode ${i + 1}`,
        filler: false,
        recap: false,
      }));

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-[#050508]">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:mr-[380px]' : ''}`}>
          {/* Top Bar */}
          <div className="flex items-center gap-4 px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
            <Link
              to={`/anime/${animeId}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon size={18} />
              <span className="text-sm hidden sm:inline">Back to Details</span>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">
                {anime?.title_english || anime?.title}
              </h1>
              <p className="text-xs text-gray-500">Episode {episodeNum}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? 'Hide' : 'Show'} Episodes
            </button>
          </div>

          {/* Video Player */}
          <div className="relative w-full bg-black">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                key={`${animeId}-${episodeNum}-${language}`}
                src={streamUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                frameBorder="0"
                title={`${anime?.title} Episode ${episodeNum}`}
              />
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-[#0a0a0f] border-b border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => hasPrev && goToEpisode(episodeNum - 1)}
                disabled={!hasPrev}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-30 transition-all"
              >
                <SkipBackIcon size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => hasNext && goToEpisode(episodeNum + 1)}
                disabled={!hasNext}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500/20 text-sm text-indigo-300 hover:bg-indigo-500/30 disabled:opacity-30 transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <SkipForwardIcon size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('sub')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  language === 'sub'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                SUB
              </button>
              <button
                onClick={() => setLanguage('dub')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  language === 'dub'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                DUB
              </button>
            </div>
          </div>

          {/* Episode Info */}
          <div className="px-4 sm:px-6 py-6">
            <div className="max-w-4xl">
              <div className="flex items-start gap-4 mb-6">
                {anime?.images?.jpg?.image_url && (
                  <Link to={`/anime/${animeId}`} className="shrink-0 hidden sm:block">
                    <img
                      src={anime.images.jpg.image_url}
                      alt=""
                      className="w-20 h-28 rounded-lg object-cover border border-white/10"
                    />
                  </Link>
                )}
                <div>
                  <Link to={`/anime/${animeId}`} className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">
                    {anime?.title_english || anime?.title}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">Episode {episodeNum} of {totalEpisodes || '?'}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {anime?.score && (
                      <div className="flex items-center gap-1">
                        <StarIcon size={14} className="text-yellow-400" />
                        <span className="text-sm text-yellow-400">{anime.score}</span>
                      </div>
                    )}
                    {anime?.genres?.slice(0, 3).map(g => (
                      <span key={g.mal_id} className="text-xs text-gray-500">{g.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              {anime?.synopsis && (
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{anime.synopsis}</p>
              )}
            </div>
          </div>

          {/* Mobile Episode List */}
          <div className="lg:hidden px-4 pb-8">
            <h3 className="text-lg font-bold text-white mb-4">Episodes</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[400px] overflow-y-auto">
              {episodeList.map(ep => {
                const epNum = ep.mal_id;
                return (
                  <button
                    key={epNum}
                    onClick={() => goToEpisode(epNum)}
                    className={`py-3 rounded-lg text-sm font-medium transition-all ${
                      epNum === episodeNum
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {epNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Episode List */}
        {sidebarOpen && (
          <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-[380px] bg-[#0a0a0f] border-l border-white/5 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white mb-3">Episodes</h3>
              {(episodes.length > 12 || totalEpisodes > 12) && (
                <div className="relative">
                  <input
                    type="text"
                    value={epSearch}
                    onChange={e => { setEpSearch(e.target.value); setEpPage(0); }}
                    placeholder="Search episodes..."
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                  />
                  <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              )}
              {totalEpPages > 1 && (
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <button
                    onClick={() => setEpPage(Math.max(0, epPage - 1))}
                    disabled={epPage === 0}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeftIcon size={14} />
                  </button>
                  <span>Page {epPage + 1} / {totalEpPages}</span>
                  <button
                    onClick={() => setEpPage(Math.min(totalEpPages - 1, epPage + 1))}
                    disabled={epPage >= totalEpPages - 1}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronRightIcon size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {episodeList.map(ep => {
                const epNum = ep.mal_id;
                const isActive = epNum === episodeNum;
                return (
                  <button
                    key={epNum}
                    onClick={() => goToEpisode(epNum)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-left transition-all ${
                      isActive
                        ? 'bg-indigo-500/20 border border-indigo-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-indigo-500' : 'bg-white/5'
                    }`}>
                      {isActive ? (
                        <PlayIcon size={14} className="text-white" />
                      ) : (
                        <span className="text-xs font-bold text-gray-400">{epNum}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-300' : 'text-gray-300'}`}>
                        Episode {epNum}
                      </p>
                      {ep.title && ep.title !== `Episode ${epNum}` && (
                        <p className="text-xs text-gray-500 truncate">{ep.title}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;
