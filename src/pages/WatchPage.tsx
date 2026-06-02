import React, { useEffect, useState, useRef, useCallback } from 'react';
// framer-motion available if needed
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2,
  SkipForward, ArrowLeft, Monitor
} from 'lucide-react';
import { getAnimeById, getAnimeRecommendations, getStreamUrl } from '../lib/api';
import { useStore, type AnimeBasic } from '../store/useStore';
import { AnimeRow } from '../components/AnimeRow';
import { Skeleton } from '../components/ui/Skeleton';

export const WatchPage: React.FC = () => {
  const [anime, setAnime] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<AnimeBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const episodeListRef = useRef<HTMLDivElement>(null);
  const currentEpRef = useRef<HTMLButtonElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const {
    currentAnimeId,
    currentEpisode,
    currentLanguage,
    isTheaterMode,
    setEpisode,
    setLanguage,
    setTheaterMode,
    navigate,
    addToWatchHistory,
  } = useStore();

  // Load anime data
  useEffect(() => {
    if (!currentAnimeId) return;
    setLoading(true);
    const load = async () => {
      try {
        const data = await getAnimeById(currentAnimeId);
        setAnime(data);
        setLoading(false);

        await new Promise((r) => setTimeout(r, 400));
        const recs = await getAnimeRecommendations(currentAnimeId);
        setRecommendations(recs.map((r: any) => r.entry));
      } catch (err) {
        console.error('Failed to load watch data:', err);
        setLoading(false);
      }
    };
    load();
  }, [currentAnimeId]);

  // Track watch progress
  useEffect(() => {
    if (!anime || !currentAnimeId) return;
    const image = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
    addToWatchHistory({
      mal_id: currentAnimeId,
      title: anime.title_english || anime.title,
      image,
      currentEpisode,
      totalEpisodes: anime.episodes || 0,
      language: currentLanguage,
      lastWatched: Date.now(),
      progress: anime.episodes ? Math.round((currentEpisode / anime.episodes) * 100) : 50,
    });
  }, [anime, currentEpisode, currentLanguage, currentAnimeId]);

  // Auto-scroll to current episode
  useEffect(() => {
    if (currentEpRef.current) {
      currentEpRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentEpisode, loading]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const totalEps = anime?.episodes || 1;
    switch (e.key.toLowerCase()) {
      case 'f':
        toggleFullscreen();
        break;
      case 't':
        setTheaterMode(!useStore.getState().isTheaterMode);
        break;
      case 'n':
        if (currentEpisode < totalEps) setEpisode(currentEpisode + 1);
        break;
      case 'p':
        if (currentEpisode > 1) setEpisode(currentEpisode - 1);
        break;
    }
  }, [anime, currentEpisode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nami-bg pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        <Skeleton className="w-full aspect-video rounded-2xl" />
        <div className="mt-4 space-y-2">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-1/3 h-4" />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center text-nami-muted">
        Failed to load anime
      </div>
    );
  }

  const title = anime.title_english || anime.title;
  const totalEps = anime.episodes || 24;
  const streamUrl = currentAnimeId ? getStreamUrl(currentAnimeId, currentEpisode, currentLanguage) : '';

  return (
    <div className="min-h-screen bg-nami-bg pb-20 md:pb-12">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-nami-border h-14 flex items-center px-4 md:px-8">
        <button
          onClick={() => navigate('anime', currentAnimeId)}
          className="flex items-center gap-2 text-sm text-nami-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Back to details</span>
        </button>
        <div className="flex-1 text-center">
          <p className="text-sm font-medium text-white truncate px-4">{title}</p>
          <p className="text-xs text-nami-muted">Episode {currentEpisode}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheaterMode(!isTheaterMode)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isTheaterMode ? 'bg-nami-accent/20 text-nami-accent' : 'bg-white/5 text-nami-muted hover:text-white'
            }`}
            title="Theater mode (T)"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`pt-14 ${isTheaterMode ? '' : 'max-w-7xl mx-auto px-0 md:px-8'}`}>
        <div className={`flex flex-col ${isTheaterMode ? '' : 'lg:flex-row'} gap-0 lg:gap-6`}>
          {/* Player area */}
          <div className={`${isTheaterMode ? 'w-full' : 'flex-1'}`}>
            {/* Video player */}
            <div
              ref={playerContainerRef}
              className={`relative bg-black ${isTheaterMode ? 'w-full' : 'rounded-none lg:rounded-2xl overflow-hidden'}`}
            >
              <iframe
                src={streamUrl}
                title={`${title} - Episode ${currentEpisode}`}
                className="player-iframe"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />

              {/* Player overlay controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentEpisode > 1 && setEpisode(currentEpisode - 1)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
                    disabled={currentEpisode <= 1}
                    title="Previous episode (P)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-white/70 px-2">EP {currentEpisode}/{totalEps}</span>
                  <button
                    onClick={() => currentEpisode < totalEps && setEpisode(currentEpisode + 1)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30"
                    disabled={currentEpisode >= totalEps}
                    title="Next episode (N)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => currentEpisode < totalEps && setEpisode(currentEpisode + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    Next
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                    title="Fullscreen (F)"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Player info bar */}
            <div className="px-4 md:px-0 mt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-white">{title}</h1>
                  <p className="text-sm text-nami-muted">
                    Episode {currentEpisode} {anime.episodes ? `of ${anime.episodes}` : ''}
                  </p>
                </div>

                {/* Language switcher */}
                <div className="flex items-center bg-nami-surface rounded-xl border border-nami-border overflow-hidden">
                  <button
                    onClick={() => setLanguage('sub')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      currentLanguage === 'sub'
                        ? 'bg-nami-accent text-white'
                        : 'text-nami-muted hover:text-white'
                    }`}
                  >
                    SUB
                  </button>
                  <button
                    onClick={() => setLanguage('dub')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      currentLanguage === 'dub'
                        ? 'bg-nami-accent text-white'
                        : 'text-nami-muted hover:text-white'
                    }`}
                  >
                    DUB
                  </button>
                </div>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="hidden md:flex items-center gap-4 text-[11px] text-nami-muted mb-4">
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">N</kbd> Next</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">P</kbd> Prev</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">F</kbd> Fullscreen</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">T</kbd> Theater</span>
              </div>
            </div>
          </div>

          {/* Episode list sidebar */}
          <div className={`${isTheaterMode ? 'max-w-7xl mx-auto px-4 md:px-8 w-full mt-4' : 'w-full lg:w-80'}`}>
            <div className="bg-nami-surface rounded-2xl border border-nami-border overflow-hidden">
              <div className="p-4 border-b border-nami-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Episodes</h3>
                <span className="text-xs text-nami-muted">{totalEps} total</span>
              </div>
              <div
                ref={episodeListRef}
                className={`overflow-y-auto ${isTheaterMode ? 'max-h-[300px]' : 'max-h-[400px] lg:max-h-[calc(100vh-200px)]'}`}
              >
                <div className={`p-2 ${isTheaterMode ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2' : 'space-y-1'}`}>
                  {Array.from({ length: totalEps }, (_, i) => {
                    const epNum = i + 1;
                    const isActive = epNum === currentEpisode;
                    return isTheaterMode ? (
                      <button
                        key={epNum}
                        ref={isActive ? currentEpRef : null}
                        onClick={() => setEpisode(epNum)}
                        className={`h-10 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-nami-accent to-nami-accent-2 text-white'
                            : 'bg-white/5 text-nami-muted hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {epNum}
                      </button>
                    ) : (
                      <button
                        key={epNum}
                        ref={isActive ? currentEpRef : null}
                        onClick={() => setEpisode(epNum)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-nami-accent/20 to-nami-accent-2/10 border border-nami-accent/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                          isActive
                            ? 'bg-nami-accent text-white'
                            : 'bg-white/5 text-nami-muted'
                        }`}>
                          {epNum}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isActive ? 'text-white font-medium' : 'text-nami-text'}`}>
                            Episode {epNum}
                          </p>
                          {isActive && (
                            <p className="text-[11px] text-nami-accent">Now Playing</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className={`mt-8 ${isTheaterMode ? '' : 'px-4 md:px-0'}`}>
            <AnimeRow title="Related Anime" anime={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
};
