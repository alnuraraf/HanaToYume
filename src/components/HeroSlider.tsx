import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { AnimeData } from '../types/anime';
import { PlayIcon, StarIcon, InfoIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface Props {
  animeList: AnimeData[];
  loading?: boolean;
}

const HeroSlider: React.FC<Props> = ({ animeList, loading }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setTransitioning(false), 600);
  }, [transitioning]);

  const next = useCallback(() => {
    if (animeList.length === 0) return;
    goTo((current + 1) % animeList.length);
  }, [current, animeList.length, goTo]);

  const prev = useCallback(() => {
    if (animeList.length === 0) return;
    goTo(current === 0 ? animeList.length - 1 : current - 1);
  }, [current, animeList.length, goTo]);

  useEffect(() => {
    if (animeList.length <= 1) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, animeList.length]);

  if (loading) {
    return (
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] skeleton" />
    );
  }

  if (!animeList.length) return null;

  const anime = animeList[current];
  const bgImage = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          key={anime.mal_id}
          src={bgImage}
          alt=""
          className="w-full h-full object-cover object-center transition-opacity duration-700 scale-105 blur-sm brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/30" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl animate-fade-in" key={anime.mal_id}>
          {/* Badges */}
          <div className="flex items-center gap-3 mb-4">
            {anime.score && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                <StarIcon size={14} className="text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">{anime.score}</span>
              </div>
            )}
            {anime.type && (
              <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-sm font-medium text-indigo-300">
                {anime.type}
              </span>
            )}
            {anime.year && (
              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                {anime.year}
              </span>
            )}
            {anime.status === 'Currently Airing' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-sm text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Airing
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {anime.title_english || anime.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres?.slice(0, 4).map(g => (
              <span key={g.mal_id} className="px-3 py-1 rounded-full bg-white/5 text-sm text-gray-300">
                {g.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-gray-300 text-base leading-relaxed line-clamp-3 mb-6 max-w-xl">
            {anime.synopsis}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
            {anime.episodes && <span>{anime.episodes} Episodes</span>}
            {anime.duration && <span>{anime.duration}</span>}
            {anime.rating && <span>{anime.rating}</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to={`/watch/${anime.mal_id}/1`}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
            >
              <PlayIcon size={20} />
              Watch Now
            </Link>
            <Link
              to={`/anime/${anime.mal_id}`}
              className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/10"
            >
              <InfoIcon size={20} />
              Details
            </Link>
          </div>
        </div>

        {/* Side poster */}
        <div className="hidden lg:block absolute right-8 bottom-12">
          <div className="w-56 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 transition-transform duration-500 hover:scale-105">
            <img
              src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
              alt={anime.title}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white transition-all opacity-60 hover:opacity-100"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white transition-all opacity-60 hover:opacity-100"
      >
        <ChevronRightIcon size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {animeList.slice(0, 10).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-8 h-2 bg-indigo-500'
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
